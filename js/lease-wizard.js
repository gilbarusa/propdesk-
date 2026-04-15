/* ═══ LEASE WIZARD — Create Lease + send for signing ═══
   v2026-04-14 2335 — Address dropdown shows street+city+state+zip; full address saved to lease.property
   Depends on: window.supa (shared Supabase client from app.js)
   Invoked by: leaseAction('newLease') in app.js
*/
(function(){
  'use strict';

  const LEASE_WIZARD_VERSION = '20260415-1200';
  try { console.log('%c[lease-wizard] loaded v' + LEASE_WIZARD_VERSION, 'background:#1a2874;color:#fff;padding:2px 8px;border-radius:3px'); } catch(e){}
  window.LEASE_WIZARD_VERSION = LEASE_WIZARD_VERSION;

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
      monthly_rent: '', rent_due_day: 1, security_deposit: '', last_month_rent: '',
      extra_charges: [], // [{label, amount, note}]
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
        rest('lease_templates?select=id,name,body_html,is_default,active&active=eq.true'),
        rest('lease_addendum_library?select=id,name,body_html,requires_signature,active,sort_order&active=eq.true&order=sort_order.asc'),
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

  // ── Address handling ──
  // Properties may store address as a string ("46 Township Line Rd") OR an object {street, city, state, zip}.
  // Other address pieces live in p.city, p.state, p.zip (if set).
  // Returns true if a string looks like a real street (e.g. "431 Valley Rd"),
  // not an apt identifier ("A1", "3", "Studio").
  function looksLikeStreet(s){
    if (!s) return false;
    var str = String(s).trim();
    // Numbered street: "46 Township Line Rd", "7845 Montgomery Ave"
    if (/^\s*\d+[A-Za-z]?\s+\S/.test(str)) return true;
    // Named street ending in a common type: "Valley Road", "Fox Chase Road", "Central Avenue"
    if (str.length >= 5 && /\b(road|rd|street|st|avenue|ave|blvd|boulevard|lane|ln|drive|dr|court|ct|place|pl|terrace|ter|parkway|pkwy|highway|hwy|circle|cir|square|sq|trail|trl|way)\.?\s*$/i.test(str)) return true;
    return false;
  }
  function getStreet(p){
    if (!p) return '';
    // Collect every candidate field that might hold a street
    var candidates = [];
    var a = p.address;
    if (typeof a === 'object' && a){
      candidates.push(a.address1, a.line1, a.street, a.address, a.full_address);
    } else if (a){
      candidates.push(a);
    }
    candidates.push(p.address1, p.line1, p.street, p.full_address);
    // Prefer the first one that looks like a real street; else longest non-empty
    for (var i=0; i<candidates.length; i++){
      if (looksLikeStreet(candidates[i])) return String(candidates[i]).trim();
    }
    var best = '';
    for (var j=0; j<candidates.length; j++){
      var v = candidates[j] ? String(candidates[j]).trim() : '';
      if (v.length > best.length) best = v;
    }
    return best;
  }
  function getCity(p){
    if (typeof p.address === 'object' && p.address && p.address.city) return String(p.address.city).trim();
    return String(p.city || '').trim();
  }
  function getState(p){
    if (typeof p.address === 'object' && p.address && p.address.state) return String(p.address.state).trim();
    return String(p.state || '').trim();
  }
  function getZip(p){
    if (typeof p.address === 'object' && p.address && (p.address.zip || p.address.postal_code)) return String(p.address.zip || p.address.postal_code).trim();
    return String(p.zip || p.postal_code || '').trim();
  }
  function formatBuildingAddress(p){
    var street = getStreet(p);
    var city   = getCity(p);
    var state  = getState(p);
    var zip    = getZip(p);
    var line2  = [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    return [street, line2].filter(Boolean).join(', ');
  }

  // Normalize a street string: lowercase, collapse spaces, expand common
  // abbreviations so "46 Township Line Rd" and "46 Township Line Road" hash equal.
  function normalizeStreet(street){
    if (!street) return '';
    var s = String(street).toLowerCase().trim();
    // Strip apt/unit suffixes that sometimes leak into the street field
    s = s.replace(/[,\s]+(apt|unit|suite|ste|#)\s*[\w\-]+\s*$/i, '').trim();
    // Collapse multiple whitespace
    s = s.replace(/\s+/g,' ');
    // Expand common street-type abbreviations
    var types = {
      'rd':'road','st':'street','ave':'avenue','av':'avenue',
      'blvd':'boulevard','ln':'lane','dr':'drive','ct':'court',
      'pl':'place','ter':'terrace','pkwy':'parkway','hwy':'highway',
      'cir':'circle','sq':'square','tr':'trail','trl':'trail'
    };
    s = s.replace(/\b([a-z]+)\.?\b/g, function(_, w){
      return types[w] || w;
    });
    // Strip punctuation
    s = s.replace(/[.,]/g,'').replace(/\s+/g,' ').trim();
    return s;
  }

  // Building grouping key. First try a real street (so "46 Township Line Rd"
  // and "46 Township Line Road" group together). If no real street is present
  // (data scrambled — e.g. Melrose apartments have "A1, Melrose Park..." in
  // the street field), fall back to the owner field so all units of the same
  // building still collapse into one dropdown entry.
  function buildingKeyFor(p){
    var street = getStreet(p);
    if (street && looksLikeStreet(street)) return 'st:' + normalizeStreet(street);
    var owner = String(p.owner || '').trim();
    if (owner) return 'own:' + owner.toLowerCase();
    // Last resort: city+zip so at least same-city scrambled rows cluster
    var city = getCity(p), zip = getZip(p);
    if (city || zip) return 'cz:' + (city + '|' + zip).toLowerCase();
    return '';
  }
  // Display label for the dropdown. Prefer a proper street+city+state+zip.
  // If we're grouping by owner, prefer city+state+zip (+ owner name in parens)
  // so the user sees "Melrose Park, PA 19027 (Melrose Properties)" instead of
  // "A1, Melrose Park, PA 19027".
  function buildingLabelFor(p){
    var street = getStreet(p);
    if (street && looksLikeStreet(street)) {
      return formatBuildingAddress(p) || street;
    }
    var city  = getCity(p), state = getState(p), zip = getZip(p);
    var cityLine = [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    var owner = String(p.owner || '').trim();
    if (cityLine && owner) return cityLine + ' (' + owner + ')';
    if (owner) return owner;
    if (cityLine) return cityLine;
    return formatBuildingAddress(p) || street || '(unnamed)';
  }
  // Unit dropdown label
  function unitLabelFor(p){
    var src = String(p.apt || p.name || '').trim();
    var m = src.match(/\b(?:apt|unit|suite|ste|#)\s*([\w\-]+)\s*$/i);
    if (m) return m[1];
    var street = getStreet(p);
    if (street && src.toLowerCase().indexOf(street.toLowerCase()) === 0){
      var rest = src.slice(street.length).replace(/^[\s,#\-]+/, '').trim();
      if (rest) return rest;
    }
    return src;
  }

  function getBuildings(){
    var map = {};      // { normKey: { label, units:[] } }
    var orphans = [];  // properties with no street address
    properties.forEach(function(p){
      if (p.status && String(p.status).toLowerCase() === 'inactive') return; // skip inactive
      var k = buildingKeyFor(p);
      if (!k){ orphans.push(p); return; }
      if (!map[k]) map[k] = { label: '', units: [] };
      map[k].units.push(p);
      // Pick the most complete label among variants (longer label wins —
      // captures city/state/zip if some siblings have them and others don't).
      var lbl = buildingLabelFor(p);
      if (lbl && lbl.length > map[k].label.length) map[k].label = lbl;
    });

    // Try to attach orphans (apt-only records, e.g. "311") to an existing
    // building if they share parking_building_id with a known unit.
    if (orphans.length){
      var bldByPkId = {};
      Object.keys(map).forEach(function(k){
        map[k].units.forEach(function(u){
          if (u.parking_building_id) bldByPkId[u.parking_building_id] = k;
        });
      });
      var stillOrphan = [];
      orphans.forEach(function(p){
        var k = p.parking_building_id && bldByPkId[p.parking_building_id];
        if (k){ map[k].units.push(p); }
        else { stillOrphan.push(p); }
      });
      if (stillOrphan.length){
        try { console.warn('[lease-wizard] Skipped ' + stillOrphan.length + ' properties without a street address:', stillOrphan.map(function(p){ return p.apt || p.name || p.id; })); } catch(e){}
      }
    }

    // Natural sort units within each building (A1, A2, … B1 … 10 > 9)
    var natCmp = function(a, b){
      return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
    };
    Object.keys(map).forEach(function(k){
      map[k].units.sort(function(p1, p2){
        return natCmp(unitLabelFor(p1), unitLabelFor(p2));
      });
    });

    return Object.keys(map).sort(function(a,b){
      return (map[a].label||a).localeCompare(map[b].label||b);
    }).map(function(k){
      return { key: k, name: k, label: map[k].label || k, units: map[k].units };
    });
  }

  function renderProperty(){
    var buildings = getBuildings();
    if (!buildings.length){
      return '<div style="color:#c33;font-size:13px;padding:14px;background:#fff4f4;border-radius:6px">No properties available. Open the Properties tab and confirm at least one is loaded, then re-open this wizard.</div>';
    }
    var bldOpts = buildings.map(function(b){
      return `<option value="${esc(b.key)}" ${wizState.building===b.key?'selected':''}>${esc(b.label)} (${b.units.length} unit${b.units.length===1?'':'s'})</option>`;
    }).join('');
    var sel = buildings.find(function(b){ return b.key === wizState.building; });
    var unitOpts = sel ? sel.units.map(function(p){
      var ul = unitLabelFor(p);
      return `<option value="${esc(ul)}" ${wizState.unit===ul?'selected':''}>${esc(ul)}${p.owner?' — '+esc(p.owner):''}</option>`;
    }).join('') : '';
    var selectedLabel = sel ? sel.label : '';
    return `
      <label>Choose an Address</label>
      <select onchange="lwPickBuilding(this.value)">
        <option value="">-- Select address --</option>
        ${bldOpts}
      </select>
      ${selectedLabel ? `<div style="font-size:12px;color:#1a2874;margin:4px 0 0">📍 ${esc(selectedLabel)}</div>` : ''}
      <label>Unit Number</label>
      <select onchange="lwSet('unit',this.value)" ${sel ? '' : 'disabled'}>
        <option value="">${sel ? '-- Select unit --' : '(pick an address first)'}</option>
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
      <div class="lw-row">
        <div><label>Last month's rent held ($)</label>
          <input type="number" step="0.01" value="${esc(wizState.last_month_rent)}" oninput="lwSet('last_month_rent',this.value)"></div>
        <div></div>
      </div>
      <label style="margin-top:14px">Other charges</label>
      <div id="lwExtraCharges">
        ${(wizState.extra_charges||[]).map(function(c,i){
          return `
            <div class="lw-row" style="margin-bottom:6px">
              <input type="text" placeholder="Label (e.g. Pet fee)" value="${esc(c.label||'')}" oninput="lwSetCharge(${i},'label',this.value)">
              <input type="number" step="0.01" placeholder="Amount" value="${esc(c.amount||'')}" oninput="lwSetCharge(${i},'amount',this.value)">
              <input type="text" placeholder="Note (optional)" value="${esc(c.note||'')}" oninput="lwSetCharge(${i},'note',this.value)">
              <button type="button" onclick="lwRemoveCharge(${i})" style="padding:6px 10px;background:#fee;border:1px solid #f99;border-radius:4px;color:#c33;cursor:pointer">×</button>
            </div>`;
        }).join('')}
      </div>
      <button type="button" onclick="lwAddCharge()" style="margin-top:6px;padding:6px 12px;background:#eef1f8;border:1px solid #d6def0;border-radius:4px;color:#1a2874;cursor:pointer;font-size:12px">+ Add charge</button>
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
    const _b = getBuildings().find(function(b){ return b.key === wizState.building; });
    const propName = (_b && _b.label) ? _b.label : (wizState.building || '—');
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
        <div class="kv"><b>Security deposit:</b> $${esc(wizState.security_deposit||'0')}</div>
        <div class="kv"><b>Last month held:</b> $${esc(wizState.last_month_rent||'0')}</div>
        ${(wizState.extra_charges||[]).filter(function(c){return c.label||c.amount;}).map(function(c){
          return `<div class="kv"><b>${esc(c.label||'Charge')}:</b> $${esc(c.amount||'0')}${c.note?' — '+esc(c.note):''}</div>`;
        }).join('')}</div>
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
  // Only re-render when a change actually affects layout (e.g. lease_type
  // toggles the lease_end disabled state). Pure value updates skip render
  // so date/number inputs keep focus while the user types.
  window.lwSet = (k,v) => {
    wizState[k] = v;
    if (k==='lease_type' && v==='mtm') wizState.lease_end='';
    var rerenderKeys = ['lease_type','template_id','building'];
    if (rerenderKeys.indexOf(k) !== -1) lwRender();
  };
  window.lwAddCharge = function(){
    if (!wizState.extra_charges) wizState.extra_charges = [];
    wizState.extra_charges.push({ label:'', amount:'', note:'' });
    lwRender();
  };
  window.lwRemoveCharge = function(i){
    wizState.extra_charges.splice(i, 1);
    lwRender();
  };
  // No re-render — keep focus while typing in label/amount/note
  window.lwSetCharge = function(i, k, v){
    if (!wizState.extra_charges[i]) wizState.extra_charges[i] = { label:'', amount:'', note:'' };
    wizState.extra_charges[i][k] = v;
  };
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
      // property = full address (text column on leases table) — not just the street key
      const _bld = getBuildings().find(function(b){ return b.key === wizState.building; });
      const propText = (_bld && _bld.label) ? _bld.label : (wizState.building || '');
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
        last_month_rent: parseFloat(wizState.last_month_rent) || 0,
        extra_charges: (wizState.extra_charges||[])
          .map(function(c){ return { label:String(c.label||'').trim(), amount: parseFloat(c.amount)||0, note:String(c.note||'').trim() }; })
          .filter(function(c){ return c.label || c.amount; }),
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

      // Create tenants_lt row(s) so each tenant shows up in the Tenants list
      // (app.js hydrates INNAGO_TENANTS exclusively from tenants_lt). One row
      // per tenant on the lease, all pointing at the same lease_id. Status
      // reflects lease status: draft/out_for_signature → 'Future', signed → 'Active'.
      try {
        const _tenantStatus = (lease.status === 'draft' || lease.status === 'out_for_signature' || lease.status === 'future') ? 'Future' : 'Active';
        // tenants_lt.property must match the short street form stored on
        // properties.address (e.g. "46 Township Line Rd") so the Tenants list
        // filter (t.property === propertyName) lines up. Derive from the first
        // unit of the selected building; fall back to the full label if missing.
        const _firstUnitForAddr = (_bld && _bld.units && _bld.units[0]) ? _bld.units[0] : null;
        const _shortStreet = _firstUnitForAddr ? (getStreet(_firstUnitForAddr) || propText) : propText;
        const _tenantRows = tenants.map(function(t){
          return {
            lease_id:   leaseRow.id,
            name:       t.name,
            email:      t.email || '',
            phone:      t.phone || '',
            property:   _shortStreet,
            unit:       wizState.unit,
            rent:       parseFloat(wizState.monthly_rent) || 0,
            status:     _tenantStatus,
            lease_start: wizState.lease_start || null,
            lease_end:   leaseTypeDb === 'lt' ? (wizState.lease_end || null) : null,
            lease_type:  leaseTypeDb
          };
        });
        if (_tenantRows.length){
          // Upsert on email so re-leasing an existing tenant updates their row
          // instead of colliding with tenants_lt_email_unique. Rows without an
          // email fall through to plain insert.
          const _withEmail = _tenantRows.filter(function(r){ return r.email; });
          const _noEmail   = _tenantRows.filter(function(r){ return !r.email; });
          let _anyErr = null;
          if (_withEmail.length){
            const { error: ue } = await s.from('tenants_lt')
              .upsert(_withEmail, { onConflict: 'email' });
            if (ue) _anyErr = ue;
          }
          if (_noEmail.length){
            const { error: ie } = await s.from('tenants_lt').insert(_noEmail);
            if (ie) _anyErr = ie;
          }
          if (_anyErr) console.warn('[lease-wizard] tenants_lt upsert failed:', _anyErr);
          else if (typeof window.WPA_hydrateTenantsLT === 'function') {
            try { await window.WPA_hydrateTenantsLT(); } catch(e){ console.warn('rehydrate', e); }
          }
        }
      } catch(e) {
        console.warn('[lease-wizard] tenants_lt cascade error:', e);
      }

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
          sendEmail(sg.email, subject, bodyHtml, { isHtml: true, headerTitle: 'Willow Partnership — Lease Agreement' });
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

    // Resolve building + first unit (used for city/state/zip)
    const _b = getBuildings().find(function(x){return x.key===wizState.building;});
    const _firstUnit = _b && _b.units && _b.units[0] ? _b.units[0] : null;
    const _street = _firstUnit ? getStreet(_firstUnit) : (wizState.building||'');
    const _city   = _firstUnit ? getCity(_firstUnit)   : '';
    const _state  = _firstUnit ? getState(_firstUnit)  : '';
    const _zip    = _firstUnit ? getZip(_firstUnit)    : '';
    const _fullAddr = _b ? _b.label : (wizState.building||'');

    // Each {{TENANT_SIGNATURE_BLOCKS}} becomes ONE [[SIG]] marker per tenant,
    // grouped in a small block. sign.html turns [[SIG]] into a signable canvas.
    const sigBlocks = tenants.map(t => `
      <div class="sig-block" style="margin:14px 0;padding:10px 0;border-top:1px solid #d6def0">
        <div style="margin-bottom:6px"><strong>Tenant:</strong> ${escapeHtml(t.name)}</div>
        <div>Signature: [[SIG]] &nbsp;&nbsp; Date: ${new Date().toISOString().slice(0,10)}</div>
      </div>`).join('');

    const tokens = {
      // Tenant
      TENANT_NAMES: escapeHtml(tenantList),
      TENANT_NAME:  escapeHtml(tenantList),
      TENANT_SIGNATURE_BLOCKS: sigBlocks,
      TENANT_SIGNATURE: '[[SIG]]',
      SIGNATURE: '[[SIG]]',
      SIG: '[[SIG]]',

      // Property / address (multiple aliases — templates vary)
      PROPERTY:         escapeHtml(_street),
      PROPERTY_NAME:    escapeHtml(_street),
      PROPERTY_ADDRESS: escapeHtml(_fullAddr),
      ADDRESS:          escapeHtml(_fullAddr),
      FULL_ADDRESS:     escapeHtml(_fullAddr),
      STREET:           escapeHtml(_street),
      CITY:             escapeHtml(_city),
      STATE:            escapeHtml(_state),
      ZIP:              escapeHtml(_zip),
      POSTAL_CODE:      escapeHtml(_zip),
      UNIT:             escapeHtml(wizState.unit),
      UNIT_NUMBER:      escapeHtml(wizState.unit),

      // Term
      LEASE_START: wizState.lease_start || '',
      LEASE_END:   wizState.lease_end   || 'Month-to-Month',
      START_DATE:  wizState.lease_start || '',
      END_DATE:    wizState.lease_end   || 'Month-to-Month',
      TERM_MONTHS: (function(){
        if (wizState.lease_type==='mtm') return 'Month-to-Month';
        if (!wizState.lease_start || !wizState.lease_end) return '';
        var s = new Date(wizState.lease_start), e = new Date(wizState.lease_end);
        if (isNaN(s) || isNaN(e)) return '';
        var m = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth());
        return String(Math.max(0, m));
      })(),
      TODAY: new Date().toISOString().slice(0,10),
      DATE:  new Date().toISOString().slice(0,10),

      // Money
      MONTHLY_RENT:     parseFloat(wizState.monthly_rent||0).toFixed(2),
      RENT:             parseFloat(wizState.monthly_rent||0).toFixed(2),
      RENT_DUE_DAY:     wizState.rent_due_day,
      SECURITY_DEPOSIT: parseFloat(wizState.security_deposit||0).toFixed(2),
      DEPOSIT:          parseFloat(wizState.security_deposit||0).toFixed(2),
      LAST_MONTH:       parseFloat(wizState.last_month_rent||0).toFixed(2),
      LAST_MONTH_RENT:  parseFloat(wizState.last_month_rent||0).toFixed(2),
      TOTAL_DEPOSIT: (
        (parseFloat(wizState.security_deposit)||0) +
        (parseFloat(wizState.last_month_rent)||0)
      ).toFixed(2),

      // Landlord
      LANDLORD:         'Willow Partnership',
      LANDLORD_NAME:    'Willow Partnership',
      LANDLORD_ENTITY:  'Willow Partnership',
      OWNER:            'Willow Partnership',
      OWNER_NAME:       'Willow Partnership',

      // Utilities
      UTILITIES_INCLUDED: wizState.utilities_landlord.join(', ') || 'None',
      UTILITIES_TENANT:   wizState.utilities_tenant.join(', ')   || 'None',
      UTILITIES_LANDLORD: wizState.utilities_landlord.join(', ') || 'None',

      // Extras
      EXTRA_CHARGES_HTML: (function(){
        var rows = (wizState.extra_charges||[]).filter(function(c){ return c.label || c.amount; });
        if (!rows.length) return '<p><em>None</em></p>';
        return '<ul>' + rows.map(function(c){
          var amt = (parseFloat(c.amount)||0).toFixed(2);
          var note = c.note ? ' — ' + escapeHtml(c.note) : '';
          return '<li>' + escapeHtml(c.label||'Charge') + ': $' + amt + note + '</li>';
        }).join('') + '</ul>';
      })()
    };

    // Tolerant token regex: case-insensitive name, allows {{ NAME }} with spaces.
    // Unknown tokens render as empty string (don't leak literals to tenants).
    return (tpl.body_html||'').replace(
      /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g,
      function(_, k){
        var key = k.toUpperCase();
        if (key in tokens) return tokens[key];
        try { console.warn('[lease-wizard] Unknown template token:', k); } catch(e){}
        return ''; // hide unresolved tokens rather than showing literal {{X}}
      }
    );
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
