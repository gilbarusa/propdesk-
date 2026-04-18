// ═══════════════════════════════════════════════════════════════════
// late-fees.js — on-demand late-fee accrual for overdue rent invoices
// ═══════════════════════════════════════════════════════════════════
// WHY
//   Step 4b wired grace_days + per_day_late_fee onto leases and exposed
//   them in the wizard and the LT lease body, but nothing actually
//   CREATES late-fee invoice_lines when a tenant is past due. This file
//   is the first cut — a manual sweep the admin runs from a button on
//   the Leases page. Once it's proved out, a daily scheduled task can
//   call the same function with dryRun=false.
//
// HOW
//   For every overdue, non-exempt, unpaid rent invoice:
//     days_past_due   = today − due_date              (calendar days)
//     chargeable_days = max(0, days_past_due − grace_days)
//     expected_fee    = chargeable_days × per_day_late_fee
//
//   Then we upsert ONE deterministic late_fee line per invoice, keyed
//   on description='Late fee accrual'. Any other late_fee lines an
//   admin added manually are left untouched.
//
// NOT HANDLED (yet)
//   - Daily scheduler — run this manually for now.
//   - Prorated first-month rent — anchor is still lease_start, and
//     MOVE_IN invoices are excluded from the sweep.
//   - Partial-payment fee discounts — we treat "late" as a binary
//     state, not a function of the remaining balance. Admin agreed.
// ═══════════════════════════════════════════════════════════════════

(function(){
  'use strict';

  // Canonical description — the idempotency key that distinguishes a
  // bot-managed late fee from an admin-entered one. DO NOT change this
  // string without migrating existing rows, or the next run will create
  // duplicates.
  const ACCRUAL_DESCRIPTION = 'Late fee accrual';

  // Tags in invoices.notes that opt an invoice OUT of late fees.
  // Both come from the generator — MOVE_IN on the 1st-month rent,
  // NO_LATE_FEE on standalone deposit + last-month invoices.
  const EXEMPT_TAGS = ['[MOVE_IN]', '[NO_LATE_FEE]'];

  // Match the global client pattern used by lease-wizard.js and the
  // rest of admin — the instance lives on one of a few aliases.
  function sb(){ return window.sb || window.supa || window.supabaseClient || null; }

  // Today at local midnight — invoices with due_date === today are NOT
  // late yet (user-confirmed: "chargeable from day 1 past due"). We
  // compare calendar days, not millisecond stamps, to avoid the
  // midnight/noon strict-equality bug that bit us on Step 4b.
  function _todayMidnight(){
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function _toMidnight(iso){
    if (!iso) return null;
    // Parse as local calendar date (not UTC). Supabase returns
    // "YYYY-MM-DD" so we anchor to T00:00 in the local tz.
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
    if (!m) return null;
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }

  function _daysBetween(a, b){
    // Whole calendar days from a → b (both at midnight). Integer.
    const ms = b.getTime() - a.getTime();
    return Math.round(ms / (24 * 60 * 60 * 1000));
  }

  function _isExempt(notes){
    if (!notes) return false;
    const n = String(notes);
    return EXEMPT_TAGS.some(tag => n.indexOf(tag) !== -1);
  }

  function _money(n){
    const v = Number(n) || 0;
    return '$' + v.toFixed(2);
  }

  // ─────────────────────────────────────────────────────────────────
  // Core: compute the plan (dry-run).
  //
  // Returns {
  //   scanned:   int   - how many invoices were considered
  //   eligible:  int   - how many survived filters + had a matching lease
  //   actions:   [ { invoice_id, property, unit, tenant, period, due_date,
  //                  days_past_due, chargeable_days, expected, existing,
  //                  action: 'insert'|'update'|'delete'|'noop',
  //                  delta } ]
  //   totals:    { inserts, updates, deletes, totalDelta }
  //   errors:    [ { invoice_id, reason } ]
  // }
  // ─────────────────────────────────────────────────────────────────
  async function computePlan(){
    const s = sb();
    if (!s) throw new Error('Supabase client unavailable');

    const today = _todayMidnight();
    // Cap how far back we sweep to avoid pulling the entire history.
    // 18 months is plenty — any past-due invoice older than that is
    // almost certainly closed/stale and shouldn't be re-accruing.
    const scanFloor = new Date(today.getFullYear(), today.getMonth() - 18, 1)
                         .toISOString().slice(0,10);
    const todayIso = today.toISOString().slice(0,10);

    // Pull candidate invoices. Cheap filter: status open|partial,
    // due_date in the past window. Precise exemption filtering happens
    // client-side because Supabase's .not('notes','like',...) chaining
    // with OR is awkward and we want a clear audit trail anyway.
    const { data: invoices, error: ie } = await s
      .from('invoices')
      .select('id, tenant_id, property, unit, period_month, due_date, status, total, paid, notes')
      .in('status', ['open', 'partial'])
      .lt('due_date', todayIso)
      .gte('due_date', scanFloor);
    if (ie) throw ie;

    const plan = {
      scanned: (invoices || []).length,
      eligible: 0,
      actions: [],
      totals: { inserts: 0, updates: 0, deletes: 0, totalDelta: 0 },
      errors: []
    };
    if (!invoices || !invoices.length) return plan;

    // Batch-fetch every relevant lease in one round-trip. We key by
    // (property, unit) since invoices don't carry lease_id.
    const keys = new Set(invoices.map(i => i.property + '|' + i.unit));
    const leaseMap = new Map(); // 'property|unit' -> { grace_days, per_day_late_fee }
    const { data: leases, error: le } = await s
      .from('leases')
      .select('property, unit, status, grace_days, per_day_late_fee')
      .order('created_at', { ascending: false });
    if (le) throw le;
    for (const L of (leases || [])) {
      const k = L.property + '|' + L.unit;
      if (!keys.has(k)) continue;
      // Prefer the most-recent signed/active lease; first-seen wins
      // because we ordered desc by created_at.
      if (!leaseMap.has(k)) leaseMap.set(k, L);
    }

    // Batch-fetch existing late-fee lines for every candidate invoice.
    const invIds = invoices.map(i => i.id);
    const { data: existingLines, error: lfe } = await s
      .from('invoice_lines')
      .select('id, invoice_id, kind, description, amount')
      .in('invoice_id', invIds)
      .eq('kind', 'late_fee')
      .eq('description', ACCRUAL_DESCRIPTION);
    if (lfe) throw lfe;
    const lineByInv = new Map();
    for (const L of (existingLines || [])) lineByInv.set(L.invoice_id, L);

    for (const inv of invoices) {
      if (_isExempt(inv.notes)) continue;

      const lease = leaseMap.get(inv.property + '|' + inv.unit);
      if (!lease) {
        plan.errors.push({ invoice_id: inv.id, reason: 'No matching lease for ' + inv.property + ' unit ' + inv.unit });
        continue;
      }
      const grace = parseInt(lease.grace_days, 10);
      const perDay = parseFloat(lease.per_day_late_fee);
      if (isNaN(grace) || isNaN(perDay)) {
        plan.errors.push({ invoice_id: inv.id, reason: 'Lease missing grace_days / per_day_late_fee' });
        continue;
      }

      const dueDate = _toMidnight(inv.due_date);
      if (!dueDate) {
        plan.errors.push({ invoice_id: inv.id, reason: 'Invalid due_date: ' + inv.due_date });
        continue;
      }

      const daysPastDue = _daysBetween(dueDate, today);
      const chargeable = Math.max(0, daysPastDue - grace);
      const expected = Math.round(chargeable * perDay * 100) / 100; // cents

      const existing = lineByInv.get(inv.id) || null;
      const existingAmt = existing ? Number(existing.amount) : 0;

      let action = 'noop';
      let delta = 0;
      if (expected > 0 && !existing) {
        action = 'insert';
        delta  = expected;
      } else if (expected > 0 && existing && Math.abs(existingAmt - expected) > 0.001) {
        action = 'update';
        delta  = expected - existingAmt;
      } else if (expected === 0 && existing) {
        action = 'delete';
        delta  = -existingAmt;
      }

      plan.eligible++;
      plan.actions.push({
        invoice_id: inv.id,
        property: inv.property,
        unit: inv.unit,
        period: inv.period_month,
        due_date: inv.due_date,
        days_past_due: daysPastDue,
        grace_days: grace,
        per_day_late_fee: perDay,
        chargeable_days: chargeable,
        expected: expected,
        existing_amount: existingAmt,
        existing_line_id: existing ? existing.id : null,
        invoice_total: Number(inv.total) || 0,
        action: action,
        delta: delta
      });

      if (action === 'insert') plan.totals.inserts++;
      else if (action === 'update') plan.totals.updates++;
      else if (action === 'delete') plan.totals.deletes++;
      plan.totals.totalDelta += delta;
    }

    return plan;
  }

  // ─────────────────────────────────────────────────────────────────
  // Apply a plan. Does NOT recompute — caller is expected to pass in
  // a recently-computed plan. Writes happen per-invoice so partial
  // failures don't abort the whole sweep.
  // ─────────────────────────────────────────────────────────────────
  async function applyPlan(plan){
    const s = sb();
    if (!s) throw new Error('Supabase client unavailable');

    const results = { ok: 0, failed: 0, errors: [] };

    for (const a of plan.actions) {
      if (a.action === 'noop') continue;
      try {
        if (a.action === 'insert') {
          // day_offset carries the "number of chargeable days" — the
          // admin invoice renderer shows it as quantity and computes
          // rate = amount/day_offset, so the line displays cleanly as
          // "6 days × $30.00/day = $180.00" instead of a flat total.
          const { error } = await s.from('invoice_lines').insert({
            invoice_id:  a.invoice_id,
            kind:        'late_fee',
            description: ACCRUAL_DESCRIPTION,
            amount:      a.expected,
            day_offset:  a.chargeable_days,
            created_by:  'system:late-fee-accrual'
          });
          if (error) throw error;
        } else if (a.action === 'update') {
          // Keep amount and day_offset in lockstep so the renderer's
          // implied per-day rate stays correct on re-runs.
          const { error } = await s.from('invoice_lines')
            .update({ amount: a.expected, day_offset: a.chargeable_days })
            .eq('id', a.existing_line_id);
          if (error) throw error;
        } else if (a.action === 'delete') {
          const { error } = await s.from('invoice_lines')
            .delete()
            .eq('id', a.existing_line_id);
          if (error) throw error;
        }

        // Keep invoices.total in sync with sum(lines). Simpler and more
        // robust than computing a delta: re-read every line for this
        // invoice and write the sum back.
        const { data: lines, error: le } = await s
          .from('invoice_lines')
          .select('amount')
          .eq('invoice_id', a.invoice_id);
        if (le) throw le;
        const newTotal = (lines || []).reduce((s, L) => s + (Number(L.amount) || 0), 0);
        const { error: ue } = await s.from('invoices')
          .update({ total: Math.round(newTotal * 100) / 100 })
          .eq('id', a.invoice_id);
        if (ue) throw ue;

        results.ok++;
      } catch (e) {
        results.failed++;
        results.errors.push({ invoice_id: a.invoice_id, reason: (e && e.message) || String(e) });
      }
    }
    return results;
  }

  // ─────────────────────────────────────────────────────────────────
  // Preview modal — builds a table of proposed changes and wires the
  // Apply button. Kept inline so this is one self-contained file.
  // ─────────────────────────────────────────────────────────────────
  function _openModal(plan){
    const existing = document.getElementById('wpaLateFeeModal');
    if (existing) existing.remove();

    const rows = plan.actions
      .filter(a => a.action !== 'noop')
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    const actColor = {
      insert: '#2e7d32',
      update: '#1a2874',
      delete: '#b23a48'
    };

    const tableHtml = rows.length ? `
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:10px">
        <thead>
          <tr style="background:#eef1f8;color:#1a2874">
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #d6def0">Property / Unit</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #d6def0">Due</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #d6def0">Days late</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #d6def0">Expected</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #d6def0">Existing</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #d6def0">Δ</th>
            <th style="text-align:center;padding:6px 8px;border-bottom:1px solid #d6def0">Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(a => `
            <tr>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${_esc(a.property)} · ${_esc(a.unit)}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${_esc(a.due_date)}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${a.days_past_due} <span style="color:#6b7280;font-size:10px">(grace ${a.grace_days})</span></td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${_money(a.expected)}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${_money(a.existing_amount)}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right;color:${a.delta>=0?'#2e7d32':'#b23a48'};font-weight:600">${(a.delta>=0?'+':'') + _money(a.delta).replace('$','$')}</td>
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center;color:${actColor[a.action]||'#333'};font-weight:600;text-transform:uppercase;font-size:10px">${a.action}</td>
            </tr>`).join('')}
        </tbody>
      </table>` : '<div style="padding:20px;text-align:center;color:#6b7280">No changes needed. All overdue invoices already have the correct late fee.</div>';

    const errHtml = (plan.errors && plan.errors.length) ? `
      <div style="margin-top:10px;padding:8px 10px;background:#fef3c7;border:1px solid #f5c16c;border-radius:4px;font-size:11px;color:#7a4a00">
        <b>${plan.errors.length} invoice${plan.errors.length===1?'':'s'} skipped:</b>
        <ul style="margin:4px 0 0 16px;padding:0">
          ${plan.errors.slice(0,10).map(e => `<li>${_esc(e.invoice_id.slice(0,8))}… — ${_esc(e.reason)}</li>`).join('')}
          ${plan.errors.length>10 ? `<li>… and ${plan.errors.length - 10} more</li>` : ''}
        </ul>
      </div>` : '';

    const html = `
      <div id="wpaLateFeeModal" style="position:fixed;inset:0;background:rgba(20,26,50,0.55);display:flex;align-items:center;justify-content:center;z-index:10000">
        <div style="background:#fff;border-radius:8px;max-width:900px;width:90%;max-height:85vh;overflow:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <h2 style="margin:0;color:#1a2874;font-size:18px">Recalculate Late Fees — Preview</h2>
            <button onclick="document.getElementById('wpaLateFeeModal').remove()" style="border:none;background:none;font-size:22px;color:#6b7280;cursor:pointer;padding:0 6px">×</button>
          </div>
          <div style="font-size:13px;color:#374151;line-height:1.6">
            Scanned <b>${plan.scanned}</b> invoice${plan.scanned===1?'':'s'} past due.
            <b>${plan.totals.inserts}</b> new, <b>${plan.totals.updates}</b> updated,
            <b>${plan.totals.deletes}</b> removed.
            Net total change: <b style="color:${plan.totals.totalDelta>=0?'#2e7d32':'#b23a48'}">${(plan.totals.totalDelta>=0?'+':'') + _money(plan.totals.totalDelta).replace('$','$')}</b>
          </div>
          ${tableHtml}
          ${errHtml}
          <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
            <button onclick="document.getElementById('wpaLateFeeModal').remove()" style="padding:8px 16px;border:1px solid #cbd5e1;background:#fff;border-radius:4px;color:#374151;cursor:pointer;font-size:13px">Cancel</button>
            <button id="wpaLateFeeApplyBtn" ${rows.length === 0 ? 'disabled' : ''} style="padding:8px 16px;border:none;background:${rows.length?'#1a2874':'#cbd5e1'};border-radius:4px;color:#fff;cursor:${rows.length?'pointer':'not-allowed'};font-size:13px;font-weight:600">${rows.length ? 'Apply changes' : 'Nothing to apply'}</button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const applyBtn = document.getElementById('wpaLateFeeApplyBtn');
    if (applyBtn && rows.length) {
      applyBtn.onclick = async function(){
        applyBtn.disabled = true;
        applyBtn.textContent = 'Applying…';
        try {
          const res = await applyPlan(plan);
          document.getElementById('wpaLateFeeModal').remove();
          const msg = 'Late fees applied: ' + res.ok + ' succeeded'
                    + (res.failed ? (', ' + res.failed + ' failed') : '')
                    + '.';
          if (typeof window.toast === 'function') window.toast(msg);
          else alert(msg);
          if (res.failed) console.warn('[late-fees] failures:', res.errors);
          if (typeof window.LeasesView !== 'undefined' && typeof window.LeasesView.refresh === 'function') {
            window.LeasesView.refresh();
          }
        } catch (e) {
          console.error('[late-fees] apply error:', e);
          alert('Error applying late fees: ' + ((e && e.message) || String(e)));
          applyBtn.disabled = false;
          applyBtn.textContent = 'Apply changes';
        }
      };
    }
  }

  function _esc(v){ return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Public entrypoint. Called by the Leases admin toolbar button.
  window.WPA_recalcLateFees = async function(opts){
    opts = opts || {};
    try {
      const plan = await computePlan();
      if (opts.dryRun === false) {
        // Headless apply — used by the future scheduled task. Skips
        // the modal entirely.
        return await applyPlan(plan);
      }
      _openModal(plan);
      return plan;
    } catch (e) {
      console.error('[late-fees] computePlan error:', e);
      alert('Error computing late fees: ' + ((e && e.message) || String(e)));
      throw e;
    }
  };

  // Named exports for debugging / scheduler use.
  window.WPA_lateFees = {
    computePlan: computePlan,
    applyPlan:   applyPlan,
    ACCRUAL_DESCRIPTION: ACCRUAL_DESCRIPTION
  };
})();
