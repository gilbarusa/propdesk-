// ══════════════════════════════════════════════════════
//  LEASES VIEW — embedded in PropDesk SPA (MTM/LT → LEASES)
//  Includes: list/detail/preview/countersign-cascade
//    - View Lease (renders body_html_snapshot + tenant signatures)
//    - Countersign modal with landlord signature pad
//    - Cascade on countersign: PDF → storage → tenants_lt → units → email
//  v20260415-0500
// ══════════════════════════════════════════════════════
(function(){
  const VERSION = '20260415-0600';
  try { console.log('%c[leases-view] loaded v' + VERSION, 'background:#1a2874;color:#fff;padding:2px 8px;border-radius:3px'); } catch(e){}

  function getSb() { return window.sb; }

  // State
  let _leases = [];
  let _filtered = [];
  let _sortKey = 'lease_start';
  let _sortDir = 'desc';
  let _currentDetail = null;
  let _initialized = false;
  let _padCtx = null, _padDrawing = false, _padHasInk = false;

  // Helpers
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
        .select('*, lease_signers(id, name, email, phone, status, signed_at, signing_token, role, sign_order, signature_png)')
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
          ${l.signed_pdf_url ? `<div style="margin-top:6px;"><a href="${l.signed_pdf_url}" target="_blank" style="color:#1a2874; font-size:12px;">📄 Signed PDF ↗</a></div>`:''}
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
            <div>${lv_escapeHtml(landlord.name)} · ${lv_escapeHtml(landlord.email)} · <span class="lv-pill lv-status-${landlord.status==='signed'?'fully_signed':'draft'}">${landlord.status||'pending'}</span></div>
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

  function copyLink(url){ try { navigator.clipboard?.writeText(url); } catch(e){} lv_toast('Signing link copied','success'); }

  // ─── View Lease (preview snapshot with signatures) ───
  function buildSignedHtml(l){
    const tenants = (l.lease_signers||[]).filter(s=>s.role==='tenant').sort((a,b)=>a.sign_order-b.sign_order);
    const landlord = (l.lease_signers||[]).find(s=>s.role==='landlord');
    const body = l.body_html_snapshot || '<p style="color:#b83228;">No lease body snapshot. (Lease was not sent for signing yet.)</p>';
    // Replace [[SIG]] / {{SIG}} / {{SIGN_HERE}} / {{TENANT_SIGNATURE}} markers with actual signature images per tenant in order
    let sigIdx = 0;
    const replaced = body.replace(/\[\[SIG\]\]|\{\{\s*SIG\s*\}\}|\{\{\s*SIGN_HERE\s*\}\}|\{\{\s*TENANT_SIGNATURE\s*\}\}|\{\{\s*SIGNATURE\s*\}\}/g, () => {
      const t = tenants[sigIdx++ % Math.max(tenants.length, 1)];
      if (t && t.signature_png) {
        return `<span style="display:inline-block; vertical-align:middle; border-bottom:1px solid #999; padding:0 4px;"><img src="${t.signature_png}" alt="signature" style="height:36px; vertical-align:middle;"> <small style="display:block; color:#555; font-size:9px;">${lv_escapeHtml(t.name)} · ${t.signed_at?lv_fmtDate(t.signed_at.slice(0,10)):''}</small></span>`;
      }
      return `<span style="display:inline-block; min-width:200px; border-bottom:1px solid #999;">&nbsp;</span>`;
    });

    // Tenant signature blocks at end (always included)
    const sigBlocks = `
      <hr style="margin:30px 0; border:0; border-top:1px solid #ccc;">
      <h3 style="font-size:14px; text-transform:uppercase; letter-spacing:0.5px; color:#1a2874;">Signatures</h3>
      ${tenants.map(t => `
        <div style="margin:18px 0; padding:12px; border:1px solid #e1e5ee; border-radius:6px;">
          <div style="font-size:11px; color:#5a6378; font-weight:600;">TENANT: ${lv_escapeHtml(t.name)}</div>
          <div style="font-size:11px; color:#8a93a8;">${lv_escapeHtml(t.email)}</div>
          ${t.signature_png
            ? `<img src="${t.signature_png}" style="height:60px; margin-top:8px; border-bottom:1px solid #333;" alt="signature">
               <div style="font-size:10px; color:#555; margin-top:4px;">Signed ${t.signed_at?lv_fmtDate(t.signed_at.slice(0,10)):''}</div>`
            : `<div style="margin-top:10px; color:#b83228; font-size:12px;">⚠ Not signed</div>`}
        </div>`).join('')}
      ${landlord ? `
        <div style="margin:18px 0; padding:12px; border:2px solid #1a2874; border-radius:6px; background:#f7f8fb;">
          <div style="font-size:11px; color:#1a2874; font-weight:600;">LANDLORD: ${lv_escapeHtml(landlord.name)}</div>
          <div style="font-size:11px; color:#8a93a8;">${lv_escapeHtml(landlord.email)}</div>
          ${landlord.signature_png
            ? `<img src="${landlord.signature_png}" style="height:60px; margin-top:8px; border-bottom:1px solid #333;" alt="landlord signature">
               <div style="font-size:10px; color:#555; margin-top:4px;">Countersigned ${landlord.signed_at?lv_fmtDate(landlord.signed_at.slice(0,10)):''}</div>`
            : `<div style="margin-top:10px; color:#8a5c00; font-size:12px;">Pending countersign</div>`}
        </div>`:''}`;

    return `<div style="font-family:Georgia, serif; max-width:780px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:24px; padding-bottom:16px; border-bottom:2px solid #1a2874;">
        <div style="font-size:18px; font-weight:700; color:#1a2874;">RESIDENTIAL LEASE AGREEMENT</div>
        <div style="font-size:12px; color:#5a6378; margin-top:4px;">${lv_escapeHtml(l.property||'')}${l.unit?' · Unit '+lv_escapeHtml(l.unit):''}</div>
      </div>
      ${replaced}
      ${sigBlocks}
    </div>`;
  }

  function viewLease(){
    if (!_currentDetail) return;
    const l = _currentDetail;
    document.getElementById('lvViewTitle').textContent = `Lease — ${l.property||''}${l.unit?' · '+l.unit:''}`;
    document.getElementById('lvViewBody').innerHTML = buildSignedHtml(l);
    const pdfA = document.getElementById('lvPdfLink');
    if (l.signed_pdf_url) { pdfA.href = l.signed_pdf_url; pdfA.style.display=''; } else { pdfA.style.display='none'; }
    document.getElementById('lvViewModal').classList.add('active');
  }
  function closeView(){ document.getElementById('lvViewModal').classList.remove('active'); }
  function printLease(){
    const html = document.getElementById('lvViewBody').innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Lease</title></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); setTimeout(()=>w.print(), 400);
  }

  // ─── Countersign modal + landlord pad ───
  function openCountersign(){
    if (!_currentDetail) return;
    const l = _currentDetail;
    const tenants = (l.lease_signers||[]).filter(s=>s.role==='tenant');
    document.getElementById('lvCsSummary').innerHTML = `
      <div style="font-weight:600;">${lv_escapeHtml(l.property||'')}${l.unit?' · '+lv_escapeHtml(l.unit):''}</div>
      <div style="font-size:12px; color:#5a6378; margin-top:4px;">
        ${tenants.length} tenant${tenants.length===1?'':'s'} signed · ${lv_fmtDate(l.lease_start)} — ${l.lease_type==='mtm'?'Month-to-Month':lv_fmtDate(l.lease_end)} · ${lv_fmtMoney(l.monthly_rent)}/mo
      </div>
      <div style="font-size:11px; color:#8a93a8; margin-top:4px;">${tenants.map(t=>lv_escapeHtml(t.name)).join(', ')}</div>
    `;
    document.getElementById('lvCsProgress').style.display = 'none';
    document.getElementById('lvCsSubmit').disabled = false;
    document.getElementById('lvCsModal').classList.add('active');
    setupLandlordPad();
  }
  function closeCountersign(){ document.getElementById('lvCsModal').classList.remove('active'); }

  function setupLandlordPad(){
    const c = document.getElementById('lvLandlordPad');
    if (!c) return;
    // Resize to actual rendered size
    const rect = c.getBoundingClientRect();
    c.width  = rect.width  || 700;
    c.height = rect.height || 160;
    _padCtx = c.getContext('2d');
    _padCtx.fillStyle = '#fff'; _padCtx.fillRect(0,0,c.width,c.height);
    _padCtx.lineWidth = 2; _padCtx.lineCap = 'round'; _padCtx.strokeStyle = '#000';
    _padHasInk = false;

    const getXY = (e) => {
      const r = c.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const start = (e) => { e.preventDefault(); _padDrawing = true; const p = getXY(e); _padCtx.beginPath(); _padCtx.moveTo(p.x, p.y); };
    const move  = (e) => { if (!_padDrawing) return; e.preventDefault(); const p = getXY(e); _padCtx.lineTo(p.x, p.y); _padCtx.stroke(); _padHasInk = true; };
    const end   = () => { _padDrawing = false; };

    c.onmousedown = start; c.onmousemove = move; c.onmouseup = end; c.onmouseleave = end;
    c.ontouchstart = start; c.ontouchmove = move; c.ontouchend = end;
  }

  function clearLandlordPad(){
    if (!_padCtx) return;
    const c = document.getElementById('lvLandlordPad');
    _padCtx.fillStyle='#fff'; _padCtx.fillRect(0,0,c.width,c.height);
    _padHasInk = false;
  }

  function progress(pct, txt){
    const wrap = document.getElementById('lvCsProgress');
    if (!wrap) return;
    wrap.style.display = '';
    document.getElementById('lvCsProgressBar').style.width = pct + '%';
    if (txt) document.getElementById('lvCsProgressText').textContent = txt;
  }

  async function submitCountersign(){
    if (!_currentDetail) return;
    if (!_padHasInk) { lv_toast('Please sign first','error'); return; }
    const sb = getSb();
    const l = _currentDetail;
    const submitBtn = document.getElementById('lvCsSubmit');
    submitBtn.disabled = true;

    try {
      progress(10, 'Capturing landlord signature...');
      const landlordSigPng = document.getElementById('lvLandlordPad').toDataURL('image/png');
      const landlord = (l.lease_signers||[]).find(s=>s.role==='landlord');

      // 1) Save landlord signature + status to lease_signers
      if (landlord) {
        const { error } = await sb.from('lease_signers').update({
          signature_png: landlordSigPng,
          status: 'signed',
          signed_at: new Date().toISOString(),
        }).eq('id', landlord.id);
        if (error) throw new Error('Save landlord sig: ' + error.message);
      }

      // 2) Update lease status (refresh lease object so PDF includes landlord sig)
      progress(20, 'Updating lease status...');
      await sb.from('leases').update({
        status: 'countersigned',
        countersigned_at: new Date().toISOString(),
      }).eq('id', l.id);

      // 3) Reload signers so we have the freshest data for PDF
      const { data: fresh, error: fe } = await sb.from('leases').select('*, lease_signers(*)').eq('id', l.id).single();
      if (fe) throw fe;
      _currentDetail = fresh;

      // 4) Generate PDF (browser-side via html2pdf)
      progress(35, 'Generating signed PDF...');
      const html = buildSignedHtml(fresh);
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed; left:-9999px; top:0; width:780px; padding:30px; background:#fff;';
      wrap.innerHTML = html;
      document.body.appendChild(wrap);
      const pdfBlob = await window.html2pdf().set({
        margin: [10,10,10,10],
        filename: `lease-${(fresh.property||'lease').replace(/\s+/g,'_')}-${(fresh.unit||'').replace(/\s+/g,'_')}.pdf`,
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
      }).from(wrap).outputPdf('blob');
      document.body.removeChild(wrap);

      // 5) Upload to Supabase Storage
      progress(60, 'Uploading PDF...');
      const filename = `${fresh.id}/${Date.now()}.pdf`;
      const { error: upErr } = await sb.storage.from('leases-signed').upload(filename, pdfBlob, { contentType: 'application/pdf', upsert: true });
      if (upErr) throw new Error('Upload PDF: ' + upErr.message);
      const { data: pub } = sb.storage.from('leases-signed').getPublicUrl(filename);
      const pdfUrl = pub.publicUrl;

      // 6) Save URL on lease
      await sb.from('leases').update({ signed_pdf_url: pdfUrl }).eq('id', l.id);

      // 7) Cascade: tenants_lt + units rows
      progress(75, 'Adding tenants & units...');
      await cascadeTenantsAndUnits(fresh, pdfUrl);

      // 8) Email signed PDF link to all tenants
      progress(90, 'Emailing signed PDF...');
      await emailSignedPdf(fresh, pdfUrl);

      // 9) Audit
      await sb.from('lease_events').insert([
        { lease_id: l.id, event_type: 'countersigned', meta: {} },
        { lease_id: l.id, event_type: 'pdf_generated', meta: { url: pdfUrl } },
      ]);

      progress(100, 'Done!');
      lv_toast('Lease countersigned, tenants notified, units updated', 'success');
      setTimeout(() => { closeCountersign(); closeDetail(); load(); }, 800);
    } catch (e) {
      console.error('[countersign]', e);
      lv_toast('Countersign failed: ' + e.message, 'error');
      submitBtn.disabled = false;
    }
  }

  // ─── Cascade: tenants_lt + units ───
  async function cascadeTenantsAndUnits(lease, pdfUrl){
    const sb = getSb();
    const tenants = (lease.lease_signers||[]).filter(s=>s.role==='tenant');
    const today = lv_todayISO();
    const isFuture = lease.lease_start && lease.lease_start > today;
    const status = isFuture ? 'Future' : 'Active';
    const leaseTypeLabel = lease.lease_type === 'mtm' ? 'month-to-month' : 'long-term';

    // Insert/upsert tenants_lt rows (one per tenant). Schema has several NOT NULL
    // columns (due_day, grace_days, late_fee_per_day, autopay_enabled, autopay_days_before)
    // — supply defaults so insert doesn't fail.
    for (const t of tenants) {
      try {
        const tenantRow = {
          name: t.name,
          email: t.email || '',
          phone: t.phone || '',
          property: lease.property || '—',
          unit: lease.unit || '—',
          address: lease.property || null,
          status,
          rent: parseFloat(lease.monthly_rent || 0),
          roommates: Math.max(0, tenants.length - 1),
          since: lease.lease_start || today,
          lease_start: lease.lease_start || null,
          lease_end: lease.lease_end || null,
          lease_type: lease.lease_type || 'mtm',
          lease_id: lease.id,
          // NOT NULL columns with sensible defaults
          due_day: 1,
          grace_days: 5,
          late_fee_per_day: 0,
          autopay_enabled: false,
          autopay_days_before: 0,
        };
        let { error } = await sb.from('tenants_lt').upsert(tenantRow, { onConflict: 'email' });
        if (error) {
          console.warn('[cascade] upsert failed, trying insert:', error.message);
          const { error: ie } = await sb.from('tenants_lt').insert(tenantRow);
          if (ie) {
            console.error('[cascade] tenants_lt INSERT FAILED:', ie.message, ie.details, ie.hint);
            try { window.toast && window.toast('Tenant insert failed: '+ie.message, 'err'); } catch(_){}
          } else {
            console.log('[cascade] tenants_lt insert OK for', t.name);
          }
        } else {
          console.log('[cascade] tenants_lt upsert OK for', t.name);
        }
        await sb.from('lease_events').insert({ lease_id: lease.id, signer_id: t.id, event_type: 'tenant_added', meta: { name: t.name, status } });
      } catch(e) { console.error('[cascade] tenant row threw', e); }
    }

    // Insert units row(s) — one per tenant, type='long-term' or 'month-to-month'.
    // If lease_start > today, mark the row's lease_start so the Future filter picks it up.
    // Existing tenant in that unit stays untouched (we don't blank/archive them).
    try {
      // Get next safe ID
      const { data: maxRow } = await sb.from('units').select('id').order('id', { ascending: false }).limit(1);
      let nextId = (maxRow && maxRow.length ? maxRow[0].id + 1 : 1);

      for (const t of tenants) {
        const unitRow = {
          id: nextId++,
          apt: lease.unit || lease.property || '',
          owner: lease.landlord_entity || lease.landlord_name || null,
          name: t.name,
          type: leaseTypeLabel,
          rent: parseFloat(lease.monthly_rent || 0),
          balance: 0,
          due: lease.lease_end || null,
          lease_end: lease.lease_end || null,
          lease_start: lease.lease_start || null,
          checkin: lease.lease_start || null,
          note: `Lease ${lease.id.slice(0,8)} · ${tenants.length} tenant${tenants.length===1?'':'s'}`,
          history: [],
          archived: false,
          archived_date: null,
          lease_id: lease.id,
        };
        const { error } = await sb.from('units').insert(unitRow);
        if (error) console.warn('[cascade] units insert', error.message);
        await sb.from('lease_events').insert({ lease_id: lease.id, signer_id: t.id, event_type: 'unit_added', meta: { unit_id: unitRow.id, status, future: isFuture } });
      }
    } catch(e) { console.warn('[cascade] units failed', e); }
  }

  async function emailSignedPdf(lease, pdfUrl){
    const sb = getSb();
    const tenants = (lease.lease_signers||[]).filter(s=>s.role==='tenant' && s.email);
    const subject = `Your fully-signed lease — ${lease.property||''}${lease.unit?' · Unit '+lease.unit:''}`;
    for (const t of tenants) {
      const html = `
        <p>Hi ${lv_escapeHtml(t.name)},</p>
        <p>Your lease for <strong>${lv_escapeHtml(lease.property||'')}${lease.unit?' · Unit '+lv_escapeHtml(lease.unit):''}</strong> has been countersigned and is now fully executed.</p>
        <p style="margin:24px 0;">
          <a href="${pdfUrl}" style="background:#1a2874; color:#fff; padding:12px 22px; border-radius:6px; text-decoration:none; font-weight:600;">📄 Download signed lease (PDF)</a>
        </p>
        <p style="font-size:12px; color:#666;">Or open this link in a browser:<br><a href="${pdfUrl}">${pdfUrl}</a></p>
        <p style="font-size:12px; color:#666;">Lease term: ${lv_fmtDate(lease.lease_start)} — ${lease.lease_type==='mtm'?'Month-to-Month':lv_fmtDate(lease.lease_end)}<br>
        Monthly rent: ${lv_fmtMoney(lease.monthly_rent)}</p>
        <p>— Willow Partnership</p>`;
      try {
        if (typeof window.sendEmail === 'function') {
          await window.sendEmail(t.email, subject, html, { isHtml: true, headerTitle: 'Willow Partnership' });
          await sb.from('lease_events').insert({ lease_id: lease.id, signer_id: t.id, event_type: 'email_sent', meta: { to: t.email, subject, kind: 'countersigned_pdf' } });
        } else {
          console.warn('[email] sendEmail not available; skipping', t.email);
          await sb.from('lease_events').insert({ lease_id: lease.id, signer_id: t.id, event_type: 'email_skipped', meta: { to: t.email, reason: 'sendEmail unavailable' } });
        }
      } catch(e) { console.warn('[email] failed for', t.email, e); }
    }
  }

  // ─── Legacy callers ───
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
    for (const s of tenants){
      const signUrl = `${location.origin.replace('propdesk','willowpa')}/sign.php?token=${s.signing_token}`;
      await sb.from('lease_events').insert({
        lease_id: _currentDetail.id, signer_id: s.id, event_type:'email_queued',
        meta:{ to:s.email, subject:`Lease ready — ${_currentDetail.property} ${_currentDetail.unit||''}`, url:signUrl, resent:true }
      });
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

  // Old direct call kept for back-compat — now opens the modal instead
  function countersignLease(){ openCountersign(); }

  function newLease(){
    if (typeof window.openLeaseWizard === 'function') { try { window.openLeaseWizard(); return; } catch(e){ console.warn(e); } }
    if (typeof window.leaseWizardOpen === 'function') { try { window.leaseWizardOpen(); return; } catch(e){ console.warn(e); } }
    if (typeof window.LeaseWizard === 'object' && typeof window.LeaseWizard.open === 'function') { try { window.LeaseWizard.open(); return; } catch(e){ console.warn(e); } }
    if (typeof window.leaseAction === 'function') { try { window.leaseAction('newLease'); return; } catch(e){ console.warn(e); } }
    lv_toast('Lease wizard not available','error');
  }

  function init(){
    if (_initialized) return;
    _initialized = true;
    const f = document.getElementById('lvFilter');
    if (f) f.addEventListener('input', applyFilter);
  }

  window.LeasesView = {
    load, init, openDetail, closeDetail,
    revokeLease, resendLease, countersignLease,
    openCountersign, closeCountersign, submitCountersign, clearLandlordPad,
    viewLease, closeView, printLease,
    copyLink, exportCSV, setSort, newLease,
    get leases(){ return _leases; },
    VERSION,
  };
})();
