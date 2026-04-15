/* ═══ LEASE WIZARD — Create Lease + send for signing ═══
   v2026-04-14 2305 — Real email + SMS send on "Send for Signature", schema-safe lease_events
   Depends on: window.supa (shared Supabase client from app.js)
   Invoked by: leaseAction('newLease') in app.js
*/
(function(){
  'use strict';

  const WIZ_STEPS = ['Tenants','Property','Terms','Utilities','Addendums','Review'];
  const UTILITIES = ['Water','Sewer','Trash','Electric','Gas','Heat','Hot water','Internet','Cable'];

  let wizState = null;
  let templates = [];
  let addendums = [];
  let properties = [];
  let applicants = []; // [{id,name,email,phone,property,unit,status}]

  function sb(){ return window.sb || window.supa || window.supabaseClient || null; }

  function ensureModal(){
    if (document.getElementById('lwModal')) return;
    const css = `
      #lwModal{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:inherit}
      #lwModal .lw-box{background:#fff;width:min(880px,94vw);max-height:92vh;border-radius:10px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}
      #lwModal .lw-hd{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid #e5e5e5;background:#faf8f4}
      #lwModal .lw-hd h3{margin:0;font-size:18px;color:#2c1810}
      #lwModal .lw-x{background:none;border:0;font-size:22px;cursor:pointer;color:#666}
      #lwModal .lw-steps{display:flex;gap:4px;padding:12px 20px;border-bottom:1px solid #eee;background:#fafafa;overflow-x:auto}
      #lwModal .lw-step{font-size:12px;padding:6px 10px;border-radius:14px;background:#eee;color:#555;white-space:nowrap}
      #lwModal .lw-step.active{background:#8b6f47;color:#fff}
      #lwModal .lw-step.done{background:#c7b59a;color:#fff}
      #lwModal .lw-body{padding:18px 22px;overflow-y:auto;flex:1}
      #lwModal .lw-body label{display:block;font-size:12px;color:#555;margin:10px 0 4px;font-weight:600}
      #lwModal .lw-body input,#lwModal .lw-body select,#lwModal .lw-body textarea{width:100%;padding:8px 10px;border:1px solid #d0d0d0;border-radius:6px;font-size:14px;box-sizing:border-box}
      #lwModal .lw-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      #lwModal .lw-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
      #lwModal .lw-tenant{display:grid;grid-template-columns:1fr 1fr 120px 28px;gap:8px;align-items:end;margin-bottom:8px}
      #lwModal .lw-del{background:#fee;border:1px solid #fcc;color:#c33;border-radius:4px;cursor:pointer;font-size:16px;height:32px}
      #lwModal .lw-add{background:#f4efe6;border:1px dashed #b59d74;color:#8b6f47;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:13px;margin-top:6px}
      #lwModal .lw-chk-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
      #lwModal .lw-chk{display:flex;align-items:center;gap:6px;font-size:13px}
      #lwModal .lw-chk input{width:auto}
      #lwModal .lw-addendum{border:1px solid #e5e5e5;border-radius:6px;padding:10px;margin-bottom:6px;display:flex;gap:10px;align-items:flex-start}
      #lwModal .lw-addendum input{width:auto;margin-top:3px}
      #lwModal .lw-addendum .lw-ad-name{font-weight:600;font-size:13px}
      #lwModal .lw-addendum .lw-ad-desc{font-size:12px;color:#777;margin-top:2px}
      #lwModal .lw-review-sec{margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #f0f0f0}
      #lwModal .lw-review-sec h4{margin:0 0 6px;font-size:13px;color:#8b6f47;text-transform:uppercase;letter-spacing:.04em}
      #lwModal .lw-review-sec .kv{display:flex;gap:10px;font-size:13px;margin:2px 0}
      #lwModal .lw-review-sec .kv b{min-width:120px;color:#555;font-weight:600}
      #lwModal .lw-ft{display:flex;justify-content:space-between;gap:10px;padding:12px 20px;border-top:1px solid #e5e5e5;background:#faf8f4}
      #lwModal .lw-btn{padding:9px 18px;border-radius:6px;border:1px solid #bbb;background:#fff;cursor:pointer;font-size:14px;font-weight:500}
      #lwModal .lw-btn.primary{background:#8b6f47;color:#fff;border-color:#8b6f47}
      #lwModal .lw-btn.primary:hover{background:#6f5836}
      #lwModal .lw-btn:disabled{opacity:.5;cursor:not-allowed}
      #lwModal .lw-err{color:#c33;font-size:13px;margin-top:8px}
      #lwModal .lw-suggest{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #d0d0d0;border-top:0;border-radius:0 0 6px 6px;max-height:200px;overflow-y:auto;z-index:10;box-shadow:0 4px 12px rgba(0,0,0,.1)}
      #lwModal .lw-sg-item{padding:7px 10px;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:13px}
      #lwModal .lw-sg-item:hover,#lwModal .lw-sg-item.active{background:#f4efe6}
      #lwModal .lw-sg-item .lw-sg-sub{font-size:11px;color:#888;margin-top:2px}
      #lwModal .lw-sg-empty{padding:10px;color:#888;font-size:12px;font-style:italic}
    `;
    const style = document.createElement('style');
    style.id = 'lwStyles'; style.textContent = css; document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'lwModal';
    modal.innerHTML = `
      <div class="lw-box">
        <div class="lw-hd">
          <h3>Create New Lease</h3>
          <button class="lw-x" onclick="closeLeaseWizard()">&times;</button>
        </div>
        <div class="lw-steps" id="lwSteps"></div>
        <div class="lw-body" id="lwBody"></div>
        <div class="lw-ft">
          <button class="lw-btn" id="lwBack" onclick="lwPrev()">&larr; Back</button>
          <div style="flex:1"></div>
          <button class="lw-btn" id="lwSaveDraft" onclick="lwSubmit('draft')">Save as Draft</button>
          <button class="lw-btn primary" id="lwNext" onclick="lwNext()">Next &rarr;</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  window.openNewLeaseWizard = async function(prefill){
    ensureModal();
    wizState = {
      step: 0,
      tenants: [{name:'', email:'', phone:'', application_id:null}],
      building: '', unit: '', property_id: '', property_address: '',
      template_id: '',
      lease_type: 'fixed', // fixed | mtm
      lease_start: '', lease_end: '',
      monthly_rent: '', rent_due_day: 1, security_deposit: '',
      utilities_tenant: [], utilities_landlord: [],
      addendums: {}, // {id: true}
      application_id: prefill?.application_id || null,
      error: ''
    };
    if (prefill?.tenant) wizState.tenants[0] = {name: prefill.tenant||'', email: prefill.email||'', phone: prefill.phone||'', application_id: prefill.application_id||null};
    if (prefill?.property_id) wizState.property_id = prefill.property_id;
    if (prefill?.unit) wizState.unit = prefill.unit;
    if (prefill?.rent) wizState.monthly_rent = prefill.rent;

    document.getElementById('lwModal').style.display = 'flex';
    await lwLoadRefs();

    // After refs are loaded, try to match a property_name string against the loaded buildings
    if (prefill?.property_name && !wizState.building){
      const q = String(prefill.property_name).toLowerCase();
      const blds = getBuildings();
      const m = blds.find(b => b.name.toLowerCase() === q || b.name.toLowerCase().includes(q) || q.includes(b.name.toLowerCase()));
      if (m) wizState.building = m.name;
    }
    lwRender();
  };

  window.closeLeaseWizard = function(){
    const m = document.getElementById('lwModal');
    if (m) m.style.display = 'none';
  };

  async function lwLoadRefs(){
    // CONFIG, SUPA_URL, SUPA_KEY are top-level consts in config.js / app.js — accessible across <script> tags
    const _url = (typeof SUPA_URL !== 'undefined' && SUPA_URL) || (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_URL);
    const _key = (typeof SUPA_KEY !== 'undefined' && SUPA_KEY) || (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_KEY);
    if (!_url || !_key){ console.error('[lease-wizard] No Supabase URL/key found'); return; }
    async function rest(path){
      try {
        const r = await fetch(_url + '/rest/v1/' + path, {
          headers: { apikey: _key, Authorization: 'Bearer ' + _key }
        });
        if (!r.ok) { console.warn('[lease-wizard] REST', path, r.status); return []; }
        return await r.json();
      } catch(e){ console.warn('[lease-wizard] REST failed', path, e); return []; }
    }
    try {
      const [tpls, ads, props, apps] = await Promise.all([
        rest('lease_templates?select=id,name,body_html,is_default,is_active&is_active=eq.true'),
        rest('lease_addendums?select=id,name,description,body_html,requires_signature,is_active&is_active=eq.true'),
        rest('properties?select=apt,name,address,owner,status&limit=500'),
        rest('rental_applications?select=id,first_name,last_name,email,phone,property,unit,status&order=created_at.desc&limit=1000')
      ]);
      templates = tpls || [];
      addendums = ads || [];
      // Prefer admin-loaded propertiesData (avoids RLS / refetch); fall back to REST result
      const adminProps = (typeof window !== 'undefined' && Array.isArray(window.propertiesData)) ? window.propertiesData : null;
      properties = (adminProps && adminProps.length) ? adminProps : (props || []);
      console.log('[lease-wizard] property source:', adminProps && adminProps.length ? 'window.propertiesData' : 'REST', '— count:', properties.length);
      applicants = (apps||[]).map(a => ({
        id: a.id,
        name: ((a.first_name||'') + ' ' + (a.last_name||'')).trim(),
        email: a.email||'', phone: a.phone||'',
        property: a.property||'', unit: a.unit||'', status: a.status||''
      })).filter(a => a.name);
      console.log('[lease-wizard] templates:', templates.length, 'addendums:', addendums.length, 'properties:', properties.length, 'applicants:', applicants.length);
      // Pre-select default template
      const def = templates.find(t => t.is_default);
      if (def && !wizState.template_id) wizState.template_id = def.id;
      // Pre-check all active addendums
      addendums.forEach(a => { if (!(a.id in wizState.addendums)) wizState.addendums[a.id] = true; });
    } catch(e){ console.error('Failed to load refs', e); }
  }

  function lwRender(){
    const stepsEl = document.getElementById('lwSteps');
    stepsEl.innerHTML = WIZ_STEPS.map((s,i) =>
      `<div class="lw-step ${i===wizState.step?'active':i<wizState.step?'done':''}">${i+1}. ${s}</div>`
    ).join('');

    const body = document.getElementById('lwBody');
    body.innerHTML = renderStep();

    document.getElementById('lwBack').style.visibility = wizState.step === 0 ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('lwNext');
    nextBtn.textContent = wizState.step === WIZ_STEPS.length-1 ? 'Save & Send for Signing' : 'Next →';
    nextBtn.className = 'lw-btn primary';
  }

  function renderStep(){
    const err = wizState.error ? `<div class="lw-err">${wizState.error}</div>` : '';
    switch(wizState.step){
      case 0: return renderTenants() + err;
      case 1: return renderProperty() + err;
      case 2: return renderTerms() + err;
      case 3: return renderUtilities() + err;
      case 4: return renderAddendums() + err;
      case 5: return renderReview() + err;
    }
    return '';
  }

  function renderTenants(){
    const rows = wizState.tenants.map((t,i) => `
      <div class="lw-tenant">
        <div style="position:relative">
          <label>Tenant ${i+1} name</label>
          <input type="text" id="lwTName${i}" value="${esc(t.name)}" autocomplete="off"
                 oninput="lwNameInput(${i},this.value)" onfocus="lwNameInput(${i},this.value)" onblur="setTimeout(()=>lwCloseSuggest(${i}),150)"
                 placeholder="Type name…">
          <div class="lw-suggest" id="lwSuggest${i}" style="display:none"></div>
        </div>
        <div><label>Email</label>
          <input type="email" id="lwTEmail${i}" value="${esc(t.email)}" oninput="lwSetT(${i},'email',this.value)" placeholder="email@example.com"></div>
        <div><label>Phone</label>
          <input type="tel" id="lwTPhone${i}" value="${esc(t.phone)}" oninput="lwSetT(${i},'phone',this.value)" placeholder="(opt.)"></div>
        <button class="lw-del" onclick="lwDelT(${i})" ${wizState.tenants.length===1?'disabled':''}>&times;</button>
      </div>`).join('');
    const hint = applicants.length
      ? `<div style="font-size:12px;color:#777;margin:-4px 0 10px">Start typing — matches from your ${applicants.length} applications will appear.</div>`
      : `<div style="font-size:12px;color:#c83;margin:-4px 0 10px">No applications loaded — enter tenant info manually.</div>`;
    return `<h4 style="margin:0 0 12px">Tenants on this lease</h4>${hint}${rows}
      <button class="lw-add" onclick="lwAddT()">+ Add another tenant</button>`;
  }

  // Group properties into buildings.
  // A "building" key is the address (preferred) or the name with the unit suffix stripped.
  function buildingKeyFor(p){
    if (!p) return '';
    var addr = (typeof p.address === 'object' && p.address)
      ? (p.address.street || p.address.address1 || p.address.line1 || '')
      : (p.address || '');
    addr = String(addr || '').trim();
    if (addr) return addr;
    // Fallback: strip unit/apt suffix from name or apt
    var src = String(p.name || p.apt || '').trim();
    return src.replace(/\s*[#\-,]?\s*(apt|unit|suite|ste|#)\s*[\w\-]+\s*$/i, '').trim() || src;
  }
  function unitLabelFor(p){
    // Display-friendly unit label: try to extract suffix; else use full apt/name
    var src = String(p.apt || p.name || '').trim();
    var m = src.match(/\b(?:apt|unit|suite|ste|#)\s*([\w\-]+)\s*$/i);
    if (m) return m[1];
    var bk = buildingKeyFor(p);
    if (bk && src.toLowerCase().indexOf(bk.toLowerCase()) === 0){
      var rest = src.slice(bk.length).replace(/^[\s,#\-]+/, '').trim();
      if (rest) return rest;
    }
    return src;
  }

  function getBuildings(){
    var map = {};
    properties.forEach(function(p){
      if (p.status && String(p.status).toLowerCase() === 'inactive') return; // skip inactive
      var k = buildingKeyFor(p) || '(Unspecified)';
      if (!map[k]) map[k] = [];
      map[k].push(p);
    });
    return Object.keys(map).sort().map(function(k){ return { name: k, units: map[k] }; });
  }

  function renderProperty(){
    var buildings = getBuildings();
    if (!buildings.length){
      return '<div style="color:#c33;font-size:13px;padding:14px;background:#fff4f4;border-radius:6px">No properties available. Open the Properties tab and confirm at least one is loaded, then re-open this wizard.</div>';
    }
    var bldOpts = buildings.map(function(b){
      return `<option value="${esc(b.name)}" ${wizState.building===b.name?'selected':''}>${esc(b.name)} (${b.units.length})</option>`;
    }).join('');
    var sel = buildings.find(function(b){ return b.name === wizState.building; });
    var unitOpts = sel ? sel.units.map(function(p){
      var ul = unitLabelFor(p);
      return `<option value="${esc(ul)}" ${wizState.unit===ul?'selected':''}>${esc(ul)}${p.owner?' — '+esc(p.owner):''}</option>`;
    }).join('') : '';
    return `
      <label>Building / Property address</label>
      <select onchange="lwPickBuilding(this.value)">
        <option value="">-- Select building --</option>
        ${bldOpts}
      </select>
      <label>Apartment / Unit</label>
      <select onchange="lwSet('unit',this.value)" ${sel ? '' : 'disabled'}>
        <option value="">${sel ? '-- Select unit --' : '(pick a building first)'}</option>
        ${unitOpts}
      </select>
      <label style="margin-top:14px;font-size:11px;color:#888">Or type unit manually:</label>
      <input type="text" value="${esc(wizState.unit)}" oninput="lwSet('unit',this.value)" placeholder="e.g. 301">
    `;
  }
  window.lwPickBuilding = function(name){
    wizState.building = name || '';
    wizState.unit = ''; // reset unit when building changes
    // Sync legacy property_id if a building maps to a single property record
    var b = getBuildings().find(function(x){ return x.name === name; });
    if (b && b.units.length === 1) wizState.unit = unitLabelFor(b.units[0]);
    lwRender();
  };

  function renderTerms(){
    const tplOpts = templates.map(t => `<option value="${t.id}" ${wizState.template_id===t.id?'selected':''}>${esc(t.name)}${t.is_default?' (default)':''}</option>`).join('');
    return `
      <label>Lease template</label>
      <select onchange="lwSet('template_id',this.value)">
        <option value="">-- Select template --</option>
        ${tplOpts}
      </select>
      <div class="lw-row">
        <div><label>Lease type</label>
          <select onchange="lwSet('lease_type',this.value)">
            <option value="fixed" ${wizState.lease_type==='fixed'?'selected':''}>Fixed Term</option>
            <option value="mtm" ${wizState.lease_type==='mtm'?'selected':''}>Month-to-Month</option>
          </select></div>
        <div><label>Rent due on (day of month)</label>
          <input type="number" min="1" max="31" value="${wizState.rent_due_day}" oninput="lwSet('rent_due_day',parseInt(this.value)||1)"></div>
      </div>
      <div class="lw-row">
        <div><label>Lease start</label>
          <input type="date" value="${esc(wizState.lease_start)}" oninput="lwSet('lease_start',this.value)"></div>
        <div><label>Lease end ${wizState.lease_type==='mtm'?'(N/A for MTM)':''}</label>
          <input type="date" value="${esc(wizState.lease_end)}" oninput="lwSet('lease_end',this.value)" ${wizState.lease_type==='mtm'?'disabled':''}></div>
      </div>
      <div class="lw-row">
        <div><label>Monthly rent ($)</label>
          <input type="number" step="0.01" value="${esc(wizState.monthly_rent)}" oninput="lwSet('monthly_rent',this.value)"></div>
        <div><label>Security deposit ($)</label>
          <input type="number" step="0.01" value="${esc(wizState.security_deposit)}" oninput="lwSet('security_deposit',this.value)"></div>
      </div>
    `;
  }

  function renderUtilities(){
    const grid = (who) => UTILITIES.map(u => `
      <label class="lw-chk"><input type="checkbox"
        ${wizState['utilities_'+who].includes(u)?'checked':''}
        onchange="lwToggleUtil('${who}','${u}',this.checked)"> ${u}</label>`).join('');
    return `
      <h4 style="margin:0 0 8px">Paid by Tenant</h4>
      <div class="lw-chk-grid">${grid('tenant')}</div>
      <h4 style="margin:18px 0 8px">Paid by Landlord</h4>
      <div class="lw-chk-grid">${grid('landlord')}</div>
    `;
  }

  function renderAddendums(){
    if (!addendums.length) return '<div style="color:#777">No active addendums configured.</div>';
    return addendums.map(a => `
      <label class="lw-addendum">
        <input type="checkbox" ${wizState.addendums[a.id]?'checked':''} onchange="lwToggleAdd('${a.id}',this.checked)">
        <div>
          <div class="lw-ad-name">${esc(a.name)}${a.requires_signature?' &nbsp;<span style="font-size:11px;color:#8b6f47">(requires sig)</span>':''}</div>
          <div class="lw-ad-desc">${esc(a.description || '')}</div>
        </div>
      </label>`).join('');
  }

  function renderReview(){
    const tplName = templates.find(t=>t.id===wizState.template_id)?.name || '—';
    const propName = wizState.building || '—';
    const selAdds = addendums.filter(a => wizState.addendums[a.id]).map(a=>a.name);
    return `
      <div class="lw-review-sec"><h4>Tenants</h4>
        ${wizState.tenants.map(t=>`<div class="kv"><b>${esc(t.name||'—')}</b> ${esc(t.email||'')} ${esc(t.phone||'')}</div>`).join('')}</div>
      <div class="lw-review-sec"><h4>Property</h4>
        <div class="kv"><b>Property:</b> ${esc(propName)}</div>
        <div class="kv"><b>Unit:</b> ${esc(wizState.unit||'—')}</div></div>
      <div class="lw-review-sec"><h4>Terms</h4>
        <div class="kv"><b>Template:</b> ${esc(tplName)}</div>
        <div class="kv"><b>Type:</b> ${wizState.lease_type==='fixed'?'Fixed Term':'Month-to-Month'}</div>
        <div class="kv"><b>Start:</b> ${esc(wizState.lease_start||'—')}</div>
        ${wizState.lease_type==='fixed'?`<div class="kv"><b>End:</b> ${esc(wizState.lease_end||'—')}</div>`:''}
        <div class="kv"><b>Rent:</b> $${esc(wizState.monthly_rent||'0')} on day ${wizState.rent_due_day}</div>
        <div class="kv"><b>Security deposit:</b> $${esc(wizState.security_deposit||'0')}</div></div>
      <div class="lw-review-sec"><h4>Utilities</h4>
        <div class="kv"><b>Tenant pays:</b> ${wizState.utilities_tenant.join(', ')||'—'}</div>
        <div class="kv"><b>Landlord pays:</b> ${wizState.utilities_landlord.join(', ')||'—'}</div></div>
      <div class="lw-review-sec"><h4>Addendums (${selAdds.length})</h4>
        <div class="kv">${selAdds.length?selAdds.map(n=>`<span style="background:#f4efe6;padding:3px 8px;border-radius:4px;margin-right:4px;font-size:12px">${esc(n)}</span>`).join(''):'—'}</div></div>
      <div class="lw-review-sec" style="background:#eef1f8;border-left:4px solid #1a2874;padding:12px;border-radius:5px;border-bottom:0">
        <h4 style="color:#1a2874">What happens when you click Send</h4>
        <div style="font-size:13px;color:#1a2874;margin-bottom:8px">Each tenant will receive a secure signing link via:</div>
        ${wizState.tenants.map(t => `
          <div class="kv" style="align-items:center">
            <b>${esc(t.name||'—')}</b>
            <span style="color:${t.email?'#1f7a4d':'#b83228'}">✉ ${t.email ? esc(t.email) : 'NO EMAIL — will fail'}</span>
            <span style="color:${t.phone?'#1f7a4d':'#8a93a8'}">📱 ${t.phone ? esc(t.phone) : 'no phone — SMS will be skipped'}</span>
          </div>`).join('')}
        <div style="font-size:12px;color:#5a6378;margin-top:8px">
          Email via DNSMadeEasy SMTP · SMS via your messaging provider. Each link is unique per tenant. You'll get a delivery report after sending.
        </div>
      </div>
    `;
  }

  // ── State mutators (exposed to inline handlers) ──
  window.lwSet = (k,v) => { wizState[k] = v; if (k==='lease_type' && v==='mtm') wizState.lease_end=''; lwRender(); };
  window.lwSetT = (i,k,v) => { wizState.tenants[i][k] = v; };

  window.lwNameInput = (i, val) => {
    wizState.tenants[i].name = val;
    const q = (val||'').toLowerCase().trim();
    const box = document.getElementById('lwSuggest'+i);
    if (!box) return;
    if (!q){ box.style.display='none'; return; }
    const matches = applicants.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.email||'').toLowerCase().includes(q)
    ).slice(0, 8);
    if (!matches.length){
      box.innerHTML = `<div class="lw-sg-empty">No match — continue typing to add manually.</div>`;
      box.style.display = 'block';
      return;
    }
    box.innerHTML = matches.map(m => {
      const sub = [m.email, m.phone, m.property&&m.unit?(m.property+' / '+m.unit):(m.property||''), m.status].filter(Boolean).join(' · ');
      return `<div class="lw-sg-item" onmousedown="lwPickApplicant(${i},'${m.id}')">
        <div><strong>${esc(m.name)}</strong></div>
        <div class="lw-sg-sub">${esc(sub)}</div></div>`;
    }).join('');
    box.style.display = 'block';
  };

  window.lwCloseSuggest = (i) => {
    const box = document.getElementById('lwSuggest'+i);
    if (box) box.style.display = 'none';
  };

  window.lwPickApplicant = (i, id) => {
    const a = applicants.find(x => x.id === id);
    if (!a) return;
    wizState.tenants[i] = { name: a.name, email: a.email, phone: a.phone, application_id: a.id };
    // Auto-fill building/unit/application_id on first tenant pick if still empty
    if (i === 0){
      if (!wizState.application_id) wizState.application_id = a.id;
      if (!wizState.unit && a.unit) wizState.unit = a.unit;
      // Match applicant.property (text) to building list
      if (!wizState.building && a.property){
        const blds = getBuildings();
        const q = a.property.toLowerCase();
        const m = blds.find(b => b.name.toLowerCase() === q || b.name.toLowerCase().includes(q) || q.includes(b.name.toLowerCase()));
        if (m) wizState.building = m.name;
      }
    }
    lwCloseSuggest(i);
    lwRender();
  };
  window.lwAddT = () => { wizState.tenants.push({name:'',email:'',phone:'',application_id:null}); lwRender(); };
  window.lwDelT = (i) => { if (wizState.tenants.length>1){ wizState.tenants.splice(i,1); lwRender(); } };
  window.lwToggleUtil = (who, util, on) => {
    const arr = wizState['utilities_'+who];
    const idx = arr.indexOf(util);
    if (on && idx<0) arr.push(util);
    if (!on && idx>=0) arr.splice(idx,1);
  };
  window.lwToggleAdd = (id, on) => { wizState.addendums[id] = on; };

  window.lwPrev = () => { if (wizState.step>0){ wizState.step--; wizState.error=''; lwRender(); } };
  window.lwNext = () => {
    const err = validateStep();
    if (err){ wizState.error = err; lwRender(); return; }
    wizState.error = '';
    if (wizState.step < WIZ_STEPS.length - 1){ wizState.step++; lwRender(); }
    else { lwSubmit('send'); }
  };

  function validateStep(){
    if (wizState.step === 0){
      if (!wizState.tenants.length) return 'Add at least one tenant';
      for (const t of wizState.tenants){
        if (!t.name.trim()) return 'Every tenant needs a name';
        if (!t.email.trim() || !/^\S+@\S+\.\S+$/.test(t.email)) return 'Every tenant needs a valid email';
      }
    }
    if (wizState.step === 1){
      if (!wizState.building.trim()) return 'Pick a building';
      if (!wizState.unit.trim()) return 'Pick or enter the unit';
    }
    if (wizState.step === 2){
      if (!wizState.template_id) return 'Pick a lease template';
      if (!wizState.lease_start) return 'Set the lease start date';
      if (wizState.lease_type==='fixed' && !wizState.lease_end) return 'Set the lease end date';
      if (!wizState.monthly_rent || isNaN(parseFloat(wizState.monthly_rent))) return 'Enter a monthly rent amount';
    }
    return '';
  }

  window.lwSubmit = async function(action){
    const err = (action==='send') ? validateStep() : '';
    if (err){ wizState.error = err; lwRender(); return; }
    const btn = document.getElementById('lwNext');
    if (btn){ btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      const s = sb(); if (!s) throw new Error('No Supabase client');
      const tpl = templates.find(t => t.id === wizState.template_id);
      const tenants = wizState.tenants;
      const snapshot = buildSnapshot(tpl, tenants);
      // property = building name (text column on leases table)
      const propText = wizState.building || '';
      // Schema lease_type values: 'lt' or 'mtm' (not 'fixed')
      const leaseTypeDb = wizState.lease_type === 'fixed' ? 'lt' : wizState.lease_type;

      const lease = {
        property: propText,
        unit: wizState.unit,
        landlord_name: 'Willow Partnership',
        template_id: wizState.template_id || null,
        lease_type: leaseTypeDb,
        lease_start: wizState.lease_start || null,
        lease_end: leaseTypeDb === 'lt' ? (wizState.lease_end || null) : null,
        monthly_rent: parseFloat(wizState.monthly_rent) || 0,
        security_deposit: parseFloat(wizState.security_deposit) || 0,
        utilities_included: [...wizState.utilities_landlord], // schema only stores landlord-paid
        status: action === 'send' ? 'out_for_signature' : 'draft',
        body_html_snapshot: snapshot,
        sent_at: action === 'send' ? new Date().toISOString() : null,
        created_from_application_id: wizState.application_id || null,
        created_by: 'admin'
      };

      const { data: leaseRow, error: le } = await s.from('leases').insert(lease).select().single();
      if (le) throw le;

      // Tenants as signers — schema: name, sign_order, application_id, signature_png
      const signers = tenants.map((t, i) => ({
        lease_id: leaseRow.id,
        role: 'tenant',
        sign_order: i + 1,
        name: t.name,
        email: t.email,
        phone: t.phone || null,
        application_id: t.application_id || null
      }));
      // Landlord signer (countersigns last)
      signers.push({
        lease_id: leaseRow.id,
        role: 'landlord',
        sign_order: 99,
        name: lease.landlord_name,
        email: 'kevin@willowpa.com'
      });
      const { error: se } = await s.from('lease_signers').insert(signers);
      if (se) throw se;

      // Selected addendums snapshot
      const selAds = addendums.filter(a => wizState.addendums[a.id]).map((a, i) => ({
        lease_id: leaseRow.id,
        addendum_id: a.id,
        sort_order: i,
        name_snapshot: a.name,
        body_html_snapshot: a.body_html,
        requires_signature: a.requires_signature
      }));
      if (selAds.length) {
        const { error: ae } = await s.from('lease_addendums_selected').insert(selAds);
        if (ae) console.warn('addendum insert', ae);
      }

      // Events (schema: lease_events has only `meta` jsonb — no actor/metadata cols)
      await s.from('lease_events').insert([
        { lease_id: leaseRow.id, event_type: 'created', meta: { actor: 'admin' } },
        ...(action === 'send' ? [{ lease_id: leaseRow.id, event_type: 'sent', meta: { actor: 'admin' } }] : [])
      ]);

      // Send signing requests via EMAIL + SMS
      let sendReport = null;
      if (action === 'send') {
        const { data: ins } = await s.from('lease_signers')
          .select('id,name,email,phone,signing_token')
          .eq('lease_id', leaseRow.id).eq('role', 'tenant');
        sendReport = await sendSigningRequests(ins || [], leaseRow, lease);
      }

      closeLeaseWizard();
      if (action === 'send' && sendReport){
        alert(
          `Lease sent for signing.\n\n` +
          `Email: ${sendReport.emailOk}/${sendReport.total} delivered` +
          (sendReport.emailFail.length ? ` (failed: ${sendReport.emailFail.join(', ')})` : '') + `\n` +
          `SMS:   ${sendReport.smsOk}/${sendReport.smsAttempt} delivered` +
          (sendReport.smsFail.length ? ` (failed: ${sendReport.smsFail.join(', ')})` : '') +
          (sendReport.smsSkipped.length ? `\nSkipped (no phone): ${sendReport.smsSkipped.join(', ')}` : '')
        );
      } else {
        alert('Draft lease saved.');
      }
      if (typeof loadLeases === 'function') loadLeases();
    } catch(e){
      console.error(e);
      wizState.error = 'Save failed: ' + (e.message||e);
      lwRender();
    } finally {
      if (btn){ btn.disabled = false; }
    }
  };

  // Send email + SMS signing requests to each tenant, log lease_events for each attempt.
  // Returns a report used in the post-send confirmation dialog.
  async function sendSigningRequests(signers, leaseRow, lease){
    const s = sb();
    const report = { total: signers.length, emailOk: 0, emailFail: [], smsOk: 0, smsAttempt: 0, smsFail: [], smsSkipped: [] };
    const events = [];

    const propLine = (lease.property || '') + (lease.unit ? ' · Unit ' + lease.unit : '');
    const rentStr  = '$' + (parseFloat(lease.monthly_rent)||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    const termStr  = lease.lease_type === 'mtm'
      ? 'Month-to-Month starting ' + (lease.lease_start||'')
      : (lease.lease_start||'') + ' → ' + (lease.lease_end||'');

    for (const sg of signers){
      const link = `https://app.willowpa.com/sign.html?token=${sg.signing_token}`;

      // ─── EMAIL ───
      try {
        const subject = `Your lease from Willow Partnership is ready to sign — ${propLine}`;
        const bodyHtml = `
          <p>Hi ${escapeHtml(sg.name||'')},</p>
          <p>Your residential lease agreement for <b>${escapeHtml(propLine)}</b> is ready for your electronic signature.</p>
          <p><b>Term:</b> ${escapeHtml(termStr)}<br>
             <b>Rent:</b> ${rentStr} / month</p>
          <p style="margin:24px 0">
            <a href="${link}" style="background:#1a2874;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">
              Review &amp; Sign Your Lease
            </a>
          </p>
          <p style="font-size:12px;color:#666">Or paste this link into your browser:<br><a href="${link}">${link}</a></p>
          <p style="font-size:12px;color:#666">This link is unique to you and should not be shared. If you have questions, reply to this email or call (267) 865-0001.</p>
          <p>— Willow Partnership</p>`;
        if (typeof sendEmail === 'function' && sg.email){
          sendEmail(sg.email, subject, bodyHtml);
          report.emailOk++;
          events.push({ lease_id: leaseRow.id, signer_id: sg.id, event_type: 'email_sent',
            meta: { channel: 'email', to: sg.email, link, actor: 'system' } });
        } else {
          throw new Error('sendEmail() not available or no email on record');
        }
      } catch(e){
        report.emailFail.push(sg.name || sg.email || 'unknown');
        events.push({ lease_id: leaseRow.id, signer_id: sg.id, event_type: 'email_failed',
          meta: { channel: 'email', to: sg.email, error: String(e.message||e), actor: 'system' } });
      }

      // ─── SMS ───
      if (sg.phone){
        report.smsAttempt++;
        try {
          const smsText = `Willow Partnership: your lease for ${propLine} is ready to sign. Open this secure link to review & sign: ${link}`;
          if (typeof sendSMS === 'function'){
            sendSMS(sg.phone, smsText);
            report.smsOk++;
            events.push({ lease_id: leaseRow.id, signer_id: sg.id, event_type: 'sms_sent',
              meta: { channel: 'sms', to: sg.phone, link, actor: 'system' } });
          } else {
            throw new Error('sendSMS() not available');
          }
        } catch(e){
          report.smsFail.push(sg.name || sg.phone || 'unknown');
          events.push({ lease_id: leaseRow.id, signer_id: sg.id, event_type: 'sms_failed',
            meta: { channel: 'sms', to: sg.phone, error: String(e.message||e), actor: 'system' } });
        }
      } else {
        report.smsSkipped.push(sg.name || sg.email || 'unknown');
      }
    }

    if (events.length) {
      try { await s.from('lease_events').insert(events); } catch(e){ console.warn('lease_events insert:', e); }
    }
    return report;
  }

  function buildSnapshot(tpl, tenants){
    if (!tpl) return '';
    const tenantList = tenants.map(t => t.name).join(', ');
    const sigBlocks = tenants.map(t => `
      <div class="sig-block">
        <div>Tenant: <strong>${escapeHtml(t.name)}</strong></div>
        <div>Signature: ____________________&nbsp;&nbsp;Date: __________</div>
      </div>`).join('');
    const tokens = {
      TENANT_NAMES: escapeHtml(tenantList),
      TENANT_SIGNATURE_BLOCKS: sigBlocks,
      PROPERTY_ADDRESS: escapeHtml(wizState.building || ''),
      UNIT: escapeHtml(wizState.unit),
      LEASE_START: wizState.lease_start||'',
      LEASE_END: wizState.lease_end||'Month-to-Month',
      MONTHLY_RENT: parseFloat(wizState.monthly_rent||0).toFixed(2),
      RENT_DUE_DAY: wizState.rent_due_day,
      SECURITY_DEPOSIT: parseFloat(wizState.security_deposit||0).toFixed(2),
      LANDLORD_NAME: 'Willow Partnership',
      UTILITIES_TENANT: wizState.utilities_tenant.join(', ')||'None',
      UTILITIES_LANDLORD: wizState.utilities_landlord.join(', ')||'None'
    };
    return (tpl.body_html||'').replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => (k in tokens) ? tokens[k] : `{{${k}}}`);
  }

  function esc(v){ return String(v==null?'':v).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
  function escapeHtml(v){ return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Simple CSV export stub
  window.exportLeasesCSV = async function(){
    const s = sb(); if (!s) return alert('No DB connection');
    const { data } = await s.from('leases').select('id,unit,status,lease_start,lease_end,monthly_rent,landlord_name');
    if (!data?.length) return alert('No leases to export.');
    const hdr = 'ID,Unit,Status,Start,End,Rent,Landlord';
    const rows = data.map(l => [l.id,l.unit,l.status,l.lease_start||'',l.lease_end||'',l.monthly_rent||'',l.landlord_name||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
    const csv = [hdr,...rows].join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `leases-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

})();
