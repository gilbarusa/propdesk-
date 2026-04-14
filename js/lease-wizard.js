/* ═══ LEASE WIZARD — Create Lease + send for signing ═══
   v2026-04-14 1935
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

  function sb(){ return window.supa || window.supabaseClient || null; }

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
      tenants: [{name:'', email:'', phone:''}],
      property_id: '', unit: '', property_address: '',
      template_id: '',
      lease_type: 'fixed', // fixed | mtm
      lease_start: '', lease_end: '',
      monthly_rent: '', rent_due_day: 1, security_deposit: '',
      utilities_tenant: [], utilities_landlord: [],
      addendums: {}, // {id: true}
      application_id: prefill?.application_id || null,
      error: ''
    };
    if (prefill?.tenant) wizState.tenants[0] = {name: prefill.tenant||'', email: prefill.email||'', phone: prefill.phone||''};
    if (prefill?.property_id) wizState.property_id = prefill.property_id;
    if (prefill?.unit) wizState.unit = prefill.unit;
    if (prefill?.rent) wizState.monthly_rent = prefill.rent;

    document.getElementById('lwModal').style.display = 'flex';
    await lwLoadRefs();
    lwRender();
  };

  window.closeLeaseWizard = function(){
    const m = document.getElementById('lwModal');
    if (m) m.style.display = 'none';
  };

  async function lwLoadRefs(){
    const s = sb(); if (!s) return;
    try {
      const [{data: tpls}, {data: ads}, {data: props}] = await Promise.all([
        s.from('lease_templates').select('id,name,body_html,is_default,is_active').eq('is_active', true),
        s.from('lease_addendums').select('id,name,description,body_html,requires_signature,is_active').eq('is_active', true),
        s.from('properties').select('id,name,address').limit(500)
      ]);
      templates = tpls || [];
      addendums = ads || [];
      properties = props || [];
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
        <div><label>Tenant ${i+1} name</label>
          <input type="text" value="${esc(t.name)}" oninput="lwSetT(${i},'name',this.value)" placeholder="Full name"></div>
        <div><label>Email</label>
          <input type="email" value="${esc(t.email)}" oninput="lwSetT(${i},'email',this.value)" placeholder="email@example.com"></div>
        <div><label>Phone</label>
          <input type="tel" value="${esc(t.phone)}" oninput="lwSetT(${i},'phone',this.value)" placeholder="(opt.)"></div>
        <button class="lw-del" onclick="lwDelT(${i})" ${wizState.tenants.length===1?'disabled':''}>&times;</button>
      </div>`).join('');
    return `<h4 style="margin:0 0 12px">Tenants on this lease</h4>${rows}
      <button class="lw-add" onclick="lwAddT()">+ Add another tenant</button>`;
  }

  function renderProperty(){
    const propOpts = properties.map(p => `<option value="${p.id}" ${wizState.property_id===p.id?'selected':''}>${esc(p.name||p.address||p.id)}</option>`).join('');
    return `
      <label>Property</label>
      <select onchange="lwSet('property_id',this.value)">
        <option value="">-- Select property --</option>
        ${propOpts}
      </select>
      <label>Unit</label>
      <input type="text" value="${esc(wizState.unit)}" oninput="lwSet('unit',this.value)" placeholder="e.g. 301">
    `;
  }

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
    const prop = properties.find(p=>p.id===wizState.property_id);
    const propName = prop ? (prop.name||prop.address) : '—';
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
      <div style="padding:10px;background:#f4efe6;border-radius:6px;font-size:13px;color:#5b4a2e">
        <strong>Next step:</strong> Clicking <em>Save & Send for Signing</em> will create the lease, generate signing links for each tenant, and log email_queued events. (Real email delivery wires up in Phase 6.)
      </div>
    `;
  }

  // ── State mutators (exposed to inline handlers) ──
  window.lwSet = (k,v) => { wizState[k] = v; if (k==='lease_type' && v==='mtm') wizState.lease_end=''; lwRender(); };
  window.lwSetT = (i,k,v) => { wizState.tenants[i][k] = v; };
  window.lwAddT = () => { wizState.tenants.push({name:'',email:'',phone:''}); lwRender(); };
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
      if (!wizState.property_id) return 'Pick a property';
      if (!wizState.unit.trim()) return 'Enter the unit';
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
      const prop = properties.find(p=>p.id===wizState.property_id);

      const lease = {
        application_id: wizState.application_id,
        template_id: wizState.template_id,
        property_id: wizState.property_id,
        unit: wizState.unit,
        lease_type: wizState.lease_type,
        lease_start: wizState.lease_start || null,
        lease_end: wizState.lease_type==='fixed' ? (wizState.lease_end||null) : null,
        monthly_rent: parseFloat(wizState.monthly_rent)||0,
        rent_due_day: wizState.rent_due_day,
        security_deposit: parseFloat(wizState.security_deposit)||0,
        utilities_tenant: wizState.utilities_tenant,
        utilities_landlord: wizState.utilities_landlord,
        status: action==='send' ? 'out_for_signature' : 'draft',
        body_html_snapshot: snapshot,
        sent_at: action==='send' ? new Date().toISOString() : null,
        landlord_name: 'Willow Partnership',
        landlord_email: 'kevin@willowpa.com'
      };

      const { data: leaseRow, error: le } = await s.from('leases').insert(lease).select().single();
      if (le) throw le;

      // Tenants as signers
      const signers = tenants.map((t,i) => ({
        lease_id: leaseRow.id,
        role: 'tenant',
        sort_order: i,
        full_name: t.name,
        email: t.email,
        phone: t.phone || null
      }));
      // Landlord signer (countersigns)
      signers.push({
        lease_id: leaseRow.id,
        role: 'landlord',
        sort_order: 99,
        full_name: lease.landlord_name,
        email: lease.landlord_email
      });
      const { error: se } = await s.from('lease_signers').insert(signers);
      if (se) throw se;

      // Selected addendums snapshot
      const selAds = addendums.filter(a => wizState.addendums[a.id]).map((a,i) => ({
        lease_id: leaseRow.id,
        addendum_id: a.id,
        sort_order: i,
        name_snapshot: a.name,
        body_html_snapshot: a.body_html,
        requires_signature: a.requires_signature
      }));
      if (selAds.length){
        const { error: ae } = await s.from('lease_addendums_selected').insert(selAds);
        if (ae) console.warn('addendum insert', ae);
      }

      // Events
      await s.from('lease_events').insert([
        { lease_id: leaseRow.id, event_type: 'created', actor: 'admin' },
        ...(action==='send' ? [{ lease_id: leaseRow.id, event_type: 'sent', actor: 'admin' }] : [])
      ]);

      // Queue signing emails (stub)
      if (action==='send'){
        const { data: ins } = await s.from('lease_signers').select('id,full_name,email,signing_token').eq('lease_id', leaseRow.id).eq('role','tenant');
        const evts = (ins||[]).map(sg => ({
          lease_id: leaseRow.id,
          event_type: 'email_queued',
          actor: 'system',
          metadata: { signer_id: sg.id, email: sg.email, token: sg.signing_token, link: `https://app.willowpa.com/sign.php?token=${sg.signing_token}` }
        }));
        if (evts.length) await s.from('lease_events').insert(evts);
      }

      closeLeaseWizard();
      alert(action==='send'
        ? `Lease created and sent for signing to ${tenants.length} tenant(s).`
        : 'Draft lease saved.');
      if (typeof loadLeases === 'function') loadLeases();
    } catch(e){
      console.error(e);
      wizState.error = 'Save failed: ' + (e.message||e);
      lwRender();
    } finally {
      if (btn){ btn.disabled = false; }
    }
  };

  function buildSnapshot(tpl, tenants){
    if (!tpl) return '';
    const tenantList = tenants.map(t => t.name).join(', ');
    const sigBlocks = tenants.map(t => `
      <div class="sig-block">
        <div>Tenant: <strong>${escapeHtml(t.name)}</strong></div>
        <div>Signature: ____________________&nbsp;&nbsp;Date: __________</div>
      </div>`).join('');
    const prop = properties.find(p=>p.id===wizState.property_id);
    const tokens = {
      TENANT_NAMES: escapeHtml(tenantList),
      TENANT_SIGNATURE_BLOCKS: sigBlocks,
      PROPERTY_ADDRESS: escapeHtml(prop ? (prop.address||prop.name||'') : ''),
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
