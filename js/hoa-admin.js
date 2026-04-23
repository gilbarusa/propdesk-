// hoa-admin.js — PropDesk HOA admin CRUD (Phase 1b)
// ----------------------------------------------------------------------------
// Self-contained module. Depends on:
//   * window.sb           — Supabase client (exposed by app.js)
//   * window.toast        — toast helper from app.js
//   * existing CSS classes (.page, .btn, .empty-state, .dash-header, etc.)
//
// Scope:
//   * Admin CRUD for HOA Communities, Units, Contacts, Unit Assignments,
//     Documents, and HOA Invoices.
//   * Reads/writes only the new hoa_* tables + (for HOA invoices) the
//     extended `invoices` columns (invoice_type, responsibility_scope,
//     unit_id, hoa_community_id).
//   * NO portal changes.
//   * NO service-requests UI — HOA owners/residents file cleaning,
//     maintenance, parking, etc. through the existing Home Services /
//     TechTrack / Parking modules once the Phase 2 auth bridge lands.
//
// Routing:
//   * app.js's MODULE_SUB_TABS gets a 'hoa' entry pointing at page IDs
//     'hoa-communities', 'hoa-units', ...
//   * app.js's showSubPage() calls window.WPA_hoaRender(section) for any
//     pageId starting with 'hoa-'.
// ----------------------------------------------------------------------------
(function(){
  'use strict';

  // ── Chelbourne's seeded UUID (matches migration 2026-04-22-hoa-module-phase1.sql)
  const CHELBOURNE_ID = '11111111-1111-1111-1111-111111111111';

  // ── Portal API base (Phase 2.5 / 3A) ──────────────────────────────────────
  //   The monthly-issue action + audit receipt endpoints live in portal PHP,
  //   not Supabase, because the issuer enforces cadence rules + writes
  //   invoice_lines. The admin SPA is served cross-origin from github.io,
  //   so we use absolute URLs. CORS is allowed on portal/api/index.php.
  const PORTAL_API_BASE = 'https://app.willowpa.com/api/';

  async function callPortalApi(action, body) {
    const resp = await fetch(PORTAL_API_BASE + '?action=' + encodeURIComponent(action), {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body || {}),
    });
    const text = await resp.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) { data = text; }
    return { http: resp.status, ok: resp.ok, data };
  }

  // Month helpers for the Issue flow.
  function nextMonthFirst() {
    const d = new Date();
    const y = d.getFullYear(), m = d.getMonth() + 1;  // 0-indexed month → +1, then +1 again for "next"
    const nm = m === 12 ? 1 : m + 1;
    const ny = m === 12 ? y + 1 : y;
    return ny + '-' + String(nm).padStart(2, '0') + '-01';
  }
  function addDaysIso(iso, days) {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  // ── helpers ───────────────────────────────────────────────────────────────
  async function hoaSupa() {
    // Reuse whatever app.js exposes. Falls back to common alternates.
    const s = window.sb || window.supa || window.supabaseClient;
    if (!s) throw new Error('Supabase client not initialised');
    return s;
  }
  function hoaToast(msg, type) {
    if (typeof window.toast === 'function') return window.toast(msg, type || '');
    // Fallback if toast() isn't available yet.
    console[type === 'error' ? 'error' : 'log']('[hoa-admin] ' + msg);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function hoaPhoneE164(raw) {
    if (!raw) return null;
    const d = String(raw).replace(/\D/g, '');
    if (d.length === 10) return '+1' + d;
    if (d.length === 11 && d[0] === '1') return '+' + d;
    return null;
  }
  function fmtMoney(n) {
    const v = Number(n || 0);
    return '$' + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtDate(d) {
    if (!d) return '';
    const s = String(d).slice(0, 10);
    return s;
  }
  function readField(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (el.type === 'checkbox') return el.checked;
    const v = el.value;
    return v === '' ? null : v;
  }
  function setField(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = (val == null ? '' : val);
  }

  // ── shared modal harness ──────────────────────────────────────────────────
  // A single overlay div reused across sections. Populated by each section's
  // open*Form() function.
  function ensureModalRoot() {
    let root = document.getElementById('hoaModalOverlay');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'hoaModalOverlay';
    root.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(40,28,14,.45);z-index:10000;align-items:flex-start;justify-content:center;padding:60px 16px;overflow:auto;';
    root.innerHTML = '<div id="hoaModalBox" style="background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.25);max-width:640px;width:100%;padding:22px 24px;font-family:\'DM Mono\',monospace;"></div>';
    root.addEventListener('click', function(e){
      if (e.target === root) closeModal();
    });
    document.body.appendChild(root);
    return root;
  }
  function openModal(innerHtml) {
    const root = ensureModalRoot();
    document.getElementById('hoaModalBox').innerHTML = innerHtml;
    root.style.display = 'flex';
  }
  function closeModal() {
    const root = document.getElementById('hoaModalOverlay');
    if (root) root.style.display = 'none';
  }

  // Reusable form-row template so every section has consistent layout.
  function row(label, inputHtml, help) {
    return '<div style="display:grid;grid-template-columns:150px 1fr;gap:10px;align-items:center;margin-bottom:10px;">' +
           '<label style="font-size:11px;color:#635c4e;">' + esc(label) + '</label>' +
           '<div>' + inputHtml + (help ? '<div style="font-size:10px;color:#9e9485;margin-top:4px;">' + esc(help) + '</div>' : '') + '</div>' +
           '</div>';
  }
  function inp(id, val, extra) {
    const v = val == null ? '' : esc(val);
    const x = extra || '';
    return '<input id="' + id + '" value="' + v + '" ' + x + ' style="width:100%;padding:8px 10px;border:1px solid #ddd8ce;border-radius:8px;font-family:\'DM Mono\',monospace;font-size:12px;">';
  }
  function txa(id, val) {
    return '<textarea id="' + id + '" rows="3" style="width:100%;padding:8px 10px;border:1px solid #ddd8ce;border-radius:8px;font-family:\'DM Mono\',monospace;font-size:12px;">' + esc(val || '') + '</textarea>';
  }
  function sel(id, options, val) {
    let h = '<select id="' + id + '" style="width:100%;padding:8px 10px;border:1px solid #ddd8ce;border-radius:8px;font-family:\'DM Mono\',monospace;font-size:12px;">';
    options.forEach(function(o){
      h += '<option value="' + esc(o.value) + '"' + (String(val) === String(o.value) ? ' selected' : '') + '>' + esc(o.label) + '</option>';
    });
    return h + '</select>';
  }
  function chk(id, val, label) {
    return '<label style="display:inline-flex;align-items:center;gap:8px;font-size:12px;color:#635c4e;cursor:pointer;">' +
           '<input type="checkbox" id="' + id + '"' + (val ? ' checked' : '') + ' style="width:15px;height:15px;accent-color:#7d5228;cursor:pointer;"> ' +
           esc(label || '') + '</label>';
  }
  function btn(label, onclick, variant) {
    const bg = variant === 'primary' ? '#7d5228' : (variant === 'danger' ? '#c03a2b' : '#f7f4ef');
    const fg = variant === 'primary' || variant === 'danger' ? '#fff' : '#635c4e';
    const br = variant === 'primary' || variant === 'danger' ? 'none' : '1px solid #ddd8ce';
    return '<button onclick="' + onclick + '" style="padding:9px 16px;border-radius:10px;border:' + br + ';background:' + bg + ';color:' + fg + ';font-family:\'DM Mono\',monospace;font-size:12px;cursor:pointer;">' + esc(label) + '</button>';
  }
  function actionsBar(buttons) {
    return '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;border-top:1px solid #f0ebe2;padding-top:14px;">' + buttons.join('') + '</div>';
  }

  // ── light caches so list screens can resolve FKs without re-fetching ──
  const cache = {
    communities: [],
    units: [],
    contacts: [],
    stripeCreds: [],
    categories: [],
    formTypes: [],
  };
  async function refreshCache(which) {
    const s = await hoaSupa();
    if (!which || which.indexOf('communities') >= 0) {
      const r = await s.from('hoa_communities').select('*').order('name');
      if (!r.error) cache.communities = r.data || [];
    }
    if (!which || which.indexOf('units') >= 0) {
      const r = await s.from('hoa_units').select('*').order('unit_label');
      if (!r.error) cache.units = r.data || [];
    }
    if (!which || which.indexOf('contacts') >= 0) {
      const r = await s.from('hoa_contacts').select('*').order('last_name');
      if (!r.error) cache.contacts = r.data || [];
    }
    if (!which || which.indexOf('stripeCreds') >= 0) {
      // Reuse existing app_credentials table. Tolerate the case where it's
      // locked down / schema is slightly different across deploys.
      try {
        const r = await s.from('app_credentials')
          .select('id, label, service, provider')
          .or('service.eq.stripe,provider.eq.stripe');
        if (!r.error) cache.stripeCreds = r.data || [];
      } catch (e) {
        cache.stripeCreds = [];
      }
    }
    if (!which || which.indexOf('categories') >= 0) {
      const r = await s.from('hoa_document_categories').select('*').order('sort_order');
      if (!r.error) cache.categories = r.data || [];
    }
    if (!which || which.indexOf('formTypes') >= 0) {
      const r = await s.from('hoa_form_types').select('*').order('name');
      if (!r.error) cache.formTypes = r.data || [];
    }
  }
  function findCommunity(id) { return cache.communities.find(c => c.id === id); }
  function findUnit(id) { return cache.units.find(u => u.id === id); }
  function findContact(id) { return cache.contacts.find(c => c.id === id); }

  // ── COMMUNITIES ───────────────────────────────────────────────────────────
  async function renderCommunities() {
    await refreshCache(['communities','stripeCreds']);
    const box = document.getElementById('hoa-communities-list');
    if (!box) return;
    const rows = cache.communities;
    if (!rows.length) {
      box.innerHTML = emptyBox('🏘', 'No communities yet.', '＋ New Community', 'WPA_hoaOpenCommunityForm()');
      return;
    }
    const credById = {};
    cache.stripeCreds.forEach(c => credById[c.id] = c.label || c.id);
    let h = '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;">';
    h += '<thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Name') + th('City / State') + th('Contact') + th('Grace') + th('Per-day fee') + th('Stripe') + th('Status') + th('') +
         '</tr></thead><tbody>';
    rows.forEach(r => {
      const loc = [r.city, r.state].filter(Boolean).join(', ');
      const contact = [r.contact_email, r.contact_phone].filter(Boolean).join(' · ');
      const stripeLbl = r.stripe_cred_id ? (credById[r.stripe_cred_id] || r.stripe_cred_id) : '—';
      h += '<tr style="border-bottom:1px solid #f0ebe2;">' +
           td('<strong>' + esc(r.name) + '</strong>' + (r.display_name && r.display_name !== r.name ? '<br><span style="color:#9e9485;font-size:10px;">' + esc(r.display_name) + '</span>' : '')) +
           td(esc(loc || '—')) +
           td(esc(contact || '—')) +
           td(String(r.grace_days || 0)) +
           td(fmtMoney(r.per_day_late_fee)) +
           td(esc(stripeLbl)) +
           td(r.is_active ? '<span style="color:#2c7a3f;">● Active</span>' : '<span style="color:#9e9485;">○ Inactive</span>') +
           td(btn('Edit', "WPA_hoaOpenCommunityForm('" + r.id + "')") + ' ' +
              btn('🔔 Issue',  "WPA_hoaOpenIssueModal('" + r.id + "')") + ' ' +
              btn('📄 Runs',   "WPA_hoaOpenRunsModal('" + r.id + "')") + ' ' +
              btn(r.is_active ? 'Deactivate' : 'Activate', "WPA_hoaToggleCommunity('" + r.id + "'," + (!r.is_active) + ")")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }

  function openCommunityForm(id) {
    // NOTE: local var renamed to `rec` to avoid shadowing the row() helper —
    // the Phase 1b original used `const row = ...` which masked the layout
    // function and made every Edit click a silent TypeError. Same pattern
    // applied to openUnitForm + openContactForm below.
    const rec = id ? findCommunity(id) : {};
    const creds = [{ value:'', label:'— not wired —' }].concat(
      cache.stripeCreds.map(c => ({ value: c.id, label: (c.label || c.id) }))
    );
    const issueModes = [
      { value: 'manual', label: 'Manual — admin clicks Issue each month' },
      { value: 'auto',   label: 'Auto — fires on scheduled day of month'  },
    ];
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Community' : 'New Community') + '</h3>' +
      row('Name',               inp('hoaCommName', rec.name)) +
      row('Display name',       inp('hoaCommDisplay', rec.display_name), 'Optional. Shown to tenants.') +
      row('Logo URL',           inp('hoaCommLogo', rec.logo_url), 'Full https URL. Displayed on invoices + receipts.') +
      row('Address line 1',     inp('hoaCommAddr1', rec.address1)) +
      row('Address line 2',     inp('hoaCommAddr2', rec.address2)) +
      row('City',               inp('hoaCommCity', rec.city)) +
      row('State',              inp('hoaCommState', rec.state, 'maxlength="2"')) +
      row('Zip',                inp('hoaCommZip', rec.zip)) +
      row('Contact email',      inp('hoaCommEmail', rec.contact_email, 'type="email"')) +
      row('Contact phone',      inp('hoaCommPhone', rec.contact_phone, 'type="tel"')) +
      row('Grace days',         inp('hoaCommGrace', rec.grace_days != null ? rec.grace_days : 10, 'type="number" min="0"'), 'Days after due date before late fees begin.') +
      row('Per-day late fee',   inp('hoaCommFee', rec.per_day_late_fee != null ? rec.per_day_late_fee : 0, 'type="number" step="0.01" min="0"')) +
      row('Stripe account',     sel('hoaCommStripe', creds, rec.stripe_cred_id || ''), 'Leave unwired for manual payments in Phase 1.') +
      row('Issue mode',         sel('hoaCommIssueMode', issueModes, rec.issue_mode || 'manual')) +
      row('Auto-issue day',     inp('hoaCommAutoDay', rec.auto_issue_day != null ? rec.auto_issue_day : '', 'type="number" min="1" max="28"'), 'Day of month (1–28) when Auto mode fires next month\'s batch. Leave empty for Manual.') +
      row('Active',             chk('hoaCommActive', rec.is_active !== false, 'Community is active')) +
      row('Notes',              txa('hoaCommNotes', rec.notes)) +
      '<input type="hidden" id="hoaCommId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveCommunity()','primary') ]);
    openModal(html);
  }

  async function saveCommunity() {
    const s = await hoaSupa();
    const id = readField('hoaCommId');
    const issueMode = readField('hoaCommIssueMode') || 'manual';
    const autoDayRaw = readField('hoaCommAutoDay');
    const autoDay = autoDayRaw === '' || autoDayRaw == null ? null : Number(autoDayRaw);
    if (issueMode === 'auto') {
      if (!autoDay || autoDay < 1 || autoDay > 28) {
        hoaToast('Auto mode requires an Auto-issue day between 1 and 28', 'error');
        return;
      }
    }
    const payload = {
      name:              readField('hoaCommName'),
      display_name:      readField('hoaCommDisplay'),
      logo_url:          readField('hoaCommLogo') || null,
      address1:          readField('hoaCommAddr1'),
      address2:          readField('hoaCommAddr2'),
      city:              readField('hoaCommCity'),
      state:             readField('hoaCommState'),
      zip:               readField('hoaCommZip'),
      contact_email:     readField('hoaCommEmail'),
      contact_phone:     readField('hoaCommPhone'),
      grace_days:        Number(readField('hoaCommGrace') || 0),
      per_day_late_fee:  Number(readField('hoaCommFee') || 0),
      stripe_cred_id:    readField('hoaCommStripe') || null,
      issue_mode:        issueMode,
      auto_issue_day:    issueMode === 'auto' ? autoDay : null,
      is_active:         !!readField('hoaCommActive'),
      notes:             readField('hoaCommNotes'),
    };
    if (!payload.name) { hoaToast('Name is required', 'error'); return; }
    const q = id
      ? s.from('hoa_communities').update(payload).eq('id', id)
      : s.from('hoa_communities').insert(payload);
    const { error } = await q;
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast(id ? 'Community updated ✓' : 'Community created ✓', 'success');
    closeModal();
    await renderCommunities();
  }
  async function toggleCommunity(id, makeActive) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_communities').update({ is_active: !!makeActive }).eq('id', id);
    if (error) return hoaToast('Error: ' + error.message, 'error');
    hoaToast(makeActive ? 'Activated ✓' : 'Deactivated', 'success');
    await renderCommunities();
  }

  // ── Issue Invoices modal (Phase 2.5 / 3A) ────────────────────────────
  // Calls portal PHP endpoint hoa_issue_month_invoices, opens the
  // resulting receipt in a new tab, refreshes the community list.
  async function openIssueModal(communityId) {
    const c = findCommunity(communityId);
    if (!c) return hoaToast('Community not found', 'error');
    const defaultPeriod = nextMonthFirst();
    const defaultGrace  = c.grace_days != null ? c.grace_days : 10;
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">🔔 Issue HOA Invoices</h3>' +
      '<p style="font-size:12px;color:#7e7567;margin:-6px 0 14px;">' +
      esc(c.display_name || c.name) + ' · one invoice per fee-bearing unit for the selected month.' +
      ' Units with no active charges are skipped.' +
      '</p>' +
      row('Billing period',     inp('hoaIssPeriod', defaultPeriod, 'type="date"'), 'Billing month — use the 1st of the month.') +
      row('Grace days',         inp('hoaIssGrace', defaultGrace, 'type="number" min="0"'), 'Due date = billing period + grace days.') +
      '<input type="hidden" id="hoaIssCommId" value="' + esc(communityId) + '">' +
      '<div id="hoaIssResult" style="margin-top:14px;"></div>' +
      actionsBar([
        btn('Cancel', 'WPA_hoaCloseModal()'),
        btn('Issue invoices', 'WPA_hoaFireIssue()', 'primary'),
      ]);
    openModal(html);
  }

  async function fireIssue() {
    const commId = readField('hoaIssCommId');
    const period = (readField('hoaIssPeriod') || '').slice(0, 10);
    const grace  = Number(readField('hoaIssGrace') || 10);
    const resultBox = document.getElementById('hoaIssResult');
    if (!/^\d{4}-\d{2}-01$/.test(period)) {
      if (resultBox) resultBox.innerHTML =
        '<div style="color:#a22;font-size:12px;">Billing period must be the 1st of a month (YYYY-MM-01).</div>';
      return;
    }
    if (resultBox) resultBox.innerHTML =
      '<div style="color:#7e7567;font-size:12px;">Issuing…</div>';
    const r = await callPortalApi('hoa_issue_month_invoices', {
      community_id: commId,
      period_month: period,
      grace_days:   grace,
      issued_by:    'admin-ui',
      issue_mode:   'manual',
    });
    if (!r.ok || !r.data) {
      if (resultBox) resultBox.innerHTML =
        '<div style="color:#a22;font-size:12px;">Issue failed: HTTP ' + r.http + '</div>';
      return;
    }
    const d = r.data;
    const recap =
      '<div style="background:#f0f7ff;border:1px solid #c9dcee;border-radius:6px;padding:10px 14px;font-size:12px;">' +
      '<strong>Done.</strong><br>' +
      'Created: <strong>' + (d.created || 0) + '</strong> · ' +
      'Skipped: <strong>' + (d.skipped || 0) + '</strong> · ' +
      'Total: <strong>$' + (d.total_amount != null ? Number(d.total_amount).toFixed(2) : '0.00') + '</strong>' +
      (d.receipt_url
        ? '<br><a href="' + esc(d.receipt_url) + '" target="_blank" rel="noopener" style="color:#1a3a6b;">'
          + 'Open printable receipt ↗</a>'
        : '') +
      '</div>';
    if (resultBox) resultBox.innerHTML = recap;
    if (d.receipt_url) window.open(d.receipt_url, '_blank', 'noopener');
    hoaToast((d.created || 0) + ' invoice' + ((d.created || 0) === 1 ? '' : 's') + ' issued', 'success');
  }

  // ── Past runs modal ──────────────────────────────────────────────────
  async function openRunsModal(communityId) {
    const c = findCommunity(communityId);
    if (!c) return hoaToast('Community not found', 'error');
    const s = await hoaSupa();
    const { data, error } = await s.from('hoa_issue_runs')
      .select('id,period_month,due_date,issued_at,issued_by,issue_mode,' +
              'units_total,created_count,skipped_count,total_amount')
      .eq('community_id', communityId)
      .order('issued_at', { ascending: false })
      .limit(50);
    if (error) return hoaToast('Error: ' + error.message, 'error');
    let body = '';
    if (!data || !data.length) {
      body = '<p style="color:#7e7567;font-size:13px;margin:8px 0;">No issue runs yet. '
           + 'Click <strong>🔔 Issue</strong> to fire the first monthly batch.</p>';
    } else {
      body = '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
             '<thead><tr style="background:#f7f4ef;text-align:left;">' +
             '<th style="padding:6px 8px;">Period</th>' +
             '<th style="padding:6px 8px;">Issued</th>' +
             '<th style="padding:6px 8px;">Mode</th>' +
             '<th style="padding:6px 8px;text-align:right;">Created</th>' +
             '<th style="padding:6px 8px;text-align:right;">Skipped</th>' +
             '<th style="padding:6px 8px;text-align:right;">Total</th>' +
             '<th style="padding:6px 8px;"></th>' +
             '</tr></thead><tbody>';
      data.forEach(r => {
        const url = PORTAL_API_BASE + '?action=hoa_issue_receipt&id=' + encodeURIComponent(r.id);
        body +=
          '<tr style="border-bottom:1px solid #f0ebe2;">' +
          '<td style="padding:6px 8px;">' + esc(r.period_month) + '</td>' +
          '<td style="padding:6px 8px;">' + esc((r.issued_at || '').slice(0, 16).replace('T', ' ')) +
            (r.issued_by ? '<br><span style="color:#9e9485;font-size:10px;">by ' + esc(r.issued_by) + '</span>' : '') + '</td>' +
          '<td style="padding:6px 8px;">' + esc(r.issue_mode || '') + '</td>' +
          '<td style="padding:6px 8px;text-align:right;">' + (r.created_count || 0) + '</td>' +
          '<td style="padding:6px 8px;text-align:right;">' + (r.skipped_count || 0) + '</td>' +
          '<td style="padding:6px 8px;text-align:right;">$' + Number(r.total_amount || 0).toFixed(2) + '</td>' +
          '<td style="padding:6px 8px;"><a href="' + esc(url) + '" target="_blank" rel="noopener" style="color:#1a3a6b;">Receipt ↗</a></td>' +
          '</tr>';
      });
      body += '</tbody></table>';
    }
    const html =
      '<h3 style="margin:0 0 6px 0;font-family:\'Playfair Display\',serif;">📄 Issue run history</h3>' +
      '<p style="font-size:12px;color:#7e7567;margin:0 0 14px;">' +
      esc(c.display_name || c.name) + ' · ' + (data ? data.length : 0) + ' run' +
      ((data && data.length === 1) ? '' : 's') + ' on record.' +
      '</p>' +
      body +
      actionsBar([ btn('Close', 'WPA_hoaCloseModal()') ]);
    openModal(html);
  }

  // ── UNITS ─────────────────────────────────────────────────────────────────
  let _unitsFilterCommunity = '';
  let _unitsSearch = '';
  let _unitsSort   = 'unit-asc';   // 3B.3: sort state for the units grid
  let _unitsBalances = {};   // unit_id → outstanding balance (cached per render)
  async function renderUnits() {
    await refreshCache(['communities','units','contacts']);
    const box = document.getElementById('hoa-units-list');
    if (!box) return;

    // Top toolbar: community filter + search + sort + "New Unit" button.
    const commOpts = [{ value:'', label:'— all communities —' }].concat(
      cache.communities.map(c => ({ value:c.id, label:c.name })));
    const sortOpts = [
      { value:'unit-asc',     label:'Unit # (A→Z)' },
      { value:'unit-desc',    label:'Unit # (Z→A)' },
      { value:'owner-asc',    label:'Owner (A→Z)' },
      { value:'owner-desc',   label:'Owner (Z→A)' },
      { value:'balance-desc', label:'Balance (highest first)' },
      { value:'balance-asc',  label:'Balance (lowest first)' },
      { value:'community',    label:'Community' },
    ];
    let h =
      '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">' +
        '<label style="font-size:11px;color:#635c4e;">Community</label>' +
        sel('hoaUnitsFilter', commOpts, _unitsFilterCommunity) +
        '<input id="hoaUnitsSearch" type="text" placeholder="Search unit #, owner, phone, email…" ' +
          'value="' + esc(_unitsSearch) + '" ' +
          'style="flex:1;min-width:220px;padding:6px 10px;border:1px solid #d9d3c5;' +
                 'border-radius:4px;font:inherit;font-size:12px;">' +
        '<label style="font-size:11px;color:#635c4e;">Sort</label>' +
        sel('hoaUnitsSort', sortOpts, _unitsSort) +
        btn('＋ New Unit', 'WPA_hoaOpenUnitForm()', 'primary') +
      '</div>' +
      '<script>' +
        'document.getElementById("hoaUnitsFilter")?.addEventListener("change",function(){WPA_hoaSetUnitsFilter(this.value);});' +
        'document.getElementById("hoaUnitsSearch")?.addEventListener("input",function(){WPA_hoaSetUnitsSearch(this.value);});' +
        'document.getElementById("hoaUnitsSort")?.addEventListener("change",function(){WPA_hoaSetUnitsSort(this.value);});' +
      '<\/script>';

    // Build initial row list.
    let rows = cache.units;
    if (_unitsFilterCommunity) rows = rows.filter(u => u.community_id === _unitsFilterCommunity);

    // Primary-owner lookup for every unit on screen.
    const s = await hoaSupa();
    const unitIds = rows.map(u => u.id);
    const primaryByUnit = {};
    if (unitIds.length) {
      const { data: ucRows } = await s.from('hoa_unit_contacts')
        .select('unit_id,contact_id,relationship_type,is_primary,is_active')
        .in('unit_id', unitIds)
        .eq('is_active', true)
        .eq('is_primary', true)
        .in('relationship_type', ['owner', 'owner_resident']);
      (ucRows || []).forEach(r => { primaryByUnit[r.unit_id] = r.contact_id; });
    }

    // Outstanding balance per unit — one query, client-side aggregate.
    // Phase 3B.3: surface it as a grid column so admins see at-a-glance
    // who's behind.
    _unitsBalances = {};
    if (unitIds.length) {
      const { data: invRows } = await s.from('invoices')
        .select('unit_id,total,paid,status')
        .in('unit_id', unitIds);
      (invRows || []).forEach(i => {
        const v = Number(i.total || 0) - Number(i.paid || 0);
        if ((i.status || '').toLowerCase() === 'void') return;
        _unitsBalances[i.unit_id] = (_unitsBalances[i.unit_id] || 0) + v;
      });
    }

    // Client-side search filter across unit_label + owner fields +
    // building/floor + parking/storage. Applied AFTER community filter.
    if (_unitsSearch && _unitsSearch.trim().length) {
      const q = _unitsSearch.trim().toLowerCase();
      rows = rows.filter(u => {
        const own = findContact(primaryByUnit[u.id]);
        const bag = [
          u.unit_label, u.building_label, u.floor_label,
          u.parking_tag, u.storage_unit, u.notes,
          own ? own.full_name : '', own ? own.first_name : '',
          own ? own.last_name : '', own ? own.email : '',
          own ? own.phone : '',     own ? own.phone_e164 : '',
        ].filter(Boolean).join(' ').toLowerCase();
        return bag.indexOf(q) !== -1;
      });
    }

    // Sort (3B.3). Helpers pull owner name from the primary lookup +
    // contacts cache so sorting by owner works even though it's not a
    // column on hoa_units itself.
    const ownerNameOf = u => {
      const own = findContact(primaryByUnit[u.id]);
      if (!own) return '';
      return (own.full_name
           || [own.first_name, own.last_name].filter(Boolean).join(' ')
           || own.email || own.phone_e164 || '').toLowerCase();
    };
    const commNameOf = u => {
      const c = findCommunity(u.community_id);
      return (c ? (c.name || c.display_name || '') : '').toLowerCase();
    };
    const unitKey = u => (u.unit_label || '').toString();
    // "Natural" compare so "2" < "10" < "211" instead of string order.
    const natCmp = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    switch (_unitsSort) {
      case 'unit-desc':
        rows = rows.slice().sort((a, b) => natCmp(unitKey(b), unitKey(a)));
        break;
      case 'owner-asc':
        rows = rows.slice().sort((a, b) => ownerNameOf(a).localeCompare(ownerNameOf(b)) || natCmp(unitKey(a), unitKey(b)));
        break;
      case 'owner-desc':
        rows = rows.slice().sort((a, b) => ownerNameOf(b).localeCompare(ownerNameOf(a)) || natCmp(unitKey(a), unitKey(b)));
        break;
      case 'balance-desc':
        rows = rows.slice().sort((a, b) =>
          Number(_unitsBalances[b.id] || 0) - Number(_unitsBalances[a.id] || 0) ||
          natCmp(unitKey(a), unitKey(b)));
        break;
      case 'balance-asc':
        rows = rows.slice().sort((a, b) =>
          Number(_unitsBalances[a.id] || 0) - Number(_unitsBalances[b.id] || 0) ||
          natCmp(unitKey(a), unitKey(b)));
        break;
      case 'community':
        rows = rows.slice().sort((a, b) =>
          commNameOf(a).localeCompare(commNameOf(b)) ||
          natCmp(unitKey(a), unitKey(b)));
        break;
      case 'unit-asc':
      default:
        rows = rows.slice().sort((a, b) => natCmp(unitKey(a), unitKey(b)));
    }

    if (!rows.length) {
      h += emptyBox('🏢',
        _unitsSearch ? 'No units match "' + _unitsSearch + '".' : 'No units for this filter.',
        '＋ New Unit', 'WPA_hoaOpenUnitForm()');
      box.innerHTML = h;
      return;
    }

    // Grid — row is clickable (no separate Details/Edit buttons; Edit
    // lives inside the detail modal header per Gil 2026-04-23).
    h += '<div style="font-size:11px;color:#9e9485;margin-bottom:4px;">' +
           rows.length + ' unit' + (rows.length === 1 ? '' : 's') + ' shown' +
         '</div>';
    h += '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Community') + th('Unit') + th('Owner') + th('Phone') + th('Email') +
         th('Parking') + th('Storage') + th('Balance') +
         '</tr></thead><tbody>';
    rows.forEach(u => {
      const c  = findCommunity(u.community_id);
      const contactId = primaryByUnit[u.id];
      const owner = contactId ? findContact(contactId) : null;
      const ownerName = owner
        ? (owner.full_name
            || [owner.first_name, owner.last_name].filter(Boolean).join(' ')
            || owner.email || owner.phone_e164 || '(unnamed)')
        : '—';
      const ownerPhone = owner ? (owner.phone_e164 || owner.phone || '—') : '—';
      const ownerEmail = owner ? (owner.email || '—') : '—';
      const bal        = Number(_unitsBalances[u.id] || 0);
      const balCell = bal > 0
        ? '<strong style="color:#a22;">' + fmtMoney(bal) + '</strong>'
        : bal < 0
          ? '<strong style="color:#2c7a3f;">credit ' + fmtMoney(-bal) + '</strong>'
          : '<span style="color:#2c7a3f;">$0.00</span>';
      h += '<tr class="hoa-unit-row" style="border-bottom:1px solid #f0ebe2;cursor:pointer;" ' +
             'onclick="WPA_hoaOpenUnitDetail(\'' + u.id + '\')" ' +
             'onmouseover="this.style.background=\'#faf6ee\';" ' +
             'onmouseout="this.style.background=\'\';">' +
           td(esc(c ? c.name : '—')) +
           td('<strong>' + esc(u.unit_label) + '</strong>' +
              (u.building_label ? '<br><span style="color:#9e9485;font-size:10px;">' +
                esc((u.building_label || '') + (u.floor_label ? ' · ' + u.floor_label : '')) +
                '</span>' : '')) +
           td(owner ? ('<strong>' + esc(ownerName) + '</strong>') : '<span style="color:#9e9485;">—</span>') +
           td('<span style="font-size:11px;">' + esc(ownerPhone) + '</span>') +
           td('<span style="font-size:11px;">' + esc(ownerEmail) + '</span>') +
           td('<span style="font-size:11px;">' + esc(u.parking_tag  || '—') + '</span>') +
           td('<span style="font-size:11px;">' + esc(u.storage_unit || '—') + '</span>') +
           td(balCell) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }
  function setUnitsSearch(v) { _unitsSearch = v || ''; renderUnits(); }
  function setUnitsSort(v)   { _unitsSort   = v || 'unit-asc'; renderUnits(); }
  function setUnitsFilter(v) { _unitsFilterCommunity = v || ''; renderUnits(); }

  function openUnitForm(id) {
    const rec = id ? findUnit(id) : {};
    if (!cache.communities.length) { hoaToast('Create a community first.', 'error'); return; }
    const commOpts = cache.communities.map(c => ({ value:c.id, label:c.name }));
    // Phase 3B.2 — Active toggle removed (units are permanent), plus
    // parking_tag + storage_unit fields added.
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Unit' : 'New Unit') + '</h3>' +
      row('Community',     sel('hoaUnitComm', commOpts, rec.community_id || _unitsFilterCommunity || commOpts[0].value)) +
      row('Unit label',    inp('hoaUnitLabel', rec.unit_label), 'e.g. "3B" or "204"') +
      row('Building',      inp('hoaUnitBldg', rec.building_label)) +
      row('Floor',         inp('hoaUnitFloor', rec.floor_label)) +
      row('Parking tag',   inp('hoaUnitParking', rec.parking_tag), 'Sticker / transponder / space number. Optional.') +
      row('Storage unit',  inp('hoaUnitStorage', rec.storage_unit), 'Storage locker or cage identifier. Optional.') +
      row('Notes',         txa('hoaUnitNotes', rec.notes)) +
      '<input type="hidden" id="hoaUnitId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveUnit()','primary') ]);
    openModal(html);
  }
  async function saveUnit() {
    const s = await hoaSupa();
    const id = readField('hoaUnitId');
    const payload = {
      community_id:   readField('hoaUnitComm'),
      unit_label:     readField('hoaUnitLabel'),
      building_label: readField('hoaUnitBldg'),
      floor_label:    readField('hoaUnitFloor'),
      parking_tag:    readField('hoaUnitParking') || null,
      storage_unit:   readField('hoaUnitStorage') || null,
      is_active:      true,            // units are permanent — never false
      notes:          readField('hoaUnitNotes'),
    };
    if (!payload.community_id || !payload.unit_label) { hoaToast('Community and unit label required', 'error'); return; }
    const q = id
      ? s.from('hoa_units').update(payload).eq('id', id)
      : s.from('hoa_units').insert(payload);
    const { error } = await q;
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast(id ? 'Unit updated ✓' : 'Unit created ✓', 'success');
    closeModal();
    await renderUnits();
  }
  // ═════════════════════════════════════════════════════════════════════
  //  UNIT DETAIL (Phase 3B · 2026-04-23)
  //  Single modal that folds in everything unit-scoped:
  //    • Owner / Resident roster (archive + add new)
  //    • Charges (hoa_unit_charges rows — list, add, toggle, delete)
  //    • Invoices (read-only history)
  //    • Notes (unit.notes)
  //  Rationale: a unit is permanent; owners and tenants rotate, but the
  //  unit itself and its invoice history do not. Everything about the
  //  unit is reachable from here so the Contacts + Assignments sub-tabs
  //  aren't the only way to re-link contacts.
  // ═════════════════════════════════════════════════════════════════════

  async function openUnitDetail(unitId) {
    await refreshCache(['communities','contacts']);
    const unit = findUnit(unitId);
    if (!unit) { hoaToast('Unit not found', 'error'); return; }
    const comm = findCommunity(unit.community_id);

    // Fetch the active monthly charge total up-front so we can show it
    // in the header — Gil 2026-04-23: "a single unit has to have all
    // the info we need including monthly amount".
    const s = await hoaSupa();
    const { data: activeCharges } = await s.from('hoa_unit_charges')
      .select('amount,cadence')
      .eq('unit_id', unitId)
      .eq('is_active', true)
      .eq('cadence', 'monthly');
    const monthlyTotal = (activeCharges || []).reduce(
      (sum, c) => sum + Number(c.amount || 0), 0);

    // Quick-fact tiles across the top so the most-asked data is
    // visible without scrolling.
    const tiles = [
      { label: 'Community',    val: comm ? (comm.display_name || comm.name) : '—' },
      { label: 'Unit',         val: unit.unit_label || '—' },
      { label: 'Building',     val: unit.building_label || '—' },
      { label: 'Floor',        val: unit.floor_label || '—' },
      { label: 'Parking tag',  val: unit.parking_tag || '—' },
      { label: 'Storage',      val: unit.storage_unit || '—' },
      { label: 'Monthly billed', val: '$' + monthlyTotal.toFixed(2),
        highlight: monthlyTotal > 0 },
    ];
    const tileHtml = tiles.map(t =>
      '<div style="flex:0 0 auto;min-width:110px;padding:6px 12px;' +
        (t.highlight ? 'background:#eaf4ea;color:#1a5a25;' : 'background:#faf6ee;color:#3a3428;') +
        'border-radius:4px;">' +
        '<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.4px;color:#9e9485;">' + esc(t.label) + '</div>' +
        '<div style="font-size:14px;font-weight:500;margin-top:2px;">' + esc(t.val) + '</div>' +
      '</div>'
    ).join('');

    const html =
      '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">' +
        '<div>' +
          '<h3 style="margin:0 0 2px 0;font-family:\'Playfair Display\',serif;">' +
            'Unit ' + esc(unit.unit_label) +
          '</h3>' +
          '<div style="font-size:11px;color:#7e7567;">' +
            esc(comm ? (comm.display_name || comm.name) : '(community)') +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
          // Edit-unit button — opens the basic fields form. Unit-scoped
          // data (owners/charges/notes/parking/storage) is edited inline
          // within this modal; the "edit" shortcut covers fields that
          // live directly on hoa_units.
          '<button onclick="WPA_hoaOpenUnitForm(\'' + esc(unitId) + '\')" ' +
            'style="font:inherit;font-size:11px;padding:4px 10px;border:1px solid #d9d3c5;' +
                   'background:#faf6ee;color:#3a3428;border-radius:4px;cursor:pointer;">' +
            '✎ Edit unit</button>' +
          '<button onclick="WPA_hoaCloseModal()" ' +
            'style="font:inherit;font-size:14px;border:none;background:transparent;' +
                   'cursor:pointer;color:#7e7567;">✕</button>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">' + tileHtml + '</div>' +
      '<div id="hoaUDRoster"  style="margin-top:16px;"><em style="color:#9e9485;">Loading owners…</em></div>' +
      '<div id="hoaUDCharges" style="margin-top:16px;"><em style="color:#9e9485;">Loading charges…</em></div>' +
      '<div id="hoaUDInvoices" style="margin-top:16px;"><em style="color:#9e9485;">Loading ledger…</em></div>' +
      '<div id="hoaUDNotes" style="margin-top:16px;"></div>' +
      '<input type="hidden" id="hoaUDUnitId" value="' + esc(unitId) + '">';

    openModal(html);

    // Populate each section in parallel.
    renderUDRoster(unitId);
    renderUDCharges(unitId);
    renderUDInvoices(unitId);
    renderUDNotes(unitId, unit);
  }

  // ─── Roster (Owners + Residents + Others) ───────────────────────────
  async function renderUDRoster(unitId) {
    const s = await hoaSupa();
    const { data, error } = await s.from('hoa_unit_contacts')
      .select('id,contact_id,relationship_type,is_primary,is_active,start_date,end_date,created_at')
      .eq('unit_id', unitId)
      .order('is_active', { ascending: false })
      .order('created_at', { ascending: true });
    const box = document.getElementById('hoaUDRoster');
    if (!box) return;
    if (error) { box.innerHTML = '<div style="color:#a22;">Error: ' + esc(error.message) + '</div>'; return; }

    const byContact = id => cache.contacts.find(c => c.id === id);
    const REL_LABEL = {
      owner:          'Owner',
      owner_resident: 'Owner-Occupant',
      resident:       'Resident',
      other:          'Other',
    };

    let h =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">' +
        '<h4 style="font-size:13px;margin:0;color:#3a3428;">👥 Owners &amp; Residents</h4>' +
        btn('＋ Add',   "WPA_hoaUDShowAdd('" + unitId + "')",  'primary') +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
      '<thead><tr style="background:#faf6ee;text-align:left;">' +
      '<th style="padding:6px 8px;">Name</th>' +
      '<th style="padding:6px 8px;">Role</th>' +
      '<th style="padding:6px 8px;">Contact</th>' +
      '<th style="padding:6px 8px;">Since</th>' +
      '<th style="padding:6px 8px;">Status</th>' +
      '<th style="padding:6px 8px;"></th>' +
      '</tr></thead><tbody>';

    if (!data || !data.length) {
      h += '<tr><td colspan="6" style="padding:12px;color:#9e9485;text-align:center;">No contacts linked to this unit yet.</td></tr>';
    } else {
      data.forEach(uc => {
        const c = byContact(uc.contact_id) || {};
        const nm = c.full_name
                || [c.first_name, c.last_name].filter(Boolean).join(' ')
                || c.email || c.phone_e164 || '(unnamed)';
        const contactInfo = [c.phone_e164 || c.phone, c.email].filter(Boolean).join(' · ');
        const statusBadge = uc.is_active
          ? '<span style="color:#2c7a3f;">● Active</span>'
          : '<span style="color:#9e9485;">○ Archived' + (uc.end_date ? ' (' + esc(uc.end_date) + ')' : '') + '</span>';
        const actions = uc.is_active
          ? btn('Archive', "WPA_hoaUDArchive('" + uc.id + "','" + unitId + "')")
          : btn('Reactivate', "WPA_hoaUDReactivate('" + uc.id + "','" + unitId + "')");
        h += '<tr style="border-bottom:1px solid #f0ebe2;' + (uc.is_active ? '' : 'opacity:0.55;') + '">' +
             '<td style="padding:6px 8px;"><strong>' + esc(nm) + '</strong>' +
               (uc.is_primary ? ' <span style="font-size:10px;color:#8a6d3c;">★ primary</span>' : '') +
             '</td>' +
             '<td style="padding:6px 8px;">' + esc(REL_LABEL[uc.relationship_type] || uc.relationship_type) + '</td>' +
             '<td style="padding:6px 8px;font-size:11px;color:#7e7567;">' + esc(contactInfo || '—') + '</td>' +
             '<td style="padding:6px 8px;font-size:11px;color:#7e7567;">' + esc(uc.start_date || uc.created_at?.slice(0,10) || '—') + '</td>' +
             '<td style="padding:6px 8px;">' + statusBadge + '</td>' +
             '<td style="padding:6px 8px;">' + actions + '</td>' +
             '</tr>';
      });
    }
    h += '</tbody></table>';
    h += '<div id="hoaUDAddForm" style="display:none;"></div>';
    box.innerHTML = h;
  }

  // Archive a unit_contact (set is_active=false + end_date=today).
  async function udArchiveRoster(ucId, unitId) {
    if (!confirm('Archive this contact from the unit? They stay in the contact book and can be re-linked later.')) return;
    const s = await hoaSupa();
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await s.from('hoa_unit_contacts')
      .update({ is_active: false, end_date: today })
      .eq('id', ucId);
    if (error) return hoaToast('Archive error: ' + error.message, 'error');
    hoaToast('Contact archived', 'success');
    await renderUDRoster(unitId);
  }
  async function udReactivateRoster(ucId, unitId) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_unit_contacts')
      .update({ is_active: true, end_date: null })
      .eq('id', ucId);
    if (error) return hoaToast('Reactivate error: ' + error.message, 'error');
    hoaToast('Reactivated', 'success');
    await renderUDRoster(unitId);
  }

  // ─── Inline "Add owner/resident" form ────────────────────────────────
  function udShowAddForm(unitId) {
    const existing = cache.contacts.filter(c => c.is_active !== false)
      .sort((a, b) => (a.full_name || a.last_name || '').localeCompare(b.full_name || b.last_name || ''));
    const contactOpts = [{ value:'__NEW__', label:'＋ Create new contact…' }].concat(
      existing.map(c => ({
        value: c.id,
        label: (c.full_name
              || [c.first_name, c.last_name].filter(Boolean).join(' ')
              || c.email || c.phone_e164 || c.id)
      }))
    );
    const relOpts = [
      { value:'owner',          label:'Owner (absentee)' },
      { value:'owner_resident', label:'Owner-Occupant' },
      { value:'resident',       label:'Resident (tenant)' },
      { value:'other',          label:'Other' },
    ];
    const box = document.getElementById('hoaUDAddForm');
    if (!box) return;
    box.style.display = 'block';
    box.innerHTML =
      '<div style="background:#faf6ee;padding:12px 14px;border-radius:6px;margin-top:10px;">' +
      '<h5 style="margin:0 0 8px;font-size:12px;color:#3a3428;">Link contact to this unit</h5>' +
      row('Existing contact', sel('hoaUDContactPick', contactOpts, '')) +
      '<div id="hoaUDNewBox" style="display:none;margin:6px 0 8px;padding:8px 10px;background:#fff;border:1px solid #e5dfd4;border-radius:4px;">' +
        row('First name', inp('hoaUDNewFirst', '')) +
        row('Last name',  inp('hoaUDNewLast', '')) +
        row('Full name',  inp('hoaUDNewFull', ''), 'Companies or couples — use this and leave first/last blank.') +
        row('Email',      inp('hoaUDNewEmail', '', 'type="email"')) +
        row('Phone',      inp('hoaUDNewPhone', '', 'type="tel"'), 'Normalized to E.164 on save.') +
      '</div>' +
      row('Role',       sel('hoaUDRole', relOpts, 'owner')) +
      row('Primary',    chk('hoaUDPrimary', true, 'Mark as primary for this role')) +
      row('Start date', inp('hoaUDStart', new Date().toISOString().slice(0,10), 'type="date"')) +
      '<input type="hidden" id="hoaUDAddUnitId" value="' + esc(unitId) + '">' +
      actionsBar([
        btn('Cancel', 'WPA_hoaUDHideAdd()'),
        btn('Save',   'WPA_hoaUDSaveAdd()', 'primary'),
      ]) +
      '<script>document.getElementById("hoaUDContactPick")?.addEventListener("change",function(){document.getElementById("hoaUDNewBox").style.display=(this.value==="__NEW__"?"block":"none");});<\/script>' +
      '</div>';
  }
  function udHideAddForm() {
    const box = document.getElementById('hoaUDAddForm');
    if (box) { box.style.display = 'none'; box.innerHTML = ''; }
  }
  async function udSaveAdd() {
    const s = await hoaSupa();
    const unitId     = readField('hoaUDAddUnitId');
    const pickVal    = readField('hoaUDContactPick');
    const relType    = readField('hoaUDRole');
    const isPrimary  = !!readField('hoaUDPrimary');
    const startDate  = readField('hoaUDStart') || null;
    if (!pickVal) { hoaToast('Pick a contact (or choose Create new)', 'error'); return; }

    let contactId = pickVal;
    if (pickVal === '__NEW__') {
      const first = readField('hoaUDNewFirst') || '';
      const last  = readField('hoaUDNewLast')  || '';
      const full  = readField('hoaUDNewFull')  || [first, last].filter(Boolean).join(' ');
      const email = readField('hoaUDNewEmail') || '';
      const phone = readField('hoaUDNewPhone') || '';
      const e164  = hoaPhoneE164(phone);
      if (!full) { hoaToast('Full name or first + last required for a new contact', 'error'); return; }
      const { data, error } = await s.from('hoa_contacts').insert({
        first_name:    first || null,
        last_name:     last  || null,
        full_name:     full,
        email:         email || null,
        phone:         phone || null,
        phone_e164:    e164  || null,
        portal_access: true,
        is_active:     true,
        notes:         'Added via unit detail ' + new Date().toISOString().slice(0,10),
      }).select().single();
      if (error) return hoaToast('Create contact error: ' + error.message, 'error');
      contactId = data.id;
      // Refresh contacts cache so the new contact is known.
      cache._ts.contacts = 0;
      await refreshCache(['contacts']);
    }

    // If making this one primary, first demote any existing primary of
    // the same (unit, role) combo to respect the partial unique index.
    if (isPrimary) {
      await s.from('hoa_unit_contacts')
        .update({ is_primary: false })
        .eq('unit_id', unitId)
        .eq('relationship_type', relType)
        .eq('is_active', true);
    }
    const { error: linkErr } = await s.from('hoa_unit_contacts').insert({
      unit_id:           unitId,
      contact_id:        contactId,
      relationship_type: relType,
      is_primary:        isPrimary,
      is_active:         true,
      start_date:        startDate,
    });
    if (linkErr) return hoaToast('Link error: ' + linkErr.message, 'error');
    hoaToast('Linked ✓', 'success');
    udHideAddForm();
    await renderUDRoster(unitId);
  }

  // ─── Charges ─────────────────────────────────────────────────────────
  async function renderUDCharges(unitId) {
    const s = await hoaSupa();
    const [chRes, ctRes] = await Promise.all([
      s.from('hoa_unit_charges')
        .select('id,charge_type_id,amount,cadence,description,is_active,effective_from,effective_to,last_issued_period')
        .eq('unit_id', unitId)
        .order('is_active', { ascending: false })
        .order('amount',    { ascending: false }),
      s.from('hoa_charge_types').select('id,code,name,sort_order').order('sort_order'),
    ]);
    const box = document.getElementById('hoaUDCharges');
    if (!box) return;
    if (chRes.error) { box.innerHTML = '<div style="color:#a22;">Error: ' + esc(chRes.error.message) + '</div>'; return; }

    const types = ctRes.data || [];
    const typeById = {};
    types.forEach(t => typeById[t.id] = t);

    let h =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">' +
        '<h4 style="font-size:13px;margin:0;color:#3a3428;">💰 Charges</h4>' +
        btn('＋ Add charge', "WPA_hoaUDShowAddCharge('" + unitId + "')", 'primary') +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
      '<thead><tr style="background:#faf6ee;text-align:left;">' +
      '<th style="padding:6px 8px;">Type</th>' +
      '<th style="padding:6px 8px;">Description</th>' +
      '<th style="padding:6px 8px;text-align:right;">Amount</th>' +
      '<th style="padding:6px 8px;">Cadence</th>' +
      '<th style="padding:6px 8px;">Status</th>' +
      '<th style="padding:6px 8px;"></th>' +
      '</tr></thead><tbody>';

    const rows = chRes.data || [];
    if (!rows.length) {
      h += '<tr><td colspan="6" style="padding:12px;color:#9e9485;text-align:center;">No charges yet. Click <strong>Add charge</strong> to create the first.</td></tr>';
    } else {
      rows.forEach(c => {
        const t = typeById[c.charge_type_id];
        const statusBadge = c.is_active
          ? '<span style="color:#2c7a3f;">● Active</span>'
          : '<span style="color:#9e9485;">○ Inactive</span>';
        const actions =
          btn((c.is_active ? 'Pause' : 'Resume'),
              "WPA_hoaUDToggleCharge('" + c.id + "'," + (!c.is_active) + ",'" + unitId + "')") + ' ' +
          btn('Delete', "WPA_hoaUDDeleteCharge('" + c.id + "','" + unitId + "')");
        h += '<tr style="border-bottom:1px solid #f0ebe2;' + (c.is_active ? '' : 'opacity:0.55;') + '">' +
             '<td style="padding:6px 8px;"><strong>' + esc(t ? t.name : '(unknown)') + '</strong></td>' +
             '<td style="padding:6px 8px;font-size:11px;color:#7e7567;">' + esc(c.description || '—') + '</td>' +
             '<td style="padding:6px 8px;text-align:right;">' + fmtMoney(c.amount) + '</td>' +
             '<td style="padding:6px 8px;">' + esc(c.cadence) + '</td>' +
             '<td style="padding:6px 8px;">' + statusBadge + '</td>' +
             '<td style="padding:6px 8px;">' + actions + '</td>' +
             '</tr>';
      });
    }
    h += '</tbody></table>';
    h += '<div id="hoaUDChargeForm" style="display:none;"></div>';
    box.innerHTML = h;
  }

  function udShowAddCharge(unitId) {
    const typeOpts = (cache._chargeTypes || []).map(t => ({ value: t.id, label: t.name }));
    const cadenceOpts = [
      { value:'monthly',  label:'Monthly (every billing cycle)' },
      { value:'yearly',   label:'Yearly (anniversary month)' },
      { value:'onetime',  label:'One-time (fires once)' },
    ];
    const box = document.getElementById('hoaUDChargeForm');
    if (!box) return;
    box.style.display = 'block';
    box.innerHTML =
      '<div style="background:#faf6ee;padding:12px 14px;border-radius:6px;margin-top:10px;">' +
      '<h5 style="margin:0 0 8px;font-size:12px;color:#3a3428;">Add charge to this unit</h5>' +
      row('Charge type', sel('hoaUDChType', typeOpts, '')) +
      row('Amount',      inp('hoaUDChAmt', '', 'type="number" step="0.01" min="0"')) +
      row('Cadence',     sel('hoaUDChCadence', cadenceOpts, 'monthly')) +
      row('Description', inp('hoaUDChDesc', ''), 'Optional, e.g. "Locker A-12".') +
      row('Effective from', inp('hoaUDChFrom', new Date().toISOString().slice(0,10), 'type="date"')) +
      '<input type="hidden" id="hoaUDChUnitId" value="' + esc(unitId) + '">' +
      actionsBar([
        btn('Cancel', 'WPA_hoaUDHideAddCharge()'),
        btn('Save',   'WPA_hoaUDSaveCharge()', 'primary'),
      ]) +
      '</div>';
  }
  function udHideAddCharge() {
    const box = document.getElementById('hoaUDChargeForm');
    if (box) { box.style.display = 'none'; box.innerHTML = ''; }
  }
  async function udSaveCharge() {
    const s = await hoaSupa();
    const unitId   = readField('hoaUDChUnitId');
    const typeId   = readField('hoaUDChType');
    const amt      = Number(readField('hoaUDChAmt'));
    const cadence  = readField('hoaUDChCadence');
    const desc     = readField('hoaUDChDesc') || null;
    const effFrom  = readField('hoaUDChFrom') || null;
    if (!typeId)              { hoaToast('Charge type required', 'error'); return; }
    if (!(amt > 0))           { hoaToast('Amount must be greater than 0', 'error'); return; }
    if (!['monthly','yearly','onetime'].includes(cadence)) { hoaToast('Cadence required', 'error'); return; }
    const { error } = await s.from('hoa_unit_charges').insert({
      unit_id:         unitId,
      charge_type_id:  typeId,
      amount:          amt,
      cadence:         cadence,
      description:     desc,
      is_active:       true,
      effective_from:  effFrom,
      notes:           'Added via unit detail ' + new Date().toISOString().slice(0,10),
    });
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast('Charge added ✓', 'success');
    udHideAddCharge();
    await renderUDCharges(unitId);
  }
  async function udToggleCharge(chargeId, makeActive, unitId) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_unit_charges')
      .update({ is_active: !!makeActive })
      .eq('id', chargeId);
    if (error) return hoaToast('Toggle error: ' + error.message, 'error');
    hoaToast(makeActive ? 'Resumed' : 'Paused', 'success');
    await renderUDCharges(unitId);
  }
  async function udDeleteCharge(chargeId, unitId) {
    if (!confirm('Delete this charge? This cannot be undone. To temporarily stop billing without losing history, use Pause instead.')) return;
    const s = await hoaSupa();
    const { error } = await s.from('hoa_unit_charges').delete().eq('id', chargeId);
    if (error) return hoaToast('Delete error: ' + error.message, 'error');
    hoaToast('Deleted', 'success');
    await renderUDCharges(unitId);
  }

  // ─── Ledger (invoices + payments as a running balance) ─────────────
  // Combines invoices (debits) and payments (credits) into a chrono
  // stream with a running balance, the way an owner-facing statement
  // would look. Payments are joined via payments.invoice_id. When no
  // payments table row exists for an invoice but invoice.paid > 0, we
  // synthesise a "Payment applied" line so the balance still reflects
  // the paid amount even if individual payment rows aren't tracked.
  async function renderUDInvoices(unitId) {
    const s = await hoaSupa();
    const box = document.getElementById('hoaUDInvoices');
    if (!box) return;

    // 1. Invoices for the unit (oldest first so balance accumulates forward).
    const { data: invs, error: invErr } = await s.from('invoices')
      .select('id,period_month,due_date,status,total,paid,notes,invoice_type')
      .eq('unit_id', unitId)
      .order('period_month', { ascending: true })
      .limit(500);
    if (invErr) {
      box.innerHTML = '<h4 style="font-size:13px;margin:0 0 6px;color:#3a3428;">📊 Ledger</h4>' +
                      '<div style="color:#a22;">Error: ' + esc(invErr.message) + '</div>';
      return;
    }

    // 2. Payment rows tied to those invoices. Payments table may or may
    //    not exist / be populated — handle gracefully.
    let payments = [];
    const invIds = (invs || []).map(i => i.id);
    if (invIds.length) {
      const pr = await s.from('payments')
        .select('id,invoice_id,amount,paid_at,method,status')
        .in('invoice_id', invIds)
        .order('paid_at', { ascending: true })
        .catch(e => ({ data: [], error: e }));
      payments = (pr && pr.data) || [];
    }

    // 3. Build the ledger stream: each invoice = debit, each payment =
    //    credit. If an invoice has paid>0 but no payment rows, synthesise
    //    one credit line so the statement reconciles.
    const events = [];
    (invs || []).forEach(inv => {
      events.push({
        date:    inv.period_month || inv.due_date || '',
        kind:    'charge',
        desc:    (inv.notes && inv.notes.indexOf('HOA monthly fee') >= 0
                   ? 'HOA monthly fee'
                   : (inv.invoice_type || 'charge')) +
                 ' · ' + (inv.period_month || inv.due_date || '—'),
        debit:   Number(inv.total || 0),
        credit:  0,
        status:  inv.status,
        invId:   inv.id,
      });
      // Payment rows for this invoice, if any.
      const invPmts = payments.filter(p => p.invoice_id === inv.id);
      if (invPmts.length) {
        invPmts.forEach(p => {
          events.push({
            date:   (p.paid_at || '').slice(0, 10),
            kind:   'payment',
            desc:   'Payment · ' + (p.method || 'received') +
                    (p.status && p.status !== 'succeeded' ? ' (' + p.status + ')' : ''),
            debit:  0,
            credit: Number(p.amount || 0),
            invId:  inv.id,
          });
        });
      } else if (Number(inv.paid || 0) > 0) {
        // Synthetic credit so the balance reconciles when payments rows
        // aren't available.
        events.push({
          date:    inv.due_date || inv.period_month || '',
          kind:    'payment',
          desc:    'Payment applied (recorded on invoice)',
          debit:   0,
          credit:  Number(inv.paid || 0),
          invId:   inv.id,
          synthetic: true,
        });
      }
    });

    // 4. Sort by date ascending, then charges before payments on ties.
    events.sort((a, b) => {
      const d = (a.date || '').localeCompare(b.date || '');
      if (d !== 0) return d;
      return (a.kind === 'charge' && b.kind !== 'charge') ? -1 : 1;
    });

    // 5. Compute running balance.
    let balance = 0;
    events.forEach(e => { balance += (e.debit || 0) - (e.credit || 0); e.balance = balance; });

    let h =
      '<h4 style="font-size:13px;margin:0 0 6px;color:#3a3428;">📊 Ledger · running balance</h4>';
    if (!events.length) {
      h += '<div style="padding:12px;background:#faf6ee;border-radius:4px;color:#9e9485;text-align:center;">No ledger entries yet for this unit.</div>';
      box.innerHTML = h;
      return;
    }
    h += '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
      '<thead><tr style="background:#faf6ee;text-align:left;">' +
      '<th style="padding:6px 8px;">Date</th>' +
      '<th style="padding:6px 8px;">Description</th>' +
      '<th style="padding:6px 8px;text-align:right;">Charge</th>' +
      '<th style="padding:6px 8px;text-align:right;">Payment</th>' +
      '<th style="padding:6px 8px;text-align:right;">Balance</th>' +
      '<th style="padding:6px 8px;"></th>' +
      '</tr></thead><tbody>';
    // Pre-compute outstanding per-invoice so the "Record payment"
    // default amount is right.
    const outstandingByInv = {};
    (invs || []).forEach(inv => {
      const outstanding = Number(inv.total || 0) - Number(inv.paid || 0);
      outstandingByInv[inv.id] = { outstanding, total: Number(inv.total || 0), paid: Number(inv.paid || 0) };
    });
    events.forEach(e => {
      const isCharge = e.kind === 'charge';
      // Only show Record-payment action on charge rows that still have
      // a balance to pay. Payments rows get no action.
      const invInfo = isCharge && e.invId ? outstandingByInv[e.invId] : null;
      const showRecord = invInfo && invInfo.outstanding > 0.005;
      const actionCell = showRecord
        ? btn('Record payment', "WPA_hoaUDShowRecordPayment('" +
            e.invId + "','" + unitId + "'," +
            invInfo.outstanding.toFixed(2) + ")")
        : '';
      h += '<tr style="border-bottom:1px solid #f0ebe2;' +
           (isCharge ? '' : 'background:#f9fdf9;') + '">' +
           '<td style="padding:6px 8px;font-size:11px;">' + esc(e.date || '—') + '</td>' +
           '<td style="padding:6px 8px;">' + (isCharge ? '' : '&nbsp;&nbsp;↳ ') + esc(e.desc) +
             (e.synthetic ? ' <span style="font-size:10px;color:#9e9485;">(synthesised)</span>' : '') +
             '</td>' +
           '<td style="padding:6px 8px;text-align:right;color:' + (isCharge ? '#a22' : '#9e9485') + ';">' +
             (e.debit  ? fmtMoney(e.debit)  : '') + '</td>' +
           '<td style="padding:6px 8px;text-align:right;color:' + (isCharge ? '#9e9485' : '#2c7a3f') + ';">' +
             (e.credit ? fmtMoney(e.credit) : '') + '</td>' +
           '<td style="padding:6px 8px;text-align:right;font-weight:' +
             (e.balance > 0 ? '600' : '400') + ';color:' +
             (e.balance > 0 ? '#a22' : '#2c7a3f') + ';">' +
             fmtMoney(e.balance) + '</td>' +
           '<td style="padding:6px 8px;">' + actionCell + '</td>' +
           '</tr>';
    });
    h += '</tbody></table>';
    h += '<div id="hoaUDPayForm" style="display:none;margin-top:10px;"></div>';

    const totDebit  = events.reduce((s, e) => s + (e.debit  || 0), 0);
    const totCredit = events.reduce((s, e) => s + (e.credit || 0), 0);
    const outstanding = totDebit - totCredit;
    h += '<div style="margin-top:10px;padding:8px 12px;background:#faf6ee;border-radius:4px;display:flex;justify-content:space-between;font-size:12px;">' +
         '<span><strong>' + events.length + '</strong> entries · billed <strong>' + fmtMoney(totDebit) +
         '</strong> · paid <strong>' + fmtMoney(totCredit) + '</strong></span>' +
         '<span style="font-weight:600;color:' + (outstanding > 0 ? '#a22' : '#2c7a3f') + ';">' +
         'Balance: ' + fmtMoney(outstanding) + '</span>' +
         '</div>';
    box.innerHTML = h;
  }

  // ─── Record payment (manual — checks, cash, ACH) ─────────────────────
  // Writes a row to the `payments` table if it exists, and updates the
  // invoice's paid + status columns regardless. For checks/cash that
  // don't flow through Stripe, this keeps the ledger accurate.
  function udShowRecordPayment(invoiceId, unitId, defaultAmount) {
    const methodOpts = [
      { value:'check', label:'Check' },
      { value:'cash',  label:'Cash' },
      { value:'ach',   label:'ACH / bank transfer' },
      { value:'other', label:'Other' },
    ];
    const box = document.getElementById('hoaUDPayForm');
    if (!box) return;
    box.style.display = 'block';
    box.innerHTML =
      '<div style="background:#eaf4ea;padding:12px 14px;border-radius:6px;">' +
      '<h5 style="margin:0 0 8px;font-size:12px;color:#1a5a25;">💰 Record manual payment</h5>' +
      row('Amount',    inp('hoaUDPayAmt', Number(defaultAmount).toFixed(2), 'type="number" step="0.01" min="0.01"'), 'Defaults to the invoice\'s outstanding balance.') +
      row('Paid on',   inp('hoaUDPayDate', new Date().toISOString().slice(0,10), 'type="date"')) +
      row('Method',    sel('hoaUDPayMethod', methodOpts, 'check')) +
      row('Reference', inp('hoaUDPayRef',   ''), 'Check # or transaction ref. Optional.') +
      row('Notes',     txa('hoaUDPayNotes', '')) +
      '<input type="hidden" id="hoaUDPayInv"  value="' + esc(invoiceId) + '">' +
      '<input type="hidden" id="hoaUDPayUnit" value="' + esc(unitId)    + '">' +
      actionsBar([
        btn('Cancel', 'WPA_hoaUDHidePayment()'),
        btn('Save payment', 'WPA_hoaUDSavePayment()', 'primary'),
      ]) +
      '</div>';
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function udHidePayment() {
    const box = document.getElementById('hoaUDPayForm');
    if (box) { box.style.display = 'none'; box.innerHTML = ''; }
  }
  async function udSavePayment() {
    const s        = await hoaSupa();
    const invId    = readField('hoaUDPayInv');
    const unitId   = readField('hoaUDPayUnit');
    const amt      = Number(readField('hoaUDPayAmt'));
    const paidOn   = readField('hoaUDPayDate') || new Date().toISOString().slice(0,10);
    const method   = readField('hoaUDPayMethod') || 'check';
    const ref      = readField('hoaUDPayRef')    || null;
    const notes    = readField('hoaUDPayNotes')  || null;
    if (!(amt > 0)) { hoaToast('Amount must be greater than 0', 'error'); return; }

    // Fetch the current invoice so we can update paid + status
    // atomically (well, as atomic as two HTTP calls can be).
    const { data: inv, error: invErr } = await s.from('invoices')
      .select('total,paid,status').eq('id', invId).maybeSingle();
    if (invErr || !inv) return hoaToast('Invoice load failed', 'error');

    // 1. Try to record a payment row. The `payments` table may or may
    //    not be present / writable from anon. If it fails we still
    //    update the invoice so the ledger reconciles.
    try {
      await s.from('payments').insert({
        invoice_id: invId,
        amount:     amt,
        paid_at:    paidOn + 'T12:00:00Z',
        method:     method,
        status:     'succeeded',
        reference:  ref,
        notes:      notes || ('Recorded manually ' + new Date().toISOString().slice(0,10)),
      });
    } catch (e) {
      console.warn('[hoa ud pay] payments.insert failed (continuing with invoice-only update):', e);
    }

    // 2. Update invoice.paid and status.
    const newPaid   = Number(inv.paid  || 0) + amt;
    const newStatus = (newPaid + 0.005) >= Number(inv.total || 0) ? 'paid'
                    : newPaid > 0                                 ? 'partial'
                    : inv.status;
    const { error: updErr } = await s.from('invoices')
      .update({ paid: newPaid, status: newStatus })
      .eq('id', invId);
    if (updErr) return hoaToast('Invoice update error: ' + updErr.message, 'error');

    hoaToast('Payment recorded · ' + fmtMoney(amt), 'success');
    udHidePayment();
    await renderUDInvoices(unitId);  // ledger re-render
  }

  // ─── Notes ───────────────────────────────────────────────────────────
  function renderUDNotes(unitId, unit) {
    const box = document.getElementById('hoaUDNotes');
    if (!box) return;
    box.innerHTML =
      '<h4 style="font-size:13px;margin:0 0 6px;color:#3a3428;">📝 Unit notes</h4>' +
      '<textarea id="hoaUDNotesInput" style="width:100%;min-height:70px;padding:8px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:12px;resize:vertical;">' +
      esc(unit.notes || '') +
      '</textarea>' +
      '<div style="text-align:right;margin-top:6px;">' +
      btn('Save notes', "WPA_hoaUDSaveNotes('" + unitId + "')", 'primary') +
      '</div>';
  }
  async function udSaveNotes(unitId) {
    const notes = readField('hoaUDNotesInput') || '';
    const s = await hoaSupa();
    const { error } = await s.from('hoa_units')
      .update({ notes: notes || null })
      .eq('id', unitId);
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast('Notes saved ✓', 'success');
    // Refresh cache so the units list shows the updated note on close.
    cache._ts.units = 0;
    await refreshCache(['units']);
  }

  // Make charge types available to the "Add charge" form.
  async function ensureChargeTypesLoaded() {
    if (cache._chargeTypes) return;
    const s = await hoaSupa();
    const { data } = await s.from('hoa_charge_types').select('id,code,name,sort_order').order('sort_order');
    cache._chargeTypes = data || [];
  }
  // Call once on module load.
  ensureChargeTypesLoaded();

  async function toggleUnit(id, makeActive) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_units').update({ is_active: !!makeActive }).eq('id', id);
    if (error) return hoaToast('Error: ' + error.message, 'error');
    hoaToast(makeActive ? 'Activated ✓' : 'Deactivated', 'success');
    await renderUnits();
  }

  // ── CONTACTS ──────────────────────────────────────────────────────────────
  let _contactsSearch = '';
  async function renderContacts() {
    await refreshCache(['contacts']);
    const box = document.getElementById('hoa-contacts-list');
    if (!box) return;
    let h = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;">' +
            '<input id="hoaContactsSearch" value="' + esc(_contactsSearch) + '" placeholder="Search name / email / phone" style="padding:8px 10px;border:1px solid #ddd8ce;border-radius:8px;font-family:\'DM Mono\',monospace;font-size:12px;min-width:320px;">' +
            '</div>' +
            '<script>document.getElementById("hoaContactsSearch")?.addEventListener("input",function(){WPA_hoaSetContactsSearch(this.value);});<\/script>';
    const q = (_contactsSearch || '').toLowerCase();
    let rows = cache.contacts;
    if (q) {
      rows = rows.filter(c => {
        const hay = [c.full_name, c.first_name, c.last_name, c.email, c.phone, c.phone_e164].filter(Boolean).join(' ').toLowerCase();
        return hay.indexOf(q) >= 0;
      });
    }
    if (!rows.length) {
      h += emptyBox('👤', 'No contacts match.', '＋ New Contact', 'WPA_hoaOpenContactForm()');
      box.innerHTML = h;
      return;
    }
    h += '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Name') + th('Email') + th('Phone (E.164)') + th('Portal') + th('Status') + th('') +
         '</tr></thead><tbody>';
    rows.forEach(c => {
      const name = c.full_name || [c.first_name, c.last_name].filter(Boolean).join(' ') || '(no name)';
      h += '<tr style="border-bottom:1px solid #f0ebe2;">' +
           td('<strong>' + esc(name) + '</strong>') +
           td(esc(c.email || '—')) +
           td(esc(c.phone_e164 || c.phone || '—')) +
           td(c.portal_access ? '✓ yes' : '— no') +
           td(c.is_active ? '<span style="color:#2c7a3f;">● Active</span>' : '<span style="color:#9e9485;">○ Inactive</span>') +
           td(btn('Edit', "WPA_hoaOpenContactForm('" + c.id + "')") + ' ' +
              btn(c.is_active ? 'Deactivate' : 'Activate', "WPA_hoaToggleContact('" + c.id + "'," + (!c.is_active) + ")")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }
  function setContactsSearch(v) { _contactsSearch = v || ''; renderContacts(); }

  function openContactForm(id) {
    const rec = id ? findContact(id) : {};
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Contact' : 'New Contact') + '</h3>' +
      row('First name',        inp('hoaContactFirst', rec.first_name)) +
      row('Last name',          inp('hoaContactLast', rec.last_name)) +
      row('Full name',          inp('hoaContactFull', rec.full_name), 'Used for display. Auto-filled from first + last if blank.') +
      row('Email',              inp('hoaContactEmail', rec.email, 'type="email"')) +
      row('Phone',              inp('hoaContactPhone', rec.phone, 'type="tel"'), 'Normalized to E.164 on save.') +
      row('Portal access',      chk('hoaContactPortal', rec.portal_access !== false, 'Allowed to log into the tenant portal')) +
      row('Active',             chk('hoaContactActive', rec.is_active !== false, 'Contact is active')) +
      row('Notes',              txa('hoaContactNotes', rec.notes)) +
      '<input type="hidden" id="hoaContactId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveContact()','primary') ]);
    openModal(html);
  }
  async function saveContact() {
    const s = await hoaSupa();
    const id = readField('hoaContactId');
    const first = readField('hoaContactFirst');
    const last = readField('hoaContactLast');
    const full = readField('hoaContactFull') || [first, last].filter(Boolean).join(' ').trim() || null;
    const rawPhone = readField('hoaContactPhone');
    const payload = {
      first_name:    first,
      last_name:     last,
      full_name:     full,
      email:         readField('hoaContactEmail'),
      phone:         rawPhone,
      phone_e164:    hoaPhoneE164(rawPhone),
      portal_access: !!readField('hoaContactPortal'),
      is_active:     !!readField('hoaContactActive'),
      notes:         readField('hoaContactNotes'),
    };
    const q = id
      ? s.from('hoa_contacts').update(payload).eq('id', id)
      : s.from('hoa_contacts').insert(payload);
    const { error } = await q;
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast(id ? 'Contact updated ✓' : 'Contact created ✓', 'success');
    closeModal();
    await renderContacts();
  }
  async function toggleContact(id, makeActive) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_contacts').update({ is_active: !!makeActive }).eq('id', id);
    if (error) return hoaToast('Error: ' + error.message, 'error');
    hoaToast(makeActive ? 'Activated ✓' : 'Deactivated', 'success');
    await renderContacts();
  }

  // ── UNIT ASSIGNMENTS ──────────────────────────────────────────────────────
  let _assignFilterComm = '';
  let _assignFilterUnit = '';
  async function renderAssignments() {
    await refreshCache(['communities','units','contacts']);
    const s = await hoaSupa();
    const { data: links, error } = await s.from('hoa_unit_contacts').select('*').order('created_at', { ascending:false });
    if (error) return hoaToast('Load error: ' + error.message, 'error');
    const box = document.getElementById('hoa-assignments-list');
    if (!box) return;
    // Filters
    const commOpts = [{value:'',label:'— all communities —'}].concat(cache.communities.map(c=>({value:c.id,label:c.name})));
    const unitOpts = [{value:'',label:'— all units —'}].concat(
      cache.units.filter(u => !_assignFilterComm || u.community_id === _assignFilterComm)
        .map(u => ({ value:u.id, label:(findCommunity(u.community_id)?.name || '?') + ' / ' + u.unit_label }))
    );
    let h = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">' +
            '<label style="font-size:11px;color:#635c4e;">Community</label>' +
            sel('hoaAsgComm', commOpts, _assignFilterComm) +
            '<label style="font-size:11px;color:#635c4e;">Unit</label>' +
            sel('hoaAsgUnit', unitOpts, _assignFilterUnit) +
            '</div>' +
            '<script>document.getElementById("hoaAsgComm")?.addEventListener("change",function(){WPA_hoaSetAsgComm(this.value);});' +
            'document.getElementById("hoaAsgUnit")?.addEventListener("change",function(){WPA_hoaSetAsgUnit(this.value);});<\/script>';

    let rows = (links || []);
    if (_assignFilterUnit) rows = rows.filter(r => r.unit_id === _assignFilterUnit);
    else if (_assignFilterComm) {
      const allowed = new Set(cache.units.filter(u => u.community_id === _assignFilterComm).map(u => u.id));
      rows = rows.filter(r => allowed.has(r.unit_id));
    }
    if (!rows.length) {
      h += emptyBox('🔗', 'No assignments for this filter.', '＋ New Assignment', 'WPA_hoaOpenAssignmentForm()');
      box.innerHTML = h;
      return;
    }
    h += '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Unit') + th('Contact') + th('Role') + th('Primary') + th('Status') + th('') +
         '</tr></thead><tbody>';
    rows.forEach(r => {
      const u = findUnit(r.unit_id);
      const c = findContact(r.contact_id);
      const comm = u ? findCommunity(u.community_id) : null;
      const unitLbl = u ? ((comm ? comm.name + ' / ' : '') + u.unit_label) : '—';
      const cName = c ? (c.full_name || [c.first_name, c.last_name].filter(Boolean).join(' ')) : '—';
      h += '<tr style="border-bottom:1px solid #f0ebe2;">' +
           td(esc(unitLbl)) +
           td(esc(cName)) +
           td('<span style="background:#f0ebe2;padding:2px 6px;border-radius:6px;font-size:10px;">' + esc(r.relationship_type) + '</span>') +
           td(r.is_primary ? '★ primary' : '') +
           td(r.is_active ? '<span style="color:#2c7a3f;">● Active</span>' : '<span style="color:#9e9485;">○ Inactive</span>') +
           td(btn('Edit', "WPA_hoaOpenAssignmentForm('" + r.id + "')") + ' ' +
              btn(r.is_active ? 'Deactivate' : 'Activate', "WPA_hoaToggleAssignment('" + r.id + "'," + (!r.is_active) + ")")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }
  function setAsgComm(v) { _assignFilterComm = v || ''; _assignFilterUnit = ''; renderAssignments(); }
  function setAsgUnit(v) { _assignFilterUnit = v || ''; renderAssignments(); }

  async function openAssignmentForm(id) {
    const s = await hoaSupa();
    let rec = {};
    if (id) {
      const r = await s.from('hoa_unit_contacts').select('*').eq('id', id).maybeSingle();
      if (r.error) return hoaToast('Load error: ' + r.error.message, 'error');
      rec = r.data || {};
    }
    if (!cache.units.length) { hoaToast('Create a unit first.', 'error'); return; }
    if (!cache.contacts.length) { hoaToast('Create a contact first.', 'error'); return; }
    const unitOpts = cache.units.map(u => ({ value:u.id, label:(findCommunity(u.community_id)?.name || '?') + ' / ' + u.unit_label }));
    const contactOpts = cache.contacts.map(c => {
      const nm = c.full_name || [c.first_name,c.last_name].filter(Boolean).join(' ') || c.email || c.phone_e164 || c.id;
      return { value:c.id, label: nm + (c.is_active ? '' : ' (inactive)') };
    });
    const relOpts = [
      { value:'owner',          label:'Owner' },
      { value:'resident',       label:'Resident (tenant of the owner)' },
      { value:'owner_resident', label:'Owner-occupant (both)' },
      { value:'other',          label:'Other (manager, spouse, family, etc.)' },
    ];
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Assignment' : 'New Assignment') + '</h3>' +
      row('Unit',         sel('hoaAsgU', unitOpts, rec.unit_id || _assignFilterUnit || unitOpts[0].value)) +
      row('Contact',      sel('hoaAsgC', contactOpts, rec.contact_id || contactOpts[0].value)) +
      row('Relationship', sel('hoaAsgR', relOpts, rec.relationship_type || 'owner'), 'Owners and residents are managed separately: create one assignment per role.') +
      row('Primary',      chk('hoaAsgP', !!rec.is_primary, 'This is the primary contact for the unit in this role')) +
      row('Active',       chk('hoaAsgA', rec.is_active !== false, 'Assignment is active')) +
      '<input type="hidden" id="hoaAsgId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveAssignment()','primary') ]);
    openModal(html);
  }
  async function saveAssignment() {
    const s = await hoaSupa();
    const id = readField('hoaAsgId');
    const payload = {
      unit_id:           readField('hoaAsgU'),
      contact_id:        readField('hoaAsgC'),
      relationship_type: readField('hoaAsgR'),
      is_primary:        !!readField('hoaAsgP'),
      is_active:         !!readField('hoaAsgA'),
    };
    if (!payload.unit_id || !payload.contact_id || !payload.relationship_type) {
      hoaToast('Unit, contact, and relationship required', 'error'); return;
    }
    const q = id
      ? s.from('hoa_unit_contacts').update(payload).eq('id', id)
      : s.from('hoa_unit_contacts').insert(payload);
    const { error } = await q;
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast(id ? 'Assignment updated ✓' : 'Assignment created ✓', 'success');
    closeModal();
    await renderAssignments();
  }
  async function toggleAssignment(id, makeActive) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_unit_contacts').update({ is_active: !!makeActive }).eq('id', id);
    if (error) return hoaToast('Error: ' + error.message, 'error');
    hoaToast(makeActive ? 'Activated ✓' : 'Deactivated', 'success');
    await renderAssignments();
  }

  // ── DOCUMENTS ─────────────────────────────────────────────────────────────
  let _docsFilterComm = '';
  async function renderDocuments() {
    await refreshCache(['communities','categories']);
    const s = await hoaSupa();
    const { data: docs, error } = await s.from('hoa_documents').select('*').order('created_at', { ascending:false });
    if (error) return hoaToast('Load error: ' + error.message, 'error');
    const box = document.getElementById('hoa-documents-list');
    if (!box) return;
    const commOpts = [{value:'',label:'— all communities —'}].concat(cache.communities.map(c=>({value:c.id,label:c.name})));
    let h = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;">' +
            '<label style="font-size:11px;color:#635c4e;">Community</label>' +
            sel('hoaDocComm', commOpts, _docsFilterComm) +
            '</div>' +
            '<script>document.getElementById("hoaDocComm")?.addEventListener("change",function(){WPA_hoaSetDocComm(this.value);});<\/script>';
    let rows = (docs || []);
    if (_docsFilterComm) rows = rows.filter(d => d.community_id === _docsFilterComm);
    if (!rows.length) {
      h += emptyBox('📄', 'No documents yet.', '＋ New Document', 'WPA_hoaOpenDocumentForm()');
      box.innerHTML = h;
      return;
    }
    const catById = {};
    cache.categories.forEach(c => catById[c.id] = c.name);
    h += '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Community') + th('Category') + th('Title') + th('Visibility') + th('Status') + th('') +
         '</tr></thead><tbody>';
    rows.forEach(d => {
      const c = findCommunity(d.community_id);
      h += '<tr style="border-bottom:1px solid #f0ebe2;">' +
           td(esc(c ? c.name : '—')) +
           td(esc(catById[d.category_id] || '—')) +
           td('<strong>' + esc(d.title) + '</strong>' + (d.file_url ? ' <a href="' + esc(d.file_url) + '" target="_blank" style="color:#7d5228;text-decoration:none;">↗</a>' : '')) +
           td(d.visibility_scope === 'owners_only' ? '🔒 owners only' : '👥 all residents') +
           td(d.is_active ? '<span style="color:#2c7a3f;">● Active</span>' : '<span style="color:#9e9485;">○ Inactive</span>') +
           td(btn('Edit', "WPA_hoaOpenDocumentForm('" + d.id + "')") + ' ' +
              btn(d.is_active ? 'Archive' : 'Unarchive', "WPA_hoaToggleDocument('" + d.id + "'," + (!d.is_active) + ")")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }
  function setDocComm(v) { _docsFilterComm = v || ''; renderDocuments(); }

  async function openDocumentForm(id) {
    await refreshCache(['communities','categories']);
    const s = await hoaSupa();
    let rec = {};
    if (id) {
      const r = await s.from('hoa_documents').select('*').eq('id', id).maybeSingle();
      if (r.error) return hoaToast('Load error: ' + r.error.message, 'error');
      rec = r.data || {};
    }
    if (!cache.communities.length) { hoaToast('Create a community first.', 'error'); return; }
    const commOpts = cache.communities.map(c => ({ value:c.id, label:c.name }));
    const initialComm = rec.community_id || _docsFilterComm || commOpts[0].value;
    const catOpts = [{value:'',label:'— no category —'}].concat(
      cache.categories.filter(c => !c.community_id || c.community_id === initialComm)
        .map(c => ({ value:c.id, label:c.name }))
    );
    const visOpts = [
      { value:'owners_only',   label:'Owners only (default)' },
      { value:'all_residents', label:'All residents (owners + tenants)' },
    ];
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Document' : 'New Document') + '</h3>' +
      row('Community',  sel('hoaDocC',   commOpts, initialComm)) +
      row('Category',   sel('hoaDocCat', catOpts,  rec.category_id || '')) +
      row('Title',      inp('hoaDocTitle', rec.title)) +
      row('File URL',   inp('hoaDocUrl', rec.file_url), 'Paste the Supabase Storage / CDN URL. Full upload wizard lands in Phase 3.') +
      row('Visibility', sel('hoaDocVis', visOpts, rec.visibility_scope || 'owners_only')) +
      row('Active',     chk('hoaDocActive', rec.is_active !== false, 'Document is visible in the portal')) +
      '<input type="hidden" id="hoaDocId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveDocument()','primary') ]);
    openModal(html);
  }
  async function saveDocument() {
    const s = await hoaSupa();
    const id = readField('hoaDocId');
    const payload = {
      community_id:     readField('hoaDocC'),
      category_id:      readField('hoaDocCat') || null,
      title:            readField('hoaDocTitle'),
      file_url:         readField('hoaDocUrl'),
      visibility_scope: readField('hoaDocVis') || 'owners_only',
      is_active:        !!readField('hoaDocActive'),
    };
    if (!payload.community_id || !payload.title) { hoaToast('Community and title required', 'error'); return; }
    const q = id
      ? s.from('hoa_documents').update(payload).eq('id', id)
      : s.from('hoa_documents').insert(payload);
    const { error } = await q;
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast(id ? 'Document updated ✓' : 'Document created ✓', 'success');
    closeModal();
    await renderDocuments();
  }
  async function toggleDocument(id, makeActive) {
    const s = await hoaSupa();
    const { error } = await s.from('hoa_documents').update({ is_active: !!makeActive }).eq('id', id);
    if (error) return hoaToast('Error: ' + error.message, 'error');
    hoaToast(makeActive ? 'Restored ✓' : 'Archived', 'success');
    await renderDocuments();
  }

  // ── HOA INVOICES ──────────────────────────────────────────────────────────
  // Writes to the existing `invoices` table with invoice_type='hoa' so the
  // rental late-fee engine (v6) ignores these once its .eq('invoice_type','rent')
  // filter is in place (bundled with Phase 1b as the lfee6c patch).
  let _invFilterComm = '';
  async function renderHoaInvoices() {
    await refreshCache(['communities','units','contacts']);
    const s = await hoaSupa();
    const { data: invs, error } = await s.from('invoices')
      .select('id, invoice_type, hoa_community_id, unit_id, tenant_id, period_month, due_date, total, paid, status, responsibility_scope, notes, created_at')
      .eq('invoice_type', 'hoa')
      .order('created_at', { ascending:false });
    if (error) return hoaToast('Load error: ' + error.message, 'error');
    const box = document.getElementById('hoa-invoices-list');
    if (!box) return;
    const commOpts = [{value:'',label:'— all communities —'}].concat(cache.communities.map(c=>({value:c.id,label:c.name})));
    let h = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;">' +
            '<label style="font-size:11px;color:#635c4e;">Community</label>' +
            sel('hoaInvComm', commOpts, _invFilterComm) +
            '</div>' +
            '<script>document.getElementById("hoaInvComm")?.addEventListener("change",function(){WPA_hoaSetInvComm(this.value);});<\/script>';
    let rows = (invs || []);
    if (_invFilterComm) rows = rows.filter(i => i.hoa_community_id === _invFilterComm);
    if (!rows.length) {
      h += emptyBox('🧾', 'No HOA invoices yet.', '＋ New HOA Invoice', 'WPA_hoaOpenInvoiceForm()');
      box.innerHTML = h;
      return;
    }
    h += '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Community') + th('Unit') + th('Period') + th('Due') + th('Total') + th('Paid') + th('Scope') + th('Status') + th('') +
         '</tr></thead><tbody>';
    rows.forEach(i => {
      const c = findCommunity(i.hoa_community_id);
      const u = findUnit(i.unit_id);
      h += '<tr style="border-bottom:1px solid #f0ebe2;">' +
           td(esc(c ? c.name : '—')) +
           td(esc(u ? u.unit_label : '—')) +
           td(esc(i.period_month || '—')) +
           td(esc(fmtDate(i.due_date))) +
           td(fmtMoney(i.total)) +
           td(fmtMoney(i.paid)) +
           td('<span style="background:#f0ebe2;padding:2px 6px;border-radius:6px;font-size:10px;">' + esc(i.responsibility_scope || '—') + '</span>') +
           td(esc(i.status || '—')) +
           td(btn('Edit', "WPA_hoaOpenInvoiceForm('" + i.id + "')")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }
  function setInvComm(v) { _invFilterComm = v || ''; renderHoaInvoices(); }

  async function openHoaInvoiceForm(id) {
    await refreshCache(['communities','units','contacts']);
    const s = await hoaSupa();
    let rec = {};
    if (id) {
      const r = await s.from('invoices').select('*').eq('id', id).maybeSingle();
      if (r.error) return hoaToast('Load error: ' + r.error.message, 'error');
      rec = r.data || {};
    }
    if (!cache.communities.length) { hoaToast('Create a community first.', 'error'); return; }
    if (!cache.units.length) { hoaToast('Create a unit first.', 'error'); return; }
    const commOpts = cache.communities.map(c => ({ value:c.id, label:c.name }));
    const initialComm = rec.hoa_community_id || _invFilterComm || commOpts[0].value;
    const unitsForComm = cache.units.filter(u => u.community_id === initialComm);
    const unitOpts = unitsForComm.length
      ? unitsForComm.map(u => ({ value:u.id, label:u.unit_label + (u.building_label ? ' (' + u.building_label + ')' : '') }))
      : [{ value:'', label:'— no units in this community —' }];
    const contactOpts = [{value:'',label:'— none —'}].concat(
      cache.contacts.map(c => {
        const nm = c.full_name || [c.first_name,c.last_name].filter(Boolean).join(' ') || c.email || c.phone_e164 || c.id;
        return { value:c.id, label: nm };
      })
    );
    const scopeOpts = [
      { value:'owner_only',         label:'Owner only — owner sees and pays' },
      { value:'resident_only',      label:'Resident only — resident sees and pays' },
      { value:'owner_or_resident',  label:'Either — both see, either pays' },
    ];
    const statusOpts = [
      { value:'draft', label:'draft' },
      { value:'open',  label:'open' },
      { value:'paid',  label:'paid' },
      { value:'partial', label:'partial' },
      { value:'void',  label:'void' },
    ];
    // Default due_date = today + community grace; default period = YYYY-MM
    const comm = findCommunity(initialComm);
    const today = new Date();
    const defPeriod = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0');
    const defDue = (function(){
      const d = new Date(); d.setDate(d.getDate() + Number(comm?.grace_days || 0));
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    })();
    const html =
      '<h3 style="margin:0 0 6px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit HOA Invoice' : 'New HOA Invoice') + '</h3>' +
      '<div style="font-size:10px;color:#9e9485;margin-bottom:12px;">invoice_type=hoa · skipped by the rental late-fee engine · per-community fees apply in Phase 2.</div>' +
      row('Community',      sel('hoaInvC', commOpts, initialComm)) +
      row('Unit',           sel('hoaInvU', unitOpts, rec.unit_id || unitOpts[0].value)) +
      row('Contact (opt.)', sel('hoaInvContact', contactOpts, rec.tenant_id || ''), 'Anchors the invoice to a specific owner or resident. Optional — portal visibility is controlled by responsibility_scope.') +
      row('Period',         inp('hoaInvPeriod', rec.period_month || defPeriod), 'YYYY-MM, e.g. 2026-05') +
      row('Due date',       inp('hoaInvDue', rec.due_date || defDue, 'type="date"')) +
      row('Total',          inp('hoaInvTotal', rec.total != null ? rec.total : 0, 'type="number" step="0.01" min="0"')) +
      row('Paid',           inp('hoaInvPaid',  rec.paid  != null ? rec.paid  : 0, 'type="number" step="0.01" min="0"')) +
      row('Responsibility', sel('hoaInvScope', scopeOpts, rec.responsibility_scope || 'owner_only')) +
      row('Status',         sel('hoaInvStatus', statusOpts, rec.status || 'open')) +
      row('Notes',          txa('hoaInvNotes', rec.notes)) +
      '<input type="hidden" id="hoaInvId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveInvoice()','primary') ]);
    openModal(html);
    // Re-render unit dropdown when community changes.
    document.getElementById('hoaInvC')?.addEventListener('change', function(){
      _pendingInvCommChange = this.value;
      const units = cache.units.filter(u => u.community_id === this.value);
      const sel2 = document.getElementById('hoaInvU');
      sel2.innerHTML = units.length
        ? units.map(u => '<option value="'+u.id+'">'+esc(u.unit_label + (u.building_label ? ' ('+u.building_label+')' : ''))+'</option>').join('')
        : '<option value="">— no units in this community —</option>';
    });
  }
  let _pendingInvCommChange = null;

  async function saveHoaInvoice() {
    const s = await hoaSupa();
    const id = readField('hoaInvId');
    const commId = readField('hoaInvC');
    const unitId = readField('hoaInvU') || null;
    const comm   = findCommunity(commId);
    const unit   = findUnit(unitId);
    // invoices.property + invoices.unit are NOT NULL in the existing schema.
    // Mirror the community's name + unit_label so existing admin lists that
    // read property/unit strings still display sensibly.
    const payload = {
      invoice_type:         'hoa',
      hoa_community_id:     commId,
      unit_id:              unitId,
      tenant_id:            readField('hoaInvContact') || null,
      property:             (comm?.display_name || comm?.name || 'HOA'),
      unit:                 (unit?.unit_label || '—'),
      period_month:         readField('hoaInvPeriod'),
      due_date:             readField('hoaInvDue'),
      total:                Number(readField('hoaInvTotal') || 0),
      paid:                 Number(readField('hoaInvPaid')  || 0),
      responsibility_scope: readField('hoaInvScope') || 'owner_only',
      status:               readField('hoaInvStatus') || 'open',
      notes:                readField('hoaInvNotes'),
    };
    if (!payload.hoa_community_id || !payload.unit_id) {
      hoaToast('Community and unit required', 'error'); return;
    }
    const q = id
      ? s.from('invoices').update(payload).eq('id', id)
      : s.from('invoices').insert(payload);
    const { error } = await q;
    if (error) return hoaToast('Save error: ' + error.message, 'error');
    hoaToast(id ? 'Invoice updated ✓' : 'Invoice created ✓', 'success');
    closeModal();
    await renderHoaInvoices();
  }

  // ── UI bits shared by all sections ────────────────────────────────────────
  function th(label) { return '<th style="padding:10px 12px;font-weight:500;font-size:11px;color:#635c4e;">' + esc(label) + '</th>'; }
  function td(html)  { return '<td style="padding:10px 12px;vertical-align:top;">' + (html == null ? '' : html) + '</td>'; }
  function emptyBox(icon, msg, btnLabel, onclick) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px;color:#9e9485;">' +
           '<div class="ei" style="font-size:32px;margin-bottom:8px;">' + icon + '</div>' +
           '<p style="margin-bottom:14px;">' + esc(msg) + '</p>' +
           (btnLabel ? btn(btnLabel, onclick, 'primary') : '') +
           '</div>';
  }

  // ── section router called from app.js showSubPage ─────────────────────────
  function renderSection(section) {
    switch (section) {
      case 'communities': return renderCommunities();
      case 'units':       return renderUnits();
      case 'contacts':    return renderContacts();
      case 'assignments': return renderAssignments();
      case 'documents':   return renderDocuments();
      case 'invoices':    return renderHoaInvoices();
      default:
        console.warn('[hoa-admin] unknown section', section);
    }
  }

  // ── expose globals used by inline onclick handlers ────────────────────────
  window.WPA_hoaRender              = renderSection;
  window.WPA_hoaCloseModal          = closeModal;

  window.WPA_hoaOpenCommunityForm   = openCommunityForm;
  window.WPA_hoaSaveCommunity       = saveCommunity;
  window.WPA_hoaToggleCommunity     = toggleCommunity;
  window.WPA_hoaOpenIssueModal      = openIssueModal;
  window.WPA_hoaFireIssue           = fireIssue;
  window.WPA_hoaOpenRunsModal       = openRunsModal;

  window.WPA_hoaSetUnitsFilter      = setUnitsFilter;
  window.WPA_hoaSetUnitsSearch      = setUnitsSearch;     // 3B.3 text search
  window.WPA_hoaSetUnitsSort        = setUnitsSort;       // 3B.3 sort
  window.WPA_hoaOpenUnitForm        = openUnitForm;
  window.WPA_hoaSaveUnit            = saveUnit;
  window.WPA_hoaToggleUnit          = toggleUnit;
  // Phase 3B — unit detail modal + its inline sub-actions
  window.WPA_hoaOpenUnitDetail      = openUnitDetail;
  window.WPA_hoaUDShowAdd           = udShowAddForm;
  window.WPA_hoaUDHideAdd           = udHideAddForm;
  window.WPA_hoaUDSaveAdd           = udSaveAdd;
  window.WPA_hoaUDArchive           = udArchiveRoster;
  window.WPA_hoaUDReactivate        = udReactivateRoster;
  window.WPA_hoaUDShowAddCharge     = udShowAddCharge;
  window.WPA_hoaUDHideAddCharge     = udHideAddCharge;
  window.WPA_hoaUDSaveCharge        = udSaveCharge;
  window.WPA_hoaUDToggleCharge      = udToggleCharge;
  window.WPA_hoaUDDeleteCharge      = udDeleteCharge;
  window.WPA_hoaUDSaveNotes         = udSaveNotes;
  // Phase 3B.3 — manual payment recording
  window.WPA_hoaUDShowRecordPayment = udShowRecordPayment;
  window.WPA_hoaUDHidePayment       = udHidePayment;
  window.WPA_hoaUDSavePayment       = udSavePayment;

  window.WPA_hoaSetContactsSearch   = setContactsSearch;
  window.WPA_hoaOpenContactForm     = openContactForm;
  window.WPA_hoaSaveContact         = saveContact;
  window.WPA_hoaToggleContact       = toggleContact;

  window.WPA_hoaSetAsgComm          = setAsgComm;
  window.WPA_hoaSetAsgUnit          = setAsgUnit;
  window.WPA_hoaOpenAssignmentForm  = openAssignmentForm;
  window.WPA_hoaSaveAssignment      = saveAssignment;
  window.WPA_hoaToggleAssignment    = toggleAssignment;

  window.WPA_hoaSetDocComm          = setDocComm;
  window.WPA_hoaOpenDocumentForm    = openDocumentForm;
  window.WPA_hoaSaveDocument        = saveDocument;
  window.WPA_hoaToggleDocument      = toggleDocument;

  window.WPA_hoaSetInvComm          = setInvComm;
  window.WPA_hoaOpenInvoiceForm     = openHoaInvoiceForm;
  window.WPA_hoaSaveInvoice         = saveHoaInvoice;

  // For debugging
  window.__HOA = { cache, refreshCache };
})();
