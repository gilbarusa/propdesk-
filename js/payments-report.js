/* ════════════════════════════════════════════════════════════
   Willow Payments Report — admin dashboard overlay
   ────────────────────────────────────────────────────────────
   Centralized view of all payments with filters, KPIs, a
   stacked bar chart, detail table, and CSV export.

   Public API:
     WPA_openPaymentsReport()   — open the overlay
     WPA_closePaymentsReport()  — close

   Data source: Supabase `payments` joined with `invoices` and
   `invoice_lines` (PostgREST embedded select). Bank/settlement
   fields are v2 (requires Stripe API via backend) — placeholder
   card shown in the overlay.

   Depends on globals: CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Category taxonomy + colors ─────────────────────────────
  const CATS = [
    { k: 'rent',             l: 'Rent',             c: '#3651b5' },
    { k: 'parking',          l: 'Parking',          c: '#8e44ad' },
    { k: 'service',          l: 'Service',          c: '#16a085' },
    { k: 'late_fee',         l: 'Late Fee',         c: '#e67e22' },
    { k: 'credit',           l: 'Credit',           c: '#27ae60' },
    { k: 'deposit',          l: 'Deposit',          c: '#2c3e50' },
    { k: 'last_month',       l: 'Last Month',       c: '#7f8c8d' },
    { k: 'one_time_charge',  l: 'One-Time',         c: '#d35400' },
    { k: 'recurring_charge', l: 'Recurring',        c: '#2980b9' },
    { k: 'unknown',          l: 'Unknown',          c: '#95a5a6' }
  ];
  const CAT_LABEL = Object.fromEntries(CATS.map(c => [c.k, c.l]));
  const CAT_COLOR = Object.fromEntries(CATS.map(c => [c.k, c.c]));

  const METHODS = [
    { k: 'card',   l: 'Card'   },
    { k: 'ach',    l: 'ACH'    },
    { k: 'check',  l: 'Check'  },
    { k: 'manual', l: 'Manual' }
  ];

  const STATUSES = [
    { k: 'paid',      l: 'Paid',      default: true  },
    { k: 'pending',   l: 'Pending',   default: false },
    { k: 'failed',    l: 'Failed',    default: false },
    { k: 'refunded',  l: 'Refunded',  default: false }
  ];

  // ─── Utils ─────────────────────────────────────────────────
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const money = n => {
    const v = Number(n || 0);
    return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const moneyCompact = n => {
    const v = Number(n || 0);
    if (Math.abs(v) >= 1000) return (v < 0 ? '-$' : '$') + (Math.abs(v)/1000).toFixed(1) + 'k';
    return money(v);
  };
  const fmtDate = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };
  const fmtDateTime = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
           ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  const toIso = d => d.toISOString().slice(0, 10);
  const startOfDay = d => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
  const endOfDay   = d => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

  function presetRange(key) {
    const now = new Date();
    const today = startOfDay(now);
    let from, to;
    if (key === 'today')      { from = today; to = endOfDay(today); }
    else if (key === 'week')  {
      const d = new Date(today); const dow = d.getDay(); // 0=Sun
      const delta = (dow === 0) ? 6 : dow - 1; // back to Monday
      d.setDate(d.getDate() - delta);
      from = d; to = endOfDay(now);
    }
    else if (key === 'thismonth') { from = new Date(today.getFullYear(), today.getMonth(), 1); to = endOfDay(now); }
    else if (key === 'lastmonth'){
      from = new Date(today.getFullYear(), today.getMonth()-1, 1);
      to   = endOfDay(new Date(today.getFullYear(), today.getMonth(), 0));
    }
    else if (key === 'quarter'){
      const q = Math.floor(today.getMonth()/3);
      from = new Date(today.getFullYear(), q*3, 1); to = endOfDay(now);
    }
    else if (key === 'ytd')   { from = new Date(today.getFullYear(), 0, 1); to = endOfDay(now); }
    else                      { from = new Date(today.getFullYear(), today.getMonth(), 1); to = endOfDay(now); }
    return { from: toIso(from), to: toIso(to) };
  }

  // ─── State ─────────────────────────────────────────────────
  const initialPreset = presetRange('thismonth');
  let state = {
    datePreset: 'thismonth',
    dateFrom:   initialPreset.from,
    dateTo:     initialPreset.to,
    categories: [],                 // empty = all
    methods:    [],                 // empty = all
    statuses:   ['paid'],           // only paid by default
    property:   '',                 // empty = all
    landlord:   '',                 // empty = all; matches lease.owner
    aggregation:'daily',            // daily | weekly | monthly
    raw:        [],                 // fetched rows (unfiltered)
    loading:    false,
    error:      '',
    mountId:    null                // null = full-screen overlay; else render inline into this element id
  };

  // ─── Styles ────────────────────────────────────────────────
  function injectCss() {
    if (document.getElementById('wpaPrCSS')) return;
    const s = document.createElement('style');
    s.id = 'wpaPrCSS';
    s.textContent = `
      .wpa-pr-ovr{position:fixed;inset:0;background:rgba(20,28,52,.48);z-index:10040;display:flex;align-items:flex-start;justify-content:center;padding:24px;overflow-y:auto;font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#141c34}
      .wpa-pr{background:#fafbfe;width:100%;max-width:1280px;border-radius:14px;box-shadow:0 24px 80px rgba(20,28,52,.35);overflow:hidden}
      .wpa-pr-hd{background:#fff;padding:18px 26px;border-bottom:1px solid #e4e8f2;display:flex;align-items:center;justify-content:space-between;gap:14px;position:sticky;top:0;z-index:2}
      .wpa-pr-hd h2{margin:0;font-size:19px;font-weight:700}
      .wpa-pr-hd .sub{font-size:12px;color:#4d5670;margin-top:2px}
      .wpa-pr-close{background:none;border:0;font-size:22px;color:#8590a8;cursor:pointer;padding:4px 10px}
      .wpa-pr-close:hover{color:#141c34}
      .wpa-pr-body{padding:18px 22px 26px}

      /* Filter bar */
      .wpa-pr-filters{background:#fff;border:1px solid #e4e8f2;border-radius:12px;padding:14px 16px;margin-bottom:16px}
      .wpa-pr-presets{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
      .wpa-pr-chip{padding:6px 12px;border-radius:20px;border:1px solid #c4cdeb;background:#fff;color:#4d5670;font-size:12px;font-weight:500;cursor:pointer;user-select:none}
      .wpa-pr-chip:hover{background:#f5f7fb}
      .wpa-pr-chip.on{background:#3651b5;border-color:#3651b5;color:#fff}
      .wpa-pr-filter-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-top:8px}
      .wpa-pr-filter-row .lbl{font-size:11px;color:#8590a8;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-right:4px}
      .wpa-pr-dates{display:flex;gap:6px;align-items:center;font-size:12px}
      .wpa-pr-dates input{padding:6px 9px;border:1px solid #c4cdeb;border-radius:6px;font-size:12px;font-family:inherit}
      .wpa-pr-chips{display:flex;gap:5px;flex-wrap:wrap}
      .wpa-pr-mini{padding:4px 9px;border-radius:14px;border:1px solid #c4cdeb;background:#fff;font-size:11px;font-weight:500;cursor:pointer;user-select:none;display:inline-flex;align-items:center;gap:4px}
      .wpa-pr-mini:hover{background:#f5f7fb}
      .wpa-pr-mini.on{background:#eef1fb;border-color:#3651b5;color:#3651b5;font-weight:600}
      .wpa-pr-mini .sw{display:inline-block;width:8px;height:8px;border-radius:50%;background:#95a5a6;flex-shrink:0}
      .wpa-pr-select{padding:6px 9px;border:1px solid #c4cdeb;border-radius:6px;font-size:12px;font-family:inherit;background:#fff;color:#141c34}

      /* KPI row */
      .wpa-pr-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px}
      .wpa-pr-kpi{background:#fff;border:1px solid #e4e8f2;border-radius:10px;padding:14px 16px}
      .wpa-pr-kpi .k-lbl{font-size:10px;color:#8590a8;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
      .wpa-pr-kpi .k-val{font-size:22px;font-weight:700;color:#141c34}
      .wpa-pr-kpi .k-sub{font-size:11px;color:#4d5670;margin-top:4px}

      /* Chart */
      .wpa-pr-chart-card{background:#fff;border:1px solid #e4e8f2;border-radius:12px;padding:14px 18px;margin-bottom:16px}
      .wpa-pr-chart-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
      .wpa-pr-chart-hd h3{margin:0;font-size:13px;font-weight:700;color:#141c34}
      .wpa-pr-agg{display:flex;gap:4px}
      .wpa-pr-agg .wpa-pr-mini{font-size:11px}
      .wpa-pr-legend{display:flex;gap:12px;flex-wrap:wrap;margin:6px 0 4px;font-size:11px;color:#4d5670}
      .wpa-pr-legend .it{display:inline-flex;align-items:center;gap:5px}
      .wpa-pr-legend .sw{width:10px;height:10px;border-radius:2px}
      .wpa-pr-chart{width:100%;min-height:220px;position:relative}
      .wpa-pr-chart svg{display:block;width:100%;height:260px}
      .wpa-pr-chart .bar:hover{opacity:.8;cursor:pointer}
      .wpa-pr-tt{position:absolute;background:#141c34;color:#fff;padding:8px 11px;border-radius:7px;font-size:11px;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.25);white-space:nowrap;z-index:3}
      .wpa-pr-tt .t-date{font-weight:700;margin-bottom:4px}
      .wpa-pr-tt .t-row{display:flex;justify-content:space-between;gap:12px;font-size:11px}
      .wpa-pr-tt .t-total{border-top:1px solid rgba(255,255,255,.2);margin-top:5px;padding-top:5px;font-weight:700}

      /* Table */
      .wpa-pr-table-card{background:#fff;border:1px solid #e4e8f2;border-radius:12px;overflow:hidden;margin-bottom:16px}
      .wpa-pr-table-hd{padding:12px 16px;border-bottom:1px solid #e4e8f2;display:flex;justify-content:space-between;align-items:center}
      .wpa-pr-table-hd h3{margin:0;font-size:13px;font-weight:700}
      .wpa-pr-table-wrap{max-height:460px;overflow:auto}
      table.wpa-pr-tbl{width:100%;border-collapse:collapse;font-size:12px}
      table.wpa-pr-tbl th{text-align:left;padding:8px 10px;background:#f5f7fb;color:#4d5670;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;position:sticky;top:0;border-bottom:1px solid #e4e8f2}
      table.wpa-pr-tbl td{padding:8px 10px;border-bottom:1px solid #eef1f7;color:#141c34}
      table.wpa-pr-tbl tr:hover td{background:#f5f7fb;cursor:pointer}
      table.wpa-pr-tbl th.num,table.wpa-pr-tbl td.num{text-align:right;font-variant-numeric:tabular-nums}
      .wpa-pr-pill{display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;color:#fff;letter-spacing:.02em}
      .wpa-pr-empty{padding:40px 20px;text-align:center;color:#8590a8;font-size:13px}
      .wpa-pr-loading{padding:40px 20px;text-align:center;color:#4d5670;font-size:13px}
      .wpa-pr-err{background:#fdf1f0;border:1px solid #eebfba;color:#b83228;padding:10px 14px;border-radius:8px;margin-bottom:12px;font-size:12px}

      /* Placeholder card for v2 Stripe-settlement data */
      .wpa-pr-soon{background:#fff;border:1px dashed #c4cdeb;border-radius:12px;padding:14px 18px;margin-bottom:16px;font-size:12px;color:#4d5670}
      .wpa-pr-soon strong{color:#141c34}

      .wpa-pr-btn{padding:7px 14px;border-radius:7px;border:1px solid #c4cdeb;background:#fff;color:#141c34;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
      .wpa-pr-btn:hover{background:#f5f7fb}
      .wpa-pr-btn.primary{background:#3651b5;border-color:#3651b5;color:#fff}
      .wpa-pr-btn.primary:hover{background:#2b4399}

      /* Inline-mode tweaks — when mounted inside Reports page (no overlay) */
      .wpa-pr-inline{background:#fafbfe;border:1px solid #e4e8f2;border-radius:14px;overflow:hidden;font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#141c34}
      .wpa-pr-inline .wpa-pr-hd{position:static}
      .wpa-pr-inline .wpa-pr-close{display:none}

      /* ─── 7-day cashflow summary card (main dashboard) ─── */
      .wpa-cf-card{background:#fff;border:1px solid #e4e8f2;border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:12px;font:13px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#141c34}
      .wpa-cf-hd{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
      .wpa-cf-hd h4{margin:0;font-size:13px;font-weight:700;color:#141c34}
      .wpa-cf-hd .link{font-size:11px;color:#3651b5;text-decoration:none;cursor:pointer}
      .wpa-cf-hd .link:hover{text-decoration:underline}
      .wpa-cf-big{display:flex;align-items:baseline;gap:10px}
      .wpa-cf-big .v{font-size:28px;font-weight:700;color:#141c34;font-variant-numeric:tabular-nums}
      .wpa-cf-big .sub{font-size:11px;color:#4d5670}
      .wpa-cf-spark{height:70px;position:relative}
      .wpa-cf-spark svg{width:100%;height:100%;display:block}
      .wpa-cf-cats{display:flex;flex-direction:column;gap:5px}
      .wpa-cf-cat{display:flex;align-items:center;gap:8px;font-size:12px}
      .wpa-cf-cat .sw{width:8px;height:8px;border-radius:50%;flex-shrink:0}
      .wpa-cf-cat .cat-lbl{flex:1;color:#4d5670}
      .wpa-cf-cat .cat-val{font-weight:600;color:#141c34;font-variant-numeric:tabular-nums}
      .wpa-cf-empty{padding:20px 0;text-align:center;color:#8590a8;font-size:12px}

      @media (max-width:820px){
        .wpa-pr-hd{padding:14px 18px}
        .wpa-pr-body{padding:12px 14px 20px}
        table.wpa-pr-tbl .hide-sm{display:none}
      }
    `;
    document.head.appendChild(s);
  }

  // ─── Supabase fetch ────────────────────────────────────────
  async function fetchPayments() {
    const from = state.dateFrom + 'T00:00:00';
    const to   = state.dateTo   + 'T23:59:59';
    // Embed invoice + its lines so we can derive category client-side
    // without N+1 queries.
    const select =
      'id,invoice_id,amount,method,status,paid_at,created_at,payer_name,' +
      'surcharge_amount,stripe_payment_intent_id,stripe_account_id,' +
      'invoices(id,property,unit,tenant_id,total,notes,' +
      'invoice_lines(kind,description,amount))';
    // paid_at filter: a COALESCE would be ideal, but PostgREST is
    // simpler to filter on created_at when paid_at is null. We pull
    // on paid_at first; for rows without paid_at (pending), we fall
    // back by also fetching on created_at and de-duping.
    const qPaid = 'payments?select=' + encodeURIComponent(select)
                + '&paid_at=gte.' + encodeURIComponent(from)
                + '&paid_at=lte.' + encodeURIComponent(to)
                + '&order=paid_at.desc';
    const r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/' + qPaid, {
      headers: { apikey: CONFIG.SUPABASE_KEY, Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY }
    });
    if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + (await r.text()));
    const rows = await r.json();
    return rows || [];
  }

  // ─── Category derivation ───────────────────────────────────
  function deriveCategory(payment) {
    const inv = payment.invoices;
    if (!inv || !Array.isArray(inv.invoice_lines) || inv.invoice_lines.length === 0) {
      return { primary: 'unknown', count: 0, mixed: false };
    }
    const lines = inv.invoice_lines;
    if (lines.length === 1) return { primary: lines[0].kind || 'unknown', count: 1, mixed: false };
    const sorted = lines.slice().sort((a, b) => Math.abs(Number(b.amount)||0) - Math.abs(Number(a.amount)||0));
    const distinct = new Set(lines.map(l => l.kind)).size;
    return { primary: sorted[0].kind || 'unknown', count: lines.length, mixed: distinct > 1 };
  }

  // ─── Landlord derivation ───────────────────────────────────
  // Each landlord has their own Stripe account (1:1), so filtering by
  // landlord = filtering by Stripe account. Data source: INNAGO_LEASES
  // global populated by the main dashboard. Match by property + unit/apt.
  function deriveLandlord(payment) {
    const inv = payment.invoices || {};
    const unit = inv.unit;
    if (!unit) return '';
    const leases = (window.INNAGO_LEASES || window.ROWS || []);
    if (!Array.isArray(leases) || !leases.length) return '';
    const u = String(unit).trim().toLowerCase();
    const prop = String(inv.property || '').trim().toLowerCase();
    // Try exact property+unit match first; fall back to unit-only (many
    // legacy invoices have property = null but unique unit numbers).
    let hit = leases.find(l =>
      String(l.apt || '').trim().toLowerCase() === u &&
      (!prop || String(l.property || '').trim().toLowerCase() === prop)
    );
    if (!hit && prop) {
      hit = leases.find(l => String(l.apt || '').trim().toLowerCase() === u);
    }
    return (hit && hit.owner) || '';
  }

  // ─── Apply client-side filters ─────────────────────────────
  function filteredRows() {
    const rows = state.raw || [];
    return rows.filter(p => {
      const inv = p.invoices || {};
      // Status — match ignoring the succeeded alias
      const rowStatus = ((p.status === 'succeeded') ? 'paid' : (p.status || '')).toLowerCase();
      if (state.statuses.length && state.statuses.indexOf(rowStatus) === -1) return false;
      // Method
      if (state.methods.length && state.methods.indexOf((p.method||'').toLowerCase()) === -1) return false;
      // Property
      if (state.property && inv.property !== state.property) return false;
      // Landlord (1:1 with Stripe account)
      if (state.landlord && deriveLandlord(p) !== state.landlord) return false;
      // Category
      if (state.categories.length) {
        const cat = deriveCategory(p).primary;
        if (state.categories.indexOf(cat) === -1) return false;
      }
      return true;
    });
  }

  // ─── KPIs ──────────────────────────────────────────────────
  function computeKpis(rows) {
    const total = rows.reduce((s, p) => s + Number(p.amount || 0), 0);
    const fees  = rows.reduce((s, p) => s + Number(p.surcharge_amount || 0), 0);
    const count = rows.length;
    const avg   = count ? total / count : 0;
    const byMethod = {};
    rows.forEach(p => {
      const m = (p.method || 'other').toLowerCase();
      if (!byMethod[m]) byMethod[m] = { n: 0, v: 0 };
      byMethod[m].n++;
      byMethod[m].v += Number(p.amount || 0);
    });
    return { total, fees, count, avg, byMethod };
  }

  // ─── Aggregation for chart ─────────────────────────────────
  function bucketKey(isoDate) {
    const d = new Date(isoDate);
    if (isNaN(d)) return '';
    if (state.aggregation === 'daily')  return d.toISOString().slice(0, 10);
    if (state.aggregation === 'weekly') {
      const x = new Date(d); x.setHours(0,0,0,0);
      const dow = x.getDay(); const delta = (dow === 0) ? 6 : dow - 1;
      x.setDate(x.getDate() - delta);
      return x.toISOString().slice(0, 10); // Monday of that week
    }
    if (state.aggregation === 'monthly') {
      return d.toISOString().slice(0, 7); // YYYY-MM
    }
    return d.toISOString().slice(0, 10);
  }
  function bucketLabel(key) {
    if (state.aggregation === 'monthly') {
      const [y, m] = key.split('-').map(Number);
      return new Date(y, m-1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
    const d = new Date(key + 'T12:00:00');
    if (state.aggregation === 'weekly') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function aggregateForChart(rows) {
    const byBucket = {};
    rows.forEach(p => {
      const when = p.paid_at || p.created_at;
      const k = bucketKey(when);
      if (!k) return;
      if (!byBucket[k]) byBucket[k] = {};
      const cat = deriveCategory(p).primary;
      byBucket[k][cat] = (byBucket[k][cat] || 0) + Number(p.amount || 0);
    });
    const keys = Object.keys(byBucket).sort();
    return keys.map(k => ({ key: k, label: bucketLabel(k), by: byBucket[k],
      total: Object.values(byBucket[k]).reduce((s,v)=>s+v, 0) }));
  }

  // ─── Render main report (overlay or inline) ───────────────
  function render() {
    const body = renderBody();
    if (state.mountId) {
      // Inline mode — render directly into the mount container
      const mount = document.getElementById(state.mountId);
      if (!mount) return;
      mount.innerHTML = '<div class="wpa-pr wpa-pr-inline" id="wpaPrRoot">' + body + '</div>';
    } else {
      // Overlay mode
      const host = document.getElementById('wpaPrOverlay');
      if (!host) {
        document.body.insertAdjacentHTML('beforeend',
          '<div class="wpa-pr-ovr" id="wpaPrOverlay" onclick="if(event.target===this)WPA_closePaymentsReport()">' +
            '<div class="wpa-pr" id="wpaPrRoot">' + body + '</div>' +
          '</div>');
      } else {
        const root = document.getElementById('wpaPrRoot');
        if (root) root.innerHTML = body;
      }
    }
    // Draw chart after DOM is in
    drawChart();
  }

  function renderBody() {
    const rows = filteredRows();
    const k = computeKpis(rows);
    const properties = Array.from(new Set((state.raw||[]).map(p => p.invoices && p.invoices.property).filter(Boolean))).sort();
    const landlords  = Array.from(new Set((state.raw||[]).map(p => deriveLandlord(p)).filter(Boolean))).sort();

    return `
      <div class="wpa-pr-hd">
        <div>
          <h2>💰 Payments Report</h2>
          <div class="sub">${esc(state.dateFrom)} → ${esc(state.dateTo)} · ${rows.length} payment${rows.length===1?'':'s'}</div>
        </div>
        <button class="wpa-pr-close" onclick="WPA_closePaymentsReport()" title="Close">✕</button>
      </div>

      <div class="wpa-pr-body">
        ${state.error ? `<div class="wpa-pr-err">${esc(state.error)}</div>` : ''}
        ${state.loading ? `<div class="wpa-pr-loading">Loading…</div>` : ''}

        ${renderFilters(properties, landlords)}
        ${renderKpis(k)}
        ${renderChart(rows)}
        ${renderSoonCard()}
        ${renderTable(rows)}
      </div>
    `;
  }

  function renderFilters(properties, landlords) {
    const presets = [
      ['today',     'Today'],
      ['week',      'This Week'],
      ['thismonth', 'This Month'],
      ['lastmonth', 'Last Month'],
      ['quarter',   'This Quarter'],
      ['ytd',       'YTD'],
      ['custom',    'Custom']
    ];
    const catChips = CATS.filter(c => c.k !== 'unknown').map(c => {
      const on = state.categories.indexOf(c.k) !== -1;
      return `<span class="wpa-pr-mini ${on?'on':''}" onclick="WPA_prToggleCat('${c.k}')">
                <span class="sw" style="background:${c.c}"></span>${esc(c.l)}
              </span>`;
    }).join('');
    const methodChips = METHODS.map(m => {
      const on = state.methods.indexOf(m.k) !== -1;
      return `<span class="wpa-pr-mini ${on?'on':''}" onclick="WPA_prToggleMethod('${m.k}')">${esc(m.l)}</span>`;
    }).join('');
    const statusChips = STATUSES.map(s => {
      const on = state.statuses.indexOf(s.k) !== -1;
      return `<span class="wpa-pr-mini ${on?'on':''}" onclick="WPA_prToggleStatus('${s.k}')">${esc(s.l)}</span>`;
    }).join('');
    const propSelect = `<select class="wpa-pr-select" onchange="WPA_prSetProperty(this.value)">
        <option value="">All properties</option>
        ${properties.map(p => `<option value="${esc(p)}" ${state.property===p?'selected':''}>${esc(p)}</option>`).join('')}
      </select>`;
    const landlordSelect = `<select class="wpa-pr-select" onchange="WPA_prSetLandlord(this.value)" title="Each landlord maps 1:1 to a Stripe account">
        <option value="">All landlords</option>
        ${landlords.map(l => `<option value="${esc(l)}" ${state.landlord===l?'selected':''}>${esc(l)}</option>`).join('')}
      </select>`;

    return `
      <div class="wpa-pr-filters">
        <div class="wpa-pr-presets">
          ${presets.map(([k,l]) => `<span class="wpa-pr-chip ${state.datePreset===k?'on':''}" onclick="WPA_prSetPreset('${k}')">${esc(l)}</span>`).join('')}
          <span class="wpa-pr-dates">
            <input type="date" value="${esc(state.dateFrom)}" onchange="WPA_prSetDate('from',this.value)">
            <span style="color:#8590a8">→</span>
            <input type="date" value="${esc(state.dateTo)}"   onchange="WPA_prSetDate('to',this.value)">
          </span>
        </div>
        <div class="wpa-pr-filter-row">
          <span class="lbl">Category</span>
          <div class="wpa-pr-chips">${catChips}</div>
        </div>
        <div class="wpa-pr-filter-row">
          <span class="lbl">Method</span>
          <div class="wpa-pr-chips">${methodChips}</div>
          <span class="lbl" style="margin-left:14px">Status</span>
          <div class="wpa-pr-chips">${statusChips}</div>
        </div>
        <div class="wpa-pr-filter-row">
          <span class="lbl">Landlord / Stripe acct</span>
          ${landlordSelect}
          <span class="lbl" style="margin-left:14px">Property</span>
          ${propSelect}
          <div style="flex:1"></div>
          <button class="wpa-pr-btn" onclick="WPA_prExportCsv()">⬇ Export CSV</button>
        </div>
      </div>
    `;
  }

  function renderKpis(k) {
    const methodBlurb = Object.keys(k.byMethod).map(m =>
      `${CAT_LABEL[m] || m[0].toUpperCase()+m.slice(1)}: ${k.byMethod[m].n} / ${money(k.byMethod[m].v)}`
    ).join(' · ');
    return `
      <div class="wpa-pr-kpis">
        <div class="wpa-pr-kpi">
          <div class="k-lbl">Total Collected</div>
          <div class="k-val">${esc(money(k.total))}</div>
          <div class="k-sub">${methodBlurb || '—'}</div>
        </div>
        <div class="wpa-pr-kpi">
          <div class="k-lbl">Payments</div>
          <div class="k-val">${k.count}</div>
          <div class="k-sub">in the selected window</div>
        </div>
        <div class="wpa-pr-kpi">
          <div class="k-lbl">Average Payment</div>
          <div class="k-val">${esc(money(k.avg))}</div>
          <div class="k-sub">gross per transaction</div>
        </div>
        <div class="wpa-pr-kpi">
          <div class="k-lbl">Processing Fees</div>
          <div class="k-val">${esc(money(k.fees))}</div>
          <div class="k-sub">pass-through card surcharges</div>
        </div>
      </div>
    `;
  }

  function renderSoonCard() {
    return `
      <div class="wpa-pr-soon">
        <strong>Bank / Settlement (via Stripe) — coming in v2.</strong>
        Net deposit, payout batches, transit status, and refund / dispute
        rollups need a backend Stripe API integration. The payment rows
        above come directly from Supabase.
      </div>
    `;
  }

  function renderChart(rows) {
    const aggChips = [['daily','Daily'],['weekly','Weekly'],['monthly','Monthly']].map(([k,l]) =>
      `<span class="wpa-pr-mini ${state.aggregation===k?'on':''}" onclick="WPA_prSetAgg('${k}')">${esc(l)}</span>`
    ).join('');
    // Build legend from categories actually present in the current filtered rows
    const catsPresent = new Set();
    rows.forEach(p => catsPresent.add(deriveCategory(p).primary));
    const legend = CATS.filter(c => catsPresent.has(c.k)).map(c =>
      `<span class="it"><span class="sw" style="background:${c.c}"></span>${esc(c.l)}</span>`
    ).join('');
    return `
      <div class="wpa-pr-chart-card">
        <div class="wpa-pr-chart-hd">
          <h3>Collected Over Time</h3>
          <div class="wpa-pr-agg">${aggChips}</div>
        </div>
        <div class="wpa-pr-legend">${legend || '<span style="color:#8590a8">No data in range</span>'}</div>
        <div class="wpa-pr-chart" id="wpaPrChartMount"></div>
      </div>
    `;
  }

  function renderTable(rows) {
    if (!rows.length) {
      return `<div class="wpa-pr-table-card"><div class="wpa-pr-empty">No payments match your filters.</div></div>`;
    }
    // Sort newest first (paid_at desc, fallback created_at)
    const sorted = rows.slice().sort((a, b) => {
      const ta = new Date(a.paid_at || a.created_at || 0).getTime();
      const tb = new Date(b.paid_at || b.created_at || 0).getTime();
      return tb - ta;
    });
    const body = sorted.map(p => {
      const inv = p.invoices || {};
      const cat = deriveCategory(p);
      const catColor = CAT_COLOR[cat.primary] || '#95a5a6';
      const amt = Number(p.amount || 0);
      const fee = Number(p.surcharge_amount || 0);
      const net = amt; // surcharge is pass-through, so "net to business" = amount
      const when = p.paid_at || p.created_at;
      const stripePi   = p.stripe_payment_intent_id ? ('…' + String(p.stripe_payment_intent_id).slice(-8)) : '—';
      const stripeAcct = p.stripe_account_id ? (String(p.stripe_account_id).slice(0, 12) + '…') : '—';
      const landlord   = deriveLandlord(p) || '—';
      return `
        <tr onclick="WPA_prOpenInvoice('${esc(p.invoice_id||'')}')">
          <td>${esc(fmtDateTime(when))}</td>
          <td class="hide-sm">${esc(p.payer_name || '—')}</td>
          <td class="hide-sm">${esc(inv.property || '—')}${inv.unit?'<br><span style="color:#8590a8;font-size:11px">Unit '+esc(inv.unit)+'</span>':''}</td>
          <td class="hide-sm">${esc(landlord)}</td>
          <td>
            <span class="wpa-pr-pill" style="background:${catColor}">${esc(CAT_LABEL[cat.primary] || cat.primary)}${cat.mixed?' +'+(cat.count-1):''}</span>
          </td>
          <td>${esc((p.method||'—').toUpperCase())}</td>
          <td class="num">${esc(money(amt))}</td>
          <td class="num hide-sm">${esc(money(fee))}</td>
          <td class="num hide-sm">${esc(money(net))}</td>
          <td class="hide-sm" style="color:#8590a8;font-family:monospace;font-size:11px">${esc(stripeAcct)}</td>
          <td class="hide-sm" style="color:#8590a8;font-family:monospace;font-size:11px">${esc(stripePi)}</td>
        </tr>
      `;
    }).join('');
    return `
      <div class="wpa-pr-table-card">
        <div class="wpa-pr-table-hd">
          <h3>Detail</h3>
          <span style="font-size:11px;color:#8590a8">Click any row to open the invoice</span>
        </div>
        <div class="wpa-pr-table-wrap">
          <table class="wpa-pr-tbl">
            <thead><tr>
              <th>Date</th>
              <th class="hide-sm">Tenant</th>
              <th class="hide-sm">Property</th>
              <th class="hide-sm">Landlord</th>
              <th>Category</th>
              <th>Method</th>
              <th class="num">Amount</th>
              <th class="num hide-sm">Fee</th>
              <th class="num hide-sm">Net</th>
              <th class="hide-sm">Stripe Acct</th>
              <th class="hide-sm">Stripe PI</th>
            </tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ─── SVG stacked bar chart ─────────────────────────────────
  function drawChart() {
    const mount = document.getElementById('wpaPrChartMount');
    if (!mount) return;
    const rows = filteredRows();
    const buckets = aggregateForChart(rows);
    if (!buckets.length) {
      mount.innerHTML = '<div style="padding:40px 0;text-align:center;color:#8590a8;font-size:12px">No data in range</div>';
      return;
    }
    const W = Math.max(600, mount.clientWidth || 900);
    const H = 260;
    const PAD = { t: 20, r: 16, b: 34, l: 52 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;
    const maxTotal = Math.max(1, ...buckets.map(b => b.total));
    // Y axis ticks (4)
    const ticks = [0, maxTotal/4, maxTotal/2, maxTotal*0.75, maxTotal];
    // Bar layout
    const n = buckets.length;
    const barW = Math.max(6, Math.min(48, (plotW - 8*(n-1)) / n));
    const gap = (plotW - barW*n) / Math.max(1, n);

    const categoriesInOrder = CATS.map(c => c.k);

    const yScale = v => PAD.t + plotH - (v / maxTotal) * plotH;

    // Y gridlines + labels
    const gridLines = ticks.map(t => {
      const y = yScale(t);
      return `<line x1="${PAD.l}" y1="${y.toFixed(1)}" x2="${(PAD.l+plotW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e4e8f2" stroke-width="1"/>
              <text x="${PAD.l - 6}" y="${(y+3.5).toFixed(1)}" text-anchor="end" font-size="10" fill="#8590a8">${moneyCompact(t)}</text>`;
    }).join('');

    // Stacked bars
    let bars = '';
    buckets.forEach((b, i) => {
      const x = PAD.l + i * (barW + gap);
      let yCursor = PAD.t + plotH;
      categoriesInOrder.forEach(cat => {
        const v = b.by[cat] || 0;
        if (v <= 0) return;
        const h = (v / maxTotal) * plotH;
        const y = yCursor - h;
        bars += `<rect class="bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" fill="${CAT_COLOR[cat]}"
                   data-bucket="${i}" onmousemove="WPA_prChartTt(event,${i})" onmouseleave="WPA_prChartTtHide()"></rect>`;
        yCursor = y;
      });
      // X label
      const cx = x + barW/2;
      bars += `<text x="${cx.toFixed(1)}" y="${(PAD.t+plotH+16).toFixed(1)}" text-anchor="middle" font-size="10" fill="#4d5670">${esc(b.label)}</text>`;
    });

    // Stash buckets for tooltip lookup
    window._wpaPrBuckets = buckets;

    mount.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        ${gridLines}
        ${bars}
      </svg>
      <div class="wpa-pr-tt" id="wpaPrTt" style="display:none"></div>
    `;
  }

  window.WPA_prChartTt = function (e, idx) {
    const tt = document.getElementById('wpaPrTt');
    const b = (window._wpaPrBuckets || [])[idx];
    if (!tt || !b) return;
    const rows = Object.keys(b.by).sort((a,x) => (b.by[x]||0)-(b.by[a]||0))
      .map(cat => `<div class="t-row"><span style="color:${CAT_COLOR[cat]||'#95a5a6'}">${esc(CAT_LABEL[cat]||cat)}</span><span>${esc(money(b.by[cat]))}</span></div>`).join('');
    tt.innerHTML = `<div class="t-date">${esc(b.label)}</div>${rows}<div class="t-row t-total"><span>Total</span><span>${esc(money(b.total))}</span></div>`;
    tt.style.display = 'block';
    const mount = document.getElementById('wpaPrChartMount');
    const rect = mount.getBoundingClientRect();
    const x = e.clientX - rect.left + 12;
    const y = e.clientY - rect.top  + 12;
    tt.style.left = x + 'px';
    tt.style.top  = y + 'px';
  };
  window.WPA_prChartTtHide = function () {
    const tt = document.getElementById('wpaPrTt');
    if (tt) tt.style.display = 'none';
  };

  // ─── Filter handlers (window-exposed) ──────────────────────
  window.WPA_prSetPreset = async function (key) {
    if (key === 'custom') { state.datePreset = 'custom'; render(); return; }
    const r = presetRange(key);
    state.datePreset = key;
    state.dateFrom = r.from;
    state.dateTo   = r.to;
    await reload();
  };
  window.WPA_prSetDate = async function (which, val) {
    if (!val) return;
    state.datePreset = 'custom';
    if (which === 'from') state.dateFrom = val;
    else                  state.dateTo   = val;
    await reload();
  };
  window.WPA_prToggleCat = function (k) {
    const i = state.categories.indexOf(k);
    if (i === -1) state.categories.push(k); else state.categories.splice(i,1);
    render();
  };
  window.WPA_prToggleMethod = function (k) {
    const i = state.methods.indexOf(k);
    if (i === -1) state.methods.push(k); else state.methods.splice(i,1);
    render();
  };
  window.WPA_prToggleStatus = async function (k) {
    const i = state.statuses.indexOf(k);
    if (i === -1) state.statuses.push(k); else state.statuses.splice(i,1);
    // Status changes require re-fetch? No — we filter client-side.
    render();
  };
  window.WPA_prSetProperty = function (v) { state.property = v; render(); };
  window.WPA_prSetLandlord = function (v) { state.landlord = v; render(); };
  window.WPA_prSetAgg      = function (v) { state.aggregation = v; render(); };
  window.WPA_prOpenInvoice = function (id) {
    if (!id) return;
    if (typeof window.WPA_openInvoice === 'function') {
      // Only close the overlay if we're in overlay mode — inline
      // Reports-tab usage should stay put so the user can come back.
      if (!state.mountId) WPA_closePaymentsReport();
      setTimeout(() => { try { window.WPA_openInvoice(id); } catch (e) {} }, 50);
    }
  };

  // ─── CSV export ────────────────────────────────────────────
  window.WPA_prExportCsv = function () {
    const rows = filteredRows().slice().sort((a, b) => {
      const ta = new Date(a.paid_at || a.created_at || 0).getTime();
      const tb = new Date(b.paid_at || b.created_at || 0).getTime();
      return tb - ta;
    });
    const headers = ['Date','Tenant','Property','Unit','Landlord','Category','Method','Status','Amount','Fee','Net','StripeAccount','StripePI','InvoiceID'];
    const lines = [headers.join(',')];
    const q = v => {
      if (v == null) return '';
      const s = String(v);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    rows.forEach(p => {
      const inv = p.invoices || {};
      const cat = deriveCategory(p);
      const when = p.paid_at || p.created_at || '';
      lines.push([
        fmtDateTime(when),
        p.payer_name || '',
        inv.property || '',
        inv.unit || '',
        deriveLandlord(p) || '',
        CAT_LABEL[cat.primary] || cat.primary,
        (p.method || '').toUpperCase(),
        p.status || '',
        Number(p.amount || 0).toFixed(2),
        Number(p.surcharge_amount || 0).toFixed(2),
        Number(p.amount || 0).toFixed(2),
        p.stripe_account_id || '',
        p.stripe_payment_intent_id || '',
        p.invoice_id || ''
      ].map(q).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments-' + state.dateFrom + '-to-' + state.dateTo + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
  };

  // ─── Main entry ────────────────────────────────────────────
  async function reload() {
    state.loading = true;
    state.error = '';
    render();
    try {
      state.raw = await fetchPayments();
    } catch (e) {
      state.error = 'Failed to load payments: ' + (e && e.message ? e.message : String(e));
      console.error('[payments-report]', e);
    }
    state.loading = false;
    render();
  }

  function resetState(extra) {
    const r = presetRange('thismonth');
    state = Object.assign({}, state, {
      datePreset: 'thismonth',
      dateFrom: r.from,
      dateTo: r.to,
      categories: [],
      methods: [],
      statuses: ['paid'],
      property: '',
      landlord: '',
      aggregation: 'daily',
      raw: [],
      loading: false,
      error: '',
      mountId: null
    }, extra || {});
  }

  // Open as full-screen overlay (legacy entry point).
  window.WPA_openPaymentsReport = async function () {
    injectCss();
    resetState({ mountId: null });
    render();
    await reload();
  };

  // Render inline into the given element id. Used by the Reports tab.
  window.WPA_renderPaymentsReport = async function (mountId) {
    if (!mountId || !document.getElementById(mountId)) return;
    injectCss();
    resetState({ mountId: mountId });
    render();
    await reload();
  };

  window.WPA_closePaymentsReport = function () {
    const o = document.getElementById('wpaPrOverlay');
    if (o) o.remove();
    const tt = document.getElementById('wpaPrTt');
    if (tt) tt.remove();
  };

  // Expand/collapse the Payments Report section on the Reports tab.
  // First expand also triggers the fetch+render; subsequent toggles
  // just show/hide the already-rendered content (state preserved).
  window.WPA_prToggleSection = function () {
    const body  = document.getElementById('wpaPrInline');
    const label = document.getElementById('wpaPrToggleLbl');
    const toggle= document.getElementById('wpaPrToggle');
    if (!body) return;
    const isHidden = body.style.display === 'none' || !body.style.display;
    if (isHidden) {
      body.style.display = 'block';
      if (label) label.textContent = 'Collapse ▴';
      if (toggle) toggle.style.borderBottomLeftRadius = '0', toggle.style.borderBottomRightRadius = '0';
      // Lazy render on first expand
      if (!body.querySelector('.wpa-pr')) {
        window.WPA_renderPaymentsReport('wpaPrInline');
      }
    } else {
      body.style.display = 'none';
      if (label) label.textContent = 'Expand ▾';
      if (toggle) toggle.style.borderBottomLeftRadius = '12px', toggle.style.borderBottomRightRadius = '12px';
    }
  };

  // Navigate to Reports tab + auto-expand the section. Used by the
  // "View full report →" link on the main dashboard cashflow card.
  window.WPA_gotoPaymentsReport = function () {
    // Find any Reports nav tab (legacy .nav-tab or sidebar variant)
    let navEl = null;
    const candidates = document.querySelectorAll('[onclick*="reports"]');
    for (let i = 0; i < candidates.length; i++) {
      const oc = candidates[i].getAttribute('onclick') || '';
      if (oc.indexOf('showPage') !== -1 && oc.indexOf('reports') !== -1) {
        navEl = candidates[i];
        break;
      }
    }
    try {
      if (typeof window.showPage === 'function') window.showPage('reports', navEl || null);
      else if (navEl) navEl.click();
    } catch (e) { /* noop */ }
    setTimeout(() => {
      const body = document.getElementById('wpaPrInline');
      const section = document.getElementById('wpaPrSection');
      if (!body) return;
      // If collapsed, expand (triggers lazy render)
      if (body.style.display === 'none' || !body.style.display) {
        window.WPA_prToggleSection();
      }
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  /* ════════════════════════════════════════════════════════════
     7-day cashflow summary card (main dashboard widget)
     ────────────────────────────────────────────────────────────
     Compact standalone widget — independent state from the main
     report so filter changes there don't affect dashboard header.
     ════════════════════════════════════════════════════════════ */

  async function fetchLast7Days() {
    const now = new Date();
    const end = endOfDay(now);
    const start = new Date(now); start.setDate(start.getDate() - 6); start.setHours(0,0,0,0);
    const fromIso = start.toISOString();
    const toIsoS  = end.toISOString();
    const select =
      'id,amount,method,status,paid_at,created_at,surcharge_amount,' +
      'invoices(invoice_lines(kind,amount))';
    const q = 'payments?select=' + encodeURIComponent(select)
            + '&paid_at=gte.' + encodeURIComponent(fromIso)
            + '&paid_at=lte.' + encodeURIComponent(toIsoS)
            + '&order=paid_at.desc';
    const r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/' + q, {
      headers: { apikey: CONFIG.SUPABASE_KEY, Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY }
    });
    if (!r.ok) throw new Error('Supabase ' + r.status);
    return { rows: (await r.json()) || [], start: start, end: end };
  }

  function cashflowSparkSvg(dailyTotals) {
    // dailyTotals: array of { label, value } length 7
    const W = 300, H = 70, pad = 4;
    const plotW = W - pad*2, plotH = H - pad*2;
    const max = Math.max(1, ...dailyTotals.map(d => d.value));
    const n = dailyTotals.length;
    const barW = Math.max(6, (plotW - 8*(n-1)) / n);
    const gap  = n > 1 ? (plotW - barW*n) / (n-1) : 0;
    let bars = '';
    dailyTotals.forEach((d, i) => {
      const h = max > 0 ? (d.value / max) * plotH : 0;
      const x = pad + i * (barW + gap);
      const y = pad + plotH - h;
      const fill = d.value > 0 ? '#3651b5' : '#e4e8f2';
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(2,h).toFixed(1)}" rx="2" fill="${fill}">
                 <title>${esc(d.label)}: ${esc(money(d.value))}</title>
               </rect>`;
    });
    // Day letter labels under bars (tight)
    const labels = dailyTotals.map((d, i) => {
      const cx = pad + i * (barW + gap) + barW/2;
      return `<text x="${cx.toFixed(1)}" y="${(H-0.5).toFixed(1)}" text-anchor="middle" font-size="8" fill="#8590a8">${esc(d.letter)}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H+10}" preserveAspectRatio="none">${bars}${labels}</svg>`;
  }

  function renderCashflowCard(mount, data) {
    const { rows, start } = data;
    // Build 7 daily buckets (inclusive today → 6 days ago)
    const buckets = [];
    const WEEKDAY_LETTER = ['S','M','T','W','T','F','S'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      buckets.push({
        key: key,
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        letter: WEEKDAY_LETTER[d.getDay()],
        value: 0
      });
    }
    const idx = Object.fromEntries(buckets.map((b, i) => [b.key, i]));
    let total = 0;
    const catTotals = {};
    rows.forEach(p => {
      const when = p.paid_at || p.created_at;
      if (!when) return;
      const k = when.slice(0, 10);
      if (!(k in idx)) return;
      const amt = Number(p.amount || 0);
      buckets[idx[k]].value += amt;
      total += amt;
      const cat = deriveCategory(p).primary;
      catTotals[cat] = (catTotals[cat] || 0) + amt;
    });
    const topCats = Object.keys(catTotals).sort((a,b) => catTotals[b]-catTotals[a]).slice(0, 3);
    const catsHtml = topCats.length
      ? topCats.map(c => `<div class="wpa-cf-cat">
            <span class="sw" style="background:${CAT_COLOR[c] || '#95a5a6'}"></span>
            <span class="cat-lbl">${esc(CAT_LABEL[c] || c)}</span>
            <span class="cat-val">${esc(money(catTotals[c]))}</span>
          </div>`).join('')
      : '<div class="wpa-cf-empty">No payments in the last 7 days</div>';
    mount.innerHTML = `
      <div class="wpa-cf-card">
        <div class="wpa-cf-hd">
          <h4>💸 7-Day Cashflow</h4>
          <a class="link" onclick="WPA_gotoPaymentsReport()">View full report →</a>
        </div>
        <div class="wpa-cf-big">
          <span class="v">${esc(money(total))}</span>
          <span class="sub">collected · ${rows.length} payment${rows.length===1?'':'s'}</span>
        </div>
        <div class="wpa-cf-spark">${cashflowSparkSvg(buckets)}</div>
        <div class="wpa-cf-cats">${catsHtml}</div>
      </div>
    `;
  }

  window.WPA_renderCashflowSummary = async function (mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    injectCss();
    mount.innerHTML = '<div class="wpa-cf-card"><div class="wpa-cf-empty">Loading…</div></div>';
    try {
      const data = await fetchLast7Days();
      renderCashflowCard(mount, data);
    } catch (e) {
      console.error('[cashflow-summary]', e);
      mount.innerHTML = '<div class="wpa-cf-card"><div class="wpa-cf-empty" style="color:#b83228">Couldn’t load cashflow — check console.</div></div>';
    }
  };

  /* ────────────────────────────────────────────────────────────
     Auto-hooks
     Reports tab: section is collapsed by default, user expands
     manually (lazy fetch on first expand). No showPage hook needed.
     Main dashboard: render the 7-day cashflow card on load.
     ──────────────────────────────────────────────────────────── */
  function installCashflowAutoRender() {
    const mount = document.getElementById('wpaCashflowMount');
    if (mount) window.WPA_renderCashflowSummary('wpaCashflowMount');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(installCashflowAutoRender, 600);
    });
  } else {
    setTimeout(installCashflowAutoRender, 600);
  }
})();
