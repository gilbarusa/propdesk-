/* ════════════════════════════════════════════════════════════
   Willow Universal Invoice Component
   ────────────────────────────────────────────────────────────
   One renderer for every charge in the app — rent, cleaning,
   work orders, parking, delivery. Matches invoice-preview.html.

   Public API:
     WPA_openInvoice(invoiceId)       — load from Supabase + open
     WPA_openInvoicePreview(typeHint) — demo with mock data
     WPA_closeInvoice()

   Depends on globals: CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Styles (injected once) ─────────────────────────────────
  const CSS = `
  .wpa-inv-ovr{position:fixed;inset:0;background:rgba(20,23,42,.55);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;animation:wpaInvFade .15s ease}
  @keyframes wpaInvFade{from{opacity:0}to{opacity:1}}
  .wpa-inv{position:relative;max-width:960px;width:100%;background:#fff;border-radius:12px;box-shadow:0 16px 48px rgba(26,42,122,.14),0 4px 16px rgba(26,42,122,.08);border:1px solid #d4dae6;overflow:hidden;font-family:'DM Mono',monospace;font-size:13px;color:#14172a}
  .wpa-inv-close{position:absolute;top:14px;right:14px;z-index:10;width:34px;height:34px;border-radius:50%;border:1px solid #d4dae6;background:#fff;cursor:pointer;font-size:16px;color:#4d5670;display:flex;align-items:center;justify-content:center;transition:all .15s}
  .wpa-inv-close:hover{background:#f5f7fb;color:#14172a;border-color:#b9c3d5}

  /* sticky bar */
  .wpa-inv .sticky-bar{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #d4dae6;padding:12px 40px;display:none;align-items:center;gap:24px;box-shadow:0 1px 4px rgba(26,42,122,.06);font-size:12px}
  .wpa-inv .sticky-bar.on{display:flex}
  .wpa-inv .sb-num{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#14172a}
  .wpa-inv .sb-sep{color:#8590a8}
  .wpa-inv .sb-due-lbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#8590a8}
  .wpa-inv .sb-due-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:#14172a;margin-left:10px}
  .wpa-inv .sb-status{margin-left:auto;padding:4px 12px;border:1.5px solid currentColor;border-radius:6px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase}
  .wpa-inv .sb-status.late,.wpa-inv .sb-status.open{color:#b83228}
  .wpa-inv .sb-status.paid{color:#1f7a4d}
  .wpa-inv .sb-status.partial{color:#3651b5}
  .wpa-inv .sb-status.pending{color:#b86818}
  .wpa-inv .sb-status.void{color:#8590a8}
  .wpa-inv .sb-status.draft{color:#4d5670;font-style:italic}

  /* header */
  .wpa-inv .inv-hd{background:linear-gradient(135deg,#ffffff 0%,#f3f6fc 60%,#e7edf8 100%);padding:32px 40px;position:relative;overflow:hidden;border-bottom:1px solid #d4dae6}
  .wpa-inv .inv-hd-inner{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:start;position:relative;z-index:1}
  .wpa-inv .inv-logo{display:flex;align-items:center;margin-bottom:18px}
  .wpa-inv .inv-logo img{height:60px;width:auto;display:block}
  .wpa-inv .inv-lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8590a8;font-weight:500;margin-bottom:6px}
  .wpa-inv .inv-num{font-family:'Playfair Display',serif;font-size:38px;font-weight:800;color:#14172a;line-height:1;letter-spacing:-1px}
  .wpa-inv .inv-addr{margin-top:14px;font-size:12px;color:#4d5670;line-height:1.5}
  .wpa-inv .inv-addr strong{color:#14172a;font-weight:600;display:block;margin-bottom:2px;font-size:13px}
  .wpa-inv .inv-dates{display:flex;gap:28px;margin-top:18px}
  .wpa-inv .inv-date-item .d-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8590a8;margin-bottom:3px;display:flex;align-items:center;gap:5px}
  .wpa-inv .inv-date-item .d-val{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:#14172a;letter-spacing:-.2px}
  .wpa-inv .inv-date-item .d-sub{font-size:10px;margin-top:2px;font-weight:500}
  .wpa-inv .inv-date-item .d-sub.late{color:#b83228}
  .wpa-inv .inv-date-item .d-sub.green{color:#1f7a4d}
  .wpa-inv .inv-date-item .d-sub.muted{color:#8590a8}
  .wpa-inv .stamp-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:10px}
  .wpa-inv .note-btn{background:#fff;border:1px solid #d4dae6;border-radius:8px;padding:7px 14px;font-size:11px;cursor:pointer;color:#4d5670;font-family:inherit;display:inline-flex;align-items:center;gap:6px;transition:all .15s}
  .wpa-inv .note-btn:hover{border-color:#3651b5;color:#3651b5;background:#eef1fb}
  .wpa-inv .note-btn .num{color:#8590a8;margin-left:4px}
  .wpa-inv .total-card{background:#fff;border:2px solid #3651b5;border-radius:12px;padding:14px 22px;min-width:240px;text-align:right;box-shadow:0 1px 4px rgba(26,42,122,.08);background-image:linear-gradient(135deg,#fff 0%,#eef1fb 100%)}
  .wpa-inv .total-card .tc-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8590a8;font-weight:500;margin-bottom:4px}
  .wpa-inv .total-card .tc-val{font-family:'Playfair Display',serif;font-size:32px;font-weight:800;color:#14172a;line-height:1;letter-spacing:-.5px}
  .wpa-inv .total-card .tc-sub{font-size:10px;color:#4d5670;margin-top:6px;letter-spacing:.2px}
  .wpa-inv .total-card.paid{border-color:#1f7a4d;background-image:linear-gradient(135deg,#fff 0%,#eaf6f0 100%)}
  .wpa-inv .stamp{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;padding:10px 22px;border:3px solid currentColor;border-radius:8px;transform:rotate(-6deg);display:inline-block;letter-spacing:1.5px;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5);background:rgba(255,255,255,.3)}
  .wpa-inv .stamp.late,.wpa-inv .stamp.open{color:#b83228}
  .wpa-inv .stamp.paid{color:#1f7a4d}
  .wpa-inv .stamp.pending{color:#b86818}
  .wpa-inv .stamp.partial{color:#3651b5}
  .wpa-inv .stamp.void{color:#8590a8}

  /* action bar */
  .wpa-inv .act-bar{display:flex;gap:10px;padding:18px 40px;background:#f5f7fb;border-bottom:1px solid #d4dae6;flex-wrap:wrap}
  .wpa-inv .act-bar .spacer{flex:1}
  .wpa-inv .wbtn{font-family:'DM Mono',monospace;font-size:12px;font-weight:500;letter-spacing:.3px;padding:9px 18px;border-radius:8px;border:1px solid #d4dae6;background:#fff;color:#14172a;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .15s}
  .wpa-inv .wbtn:hover{border-color:#3651b5;color:#3651b5;background:#eef1fb;transform:translateY(-1px);box-shadow:0 1px 4px rgba(26,42,122,.08)}
  .wpa-inv .wbtn.primary{background:#3651b5;color:#fff;border-color:#3651b5}
  .wpa-inv .wbtn.primary:hover{background:#6b7fd1;border-color:#6b7fd1;color:#fff}
  .wpa-inv .wbtn.danger{border-color:#eebfba;color:#b83228;background:#fff}
  .wpa-inv .wbtn.danger:hover{background:#fdf1f0;border-color:#b83228}
  .wpa-inv .wbtn.ghost{background:transparent;border-color:transparent;color:#4d5670}
  .wpa-inv .wbtn.ghost:hover{background:#eef1fb;color:#3651b5}

  /* strip */
  .wpa-inv .strip{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;padding:24px 40px;border-bottom:1px solid #d4dae6}
  .wpa-inv .strip .s-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8590a8;font-weight:500;margin-bottom:6px}
  .wpa-inv .strip .s-val{font-size:13px;color:#14172a;font-weight:500;line-height:1.5}

  /* sections */
  .wpa-inv .sec{padding:24px 40px;border-bottom:1px solid #d4dae6}
  .wpa-inv .sec.sec-items{background:#eef1fb}
  .wpa-inv .sec.sec-items .items thead th{background:#dfe6f6}
  .wpa-inv .sec.sec-items .items tbody tr{background:#fff}
  .wpa-inv .sec.sec-items .items tbody tr:hover{background:#f5f7fd}
  .wpa-inv .sec-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .wpa-inv .sec-hd h3{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#14172a;letter-spacing:-.2px;margin:0}
  .wpa-inv .sec-sub{font-size:11px;color:#8590a8;margin-top:2px}

  /* items */
  .wpa-inv table.items{width:100%;border-collapse:collapse;background:#fff}
  .wpa-inv table.items thead th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8590a8;font-weight:500;text-align:left;padding:10px 12px;border-bottom:2px solid #d4dae6;background:#f5f7fb}
  .wpa-inv table.items thead th.num{text-align:right}
  .wpa-inv table.items tbody td{padding:14px 12px;border-bottom:1px solid #d4dae6;font-size:13px;color:#14172a;vertical-align:top}
  .wpa-inv table.items tbody tr{transition:background .12s}
  .wpa-inv table.items tbody tr:hover{background:#f5f7fb}
  .wpa-inv table.items tbody tr:hover .row-act{opacity:1}
  .wpa-inv table.items tbody td.num{text-align:right;font-variant-numeric:tabular-nums}
  .wpa-inv table.items tbody td.amt{font-weight:700;color:#14172a}
  .wpa-inv table.items tbody td.amt.credit{color:#1f7a4d}
  .wpa-inv table.items tbody td .desc{color:#4d5670;font-size:12px;margin-top:3px}
  .wpa-inv table.items tbody td .item-name{font-weight:500}
  .wpa-inv table.items tbody td .item-tag{display:inline-block;font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;padding:2px 7px;border-radius:4px;margin-left:6px;vertical-align:middle}
  .wpa-inv .tag-rent{background:#eef1fb;color:#3651b5}
  .wpa-inv .tag-late{background:#fdf1f0;color:#b83228}
  .wpa-inv .tag-credit{background:#eaf6f0;color:#1f7a4d}
  .wpa-inv .tag-fee{background:#fdf3e8;color:#b86818}
  .wpa-inv .tag-misc{background:#f5f7fb;color:#4d5670}
  .wpa-inv .row-act{opacity:0;display:inline-flex;gap:4px;transition:opacity .12s}
  .wpa-inv .row-act button{background:transparent;border:none;font-size:12px;padding:3px 7px;border-radius:5px;color:#8590a8;cursor:pointer;transition:all .12s}
  .wpa-inv .row-act button:hover{background:#e6ebf3;color:#3651b5}
  .wpa-inv .row-act button.del:hover{background:#fdf1f0;color:#b83228}
  .wpa-inv .add-line{margin-top:12px;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:1px dashed #b9c3d5;border-radius:8px;background:transparent;color:#4d5670;font-family:inherit;font-size:12px;cursor:pointer;transition:all .15s}
  .wpa-inv .add-line:hover{border-color:#3651b5;color:#3651b5;background:#eef1fb;border-style:solid}

  /* payments */
  .wpa-inv .pay-card{background:#eaf6f0;border:1px solid #9ed2b8;border-radius:10px;overflow:hidden;margin-top:6px}
  .wpa-inv table.pays{width:100%;border-collapse:collapse}
  .wpa-inv table.pays thead th{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#1f7a4d;font-weight:600;text-align:left;padding:10px 14px;border-bottom:1px solid #9ed2b8}
  .wpa-inv table.pays thead th.num{text-align:right}
  .wpa-inv table.pays tbody td{padding:12px 14px;border-bottom:1px solid rgba(158,210,184,.4);font-size:12px;color:#14172a;vertical-align:middle}
  .wpa-inv table.pays tbody tr:last-child td{border-bottom:none}
  .wpa-inv table.pays tbody td.num{text-align:right;font-variant-numeric:tabular-nums;font-weight:600;color:#1f7a4d}
  .wpa-inv .method-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:4px;background:#fff;border:1px solid #9ed2b8;font-size:11px;font-weight:500;color:#1f7a4d}
  .wpa-inv .pay-foot{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:rgba(31,122,77,.06);font-size:12px;color:#1f7a4d;font-weight:500}
  .wpa-inv .pay-empty{padding:24px;text-align:center;color:#8590a8;font-size:12px}

  /* timeline */
  .wpa-inv .tl{position:relative;padding:8px 0;margin-top:6px}
  .wpa-inv .tl::before{content:'';position:absolute;left:70px;top:12px;bottom:12px;width:2px;background:#d4dae6}
  .wpa-inv .tl-row{display:grid;grid-template-columns:140px 1fr;gap:24px;padding:12px 0;position:relative;align-items:start}
  .wpa-inv .tl-pill{display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:6px;font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;border:1.5px solid currentColor;white-space:nowrap;background:#fff;z-index:1;position:relative}
  .wpa-inv .tl-pill.green{color:#1f7a4d;background:#eaf6f0;border-color:#9ed2b8}
  .wpa-inv .tl-pill.red{color:#b83228;background:#fdf1f0;border-color:#eebfba}
  .wpa-inv .tl-pill.orange{color:#b86818;background:#fdf3e8;border-color:#eecfa0}
  .wpa-inv .tl-pill.blue{color:#3651b5;background:#eef1fb;border-color:#c4cdeb}
  .wpa-inv .tl-when{font-size:11px;color:#8590a8;margin-bottom:3px;letter-spacing:.3px}
  .wpa-inv .tl-what{font-size:13px;color:#14172a;line-height:1.5}
  .wpa-inv .tl-what b{color:#14172a;font-weight:700}
  .wpa-inv .tl-who{font-size:11px;color:#4d5670;margin-top:3px;font-style:italic}

  /* totals */
  .wpa-inv .totals{padding:24px 40px 32px;background:#f5f7fb;display:flex;justify-content:flex-end}
  .wpa-inv .totals-grid{min-width:300px;font-variant-numeric:tabular-nums}
  .wpa-inv .totals-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#4d5670}
  .wpa-inv .totals-row.strong{color:#14172a;font-weight:500}
  .wpa-inv .totals-row.credit{color:#1f7a4d}
  .wpa-inv .totals-divider{border-top:1px solid #d4dae6;margin:10px 0}
  .wpa-inv .totals-row.grand{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#14172a;padding-top:10px;border-top:2px solid #3651b5;margin-top:6px}
  .wpa-inv .totals-row.grand .lbl{font-size:13px;text-transform:uppercase;letter-spacing:2px;font-family:'DM Mono',monospace;font-weight:500;align-self:center}

  .wpa-inv .loading{padding:80px;text-align:center;color:#8590a8;font-size:13px}

  @media (max-width:720px){
    .wpa-inv-ovr{padding:10px}
    .wpa-inv .inv-hd,.wpa-inv .strip,.wpa-inv .sec,.wpa-inv .totals,.wpa-inv .act-bar{padding-left:20px;padding-right:20px}
    .wpa-inv .inv-hd-inner{grid-template-columns:1fr;gap:20px}
    .wpa-inv .stamp-wrap{align-items:flex-start}
    .wpa-inv .strip{grid-template-columns:1fr;gap:16px}
    .wpa-inv .tl-row{grid-template-columns:1fr;gap:6px;padding:10px 0}
    .wpa-inv .tl::before{display:none}
    .wpa-inv .inv-num{font-size:28px}
  }
  `;

  function _injectCSS() {
    if (document.getElementById('wpa-inv-styles')) return;
    const s = document.createElement('style');
    s.id = 'wpa-inv-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ─── Helpers ────────────────────────────────────────────────
  const MONEY = n => {
    const v = Number(n || 0);
    return (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const FMT_DATE = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };
  const FMT_DATETIME = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) +
           ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  const _esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const DAYS_BETWEEN = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);
  // Resolve the invoice logo to an absolute URL. Admin deploys on
  // GitHub Pages sometimes under a subpath, so a bare relative
  // 'logo.png' fails. Prefer an explicit window.WPA_LOGO_URL, else
  // resolve relative to the current page.
  const _logoSrc = () => {
    if (window.WPA_LOGO_URL) return window.WPA_LOGO_URL;
    try { return new URL('logo.png', window.location.href).toString(); }
    catch (_) { return 'logo.png'; }
  };

  // ─── Supabase fetch helpers ─────────────────────────────────
  async function _sb(path) {
    const r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/' + path, {
      headers: { apikey: CONFIG.SUPABASE_KEY, Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY }
    });
    if (!r.ok) throw new Error('Supabase ' + r.status + ': ' + (await r.text()));
    return r.json();
  }

  // ─── Data loaders ───────────────────────────────────────────
  async function _loadInvoiceBundle(invoiceId) {
    const [invArr, lines, pays, remArr, tenArr] = await Promise.all([
      _sb('invoices?id=eq.' + invoiceId + '&select=*'),
      _sb('invoice_lines?invoice_id=eq.' + invoiceId + '&select=*&order=created_at.asc'),
      _sb('payments?invoice_id=eq.' + invoiceId + '&select=*&order=created_at.asc'),
      _sb('reminders_log?invoice_id=eq.' + invoiceId + '&select=*&order=sent_at.asc'),
      _sb('invoices?id=eq.' + invoiceId + '&select=tenant_id'),
    ]);
    if (!invArr.length) throw new Error('Invoice not found');
    const invoice = invArr[0];
    let tenant = null;
    if (tenArr[0] && tenArr[0].tenant_id) {
      const t = await _sb('tenants_lt?id=eq.' + tenArr[0].tenant_id + '&select=*');
      tenant = t[0] || null;
    }
    return { invoice, lines, payments: pays, reminders: remArr, tenant };
  }

  // ─── Status / display derivation ────────────────────────────
  function _deriveDisplayStatus(invoice) {
    // status from DB: draft | open | paid | partial | void
    // display: map open → 'late' if past due, else 'pending'
    const s = (invoice.status || 'open').toLowerCase();
    if (s === 'draft') return { key: 'draft', label: 'Draft' };
    if (s === 'paid') return { key: 'paid', label: 'Paid' };
    if (s === 'partial') return { key: 'partial', label: 'Partial' };
    if (s === 'void') return { key: 'void', label: 'Void' };
    // No due date yet (e.g. rent before lease entered) → show pending, no day math
    if (!invoice.due_date) return { key: 'pending', label: 'Pending', daysUntilDue: 0 };
    const days = DAYS_BETWEEN(invoice.due_date, new Date().toISOString().slice(0, 10));
    if (days > 0) return { key: 'late', label: 'Late', daysLate: days };
    if (days === 0) return { key: 'pending', label: 'Due Today', daysUntilDue: 0 };
    return { key: 'pending', label: 'Pending', daysUntilDue: -days };
  }

  // ─── Build timeline rows ────────────────────────────────────
  function _buildTimeline(b) {
    const rows = [];
    // Invoice created
    rows.push({
      when: b.invoice.created_at,
      pill: 'green',
      label: 'Invoice Created',
      body: 'Invoice generated for <b>' + _esc(MONEY(b.invoice.total)) + '</b> due <b>' + _esc(FMT_DATE(b.invoice.due_date)) + '</b>.',
      who: 'by System · auto-generated',
    });
    // Line items (excluding the initial rent line to avoid duplicate noise)
    b.lines.forEach(l => {
      if (l.kind === 'rent' && DAYS_BETWEEN(b.invoice.created_at, l.created_at) < 1) return;
      let pill = 'blue', label = 'Line Added';
      if (l.kind === 'late_fee') { pill = 'orange'; label = 'Late Fee Applied'; }
      else if (l.kind === 'credit') { pill = 'green'; label = 'Credit Applied'; }
      rows.push({
        when: l.created_at,
        pill, label,
        body: _esc(l.description) + ' — <b>' + _esc(MONEY(l.amount)) + '</b>',
        who: 'by ' + _esc(l.created_by || 'System'),
      });
    });
    // Payments — accept both 'paid' and 'succeeded' as terminal-paid
    // (portal writes 'paid', older rows may be 'succeeded').
    b.payments.forEach(p => {
      if (p.status !== 'succeeded' && p.status !== 'paid') return;
      const methodLbl = p.method === 'ach' ? 'ACH' : 'Credit Card';
      const piTag = p.stripe_payment_intent_id
        ? ' · <code style="font-size:11px;color:#4d5670">' + _esc(p.stripe_payment_intent_id) + '</code>'
        : '';
      const base = Number(p.amount || 0) || 0;
      const fee  = Number(p.surcharge_amount || 0) || 0;
      const charged = base + fee;
      // Fee breakdown in the Payment Received row when a card
      // surcharge was collected — matches the synthetic cc_fee line
      // item in the Line Items table so admins see the same number
      // everywhere (invoice = $2.00, card charged = $2.07).
      const feeNote = fee > 0.005
        ? ' (' + _esc(MONEY(base)) + ' invoice + ' + _esc(MONEY(fee)) + ' processing fee)'
        : '';
      rows.push({
        when: p.paid_at || p.created_at,
        pill: 'green',
        label: 'Payment Received',
        body: '<b>' + _esc(MONEY(charged)) + '</b> paid via ' + _esc(methodLbl) + feeNote + piTag,
        who: 'by Stripe',
      });
      // Synthetic "Line Added: Credit Card Fee" audit-trail row so
      // the history includes the fee alongside the rent / deposit
      // lines, mirroring the Line Items table.
      if (fee > 0.005) {
        rows.push({
          when: p.paid_at || p.created_at,
          pill: 'blue',
          label: 'Line Added',
          body: 'Credit Card Fee — <b>' + _esc(MONEY(fee)) + '</b> (3.5% processing fee on ' + _esc(MONEY(base)) + ')',
          who: 'by Stripe',
        });
      }
    });
    // Reminders
    b.reminders.forEach(r => {
      const offset = r.offset_days;
      const label = offset < 0 ? 'Pre-due reminder (-' + Math.abs(offset) + 'd)' :
                    offset === 0 ? 'Due-day reminder' :
                    'Overdue reminder (+' + offset + 'd)';
      rows.push({
        when: r.sent_at,
        pill: r.status === 'failed' ? 'red' : 'blue',
        label: 'Reminder ' + (r.status === 'failed' ? 'Failed' : 'Sent'),
        body: label + ' via ' + _esc(r.channel.toUpperCase()) + (r.error_message ? ' — <i>' + _esc(r.error_message) + '</i>' : ''),
        who: 'by System',
      });
    });
    return rows.sort((a, b) => new Date(b.when) - new Date(a.when));
  }

  // ─── HTML rendering ─────────────────────────────────────────
  function _renderBundle(b) {
    const inv = b.invoice;
    const tenant = b.tenant || {};
    const status = _deriveDisplayStatus(inv);
    // Derive paid from the payments table rather than inv.paid. The
    // Stripe webhook reliably updates invoices.status='paid' and writes
    // rows to payments, but the legacy invoices.paid column is not
    // always kept in sync. Accept both 'paid' and legacy 'succeeded'.
    const _isPaidRow = p => p.status === 'paid' || p.status === 'succeeded';
    const paid = (b.payments || [])
      .filter(_isPaidRow)
      .reduce((s, p) => s + Number(p.amount || 0), 0);
    const total = Number(inv.total || 0);
    const due = Math.max(0, total - paid);
    // Pass-through card processing fees collected on paid rows.
    const paidFees = (b.payments || [])
      .filter(_isPaidRow)
      .reduce((s, p) => s + Number(p.surcharge_amount || 0), 0);
    const paidCharged = paid + paidFees;
    // When the card surcharge is non-zero, display the invoice total
    // as amount + fee so the numbers reconcile with what Stripe
    // actually charged ($2.07 = $2.00 + $0.07).
    const invoiceTotalWithFee = total + paidFees;
    // Synthetic "Credit Card Fee" row per paid card payment that
    // carried a surcharge — renders in the Line Items table without
    // persisting to invoice_lines.
    const syntheticFeeLines = (b.payments || [])
      .filter(p => _isPaidRow(p) && Number(p.surcharge_amount || 0) > 0.005)
      .map(p => ({
        id:          '_ccfee_' + (p.id || p.stripe_payment_intent_id || ''),
        kind:        'cc_fee',
        item_label:  'Credit Card Fee',
        description: '3.5% processing fee on ' + MONEY(Number(p.amount || 0)),
        amount:      Number(p.surcharge_amount || 0),
        created_at:  p.paid_at || p.created_at,
        created_by:  'Stripe',
        day_offset:  1,
        _synthetic:  true
      }));
    const renderedLines = b.lines.concat(syntheticFeeLines);
    const ccFeeSum = paidFees;
    const sumByKind = k => b.lines.filter(l => l.kind === k).reduce((s, l) => s + Number(l.amount), 0);
    const rentSum = sumByKind('rent');
    const lateSum = sumByKind('late_fee');
    const creditSum = sumByKind('credit'); // negative
    const miscSum = sumByKind('misc');
    const subjectText = _esc(inv.subject || inv.notes || ('Rent due ' + FMT_DATE(inv.due_date)));
    const invNum = inv._is_pr
      ? _esc(inv.invoice_number || 'SERVICE')
      : (inv.id ? ('WPA-' + inv.id.slice(0, 8).toUpperCase()) : '—');
    const tenantName = _esc(tenant.name || '—');
    const tenantContact = [tenant.email, tenant.phone].filter(Boolean).map(_esc).join(' · ');
    const remindersSent = b.reminders.filter(r => r.status === 'sent').length;

    const dueSub =
      status.key === 'late'   ? { cls: 'late',  txt: status.daysLate + ' days late' } :
      status.key === 'paid'   ? { cls: 'green', txt: 'Paid in full' } :
      status.key === 'partial'? { cls: 'late',  txt: MONEY(due) + ' remaining' } :
      status.key === 'void'   ? { cls: 'muted', txt: 'Voided' } :
                                { cls: 'muted', txt: 'Due in ' + (status.daysUntilDue || 0) + ' days' };

    return `
      <button class="wpa-inv-close" onclick="WPA_closeInvoice()" title="Close">✕</button>

      <div class="sticky-bar" id="wpaSticky">
        <span class="sb-num">${_esc(invNum)}</span>
        <span class="sb-sep">·</span>
        <span>${subjectText}</span>
        <span class="sb-sep">·</span>
        <span class="sb-due-lbl">Total Due</span>
        <span class="sb-due-val">${_esc(MONEY(due))}</span>
        <span class="sb-status ${status.key}">${_esc(status.label)}</span>
      </div>

      <div class="inv-hd">
        <div class="inv-hd-inner">
          <div>
            <div class="inv-logo"><img src="${_esc(_logoSrc())}" alt="Willow Partnership" onerror="this.style.display='none'"></div>
            <div class="inv-lbl">Invoice</div>
            <div class="inv-num">${_esc(invNum)}</div>
            <div class="inv-addr">
              <strong>${_esc(inv.property || '')}${inv.unit ? ' · Unit ' + _esc(inv.unit) : ''}</strong>
            </div>
            <div class="inv-dates">
              <div class="inv-date-item">
                <div class="d-lbl">📄 Generated</div>
                <div class="d-val">${_esc(FMT_DATE(inv.created_at))}</div>
                <div class="d-sub muted">${remindersSent} reminder(s) sent</div>
              </div>
              <div class="inv-date-item">
                <div class="d-lbl">💰 Due</div>
                <div class="d-val">${_esc(FMT_DATE(inv.due_date))}</div>
                <div class="d-sub ${dueSub.cls}">${_esc(dueSub.txt)}</div>
              </div>
            </div>
          </div>
          <div class="stamp-wrap">
            ${_viewMode === 'admin' ? `<button class="note-btn" onclick="WPA_invoiceAddNote('${_esc(inv.id)}')">➕ Add Note <span class="num">· ${(inv.notes ? 1 : 0)}</span></button>` : ''}
            <div class="total-card ${status.key === 'paid' ? 'paid' : ''}">
              <div class="tc-lbl">Total Due</div>
              <div class="tc-val">${_esc(MONEY(due))}</div>
              <div class="tc-sub">of ${_esc(MONEY(invoiceTotalWithFee))} invoice · ${_esc(MONEY(paidCharged))} paid</div>
            </div>
            <div class="stamp ${status.key}">${_esc(status.label)}</div>
          </div>
        </div>
      </div>

      ${(_viewMode === 'client' || _viewMode === 'client-pr') ? `
      <div class="act-bar">
        <button class="wbtn" onclick="WPA_invoiceDownload('${_esc(inv.id)}')"><span>⬇</span> Download PDF</button>
        <div class="spacer"></div>
        ${status.key === 'paid' ? `
          <span style="padding:9px 18px;color:#1f7a4d;font-weight:600;font-size:12px;">
            ✓ Paid in full — thank you${paidFees > 0.005 ? ` <span style="color:#4d5670;font-weight:500">· ${_esc(MONEY(paidCharged))} charged (${_esc(MONEY(paid))} + ${_esc(MONEY(paidFees))} processing fee)</span>` : ''}
          </span>
        ` : status.key === 'void' ? `
          <span style="padding:9px 18px;color:#8590a8;font-weight:600;font-size:12px;">${inv._is_pr ? 'This request has been cancelled' : 'This invoice has been voided'}</span>
        ` : inv._is_pr ? `
          <button class="wbtn primary" style="font-size:13px;padding:11px 22px;" onclick="WPA_payViaPayPhp('${_esc(inv._pr_id)}')">💳 Pay ${_esc(MONEY(due))}</button>
        ` : `
          <button class="wbtn primary" style="font-size:13px;padding:11px 22px;" onclick="WPA_startPayment('${_esc(inv.id)}')">💳 Pay ${_esc(MONEY(due))}</button>
        `}
      </div>
      ` : `
      <div class="act-bar">
        <button class="wbtn" onclick="WPA_invoiceDownload('${_esc(inv.id)}')"><span>⬇</span> Download PDF</button>
        <button class="wbtn primary" onclick="WPA_invoiceSendReminder('${_esc(inv.id)}')"><span>📧</span> Send Reminder</button>
        <button class="wbtn" onclick="WPA_invoiceRecordPayment('${_esc(inv.id)}')"><span>💳</span> Record Payment</button>
        <div class="spacer"></div>
        <button class="wbtn ghost" title="See how the tenant sees this invoice" onclick="WPA_openInvoice('${_esc(inv.id)}',{mode:'client'})"><span>👁</span> Preview as Client</button>
        <button class="wbtn ghost" onclick="WPA_invoiceEdit('${_esc(inv.id)}')"><span>✏️</span> Edit</button>
        <button class="wbtn danger" onclick="WPA_invoiceDelete('${_esc(inv.id)}')"><span>🗑</span> Delete</button>
      </div>
      `}

      <div class="strip">
        <div><div class="s-lbl">Subject</div><div class="s-val">${subjectText}</div></div>
        <div><div class="s-lbl">Billed To</div><div class="s-val">${tenantName}${tenantContact ? '<br><span style="color:#4d5670;font-weight:400;font-size:12px">' + tenantContact + '</span>' : ''}</div></div>
        <div><div class="s-lbl">Property / Unit</div><div class="s-val">${_esc(inv.property || '')}${inv.unit ? '<br><span style="color:#4d5670;font-weight:400;font-size:12px">Unit ' + _esc(inv.unit) + '</span>' : ''}</div></div>
      </div>

      <div class="sec sec-items">
        <div class="sec-hd"><div><h3>Line Items</h3><div class="sec-sub">${renderedLines.length} charge${renderedLines.length === 1 ? '' : 's'}</div></div></div>
        <table class="items">
          <thead><tr><th style="width:30%">Item</th><th>Description</th><th class="num" style="width:80px">Qty</th><th class="num" style="width:110px">Rate</th><th class="num" style="width:120px">Amount</th><th style="width:60px"></th></tr></thead>
          <tbody>
            ${renderedLines.map(l => _renderLineRow(l)).join('') || '<tr><td colspan="6" class="pay-empty">No line items yet</td></tr>'}
          </tbody>
        </table>
        ${_viewMode === 'admin' ? `<button class="add-line" onclick="WPA_invoiceAddLine('${_esc(inv.id)}')">＋ Add Line Item</button>` : ''}
      </div>

      <div class="sec">
        <div class="sec-hd"><div><h3>Payments Received</h3><div class="sec-sub">${b.payments.filter(_isPaidRow).length} payment(s) · ${_esc(MONEY(paidCharged))} charged${paidFees > 0.005 ? ' (incl. ' + _esc(MONEY(paidFees)) + ' processing fee)' : ''}</div></div></div>
        ${b.payments.length ? _renderPaymentsCard(b.payments) : '<div class="pay-card"><div class="pay-empty">No payments recorded yet.</div></div>'}
      </div>

      ${_viewMode === 'admin' ? `
      <div class="sec">
        <div class="sec-hd"><div><h3>Invoice History</h3><div class="sec-sub">Audit trail — all actions on this invoice</div></div></div>
        <div class="tl">${_buildTimeline(b).map(r => _renderTimelineRow(r)).join('')}</div>
      </div>` : ''}

      <div class="totals">
        <div class="totals-grid">
          ${rentSum ? `<div class="totals-row"><span>Rent</span><span>${_esc(MONEY(rentSum))}</span></div>` : ''}
          ${lateSum ? `<div class="totals-row"><span>Late fees</span><span>${_esc(MONEY(lateSum))}</span></div>` : ''}
          ${miscSum ? `<div class="totals-row"><span>Other</span><span>${_esc(MONEY(miscSum))}</span></div>` : ''}
          ${creditSum ? `<div class="totals-row credit"><span>Credits</span><span>${_esc(MONEY(creditSum))}</span></div>` : ''}
          ${ccFeeSum > 0.005 ? `
            <div class="totals-row"><span>Invoice subtotal</span><span>${_esc(MONEY(total))}</span></div>
            <div class="totals-row"><span>Credit card fee (3.5%)</span><span>${_esc(MONEY(ccFeeSum))}</span></div>
            <div class="totals-row strong"><span>Invoice total</span><span>${_esc(MONEY(invoiceTotalWithFee))}</span></div>
          ` : `
            <div class="totals-row strong"><span>Invoice total</span><span>${_esc(MONEY(total))}</span></div>
          `}
          ${paid ? `<div class="totals-row credit"><span>Payments received</span><span>${_esc(MONEY(-(paid + ccFeeSum)))}</span></div>` : ''}
          <div class="totals-divider"></div>
          <div class="totals-row grand"><span class="lbl">Total Due</span><span>${_esc(MONEY(due))}</span></div>
        </div>
      </div>
    `;
  }

  function _renderLineRow(l) {
    const kind = l.kind || 'misc';
    const tagCls = 'tag-' + kind.replace('_', '-');
    const tagLabel = { rent:'Rent', late_fee:'Late', credit:'Credit', misc:'Fee', service:'Service', cc_fee:'CC Fee' }[kind] || 'Fee';
    const itemName = l.item_label || tagLabel;
    const amtCls = Number(l.amount) < 0 ? 'amt credit' : 'amt';
    const qty = l.day_offset || 1;
    const rate = qty ? Number(l.amount) / qty : Number(l.amount);
    // Synthetic lines (cc_fee reconstructed from payments.surcharge_amount)
    // are read-only — no invoice_lines row exists to edit or remove.
    // Also suppress the "Added by" desc since there's no real audit
    // trail for the synthetic row.
    const isSynthetic = !!l._synthetic;
    return `
      <tr>
        <td><span class="item-name">${_esc(itemName)}</span><span class="item-tag ${tagCls}">${_esc(tagLabel)}</span></td>
        <td><div>${_esc(l.description || '')}</div>${!isSynthetic && l.created_by ? '<div class="desc">Added by ' + _esc(l.created_by) + ' · ' + _esc(FMT_DATE(l.created_at)) + '</div>' : ''}</td>
        <td class="num">${qty}</td>
        <td class="num">${_esc(MONEY(rate))}</td>
        <td class="num ${amtCls}">${_esc(MONEY(l.amount))}</td>
        <td>${(_viewMode === 'admin' && !isSynthetic) ? `<div class="row-act"><button onclick="WPA_invoiceEditLine('${_esc(l.id)}')">✏️</button><button class="del" onclick="WPA_invoiceRemoveLine('${_esc(l.id)}')">✕</button></div>` : ''}</td>
      </tr>`;
  }

  function _renderPaymentsCard(payments) {
    // Accept both 'paid' and 'succeeded' as terminal-paid states.
    // Amount column shows total charged to card (amount + surcharge),
    // with a breakdown subtext when a non-zero fee was collected —
    // matches the portal's post-2026-04-20 behavior so the admin
    // view reconciles with what Stripe captured ($2.07, not $2.00).
    const _isPaid = p => p.status === 'paid' || p.status === 'succeeded';
    const rows = payments.map(p => {
      const methodIcon = p.method === 'ach' ? '🏦' : '💳';
      const methodLbl = p.method === 'ach' ? 'ACH' : 'Credit Card';
      const stripeRef = (_viewMode === 'admin' && p.stripe_payment_intent_id)
        ? ' · <code style="font-size:10px;color:#4d5670">' + _esc(p.stripe_payment_intent_id) + '</code>' : '';
      const statusBadge = !_isPaid(p) ? ` <span style="color:#b86818;font-size:10px;text-transform:uppercase;">(${_esc(p.status)})</span>` : '';
      const base  = Number(p.amount || 0) || 0;
      const fee   = Number(p.surcharge_amount || 0) || 0;
      const total = base + fee;
      const amtCell = fee > 0.005
        ? `<b>${_esc(MONEY(total))}</b>`
          + `<div style="font-size:11px;color:#4d5670;font-weight:400;margin-top:2px;white-space:nowrap">`
          +   `${_esc(MONEY(base))} + ${_esc(MONEY(fee))} fee`
          + `</div>`
        : _esc(MONEY(base));
      return `<tr>
        <td><b>${_esc(p.payer_name || 'Tenant')}</b></td>
        <td>${_esc(FMT_DATETIME(p.created_at))}</td>
        <td>${_esc(p.paid_at ? FMT_DATE(p.paid_at) : '—')}${statusBadge}</td>
        <td><span class="method-pill">${methodIcon} ${methodLbl}${stripeRef}</span></td>
        <td class="num">${amtCell}</td>
        <td>${_viewMode === 'admin' ? `<button class="wbtn ghost" style="padding:4px 10px;font-size:11px" onclick="WPA_invoiceRemovePayment('${_esc(p.id)}')">Remove</button>` : ''}</td>
      </tr>`;
    }).join('');
    const paidOnly = payments.filter(_isPaid);
    const baseSum = paidOnly.reduce((s, p) => s + Number(p.amount || 0), 0);
    const feeSum  = paidOnly.reduce((s, p) => s + Number(p.surcharge_amount || 0), 0);
    const totalSum = baseSum + feeSum;
    const footBreakdown = (feeSum > 0.005)
      ? `<div class="pay-foot" style="padding-top:2px;font-size:11px;color:#4d5670;font-weight:400">`
        +   `<span>Applied to invoice ${_esc(MONEY(baseSum))} · Processing fee ${_esc(MONEY(feeSum))}</span>`
        +   `<span></span>`
        + `</div>`
      : '';
    return `
      <div class="pay-card">
        <table class="pays">
          <thead><tr><th>Payer</th><th>Submitted</th><th>Deposited</th><th>Method</th><th class="num">Amount</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="pay-foot"><span>${feeSum > 0.005 ? 'Total charged to card' : 'Total received'}</span><span>${_esc(MONEY(totalSum))}</span></div>
        ${footBreakdown}
      </div>`;
  }

  function _renderTimelineRow(r) {
    return `
      <div class="tl-row">
        <div><span class="tl-pill ${r.pill}">${_esc(r.label)}</span></div>
        <div>
          <div class="tl-when">${_esc(FMT_DATETIME(r.when))}</div>
          <div class="tl-what">${r.body}</div>
          <div class="tl-who">${_esc(r.who || '')}</div>
        </div>
      </div>`;
  }

  // ─── Modal controls ─────────────────────────────────────────
  function _openOverlay(innerHTML) {
    _injectCSS();
    let ovr = document.getElementById('wpaInvOverlay');
    if (ovr) ovr.remove();
    ovr = document.createElement('div');
    ovr.id = 'wpaInvOverlay';
    ovr.className = 'wpa-inv-ovr';
    ovr.innerHTML = '<div class="wpa-inv" id="wpaInvBox">' + innerHTML + '</div>';
    ovr.addEventListener('click', e => { if (e.target === ovr) WPA_closeInvoice(); });
    document.body.appendChild(ovr);
    document.body.style.overflow = 'hidden';
    // sticky behavior
    const box = document.getElementById('wpaInvBox');
    const sticky = document.getElementById('wpaSticky');
    if (box && sticky) {
      ovr.addEventListener('scroll', () => sticky.classList.toggle('on', ovr.scrollTop > 240));
    }
  }

  window.WPA_closeInvoice = function () {
    const ovr = document.getElementById('wpaInvOverlay');
    if (ovr) ovr.remove();
    document.body.style.overflow = '';
  };

  // Module-level view mode — 'admin' (default, full controls + history + bank)
  // or 'client' (resident portal: read-only invoice + Pay button).
  let _viewMode = 'admin';
  let _viewInvoiceId = null;

  window.WPA_openInvoice = async function (invoiceId, opts) {
    opts = opts || {};
    _viewMode = (opts.mode === 'client') ? 'client' : 'admin';
    _viewInvoiceId = invoiceId;
    _openOverlay('<div class="loading">Loading invoice…</div>');
    try {
      const bundle = await _loadInvoiceBundle(invoiceId);
      document.getElementById('wpaInvBox').innerHTML = _renderBundle(bundle);
      // rewire sticky scroll after re-render
      const ovr = document.getElementById('wpaInvOverlay');
      const sticky = document.getElementById('wpaSticky');
      if (ovr && sticky) ovr.addEventListener('scroll', () => sticky.classList.toggle('on', ovr.scrollTop > 240));
    } catch (e) {
      document.getElementById('wpaInvBox').innerHTML = '<div class="loading" style="color:#b83228">Failed to load invoice<br><br>' + _esc(e.message) + '</div>';
    }
  };

  // ─── Payment Request → invoice-shaped view ──────────────────
  // Opens a payment_requests row in the same modal as a regular invoice.
  // The Pay button routes to /pay.php to keep the existing tip + Stripe flow.
  window.WPA_openPaymentRequest = async function (prId, opts) {
    opts = opts || {};
    _viewMode = 'client-pr';   // special mode: read-only + redirect Pay to pay.php
    _viewInvoiceId = 'pr:' + prId;
    _openOverlay('<div class="loading">Loading payment request…</div>');
    try {
      const prArr = await _sb('payment_requests?id=eq.' + prId + '&select=*');
      if (!prArr.length) throw new Error('Payment request not found');
      const pr = prArr[0];
      const bundle = _prToBundle(pr);
      document.getElementById('wpaInvBox').innerHTML = _renderBundle(bundle);
      const ovr = document.getElementById('wpaInvOverlay');
      const sticky = document.getElementById('wpaSticky');
      if (ovr && sticky) ovr.addEventListener('scroll', () => sticky.classList.toggle('on', ovr.scrollTop > 240));
    } catch (e) {
      document.getElementById('wpaInvBox').innerHTML = '<div class="loading" style="color:#b83228">Failed to load<br><br>' + _esc(e.message) + '</div>';
    }
  };

  function _prToBundle(pr) {
    // Map payment_requests row to the invoice-bundle shape the modal expects.
    const total = Number(pr.amount || 0);
    const paid  = pr.status === 'paid' ? total : 0;
    const rawDesc = String(pr.description || 'Service');
    const descLines = rawDesc.split('\n').map(s => s.trim()).filter(Boolean);
    const title = descLines[0] || 'Service';
    // Build line items from description "key: value" lines
    const lines = [];
    if (descLines.length > 1) {
      for (let i = 1; i < descLines.length; i++) {
        const m = descLines[i].match(/^([^:]+):\s*(.+)$/);
        if (m) {
          const v = m[2].trim();
          const amt = parseFloat(v.replace(/[^0-9.\-]/g, '')) || 0;
          lines.push({
            id: 'pr-' + i,
            kind: 'service',
            item_label: m[1].trim(),
            description: '',
            amount: amt || 0,
            sort_order: i
          });
        } else {
          lines.push({ id: 'pr-' + i, kind: 'service', item_label: descLines[i], description: '', amount: 0, sort_order: i });
        }
      }
    } else {
      lines.push({ id: 'pr-1', kind: 'service', item_label: title, description: '', amount: total, sort_order: 1 });
    }
    const invoice = {
      id: 'pr:' + pr.id,
      _pr_id: pr.id,
      _is_pr: true,
      invoice_number: pr.wo_number ? ('WO-' + pr.wo_number) : ('PR-' + String(pr.id).slice(0, 8)),
      subject: title,
      property: pr.property || '',
      unit: pr.unit || '',
      period_month: null,
      due_date: pr.due_date || (pr.created_at ? String(pr.created_at).slice(0,10) : null),
      created_at: pr.created_at,
      total: total,
      paid: paid,
      total_amount: total,
      amount_paid: paid,
      status: pr.status === 'paid' ? 'paid' : (pr.status === 'cancelled' ? 'void' : 'open'),
      notes: null
    };
    return { invoice, lines, payments: [], reminders: [], tenant: null };
  }

  // ─── Preview mode (mock data, no Supabase) ─────────────────
  const _MOCK = {
    rent: {
      invoice: { id:'a1b2c3d4-e5f6-7890-abcd-ef1234567890', property:'37 North York Road', unit:'311', due_date:'2026-04-01', created_at:'2026-03-17T12:00:00Z', status:'partial', total:2430, paid:2000, notes:'Rent due April 1, 2026' },
      tenant: { name:'Alena Larina', email:'alena.larina@example.com', phone:'(267) 555-0199' },
      lines: [
        { id:'l1', kind:'rent', description:'Monthly rent — April 2026', amount:2300, day_offset:null, created_at:'2026-03-17T12:00:00Z', created_by:'System' },
        { id:'l2', kind:'late_fee', description:'Daily late fee after 5-day grace period', amount:180, day_offset:6, created_at:'2026-04-07T00:53:00Z', created_by:'System' },
        { id:'l3', kind:'credit', description:'Goodwill credit — HVAC service delay', amount:-50, day_offset:null, created_at:'2026-04-10T15:30:00Z', created_by:'Ekaterina Shakhova' },
      ],
      payments: [
        { id:'p1', amount:1000, method:'ach', status:'succeeded', stripe_payment_intent_id:'pi_3N4Kq2ABC', paid_at:'2026-04-03T13:50:00Z', created_at:'2026-04-03T13:50:00Z', payer_name:'Alena Larina' },
        { id:'p2', amount:1000, method:'card', status:'succeeded', stripe_payment_intent_id:'pi_3N8Lb7XYZ', paid_at:'2026-04-08T18:14:00Z', created_at:'2026-04-08T18:14:00Z', payer_name:'Alena Larina' },
      ],
      reminders: [
        { id:'r1', channel:'email', offset_days:-5, sent_at:'2026-03-27T12:42:00Z', status:'sent' },
        { id:'r2', channel:'email', offset_days:0, sent_at:'2026-04-01T12:57:00Z', status:'sent' },
        { id:'r3', channel:'sms', offset_days:0, sent_at:'2026-04-01T12:57:00Z', status:'sent' },
      ],
    },
  };

  window.WPA_openInvoicePreview = function (type, ctx) {
    const b = JSON.parse(JSON.stringify(_MOCK[type || 'rent'] || _MOCK.rent));
    // Override preview bundle with real tenant context (when opened from tenant card)
    if (ctx && typeof ctx === 'object') {
      if (ctx.tenantName) {
        b.tenant.name = ctx.tenantName;
        b.tenant.email = (ctx.tenantName.toLowerCase().split(' ')[0] || 'tenant') + '@example.com';
      }
      if (ctx.property) b.invoice.property = ctx.property;
      if (ctx.unit) b.invoice.unit = ctx.unit;
      if (typeof ctx.rent === 'number' && ctx.rent > 0) {
        // Re-scale line amounts to this tenant's rent
        const oldRent = b.lines.find(l => l.kind === 'rent')?.amount || 2300;
        const rentLine = b.lines.find(l => l.kind === 'rent');
        if (rentLine) rentLine.amount = ctx.rent;
        const lateLine = b.lines.find(l => l.kind === 'late_fee');
        // proportionally scale late fee & credit
        if (lateLine) lateLine.amount = Math.round(lateLine.amount * (ctx.rent / oldRent));
        b.invoice.total = b.lines.reduce((s, l) => s + (l.amount || 0), 0);
        // keep ~80% paid ratio so partial status stays meaningful
        b.invoice.paid = Math.min(b.invoice.paid, Math.max(0, b.invoice.total - 100));
        const ratio = b.invoice.paid / (b.payments.reduce((s,p)=>s+p.amount,0) || 1);
        b.payments.forEach(p => p.amount = Math.round(p.amount * ratio));
        b.payments.forEach(p => { if (ctx.tenantName) p.payer_name = ctx.tenantName; });
      } else if (ctx.tenantName) {
        b.payments.forEach(p => p.payer_name = ctx.tenantName);
      }
    }
    _openOverlay(_renderBundle(b));
    const ovr = document.getElementById('wpaInvOverlay');
    const sticky = document.getElementById('wpaSticky');
    if (ovr && sticky) ovr.addEventListener('scroll', () => sticky.classList.toggle('on', ovr.scrollTop > 240));
  };

  // ─── Send Reminder (real) ───────────────────────────────────
  window.WPA_invoiceSendReminder = async function (id) {
    if (!id) return;
    if (!confirm('Send rent-invoice email to the tenant on file?')) return;
    const endpoint = (window.WPA_PORTAL_URL || 'https://app.willowpa.com/portal')
                   + '/api/send-rent-invoice.php';
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'invoice_id=' + encodeURIComponent(id)
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) {
        alert('Could not send: ' + (j.error || r.statusText || 'unknown error'));
        return;
      }
      alert('Sent to ' + j.to);
      // Refresh the open invoice to pick up the new reminders_log row
      if (typeof WPA_openInvoice === 'function' && document.getElementById('wpaInvOverlay')) {
        WPA_openInvoice(id);
      }
    } catch (e) {
      alert('Send failed: ' + e.message);
    }
  };

  // ─── Download stub (still placeholder) ──────────────────────
  // Everything else (AddNote, RecordPayment, Edit, Delete, AddLine,
  // EditLine, RemoveLine, RemovePayment) is wired for real below in
  // the Phase-9 block.
  if (!window.WPA_invoiceDownload) {
    window.WPA_invoiceDownload = function (id) {
      alert('Download PDF → ' + (id || '') + '\n\nPDF rendering is not wired yet.');
    };
  }

  // ─── Press Esc to close ─────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('wpaInvListOverlay')) WPA_closeInvoiceList();
      else if (document.getElementById('wpaInvOverlay')) WPA_closeInvoice();
    }
  });

  /* ════════════════════════════════════════════════════════════
     INVOICE LIST — Innago-style table with hover summary popover
     ──────────────────────────────────────────────────────────── */

  const LIST_CSS = `
  .wpa-il-ovr{position:fixed;inset:0;background:rgba(20,23,42,.55);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;animation:wpaInvFade .15s ease}
  .wpa-il{position:relative;max-width:1180px;width:100%;background:#fff;border-radius:12px;box-shadow:0 16px 48px rgba(26,42,122,.14);border:1px solid #d4dae6;overflow:hidden;font-family:'DM Mono',monospace;font-size:13px;color:#14172a}
  .wpa-il-close{position:absolute;top:14px;right:14px;z-index:10;width:34px;height:34px;border-radius:50%;border:1px solid #d4dae6;background:#fff;cursor:pointer;font-size:16px;color:#4d5670;display:flex;align-items:center;justify-content:center}
  .wpa-il-close:hover{background:#f5f7fb}
  .wpa-il-head{background:linear-gradient(135deg,#eef1fb 0%,#dfe6f6 100%);border-bottom:1px solid #c4cdeb;padding:28px 40px 22px}
  .wpa-il-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;color:#14172a;margin:0}
  .wpa-il-sub{color:#4d5670;font-size:12px;margin-top:6px;letter-spacing:.3px}
  .wpa-il-kpis{display:flex;gap:28px;margin-top:18px}
  .wpa-il-kpi{flex:0 0 auto}
  .wpa-il-kpi .k-lbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#4d5670;margin-bottom:4px}
  .wpa-il-kpi .k-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:#14172a}
  .wpa-il-kpi .k-val.overdue{color:#b83228}
  .wpa-il-filters{display:flex;gap:8px;padding:14px 40px;border-bottom:1px solid #d4dae6;background:#f5f7fb;flex-wrap:wrap}
  .wpa-il-chip{background:#fff;border:1px solid #d4dae6;border-radius:16px;padding:5px 14px;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;color:#4d5670;transition:all .1s}
  .wpa-il-chip:hover{border-color:#3651b5;color:#3651b5}
  .wpa-il-chip.on{background:#14172a;border-color:#14172a;color:#fff}
  .wpa-il-table{width:100%;border-collapse:collapse;font-size:12px}
  .wpa-il-table thead th{background:#dfe6f6;color:#14172a;font-size:10px;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;padding:11px 18px;text-align:left;border-bottom:1px solid #c4cdeb;position:sticky;top:0}
  .wpa-il-table thead th.num{text-align:right}
  .wpa-il-table tbody tr{border-bottom:1px solid #eef1f7;cursor:pointer;transition:background .1s}
  .wpa-il-table tbody tr:hover{background:#eef1fb}
  .wpa-il-table tbody td{padding:13px 18px;vertical-align:middle}
  .wpa-il-table tbody td.num{text-align:right;font-family:'Playfair Display',serif;font-weight:700;font-size:14px}
  .wpa-il-table tbody td.num.red{color:#b83228}
  .wpa-il-table tbody td.inv-num{font-weight:700;color:#3651b5;font-size:12.5px}
  .wpa-il-table tbody td.subj{color:#14172a}
  .wpa-il-pill{display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;border:1px solid currentColor}
  .wpa-il-pill.paid{color:#1f7a4d;background:#eaf6f0;border-color:#9ed2b8}
  .wpa-il-pill.open,.wpa-il-pill.upcoming{color:#b86818;background:#fdf3e8;border-color:#eecfa0}
  .wpa-il-pill.late,.wpa-il-pill.overdue{color:#b83228;background:#fdf1f0;border-color:#eebfba}
  .wpa-il-pill.partial{color:#3651b5;background:#eef1fb;border-color:#c4cdeb}
  .wpa-il-pill.void{color:#8590a8;background:#f5f7fb;border-color:#d4dae6}
  .wpa-il-pill.draft{color:#4d5670;background:#f5f7fb;border-color:#c4cdeb;font-style:italic}
  .wpa-il-empty{padding:50px 20px;text-align:center;color:#8590a8;font-style:italic}
  /* hover popover */
  .wpa-il-pop{position:fixed;z-index:9200;background:#fff;border:1px solid #c4cdeb;border-radius:10px;box-shadow:0 8px 24px rgba(20,23,42,.18);padding:14px 16px;min-width:260px;font-size:11.5px;pointer-events:none;opacity:0;transform:translateY(-4px);transition:opacity .12s}
  .wpa-il-pop.on{opacity:1;transform:translateY(0)}
  .wpa-il-pop .p-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:800;color:#14172a;margin-bottom:10px;border-bottom:1px solid #eef1f7;padding-bottom:8px}
  .wpa-il-pop .p-row{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:#4d5670}
  .wpa-il-pop .p-row b{color:#14172a;font-weight:700}
  .wpa-il-pop .p-edit{margin-top:10px;padding-top:8px;border-top:1px solid #eef1f7;color:#3651b5;font-size:11px;font-weight:600}
  `;

  function _injectListCSS() {
    if (document.getElementById('wpaInvListCSS')) return;
    const s = document.createElement('style');
    s.id = 'wpaInvListCSS';
    s.textContent = LIST_CSS;
    document.head.appendChild(s);
  }

  // ── Mock invoice series generator (LT: full range, MTM: all past + next) ──
  function _genSeries(ctx) {
    // ctx: {tenantName, property, unit, rent, leaseStart, leaseEnd, leaseType}
    const rent = Number(ctx.rent) || 2000;
    const leaseType = (ctx.leaseType || 'lt').toLowerCase();
    const now = new Date();
    now.setHours(0,0,0,0);

    // parse or default
    const start = ctx.leaseStart ? new Date(ctx.leaseStart) : new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const end = (leaseType === 'mtm') ? null : (ctx.leaseEnd ? new Date(ctx.leaseEnd) : new Date(now.getFullYear() + 1, now.getMonth(), 1));

    const rows = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);

    // stop condition
    function done(d) {
      if (leaseType === 'mtm') {
        // keep through next month
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return d.getTime() > nextMonth.getTime();
      }
      return end && d.getTime() > end.getTime();
    }

    let i = 0;
    while (!done(cur)) {
      const dueDate = new Date(cur.getFullYear(), cur.getMonth(), 1);
      const isPast = dueDate.getTime() < now.getTime();
      const isFarFuture = dueDate.getTime() > new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
      const daysLate = Math.floor((now.getTime() - dueDate.getTime()) / 86400000);

      let status, paid;
      if (isFarFuture) {
        status = 'upcoming'; paid = 0;
      } else if (isPast && daysLate > 30) {
        status = 'paid'; paid = rent; // assume old ones paid
      } else if (isPast && daysLate > 5) {
        // recently late — random partial/paid/late
        const roll = (i * 7) % 10;
        if (roll < 6) { status = 'paid'; paid = rent; }
        else if (roll < 8) { status = 'partial'; paid = Math.round(rent * 0.4); }
        else { status = 'late'; paid = 0; }
      } else if (isPast) {
        status = 'paid'; paid = rent;
      } else {
        status = 'open'; paid = 0;
      }

      const total = rent;
      rows.push({
        id: 'mock-' + i + '-' + dueDate.getTime(),
        number: 'WPA-' + String(10000 + (dueDate.getFullYear() * 100) + dueDate.getMonth()),
        subject: 'Rent — ' + dueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        property: ctx.property || '—',
        unit: ctx.unit || '',
        due_date: dueDate.toISOString().slice(0, 10),
        total: total,
        paid: paid,
        remaining: total - paid,
        status: status,
        daysLate: isPast ? daysLate : 0,
        reminders_sent: status === 'late' ? 2 : status === 'partial' ? 1 : 0,
        bank_account: 'ERA Holding, LLC',
        payment_method: paid > 0 ? (i % 2 === 0 ? 'ACH' : 'Credit Card') : null
      });
      cur.setMonth(cur.getMonth() + 1);
      i++;
      if (i > 60) break; // safety
    }

    // newest first
    rows.sort((a, b) => b.due_date.localeCompare(a.due_date));
    return rows;
  }

  const _fmt$ = n => (n < 0 ? '−$' : '$') + Math.abs(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const _fmtDate = s => { try { return new Date(s + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch (e) { return s; } };

  let _listRows = [];
  let _listFilter = 'all';
  let _listCtx = null;

  window.WPA_openInvoiceList = async function (ctx) {
    _injectListCSS();
    ctx = ctx || {};
    _listCtx = ctx;
    _listFilter = 'all';
    _listRows = [];
    // Show loading shell
    _renderList({ loading: true });
    try {
      const rows = await _fetchInvoiceListFromSupabase(ctx);
      if (rows && rows.length) {
        _listRows = rows;
      } else {
        // No real invoices yet — fall back to client-side mock so the UI isn't empty
        _listRows = _genSeries(ctx);
        _listCtx.mockFallback = true;
      }
    } catch (e) {
      console.warn('[WPA_openInvoiceList] Supabase fetch failed, using mock:', e);
      _listRows = _genSeries(ctx);
      _listCtx.mockFallback = true;
      _listCtx.mockError = e.message;
    }
    _renderList();
  };

  // Fetch real invoices + their payments + reminder counts for one unit
  async function _fetchInvoiceListFromSupabase(ctx) {
    if (!ctx.property || !ctx.unit) return [];
    const q = 'invoices?select=id,property,unit,period_month,due_date,status,total,paid,notes'
            + '&property=eq.' + encodeURIComponent(ctx.property)
            + '&unit=eq.' + encodeURIComponent(ctx.unit)
            + '&order=period_month.desc';
    const invoices = await _sb(q);
    if (!invoices.length) return [];
    // Fetch payments + reminders for all these invoices in parallel
    const idList = invoices.map(i => '"' + i.id + '"').join(',');
    const [payments, reminders] = await Promise.all([
      _sb('payments?invoice_id=in.(' + idList + ')&select=invoice_id,amount,method,status,paid_at,payer_name').catch(() => []),
      _sb('reminders_log?invoice_id=in.(' + idList + ')&select=invoice_id,sent_at,status').catch(() => [])
    ]);
    const payByInv = {};
    payments.forEach(p => {
      if (!payByInv[p.invoice_id]) payByInv[p.invoice_id] = [];
      payByInv[p.invoice_id].push(p);
    });
    const remByInv = {};
    reminders.forEach(r => { remByInv[r.invoice_id] = (remByInv[r.invoice_id] || 0) + 1; });
    const today = new Date(); today.setHours(0,0,0,0);
    return invoices.map(inv => {
      const pays = payByInv[inv.id] || [];
      // Accept both 'paid' (portal + admin Record Payment) and the
      // legacy 'succeeded' (older Stripe-written rows). The detail
      // view uses the same dual filter — the list must match or the
      // two screens disagree on "Paid $X".
      const paid = pays
        .filter(p => { const s = p.status || 'succeeded'; return s === 'succeeded' || s === 'paid'; })
        .reduce((s, p) => s + Number(p.amount || 0), 0);
      const total = Number(inv.total||0);
      const remaining = Math.max(0, total - paid);
      const due = inv.due_date ? new Date(inv.due_date + 'T12:00:00') : null;
      const dbStatus = (inv.status||'open').toLowerCase();
      let status = dbStatus;
      let daysLate = 0;
      // Trust the DB's terminal / explicit states first — draft, paid,
      // void, partial are all set intentionally (draft by author,
      // paid/partial by reconcile, void by delete). Only fall back to
      // date-based derivation for 'open'.
      if (dbStatus === 'draft') status = 'draft';
      else if (dbStatus === 'paid') status = 'paid';
      else if (dbStatus === 'void') status = 'void';
      else if (dbStatus === 'partial') status = 'partial';
      else if (paid > 0 && paid < total) status = 'partial';
      else if (due && due < today) { status = 'late'; daysLate = Math.floor((today-due)/86400000); }
      else if (due && due > today) status = 'upcoming';
      else status = 'open';
      const period = inv.period_month ? new Date(inv.period_month+'T12:00:00') : null;
      const subject = inv.notes || (period ? 'Rent — ' + period.toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'Invoice');
      const lastPay = pays.sort((a,b)=>new Date(b.paid_at||0)-new Date(a.paid_at||0))[0];
      const invNumShort = (inv.id||'').slice(0,8).toUpperCase();
      return {
        id: inv.id,
        number: 'INV-' + invNumShort,
        subject,
        due_date: inv.due_date,
        total, paid, remaining,
        status,
        daysLate,
        reminders_sent: remByInv[inv.id] || 0,
        payment_method: lastPay ? (lastPay.method || '—') : '—',
        bank_account: lastPay && lastPay.method === 'ach' ? 'ACH ••••' : (lastPay && lastPay.method === 'card' ? 'Card ••••' : '—'),
        period_month: inv.period_month,
        _real: true
      };
    });
  }

  window.WPA_closeInvoiceList = function () {
    const ovr = document.getElementById('wpaInvListOverlay');
    if (ovr) ovr.remove();
    const pop = document.getElementById('wpaInvListPop');
    if (pop) pop.remove();
  };

  function _filtered() {
    if (_listFilter === 'all') return _listRows;
    if (_listFilter === 'overdue') return _listRows.filter(r => r.status === 'late' || r.status === 'partial');
    if (_listFilter === 'upcoming') return _listRows.filter(r => r.status === 'open' || r.status === 'upcoming');
    if (_listFilter === 'paid') return _listRows.filter(r => r.status === 'paid');
    return _listRows;
  }

  function _kpis() {
    const totalBilled = _listRows.reduce((s, r) => s + r.total, 0);
    const totalPaid = _listRows.reduce((s, r) => s + r.paid, 0);
    const overdue = _listRows.filter(r => r.status === 'late' || r.status === 'partial').reduce((s, r) => s + r.remaining, 0);
    const upcoming = _listRows.filter(r => r.status === 'open' || r.status === 'upcoming').length;
    return { totalBilled, totalPaid, overdue, upcoming };
  }

  function _renderList(opts) {
    opts = opts || {};
    const ctx = _listCtx;
    const k = _kpis();
    const rows = _filtered();
    const title = ctx.tenantName ? ('Invoices — ' + ctx.tenantName) : 'All Invoices';
    const propLine = [ctx.property, ctx.unit ? '| ' + ctx.unit : '', ctx.leaseType ? ('· ' + ctx.leaseType.toUpperCase()) : ''].filter(Boolean).join(' ');
    const sourceBadge = opts.loading
      ? '<span style="margin-left:10px;padding:2px 8px;border:1px solid #c4cdeb;border-radius:10px;font-size:10px;color:#4d5670;background:#fff">Loading…</span>'
      : ctx.mockFallback
        ? '<span title="No invoices in Supabase for this unit yet — showing client-side preview. Use 🔄 Refresh Invoices on the lease card." style="margin-left:10px;padding:2px 8px;border:1px solid #eecfa0;border-radius:10px;font-size:10px;color:#b86818;background:#fdf3e8;cursor:help">Preview (no DB rows)</span>'
        : '<span style="margin-left:10px;padding:2px 8px;border:1px solid #9ed2b8;border-radius:10px;font-size:10px;color:#1f7a4d;background:#eaf6f0">Live</span>';

    const html = `
    <div class="wpa-il-ovr" id="wpaInvListOverlay" onclick="if(event.target===this)WPA_closeInvoiceList()">
      <div class="wpa-il">
        <button class="wpa-il-close" onclick="WPA_closeInvoiceList()">&times;</button>
        <div class="wpa-il-head">
          <h2 class="wpa-il-title">${_esc(title)}${sourceBadge}</h2>
          <div class="wpa-il-sub">${_esc(propLine || 'Full invoice ledger')}</div>
          ${(ctx.property && ctx.unit) ? `
            <div style="margin-top:10px;display:flex;gap:8px">
              <button onclick="_wpaNewInvoiceFromList()"
                style="padding:7px 14px;border-radius:7px;border:1px solid #3651b5;background:#3651b5;color:#fff;font-size:12px;font-weight:600;cursor:pointer">
                + New Invoice
              </button>
            </div>
          ` : ''}
          <div class="wpa-il-kpis">
            <div class="wpa-il-kpi"><div class="k-lbl">Total Billed</div><div class="k-val">${_fmt$(k.totalBilled)}</div></div>
            <div class="wpa-il-kpi"><div class="k-lbl">Total Paid</div><div class="k-val">${_fmt$(k.totalPaid)}</div></div>
            <div class="wpa-il-kpi"><div class="k-lbl">Overdue</div><div class="k-val ${k.overdue > 0 ? 'overdue' : ''}">${_fmt$(k.overdue)}</div></div>
            <div class="wpa-il-kpi"><div class="k-lbl">Upcoming</div><div class="k-val">${k.upcoming}</div></div>
          </div>
        </div>
        <div class="wpa-il-filters">
          ${['all','overdue','upcoming','paid'].map(f =>
            `<span class="wpa-il-chip ${_listFilter===f?'on':''}" onclick="_wpaSetInvFilter('${f}')">${f === 'all' ? 'All' : f.charAt(0).toUpperCase()+f.slice(1)} (${f==='all'?_listRows.length:_listRows.filter(r=>f==='overdue'?(r.status==='late'||r.status==='partial'):f==='upcoming'?(r.status==='open'||r.status==='upcoming'):r.status===f).length})</span>`
          ).join('')}
        </div>
        <div style="max-height:56vh;overflow:auto">
          ${rows.length === 0 ? `<div class="wpa-il-empty">No invoices match this filter.</div>` : `
          <table class="wpa-il-table">
            <thead><tr>
              <th>Invoice #</th><th>Subject</th><th>Due Date</th>
              <th class="num">Total</th><th class="num">Paid</th><th class="num">Remaining</th>
              <th>Status</th>
            </tr></thead>
            <tbody>
              ${rows.map((r, idx) => `
                <tr onclick="_wpaOpenRow(${idx})" onmouseenter="_wpaShowPop(event,${idx})" onmousemove="_wpaMovePop(event)" onmouseleave="_wpaHidePop()">
                  <td class="inv-num">${_esc(r.number)}</td>
                  <td class="subj">${_esc(r.subject)}</td>
                  <td>${_fmtDate(r.due_date)}</td>
                  <td class="num">${_fmt$(r.total)}</td>
                  <td class="num">${_fmt$(r.paid)}</td>
                  <td class="num ${r.remaining > 0 && r.status !== 'upcoming' ? 'red' : ''}">${_fmt$(r.remaining)}</td>
                  <td><span class="wpa-il-pill ${r.status}">${r.status}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>`}
        </div>
      </div>
    </div>
    <div class="wpa-il-pop" id="wpaInvListPop"></div>
    `;

    let existing = document.getElementById('wpaInvListOverlay');
    if (existing) existing.remove();
    const pop = document.getElementById('wpaInvListPop');
    if (pop) pop.remove();
    document.body.insertAdjacentHTML('beforeend', html);
  }

  window._wpaSetInvFilter = function (f) { _listFilter = f; _renderList(); };

  window._wpaNewInvoiceFromList = function () {
    if (!_listCtx || !_listCtx.property || !_listCtx.unit) return;
    WPA_createInvoice({
      property: _listCtx.property,
      unit:     _listCtx.unit,
      tenantName: _listCtx.tenantName || ''
    });
  };
  window._wpaOpenRow = function (idx) {
    const r = _filtered()[idx];
    if (!r) return;
    WPA_closeInvoiceList();
    if (r._real && r.id) {
      // Real Supabase invoice — load by id
      WPA_openInvoice(r.id);
    } else {
      // Client-side preview fallback
      WPA_openInvoicePreview('rent', {
        tenantName: _listCtx.tenantName,
        property: _listCtx.property,
        unit: _listCtx.unit,
        rent: r.total
      });
    }
  };
  window._wpaShowPop = function (e, idx) {
    const r = _filtered()[idx];
    const pop = document.getElementById('wpaInvListPop');
    if (!pop || !r) return;
    const daysLine = r.status === 'late' ? `<div class="p-row"><span>Days late</span><b style="color:#b83228">${r.daysLate}</b></div>`
                   : r.status === 'upcoming' ? `<div class="p-row"><span>Due in</span><b>${Math.abs(Math.floor((new Date(r.due_date)-new Date())/86400000))} days</b></div>`
                   : '';
    pop.innerHTML = `
      <div class="p-title">${_esc(r.number)}</div>
      <div class="p-row"><span>Due Date</span><b>${_fmtDate(r.due_date)}</b></div>
      <div class="p-row"><span>Total Due</span><b>${_fmt$(r.remaining)}</b></div>
      <div class="p-row"><span>Reminders Sent</span><b>${r.reminders_sent}</b></div>
      <div class="p-row"><span>Invoice Items</span><b>Rent — ${_fmt$(r.total)}</b></div>
      ${r.paid > 0 ? `<div class="p-row"><span>Payments</span><b>${_esc(_listCtx.tenantName||'Tenant')} by ${r.payment_method||'—'}</b></div>
      <div class="p-row"><span>Bank Account</span><b>${_esc(r.bank_account)} (${_fmt$(r.paid)})</b></div>` : ''}
      ${daysLine}
      <div class="p-edit">Click to open · Edit Invoice ↗</div>
    `;
    pop.classList.add('on');
    _wpaMovePop(e);
  };
  window._wpaMovePop = function (e) {
    const pop = document.getElementById('wpaInvListPop');
    if (!pop) return;
    const w = pop.offsetWidth || 280;
    const h = pop.offsetHeight || 180;
    let x = e.clientX + 18;
    let y = e.clientY + 12;
    if (x + w > window.innerWidth - 10) x = e.clientX - w - 18;
    if (y + h > window.innerHeight - 10) y = e.clientY - h - 12;
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
  };
  window._wpaHidePop = function () {
    const pop = document.getElementById('wpaInvListPop');
    if (pop) pop.classList.remove('on');
  };

  /* ════════════════════════════════════════════════════════════
     CREATE INVOICE (Phase 5 v1) — admin-only flow to create a
     one-off invoice as draft or published. Multi-line from day 1.
     Default due = today + 14 days. No recurring, no edit-after-send.
     ──────────────────────────────────────────────────────────── */

  // Kinds must match the invoice_lines_kind_check CHECK constraint.
  // Allowed: rent | deposit | last_month | recurring_charge |
  //          one_time_charge | late_fee | credit | service | parking
  const _CI_KINDS = [
    { v: 'service',         l: 'Service / Other' },
    { v: 'rent',            l: 'Rent' },
    { v: 'parking',         l: 'Parking' },
    { v: 'one_time_charge', l: 'One-Time Charge' },
    { v: 'late_fee',        l: 'Late Fee' },
    { v: 'credit',          l: 'Credit (negative)' },
    { v: 'deposit',         l: 'Security Deposit' },
    { v: 'last_month',      l: 'Last Month Rent' }
  ];

  function _ciInjectCSS() {
    if (document.getElementById('wpaCiCSS')) return;
    const s = document.createElement('style');
    s.id = 'wpaCiCSS';
    s.textContent = `
      .wpa-ci-ovr{position:fixed;inset:0;background:rgba(20,28,52,.45);z-index:10050;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto}
      .wpa-ci{background:#fff;border-radius:14px;width:100%;max-width:760px;box-shadow:0 24px 80px rgba(20,28,52,.35);font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#141c34}
      .wpa-ci-hd{padding:22px 26px 16px;border-bottom:1px solid #e4e8f2;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
      .wpa-ci-hd h2{margin:0 0 4px;font-size:18px;font-weight:700}
      .wpa-ci-hd .sub{color:#4d5670;font-size:12px}
      .wpa-ci-close{background:none;border:0;font-size:22px;line-height:1;color:#8590a8;cursor:pointer;padding:4px 8px}
      .wpa-ci-close:hover{color:#141c34}
      .wpa-ci-body{padding:20px 26px 8px}
      .wpa-ci-row{display:grid;grid-template-columns:140px 1fr;gap:14px;align-items:center;margin-bottom:12px}
      .wpa-ci-row label{font-size:12px;color:#4d5670;font-weight:600}
      .wpa-ci-row input[type=text],.wpa-ci-row input[type=date],.wpa-ci-row select,.wpa-ci-row textarea{
        width:100%;padding:8px 10px;border:1px solid #c4cdeb;border-radius:7px;font-size:13px;background:#fff;color:#141c34;font-family:inherit;box-sizing:border-box
      }
      .wpa-ci-row input:focus,.wpa-ci-row select:focus,.wpa-ci-row textarea:focus{outline:0;border-color:#3651b5;box-shadow:0 0 0 3px rgba(54,81,181,.12)}
      .wpa-ci-row .ro{color:#141c34;font-weight:500;padding:8px 0}
      .wpa-ci-err{background:#fdf1f0;border:1px solid #eebfba;color:#b83228;padding:8px 12px;border-radius:7px;margin:0 0 14px;font-size:12px}
      .wpa-ci-lines{margin-top:20px;border-top:1px solid #e4e8f2;padding-top:16px}
      .wpa-ci-lines h3{margin:0 0 10px;font-size:13px;font-weight:700;color:#141c34;display:flex;justify-content:space-between;align-items:center}
      .wpa-ci-lines h3 .add{background:#eef1fb;border:1px solid #c4cdeb;color:#3651b5;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer}
      .wpa-ci-lines h3 .add:hover{background:#dde3f5}
      .wpa-ci-tbl{width:100%;border-collapse:collapse;font-size:13px}
      .wpa-ci-tbl th{text-align:left;padding:6px 8px;color:#4d5670;font-size:11px;font-weight:600;border-bottom:1px solid #e4e8f2;text-transform:uppercase;letter-spacing:.04em}
      .wpa-ci-tbl td{padding:6px 4px;vertical-align:top}
      .wpa-ci-tbl td input,.wpa-ci-tbl td select{width:100%;padding:6px 8px;border:1px solid #c4cdeb;border-radius:6px;font-size:13px;background:#fff;color:#141c34;box-sizing:border-box}
      .wpa-ci-tbl td input[type=number]{text-align:right}
      .wpa-ci-tbl th.amt,.wpa-ci-tbl td.amt{text-align:right;width:110px}
      .wpa-ci-tbl th.kind,.wpa-ci-tbl td.kind{width:170px}
      .wpa-ci-tbl th.rm,.wpa-ci-tbl td.rm{width:32px;text-align:center}
      .wpa-ci-tbl .rm button{background:none;border:0;color:#8590a8;font-size:18px;line-height:1;cursor:pointer;padding:4px}
      .wpa-ci-tbl .rm button:hover{color:#b83228}
      .wpa-ci-tot{display:flex;justify-content:flex-end;gap:18px;padding:14px 4px 2px;font-size:14px;color:#141c34;border-top:1px solid #e4e8f2;margin-top:6px}
      .wpa-ci-tot .lbl{color:#4d5670;font-weight:600}
      .wpa-ci-tot .val{font-weight:700;min-width:100px;text-align:right}
      .wpa-ci-ft{padding:16px 26px 22px;border-top:1px solid #e4e8f2;display:flex;gap:10px;justify-content:flex-end;background:#fafbfe;border-radius:0 0 14px 14px;margin-top:10px}
      .wpa-ci-btn{padding:9px 18px;border-radius:7px;border:1px solid #c4cdeb;background:#fff;color:#141c34;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
      .wpa-ci-btn:hover{background:#f5f7fb}
      .wpa-ci-btn.primary{background:#3651b5;border-color:#3651b5;color:#fff}
      .wpa-ci-btn.primary:hover{background:#2b4399}
      .wpa-ci-btn.publish{background:#1f7a4d;border-color:#1f7a4d;color:#fff}
      .wpa-ci-btn.publish:hover{background:#176138}
      .wpa-ci-btn:disabled{opacity:.5;cursor:not-allowed}
      .wpa-ci-ft .spacer{flex:1}
    `;
    document.head.appendChild(s);
  }

  // In-memory form state. Recreated on every WPA_createInvoice() open.
  let _ciState = null;

  function _ciDefaultDue() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  }
  function _ciPeriodMonth() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  }
  // Shift an ISO date (YYYY-MM-DD) by +n calendar months, clamping
  // the day-of-month to the last day of the target month (so Jan 31
  // → Feb 28/29 instead of rolling over into March).
  function _ciShiftMonths(iso, n) {
    if (!iso) return iso;
    const base = new Date(iso + 'T12:00:00');
    const y = base.getFullYear();
    const m = base.getMonth() + Number(n || 0);
    const day = base.getDate();
    const lastDay = new Date(y, m + 1, 0).getDate();
    const out = new Date(y, m, Math.min(day, lastDay));
    return out.toISOString().slice(0, 10);
  }
  // Label like "Oct 2026" for an ISO date.
  function _ciMonthLabel(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  // First-of-month ISO for a given ISO date.
  function _ciFirstOfMonthIso(iso) {
    if (!iso) return _ciPeriodMonth();
    const d = new Date(iso + 'T12:00:00');
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  }

  // Pull active tenants at (property, unit) from tenants_lt. Returns
  // array of {id, name} — empty if no active lease / no hydrated rows.
  async function _ciLoadTenants(property, unit) {
    if (!property || !unit) return [];
    try {
      const q = 'tenants_lt?select=id,name,email'
              + '&property=eq.' + encodeURIComponent(property)
              + '&unit=eq.' + encodeURIComponent(unit)
              + '&order=name.asc';
      const rows = await _sb(q);
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      console.warn('[createInvoice] tenant fetch failed', e);
      return [];
    }
  }

  window.WPA_createInvoice = async function (ctx) {
    _ciInjectCSS();
    ctx = ctx || {};
    _ciState = {
      property:   ctx.property || '',
      unit:       ctx.unit || '',
      tenants:    [],          // [{id, name, email}]
      tenantId:   '',
      subject:    '',
      dueDate:    _ciDefaultDue(),
      periodMonth:_ciPeriodMonth(),
      lines:      [ { kind: 'service', description: '', amount: '' } ],
      // Recurrence
      recurType:  'one_time',   // 'one_time' | 'recurring'
      recurMonths: 12,          // only used when recurType === 'recurring'
      saving:     false,
      error:      ''
    };
    // Initial render with loading pill for tenants
    _ciRender();
    _ciState.tenants = await _ciLoadTenants(_ciState.property, _ciState.unit);
    if (_ciState.tenants.length === 1) _ciState.tenantId = _ciState.tenants[0].id;
    if (_ciState.tenants.length === 0) {
      _ciState.error = 'No tenant record found for ' + _ciState.property + ' · Unit ' + _ciState.unit
                    + '. Create a tenant first (or check that tenants_lt has a matching row).';
    }
    _ciRender();
  };

  window.WPA_closeCreateInvoice = function () {
    const o = document.getElementById('wpaCiOverlay');
    if (o) o.remove();
    _ciState = null;
  };

  function _ciRender() {
    if (!_ciState) return;
    const st = _ciState;
    const lineRows = st.lines.map((l, i) => `
      <tr>
        <td class="kind">
          <select onchange="_ciUpdateLine(${i},'kind',this.value)">
            ${_CI_KINDS.map(k => `<option value="${k.v}" ${l.kind===k.v?'selected':''}>${_esc(k.l)}</option>`).join('')}
          </select>
        </td>
        <td>
          <input type="text" placeholder="Description"
            value="${_esc(l.description || '')}"
            oninput="_ciUpdateLine(${i},'description',this.value)">
        </td>
        <td class="amt">
          <input type="number" step="0.01" placeholder="0.00"
            value="${l.amount === '' || l.amount == null ? '' : String(l.amount)}"
            oninput="_ciUpdateLine(${i},'amount',this.value)">
        </td>
        <td class="rm">
          ${st.lines.length > 1 ? `<button type="button" onclick="_ciRemoveLine(${i})" title="Remove line">×</button>` : ''}
        </td>
      </tr>
    `).join('');

    // Total auto-sums. Credit kind is user-entered as positive; we auto-negate on save.
    const total = st.lines.reduce((s, l) => {
      const n = Number(l.amount || 0);
      if (!isFinite(n)) return s;
      return s + (l.kind === 'credit' ? -Math.abs(n) : n);
    }, 0);

    const tenantSelect = st.tenants.length === 0
      ? `<div class="ro muted">—</div>`
      : `<select onchange="_ciUpdateField('tenantId',this.value)">
           ${st.tenants.length > 1 ? `<option value="">— select tenant —</option>` : ''}
           ${st.tenants.map(t => `<option value="${_esc(t.id)}" ${st.tenantId===t.id?'selected':''}>${_esc(t.name)}</option>`).join('')}
         </select>`;

    const html = `
      <div class="wpa-ci-ovr" id="wpaCiOverlay" onclick="if(event.target===this)WPA_closeCreateInvoice()">
        <div class="wpa-ci">
          <div class="wpa-ci-hd">
            <div>
              <h2>New Invoice</h2>
              <div class="sub">${_esc(st.property || '—')}${st.unit ? ' · Unit ' + _esc(st.unit) : ''}</div>
            </div>
            <button class="wpa-ci-close" onclick="WPA_closeCreateInvoice()" title="Close">✕</button>
          </div>
          <div class="wpa-ci-body">
            ${st.error ? `<div class="wpa-ci-err">${_esc(st.error)}</div>` : ''}

            <div class="wpa-ci-row">
              <label>Property / Unit</label>
              <div class="ro">${_esc(st.property || '—')}${st.unit ? ' · Unit ' + _esc(st.unit) : ''}</div>
            </div>
            <div class="wpa-ci-row">
              <label>Tenant</label>
              ${tenantSelect}
            </div>
            <div class="wpa-ci-row">
              <label>Subject</label>
              <input type="text" placeholder="e.g. April utilities"
                value="${_esc(st.subject)}"
                oninput="_ciUpdateField('subject',this.value)">
            </div>
            <div class="wpa-ci-row">
              <label>Type</label>
              <select onchange="_ciSetRecurType(this.value)">
                <option value="one_time"  ${st.recurType==='one_time'?'selected':''}>One-Time</option>
                <option value="recurring" ${st.recurType==='recurring'?'selected':''}>Recurring (Monthly)</option>
              </select>
            </div>
            ${st.recurType === 'recurring' ? `
              <div class="wpa-ci-row">
                <label>Number of Months</label>
                <input type="number" min="2" max="60" step="1"
                  value="${Number(st.recurMonths) || 12}"
                  oninput="_ciUpdateField('recurMonths', this.value)">
              </div>
            ` : ''}
            <div class="wpa-ci-row">
              <label>${st.recurType === 'recurring' ? 'First Due Date' : 'Due Date'}</label>
              <input type="date" value="${_esc(st.dueDate)}" oninput="_ciSetDueDate(this.value)">
            </div>
            ${st.recurType === 'recurring' ? `
              <div class="wpa-ci-row">
                <label></label>
                <div class="ro" style="color:#4d5670;font-size:12px" id="wpaCiRecurPreview">
                  ${_esc(_ciRecurPreviewText())}
                </div>
              </div>
            ` : ''}

            <div class="wpa-ci-lines">
              <h3>
                <span>Line Items</span>
                <span class="add" onclick="_ciAddLine()">+ Add Line</span>
              </h3>
              <table class="wpa-ci-tbl">
                <thead>
                  <tr><th class="kind">Kind</th><th>Description</th><th class="amt">Amount</th><th class="rm"></th></tr>
                </thead>
                <tbody>${lineRows}</tbody>
              </table>
              <div class="wpa-ci-tot">
                <span class="lbl">Total</span>
                <span class="val">${_esc(MONEY(total))}</span>
              </div>
            </div>
          </div>
          <div class="wpa-ci-ft">
            <button class="wpa-ci-btn" onclick="WPA_closeCreateInvoice()">Cancel</button>
            <div class="spacer"></div>
            <button class="wpa-ci-btn primary" ${st.saving?'disabled':''} onclick="_ciSave(true)">Save Draft</button>
            <button class="wpa-ci-btn publish" ${st.saving?'disabled':''} onclick="_ciSave(false)">Save &amp; Publish</button>
          </div>
        </div>
      </div>
    `;

    let existing = document.getElementById('wpaCiOverlay');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function _ciRecurPreviewText() {
    if (!_ciState || _ciState.recurType !== 'recurring') return '';
    const n = Math.max(2, Math.min(60, Number(_ciState.recurMonths) || 0));
    const first = _ciState.dueDate;
    const last  = _ciShiftMonths(first, n - 1);
    return 'Will create ' + n + ' monthly invoices — first due ' + _ciMonthLabel(first)
         + ', last due ' + _ciMonthLabel(last) + '.';
  }

  // Refresh just the recurring preview text without re-rendering the
  // whole modal (so inputs keep focus).
  function _ciRefreshRecurPreview() {
    const el = document.getElementById('wpaCiRecurPreview');
    if (el) el.textContent = _ciRecurPreviewText();
  }

  // Recompute the Total display without touching any input elements.
  // Called from text/number oninput so we don't rebuild the DOM and
  // kill the caret.
  function _ciRefreshTotal() {
    if (!_ciState) return;
    const el = document.querySelector('#wpaCiOverlay .wpa-ci-tot .val');
    if (!el) return;
    const total = _ciState.lines.reduce((s, l) => {
      const n = Number(l.amount || 0);
      if (!isFinite(n)) return s;
      return s + (l.kind === 'credit' ? -Math.abs(n) : n);
    }, 0);
    el.textContent = MONEY(total);
  }

  // Top-level field updates never need a re-render — the DOM already
  // reflects the user's input. Just capture state.
  window._ciUpdateField = function (field, val) {
    if (!_ciState) return;
    _ciState[field] = val;
    // Number-of-months change → refresh the recurring preview line
    // without blowing away input focus.
    if (field === 'recurMonths') _ciRefreshRecurPreview();
  };
  // Due-date change: update state + refresh preview (if visible).
  window._ciSetDueDate = function (val) {
    if (!_ciState) return;
    _ciState.dueDate = val;
    _ciRefreshRecurPreview();
  };
  // Type change is structural (shows/hides Months + preview rows), so
  // we do a full re-render. Focus is on the <select> which we don't
  // mind losing.
  window._ciSetRecurType = function (val) {
    if (!_ciState) return;
    _ciState.recurType = (val === 'recurring') ? 'recurring' : 'one_time';
    _ciRender();
  };
  // Line updates: text/number → state only + refresh total. Kind change
  // also no re-render (the <select> already shows the chosen value);
  // just refresh total since 'credit' flips sign.
  window._ciUpdateLine = function (idx, field, val) {
    if (!_ciState || !_ciState.lines[idx]) return;
    _ciState.lines[idx][field] = val;
    if (field === 'amount' || field === 'kind') _ciRefreshTotal();
  };
  window._ciAddLine = function () {
    if (!_ciState) return;
    _ciState.lines.push({ kind: 'service', description: '', amount: '' });
    _ciRender();
  };
  window._ciRemoveLine = function (idx) {
    if (!_ciState) return;
    _ciState.lines.splice(idx, 1);
    if (_ciState.lines.length === 0) _ciState.lines.push({ kind: 'service', description: '', amount: '' });
    _ciRender();
  };

  window._ciSave = async function (asDraft) {
    if (!_ciState || _ciState.saving) return;
    const st = _ciState;
    st.error = '';

    // Validation
    if (st.tenants.length === 0) { st.error = 'No tenant record for this unit.'; _ciRender(); return; }
    if (!st.tenantId)             { st.error = 'Select a tenant.'; _ciRender(); return; }
    if (!st.dueDate)              { st.error = 'Due date required.'; _ciRender(); return; }

    const cleanLines = st.lines
      .map(l => ({
        kind:        l.kind,
        description: (l.description || '').trim(),
        amount:      Number(l.amount || 0)
      }))
      .filter(l => isFinite(l.amount) && Math.abs(l.amount) > 0.005);

    if (cleanLines.length === 0) {
      st.error = 'Add at least one line item with a non-zero amount.';
      _ciRender();
      return;
    }
    // Auto-negate credit lines
    cleanLines.forEach(l => {
      if (l.kind === 'credit') l.amount = -Math.abs(l.amount);
    });
    // Require descriptions
    const missingDesc = cleanLines.find(l => !l.description);
    if (missingDesc) { st.error = 'Every line item needs a description.'; _ciRender(); return; }

    const total = cleanLines.reduce((s, l) => s + l.amount, 0);

    // Recurring: validate month count
    const isRecurring = (st.recurType === 'recurring');
    let occurrences = 1;
    if (isRecurring) {
      occurrences = Math.floor(Number(st.recurMonths) || 0);
      if (!isFinite(occurrences) || occurrences < 2) {
        st.error = 'Recurring requires at least 2 months.';
        _ciRender();
        return;
      }
      if (occurrences > 60) {
        st.error = 'Maximum 60 months for a recurring series.';
        _ciRender();
        return;
      }
    }

    st.saving = true;
    _ciRender();

    try {
      // Build N invoice rows + their line-item sets in parallel arrays.
      const invBodies = [];
      for (let i = 0; i < occurrences; i++) {
        const dueIso = isRecurring ? _ciShiftMonths(st.dueDate, i) : st.dueDate;
        const periodIso = _ciFirstOfMonthIso(dueIso);
        // Subject: append "— MMM YYYY" for recurring so each invoice is identifiable
        let notes = st.subject ? st.subject.trim() : '';
        if (isRecurring && notes) {
          notes = notes + ' — ' + _ciMonthLabel(dueIso);
        } else if (isRecurring && !notes) {
          notes = null; // let invoice-list derive subject from period_month
        } else {
          notes = notes || null;
        }
        invBodies.push({
          tenant_id:    st.tenantId,
          property:     st.property,
          unit:         st.unit,
          period_month: periodIso,
          due_date:     dueIso,
          status:       asDraft ? 'draft' : 'open',
          total:        total,
          paid:         0,
          notes:        notes
        });
      }

      // Bulk-insert invoices (PostgREST accepts arrays). Response
      // preserves order, so we can pair each returned row with its
      // line-items group by index.
      const inserted = await _sbInsert('invoices', invBodies);
      const rows = Array.isArray(inserted) ? inserted : [inserted];
      if (rows.length !== invBodies.length) {
        throw new Error('Invoice insert returned ' + rows.length + ' rows, expected ' + invBodies.length);
      }

      // Build all line-item rows in a single flat array for one insert.
      const allLines = [];
      rows.forEach(row => {
        if (!row || !row.id) throw new Error('Invoice insert returned no id');
        cleanLines.forEach(l => {
          allLines.push({
            invoice_id:  row.id,
            kind:        l.kind,
            description: l.description,
            amount:      l.amount,
            day_offset:  null,
            created_by:  'admin'
          });
        });
      });
      await _sbInsert('invoice_lines', allLines);

      // Success — close modal, refresh invoice list, open the first new invoice
      const firstId = rows[0].id;
      const listCtxCopy = _listCtx ? Object.assign({}, _listCtx) : null;
      WPA_closeCreateInvoice();
      if (listCtxCopy) {
        await WPA_openInvoiceList(listCtxCopy);
      }
      setTimeout(() => { try { WPA_openInvoice(firstId); } catch (e) {} }, 150);
    } catch (e) {
      console.error('[createInvoice] save failed', e);
      st.saving = false;
      st.error = 'Save failed: ' + (e && e.message ? e.message : String(e));
      _ciRender();
    }
  };

  /* ════════════════════════════════════════════════════════════
     INVOICE SERIES GENERATOR — Supabase-wired, LT/MTM aware
     ──────────────────────────────────────────────────────────── */

  async function _sbInsert(path, body) {
    const r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/' + path, {
      method: 'POST',
      headers: {
        apikey: CONFIG.SUPABASE_KEY,
        Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error('[' + path + '] HTTP ' + r.status + ' ' + (await r.text()));
    return r.json();
  }

  async function _sbPatch(path, body) {
    const r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/' + path, {
      method: 'PATCH',
      headers: {
        apikey: CONFIG.SUPABASE_KEY,
        Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error('[' + path + '] HTTP ' + r.status + ' ' + (await r.text()));
    return true;
  }

  function _firstOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function _addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  function _toIsoDate(d) { return d.toISOString().slice(0, 10); }

  function _buildExpectedMonths(leaseStart, leaseEnd, leaseType) {
    // Returns array of {period_month: "YYYY-MM-01", due_date: "YYYY-MM-DD"} entries
    // LT: every month from start→end (inclusive)
    // MTM: every month from start→(next calendar month from today)
    const months = [];
    if (!leaseStart) return months;
    const start = _firstOfMonth(new Date(leaseStart + 'T12:00:00'));
    const today = _firstOfMonth(new Date());
    let stop;
    if (leaseType === 'mtm' || !leaseEnd) {
      stop = _addMonths(today, 1); // current + next month (rolling)
    } else {
      stop = _firstOfMonth(new Date(leaseEnd + 'T12:00:00'));
    }
    const cur = new Date(start);
    let safety = 0;
    while (cur.getTime() <= stop.getTime() && safety < 240) {
      months.push({ period_month: _toIsoDate(cur) });
      cur.setMonth(cur.getMonth() + 1);
      safety++;
    }
    return months;
  }

  /*  Public: refresh (create missing) invoices for a unit's lease.
      ctx = {
        property, unit, rent, lease_start, lease_end, lease_type,
        due_day (default 1), grace_days (default 5),
        primary_tenant_id,   // optional — UUID of first tenant on the lease
        tenant_name,         // optional — for logging

        // ── Phase-2 extensions ───────────────────────────────────────
        security_deposit,    // optional number — creates a separate deposit invoice
        last_month_rent,     // optional number — creates a separate last-month invoice
        extra_charges        // optional array of { label, amount, type, note? }
                             //   type = 'monthly' → added as a line on every rent invoice
                             //   type = 'one_time' → creates a separate invoice per label
      }

      Returns { expected, existing, created, errors,
                created_rent, created_deposit, created_last_month, created_one_time }

      Idempotency keys (primary = structural, secondary = notes for logging):
        • Rent invoices      — (property, unit, period_month)
        • Deposit invoice    — existence of invoice_lines.kind = 'deposit'
        • Last-month invoice — existence of invoice_lines.kind = 'last_month'
        • One-time extras    — existence of invoice_lines.kind = 'one_time_charge'
                               with the same normalized label prefix in
                               description
      All one-time invoices share period_month = lease_start first-of-month;
      they're disambiguated by their line kind / description, NOT by the
      notes sentinel (which exists only for human display / audit).
      This means renaming a sentinel in a later build, or admins editing
      invoices.notes by hand, won't cause duplicates on re-run.

      Monthly extras are added as additional invoice_lines at creation time.
      Rent invoices already on file are NOT rewritten — the lease-wizard
      hook fires once at lease creation, before any invoice exists, so the
      skip branch only matters for re-sends / edits.
  */
  window.WPA_refreshInvoicesForUnit = async function (ctx) {
    ctx = ctx || {};
    const res = {
      expected: 0, existing: 0, created: 0, errors: [],
      created_rent: 0, created_deposit: 0, created_last_month: 0, created_one_time: 0
    };
    if (!ctx.property || !ctx.unit || !ctx.rent || !ctx.lease_start) {
      res.errors.push('Missing required ctx fields (property, unit, rent, lease_start).');
      return res;
    }

    const dueDay = Math.min(28, Math.max(1, parseInt(ctx.due_day, 10) || 1));
    const leaseType = (ctx.lease_type || '').toLowerCase() === 'mtm' ? 'mtm' : 'lt';

    const expected = _buildExpectedMonths(ctx.lease_start, ctx.lease_end, leaseType);
    res.expected = expected.length;

    // Normalize Phase-2 inputs up front so the loop bodies stay small.
    const secDeposit   = Math.max(0, parseFloat(ctx.security_deposit) || 0);
    const lastMoRent   = Math.max(0, parseFloat(ctx.last_month_rent)  || 0);
    const extraCharges = Array.isArray(ctx.extra_charges) ? ctx.extra_charges : [];
    const monthlyExtras = extraCharges.filter(c =>
      c && c.type === 'monthly' && parseFloat(c.amount) > 0 && String(c.label || '').trim()
    );
    const oneTimeExtras = extraCharges.filter(c =>
      c && c.type !== 'monthly' && parseFloat(c.amount) > 0 && String(c.label || '').trim()
    );

    // Fetch existing invoices for this (property, unit). We need period_month
    // for rent-schedule dedup AND the embedded invoice_lines (kind,description)
    // for structural one-time-invoice dedup. PostgREST embed syntax:
    //   invoice_lines(kind,description)  → joins children in one round trip.
    const q = 'invoices?select=id,period_month,notes,invoice_lines(kind,description)'
            + '&property=eq.' + encodeURIComponent(ctx.property)
            + '&unit=eq.'     + encodeURIComponent(ctx.unit);
    let existing = [];
    try {
      existing = await _sb(q);
    } catch (e) {
      res.errors.push('Fetch existing failed: ' + e.message);
      return res;
    }
    const existSet = new Set(existing.map(x => (x.period_month || '').slice(0, 10)));
    res.existing = existSet.size;

    // ── Structural dedup sets (kind-based, not notes-based) ─────────────
    // For deposit / last-month we need only "does a line of this kind
    // already exist on ANY invoice for this (property,unit)?". For
    // one-time extras we need a per-label check, so we normalize the
    // first token of description (label, before the " — note" separator)
    // and lowercase it.
    //
    //   _normLabel('Pet fee — monthly extra') → 'pet fee'
    //   _normLabel('Pet Fee')                  → 'pet fee'
    const _normLabel = (s) => String(s || '')
      .split(/\s+[—\-–]\s+/)[0]   // strip trailing " — …" descriptor
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    let existHasDeposit   = false;
    let existHasLastMonth = false;
    const existOneTimeLabels = new Set();
    for (const inv of existing) {
      const lines = Array.isArray(inv.invoice_lines) ? inv.invoice_lines : [];
      for (const ln of lines) {
        const k = String(ln.kind || '').toLowerCase().trim();
        if (k === 'deposit')    existHasDeposit   = true;
        if (k === 'last_month') existHasLastMonth = true;
        if (k === 'one_time_charge') {
          const lbl = _normLabel(ln.description);
          if (lbl) existOneTimeLabels.add(lbl);
        }
      }
    }

    // Anchor for all one-time invoices — first-of-month of lease_start.
    const anchorDate   = new Date(ctx.lease_start + 'T12:00:00');
    const anchorMonth  = _toIsoDate(_firstOfMonth(anchorDate));
    const anchorDue    = _toIsoDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth(), dueDay));

    // Step 4b architecture:
    //   - 1st rent invoice is due on lease_start (not the monthly due-day)
    //     and carries all one-time extras as additional lines. It's
    //     tagged [MOVE_IN] so the late-fee cron skips it.
    //   - Security deposit + last-month invoices are due on the lease-
    //     SIGN date (today) and tagged [NO_LATE_FEE].
    //   - Monthly rent invoices 2..N are unchanged: due on dueDay-of-
    //     month, no special tags, late fees accumulate after the grace
    //     period per the lease's grace_days / per_day_late_fee.
    const leaseStartISO   = _toIsoDate(anchorDate);
    const signDateISO     = _toIsoDate(new Date());
    const oneTimeExtrasTotal = oneTimeExtras.reduce(
      (sum, c) => sum + (parseFloat(c.amount) || 0), 0
    );

    // ── 1. Per-period rent invoices (+ monthly-extra lines) ───────────
    for (const m of expected) {
      if (existSet.has(m.period_month)) continue;
      try {
        const periodDate = new Date(m.period_month + 'T12:00:00');
        const monthLabel = periodDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const isFirstMonth = m.period_month === anchorMonth;

        // First-month invoice is due on lease_start itself (so the
        // tenant pays it on move-in day). Subsequent months use the
        // regular dueDay-of-month schedule.
        const dueIso = isFirstMonth
          ? leaseStartISO
          : _toIsoDate(new Date(periodDate.getFullYear(), periodDate.getMonth(), dueDay));

        // Invoice total matches the sum of lines:
        //   rent + recurring extras + (on the 1st month only) one-time extras.
        const monthlyExtrasTotal = monthlyExtras.reduce(
          (sum, c) => sum + (parseFloat(c.amount) || 0), 0
        );
        const invTotal = Number(ctx.rent)
                       + monthlyExtrasTotal
                       + (isFirstMonth ? oneTimeExtrasTotal : 0);

        const notesText = 'Rent — ' + monthLabel + (isFirstMonth ? ' [MOVE_IN]' : '');

        const invPayload = {
          tenant_id: ctx.primary_tenant_id || null,
          property: ctx.property,
          unit: ctx.unit,
          period_month: m.period_month,
          due_date: dueIso,
          status: 'open',
          total: invTotal,
          paid: 0,
          notes: notesText
        };
        const inserted = await _sbInsert('invoices', invPayload);
        const invId = Array.isArray(inserted) ? inserted[0].id : inserted.id;

        // Rent line
        await _sbInsert('invoice_lines', {
          invoice_id: invId,
          kind: 'rent',
          description: 'Monthly rent — ' + monthLabel,
          amount: Number(ctx.rent),
          day_offset: null,
          created_by: 'System (auto-generator)'
        });

        // Recurring extras — one line per monthly extra, on every rent invoice.
        for (const c of monthlyExtras) {
          try {
            await _sbInsert('invoice_lines', {
              invoice_id: invId,
              kind: 'recurring_charge',
              description: String(c.label).trim() + ' — ' + monthLabel,
              amount: parseFloat(c.amount) || 0,
              day_offset: null,
              created_by: 'System (auto-generator)'
            });
          } catch (eLine) {
            res.errors.push(m.period_month + ' line [' + c.label + ']: ' + eLine.message);
          }
        }

        // One-time extras ride on the FIRST-month invoice only. Dedup
        // on normalized label so re-runs don't double-insert.
        if (isFirstMonth) {
          for (const c of oneTimeExtras) {
            const label    = String(c.label || '').trim();
            const labelKey = _normLabel(label);
            if (!labelKey || existOneTimeLabels.has(labelKey)) continue;
            try {
              await _sbInsert('invoice_lines', {
                invoice_id: invId,
                kind: 'one_time_charge',
                description: label + (c.note ? ' — ' + String(c.note).trim() : ''),
                amount: parseFloat(c.amount) || 0,
                day_offset: null,
                created_by: 'System (auto-generator)'
              });
              existOneTimeLabels.add(labelKey);
              res.created_one_time++;
            } catch (eLine) {
              res.errors.push(m.period_month + ' one-time [' + c.label + ']: ' + eLine.message);
            }
          }
        }

        res.created++;
        res.created_rent++;
      } catch (e) {
        res.errors.push(m.period_month + ': ' + e.message);
      }
    }

    // ── Shared one-time-invoice writer ────────────────────────────────
    // Dedup is the caller's responsibility (kind-based checks below).
    // `notesText` is cosmetic only — shown in admin lists / the portal;
    // it is NEVER used as an idempotency key.
    async function _writeOneTime(notesText, lineKind, lineDesc, amount, dueOverrideIso) {
      if (!(amount > 0)) return false;
      const invPayload = {
        tenant_id: ctx.primary_tenant_id || null,
        property: ctx.property,
        unit: ctx.unit,
        period_month: anchorMonth,
        due_date: dueOverrideIso || anchorDue,
        status: 'open',
        total: Number(amount),
        paid: 0,
        notes: notesText
      };
      const inserted = await _sbInsert('invoices', invPayload);
      const invId = Array.isArray(inserted) ? inserted[0].id : inserted.id;
      await _sbInsert('invoice_lines', {
        invoice_id: invId,
        kind: lineKind,
        description: lineDesc,
        amount: Number(amount),
        day_offset: null,
        created_by: 'System (auto-generator)'
      });
      return true;
    }

    // ── 2. Security-deposit invoice (excluded from the payment gate) ──
    // Dedup on invoice_lines.kind='deposit'. Only one deposit invoice
    // per (property, unit) — matches the wizard's single-deposit field.
    if (secDeposit > 0 && !existHasDeposit) {
      try {
        const wrote = await _writeOneTime(
          'Security Deposit [NO_LATE_FEE]',
          'deposit',
          'Security deposit (refundable)',
          secDeposit,
          signDateISO   // due on lease-SIGN date, not lease-start
        );
        if (wrote) {
          res.created++; res.created_deposit++;
          existHasDeposit = true; // guard against caller re-entry
        }
      } catch (e) {
        res.errors.push('deposit: ' + e.message);
      }
    }

    // ── 3. Last-month-rent invoice (gates check-in / unlock) ──────────
    // Dedup on invoice_lines.kind='last_month'.
    if (lastMoRent > 0 && !existHasLastMonth) {
      try {
        const wrote = await _writeOneTime(
          "Last Month Rent (held) [NO_LATE_FEE]",
          'last_month',
          'Last month rent (held)',
          lastMoRent,
          signDateISO   // due on lease-SIGN date, not lease-start
        );
        if (wrote) {
          res.created++; res.created_last_month++;
          existHasLastMonth = true;
        }
      } catch (e) {
        res.errors.push('last_month: ' + e.message);
      }
    }

    // ── 4. One-time extra charges ─────────────────────────────────────
    // Under Step 4b architecture, one-time extras are lines on the
    // FIRST-month rent invoice, not standalone invoices. That work
    // happens in section 1 above (gated on `isFirstMonth`).
    //
    // Known limitation: if the 1st-month rent invoice already exists
    // and new one-time extras are added later (e.g. admin edits the
    // lease post-generation), they will NOT be appended to the
    // existing invoice — the section-1 skip (`existSet.has(period_month)`)
    // short-circuits. A future patch can add an "append missing lines
    // to existing 1st-month invoice" branch. For fresh lease runs this
    // path is covered.

    return res;
  };

  /* ════════════════════════════════════════════════════════════
     PAYMENT FLOW — 3 steps: method → amount → autopay
     Client-side only for now; actual Stripe charge is Phase 2.
     Rules:
       • Credit card adds 3.5% processing fee (shown in step 2)
       • Bank/ACH is free
       • Partial payments allowed
       • Autopay capped at 12 scheduled OR lease-end, whichever sooner
     ──────────────────────────────────────────────────────────── */

  const PAY_CSS = `
  .wpa-pay-ovr{position:fixed;inset:0;background:rgba(20,23,42,.65);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px;animation:wpaInvFade .15s ease}
  .wpa-pay{background:#fff;border-radius:14px;width:100%;max-width:540px;box-shadow:0 24px 64px rgba(26,42,122,.24);font-family:'DM Mono',monospace;color:#14172a;overflow:hidden}
  .wpa-pay-hd{padding:22px 28px 14px;border-bottom:1px solid #eef1f7;display:flex;align-items:center;justify-content:space-between}
  .wpa-pay-hd h2{font-family:'Playfair Display',serif;margin:0;font-size:22px;font-weight:800}
  .wpa-pay-hd .close{width:32px;height:32px;border-radius:50%;border:1px solid #d4dae6;background:#fff;cursor:pointer;font-size:16px;color:#4d5670}
  .wpa-pay-steps{display:flex;gap:8px;padding:14px 28px;background:#f5f7fb;border-bottom:1px solid #eef1f7;font-size:11px}
  .wpa-pay-steps .step{flex:1;padding:8px 10px;border-radius:6px;background:#fff;border:1px solid #d4dae6;color:#8590a8;text-align:center;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
  .wpa-pay-steps .step.on{background:#14172a;color:#fff;border-color:#14172a}
  .wpa-pay-steps .step.done{background:#eaf6f0;color:#1f7a4d;border-color:#9ed2b8}
  .wpa-pay-body{padding:24px 28px;min-height:220px}
  .wpa-pay-body h3{margin:0 0 6px;font-size:15px;font-weight:700}
  .wpa-pay-body .sub{color:#4d5670;font-size:12px;margin-bottom:18px}
  .wpa-pay-method{display:grid;gap:10px}
  .wpa-pay-method label{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1.5px solid #d4dae6;border-radius:10px;cursor:pointer;transition:all .1s}
  .wpa-pay-method label:hover{border-color:#3651b5;background:#f5f7fb}
  .wpa-pay-method input{margin:0}
  .wpa-pay-method label.sel{border-color:#3651b5;background:#eef1fb}
  .wpa-pay-method .m-icon{font-size:22px}
  .wpa-pay-method .m-name{font-weight:700;font-size:13px}
  .wpa-pay-method .m-sub{font-size:11px;color:#4d5670;margin-top:2px}
  .wpa-pay-method .m-fee{margin-left:auto;font-size:11px;font-weight:700;padding:3px 9px;border-radius:10px}
  .wpa-pay-method .m-fee.free{background:#eaf6f0;color:#1f7a4d}
  .wpa-pay-method .m-fee.paid{background:#fdf3e8;color:#b86818}
  .wpa-pay-amt{display:flex;align-items:center;gap:12px;padding:14px;background:#f5f7fb;border-radius:10px;margin-bottom:14px}
  .wpa-pay-amt input{flex:1;font-family:'Playfair Display',serif;font-size:26px;font-weight:800;border:1.5px solid #d4dae6;border-radius:8px;padding:10px 14px;background:#fff;color:#14172a}
  .wpa-pay-amt input:focus{outline:none;border-color:#3651b5}
  .wpa-pay-presets{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
  .wpa-pay-presets button{padding:6px 12px;border:1px solid #d4dae6;background:#fff;border-radius:16px;cursor:pointer;font-size:11px;font-weight:600}
  .wpa-pay-presets button:hover{border-color:#3651b5;color:#3651b5}
  .wpa-pay-summary{padding:12px 14px;background:#eef1fb;border-radius:8px;font-size:12px}
  .wpa-pay-summary .row{display:flex;justify-content:space-between;padding:3px 0}
  .wpa-pay-summary .row.total{border-top:1px solid #c4cdeb;margin-top:6px;padding-top:8px;font-weight:800;font-size:14px}
  .wpa-pay-auto{margin-top:14px;padding:14px;border:1px dashed #c4cdeb;border-radius:10px;background:#fafbfe}
  .wpa-pay-auto label.toggle{display:flex;align-items:center;gap:10px;font-weight:700;cursor:pointer}
  .wpa-pay-auto .auto-body{margin-top:12px;padding-top:12px;border-top:1px solid #eef1f7;font-size:12px;color:#4d5670;display:none}
  .wpa-pay-auto.on .auto-body{display:block}
  .wpa-pay-auto .auto-row{display:flex;justify-content:space-between;padding:3px 0}
  .wpa-pay-foot{padding:16px 28px;border-top:1px solid #eef1f7;display:flex;gap:10px;justify-content:flex-end;background:#fafbfe}
  .wpa-pay-foot .back{background:transparent;border:1px solid #d4dae6;color:#4d5670;padding:9px 18px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px}
  .wpa-pay-foot .next{background:#3651b5;color:#fff;border:0;padding:10px 22px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700}
  .wpa-pay-foot .next:disabled{background:#b9c3d5;cursor:not-allowed}
  `;

  function _injectPayCSS() {
    if (document.getElementById('wpaPayCSS')) return;
    const s = document.createElement('style');
    s.id = 'wpaPayCSS'; s.textContent = PAY_CSS;
    document.head.appendChild(s);
  }

  const CC_FEE_PCT = 0.035;
  let _payState = null;

  window.WPA_startPayment = async function (invoiceId) {
    _injectPayCSS();
    try {
      const bundle = await _loadInvoiceBundle(invoiceId);
      const inv = bundle.invoice;
      const remaining = Math.max(0, Number(inv.total||0) - Number(inv.paid||0));
      if (remaining <= 0) { alert('This invoice has no remaining balance.'); return; }
      // Lookup lease end + autopay context from tenants_lt for cap calculation
      let leaseEnd = null, leaseType = 'lt';
      if (inv.tenant_id) {
        try {
          const t = await _sb('tenants_lt?id=eq.' + inv.tenant_id + '&select=lease_end,lease_type');
          if (t && t[0]) { leaseEnd = t[0].lease_end || null; leaseType = t[0].lease_type || 'lt'; }
        } catch (e) { /* ignore */ }
      }
      _payState = {
        step: 1,
        invoice: inv,
        bundle,
        remaining,
        method: null,        // 'ach' | 'card'
        amount: remaining,   // default: pay in full
        autopay: false,
        autopayCap: null,    // { count, reason }
        leaseEnd,
        leaseType
      };
      _renderPay();
    } catch (e) {
      alert('Failed to load invoice: ' + e.message);
    }
  };

  // ─── Pay via pay.php (payment requests — tip + Stripe) ──────
  window.WPA_payViaPayPhp = async function (prId) {
    try {
      const rows = await _sb('payment_requests?id=eq.' + prId + '&select=id,amount,description,work_order_id');
      if (!rows || !rows.length) { alert('Payment request not found'); return; }
      const req = rows[0];
      const amtCents = Math.round((parseFloat(req.amount) || 0) * 100);
      const desc = (req.description || 'Service').split('\n')[0];
      const wo = req.work_order_id || '';
      // Resolve pay.php URL: prefer explicit override, otherwise resolve relative
      // to the current page (works whether portal is at /portal/ or the site root).
      let payUrl = window.WPA_PAY_PHP_URL;
      if (!payUrl) {
        try { payUrl = new URL('pay.php', window.location.href).toString(); }
        catch (_e) { payUrl = 'pay.php'; }
      }
      payUrl += '?amount=' + amtCents
             +  '&desc='   + encodeURIComponent(desc)
             +  '&wo='     + encodeURIComponent(wo)
             +  '&pr='     + encodeURIComponent(req.id);
      window.open(payUrl, '_blank');
    } catch (e) {
      alert('Error loading payment details: ' + e.message);
    }
  };

  window.WPA_closePayment = function () {
    const ovr = document.getElementById('wpaPayOverlay');
    if (ovr) ovr.remove();
    _payState = null;
  };

  function _autopayCap(state) {
    // Cap = min(12, months remaining to lease end from today). MTM = 12.
    if (!state.leaseEnd || state.leaseType === 'mtm') return { count: 12, reason: '12-payment cap' };
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(state.leaseEnd + 'T12:00:00');
    let months = (end.getFullYear() - today.getFullYear()) * 12 + (end.getMonth() - today.getMonth());
    if (end.getDate() >= today.getDate()) months += 0;
    months = Math.max(0, months);
    if (months < 12) return { count: months, reason: 'lease ends ' + state.leaseEnd };
    return { count: 12, reason: '12-payment cap' };
  }

  function _renderPay() {
    const s = _payState;
    if (!s) return;
    const stepLabels = ['Method', 'Amount', 'Autopay'];
    const stepsHtml = stepLabels.map((lbl, i) => {
      const n = i + 1;
      const cls = s.step === n ? 'on' : (s.step > n ? 'done' : '');
      return `<div class="step ${cls}">${n}. ${lbl}</div>`;
    }).join('');

    let body = '';
    if (s.step === 1) body = _payRenderMethod(s);
    else if (s.step === 2) body = _payRenderAmount(s);
    else if (s.step === 3) body = _payRenderAutopay(s);
    else body = _payRenderConfirm(s);

    const canNext =
      (s.step === 1) ? !!s.method :
      (s.step === 2) ? (s.amount > 0 && s.amount <= s.remaining) :
      true;

    const nextLabel = s.step === 3 ? 'Confirm Payment' : 'Continue';

    const html = `
      <div class="wpa-pay-ovr" id="wpaPayOverlay" onclick="if(event.target===this)WPA_closePayment()">
        <div class="wpa-pay">
          <div class="wpa-pay-hd">
            <h2>Pay Invoice</h2>
            <button class="close" onclick="WPA_closePayment()">✕</button>
          </div>
          <div class="wpa-pay-steps">${stepsHtml}</div>
          <div class="wpa-pay-body">${body}</div>
          <div class="wpa-pay-foot">
            ${s.step > 1 ? `<button class="back" onclick="WPA_payBack()">Back</button>` : ''}
            <button class="next" ${canNext?'':'disabled'} onclick="WPA_payNext()">${nextLabel}</button>
          </div>
        </div>
      </div>
    `;
    const ex = document.getElementById('wpaPayOverlay');
    if (ex) ex.remove();
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function _payRenderMethod(s) {
    return `
      <h3>How would you like to pay?</h3>
      <div class="sub">Remaining balance: <b>${_esc(MONEY(s.remaining))}</b></div>
      <div class="wpa-pay-method">
        <label class="${s.method==='ach'?'sel':''}" onclick="WPA_paySetMethod('ach')">
          <input type="radio" name="pm" ${s.method==='ach'?'checked':''}>
          <span class="m-icon">🏦</span>
          <div><div class="m-name">Bank Account (ACH)</div><div class="m-sub">Takes 2–5 business days</div></div>
          <span class="m-fee free">FREE</span>
        </label>
        <label class="${s.method==='card'?'sel':''}" onclick="WPA_paySetMethod('card')">
          <input type="radio" name="pm" ${s.method==='card'?'checked':''}>
          <span class="m-icon">💳</span>
          <div><div class="m-name">Credit / Debit Card</div><div class="m-sub">Instant · processing fee applies</div></div>
          <span class="m-fee paid">+3.5%</span>
        </label>
      </div>
    `;
  }

  function _payRenderAmount(s) {
    const fee = s.method === 'card' ? s.amount * CC_FEE_PCT : 0;
    const total = s.amount + fee;
    const presets = [
      { lbl: 'Full balance', val: s.remaining },
      { lbl: 'Half', val: Math.round(s.remaining/2) },
      { lbl: '$100', val: Math.min(100, s.remaining) }
    ];
    return `
      <h3>How much would you like to pay?</h3>
      <div class="sub">You can pay the full amount or make a partial payment.</div>
      <div class="wpa-pay-amt">
        <span style="font-family:'Playfair Display',serif;font-size:26px;font-weight:800">$</span>
        <input type="number" min="1" max="${s.remaining}" step="0.01" value="${s.amount}" id="wpaPayAmtInput" oninput="WPA_paySetAmount(this.value)">
      </div>
      <div class="wpa-pay-presets">
        ${presets.map(p => `<button onclick="WPA_paySetAmount(${p.val})">${_esc(p.lbl)} — ${_esc(MONEY(p.val))}</button>`).join('')}
      </div>
      <div class="wpa-pay-summary">
        <div class="row"><span>Payment amount</span><span>${_esc(MONEY(s.amount))}</span></div>
        ${fee > 0 ? `<div class="row"><span>Card processing (3.5%)</span><span>${_esc(MONEY(fee))}</span></div>` : ''}
        <div class="row total"><span>You'll be charged</span><span>${_esc(MONEY(total))}</span></div>
      </div>
      ${s.amount < s.remaining ? `<div class="sub" style="margin-top:10px;color:#b86818">⚠ Partial payment — ${_esc(MONEY(s.remaining - s.amount))} will remain on this invoice.</div>` : ''}
    `;
  }

  function _payRenderAutopay(s) {
    // MTM cannot set up autopay
    if (s.leaseType === 'mtm') {
      s.autopay = false;
      s.autopayCap = { count: 0, reason: 'not available for month-to-month' };
      return `
        <h3>Autopay</h3>
        <div class="sub">Autopay is not available for month-to-month leases. Each month's rent must be paid manually.</div>
        <div class="wpa-pay-auto" style="opacity:.55;pointer-events:none">
          <label class="toggle">
            <input type="checkbox" disabled>
            Autopay (unavailable for month-to-month)
          </label>
        </div>
        <div class="sub" style="margin-top:10px">You'll be charged ${_esc(MONEY(s.amount + (s.method==='card'?s.amount*CC_FEE_PCT:0)))} for this invoice.</div>
      `;
    }
    const cap = _autopayCap(s);
    s.autopayCap = cap;
    return `
      <h3>Set up autopay? (optional)</h3>
      <div class="sub">Automatically pay future monthly invoices using the same method.</div>
      <div class="wpa-pay-auto ${s.autopay?'on':''}" id="wpaPayAuto">
        <label class="toggle">
          <input type="checkbox" ${s.autopay?'checked':''} onchange="WPA_payToggleAutopay(this.checked)">
          Enable autopay for this lease
        </label>
        <div class="auto-body">
          <div class="auto-row"><span>Scheduled payments</span><b>${cap.count}</b></div>
          <div class="auto-row"><span>Cap reason</span><span>${_esc(cap.reason)}</span></div>
          <div class="auto-row"><span>Method</span><b>${s.method==='card'?'Credit Card (3.5% fee)':'ACH (free)'}</b></div>
          <div class="auto-row"><span>Stops</span><span>At lease end or after 12 payments</span></div>
          <div class="auto-row" style="color:#8590a8;font-size:11px"><span>You can cancel any upcoming invoice from your portal.</span></div>
        </div>
      </div>
      <div class="sub" style="margin-top:10px">You'll still be charged ${_esc(MONEY(s.amount + (s.method==='card'?s.amount*CC_FEE_PCT:0)))} for this invoice now.</div>
    `;
  }

  window.WPA_paySetMethod = function (m) { if (!_payState) return; _payState.method = m; _renderPay(); };
  window.WPA_paySetAmount = function (v) {
    if (!_payState) return;
    let n = Number(v) || 0;
    if (n < 0) n = 0;
    if (n > _payState.remaining) n = _payState.remaining;
    _payState.amount = n;
    // Update only the summary + presets; re-render for simplicity
    _renderPay();
    // Preserve focus on input
    const el = document.getElementById('wpaPayAmtInput');
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  };
  window.WPA_payToggleAutopay = function (on) { if (!_payState) return; _payState.autopay = !!on; _renderPay(); };
  window.WPA_payBack = function () { if (!_payState) return; _payState.step = Math.max(1, _payState.step - 1); _renderPay(); };
  window.WPA_payNext = function () {
    if (!_payState) return;
    if (_payState.step < 3) { _payState.step += 1; _renderPay(); return; }
    // Step 3 → confirm + fake charge (Phase 2 will hit Stripe)
    WPA_payConfirm();
  };

  window.WPA_payConfirm = async function () {
    const s = _payState;
    if (!s) return;
    const fee = s.method === 'card' ? s.amount * CC_FEE_PCT : 0;
    const charged = s.amount + fee;
    // Demo insert into payments table (NOT a real charge)
    try {
      const payload = {
        invoice_id: s.invoice.id,
        amount: s.amount,
        method: s.method,
        status: 'pending',   // will flip to 'succeeded' once Stripe integration lands
        paid_at: new Date().toISOString(),
        payer_name: (s.bundle && s.bundle.tenant && s.bundle.tenant.name) || 'Tenant'
      };
      await _sbInsert('payments', payload);

      // Persist autopay: mark the next N upcoming invoices for this unit with [AUTOPAY]
      let autopayMarked = 0;
      if (s.autopay && s.leaseType !== 'mtm' && s.autopayCap && s.autopayCap.count > 0) {
        try {
          const todayIso = new Date().toISOString().slice(0,10);
          const q = 'invoices?select=id,notes,due_date&property=eq.' + encodeURIComponent(s.invoice.property)
                  + '&unit=eq.' + encodeURIComponent(s.invoice.unit)
                  + '&status=in.(open,partial)'
                  + '&due_date=gt.' + todayIso
                  + '&order=due_date.asc&limit=' + s.autopayCap.count;
          const future = await _sb(q);
          for (const f of (future || [])) {
            if (f.notes && /\[AUTOPAY\]/i.test(f.notes)) continue;
            const newNotes = ('[AUTOPAY] ' + (f.notes || '')).trim();
            await _sbPatch('invoices?id=eq.' + f.id, { notes: newNotes });
            autopayMarked++;
          }
        } catch (ae) { console.warn('[autopay persist]', ae); }
      }

      alert('Payment recorded (demo)\n\nMethod: ' + (s.method === 'card' ? 'Credit Card' : 'Bank/ACH') +
            '\nCharged: ' + MONEY(charged) +
            (fee ? '\n(includes ' + MONEY(fee) + ' processing fee)' : '') +
            (s.autopay && autopayMarked > 0 ? '\n\n⚡ Autopay scheduled for ' + autopayMarked + ' future payment(s) (' + s.autopayCap.reason + ').\nYou can cancel any upcoming autopay from your portal.' : '') +
            '\n\nNote: Real Stripe charge comes in Phase 2.');
      WPA_closePayment();
      // Reload the invoice to show the new payment row
      if (_viewInvoiceId) WPA_openInvoice(_viewInvoiceId, { mode: _viewMode });
    } catch (e) {
      alert('Failed to record payment: ' + e.message);
    }
  };

  /* ════════════════════════════════════════════════════════════
     PHASE 9 — Admin Edit Invoice + Mark as Paid + Void, line
     item CRUD, payment removal, and notes. Replaces the old
     "wired in Phase 2 of the Rent module" stubs.

     Uses the existing _sb / _sbInsert / _sbPatch helpers. Adds a
     _sbDelete helper for the DELETE verb. Every modal is a
     self-contained overlay that renders on top of the currently
     open invoice overlay (z-index 10100+). On save, we close the
     sub-modal and re-open the invoice via WPA_openInvoice so the
     data refreshes cleanly.
     ──────────────────────────────────────────────────────────── */

  async function _sbDelete(path) {
    const r = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/' + path, {
      method: 'DELETE',
      headers: {
        apikey: CONFIG.SUPABASE_KEY,
        Authorization: 'Bearer ' + CONFIG.SUPABASE_KEY,
        Prefer: 'return=minimal'
      }
    });
    if (!r.ok) throw new Error('[' + path + '] HTTP ' + r.status + ' ' + (await r.text()));
    return true;
  }

  // ─── Phase-9 CSS (injected once) ──────────────────────────────
  function _p9InjectCSS() {
    if (document.getElementById('wpaP9CSS')) return;
    const s = document.createElement('style');
    s.id = 'wpaP9CSS';
    s.textContent = `
      .wpa-p9-ovr{position:fixed;inset:0;background:rgba(20,28,52,.55);z-index:10100;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto}
      .wpa-p9{background:#fff;border-radius:14px;width:100%;max-width:640px;box-shadow:0 24px 80px rgba(20,28,52,.35);font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#141c34}
      .wpa-p9.big{max-width:820px}
      .wpa-p9-hd{padding:20px 24px 14px;border-bottom:1px solid #e4e8f2;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
      .wpa-p9-hd h2{margin:0 0 4px;font-size:17px;font-weight:700}
      .wpa-p9-hd .sub{color:#4d5670;font-size:12px}
      .wpa-p9-close{background:none;border:0;font-size:22px;line-height:1;color:#8590a8;cursor:pointer;padding:4px 8px}
      .wpa-p9-close:hover{color:#141c34}
      .wpa-p9-body{padding:18px 24px 6px}
      .wpa-p9-err{background:#fdf1f0;border:1px solid #eebfba;color:#b83228;padding:8px 12px;border-radius:7px;margin:0 0 14px;font-size:12px}
      .wpa-p9-row{display:grid;grid-template-columns:140px 1fr;gap:14px;align-items:center;margin-bottom:12px}
      .wpa-p9-row label{font-size:12px;color:#4d5670;font-weight:600}
      .wpa-p9-row input[type=text],.wpa-p9-row input[type=date],.wpa-p9-row input[type=number],
      .wpa-p9-row select,.wpa-p9-row textarea{
        width:100%;padding:8px 10px;border:1px solid #c4cdeb;border-radius:7px;font-size:13px;background:#fff;color:#141c34;font-family:inherit;box-sizing:border-box
      }
      .wpa-p9-row textarea{min-height:64px;resize:vertical}
      .wpa-p9-row input:focus,.wpa-p9-row select:focus,.wpa-p9-row textarea:focus{outline:0;border-color:#3651b5;box-shadow:0 0 0 3px rgba(54,81,181,.12)}
      .wpa-p9-row .ro{color:#141c34;font-weight:500;padding:8px 0}
      .wpa-p9-lines{margin-top:16px;border-top:1px solid #e4e8f2;padding-top:14px}
      .wpa-p9-lines h3{margin:0 0 10px;font-size:13px;font-weight:700;display:flex;justify-content:space-between;align-items:center}
      .wpa-p9-lines h3 .add{background:#eef1fb;border:1px solid #c4cdeb;color:#3651b5;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer}
      .wpa-p9-lines h3 .add:hover{background:#dde3f5}
      .wpa-p9-tbl{width:100%;border-collapse:collapse;font-size:13px}
      .wpa-p9-tbl th{text-align:left;padding:6px 8px;color:#4d5670;font-size:11px;font-weight:600;border-bottom:1px solid #e4e8f2;text-transform:uppercase;letter-spacing:.04em}
      .wpa-p9-tbl td{padding:6px 4px;vertical-align:top}
      .wpa-p9-tbl td input,.wpa-p9-tbl td select{width:100%;padding:6px 8px;border:1px solid #c4cdeb;border-radius:6px;font-size:13px;background:#fff;color:#141c34;box-sizing:border-box}
      .wpa-p9-tbl td input[type=number]{text-align:right}
      .wpa-p9-tbl th.amt,.wpa-p9-tbl td.amt{text-align:right;width:110px}
      .wpa-p9-tbl th.kind,.wpa-p9-tbl td.kind{width:170px}
      .wpa-p9-tbl th.rm,.wpa-p9-tbl td.rm{width:32px;text-align:center}
      .wpa-p9-tbl .rm button{background:none;border:0;color:#8590a8;font-size:18px;line-height:1;cursor:pointer;padding:4px}
      .wpa-p9-tbl .rm button:hover{color:#b83228}
      .wpa-p9-tot{display:flex;justify-content:flex-end;gap:18px;padding:12px 4px 2px;font-size:14px;border-top:1px solid #e4e8f2;margin-top:6px}
      .wpa-p9-tot .lbl{color:#4d5670;font-weight:600}
      .wpa-p9-tot .val{font-weight:700;min-width:100px;text-align:right}
      .wpa-p9-ft{padding:14px 24px 18px;border-top:1px solid #e4e8f2;display:flex;gap:10px;justify-content:flex-end;background:#fafbfe;border-radius:0 0 14px 14px;margin-top:10px;flex-wrap:wrap}
      .wpa-p9-ft .spacer{flex:1}
      .wpa-p9-btn{padding:9px 18px;border-radius:7px;border:1px solid #c4cdeb;background:#fff;color:#141c34;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
      .wpa-p9-btn:hover{background:#f5f7fb}
      .wpa-p9-btn.primary{background:#3651b5;border-color:#3651b5;color:#fff}
      .wpa-p9-btn.primary:hover{background:#2b4399}
      .wpa-p9-btn.publish{background:#1f7a4d;border-color:#1f7a4d;color:#fff}
      .wpa-p9-btn.publish:hover{background:#176138}
      .wpa-p9-btn.danger{background:#fff;border-color:#eebfba;color:#b83228}
      .wpa-p9-btn.danger:hover{background:#fdf1f0}
      .wpa-p9-btn:disabled{opacity:.5;cursor:not-allowed}
    `;
    document.head.appendChild(s);
  }

  function _p9Close() {
    const o = document.getElementById('wpaP9Overlay');
    if (o) o.remove();
  }
  window.WPA_closeP9 = _p9Close;

  // Refresh the open invoice overlay after any Phase-9 write.
  function _p9Refresh(id) {
    const invId = id || _viewInvoiceId;
    if (invId && typeof WPA_openInvoice === 'function'
        && document.getElementById('wpaInvOverlay')) {
      WPA_openInvoice(invId, { mode: _viewMode });
    }
  }

  /* ─── Edit Invoice (full: header + lines + status override) ─── */

  let _editState = null;

  window.WPA_invoiceEdit = async function (id) {
    if (!id) return;
    _p9InjectCSS();
    // Open with a loading pane so the user sees something immediately
    _editOpenShell('<div style="padding:40px;text-align:center;color:#8590a8">Loading invoice…</div>');
    try {
      const [invArr, lines] = await Promise.all([
        _sb('invoices?id=eq.' + id + '&select=*'),
        _sb('invoice_lines?invoice_id=eq.' + id + '&select=*&order=created_at.asc')
      ]);
      if (!invArr.length) throw new Error('Invoice not found');
      const inv = invArr[0];
      _editState = {
        id: id,
        property: inv.property || '',
        unit: inv.unit || '',
        subject: inv.subject || '',
        notes: inv.notes || '',
        dueDate: (inv.due_date || '').slice(0, 10),
        status: inv.status || 'open',
        // Keep original line ids so we can diff on save
        lines: (lines || []).map(l => ({
          id: l.id,
          kind: l.kind || 'service',
          description: l.description || '',
          amount: (l.amount == null ? '' : String(l.amount))
        })),
        removedIds: [],
        saving: false,
        error: ''
      };
      if (!_editState.lines.length) {
        _editState.lines.push({ id: null, kind: 'service', description: '', amount: '' });
      }
      _editRender();
    } catch (e) {
      _editOpenShell('<div style="padding:40px;text-align:center;color:#b83228">Failed to load: ' + _esc(e.message) + '</div>');
    }
  };

  function _editOpenShell(inner) {
    _p9Close();
    const ovr = document.createElement('div');
    ovr.id = 'wpaP9Overlay';
    ovr.className = 'wpa-p9-ovr';
    ovr.innerHTML = '<div class="wpa-p9 big">' + inner + '</div>';
    ovr.addEventListener('click', e => { if (e.target === ovr) _p9Close(); });
    document.body.appendChild(ovr);
  }

  function _editRender() {
    if (!_editState) return;
    const st = _editState;

    const kindOpts = _CI_KINDS.map(k => ({ v: k.v, l: k.l }));
    const statusOpts = [
      { v: 'draft',   l: 'Draft' },
      { v: 'open',    l: 'Open' },
      { v: 'partial', l: 'Partial' },
      { v: 'paid',    l: 'Paid' },
      { v: 'void',    l: 'Void' }
    ];

    const lineRows = st.lines.map((l, i) => `
      <tr>
        <td class="kind">
          <select onchange="_editLineUpd(${i},'kind',this.value)">
            ${kindOpts.map(k => `<option value="${k.v}" ${l.kind===k.v?'selected':''}>${_esc(k.l)}</option>`).join('')}
          </select>
        </td>
        <td>
          <input type="text" placeholder="Description"
            value="${_esc(l.description || '')}"
            oninput="_editLineUpd(${i},'description',this.value)">
        </td>
        <td class="amt">
          <input type="number" step="0.01" placeholder="0.00"
            value="${l.amount === '' || l.amount == null ? '' : String(l.amount)}"
            oninput="_editLineUpd(${i},'amount',this.value)">
        </td>
        <td class="rm">
          ${st.lines.length > 1 ? `<button type="button" onclick="_editLineRm(${i})" title="Remove line">×</button>` : ''}
        </td>
      </tr>
    `).join('');

    const total = st.lines.reduce((s, l) => {
      const n = Number(l.amount || 0);
      if (!isFinite(n)) return s;
      return s + (l.kind === 'credit' ? -Math.abs(n) : n);
    }, 0);

    const html = `
      <div class="wpa-p9-hd">
        <div>
          <h2>Edit Invoice</h2>
          <div class="sub">${_esc(st.property || '—')}${st.unit ? ' · Unit ' + _esc(st.unit) : ''}</div>
        </div>
        <button class="wpa-p9-close" onclick="WPA_closeP9()" title="Close">✕</button>
      </div>
      <div class="wpa-p9-body">
        ${st.error ? `<div class="wpa-p9-err">${_esc(st.error)}</div>` : ''}
        <div class="wpa-p9-row">
          <label>Subject</label>
          <input type="text" placeholder="e.g. April rent"
            value="${_esc(st.subject)}"
            oninput="_editFieldUpd('subject',this.value)">
        </div>
        <div class="wpa-p9-row">
          <label>Due Date</label>
          <input type="date" value="${_esc(st.dueDate)}" oninput="_editFieldUpd('dueDate',this.value)">
        </div>
        <div class="wpa-p9-row">
          <label>Status</label>
          <select onchange="_editFieldUpd('status',this.value)">
            ${statusOpts.map(o => `<option value="${o.v}" ${st.status===o.v?'selected':''}>${_esc(o.l)}</option>`).join('')}
          </select>
        </div>
        <div class="wpa-p9-row">
          <label>Notes</label>
          <textarea oninput="_editFieldUpd('notes',this.value)" placeholder="Internal notes (visible to admins; first line shows as subject if Subject is blank)">${_esc(st.notes || '')}</textarea>
        </div>
        <div class="wpa-p9-lines">
          <h3>
            <span>Line Items</span>
            <span class="add" onclick="_editLineAdd()">+ Add Line</span>
          </h3>
          <table class="wpa-p9-tbl">
            <thead><tr><th class="kind">Kind</th><th>Description</th><th class="amt">Amount</th><th class="rm"></th></tr></thead>
            <tbody>${lineRows}</tbody>
          </table>
          <div class="wpa-p9-tot">
            <span class="lbl">Total</span>
            <span class="val" id="wpaEditTotal">${_esc(MONEY(total))}</span>
          </div>
        </div>
      </div>
      <div class="wpa-p9-ft">
        <button class="wpa-p9-btn" onclick="WPA_closeP9()">Cancel</button>
        <div class="spacer"></div>
        <button class="wpa-p9-btn primary" ${st.saving?'disabled':''} onclick="_editSave()">Save Changes</button>
      </div>
    `;

    _editOpenShell(html);
  }

  // Top-level field updates — don't re-render (would kill caret focus).
  window._editFieldUpd = function (field, val) {
    if (!_editState) return;
    _editState[field] = val;
  };
  // Line updates: text/number/kind change → state only + refresh total.
  window._editLineUpd = function (idx, field, val) {
    if (!_editState || !_editState.lines[idx]) return;
    _editState.lines[idx][field] = val;
    if (field === 'amount' || field === 'kind') {
      const el = document.getElementById('wpaEditTotal');
      if (el) {
        const total = _editState.lines.reduce((s, l) => {
          const n = Number(l.amount || 0);
          if (!isFinite(n)) return s;
          return s + (l.kind === 'credit' ? -Math.abs(n) : n);
        }, 0);
        el.textContent = MONEY(total);
      }
    }
  };
  window._editLineAdd = function () {
    if (!_editState) return;
    _editState.lines.push({ id: null, kind: 'service', description: '', amount: '' });
    _editRender();
  };
  window._editLineRm = function (idx) {
    if (!_editState) return;
    const removed = _editState.lines.splice(idx, 1)[0];
    if (removed && removed.id) _editState.removedIds.push(removed.id);
    if (_editState.lines.length === 0) {
      _editState.lines.push({ id: null, kind: 'service', description: '', amount: '' });
    }
    _editRender();
  };

  window._editSave = async function () {
    if (!_editState || _editState.saving) return;
    const st = _editState;
    st.error = '';

    // Clean + validate
    const cleanLines = st.lines.map(l => ({
      id: l.id,
      kind: l.kind,
      description: (l.description || '').trim(),
      amount: Number(l.amount || 0)
    })).filter(l => isFinite(l.amount) && (Math.abs(l.amount) > 0.005 || l.id));
    // Auto-negate credit lines
    cleanLines.forEach(l => { if (l.kind === 'credit') l.amount = -Math.abs(l.amount); });
    if (!cleanLines.filter(l => Math.abs(l.amount) > 0.005).length) {
      st.error = 'At least one line item must have a non-zero amount.';
      _editRender();
      return;
    }
    const missingDesc = cleanLines.find(l => !l.description);
    if (missingDesc) { st.error = 'Every line item needs a description.'; _editRender(); return; }
    if (!st.dueDate) { st.error = 'Due date required.'; _editRender(); return; }

    const total = cleanLines.reduce((s, l) => s + l.amount, 0);
    st.saving = true;
    _editRender();

    try {
      // 1. Remove deleted lines
      for (const rid of st.removedIds) {
        await _sbDelete('invoice_lines?id=eq.' + encodeURIComponent(rid));
      }
      // 2. Patch existing lines
      const existing = cleanLines.filter(l => l.id);
      for (const l of existing) {
        await _sbPatch('invoice_lines?id=eq.' + encodeURIComponent(l.id), {
          kind: l.kind, description: l.description, amount: l.amount
        });
      }
      // 3. Insert new lines
      const fresh = cleanLines.filter(l => !l.id).map(l => ({
        invoice_id: st.id,
        kind: l.kind,
        description: l.description,
        amount: l.amount,
        day_offset: null,
        created_by: 'admin'
      }));
      if (fresh.length) await _sbInsert('invoice_lines', fresh);

      // 4. Patch the invoice header (subject/notes/due_date/status/total)
      const patch = {
        subject: st.subject || null,
        notes:   st.notes   || null,
        due_date: st.dueDate,
        status: st.status,
        total: total
      };
      await _sbPatch('invoices?id=eq.' + encodeURIComponent(st.id), patch);

      _p9Close();
      _editState = null;
      _p9Refresh(st.id);
    } catch (e) {
      console.error('[editSave]', e);
      st.saving = false;
      st.error = 'Save failed: ' + (e && e.message ? e.message : String(e));
      _editRender();
    }
  };

  /* ─── Record Payment / Mark as Paid ─────────────────────────── */

  let _recState = null;

  window.WPA_invoiceRecordPayment = async function (id) {
    if (!id) return;
    _p9InjectCSS();
    _editOpenShell('<div style="padding:40px;text-align:center;color:#8590a8">Loading invoice…</div>');
    try {
      const [invArr, pays] = await Promise.all([
        _sb('invoices?id=eq.' + id + '&select=*'),
        _sb('payments?invoice_id=eq.' + id + '&select=amount,status')
      ]);
      if (!invArr.length) throw new Error('Invoice not found');
      const inv = invArr[0];
      const paidSum = (pays || [])
        .filter(p => p.status === 'paid' || p.status === 'succeeded')
        .reduce((s, p) => s + Number(p.amount || 0), 0);
      const remaining = Math.max(0, Number(inv.total || 0) - paidSum);
      _recState = {
        id: id,
        tenantId: inv.tenant_id || null,    // payments.tenant_id is NOT NULL
        leaseId:  inv.lease_id  || null,    // payments.lease_id may be NOT NULL too
        property: inv.property || '',
        unit: inv.unit || '',
        invoiceTotal: Number(inv.total || 0),
        paidSum: paidSum,
        amount: remaining > 0 ? remaining.toFixed(2) : '0.00',
        method: 'manual',
        paidAt: new Date().toISOString().slice(0, 10),
        payer: '',
        memo: '',
        saving: false,
        error: ''
      };
      _recRender();
    } catch (e) {
      _editOpenShell('<div style="padding:40px;text-align:center;color:#b83228">Failed to load: ' + _esc(e.message) + '</div>');
    }
  };

  function _recRender() {
    if (!_recState) return;
    const st = _recState;
    const remaining = st.invoiceTotal - st.paidSum;
    const methodOpts = [
      { v: 'manual', l: 'Manual / Other' },
      { v: 'cash',   l: 'Cash' },
      { v: 'check',  l: 'Check' },
      { v: 'ach',    l: 'ACH / Bank Transfer' },
      { v: 'card',   l: 'Credit Card (offline)' }
    ];
    const html = `
      <div class="wpa-p9-hd">
        <div>
          <h2>Record Payment</h2>
          <div class="sub">${_esc(st.property || '—')}${st.unit ? ' · Unit ' + _esc(st.unit) : ''} · Remaining ${_esc(MONEY(remaining))}</div>
        </div>
        <button class="wpa-p9-close" onclick="WPA_closeP9()" title="Close">✕</button>
      </div>
      <div class="wpa-p9-body">
        ${st.error ? `<div class="wpa-p9-err">${_esc(st.error)}</div>` : ''}
        <div class="wpa-p9-row">
          <label>Amount</label>
          <input type="number" step="0.01" min="0" value="${_esc(st.amount)}" oninput="_recFieldUpd('amount',this.value)">
        </div>
        <div class="wpa-p9-row">
          <label>Method</label>
          <select onchange="_recFieldUpd('method',this.value)">
            ${methodOpts.map(o => `<option value="${o.v}" ${st.method===o.v?'selected':''}>${_esc(o.l)}</option>`).join('')}
          </select>
        </div>
        <div class="wpa-p9-row">
          <label>Paid On</label>
          <input type="date" value="${_esc(st.paidAt)}" oninput="_recFieldUpd('paidAt',this.value)">
        </div>
        <div class="wpa-p9-row">
          <label>Payer Name</label>
          <input type="text" placeholder="Tenant / payer name" value="${_esc(st.payer)}" oninput="_recFieldUpd('payer',this.value)">
        </div>
        <div class="wpa-p9-row">
          <label>Memo</label>
          <textarea placeholder="Optional reference (check #, confirmation, etc.)" oninput="_recFieldUpd('memo',this.value)">${_esc(st.memo || '')}</textarea>
        </div>
        <div class="wpa-p9-row">
          <label>Status</label>
          <div style="color:#4d5670;font-size:12px">
            Auto — full payment → <b>paid</b>, partial → <b>partial</b>. Override via Edit Invoice if needed.
          </div>
        </div>
      </div>
      <div class="wpa-p9-ft">
        <button class="wpa-p9-btn" onclick="WPA_closeP9()">Cancel</button>
        <div class="spacer"></div>
        <button class="wpa-p9-btn publish" ${st.saving?'disabled':''} onclick="_recSave()">Record Payment</button>
      </div>
    `;
    _editOpenShell(html);
  }

  window._recFieldUpd = function (f, v) {
    if (!_recState) return;
    _recState[f] = v;
  };

  window._recSave = async function () {
    if (!_recState || _recState.saving) return;
    const st = _recState;
    st.error = '';
    const amt = Number(st.amount);
    if (!isFinite(amt) || amt <= 0) {
      st.error = 'Enter a positive amount.'; _recRender(); return;
    }
    if (!st.paidAt) { st.error = 'Paid-on date required.'; _recRender(); return; }

    if (!st.tenantId) {
      st.error = 'This invoice has no tenant_id — can\'t record a payment until it\'s assigned. Use Edit Invoice to set it, or fix the row in Supabase.';
      _recRender();
      return;
    }

    st.saving = true;
    _recRender();
    try {
      const paidAtIso = new Date(st.paidAt + 'T12:00:00').toISOString();
      const row = {
        invoice_id: st.id,
        tenant_id: st.tenantId,
        lease_id:  st.leaseId || null,
        amount: amt,
        method: st.method || 'manual',
        status: 'paid',
        payer_name: st.payer || null,
        paid_at: paidAtIso,
        failure_reason: st.memo ? ('memo: ' + st.memo) : null
      };
      await _sbInsert('payments', row);

      // Always recompute status + the legacy paid column from the
      // actual payment rows. Full coverage → 'paid', any coverage
      // short of full → 'partial', none → 'open'. The invoice list
      // reads invoices.paid (sum column), so we keep that in sync
      // here too — the Stripe flow updates it via webhook, but manual
      // inserts bypass that.
      await _reconcileInvoiceStatus(st.id);

      _p9Close();
      _recState = null;
      _p9Refresh(st.id);
    } catch (e) {
      console.error('[recSave]', e);
      st.saving = false;
      st.error = 'Save failed: ' + (e && e.message ? e.message : String(e));
      _recRender();
    }
  };

  /* ─── Delete / Void Invoice ─────────────────────────────────── */

  window.WPA_invoiceDelete = async function (id) {
    if (!id) return;
    if (!confirm('Void this invoice?\n\nThe row stays in the database for audit — status flips to "void". This cannot be undone from the UI.')) return;
    try {
      await _sbPatch('invoices?id=eq.' + encodeURIComponent(id), { status: 'void' });
      _p9Refresh(id);
    } catch (e) {
      alert('Void failed: ' + e.message);
    }
  };

  /* ─── Remove Payment row ────────────────────────────────────── */

  window.WPA_invoiceRemovePayment = async function (paymentId) {
    if (!paymentId) return;
    const invId = _viewInvoiceId;
    if (!confirm('Remove this payment row?\n\nThe payment is deleted and the invoice status is recomputed from the remaining paid rows (paid / partial / open). Void and draft invoices stay as-is.')) return;
    try {
      await _sbDelete('payments?id=eq.' + encodeURIComponent(paymentId));
      await _reconcileInvoiceStatus(invId);
      _p9Refresh(invId);
    } catch (e) {
      alert('Remove failed: ' + e.message);
    }
  };

  // Recompute invoices.status + invoices.paid from the remaining
  // payment rows. Called after a manual payment-row insert or delete
  // — the Stripe webhook does the same thing for real payments, but
  // there's no DB trigger on payment rows, so we roll it up from JS.
  //
  //   paidSum >= total   → 'paid'
  //   0 < paidSum < total → 'partial'
  //   paidSum === 0      → 'open' (leave void/draft alone — admin
  //                        intent wins on those two)
  //
  // We also write `invoices.paid` = paidSum so the list view (which
  // reads that legacy column directly) matches the detail view.
  //
  // The `invoices_touch_updated_at` trigger takes care of clearing
  // paid_at on the transition out of 'paid', so we don't have to.
  async function _reconcileInvoiceStatus(invoiceId) {
    if (!invoiceId) return;
    try {
      const [invArr, pays] = await Promise.all([
        _sb('invoices?id=eq.' + encodeURIComponent(invoiceId) + '&select=total,status,paid'),
        _sb('payments?invoice_id=eq.' + encodeURIComponent(invoiceId) + '&select=amount,status')
      ]);
      if (!invArr.length) return;
      const cur = invArr[0];
      const curStatus = cur.status || 'open';
      const total = Number(cur.total || 0);
      const paidSum = (pays || [])
        .filter(p => p.status === 'paid' || p.status === 'succeeded')
        .reduce((s, p) => s + Number(p.amount || 0), 0);
      const paidRounded = Math.round(paidSum * 100) / 100;

      // void / draft: admin intent wins on status, but still keep the
      // paid column truthful so the list doesn't lie.
      if (curStatus === 'void' || curStatus === 'draft') {
        const curPaid = Number(cur.paid || 0);
        if (Math.abs(curPaid - paidRounded) > 0.005) {
          await _sbPatch('invoices?id=eq.' + encodeURIComponent(invoiceId), { paid: paidRounded });
        }
        return;
      }

      let next;
      if (paidSum >= total - 0.005 && total > 0) next = 'paid';
      else if (paidSum > 0.005)                  next = 'partial';
      else                                       next = 'open';

      const patch = { paid: paidRounded };
      if (next !== curStatus) patch.status = next;
      // paid_at: stamp on entering 'paid'; the touch trigger clears
      // it when leaving. Only set if we're the ones flipping to paid.
      if (next === 'paid' && curStatus !== 'paid') {
        patch.paid_at = new Date().toISOString();
      }
      await _sbPatch('invoices?id=eq.' + encodeURIComponent(invoiceId), patch);
    } catch (e) {
      console.warn('[reconcileInvoiceStatus]', e);
    }
  }

  /* ─── Add / Edit / Remove individual line items ─────────────── */

  function _lineKindPromptLabel() {
    return _CI_KINDS.map((k, i) => (i + 1) + ') ' + k.l).join('\n');
  }

  window.WPA_invoiceAddLine = async function (invoiceId) {
    if (!invoiceId) return;
    const kindIdx = prompt('Line kind — enter number:\n\n' + _lineKindPromptLabel(), '1');
    if (kindIdx === null) return;
    const k = _CI_KINDS[(parseInt(kindIdx, 10) || 1) - 1];
    if (!k) { alert('Invalid kind.'); return; }
    const desc = prompt('Description for the "' + k.l + '" line:', '');
    if (desc === null) return;
    if (!desc.trim()) { alert('Description required.'); return; }
    const amtStr = prompt('Amount (e.g. 125.00). Credits are auto-negated.', '0');
    if (amtStr === null) return;
    let amt = Number(amtStr);
    if (!isFinite(amt) || Math.abs(amt) < 0.005) { alert('Invalid amount.'); return; }
    if (k.v === 'credit') amt = -Math.abs(amt);
    try {
      await _sbInsert('invoice_lines', [{
        invoice_id: invoiceId,
        kind: k.v,
        description: desc.trim(),
        amount: amt,
        day_offset: null,
        created_by: 'admin'
      }]);
      // Recompute invoice.total
      await _recomputeInvoiceTotal(invoiceId);
      _p9Refresh(invoiceId);
    } catch (e) {
      alert('Add line failed: ' + e.message);
    }
  };

  window.WPA_invoiceEditLine = async function (lineId) {
    if (!lineId) return;
    const invId = _viewInvoiceId;
    try {
      const arr = await _sb('invoice_lines?id=eq.' + encodeURIComponent(lineId) + '&select=*');
      if (!arr.length) { alert('Line not found.'); return; }
      const l = arr[0];
      const curIdx = Math.max(0, _CI_KINDS.findIndex(k => k.v === l.kind));
      const kindIdx = prompt('Line kind — enter number:\n\n' + _lineKindPromptLabel(),
                             String(curIdx + 1));
      if (kindIdx === null) return;
      const k = _CI_KINDS[(parseInt(kindIdx, 10) || 1) - 1];
      if (!k) { alert('Invalid kind.'); return; }
      const desc = prompt('Description:', l.description || '');
      if (desc === null) return;
      if (!desc.trim()) { alert('Description required.'); return; }
      const amtStr = prompt('Amount (credits auto-negated):',
                            l.amount == null ? '0' : String(Math.abs(l.amount)));
      if (amtStr === null) return;
      let amt = Number(amtStr);
      if (!isFinite(amt) || Math.abs(amt) < 0.005) { alert('Invalid amount.'); return; }
      if (k.v === 'credit') amt = -Math.abs(amt);
      await _sbPatch('invoice_lines?id=eq.' + encodeURIComponent(lineId), {
        kind: k.v, description: desc.trim(), amount: amt
      });
      await _recomputeInvoiceTotal(invId);
      _p9Refresh(invId);
    } catch (e) {
      alert('Edit line failed: ' + e.message);
    }
  };

  window.WPA_invoiceRemoveLine = async function (lineId) {
    if (!lineId) return;
    const invId = _viewInvoiceId;
    if (!confirm('Remove this line item?')) return;
    try {
      await _sbDelete('invoice_lines?id=eq.' + encodeURIComponent(lineId));
      await _recomputeInvoiceTotal(invId);
      _p9Refresh(invId);
    } catch (e) {
      alert('Remove line failed: ' + e.message);
    }
  };

  // Recompute invoices.total from the sum of invoice_lines.amount.
  // Used after AddLine / EditLine / RemoveLine so the header total
  // stays in sync without forcing the admin to open the full Edit
  // modal just to trigger the save.
  async function _recomputeInvoiceTotal(invoiceId) {
    if (!invoiceId) return;
    try {
      const lines = await _sb('invoice_lines?invoice_id=eq.' + encodeURIComponent(invoiceId) + '&select=amount');
      const total = (lines || []).reduce((s, l) => s + Number(l.amount || 0), 0);
      await _sbPatch('invoices?id=eq.' + encodeURIComponent(invoiceId), { total: total });
    } catch (e) {
      console.warn('[recomputeInvoiceTotal]', e);
    }
  }

  /* ─── Add Note (append to invoices.notes) ───────────────────── */

  window.WPA_invoiceAddNote = async function (invoiceId) {
    if (!invoiceId) return;
    const txt = prompt('Add a note to this invoice:\n\nAppended with a timestamp and [admin] tag. Visible on the admin invoice view.', '');
    if (txt === null) return;
    if (!txt.trim()) return;
    try {
      const arr = await _sb('invoices?id=eq.' + encodeURIComponent(invoiceId) + '&select=notes');
      const prev = (arr[0] && arr[0].notes) ? String(arr[0].notes) : '';
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const newLine = '[' + stamp + ' admin] ' + txt.trim();
      const merged = prev ? (prev.replace(/\s+$/, '') + '\n' + newLine) : newLine;
      await _sbPatch('invoices?id=eq.' + encodeURIComponent(invoiceId), { notes: merged });
      _p9Refresh(invoiceId);
    } catch (e) {
      alert('Add note failed: ' + e.message);
    }
  };

})();
