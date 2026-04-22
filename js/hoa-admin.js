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
              btn(r.is_active ? 'Deactivate' : 'Activate', "WPA_hoaToggleCommunity('" + r.id + "'," + (!r.is_active) + ")")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }

  function openCommunityForm(id) {
    const row = id ? findCommunity(id) : {};
    const creds = [{ value:'', label:'— not wired —' }].concat(
      cache.stripeCreds.map(c => ({ value: c.id, label: (c.label || c.id) }))
    );
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Community' : 'New Community') + '</h3>' +
      row('Name',               inp('hoaCommName', row.name)) +
      row('Display name',       inp('hoaCommDisplay', row.display_name), 'Optional. Shown to tenants.') +
      row('Address line 1',     inp('hoaCommAddr1', row.address1)) +
      row('Address line 2',     inp('hoaCommAddr2', row.address2)) +
      row('City',               inp('hoaCommCity', row.city)) +
      row('State',              inp('hoaCommState', row.state, 'maxlength="2"')) +
      row('Zip',                inp('hoaCommZip', row.zip)) +
      row('Contact email',      inp('hoaCommEmail', row.contact_email, 'type="email"')) +
      row('Contact phone',      inp('hoaCommPhone', row.contact_phone, 'type="tel"')) +
      row('Grace days',         inp('hoaCommGrace', row.grace_days != null ? row.grace_days : 10, 'type="number" min="0"'), 'Days after due date before late fees begin.') +
      row('Per-day late fee',   inp('hoaCommFee', row.per_day_late_fee != null ? row.per_day_late_fee : 0, 'type="number" step="0.01" min="0"')) +
      row('Stripe account',     sel('hoaCommStripe', creds, row.stripe_cred_id || ''), 'Leave unwired for manual payments in Phase 1.') +
      row('Active',             chk('hoaCommActive', row.is_active !== false, 'Community is active')) +
      row('Notes',              txa('hoaCommNotes', row.notes)) +
      '<input type="hidden" id="hoaCommId" value="' + esc(id || '') + '">' +
      actionsBar([ btn('Cancel','WPA_hoaCloseModal()'), btn(id ? 'Save' : 'Create','WPA_hoaSaveCommunity()','primary') ]);
    openModal(html);
  }

  async function saveCommunity() {
    const s = await hoaSupa();
    const id = readField('hoaCommId');
    const payload = {
      name:              readField('hoaCommName'),
      display_name:      readField('hoaCommDisplay'),
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

  // ── UNITS ─────────────────────────────────────────────────────────────────
  let _unitsFilterCommunity = '';
  async function renderUnits() {
    await refreshCache(['communities','units']);
    const box = document.getElementById('hoa-units-list');
    if (!box) return;
    // Filter bar
    const commOpts = [{ value:'', label:'— all communities —' }].concat(cache.communities.map(c => ({ value:c.id, label:c.name })));
    let h = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;">' +
            '<label style="font-size:11px;color:#635c4e;">Filter by community</label>' +
            sel('hoaUnitsFilter', commOpts, _unitsFilterCommunity) +
            '</div>' +
            '<script>document.getElementById("hoaUnitsFilter")?.addEventListener("change",function(){WPA_hoaSetUnitsFilter(this.value);});<\/script>';
    let rows = cache.units;
    if (_unitsFilterCommunity) rows = rows.filter(u => u.community_id === _unitsFilterCommunity);
    if (!rows.length) {
      h += emptyBox('🏢', 'No units for this filter.', '＋ New Unit', 'WPA_hoaOpenUnitForm()');
      box.innerHTML = h;
      return;
    }
    h += '<table class="hoa-tbl" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f7f4ef;text-align:left;">' +
         th('Community') + th('Unit') + th('Building') + th('Floor') + th('Status') + th('Notes') + th('') +
         '</tr></thead><tbody>';
    rows.forEach(u => {
      const c = findCommunity(u.community_id);
      h += '<tr style="border-bottom:1px solid #f0ebe2;">' +
           td(esc(c ? c.name : '—')) +
           td('<strong>' + esc(u.unit_label) + '</strong>') +
           td(esc(u.building_label || '—')) +
           td(esc(u.floor_label || '—')) +
           td(u.is_active ? '<span style="color:#2c7a3f;">● Active</span>' : '<span style="color:#9e9485;">○ Inactive</span>') +
           td(esc(u.notes || '—')) +
           td(btn('Edit', "WPA_hoaOpenUnitForm('" + u.id + "')") + ' ' +
              btn(u.is_active ? 'Deactivate' : 'Activate', "WPA_hoaToggleUnit('" + u.id + "'," + (!u.is_active) + ")")) +
           '</tr>';
    });
    h += '</tbody></table>';
    box.innerHTML = h;
  }
  function setUnitsFilter(v) { _unitsFilterCommunity = v || ''; renderUnits(); }

  function openUnitForm(id) {
    const row = id ? findUnit(id) : {};
    if (!cache.communities.length) { hoaToast('Create a community first.', 'error'); return; }
    const commOpts = cache.communities.map(c => ({ value:c.id, label:c.name }));
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Unit' : 'New Unit') + '</h3>' +
      row('Community',    sel('hoaUnitComm', commOpts, row.community_id || _unitsFilterCommunity || commOpts[0].value)) +
      row('Unit label',   inp('hoaUnitLabel', row.unit_label), 'e.g. "3B" or "204"') +
      row('Building',     inp('hoaUnitBldg', row.building_label)) +
      row('Floor',        inp('hoaUnitFloor', row.floor_label)) +
      row('Active',       chk('hoaUnitActive', row.is_active !== false, 'Unit is active')) +
      row('Notes',        txa('hoaUnitNotes', row.notes)) +
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
      is_active:      !!readField('hoaUnitActive'),
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
    const row = id ? findContact(id) : {};
    const html =
      '<h3 style="margin:0 0 12px 0;font-family:\'Playfair Display\',serif;">' + (id ? 'Edit Contact' : 'New Contact') + '</h3>' +
      row('First name',        inp('hoaContactFirst', row.first_name)) +
      row('Last name',          inp('hoaContactLast', row.last_name)) +
      row('Full name',          inp('hoaContactFull', row.full_name), 'Used for display. Auto-filled from first + last if blank.') +
      row('Email',              inp('hoaContactEmail', row.email, 'type="email"')) +
      row('Phone',              inp('hoaContactPhone', row.phone, 'type="tel"'), 'Normalized to E.164 on save.') +
      row('Portal access',      chk('hoaContactPortal', row.portal_access !== false, 'Allowed to log into the tenant portal')) +
      row('Active',             chk('hoaContactActive', row.is_active !== false, 'Contact is active')) +
      row('Notes',              txa('hoaContactNotes', row.notes)) +
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
    let row = {};
    if (id) {
      const r = await s.from('hoa_unit_contacts').select('*').eq('id', id).maybeSingle();
      if (r.error) return hoaToast('Load error: ' + r.error.message, 'error');
      row = r.data || {};
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
      row('Unit',         sel('hoaAsgU', unitOpts, row.unit_id || _assignFilterUnit || unitOpts[0].value)) +
      row('Contact',      sel('hoaAsgC', contactOpts, row.contact_id || contactOpts[0].value)) +
      row('Relationship', sel('hoaAsgR', relOpts, row.relationship_type || 'owner'), 'Owners and residents are managed separately: create one assignment per role.') +
      row('Primary',      chk('hoaAsgP', !!row.is_primary, 'This is the primary contact for the unit in this role')) +
      row('Active',       chk('hoaAsgA', row.is_active !== false, 'Assignment is active')) +
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
    let row = {};
    if (id) {
      const r = await s.from('hoa_documents').select('*').eq('id', id).maybeSingle();
      if (r.error) return hoaToast('Load error: ' + r.error.message, 'error');
      row = r.data || {};
    }
    if (!cache.communities.length) { hoaToast('Create a community first.', 'error'); return; }
    const commOpts = cache.communities.map(c => ({ value:c.id, label:c.name }));
    const initialComm = row.community_id || _docsFilterComm || commOpts[0].value;
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
      row('Category',   sel('hoaDocCat', catOpts,  row.category_id || '')) +
      row('Title',      inp('hoaDocTitle', row.title)) +
      row('File URL',   inp('hoaDocUrl', row.file_url), 'Paste the Supabase Storage / CDN URL. Full upload wizard lands in Phase 3.') +
      row('Visibility', sel('hoaDocVis', visOpts, row.visibility_scope || 'owners_only')) +
      row('Active',     chk('hoaDocActive', row.is_active !== false, 'Document is visible in the portal')) +
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
    let row = {};
    if (id) {
      const r = await s.from('invoices').select('*').eq('id', id).maybeSingle();
      if (r.error) return hoaToast('Load error: ' + r.error.message, 'error');
      row = r.data || {};
    }
    if (!cache.communities.length) { hoaToast('Create a community first.', 'error'); return; }
    if (!cache.units.length) { hoaToast('Create a unit first.', 'error'); return; }
    const commOpts = cache.communities.map(c => ({ value:c.id, label:c.name }));
    const initialComm = row.hoa_community_id || _invFilterComm || commOpts[0].value;
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
      row('Unit',           sel('hoaInvU', unitOpts, row.unit_id || unitOpts[0].value)) +
      row('Contact (opt.)', sel('hoaInvContact', contactOpts, row.tenant_id || ''), 'Anchors the invoice to a specific owner or resident. Optional — portal visibility is controlled by responsibility_scope.') +
      row('Period',         inp('hoaInvPeriod', row.period_month || defPeriod), 'YYYY-MM, e.g. 2026-05') +
      row('Due date',       inp('hoaInvDue', row.due_date || defDue, 'type="date"')) +
      row('Total',          inp('hoaInvTotal', row.total != null ? row.total : 0, 'type="number" step="0.01" min="0"')) +
      row('Paid',           inp('hoaInvPaid',  row.paid  != null ? row.paid  : 0, 'type="number" step="0.01" min="0"')) +
      row('Responsibility', sel('hoaInvScope', scopeOpts, row.responsibility_scope || 'owner_only')) +
      row('Status',         sel('hoaInvStatus', statusOpts, row.status || 'open')) +
      row('Notes',          txa('hoaInvNotes', row.notes)) +
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

  window.WPA_hoaSetUnitsFilter      = setUnitsFilter;
  window.WPA_hoaOpenUnitForm        = openUnitForm;
  window.WPA_hoaSaveUnit            = saveUnit;
  window.WPA_hoaToggleUnit          = toggleUnit;

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
