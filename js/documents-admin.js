// ══════════════════════════════════════════════════════
//  DOCUMENTS ADMIN — Library · Packages · Assignments
//  Talks directly to Supabase PostgREST via window.sb.
//  Depends on: document_templates, document_template_targets,
//              document_packages, document_package_items,
//              lease_document_assignments, leases, tenants_lt.
//  v20260416
// ══════════════════════════════════════════════════════
(function(){
  'use strict';
  const VERSION = '20260416-0100';
  try { console.log('%c[documents-admin] v'+VERSION, 'background:#3651b5;color:#fff;padding:2px 8px;border-radius:3px'); } catch(e){}

  const UPLOAD_BUCKET = 'documents'; // create this bucket in Supabase (or change here)

  // ── state ─────────────────────────────────────────────
  let _templates = [];
  let _packages = [];
  let _packageItems = {};  // packageId -> [items]
  let _assignments = [];
  let _leases = [];
  let _ctx = {};           // { lease_id, tenant_email, property, unit }

  // ── helpers ───────────────────────────────────────────
  function getSb(){ return window.sb; }
  function qs(id){ return document.getElementById(id); }
  function esc(s){ if(s==null) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
  function slugify(s){ return (s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80); }
  function toast(msg, kind){
    const el = qs('docsToast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show ' + (kind||'');
    setTimeout(()=>el.classList.remove('show'), 2800);
  }
  function parseQuery(){
    const o = {};
    (location.search||'').replace(/^\?/,'').split('&').forEach(p=>{
      if(!p) return;
      const [k,v] = p.split('=');
      o[decodeURIComponent(k||'')] = decodeURIComponent(v||'');
    });
    return o;
  }
  function showView(name){
    ['library','packages','assignments'].forEach(v=>{
      qs('view-'+v)?.classList.toggle('active', v===name);
    });
    document.querySelectorAll('.tab').forEach(t=>{
      t.classList.toggle('active', t.dataset.view===name);
    });
  }

  // ── boot ──────────────────────────────────────────────
  async function init(){
    const q = parseQuery();
    if (q.lease_id || q.tenant_email) {
      _ctx = {
        lease_id: q.lease_id || '',
        tenant_email: q.tenant_email || '',
        property: q.property || '',
        unit: q.unit || ''
      };
      showView('assignments');
      renderCtxBanner();
    }
    document.querySelectorAll('.tab').forEach(t=>{
      t.addEventListener('click', ()=> showView(t.dataset.view));
    });
    qs('libFilter')?.addEventListener('input', renderLibrary);
    qs('pkgFilter')?.addEventListener('input', renderPackages);
    qs('asgFilter')?.addEventListener('input', renderAssignments);

    await Promise.all([loadTemplates(), loadPackages(), loadLeases()]);
    await loadAssignments();
    renderLibrary();
    renderPackages();
    renderAssignments();
    populateTemplateSelects();
    populateLeaseSelects();
  }

  function renderCtxBanner(){
    const b = qs('asgCtx');
    if (!b) return;
    const bits = [];
    if (_ctx.lease_id) bits.push('lease <b>'+esc(_ctx.lease_id.slice(0,8))+'…</b>');
    if (_ctx.tenant_email) bits.push('tenant <b>'+esc(_ctx.tenant_email)+'</b>');
    if (_ctx.property) bits.push('property <b>'+esc(_ctx.property)+'</b>');
    if (_ctx.unit) bits.push('unit <b>'+esc(_ctx.unit)+'</b>');
    if (!bits.length) { b.style.display='none'; return; }
    b.style.display='flex';
    b.innerHTML = 'Filtering to: '+bits.join(' · ')+' <button class="ctx-clear" onclick="DocsAdmin.clearCtx()">clear filter</button>';
  }

  function clearCtx(){
    _ctx = {};
    history.replaceState(null,'',location.pathname);
    renderCtxBanner();
    renderAssignments();
  }

  // ── data: templates ───────────────────────────────────
  async function loadTemplates(){
    const sb = getSb();
    const { data, error } = await sb
      .from('document_templates')
      .select('*, document_template_targets(*)')
      .order('created_at', { ascending:false });
    if (error) { console.error('loadTemplates', error); toast('Error loading templates','error'); return; }
    _templates = data||[];
  }

  function renderLibrary(){
    const body = qs('libBody');
    if (!body) return;
    const q = (qs('libFilter')?.value||'').toLowerCase();
    const rows = _templates.filter(t=>{
      if (!q) return true;
      return [t.title,t.slug,t.document_type,t.description].join(' ').toLowerCase().includes(q);
    });
    if (!rows.length){
      body.innerHTML = '<tr><td colspan="7" class="empty">No templates yet. Click <b>+ New template</b> to add one.</td></tr>';
      return;
    }
    body.innerHTML = rows.map(t=>{
      const tgts = t.document_template_targets||[];
      const scope = tgts.length ? tgts.map(g=>{
        const parts = [g.property,g.building,g.unit_type,g.user_type,g.lease_type].filter(Boolean);
        return parts.length ? parts.join('·') : 'global';
      }).join(' / ') : '<span class="hint">global</span>';
      const defs = [
        t.requires_signature_default ? '<span class="pill pill-amber">Sig</span>' : '',
        t.include_in_welcome_default ? '<span class="pill pill-accent">Welcome</span>' : ''
      ].filter(Boolean).join(' ');
      return `<tr>
        <td><b>${esc(t.title)}</b><div class="hint">${esc(t.slug||'')}${t.version_label?' · '+esc(t.version_label):''}</div></td>
        <td><span class="pill">${esc(t.document_type||'')}</span></td>
        <td>${esc(t.source_type||'')}</td>
        <td>${defs||'<span class="hint">—</span>'}</td>
        <td>${scope}</td>
        <td>${t.active? '<span class="pill pill-green">Active</span>':'<span class="pill pill-gray">Inactive</span>'}</td>
        <td class="row-actions">
          <button class="btn btn-sm" onclick="DocsAdmin.openTemplate('${t.id}')">Edit</button>
        </td>
      </tr>`;
    }).join('');
  }

  function openTemplate(id){
    const t = id ? _templates.find(x=>x.id===id) : null;
    qs('tplId').value = t?.id || '';
    qs('tplTitle').value = t?.title || '';
    qs('tplSlug').value = t?.slug || '';
    qs('tplDescription').value = t?.description || '';
    qs('tplDocType').value = t?.document_type || 'rules';
    qs('tplSourceType').value = t?.source_type || 'upload';
    qs('tplHtml').value = t?.html_body || '';
    qs('tplExternalUrl').value = t?.external_url || '';
    qs('tplVersion').value = t?.version_label || '';
    qs('tplEffectiveDate').value = t?.effective_date || '';
    qs('tplRequiresSig').checked = !!(t?.requires_signature_default);
    qs('tplIncludeWelcome').checked = t ? !!t.include_in_welcome_default : true;
    qs('tplActive').checked = t ? !!t.active : true;

    // Scope from first target (simple single-target editor; multi-target left for later)
    const tgt = (t?.document_template_targets||[])[0] || {};
    qs('tplScopeProperty').value = tgt.property || '';
    qs('tplScopeBuilding').value = tgt.building || '';
    qs('tplScopeUserType').value = tgt.user_type || '';
    qs('tplScopeLeaseType').value = tgt.lease_type || '';

    qs('tplFile').value = '';
    qs('tplFileMeta').textContent = t?.file_name ? 'Current file: '+t.file_name : '';
    qs('tplModalTitle').textContent = t ? 'Edit template' : 'New template';
    qs('tplDeleteBtn').style.display = t ? 'inline-block' : 'none';
    onSourceTypeChange();
    qs('tplModal').classList.add('active');
  }
  function closeTemplate(){ qs('tplModal').classList.remove('active'); }
  function onSourceTypeChange(){
    const v = qs('tplSourceType').value;
    qs('tplSrcUpload').style.display   = (v==='upload' || v==='pdf_generated') ? '' : 'none';
    qs('tplSrcHtml').style.display     = (v==='html' || v==='pdf_generated') ? '' : 'none';
    qs('tplSrcExternal').style.display = (v==='external_url') ? '' : 'none';
  }

  async function saveTemplate(){
    const sb = getSb();
    const id = qs('tplId').value || null;
    const title = qs('tplTitle').value.trim();
    if (!title) return toast('Title required','error');
    const slug = qs('tplSlug').value.trim() || slugify(title);
    const src = qs('tplSourceType').value;

    // Optional file upload
    let fileFields = {};
    const fileInput = qs('tplFile');
    if (fileInput.files && fileInput.files[0] && (src==='upload' || src==='pdf_generated')) {
      try {
        const up = await uploadFile(fileInput.files[0], 'templates');
        fileFields = {
          file_bucket: up.bucket,
          file_path: up.path,
          file_url: up.publicUrl || null,
          file_name: fileInput.files[0].name,
          file_size_bytes: fileInput.files[0].size,
          mime_type: fileInput.files[0].type || null
        };
      } catch (e) {
        console.error('upload failed', e);
        return toast('Upload failed: '+e.message,'error');
      }
    }

    const payload = Object.assign({
      title,
      slug,
      description: qs('tplDescription').value.trim() || null,
      document_type: qs('tplDocType').value,
      source_type: src,
      html_body: (src==='html'||src==='pdf_generated') ? qs('tplHtml').value : null,
      external_url: (src==='external_url') ? qs('tplExternalUrl').value.trim() : null,
      version_label: qs('tplVersion').value.trim() || null,
      effective_date: qs('tplEffectiveDate').value || null,
      requires_signature_default: qs('tplRequiresSig').checked,
      include_in_welcome_default: qs('tplIncludeWelcome').checked,
      active: qs('tplActive').checked,
      updated_by: 'admin'
    }, fileFields);

    let tpl;
    if (id) {
      const { data, error } = await sb.from('document_templates').update(payload).eq('id', id).select().single();
      if (error) { console.error(error); return toast('Save failed: '+error.message,'error'); }
      tpl = data;
    } else {
      payload.created_by = 'admin';
      const { data, error } = await sb.from('document_templates').insert(payload).select().single();
      if (error) { console.error(error); return toast('Save failed: '+error.message,'error'); }
      tpl = data;
    }

    // Scope target (single-row simplified)
    const tgt = {
      document_template_id: tpl.id,
      property: qs('tplScopeProperty').value.trim() || null,
      building: qs('tplScopeBuilding').value.trim() || null,
      user_type: qs('tplScopeUserType').value || null,
      lease_type: qs('tplScopeLeaseType').value || null,
      include_by_default: true
    };
    // Wipe existing targets, insert one if any field set
    await sb.from('document_template_targets').delete().eq('document_template_id', tpl.id);
    if (tgt.property || tgt.building || tgt.user_type || tgt.lease_type) {
      await sb.from('document_template_targets').insert(tgt);
    }

    toast('Template saved','success');
    closeTemplate();
    await loadTemplates();
    renderLibrary();
    populateTemplateSelects();
  }

  async function deleteTemplate(){
    const id = qs('tplId').value;
    if (!id) return;
    if (!confirm('Delete this template? Existing assignments created from it will remain but lose the link.')) return;
    const { error } = await getSb().from('document_templates').delete().eq('id', id);
    if (error) { console.error(error); return toast('Delete failed: '+error.message,'error'); }
    toast('Template deleted','success');
    closeTemplate();
    await loadTemplates();
    renderLibrary();
    populateTemplateSelects();
  }

  // ── data: packages ────────────────────────────────────
  async function loadPackages(){
    const sb = getSb();
    const { data: pkgs, error } = await sb
      .from('document_packages').select('*').order('created_at',{ascending:false});
    if (error) { console.error('loadPackages', error); return; }
    _packages = pkgs || [];
    if (!_packages.length) { _packageItems = {}; return; }
    const ids = _packages.map(p=>p.id);
    const { data: items, error: err2 } = await sb
      .from('document_package_items')
      .select('*, document_templates(id,title,document_type,requires_signature_default,include_in_welcome_default)')
      .in('document_package_id', ids)
      .order('sort_order',{ascending:true});
    if (err2) { console.error('loadPackageItems', err2); return; }
    _packageItems = {};
    (items||[]).forEach(it=>{
      (_packageItems[it.document_package_id] = _packageItems[it.document_package_id]||[]).push(it);
    });
  }

  function renderPackages(){
    const body = qs('pkgBody');
    if (!body) return;
    const q = (qs('pkgFilter')?.value||'').toLowerCase();
    const rows = _packages.filter(p=>{
      if (!q) return true;
      return [p.name,p.package_type,p.description,p.applies_to_property].join(' ').toLowerCase().includes(q);
    });
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="6" class="empty">No packages yet. Click <b>+ New package</b> to bundle templates.</td></tr>';
      return;
    }
    body.innerHTML = rows.map(p=>{
      const items = _packageItems[p.id]||[];
      const scope = [p.applies_to_property,p.applies_to_building,p.applies_to_lease_type,p.applies_to_user_type].filter(Boolean).join(' · ') || '<span class="hint">any</span>';
      return `<tr>
        <td><b>${esc(p.name)}</b><div class="hint">${esc(p.description||'')}</div></td>
        <td><span class="pill">${esc(p.package_type)}</span></td>
        <td>${items.length}</td>
        <td>${scope}</td>
        <td>${p.active? '<span class="pill pill-green">Active</span>':'<span class="pill pill-gray">Inactive</span>'}</td>
        <td class="row-actions">
          <button class="btn btn-sm" onclick="DocsAdmin.openPackage('${p.id}')">Edit</button>
        </td>
      </tr>`;
    }).join('');
  }

  function openPackage(id){
    const p = id ? _packages.find(x=>x.id===id) : null;
    qs('pkgId').value = p?.id || '';
    qs('pkgName').value = p?.name || '';
    qs('pkgType').value = p?.package_type || 'welcome';
    qs('pkgDescription').value = p?.description || '';
    qs('pkgProperty').value = p?.applies_to_property || '';
    qs('pkgLeaseType').value = p?.applies_to_lease_type || '';
    qs('pkgActive').checked = p ? !!p.active : true;
    qs('pkgModalTitle').textContent = p ? 'Edit package' : 'New package';
    qs('pkgDeleteBtn').style.display = p ? 'inline-block' : 'none';
    renderPackageItemsBox(p?.id);
    populateTemplateSelects();
    qs('pkgModal').classList.add('active');
  }
  function closePackage(){ qs('pkgModal').classList.remove('active'); }

  function renderPackageItemsBox(pkgId){
    const box = qs('pkgItemsBox');
    const items = (pkgId ? _packageItems[pkgId] : []) || [];
    if (!items.length) { box.innerHTML = '<div class="empty">No items yet</div>'; return; }
    box.innerHTML = items.map(it=>{
      const t = it.document_templates||{};
      const sig = it.requires_signature==null ? 'default' : (it.requires_signature?'yes':'no');
      const wel = it.include_in_welcome==null ? 'default' : (it.include_in_welcome?'yes':'no');
      return `<div class="pkg-item">
        <div>
          <div class="name">${esc(t.title||'(deleted template)')}</div>
          <div class="meta">${esc(t.document_type||'')}</div>
        </div>
        <div><span class="pill">sig: ${sig}</span></div>
        <div><span class="pill">wel: ${wel}</span></div>
        <div><button class="btn btn-sm btn-danger" onclick="DocsAdmin.removePackageItem('${it.id}')">×</button></div>
      </div>`;
    }).join('');
  }

  async function addPackageItem(){
    const pkgId = qs('pkgId').value;
    if (!pkgId) { toast('Save the package first, then add items','error'); return; }
    const tplId = qs('pkgItemTpl').value;
    if (!tplId) { toast('Choose a template','error'); return; }
    const sig = qs('pkgItemSig').value;
    const wel = qs('pkgItemWelcome').value;
    const existing = _packageItems[pkgId]||[];
    const payload = {
      document_package_id: pkgId,
      document_template_id: tplId,
      sort_order: existing.length,
      requires_signature: sig==='' ? null : (sig==='1'),
      include_in_welcome: wel==='' ? null : (wel==='1')
    };
    const { error } = await getSb().from('document_package_items').insert(payload);
    if (error) { console.error(error); return toast('Add failed: '+error.message,'error'); }
    await loadPackages();
    renderPackageItemsBox(pkgId);
    renderPackages();
  }

  async function removePackageItem(itemId){
    if (!confirm('Remove this item from the package?')) return;
    const { error } = await getSb().from('document_package_items').delete().eq('id', itemId);
    if (error) { console.error(error); return toast('Remove failed: '+error.message,'error'); }
    await loadPackages();
    const pkgId = qs('pkgId').value;
    renderPackageItemsBox(pkgId);
    renderPackages();
  }

  async function savePackage(){
    const sb = getSb();
    const id = qs('pkgId').value || null;
    const name = qs('pkgName').value.trim();
    if (!name) return toast('Name required','error');
    const payload = {
      name,
      package_type: qs('pkgType').value,
      description: qs('pkgDescription').value.trim() || null,
      applies_to_property: qs('pkgProperty').value.trim() || null,
      applies_to_lease_type: qs('pkgLeaseType').value || null,
      active: qs('pkgActive').checked
    };
    let pkg;
    if (id) {
      const { data, error } = await sb.from('document_packages').update(payload).eq('id', id).select().single();
      if (error) { console.error(error); return toast('Save failed: '+error.message,'error'); }
      pkg = data;
    } else {
      const { data, error } = await sb.from('document_packages').insert(payload).select().single();
      if (error) { console.error(error); return toast('Save failed: '+error.message,'error'); }
      pkg = data;
      qs('pkgId').value = pkg.id;
      qs('pkgModalTitle').textContent = 'Edit package';
      qs('pkgDeleteBtn').style.display = 'inline-block';
    }
    toast('Package saved','success');
    await loadPackages();
    renderPackages();
    renderPackageItemsBox(pkg.id);
  }

  async function deletePackage(){
    const id = qs('pkgId').value;
    if (!id) return;
    if (!confirm('Delete this package? Items belonging to it will be removed but existing assignments stay.')) return;
    const { error } = await getSb().from('document_packages').delete().eq('id', id);
    if (error) { console.error(error); return toast('Delete failed: '+error.message,'error'); }
    toast('Package deleted','success');
    closePackage();
    await loadPackages();
    renderPackages();
  }

  // ── data: assignments ─────────────────────────────────
  async function loadAssignments(){
    const sb = getSb();
    let q = sb.from('lease_document_assignments')
      .select('*, document_templates(id,title,document_type)')
      .order('created_at',{ascending:false})
      .limit(500);
    if (_ctx.lease_id) q = q.eq('lease_id', _ctx.lease_id);
    else if (_ctx.tenant_email) q = q.ilike('tenant_email', _ctx.tenant_email);
    const { data, error } = await q;
    if (error) { console.error('loadAssignments', error); toast('Error loading assignments','error'); return; }
    _assignments = data||[];
  }

  async function loadLeases(){
    const sb = getSb();
    const { data, error } = await sb
      .from('leases')
      .select('id, property, unit, lease_start, lease_end, lease_type, status, lease_signers(id,name,email,role)')
      .order('lease_start',{ascending:false})
      .limit(500);
    if (error) { console.error('loadLeases', error); return; }
    _leases = data||[];
  }

  function populateTemplateSelects(){
    const opts = ['<option value="">— choose a template —</option>']
      .concat(_templates.filter(t=>t.active!==false).map(t=>`<option value="${t.id}">${esc(t.title)} · ${esc(t.document_type||'')}</option>`));
    ['pkgItemTpl','asgTplId'].forEach(id=>{
      const el = qs(id); if (!el) return;
      const current = el.value;
      el.innerHTML = opts.join('');
      el.value = current;
    });
  }

  function populateLeaseSelects(){
    const opts = ['<option value="">— none —</option>']
      .concat(_leases.map(l=>{
        const tenants = (l.lease_signers||[]).filter(s=>s.role==='tenant').map(s=>s.name).filter(Boolean).join(', ');
        const lbl = [l.property, l.unit, tenants || '(no tenant)', l.lease_start].filter(Boolean).join(' · ');
        return `<option value="${l.id}">${esc(lbl)}</option>`;
      }));
    ['asgLeaseId','applyLease'].forEach(id=>{
      const el = qs(id); if (!el) return;
      const current = el.value;
      el.innerHTML = opts.join('');
      el.value = current;
    });
    const applyPkg = qs('applyPkg');
    if (applyPkg) {
      applyPkg.innerHTML = '<option value="">— choose package —</option>' +
        _packages.filter(p=>p.active!==false).map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.package_type)}</option>`).join('');
    }
  }

  function renderAssignments(){
    const body = qs('asgBody');
    if (!body) return;
    const q = (qs('asgFilter')?.value||'').toLowerCase();
    const rows = _assignments.filter(a=>{
      if (!q) return true;
      return [a.title,a.tenant_name,a.tenant_email,a.property,a.unit,a.document_type,a.status].join(' ').toLowerCase().includes(q);
    });
    if (!rows.length){
      body.innerHTML = '<tr><td colspan="7" class="empty">No assignments yet. Use <b>Apply package</b> or <b>+ New assignment</b>.</td></tr>';
      return;
    }
    body.innerHTML = rows.map(a=>{
      const flags = [
        a.requires_signature ? '<span class="pill pill-amber">Sig</span>' : '',
        a.include_in_welcome ? '<span class="pill pill-accent">Welcome</span>' : '',
        a.is_required ? '<span class="pill pill-gray">Required</span>' : ''
      ].filter(Boolean).join(' ');
      return `<tr>
        <td>
          <div><b>${esc(a.tenant_name||a.tenant_email||'(unassigned)')}</b></div>
          <div class="hint">${esc(a.property||'')} ${a.unit?'· '+esc(a.unit):''}</div>
          <div class="hint">${a.lease_id ? 'lease '+esc(a.lease_id.slice(0,8))+'…' : 'no lease'}</div>
        </td>
        <td><b>${esc(a.title)}</b><div class="hint">${esc((a.document_templates&&a.document_templates.title)||'one-off')}</div></td>
        <td><span class="pill">${esc(a.document_type||'')}</span></td>
        <td>${flags||'<span class="hint">—</span>'}</td>
        <td><span class="pill">${esc(a.status||'')}</span></td>
        <td>${a.shared_with_tenant ? '<span class="pill pill-green">Yes</span>' : '<span class="pill pill-gray">No</span>'}</td>
        <td class="row-actions">
          <button class="btn btn-sm" onclick="DocsAdmin.openAssignment('${a.id}')">Edit</button>
        </td>
      </tr>`;
    }).join('');
  }

  function openAssignment(id){
    const a = id ? _assignments.find(x=>x.id===id) : null;
    qs('asgId').value = a?.id || '';
    qs('asgLeaseId').value = a?.lease_id || _ctx.lease_id || '';
    qs('asgTplId').value = a?.document_template_id || '';
    qs('asgTenantEmail').value = a?.tenant_email || _ctx.tenant_email || '';
    qs('asgTenantName').value = a?.tenant_name || '';
    qs('asgProperty').value = a?.property || _ctx.property || '';
    qs('asgUnit').value = a?.unit || _ctx.unit || '';
    qs('asgTitle').value = a?.title || '';
    qs('asgDocType').value = a?.document_type || 'rules';
    qs('asgSourceType').value = a?.source_type || 'upload';
    qs('asgExternalUrl').value = a?.external_url || '';
    qs('asgRequiresSig').checked = !!(a?.requires_signature);
    qs('asgIncludeWelcome').checked = a ? !!a.include_in_welcome : true;
    qs('asgShared').checked = a ? !!a.shared_with_tenant : true;
    qs('asgRequired').checked = !!(a?.is_required);
    qs('asgStatus').value = a?.status || 'pending';
    qs('asgFile').value = '';
    qs('asgSaveAsTemplate').checked = false;
    qs('asgDeleteBtn').style.display = a ? 'inline-block' : 'none';
    qs('asgModalTitle').textContent = a ? 'Edit assignment' : 'New assignment';
    onAsgSourceChange();
    qs('asgModal').classList.add('active');
  }
  function closeAssignment(){ qs('asgModal').classList.remove('active'); }
  function onAsgSourceChange(){
    const v = qs('asgSourceType').value;
    qs('asgSrcUpload').style.display = (v==='upload' || v==='pdf_generated') ? '' : 'none';
    qs('asgSrcExternal').style.display = (v==='external_url') ? '' : 'none';
  }
  function onAsgTemplateChange(){
    const id = qs('asgTplId').value;
    if (!id) return;
    const t = _templates.find(x=>x.id===id);
    if (!t) return;
    if (!qs('asgTitle').value) qs('asgTitle').value = t.title;
    qs('asgDocType').value = t.document_type || qs('asgDocType').value;
    qs('asgSourceType').value = t.source_type || 'upload';
    qs('asgRequiresSig').checked = !!t.requires_signature_default;
    qs('asgIncludeWelcome').checked = !!t.include_in_welcome_default;
    onAsgSourceChange();
  }

  async function saveAssignment(){
    const sb = getSb();
    const id = qs('asgId').value || null;
    const title = qs('asgTitle').value.trim();
    if (!title) return toast('Title required','error');
    const src = qs('asgSourceType').value;

    let tplId = qs('asgTplId').value || null;
    let fileFields = {};

    const fileInput = qs('asgFile');
    if (fileInput.files && fileInput.files[0] && (src==='upload' || src==='pdf_generated')) {
      try {
        const up = await uploadFile(fileInput.files[0], 'assignments');
        fileFields = {
          file_bucket: up.bucket,
          file_path: up.path,
          file_url: up.publicUrl || (up.bucket + '/' + up.path),
          file_name: fileInput.files[0].name,
          file_size_bytes: fileInput.files[0].size,
          mime_type: fileInput.files[0].type || null
        };

        // Optionally save to Library
        if (qs('asgSaveAsTemplate').checked) {
          const tplPayload = {
            title,
            slug: slugify(title),
            document_type: qs('asgDocType').value,
            source_type: src,
            file_bucket: up.bucket,
            file_path: up.path,
            file_url: up.publicUrl || null,
            file_name: fileInput.files[0].name,
            file_size_bytes: fileInput.files[0].size,
            mime_type: fileInput.files[0].type || null,
            requires_signature_default: qs('asgRequiresSig').checked,
            include_in_welcome_default: qs('asgIncludeWelcome').checked,
            active: true,
            created_by: 'admin'
          };
          const { data: newTpl } = await sb.from('document_templates').insert(tplPayload).select().single();
          if (newTpl) tplId = newTpl.id;
        }
      } catch (e) {
        console.error(e);
        return toast('Upload failed: '+e.message,'error');
      }
    }

    // Resolve tenant_id / lease fields from the lease
    const leaseId = qs('asgLeaseId').value || null;
    let tenantId = null, leaseType = null;
    if (leaseId) {
      const lease = _leases.find(l=>l.id===leaseId);
      if (lease) {
        leaseType = lease.lease_type || null;
        const email = qs('asgTenantEmail').value.trim().toLowerCase();
        const match = (lease.lease_signers||[]).find(s=>s.role==='tenant' && s.email && s.email.toLowerCase()===email);
        if (match) tenantId = match.id;
      }
    }

    const payload = Object.assign({
      lease_id: leaseId,
      tenant_id: tenantId,
      tenant_email: qs('asgTenantEmail').value.trim().toLowerCase() || null,
      tenant_name: qs('asgTenantName').value.trim() || null,
      property: qs('asgProperty').value.trim() || null,
      unit: qs('asgUnit').value.trim() || null,
      lease_type: leaseType,
      document_template_id: tplId,
      title,
      document_type: qs('asgDocType').value,
      source_type: src,
      external_url: (src==='external_url') ? qs('asgExternalUrl').value.trim() : null,
      requires_signature: qs('asgRequiresSig').checked,
      include_in_welcome: qs('asgIncludeWelcome').checked,
      shared_with_tenant: qs('asgShared').checked,
      is_required: qs('asgRequired').checked,
      status: qs('asgStatus').value,
      updated_by: 'admin'
    }, fileFields);

    if (id) {
      const { error } = await sb.from('lease_document_assignments').update(payload).eq('id', id);
      if (error) { console.error(error); return toast('Save failed: '+error.message,'error'); }
    } else {
      payload.created_by = 'admin';
      const { error } = await sb.from('lease_document_assignments').insert(payload);
      if (error) { console.error(error); return toast('Save failed: '+error.message,'error'); }
    }
    toast('Assignment saved','success');
    closeAssignment();
    await loadAssignments();
    renderAssignments();
  }

  async function deleteAssignment(){
    const id = qs('asgId').value;
    if (!id) return;
    if (!confirm('Delete this assignment? The tenant-facing mirror row will be removed too.')) return;
    const { error } = await getSb().from('lease_document_assignments').delete().eq('id', id);
    if (error) { console.error(error); return toast('Delete failed: '+error.message,'error'); }
    toast('Assignment deleted','success');
    closeAssignment();
    await loadAssignments();
    renderAssignments();
  }

  // ── apply package ────────────────────────────────────
  function openAssignFromPackage(){
    if (!_packages.length) { toast('Create a package first','error'); return; }
    qs('applyPkg').value = '';
    qs('applyLease').value = _ctx.lease_id || '';
    populateLeaseSelects();
    qs('applyModal').classList.add('active');
  }
  function closeAssignFromPackage(){ qs('applyModal').classList.remove('active'); }

  async function runAssignFromPackage(){
    const sb = getSb();
    const pkgId = qs('applyPkg').value;
    const leaseId = qs('applyLease').value;
    if (!pkgId || !leaseId) return toast('Pick a package and a lease','error');
    try {
      const { data, error } = await sb.rpc('create_document_assignments_from_package', {
        p_package_id: pkgId,
        p_lease_id: leaseId,
        p_created_by: 'admin'
      });
      if (error) throw error;
      const n = Array.isArray(data) ? data.length : (typeof data==='number' ? data : 0);
      toast(n ? (n+' assignment(s) created') : 'Applied package','success');
    } catch (e) {
      console.error(e);
      return toast('Apply failed: '+e.message,'error');
    }
    closeAssignFromPackage();
    await loadAssignments();
    renderAssignments();
  }

  // ── upload helper ────────────────────────────────────
  async function uploadFile(file, subfolder){
    const sb = getSb();
    const ts = Date.now();
    const safe = (file.name||'file').replace(/[^a-zA-Z0-9._-]/g,'_');
    const path = (subfolder||'misc') + '/' + ts + '_' + safe;
    const { error } = await sb.storage.from(UPLOAD_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined
    });
    if (error) throw error;
    const { data: pub } = sb.storage.from(UPLOAD_BUCKET).getPublicUrl(path);
    return { bucket: UPLOAD_BUCKET, path, publicUrl: pub?.publicUrl || null };
  }

  // ── public API ───────────────────────────────────────
  window.DocsAdmin = {
    init,
    clearCtx,
    openTemplate, closeTemplate, saveTemplate, deleteTemplate, onSourceTypeChange,
    openPackage, closePackage, savePackage, deletePackage,
    addPackageItem, removePackageItem,
    openAssignment, closeAssignment, saveAssignment, deleteAssignment,
    onAsgSourceChange, onAsgTemplateChange,
    openAssignFromPackage, closeAssignFromPackage, runAssignFromPackage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
