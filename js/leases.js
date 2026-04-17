// ══════════════════════════════════════════════════════
//  LEASES & FILES — list + Create Lease wizard + detail
//  v2026-04-14 1900
// ══════════════════════════════════════════════════════

const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// State
let _leases = [];
let _filteredLeases = [];
let _templates = [];
let _addendums = [];
let _sortKey = 'lease_start';
let _sortDir = 'desc';
let _currentDetailLease = null;

// Wizard state
let _wizStep = 1;
const WIZ_STEPS = [
  { n: 1, label: 'Tenants' },
  { n: 2, label: 'Property' },
  { n: 3, label: 'Terms' },
  { n: 4, label: 'Utilities' },
  { n: 5, label: 'Addendums' },
  { n: 6, label: 'Review' },
];
const UTILITIES = ['Water', 'Sewer', 'Trash', 'Electric', 'Gas', 'Heat', 'Hot water', 'Internet', 'Cable'];

// ══════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════
function toast(msg, kind = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (kind || '');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function fmtDate(d) {
  if (!d) return '';
  const x = new Date(d + 'T00:00:00');
  if (isNaN(x)) return d;
  return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtMoney(n) {
  const v = parseFloat(n || 0);
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function todayISO() { return new Date().toISOString().slice(0, 10); }

// ══════════════════════════════════════════════════════
//  LEASE LIST
// ══════════════════════════════════════════════════════

async function loadLeases() {
  try {
    const { data, error } = await sb
      .from('leases')
      .select('*, lease_signers(id, name, email, status, signed_at, signing_token, role)')
      .order('lease_start', { ascending: false });
    if (error) throw error;
    _leases = data || [];
    applyFilter();
    updateStats();
  } catch (e) {
    console.error(e);
    document.getElementById('leasesBody').innerHTML =
      `<tr><td colspan="7" class="empty">Error loading leases: ${escapeHtml(e.message)}</td></tr>`;
  }
}

// Compute a display status that combines lease.status + date vs today
function displayStatus(l) {
  if (l.status === 'void') return { key: 'void', label: 'Void' };
  if (l.status === 'draft') return { key: 'draft', label: 'Draft' };
  if (l.status === 'out_for_signature')  return { key: 'out_for_signature', label: 'In Process' };
  if (l.status === 'partially_signed')   return { key: 'partially_signed',  label: 'Partially Signed' };
  if (l.status === 'fully_signed')       return { key: 'fully_signed',      label: 'Awaiting Countersign' };
  if (l.status === 'countersigned') {
    const today = todayISO();
    if (l.lease_start && l.lease_start > today) return { key: 'future',  label: 'Future' };
    if (l.lease_end   && l.lease_end   < today) return { key: 'expired', label: 'Expired' };
    return { key: 'active', label: 'Active' };
  }
  return { key: 'draft', label: l.status || 'Unknown' };
}

function applyFilter() {
  const q = (document.getElementById('filterInput').value || '').trim().toLowerCase();
  _filteredLeases = _leases.filter(l => {
    if (!q) return true;
    const tenants = (l.lease_signers || []).filter(s => s.role === 'tenant').map(s => s.name).join(' ');
    const blob = [l.property, l.unit, tenants, displayStatus(l).label, l.landlord_name].join(' ').toLowerCase();
    return blob.includes(q);
  });

  // sort
  _filteredLeases.sort((a, b) => {
    const A = sortValue(a, _sortKey);
    const B = sortValue(b, _sortKey);
    if (A < B) return _sortDir === 'asc' ? -1 : 1;
    if (A > B) return _sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  renderList();
}

function sortValue(l, key) {
  if (key === 'status')   return displayStatus(l).label;
  if (key === 'tenants')  return ((l.lease_signers || []).filter(s => s.role === 'tenant')[0]?.name || '').toLowerCase();
  if (key === 'address')  return (l.property + ' ' + l.unit).toLowerCase();
  if (key === 'lease_start' || key === 'lease_end') return l[key] || '';
  return (l[key] || '').toString().toLowerCase();
}

function renderList() {
  const body = document.getElementById('leasesBody');
  document.getElementById('toolbarCount').textContent = `Showing ${_filteredLeases.length} of ${_leases.length}`;

  if (!_filteredLeases.length) {
    body.innerHTML = `<tr><td colspan="7" class="empty">${_leases.length ? 'No leases match your filter.' : 'No leases yet. Click + New Lease to start.'}</td></tr>`;
    return;
  }

  body.innerHTML = _filteredLeases.map(l => {
    const st = displayStatus(l);
    const tenantsArr = (l.lease_signers || []).filter(s => s.role === 'tenant');
    const tenantsTxt = tenantsArr.length
      ? (tenantsArr.length === 1 ? tenantsArr[0].name : `${tenantsArr[0].name} +${tenantsArr.length - 1}`)
      : '—';
    return `
      <tr onclick="openDetail('${l.id}')">
        <td><span class="status-pill status-${st.key}">${st.label}</span></td>
        <td>${escapeHtml(l.property || '')}</td>
        <td>${escapeHtml(l.unit || '')}</td>
        <td><div>${escapeHtml(l.property || '')}</div><div class="addr">${escapeHtml(l.unit ? 'Unit ' + l.unit : '')}</div></td>
        <td><span class="tenants-chip">👥 ${escapeHtml(tenantsTxt)}</span></td>
        <td>${fmtDate(l.lease_start)}</td>
        <td>${l.lease_type === 'mtm' ? '<span class="pill">M to M</span>' : fmtDate(l.lease_end)}</td>
      </tr>
    `;
  }).join('');
}

function updateStats() {
  const today = todayISO();
  const in90  = new Date(); in90.setDate(in90.getDate() + 90);
  const in90ISO = in90.toISOString().slice(0, 10);

  let active = 0, inProcess = 0, future = 0, expiring = 0, expired = 0;
  _leases.forEach(l => {
    const st = displayStatus(l).key;
    if (st === 'out_for_signature' || st === 'partially_signed' || st === 'fully_signed') inProcess++;
    if (st === 'future') future++;
    if (st === 'active') {
      active++;
      if (l.lease_end && l.lease_end >= today && l.lease_end <= in90ISO) expiring++;
    }
    if (st === 'expired' || st === 'void') expired++;
  });

  document.getElementById('statActive').textContent    = active;
  document.getElementById('statInProcess').textContent = inProcess;
  document.getElementById('statFuture').textContent    = future;
  document.getElementById('statExpiring').textContent  = expiring;
  document.getElementById('statExpired').textContent   = expired;
}

// CSV export
function exportCSV() {
  const hdr = ['Status', 'Property', 'Unit', 'Tenants', 'Start', 'End', 'Monthly Rent', 'Security Deposit'];
  const rows = _filteredLeases.map(l => {
    const tenants = (l.lease_signers || []).filter(s => s.role === 'tenant').map(s => s.name).join('; ');
    return [
      displayStatus(l).label, l.property || '', l.unit || '', tenants,
      l.lease_start || '', l.lease_end || '', l.monthly_rent || '', l.security_deposit || '',
    ];
  });
  const csv = [hdr, ...rows].map(r => r.map(c => `"${String(c).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `leases-${todayISO()}.csv`;
  a.click();
}

// ══════════════════════════════════════════════════════
//  WIZARD
// ══════════════════════════════════════════════════════

async function openWizardNew(prefill = {}) {
  // Load templates + addendums if not loaded
  if (!_templates.length) await loadTemplatesAndAddendums();

  _wizStep = 1;
  renderWizSteps();

  // Tenants (prefill from URL if present)
  document.getElementById('tenantsList').innerHTML = '';
  if (prefill.tenant_name || prefill.email) {
    addTenantRow(prefill.tenant_name, prefill.email, prefill.phone || '');
  } else {
    addTenantRow();
  }

  // Property
  document.getElementById('wizProperty').value        = prefill.property || '';
  document.getElementById('wizUnit').value            = prefill.unit || '';
  document.getElementById('wizCity').value            = prefill.city  || 'Elkins Park, PA';
  document.getElementById('wizLandlordName').value    = 'Kevin Smith';
  document.getElementById('wizLandlordEntity').value  = 'ERA Holding LLC';

  // Terms
  document.getElementById('wizLeaseType').value   = prefill.lease_type || 'lt';
  document.getElementById('wizLeaseStart').value  = prefill.lease_start || todayISO();
  document.getElementById('wizLeaseEnd').value    = prefill.lease_end || '';
  document.getElementById('wizMonthlyRent').value = prefill.monthly_rent || '';
  document.getElementById('wizSecDep').value      = '';
  document.getElementById('wizLastMonth').value   = '';
  document.getElementById('wizTotalDep').value    = '';

  // Templates dropdown
  const tplSel = document.getElementById('wizTemplate');
  tplSel.innerHTML = _templates.map(t =>
    `<option value="${t.id}" ${t.is_default ? 'selected' : ''}>${escapeHtml(t.name)}${t.is_default ? ' (default)' : ''}</option>`
  ).join('');

  // Utilities
  const utilWrap = document.getElementById('utilityChecks');
  utilWrap.innerHTML = UTILITIES.map(u => `
    <label class="chk-row"><input type="checkbox" class="util-chk" value="${u}">${u}</label>
  `).join('');

  // Extras
  document.getElementById('extraCharges').innerHTML = '';

  // Addendums — all active pre-checked
  const addList = document.getElementById('addendumList');
  if (!_addendums.length) {
    addList.innerHTML = `<div class="empty" style="padding:20px;">No addendums in library. Add them under Templates.</div>`;
  } else {
    addList.innerHTML = _addendums.map(a => `
      <label class="addendum-item">
        <input type="checkbox" class="addendum-chk" value="${a.id}" ${a.active ? 'checked' : ''}>
        <div style="flex:1;">
          <div class="name">${escapeHtml(a.name)}</div>
          <div class="meta">
            ${a.requires_signature ? '<span class="pill">Requires signature</span>' : '<span class="pill">No signature</span>'}
            &nbsp;· Sort: ${a.sort_order ?? 0}
          </div>
        </div>
      </label>
    `).join('');
  }

  onLeaseTypeChange();
  wireTotalDep();
  showWizPage(1);

  document.getElementById('wizardModal').classList.add('active');
}

function renderWizSteps() {
  document.getElementById('wizSteps').innerHTML = WIZ_STEPS.map(s => `
    <span class="wiz-step ${s.n === _wizStep ? 'active' : (s.n < _wizStep ? 'done' : '')}" data-step="${s.n}">
      <span class="num">${s.n < _wizStep ? '✓' : s.n}</span> ${s.label}
    </span>
  `).join('');
}

function showWizPage(n) {
  document.querySelectorAll('.wiz-page').forEach(p => p.classList.remove('active'));
  document.querySelector(`.wiz-page[data-step="${n}"]`)?.classList.add('active');
  _wizStep = n;
  renderWizSteps();
  document.getElementById('wizBackBtn').style.display      = n > 1 ? 'inline-block' : 'none';
  document.getElementById('wizNextBtn').style.display      = n < 6 ? 'inline-block' : 'none';
  document.getElementById('wizSaveDraftBtn').style.display = n === 6 ? 'inline-block' : 'none';
  document.getElementById('wizSendBtn').style.display      = n === 6 ? 'inline-block' : 'none';

  if (n === 6) renderReview();
}

function wizBack() { if (_wizStep > 1) showWizPage(_wizStep - 1); }

function wizNext() {
  const errs = validateStep(_wizStep);
  if (errs.length) { toast(errs[0], 'error'); return; }
  if (_wizStep < 6) showWizPage(_wizStep + 1);
}

function validateStep(n) {
  const errs = [];
  if (n === 1) {
    const tenants = getTenantInputs();
    if (!tenants.length) errs.push('Add at least one tenant');
    tenants.forEach((t, i) => {
      if (!t.name)  errs.push(`Tenant ${i + 1}: name is required`);
      if (!t.email) errs.push(`Tenant ${i + 1}: email is required`);
      if (t.email && !/^.+@.+\..+$/.test(t.email)) errs.push(`Tenant ${i + 1}: invalid email`);
    });
  }
  if (n === 2) {
    if (!document.getElementById('wizProperty').value.trim()) errs.push('Property is required');
    if (!document.getElementById('wizUnit').value.trim()) errs.push('Unit is required');
  }
  if (n === 3) {
    if (!document.getElementById('wizLeaseStart').value) errs.push('Lease start is required');
    if (document.getElementById('wizLeaseType').value === 'lt' && !document.getElementById('wizLeaseEnd').value) {
      errs.push('Lease end is required for long-term leases');
    }
    if (!(parseFloat(document.getElementById('wizMonthlyRent').value) > 0)) errs.push('Monthly rent must be > 0');
  }
  return errs;
}

function closeWizard() {
  document.getElementById('wizardModal').classList.remove('active');
}

// Tenants
function addTenantRow(name = '', email = '', phone = '') {
  const wrap = document.getElementById('tenantsList');
  const row = document.createElement('div');
  row.className = 'tenant-row';
  row.innerHTML = `
    <input type="text"  placeholder="Full name"    class="t-name"  value="${escapeHtml(name)}">
    <input type="email" placeholder="email@example.com" class="t-email" value="${escapeHtml(email)}">
    <input type="tel"   placeholder="phone (opt.)" class="t-phone" value="${escapeHtml(phone)}">
    <button class="remove-tenant" title="Remove" onclick="this.parentElement.remove()">×</button>
  `;
  wrap.appendChild(row);
}

function getTenantInputs() {
  return [...document.querySelectorAll('#tenantsList .tenant-row')].map(r => ({
    name:  r.querySelector('.t-name').value.trim(),
    email: r.querySelector('.t-email').value.trim(),
    phone: r.querySelector('.t-phone').value.trim(),
  })).filter(t => t.name || t.email);
}

// Lease-type toggle
function onLeaseTypeChange() {
  const t = document.getElementById('wizLeaseType').value;
  document.getElementById('wizLeaseEndWrap').style.display = (t === 'mtm') ? 'none' : '';
  if (t === 'mtm') document.getElementById('wizLeaseEnd').value = '';
}

// Deposit auto-total
function wireTotalDep() {
  const calc = () => {
    const s = parseFloat(document.getElementById('wizSecDep').value || 0);
    const l = parseFloat(document.getElementById('wizLastMonth').value || 0);
    document.getElementById('wizTotalDep').value = (s + l).toFixed(2);
  };
  document.getElementById('wizSecDep').addEventListener('input', calc);
  document.getElementById('wizLastMonth').addEventListener('input', calc);
}

// Extras
function addExtraCharge(label = '', amount = '', note = '') {
  const wrap = document.getElementById('extraCharges');
  const row = document.createElement('div');
  row.className = 'extra-row';
  row.innerHTML = `
    <input type="text"   placeholder="Label (e.g. Parking)" class="e-label"  value="${escapeHtml(label)}">
    <input type="number" placeholder="Amount" step="0.01"  class="e-amount" value="${amount}">
    <input type="text"   placeholder="Note (optional)"      class="e-note"   value="${escapeHtml(note)}">
    <button class="remove-tenant" onclick="this.parentElement.remove()">×</button>
  `;
  wrap.appendChild(row);
}

function getExtraCharges() {
  return [...document.querySelectorAll('#extraCharges .extra-row')].map(r => ({
    label:  r.querySelector('.e-label').value.trim(),
    amount: parseFloat(r.querySelector('.e-amount').value || 0),
    note:   r.querySelector('.e-note').value.trim(),
  })).filter(x => x.label && x.amount > 0);
}

function getSelectedUtilities() {
  return [...document.querySelectorAll('.util-chk:checked')].map(c => c.value);
}

function getSelectedAddendumIds() {
  return [...document.querySelectorAll('.addendum-chk:checked')].map(c => c.value);
}

// Review
function renderReview() {
  const tenants = getTenantInputs();
  const utils   = getSelectedUtilities();
  const extras  = getExtraCharges();
  const addIds  = getSelectedAddendumIds();
  const addNames = _addendums.filter(a => addIds.includes(a.id)).map(a => a.name);
  const tpl = _templates.find(t => t.id === document.getElementById('wizTemplate').value);

  const html = `
    <div class="review-sec">
      <h4>Tenants (${tenants.length})</h4>
      ${tenants.map((t, i) => `<div class="review-row"><div class="k">Tenant ${i + 1}</div><div>${escapeHtml(t.name)} &lt;${escapeHtml(t.email)}&gt; ${t.phone ? '· ' + escapeHtml(t.phone) : ''}</div></div>`).join('')}
    </div>
    <div class="review-sec">
      <h4>Property</h4>
      <div class="review-row"><div class="k">Address</div><div>${escapeHtml(document.getElementById('wizProperty').value)}, Unit ${escapeHtml(document.getElementById('wizUnit').value)}</div></div>
      <div class="review-row"><div class="k">City</div><div>${escapeHtml(document.getElementById('wizCity').value)}</div></div>
      <div class="review-row"><div class="k">Landlord</div><div>${escapeHtml(document.getElementById('wizLandlordName').value)} (${escapeHtml(document.getElementById('wizLandlordEntity').value)})</div></div>
    </div>
    <div class="review-sec">
      <h4>Terms</h4>
      <div class="review-row"><div class="k">Type</div><div>${document.getElementById('wizLeaseType').value === 'lt' ? 'Long-term' : 'Month-to-Month'}</div></div>
      <div class="review-row"><div class="k">Start</div><div>${fmtDate(document.getElementById('wizLeaseStart').value)}</div></div>
      <div class="review-row"><div class="k">End</div><div>${document.getElementById('wizLeaseType').value === 'mtm' ? '—' : fmtDate(document.getElementById('wizLeaseEnd').value)}</div></div>
      <div class="review-row"><div class="k">Monthly rent</div><div>${fmtMoney(document.getElementById('wizMonthlyRent').value)}</div></div>
      <div class="review-row"><div class="k">Security deposit</div><div>${fmtMoney(document.getElementById('wizSecDep').value)}</div></div>
      <div class="review-row"><div class="k">Last month</div><div>${fmtMoney(document.getElementById('wizLastMonth').value)}</div></div>
      <div class="review-row"><div class="k">Total on signing</div><div><strong>${fmtMoney(document.getElementById('wizTotalDep').value)}</strong></div></div>
      <div class="review-row"><div class="k">Template</div><div>${escapeHtml(tpl?.name || '—')}</div></div>
    </div>
    <div class="review-sec">
      <h4>Utilities &amp; Extras</h4>
      <div class="review-row"><div class="k">Included utilities</div><div>${utils.length ? utils.join(', ') : '—'}</div></div>
      <div class="review-row"><div class="k">Extra charges</div><div>${extras.length ? extras.map(e => `${escapeHtml(e.label)}: ${fmtMoney(e.amount)}`).join(', ') : '—'}</div></div>
    </div>
    <div class="review-sec">
      <h4>Addendums (${addNames.length})</h4>
      <div>${addNames.length ? addNames.map(n => `<span class="pill" style="margin:2px 4px 2px 0;">${escapeHtml(n)}</span>`).join('') : '—'}</div>
    </div>
  `;
  document.getElementById('reviewContent').innerHTML = html;
}

// Submit
async function wizSubmit(action) {
  // Validate everything first
  for (const n of [1, 2, 3]) {
    const errs = validateStep(n);
    if (errs.length) { toast(errs[0], 'error'); showWizPage(n); return; }
  }

  const tenants = getTenantInputs();
  const utils   = getSelectedUtilities();
  const extras  = getExtraCharges();
  const addIds  = getSelectedAddendumIds();
  const tplId   = document.getElementById('wizTemplate').value;
  const tpl     = _templates.find(t => t.id === tplId);

  // Build lease payload
  const leasePayload = {
    status:             action === 'send' ? 'out_for_signature' : 'draft',
    property:           document.getElementById('wizProperty').value.trim(),
    unit:               document.getElementById('wizUnit').value.trim(),
    landlord_name:      document.getElementById('wizLandlordName').value.trim(),
    landlord_entity:    document.getElementById('wizLandlordEntity').value.trim(),
    lease_type:         document.getElementById('wizLeaseType').value,
    lease_start:        document.getElementById('wizLeaseStart').value,
    lease_end:          document.getElementById('wizLeaseType').value === 'mtm' ? null : (document.getElementById('wizLeaseEnd').value || null),
    monthly_rent:       parseFloat(document.getElementById('wizMonthlyRent').value || 0),
    last_month_rent:    parseFloat(document.getElementById('wizLastMonth').value || 0),
    security_deposit:   parseFloat(document.getElementById('wizSecDep').value || 0),
    extra_charges:      extras,
    utilities_included: utils,
    template_id:        tplId || null,
    body_html_snapshot: action === 'send' ? buildBodySnapshot(tpl, tenants) : null,
    sent_at:            action === 'send' ? new Date().toISOString() : null,
  };

  // URL param: application link
  const urlApp = new URLSearchParams(location.search).get('app');
  if (urlApp) leasePayload.created_from_application_id = urlApp;

  const btns = ['wizNextBtn', 'wizSaveDraftBtn', 'wizSendBtn'].map(id => document.getElementById(id));
  btns.forEach(b => b.disabled = true);
  try {
    // 1) Create lease
    const { data: lease, error: le } = await sb.from('leases').insert(leasePayload).select().single();
    if (le) throw le;

    // 2) Create signers: tenants + landlord
    const signers = [
      ...tenants.map((t, i) => ({
        lease_id:   lease.id,
        role:       'tenant',
        sign_order: i + 1,
        name:       t.name,
        email:      t.email,
        phone:      t.phone || null,
        application_id: urlApp || null,
      })),
      {
        lease_id:   lease.id,
        role:       'landlord',
        sign_order: 99,
        name:       leasePayload.landlord_name,
        email:      'general@willowpa.com',   // Willow Partnership countersign inbox
      },
    ];
    const { data: insertedSigners, error: se } = await sb.from('lease_signers').insert(signers).select();
    if (se) throw se;

    // 3) Attach addendums (snapshot)
    if (addIds.length) {
      const picks = _addendums.filter(a => addIds.includes(a.id)).map(a => ({
        lease_id:            lease.id,
        addendum_library_id: a.id,
        name_snapshot:       a.name,
        body_html_snapshot:  a.body_html,
        requires_signature:  a.requires_signature,
        sort_order:          a.sort_order ?? 100,
      }));
      const { error: ae } = await sb.from('lease_addendums_selected').insert(picks);
      if (ae) throw ae;
    }

    // 4) Audit log
    await sb.from('lease_events').insert({
      lease_id:   lease.id,
      event_type: 'created',
      meta:       { action, tenant_count: tenants.length, addendum_count: addIds.length },
    });

    // 5) If sending, queue signing emails
    if (action === 'send') {
      await sb.from('lease_events').insert({
        lease_id:   lease.id,
        event_type: 'sent',
        meta:       { tenant_count: tenants.length },
      });
      // Fire-and-forget: send emails
      queueSigningEmails(lease, insertedSigners.filter(s => s.role === 'tenant'));
    }

    toast(action === 'send' ? `Lease sent to ${tenants.length} tenant(s)` : 'Draft saved', 'success');
    closeWizard();
    await loadLeases();
    setTimeout(() => openDetail(lease.id), 250);
  } catch (e) {
    console.error(e);
    toast('Save failed: ' + e.message, 'error');
  } finally {
    btns.forEach(b => b.disabled = false);
  }
}

// ══════════════════════════════════════════════════════
//  TEMPLATE + ADDENDUM DATA
// ══════════════════════════════════════════════════════

async function loadTemplatesAndAddendums() {
  const [{ data: tpls }, { data: adds }] = await Promise.all([
    sb.from('lease_templates').select('*').eq('active', true).order('is_default', { ascending: false }),
    sb.from('lease_addendum_library').select('*').eq('active', true).order('sort_order'),
  ]);
  _templates = tpls || [];
  _addendums = adds || [];
}

// ══════════════════════════════════════════════════════
//  BODY SNAPSHOT (token merge at send time)
// ══════════════════════════════════════════════════════

function buildBodySnapshot(template, tenants) {
  if (!template) return null;
  const tenantNames = tenants.map(t => t.name);
  const sigBlocks = tenantNames.map((name, i) => `
    <div class="sig-block">
      <p><strong>Tenant ${i + 1}:</strong> ${escapeHtml(name)}</p>
      <p>Signature: <span class="sig-line"></span> &nbsp; Date: <span class="sig-line" style="width:140px;"></span></p>
    </div>
  `).join('');

  const extras = getExtraCharges();
  const utils  = getSelectedUtilities();
  const data = {
    LANDLORD_NAME:      document.getElementById('wizLandlordName').value,
    LANDLORD_ENTITY:    document.getElementById('wizLandlordEntity').value,
    TENANT_NAMES:       tenantNames.join(', '),
    TENANT_SIGNATURE_BLOCKS: sigBlocks,
    PROPERTY:           document.getElementById('wizProperty').value,
    UNIT:               document.getElementById('wizUnit').value,
    CITY:               document.getElementById('wizCity').value,
    LEASE_START:        fmtDate(document.getElementById('wizLeaseStart').value),
    LEASE_END:          fmtDate(document.getElementById('wizLeaseEnd').value),
    MONTHLY_RENT:       fmtMoney(document.getElementById('wizMonthlyRent').value),
    LAST_MONTH:         fmtMoney(document.getElementById('wizLastMonth').value),
    SECURITY_DEPOSIT:   fmtMoney(document.getElementById('wizSecDep').value),
    TOTAL_DEPOSIT:      fmtMoney(document.getElementById('wizTotalDep').value),
    UTILITIES_INCLUDED: utils.join(', ') || 'None',
    EXTRA_CHARGES_HTML: extras.length ? ('<ul>' + extras.map(e => `<li>${escapeHtml(e.label)}: ${fmtMoney(e.amount)}${e.note ? ' — ' + escapeHtml(e.note) : ''}</li>`).join('') + '</ul>') : '<p>None.</p>',
    TODAY:              fmtDate(todayISO()),
  };

  return template.body_html.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(data, key) ? data[key] : m
  );
}

// ══════════════════════════════════════════════════════
//  EMAIL QUEUE — stub until sendEmail() endpoint is wired
// ══════════════════════════════════════════════════════

async function queueSigningEmails(lease, tenantSigners) {
  // Phase 6 will hit the sendEmail() endpoint (DNSMadeEasy via Supabase app_credentials).
  // For now we just log to lease_events so we have a record of the intent.
  for (const s of tenantSigners) {
    const signUrl = `${location.origin.replace('propdesk', 'willowpa')}/sign.php?token=${s.signing_token}`;
    await sb.from('lease_events').insert({
      lease_id:  lease.id,
      signer_id: s.id,
      event_type: 'email_queued',
      meta: {
        to:      s.email,
        subject: `Lease ready for your signature — ${lease.property} Unit ${lease.unit}`,
        url:     signUrl,
      },
    });
  }
  console.info('[queueSigningEmails] Queued', tenantSigners.length, 'emails. Implement sendEmail() in Phase 6.');
}

// ══════════════════════════════════════════════════════
//  LEASE DETAIL MODAL
// ══════════════════════════════════════════════════════

async function openDetail(id) {
  try {
    const { data, error } = await sb
      .from('leases')
      .select('*, lease_signers(*), lease_addendums_selected(name_snapshot, requires_signature)')
      .eq('id', id).single();
    if (error) throw error;
    _currentDetailLease = data;
    renderDetail(data);
    document.getElementById('detailModal').classList.add('active');
  } catch (e) {
    console.error(e);
    toast('Load lease failed: ' + e.message, 'error');
  }
}

function closeDetail() {
  document.getElementById('detailModal').classList.remove('active');
  _currentDetailLease = null;
}

function renderDetail(l) {
  const st = displayStatus(l);
  const tenants = (l.lease_signers || []).filter(s => s.role === 'tenant').sort((a, b) => a.sign_order - b.sign_order);
  const landlord = (l.lease_signers || []).find(s => s.role === 'landlord');
  const addendums = l.lease_addendums_selected || [];

  const dueDay = l.lease_start ? new Date(l.lease_start + 'T00:00:00').getDate() : null;

  const html = `
    <div class="detail-head" style="border-radius:0;">
      <div>
        <span class="status-pill status-${st.key}" style="margin-bottom:8px;">${st.label}</span>
        <div class="detail-prop">${escapeHtml(l.property || '')}${l.unit ? ' | ' + escapeHtml(l.unit) : ''}</div>
      </div>
      <div class="detail-rent">
        <div>${fmtDate(l.lease_start)} — ${l.lease_type === 'mtm' ? 'M to M' : fmtDate(l.lease_end)}</div>
        <div><span class="amt">${fmtMoney(l.monthly_rent)}</span> <small>Monthly Rent${dueDay ? ` · Due on the ${ordinal(dueDay)} of every month` : ''}</small></div>
      </div>
      <div>
        <div class="detail-tenants-chip">👥 ${tenants.length} tenant${tenants.length === 1 ? '' : 's'}</div>
        <div class="hint" style="margin-top:4px;">${tenants.map(t => escapeHtml(t.name)).join(', ')}</div>
      </div>
    </div>

    <div style="padding: 20px 24px;">
      <div class="doc-card">
        <div class="doc-head">
          <h4>Lease Document</h4>
          <span class="hint">${tenants.length} tenant${tenants.length === 1 ? '' : 's'}</span>
          ${l.status === 'out_for_signature' || l.status === 'partially_signed'
            ? '<span class="pill" style="margin-left:auto;">Awaiting signatures</span>'
            : ''}
        </div>

        <div class="signer-row" style="color:var(--text3); font-size:11px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--border); padding-bottom:8px;">
          <div>Tenant</div>
          <div>Last Activity</div>
          <div>Status</div>
          <div>Link</div>
        </div>
        ${tenants.map(s => renderSignerRow(s)).join('')}
      </div>

      ${addendums.length ? `
        <div class="doc-card">
          <div class="doc-head"><h4>Addendums (${addendums.length})</h4></div>
          ${addendums.map(a => `<div style="padding:6px 0;">${escapeHtml(a.name_snapshot)} ${a.requires_signature ? '<span class="pill">Signature required</span>' : ''}</div>`).join('')}
        </div>
      ` : ''}

      ${landlord ? `
        <div class="doc-card">
          <div class="doc-head"><h4>Landlord Countersign</h4></div>
          <div>${escapeHtml(landlord.name)} · ${escapeHtml(landlord.email)} · <span class="pill status-${landlord.status === 'signed' ? 'fully_signed' : 'draft'}">${landlord.status}</span></div>
        </div>
      ` : ''}
    </div>
  `;
  document.getElementById('detailBody').innerHTML = html;

  // Footer buttons
  document.getElementById('revokeBtn').style.display      = (['out_for_signature', 'partially_signed'].includes(l.status)) ? 'inline-block' : 'none';
  document.getElementById('resendBtn').style.display      = (['out_for_signature', 'partially_signed'].includes(l.status)) ? 'inline-block' : 'none';
  document.getElementById('countersignBtn').style.display = (l.status === 'fully_signed') ? 'inline-block' : 'none';
}

function ordinal(n) { const s=['th','st','nd','rd'], v=n%100; return n + (s[(v-20)%10] || s[v] || s[0]); }

function renderSignerRow(s) {
  const steps = ['pending', 'viewed', 'signed'];
  const idx = steps.indexOf(s.status);
  const signUrl = `${location.origin.replace('propdesk', 'willowpa')}/sign.php?token=${s.signing_token}`;
  return `
    <div class="signer-row">
      <div>
        <div style="font-weight:500;">${escapeHtml(s.name)}</div>
        <div class="addr">${escapeHtml(s.email)}${s.phone ? ' · ' + escapeHtml(s.phone) : ''}</div>
      </div>
      <div class="hint">${s.signed_at ? fmtDate(s.signed_at.slice(0, 10)) : s.status === 'pending' ? 'Not opened' : '—'}</div>
      <div class="timeline">
        <span class="tl-dot ${idx >= 0 ? 'done' : ''}">1</span>
        <span class="tl-line ${idx >= 1 ? 'done' : ''}"></span>
        <span class="tl-dot ${idx >= 1 ? 'done' : ''}">2</span>
        <span class="tl-line ${idx >= 2 ? 'done' : ''}"></span>
        <span class="tl-dot ${idx >= 2 ? 'done' : ''}">${idx >= 2 ? '✓' : '3'}</span>
      </div>
      <div>
        <button class="btn btn-sm" onclick="copyLink('${signUrl}')">Copy link</button>
      </div>
    </div>
  `;
}

function copyLink(url) {
  navigator.clipboard?.writeText(url);
  toast('Signing link copied', 'success');
}

async function revokeLease() {
  if (!_currentDetailLease) return;
  if (!confirm('Revoke this lease? All outstanding signing links will be invalidated and the lease will be marked Void.')) return;
  try {
    const { error } = await sb.from('leases').update({ status: 'void' }).eq('id', _currentDetailLease.id);
    if (error) throw error;
    await sb.from('lease_events').insert({ lease_id: _currentDetailLease.id, event_type: 'voided', meta: {} });
    toast('Lease revoked', 'success');
    closeDetail();
    await loadLeases();
  } catch (e) {
    console.error(e);
    toast('Revoke failed: ' + e.message, 'error');
  }
}

async function resendLease() {
  if (!_currentDetailLease) return;
  const tenants = (_currentDetailLease.lease_signers || []).filter(s => s.role === 'tenant' && s.status !== 'signed');
  await queueSigningEmails(_currentDetailLease, tenants);
  await sb.from('lease_events').insert({
    lease_id: _currentDetailLease.id,
    event_type: 'resent',
    meta: { resent_to: tenants.map(t => t.email) },
  });
  toast(`Resent to ${tenants.length} tenant(s)`, 'success');
}

async function countersignLease() {
  // Phase 6: actual countersign pad + PDF finalize
  if (!_currentDetailLease) return;
  if (!confirm('Countersign this lease? The final PDF will be emailed to all tenants and attached to their file.')) return;
  try {
    const { error } = await sb.from('leases').update({
      status: 'countersigned',
      countersigned_at: new Date().toISOString(),
    }).eq('id', _currentDetailLease.id);
    if (error) throw error;

    // Mark landlord signer as signed
    const landlord = (_currentDetailLease.lease_signers || []).find(s => s.role === 'landlord');
    if (landlord) {
      await sb.from('lease_signers').update({ status: 'signed', signed_at: new Date().toISOString() }).eq('id', landlord.id);
    }
    await sb.from('lease_events').insert({ lease_id: _currentDetailLease.id, event_type: 'countersigned', meta: {} });

    toast('Lease countersigned and finalized', 'success');
    closeDetail();
    await loadLeases();
  } catch (e) {
    console.error(e);
    toast('Countersign failed: ' + e.message, 'error');
  }
}

// ══════════════════════════════════════════════════════
//  EVENT WIRING
// ══════════════════════════════════════════════════════

document.getElementById('filterInput').addEventListener('input', () => applyFilter());
document.querySelectorAll('.leases-table th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.getAttribute('data-sort');
    if (_sortKey === key) _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
    else { _sortKey = key; _sortDir = 'asc'; }
    applyFilter();
  });
});

// Expose for inline handlers
window.openWizardNew  = openWizardNew;
window.closeWizard    = closeWizard;
window.wizBack        = wizBack;
window.wizNext        = wizNext;
window.wizSubmit      = wizSubmit;
window.addTenantRow   = addTenantRow;
window.addExtraCharge = addExtraCharge;
window.onLeaseTypeChange = onLeaseTypeChange;
window.openDetail     = openDetail;
window.closeDetail    = closeDetail;
window.revokeLease    = revokeLease;
window.resendLease    = resendLease;
window.countersignLease = countersignLease;
window.copyLink       = copyLink;
window.exportCSV      = exportCSV;

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════

(async function init() {
  await loadTemplatesAndAddendums();
  await loadLeases();

  // If URL has ?new=1, auto-open the wizard with prefill
  const url = new URL(location.href);
  if (url.searchParams.get('new') === '1') {
    const prefill = {
      tenant_name:  url.searchParams.get('tenant') || '',
      email:        url.searchParams.get('email') || '',
      phone:        url.searchParams.get('phone') || '',
      property:     url.searchParams.get('property') || '',
      unit:         url.searchParams.get('unit') || '',
      monthly_rent: url.searchParams.get('rent') || '',
    };
    openWizardNew(prefill);
  }
})();
