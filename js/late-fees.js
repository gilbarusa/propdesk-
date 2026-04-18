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
  // Settings — singleton row in `late_fee_settings` (id=1).
  //
  // Controls the headless scheduler behavior entirely from the admin
  // UI, so you never have to touch the Cowork sidebar to turn the
  // job on/off or re-point SMS.
  // ─────────────────────────────────────────────────────────────────
  async function loadSettings(){
    const s = sb();
    if (!s) throw new Error('Supabase client unavailable');
    const { data, error } = await s
      .from('late_fee_settings')
      .select('enabled, sms_to, schedule_time, last_run_date, updated_at')
      .eq('id', 1)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    // maybeSingle returns null (not error) when the row is missing.
    if (!data) {
      return {
        enabled:       true,
        sms_to:        '2678650001',
        schedule_time: '00:01',
        last_run_date: null,
        updated_at:    null
      };
    }
    return data;
  }

  async function saveSettings(next){
    const s = sb();
    if (!s) throw new Error('Supabase client unavailable');
    const payload = {
      id:            1,
      enabled:       !!next.enabled,
      // Normalise phone to digits-only before persisting so the script
      // doesn't have to care about paren/dash/space cosmetics.
      sms_to:        String(next.sms_to || '').replace(/\D/g, ''),
      schedule_time: String(next.schedule_time || '00:01'),
      updated_at:    new Date().toISOString()
    };
    if (!/^\d{10,15}$/.test(payload.sms_to)) {
      throw new Error('SMS destination must be 10–15 digits (got "' + payload.sms_to + '")');
    }
    if (!/^\d{1,2}:\d{2}$/.test(payload.schedule_time)) {
      throw new Error('Schedule time must be HH:MM');
    }
    const { error } = await s.from('late_fee_settings').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return payload;
  }

  // Format a raw digit-string back into human (###) ###-#### form,
  // purely for display in the input.
  function _prettyPhone(digits){
    const d = String(digits || '').replace(/\D/g, '');
    if (d.length === 10) return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
    if (d.length === 11 && d[0] === '1') return '1 (' + d.slice(1,4) + ') ' + d.slice(4,7) + '-' + d.slice(7);
    return d;
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

    // ── Processing payments → pause late-fee accrual from initiation ──
    // Product rule (see recalc-late-fees.mjs for the canonical comment):
    // the earliest processing payment caps the chargeable window, even
    // if it doesn't fully cover the balance. Payments table may be
    // absent on pre-migration envs — we tolerate that quietly.
    const earliestProcessingByInv = new Map();   // invoice_id -> ISO ts
    try {
      const resp = await s
        .from('payments')
        .select('invoice_id, created_at')
        .eq('status', 'processing')
        .in('invoice_id', invIds);
      if (resp.error) {
        // 42P01 = relation does not exist; PGRST200 = schema cache miss
        if (resp.error.code !== '42P01' && resp.error.code !== 'PGRST200') {
          console.warn('[late-fees] processing payments fetch warn:', resp.error);
        }
      } else {
        for (const p of (resp.data || [])) {
          const prev = earliestProcessingByInv.get(p.invoice_id);
          if (!prev || p.created_at < prev) {
            earliestProcessingByInv.set(p.invoice_id, p.created_at);
          }
        }
      }
    } catch (e) {
      console.warn('[late-fees] processing payments fetch error:', (e && e.message) || e);
    }

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

      // Cap the chargeable window at the earliest processing payment.
      // Date-only granularity: a payment initiated at noon still credits
      // the whole calendar day to the tenant. Only shrinks the window.
      const earliestProcessingIso = earliestProcessingByInv.get(inv.id) || null;
      let effectiveEnd = today;
      let pausedAt = null;
      if (earliestProcessingIso) {
        const epMid = _toMidnight(earliestProcessingIso.slice(0, 10));
        if (epMid && epMid.getTime() < today.getTime()) {
          effectiveEnd = epMid;
          pausedAt = earliestProcessingIso.slice(0, 10);
        } else if (epMid) {
          pausedAt = earliestProcessingIso.slice(0, 10);
        }
      }

      const daysPastDue = _daysBetween(dueDate, effectiveEnd);
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
        paused_at: pausedAt,  // ISO date of earliest processing payment, or null
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
  // Preview modal — builds a table of proposed changes AND the
  // scheduler settings panel. One modal, one self-contained file.
  // ─────────────────────────────────────────────────────────────────
  function _openModal(plan, settings){
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
              <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${a.days_past_due} <span style="color:#6b7280;font-size:10px">(grace ${a.grace_days})</span>${a.paused_at ? `<div style="color:#b45309;font-size:10px;font-weight:600">paused ${_esc(a.paused_at)}</div>` : ''}</td>
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

    // Settings panel — "Automatic daily run" group at the top of the
    // modal. Pre-filled from the late_fee_settings row. Save writes
    // directly to Supabase; no live re-render is needed because the
    // values drive the headless script, not this preview.
    const lastRunLabel = settings && settings.last_run_date
      ? settings.last_run_date
      : '— never —';
    const settingsHtml = `
      <div style="margin-top:12px;padding:14px 16px;background:#f6f8fd;border:1px solid #d6def0;border-radius:6px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="font-size:13px;font-weight:600;color:#1a2874">Automatic daily run</div>
          <div style="font-size:11px;color:#6b7280">Last run: <b>${_esc(lastRunLabel)}</b></div>
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr auto 1fr;gap:10px 14px;align-items:center;font-size:12px;color:#374151">
          <label style="font-weight:600">Enabled</label>
          <div>
            <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" id="wpaLfsEnabled" ${settings && settings.enabled ? 'checked' : ''} style="width:16px;height:16px">
              <span id="wpaLfsEnabledLbl" style="color:${settings && settings.enabled ? '#2e7d32' : '#b23a48'};font-weight:600">
                ${settings && settings.enabled ? 'On — scheduled sweep runs daily' : 'Off — scheduled sweep is paused'}
              </span>
            </label>
          </div>

          <label style="font-weight:600">Run at</label>
          <div>
            <input type="time" id="wpaLfsTime" value="${_esc((settings && settings.schedule_time) || '00:01')}"
              style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:4px;font-size:12px;width:120px">
            <span style="color:#6b7280;font-size:11px;margin-left:6px">local time</span>
          </div>

          <label style="font-weight:600">SMS to</label>
          <div style="grid-column:span 3">
            <input type="tel" id="wpaLfsPhone"
              value="${_esc(_prettyPhone((settings && settings.sms_to) || ''))}"
              placeholder="(###) ###-####"
              style="padding:5px 8px;border:1px solid #cbd5e1;border-radius:4px;font-size:12px;width:220px">
            <span id="wpaLfsSaveStatus" style="font-size:11px;margin-left:10px;color:#6b7280"></span>
            <button id="wpaLfsSaveBtn" style="margin-left:10px;padding:5px 12px;border:none;background:#1a2874;border-radius:4px;color:#fff;cursor:pointer;font-size:12px;font-weight:600">Save settings</button>
          </div>
        </div>
        <div style="margin-top:10px;padding-top:10px;border-top:1px dashed #d6def0;font-size:11px;color:#6b7280;line-height:1.5">
          The scheduler heartbeat fires every 30 minutes. The script only acts
          when <i>Enabled</i> is on, the current time is past <i>Run at</i>, and
          it hasn't already run today. Changes here take effect on the next heartbeat.
        </div>
      </div>`;

    const html = `
      <div id="wpaLateFeeModal" style="position:fixed;inset:0;background:rgba(20,26,50,0.55);display:flex;align-items:center;justify-content:center;z-index:10000">
        <div style="background:#fff;border-radius:8px;max-width:900px;width:90%;max-height:85vh;overflow:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <h2 style="margin:0;color:#1a2874;font-size:18px">Recalculate Late Fees</h2>
            <button onclick="document.getElementById('wpaLateFeeModal').remove()" style="border:none;background:none;font-size:22px;color:#6b7280;cursor:pointer;padding:0 6px">×</button>
          </div>
          ${settingsHtml}
          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb">
            <div style="font-size:13px;font-weight:600;color:#1a2874;margin-bottom:6px">Run now — preview</div>
            <div style="font-size:13px;color:#374151;line-height:1.6">
              Scanned <b>${plan.scanned}</b> invoice${plan.scanned===1?'':'s'} past due.
              <b>${plan.totals.inserts}</b> new, <b>${plan.totals.updates}</b> updated,
              <b>${plan.totals.deletes}</b> removed.
              Net total change: <b style="color:${plan.totals.totalDelta>=0?'#2e7d32':'#b23a48'}">${(plan.totals.totalDelta>=0?'+':'') + _money(plan.totals.totalDelta).replace('$','$')}</b>
            </div>
            ${tableHtml}
            ${errHtml}
          </div>
          <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
            <button onclick="document.getElementById('wpaLateFeeModal').remove()" style="padding:8px 16px;border:1px solid #cbd5e1;background:#fff;border-radius:4px;color:#374151;cursor:pointer;font-size:13px">Close</button>
            <button id="wpaLateFeeApplyBtn" ${rows.length === 0 ? 'disabled' : ''} style="padding:8px 16px;border:none;background:${rows.length?'#1a2874':'#cbd5e1'};border-radius:4px;color:#fff;cursor:${rows.length?'pointer':'not-allowed'};font-size:13px;font-weight:600">${rows.length ? 'Apply changes now' : 'Nothing to apply'}</button>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    // ── Settings panel wiring ──────────────────────────────────────
    const enabledChk = document.getElementById('wpaLfsEnabled');
    const enabledLbl = document.getElementById('wpaLfsEnabledLbl');
    const timeInp    = document.getElementById('wpaLfsTime');
    const phoneInp   = document.getElementById('wpaLfsPhone');
    const saveBtn    = document.getElementById('wpaLfsSaveBtn');
    const statusLbl  = document.getElementById('wpaLfsSaveStatus');

    if (enabledChk && enabledLbl) {
      enabledChk.addEventListener('change', function(){
        enabledLbl.textContent = enabledChk.checked
          ? 'On — scheduled sweep runs daily'
          : 'Off — scheduled sweep is paused';
        enabledLbl.style.color = enabledChk.checked ? '#2e7d32' : '#b23a48';
      });
    }
    // Live-reformat phone on blur so the input always stays readable.
    if (phoneInp) {
      phoneInp.addEventListener('blur', function(){
        phoneInp.value = _prettyPhone(phoneInp.value);
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', async function(){
        saveBtn.disabled = true;
        const prevTxt = saveBtn.textContent;
        saveBtn.textContent = 'Saving…';
        statusLbl.textContent = '';
        statusLbl.style.color = '#6b7280';
        try {
          const saved = await saveSettings({
            enabled:       enabledChk.checked,
            sms_to:        phoneInp.value,
            schedule_time: timeInp.value
          });
          statusLbl.textContent = 'Saved ✓';
          statusLbl.style.color = '#2e7d32';
          // Reflect normalised value back into the input so the user
          // sees exactly what's stored.
          phoneInp.value = _prettyPhone(saved.sms_to);
          if (typeof window.toast === 'function') {
            window.toast('Late-fee settings saved');
          }
        } catch (e) {
          statusLbl.textContent = (e && e.message) || String(e);
          statusLbl.style.color = '#b23a48';
          console.error('[late-fees] save settings error:', e);
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = prevTxt;
          setTimeout(function(){ if (statusLbl.textContent === 'Saved ✓') statusLbl.textContent = ''; }, 3000);
        }
      });
    }

    // ── Apply button (existing behavior) ───────────────────────────
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
      // Kick off plan + settings in parallel — both are independent
      // round-trips and the modal needs both before rendering.
      const [plan, settings] = await Promise.all([
        computePlan(),
        loadSettings().catch(function(e){
          console.warn('[late-fees] settings load failed, using defaults:', e);
          return {
            enabled: true,
            sms_to: '',
            schedule_time: '00:01',
            last_run_date: null
          };
        })
      ]);
      if (opts.dryRun === false) {
        // Headless apply — used by the future scheduled task. Skips
        // the modal entirely.
        return await applyPlan(plan);
      }
      _openModal(plan, settings);
      return plan;
    } catch (e) {
      console.error('[late-fees] computePlan error:', e);
      alert('Error computing late fees: ' + ((e && e.message) || String(e)));
      throw e;
    }
  };

  // Named exports for debugging / scheduler use.
  window.WPA_lateFees = {
    computePlan:  computePlan,
    applyPlan:    applyPlan,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    ACCRUAL_DESCRIPTION: ACCRUAL_DESCRIPTION
  };
})();
