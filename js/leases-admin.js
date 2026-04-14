// ══════════════════════════════════════════════════════
//  LEASE ADMIN — Addendum Library + Lease Template editor
//  v2026-04-14 1745 — WYSIWYG (Quill) + dynamic tenant signatures
// ══════════════════════════════════════════════════════

const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// State
let _addendums = [];
let _templates = [];
let _currentTemplate = null;
let _editingAddendumId = null;
let _editorMode = 'rich';     // 'rich' | 'html'
let _quill = null;

// Available template tokens
const TOKENS = [
  'LANDLORD_NAME',
  'LANDLORD_ENTITY',
  'TENANT_NAMES',
  'TENANT_SIGNATURE_BLOCKS',  // auto-expands to one sig block per tenant
  'PROPERTY',
  'UNIT',
  'CITY',
  'LEASE_START',
  'LEASE_END',
  'MONTHLY_RENT',
  'LAST_MONTH',
  'SECURITY_DEPOSIT',
  'TOTAL_DEPOSIT',
  'EXTRA_CHARGES_HTML',
  'UTILITIES_INCLUDED',
  'TODAY',
];

// Sample data for preview — uses 2 tenants to demo dynamic signature blocks
const SAMPLE = {
  LANDLORD_NAME:      'Kevin Smith',
  LANDLORD_ENTITY:    'ERA Holding LLC',
  TENANT_NAMES:       'Darlene Smith, Kevin Smith Jr.',
  TENANTS_SAMPLE:     ['Darlene Smith', 'Kevin Smith Jr.'],
  PROPERTY:           '46 Township Line Road',
  UNIT:               '222',
  CITY:               'Elkins Park, PA',
  LEASE_START:        '2026-05-01',
  LEASE_END:          '2027-04-30',
  MONTHLY_RENT:       '$2,400.00',
  LAST_MONTH:         '$2,400.00',
  SECURITY_DEPOSIT:   '$2,400.00',
  TOTAL_DEPOSIT:      '$4,800.00',
  EXTRA_CHARGES_HTML: '<ul><li>Pet fee: $50/month</li></ul>',
  UTILITIES_INCLUDED: 'Water, sewer, trash',
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
//  QUILL EDITOR
// ══════════════════════════════════════════════════════

function initQuill() {
  // Register fonts
  const Font = Quill.import('formats/font');
  Font.whitelist = ['serif', 'sans-serif', 'monospace', 'georgia', 'times', 'arial', 'helvetica', 'courier'];
  Quill.register(Font, true);

  // Register font sizes
  const Size = Quill.import('attributors/style/size');
  Size.whitelist = ['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px', '30px'];
  Quill.register(Size, true);

  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, false] }],
    [{ 'font': Font.whitelist }],
    [{ 'size': Size.whitelist }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['blockquote', 'code-block', 'link'],
    ['clean'],
  ];

  _quill = new Quill('#tplEditor', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: toolbarOptions,
      },
      clipboard: { matchVisual: false },
    },
    placeholder: 'Loading template...',
  });
}

function setMode(mode) {
  _editorMode = mode;
  const richBtn = document.getElementById('modeRich');
  const htmlBtn = document.getElementById('modeHtml');
  const editor  = document.getElementById('tplEditor');
  const textarea = document.getElementById('tplBody');
  if (mode === 'rich') {
    // Apply any HTML edits back into Quill
    if (textarea.style.display !== 'none') {
      _quill.clipboard.dangerouslyPasteHTML(textarea.value || '');
    }
    richBtn.classList.add('active');
    htmlBtn.classList.remove('active');
    editor.style.display   = 'block';
    textarea.style.display = 'none';
  } else {
    // Sync Quill HTML into textarea for raw editing
    textarea.value = _quill.root.innerHTML;
    htmlBtn.classList.add('active');
    richBtn.classList.remove('active');
    editor.style.display   = 'none';
    textarea.style.display = 'block';
  }
}

function getEditorHtml() {
  if (_editorMode === 'html') {
    return document.getElementById('tplBody').value;
  }
  return _quill.root.innerHTML;
}

function setEditorHtml(html) {
  _quill.clipboard.dangerouslyPasteHTML(html || '');
  document.getElementById('tplBody').value = html || '';
}

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
  if (_editorMode === 'rich' && _quill) {
    const range = _quill.getSelection(true);
    _quill.insertText(range ? range.index : _quill.getLength(), token, 'user');
    _quill.focus();
    toast(`Inserted ${token}`, 'success');
  } else {
    const ta = document.getElementById('tplBody');
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
  setEditorHtml(t.body_html || '');
  document.getElementById('tplDefault').checked = !!t.is_default;
  document.getElementById('tplActive').checked  = !!t.active;
}

function clearTemplateForm() {
  _currentTemplate = null;
  document.getElementById('tplName').value = '';
  setEditorHtml('');
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
  const body = getEditorHtml();
  if (!name) { toast('Name is required', 'error'); return; }
  if (!body || !body.trim() || body === '<p><br></p>') {
    toast('Body is required', 'error'); return;
  }

  const isDefault = document.getElementById('tplDefault').checked;
  const payload = {
    name,
    body_html: body,
    is_default: isDefault,
    active:     document.getElementById('tplActive').checked,
  };

  try {
    if (isDefault) {
      await sb.from('lease_templates')
        .update({ is_default: false })
        .neq('id', _currentTemplate?.id || '00000000-0000-0000-0000-000000000000');
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
  const body = getEditorHtml();
  if (!body || !body.trim()) { toast('Nothing to preview', 'error'); return; }
  const merged = mergeTokens(body, buildSampleData());
  document.getElementById('previewBody').innerHTML = merged;
  document.getElementById('previewModal').classList.add('active');
}

function closePreviewModal() {
  document.getElementById('previewModal').classList.remove('active');
}

// Build the full sample merge data — including expanded signature blocks
function buildSampleData() {
  const data = { ...SAMPLE };
  data.TENANT_SIGNATURE_BLOCKS = buildSignatureBlocks(SAMPLE.TENANTS_SAMPLE);
  return data;
}

// Dynamic signature blocks — one per tenant
function buildSignatureBlocks(tenantNames) {
  if (!Array.isArray(tenantNames) || !tenantNames.length) tenantNames = ['Tenant'];
  return tenantNames.map((name, i) => `
    <div style="margin-top:20px;padding:14px;border:1px solid #ddd;background:#fafafa;page-break-inside:avoid;border-radius:4px;">
      <p style="margin:0 0 6px;"><strong>Tenant ${i + 1}:</strong> ${escapeHtml(name)}</p>
      <p style="margin:4px 0;">
        Signature: <span style="border-bottom:1px solid #333;display:inline-block;width:260px;height:24px;"></span>
        &nbsp;&nbsp; Date: <span style="border-bottom:1px solid #333;display:inline-block;width:130px;height:24px;"></span>
      </p>
    </div>
  `).join('');
}

// {{TOKEN}} substitution — matches PHP strtr approach
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
  initQuill();
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
window.setMode            = setMode;
