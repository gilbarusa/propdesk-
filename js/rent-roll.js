// ═══════════════════════════════════════════════════════════════════
// rent-roll.js — live current-month rent roll (replaces INNAGO_RENT mock)
// ═══════════════════════════════════════════════════════════════════
// WHY
//   For years the admin MTM dashboard and several tenant/lease drill-
//   downs have read a 33-row hardcoded `INNAGO_RENT` array in app.js.
//   That worked for demo data but never reflected reality — new units,
//   new leases, new payments never appeared. This module:
//     1) fetches the live current-month rent invoices from Supabase,
//     2) pulls in-flight payments (payments.status='processing'),
//     3) joins tenant names from the already-hydrated INNAGO_TENANTS,
//     4) shapes rows with the EXACT same keys the mock uses, and
//     5) mutates window.INNAGO_RENT in place so the existing 49 call
//        sites keep working without a find-and-replace spree.
//
// SCOPE (per product decision)
//   - Rent-only: we filter to invoices that carry at least one line
//     with kind='rent'. Standalone deposit / last-month / one-time
//     charges are deliberately excluded from the roll.
//   - Current month only: period_month = first-of-current-month.
//     No period picker; if later we need history, add then.
//   - Real data only: a unit with no current-month rent invoice is
//     simply not in the roll. We do NOT fabricate a row.
//   - Fetch once per dashboard load/navigation. No live refresh loop.
//
// STATUS TAXONOMY (matches the mock's vocabulary)
//   paid       : paid >= total
//   processing : (paid + processing) >= total AND processing > 0
//   overdue    : due_date < today AND paid < total
//   partial    : paid > 0 AND paid < total (not yet overdue)
//   pending    : due_date >= today AND paid = 0
//
//   The `processing` status takes precedence over `overdue` ONLY when
//   in-flight payments fully cover the gap. A partial processing
//   payment doesn't hide the invoice's overdue state — but the
//   late-fee sweep still pauses accrual from initiation time (handled
//   in late-fees.js / recalc-late-fees.mjs as a separate concern).
// ═══════════════════════════════════════════════════════════════════

(function(){
  'use strict';

  // Hoist from app.js — SUPA_URL / SUPA_KEY are declared there with
  // `const`, so they're globals in the same execution scope.
  function _url(){ return (typeof SUPA_URL !== 'undefined') ? SUPA_URL : (window.CONFIG && window.CONFIG.SUPABASE_URL); }
  function _key(){ return (typeof SUPA_KEY !== 'undefined') ? SUPA_KEY : (window.CONFIG && window.CONFIG.SUPABASE_KEY); }

  function _headers(){
    var k = _key();
    return { apikey: k, Authorization: 'Bearer ' + k };
  }

  // First-of-current-month as "YYYY-MM-DD" in local time. `period_month`
  // is stored as a DATE in Postgres, which PostgREST compares as ISO
  // string — no timezone gymnastics needed.
  function _currentPeriodMonth(){
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    return y + '-' + m + '-01';
  }

  // Local "YYYY-MM-DD" today — used for overdue comparison.
  function _todayIso(){
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var da = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + da;
  }

  // Status derivation mirrors the mock's taxonomy. See file header.
  function _deriveStatus(total, paid, processing, dueDate, todayIso){
    var t = Number(total) || 0;
    var p = Number(paid) || 0;
    var pr = Number(processing) || 0;
    if (p >= t) return 'paid';
    if (pr > 0 && (p + pr) >= t) return 'processing';
    if (dueDate && dueDate < todayIso && p < t) return 'overdue';
    if (p > 0 && p < t) return 'partial';
    return 'pending';
  }

  // Build "Tenant A, Tenant B" for a property|unit by walking the
  // already-hydrated INNAGO_TENANTS global. WPA_hydrateTenantsLT fires
  // before this module runs, so the array is populated. If it isn't
  // (rare), fall back to an empty string — no fake names.
  function _tenantsFor(property, unit){
    if (typeof INNAGO_TENANTS === 'undefined' || !Array.isArray(INNAGO_TENANTS)) return '';
    var matches = INNAGO_TENANTS.filter(function(t){
      return t && t.property === property && (t.unitNum === unit || t.unit === unit);
    });
    if (!matches.length) return '';
    return matches.map(function(t){ return t.name; }).filter(Boolean).join(', ');
  }

  // ─────────────────────────────────────────────────────────────────
  // Core fetch. Returns an array of rent-roll rows. Never throws —
  // on failure it logs and returns []. Callers that mutate
  // window.INNAGO_RENT can leave the array empty (per "no fake data").
  // ─────────────────────────────────────────────────────────────────
  async function fetchRentRoll(){
    var url = _url(), hdrs = _headers();
    if (!url) {
      console.warn('[rent-roll] no SUPABASE_URL available; returning empty roll');
      return [];
    }

    var period = _currentPeriodMonth();
    var todayIso = _todayIso();

    // 1) Current-month rent invoices. `invoice_lines!inner(id)` with
    //    `invoice_lines.kind=eq.rent` is a PostgREST embedded filter:
    //    INNER JOIN guarantees we only get invoices that carry at least
    //    one rent line. Standalone deposit / last-month / one-time
    //    invoices (no rent line) are filtered out for free.
    var invUrl = url + '/rest/v1/invoices'
      + '?select=id,tenant_id,property,unit,period_month,due_date,status,total,paid,notes,invoice_lines!inner(id,kind)'
      + '&period_month=eq.' + encodeURIComponent(period)
      + '&invoice_lines.kind=eq.rent'
      + '&status=in.(open,partial,paid)';   // void invoices never appear on the roll

    var invoices;
    try {
      var r = await fetch(invUrl, { headers: hdrs });
      if (!r.ok) {
        var txt = await r.text().catch(function(){ return ''; });
        throw new Error('invoices ' + r.status + ': ' + txt.slice(0, 200));
      }
      invoices = await r.json();
    } catch (e) {
      console.warn('[rent-roll] invoices fetch failed:', (e && e.message) || e);
      return [];
    }
    if (!Array.isArray(invoices) || !invoices.length) return [];

    // 2) Processing payments for those invoices (may be 0 rows while
    //    Stripe is in DEMO_MODE — that's expected and correct).
    var processingByInv = new Map();   // invoice_id -> sum(amount)
    try {
      var ids = invoices.map(function(i){ return i.id; });
      // PostgREST URL length can get big with many UUIDs; at 33-ish
      // rows it's still comfortably under 2k chars. Revisit if the
      // portfolio grows past ~1500 current-month rent invoices.
      var payUrl = url + '/rest/v1/payments'
        + '?select=invoice_id,amount,created_at'
        + '&status=eq.processing'
        + '&invoice_id=in.(' + ids.join(',') + ')';
      var pr = await fetch(payUrl, { headers: hdrs });
      if (pr.ok) {
        var payments = await pr.json();
        (payments || []).forEach(function(p){
          var prev = processingByInv.get(p.invoice_id) || 0;
          processingByInv.set(p.invoice_id, prev + (Number(p.amount) || 0));
        });
      } else if (pr.status === 404) {
        // No `payments` table yet — not a hard error; processing = 0.
        console.warn('[rent-roll] payments table 404; treating processing as 0');
      } else {
        console.warn('[rent-roll] payments fetch non-ok:', pr.status);
      }
    } catch (e) {
      console.warn('[rent-roll] payments fetch error:', (e && e.message) || e);
      // Don't fail the whole roll — just omit processing.
    }

    // 3) Shape. Preserve INNAGO_RENT's exact key contract so the 49
    //    call sites in app.js keep working untouched.
    var rows = invoices.map(function(inv){
      var processing = processingByInv.get(inv.id) || 0;
      var total = Number(inv.total) || 0;
      var paid = Number(inv.paid) || 0;
      var balance = Math.max(0, Math.round((total - paid) * 100) / 100);
      var status = _deriveStatus(total, paid, processing, inv.due_date, todayIso);
      return {
        property:   inv.property,
        unit:       inv.unit,
        tenants:    _tenantsFor(inv.property, inv.unit),
        amount:     total,
        paid:       Math.round(paid * 100) / 100,
        processing: Math.round(processing * 100) / 100,
        balance:    balance,
        status:     status,
        // ── extras not present in the mock but useful for drill-down ──
        invoice_id: inv.id,
        due_date:   inv.due_date,
        period_month: inv.period_month,
        tenant_id:  inv.tenant_id,
        notes:      inv.notes || ''
      };
    });

    return rows;
  }

  // ─────────────────────────────────────────────────────────────────
  // Hydrate window.INNAGO_RENT in place. app.js declares it as a `let`
  // so we mutate length + push rather than reassign — keeps references
  // held by cached renderers pointing at the same object.
  //
  // Returns true on success (even if the roll is empty — empty is a
  // valid real state), false if the fetch threw.
  // ─────────────────────────────────────────────────────────────────
  async function hydrateRentRoll(){
    if (typeof window.INNAGO_RENT === 'undefined' || !Array.isArray(window.INNAGO_RENT)) {
      // app.js should have initialized this to []. If not, bail loudly
      // — we don't want to silently create a new global that diverges
      // from the 49 call sites.
      console.error('[rent-roll] window.INNAGO_RENT is not an array; aborting hydrate');
      return false;
    }
    try {
      var rows = await fetchRentRoll();
      // In-place replace.
      window.INNAGO_RENT.length = 0;
      for (var i = 0; i < rows.length; i++) window.INNAGO_RENT.push(rows[i]);
      console.log('[rent-roll] hydrated', rows.length, 'current-month rent invoices for', _currentPeriodMonth());
      return true;
    } catch (e) {
      console.error('[rent-roll] hydrate error:', e);
      return false;
    }
  }

  // Public exports.
  window.WPA_hydrateRentRoll = hydrateRentRoll;
  window.WPA_rentRoll = {
    hydrate: hydrateRentRoll,
    fetch:   fetchRentRoll,
    currentPeriodMonth: _currentPeriodMonth
  };
})();
