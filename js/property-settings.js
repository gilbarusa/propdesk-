
// ── PROP SWITCHER ──────────────────────────────────
let _allPropsSwitch=[];
function togglePropSwitcher(){
  const dd=document.getElementById('propSwitcherDrop');
  dd.style.display=dd.style.display==='none'?'block':'none';
  if(dd.style.display==='block') setTimeout(()=>document.getElementById('propSwitchSearch').focus(),50);
}
function filterPropSwitch(){
  const q=(document.getElementById('propSwitchSearch').value||'').toLowerCase();
  renderPropSwitchList(_allPropsSwitch.filter(p=>(p.name||'').toLowerCase().includes(q)||(p.apt||'').toLowerCase().includes(q)));
}
function renderPropSwitchList(props){
  const list=document.getElementById('propSwitchList');
  if(!list)return;
  if(!props.length){list.innerHTML='<div style="padding:8px;font-size:12px;color:var(--text3);">No properties found</div>';return;}
  list.innerHTML=props.map(p=>{
    const isCur=String(p.property_uid)===String(currentUid);
    const meta=[p.apt,p.max_guests?p.max_guests+' guests':null,p.bedrooms!=null?p.bedrooms+' bed':null,p.bathrooms!=null?p.bathrooms+' bath':null].filter(Boolean).join(' · ');
    const href='property-settings.html?uid='+encodeURIComponent(p.property_uid);
    return `<div onclick="location.href='${href}'" style="padding:8px 10px;border-radius:8px;cursor:pointer;margin-bottom:2px;background:${isCur?'var(--accent-bg)':'transparent'};border:1px solid ${isCur?'var(--accent)':'transparent'};" onmouseover="this.style.background='var(--accent-bg)'" onmouseout="this.style.background='${isCur?'var(--accent-bg)':'transparent'}'">
      <div style="font-size:12px;font-weight:500;color:var(--accent2);">${p.name||p.apt}</div>
      ${meta?`<div style="font-size:10px;color:var(--text3);margin-top:1px;">${meta}</div>`:''}
    </div>`;
  }).join('');
}
async function loadPropsForSwitch(){
  try{
    const {data,error}=await sb.from('properties').select('property_uid,apt,name,bedrooms,bathrooms,max_guests').order('name');
    if(error) throw error;
    _allPropsSwitch=data||[];
    renderPropSwitchList(_allPropsSwitch);
  }catch(e){console.error('loadPropsForSwitch:',e);}
}
document.addEventListener('click',function(e){
  const btn=document.getElementById('headerAptBadge');
  const dd=document.getElementById('propSwitcherDrop');
  if(dd&&btn&&!btn.contains(e.target)&&!dd.contains(e.target))dd.style.display='none';
});
// ───────────────────────────────────────────────────

const SUPABASE_URL=CONFIG.SUPABASE_URL;
const SUPABASE_KEY=CONFIG.SUPABASE_KEY;;
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
let currentApt='',currentUid=null,currentPropName='',currentTab='main-settings',allApts=[],priceRules=[],fees=[],photos=[],bulkTargetTab='';

const AMENITY_GROUPS=[
  {group:'Popular',items:[{key:'coffee_maker',label:'Coffee Maker'},{key:'essentials',label:'Essentials'},{key:'free_parking',label:'Free Parking'},{key:'fridge',label:'Fridge'},{key:'hair_dryer',label:'Hair Dryer'},{key:'heating',label:'Heating'},{key:'wifi',label:'Internet WiFi'},{key:'kitchen',label:'Kitchen'},{key:'microwave',label:'Microwave'},{key:'shampoo',label:'Shampoo'},{key:'tv',label:'TV'},{key:'washer',label:'Washer'}]},
  {group:'Climate Control',items:[{key:'ac',label:'Air Conditioning'},{key:'ceiling_fan',label:'Ceiling Fan'},{key:'dehumidifier',label:'Dehumidifier'},{key:'hot_water',label:'Hot Water'},{key:'fireplace',label:'Indoor Fireplace'}]},
  {group:'Kitchen & Dining',items:[{key:'baking_sheet',label:'Baking Sheet'},{key:'blender',label:'Blender'},{key:'cooking_basics',label:'Cooking Basics'},{key:'dishwasher',label:'Dishwasher'},{key:'freezer',label:'Freezer'},{key:'oven',label:'Oven'},{key:'stove',label:'Stove'},{key:'toaster',label:'Toaster'}]},
  {group:'Bathroom',items:[{key:'bidet',label:'Bidet'},{key:'body_soap',label:'Body Soap'},{key:'conditioner',label:'Conditioner'},{key:'shower_gel',label:'Shower Gel'},{key:'toiletries',label:'Toiletries'},{key:'bathtub',label:'Bathtub'}]},
  {group:'Laundry',items:[{key:'dryer',label:'Dryer'},{key:'hangers',label:'Hangers'},{key:'iron',label:'Iron'},{key:'linens',label:'Linens Provided'},{key:'towels',label:'Towels Provided'},{key:'wardrobe',label:'Wardrobe'}]},
  {group:'Safety',items:[{key:'alarm',label:'Alarm System'},{key:'co_detector',label:'CO Detector'},{key:'fire_extinguisher',label:'Fire Extinguisher'},{key:'first_aid',label:'First Aid Kit'},{key:'safe',label:'Safe'},{key:'smoke_detector',label:'Smoke Detector'}]},
  {group:'Entertainment',items:[{key:'board_games',label:'Board Games'},{key:'game_console',label:'Game Console'},{key:'streaming',label:'Streaming Services'}]},
  {group:'Outdoor',items:[{key:'balcony',label:'Balcony/Patio'},{key:'bbq',label:'BBQ'},{key:'garden',label:'Garden'},{key:'hot_tub',label:'Hot Tub'},{key:'pool',label:'Pool'},{key:'outdoor_seating',label:'Outdoor Seating'},{key:'ev_charger',label:'EV Charger'},{key:'paid_parking',label:'Paid Parking'}]},
  {group:'Family',items:[{key:'crib',label:'Pack n Play / Crib'},{key:'room_darkening',label:'Room-darkening Shades'},{key:'stair_gates',label:'Stair Gates'},{key:'high_chair',label:'High Chair'}]},
  {group:'Accessibility',items:[{key:'elevator',label:'Elevator'},{key:'single_level',label:'Single Level Home'},{key:'wheelchair',label:'Wheelchair Accessible'}]},
  {group:'Work & Office',items:[{key:'desk',label:'Desk'},{key:'desk_chair',label:'Desk Chair'},{key:'printer',label:'Printer'}]},
  {group:'Rules & Policies',items:[{key:'allows_pets',label:'Allows Pets'},{key:'allows_smoking',label:'Allows Smoking'},{key:'family_friendly',label:'Family Friendly'},{key:'event_friendly',label:'Event Friendly'}]},
];

window.addEventListener('DOMContentLoaded',async()=>{
  const params=new URLSearchParams(location.search);
  // Build stamp
  const psM=document.title.match(/v(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
  const psEl=document.getElementById('psBuildStamp');
  if(psEl&&psM){const[y,mo,d]=psM[1].split(' ')[0].split('-');const mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];psEl.textContent=mn[+mo-1]+' '+parseInt(d)+' '+y+' '+psM[1].split(' ')[1];}

  currentApt=params.get('apt')||'';
  currentUid=params.get('uid')||null;

  if(!currentApt&&!currentUid){
    document.getElementById('headerAptBadge').textContent='Select property ▾';
    setTimeout(()=>togglePropSwitcher(),400);
  } else {
    document.getElementById('headerAptBadge').textContent=(currentApt||'uid:'+currentUid)+' ▾';
  }
  buildAmenitiesUI();
  await Promise.all([loadApts(), loadPropsForSwitch()]);
  if(currentApt||currentUid) await loadSettings();
  document.querySelectorAll('.sidebar-item[data-tab]').forEach(el=>{el.addEventListener('click',()=>switchTab(el.dataset.tab));});
});

function updateAptTitles(apt){document.querySelectorAll('[id$="-apt-title"]').forEach(el=>el.textContent=apt);}

function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(el=>el.classList.remove('active'));
  const tc=document.getElementById('tab-'+tab);
  if(tc)tc.classList.add('active');
  document.querySelector('.sidebar-item[data-tab="'+tab+'"]')?.classList.add('active');
}

async function loadApts(){
  try{const {data}=await sb.from('units').select('id,apt,name').eq('archived',false).order('apt');allApts=data||[];}
  catch(e){allApts=[];}
}

async function loadSettings(){
  try{
    let prop=null;
    // Step 1: resolve property
    if(currentUid){
      const {data,error}=await sb.from('properties').select('*').eq('property_uid',currentUid).single();
      if(error) throw new Error('uid lookup failed: '+error.message);
      prop=data;
    } else if(currentApt){
      const {data,error}=await sb.from('properties').select('*').eq('apt',currentApt).single();
      if(error) throw new Error('apt lookup failed: '+error.message);
      prop=data;
    }
    if(!prop){toast('Property not found','error');return;}

    currentApt=prop.apt||currentApt;
    currentUid=String(prop.property_uid||currentUid||'');
    currentPropName=prop.name||prop.apt||'Property';
    window._currentApt = currentApt; // expose for channels tab
    document.getElementById('headerAptBadge').textContent=currentPropName+' ▾';
    updateAptTitles(currentPropName);

    // Step 2: populate from properties table
    populateMainSettings({
      prop_name:prop.apt||'',addr1:prop.address||'',city:prop.city||'',
      zip:prop.zip||'',state:prop.state||'',lat:prop.latitude||'',lng:prop.longitude||'',
      bedrooms:prop.bedrooms??'',bathrooms:prop.bathrooms??'',max_guests:prop.max_guests??'',
      min_stay:prop.min_stay??'',airbnb_id:prop.airbnb_id||'',vrbo_id:prop.vrbo_id||'',
      notes:prop.notes||'',weblink:prop.hostfully_listing_url||'',
      door_code:prop.door_code||'',lockbox_code:prop.lockbox_code||'',
      wifi_name:prop.wifi_name||'',wifi_pass:prop.wifi_password||''
    });

    // Step 3: overlay with property_settings if exists
    const {data:ps,error:psErr}=await sb.from('property_settings').select('*').eq('apt',currentApt).single();
    if(psErr&&psErr.code!=='PGRST116') console.warn('property_settings:',psErr.message);
    if(!ps){renderPhotos();return;}
    if(ps.main_settings)populateMainSettings(ps.main_settings);
    if(ps.descriptions)populateDescriptions(ps.descriptions);
    if(ps.pricing)populatePricing(ps.pricing);
    if(ps.amenities)populateAmenities(ps.amenities);
    if(ps.fees_policies)populateFeesData(ps.fees_policies);
    if(ps.service_providers)populateServiceProviders(ps.service_providers);
    if(ps.owner_info)populateOwner(ps.owner_info);
    if(ps.app_content)populateAppContent(ps.app_content);
    else populateAppContent({entry_code:prop.door_code||'',lockbox_code:prop.lockbox_code||'',wifi_name:prop.wifi_name||'',wifi_pass:prop.wifi_password||''});
    photos=ps.photos||[];renderPhotos();
    priceRules=(ps.pricing||{}).rules||[];renderPriceRules();
    fees=(ps.fees_policies||{}).fees||[];renderFeesTable();
    loadChannels(ps); // load channel settings
  }catch(e){
    console.error('loadSettings:',e);
    toast('Load failed: '+e.message,'error');
    renderPhotos();
  }
}

// ── MAIN SETTINGS ──────────────────────────
function populateMainSettings(d){
  const ids={prop_type:'ms-prop-type',prop_name:'ms-prop-name',weblink:'ms-weblink',size:'ms-size',size_unit:'ms-size-unit',floors:'ms-floors',addr1:'ms-addr1',addr2:'ms-addr2',city:'ms-city',zip:'ms-zip',state:'ms-state',lat:'ms-lat',lng:'ms-lng',bedrooms:'ms-bedrooms',beds:'ms-beds',bathrooms:'ms-bathrooms',base_guests:'ms-base-guests',max_guests:'ms-max-guests',extra_fee:'ms-extra-fee',min_stay:'ms-min-stay',max_stay:'ms-max-stay',min_weekend_stay:'ms-min-weekend-stay',door_code:'ms-door-code',lockbox_code:'ms-lockbox-code',wifi_name:'ms-wifi-name',wifi_pass:'ms-wifi-pass',external_id:'ms-external-id',accounting_id:'ms-accounting-id',license:'ms-license',license_exp:'ms-license-exp',airbnb_id:'ms-airbnb-id',bcom_hotel_id:'ms-bcom-hotel-id',bcom_room_id:'ms-bcom-room-id',bcom_status:'ms-bcom-status',vrbo_id:'ms-vrbo-id',notes:'ms-notes',booking_type:'ms-booking-type',airbnb_listing_type:'ms-airbnb-listing-type',airbnb_booking_type:'ms-airbnb-booking-type',airbnb_cancel:'ms-airbnb-cancel',bcom_booking_type:'ms-bcom-booking-type',vrbo_booking_type:'ms-vrbo-booking-type'};
  Object.entries(ids).forEach(([k,id])=>{if(d[k]!==undefined&&d[k]!==null){const el=document.getElementById(id);if(el)el.value=d[k];}});
}
function collectMainSettings(){
  const g=id=>{const el=document.getElementById(id);return el?el.value:''};
  const gn=id=>{const v=g(id);return v!==''&&v!==undefined?parseFloat(v):undefined};
  return{prop_type:g('ms-prop-type'),prop_name:g('ms-prop-name'),weblink:g('ms-weblink'),size:gn('ms-size'),size_unit:g('ms-size-unit'),floors:gn('ms-floors'),addr1:g('ms-addr1'),addr2:g('ms-addr2'),city:g('ms-city'),zip:g('ms-zip'),state:g('ms-state'),lat:g('ms-lat'),lng:g('ms-lng'),bedrooms:gn('ms-bedrooms'),beds:gn('ms-beds'),bathrooms:gn('ms-bathrooms'),base_guests:gn('ms-base-guests'),max_guests:gn('ms-max-guests'),extra_fee:gn('ms-extra-fee'),min_stay:gn('ms-min-stay'),max_stay:gn('ms-max-stay'),min_weekend_stay:gn('ms-min-weekend-stay'),door_code:g('ms-door-code'),lockbox_code:g('ms-lockbox-code'),wifi_name:g('ms-wifi-name'),wifi_pass:g('ms-wifi-pass'),external_id:g('ms-external-id'),accounting_id:g('ms-accounting-id'),license:g('ms-license'),license_exp:g('ms-license-exp'),airbnb_id:g('ms-airbnb-id'),bcom_hotel_id:g('ms-bcom-hotel-id'),bcom_room_id:g('ms-bcom-room-id'),vrbo_id:g('ms-vrbo-id'),notes:g('ms-notes'),booking_type:g('ms-booking-type'),airbnb_listing_type:g('ms-airbnb-listing-type'),airbnb_booking_type:g('ms-airbnb-booking-type'),airbnb_cancel:g('ms-airbnb-cancel'),bcom_booking_type:g('ms-bcom-booking-type'),vrbo_booking_type:g('ms-vrbo-booking-type')};
}

// ── DESCRIPTIONS ───────────────────────────
function populateDescriptions(d){['name','short','long','notes','interaction','neighborhood','access','space','transit','manual'].forEach(f=>{const el=document.getElementById('desc-'+f);if(el&&d[f]){el.value=d[f];updateCharCount(el,'desc-'+f+'-count');}});}
function collectDescriptions(){const g=f=>document.getElementById('desc-'+f)?.value||'';return{name:g('name'),short:g('short'),long:g('long'),notes:g('notes'),interaction:g('interaction'),neighborhood:g('neighborhood'),access:g('access'),space:g('space'),transit:g('transit'),manual:g('manual')};}

// ── PRICING ────────────────────────────────
function populatePricing(p){const set=(id,val)=>{if(val!==undefined){const el=document.getElementById(id);if(el)el.value=val;}};set('price-currency',p.currency);set('price-base',p.base);set('price-weekend',p.weekend);set('price-tax',p.tax);set('price-deposit',p.deposit);set('price-cleaning',p.cleaning);set('price-cleaning-tax',p.cleaning_tax);if(p.tax_exempt)document.getElementById('price-tax-exempt').checked=p.tax_exempt;if(p.override_airbnb)document.getElementById('override-airbnb').checked=p.override_airbnb;}
function collectPricing(){const g=id=>document.getElementById(id)?.value;const gn=id=>{const v=g(id);return v!==''&&v!==undefined?parseFloat(v):undefined};return{currency:g('price-currency'),base:gn('price-base'),weekend:gn('price-weekend'),tax:gn('price-tax'),deposit:gn('price-deposit'),cleaning:gn('price-cleaning'),cleaning_tax:gn('price-cleaning-tax'),tax_exempt:document.getElementById('price-tax-exempt')?.checked,override_airbnb:document.getElementById('override-airbnb')?.checked,rules:priceRules};}
function renderPriceRules(){
  const tbody=document.getElementById('price-rules-tbody');
  if(!priceRules.length){tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px;">No price rules yet.</td></tr>';return;}
  const labels={length_discount:'Length of stay',short_premium:'Short stay',early_bird:'Early bird',last_minute:'Last minute'};
  tbody.innerHTML=priceRules.map((r,i)=>`<tr><td>${r.name||'—'}</td><td style="font-size:11px;color:var(--text2);">${labels[r.type]||r.type}</td><td style="font-size:11px;color:var(--text2);">${(r.channels||[]).join(', ')}</td><td class="${parseFloat(r.pct)>=0?'pct-pos':'pct-neg'}">${parseFloat(r.pct)>=0?'+':''}${r.pct}%</td><td style="font-size:11px;color:var(--text2);">stay ${r.op==='gte'?'≥':'≤'} ${r.nights} nights</td><td><button class="tbl-link" onclick="deleteRule(${i})">Delete</button></td></tr>`).join('');
}
function openAddRuleModal(){document.getElementById('addRuleModal').classList.add('open');}
function addPriceRule(){
  const name=document.getElementById('rule-name').value,pct=document.getElementById('rule-pct').value,nights=document.getElementById('rule-cond-nights').value;
  if(!name||!pct||!nights){toast('Fill in all fields','error');return;}
  const channels=Array.from(document.querySelectorAll('#addRuleModal input[type=checkbox]:checked')).map(c=>c.value);
  priceRules.push({name,type:document.getElementById('rule-type').value,pct,op:document.getElementById('rule-cond-op').value,nights,channels});
  renderPriceRules();closeModal('addRuleModal');toast('Rule added — save to persist','info');
}
function deleteRule(i){if(!confirm('Delete this rule?'))return;priceRules.splice(i,1);renderPriceRules();}

// ── FEES ───────────────────────────────────
function populateFeesData(d){fees=d.fees||[];renderFeesTable();if(d.cancel_policy)document.getElementById('fees-cancel-policy').value=d.cancel_policy;if(d.cancel_notes)document.getElementById('fees-cancel-notes').value=d.cancel_notes;if(d.rental_conditions)document.getElementById('fees-rental-conditions').value=d.rental_conditions;}
function collectFeesPolicies(){return{fees,cancel_policy:document.getElementById('fees-cancel-policy')?.value,cancel_notes:document.getElementById('fees-cancel-notes')?.value,rental_conditions:document.getElementById('fees-rental-conditions')?.value};}
function renderFeesTable(){const tbody=document.getElementById('fees-tbody');if(!fees.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px;">No fees defined.</td></tr>';return;}tbody.innerHTML=fees.map((f,i)=>`<tr><td>${f.name}</td><td>${f.type}</td><td>$${f.value}</td><td>${f.tax}%</td><td style="font-size:11px;color:var(--text2);">${f.scope}</td><td style="font-size:11px;color:var(--text2);">${(f.channels||[]).join(', ')}</td><td style="font-size:11px;color:var(--text2);">${f.applies==='all'?'All properties':'This property'}</td><td><button class="tbl-link" onclick="deleteFee(${i})" style="color:var(--red);">Delete</button></td></tr>`).join('');}
function openAddFeeModal(){document.getElementById('addFeeModal').classList.add('open');}
function addFee(){const name=document.getElementById('fee-name').value;if(!name){toast('Enter a fee name','error');return;}fees.push({name,type:document.getElementById('fee-type').value,value:document.getElementById('fee-value').value,tax:document.getElementById('fee-tax').value||0,scope:document.getElementById('fee-scope').value,channels:Array.from(document.querySelectorAll('#addFeeModal input[type=checkbox]:checked')).map(c=>c.value),applies:document.getElementById('fee-applies').value});renderFeesTable();closeModal('addFeeModal');toast('Fee added — save to persist','info');}
function deleteFee(i){if(!confirm('Delete fee?'))return;fees.splice(i,1);renderFeesTable();}
function addListItem(listId,placeholder){const list=document.getElementById(listId);const empty=list.querySelector('[style*="text-align:center"]');if(empty)empty.remove();const el=document.createElement('div');el.style.cssText='display:flex;gap:8px;margin-bottom:8px;';el.innerHTML='<input type="text" placeholder="'+placeholder+'" style="flex:1;"><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:18px;padding:0 4px;">×</button>';list.appendChild(el);}

// ── AMENITIES ──────────────────────────────
function buildAmenitiesUI(){
  const container=document.getElementById('amenities-container');
  container.innerHTML=AMENITY_GROUPS.map(g=>`<div class="section-card"><div class="section-hdr" onclick="toggleSection(this)"><div class="section-hdr-label">${g.group}</div><span class="section-chevron">▾</span></div><div class="section-body"><div class="amenity-grid">${g.items.map(item=>`<label class="amenity-item"><input type="checkbox" id="am-${item.key}" value="${item.key}"> ${item.label}</label>`).join('')}</div></div></div>`).join('');
}
function populateAmenities(a){Object.keys(a).forEach(key=>{const el=document.getElementById('am-'+key);if(el)el.checked=!!a[key];});}
function collectAmenities(){const result={};document.querySelectorAll('#amenities-container input[type=checkbox]').forEach(el=>{result[el.value]=el.checked;});return result;}

// ── PHOTOS ─────────────────────────────────
function renderPhotos(){
  const grid=document.getElementById('photo-grid');
  if(!photos.length){grid.innerHTML='<div class="empty-state"><div style="font-size:32px;margin-bottom:10px;">📷</div><div>No photos yet.</div></div>';return;}
  grid.innerHTML=photos.map((p,i)=>`<div class="photo-card">${i===0?'<span class="photo-cover-badge">Cover</span>':''}<img src="${p.url}" alt="${p.caption||''}"><div class="photo-actions">${i>0?'<button class="photo-btn" onclick="setAsCover('+i+')" title="Set as cover">⭐</button>':''}<button class="photo-btn" onclick="deletePhoto('+i+')" title="Delete">✕</button></div><div class="photo-card-body"><input type="text" value="${p.caption||''}" placeholder="Caption" onchange="updateCaption(${i},this.value)"></div></div>`).join('');
}
async function handlePhotoUpload(input){
  const files=Array.from(input.files);if(!files.length)return;
  toast('Uploading '+files.length+' photo(s)...','info');
  for(const file of files){
    try{
      const ext=file.name.split('.').pop();
      const path=(currentApt||'general')+'/'+Date.now()+'.'+ext;
      const{data,error}=await sb.storage.from('property-photos').upload(path,file,{upsert:true});
      if(error)throw error;
      const{data:urlData}=sb.storage.from('property-photos').getPublicUrl(path);
      console.log('Photo uploaded, public URL:', urlData.publicUrl);
      photos.push({url:urlData.publicUrl,caption:'',path});
    }catch(e){
      toast('Upload failed: '+e.message,'error');
      console.error('Upload error:',e);
    }
  }
  renderPhotos();
  await savePhotosToDB();
  input.value='';
}
function setAsCover(idx){const p=photos.splice(idx,1)[0];photos.unshift(p);renderPhotos();toast('Cover updated — save to persist','info');}
async function deletePhoto(idx){if(!confirm('Delete this photo?'))return;const p=photos[idx];if(p.path)await sb.storage.from('property-photos').remove([p.path]);photos.splice(idx,1);renderPhotos();await savePhotosToDB();}
function updateCaption(idx,val){photos[idx].caption=val;}
async function savePhotosToDB(){
  if(!currentApt){toast('No property loaded — cannot save photos','error');return;}
  try{
    // Use upsert targeting only the photos column to avoid overwriting other data
    const{error}=await sb.from('property_settings')
      .upsert({apt:currentApt, photos, updated_at:new Date().toISOString()},{onConflict:'apt',ignoreDuplicates:false});
    if(error)throw error;
    toast('Photo saved ✓','success');
    console.log('Saved photos to DB:', photos);
  }catch(e){
    toast('Photo DB save failed: '+e.message,'error');
    console.error('savePhotosToDB error:',e);
  }
}

// ── SERVICE PROVIDERS ──────────────────────
function populateServiceProviders(d){if(d.notes)document.getElementById('sp-notes').value=d.notes;}
function toggleAllSP(cb){document.querySelectorAll('.sp-toggle').forEach(t=>t.checked=cb.checked);}
function collectServiceProviders(){const providers=[];document.querySelectorAll('#sp-tbody tr').forEach((row)=>{const toggle=row.querySelector('.sp-toggle');const cells=row.querySelectorAll('td');if(toggle&&cells.length>=3)providers.push({name:cells[0].textContent.trim(),enabled:toggle.checked});});return{providers,notes:document.getElementById('sp-notes')?.value};}

// ── OWNER ──────────────────────────────────
function populateOwner(d){if(d.notes)document.getElementById('owner-notes').value=d.notes;}
function collectOwner(){return{collect_tax:document.querySelector('input[name="owner-tax"]:checked')?.value,cc_owner:document.querySelector('input[name="owner-cc"]:checked')?.value,notes:document.getElementById('owner-notes')?.value};}

// ── APP CONTENT ───────────────────────────
function populateAppContent(d){
  if(!d)return;
  const map={
    'ac-checkin-time':d.checkin_time,'ac-checkout-time':d.checkout_time,
    'ac-entry-code':d.entry_code,'ac-lockbox-code':d.lockbox_code,
    'ac-wifi-name':d.wifi_name,'ac-wifi-pass':d.wifi_pass,
    'ac-checkin-instructions':d.checkin_instructions,
    'ac-checkout-instructions':d.checkout_instructions,
    'ac-house-rules':d.house_rules,
    'ac-emergency-maintenance':d.emergency_maintenance,
    'ac-emergency-management':d.emergency_management,
    'ac-trash':d.trash,'ac-parking':d.parking,
    'ac-roku':d.roku,'ac-laundry':d.laundry,'ac-mail':d.mail
  };
  Object.entries(map).forEach(([id,v])=>{if(v!=null){const el=document.getElementById(id);if(el)el.value=v;}});
}
function collectAppContent(){
  return{
    checkin_time:document.getElementById('ac-checkin-time')?.value||'',
    checkout_time:document.getElementById('ac-checkout-time')?.value||'',
    entry_code:document.getElementById('ac-entry-code')?.value||'',
    lockbox_code:document.getElementById('ac-lockbox-code')?.value||'',
    wifi_name:document.getElementById('ac-wifi-name')?.value||'',
    wifi_pass:document.getElementById('ac-wifi-pass')?.value||'',
    checkin_instructions:document.getElementById('ac-checkin-instructions')?.value||'',
    checkout_instructions:document.getElementById('ac-checkout-instructions')?.value||'',
    house_rules:document.getElementById('ac-house-rules')?.value||'',
    emergency_maintenance:document.getElementById('ac-emergency-maintenance')?.value||'',
    emergency_management:document.getElementById('ac-emergency-management')?.value||'',
    trash:document.getElementById('ac-trash')?.value||'',
    parking:document.getElementById('ac-parking')?.value||'',
    roku:document.getElementById('ac-roku')?.value||'',
    laundry:document.getElementById('ac-laundry')?.value||'',
    mail:document.getElementById('ac-mail')?.value||''
  };
}

// ── SAVE ───────────────────────────────────
async function saveCurrentTab(){saveTab(currentTab);}
async function saveTab(tab){
  if(!currentApt){toast('No unit selected. Open via ?apt=XXX','error');return;}
  let payload={};
  if(tab==='main-settings')payload={main_settings:collectMainSettings()};
  else if(tab==='descriptions')payload={descriptions:collectDescriptions()};
  else if(tab==='pricing')payload={pricing:collectPricing()};
  else if(tab==='amenities')payload={amenities:collectAmenities()};
  else if(tab==='photos'){await savePhotosToDB();return;}
  else if(tab==='fees-policies')payload={fees_policies:collectFeesPolicies()};
  else if(tab==='service-providers')payload={service_providers:collectServiceProviders()};
  else if(tab==='owner')payload={owner_info:collectOwner()};
  else if(tab==='channels'){await saveChannels();return;}
  else if(tab==='app-content')payload={app_content:collectAppContent()};
  else if(tab==='reviews'){toast('Reviews are read-only from Hostfully','info');return;}
  try{await upsertSettings(payload);toast(capitalize(tab)+' saved ✓','success');setSaveStatus('Saved '+new Date().toLocaleTimeString());}
  catch(e){toast('Save failed: '+e.message,'error');}
}
async function upsertSettings(payload){
  const{error}=await sb.from('property_settings').upsert({apt:currentApt,property_uid:currentUid,...payload,updated_at:new Date().toISOString()},{onConflict:'apt'});
  if(error)throw error;
  // Also sync access fields directly to properties table
  if(payload.main_settings){
    const ms=payload.main_settings;
    const propUpdate={};
    if(ms.door_code!==undefined) propUpdate.door_code=ms.door_code||null;
    if(ms.lockbox_code!==undefined) propUpdate.lockbox_code=ms.lockbox_code||null;
    if(ms.wifi_name!==undefined) propUpdate.wifi_name=ms.wifi_name||null;
    if(ms.wifi_password!==undefined) propUpdate.wifi_password=ms.wifi_password||null;
    if(ms.bedrooms!==undefined&&ms.bedrooms!=='') propUpdate.bedrooms=parseFloat(ms.bedrooms)||null;
    if(ms.bathrooms!==undefined&&ms.bathrooms!=='') propUpdate.bathrooms=parseFloat(ms.bathrooms)||null;
    if(ms.max_guests!==undefined&&ms.max_guests!=='') propUpdate.max_guests=parseInt(ms.max_guests)||null;
    if(ms.min_stay!==undefined&&ms.min_stay!=='') propUpdate.min_stay=parseInt(ms.min_stay)||null;

    // Sync address fields
    if(ms.addr1!==undefined) propUpdate.address=ms.addr1||null;
    if(ms.city!==undefined)  propUpdate.city=ms.city||null;
    if(ms.state!==undefined) propUpdate.state=ms.state||null;
    if(ms.zip!==undefined)   propUpdate.zip=ms.zip||null;

    // Use manually entered lat/lng if provided
    if(ms.lat&&ms.lng){
      propUpdate.latitude  = parseFloat(ms.lat)  || null;
      propUpdate.longitude = parseFloat(ms.lng) || null;
    } else if(ms.addr1 && ms.city) {
      // Check verified coords first, then geocode
      const verified = lookupVerifiedCoords(ms.addr1);
      if(verified){
        propUpdate.latitude  = verified.lat;
        propUpdate.longitude = verified.lng;
        const latEl=document.getElementById('ms-lat'), lngEl=document.getElementById('ms-lng');
        if(latEl) latEl.value=verified.lat.toFixed(6);
        if(lngEl) lngEl.value=verified.lng.toFixed(6);
      } else {
        try {
          const q = [ms.addr1, ms.city, ms.state||'PA', ms.zip, 'USA'].filter(Boolean).join(', ');
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us`);
          const json = await res.json();
          if(json.length){
            const lat=parseFloat(json[0].lat), lng=parseFloat(json[0].lon);
            if(lat>39.5&&lat<41.5&&lng>-76.5&&lng<-74.5){
              propUpdate.latitude=lat;
              propUpdate.longitude=lng;
              const latEl=document.getElementById('ms-lat'), lngEl=document.getElementById('ms-lng');
              if(latEl) latEl.value=lat.toFixed(6);
              if(lngEl) lngEl.value=lng.toFixed(6);
              toast('Address geocoded and saved ✓','success');
            }
          }
        } catch(e){ console.warn('Geocode failed:',e); }
      }
    }

    if(Object.keys(propUpdate).length){
      await sb.from('properties').update({...propUpdate,updated_at:new Date().toISOString()}).eq('apt',currentApt);
    }
  }
}

// ── BULK APPLY ─────────────────────────────
function openBulkModal(tab){bulkTargetTab=tab;document.getElementById('bulk-section-label').textContent=capitalize(tab)+' settings';document.getElementById('bulkModal').classList.add('open');renderAptSelectList();}
function closeBulkModal(){document.getElementById('bulkModal').classList.remove('open');}
function renderAptSelectList(){
  const list=document.getElementById('apt-select-list');
  if(!allApts.length){list.innerHTML='<div style="color:var(--text3);font-size:12px;padding:16px;text-align:center;">No units found. Make sure the units table exists in Supabase.</div>';return;}
  list.innerHTML=allApts.map(a=>`<label class="apt-select-item ${a.apt===currentApt?'selected':''}"><input type="checkbox" value="${a.apt}" ${a.apt===currentApt?'checked':''}><span><strong>${a.apt}</strong><br><span style="font-size:10px;color:var(--text3)">${a.name||'Vacant'}</span></span></label>`).join('');
}
function selectAllApts(){document.querySelectorAll('#apt-select-list input[type=checkbox]').forEach(cb=>cb.checked=true);document.querySelectorAll('#apt-select-list .apt-select-item').forEach(el=>el.classList.add('selected'));}
async function confirmBulkApply(){
  const selected=Array.from(document.querySelectorAll('#apt-select-list input:checked')).map(c=>c.value);
  if(!selected.length){toast('Select at least one unit','error');return;}
  let payload={};
  if(bulkTargetTab==='descriptions')payload={descriptions:collectDescriptions()};
  else if(bulkTargetTab==='pricing')payload={pricing:collectPricing()};
  else if(bulkTargetTab==='amenities')payload={amenities:collectAmenities()};
  else if(bulkTargetTab==='main-settings')payload={main_settings:collectMainSettings()};
  else if(bulkTargetTab==='fees-policies')payload={fees_policies:collectFeesPolicies()};
  else if(bulkTargetTab==='app-content')payload={app_content:collectAppContent()};
  closeBulkModal();toast('Applying to '+selected.length+' unit(s)…','info');
  let ok=0,fail=0;
  for(const apt of selected){try{const{error}=await sb.from('property_settings').upsert({apt,...payload,updated_at:new Date().toISOString()},{onConflict:'apt'});if(error)throw error;ok++;}catch(e){fail++;}}
  toast('Applied to '+ok+' unit(s)'+(fail?' · '+fail+' failed':''),ok?'success':'error');
}

// ── GEOCODE ──────────────────────────────────
// Known building addresses — geocoded on first use, cached permanently
const KNOWN_BUILDINGS = {
  '46 township line':  { address: '46 Township Line Rd, Elkins Park, PA 19027' },
  '426 central':       { address: '426 Central Ave, Elkins Park, PA 19027' },
  '431 valley':        { address: '431 Valley Rd, Elkins Park, PA 19027' },
  '7845 montgomery':   { address: '7845 Montgomery Ave, Elkins Park, PA 19027' },
  '926 fox chase':     { address: '926 Fox Chase Rd, Rockledge, PA 19046' },
};

// Verified overrides (only where Nominatim gets it wrong)
const VERIFIED_COORDS = {
  '46 township line':  { lat: 40.073775, lng: -75.104224 },
  '426 central':       { lat: 40.073447, lng: -75.103881 },
  '7845 montgomery':   { lat: 40.071003, lng: -75.127327 },
  '926 fox chase':     { lat: 40.084677, lng: -75.094456 },
};

function lookupVerifiedCoords(addr) {
  const key = (addr || '').toLowerCase();
  for (const [pattern, coords] of Object.entries(VERIFIED_COORDS)) {
    if (key.includes(pattern.split(' ').slice(0,2).join(' '))) return coords;
  }
  return null; // will geocode using full address
}

async function geocodeNow(){
  const addr  = document.getElementById('ms-addr1')?.value?.trim();
  const city  = document.getElementById('ms-city')?.value?.trim();
  const state = document.getElementById('ms-state')?.value?.trim() || 'PA';
  const zip   = document.getElementById('ms-zip')?.value?.trim();
  if(!addr && !city){ toast('Enter an address first','error'); return; }

  // Check verified overrides first
  const verified = lookupVerifiedCoords(addr);
  if(verified){
    await applyCoords(verified.lat, verified.lng);
    toast('Verified coordinates applied ✓','success');
    return;
  }

  // Geocode using full address + zip for precision
  toast('Geocoding...','info');
  try {
    const q = [addr, city, state, zip, 'USA'].filter(Boolean).join(', ');
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us`);
    const json = await res.json();
    if(json.length){
      const lat=parseFloat(json[0].lat), lng=parseFloat(json[0].lon);
      if(lat>39&&lat<42&&lng>-77&&lng<-74){
        await applyCoords(lat, lng);
        toast(`Geocoded: ${lat.toFixed(5)}, ${lng.toFixed(5)} ✓`,'success');
      } else { toast('Address found but outside expected area','error'); }
    } else { toast('Address not found — check address and zip code','error'); }
  } catch(e){ toast('Geocode failed: '+e.message,'error'); }
}

async function applyCoords(lat, lng){
  document.getElementById('ms-lat').value = lat.toFixed(6);
  document.getElementById('ms-lng').value  = lng.toFixed(6);
  await sb.from('properties').update({ latitude:lat, longitude:lng, updated_at:new Date().toISOString() }).eq('apt',currentApt);
}
function toggleSection(hdr){const body=hdr.nextElementSibling;const chevron=hdr.querySelector('.section-chevron');body.classList.toggle('collapsed');chevron?.classList.toggle('collapsed');}
function updateCharCount(el,countId){const counter=document.getElementById(countId);if(counter)counter.textContent=el.value.length;}
function setSaveStatus(msg){const el=document.getElementById('save-status');if(el)el.textContent=msg;}
function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1).replace(/-/g,' ');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function toast(msg,type='info'){
  const wrap=document.getElementById('toastWrap');
  if(!wrap)return;
  const t=document.createElement('div');
  t.className='toast'+(type?' toast-'+type:'');
  t.textContent=msg;
  wrap.appendChild(t);
  setTimeout(()=>t.remove(),3200);
}

// ── CHANNELS ────────────────────────────────
const CH_KEYS = ['airbnb','vrbo','bdc','direct'];

function chUpdateStatus(ch) {
  const enabled = document.getElementById(`ch-${ch}-enabled`)?.checked;
  const label   = document.getElementById(`ch-${ch}-status-label`);
  if (label) label.textContent = enabled ? 'On' : 'Off';
  label.style.color = enabled ? 'var(--green)' : 'var(--text3)';
  chUpdateRatePreview();
}

function chUpdateRatePreview() {
  const baseRate = parseFloat(
    document.getElementById('pr-base-price')?.value ||
    document.getElementById('ms-base-price')?.value || 0
  );
  const channels = [
    { key:'airbnb',  label:'Airbnb',           icon:'&#x1F3E0;' },
    { key:'vrbo',    label:'Vrbo',              icon:'&#x1F3E1;' },
    { key:'bdc',     label:'Booking.com',       icon:'&#x1F3E8;' },
    { key:'direct',  label:'WillowStay Direct', icon:'&#x1F33F;' },
  ];
  const tbody = document.getElementById('ch-rate-preview');
  if (!tbody) return;
  tbody.innerHTML = channels.map(c => {
    const enabled    = document.getElementById(`ch-${c.key}-enabled`)?.checked || false;
    const multiplier = parseFloat(document.getElementById(`ch-${c.key}-multiplier`)?.value || 0);
    const guestPays  = baseRate > 0 ? Math.round(baseRate * (1 + multiplier/100)) : null;
    const statusHtml = enabled
      ? '<span style="color:var(--green);font-weight:500;">ON</span>'
      : '<span style="color:var(--text3);">off</span>';
    return `<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:9px 12px;">${c.icon} ${c.label}</td>
      <td style="padding:9px 12px;text-align:right;color:var(--text2);">${baseRate > 0 ? '$'+baseRate : '—'}</td>
      <td style="padding:9px 12px;text-align:right;color:var(--accent);">+${multiplier}%</td>
      <td style="padding:9px 12px;text-align:right;font-weight:500;color:${enabled?'var(--text)':'var(--text3)'};">${guestPays ? '$'+guestPays : '—'}</td>
      <td style="padding:9px 12px;text-align:right;">${statusHtml}</td>
    </tr>`;
  }).join('');
}

function loadChannels(settingsData) {
  const ch = settingsData?.channels || {};
  CH_KEYS.forEach(key => {
    const cfg = ch[key] || {};
    const enabledEl    = document.getElementById(`ch-${key}-enabled`);
    const multiplierEl = document.getElementById(`ch-${key}-multiplier`);
    if (enabledEl) enabledEl.checked = key === 'direct' ? (cfg.enabled !== false) : (cfg.enabled === true);
    if (multiplierEl && cfg.multiplier !== undefined) multiplierEl.value = cfg.multiplier;
    ['cancel','booking-type','listing-type','location'].forEach(f => {
      const el = document.getElementById(`ch-${key}-${f}`);
      if (el && cfg[f]) el.value = cfg[f];
    });
    chUpdateStatus(key);
  });
  // Populate read-only IDs from main settings fields
  const aId = document.getElementById('ms-airbnb-id')?.value;
  const vId = document.getElementById('ms-vrbo-id')?.value;
  if (aId) { const el = document.getElementById('ch-airbnb-id'); if(el) el.value = aId; }
  if (vId) { const el = document.getElementById('ch-vrbo-id');   if(el) el.value = vId; }
  // Direct booking URL
  const aptCode = window._currentApt || '';
  const urlEl = document.getElementById('ch-direct-url');
  if (urlEl && aptCode) urlEl.value = 'https://stay.willowpa.com/?apt=' + encodeURIComponent(aptCode);
  chUpdateRatePreview();
}

function collectChannels() {
  const ch = {};
  CH_KEYS.forEach(key => {
    ch[key] = {
      enabled:    document.getElementById(`ch-${key}-enabled`)?.checked || false,
      multiplier: parseFloat(document.getElementById(`ch-${key}-multiplier`)?.value || 0),
    };
    ['cancel','booking-type','listing-type','location'].forEach(f => {
      const el = document.getElementById(`ch-${key}-${f}`);
      if (el) ch[key][f] = el.value;
    });
  });
  return ch;
}

async function saveChannels() {
  const apt = window._currentApt;
  if (!apt) { toast('No property loaded','error'); return; }
  try {
    const { error } = await sb.from('property_settings').upsert(
      { apt, channels: collectChannels(), updated_at: new Date().toISOString() },
      { onConflict: 'apt' }
    );
    if (error) throw error;
    toast('Channel settings saved ✓','success');
  } catch(e) {
    toast('Save failed: '+e.message,'error');
  }
}

// Update rate preview when base price changes anywhere
document.addEventListener('input', e => {
  if (e.target.id === 'pr-base-price' || e.target.id === 'ms-base-price') chUpdateRatePreview();
  if (e.target.id?.startsWith('ch-') && e.target.id?.endsWith('-multiplier')) chUpdateRatePreview();
});

