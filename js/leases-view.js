// ══════════════════════════════════════════════════════
//  LEASES VIEW — embedded in PropDesk SPA (MTM/LT → LEASES)
//  Ported from standalone leases.html/leases.js
//  v20260415-0400
// ══════════════════════════════════════════════════════
(function(){
  const VERSION = '20260415-0400';
  try { console.log('%c[leases-view] loaded v' + VERSION, 'background:#1a2874;color:#fff;padding:2px 8px;border-radius:3px'); } catch(e){}

  // Shared Supabase client (from app.js)
  function getSb() { return window.sb; }

  // State (module-private)
  let _leases = [];
  let _filtered = [];
  let _sortKey = 'lease_start';
  let _sortDir = 'desc';
  let _currentDetail = null;
  let _initialized = false;

  // Helpers (prefixed to avoid collisions)
  function lv_escapeHtml(s){ if (s==null) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
  function lv_fmtDate(d){ if (!d) return ''; const x=new Date(d.length===10 ? d+'T00:00:00' : d); if (isNaN(x)) return d; return x.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
  function lv_fmtMoney(n){ return (parseFloat(n||0)).toLocaleString('en-US',{style:'currency',currency:'USD'}); }
  function lv_todayISO(){ return new Date().toISOString().slice(0,10); }
  function lv_ordinal(n){ const s=['th','st','nd','rd'], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }
  function lv_toast(msg, kind){
    if (typeof window.toast === 'function') { try { window.toast(msg, kind); return; } catch(e){} }
    const el = document.getElementById('lvToast');
    if (!el) { console.log('[leases-view toast]', msg); return; }
    el.textContent = msg;
    el.className = 'lv-toast show ' + (kind||'');
    setTimeout(() => el.classList.remove('show'), 2800);
  }

  // Status calc
  function displayStatus(l){
    if (l.status==='void')              return {key:'void',label:'Void'};
    if (l.status==='draft')             return {key:'draft',label:'Draft'};
    if (l.status==='out_for_signature') return {key:'out_for_signature',label:'In Process'};
    if (l.status==='partially_signed')  return {key:'partially_signed',label:'Partially Signed'};
    if (l.status==='fully_signed')      return {key:'fully_signed',label:'Awaiting Countersign'};
    if (l.status==='countersigned') {
      const today = lv_todayISO();
      if (l.lease_start && l.lease_start > today) return {key:'future',label:'Future'};
      if (l.lease_end   && l.lease_end   < today) return {key:'expired',label:'Expired'};
      return {key:'active',label:'Active'};
    }
    return {key:'draft',label:l.status||'Unknown'};
  }

  async function load(){
    const sb = getSb();
    if (!sb) { console.error('[leases-view] window.sb not available'); return; }
    const body = document.getElementById('lvBody');
    if (body) body.innerHTML = '<tr><td colspan="7" class="lv-loading">Loading leases…</td></tr>';
    try {
      const { data, error } = await sb
        .from('leases')
        .select('*, lease_signers(id, name, email, phone, status, signed_at, signing_token, role, sign_order)')
        .order('lease_start', { ascending: false });
      if (error) throw error;
      _leases = data || [];
      applyFilter();
      updateStats();
    } catch (e) {
      console.error('[leases-view] load error', e);
      if (body) body.innerHTML = `<tr><td colspan="7" class="lv-empty">Error loading leases: ${lv_escapeHtml(e.message)}</td></tr>`;
    }
  }

  function applyFilter(){
    const q = (document.getElementById('lvFilter')?.value || '').trim().toLowerCase();
    _filtered = _leases.filter(l => {
      if (!q) return true;
      const tenants = (l.lease_signers||[]).filter(s=>s.role==='tenant').map(s=>s.name).join(' ');
      const blob = [l.property, l.unit, tenants, displayStatus(l).label, l.landlord_name].join(' ').toLowerCase();
      return blob.includes(q);
    });
    _filtered.sort((a,b) => {
      const A = sortValue(a, _sortKey), B = sortValue(b, _sortKey);
      if (A<B) return _sortDir==='asc' ? -1 : 1;
      if (A>B) return _sortDir==='asc' ?  1 : -1;
      return 0;
    });
    renderList();
  }

  function sortValue(l, key){
    if (key==='status')   return displayStatus(l).label;
    if (key==='tenants')  return ((l.lease_signers||[]).filter(s=>s.role==='tenant')[0]?.name || '').toLowerCase();
    if (key==='address')  return (l.property+' '+l.unit).toLowerCase();
    if (key==='lease_start' || key==='lease_end') return l[key] || '';
    return (l[key]||'').toString().toLowerCase();
  }

  function renderList(){
    const body = document.getElementById('lvBody');
    const count = document.getElementById('lvCount');
    if (!body) return;
    if (count) count.textContent = `Showing ${_filtered.length} of ${_leases.length}`;
    if (!_filtered.length){
      body.innerHTML = `<tr><td colspan="7" class="lv-empty">${_leases.length ? 'No leases match your filter.' : 'No leases yet. Click + New Lease to start.'}</td></tr>`;
      return;
    }
    body.innerHTML = _filtered.map(l => {
      const st = displayStatus(l);
      const tenantsArr = (l.lease_signers||[]).filter(s=>s.role==='tenant');
      const tenantsTxt = tenantsArr.length
        ? (tenantsArr.length===1 ? tenantsArr[0].name : `${tenantsArr[0].name} +${tenantsArr.length-1}`)
        : '—';
      return `
        <tr onclick="LeasesView.openDetail('${l.id}')">
          <td><span class="lv-pill lv-status-${st.key}">${st.label}</span></td>
          <td>${lv_escapeHtml(l.property||'')}</td>
          <td>${lv_escapeHtml(l.unit||'')}</td>
          <td><div>${lv_escapeHtml(l.property||'')}</div><div class="lv-addr">${lv_escapeHtml(l.unit?'Unit '+l.unit:'')}</div></td>
          <td><span class="lv-chip">👥 ${lv_escapeHtml(tenantsTxt)}</span></td>
          <td>${lv_fmtDate(l.lease_start)}</td>
          <td>${l.lease_type==='mtm' ? '<span class="lv-pill lv-mtm">M to M</span>' : lv_fmtDate(l.lease_end)}</td>
        </tr>`;
    }).join('');
  }

  function updateStats(){
    const today = lv_todayISO();
    const in90 = new Date(); in90.setDate(in90.getDate()+90);
    const in90ISO = in90.toISOString().slice(0,10);
    let active=0,inProcess=0,future=0,expiring=0,expired=0;
    _leases.forEach(l => {
      const st = displayStatus(l).key;
      if (st==='out_for_signature' || st==='partially_signed' || st==='fully_signed') inProcess++;
      if (st==='future') future++;
      if (st==='active') {
        active++;
        if (l.lease_end && l.lease_end >= today && l.lease_end <= in90ISO) expiring++;
      }
      if (st==='expired' || st==='void') expired++;
    });
    const set = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent = v; };
    set('lvStatActive', active);
    set('lvStatInProcess', inProcess);
    set('lvStatFuture', future);
    set('lvStatExpiring', expiring);
    set('lvStatExpired', expired);
  }

  function setSort(key){
    if (_sortKey === key) _sortDir = _sortDir==='asc' ? 'desc' : 'asc';
    else { _sortKey = key; _sortDir = 'asc'; }
    applyFilter();
  }

  function exportCSV(){
    const hdr = ['Status','Property','Unit','Tenants','Start','End','Monthly Rent','Security Deposit'];
    const rows = _filtered.map(l => {
      const tenants = (l.lease_signers||[]).filter(s=>s.role==='tenant').map(s=>s.name).join('; ');
      return [displayStatus(l).label, l.property||'', l.unit||'', tenants, l.lease_start||'', l.lease_end||'', l.monthly_rent||'', l.security_deposit||''];
    });
    const csv = [hdr, ...rows].map(r => r.map(c => `"${String(c).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `leases-${lv_todayISO()}.csv`;
    a.click();
  }

  // ─── Detail modal ───
  async function openDetail(id){
    const sb = getSb();
    try {
      const { data, error } = await sb
        .from('leases')
        .select('*, lease_signers(*), lease_addendums_selected(name_snapshot, requires_signature)')
        .eq('id', id).single();
      if (error) throw error;
      _currentDetail = data;
      renderDetail(data);
      document.getElementById('lvDetailModal').classList.add('active');
    } catch (e) {
      console.error(e);
      lv_toast('Load lease failed: '+e.message, 'error');
    }
  }

  function closeDetail(){
    document.getElementById('lvDetailModal').classList.remove('active');
    _currentDetail = null;
  }

  function renderDetail(l){
    const st = displayStatus(l);
    const tenants = (l.lease_signers||[]).filter(s=>s.role==='tenant').sort((a,b)=>a.sign_order-b.sign_order);
    const landlord = (l.lease_signers||[]).find(s=>s.role==='landlord');
    const addendums = l.lease_addendums_selected || [];
    const dueDay = l.lease_start ? new Date(l.lease_start+'T00:00:00').getDate() : null;

    const html = `
      <div class="lv-detail-head">
        <div>
          <span class="lv-pill lv-status-${st.key}" style="margin-bottom:8px;">${st.label}</span>
          <div class="lv-detail-prop">${lv_escapeHtml(l.property||'')}${l.unit?' | '+lv_escapeHtml(l.unit):''}</div>
        </div>
        <div class="lv-detail-rent">
          <div>${lv_fmtDate(l.lease_start)} — ${l.lease_type==='mtm' ? 'M to M' : lv_fmtDate(l.lease_end)}</div>
          <div><span class="lv-amt">${lv_fmtMoney(l.monthly_rent)}</span> <small>Monthly Rent${dueDay?` · Due on the ${lv_ordinal(dueDay)} of every month`:''}</small></div>
        </div>
        <div>
          <div class="lv-tenants-chip">👥 ${tenants.length} tenant${tenants.length===1?'':'s'}</div>
          <div class="lv-hint" style="margin-top:4px;">${tenants.map(t=>lv_escapeHtml(t.name)).join(', ')}</div>
        </div>
      </div>
      <div style="padding:20px 24px;">
        <div class="lv-doc-card">
          <div class="lv-doc-head">
            <h4>Lease Document</h4>
            <span class="lv-hint">${tenants.length} tenant${tenants.length===1?'':'s'}</span>
            ${l.status==='out_for_signature'||l.status==='partially_signed' ? '<span class="lv-pill" style="margin-left:auto;">Awaiting signatures</span>' : ''}
          </div>
          <div class="lv-signer-row lv-signer-head">
            <div>Tenant</div><div>Last Activity</div><div>Status</div><div>Link</div>
          </div>
          ${tenants.map(s=>renderSignerRow(s)).join('')}
        </div>
        ${addendums.length ? `
          <div class="lv-doc-card">
            <div class="lv-doc-head"><h4>Addendums (${addendums.length})</h4></div>
            ${addendums.map(a=>`<div style="padding:6px 0;">${lv_escapeHtml(a.name_snapshot)} ${a.requires_signature?'<span class="lv-pill">Signature required</span>':''}</div>`).join('')}
          </div>`:''}
        ${landlord ? `
          <div class="lv-doc-card">
            <div class="lv-doc-head"><h4>Landlord Countersign</h4></div>
            <div>${lv_escapeHtml(landlord.name)} · ${lv_escapeHtml(landlord.email)} · <span class="lv-pill lv-status-${landlord.status==='signed'?'fully_signed':'draft'}">${landlord.status}</span></div>
          </div>`:''}
      </div>`;
    document.getElementById('lvDetailBody').innerHTML = html;

    document.getElementById('lvRevokeBtn').style.display      = (['out_for_signature','partially_signed'].includes(l.status)) ? 'inline-block' : 'none';
    document.getElementById('lvResendBtn').style.display      = (['out_for_signature','partially_signed'].includes(l.status)) ? 'inline-block' : 'none';
    document.getElementById('lvCountersignBtn').style.display = (l.status==='fully_signed') ? 'inline-block' : 'none';
  }

  function renderSignerRow(s){
    const steps = ['pending','viewed','signed'];
    const idx = steps.indexOf(s.status);
    const signUrl = `${location.origin.replace('propdesk','willowpa')}/sign.php?token=${s.signing_token}`;
    return `
      <div class="lv-signer-row">
        <div>
          <div style="font-weight:500;">${lv_escapeHtml(s.name)}</div>
          <div class="lv-addr">${lv_escapeHtml(s.email)}${s.phone?' · '+lv_escapeHtml(s.phone):''}</div>
        </div>
        <div class="lv-hint">${s.signed_at ? lv_fmtDate(s.signed_at.slice(0,10)) : (s.status==='pending'?'Not opened':'—')}</div>
        <div class="lv-timeline">
          <span class="lv-tl-dot ${idx>=0?'done':''}">1</span>
          <span class="lv-tl-line ${idx>=1?'done':''}"></span>
          <span class="lv-tl-dot ${idx>=1?'done':''}">2</span>
          <span class="lv-tl-line ${idx>=2?'done':''}"></span>
          <span class="lv-tl-dot ${idx>=2?'done':''}">${idx>=2?'✓':'3'}</span>
        </div>
        <div><button class="lv-btn lv-btn-sm" onclick="LeasesView.copyLink('${signUrl}')">Copy link</button></div>
      </div>`;
  }

  function copyLink(url){
    try { navigator.clipboard?.writeText(url); } catch(e){}
    lv_toast('Signing link copied','success');
  }

  async function revokeLease(){
    const sb = getSb();
    if (!_currentDetail) return;
    if (!confirm('Revoke this lease? All outstanding signing links will be invalidated and the lease will be marked Void.')) return;
    try {
      const { error } = await sb.from('leases').update({status:'void'}).eq('id', _currentDetail.id);
      if (error) throw error;
      await sb.from('lease_events').insert({lease_id:_currentDetail.id, event_type:'voided', meta:{}});
      lv_toast('Lease revoked','success');
      closeDetail();
      await load();
    } catch (e) { console.error(e); lv_toast('Revoke failed: '+e.message,'error'); }
  }

  async function resendLease(){
    const sb = getSb();
    if (!_currentDetail) return;
    const tenants = (_currentDetail.lease_signers||[]).filter(s=>s.role==='tenant' && s.status!=='signed');
    // Re-queue via lease_events; actual email send handled by lease-wizard.js queueSigningEmails logic if available
    for (const s of tenants){
      const signUrl = `${location.origin.replace('propdesk','willowpa')}/sign.php?token=${s.signing_token}`;
      await sb.from('lease_events').insert({
        lease_id: _currentDetail.id, signer_id: s.id, event_type:'email_queued',
        meta:{ to:s.email, subject:`Lease ready — ${_currentDetail.property} ${_currentDetail.unit||''}`, url:signUrl, resent:true }
      });
      // If FT sendEmail is available, send directly
      if (typeof window.sendEmail === 'function') {
        try {
          const html = `<p>Hi ${lv_escapeHtml(s.name)},</p><p>Please sign your lease for <strong>${lv_escapeHtml(_currentDetail.property)} ${lv_escapeHtml(_currentDetail.unit||'')}</strong>.</p><p><a href="${signUrl}" style="background:#1a2874;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Sign lease</a></p><p>Or paste this link: ${signUrl}</p>`;
          await window.sendEmail(s.email, `Lease ready for your signature`, html, {isHtml:true, headerTitle:'Willow Partnership'});
        } catch(e){ console.warn('sendEmail failed', e); }
      }
    }
    await sb.from('lease_events').insert({lease_id:_currentDetail.id, event_type:'resent', meta:{resent_to:tenants.map(t=>t.email)}});
    lv_toast(`Resent to ${tenants.length} tenant(s)`,'success');
  }

  async function countersignLease(){
    const sb = getSb();
    if (!_currentDetail) return;
    if (!confirm('Countersign this lease? The final PDF will be emailed to all tenants and attached to their file.')) return;
    try {
      const { error } = await sb.from('leases').update({
        status:'countersigned',
        countersigned_at: new Date().toISOString(),
      }).eq('id', _currentDetail.id);
      if (error) throw error;
      const landlord = (_currentDetail.lease_signers||[]).find(s=>s.role==='landlord');
      if (landlord) {
        await sb.from('lease_signers').update({status:'signed', signed_at:new Date().toISOString()}).eq('id', landlord.id);
      }
      await sb.from('lease_events').insert({lease_id:_currentDetail.id, event_type:'countersigned', meta:{}});
      lv_toast('Lease countersigned and finalized','success');
      closeDetail();
      await load();
    } catch (e) { console.error(e); lv_toast('Countersign failed: '+e.message,'error'); }
  }

  // ─── New Lease — delegate to existing lease-wizard.js if present ───
  function newLease(){
    if (typeof window.openLeaseWizard === 'function') { try { window.openLeaseWizard(); return; } catch(e){ console.warn(e); } }
    if (typeof window.leaseWizardOpen === 'function') { try { window.leaseWizardOpen(); return; } catch(e){ console.warn(e); } }
    if (typeof window.LeaseWizard === 'object' && typeof window.LeaseWizard.open === 'function') { try { window.LeaseWizard.open(); return; } catch(e){ console.warn(e); } }
    if (typeof window.leaseAction === 'function') { try { window.leaseAction('newLease'); return; } catch(e){ console.warn(e); } }
    lv_toast('Lease wizard not available','error');
  }

  // Init (idempotent)
  function init(){
    if (_initialized) return;
    _initialized = true;
    const f = document.getElementById('lvFilter');
    if (f) f.addEventListener('input', applyFilter);
  }

  // Public surface
  window.LeasesView = {
    load, init, openDetail, closeDetail,
    revokeLease, resendLease, countersignLease,
    copyLink, exportCSV, setSort, newLease,
    get leases(){ return _leases; },
    VERSION,
  };
})();
