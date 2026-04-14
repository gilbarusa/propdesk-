// ══════════════════════════════════════════════════════
//  LEASE ADMIN — Addendum Library + Lease Template editor
//  Phase 2 of the in-app e-signature system
// ══════════════════════════════════════════════════════

const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// State
let _addendums = [];
let _templates = [];
let _currentTemplate = null;  // object or null for "new"
let _editingAddendumId = null;

// Available template tokens — replaced when generating a lease PDF
const TOKENS = [
  'LANDLORD_NAME',
  'LANDLORD_ENTITY',
  'TENANT_NAMES',
  'PROPERTY',
  'UNIT',
  'LEASE_START',
  'LEASE_END',
  'MONTHLY_RENT',
  'LAST_MONTH',
  'SECURITY_DEPOSIT',
  'EXTRA_CHARGES_HTML',
  'UTILITIES_INCLUDED',
  'TODAY',
];

// ── Sample data used for the preview button ────────────
const SAMPLE = {
  LANDLORD_NAME:      'Willow Partnership',
  LANDLORD_ENTITY:    'Willow Partnership LLC',
  TENANT_NAMES:       'John Smith, Jane Smith',
  PROPERTY:           '46 Township Line Road',
  UNIT:               'Apt 4B',
  LEASE_START:        '2026-05-01',
  LEASE_END:          '2027-04-30',
  MONTHLY_RENT:       '$2,400.00',
  LAST_MONTH:         '$2,400.00',
  SECURITY_DEPOSIT:   '$2,400.00',
  EXTRA_CHARGES_HTML: '<li>Pet fee: $50/month</li>',
  UTILITIES_INCLUDED: 'Water, Sewer, Trash',
  TODAY:              new Date().toISOString().slice(0, 10),
};

// ══════════════════════════════════════════════════════
//  TAB SWITCHER
// ══════════════════════════════════════════════════════

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('page-' + t.dataset.page).classList.add('active');
  });
});

// ══════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════

function toast(msg, kind = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (kind || '');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ══════════════════════════════════════════════════════
//  ADDENDUM LIBRARY
// ══════════════════════════════════════════════════════

async function loadAddendums() {
  try {
    const { data, error } = await sb
      .from('lease_addendum_library')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) throw error;
    _addendums = data || [];
    renderAddendums();
  } catch (e) {
    console.error(e);
    document.getElementById('addendumList').innerHTML =
      `<div class="empty">Error loading addendums: ${e.message}</div>`;
  }
}

function renderAddendums() {
  const el = document.getElementById('addendumList');
  if (!_addendums.length) {
    el.innerHTML = `<div class="empty">No addendums yet. Click <strong>+ New addendum</strong> to add one.</div>`;
    return;
  }
  el.innerHTML = _addendums.map(a => `
    <div class="addendum-row" onclick="openAddendumModal('${a.id}')" style="cursor:pointer;">
      <div style="flex:1;">
        <div class="name">${escapeHtml(a.name)}</div>
        <div class="meta">
          ${a.requires_signature
            ? '<span class="pill pill-sig">Signature required</span>'
            : '<span class="pill pill-nosig">No signature</span>'}
          ${!a.active ? '<span class="pill pill-inactive">Inactive</span>' : ''}
          &nbsp;· Sort: ${a.sort_order ?? 0}
        </div>
      </div>
      <button class="btn btn-sm" onclick="event.stopPropagation();openAddendumModal('${a.id}')">Edit</button>
    </div>
  `).join('');
}

function openAddendumModal(id) {
  _editingAddendumId = id || null;
  const a = id ? _addendums.find(x => x.id === id) : null;
  document.getElementById('addendumModalTitle').textContent = a ? 'Edit addendum' : 'New addendum';
  document.getElementById('adName').value        = a?.name || '';
  document.getElementById('adBody').value        = a?.body_html || '';
  document.getElementById('adSort').value        = a?.sort_order ?? 0;
  document.getElementById('adRequiresSig').checked = !!a?.requires_signature;
  document.getElementById('adActive').checked    = a ? !!a.active : true;
  document.getElementById('adDeleteBtn').style.display = a ? 'inline-block' : 'none';
  document.getElementById('addendumModal').classList.add('active');
}

function closeAddendumModal() {
  document.getElementById('addendumModal').classList.remove('active');
  _editingAddendumId = null;
}

async function saveAddendum() {
  const name = document.getElementById('adName').value.trim();
  if (!name) { toast('Name is required', 'error'); return; }

  const body = {
    name,
    body_html:          document.getElementById('adBody').value,
    sort_order:         parseInt(document.getElementById('adSort').value, 10) || 0,
    requires_signature: document.getElementById('adRequiresSig').checked,
    active:             document.getElementById('adActive').checked,
  };

  try {
    if (_editingAddendumId) {
      const { error } = await sb
        .from('lease_addendum_library')
        .update(body)
        .eq('id', _editingAddendumId);
      if (error) throw error;
      toast('Addendum updated', 'success');
    } else {
      const { error } = await sb.from('lease_addendum_library').insert(body);
      if (error) throw error;
      toast('Addendum created', 'success');
    }
    closeAddendumModal();
    await loadAddendums();
  } catch (e) {
    console.error(e);
    toast('Save failed: ' + e.message, 'error');
  }
}

async function deleteAddendum() {
  if (!_editingAddendumId) return;
  if (!confirm('Delete this addendum? This cannot be undone.')) return;
  try {
    const { error } = await sb
      .from('lease_addendum_library')
      .delete()
      .eq('id', _editingAddendumId);
    if (error) throw error;
    toast('Addendum deleted', 'success');
    closeAddendumModal();
    await loadAddendums();
  } catch (e) {
    console.error(e);
    toast('Delete failed: ' + e.message, 'error');
  }
}

// ══════════════════════════════════════════════════════
//  TEMPLATE EDITOR
// ══════════════════════════════════════════════════════

function renderTokenChips() {
  const el = document.getElementById('tokenChips');
  el.innerHTML = TOKENS.map(t => `
    <span class="token-chip" onclick="copyToken('${t}')">{{${t}}}</span>
  `).join('');
}

function copyToken(name) {
  const token = `{{${name}}}`;
  const ta = document.getElementById('tplBody');
  // Try to insert at cursor; fall back to clipboard
  if (ta && document.activeElement === ta) {
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + token + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + token.length;
    ta.focus();
    toast(`Inserted ${token}`, 'success');
  } else {
    navigator.clipboard?.writeText(token);
    toast(`Copied ${token}`, 'success');
  }
}

async function loadTemplates() {
  try {
    const { data, error } = await sb
      .from('lease_templates')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });
    if (error) throw error;
    _templates = data || [];
    const sel = document.getElementById('templateSelect');
    sel.innerHTML = _templates.map(t =>
      `<option value="${t.id}">${escapeHtml(t.name)}${t.is_default ? ' (default)' : ''}${!t.active ? ' — inactive' : ''}</option>`
    ).join('');
    if (_templates.length) {
      sel.value = _templates[0].id;
      loadTemplate(_templates[0].id);
    } else {
      _currentTemplate = null;
      clearTemplateForm();
    }
  } catch (e) {
    console.error(e);
    toast('Load templates failed: ' + e.message, 'error');
  }
}

function loadTemplate(id) {
  const t = _templates.find(x => x.id === id);
  if (!t) { clearTemplateForm(); return; }
  _currentTemplate = t;
  document.getElementById('tplName').value      = t.name || '';
  document.getElementById('tplBody').value      = t.body_html || '';
  document.getElementById('tplDefault').checked = !!t.is_default;
  document.getElementById('tplActive').checked  = !!t.active;
}

function clearTemplateForm() {
  _currentTemplate = null;
  document.getElementById('tplName').value = '';
  document.getElementById('tplBody').value = '';
  document.getElementById('tplDefault').checked = false;
  document.getElementById('tplActive').checked = true;
  document.getElementById('templateSelect').value = '';
}

function newTemplate() {
  clearTemplateForm();
  document.getElementById('tplName').focus();
  toast('Creating new template — fill in name and body, then Save.');
}

async function saveTemplate() {
  const name = document.getElementById('tplName').value.trim();
  const body = document.getElementById('tplBody').value;
  if (!name) { toast('Name is required', 'error'); return; }
  if (!body.trim()) { toast('Body is required', 'error'); return; }

  const isDefault = document.getElementById('tplDefault').checked;
  const payload = {
    name,
    body_html: body,
    is_default: isDefault,
    active:     document.getElementById('tplActive').checked,
  };

  try {
    // If setting this as default, first unset any other default
    if (isDefault) {
      await sb.from('lease_templates').update({ is_default: false }).neq('id', _currentTemplate?.id || '00000000-0000-0000-0000-000000000000');
    }

    if (_currentTemplate?.id) {
      const { error } = await sb
        .from('lease_templates')
        .update(payload)
        .eq('id', _currentTemplate.id);
      if (error) throw error;
      toast('Template updated', 'success');
    } else {
      const { data, error } = await sb
        .from('lease_templates')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      _currentTemplate = data;
      toast('Template created', 'success');
    }
    await loadTemplates();
    // Try to reselect the saved one
    if (_currentTemplate?.id) {
      document.getElementById('templateSelect').value = _currentTemplate.id;
    }
  } catch (e) {
    console.error(e);
    toast('Save failed: ' + e.message, 'error');
  }
}

async function deleteTemplate() {
  if (!_currentTemplate?.id) { toast('Nothing to delete'); return; }
  if (_currentTemplate.is_default) {
    if (!confirm('This is the default template. Deleting it means new leases will have no default template. Continue?')) return;
  } else {
    if (!confirm('Delete this template? This cannot be undone.')) return;
  }
  try {
    const { error } = await sb
      .from('lease_templates')
      .delete()
      .eq('id', _currentTemplate.id);
    if (error) throw error;
    toast('Template deleted', 'success');
    _currentTemplate = null;
    await loadTemplates();
  } catch (e) {
    console.error(e);
    toast('Delete failed: ' + e.message, 'error');
  }
}

// ── Preview ────────────────────────────────────────────
function previewTemplate() {
  const body = document.getElementById('tplBody').value;
  if (!body) { toast('Nothing to preview', 'error'); return; }
  const merged = mergeTokens(body, SAMPLE);
  document.getElementById('previewBody').innerHTML = merged;
  document.getElementById('previewModal').classList.add('active');
}

function closePreviewModal() {
  document.getElementById('previewModal').classList.remove('active');
}

// Simple {{TOKEN}} substitution — matches the PHP side's strtr approach
function mergeTokens(src, data) {
  return src.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(data, key) ? data[key] : m
  );
}

// ══════════════════════════════════════════════════════
//  UTIL
// ══════════════════════════════════════════════════════

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════

(async function init() {
  renderTokenChips();
  await loadAddendums();
  await loadTemplates();
})();

// Expose for inline handlers
window.openAddendumModal  = openAddendumModal;
window.closeAddendumModal = closeAddendumModal;
window.saveAddendum       = saveAddendum;
window.deleteAddendum     = deleteAddendum;
window.newTemplate        = newTemplate;
window.loadTemplate       = loadTemplate;
window.saveTemplate       = saveTemplate;
window.deleteTemplate     = deleteTemplate;
window.previewTemplate    = previewTemplate;
window.closePreviewModal  = closePreviewModal;
window.copyToken          = copyToken;
