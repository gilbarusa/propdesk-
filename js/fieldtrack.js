/* FieldTrack v6 — embedded in PropDesk TechTrack module */
/* Auto-namespaced: FT_ prefix on conflicting globals */

/* 
   FIELDTRACK v6  app.js
   New: assign jobs, NEW badge, API key setting,
        PDF export, admin edits completed jobs
 */

//  STATE 
var FT_state = {
  owners:[], technicians:[], properties:[], jobs:[], users:[],
  _nextId:1, _initialized:false
};
var FT__stateSaveTimer = null;

var FT_currentUser = null;
var FT__toastTimer = null;
var FT__theme = 'dark'; // theme managed by PropDesk

// Persist session across refreshes (sessionStorage = tab, localStorage = remember me)
(function(){
  var saved = localStorage.getItem('ft_remember') || sessionStorage.getItem('ft_session');
  if(saved){
    try{
      var u=JSON.parse(saved);
      var found=FT_state.users.find(function(x){ return x.id===u.id&&x.status==='active'; });
      if(found) FT_currentUser=found;
    }catch(e){}
  }
})();

//  HELPERS 
function FT_save(){
  clearTimeout(FT__stateSaveTimer);
  FT__stateSaveTimer = setTimeout(function(){
    fetch('https://tech.willowpa.com/state.php',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({state:FT_state})
    })
    .then(function(r){ return r.json(); })
    .then(function(d){ if(!d.ok) console.warn('Save failed:',d); })
    .catch(function(e){ console.warn('Save error:',e); });
  }, 600);
  var t=document.getElementById('ft-save-toast');
  if(t){ t.style.display='block'; clearTimeout(FT__toastTimer); FT__toastTimer=setTimeout(function(){ t.style.display='none'; },1800); }
  updateStorageBar();
}
function FT_uid(){ return FT_state._nextId++; }
var FT_COLORS=['#c47f00','#0a7c8e','#b02040','#1a7a4a','#7c3aed','#c2410c','#0369a1','#be185d'];
function FT_esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function FT_nextWO(){ var max=0; FT_state.jobs.forEach(function(j){ if(j.woNum){ var n=parseInt(j.woNum.replace(/\D/g,'')); if(n>max) max=n; } }); return 'WO-'+String(max+1).padStart(4,'0'); }
function fmt$(n){ return '$'+Number(n||0).toFixed(2); }
function fmtH(n){ return Number(n||0).toFixed(2)+'h'; }
function FT_today(){ return new Date().toISOString().slice(0,10); }
function weekStart(){ var d=new Date(),dy=d.getDay(); d.setDate(d.getDate()-dy); return d.toISOString().slice(0,10); }
function weekEnd(){ var d=new Date(),dy=d.getDay(); d.setDate(d.getDate()+(6-dy)); return d.toISOString().slice(0,10); }
function getTech(id){ return FT_state.technicians.find(function(t){ return t.id===+id; }); }
function getProp(id){ return FT_state.properties.find(function(p){ return p.id===+id; }); }
function getOwner(id){ return FT_state.owners.find(function(o){ return o.id===+id; }); }
function getUser(id){ return FT_state.users.find(function(u){ return u.id===+id; }); }
function getJob(id){ return FT_state.jobs.find(function(j){ return j.id===+id; }); }
function propFullAddr(p){ if(!p) return ''; return [p.address,p.unit,p.city].filter(Boolean).join(', '); }
function addrMatch(p,term){ if(!term) return true; return (p.name+' '+propFullAddr(p)).toLowerCase().indexOf(term.toLowerCase())>=0; }
function jobMatchesSearch(job,term){
  if(!term) return true;
  var prop=getProp(job.propId);
  var haystack=[prop?prop.name:'',prop?propFullAddr(prop):'',job.notes||'',
    (job.hours||[]).map(function(h){ return h.desc||''; }).join(' '),
    (job.expenses||[]).map(function(e){ return (e.store||'')+' '+(e.desc||''); }).join(' ')
  ].join(' ').toLowerCase();
  return haystack.indexOf(term.toLowerCase())>=0;
}
function jobTotalHours(job){ return (job.hours||[]).reduce(function(s,h){ return s+h.hours; },0); }
function jobTotalLabor(job){
  var tech=getTech(job.techId),prop=getProp(job.propId);
  var rate=prop?(prop.rateType==='tech'&&tech?+tech.rate:(prop.defaultRate?+prop.defaultRate:(tech?+tech.rate:0))):0;
  return jobTotalHours(job)*rate;
}
function jobTotalExp(job){ return (job.expenses||[]).reduce(function(s,e){ return s+e.cost; },0); }
function populateSelect(sel,items,valKey,labelFn,emptyLabel){
  var prev=sel.value; sel.innerHTML=emptyLabel?'<option value="">'+emptyLabel+'</option>':'';
  items.forEach(function(i){ var o=document.createElement('option'); o.value=i[valKey]; o.textContent=labelFn(i); sel.appendChild(o); });
  if(prev) sel.value=prev;
}
function hlTerm(text,term){
  if(!term||!text) return FT_esc(text);
  var escaped=FT_esc(text);
  var idx=escaped.toLowerCase().indexOf(FT_esc(term).toLowerCase());
  if(idx<0) return escaped;
  return escaped.slice(0,idx)+'<mark>'+escaped.slice(idx,idx+FT_esc(term).length)+'</mark>'+escaped.slice(idx+FT_esc(term).length);
}

//  API KEY (stored server-side in FT_state only — not in localStorage)
function getApiKey(){
  return FT_state._apiKey || '';
}
function setApiKey(k){
  var key=k.trim();
  FT_state._apiKey=key;
  FT_save();
}

//  STRIPE KEY (stored server-side in FT_state)
function getStripeKey(){
  return FT_state._stripeKey || '';
}
function setStripeKey(k){
  FT_state._stripeKey=k.trim();
  FT_save();
}

//  THEME
function toggleTheme(){
  FT__theme=FT__theme==='dark'?'light':'dark';
  document.body.classList.toggle('light',FT__theme==='light');
  localStorage.setItem('ft_theme',FT__theme);
  var btn=document.getElementById('theme-toggle');
  if(btn) btn.textContent=FT__theme==='dark'?' Light':' Dark';
}

//  STORAGE BAR 
function updateStorageBar(){
  var ls=JSON.stringify(FT_state).length;
  var lsKB=Math.round(ls/1024);
  var lsPct=Math.min(100,(ls/(5*1024*1024))*100).toFixed(1);
  var color=lsPct>80?'#b02040':lsPct>50?'#c47f00':'#1a7a4a';
  ['storage-fill','storage-fill2'].forEach(function(id){ var el=document.getElementById(id); if(el){ el.style.width=lsPct+'%'; el.style.background=color; } });
  ['storage-label','storage-label2'].forEach(function(id){ var el=document.getElementById(id); if(el) el.textContent='Text: '+lsKB+'KB / 5MB ('+lsPct+'%)'; });
  FT_DB.countBytes(function(err,bytes){
    var mb=(bytes/(1024*1024)).toFixed(1);
    ['storage-photo','storage-photo2'].forEach(function(id){ var el=document.getElementById(id); if(el) el.textContent='Photos: ~'+mb+'MB'; });
  });
}

//  SIDEBAR 
function FT_toggleSidebar(){ var s=document.getElementById('sidebar'),b=document.getElementById('sidebar-backdrop'); if(s) s.classList.toggle('open'); if(b) b.classList.toggle('open'); }
function FT_closeSidebar(){ var s=document.getElementById('sidebar'),b=document.getElementById('sidebar-backdrop'); if(s) s.classList.remove('open'); if(b) b.classList.remove('open'); }
function FT_openModal(id){ document.getElementById(id).classList.add('open'); }
function FT_closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('#ft-app .modal-overlay, [id^="ft-modal-"]').forEach(function(m){
  m.addEventListener('click',function(e){ if(e.target===m) m.classList.remove('open'); });
});

//  NAV GROUPS 
function toggleNavGroup(el){
  var key=el.getAttribute('data-group');
  var items=el.nextElementSibling;
  var chevron=el.querySelector('.nav-chevron');
  var isCollapsed=items.style.maxHeight==='0px'||items.style.maxHeight==='';
  if(isCollapsed){ items.style.maxHeight=items.scrollHeight+'px'; if(chevron) chevron.style.transform='rotate(0deg)'; }
  else { items.style.maxHeight='0px'; if(chevron) chevron.style.transform='rotate(-90deg)'; }
  var saved=JSON.parse(localStorage.getItem('ft_nav')||'{}');
  saved[key]=!isCollapsed;
  localStorage.setItem('ft_nav',JSON.stringify(saved));
}
function restoreNavState(){
  var saved=JSON.parse(localStorage.getItem('ft_nav')||'{}');
  document.querySelectorAll('.nav-group-header').forEach(function(el){
    var key=el.getAttribute('data-group');
    var items=el.nextElementSibling;
    var chevron=el.querySelector('.nav-chevron');
    if(saved[key]===true){ items.style.maxHeight='0px'; if(chevron) chevron.style.transform='rotate(-90deg)'; }
    else { items.style.maxHeight=items.scrollHeight+'px'; }
  });
}

//  AUTH 
// login listeners removed - auto-login in PropDesk

function FT_doLogin(){
  var uname=document.getElementById('login-user').value.trim().toLowerCase();
  var pass=document.getElementById('login-pass').value;
  var err=document.getElementById('login-err'); err.style.display='none';
  var user=FT_state.users.find(function(u){ return u.username===uname&&u.password===pass&&u.status==='active'; });
  if(!user){ err.style.display='block'; return; }
  setCurrentUser(user, true);
}
function setCurrentUser(user, fromLogin){
  FT_currentUser=user;
  if(fromLogin){
    var remember=(document.getElementById('remember-me')||{}).checked;
    if(remember){ localStorage.setItem('ft_remember',JSON.stringify({id:user.id})); }
    else { localStorage.removeItem('ft_remember'); }
  }
  sessionStorage.setItem('ft_session',JSON.stringify({id:user.id}));
  var _el=function(id){return document.getElementById(id);};
  if(_el('topbar-name')) _el('topbar-name').textContent=user.name;
  if(_el('topbar-role')) _el('topbar-role').textContent=user.role==='admin'?'Admin':'Tech';
  var btn=_el('theme-toggle'); if(btn) btn.textContent=FT__theme==='dark'?' Light':' Dark';
  if(_el('badge-name')) _el('badge-name').textContent=user.name;
  if(_el('badge-role')) _el('badge-role').textContent=user.role==='admin'?' Administrator':'&#x1F477; Technician';
  if(_el('login-screen')) _el('login-screen').style.display='none';
  if(_el('app')) _el('app').classList.add('visible');
  // In PropDesk, nav is handled by PropDesk shell — skip FT_renderNav/updateStorageBar
  if(_el('sidebar-nav')){ FT_renderNav(); updateStorageBar(); }
  // Don't auto-navigate when embedded in PropDesk (showSubPage handles this)
  if(!document.getElementById('ft-app')){
    if(user.role==='admin') FT_showPage('jobs');
    else FT_showPage('myjobs');
  }
}
function FT_doLogout(){
  FT_currentUser=null; sessionStorage.removeItem('ft_session'); localStorage.removeItem('ft_remember');
  var _el=function(id){return document.getElementById(id);};
  if(_el('app')) _el('app').classList.remove('visible');
  if(_el('login-screen')) _el('login-screen').style.display='flex';
  if(_el('login-user')) _el('login-user').value='';
  if(_el('login-pass')) _el('login-pass').value='';
  FT_closeSidebar();
}
function FT_isAdmin(){ return FT_currentUser&&FT_currentUser.role==='admin'; }

//  NAV 
function FT_renderNav(){
  var nav=document.getElementById('sidebar-nav');
  var h='';
  if(FT_isAdmin()){
    h+='<div class="nav-group"><button class="nav-group-header" data-group="main" onclick="toggleNavGroup(this)">Main <span class="nav-chevron">&#x25BE;</span></button><div class="nav-group-items">';
    h+='<button class="nav-btn" id="nav-dashboard" onclick="FT_showPage(\'dashboard\');FT_closeSidebar()"><span class="ico">&#x1F4CA;</span>Dashboard</button>';
    h+='<button class="nav-btn" id="nav-jobs" onclick="FT_showPage(\'jobs\');FT_closeSidebar()"><span class="ico">&#x1F4CB;</span>All Jobs</button>';
    h+='<button class="nav-btn" id="nav-reports" onclick="FT_showPage(\'reports\');FT_closeSidebar()"><span class="ico">&#x1F4C8;</span>Reports</button>';
    h+='</div></div>';
    h+='<div class="nav-group"><button class="nav-group-header" data-group="setup" onclick="toggleNavGroup(this)">Setup <span class="nav-chevron">&#x25BE;</span></button><div class="nav-group-items">';
    h+='<button class="nav-btn" id="nav-technicians" onclick="FT_showPage(\'technicians\');FT_closeSidebar()"><span class="ico">&#x1F477;</span>Technicians</button>';
    h+='<button class="nav-btn" id="nav-properties" onclick="FT_showPage(\'properties\');FT_closeSidebar()"><span class="ico">&#x1F3E2;</span>Properties</button>';
    h+='<button class="nav-btn" id="nav-owners" onclick="FT_showPage(\'owners\');FT_closeSidebar()"><span class="ico">&#x1F464;</span>Owners</button>';
    h+='<button class="nav-btn" id="nav-users" onclick="FT_showPage(\'users\');FT_closeSidebar()"><span class="ico">&#x1F510;</span>Users</button>';
    h+='</div></div>';
    h+='<div class="nav-group"><button class="nav-group-header" data-group="data" onclick="toggleNavGroup(this)">Data <span class="nav-chevron">&#x25BE;</span></button><div class="nav-group-items">';
    h+='<button class="nav-btn" id="nav-data" onclick="FT_showPage(\'data\');FT_closeSidebar()"><span class="ico">&#x1F4BE;</span>Manage Data</button>';
    h+='<button class="nav-btn" id="nav-settings" onclick="FT_showPage(\'settings\');FT_closeSidebar()"><span class="ico">&#x2699;&#xFE0F;</span>Settings</button>';
    h+='</div></div>';
    h+='<div class="nav-group"><button class="nav-group-header" data-group="booking" onclick="toggleNavGroup(this)">Booking <span class="nav-chevron">&#x25BE;</span></button><div class="nav-group-items">';
    h+='<button class="nav-btn" id="nav-requests" onclick="FT_showPage(\'requests\');FT_closeSidebar()"><span class="ico">&#x1F4E5;</span>Requests <span id="req-badge" style="background:#e05c7a;color:#fff;font-size:10px;padding:1px 6px;border-radius:99px;margin-left:4px;display:none">0</span></button>';
    h+='<button class="nav-btn" id="nav-availability" onclick="FT_showPage(\'availability\');FT_closeSidebar()"><span class="ico">&#x1F4C5;</span>Availability</button>';
    h+='<button class="nav-btn" id="nav-shares" onclick="FT_showPage(\'shares\');FT_closeSidebar()"><span class="ico">&#x1F517;</span>Share Links</button>';
    h+='</div></div>';
  } else {
    h+='<div class="nav-group"><button class="nav-group-header" data-group="mywork" onclick="toggleNavGroup(this)">My Work <span class="nav-chevron">&#x25BE;</span></button><div class="nav-group-items">';
    h+='<button class="nav-btn active" id="nav-myjobs" onclick="FT_showPage(\'myjobs\');FT_closeSidebar()"><span class="ico">&#x1F528;</span>My Jobs</button>';
    h+='</div></div>';
  }
  h+='<div class="nav-spacer"></div>';
  h+='<div class="nav-bottom"><button class="nav-btn" onclick="FT_doLogout()" style="color:var(--accent3)"><span class="ico">&#x1F6AA;</span>Sign Out</button></div>';
  nav.innerHTML=h;
  setTimeout(restoreNavState,10);
}

function FT_showPage(page){
  var ftApp=document.getElementById('ft-app');
  if(!ftApp) return;
  ftApp.querySelectorAll('.ft-page').forEach(function(p){ p.classList.remove('active'); });
  ftApp.querySelectorAll('.nav-btn').forEach(function(b){ b.classList.remove('active'); });
  var pg=document.getElementById('ft-page-'+page); if(pg) pg.classList.add('active');
  var nb=document.getElementById('nav-'+page); if(nb) nb.classList.add('active');
  try{
    if(page==='myjobs'&&typeof renderMyJobs==='function')      renderMyJobs();
    if(page==='dashboard'&&typeof FT_renderDashboard==='function') FT_renderDashboard();
    if(page==='jobs'&&typeof renderAllJobs==='function')        renderAllJobs();
    if(page==='reports'&&typeof initReportsPage==='function')   initReportsPage();
    if(page==='data'){ if(typeof updateStorageBar==='function') updateStorageBar(); if(typeof populateDeleteSelects==='function') populateDeleteSelects(); }
    if(page==='settings'&&typeof renderSettingsPage==='function')    renderSettingsPage();
    if(page==='requests'&&typeof renderRequestsPage==='function')    renderRequestsPage();
    if(page==='incoming'&&typeof loadIncomingRequests==='function')  loadIncomingRequests();
    if(page==='completed'&&typeof renderCompletedJobs==='function') renderCompletedJobs();
    if(page==='availability'&&typeof renderAvailabilityPage==='function') renderAvailabilityPage();
    if(page==='shares'&&typeof renderSharesPage==='function')      renderSharesPage();
    if(page==='technicians'&&typeof renderTechs==='function') renderTechs();
    if(page==='properties'&&typeof renderProps==='function')  renderProps();
    if(page==='property-detail'&&typeof renderPropDetail==='function') renderPropDetail();
    if(page==='owners'&&typeof renderOwners==='function')      renderOwners();
    if(page==='users'&&typeof renderUsers==='function')       renderUsers();
  }catch(e){ console.error('FT_showPage error:',e); }
  window.scrollTo(0,0);
}



//  PROPERTY AUTOCOMPLETE 
function hlMatch(str,term){
  if(!term) return FT_esc(str);
  var idx=str.toLowerCase().indexOf(term.toLowerCase());
  if(idx<0) return FT_esc(str);
  return FT_esc(str.slice(0,idx))+'<span class="ac-match">'+FT_esc(str.slice(idx,idx+term.length))+'</span>'+FT_esc(str.slice(idx+term.length));
}
function buildPropAC(inputId,listId,hiddenId,selectedId){
  var term=((document.getElementById(inputId)||{}).value||'').trim();
  var list=document.getElementById(listId); if(!list) return;
  if(!term){ list.classList.remove('open'); return; }
  var matches=FT_state.properties.filter(function(p){ return addrMatch(p,term); }).slice(0,12);
  if(!matches.length){ list.classList.remove('open'); return; }
  list.innerHTML=matches.map(function(p){
    return '<div class="ac-item" onclick="selectPropAC(\''+inputId+'\',\''+listId+'\',\''+hiddenId+'\',\''+selectedId+'\','+p.id+')">'
      +'<div>'+hlMatch(p.name,term)+'</div><div class="ac-sub">'+hlMatch(propFullAddr(p),term)+'</div></div>';
  }).join('');
  list.classList.add('open');
}
function selectPropAC(inputId,listId,hiddenId,selectedId,propId){
  var p=getProp(propId);
  var inp=document.getElementById(inputId); if(inp) inp.value='';
  var hid=document.getElementById(hiddenId); if(hid) hid.value=propId;
  var lst=document.getElementById(listId); if(lst) lst.classList.remove('open');
  var sel=document.getElementById(selectedId); if(sel){ sel.textContent=' '+p.name+(p.unit?' ('+p.unit+')':''); sel.style.display='block'; }
}
function njPropSearch(){ buildPropAC('nj-prop-search','nj-ac-list','nj-prop-id','nj-prop-selected'); }
function ajPropSearch(){ buildPropAC('aj-prop-search','aj-ac-list','aj-prop-id','aj-prop-selected'); }
document.addEventListener('click',function(e){
  if(!e.target.closest('.autocomplete-wrap')){ var ft=document.getElementById('ft-app'); if(ft) ft.querySelectorAll('.ac-list').forEach(function(l){ l.classList.remove('open'); }); }
});

//  NEW BADGE 
// seenJobs stored server-side in FT_state: { userId: [jobId, ...] }
function hasSeenJob(jobId){
  if(!FT_currentUser) return true;
  var seen=FT_state.seenJobs||{};
  return (seen[FT_currentUser.id]||[]).indexOf(+jobId)>=0;
}
function markJobSeen(jobId){
  if(!FT_currentUser) return;
  if(!FT_state.seenJobs) FT_state.seenJobs={};
  if(!FT_state.seenJobs[FT_currentUser.id]) FT_state.seenJobs[FT_currentUser.id]=[];
  if(FT_state.seenJobs[FT_currentUser.id].indexOf(+jobId)<0){
    FT_state.seenJobs[FT_currentUser.id].push(+jobId);
    FT_save();
  }
}

var FT_selectedJobId = null;

//  JOB LIST ITEM (compact card for left panel)
function renderJobListItem(job, searchTerm){
  var prop=getProp(job.propId);
  var tech=getTech(job.techId);
  var pname=prop?prop.name:'Unknown';
  var hrs=jobTotalHours(job), exps=jobTotalExp(job);
  var st=searchTerm||'';
  var isNew=job.assignedByAdmin&&!hasSeenJob(job.id)&&!FT_isAdmin();
  var borderColors={open:'var(--accent2)',in_progress:'#f59e0b',waiting_parts:'#3b82f6',pending_approval:'#ec4899',complete:'var(--success)',closed:'#6b7280'};
  var borderC=borderColors[job.status]||'var(--accent2)';
  var statusLabels={open:'Open',in_progress:'In Progress',waiting_parts:'Parts',pending_approval:'Pending',complete:'Done',closed:'Closed'};
  var selected = FT_selectedJobId===job.id;

  var h='<div class="wo-list-item'+(selected?' wo-list-active':'')+'" id="woli-'+job.id+'" onclick="selectJob('+job.id+')" style="border-left:4px solid '+borderC+'">';
  // Row 1: WO + Status
  h+='<div style="display:flex;align-items:center;justify-content:space-between;gap:6px">';
  h+='<span class="wo-li-wo">'+(job.woNum||'—')+'</span>';
  if(isNew) h+='<span class="wo-li-new">NEW</span>';
  h+='<span class="wo-li-status" style="color:'+borderC+'">'+( statusLabels[job.status]||job.status)+'</span>';
  h+='</div>';
  // Row 2: Title
  if(job.title) h+='<div class="wo-li-title">'+hlTerm(job.title,st)+'</div>';
  // Row 3: Property + tech
  h+='<div class="wo-li-prop">'+hlTerm(pname,st);
  if(FT_isAdmin()&&tech) h+=' &middot; <span style="color:var(--accent2)">'+FT_esc(tech.name)+'</span>';
  h+='</div>';
  // Row 4: Date + stats
  h+='<div class="wo-li-meta">';
  h+='<span>'+job.date+'</span>';
  h+='<span>'+hrs.toFixed(1)+'h</span>';
  if(exps) h+='<span>'+fmt$(exps)+'</span>';
  if(FT_isAdmin()&&(job.status==='complete'||job.status==='closed')){
    h+=job.isPaid?'<span style="color:var(--success)">PAID</span>':'<span style="color:var(--accent3)">DUE</span>';
  }
  if(job.timerStart) h+='<span class="blink" style="color:#f59e0b">&#x23F1;</span>';
  h+='</div>';
  h+='</div>';
  return h;
}

//  SELECT JOB — show in right detail panel
function selectJob(jobId){
  var prev = FT_selectedJobId;
  FT_selectedJobId = jobId;
  // Update list active state
  if(prev){ var old=document.getElementById('woli-'+prev); if(old) old.classList.remove('wo-list-active'); }
  var cur=document.getElementById('woli-'+jobId); if(cur) cur.classList.add('wo-list-active');
  // Mark as seen
  if(!FT_isAdmin()) markJobSeen(jobId);
  // Show detail
  renderJobDetail(jobId);
}

function renderJobDetail(jobId){
  var job=getJob(jobId); if(!job) return;
  var empty=document.getElementById('wo-detail-empty');
  var content=document.getElementById('wo-detail-content');
  if(empty) empty.style.display='none';
  if(content){ content.style.display='block'; content.innerHTML=buildJobDetailPanel(job); }
  loadThumbs(job);
}

//  FULL JOB DETAIL (right panel) — wraps buildJobBody with header
function buildJobDetailPanel(job){
  var prop=getProp(job.propId);
  var tech=getTech(job.techId);
  var pname=prop?prop.name:'Unknown Property';
  var addr=prop?propFullAddr(prop):'';
  var borderColors={open:'var(--accent2)',in_progress:'#f59e0b',waiting_parts:'#3b82f6',pending_approval:'#ec4899',complete:'var(--success)',closed:'#6b7280'};
  var statusLabels={open:'Open',in_progress:'In Progress',waiting_parts:'Waiting Parts',pending_approval:'Pending Approval',complete:'Complete',closed:'Closed'};
  var borderC=borderColors[job.status]||'var(--accent2)';
  var editable=FT_isAdmin()||(job.techId===(FT_currentUser||{}).techId&&(job.status==='open'||job.status==='in_progress'||job.status==='waiting_parts'));

  var h='<div class="wo-detail-inner">';
  // Detail header
  h+='<div class="wo-dh" style="border-bottom:3px solid '+borderC+'">';
  h+='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">';
  h+='<div style="flex:1;min-width:200px">';
  h+='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">';
  if(job.woNum) h+='<span class="wo-dh-wo">'+job.woNum+'</span>';
  h+='<span class="wo-dh-status" style="background:'+borderC+'">'+(statusLabels[job.status]||job.status)+'</span>';
  h+='</div>';
  if(job.title) h+='<div class="wo-dh-title">'+FT_esc(job.title)+'</div>';
  h+='<div class="wo-dh-prop">'+FT_esc(pname)+'</div>';
  if(addr) h+='<div class="wo-dh-addr">'+FT_esc(addr)+'</div>';
  h+='</div>';
  // Right: tech + date
  h+='<div style="text-align:right;flex-shrink:0">';
  if(tech) h+='<div style="font-size:13px;font-weight:600;color:var(--accent2)">'+FT_esc(tech.name)+'</div>';
  h+='<div style="font-size:12px;color:var(--muted);font-family:var(--fm)">'+job.date+'</div>';
  h+='</div>';
  h+='</div></div>';
  // Body sections
  h+=buildJobBody(job, editable, '');
  h+='</div>';
  return h;
}

// Legacy compat — renderJobCard now just renders list items
function renderJobCard(job, editable, searchTerm){
  return renderJobListItem(job, searchTerm);
}

function buildJobBody(job, editable, st){
  var tech=getTech(job.techId);
  var prop=getProp(job.propId);
  var rate=prop?(prop.rateType==='tech'&&tech?+tech.rate:(prop.defaultRate?+prop.defaultRate:(tech?+tech.rate:0))):0;
  var h=''; st=st||'';

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: STATUS BANNER + ADMIN ACTIONS (top of card)
  // ═══════════════════════════════════════════════════════════════
  if(job.status==='pending_approval'){
    h+='<div class="jc-section jc-section-pending">'
      +'<div class="jc-section-header"><span class="jc-section-icon">&#x23F3;</span> Pending Admin Approval</div>'
      +'<div class="jc-section-sub">Tech marked complete on '+FT_esc(job.completedDate||'')+'</div>';
    if(FT_isAdmin()){
      h+='<div class="jc-btn-row" style="margin-top:10px">'
        +'<button class="btn btn-complete btn-sm" style="padding:10px 24px;font-size:14px" onclick="adminApproveJob('+job.id+')">&#x2713; Approve &amp; Bill</button>'
        +'<button class="btn btn-secondary btn-sm" onclick="adminReopenJob('+job.id+')">&#x21A9; Send Back</button>'
        +'<button class="btn btn-secondary btn-sm" onclick="openReassignJob('+job.id+')">Reassign</button>'
        +'</div>';
    }
    h+='</div>';
  }
  if(job.status==='complete'){
    h+='<div class="jc-section jc-section-complete">'
      +'<div class="jc-section-header"><span class="jc-section-icon">&#x2713;</span> Completed '+FT_esc(job.completedDate||'')+'</div>';
    if(FT_isAdmin()){
      h+='<div class="jc-btn-row" style="margin-top:8px">'
        +'<button class="btn btn-secondary btn-sm" onclick="adminReopenJob('+job.id+')">&#x21A9; Re-open</button>'
        +'<button class="btn btn-secondary btn-sm" onclick="openReassignJob('+job.id+')">Reassign</button>'
        +'<button class="btn btn-secondary btn-sm" onclick="exportJobPDF('+job.id+')">PDF</button>'
        +'<button class="btn btn-success btn-sm" onclick="openShareModal('+job.id+')">&#x1F517; Share</button>'
        +'</div>';
    }
    h+='</div>';
  }
  if(job.status==='closed'){
    h+='<div class="jc-section jc-section-closed">'
      +'<div class="jc-section-header"><span class="jc-section-icon">&#x1F512;</span> Closed '+FT_esc(job.closedDate||job.completedDate||'')+'</div>';
    if(job.clientEmailed) h+='<div class="jc-section-sub" style="color:var(--success)">&#x2709; Client emailed '+FT_esc(job.clientEmailedDate||'')+'</div>';
    if(FT_isAdmin()){
      h+='<div class="jc-btn-row" style="margin-top:8px">'
        +'<button class="btn btn-secondary btn-sm" onclick="adminReopenJob('+job.id+')">&#x21A9; Re-open</button>'
        +'<button class="btn btn-secondary btn-sm" onclick="exportJobPDF('+job.id+')">PDF</button>'
        +'</div>';
    }
    h+='</div>';
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: ASSIGNMENT BAR
  // ═══════════════════════════════════════════════════════════════
  if(FT_isAdmin()&&job.assignedByAdmin){
    h+='<div class="jc-assign-bar">'
      +'<span>&#x1F4CC; Assigned to: <strong>'+FT_esc(tech?tech.name:'Unassigned')+'</strong></span>'
      +'<button class="btn btn-secondary btn-xs" onclick="openReassignJob('+job.id+')">Reassign</button>'
      +'</div>';
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: TIMER + WORKFLOW CONTROLS (active jobs only)
  // ═══════════════════════════════════════════════════════════════
  if(job.status==='open'||job.status==='in_progress'||job.status==='waiting_parts'){
    h+='<div class="jc-section jc-section-timer">';
    // Timer controls
    h+='<div class="jc-timer-row">';
    if(job.timerStart){
      h+='<button class="btn btn-secondary btn-timer" onclick="pauseJobTimer('+job.id+')">&#x23F8; Pause</button>';
      h+='<span class="blink jc-timer-running" id="timer-'+job.id+'">&#x23F1; Running</span>';
      if(FT_isAdmin()) h+='<button class="btn btn-danger btn-sm" onclick="adminStopTimer('+job.id+')" style="margin-left:auto">&#x23F9; Stop</button>';
    } else {
      h+='<button class="btn btn-primary btn-timer" onclick="startJobTimer('+job.id+')">&#x25B6; Start</button>';
      if(job.status==='in_progress') h+='<span class="jc-timer-paused">&#x23F8; Paused</span>';
    }
    h+='</div>';
    // Status action row
    h+='<div class="jc-btn-row">';
    if(job.status!=='waiting_parts'){
      h+='<button class="btn btn-secondary btn-sm" onclick="setJobStatus('+job.id+',\'waiting_parts\')">&#x23F3; Waiting for Parts</button>';
    } else {
      h+='<button class="btn btn-secondary btn-sm" onclick="setJobStatus('+job.id+',\'open\')">&#x1F527; Back to Open</button>';
    }
    h+='<button class="btn btn-complete btn-sm" onclick="event.stopPropagation();markComplete('+job.id+')">&#x2713; Complete</button>';
    if(FT_isAdmin()) h+='<button class="btn btn-secondary btn-sm" onclick="exportJobPDF('+job.id+')">PDF</button>';
    h+='</div>';
    h+='</div>';
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 4: NOTES
  // ═══════════════════════════════════════════════════════════════
  h+='<div class="jc-section">';
  h+='<div class="jc-section-label">Notes</div>';
  if(editable){
    h+='<textarea id="job-notes-'+job.id+'" rows="3" class="jc-textarea">'+FT_esc(job.notes||'')+'</textarea>'
      +'<div style="display:flex;gap:4px;margin-top:6px;justify-content:flex-end">'
      +'<button type="button" class="btn btn-secondary btn-xs" onclick="startVoice(\'job-notes-'+job.id+'\',this)">&#x1F3A4; Voice</button>'
      +'<button type="button" class="btn btn-ai btn-xs" onclick="rephraseText(\'job-notes-'+job.id+'\',this)">&#x2728; AI Rephrase</button>'
      +'<button class="btn btn-primary btn-xs" onclick="saveJobNotes('+job.id+')">Save</button>'
      +'</div>';
  } else if(job.notes){
    h+='<div class="jc-notes-ro">'+hlTerm(job.notes,st)+'</div>';
  } else {
    h+='<div class="jc-empty">No notes</div>';
  }
  h+='</div>';

  // ═══════════════════════════════════════════════════════════════
  // SECTION 5: HOURS  +  SECTION 6: PARTS/EXPENSES  (side by side)
  // ═══════════════════════════════════════════════════════════════
  h+='<div class="jc-two-col">';

  // ── HOURS (compact) ──
  h+='<div class="jc-mini">';
  h+='<div class="jc-mini-hdr">Hours <span class="jc-mini-badge">'+jobTotalHours(job).toFixed(1)+'h</span>';
  if(editable) h+='<button class="jc-add-toggle" onclick="toggleAddForm(\'hrs-form-'+job.id+'\',this)">+</button>';
  h+='</div>';
  if((job.hours||[]).length){
    job.hours.forEach(function(hr){
      h+='<div class="jc-mini-row">'
        +'<span class="jc-mini-date">'+hr.date+'</span>'
        +'<span class="jc-mini-txt">'+hlTerm(hr.desc||'',st)+'</span>'
        +'<span class="jc-mini-val" style="color:var(--accent)">'+hr.hours+'h</span>';
      if(editable) h+='<button class="jc-row-del" onclick="deleteHour('+job.id+','+hr.id+')">&#x2715;</button>';
      h+='</div>';
    });
  } else { h+='<div class="jc-mini-empty">No hours</div>'; }
  if(editable){
    h+='<div class="jc-inline-form" id="hrs-form-'+job.id+'" style="display:none">'
      +'<div class="jc-if-row">'
      +'<input type="date" id="ah-date-'+job.id+'" value="'+FT_today()+'" class="jc-if-date">'
      +'<input type="number" id="ah-hrs-'+job.id+'" min="0.25" max="24" step="0.25" placeholder="Hrs" inputmode="decimal" class="jc-if-num">'
      +'<input type="text" id="ah-desc-'+job.id+'" placeholder="Description..." class="jc-if-desc">'
      +'<button class="jc-if-ai" onclick="rephraseWorkDesc('+job.id+')" title="AI rephrase">&#x2728;</button>'
      +'<button class="jc-if-submit" onclick="addHour('+job.id+')">Add</button>'
      +'</div></div>';
  }
  h+='</div>';

  // ── PARTS / EXPENSES (compact) ──
  h+='<div class="jc-mini">';
  h+='<div class="jc-mini-hdr">Parts &amp; Expenses <span class="jc-mini-badge">'+fmt$(jobTotalExp(job))+'</span>';
  if(editable) h+='<button class="jc-add-toggle" onclick="toggleAddForm(\'exp-form-'+job.id+'\',this)">+</button>';
  h+='</div>';
  if((job.expenses||[]).length){
    job.expenses.forEach(function(ex){
      h+='<div class="jc-mini-row">'
        +'<span class="jc-mini-date">'+ex.date+'</span>'
        +'<span class="jc-mini-txt"><strong>'+hlTerm(ex.store,st)+'</strong>'+(ex.desc?' &mdash; '+hlTerm(ex.desc,st):'')+'</span>'
        +'<span class="jc-mini-val" style="color:var(--success)">'+fmt$(ex.cost)+'</span>';
      if(FT_isAdmin()) h+='<button class="btn btn-secondary btn-xs" style="padding:1px 4px;font-size:9px" title="Toggle owner/prop" onclick="setExpLink('+job.id+','+ex.id+')">'+(ex.linkType==='owner'?'Own':'Prop')+'</button>';
      if(editable) h+='<button class="jc-row-del" onclick="deleteExpense('+job.id+','+ex.id+')">&#x2715;</button>';
      h+='</div>';
      // Notes row (if exists)
      if(ex.notes) h+='<div class="jc-mini-note">'+hlTerm(ex.notes,st)+'</div>';
    });
  } else { h+='<div class="jc-mini-empty">No parts/expenses</div>'; }
  if(editable){
    h+='<div class="jc-inline-form" id="exp-form-'+job.id+'" style="display:none">'
      +'<div class="jc-if-row">'
      +'<input type="date" id="ae-date-'+job.id+'" value="'+FT_today()+'" class="jc-if-date">'
      +'<input type="text" id="ae-store-'+job.id+'" placeholder="Store" class="jc-if-store">'
      +'<input type="number" id="ae-cost-'+job.id+'" min="0" step="0.01" placeholder="$0.00" inputmode="decimal" class="jc-if-cost">'
      +'<button class="jc-if-submit jc-if-submit-exp" onclick="addExpense('+job.id+')">Add</button>'
      +'</div>'
      +'<input type="text" id="ae-desc-'+job.id+'" placeholder="What was purchased?" class="jc-if-desc-full">'
      +'<input type="text" id="ae-notes-'+job.id+'" placeholder="Notes (receipt #, warranty, etc.)" class="jc-if-desc-full" style="margin-top:4px">'
      +'</div>';
  }
  h+='</div>';

  h+='</div>'; // close jc-two-col

  // ═══════════════════════════════════════════════════════════════
  // SECTION 7: PHOTOS
  // ═══════════════════════════════════════════════════════════════
  h+='<div class="jc-mini" style="margin-bottom:14px">';
  h+='<div class="jc-mini-hdr">Photos <span class="jc-mini-badge">'+(job.photos||[]).length+'</span></div>';
  h+='<div class="photos-grid" id="photos-'+job.id+'">';
  (job.photos||[]).forEach(function(ph){
    h+='<div class="photo-thumb" id="pt-'+ph.id+'" onclick="FT_openLightbox('+ph.id+')">'
      +'<div class="photo-loading" id="pl-'+ph.id+'">...</div>'
      +'<img id="pimg-'+ph.id+'" src="" alt="'+FT_esc(ph.label)+'" style="display:none" onload="this.style.display=\'block\';var l=document.getElementById(\'pl-'+ph.id+'\');if(l)l.style.display=\'none\'">'
      +'<div class="photo-label">'+FT_esc(ph.label)+'</div>';
    if(editable) h+='<button class="photo-del" onclick="event.stopPropagation();deletePhoto('+job.id+','+ph.id+')"></button>';
    h+='</div>';
  });
  if(editable){
    // Camera button (opens camera directly on mobile)
    h+='<label class="photo-add-btn photo-add-cam" for="ph-cam-'+job.id+'"><span class="photo-add-ico">&#x1F4F7;</span><span>Camera</span></label>'
      +'<input type="file" id="ph-cam-'+job.id+'" accept="image/*" capture="environment" style="display:none" onchange="handlePhoto('+job.id+',this)">';
    // Gallery button (pick from files/gallery)
    h+='<label class="photo-add-btn photo-add-gal" for="ph-gal-'+job.id+'"><span class="photo-add-ico">&#x1F5BC;&#xFE0F;</span><span>Gallery</span></label>'
      +'<input type="file" id="ph-gal-'+job.id+'" accept="image/*" multiple style="display:none" onchange="handlePhoto('+job.id+',this)">';
  }
  h+='</div></div>';

  // ═══════════════════════════════════════════════════════════════
  // SECTION 8: AI REPAIR ASSISTANT
  // ═══════════════════════════════════════════════════════════════
  var apiKey=getApiKey();
  h+='<div class="jc-section">';
  h+='<div class="jc-section-label">&#x1F916; AI Repair Assistant</div>';
  if(!apiKey){
    h+='<div class="jc-empty">'+(FT_isAdmin()?'No API key &mdash; go to <strong>Settings</strong> tab to add your Anthropic key.':'AI not configured &mdash; ask admin.')+'</div>';
  } else {
    h+='<div style="display:flex;gap:8px;flex-wrap:wrap">'
      +'<input type="text" id="ai-q-'+job.id+'" placeholder="Describe the problem... (AC not cooling, grinding noise)" style="flex:1;min-width:200px" onkeydown="if(event.key===\'Enter\') askAI('+job.id+')">'
      +'<button class="btn btn-ai btn-sm" onclick="askAI('+job.id+')">&#x1F916; Ask AI</button>'
      +'</div>'
      +'<div style="font-size:11px;color:var(--muted);margin-top:4px">Photos are automatically included in the analysis.</div>'
      +'<div id="ai-chat-'+job.id+'"></div>';
  }
  h+='</div>';

  // ═══════════════════════════════════════════════════════════════
  // SECTION 9: BILLING SUMMARY (Admin only)
  // ═══════════════════════════════════════════════════════════════
  var tH=jobTotalHours(job), tL=tH*rate, tE=jobTotalExp(job);
  h+='<div class="jc-section jc-section-billing">';
  h+='<div class="jc-section-label">&#x1F4B0; Billing Summary</div>';
  h+='<div class="jc-billing-grid">';
  h+='<div class="jc-billing-row"><span>Hours</span><strong>'+tH.toFixed(2)+'h</strong></div>';
  if(FT_isAdmin()){
    h+='<div class="jc-billing-row"><span>Rate</span><strong>'+fmt$(rate)+'/h</strong></div>';
    h+='<div class="jc-billing-row"><span>Labor</span><strong>'+fmt$(tL)+'</strong></div>';
    h+='<div class="jc-billing-row"><span>Materials/Expenses</span><strong>'+fmt$(tE)+'</strong></div>';
    // Admin can override billing amount
    var billAmt = job.billingAmount!=null ? job.billingAmount : (tL+tE);
    h+='<div class="jc-billing-total"><span>Total</span><strong style="font-size:18px">'+fmt$(billAmt)+'</strong></div>';
    // Editable billing override
    if(job.status==='complete'||job.status==='pending_approval'){
      h+='<div style="margin-top:8px;padding-top:10px;border-top:1px dashed var(--border)">'
        +'<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">'
        +'<label style="font-size:11px;color:var(--muted);white-space:nowrap">Custom Amount:</label>'
        +'<input type="number" id="bill-amt-'+job.id+'" value="'+(job.billingAmount!=null?job.billingAmount:'')+'" placeholder="'+fmt$(tL+tE)+'" step="0.01" min="0" style="width:120px;font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-family:var(--fm)">'
        +'<button class="btn btn-primary btn-xs" onclick="saveBillingAmount('+job.id+')">Set</button>'
        +'<button class="btn btn-ai btn-xs" onclick="aiGenerateInvoiceNotes('+job.id+')">&#x2728; AI Summary</button>'
        +'</div></div>';
    }
    // Payment status badge
    h+='<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">';
    if(job.isPaid){
      h+='<span class="jc-pay-badge jc-pay-paid">&#x2713; PAID</span>';
      if(job.paidDate) h+='<span style="font-size:11px;color:var(--muted)">on '+FT_esc(job.paidDate)+'</span>';
    } else {
      h+='<span class="jc-pay-badge jc-pay-due">UNPAID</span>';
      if(job.completedDate) h+='<span style="font-size:11px;color:var(--accent3)">since '+FT_esc(job.completedDate)+'</span>';
    }
    h+='</div>';
    // Payment link
    if(job.status==='complete'||job.status==='pending_approval'||job.status==='closed'){
      h+='<div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border)">'
        +'<div style="font-size:11px;font-weight:600;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">Payment Link</div>'
        +'<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">'
        +'<input type="text" id="pay-link-'+job.id+'" value="'+FT_esc(job.paymentLink||'')+'" placeholder="Paste URL or create via Stripe..." style="flex:1;min-width:180px;font-size:12px;padding:7px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:var(--fm)">'
        +'<button class="btn btn-primary btn-xs" onclick="savePaymentLink('+job.id+')">Save</button>'
        +'<button class="btn btn-xs" style="background:#635bff;color:#fff;font-weight:600" onclick="createStripePaymentLink('+job.id+')">&#x26A1; Create Stripe Link</button>'
        +'</div>';
      if(job.paymentLink){
        h+='<div style="margin-top:6px;padding:8px 10px;background:var(--surface2);border-radius:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
          +'<a href="'+FT_esc(job.paymentLink)+'" target="_blank" style="color:var(--accent2);font-size:12px;font-weight:600;word-break:break-all">&#x1F517; '+FT_esc(job.paymentLink)+'</a>'
          +'<button class="btn btn-secondary btn-xs" onclick="navigator.clipboard.writeText(\''+FT_esc(job.paymentLink)+'\');alert(\'Copied!\')">Copy</button>'
          +'</div>';
      }
      h+='</div>';
      // Manual payment / mark paid
      h+='<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">'
        +'<button class="btn btn-secondary btn-sm" onclick="toggleJobPaid('+job.id+')">'+(job.isPaid?'&#x2717; Mark Unpaid':'&#x24; Mark Paid')+'</button>';
      if(job.status==='complete'){
        h+='<button class="btn btn-secondary btn-sm" onclick="openCloseJobModal('+job.id+')">&#x2709; Email &amp; Close</button>'
          +'<button class="btn btn-danger btn-sm" onclick="quickCloseJob('+job.id+')">Close Job</button>';
      }
      h+='</div>';
      // Share link
      if(job.shareToken){
        var shareUrl='view.php?token='+job.shareToken;
        h+='<div style="margin-top:8px;padding:6px 10px;background:var(--surface2);border-radius:6px;font-size:11px;display:flex;align-items:center;gap:6px">'
          +'<span style="font-family:var(--fm);color:var(--accent2)">&#x1F517; '+FT_esc(shareUrl)+'</span>'
          +'<button class="btn btn-secondary btn-xs" onclick="copyShareLink(\''+shareUrl+'\')">Copy</button>'
          +'</div>';
      }
    }
  } else {
    h+='<div class="jc-billing-row"><span>Expenses</span><strong>'+fmt$(tE)+'</strong></div>';
  }
  h+='</div></div>';
  // On My Way — tech only, open/in_progress jobs with contact info
  if(!FT_isAdmin() && (job.status==='open'||job.status==='in_progress') && (job.clientPhone||job.clientEmail)){
    h+='<div style="margin-top:10px;padding:10px;background:rgba(196,127,0,.08);border:1px solid rgba(196,127,0,.2);border-radius:8px">';
    h+='<div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:8px">&#x1F697; On My Way</div>';
    h+='<div class="flex flex-wrap" style="gap:6px">';
    h+='<button class="btn btn-secondary btn-sm" onclick="sendOnMyWay('+job.id+',5)">5 min</button>';
    h+='<button class="btn btn-secondary btn-sm" onclick="sendOnMyWay('+job.id+',10)">10 min</button>';
    h+='<button class="btn btn-secondary btn-sm" onclick="sendOnMyWay('+job.id+',30)">30 min</button>';
    h+='</div></div>';
  }
  // ═══════════════════════════════════════════════════════════════
  // MESSAGING — admin can contact client via SMS/WhatsApp/Email
  // ═══════════════════════════════════════════════════════════════
  if(FT_isAdmin() && (job.clientPhone||job.clientEmail)){
    var _ch=getContactChannel(job);
    var _chIcon=_ch==='whatsapp'?'&#x1F7E2; WhatsApp':(_ch==='email'?'&#x2709; Email':'&#x1F4F1; SMS');
    h+='<div class="jc-section" style="background:rgba(79,196,207,.04);border-color:rgba(79,196,207,.25)">';
    h+='<div class="jc-section-label">&#x1F4AC; Client Communication <span class="jc-section-count">'+_chIcon+'</span></div>';
    // Channel preference selector
    h+='<div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;flex-wrap:wrap">'
      +'<label style="font-size:11px;white-space:nowrap;margin:0">Preferred:</label>'
      +'<select onchange="setJobCommPref('+job.id+',this.value)" style="width:auto;font-size:12px;padding:4px 8px">'
      +'<option value="sms"'+(_ch==='sms'?' selected':'')+'>SMS</option>'
      +'<option value="whatsapp"'+(_ch==='whatsapp'?' selected':'')+'>WhatsApp</option>'
      +'<option value="email"'+(_ch==='email'?' selected':'')+'>Email</option>'
      +'</select>';
    if(job.clientPhone) h+='<span style="font-size:11px;color:var(--muted);font-family:var(--fm)">&#x1F4F1; '+FT_esc(job.clientPhone)+'</span>';
    if(job.clientEmail) h+='<span style="font-size:11px;color:var(--muted);font-family:var(--fm)">&#x2709; '+FT_esc(job.clientEmail)+'</span>';
    h+='</div>';
    // Quick message input
    h+='<div style="display:flex;gap:6px;flex-wrap:wrap">';
    h+='<input type="text" id="msg-client-'+job.id+'" placeholder="Quick message..." style="flex:1;min-width:160px;font-size:12px;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text)">';
    h+='<button class="btn btn-primary btn-sm" onclick="sendJobClientMessage('+job.id+')">Send</button>';
    h+='<button class="btn btn-secondary btn-sm" onclick="openSendMessageModal(getJob('+job.id+'))">&#x1F4E8; Full</button>';
    h+='</div>';
    h+='</div>';
  }
  // Delete job — admin only
  if(FT_isAdmin()){
    h+='<div style="margin-top:12px;border-top:1px solid var(--border);padding-top:8px">';
    h+='<button class="btn btn-danger btn-sm" onclick="deleteJob('+job.id+')">&#x1F5D1; Delete Job</button>';
    h+='</div>';
  }
  return h;
}

function toggleJobCard(jobId){
  // In split-panel mode, just select the job
  selectJob(jobId);
}
function loadThumbs(job){
  if(!job) return;
  (job.photos||[]).forEach(function(ph){
    var img=document.getElementById('pimg-'+ph.id);
    if(img&&!img.getAttribute('src')){
      FT_DB.getThumb(ph.id, function(err,data){
        if(data){ var i=document.getElementById('pimg-'+ph.id); if(i) i.src=data; }
      });
    }
  });
}
function refreshJobCard(jobId){
  var job=getJob(jobId); if(!job) return;
  // Refresh list item
  var li=document.getElementById('woli-'+jobId);
  if(li){
    var div=document.createElement('div');
    div.innerHTML=renderJobListItem(job,'');
    li.replaceWith(div.firstChild);
    if(FT_selectedJobId===jobId){
      var newLi=document.getElementById('woli-'+jobId);
      if(newLi) newLi.classList.add('wo-list-active');
    }
  }
  // Refresh detail panel if this job is selected
  if(FT_selectedJobId===jobId) renderJobDetail(jobId);
  var chev=document.getElementById('jchev-'+jobId); if(chev) chev.classList.add('open');
}

//  ASSIGN JOB (admin) 
function openAssignJob(){
  document.getElementById('aj-title').value='';
  document.getElementById('aj-date').value=FT_today();
  document.getElementById('aj-prop-search').value='';
  document.getElementById('aj-prop-id').value='';
  var sel=document.getElementById('aj-prop-selected'); if(sel) sel.style.display='none';
  document.getElementById('aj-notes').value='';
  document.getElementById('aj-block').value='';
  populateSelect(document.getElementById('aj-tech'), FT_state.technicians.filter(function(t){ return t.status==='active'; }), 'id', function(t){ return t.name; }, 'Unassigned');
  FT_openModal('ft-modal-assignjob');
}
function createAssignedJob(){
  var title=(document.getElementById('aj-title').value||'').trim();
  var date=document.getElementById('aj-date').value;
  var propId=+document.getElementById('aj-prop-id').value;
  var techId=+document.getElementById('aj-tech').value||null;
  if(!title){ alert('Job title is required.'); return; }
  if(!date||!propId){ alert('Date and property are required.'); return; }
  var block=(document.getElementById('aj-block')||{}).value||'';
  var clientPhone=((document.getElementById('aj-client-phone')||{}).value||'').trim();
  var clientEmail=((document.getElementById('aj-client-email')||{}).value||'').trim();
  var clientComm=((document.getElementById('aj-client-comm')||{}).value||'sms');
  var job={id:FT_uid(),woNum:FT_nextWO(),propId:propId,techId:techId,date:date,
    title:title, block:block,
    notes:document.getElementById('aj-notes').value,
    status:'open',assignedByAdmin:true,
    clientPhone:clientPhone,clientEmail:clientEmail,clientPreferredComm:clientComm,
    hours:[],expenses:[],photos:[]};
  FT_state.jobs.push(job); FT_save(); FT_closeModal('ft-modal-assignjob');
  renderAllJobs();
  // Notify tech via SMS
  if(techId){
    var tech=getTech(techId); var prop=getProp(propId);
    if(tech&&tech.phone) sendSMS(tech.phone,'WillowPA: New job '+job.woNum+' at '+(prop?prop.name:'')+(block?' | '+block:'')+'. Login: tech.willowpa.com');
  }
  // Notify client via preferred channel
  if(clientPhone||clientEmail){
    FT_notify(job,'WillowPA Maintenance: A work order ('+job.woNum+') has been created for your property.'+(block?' Scheduled: '+block:'')+' We will update you when the technician is on the way.',{subject:'Work Order Created — WillowPA'});
  }
  var msg=techId?job.woNum+' assigned to '+getTech(techId).name+'!':job.woNum+' created (unassigned).';
  alert('[OK] '+msg);
}
function openReassignJob(jobId){
  var job=getJob(jobId);
  document.getElementById('ra-job-id').value=jobId;
  populateSelect(document.getElementById('ra-tech'), FT_state.technicians.filter(function(t){ return t.status==='active'; }), 'id', function(t){ return t.name; }, 'Select...');
  document.getElementById('ra-tech').value=job.techId||'';
  FT_openModal('ft-modal-reassign');
}
function saveReassign(){
  var jobId=+document.getElementById('ra-job-id').value;
  var techId=+document.getElementById('ra-tech').value;
  if(!techId){ alert('Select a technician.'); return; }
  var job=getJob(jobId);
  job.techId=techId; job.assignedByAdmin=true;
  // Reset status to open if job was complete or pending
  if(job.status==='complete'||job.status==='pending_approval'||job.status==='closed'){
    job.status='open'; job.completedDate=null; job.closedDate=null;
  }
  // Reset seen so new tech gets NEW badge
  if(FT_state.seenJobs){
    Object.keys(FT_state.seenJobs).forEach(function(FT_uid){ var idx=FT_state.seenJobs[FT_uid].indexOf(jobId); if(idx>=0) FT_state.seenJobs[FT_uid].splice(idx,1); });
  }
  FT_save(); FT_closeModal('ft-modal-reassign'); renderAllJobs();
}
function adminReopenJob(jobId){
  if(!confirm('Re-open this job? It will be editable again.')) return;
  var job=getJob(jobId); job.status='open'; job.completedDate=null; job.closedDate=null;
  FT_save(); refreshJobCard(jobId);
}
function savePaymentLink(jobId){
  var job=getJob(jobId); if(!job) return;
  var el=document.getElementById('pay-link-'+jobId);
  job.paymentLink=(el?el.value:'').trim();
  FT_save(); alert('Payment link saved.'); refreshJobCard(jobId);
}
function createStripePaymentLink(jobId){
  var sk=getStripeKey();
  if(!sk){ alert('No Stripe API key configured. Go to Settings tab to add your Stripe Secret Key (sk_live_... or sk_test_...).'); return; }
  var job=getJob(jobId); if(!job) return;
  var prop=getProp(job.propId);
  var tech=getTech(job.techId);
  var tH=jobTotalHours(job), rate=0;
  if(prop) rate=prop.rateType==='tech'&&tech?+tech.rate:(prop.defaultRate?+prop.defaultRate:(tech?+tech.rate:0));
  var tL=tH*rate, tE=jobTotalExp(job);
  var billAmt=job.billingAmount!=null?job.billingAmount:(tL+tE);
  if(!billAmt||billAmt<=0){ alert('Billing amount must be greater than $0.'); return; }
  var amtCents=Math.round(billAmt*100);
  var desc='WO '+(job.woNum||'#'+job.id)+': '+(job.title||'Maintenance')+' — '+(prop?prop.name:'Property');
  var btn=event.target; btn.disabled=true; btn.textContent='Creating...';
  // Step 1: Create a Stripe Price (one-time)
  var priceBody='currency=usd&unit_amount='+amtCents+'&product_data[name]='+encodeURIComponent(desc);
  fetch('https://api.stripe.com/v1/prices',{
    method:'POST',
    headers:{'Authorization':'Bearer '+sk,'Content-Type':'application/x-www-form-urlencoded'},
    body:priceBody
  }).then(function(r){ return r.json(); }).then(function(price){
    if(price.error){ throw new Error(price.error.message); }
    // Step 2: Create Payment Link with that price
    return fetch('https://api.stripe.com/v1/payment_links',{
      method:'POST',
      headers:{'Authorization':'Bearer '+sk,'Content-Type':'application/x-www-form-urlencoded'},
      body:'line_items[0][price]='+price.id+'&line_items[0][quantity]=1'
    });
  }).then(function(r){ return r.json(); }).then(function(pl){
    if(pl.error){ throw new Error(pl.error.message); }
    job.paymentLink=pl.url;
    job.stripePaymentLinkId=pl.id;
    FT_save(); refreshJobCard(jobId);
    alert('Stripe payment link created!\n'+pl.url);
  }).catch(function(e){
    btn.disabled=false; btn.textContent='⚡ Create Stripe Link';
    alert('Stripe error: '+e.message);
  });
}
function saveBillingAmount(jobId){
  var job=getJob(jobId); if(!job) return;
  var el=document.getElementById('bill-amt-'+jobId);
  var val=parseFloat((el?el.value:''));
  job.billingAmount=isNaN(val)?null:Math.round(val*100)/100;
  FT_save(); refreshJobCard(jobId);
}
function aiGenerateInvoiceNotes(jobId){
  var apiKey=getApiKey();
  if(!apiKey){ alert('No API key configured. Go to Settings.'); return; }
  var job=getJob(jobId); if(!job) return;
  var prop=getProp(job.propId);
  var tech=getTech(job.techId);
  var tH=jobTotalHours(job), tE=jobTotalExp(job);
  var prompt='Summarize this maintenance work order into a professional 2-3 sentence invoice note for the property owner:\n'
    +'Property: '+(prop?prop.name:'Unknown')+'\n'
    +'Job: '+(job.title||'Maintenance')+'\n'
    +'Technician: '+(tech?tech.name:'—')+'\n'
    +'Hours: '+tH.toFixed(2)+'h\n'
    +'Expenses: $'+tE.toFixed(2)+'\n'
    +'Notes: '+(job.notes||'None')+'\n'
    +'Hour entries: '+(job.hours||[]).map(function(h){ return h.desc||''; }).filter(Boolean).join('; ');
  var btn=event.target; btn.disabled=true; btn.textContent='...';
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:200,messages:[{role:'user',content:prompt}]})
  }).then(function(r){ return r.json(); }).then(function(d){
    var text=(d.content&&d.content[0])?d.content[0].text:'';
    if(text){
      job.billingNotes=text; FT_save(); refreshJobCard(jobId);
    }
    btn.disabled=false; btn.textContent='✨ AI Summary';
  }).catch(function(e){ btn.disabled=false; btn.textContent='✨ AI Summary'; alert('AI error: '+e.message); });
}
function quickCloseJob(jobId){
  if(!confirm('Close this job? It will be moved to closed/history.')) return;
  var job=getJob(jobId);
  job.status='closed'; job.closedDate=FT_today();
  FT_save(); refreshJobCard(jobId);
}
function openCloseJobModal(jobId){
  var job=getJob(jobId); if(!job) return;
  var prop=getProp(job.propId);
  var owner=getOwner(prop?prop.ownerId:null);
  var tech=getTech(job.techId);
  var tH=jobTotalHours(job), rate=prop?(prop.rateType==='tech'&&tech?+tech.rate:(prop.defaultRate?+prop.defaultRate:(tech?+tech.rate:0))):0;
  var tL=tH*rate, tE=jobTotalExp(job);
  document.getElementById('cj-job-id').value=jobId;
  document.getElementById('cj-email').value=(owner?owner.email:'')||(prop?prop.clientEmail:'')||'';
  // Build summary preview
  var summary='Work Order: '+(job.woNum||'N/A')+'\n'
    +(job.title?'Job: '+job.title+'\n':'')
    +'Property: '+(prop?prop.name:'Unknown')+(prop&&prop.unit?' ('+prop.unit+')':'')+'\n'
    +'Date: '+job.date+'\n'
    +'Status: Complete\n\n'
    +'Hours: '+tH.toFixed(2)+'h\n'
    +'Labor: $'+tL.toFixed(2)+'\n'
    +'Expenses: $'+tE.toFixed(2)+'\n'
    +'Total: $'+(tL+tE).toFixed(2)+'\n';
  if(job.paymentLink) summary+='\nPayment Link: '+job.paymentLink+'\n';
  if(job.notes) summary+='\nNotes: '+job.notes+'\n';
  document.getElementById('cj-summary').value=summary;
  document.getElementById('cj-subject').value=(job.woNum||'Work Order')+' — '+(job.title||'Job Complete');
  FT_openModal('ft-modal-closejob');
}
function sendCloseJobEmail(){
  var jobId=+document.getElementById('cj-job-id').value;
  var email=(document.getElementById('cj-email').value||'').trim();
  var subject=(document.getElementById('cj-subject').value||'').trim();
  var body=document.getElementById('cj-summary').value||'';
  if(!email){ alert('Enter a client email address.'); return; }
  // Use mailto: for now (works on all devices)
  var mailto='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  window.open(mailto,'_blank');
  var job=getJob(jobId);
  job.clientEmailed=true; job.clientEmailedDate=FT_today(); job.clientEmailAddr=email;
  job.status='closed'; job.closedDate=FT_today();
  FT_save(); FT_closeModal('ft-modal-closejob'); refreshJobCard(jobId);
  alert('Job closed and email client opened.');
}
function closeJobNoEmail(){
  var jobId=+document.getElementById('cj-job-id').value;
  var job=getJob(jobId);
  job.status='closed'; job.closedDate=FT_today();
  FT_save(); FT_closeModal('ft-modal-closejob'); refreshJobCard(jobId);
}

//  TOGGLE INLINE FORM
function toggleAddForm(formId, btn){
  var form = document.getElementById(formId);
  if(!form) return;
  var open = form.style.display !== 'none';
  form.style.display = open ? 'none' : '';
  if(btn) btn.textContent = open ? '+' : '\u2212';
  if(!open){ var first = form.querySelector('input:not([type=date])'); if(first) first.focus(); }
}

//  HOURS
function addHour(jobId){
  var job=getJob(jobId);
  var date=(document.getElementById('ah-date-'+jobId)||{}).value;
  var hours=parseFloat((document.getElementById('ah-hrs-'+jobId)||{}).value);
  var desc=(document.getElementById('ah-desc-'+jobId)||{}).value;
  if(!date||!hours){ alert('Date and hours required.'); return; }
  if(!job.hours) job.hours=[];
  job.hours.push({id:FT_uid(),date:date,hours:hours,desc:desc});
  FT_save(); refreshJobCard(jobId);
}
function deleteHour(jobId,hrId){
  var job=getJob(jobId);
  job.hours=(job.hours||[]).filter(function(h){ return h.id!==hrId; });
  FT_save(); refreshJobCard(jobId);
}

//  EXPENSES 
function addExpense(jobId){
  var job=getJob(jobId);
  var date=(document.getElementById('ae-date-'+jobId)||{}).value;
  var store=((document.getElementById('ae-store-'+jobId)||{}).value||'').trim();
  var cost=parseFloat((document.getElementById('ae-cost-'+jobId)||{}).value);
  var desc=(document.getElementById('ae-desc-'+jobId)||{}).value;
  var notes=((document.getElementById('ae-notes-'+jobId)||{}).value||'').trim();
  if(!date||!store||!cost){ alert('Date, store and cost required.'); return; }
  if(!job.expenses) job.expenses=[];
  job.expenses.push({id:FT_uid(),date:date,store:store,cost:cost,desc:desc,notes:notes,linkType:'property'});
  FT_save(); refreshJobCard(jobId);
}
function deleteExpense(jobId,expId){
  var job=getJob(jobId);
  job.expenses=(job.expenses||[]).filter(function(e){ return e.id!==expId; });
  FT_save(); refreshJobCard(jobId);
}
function setExpLink(jobId,expId){
  var job=getJob(jobId);
  var exp=(job.expenses||[]).find(function(e){ return e.id===expId; });
  if(exp) exp.linkType=exp.linkType==='owner'?'property':'owner';
  FT_save(); refreshJobCard(jobId);
}

//  PHOTOS 
function handlePhoto(jobId,input){
  var file=input.files[0]; if(!file) return;
  var label=prompt('Label this photo (e.g. Before, Invoice, After, During):','Photo')||'Photo';
  var photoId=FT_uid();
  FT_DB.processAndStore(file, photoId, function(err, thumbData){
    if(err){ alert('Photo error: '+err.message); return; }
    var job=getJob(jobId);
    if(!job.photos) job.photos=[];
    job.photos.push({id:photoId,label:label,date:FT_today()});
    input.value=''; FT_save();
    var grid=document.getElementById('photos-'+jobId);
    if(grid){
      var addBtn=grid.querySelector('.photo-add');
      var thumbDiv=document.createElement('div');
      thumbDiv.className='photo-thumb'; thumbDiv.id='pt-'+photoId;
      thumbDiv.onclick=function(){ FT_openLightbox(photoId); };
      thumbDiv.innerHTML='<img id="pimg-'+photoId+'" src="'+thumbData+'" alt="'+FT_esc(label)+'">'
        +'<div class="photo-label">'+FT_esc(label)+'</div>'
        +'<button class="photo-del" onclick="event.stopPropagation();deletePhoto('+jobId+','+photoId+')"></button>';
      if(addBtn) grid.insertBefore(thumbDiv,addBtn); else grid.appendChild(thumbDiv);
      var meta=document.querySelector('#jcard-'+jobId+' .job-meta');
      if(meta) meta.innerHTML=meta.innerHTML.replace(/[photo] \d+/,'[photo] '+job.photos.length);
    }
  });
}
function deletePhoto(jobId,photoId){
  if(!confirm('Delete this photo?')) return;
  var job=getJob(jobId);
  job.photos=(job.photos||[]).filter(function(p){ return p.id!==photoId; });
  FT_DB.delMany([photoId], function(){ FT_save(); var t=document.getElementById('pt-'+photoId); if(t) t.remove(); });
}
var FT__lbPhotoId=null;
function FT_openLightbox(photoId){
  FT__lbPhotoId=photoId;
  var lb=document.getElementById('ft-lightbox'); lb.classList.add('open');
  document.getElementById('ft-lightbox-img').src='';
  FT_DB.getFull(photoId, function(err,data){ if(data){ var i=document.getElementById('ft-lightbox-img'); if(i) i.src=data; } });
  var label='Photo';
  FT_state.jobs.forEach(function(j){ (j.photos||[]).forEach(function(p){ if(p.id===photoId) label=p.label+'  '+j.date; }); });
  var lbl=document.getElementById('ft-lightbox-label'); if(lbl) lbl.textContent=label;
}
function FT_closeLightbox(){ document.getElementById('ft-lightbox').classList.remove('open'); document.getElementById('ft-lightbox-img').src=''; }
var _lb=document.getElementById('ft-lightbox'); if(_lb) _lb.addEventListener('click',function(e){ if(e.target===this) FT_closeLightbox(); });
function markComplete(jobId){
  if(!confirm('Mark as complete?\n'+(FT_isAdmin()?'Admin can still edit it after.':'You will not be able to edit this job anymore.'))) return;
  var job=getJob(jobId);
  if(job.timerStart){
    clearInterval(FT__timerIntervals[jobId]);
    var elapsed=Math.round((Date.now()-job.timerStart)/3600000*100)/100;
    if(elapsed>=0.01){ job.hours=job.hours||[]; job.hours.push({id:FT_uid(),date:FT_today(),hours:elapsed,desc:'Timer (auto)'}); }
    job.timerStart=null;
  }
  // Always go to pending_approval first — admin approves via Approve button
  job.status='pending_approval'; job.completedDate=FT_today();
  FT_save();
  refreshJobCard(jobId);
  renderAllJobs();
}

var FT__timerIntervals={};

function startJobTimer(jobId){
  var job=getJob(jobId); if(!job) return;
  if(job.timerStart){ alert('Timer already running.'); return; }
  job.timerStart=Date.now();
  job.status='in_progress';
  FT_save();
  setTimeout(function(){ refreshJobCard(jobId); }, 50);
  FT__timerIntervals[jobId]=setInterval(function(){
    var el=document.getElementById('timer-'+jobId);
    if(!el){ clearInterval(FT__timerIntervals[jobId]); return; }
    var j=getJob(jobId); if(!j||!j.timerStart){ clearInterval(FT__timerIntervals[jobId]); return; }
    var sec=Math.floor((Date.now()-j.timerStart)/1000);
    var hh=Math.floor(sec/3600), mm=Math.floor((sec%3600)/60), ss=sec%60;
    el.textContent='\u23f1 '+(hh?hh+'h ':'')+mm+'m '+ss+'s';
  },1000);
}

function pauseJobTimer(jobId){
  var job=getJob(jobId); if(!job||!job.timerStart){ alert('No timer running.'); return; }
  clearInterval(FT__timerIntervals[jobId]);
  var elapsed=Math.round((Date.now()-job.timerStart)/3600000*100)/100;
  var desc=prompt('Work description (optional):',job.lastTimerDesc||'')||'';
  if(elapsed>=0.01){ job.hours=job.hours||[]; job.hours.push({id:FT_uid(),date:FT_today(),hours:elapsed,desc:desc||'Timer (auto)'}); }
  job.lastTimerDesc=desc;
  job.timerStart=null;
  job.status='in_progress';
  FT_save();
  setTimeout(function(){ refreshJobCard(jobId); }, 50);
}

function adminStopTimer(jobId){
  var job=getJob(jobId); if(!job||!job.timerStart) return;
  if(!confirm('Stop the running timer on this job? The logged hours will be saved.')) return;
  clearInterval(FT__timerIntervals[jobId]);
  var elapsed=Math.round((Date.now()-job.timerStart)/3600000*100)/100;
  if(elapsed>=0.01){ job.hours=job.hours||[]; job.hours.push({id:FT_uid(),date:FT_today(),hours:elapsed,desc:'Timer stopped by admin'}); }
  job.timerStart=null;
  FT_save();
  setTimeout(function(){ refreshJobCard(jobId); }, 50);
}

function saveJobNotes(jobId){
  var job=getJob(jobId); if(!job) return;
  var el=document.getElementById('job-notes-'+jobId);
  if(el){ job.notes=el.value; FT_save(); }
  var t=document.getElementById('ft-save-toast');
  if(t){ t.style.display='block'; setTimeout(function(){ t.style.display='none'; },1800); }
}

function setJobStatus(jobId, status){
  var job=getJob(jobId); if(!job) return;
  if(job.timerStart){
    clearInterval(FT__timerIntervals[jobId]);
    var elapsed=Math.round((Date.now()-job.timerStart)/3600000*100)/100;
    if(elapsed>=0.01){ job.hours=job.hours||[]; job.hours.push({id:FT_uid(),date:FT_today(),hours:elapsed,desc:'Timer (auto)'}); }
    job.timerStart=null;
  }
  job.status=status;
  if(status==='open'||status==='waiting_parts') job.completedDate=null;
  FT_save();
  refreshJobCard(jobId);
}

//  AI 
var FT__aiHistory={};
function askAI(jobId){
  var question=((document.getElementById('ai-q-'+jobId)||{}).value||'').trim();
  if(!question){ alert('Please describe the problem first.'); return; }
  var apiKey=getApiKey();
  if(!apiKey){ alert('No API key configured. Go to Settings to add your Anthropic API key.'); return; }
  var job=getJob(jobId); var prop=getProp(job.propId);
  if(!FT__aiHistory[jobId]) FT__aiHistory[jobId]=[];
  var systemPrompt='You are an expert field technician assistant for a property maintenance company. '
    +'Diagnose problems, suggest fixes, identify parts needed, and give safety warnings. '
    +'Be concise and practical. Use emojis as section headers: '
    +'[search] Likely Causes, [fix] Recommended Steps, [parts] Parts Needed, [!] Safety Notes. '
    +'Keep it actionable for a tech on-site.';
  var context='';
  if(FT__aiHistory[jobId].length===0){
    context='Property: '+(prop?prop.name+', '+propFullAddr(prop):'unknown')+'. '
      +'Notes: '+(job.notes||'none')+'. '
      +'Recent work: '+((job.hours||[]).slice(-3).map(function(h){ return h.desc; }).join(', ')||'none')+'. ';
  }
  FT__aiHistory[jobId].push({role:'user',content:context+question});
  var chatEl=document.getElementById('ai-chat-'+jobId); if(!chatEl) return;
  chatEl.innerHTML+=renderAIMsg('user',question);
  chatEl.innerHTML+='<div class="ai-thinking" id="ai-think-'+jobId+'"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div><span style="margin-left:4px">Analyzing...</span></div>';
  chatEl.scrollIntoView({behavior:'smooth',block:'nearest'});
  var qEl=document.getElementById('ai-q-'+jobId); if(qEl) qEl.value='';
  var photoMessages=[];
  var photoPromises=(job.photos||[]).slice(0,3).map(function(ph){
    return new Promise(function(resolve){
      FT_DB.getFull(ph.id, function(err,data){
        if(data) photoMessages.push({type:'image',source:{type:'base64',media_type:'image/jpeg',data:data.split(',')[1]}});
        resolve();
      });
    });
  });
  Promise.all(photoPromises).then(function(){
    var messages=FT__aiHistory[jobId].slice();
    if(photoMessages.length>0){
      var last=messages[messages.length-1];
      messages[messages.length-1]={role:'user',content:photoMessages.concat([{type:'text',text:last.content}])};
    }
    // Use local proxy to avoid CORS issues
    var payload=Object.assign({},{model:'claude-sonnet-4-20250514',max_tokens:1000,system:systemPrompt,messages:messages});
    fetch('proxy.php',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      var think=document.getElementById('ai-think-'+jobId); if(think) think.remove();
      var reply='';
      if(data.content&&data.content.length){ data.content.forEach(function(c){ if(c.type==='text') reply+=c.text; }); }
      else if(data.error) reply='[!] API error: '+data.error.message;
      FT__aiHistory[jobId].push({role:'assistant',content:reply});
      var chat=document.getElementById('ai-chat-'+jobId);
      if(chat){ chat.innerHTML+=renderAIMsg('assistant',reply); chat.scrollIntoView({behavior:'smooth',block:'nearest'}); }
    })
    .catch(function(err){
      var think=document.getElementById('ai-think-'+jobId); if(think) think.remove();
      var chat=document.getElementById('ai-chat-'+jobId);
      if(chat) chat.innerHTML+=renderAIMsg('assistant','[!] Connection error: '+err.message+'\n\nMake sure your API key is valid and you have internet access.');
    });
  });
}
function renderAIMsg(role,text){
  var html=FT_esc(text)
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/^([search]|[fix]|[parts]|[!]|[OK]|&#x1F4CB;|[tip]) (.+)$/gm,'<strong>$1 $2</strong>')
    .replace(/^- (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/\n/g,'<br>');
  return '<div class="ai-message '+role+'">'+html+'</div>';
}

//  PDF EXPORT 
function exportJobPDF(jobId){
  var job=getJob(jobId);
  var prop=getProp(job.propId);
  var tech=getTech(job.techId);
  var owner=prop?getOwner(prop.ownerId):null;
  var tH=jobTotalHours(job), tL=jobTotalLabor(job), tE=jobTotalExp(job);

  var html='<!DOCTYPE html><html><head><meta charset="UTF-8">'
    +'<title>Job Report</title>'
    +'<style>'
    +'body{font-family:Arial,sans-serif;font-size:13px;color:#1a1d26;margin:0;padding:32px;max-width:760px}'
    +'h1{font-size:22px;margin-bottom:4px;color:#c47f00}'
    +'h2{font-size:15px;margin:20px 0 8px;border-bottom:2px solid #e5e7eb;padding-bottom:4px;color:#374151}'
    +'.meta{color:#6b7280;font-size:12px;margin-bottom:20px}'
    +'.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin-bottom:16px}'
    +'.info-item label{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#9ca3af;display:block}'
    +'.info-item span{font-weight:600}'
    +'table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px}'
    +'th{background:#f3f4f6;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#6b7280;border-bottom:2px solid #e5e7eb}'
    +'td{padding:8px 10px;border-bottom:1px solid #f3f4f6}'
    +'.total-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-top:16px}'
    +'.total-row{display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px}'
    +'.total-row.grand{font-weight:700;font-size:15px;color:#c47f00;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:8px}'
    +'.status{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;'
    +(job.status==='complete'?'background:#dcfce7;color:#166534':'background:#dbeafe;color:#1e40af')+'}'
    +'.footer{margin-top:32px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px}'
    +'@media print{body{padding:16px}}'
    +'</style></head><body>';

  html+='<h1>FieldTrack Job Report</h1>';
  html+='<div class="meta">Generated: '+new Date().toLocaleString()+' &nbsp;&nbsp; Status: <span class="status">'+job.status+'</span></div>';

  html+='<h2>Property Information</h2>';
  html+='<div class="info-grid">'
    +'<div class="info-item"><label>Property</label><span>'+(prop?prop.name:'')+'</span></div>'
    +'<div class="info-item"><label>Owner</label><span>'+(owner?owner.name:'')+'</span></div>'
    +'<div class="info-item"><label>Address</label><span>'+(prop?prop.address:'')+'</span></div>'
    +'<div class="info-item"><label>Unit</label><span>'+(prop&&prop.unit?prop.unit:'')+'</span></div>'
    +'<div class="info-item"><label>City</label><span>'+(prop&&prop.city?prop.city:'')+'</span></div>'
    +'<div class="info-item"><label>Technician</label><span>'+(tech?tech.name:'')+'</span></div>'
    +'<div class="info-item"><label>Job Date</label><span>'+job.date+'</span></div>'
    +(job.completedDate?'<div class="info-item"><label>Completed</label><span>'+job.completedDate+'</span></div>':'')
    +'</div>';

  if(job.notes){ html+='<h2>Job Notes</h2><p style="color:#374151;line-height:1.6">'+FT_esc(job.notes)+'</p>'; }

  html+='<h2>Hours Logged</h2>';
  if((job.hours||[]).length){
    html+='<table><thead><tr><th>Date</th><th>Description</th><th>Hours</th></tr></thead><tbody>';
    job.hours.forEach(function(hr){ html+='<tr><td>'+hr.date+'</td><td>'+FT_esc(hr.desc||'')+'</td><td>'+hr.hours+'h</td></tr>'; });
    html+='<tr style="font-weight:600"><td colspan="2" style="text-align:right">Total Hours:</td><td>'+tH.toFixed(2)+'h</td></tr>';
    html+='</tbody></table>';
  } else { html+='<p style="color:#9ca3af">No hours logged.</p>'; }

  html+='<h2>Expenses</h2>';
  if((job.expenses||[]).length){
    html+='<table><thead><tr><th>Date</th><th>Store</th><th>Description</th><th>Amount</th></tr></thead><tbody>';
    job.expenses.forEach(function(ex){ html+='<tr><td>'+ex.date+'</td><td>'+FT_esc(ex.store||'')+'</td><td>'+FT_esc(ex.desc||'')+'</td><td>'+fmt$(ex.cost)+'</td></tr>'; });
    html+='<tr style="font-weight:600"><td colspan="3" style="text-align:right">Total Expenses:</td><td>'+fmt$(tE)+'</td></tr>';
    html+='</tbody></table>';
  } else { html+='<p style="color:#9ca3af">No expenses.</p>'; }

  if((job.photos||[]).length){
    html+='<h2>Photos ('+job.photos.length+' attached)</h2>';
    html+='<p style="color:#6b7280;font-size:12px">'+job.photos.map(function(p){ return FT_esc(p.label)+' ('+p.date+')'; }).join(' &nbsp;&nbsp; ')+'</p>';
  }

  html+='<div class="total-box">'
    +'<div class="total-row"><span>Total Hours:</span><span>'+tH.toFixed(2)+'h</span></div>'
    +'<div class="total-row"><span>Labor Cost:</span><span>'+fmt$(tL)+'</span></div>'
    +'<div class="total-row"><span>Total Expenses:</span><span>'+fmt$(tE)+'</span></div>'
    +'<div class="total-row grand"><span>TOTAL:</span><span>'+fmt$(tL+tE)+'</span></div>'
    +'</div>';

  html+='<div class="footer">FieldTrack &nbsp;&nbsp; tech.willowpa.com &nbsp;&nbsp; Report generated '+FT_today()+'</div>';
  html+='</body></html>';

  var win=window.open('','_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(function(){ win.print(); },500);
}

//  TECH: MY JOBS 
function openNewJob(){
  document.getElementById('nj-date').value=FT_today();
  document.getElementById('nj-prop-search').value='';
  document.getElementById('nj-prop-id').value='';
  var sel=document.getElementById('nj-prop-selected'); if(sel) sel.style.display='none';
  document.getElementById('nj-notes').value='';
  FT_openModal('ft-modal-newjob');
}
function createJob(){
  var date=document.getElementById('nj-date').value;
  var propId=+document.getElementById('nj-prop-id').value;
  if(!date||!propId){ alert('Date and property are required.'); return; }
  var job={id:FT_uid(),woNum:FT_nextWO(),propId:propId,techId:FT_currentUser.techId,date:date,
    notes:document.getElementById('nj-notes').value,
    status:'open',assignedByAdmin:false,
    hours:[],expenses:[],photos:[]};
  FT_state.jobs.push(job); FT_save(); FT_closeModal('ft-modal-newjob'); renderMyJobs();
}
function renderMyJobs(){
  var searchTerm=(document.getElementById('myjobs-search')||{}).value||'';
  var myJobs=FT_state.jobs.filter(function(j){
    return j.techId===FT_currentUser.techId&&j.status==='open'&&jobMatchesSearch(j,searchTerm);
  });
  myJobs.sort(function(a,b){
    // NEW jobs first
    var aN=a.assignedByAdmin&&!hasSeenJob(a.id)?0:1;
    var bN=b.assignedByAdmin&&!hasSeenJob(b.id)?0:1;
    if(aN!==bN) return aN-bN;
    return b.date.localeCompare(a.date);
  });
  var el=document.getElementById('myjobs-list');
  if(!myJobs.length){
    el.innerHTML='<div class="empty-FT_state"><span class="emoji">&#x1F528;</span>'+(searchTerm?'No jobs match "'+FT_esc(searchTerm)+'"':'No open jobs.<br>Tap "+ New Job" to start one.')+'</div>';
    return;
  }
  el.innerHTML=myJobs.map(function(j){ return renderJobCard(j,true,searchTerm); }).join('');
}

//  ADMIN: ALL JOBS 
function renderAllJobs(){
  var statusF=(document.getElementById('jobs-filter-status')||{}).value||'';
  var techF=+((document.getElementById('jobs-filter-tech')||{}).value)||0;
  var searchTerm=(document.getElementById('jobs-search')||{}).value||'';
  populateSelect(document.getElementById('jobs-filter-tech'), FT_state.technicians, 'id', function(t){ return t.name; }, 'All Techs');
  var jobs=FT_state.jobs.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
  if(statusF) jobs=jobs.filter(function(j){ return j.status===statusF; });
  if(techF)   jobs=jobs.filter(function(j){ return +j.techId===techF; });
  if(searchTerm) jobs=jobs.filter(function(j){ return jobMatchesSearch(j,searchTerm); });
  var el=document.getElementById('all-jobs-list');
  if(!jobs.length){ el.innerHTML='<div class="empty-FT_state" style="padding:40px 20px"><span class="emoji">&#x1F4CB;</span>No jobs found.</div>'; return; }
  el.innerHTML=jobs.map(function(j){ return renderJobListItem(j, searchTerm); }).join('');
  // Re-select if previously selected job is still in list
  if(FT_selectedJobId){
    var still=jobs.find(function(j){ return j.id===FT_selectedJobId; });
    if(still){
      var cur=document.getElementById('woli-'+FT_selectedJobId);
      if(cur) cur.classList.add('wo-list-active');
    }
  }
}

//  DASHBOARD 
function FT_renderDashboard(){
  var ws=weekStart(),we=weekEnd();
  var wJobs=FT_state.jobs.filter(function(j){ return j.date>=ws&&j.date<=we; });
  var openJobs=FT_state.jobs.filter(function(j){ return j.status==='open'; });
  var wH=wJobs.reduce(function(s,j){ return s+jobTotalHours(j); },0);
  var wL=wJobs.reduce(function(s,j){ return s+jobTotalLabor(j); },0);
  var wE=wJobs.reduce(function(s,j){ return s+jobTotalExp(j); },0);
  document.getElementById('dash-stats').innerHTML=
    '<div class="stat-card"><div class="stat-label">Open Jobs</div><div class="stat-value" style="color:var(--accent2)">'+openJobs.length+'</div><div class="stat-sub">pending</div></div>'
    +'<div class="stat-card"><div class="stat-label">Week Hours</div><div class="stat-value" style="color:var(--accent)">'+wH.toFixed(1)+'</div><div class="stat-sub">'+wJobs.length+' jobs</div></div>'
    +'<div class="stat-card"><div class="stat-label">Week Labor</div><div class="stat-value" style="color:var(--success)">'+fmt$(wL)+'</div></div>'
    +'<div class="stat-card"><div class="stat-label">Week Expenses</div><div class="stat-value" style="color:var(--accent3)">'+fmt$(wE)+'</div></div>';
  var recent=FT_state.jobs.filter(function(j){ return !isCompletedPaidJob(j); }).sort(function(a,b){ return b.date.localeCompare(a.date); }).slice(0,6);
  document.getElementById('dash-recent').innerHTML=recent.length?recent.map(function(j){
    var prop=getProp(j.propId),tech=getTech(j.techId);
    var isActive=j.status!=='complete'&&j.status!=='closed';
    return '<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:8px;flex-wrap:wrap;'+(isActive?'cursor:pointer':'opacity:.7')+'" '+(isActive?'onclick="FT_goToJob('+j.id+')"':'')+'>'
      +'<span style="font-family:var(--fm);font-size:11px;color:var(--accent2);width:70px;flex-shrink:0;font-weight:700">'+(j.woNum||'')+'</span>'
      +'<span style="font-family:var(--fm);font-size:11px;color:var(--muted);width:80px;flex-shrink:0">'+j.date+'</span>'
      +(j.title?'<span style="flex:1;font-size:13px;font-weight:600;color:var(--accent)">'+FT_esc(j.title)+'</span>':'<span style="flex:1;font-size:13px">'+(prop?FT_esc(prop.name):'')+'</span>')
      +'<span style="font-size:12px;color:var(--muted)">'+(tech?FT_esc(tech.name):'')+'</span>'
      +'<span class="tag '+({'open':'tag-open','in_progress':'tag-yellow','waiting_parts':'tag-blue','pending_approval':'tag-pink','complete':'tag-complete','closed':'tag-closed'}[j.status]||'tag-open')+'" style="font-size:10px">'+({'open':'Open','in_progress':'In Progress','waiting_parts':'Parts','pending_approval':'Pending','complete':'Done','closed':'Closed'}[j.status]||j.status)+'</span>'
      +'</div>';
  }).join(''):'<div class="empty-FT_state" style="padding:20px"><span class="emoji">[empty]</span>No jobs yet</div>';
  var byP={};
  wJobs.forEach(function(j){ var p=getProp(j.propId),k=j.propId; if(!byP[k]) byP[k]={name:p?p.name:'?',hours:0}; byP[k].hours+=jobTotalHours(j); });
  var rows=Object.values(byP).sort(function(a,b){ return b.hours-a.hours; });
  document.getElementById('dash-props').innerHTML=rows.length?rows.map(function(p,i){
    var pct=wH?(p.hours/wH*100).toFixed(0):0;
    return '<div style="margin-bottom:12px"><div class="flex" style="margin-bottom:4px;font-size:13px">'
      +'<span class="color-dot" style="background:'+FT_COLORS[i%FT_COLORS.length]+'"></span><span>'+FT_esc(p.name)+'</span>'
      +'<span class="ml-auto" style="font-family:var(--fm);color:var(--muted);font-size:11px">'+p.hours.toFixed(1)+'h</span>'
      +'</div><div style="height:4px;background:var(--surface2);border-radius:99px;overflow:hidden">'
      +'<div style="height:100%;width:'+pct+'%;background:'+FT_COLORS[i%FT_COLORS.length]+';border-radius:99px"></div></div></div>';
  }).join(''):'<div class="empty-FT_state" style="padding:20px"><span class="emoji">&#x1F3E2;</span>No data this week</div>';
}

//  REPORTS 
var FT_currentPeriod='FT_today';
function initReportsPage(){
  populateSelect(document.getElementById('rep-filter-owner'), FT_state.owners, 'id', function(o){ return o.name; }, 'All Owners');
  if(!document.getElementById('rep-from').value) document.getElementById('rep-from').value=weekStart();
  if(!document.getElementById('rep-to').value) document.getElementById('rep-to').value=weekEnd();
}
function setPeriod(p,btn){
  FT_currentPeriod=p;
  document.querySelectorAll('.period-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('custom-range').style.display=p==='custom'?'flex':'none';
}
function generateReport(){
  var from,to;
  if(FT_currentPeriod==='FT_today'){ from=FT_today(); to=FT_today(); }
  else if(FT_currentPeriod==='week'){ from=weekStart(); to=weekEnd(); }
  else{ from=document.getElementById('rep-from').value; to=document.getElementById('rep-to').value; }
  if(!from||!to){ alert('Select a date range.'); return; }
  var ownerF=+document.getElementById('rep-filter-owner').value||null;
  var addrF=(document.getElementById('rep-filter-addr').value||'').trim();
  var jobs=FT_state.jobs.filter(function(j){ return j.date>=from&&j.date<=to; });
  if(ownerF){ var opids=FT_state.properties.filter(function(p){ return p.ownerId===ownerF; }).map(function(p){ return p.id; }); jobs=jobs.filter(function(j){ return opids.indexOf(+j.propId)>=0; }); }
  if(addrF){ jobs=jobs.filter(function(j){ var p=getProp(j.propId); return p&&addrMatch(p,addrF); }); }
  var out=document.getElementById('report-output');
  if(!jobs.length){ out.innerHTML='<div class="empty-FT_state"><span class="emoji">[search]</span>No jobs for this period.</div>'; return; }
  var totalH=jobs.reduce(function(s,j){ return s+jobTotalHours(j); },0);
  var totalL=jobs.reduce(function(s,j){ return s+jobTotalLabor(j); },0);
  var totalE=jobs.reduce(function(s,j){ return s+jobTotalExp(j); },0);
  var byP={},byO={},byT={};
  jobs.forEach(function(j){
    var p=getProp(j.propId),o=p?getOwner(p.ownerId):null,tech=getTech(j.techId);
    var h=jobTotalHours(j),l=jobTotalLabor(j),e=jobTotalExp(j);
    var pk=j.propId; if(!byP[pk]) byP[pk]={name:p?p.name:'?',addr:p?propFullAddr(p):'',hours:0,labor:0,exp:0};
    byP[pk].hours+=h; byP[pk].labor+=l; byP[pk].exp+=e;
    var ok=o?o.id:0; if(!byO[ok]) byO[ok]={name:o?o.name:'No Owner',hours:0,labor:0,exp:0,props:{}};
    byO[ok].hours+=h; byO[ok].labor+=l; byO[ok].exp+=e;
    var pn=p?p.name:'?'; if(!byO[ok].props[pn]) byO[ok].props[pn]={hours:0,labor:0,exp:0};
    byO[ok].props[pn].hours+=h; byO[ok].props[pn].labor+=l; byO[ok].props[pn].exp+=e;
    var tk=j.techId; if(!byT[tk]) byT[tk]={name:tech?tech.name:'?',hours:0,labor:0,jobs:0};
    byT[tk].hours+=h; byT[tk].labor+=l; byT[tk].jobs++;
  });
  var pl=FT_currentPeriod==='FT_today'?FT_today():from+'  '+to;
  var html='<div class="flex flex-wrap" style="margin-bottom:16px;gap:8px">'
    +'<span style="font-family:var(--fm);font-size:13px;color:var(--muted)">Period: <strong style="color:var(--text)">'+pl+'</strong></span>'
    +'<div class="ml-auto flex flex-wrap" style="gap:8px">'
    +'<button class="btn btn-secondary btn-sm" onclick="window.print()"> Print</button>'
    +'<button class="btn btn-success btn-sm" onclick="exportExcel()">&#x1F4CA; Excel</button>'
    +'<button class="btn btn-secondary btn-sm" onclick="exportReportPDF()">[pdf] PDF</button>'
    +'</div></div>';
  html+='<div class="grid-4" style="margin-bottom:20px">'
    +'<div class="stat-card"><div class="stat-label">Hours</div><div class="stat-value" style="color:var(--accent)">'+totalH.toFixed(2)+'</div></div>'
    +'<div class="stat-card"><div class="stat-label">Labor</div><div class="stat-value" style="color:var(--success)">'+fmt$(totalL)+'</div></div>'
    +'<div class="stat-card"><div class="stat-label">Expenses</div><div class="stat-value" style="color:var(--accent3)">'+fmt$(totalE)+'</div></div>'
    +'<div class="stat-card"><div class="stat-label">Total</div><div class="stat-value" style="color:var(--accent2)">'+fmt$(totalL+totalE)+'</div></div>'
    +'</div>';
  html+='<div class="report-section"><div class="report-header">&#x1F464; By Owner</div>';
  Object.values(byO).forEach(function(o){
    html+='<div class="card" style="margin-bottom:10px;padding:14px"><div class="flex flex-wrap" style="margin-bottom:8px;gap:6px">'
      +'<div style="font-family:var(--fd);font-size:14px;font-weight:600">'+FT_esc(o.name)+'</div>'
      +'<div class="ml-auto flex flex-wrap" style="gap:5px"><span class="tag tag-yellow">'+o.hours.toFixed(1)+'h</span><span class="tag tag-green">'+fmt$(o.labor)+'</span><span class="tag tag-pink">Exp: '+fmt$(o.exp)+'</span><span class="tag tag-blue">Total: '+fmt$(o.labor+o.exp)+'</span></div>'
      +'</div><div class="table-wrap"><table style="font-size:12px"><thead><tr><th>Property</th><th>Hours</th><th>Labor</th><th>Expenses</th><th>Total</th></tr></thead><tbody>';
    Object.entries(o.props).forEach(function(kv){ var v=kv[1]; html+='<tr><td>'+FT_esc(kv[0])+'</td><td>'+v.hours.toFixed(2)+'</td><td>'+fmt$(v.labor)+'</td><td>'+fmt$(v.exp)+'</td><td><strong>'+fmt$(v.labor+v.exp)+'</strong></td></tr>'; });
    html+='</tbody></table></div></div>';
  });
  html+='</div>';
  html+='<div class="report-section"><div class="report-header">&#x1F3E2; By Property</div><div class="table-wrap"><table><thead><tr><th>Property</th><th>Address</th><th>Hours</th><th>Labor</th><th>Exp</th><th>Total</th></tr></thead><tbody>';
  Object.values(byP).sort(function(a,b){ return b.hours-a.hours; }).forEach(function(p,i){ html+='<tr><td><span class="color-dot" style="background:'+FT_COLORS[i%FT_COLORS.length]+'"></span>'+FT_esc(p.name)+'</td><td style="font-size:11px;color:var(--muted)">'+FT_esc(p.addr)+'</td><td>'+p.hours.toFixed(2)+'</td><td>'+fmt$(p.labor)+'</td><td>'+fmt$(p.exp)+'</td><td><strong>'+fmt$(p.labor+p.exp)+'</strong></td></tr>'; });
  html+='</tbody></table></div></div>';
  html+='<div class="report-section"><div class="report-header">&#x1F477; By Technician</div><div class="table-wrap"><table><thead><tr><th>Tech</th><th>Jobs</th><th>Hours</th><th>Labor</th></tr></thead><tbody>';
  Object.values(byT).sort(function(a,b){ return b.hours-a.hours; }).forEach(function(t){ html+='<tr><td><strong>'+FT_esc(t.name)+'</strong></td><td>'+t.jobs+'</td><td>'+t.hours.toFixed(2)+'</td><td>'+fmt$(t.labor)+'</td></tr>'; });
  html+='</tbody></table></div></div>';
  html+='<div class="report-section"><div class="report-header">&#x1F4CB; Job Detail</div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Tech</th><th>Property</th><th>Status</th><th>Hours</th><th>Labor</th><th>Exp</th><th>Total</th><th></th></tr></thead><tbody>';
  jobs.sort(function(a,b){ return b.date.localeCompare(a.date); }).forEach(function(j){
    var tech=getTech(j.techId),prop=getProp(j.propId),h=jobTotalHours(j),l=jobTotalLabor(j),e=jobTotalExp(j);
    html+='<tr><td style="font-family:var(--fm);font-size:11px">'+j.date+'</td><td>'+(tech?FT_esc(tech.name):'')+'</td><td>'+(prop?FT_esc(prop.name):'')+'</td>'
      +'<td><span class="tag '+({'open':'tag-open','in_progress':'tag-yellow','waiting_parts':'tag-blue','pending_approval':'tag-pink','complete':'tag-complete','closed':'tag-closed'}[j.status]||'tag-open')+'">'+({'open':'Open','in_progress':'In Progress','waiting_parts':'Waiting Parts','pending_approval':'Pending Approval','complete':'Complete','closed':'Closed'}[j.status]||j.status)+'</span></td>'
      +'<td>'+h.toFixed(2)+'</td><td>'+fmt$(l)+'</td><td>'+fmt$(e)+'</td><td><strong>'+fmt$(l+e)+'</strong></td>'
      +'<td><button class="btn btn-secondary btn-xs" onclick="exportJobPDF('+j.id+')">[pdf]</button></td></tr>';
  });
  html+='</tbody></table></div></div>';
  // Store for PDF export
  window._lastReportHTML=html;
  window._lastReportPeriod=pl;
  out.innerHTML=html;
}

function exportReportPDF(){
  var period=window._lastReportPeriod||FT_today();
  var reportEl=document.getElementById('report-output');
  if(!reportEl||!reportEl.innerHTML) return;
  var win=window.open('','_blank');
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>FieldTrack Report  '+period+'</title>'
    +'<style>body{font-family:Arial,sans-serif;font-size:12px;color:#1a1d26;padding:24px;max-width:900px}'
    +'.stat-card{display:inline-block;padding:12px 18px;border:1px solid #e5e7eb;border-radius:8px;margin:4px}'
    +'.stat-label{font-size:10px;text-transform:uppercase;color:#9ca3af}'
    +'.stat-value{font-size:22px;font-weight:700}'
    +'table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px}'
    +'th{background:#f3f4f6;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb}'
    +'td{padding:7px 10px;border-bottom:1px solid #f3f4f6}'
    +'.report-header{font-size:14px;font-weight:700;margin:16px 0 8px;padding-bottom:6px;border-bottom:2px solid #e5e7eb}'
    +'.tag{padding:2px 8px;border-radius:99px;font-size:10px}'
    +'.tag-open{background:#dbeafe;color:#1e40af}.tag-complete{background:#dcfce7;color:#166534}.tag-yellow{background:#fef9c3;color:#854d0e}.tag-blue{background:#dbeafe;color:#1e40af}.tag-pink{background:#fce7f3;color:#9d174d}'
    +'mark{background:#fef9c3}h1{font-size:20px;color:#c47f00}@media print{button{display:none}}'
    +'</style></head><body>'
    +'<h1>FieldTrack Report</h1><p style="color:#6b7280;margin-bottom:20px">Period: <strong>'+period+'</strong> &nbsp;&nbsp; Generated: '+new Date().toLocaleString()+'</p>'
    +reportEl.innerHTML
    +'</body></html>');
  win.document.close();
  setTimeout(function(){ win.print(); },600);
}

//  SETTINGS PAGE 
function renderSettingsPage(){
  var key=getApiKey();
  var el=document.getElementById('settings-api-status');
  var inp=document.getElementById('settings-api-key');
  if(inp) inp.value=key;
  if(el){
    if(key){ el.textContent='[OK] API Key configured ('+key.length+' chars)'; el.style.color='var(--success)'; }
    else { el.textContent='[!] No API key  AI features disabled'; el.style.color='var(--accent3)'; }
  }
  // Stripe key
  var sk=getStripeKey();
  var sEl=document.getElementById('settings-stripe-status');
  var sInp=document.getElementById('settings-stripe-key');
  if(sInp) sInp.value=sk;
  if(sEl){
    if(sk){ sEl.textContent='[OK] Stripe Key configured ('+(sk.startsWith('sk_test')?'TEST':'LIVE')+')'; sEl.style.color=sk.startsWith('sk_test')?'var(--accent)':'var(--success)'; }
    else { sEl.textContent='[!] No Stripe key  manual payment links only'; sEl.style.color='var(--accent3)'; }
  }
}
function saveApiKey(){
  var k=(document.getElementById('settings-api-key')||{}).value||'';
  setApiKey(k);
  renderSettingsPage();
  alert(k?'[OK] API key saved! AI features are now enabled.':'API key cleared. AI features disabled.');
}
function saveStripeKey(){
  var k=(document.getElementById('settings-stripe-key')||{}).value||'';
  setStripeKey(k);
  renderSettingsPage();
  alert(k?'[OK] Stripe key saved! You can now create payment links from the billing section.':'Stripe key cleared.');
}

//  TECHNICIANS 
function openAddTech(){ document.getElementById('tech-edit-id').value=''; document.getElementById('ft-modal-tech-title').textContent='Add Technician'; ['tech-name','tech-email','tech-phone','tech-rate','tech-username','tech-pin'].forEach(function(id){ document.getElementById(id).value=''; }); document.getElementById('tech-status').value='active'; document.getElementById('tech-login-preview').textContent='username / PIN'; FT_openModal('ft-modal-tech'); }
var _tu=document.getElementById('tech-username'); if(_tu) _tu.addEventListener('input',function(){ document.getElementById('tech-login-preview').textContent=(this.value||'u')+' / '+(document.getElementById('tech-pin').value||'PIN'); });
var _tp=document.getElementById('tech-pin'); if(_tp) _tp.addEventListener('input',function(){ document.getElementById('tech-login-preview').textContent=(document.getElementById('tech-username').value||'u')+' / '+(this.value||'PIN'); });
function editTech(id){ var t=getTech(id); var u=FT_state.users.find(function(u){ return u.techId===id; }); document.getElementById('tech-edit-id').value=id; document.getElementById('ft-modal-tech-title').textContent='Edit Technician'; document.getElementById('tech-name').value=t.name; document.getElementById('tech-rate').value=t.rate; document.getElementById('tech-email').value=t.email||''; document.getElementById('tech-phone').value=t.phone||''; document.getElementById('tech-status').value=t.status; document.getElementById('tech-username').value=u?u.username:''; document.getElementById('tech-pin').value=u?u.password:''; document.getElementById('tech-login-preview').textContent=(u?u.username:'?')+' / '+(u?u.password:'?'); FT_openModal('ft-modal-tech'); }
function saveTech(){ var name=document.getElementById('tech-name').value.trim(); var rate=document.getElementById('tech-rate').value; var username=document.getElementById('tech-username').value.trim().toLowerCase(); var pin=document.getElementById('tech-pin').value.trim(); if(!name||!rate){ alert('Name and rate required.'); return; } if(!username||!pin){ alert('Username and PIN required.'); return; } var id=document.getElementById('tech-edit-id').value; var dup=FT_state.users.find(function(u){ return u.username===username&&(!id||u.techId!==+id); }); if(dup){ alert('Username taken.'); return; } var obj={name:name,rate:parseFloat(rate),email:document.getElementById('tech-email').value,phone:document.getElementById('tech-phone').value,status:document.getElementById('tech-status').value}; if(id){ Object.assign(FT_state.technicians.find(function(t){ return t.id===+id; }),obj); var u=FT_state.users.find(function(u){ return u.techId===+id; }); if(u){ u.username=username; u.password=pin; u.name=name; u.status=obj.status; } else FT_state.users.push({id:FT_uid(),name:name,username:username,password:pin,role:'tech',techId:+id,status:obj.status}); } else { obj.id=FT_uid(); FT_state.technicians.push(obj); FT_state.users.push({id:FT_uid(),name:name,username:username,password:pin,role:'tech',techId:obj.id,status:obj.status}); } FT_save(); FT_closeModal('ft-modal-tech'); renderTechs(); renderUsers(); }
function deleteTech(id){ if(!confirm('Delete this technician?')) return; FT_state.technicians=FT_state.technicians.filter(function(t){ return t.id!==+id; }); FT_state.users=FT_state.users.filter(function(u){ return u.techId!==+id; }); FT_save(); renderTechs(); }
function renderTechs(){ var tb=document.getElementById('tech-tbody'); if(!FT_state.technicians.length){ tb.innerHTML='<tr><td colspan="5"><div class="empty-FT_state"><span class="emoji">&#x1F477;</span>No technicians.</div></td></tr>'; return; } tb.innerHTML=FT_state.technicians.map(function(t){ var u=FT_state.users.find(function(u){ return u.techId===t.id; }); return '<tr><td><strong>'+FT_esc(t.name)+'</strong><br><small style="color:var(--muted)">'+FT_esc(t.email||'')+'</small></td><td><span style="font-family:var(--fm);color:var(--accent2)">'+FT_esc(u?u.username:'')+'</span></td><td><span class="tag tag-yellow">'+fmt$(t.rate)+'/h</span></td><td><span class="tag '+(t.status==='active'?'tag-green':'tag-pink')+'">'+t.status+'</span></td><td><button class="btn btn-secondary btn-sm" onclick="editTech('+t.id+')">Edit</button> <button class="btn btn-danger btn-sm" onclick="deleteTech('+t.id+')">Del</button></td></tr>'; }).join(''); }

//  PROPDESK LINKING
var FT_pdProperties = [];   // cached PropDesk properties from Supabase
var FT_pdOwners = [];       // cached unique owner names from PropDesk

function FT_loadPropDeskData(){
  if(typeof sb==='undefined' || !sb) return Promise.resolve();
  var pProp = sb.from('properties').select('apt,name,owner,address,city,zip,state,property_uid').order('apt')
    .then(function(res){ FT_pdProperties = (res.data||[]).map(function(r){ return r; }); });
  var pUnits = sb.from('units').select('apt,owner,name').order('apt')
    .then(function(res){
      // merge unit owners into properties list (units may have properties not in properties table)
      var existing = {};
      FT_pdProperties.forEach(function(p){ existing[p.apt]=true; });
      (res.data||[]).forEach(function(u){
        if(!existing[u.apt]){ FT_pdProperties.push({apt:u.apt, name:u.apt, owner:u.owner, address:'', city:''}); existing[u.apt]=true; }
      });
      // build unique owner list
      var ownerSet = {};
      FT_pdProperties.forEach(function(p){ if(p.owner && p.owner.trim()) ownerSet[p.owner.trim()]=true; });
      (res.data||[]).forEach(function(u){ if(u.owner && u.owner.trim()) ownerSet[u.owner.trim()]=true; });
      FT_pdOwners = Object.keys(ownerSet).sort();
    });
  return Promise.all([pProp, pUnits]);
}

function FT_populatePropLinkDropdown(selectedApt){
  var sel = document.getElementById('prop-pd-link');
  if(!sel) return;
  sel.innerHTML = '<option value="">— Not linked (standalone) —</option>';
  FT_pdProperties.forEach(function(p){
    var label = p.apt + (p.name && p.name!==p.apt ? ' – '+p.name : '') + (p.owner ? ' ('+p.owner+')' : '');
    var opt = document.createElement('option');
    opt.value = p.apt;
    opt.textContent = label;
    if(selectedApt && p.apt === selectedApt) opt.selected = true;
    sel.appendChild(opt);
  });
}

function FT_populateOwnerLinkDropdown(selectedOwner){
  var sel = document.getElementById('owner-pd-link');
  if(!sel) return;
  sel.innerHTML = '<option value="">— Not linked (standalone) —</option>';
  FT_pdOwners.forEach(function(name){
    var opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if(selectedOwner && name === selectedOwner) opt.selected = true;
    sel.appendChild(opt);
  });
}

// When user picks a PropDesk property — auto-fill address fields
function FT_onPropLink(apt){
  var badge = document.getElementById('prop-link-badge');
  if(!apt){
    if(badge) badge.style.display='none';
    return;
  }
  var pd = FT_pdProperties.find(function(p){ return p.apt===apt; });
  if(!pd){ if(badge) badge.style.display='none'; return; }
  // auto-fill fields from PropDesk data
  var nameEl = document.getElementById('prop-name');
  var addrEl = document.getElementById('prop-address');
  var cityEl = document.getElementById('prop-city');
  var unitEl = document.getElementById('prop-unit');
  if(nameEl && !nameEl.value.trim() && pd.name) nameEl.value = pd.name;
  if(addrEl && !addrEl.value.trim() && pd.address) addrEl.value = pd.address;
  if(unitEl && !unitEl.value.trim() && pd.apt) unitEl.value = pd.apt;
  if(cityEl && !cityEl.value.trim()){
    var parts = [pd.city, pd.state, pd.zip].filter(Boolean);
    if(parts.length) cityEl.value = parts.join(', ');
  }
  // auto-match owner if PropDesk property has one
  if(pd.owner){
    var match = FT_state.owners.find(function(o){ return o.company===pd.owner || o.name===pd.owner; });
    if(match){
      var ownerSel = document.getElementById('prop-owner');
      if(ownerSel) ownerSel.value = match.id;
    }
  }
  if(badge){ badge.textContent = '✓ Linked to PropDesk unit ' + apt; badge.style.display='block'; }
}

// When user picks a PropDesk owner — auto-fill company name
function FT_onOwnerLink(ownerName){
  var badge = document.getElementById('owner-link-badge');
  if(!ownerName){
    if(badge) badge.style.display='none';
    return;
  }
  var companyEl = document.getElementById('owner-company');
  if(companyEl && !companyEl.value.trim()) companyEl.value = ownerName;
  var nameEl = document.getElementById('owner-name');
  if(nameEl && !nameEl.value.trim()) nameEl.value = ownerName;
  if(badge){ badge.textContent = '✓ Linked to PropDesk owner: ' + ownerName; badge.style.display='block'; }
}

// Toggle "Service Orders Only" mode
function FT_toggleServiceOnly(){
  var cb = document.getElementById('prop-service-only');
  var linkRow = document.getElementById('prop-link-row');
  if(cb && cb.checked){
    if(linkRow) linkRow.style.opacity='0.4';
    document.getElementById('prop-pd-link').value='';
    var badge = document.getElementById('prop-link-badge');
    if(badge){ badge.textContent='⚙ Service orders only — not linked to PropDesk'; badge.style.display='block'; badge.style.color='#b86818'; }
  } else {
    if(linkRow) linkRow.style.opacity='1';
    var badge = document.getElementById('prop-link-badge');
    if(badge) badge.style.display='none';
  }
}

// Auto-match: try to link FT properties to PropDesk by apt number
function FT_autoMatch(){
  if(!FT_pdProperties.length) return;
  var changed = false;
  FT_state.properties.forEach(function(fp){
    if(fp.pdApt) return; // already linked
    // try matching by unit/apt number
    var match = null;
    if(fp.unit){
      var u = fp.unit.replace(/^(apt|unit|suite|#)\s*/i,'').trim().toLowerCase();
      match = FT_pdProperties.find(function(pd){ return pd.apt && pd.apt.toLowerCase()===u; });
    }
    // try matching by property name containing apt
    if(!match && fp.name){
      match = FT_pdProperties.find(function(pd){ return pd.apt && fp.name.toLowerCase().indexOf(pd.apt.toLowerCase())!==-1; });
    }
    if(match){
      fp.pdApt = match.apt;
      changed = true;
    }
  });
  // auto-match owners by name or company
  FT_state.owners.forEach(function(fo){
    if(fo.pdOwner) return; // already linked
    var match = FT_pdOwners.find(function(name){
      return name.toLowerCase()===fo.name.toLowerCase() || name.toLowerCase()===(fo.company||'').toLowerCase();
    });
    if(match){
      fo.pdOwner = match;
      changed = true;
    }
  });
  if(changed) FT_save();
}

//  OWNERS
function openAddOwner(){ document.getElementById('owner-edit-id').value=''; document.getElementById('ft-modal-owner-title').textContent='Add Owner'; ['owner-name','owner-company','owner-email','owner-phone'].forEach(function(id){ document.getElementById(id).value=''; }); FT_populateOwnerLinkDropdown(''); var badge=document.getElementById('owner-link-badge'); if(badge) badge.style.display='none'; FT_openModal('ft-modal-owner'); }
function editOwner(id){ var o=getOwner(id); document.getElementById('owner-edit-id').value=id; document.getElementById('ft-modal-owner-title').textContent='Edit Owner'; document.getElementById('owner-name').value=o.name; document.getElementById('owner-company').value=o.company||''; document.getElementById('owner-email').value=o.email||''; document.getElementById('owner-phone').value=o.phone||''; FT_populateOwnerLinkDropdown(o.pdOwner||''); var badge=document.getElementById('owner-link-badge'); if(o.pdOwner && badge){ badge.textContent='✓ Linked to PropDesk owner: '+o.pdOwner; badge.style.display='block'; } else if(badge){ badge.style.display='none'; } FT_openModal('ft-modal-owner'); }
function saveOwner(){ var name=document.getElementById('owner-name').value.trim(); if(!name){ alert('Name required.'); return; } var id=document.getElementById('owner-edit-id').value; var pdLink=(document.getElementById('owner-pd-link')||{}).value||''; var obj={name:name,company:document.getElementById('owner-company').value,email:document.getElementById('owner-email').value,phone:document.getElementById('owner-phone').value,pdOwner:pdLink||null}; if(id) Object.assign(FT_state.owners.find(function(o){ return o.id===+id; }),obj); else{ obj.id=FT_uid(); FT_state.owners.push(obj); } FT_save(); FT_closeModal('ft-modal-owner'); renderOwners(); }
function deleteOwner(id){ if(FT_state.properties.some(function(p){ return p.ownerId===+id; })){ alert('Remove properties first.'); return; } if(!confirm('Delete?')) return; FT_state.owners=FT_state.owners.filter(function(o){ return o.id!==+id; }); FT_save(); renderOwners(); }
function renderOwners(){ var tb=document.getElementById('owner-tbody'); if(!FT_state.owners.length){ tb.innerHTML='<tr><td colspan="6"><div class="empty-FT_state"><span class="emoji">&#x1F464;</span>No owners.</div></td></tr>'; return; } tb.innerHTML=FT_state.owners.map(function(o){ var props=FT_state.properties.filter(function(p){ return p.ownerId===o.id; }); var linkBadge=o.pdOwner?'<span style="display:inline-block;background:#e8f5e9;color:#256645;font-size:11px;padding:1px 6px;border-radius:4px;margin-left:4px;">PD</span>':''; return '<tr><td><strong>'+FT_esc(o.name)+'</strong>'+linkBadge+'</td><td>'+FT_esc(o.company||'')+'</td><td>'+FT_esc(o.email||'')+'</td><td>'+FT_esc(o.phone||'')+'</td><td>'+props.length+'</td><td><button class="btn btn-secondary btn-sm" onclick="editOwner('+o.id+')">Edit</button> <button class="btn btn-danger btn-sm" onclick="deleteOwner('+o.id+')">Del</button></td></tr>'; }).join(''); }

//  PROPERTIES 
function openAddProp(){ document.getElementById('prop-edit-id').value=''; document.getElementById('ft-modal-prop-title').textContent='Add Property'; ['prop-name','prop-rate','prop-address','prop-unit','prop-city'].forEach(function(id){ document.getElementById(id).value=''; }); document.getElementById('prop-rate-type').value='flat'; populateSelect(document.getElementById('prop-owner'), FT_state.owners, 'id', function(o){ return o.name; }, 'Select...'); FT_populatePropLinkDropdown(''); var cb=document.getElementById('prop-service-only'); if(cb) cb.checked=false; var linkRow=document.getElementById('prop-link-row'); if(linkRow) linkRow.style.opacity='1'; var badge=document.getElementById('prop-link-badge'); if(badge) badge.style.display='none'; FT_openModal('ft-modal-prop'); }
function editProp(id){ var p=getProp(id); populateSelect(document.getElementById('prop-owner'), FT_state.owners, 'id', function(o){ return o.name; }, 'Select...'); document.getElementById('prop-edit-id').value=id; document.getElementById('ft-modal-prop-title').textContent='Edit Property'; document.getElementById('prop-name').value=p.name; document.getElementById('prop-owner').value=p.ownerId||''; document.getElementById('prop-rate').value=p.defaultRate||''; document.getElementById('prop-rate-type').value=p.rateType||'flat'; document.getElementById('prop-address').value=p.address||''; document.getElementById('prop-unit').value=p.unit||''; document.getElementById('prop-city').value=p.city||''; FT_populatePropLinkDropdown(p.pdApt||''); var cb=document.getElementById('prop-service-only'); if(cb) cb.checked=!!p.serviceOnly; var linkRow=document.getElementById('prop-link-row'); if(linkRow) linkRow.style.opacity=p.serviceOnly?'0.4':'1'; var badge=document.getElementById('prop-link-badge'); if(p.serviceOnly && badge){ badge.textContent='⚙ Service orders only — not linked to PropDesk'; badge.style.display='block'; badge.style.color='#b86818'; } else if(p.pdApt && badge){ badge.textContent='✓ Linked to PropDesk unit '+p.pdApt; badge.style.display='block'; badge.style.color='#256645'; } else if(badge){ badge.style.display='none'; } FT_openModal('ft-modal-prop'); }
function saveProp(){ var name=document.getElementById('prop-name').value.trim(); if(!name){ alert('Name required.'); return; } var id=document.getElementById('prop-edit-id').value; var svcOnly=!!(document.getElementById('prop-service-only')||{}).checked; var pdLink=svcOnly?null:((document.getElementById('prop-pd-link')||{}).value||null); var obj={name:name,ownerId:+document.getElementById('prop-owner').value||null,defaultRate:parseFloat(document.getElementById('prop-rate').value)||null,rateType:document.getElementById('prop-rate-type').value,address:document.getElementById('prop-address').value.trim(),unit:document.getElementById('prop-unit').value.trim(),city:document.getElementById('prop-city').value.trim(),pdApt:pdLink,serviceOnly:svcOnly}; if(id) Object.assign(FT_state.properties.find(function(p){ return p.id===+id; }),obj); else{ obj.id=FT_uid(); FT_state.properties.push(obj); } FT_save(); FT_closeModal('ft-modal-prop'); renderProps(); }
function deleteProp(id){ if(!confirm('Delete?')) return; FT_state.properties=FT_state.properties.filter(function(p){ return p.id!==+id; }); FT_save(); renderProps(); }

//  PROPERTY DETAIL PAGE
var FT_detailPropId = null;

function openPropDetail(id){
  FT_detailPropId = id;
  renderPropDetail();
  FT_showPage('property-detail');
}

var FT_propTab = 'info';
function switchPropTab(tab){ FT_propTab=tab; renderPropDetail(); }

function renderPropDetail(){
  var p = getProp(FT_detailPropId);
  if(!p){ document.getElementById('prop-detail-content').innerHTML='<p>Property not found.</p>'; return; }
  var owner = getOwner(p.ownerId);
  var jobs = FT_state.jobs.filter(function(j){ return j.propId===p.id; }).sort(function(a,b){ return b.date.localeCompare(a.date); });
  var appliances = p.appliances || [];
  var activeJobs = jobs.filter(function(j){ return j.status!=='complete'&&j.status!=='closed'; });
  var completedJobs = jobs.filter(function(j){ return j.status==='complete'||j.status==='closed'; });
  var totalH = jobs.reduce(function(s,j){ return s+jobTotalHours(j); },0);
  var totalE = jobs.reduce(function(s,j){ return s+jobTotalExp(j); },0);
  var tab = FT_propTab || 'info';

  var h = '';

  // ── HEADER ──
  h += '<div style="background:linear-gradient(135deg,var(--surface) 0%,var(--surface2) 100%);border:1px solid var(--border);border-radius:14px;padding:28px 32px;margin-bottom:24px;box-shadow:0 4px 16px var(--shadow)">';
  h += '<div style="display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap">';
  h += '<div style="width:56px;height:56px;background:var(--accent2);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;color:#fff;box-shadow:0 2px 8px rgba(79,196,207,.3)">&#x1F3E0;</div>';
  h += '<div style="flex:1;min-width:260px">';
  h += '<h2 style="font-family:var(--fd);margin:0 0 4px;font-size:26px;color:var(--text);line-height:1.2">'+FT_esc(p.name)+'</h2>';
  if(p.address||p.city) h += '<div style="font-size:14px;color:var(--muted);line-height:1.5">'+FT_esc([p.address,p.unit?'Unit '+p.unit:'',p.city].filter(Boolean).join(' &middot; '))+'</div>';
  if(owner) h += '<div style="font-size:13px;margin-top:8px">Owner: <strong style="color:var(--accent2)">'+FT_esc(owner.name)+'</strong>'+(owner.company?' <span style="color:var(--muted)">&mdash; '+FT_esc(owner.company)+'</span>':'')+'</div>';
  var badges='';
  if(p.pdApt) badges+='<span style="background:#e8f5e9;color:#256645;font-size:11px;padding:4px 12px;border-radius:8px;font-weight:600">&#x1F517; '+FT_esc(p.pdApt)+'</span> ';
  if(p.serviceOnly) badges+='<span style="background:#fff3e0;color:#b86818;font-size:11px;padding:4px 12px;border-radius:8px;font-weight:600">&#x1F527; Service Only</span> ';
  if(badges) h+='<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">'+badges+'</div>';
  h += '</div></div>';
  // stats row
  h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px">';
  h += _statBox(jobs.length,'Work Orders','var(--accent2)');
  h += _statBox(totalH.toFixed(1)+'h','Total Hours','var(--accent)');
  h += _statBox(fmt$(totalE),'Expenses','var(--success)');
  h += _statBox(appliances.length,'Appliances','#7c3aed');
  h += '</div>';
  // action buttons
  h += '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">';
  h += '<button class="btn btn-secondary btn-sm" style="border-radius:10px;padding:8px 18px" onclick="editProp('+p.id+')">&#x270F; Edit Property</button>';
  h += '<button class="btn btn-primary btn-sm" style="border-radius:10px;padding:8px 18px" onclick="openAddAppliance('+p.id+')">+ Add Appliance</button>';
  h += '<button class="btn btn-secondary btn-sm" style="border-radius:10px;padding:8px 18px" onclick="openAssignJobForProp('+p.id+')">&#x1F4CB; Create Work Order</button>';
  h += '</div></div>';

  // ── TABS ──
  var tabs = [
    {id:'info', label:'Property Info', count:null, icon:'&#x1F3E2;'},
    {id:'appliances', label:'Appliances', count:appliances.length, icon:'&#x1F527;'},
    {id:'workorders', label:'Work Orders', count:activeJobs.length, icon:'&#x1F4CB;'},
    {id:'history', label:'History', count:completedJobs.length, icon:'&#x1F4C5;'}
  ];
  h += '<div style="display:flex;gap:4px;background:var(--surface2);border-radius:12px;padding:4px;margin-bottom:24px">';
  tabs.forEach(function(t){
    var active = t.id===tab;
    h += '<div onclick="switchPropTab(\''+t.id+'\')" style="flex:1;text-align:center;padding:10px 8px;font-size:13px;font-weight:'+(active?'700':'500')+';color:'+(active?'var(--accent)':'var(--muted)')+';cursor:pointer;border-radius:10px;background:'+(active?'var(--surface)':'transparent')+';box-shadow:'+(active?'0 1px 6px var(--shadow)':'none')+';transition:all .2s;user-select:none">';
    h += '<span style="font-size:16px;display:block;margin-bottom:2px">'+t.icon+'</span>';
    h += t.label;
    if(t.count!==null&&t.count>0) h += ' <span style="background:'+(active?'var(--accent)':'var(--border)')+';color:'+(active?'#fff':'var(--muted)')+';font-size:10px;padding:1px 7px;border-radius:10px;font-weight:700;margin-left:2px">'+t.count+'</span>';
    h += '</div>';
  });
  h += '</div>';

  // ── TAB CONTENT ──
  if(tab==='info') h += _renderPropInfoTab(p, owner);
  else if(tab==='appliances') h += _renderAppliancesTab(p, appliances);
  else if(tab==='workorders') h += _renderWOTab(activeJobs, p);
  else if(tab==='history') h += _renderHistoryTab(completedJobs, p);

  document.getElementById('prop-detail-content').innerHTML = h;
  // Load appliance photos after DOM render
  setTimeout(FT_loadAppliancePhotos, 50);
}

function _statBox(val,label,color){
  return '<div style="text-align:center;padding:16px 10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:0 1px 4px var(--shadow)"><div style="font-size:22px;font-weight:700;color:'+color+';font-family:var(--fm)">'+val+'</div><div style="font-size:11px;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:.5px;font-weight:500">'+label+'</div></div>';
}

function _infoField(label, val){
  return '<div style="padding:12px 16px;background:var(--surface2);border-radius:10px;border:1px solid transparent;transition:border-color .15s" onmouseover="this.style.borderColor=\'var(--border)\'" onmouseout="this.style.borderColor=\'transparent\'"><div style="font-size:10px;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">'+label+'</div><div style="font-weight:600;color:var(--text);font-size:14px;word-break:break-word">'+FT_esc(val||'—')+'</div></div>';
}

function _renderPropInfoTab(p, owner){
  var h = '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;box-shadow:0 1px 4px var(--shadow)">';
  h += '<div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">Property Details</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">';
  h += _infoField('Building Address', p.address);
  h += _infoField('Unit / Apt / Suite', p.unit);
  h += _infoField('City, State, ZIP', p.city);
  h += _infoField('Owner', owner ? owner.name+(owner.company?' ('+owner.company+')':'') : '—');
  h += _infoField('Default Rate', p.defaultRate ? fmt$(p.defaultRate)+' / hr' : '—');
  h += _infoField('Rate Type', p.rateType==='tech'?'Technician Base Rate':'Flat (property default)');
  if(p.pdApt) h += _infoField('PropDesk Linked Unit', p.pdApt);
  if(p.serviceOnly) h += _infoField('Type', 'Service Orders Only');
  h += '</div>';
  // Contact info if owner has it
  if(owner){
    h += '<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">';
    h += '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:12px">Owner Contact</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">';
    h += _infoField('Name', owner.name);
    if(owner.company) h += _infoField('Company', owner.company);
    if(owner.email) h += _infoField('Email', owner.email);
    if(owner.phone) h += _infoField('Phone', owner.phone);
    h += '</div></div>';
  }
  h += '</div>';
  return h;
}

function _renderAppliancesTab(p, appliances){
  var h = '';
  if(!appliances.length){
    h += '<div style="text-align:center;padding:40px 20px;color:var(--muted)">';
    h += '<div style="font-size:32px;margin-bottom:8px">🔧</div>';
    h += '<div style="font-size:15px;margin-bottom:4px">No appliances tracked yet</div>';
    h += '<div style="font-size:13px">Add appliances to track make, model, serial numbers and warranties</div>';
    h += '<button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="openAddAppliance('+p.id+')">+ Add First Appliance</button>';
    h += '</div>';
  } else {
    h += '<div style="display:grid;gap:14px">';
    var typeIcons = {'Refrigerator':'&#x1F9CA;','Dishwasher':'&#x1FAE7;','Washer':'&#x1F9F9;','Dryer':'&#x1F321;','Oven / Range':'&#x1F373;','Microwave':'&#x1F4E1;','HVAC':'&#x2744;','Water Heater':'&#x1F6BF;','Garbage Disposal':'&#x267B;','Smoke Detector':'&#x1F6A8;','Carbon Monoxide Detector':'&#x26A0;','Thermostat':'&#x1F321;','Ceiling Fan':'&#x1FA81;','Light Fixture':'&#x1F4A1;','Garage Door Opener':'&#x1F3DA;','Security System':'&#x1F512;','Intercom':'&#x1F4DE;','Other':'&#x1F527;'};
    appliances.forEach(function(a, idx){
      var warrantyBadge = '';
      if(a.warranty){
        if(a.warranty < FT_today()) warrantyBadge = '<span style="background:#fce4e4;color:#b83228;font-size:11px;padding:3px 10px;border-radius:8px;font-weight:600">&#x26A0; Expired</span>';
        else warrantyBadge = '<span style="background:#e8f5e9;color:#256645;font-size:11px;padding:3px 10px;border-radius:8px;font-weight:600">&#x2713; Warranty</span>';
      }
      var icon = typeIcons[a.type] || '&#x1F527;';
      h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;box-shadow:0 2px 8px var(--shadow);transition:box-shadow .2s" onmouseover="this.style.boxShadow=\'0 4px 16px var(--shadow)\'" onmouseout="this.style.boxShadow=\'0 2px 8px var(--shadow)\'">';
      h += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">';
      h += '<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--surface2),var(--bg));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:1px solid var(--border)">'+icon+'</div>';
      h += '<div style="flex:1"><div style="font-size:16px;font-weight:700;color:var(--text)">'+FT_esc(a.type||'Appliance')+'</div>';
      if(a.name && a.name!==a.type) h += '<div style="font-size:13px;color:var(--muted);margin-top:2px">'+FT_esc(a.name)+'</div>';
      if(a.brand) h += '<div style="font-size:12px;color:var(--accent2);font-weight:500;margin-top:1px">'+FT_esc(a.brand)+'</div>';
      h += '</div>';
      h += warrantyBadge;
      h += '<button class="btn btn-secondary btn-xs" style="border-radius:8px" onclick="editAppliance('+p.id+','+idx+')">&#x270F; Edit</button>';
      h += '<button class="btn btn-danger btn-xs" style="border-radius:8px" onclick="deleteAppliance('+p.id+','+idx+')">&#x1F5D1;</button>';
      h += '</div>';
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">';
      if(a.brand) h += _infoField('Make / Brand', a.brand);
      if(a.model) h += _infoField('Model Number', a.model);
      if(a.serial) h += _infoField('Serial Number', a.serial);
      if(a.location) h += _infoField('Location', a.location);
      if(a.purchased) h += _infoField('Install Date', a.purchased);
      if(a.warranty) h += _infoField('Warranty Exp.', a.warranty);
      h += '</div>';
      if(a.notes) h += '<div style="font-size:13px;margin-top:10px;padding:10px;background:var(--surface2);border-radius:8px;color:var(--muted);line-height:1.4">'+FT_esc(a.notes)+'</div>';
      // Appliance photos
      var photos = a.photos || [];
      h += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">';
      photos.forEach(function(ph, phIdx){
        h += '<div style="position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;border:1px solid var(--border);cursor:pointer" onclick="FT_viewAppliancePhoto('+p.id+','+idx+','+phIdx+')">'
          +'<img id="appl-ph-'+p.id+'-'+idx+'-'+phIdx+'" src="" style="width:100%;height:100%;object-fit:cover">'
          +'<button style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;line-height:18px;text-align:center" onclick="event.stopPropagation();deleteAppliancePhoto('+p.id+','+idx+','+phIdx+')">✕</button>'
          +'</div>';
      });
      h += '<label style="width:64px;height:64px;border:2px dashed var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;color:var(--muted);flex-shrink:0" for="appl-photo-'+p.id+'-'+idx+'">📷</label>';
      h += '<input type="file" id="appl-photo-'+p.id+'-'+idx+'" accept="image/*" capture="environment" style="display:none" onchange="handleAppliancePhoto('+p.id+','+idx+',this)">';
      h += '</div>';
      h += '</div>';
    });
    h += '</div>';
  }
  return h;
}

function _renderWOTab(activeJobs, p){
  var h='';
  if(!activeJobs.length){
    h += '<div style="text-align:center;padding:40px 20px;color:var(--muted)">';
    h += '<div style="font-size:32px;margin-bottom:8px">✓</div>';
    h += '<div style="font-size:15px">No active work orders</div>';
    h += '<button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="openAssignJobForProp('+p.id+')">+ Create Work Order</button>';
    h += '</div>';
  } else {
    activeJobs.forEach(function(j){
      var tech=getTech(j.techId);
      var sc={open:'tag-open',in_progress:'tag-yellow',waiting_parts:'tag-blue',pending_approval:'tag-pink'};
      var sl={open:'Open',in_progress:'In Progress',waiting_parts:'Waiting Parts',pending_approval:'Pending'};
      h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 20px;margin-bottom:10px;box-shadow:0 1px 4px var(--shadow);cursor:pointer" onclick="FT_goToJob('+j.id+')">';
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">';
      h += '<span style="font-family:var(--fm);font-size:12px;font-weight:700;color:var(--accent2)">'+(j.woNum||'—')+'</span>';
      if(j.title) h += '<span style="font-weight:700;font-size:14px;color:var(--accent)">'+FT_esc(j.title)+'</span>';
      h += '<span class="tag '+(sc[j.status]||'tag-open')+'" style="font-size:11px">'+(sl[j.status]||j.status)+'</span>';
      h += '<span style="margin-left:auto;font-family:var(--fm);font-size:12px;color:var(--muted)">'+j.date+'</span>';
      h += '</div>';
      if(j.notes) h += '<div style="font-size:13px;color:var(--text);margin-top:6px;line-height:1.4">'+FT_esc(j.notes.length>150?j.notes.slice(0,150)+'...':j.notes)+'</div>';
      h += '<div style="display:flex;gap:12px;margin-top:8px;font-size:12px;color:var(--muted)">';
      if(tech) h += '<span>Tech: <strong>'+FT_esc(tech.name)+'</strong></span>';
      h += '<span>'+jobTotalHours(j).toFixed(1)+' hrs</span>';
      if(jobTotalExp(j)) h += '<span>'+fmt$(jobTotalExp(j))+' exp</span>';
      h += '</div></div>';
    });
  }
  return h;
}

function _renderHistoryTab(completedJobs, p){
  var h='';
  if(!completedJobs.length){
    h += '<div style="text-align:center;padding:40px 20px;color:var(--muted)">';
    h += '<div style="font-size:32px;margin-bottom:8px">📋</div>';
    h += '<div style="font-size:15px">No completed work orders yet</div></div>';
  } else {
    completedJobs.forEach(function(j){
      var tech=getTech(j.techId);
      h += '<div style="padding:14px 0;border-bottom:1px solid var(--border)">';
      h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">';
      h += '<span style="font-family:var(--fm);font-size:12px;font-weight:700;color:var(--accent2)">'+(j.woNum||'—')+'</span>';
      h += '<span style="font-family:var(--fm);font-size:12px;color:var(--muted)">'+j.date+'</span>';
      if(j.title) h += '<span style="font-weight:700;font-size:13px;color:var(--text)">'+FT_esc(j.title)+'</span>';
      h += '<span class="tag tag-complete" style="font-size:10px">Complete</span>';
      h += '<span style="margin-left:auto;font-family:var(--fm);font-size:12px;color:var(--muted)">'+jobTotalHours(j).toFixed(1)+'h &middot; '+fmt$(jobTotalExp(j))+'</span>';
      h += '</div>';
      if(j.notes) h += '<div style="font-size:12px;color:var(--muted);margin-top:4px">'+FT_esc(j.notes.length>120?j.notes.slice(0,120)+'...':j.notes)+'</div>';
      if(tech) h += '<div style="font-size:11px;color:var(--muted);margin-top:2px">Tech: '+FT_esc(tech.name)+'</div>';
      h += '</div>';
    });
  }
  return h;
}

// Navigate to a job in the Work Orders view and expand it
function FT_goToJob(jobId){
  FT_showPage('jobs');
  setTimeout(function(){
    selectJob(jobId);
    var li=document.getElementById('woli-'+jobId);
    if(li) li.scrollIntoView({behavior:'smooth',block:'center'});
  },100);
}

// Quick-create a work order pre-filled with a property
function openAssignJobForProp(propId){
  openAssignJob();
  var p=getProp(propId);
  if(p){
    document.getElementById('aj-prop-id').value=propId;
    var sel=document.getElementById('aj-prop-selected');
    if(sel){ sel.textContent=' '+p.name+(p.unit?' ('+p.unit+')':''); sel.style.display='block'; }
    document.getElementById('aj-prop-search').value=p.name;
  }
}

//  APPLIANCE CRUD
function openAddAppliance(propId){
  document.getElementById('appl-edit-idx').value = '';
  document.getElementById('appl-prop-id').value = propId;
  document.getElementById('ft-modal-appliance-title').textContent = 'Add Appliance';
  ['appl-type','appl-name','appl-brand','appl-model','appl-serial','appl-location','appl-purchased','appl-warranty','appl-notes'].forEach(function(id){
    document.getElementById(id).value = '';
  });
  FT_openModal('ft-modal-appliance');
}

function editAppliance(propId, idx){
  var p = getProp(propId);
  if(!p || !p.appliances || !p.appliances[idx]) return;
  var a = p.appliances[idx];
  document.getElementById('appl-edit-idx').value = idx;
  document.getElementById('appl-prop-id').value = propId;
  document.getElementById('ft-modal-appliance-title').textContent = 'Edit Appliance';
  document.getElementById('appl-type').value = a.type || '';
  document.getElementById('appl-name').value = a.name || '';
  document.getElementById('appl-brand').value = a.brand || '';
  document.getElementById('appl-model').value = a.model || '';
  document.getElementById('appl-serial').value = a.serial || '';
  document.getElementById('appl-location').value = a.location || '';
  document.getElementById('appl-purchased').value = a.purchased || '';
  document.getElementById('appl-warranty').value = a.warranty || '';
  document.getElementById('appl-notes').value = a.notes || '';
  FT_openModal('ft-modal-appliance');
}

function saveAppliance(){
  var propId = +document.getElementById('appl-prop-id').value;
  var p = getProp(propId);
  if(!p) return;
  var type = document.getElementById('appl-type').value;
  if(!type){ alert('Appliance type is required.'); return; }
  var obj = {
    type: type,
    name: document.getElementById('appl-name').value.trim(),
    brand: document.getElementById('appl-brand').value.trim(),
    model: document.getElementById('appl-model').value.trim(),
    serial: document.getElementById('appl-serial').value.trim(),
    location: document.getElementById('appl-location').value.trim(),
    purchased: document.getElementById('appl-purchased').value,
    warranty: document.getElementById('appl-warranty').value,
    notes: document.getElementById('appl-notes').value.trim()
  };
  if(!p.appliances) p.appliances = [];
  var idx = document.getElementById('appl-edit-idx').value;
  if(idx !== '' && idx !== undefined && p.appliances[+idx]){
    obj.photos = p.appliances[+idx].photos || []; // preserve existing photos
    p.appliances[+idx] = obj;
  } else {
    obj.photos = [];
    p.appliances.push(obj);
  }
  FT_save();
  FT_closeModal('ft-modal-appliance');
  renderPropDetail();
}

function deleteAppliance(propId, idx){
  if(!confirm('Delete this appliance?')) return;
  var p = getProp(propId);
  if(!p || !p.appliances) return;
  // Clean up photos from IndexedDB
  var a = p.appliances[idx];
  if(a && a.photos && a.photos.length){
    var ids = a.photos.map(function(ph){ return ph.dbId; }).filter(Boolean);
    if(ids.length) FT_DB.delMany(ids, function(){});
  }
  p.appliances.splice(idx, 1);
  FT_save();
  renderPropDetail();
}

function handleAppliancePhoto(propId, idx, input){
  if(!input.files||!input.files[0]) return;
  var file = input.files[0];
  var reader = new FileReader();
  reader.onload = function(e){
    var data = e.target.result;
    var dbId = FT_uid();
    FT_DB.put(dbId, data, function(){
      var p = getProp(propId);
      if(!p||!p.appliances||!p.appliances[idx]) return;
      if(!p.appliances[idx].photos) p.appliances[idx].photos = [];
      p.appliances[idx].photos.push({ dbId: dbId, label: file.name, date: FT_today() });
      FT_save();
      renderPropDetail();
    });
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function deleteAppliancePhoto(propId, idx, phIdx){
  if(!confirm('Remove this photo?')) return;
  var p = getProp(propId);
  if(!p||!p.appliances||!p.appliances[idx]) return;
  var photos = p.appliances[idx].photos || [];
  if(!photos[phIdx]) return;
  var dbId = photos[phIdx].dbId;
  photos.splice(phIdx, 1);
  if(dbId) FT_DB.delMany([dbId], function(){});
  FT_save();
  renderPropDetail();
}

function FT_viewAppliancePhoto(propId, idx, phIdx){
  var p = getProp(propId);
  if(!p||!p.appliances||!p.appliances[idx]) return;
  var photos = p.appliances[idx].photos || [];
  if(!photos[phIdx]) return;
  FT_DB.getFull(photos[phIdx].dbId, function(err, data){
    if(data){
      document.getElementById('ft-lightbox-img').src = data;
      document.getElementById('ft-lightbox-label').textContent = photos[phIdx].label || 'Appliance Photo';
      document.getElementById('ft-lightbox').classList.add('open');
    }
  });
}

function FT_loadAppliancePhotos(){
  // Load appliance photos for visible cards after render
  FT_state.properties.forEach(function(p){
    if(!p.appliances) return;
    p.appliances.forEach(function(a, idx){
      if(!a.photos) return;
      a.photos.forEach(function(ph, phIdx){
        var img = document.getElementById('appl-ph-'+p.id+'-'+idx+'-'+phIdx);
        if(img && ph.dbId){
          FT_DB.getFull(ph.dbId, function(err, data){ if(data && img) img.src = data; });
        }
      });
    });
  });
}

function renderProps(){ var filter=(document.getElementById('prop-search-filter')||{}).value||''; var tb=document.getElementById('prop-tbody'); var list=FT_state.properties.filter(function(p){ return addrMatch(p,filter); }); if(!list.length){ tb.innerHTML='<tr><td colspan="6"><div class="empty-FT_state"><span class="emoji">&#x1F3E2;</span>No properties.</div></td></tr>'; return; } tb.innerHTML=list.map(function(p){ var owner=getOwner(p.ownerId); var linkBadge=p.pdApt?'<span style="display:inline-block;background:#e8f5e9;color:#256645;font-size:11px;padding:1px 6px;border-radius:4px;margin-left:4px;" title="Linked to PropDesk '+FT_esc(p.pdApt)+'">PD</span>':p.serviceOnly?'<span style="display:inline-block;background:#fff3e0;color:#b86818;font-size:11px;padding:1px 6px;border-radius:4px;margin-left:4px;" title="Service Orders Only">SO</span>':''; var applCount=(p.appliances||[]).length; var applBadge=applCount?'<span style="display:inline-block;background:#e3f2fd;color:#1565c0;font-size:10px;padding:1px 5px;border-radius:4px;margin-left:4px">'+applCount+' appl</span>':''; return '<tr style="cursor:pointer" onclick="openPropDetail('+p.id+')"><td><strong style="color:var(--accent2)">'+FT_esc(p.name)+'</strong>'+linkBadge+applBadge+'</td><td>'+FT_esc(p.address||'')+'</td><td>'+(p.unit?'<span class="tag tag-blue">'+FT_esc(p.unit)+'</span>':'')+'</td><td>'+(owner?FT_esc(owner.name):'')+'</td><td>'+(p.defaultRate?fmt$(p.defaultRate)+'/h':'')+'</td><td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();editProp('+p.id+')">Edit</button> <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteProp('+p.id+')">Del</button></td></tr>'; }).join(''); }

//  USERS 
function renderUsers(){ var tb=document.getElementById('users-tbody'); if(!FT_state.users.length){ tb.innerHTML='<tr><td colspan="5">No users.</td></tr>'; return; } tb.innerHTML=FT_state.users.map(function(u){ return '<tr><td><strong>'+FT_esc(u.name)+'</strong></td><td><span style="font-family:var(--fm);color:var(--accent2)">'+FT_esc(u.username)+'</span></td><td><span class="tag '+(u.role==='admin'?'tag-yellow':'tag-blue')+'">'+u.role+'</span></td><td><span class="tag '+(u.status==='active'?'tag-green':'tag-pink')+'">'+u.status+'</span></td><td><button class="btn btn-secondary btn-sm" onclick="openChangePW('+u.id+')">Change PW</button> <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('+u.id+')">Toggle</button></td></tr>'; }).join(''); }
function openChangePW(userId){ var u=getUser(userId); document.getElementById('pw-user-id').value=userId; document.getElementById('ft-modal-pw-title').textContent='Change PW  '+u.name; document.getElementById('pw-new').value=''; FT_openModal('ft-modal-pw'); }
function savePassword(){ var id=+document.getElementById('pw-user-id').value; var pw=document.getElementById('pw-new').value.trim(); if(!pw){ alert('Enter password.'); return; } getUser(id).password=pw; FT_save(); FT_closeModal('ft-modal-pw'); renderUsers(); }
function toggleUserStatus(id){ var u=getUser(id); u.status=u.status==='active'?'inactive':'active'; FT_save(); renderUsers(); }

//  SMART DELETE 
function requireAdminPw(inputId,cb){ var val=(document.getElementById(inputId)||{}).value||''; var admin=FT_state.users.find(function(u){ return u.role==='admin'; }); if(!admin||val!==admin.password){ alert(' Incorrect admin password.'); return; } cb(); }
function deleteByDateRange(){ requireAdminPw('del-range-pw',function(){ var from=(document.getElementById('del-from')||{}).value; var to=(document.getElementById('del-to')||{}).value; if(!from||!to){ alert('Select both dates.'); return; } var toDelete=FT_state.jobs.filter(function(j){ return j.date>=from&&j.date<=to; }); if(!toDelete.length){ alert('No jobs found.'); return; } if(!confirm('Delete '+toDelete.length+' job(s) from '+from+' to '+to+'?')) return; var pids=[]; toDelete.forEach(function(j){ (j.photos||[]).forEach(function(p){ pids.push(p.id); }); }); var ids=toDelete.map(function(j){ return j.id; }); FT_state.jobs=FT_state.jobs.filter(function(j){ return ids.indexOf(j.id)<0; }); FT_DB.delMany(pids,function(){ FT_save(); alert('[OK] Deleted '+toDelete.length+' jobs.'); document.getElementById('del-range-pw').value=''; }); }); }
function deleteByTech(){ requireAdminPw('del-tech-pw',function(){ var techId=+((document.getElementById('del-tech-sel')||{}).value||0); if(!techId){ alert('Select a technician.'); return; } var tech=getTech(techId); var toDelete=FT_state.jobs.filter(function(j){ return +j.techId===techId; }); if(!toDelete.length){ alert('No jobs found.'); return; } if(!confirm('Delete '+toDelete.length+' job(s) for '+tech.name+'?')) return; var pids=[]; toDelete.forEach(function(j){ (j.photos||[]).forEach(function(p){ pids.push(p.id); }); }); var ids=toDelete.map(function(j){ return j.id; }); FT_state.jobs=FT_state.jobs.filter(function(j){ return ids.indexOf(j.id)<0; }); FT_DB.delMany(pids,function(){ FT_save(); alert('[OK] Deleted '+toDelete.length+' jobs.'); document.getElementById('del-tech-pw').value=''; }); }); }
function deleteByProperty(){ requireAdminPw('del-prop-pw',function(){ var propId=+((document.getElementById('del-prop-sel')||{}).value||0); if(!propId){ alert('Select a property.'); return; } var prop=getProp(propId); var toDelete=FT_state.jobs.filter(function(j){ return +j.propId===propId; }); if(!toDelete.length){ alert('No jobs found.'); return; } if(!confirm('Delete '+toDelete.length+' job(s) for '+prop.name+'?')) return; var pids=[]; toDelete.forEach(function(j){ (j.photos||[]).forEach(function(p){ pids.push(p.id); }); }); var ids=toDelete.map(function(j){ return j.id; }); FT_state.jobs=FT_state.jobs.filter(function(j){ return ids.indexOf(j.id)<0; }); FT_DB.delMany(pids,function(){ FT_save(); alert('[OK] Deleted '+toDelete.length+' jobs.'); document.getElementById('del-prop-pw').value=''; }); }); }
function deleteByOwner(){ requireAdminPw('del-owner-pw',function(){ var ownerId=+((document.getElementById('del-owner-sel')||{}).value||0); if(!ownerId){ alert('Select an owner.'); return; } var owner=getOwner(ownerId); var propIds=FT_state.properties.filter(function(p){ return p.ownerId===ownerId; }).map(function(p){ return p.id; }); var toDelete=FT_state.jobs.filter(function(j){ return propIds.indexOf(+j.propId)>=0; }); if(!toDelete.length){ alert('No jobs found.'); return; } if(!confirm('Delete '+toDelete.length+' job(s) for '+owner.name+'?')) return; var pids=[]; toDelete.forEach(function(j){ (j.photos||[]).forEach(function(p){ pids.push(p.id); }); }); var ids=toDelete.map(function(j){ return j.id; }); FT_state.jobs=FT_state.jobs.filter(function(j){ return ids.indexOf(j.id)<0; }); FT_DB.delMany(pids,function(){ FT_save(); alert('[OK] Deleted '+toDelete.length+' jobs.'); document.getElementById('del-owner-pw').value=''; }); }); }
function populateDeleteSelects(){ var ts=document.getElementById('del-tech-sel'); var ps=document.getElementById('del-prop-sel'); var os=document.getElementById('del-owner-sel'); if(ts) populateSelect(ts,FT_state.technicians,'id',function(t){ return t.name; },'Select technician...'); if(ps) populateSelect(ps,FT_state.properties,'id',function(p){ return p.name+' ('+p.address+')'; },'Select property...'); if(os) populateSelect(os,FT_state.owners,'id',function(o){ return o.name; },'Select owner...'); }

//  DATA 
function exportJSON(){ var blob=new Blob([JSON.stringify(FT_state,null,2)],{type:'application/json'}); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='fieldtrack-backup-'+FT_today()+'.json'; a.click(); }
function triggerImport(){ document.getElementById('import-file').click(); }
function importData(event){ var file=event.target.files[0]; if(!file) return; requireAdminPw('import-pw',function(){ var reader=new FileReader(); reader.onload=function(e){ try{ var imp=JSON.parse(e.target.result); if(!imp.owners||!imp.users){ alert('Invalid file.'); return; } if(!confirm('Replace all data?\nJobs: '+(imp.jobs||[]).length+', Props: '+imp.properties.length)) return; FT_state=imp; if(!FT_state.jobs) FT_state.jobs=[]; FT_state._initialized=true; FT_save(); FT_showPage('dashboard'); alert('[OK] Imported!'); } catch(err){ alert('Error: '+err.message); } }; reader.readAsText(file); event.target.value=''; }); }
function clearAllData(){ requireAdminPw('clear-pw',function(){ if(!confirm('[!] Delete ALL data permanently? Cannot be undone.')) return; if(!confirm('Are you 100% sure? Everything goes.')) return; FT_state={owners:[],technicians:[],properties:[],jobs:[],users:[],_nextId:1,_initialized:true}; initAdminUser(); FT_save(); FT_DB.clearAll(function(){ alert('[OK] Cleared. Admin re-created: admin / admin1234'); FT_showPage('dashboard'); }); }); }
function exportExcel(){ if(typeof XLSX==='undefined'){ alert('Excel library not loaded.'); return; } var wb=XLSX.utils.book_new(); var jRows=FT_state.jobs.slice().sort(function(a,b){ return b.date.localeCompare(a.date); }).map(function(j){ var tech=getTech(j.techId),prop=getProp(j.propId),owner=prop?getOwner(prop.ownerId):null; return {Date:j.date,Tech:tech?tech.name:'',Property:prop?prop.name:'',Address:prop?prop.address:'',Unit:prop?prop.unit:'',Owner:owner?owner.name:'',Status:j.status,Assigned:j.assignedByAdmin?'Yes':'No',Hours:jobTotalHours(j),'Labor($)':+jobTotalLabor(j).toFixed(2),'Exp($)':+jobTotalExp(j).toFixed(2),'Total($)':+(jobTotalLabor(j)+jobTotalExp(j)).toFixed(2),Photos:(j.photos||[]).length,Notes:j.notes||''}; }); var ws1=XLSX.utils.json_to_sheet(jRows.length?jRows:[{Note:'No jobs'}]); ws1['!cols']=[10,14,14,20,10,14,10,8,7,9,9,9,6,30].map(function(w){ return {wch:w}; }); XLSX.utils.book_append_sheet(wb,ws1,'Jobs'); var hRows=[]; FT_state.jobs.forEach(function(j){ var t=getTech(j.techId),p=getProp(j.propId); (j.hours||[]).forEach(function(h){ hRows.push({JobDate:j.date,Tech:t?t.name:'',Prop:p?p.name:'',Addr:p?p.address:'',Unit:p?p.unit:'',Date:h.date,Hours:h.hours,Desc:h.desc||''}); }); }); var ws2=XLSX.utils.json_to_sheet(hRows.length?hRows:[{Note:'No hours'}]); ws2['!cols']=[10,14,14,20,10,10,7,40].map(function(w){ return {wch:w}; }); XLSX.utils.book_append_sheet(wb,ws2,'Hours'); var eRows=[]; FT_state.jobs.forEach(function(j){ var t=getTech(j.techId),p=getProp(j.propId),o=p?getOwner(p.ownerId):null; (j.expenses||[]).forEach(function(e){ eRows.push({JobDate:j.date,Tech:t?t.name:'',Store:e.store,Prop:p?p.name:'',Addr:p?p.address:'',Unit:p?p.unit:'',Owner:o?o.name:'',' Cost':e.cost,Link:e.linkType,Desc:e.desc||''}); }); }); var ws3=XLSX.utils.json_to_sheet(eRows.length?eRows:[{Note:'No expenses'}]); ws3['!cols']=[10,14,16,14,20,10,14,8,8,40].map(function(w){ return {wch:w}; }); XLSX.utils.book_append_sheet(wb,ws3,'Expenses'); XLSX.writeFile(wb,'fieldtrack-'+FT_today()+'.xlsx'); }


//  SHARE LINK GENERATION 
function openShareModal(jobId){
  var job=getJob(jobId); var prop=getProp(job.propId);
  document.getElementById('sm-job-id').value=jobId;
  document.getElementById('sm-show-price').checked=job.shareShowPrice||false;
  document.getElementById('sm-stripe').value=job.stripeLink||'';
  document.getElementById('sm-client-name').value=job.clientName||'';
  document.getElementById('sm-client-phone').value=job.clientPhone||'';
  document.getElementById('sm-job-info').textContent=(prop?prop.name+'  '+propFullAddr(prop):'?')+' | '+job.date;
  var ld=document.getElementById('sm-existing-link');
  if(job.shareToken){ ld.style.display='block'; document.getElementById('sm-link-url').textContent='view.php?token='+job.shareToken; }
  else { ld.style.display='none'; }
  FT_openModal('ft-modal-share');
}
function generateShareLink(){
  var jobId=+document.getElementById('sm-job-id').value;
  var job=getJob(jobId); var prop=getProp(job.propId);
  var showPrice=document.getElementById('sm-show-price').checked;
  var stripeLink=document.getElementById('sm-stripe').value.trim();
  var clientName=document.getElementById('sm-client-name').value.trim();
  var clientPhone=document.getElementById('sm-client-phone').value.trim();
  job.shareShowPrice=showPrice; job.stripeLink=stripeLink; job.clientName=clientName; job.clientPhone=clientPhone;
  var photoMeta=job.photos||[]; var photoDataArr=[]; var pending=photoMeta.length;
  function doCreate(){
    var jd={propName:prop?prop.name:'',propAddr:prop?prop.address:'',propUnit:prop?prop.unit:'',
      date:job.date,completedDate:job.completedDate||'',status:job.status,notes:job.notes||'',
      hours:job.hours||[],expenses:job.expenses||[],photos:photoDataArr,
      totalHours:jobTotalHours(job),totalLabor:jobTotalLabor(job),totalExp:jobTotalExp(job)};
    var btn=document.getElementById('sm-gen-btn'); btn.disabled=true; btn.textContent='Generating...';
    fetch('shares.php',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'create',jobId:jobId,job:jd,showPrice:showPrice,stripeLink:stripeLink,clientName:clientName,clientPhone:clientPhone,days:90})})
    .then(function(r){ return r.json(); })
    .then(function(data){
      btn.disabled=false; btn.textContent='Generate Link';
      if(data.ok){
        job.shareToken=data.token; FT_save();
        document.getElementById('sm-existing-link').style.display='block';
        document.getElementById('sm-link-url').textContent='view.php?token='+data.token;
        if(clientPhone||job.clientEmail) FT_notify(job,'WillowPA Maintenance: Your job report is ready! https://tech.willowpa.com/view.php?token='+data.token+' (expires 90 days)',{subject:'Your Service Report — WillowPA'});
        refreshJobCard(jobId);
      } else { alert('Error: '+(data.error||'Unknown')); }
    })
    .catch(function(e){ btn.disabled=false; btn.textContent='Generate Link'; alert('Error: '+e.message); });
  }
  if(!pending){ doCreate(); return; }
  photoMeta.forEach(function(ph){
    FT_DB.getThumb(ph.id,function(err,thumb){
      FT_DB.getFull(ph.id,function(err2,full){
        photoDataArr.push({label:ph.label,date:ph.date,thumbData:thumb||'',fullData:full||''});
        pending--; if(pending<=0) doCreate();
      });
    });
  });
}
function copyShareLink(url){
  var full=url.indexOf('http')===0?url:('https://tech.willowpa.com/'+url.replace(/^\/+/,''));
  if(navigator.clipboard){ navigator.clipboard.writeText(full).then(function(){ alert('Copied: '+full); }).catch(function(){ prompt('Copy this link:',full); }); }
  else { prompt('Copy this link:',full); }
}
function toggleJobPaid(jobId){
  var job=getJob(jobId); job.isPaid=!job.isPaid; FT_save(); refreshJobCard(jobId);
}
// ═══════════════════════════════════════════════════════════════
// UNIFIED MESSAGING — SMS (Flowroute), WhatsApp (Meta), Email (SMTP)
// Backend: messages.php on tech.willowpa.com
// ═══════════════════════════════════════════════════════════════

var FT_MSG_BASE = 'https://tech.willowpa.com/messages.php';

// Get preferred channel for a contact (from job or property)
function getContactChannel(job){
  if(job && job.clientPreferredComm){
    var p = (job.clientPreferredComm||'').toLowerCase();
    if(p==='whatsapp') return 'whatsapp';
    if(p==='email') return 'email';
  }
  return 'sms'; // default
}

// Core: send message via any channel
// opts: {to, msg, channel, toEmail, subject, jobId, silent}
function FT_sendMessage(opts){
  var to = opts.to || '';
  var msg = opts.msg || '';
  var channel = opts.channel || 'sms';
  if(!to || !msg) return Promise.resolve({ok:false,error:'Missing to or msg'});

  var payload = {action:'send', to:to, body:msg, channel:channel};
  if(opts.toEmail) payload.toEmail = opts.toEmail;
  if(opts.subject) payload.subject = opts.subject;
  if(opts.jobId) payload.jobId = opts.jobId;

  return fetch(FT_MSG_BASE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(!d.ok){
      console.warn('Message ('+channel+') failed:',d.error||d);
      if(!opts.silent) showMsgToast('Failed to send '+channel.toUpperCase()+': '+(d.error||'Unknown error'),'error');
    } else {
      if(!opts.silent) showMsgToast(channel.toUpperCase()+' sent to '+to,'success');
    }
    return d;
  })
  .catch(function(e){
    console.warn('Message error:',e);
    if(!opts.silent) showMsgToast('Network error sending '+channel,'error');
    return {ok:false,error:e.message};
  });
}

// Send via preferred channel for a job (auto-detects SMS/WhatsApp/Email)
function FT_notify(job, msg, extraOpts){
  if(!job) return Promise.resolve({ok:false});
  var pref = (job.clientPreferredComm||'').toLowerCase();

  // Handle 'both' — send SMS and email
  if(pref === 'both'){
    var promises = [];
    if(job.clientPhone){
      promises.push(FT_sendMessage({to:job.clientPhone, msg:msg, channel:'sms', jobId:job.id}));
    }
    if(job.clientEmail){
      var emailOpts = {to:job.clientEmail, toEmail:job.clientEmail, msg:msg, channel:'email', jobId:job.id,
        subject: (extraOpts&&extraOpts.subject) ? extraOpts.subject : 'WillowPA Maintenance Update'};
      if(extraOpts){ for(var k in extraOpts) emailOpts[k]=extraOpts[k]; }
      promises.push(FT_sendMessage(emailOpts));
    }
    return Promise.all(promises).then(function(results){ return results[0] || {ok:true}; });
  }

  var channel = getContactChannel(job);
  var to = channel==='email' ? (job.clientEmail||'') : (job.clientPhone||'');
  if(!to) return Promise.resolve({ok:false,error:'No contact info for '+channel});
  var opts = {to:to, msg:msg, channel:channel, jobId:job.id};
  if(channel==='email'){
    opts.toEmail = job.clientEmail;
    opts.subject = (extraOpts&&extraOpts.subject) ? extraOpts.subject : 'WillowPA Maintenance Update';
  }
  if(extraOpts){ for(var k in extraOpts) opts[k]=extraOpts[k]; }
  return FT_sendMessage(opts);
}

// Quick send SMS (backward-compatible wrapper)
function sendSMS(to,msg){
  FT_sendMessage({to:to, msg:msg, channel:'sms', silent:true});
}

// Quick send WhatsApp
function sendWhatsApp(to,msg){
  FT_sendMessage({to:to, msg:msg, channel:'whatsapp', silent:true});
}

// Quick send Email
function sendEmail(toEmail, subject, body){
  FT_sendMessage({to:toEmail, msg:body, channel:'email', toEmail:toEmail, subject:subject, silent:true});
}

// Toast for messaging feedback
function showMsgToast(text,type){
  var el=document.getElementById('ft-msg-toast');
  if(!el){
    el=document.createElement('div'); el.id='ft-msg-toast';
    el.style.cssText='position:fixed;bottom:20px;right:20px;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;z-index:9999;transition:opacity .3s;box-shadow:0 4px 12px rgba(0,0,0,.15)';
    document.body.appendChild(el);
  }
  el.textContent=text;
  el.style.background=type==='error'?'#fee2e2':'#d1fae5';
  el.style.color=type==='error'?'#991b1b':'#065f46';
  el.style.opacity='1'; el.style.display='block';
  clearTimeout(el._t);
  el._t=setTimeout(function(){ el.style.opacity='0'; setTimeout(function(){ el.style.display='none'; },300); },4000);
}

// Send via contact's preferred channel with UI channel picker
function openSendMessageModal(job){
  if(!job) return;
  var ch=getContactChannel(job);
  var phone=job.clientPhone||''; var email=job.clientEmail||'';
  var h='<div class="form-group"><label>Channel</label>'
    +'<select id="msg-channel" onchange="updateMsgModalFields()" style="width:auto">'
    +'<option value="sms"'+(ch==='sms'?' selected':'')+'>SMS</option>'
    +'<option value="whatsapp"'+(ch==='whatsapp'?' selected':'')+'>WhatsApp</option>'
    +'<option value="email"'+(ch==='email'?' selected':'')+'>Email</option>'
    +'</select></div>'
    +'<div class="form-group" id="msg-phone-group"><label>Phone</label><input type="tel" id="msg-phone" value="'+FT_esc(phone)+'"></div>'
    +'<div class="form-group" id="msg-email-group" style="display:none"><label>Email</label><input type="email" id="msg-to-email" value="'+FT_esc(email)+'"></div>'
    +'<div class="form-group" id="msg-subject-group" style="display:none"><label>Subject</label><input type="text" id="msg-subject" value="WillowPA Maintenance Update"></div>'
    +'<div class="form-group"><label>Message</label><textarea id="msg-body" rows="4" class="jc-textarea" placeholder="Type your message..."></textarea></div>';
  var container=document.getElementById('msg-modal-body');
  if(container) container.innerHTML=h;
  document.getElementById('msg-modal-jobid').value=job.id;
  updateMsgModalFields();
  FT_openModal('ft-modal-sendmsg');
}

function updateMsgModalFields(){
  var ch=(document.getElementById('msg-channel')||{}).value||'sms';
  var pg=document.getElementById('msg-phone-group');
  var eg=document.getElementById('msg-email-group');
  var sg=document.getElementById('msg-subject-group');
  if(pg) pg.style.display=ch==='email'?'none':'block';
  if(eg) eg.style.display=ch==='email'?'block':'none';
  if(sg) sg.style.display=ch==='email'?'block':'none';
}

function sendFromMsgModal(){
  var jobId=+(document.getElementById('msg-modal-jobid')||{}).value;
  var ch=(document.getElementById('msg-channel')||{}).value||'sms';
  var body=(document.getElementById('msg-body')||{}).value.trim();
  if(!body){ alert('Enter a message.'); return; }
  var to = ch==='email' ? (document.getElementById('msg-to-email')||{}).value.trim() : (document.getElementById('msg-phone')||{}).value.trim();
  if(!to){ alert('Enter a recipient.'); return; }
  var opts = {to:to, msg:body, channel:ch, jobId:jobId};
  if(ch==='email'){
    opts.toEmail=to;
    opts.subject=(document.getElementById('msg-subject')||{}).value.trim()||'WillowPA Maintenance Update';
  }
  FT_sendMessage(opts).then(function(d){
    if(d.ok) FT_closeModal('ft-modal-sendmsg');
  });
}

//  REQUESTS PAGE 
var FT__requests=[];
function renderRequestsPage(){
  var el=document.getElementById('req-list'); if(!el) return;
  el.innerHTML='<div class="empty-FT_state"><span class="emoji">...</span>Loading...</div>';
  fetch('requests.php').then(function(r){ return r.json(); })
  .then(function(data){
    FT__requests=Array.isArray(data)?data:[];
    renderReqList();
    var n=FT__requests.filter(function(r){ return r.status==='new'; }).length;
    var b=document.getElementById('req-badge'); if(b){ b.textContent=n; b.style.display=n>0?'inline':'none'; }
  })
  .catch(function(e){ el.innerHTML='<div class="alert alert-warn">Could not load requests.php: '+e.message+'</div>'; });
}
function renderReqList(showAll){
  var el=document.getElementById('req-list'); if(!el) return;
  var newReqs=FT__requests.filter(function(r){ return (r.status||'new')==='new'; });
  var linkedReqs=FT__requests.filter(function(r){ return r.status==='linked'||r.status==='done'; });
  var visible=showAll?FT__requests:newReqs;
  var toggleHtml='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
    +'<div style="font-size:13px;color:var(--muted)">'+newReqs.length+' new'+(linkedReqs.length?' &nbsp;|&nbsp; <span style="color:var(--accent2)">'+linkedReqs.length+' assigned</span>':'')+'</div>'
    +(linkedReqs.length?'<button class="btn btn-secondary btn-xs" onclick="renderReqList('+(showAll?'false':'true')+')">'+(showAll?'Hide Assigned':'Show All')+'</button>':'')
    +'</div>';
  if(!visible.length){ el.innerHTML=toggleHtml+'<div class="empty-FT_state"><span class="emoji">&#x1F4ED;</span>No active requests.</div>'; return; }
  var sorted=visible.slice().sort(function(a,b){ return (b.createdAt||'').localeCompare(a.createdAt||''); });
  el.innerHTML=toggleHtml+sorted.map(function(req){
    var sc=req.status==='new'?'tag-pink':req.status==='linked'?'tag-blue':'tag-green';
    return '<div class="card" style="margin-bottom:12px">'
      +'<div class="flex flex-wrap" style="justify-content:space-between;margin-bottom:10px">'
      +'<div><div style="font-size:15px;font-weight:600">'+FT_esc(req.name||'?')+'</div>'
      +'<div style="font-size:12px;color:var(--muted);font-family:var(--fm)">'+FT_esc(req.phone||'')+'&nbsp;&nbsp;'+FT_esc((req.createdAt||'').slice(0,10))+'</div></div>'
      +'<span class="tag '+sc+'">'+FT_esc(req.status||'new')+'</span></div>'
      +(req.address?'<div style="font-size:12px;color:var(--muted);margin-bottom:6px">&#x1F4CD; '+FT_esc(req.address)+'</div>':'')
      +(req.block?'<div style="background:rgba(196,127,0,.1);border:1px solid rgba(196,127,0,.25);border-radius:6px;padding:7px 10px;font-size:12px;color:var(--accent);margin-bottom:8px">&#x1F4C5; '+FT_esc(req.block)+'</div>':'')
      +(req.noAppointmentNeeded?'<div style="background:rgba(26,122,74,.08);border:1px solid rgba(26,122,74,.2);border-radius:6px;padding:5px 10px;font-size:11px;color:#166534;margin-bottom:8px">&#x1F511; No appointment needed</div>':'')
      +'<div style="font-size:13px;color:var(--muted);margin-bottom:10px;line-height:1.5">'+FT_esc(req.description||'')+'</div>'
      +(req.photo?'<img src="'+req.photo+'" style="max-width:140px;border-radius:8px;margin-bottom:10px;display:block" alt="Photo">':'')
      +'<div class="req-btns flex flex-wrap" style="gap:8px" data-id="'+FT_esc(req.id)+'">'
      +(req.status==='new'?'<button class="btn btn-primary btn-sm req-action" data-action="link">&#x1F517; Link to Job</button>':'')
      +(req.status==='linked'?'<button class="btn btn-success btn-sm req-action" data-action="notify">&#x2705; Notify</button>':'')
      +'<button class="btn btn-secondary btn-sm req-action" data-action="msg">&#x1F4AC; Message</button>'
      +'<button class="btn btn-danger btn-xs req-action" data-action="del" style="padding:4px 8px">&#x2715;</button>'
      +'</div>'
      +((req.messages||[]).length?'<div style="margin-top:10px;padding:8px 12px;background:var(--surface2);border-radius:8px;font-size:12px;border:1px solid var(--border)">'+req.messages.map(function(m){ return '<div style="margin-bottom:4px"><strong style="color:var(--accent)">'+FT_esc(m.from)+':</strong> '+FT_esc(m.text)+'</div>'; }).join('')+'</div>':'')
      +'</div>';
  }).join('');
  el.querySelectorAll('.req-btns').forEach(function(div){
    var rid=div.getAttribute('data-id');
    div.querySelectorAll('.req-action').forEach(function(btn){
      btn.onclick=function(){
        var a=this.getAttribute('data-action');
        if(a==='link') openLinkRequest(rid);
        else if(a==='notify') notifyClientAssigned(rid);
        else if(a==='msg') openMsgClient(rid);
        else if(a==='del') deleteRequest(rid);
      };
    });
  });
}
function openLinkRequest(reqId){
  var req=FT__requests.find(function(r){ return r.id===reqId; });
  if(!req){ alert('Request not found. Please refresh and try again.'); return; }
  document.getElementById('lr-req-idx').value=reqId;
  document.getElementById('lr-block-display').textContent=req.block?'Requested: '+req.block:'No specific time requested';
  document.getElementById('lr-prop-search').value=''; document.getElementById('lr-prop-id').value='';
  var s=document.getElementById('lr-prop-selected'); if(s) s.style.display='none';
  populateSelect(document.getElementById('lr-tech'),FT_state.technicians.filter(function(t){ return t.status==='active'; }),'id',function(t){ return t.name; },'Select technician...');
  document.getElementById('lr-notes').value=req.description||'';
  var lb=document.getElementById('lr-block'); if(lb) lb.value=req.block||'';
  FT_openModal('ft-modal-link-request');
}
function lrPropSearch(){ buildPropAC('lr-prop-search','lr-ac-list','lr-prop-id','lr-prop-selected'); }
function saveLinkRequest(){
  var idx=+document.getElementById('lr-req-idx').value; var req=FT__requests[idx];
  var propId=+document.getElementById('lr-prop-id').value;
  var techId=+document.getElementById('lr-tech').value;
  if(!propId||!techId){ alert('Select both property and technician.'); return; }
  var tech=getTech(techId); var prop=getProp(propId);
  var job={id:FT_uid(),propId:propId,techId:techId,date:FT_today(),
    notes:document.getElementById('lr-notes').value,
    status:'open',assignedByAdmin:true,block:req.block||'',
    clientName:req.name,clientPhone:req.phone,hours:[],expenses:[],photos:[]};
  FT_state.jobs.push(job); FT_save();
  req.status='linked'; req.linkedJobId=job.id;
  fetch('requests.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(req)}).catch(function(){});
  if(tech&&tech.phone) sendSMS(tech.phone,'WillowPA: New job at '+(prop?prop.name:'')+(req.block?' | '+req.block:'')+'. Login: tech.willowpa.com');
  // Notify client via their preferred channel
  if(req.phone||req.email){
    var _tmpJob={clientPhone:req.phone,clientEmail:req.email,clientPreferredComm:req.preferredComm||'sms'};
    FT_notify(_tmpJob,'WillowPA Maintenance: Confirmed!'+(req.block?' Tech arrives: '+req.block:' We will call to confirm time.')+' Questions? Reply to this number.',{subject:'Service Confirmed — WillowPA'});
  }
  FT_closeModal('ft-modal-link-request'); renderRequestsPage();
  alert('[OK] Job created and assigned to '+tech.name+'!');
}
function openMsgClient(reqId){
  var req=FT__requests.find(function(r){ return r.id===reqId; });
  if(!req){ alert('Request not found. Please refresh.'); return; }
  document.getElementById('mc-req-idx').value=reqId;
  document.getElementById('mc-msg').value='';
  FT_openModal('ft-modal-msg-client');
}
function sendMsgClient(){
  var reqId=document.getElementById('mc-req-idx').value;
  var req=FT__requests.find(function(r){ return r.id===reqId; });
  if(!req) return;
  var msg=document.getElementById('mc-msg').value.trim(); if(!msg){ alert('Enter a message.'); return; }
  if(!req.messages) req.messages=[];
  req.messages.push({from:'Admin',text:msg,at:new Date().toISOString()});
  // Send via preferred channel
  if(req.phone||req.email){
    var _tmpR={clientPhone:req.phone,clientEmail:req.email,clientPreferredComm:req.preferredComm||'sms'};
    FT_notify(_tmpR,'WillowPA Maintenance: '+msg,{subject:'Message from WillowPA Maintenance'});
  }
  fetch('requests.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:req.id,messages:req.messages})})
  .then(function(r){ return r.json(); })
  .then(function(){ FT_closeModal('ft-modal-msg-client'); renderRequestsPage(); })
  .catch(function(){ FT_closeModal('ft-modal-msg-client'); renderRequestsPage(); });
}
var FT_AVAIL_URL = 'https://tech.willowpa.com/availability.php';

function renderAvailabilityPage(){
  var container = document.getElementById('ft-av-content') || document.getElementById('av-content');
  if(container) container.innerHTML='<div class="empty-state"><span class="emoji">...</span>Loading...</div>';
  fetch(FT_AVAIL_URL).then(function(r){ return r.json(); })
  .then(function(d){ renderAvailUI(d); })
  .catch(function(e){ if(container) container.innerHTML='<div class="alert alert-warn">Could not load availability: '+e.message+'</div>'; });
}
function renderAvailUI(d){
  var el = document.getElementById('ft-av-content') || document.getElementById('av-content');
  if(!el) return;
  var bd=d.blockedDates||[], bb=d.blockedBlocks||[];
  var today = new Date().toISOString().slice(0,10);
  var html='<div class="data-section" style="max-width:600px">'
    +'<h3>Booking Mode</h3>'
    +'<label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;margin-bottom:8px">'
    +'<input type="checkbox" id="av-anytime" '+(d.anyTimeMode?'checked':'')+' onchange="setAnyTime(this.checked)" style="width:18px;height:18px;flex-shrink:0">'
    +'<span><strong>Flexible timing</strong> — Booking page shows no time blocks; admin contacts client directly</span></label>'
    +'<p style="font-size:12px;color:var(--muted)">Uncheck to let clients pick a time block (AM/PM) when booking.</p>'
    +'</div>';
  html+='<div class="data-section" style="max-width:600px">'
    +'<h3>Block Dates &amp; Slots</h3>'
    +'<p style="font-size:12px;color:var(--muted);margin-bottom:12px">Blocked dates/slots are hidden from the booking form. Clients cannot select them.</p>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end;margin-bottom:12px">'
    +'<div class="form-group" style="margin-bottom:0"><label>Date</label><input type="date" id="av-block-date" min="'+today+'"></div>'
    +'<div class="form-group" style="margin-bottom:0"><label>Slot</label>'
    +'<select id="av-block-slot"><option value="">Whole day</option><option value="_AM">Morning (9am-1pm)</option><option value="_PM">Afternoon (1pm-5pm)</option></select></div>'
    +'<button class="btn btn-danger btn-sm" onclick="addBlock()" style="height:38px;white-space:nowrap">Block</button>'
    +'</div></div>';
  html+='<div class="data-section" style="max-width:600px">'
    +'<h3>Currently Blocked <span style="font-weight:400;color:var(--muted);font-size:13px">('+(bd.length+bb.length)+')</span></h3>';
  if(bd.length||bb.length){
    html+='<div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">';
    bd.forEach(function(date){
      var dayLabel = new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
      html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--surface2)">'
        +'<div><span style="font-family:var(--fm);font-weight:600">'+FT_esc(date)+'</span> <span style="color:var(--muted);font-size:12px">'+dayLabel+'</span> <span style="background:var(--accent3);color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px">ALL DAY</span></div>'
        +'<button class="btn btn-secondary btn-xs" onclick="removeBlock(\''+date+'\',\'date\')">Remove</button></div>';
    });
    bb.forEach(function(blk){
      var parts=blk.split('_'), dt=parts[0], slot=parts[1];
      var dayLabel = new Date(dt+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
      var slotLabel = slot==='AM' ? 'Morning (9am-1pm)' : 'Afternoon (1pm-5pm)';
      var slotColor = slot==='AM' ? '#e8f0fe' : '#fef3e0';
      html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border)">'
        +'<div><span style="font-family:var(--fm);font-weight:600">'+FT_esc(dt)+'</span> <span style="color:var(--muted);font-size:12px">'+dayLabel+'</span> <span style="background:'+slotColor+';font-size:10px;padding:2px 6px;border-radius:4px;margin-left:6px;font-weight:600">'+slotLabel+'</span></div>'
        +'<button class="btn btn-secondary btn-xs" onclick="removeBlock(\''+blk+'\',\'block\')">Remove</button></div>';
    });
    html+='</div>';
  } else {
    html+='<div style="text-align:center;padding:24px;color:var(--muted);font-style:italic">No dates blocked — all slots available for booking</div>';
  }
  html+='</div>';
  el.innerHTML=html;
}
function setAnyTime(val){
  fetch(FT_AVAIL_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({anyTimeMode:val})})
  .then(function(r){ return r.json(); }).then(function(d){ renderAvailUI(d.data||d); });
}
function addBlock(){
  var date=document.getElementById('av-block-date').value; var slot=document.getElementById('av-block-slot').value;
  if(!date){ alert('Select a date.'); return; }
  fetch(FT_AVAIL_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(slot?{addBlockedBlock:date+slot}:{addBlockedDate:date})})
  .then(function(r){ return r.json(); }).then(function(d){ renderAvailUI(d.data||d); });
}
function removeBlock(val,type){
  fetch(FT_AVAIL_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(type==='date'?{removeBlockedDate:val}:{removeBlockedBlock:val})})
  .then(function(r){ return r.json(); }).then(function(d){ renderAvailUI(d.data||d); });
}

//  SHARES PAGE 
function renderSharesPage(){
  var sl=document.getElementById('shares-list'); if(!sl) return;
  sl.innerHTML='<div class="empty-FT_state"><span class="emoji">...</span>Loading...</div>';
  fetch('shares.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'list'})})
  .then(function(r){ return r.json(); })
  .then(function(data){
    var list=Array.isArray(data)?data:[];
    if(!list.length){ sl.innerHTML='<div class="empty-FT_state"><span class="emoji">&#x1F517;</span>No share links yet.<br>Complete a job and click "&#x1F517; Share Link".</div>'; return; }
    list.sort(function(a,b){ return b.createdAt.localeCompare(a.createdAt); });
    sl.innerHTML=list.map(function(s){
      var expired=s.expiresAt&&new Date(s.expiresAt)<new Date();
      var url='view.php?token='+s.token;
      return '<div class="card" style="margin-bottom:10px">'
        +'<div class="flex flex-wrap" style="justify-content:space-between;margin-bottom:8px">'
        +'<div><div style="font-weight:600;font-size:14px">'+FT_esc(s.clientName||s.job&&s.job.propName||'Job')+'</div>'
        +'<div style="font-size:11px;color:var(--muted);font-family:var(--fm)">'+FT_esc(s.job&&s.job.date||'')+(s.clientPhone?' &nbsp;&nbsp; '+FT_esc(s.clientPhone):'')+'</div></div>'
        +'<div class="flex" style="gap:6px">'+(s.isPaid?'<span class="tag tag-green">[OK] PAID</span>':'<span class="tag tag-pink">... UNPAID</span>')
        +(expired?'<span class="tag tag-pink">EXPIRED</span>':'<span class="tag tag-blue">ACTIVE</span>')+'</div></div>'
        +'<div style="font-size:11px;font-family:var(--fm);color:var(--accent2);margin-bottom:8px;word-break:break-all">'+FT_esc(url)+'</div>'
        +'<div class="flex flex-wrap" style="gap:6px">'
        +'<button class="btn btn-secondary btn-xs" onclick="copyShareLink(\'+url+\')">&#x1F4CB; Copy Link</button>'
        +(expired?'<button class="btn btn-secondary btn-xs" onclick="renewShare(\'+s.token+\')">[renew] Renew</button>':'')
        +'<button class="btn btn-secondary btn-xs" onclick="toggleSharePaid(\''+s.token+'\','+(s.isPaid?'\'false\'':'\'true\'')+')">'+(s.isPaid?'Mark Unpaid':'[OK] Mark Paid')+'</button>'
        +(!s.stripeLink?'<button class="btn btn-secondary btn-xs" onclick="addStripeLink(\'+s.token+\')">+ Stripe</button>':'<a href="'+FT_esc(s.stripeLink)+'" class="btn btn-secondary btn-xs" target="_blank">[pay] Stripe</a>')
        +'</div></div>';
    }).join('');
  })
  .catch(function(e){ sl.innerHTML='<div class="alert alert-warn">Could not load shares: '+e.message+'</div>'; });
}
function renewShare(token){
  fetch('shares.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update',token:token,renew:true})})
  .then(function(){ renderSharesPage(); alert('[OK] Renewed for 90 days.'); });
}
function toggleSharePaid(token,paid){
  fetch('shares.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update',token:token,isPaid:paid==='true'||paid===true})})
  .then(function(){ renderSharesPage(); });
}
function addStripeLink(token){
  var link=prompt('Paste your Stripe payment link:','https://buy.stripe.com/');
  if(!link||link==='https://buy.stripe.com/') return;
  fetch('shares.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update',token:token,stripeLink:link})})
  .then(function(){ renderSharesPage(); alert('[OK] Stripe link added.'); });
}

//  SEED / INIT 
function initAdminUser(){ if(!FT_state.users.find(function(u){ return u.role==='admin'; })) FT_state.users.push({id:FT_uid(),name:'Administrator',username:'admin',password:'admin1234',role:'admin',status:'active'}); }
function seedDemo(){
  if(FT_state._initialized) return; FT_state._initialized=true;
  FT_state.users.push({id:FT_uid(),name:'Administrator',username:'admin',password:'admin1234',role:'admin',status:'active'});
  var o1={id:FT_uid(),name:'Alice Johnson',email:'alice@demo.com',phone:'555-0101',company:'AJ Properties'};
  var o2={id:FT_uid(),name:'Bob Martinez',email:'bob@demo.com',phone:'555-0202',company:'Martinez Realty'};
  FT_state.owners.push(o1,o2);
  var t1={id:FT_uid(),name:'Mike Chen',rate:45,email:'mike@co.com',phone:'555-1001',status:'active'};
  var t2={id:FT_uid(),name:'Sara Davis',rate:55,email:'sara@co.com',phone:'555-1002',status:'active'};
  FT_state.technicians.push(t1,t2);
  FT_state.users.push({id:FT_uid(),name:'Mike Chen',username:'mike',password:'1001',role:'tech',techId:t1.id,status:'active'});
  FT_state.users.push({id:FT_uid(),name:'Sara Davis',username:'sara',password:'1002',role:'tech',techId:t2.id,status:'active'});
  var props=[
    {id:FT_uid(),name:'Sunset Apts A1',ownerId:o1.id,defaultRate:60,rateType:'flat',address:'100 Oak Street',unit:'Apt A1',city:'Miami, FL 33101'},
    {id:FT_uid(),name:'Elm Plaza 202',ownerId:o1.id,defaultRate:65,rateType:'flat',address:'200 Elm Avenue',unit:'Unit 202',city:'Miami, FL 33102'},
    {id:FT_uid(),name:'Main Blvd Site',ownerId:o2.id,defaultRate:70,rateType:'flat',address:'10 Main Boulevard',unit:'Suite 100',city:'Miami Beach, FL 33139'},
    {id:FT_uid(),name:'West End Complex',ownerId:o2.id,defaultRate:80,rateType:'flat',address:'5 West End Road',unit:'',city:'Aventura, FL 33160'}
  ];
  FT_state.properties=props;
  var ws=new Date(); ws.setDate(ws.getDate()-ws.getDay());
  var descs=['HVAC maintenance','Electrical inspection','Plumbing repair','Lock replacement'];
  for(var d=0;d<4;d++){
    var dt=new Date(ws.getTime()); dt.setDate(ws.getDate()+d);
    var ds=dt.toISOString().slice(0,10);
    var t=d%2===0?t1:t2, p=props[d%props.length];
    var job={id:FT_uid(),propId:p.id,techId:t.id,date:ds,notes:'Sample demo job',status:d<2?'complete':'open',assignedByAdmin:d===1,completedDate:d<2?ds:null,hours:[],expenses:[],photos:[]};
    job.hours.push({id:FT_uid(),date:ds,hours:[3,4,5,6][d],desc:descs[d]});
    if(d%2===0) job.expenses.push({id:FT_uid(),date:ds,store:'Home Depot',cost:parseFloat((Math.random()*80+15).toFixed(2)),desc:'Replacement parts',linkType:'property'});
    FT_state.jobs.push(job);
  }
  FT_save();
}

//  BOOT — disabled for PropDesk embedding (FT_init handles initialization)
// Original boot code removed to prevent conflicts with PropDesk DOM

function notifyClientAssigned(reqId){
  var req=FT__requests.find(function(r){ return r.id===reqId; }); if(!req) return;
  var job=FT_state.jobs.find(function(j){ return j.id===req.linkedJobId; });
  var tech=job?getTech(job.techId):null;
  var block=req.block||(job&&job.block)||'';
  var msg='WillowPA Maintenance: A technician has been assigned to your service request.'
    +(tech?' Your technician is '+tech.name+'.':'')
    +(block?' Estimated time: '+block:' We will confirm the appointment time shortly.')
    +' Questions? Reply to this number.';
  document.getElementById('mc-req-idx').value=reqId;
  document.getElementById('mc-msg').value=msg;
  FT_openModal('ft-modal-msg-client');
}

//  ADMIN APPROVE / SEND BACK
function adminApproveJob(jobId){
  if(!confirm('Approve this job and mark it as complete?')) return;
  var job=getJob(jobId); if(!job) return;
  job.status='complete';
  FT_save();
  refreshJobCard(jobId);
  renderAllJobs();
  // Notify client via preferred channel (SMS/WhatsApp/Email)
  if(job.clientPhone||job.clientEmail){
    var prop=getProp(job.propId);
    var hrs=jobTotalHours(job), exp=jobTotalExp(job), labor=jobTotalLabor(job);
    var msg='WillowPA Maintenance: Your service at '+(prop?prop.name:'your property')+' is complete.'+
      ' Hours: '+hrs.toFixed(2)+', Expenses: $'+exp.toFixed(2)+', Total: $'+(labor+exp).toFixed(2)+'.';
    if(job.paymentLink) msg+=' Pay: '+job.paymentLink;
    else if(job.stripeLink) msg+=' Pay: '+job.stripeLink;
    else if(job.shareToken) msg+=' View report: '+window.location.origin+'/view.php?token='+job.shareToken;
    FT_notify(job, msg, {subject:'Service Complete — WillowPA Maintenance'});
  }
}
function adminSendBackJob(jobId){
  var job=getJob(jobId); if(!job) return;
  job.status='open'; job.completedDate=null;
  FT_save();
  refreshJobCard(jobId);
}

//  ON MY WAY
function sendOnMyWay(jobId, minutes){
  var job=getJob(jobId); if(!job){ alert('Job not found.'); return; }
  if(!job.clientPhone&&!job.clientEmail){ alert('No contact info on this job.'); return; }
  var prop=getProp(job.propId);
  var msg='WillowPA Maintenance: Your technician is on the way and will arrive in approximately '+minutes+' minute'+(minutes===1?'':'s')+'.'+(prop?' Location: '+prop.name:'');
  FT_notify(job, msg);
}

//  MESSAGE CLIENT (uses preferred channel)
function sendJobClientMessage(jobId){
  var job=getJob(jobId); if(!job){ alert('Job not found.'); return; }
  if(!job.clientPhone&&!job.clientEmail){ alert('No contact info on this job.'); return; }
  var msg=((document.getElementById('msg-client-'+jobId)||{}).value||'').trim();
  if(!msg){ alert('Enter a message.'); return; }
  FT_notify(job, 'WillowPA Maintenance: '+msg);
  var el=document.getElementById('msg-client-'+jobId); if(el) el.value='';
}

// Set client communication preference on a job
function setJobCommPref(jobId,pref){
  var job=getJob(jobId); if(!job) return;
  job.clientPreferredComm=pref;
  FT_save(); refreshJobCard(jobId);
}

//  DELETE JOB
function deleteJob(jobId){
  if(!confirm('Delete this job permanently? This cannot be undone.')) return;
  var job=getJob(jobId);
  var pids=(job&&job.photos||[]).map(function(p){ return p.id; });
  FT_state.jobs=FT_state.jobs.filter(function(j){ return j.id!==jobId; });
  FT_save();
  if(pids.length) FT_DB.delMany(pids,function(){ renderAllJobs(); });
  else renderAllJobs();
  updateJobsBadge();
}

//  DELETE REQUEST
function deleteRequest(reqId){
  if(!confirm('Delete this request permanently?')) return;
  fetch('requests.php',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:reqId,status:'deleted',_delete:true})})
  .then(function(){
    FT__requests=FT__requests.filter(function(r){ return r.id!==reqId; });
    renderReqList();
    var n=FT__requests.filter(function(r){ return r.status==='new'; }).length;
    var b=document.getElementById('req-badge'); if(b){ b.textContent=n; b.style.display=n>0?'inline':'none'; }
  });
}

//  TASKS SYSTEM
function renderTasksPage(){
  var el=document.getElementById('ft-page-tasks'); if(!el) return;
  var tasks=FT_state.tasks||[];
  var contacts=FT_state.taskContacts||[];
  var today_=FT_today();
  // Update task badge
  var due=tasks.filter(function(t){
    if(t.status==='complete') return false;
    if(!t.dueDate) return false;
    if(t.reminderDay){
      var d=new Date(t.dueDate); d.setDate(d.getDate()-1);
      var rem=d.toISOString().slice(0,10);
      return today_>=rem;
    }
    return today_>=t.dueDate;
  }).length;
  var b=document.getElementById('task-badge'); if(b){ b.textContent=due; b.style.display=due>0?'inline':'none'; }
  // Build contacts datalist
  var cl=contacts.map(function(c){ return '<option value="'+FT_esc(c.name)+'">'; }).join('');
  var h='<div class="page-header"><div class="page-title">Tasks</div></div>';
  h+='<div style="margin-bottom:12px"><datalist id="task-contacts-list">'+cl+'</datalist>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end">';
  h+='<div class="form-group" style="flex:1;min-width:180px;margin:0"><label>Title</label><input type="text" id="new-task-title" placeholder="Task title..."></div>';
  h+='<div class="form-group" style="width:140px;margin:0"><label>Assign To</label><input type="text" id="new-task-assignee" list="task-contacts-list" placeholder="Name..."></div>';
  h+='<div class="form-group" style="width:130px;margin:0"><label>Due Date</label><input type="date" id="new-task-due"></div>';
  h+='<div class="form-group" style="width:120px;margin:0"><label>Repeat</label><select id="new-task-repeat"><option value="">None</option><option value="weekly">Weekly</option><option value="biweekly">Bi-weekly</option><option value="monthly">Monthly</option></select></div>';
  h+='<div class="form-group" style="margin:0"><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" id="new-task-reminder"> Remind 1 day before</label></div>';
  h+='<button class="btn btn-primary" onclick="saveTask()">+ Add Task</button>';
  h+='</div>';
  h+='<div class="form-group" style="margin-top:8px"><label>Notes</label><textarea id="new-task-notes" rows="2" placeholder="Optional notes..."></textarea></div></div>';
  // Filter buttons
  h+='<div style="display:flex;gap:8px;margin-bottom:12px">';
  h+='<button class="btn btn-secondary btn-sm" onclick="renderTasksPage()" id="task-filter-all">All ('+tasks.length+')</button>';
  h+='<button class="btn btn-secondary btn-sm" onclick="renderTasksFiltered(&quot;open&quot;)">Open ('+tasks.filter(function(t){return t.status==='open';}).length+')</button>';
  h+='<button class="btn btn-secondary btn-sm" onclick="renderTasksFiltered(&quot;complete&quot;)">Done ('+tasks.filter(function(t){return t.status==='complete';}).length+')</button>';
  h+='<button class="btn btn-secondary btn-sm" onclick="renderTasksFiltered(&quot;due&quot;)">Due/Upcoming ('+due+')</button>';
  h+='</div>';
  h+='<div id="task-list">'+buildTaskList(tasks)+'</div>';
  el.innerHTML=h;
}
function renderTasksFiltered(filter){
  var tasks=FT_state.tasks||[];
  var today_=FT_today();
  var filtered;
  if(filter==='open') filtered=tasks.filter(function(t){ return t.status==='open'; });
  else if(filter==='complete') filtered=tasks.filter(function(t){ return t.status==='complete'; });
  else if(filter==='due') filtered=tasks.filter(function(t){
    if(t.status==='complete') return false;
    if(!t.dueDate) return false;
    if(t.reminderDay){ var d=new Date(t.dueDate); d.setDate(d.getDate()-1); return today_>=d.toISOString().slice(0,10); }
    return today_>=t.dueDate;
  });
  else filtered=tasks;
  var el=document.getElementById('task-list'); if(el) el.innerHTML=buildTaskList(filtered);
}
function buildTaskList(tasks){
  if(!tasks.length) return '<div class="empty-FT_state"><span class="emoji">&#x2705;</span>No tasks.</div>';
  var today_=FT_today();
  return tasks.slice().sort(function(a,b){ return (a.dueDate||'9999')>(b.dueDate||'9999')?1:-1; }).map(function(t){
    var isDue=t.status==='open'&&t.dueDate&&today_>=t.dueDate;
    var isReminder=t.status==='open'&&t.dueDate&&t.reminderDay&&(function(){ var d=new Date(t.dueDate); d.setDate(d.getDate()-1); return today_>=d.toISOString().slice(0,10)&&today_<t.dueDate; })();
    var bg=t.status==='complete'?'rgba(34,197,94,.06)':isDue?'rgba(224,92,122,.06)':isReminder?'rgba(245,158,11,.06)':'var(--surface)';
    var border=isDue?'1px solid rgba(224,92,122,.3)':isReminder?'1px solid rgba(245,158,11,.2)':'1px solid var(--border)';
    var h='<div style="padding:10px 14px;border-radius:8px;margin-bottom:8px;background:'+bg+';border:'+border+'">';
    h+='<div style="display:flex;align-items:flex-start;gap:8px">';
    h+='<input type="checkbox" style="margin-top:3px;cursor:pointer" '+(t.status==='complete'?'checked':'')+' onchange="toggleTaskStatus(&quot;'+t.id+'&quot;)">';
    h+='<div style="flex:1">';
    h+='<div style="font-weight:600;'+(t.status==='complete'?'text-decoration:line-through;opacity:.5':'')+'">'+(isDue?'&#x26A0;&#xFE0F; ':isReminder?'&#x1F514; ':'')+FT_esc(t.title)+'</div>';
    if(t.assignedTo) h+='<div style="font-size:12px;color:var(--muted)">&#x1F464; '+FT_esc(t.assignedTo)+'</div>';
    if(t.dueDate) h+='<div style="font-size:12px;color:var(--muted)">Due: '+t.dueDate+(t.repeat?' · Repeats '+t.repeat:'')+'</div>';
    if(t.notes) h+='<div style="font-size:12px;margin-top:4px;color:var(--muted)">'+FT_esc(t.notes)+'</div>';
    h+='</div>';
    h+='<button class="btn btn-danger btn-xs" onclick="deleteTask(&quot;'+t.id+'&quot;)">&#x2715;</button>';
    h+='</div></div>';
    return h;
  }).join('');
}
function saveTask(){
  var title=((document.getElementById('new-task-title')||{}).value||'').trim();
  if(!title){ alert('Task title required.'); return; }
  var assignee=((document.getElementById('new-task-assignee')||{}).value||'').trim();
  var due=((document.getElementById('new-task-due')||{}).value||'');
  var repeat=((document.getElementById('new-task-repeat')||{}).value||'');
  var reminder=(document.getElementById('new-task-reminder')||{}).checked||false;
  var notes=((document.getElementById('new-task-notes')||{}).value||'').trim();
  // Add new contact if not known
  if(assignee){
    var contacts=FT_state.taskContacts||[];
    if(!contacts.find(function(c){ return c.name===assignee; })){
      contacts.push({id:'tc_'+Date.now(),name:assignee,phone:''});
      FT_state.taskContacts=contacts;
    }
  }
  var task={id:'task_'+Date.now(),title:title,notes:notes,dueDate:due,assignedTo:assignee,repeat:repeat,repeatDays:'',reminderDay:reminder,status:'open',createdAt:new Date().toISOString()};
  if(!FT_state.tasks) FT_state.tasks=[];
  FT_state.tasks.push(task);
  FT_save();
  // Clear form
  ['new-task-title','new-task-assignee','new-task-due','new-task-notes'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  var rs=document.getElementById('new-task-repeat'); if(rs) rs.value='';
  var rb=document.getElementById('new-task-reminder'); if(rb) rb.checked=false;
  renderTasksPage();
}
function toggleTaskStatus(taskId){
  var task=(FT_state.tasks||[]).find(function(t){ return t.id===taskId; });
  if(!task) return;
  if(task.status==='complete'){
    task.status='open'; task.completedDate=null;
  } else {
    task.status='complete'; task.completedDate=FT_today();
    // Handle repeat
    if(task.repeat&&task.dueDate){
      var d=new Date(task.dueDate);
      if(task.repeat==='weekly') d.setDate(d.getDate()+7);
      else if(task.repeat==='biweekly') d.setDate(d.getDate()+14);
      else if(task.repeat==='monthly') d.setMonth(d.getMonth()+1);
      var newTask={id:'task_'+Date.now(),title:task.title,notes:task.notes,dueDate:d.toISOString().slice(0,10),assignedTo:task.assignedTo,repeat:task.repeat,repeatDays:task.repeatDays||'',reminderDay:task.reminderDay,status:'open',createdAt:new Date().toISOString()};
      FT_state.tasks.push(newTask);
    }
  }
  FT_save();
  renderTasksPage();
}
function deleteTask(taskId){
  if(!confirm('Delete this task?')) return;
  FT_state.tasks=(FT_state.tasks||[]).filter(function(t){ return t.id!==taskId; });
  FT_save(); renderTasksPage();
}

//  REPHRASE WORK DESCRIPTION
function rephraseWorkDesc(jobId){
  var el=document.getElementById('ah-desc-'+jobId);
  if(!el||!el.value.trim()){ alert('Type a work description first, then click Rephrase.'); return; }
  var apiKey=getApiKey();
  if(!apiKey){ alert('No API key configured. Go to Settings.'); return; }
  var original=el.value.trim();
  el.disabled=true; el.value='Rephrasing...';
  fetch('proxy.php',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'claude-sonnet-4-20250514',
      max_tokens:300,
      messages:[{role:'user',content:'Rephrase this field technician work note into clear, professional language suitable for a maintenance report. Keep it concise (1-3 sentences). Only return the rephrased text, nothing else. Original note: '+original}]
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    el.disabled=false;
    var reply='';
    if(data.content&&data.content.length) data.content.forEach(function(c){ if(c.type==='text') reply+=c.text; });
    el.value=reply.trim()||original;
  })
  .catch(function(){ el.disabled=false; el.value=original; alert('Rephrase failed.'); });
}

//  BACKUP BROWSER
function loadBackupList(){
  var el=document.getElementById('backup-list'); if(!el) return;
  el.innerHTML='<div style="color:var(--muted);font-size:13px">Loading backups...</div>';
  fetch('backup_list.php')
  .then(function(r){ return r.json(); })
  .then(function(files){
    if(files._error){ el.innerHTML='<div style="color:var(--accent3);font-size:13px">[!] '+files._error+'</div>'; return; }
    if(!Array.isArray(files)||!files.length){ el.innerHTML='<div style="color:var(--muted);font-size:13px">No backup files found in data/backups/</div>'; return; }
    el.innerHTML=files.map(function(f){
      var row='<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">';
      row+='<span style="flex:1;font-family:var(--fm);font-size:12px">'+FT_esc(f.name)+'</span>';
      row+='<span style="color:var(--muted);font-size:11px">'+f.size+'</span>';
      row+='<span style="color:var(--muted);font-size:11px">'+f.date+'</span>';
      row+='<button class="btn btn-secondary btn-xs" onclick="window._previewBackup(this)" data-fn="'+FT_esc(f.name)+'">Preview</button>';
      row+='<button class="btn btn-primary btn-xs" onclick="window._restoreBackup(this)" data-fn="'+FT_esc(f.name)+'">Restore</button>';
      row+='</div>';
      return row;
    }).join('');
  })
  .catch(function(){ el.innerHTML='<div style="color:var(--accent3);font-size:13px">[!] Could not load backup list. Make sure backup_list.php is on the server.</div>'; });
}
// button onclick wrappers using data-fn attribute
window._previewBackup=function(btn){ previewBackup(btn.getAttribute('data-fn')); };
window._restoreBackup=function(btn){ restoreBackup(btn.getAttribute('data-fn')); };

function previewBackup(filename){
  fetch('backup_list.php?preview='+encodeURIComponent(filename))
  .then(function(r){ return r.json(); })
  .then(function(data){
    var info='Backup: '+filename+'\n\nContents:\n'
      +'  Jobs: '+(data.jobs||[]).length+'\n'
      +'  Properties: '+(data.properties||[]).length+'\n'
      +'  Owners: '+(data.owners||[]).length+'\n'
      +'  Technicians: '+(data.technicians||[]).length+'\n'
      +'  Saved at: '+(data._savedAt||'unknown');
    alert(info);
  })
  .catch(function(){ alert('Could not preview '+filename); });
}
function restoreBackup(filename){
  if(!confirm('Restore from backup: '+filename+'?\n\nThis will REPLACE all current data. This cannot be undone.')) return;
  if(!confirm('Are you 100% sure? All current jobs, hours and data will be replaced.')) return;
  fetch('backup_list.php?restore='+encodeURIComponent(filename))
  .then(function(r){ return r.json(); })
  .then(function(data){
    if(data.ok){
      FT_state=data.FT_state;
      FT_save();
      alert('[OK] Restored from '+filename+'! Reloading...');
      setTimeout(function(){ location.reload(); },800);
    } else {
      alert('[!] Restore failed: '+(data.error||'unknown error'));
    }
  })
  .catch(function(){ alert('Restore request failed.'); });
}


// ═══ PROPDESK INTEGRATION ═══
// Auto-initialize when loaded inside PropDesk TechTrack module
var FT_initPromise = null;
function FT_init(startPage){
  var _pg = startPage || 'dashboard';
  // Load FieldTrack state AND PropDesk data in parallel
  var pFT = fetch('https://tech.willowpa.com/state.php')
    .then(function(r){ return r.json(); })
    .then(function(d){
      var s = (d && d.state) ? d.state : d;
      if(s && typeof s==='object'){
        ['owners','technicians','properties','jobs','users','_nextId','_initialized'].forEach(function(k){
          if(s[k]!==undefined) FT_state[k]=s[k];
        });
        if(s.tasks) FT_state.tasks=s.tasks;
      }
      var admin=FT_state.users.find(function(u){ return u.role==='admin'&&u.status!=='inactive'; });
      if(!admin) admin=FT_state.users.find(function(u){ return u.role==='admin'; });
      if(admin) FT_currentUser=admin;
    })
    .catch(function(e){ console.error('FT_init fetch error:',e); });
  var pPD = FT_loadPropDeskData().catch(function(e){ console.warn('PropDesk data load:',e); });
  FT_initPromise = Promise.all([pFT, pPD]).then(function(){
    FT_autoMatch();
    // Backfill WO numbers on existing jobs that don't have one
    var changed=false;
    FT_state.jobs.forEach(function(j){ if(!j.woNum){ j.woNum=FT_nextWO(); changed=true; } });
    if(changed) FT_save();
    FT_showPage(_pg);
    // Load incoming request count + combine with open WOs for badge
    var openWOs = FT_state.jobs.filter(function(j) { return j.status === 'open' || j.status === 'in_progress'; }).length;
    // Update Work Orders sub-tab badge
    var woBadge = document.getElementById('ft-sub-badge-jobs');
    if (woBadge) { woBadge.textContent = openWOs; woBadge.style.display = openWOs > 0 ? 'inline' : 'none'; woBadge.classList.add('badge-red'); }

    if (typeof sb !== 'undefined') {
      sb.from('maintenance_requests').select('id,status').then(function(res) {
        if (res.data) {
          var incoming = res.data.filter(function(r) { return r.status === 'submitted' || r.status === 'open'; }).length;
          // Incoming sub-tab badge
          var incBadge = document.getElementById('ft-sub-badge-incoming');
          if (incBadge) { incBadge.textContent = incoming; incBadge.style.display = incoming > 0 ? 'inline' : 'none'; incBadge.classList.add('badge-red'); }
          // Combined module badge
          var total = openWOs + incoming;
          var badge = document.getElementById('techtrackBadge');
          if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'inline' : 'none'; }
        }
      });
    } else {
      // No Supabase — just show open WOs
      var badge = document.getElementById('techtrackBadge');
      if (badge) { badge.textContent = openWOs; badge.style.display = openWOs > 0 ? 'inline' : 'none'; }
    }
  });
  return FT_initPromise;
}

// ═══════════════════════════════════════════════════
//  INCOMING REQUESTS — from Supabase maintenance_requests
// ═══════════════════════════════════════════════════

var FT_incomingRequests = [];
var FT_incomingFilter = 'new';

function loadIncomingRequests() {
  var el = document.getElementById('incoming-list');
  if (!el) return;
  el.innerHTML = '<div class="empty-FT_state"><span class="emoji">...</span>Loading from Supabase...</div>';

  if (typeof sb === 'undefined') {
    el.innerHTML = '<div class="alert alert-warn">Supabase not initialized.</div>';
    return;
  }

  sb.from('maintenance_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .then(function(result) {
      if (result.error) {
        el.innerHTML = '<div class="alert alert-warn">Error: ' + result.error.message + '</div>';
        return;
      }
      FT_incomingRequests = result.data || [];
      renderIncomingList();
      // Update badges
      var incoming = FT_incomingRequests.filter(function(r) { return r.status === 'submitted' || r.status === 'open'; }).length;
      var incBadge = document.getElementById('ft-sub-badge-incoming');
      if (incBadge) { incBadge.textContent = incoming; incBadge.style.display = incoming > 0 ? 'inline' : 'none'; incBadge.classList.add('badge-red'); }
      var openWOs = FT_state.jobs ? FT_state.jobs.filter(function(j) { return j.status === 'open' || j.status === 'in_progress'; }).length : 0;
      var total = openWOs + incoming;
      var badge = document.getElementById('techtrackBadge');
      if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'inline' : 'none'; }
    });
}

function filterIncoming(filter) {
  FT_incomingFilter = filter;
  // Update tab buttons
  ['new', 'linked', 'all'].forEach(function(f) {
    var btn = document.getElementById('inc-tab-' + f);
    if (btn) {
      btn.className = f === filter ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    }
  });
  renderIncomingList();
}

/* Resolve best address for an incoming request:
   1) Try matching unit against FT_pdProperties (PropDesk Supabase)
   2) Try matching unit against FT_state.properties (TechTrack local)
   3) Fallback to whatever address was submitted with the request */
function resolveIncomingAddress(req) {
  if (req.unit) {
    var uKey = req.unit.replace(/^(apt|unit|suite|#)\s*/i, '').trim().toLowerCase();
    if (uKey && FT_pdProperties.length) {
      var pd = FT_pdProperties.find(function(p) { return p.apt && p.apt.toLowerCase() === uKey; });
      if (pd && pd.address) return [pd.address, pd.city].filter(Boolean).join(', ');
    }
    if (uKey && FT_state.properties.length) {
      var ft = FT_state.properties.find(function(p) {
        return (p.unit && p.unit.replace(/^(apt|unit|suite|#)\s*/i,'').trim().toLowerCase() === uKey)
            || (p.name && p.name.toLowerCase().indexOf(uKey) !== -1);
      });
      if (ft) return propFullAddr(ft);
    }
  }
  return req.address || '';
}

function renderIncomingList() {
  var el = document.getElementById('incoming-list');
  if (!el) return;

  var filtered = FT_incomingRequests;
  if (FT_incomingFilter === 'new') {
    filtered = filtered.filter(function(r) { return r.status === 'submitted' || r.status === 'open'; });
  } else if (FT_incomingFilter === 'linked') {
    filtered = filtered.filter(function(r) { return r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in-progress' || r.status === 'completed'; });
  }

  // Compute dashboard stats
  var newCount = FT_incomingRequests.filter(function(r) { return r.status === 'submitted' || r.status === 'open'; }).length;
  var linkedCount = FT_incomingRequests.filter(function(r) { return r.status !== 'submitted' && r.status !== 'open'; }).length;
  var pricedTotal = 0, noPriceCount = 0;
  FT_incomingRequests.forEach(function(r) {
    var amt = parseFloat(r.price_total);
    if (amt > 0) pricedTotal += amt; else noPriceCount++;
  });

  // Stats bar
  var stats = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:16px">'
    + _incStat(FT_incomingRequests.length, 'Total', 'var(--fg)')
    + _incStat(newCount, 'New', '#e11d48')
    + _incStat(linkedCount, 'Linked', '#2563eb')
    + _incStat('$' + pricedTotal.toFixed(0), 'Quoted', '#2563eb')
    + _incStat(noPriceCount, 'No Price', '#9ca3af')
    + '</div>';

  if (!filtered.length) {
    el.innerHTML = stats + '<div class="empty-FT_state"><span class="emoji">📭</span>No ' + FT_incomingFilter + ' requests.</div>';
    return;
  }

  el.innerHTML = stats + '<div style="display:flex;flex-direction:column;gap:8px">' + filtered.map(function(req) {
    var isNew = req.status === 'submitted' || req.status === 'open';
    var catIcons = { Plumbing:'🚰', Electrical:'⚡', 'HVAC / Heating':'🌡', Appliance:'🏠', 'Lock / Key':'🔑', 'Pest Control':'🐛', 'Water Damage':'💧', General:'🔧', Housekeeping:'🧹', 'Deep Cleaning':'🧹', Cleaning:'🧹' };
    var catIcon = catIcons[req.category] || '🔧';
    var dateStr = req.created_at ? new Date(req.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '';
    var urgBadge = req.urgency === 'urgent' ? ' <span style="background:#fef2f2;color:#dc2626;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.3px">Urgent</span>' : '';

    // Status chip
    var sColors = { submitted:'#be185d', open:'#be185d', assigned:'#1d4ed8', scheduled:'#166534', 'in-progress':'#92400e', completed:'#166534' };
    var sBgs    = { submitted:'#fdf2f8', open:'#fdf2f8', assigned:'#eff6ff', scheduled:'#f0fdf4', 'in-progress':'#fffbeb', completed:'#f0fdf4' };
    var sBrds   = { submitted:'#fbcfe8', open:'#fbcfe8', assigned:'#bfdbfe', scheduled:'#bbf7d0', 'in-progress':'#fde68a', completed:'#bbf7d0' };
    var st = req.status || 'submitted';
    var sStyle = 'background:' + (sBgs[st]||'#f3f4f6') + ';color:' + (sColors[st]||'#6b7280') + ';border:1px solid ' + (sBrds[st]||'#e5e7eb');

    // Payment badge — shows price amount (not paid status, that's in payment_requests)
    var priceAmt = parseFloat(req.price_total);
    var hasPrice = priceAmt > 0;
    var paidBadge = hasPrice
      ? '<span style="background:#eff6ff;color:#1d4ed8;font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;border:1px solid #bfdbfe">$' + priceAmt.toFixed(0) + '</span>'
      : '<span style="background:#f3f4f6;color:#9ca3af;font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;border:1px solid #e5e7eb">No price</span>';

    // Source badge
    var srcBadge = req.source === 'home_services'
      ? '<span style="background:#fefce8;color:#a16207;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid #fde68a">Home Services</span>'
      : (req.user_type === 'resident'
        ? '<span style="background:#eff6ff;color:#1d4ed8;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid #bfdbfe">Resident</span>'
        : '<span style="background:#f3f4f6;color:#6b7280;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid #e5e7eb">Guest</span>');

    // Resolve address with property lookup + fallback
    var displayAddr = resolveIncomingAddress(req);

    // --- Compact card ---
    return '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:14px 16px' + (isNew ? ';border-left:3px solid #e11d48' : '') + '">'
      // Header row
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">'
        + '<div style="flex:1;min-width:0">'
          + '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">'
            + '<span style="font-size:15px;font-weight:600;color:var(--fg)">' + catIcon + ' ' + FT_esc(req.name || '?') + '</span>'
            + urgBadge + paidBadge + srcBadge
          + '</div>'
          + '<div style="font-size:11px;color:var(--muted);margin-top:3px">'
            + FT_esc(req.phone || '') + (req.email ? ' · ' + FT_esc(req.email) : '') + ' · ' + dateStr
          + '</div>'
        + '</div>'
        + '<span style="' + sStyle + ';font-size:10px;font-weight:600;padding:3px 8px;border-radius:5px;white-space:nowrap;text-transform:uppercase;letter-spacing:.3px">' + FT_esc(st) + '</span>'
      + '</div>'
      // Location + schedule row
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">'
        + (req.unit ? '<span style="font-size:11px;color:var(--muted);background:var(--bg);padding:3px 8px;border-radius:5px;border:1px solid var(--border)">🏢 ' + FT_esc(req.unit) + (req.property ? ' · ' + FT_esc(req.property) : '') + '</span>' : '')
        + (displayAddr ? '<span style="font-size:11px;color:var(--muted);background:var(--bg);padding:3px 8px;border-radius:5px;border:1px solid var(--border)">📍 ' + FT_esc(displayAddr) + '</span>' : '')
        + (req.preferred_block ? '<span style="font-size:11px;color:var(--accent);background:rgba(196,127,0,.08);padding:3px 8px;border-radius:5px;border:1px solid rgba(196,127,0,.2)">📅 ' + FT_esc(req.preferred_block) + '</span>' : '')
      + '</div>'
      // Description (2-line clamp)
      + (req.description ? '<div style="font-size:12px;color:var(--muted);line-height:1.4;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + FT_esc(req.description) + '</div>' : '')
      // Photo thumbnail
      + (req.photo ? '<img src="' + req.photo + '" style="max-width:100px;border-radius:6px;margin-bottom:8px;display:block" alt="Photo" onerror="this.style.display=\'none\'">' : '')
      // Footer: mini badges + action
      + '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">'
        + '<div style="display:flex;gap:4px;flex-wrap:wrap">'
          + (req.permission_to_enter ? '<span style="font-size:10px;color:#166534;background:rgba(22,163,74,.06);padding:2px 6px;border-radius:3px">🚪 Entry OK</span>' : '')
          + (req.waiver_agreed ? '<span style="font-size:10px;color:#166534;background:rgba(22,163,74,.06);padding:2px 6px;border-radius:3px">✅ Waiver</span>' : '')
          + (req.sms_consent ? '<span style="font-size:10px;color:var(--accent);background:rgba(196,127,0,.06);padding:2px 6px;border-radius:3px">📱 SMS</span>' : '')
        + '</div>'
        + (isNew
          ? '<button class="btn btn-primary btn-sm" style="font-size:12px;padding:4px 12px" onclick="openIncomingLink(\'' + FT_esc(req.id) + '\')">🔗 Create WO</button>'
          : '<span style="font-size:11px;color:var(--muted)">' + (req.work_order_id ? 'WO# ' + FT_esc(String(req.work_order_id)) : '') + '</span>')
      + '</div>'
      + '</div>';
  }).join('') + '</div>';
}

/* Helper: stat card for dashboard */
function _incStat(val, label, color) {
  return '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;text-align:center">'
    + '<div style="font-size:22px;font-weight:700;color:' + color + '">' + val + '</div>'
    + '<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">' + label + '</div></div>';
}

function openIncomingLink(reqId) {
  var req = FT_incomingRequests.find(function(r) { return r.id === reqId; });
  if (!req) { alert('Request not found.'); return; }

  document.getElementById('il-req-id').value = reqId;

  // Resolve address for display
  var displayAddr = resolveIncomingAddress(req);
  var priceAmt = parseFloat(req.price_total);
  var paidLabel = priceAmt > 0
    ? '<span style="color:#1d4ed8;font-weight:600">$' + priceAmt.toFixed(2) + '</span>'
    : '<span style="color:#9ca3af;font-weight:600">No price set</span>';

  // Build summary as a clean data grid
  var sumRows = '';
  var _r = function(label, val) { return val ? '<div style="display:flex;gap:8px;margin-bottom:5px"><span style="font-size:11px;color:var(--muted);min-width:62px;text-align:right;flex-shrink:0">' + label + '</span><span style="font-size:13px;color:var(--fg)">' + val + '</span></div>' : ''; };

  sumRows += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
    + '<span style="font-size:15px;font-weight:700;color:var(--fg)">' + FT_esc(req.name || '?') + '</span>' + paidLabel + '</div>';
  sumRows += _r('Contact', FT_esc(req.phone || '') + (req.email ? ' · ' + FT_esc(req.email) : ''));
  sumRows += _r('Service', FT_esc(req.category || 'General'));
  if (req.unit) sumRows += _r('Unit', FT_esc(req.unit) + (req.property ? ' · ' + FT_esc(req.property) : ''));
  if (displayAddr) sumRows += _r('Address', FT_esc(displayAddr));
  if (req.preferred_block) sumRows += _r('Schedule', FT_esc(req.preferred_block));
  if (req.description) sumRows += _r('Notes', '<span style="font-size:12px;color:var(--muted)">' + FT_esc((req.description || '').substring(0, 100)) + '</span>');

  document.getElementById('il-req-summary').innerHTML = sumRows;

  // Populate units dropdown from PropDesk properties + auto-select matching unit
  var unitSel = document.getElementById('il-unit');
  unitSel.innerHTML = '<option value="">Select unit...</option>';
  var reqUnit = (req.unit || '').replace(/^(apt|unit|suite|#)\s*/i, '').trim().toLowerCase();
  if (FT_pdProperties && FT_pdProperties.length) {
    FT_pdProperties.forEach(function(u) {
      var opt = document.createElement('option');
      opt.value = u.apt || u.id;
      opt.textContent = (u.apt || 'Unit ?') + ' — ' + (u.name || u.address || '');
      // Auto-select: match by apt number or by name containing the unit string
      var uApt = (u.apt || '').replace(/^(apt|unit|suite|#)\s*/i, '').trim().toLowerCase();
      var uName = (u.name || '').toLowerCase();
      if (reqUnit && (uApt === reqUnit || uName.indexOf(reqUnit) !== -1 || reqUnit.indexOf(uApt) !== -1 || reqUnit.indexOf(uName) !== -1)) {
        opt.selected = true;
      }
      unitSel.appendChild(opt);
    });
  }

  // Pre-fill title with category + short description
  document.getElementById('il-title').value = (req.category || 'General') + ': ' + (req.description || '').substring(0, 60);
  document.getElementById('il-notes').value = req.description || '';

  // Pre-fill amount from booking price
  var amtField = document.getElementById('il-amount');
  if (amtField) {
    var bookingPrice = parseFloat(req.price_total);
    amtField.value = bookingPrice > 0 ? bookingPrice.toFixed(2) : '';
  }

  // Populate property search — try to auto-match from request data
  document.getElementById('il-prop-search').value = '';
  document.getElementById('il-prop-id').value = '';
  var selEl = document.getElementById('il-prop-selected'); if (selEl) selEl.style.display = 'none';

  // Auto-match property: try direct match first, then bridge via PropDesk address
  var autoMatch = null;
  if (req.unit && FT_state.properties.length) {
    var uKey = req.unit.replace(/^(apt|unit|suite|#)\s*/i, '').trim().toLowerCase();
    // 1) Direct match by pdApt, unit, or name
    autoMatch = FT_state.properties.find(function(p) {
      if (p.pdApt && p.pdApt.toLowerCase() === uKey) return true;
      if (p.unit && p.unit.replace(/^(apt|unit|suite|#)\s*/i,'').trim().toLowerCase() === uKey) return true;
      if (p.name && p.name.toLowerCase().indexOf(uKey) !== -1) return true;
      return false;
    });
    // 2) Bridge: look up unit in PropDesk properties to get address, then match TechTrack by address
    if (!autoMatch && FT_pdProperties && FT_pdProperties.length) {
      var pdMatch = FT_pdProperties.find(function(pd) {
        return pd.apt && pd.apt.toLowerCase() === uKey;
      });
      if (pdMatch && pdMatch.address) {
        var pdAddr = pdMatch.address.toLowerCase().replace(/[.,]/g, '').trim();
        autoMatch = FT_state.properties.find(function(p) {
          var ftAddr = (p.address || '').toLowerCase().replace(/[.,]/g, '').trim();
          return ftAddr && pdAddr && ftAddr.indexOf(pdAddr) !== -1 || pdAddr.indexOf(ftAddr) !== -1;
        });
      }
    }
  }
  if (autoMatch) {
    document.getElementById('il-prop-id').value = autoMatch.id;
    document.getElementById('il-prop-search').value = autoMatch.name || propFullAddr(autoMatch);
    if (selEl) { selEl.textContent = '✅ ' + (autoMatch.name || '') + ' — ' + propFullAddr(autoMatch); selEl.style.display = 'block'; }
  } else if (displayAddr) {
    document.getElementById('il-prop-search').value = displayAddr;
  }

  // Populate techs
  populateSelect(document.getElementById('il-tech'),
    FT_state.technicians.filter(function(t) { return t.status === 'active'; }),
    'id', function(t) { return t.name; }, 'Unassigned');

  FT_openModal('ft-modal-incoming-link');
}

function ilPropSearch() { buildPropAC('il-prop-search', 'il-ac-list', 'il-prop-id', 'il-prop-selected'); }

function saveIncomingLink() {
  var reqId = document.getElementById('il-req-id').value;
  var req = FT_incomingRequests.find(function(r) { return r.id === reqId; });
  if (!req) { alert('Request not found.'); return; }

  var propId = +document.getElementById('il-prop-id').value;
  var techId = +document.getElementById('il-tech').value || null;
  var title = (document.getElementById('il-title').value || '').trim();
  var notes = document.getElementById('il-notes').value || '';

  if (!propId) { alert('Select a property.'); return; }
  if (!title) { alert('Enter a job title.'); return; }

  // Create work order
  var job = {
    id: FT_uid(),
    woNum: FT_nextWO(),
    propId: propId,
    techId: techId,
    date: req.preferred_date || FT_today(),
    title: title,
    block: req.preferred_block || '',
    notes: notes,
    status: 'open',
    assignedByAdmin: true,
    clientName: req.name,
    clientPhone: req.phone || '',
    clientEmail: req.email || '',
    clientPreferredComm: req.preferred_comm || 'sms',
    hours: [], expenses: [], photos: [],
    sourceRequestId: reqId
  };

  FT_state.jobs.push(job);
  FT_save();

  // Update Supabase status + link back to work order
  if (typeof sb !== 'undefined') {
    sb.from('maintenance_requests')
      .update({ status: 'assigned', assigned_to: techId ? getTech(techId).name : 'Unassigned', work_order_id: job.woNum, updated_at: new Date().toISOString() })
      .eq('id', reqId)
      .then(function() { loadIncomingRequests(); });
  }

  // Create payment request if amount is set
  var chargeAmt = parseFloat((document.getElementById('il-amount') || {}).value);
  if (chargeAmt > 0 && typeof sb !== 'undefined') {
    var payId = 'pay_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    sb.from('payment_requests').insert([{
      id: payId,
      type: 'service',
      source_id: reqId,
      source_type: 'maintenance_request',
      work_order_id: String(job.woNum),
      client_name: req.name || '',
      client_email: req.email || '',
      client_phone: req.phone || '',
      unit: req.unit || '',
      property: req.property || '',
      description: title,
      amount: chargeAmt,
      status: 'pending',
      created_by: 'admin'
    }]).then(function(res) {
      if (res.error) console.error('Payment request error:', res.error);
    });
  }

  // Notify tech
  if (techId) {
    var tech = getTech(techId);
    var prop = getProp(propId);
    if (tech && tech.phone) sendSMS(tech.phone, 'WillowPA: New job ' + job.woNum + ' at ' + (prop ? prop.name : '') + (job.block ? ' | ' + job.block : '') + '. Login: tech.willowpa.com');
  }

  // Notify client
  if (req.phone || req.email) {
    var _tmpJob = { clientPhone: req.phone, clientEmail: req.email, clientPreferredComm: req.preferred_comm || 'sms' };
    var payNote = chargeAmt > 0 ? ' A payment request of $' + chargeAmt.toFixed(2) + ' has been added to your Payments tab.' : '';
    FT_notify(_tmpJob, 'WillowPA Maintenance: Your service request has been received and a work order (' + job.woNum + ') has been created.' + (job.block ? ' Scheduled: ' + job.block : ' We will contact you to confirm.') + payNote, { subject: 'Work Order Created — WillowPA' });
  }

  FT_closeModal('ft-modal-incoming-link');
  var msg = techId ? job.woNum + ' assigned to ' + getTech(techId).name + '!' : job.woNum + ' created (unassigned).';
  if (chargeAmt > 0) msg += ' Payment request: $' + chargeAmt.toFixed(2);
  alert('[OK] ' + msg);
}

// ═══════════════════════════════════════════════════
//  HELPER: Is a job completed and paid (or $0 balance)?
// ═══════════════════════════════════════════════════
function isCompletedPaidJob(j) {
  if (!j) return false;
  if (j.status !== 'complete' && j.status !== 'closed') return false;
  // Check if balance is zero or paid
  var totalCost = jobTotalLabor(j) + jobTotalExp(j);
  var paid = +j.amountPaid || 0;
  return (totalCost <= 0 || paid >= totalCost || j.status === 'closed');
}

// ═══════════════════════════════════════════════════
//  COMPLETED JOBS — history tab
// ═══════════════════════════════════════════════════
function renderCompletedJobs() {
  var el = document.getElementById('completed-jobs-list');
  if (!el) return;
  var searchTerm = (document.getElementById('completed-search') || {}).value || '';
  var completed = FT_state.jobs.filter(function(j) {
    return j.status === 'complete' || j.status === 'closed';
  }).sort(function(a, b) { return b.date.localeCompare(a.date); });
  if (searchTerm) {
    completed = completed.filter(function(j) { return jobMatchesSearch(j, searchTerm); });
  }
  if (!completed.length) {
    el.innerHTML = '<div class="empty-FT_state" style="padding:40px 20px"><span class="emoji">&#x2705;</span>No completed jobs yet.</div>';
    return;
  }
  el.innerHTML = completed.map(function(j) {
    var prop = getProp(j.propId);
    var tech = getTech(j.techId);
    var total = jobTotalLabor(j) + jobTotalExp(j);
    var paid = +j.amountPaid || 0;
    var balClass = paid >= total ? 'tag-complete' : 'tag-open';
    var balLabel = paid >= total ? 'Paid' : 'Balance: ' + fmt$(total - paid);
    return '<div style="display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border);gap:8px;flex-wrap:wrap;cursor:pointer" onclick="FT_goToJob(' + j.id + ')">'
      + '<span style="font-family:var(--fm);font-size:11px;color:var(--accent2);width:70px;flex-shrink:0;font-weight:700">' + (j.woNum || '') + '</span>'
      + '<span style="font-family:var(--fm);font-size:11px;color:var(--muted);width:80px;flex-shrink:0">' + j.date + '</span>'
      + (j.title ? '<span style="flex:1;font-size:13px;font-weight:600;color:var(--accent)">' + FT_esc(j.title) + '</span>' : '<span style="flex:1;font-size:13px">' + (prop ? FT_esc(prop.name) : '') + '</span>')
      + '<span style="font-size:12px;color:var(--muted)">' + (tech ? FT_esc(tech.name) : '') + '</span>'
      + '<span style="font-size:11px;font-weight:600;color:var(--text2)">' + fmt$(total) + '</span>'
      + '<span class="tag ' + balClass + '" style="font-size:10px">' + balLabel + '</span>'
      + '<span class="tag ' + (j.status === 'closed' ? 'tag-closed' : 'tag-complete') + '" style="font-size:10px">' + (j.status === 'closed' ? 'Closed' : 'Done') + '</span>'
      + '</div>';
  }).join('');
}

