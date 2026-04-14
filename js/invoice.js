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
    // status from DB: open | paid | partial | void
    // display: map open → 'late' if past due, else 'pending'
    const s = (invoice.status || 'open').toLowerCase();
    if (s === 'paid') return { key: 'paid', label: 'Paid' };
    if (s === 'partial') return { key: 'partial', label: 'Partial' };
    if (s === 'void') return { key: 'void', label: 'Void' };
    const days = DAYS_BETWEEN(invoice.due_date, new Date().toISOString().slice(0, 10));
    if (days > 0) return { key: 'late', label: 'Late', daysLate: days };
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
    // Payments
    b.payments.forEach(p => {
      if (p.status !== 'succeeded') return;
      rows.push({
        when: p.paid_at || p.created_at,
        pill: 'green',
        label: 'Payment Received',
        body: '<b>' + _esc(MONEY(p.amount)) + '</b> paid via ' + _esc(p.method === 'ach' ? 'ACH' : 'Credit Card') +
              (p.stripe_payment_intent_id ? ' · <code style="font-size:11px;color:#4d5670">' + _esc(p.stripe_payment_intent_id) + '</code>' : ''),
        who: 'by Stripe',
      });
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
    const paid = Number(inv.paid || 0);
    const total = Number(inv.total || 0);
    const due = total - paid;
    const sumByKind = k => b.lines.filter(l => l.kind === k).reduce((s, l) => s + Number(l.amount), 0);
    const rentSum = sumByKind('rent');
    const lateSum = sumByKind('late_fee');
    const creditSum = sumByKind('credit'); // negative
    const miscSum = sumByKind('misc');
    const subjectText = _esc(inv.notes || ('Rent due ' + FMT_DATE(inv.due_date)));
    const invNum = inv.id ? ('WPA-' + inv.id.slice(0, 8).toUpperCase()) : '—';
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
            <div class="inv-logo"><img src="willow-logo.png" alt="Willow Partnership"></div>
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
            <button class="note-btn" onclick="WPA_invoiceAddNote('${_esc(inv.id)}')">➕ Add Note <span class="num">· ${(inv.notes ? 1 : 0)}</span></button>
            <div class="total-card ${status.key === 'paid' ? 'paid' : ''}">
              <div class="tc-lbl">Total Due</div>
              <div class="tc-val">${_esc(MONEY(due))}</div>
              <div class="tc-sub">of ${_esc(MONEY(total))} invoice · ${_esc(MONEY(paid))} paid</div>
            </div>
            <div class="stamp ${status.key}">${_esc(status.label)}</div>
          </div>
        </div>
      </div>

      <div class="act-bar">
        <button class="wbtn" onclick="WPA_invoiceDownload('${_esc(inv.id)}')"><span>⬇</span> Download PDF</button>
        <button class="wbtn primary" onclick="WPA_invoiceSendReminder('${_esc(inv.id)}')"><span>📧</span> Send Reminder</button>
        <button class="wbtn" onclick="WPA_invoiceRecordPayment('${_esc(inv.id)}')"><span>💳</span> Record Payment</button>
        <div class="spacer"></div>
        <button class="wbtn ghost" onclick="WPA_invoiceEdit('${_esc(inv.id)}')"><span>✏️</span> Edit</button>
        <button class="wbtn danger" onclick="WPA_invoiceDelete('${_esc(inv.id)}')"><span>🗑</span> Delete</button>
      </div>

      <div class="strip">
        <div><div class="s-lbl">Subject</div><div class="s-val">${subjectText}</div></div>
        <div><div class="s-lbl">Billed To</div><div class="s-val">${tenantName}${tenantContact ? '<br><span style="color:#4d5670;font-weight:400;font-size:12px">' + tenantContact + '</span>' : ''}</div></div>
        <div><div class="s-lbl">Property / Unit</div><div class="s-val">${_esc(inv.property || '')}${inv.unit ? '<br><span style="color:#4d5670;font-weight:400;font-size:12px">Unit ' + _esc(inv.unit) + '</span>' : ''}</div></div>
      </div>

      <div class="sec sec-items">
        <div class="sec-hd"><div><h3>Line Items</h3><div class="sec-sub">${b.lines.length} charge${b.lines.length === 1 ? '' : 's'}</div></div></div>
        <table class="items">
          <thead><tr><th style="width:30%">Item</th><th>Description</th><th class="num" style="width:80px">Qty</th><th class="num" style="width:110px">Rate</th><th class="num" style="width:120px">Amount</th><th style="width:60px"></th></tr></thead>
          <tbody>
            ${b.lines.map(l => _renderLineRow(l)).join('') || '<tr><td colspan="6" class="pay-empty">No line items yet</td></tr>'}
          </tbody>
        </table>
        <button class="add-line" onclick="WPA_invoiceAddLine('${_esc(inv.id)}')">＋ Add Line Item</button>
      </div>

      <div class="sec">
        <div class="sec-hd"><div><h3>Payments Received</h3><div class="sec-sub">${b.payments.filter(p=>p.status==='succeeded').length} payment(s) · ${_esc(MONEY(paid))}</div></div></div>
        ${b.payments.length ? _renderPaymentsCard(b.payments) : '<div class="pay-card"><div class="pay-empty">No payments recorded yet.</div></div>'}
      </div>

      <div class="sec">
        <div class="sec-hd"><div><h3>Invoice History</h3><div class="sec-sub">Audit trail — all actions on this invoice</div></div></div>
        <div class="tl">${_buildTimeline(b).map(r => _renderTimelineRow(r)).join('')}</div>
      </div>

      <div class="totals">
        <div class="totals-grid">
          ${rentSum ? `<div class="totals-row"><span>Rent</span><span>${_esc(MONEY(rentSum))}</span></div>` : ''}
          ${lateSum ? `<div class="totals-row"><span>Late fees</span><span>${_esc(MONEY(lateSum))}</span></div>` : ''}
          ${miscSum ? `<div class="totals-row"><span>Other</span><span>${_esc(MONEY(miscSum))}</span></div>` : ''}
          ${creditSum ? `<div class="totals-row credit"><span>Credits</span><span>${_esc(MONEY(creditSum))}</span></div>` : ''}
          <div class="totals-row strong"><span>Invoice total</span><span>${_esc(MONEY(total))}</span></div>
          ${paid ? `<div class="totals-row credit"><span>Payments received</span><span>${_esc(MONEY(-paid))}</span></div>` : ''}
          <div class="totals-divider"></div>
          <div class="totals-row grand"><span class="lbl">Total Due</span><span>${_esc(MONEY(due))}</span></div>
        </div>
      </div>
    `;
  }

  function _renderLineRow(l) {
    const kind = l.kind || 'misc';
    const tagCls = 'tag-' + kind.replace('_', '-');
    const tagLabel = { rent:'Rent', late_fee:'Late', credit:'Credit', misc:'Fee' }[kind] || 'Fee';
    const amtCls = Number(l.amount) < 0 ? 'amt credit' : 'amt';
    const qty = l.day_offset || 1;
    const rate = qty ? Number(l.amount) / qty : Number(l.amount);
    return `
      <tr>
        <td><span class="item-name">${_esc(tagLabel)}</span><span class="item-tag ${tagCls}">${_esc(tagLabel)}</span></td>
        <td><div>${_esc(l.description || '')}</div>${l.created_by ? '<div class="desc">Added by ' + _esc(l.created_by) + ' · ' + _esc(FMT_DATE(l.created_at)) + '</div>' : ''}</td>
        <td class="num">${qty}</td>
        <td class="num">${_esc(MONEY(rate))}</td>
        <td class="num ${amtCls}">${_esc(MONEY(l.amount))}</td>
        <td><div class="row-act"><button onclick="WPA_invoiceEditLine('${_esc(l.id)}')">✏️</button><button class="del" onclick="WPA_invoiceRemoveLine('${_esc(l.id)}')">✕</button></div></td>
      </tr>`;
  }

  function _renderPaymentsCard(payments) {
    const rows = payments.map(p => {
      const methodIcon = p.method === 'ach' ? '🏦' : '💳';
      const methodLbl = p.method === 'ach' ? 'ACH' : 'Credit Card';
      const stripeRef = p.stripe_payment_intent_id ? ' · <code style="font-size:10px;color:#4d5670">' + _esc(p.stripe_payment_intent_id) + '</code>' : '';
      const statusBadge = p.status !== 'succeeded' ? ` <span style="color:#b86818;font-size:10px;text-transform:uppercase;">(${_esc(p.status)})</span>` : '';
      return `<tr>
        <td><b>${_esc(p.payer_name || 'Tenant')}</b></td>
        <td>${_esc(FMT_DATETIME(p.created_at))}</td>
        <td>${_esc(p.paid_at ? FMT_DATE(p.paid_at) : '—')}${statusBadge}</td>
        <td><span class="method-pill">${methodIcon} ${methodLbl}${stripeRef}</span></td>
        <td class="num">${_esc(MONEY(p.amount))}</td>
        <td><button class="wbtn ghost" style="padding:4px 10px;font-size:11px" onclick="WPA_invoiceRemovePayment('${_esc(p.id)}')">Remove</button></td>
      </tr>`;
    }).join('');
    const total = payments.filter(p => p.status === 'succeeded').reduce((s, p) => s + Number(p.amount), 0);
    return `
      <div class="pay-card">
        <table class="pays">
          <thead><tr><th>Payer</th><th>Submitted</th><th>Deposited</th><th>Method</th><th class="num">Amount</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="pay-foot"><span>Total received</span><span>${_esc(MONEY(total))}</span></div>
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

  window.WPA_openInvoice = async function (invoiceId) {
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

  // ─── Action stubs (wired in later phases) ───────────────────
  ['AddNote','Download','SendReminder','RecordPayment','Edit','Delete','AddLine','EditLine','RemoveLine','RemovePayment'].forEach(fn => {
    const name = 'WPA_invoice' + fn;
    if (!window[name]) window[name] = function (id) {
      alert(fn + ' → ' + (id || '') + '\n\nThis action is wired in Phase 2 of the Rent module.');
    };
  });

  // ─── Press Esc to close ─────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('wpaInvOverlay')) WPA_closeInvoice();
  });

})();
