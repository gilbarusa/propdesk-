#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// recalc-late-fees.mjs — headless late-fee accrual
// ═══════════════════════════════════════════════════════════════════
// WHAT
//   Port of the browser `WPA_recalcLateFees` logic in js/late-fees.js
//   to a standalone Node 18+ script with zero npm dependencies. Same
//   selection rules, same idempotent upsert, same description-keyed
//   line ("Late fee accrual").
//
// WHY
//   The admin button is great for verifying the math, but the real
//   workflow needs a daily sweep regardless of whether anyone has the
//   admin open. This script runs on a Cowork heartbeat every 30 min
//   and self-gates against `late_fee_settings` — enabled flag, target
//   HH:MM, last_run_date — so the admin UI alone owns the schedule.
//
// MODES
//   --scheduled  (default)  gated run — exit silently unless
//                           enabled=true AND now >= schedule_time
//                           AND last_run_date < today. On real runs
//                           it updates last_run_date to today.
//   --manual                ungated — always runs, always updates
//                           last_run_date. Used by CLI testing.
//
// OUTPUT
//   On real run:   prints JSON summary to stdout, SMS via Flowroute
//                  to settings.sms_to, exits 0 (or 1 on failures).
//   On gated skip: prints a one-liner to stdout, NO SMS, exits 0.
//   On error:      prints a 1-line error to stderr, tries to SMS a
//                  failure note, exits 1.
//
// CREDENTIALS
//   Supabase URL + anon key — copied from portal/index.html (public).
//   Flowroute creds         — copied from portal/config-…-0330.php.
//   Change both in ONE place (the top of this file) if they rotate.
// ═══════════════════════════════════════════════════════════════════

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://iwohrvkcodqvyoooxzmt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2hydmtjb2Rxdnlvb294em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTM3OTksImV4cCI6MjA4OTg2OTc5OX0.PhKo6XiXf-VTBWcYkhT_vfHi0ibftNmYaqm4RApxO6Y';

const FLOWROUTE_ACCESS_KEY = 'cb4e6973';
const FLOWROUTE_SECRET_KEY = '4e1b842dc0984a04b5b77582c0afef72';
const FLOWROUTE_FROM       = '2678650150';   // digits only, no '+'

// Hard-coded fallbacks used only if the late_fee_settings row is
// missing (pre-migration bootstrap). Real values live in Supabase.
const FALLBACK_SMS_TO        = '2678650001';
const FALLBACK_SCHEDULE_TIME = '00:01';
const FALLBACK_ENABLED       = true;

// Idempotency key — ONLY invoice_lines rows whose description matches
// this exact string are managed by the script. Manual admin-created
// late_fee lines with other descriptions are preserved untouched.
const ACCRUAL_DESCRIPTION = 'Late fee accrual';

// Notes-tag opt-outs from the generator.
const EXEMPT_TAGS = ['[MOVE_IN]', '[NO_LATE_FEE]'];

// Sweep horizon — cap the scan to invoices due in the last 18 months.
// Older unpaid invoices are vanishingly rare and would slow the job.
const SCAN_MONTHS = 18;

// ── UTILS ─────────────────────────────────────────────────────────
const H = {
  apikey:        SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type':'application/json'
};

function todayMidnight(){
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDay(d){
  // YYYY-MM-DD in local time (not UTC — matches how Supabase stores
  // lease/invoice dates). Manual padding keeps Node-version-portable.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toMidnight(iso){
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!m) return null;
  return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
}

function daysBetween(a, b){
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

function isExempt(notes){
  if (!notes) return false;
  const n = String(notes);
  return EXEMPT_TAGS.some(t => n.indexOf(t) !== -1);
}

function money(n){
  const v = Number(n) || 0;
  return '$' + v.toFixed(2);
}

async function restFetch(path, init = {}){
  const res = await fetch(SUPABASE_URL + '/rest/v1' + path, {
    ...init,
    headers: { ...H, ...(init.headers || {}) }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase ${init.method || 'GET'} ${path} → ${res.status}: ${body.slice(0, 300)}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── CORE: plan ────────────────────────────────────────────────────
// Mirrors the browser `computePlan` in js/late-fees.js (v6 rule set).
//
// Rules:
//   1. Universal buffer: no late fee within (due + grace_days). Grace
//      is configured per-lease.
//   2. On-time full-amount ACH bonus: if the tenant initiated a single
//      ACH payment for >= originalAmount on or before (due + grace),
//      the effective grace becomes grace + 1 calendar days.
//   3. Pause: if that on-time full-amount ACH is currently in flight
//      (status = processing OR ach_processing), cap the chargeable
//      window at its initiation date.
//   4. Partial payments and late-initiated payments never earn bonus
//      or pause. Card payments are treated as instant and never pause.
//   5. Freeze: once sum(paid) >= originalAmount, late-fee accrual
//      stops permanently. Any existing late_fee line is kept as an
//      owed ledger item — we do NOT delete it. No fees on fees.
//
// `originalAmount` excludes existing late_fee lines so fees can never
// compound on themselves.
async function computePlan(){
  const today     = todayMidnight();
  const todayIso  = isoDay(today);
  const scanFloor = isoDay(new Date(today.getFullYear(), today.getMonth() - SCAN_MONTHS, 1));

  // Candidate invoices.
  // HOA-skip (lfee6c): rental sweep only. `or=` is URL-encoded manually
  // because PostgREST requires parenthesized boolean expressions and the
  // '&' inside a nested `or` would otherwise terminate the param. HOA
  // invoices (invoice_type='hoa') are handled by the Phase 2 sweep.
  // Rows with NULL invoice_type are included defensively — should be zero
  // after the Phase 1a backfill, but we don't want silent drops.
  const invoices = await restFetch(
    '/invoices' +
    '?select=id,tenant_id,property,unit,period_month,due_date,status,total,paid,notes,invoice_type' +
    '&status=in.(open,partial)' +
    '&or=' + encodeURIComponent('(invoice_type.eq.rent,invoice_type.is.null)') +
    '&due_date=lt.' + encodeURIComponent(todayIso) +
    '&due_date=gte.' + encodeURIComponent(scanFloor)
  );

  const plan = {
    scanned: invoices.length,
    eligible: 0,
    actions: [],
    totals: { inserts: 0, updates: 0, deletes: 0, totalDelta: 0 },
    errors: []
  };
  if (!invoices.length) return plan;

  // All leases — batch once, pick most-recent per (property, unit).
  // No filter because some overdue invoices may belong to past leases.
  const leases = await restFetch(
    '/leases?select=property,unit,status,grace_days,per_day_late_fee&order=created_at.desc'
  );
  const leaseByKey = new Map();
  for (const L of (leases || [])) {
    const k = L.property + '|' + L.unit;
    if (!leaseByKey.has(k)) leaseByKey.set(k, L); // first-seen wins (most recent)
  }

  // Fetch ALL invoice_lines for every candidate invoice — we need both
  // the existing canonical late-fee line AND the sum of non-late-fee
  // lines (originalAmount) in a single round-trip. PostgREST has a URL
  // length cap; chunk if we ever exceed ~2k candidate IDs.
  const invIds = invoices.map(i => i.id);
  const allLines = await restFetch(
    '/invoice_lines' +
    '?select=id,invoice_id,kind,description,amount' +
    '&invoice_id=in.(' + invIds.join(',') + ')'
  );

  // linesByInv[invoice_id] = { original: number, existingLateFee: row|null }
  // `original` sums every non-late-fee line — rent, deposit, credits
  // (negative), service, parking, etc. Late fees explicitly excluded
  // so the engine never compounds them ("no late fees on late fees").
  const linesByInv = new Map();
  for (const L of (allLines || [])) {
    let entry = linesByInv.get(L.invoice_id);
    if (!entry) {
      entry = { original: 0, existingLateFee: null };
      linesByInv.set(L.invoice_id, entry);
    }
    if (L.kind === 'late_fee') {
      // Only the canonical bot-managed line is touched by the engine.
      // Manual admin-entered late-fee lines (any other description) are
      // preserved untouched and are excluded from `original` so they
      // never feed back into the next accrual cycle.
      if (L.description === ACCRUAL_DESCRIPTION && !entry.existingLateFee) {
        entry.existingLateFee = L;
      }
    } else {
      entry.original += Number(L.amount) || 0;
    }
  }

  // Fetch ALL payments for every candidate invoice. The new rules care
  // about: what's paid (status=paid|succeeded), what's in flight
  // (processing|ach_processing), and WHEN each payment was initiated
  // (created_at) — to determine on-time vs late.
  //
  // Error handling: tolerate ONLY the "table doesn't exist" shapes from
  // pre-migration bootstrap environments (42P01 / 404). Any other
  // failure aborts the sweep — silently proceeding with an empty map
  // would cause the engine to charge spurious fees on invoices that
  // are actually paid or have an in-flight on-time ACH. Better to fail
  // loudly than to over-bill quietly.
  const paymentsByInv = new Map(); // invoice_id -> array of payments
  try {
    const pays = await restFetch(
      '/payments' +
      '?select=invoice_id,method,status,amount,created_at' +
      '&invoice_id=in.(' + invIds.join(',') + ')'
    );
    for (const p of (pays || [])) {
      let arr = paymentsByInv.get(p.invoice_id);
      if (!arr) { arr = []; paymentsByInv.set(p.invoice_id, arr); }
      arr.push(p);
    }
  } catch (e) {
    const msg = (e && e.message) || String(e);
    if (/payments/.test(msg) && (/42P01/.test(msg) || /404/.test(msg))) {
      console.error('[recalc-late-fees] payments table not present — pause/bonus/freeze logic disabled');
    } else {
      // Real error — re-raise so the sweep aborts and the scheduled
      // task alerts via the fatal SMS path.
      throw e;
    }
  }

  for (const inv of invoices) {
    if (isExempt(inv.notes)) continue;

    const lease = leaseByKey.get(inv.property + '|' + inv.unit);
    if (!lease) {
      plan.errors.push({ invoice_id: inv.id, reason: 'No lease for ' + inv.property + ' · ' + inv.unit });
      continue;
    }
    const grace  = parseInt(lease.grace_days, 10);
    const perDay = parseFloat(lease.per_day_late_fee);
    if (Number.isNaN(grace) || Number.isNaN(perDay)) {
      plan.errors.push({ invoice_id: inv.id, reason: 'Lease missing grace_days / per_day_late_fee' });
      continue;
    }

    const dueDate = toMidnight(inv.due_date);
    if (!dueDate) {
      plan.errors.push({ invoice_id: inv.id, reason: 'Invalid due_date: ' + inv.due_date });
      continue;
    }

    // ── Derived invoice state ────────────────────────────────────────
    const linesEntry = linesByInv.get(inv.id) || { original: 0, existingLateFee: null };
    const originalAmount = Math.round(linesEntry.original * 100) / 100;
    const existing = linesEntry.existingLateFee;
    const existingAmt = existing ? Number(existing.amount) : 0;

    const pays = paymentsByInv.get(inv.id) || [];
    const paidSum = pays
      .filter(p => p.status === 'paid' || p.status === 'succeeded')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const paidSumRounded = Math.round(paidSum * 100) / 100;

    // Grace-end day: the last calendar day still INSIDE grace.
    // Example: due 1/1, grace 3 → grace-end = 1/4 (days 1/2, 1/3, 1/4).
    // "On-time" payment = initiated on or before this day.
    const graceEndDate = new Date(dueDate.getTime());
    graceEndDate.setDate(graceEndDate.getDate() + grace);

    // ── Rule 5: Freeze if original fully paid ────────────────────────
    // Once sum(paid) >= original (non-late-fee lines), late fees stop
    // accruing permanently. Any already-accrued late_fee line stays
    // on the ledger as an owed item — we do NOT delete it.
    if (originalAmount > 0.005 && paidSumRounded >= originalAmount - 0.005) {
      plan.eligible++;
      plan.actions.push({
        invoice_id: inv.id,
        property: inv.property,
        unit: inv.unit,
        period: inv.period_month,
        due_date: inv.due_date,
        days_past_due: daysBetween(dueDate, today),
        grace_days: grace,
        grace_offset: grace,
        per_day_late_fee: perDay,
        chargeable_days: 0,
        expected: existingAmt,         // frozen at whatever we last accrued
        original_amount: originalAmount,
        paid_sum: paidSumRounded,
        existing_amount: existingAmt,
        existing_line_id: existing ? existing.id : null,
        invoice_total: Number(inv.total) || 0,
        paused_at: null,
        frozen: true,
        on_time_full_ach: false,
        action: 'noop',
        reason: 'original_paid',
        delta: 0
      });
      continue;
    }

    // ── Rules 1–4: On-time full-amount ACH detection ────────────────
    // - "On-time" = initiated on or before grace-end.
    // - "Full amount" = individual payment amount >= originalAmount.
    //   (Aggregate/split-payment logic intentionally not supported in
    //    v1 — keeps the rule simple and matches the tenant-facing
    //    pattern of one ACH per pay attempt.)
    // - Partial payments (amt < original) NEVER earn bonus or pause,
    //   regardless of when they were initiated.
    // - Card payments are treated as instant; only method === 'ach'
    //   participates in pause/bonus logic.
    let onTimeFullAchExists = false;     // any on-time full-amount ACH, any status
    let earliestInFlightOnTime = null;   // Date of earliest in-flight on-time full-amount ACH
    for (const p of pays) {
      if (p.method !== 'ach') continue;
      if (!p.created_at) continue;
      // payments.created_at is TIMESTAMPTZ (UTC ISO). invoices.due_date
      // is DATE (local-interpreted). Parse the ISO then extract LOCAL
      // y/m/d so the comparison against grace-end is apples-to-apples.
      // A raw slice(0,10) of the ISO gives the UTC date, which is
      // off-by-one for any payment submitted after ~8pm ET.
      const createdDt = new Date(p.created_at);
      if (isNaN(createdDt.getTime())) continue;
      const initDate = new Date(
        createdDt.getFullYear(),
        createdDt.getMonth(),
        createdDt.getDate()
      );
      if (initDate.getTime() > graceEndDate.getTime()) continue; // late-initiated
      const amt = Number(p.amount) || 0;
      if (amt < originalAmount - 0.005) continue;                // partial
      onTimeFullAchExists = true;
      const st = String(p.status || '').toLowerCase();
      if (st === 'processing' || st === 'ach_processing') {
        if (earliestInFlightOnTime === null ||
            initDate.getTime() < earliestInFlightOnTime.getTime()) {
          earliestInFlightOnTime = initDate;
        }
      }
    }

    // Bonus day: granted if ANY on-time full-amount ACH was initiated
    // (regardless of current status — a later failure doesn't revoke
    // the bonus the tenant earned by attempting on time).
    const graceOffset = onTimeFullAchExists ? grace + 1 : grace;

    // Pause: only if an on-time full-amount ACH is currently in flight.
    // Chargeable window caps at the earliest such payment's init date.
    let effectiveEnd = today;
    let pausedAt = null;
    if (earliestInFlightOnTime) {
      if (earliestInFlightOnTime.getTime() < today.getTime()) {
        effectiveEnd = earliestInFlightOnTime;
      }
      pausedAt = isoDay(earliestInFlightOnTime);
    }

    const daysPastDue = daysBetween(dueDate, effectiveEnd);
    const chargeable  = Math.max(0, daysPastDue - graceOffset);
    const expected    = Math.round(chargeable * perDay * 100) / 100;

    let action = 'noop';
    let delta  = 0;
    if (expected > 0.005 && !existing) {
      action = 'insert';
      delta  = expected;
    } else if (expected > 0.005 && existing && Math.abs(existingAmt - expected) > 0.005) {
      action = 'update';
      delta  = expected - existingAmt;
    } else if (expected < 0.005 && existing) {
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
      grace_offset: graceOffset,        // grace or grace+1 (after bonus)
      per_day_late_fee: perDay,
      chargeable_days: chargeable,
      expected,
      original_amount: originalAmount,
      paid_sum: paidSumRounded,
      existing_amount: existingAmt,
      existing_line_id: existing ? existing.id : null,
      invoice_total: Number(inv.total) || 0,
      paused_at: pausedAt,              // ISO date of in-flight pause, or null
      frozen: false,
      on_time_full_ach: onTimeFullAchExists,
      action,
      delta
    });

    if (action === 'insert') plan.totals.inserts++;
    else if (action === 'update') plan.totals.updates++;
    else if (action === 'delete') plan.totals.deletes++;
    plan.totals.totalDelta = Math.round((plan.totals.totalDelta + delta) * 100) / 100;
  }

  return plan;
}

// ── CORE: apply ───────────────────────────────────────────────────
async function applyPlan(plan){
  const results = { ok: 0, failed: 0, errors: [] };
  for (const a of plan.actions) {
    if (a.action === 'noop') continue;
    try {
      if (a.action === 'insert') {
        // day_offset = chargeable_days so the admin renderer shows
        // "N days × $rate/day = $total" per js/invoice.js line 451.
        await restFetch('/invoice_lines', {
          method: 'POST',
          body: JSON.stringify({
            invoice_id:  a.invoice_id,
            kind:        'late_fee',
            description: ACCRUAL_DESCRIPTION,
            amount:      a.expected,
            day_offset:  a.chargeable_days,
            created_by:  'system:late-fee-accrual'
          })
        });
      } else if (a.action === 'update') {
        await restFetch(
          '/invoice_lines?id=eq.' + encodeURIComponent(a.existing_line_id),
          {
            method: 'PATCH',
            body: JSON.stringify({
              amount:     a.expected,
              day_offset: a.chargeable_days
            })
          }
        );
      } else if (a.action === 'delete') {
        await restFetch(
          '/invoice_lines?id=eq.' + encodeURIComponent(a.existing_line_id),
          { method: 'DELETE' }
        );
      }

      // Keep invoices.total in sync — re-sum ALL lines for this
      // invoice rather than computing a delta. Simpler, robust.
      const lines = await restFetch(
        '/invoice_lines?select=amount&invoice_id=eq.' + encodeURIComponent(a.invoice_id)
      );
      const newTotal = (lines || []).reduce((s, L) => s + (Number(L.amount) || 0), 0);
      await restFetch(
        '/invoices?id=eq.' + encodeURIComponent(a.invoice_id),
        {
          method: 'PATCH',
          body: JSON.stringify({ total: Math.round(newTotal * 100) / 100 })
        }
      );

      results.ok++;
    } catch (e) {
      results.failed++;
      results.errors.push({ invoice_id: a.invoice_id, reason: (e && e.message) || String(e) });
    }
  }
  return results;
}

// ── Settings (singleton late_fee_settings row) ────────────────────
// Returns { enabled, sms_to, schedule_time, last_run_date } with
// fallbacks applied. Never throws on a missing row — the whole point
// is that the script survives a pre-migration environment.
async function loadSettings(){
  try {
    const rows = await restFetch(
      '/late_fee_settings?select=enabled,sms_to,schedule_time,last_run_date&id=eq.1'
    );
    if (rows && rows.length) {
      const r = rows[0];
      return {
        present:       true,
        enabled:       !!r.enabled,
        sms_to:        String(r.sms_to || FALLBACK_SMS_TO).replace(/\D/g, ''),
        schedule_time: String(r.schedule_time || FALLBACK_SCHEDULE_TIME),
        last_run_date: r.last_run_date || null
      };
    }
  } catch (e) {
    // If the table doesn't exist yet (42P01), fall through to defaults.
    // Any other error we *do* want to surface in the log.
    const msg = (e && e.message) || String(e);
    if (!/late_fee_settings/.test(msg) && !/42P01/.test(msg)) {
      console.error('[recalc-late-fees] settings read warning: ' + msg);
    }
  }
  return {
    present:       false,
    enabled:       FALLBACK_ENABLED,
    sms_to:        FALLBACK_SMS_TO,
    schedule_time: FALLBACK_SCHEDULE_TIME,
    last_run_date: null
  };
}

async function stampLastRunDate(todayIso){
  // Best-effort — if the table's missing we ignore (scheduler will
  // just re-fire next tick; manual runs will always go through).
  try {
    await restFetch(
      '/late_fee_settings?id=eq.1',
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          last_run_date: todayIso,
          updated_at:    new Date().toISOString()
        })
      }
    );
  } catch (e) {
    console.error('[recalc-late-fees] stamp last_run_date warning: ' + ((e && e.message) || String(e)));
  }
}

// Parse "HH:MM" or "H:MM" → minutes since local midnight. Bad input
// yields null; caller treats null as "no time gate, always pass".
function parseHHMM(s){
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '').trim());
  if (!m) return null;
  const h = parseInt(m[1], 10), mn = parseInt(m[2], 10);
  if (h < 0 || h > 23 || mn < 0 || mn > 59) return null;
  return h * 60 + mn;
}

function nowMinutes(){
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

// ── Flowroute SMS ─────────────────────────────────────────────────
async function sendSms(smsTo, body){
  // Mirrors the PHP sendSMS() in portal/config-…-0330.php exactly:
  // flat {to, from, body} payload, vnd.api+json, HTTP Basic auth.
  const to = String(smsTo || FALLBACK_SMS_TO).replace(/\D/g, '');
  const toE164 = (to.length === 10 ? '1' + to : to);
  const authB64 = Buffer.from(
    FLOWROUTE_ACCESS_KEY + ':' + FLOWROUTE_SECRET_KEY
  ).toString('base64');

  const res = await fetch('https://api.flowroute.com/v2.1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/vnd.api+json',
      'Authorization': 'Basic ' + authB64
    },
    body: JSON.stringify({
      to:   toE164,
      from: String(FLOWROUTE_FROM).replace(/\D/g, ''),
      body
    })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Flowroute → ${res.status}: ${txt.slice(0, 300)}`);
  }
  return true;
}

// ── Formatting ────────────────────────────────────────────────────
function formatSmsSuccess(plan, results){
  const dateShort = new Date().toLocaleDateString('en-US',
    { month: 'short', day: 'numeric' });
  const net = plan.totals.totalDelta;
  const netStr = (net >= 0 ? '+' : '') + money(net);
  const errorsPart = plan.errors.length ? ` · ${plan.errors.length} skipped` : '';
  const failuresPart = results.failed ? ` · ${results.failed} write err` : '';
  return `Willow late-fee recalc · ${plan.scanned} scanned · ` +
         `${plan.totals.inserts} new, ${plan.totals.updates} upd, ` +
         `${plan.totals.deletes} rm · net ${netStr}${failuresPart}${errorsPart} · ${dateShort}`;
}

// ── Main ──────────────────────────────────────────────────────────
async function main(){
  const startedAt = new Date().toISOString();
  // `--manual` bypasses the self-gate (enabled/time/last_run_date).
  // Anything else is treated as scheduled mode.
  const mode = (process.argv.slice(2).indexOf('--manual') >= 0) ? 'manual' : 'scheduled';

  // Load settings first so even a gated skip can use the right SMS
  // destination if we decide to alert. (In practice, a gated skip is
  // silent — no SMS, no noise.)
  const settings = await loadSettings();
  const todayIso = isoDay(todayMidnight());

  // ── Self-gate (scheduled mode only) ──────────────────────────────
  if (mode === 'scheduled') {
    if (!settings.enabled) {
      const msg = '[recalc-late-fees] skip: disabled in settings';
      console.log(JSON.stringify({ ok: true, skipped: 'disabled', settings }));
      console.error(msg);
      process.exit(0);
    }
    const targetMin = parseHHMM(settings.schedule_time);
    if (targetMin !== null && nowMinutes() < targetMin) {
      console.log(JSON.stringify({
        ok: true,
        skipped: 'before-schedule',
        schedule_time: settings.schedule_time,
        now_minutes: nowMinutes()
      }));
      process.exit(0);
    }
    if (settings.last_run_date && settings.last_run_date >= todayIso) {
      console.log(JSON.stringify({
        ok: true,
        skipped: 'already-ran-today',
        last_run_date: settings.last_run_date
      }));
      process.exit(0);
    }
  }

  // ── Real run ─────────────────────────────────────────────────────
  try {
    const plan    = await computePlan();
    const results = await applyPlan(plan);

    // Stamp last_run_date BEFORE sending SMS — if SMS fails we still
    // don't want the scheduler firing this again in the next tick.
    await stampLastRunDate(todayIso);

    const summary = {
      ok: true,
      mode,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      settings_present: settings.present,
      sms_to: settings.sms_to,
      scanned: plan.scanned,
      eligible: plan.eligible,
      totals: plan.totals,
      apply: { ok: results.ok, failed: results.failed },
      errors: plan.errors,
      apply_errors: results.errors
    };

    // Always SMS, even on a no-op day — operationally it's valuable
    // to know the job *ran*, not just that there was work to do.
    const smsText = formatSmsSuccess(plan, results);
    let smsOk = false;
    try {
      await sendSms(settings.sms_to, smsText);
      smsOk = true;
    } catch (e) {
      summary.sms_error = (e && e.message) || String(e);
    }
    summary.sms_ok   = smsOk;
    summary.sms_text = smsText;

    console.log(JSON.stringify(summary, null, 2));
    // Exit non-zero if any per-invoice write failed OR SMS failed —
    // gives the scheduler a signal to ping you.
    process.exit((results.failed || !smsOk) ? 1 : 0);
  } catch (e) {
    const msg = (e && e.message) || String(e);
    console.error('[recalc-late-fees] FATAL: ' + msg);
    try {
      await sendSms(settings.sms_to, 'Willow late-fee recalc FAILED: ' + msg.slice(0, 120));
    } catch (_) { /* swallow — primary failure already reported */ }
    process.exit(1);
  }
}

main();
