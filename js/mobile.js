/* ═══════════════════════════════════════════════════════════════
   WILLOW PROPDESK — MOBILE UI LAYER
   Lightweight operational mobile interface.
   Reads from existing globals: data, pipelineState, FT_state,
   INNAGO_TENANTS, INNAGO_LEASES, sb (Supabase client)
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Detection & Init ── */
var MOB = window.WILLOW_MOBILE = {};
var currentPage = 'home';
var msgFilter = 'all';

function isMobile(){ return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent); }

MOB.init = function(){
  if(!isMobile()) return;
  document.body.classList.add('mob-active');
  // hide desktop UI
  document.querySelectorAll('.header,.module-bar,.main-wrap,.sub-tab-bar').forEach(function(el){ el.style.display='none'; });
  // show mobile shell
  var shell = document.getElementById('mobApp');
  if(shell) shell.style.display='flex';
  MOB.navigate('home');
};

/* ── Navigation ── */
MOB.navigate = function(page){
  currentPage = page;
  // hide all pages
  document.querySelectorAll('.mob-page').forEach(function(p){ p.style.display='none'; });
  // deactivate nav
  document.querySelectorAll('.mob-nav-btn').forEach(function(b){ b.classList.remove('active'); });
  var target = document.getElementById('mob-'+page);
  if(target) target.style.display='block';
  var nav = document.querySelector('.mob-nav-btn[data-page="'+page+'"]');
  if(nav) nav.classList.add('active');
  // render content
  switch(page){
    case 'home': renderHome(); break;
    case 'messages': renderMessages(); break;
    case 'calendar': renderCalendar(); break;
    case 'menu': renderMenu(); break;
    case 'pipeline': renderPipeline(); break;
    case 'units': renderUnits(); break;
    case 'tasks': renderTasks(); break;
  }
  // scroll to top
  var content = document.getElementById('mob-content');
  if(content) content.scrollTop = 0;
};

/* ── Helpers ── */
function pn(note, field){
  if(!note) return '';
  var parts = note.split('|');
  for(var i=0;i<parts.length;i++){
    var p = parts[i].trim();
    if(p.toLowerCase().indexOf(field.toLowerCase()+':') === 0){
      return p.substring(p.indexOf(':')+1).trim();
    }
  }
  return '';
}
function timeAgo(d){
  if(!d) return '';
  var diff = Date.now() - new Date(d).getTime();
  var m = Math.floor(diff/60000);
  if(m < 1) return 'now';
  if(m < 60) return m+'m ago';
  var h = Math.floor(m/60);
  if(h < 24) return h+'h ago';
  var days = Math.floor(h/24);
  if(days < 7) return days+'d ago';
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}
function fmt$(v){ return '$'+Number(v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0}); }
function fmtDate(d){ if(!d) return '—'; return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'}); }
function srcBadge(type){
  var map = {
    'short-stay': {label:'Short Term', cls:'mob-src-st'},
    'short-term': {label:'Short Term', cls:'mob-src-st'},
    'long-term':  {label:'Long Term',  cls:'mob-src-lt'},
    'month-to-month': {label:'MTM', cls:'mob-src-mtm'},
    'fieldtrack': {label:'Tech', cls:'mob-src-ft'},
    'parking':    {label:'Parking', cls:'mob-src-pk'},
    'delivery':   {label:'Mailroom', cls:'mob-src-dl'},
    'available':  {label:'Vacant', cls:'mob-src-vac'}
  };
  var m = map[type] || {label:type||'Other', cls:'mob-src-ot'};
  return '<span class="mob-src '+m.cls+'">'+m.label+'</span>';
}
function stayContext(r){
  var now = new Date(); now.setHours(0,0,0,0);
  var cin = r.checkin ? new Date(r.checkin) : null;
  var cout = r.lease_end ? new Date(r.lease_end) : null;
  if(cin) cin.setHours(0,0,0,0);
  if(cout) cout.setHours(0,0,0,0);
  if(!cin) return '';
  var d3 = new Date(now); d3.setDate(d3.getDate()+3);
  if(cin.getTime() === now.getTime()) return '<span class="mob-ctx mob-ctx-cin">Check-in today</span>';
  if(cout && cout.getTime() === now.getTime()) return '<span class="mob-ctx mob-ctx-cout">Check-out today</span>';
  if(cin > now) return '<span class="mob-ctx mob-ctx-upcoming">Upcoming '+fmtDate(r.checkin)+'</span>';
  if(cout && cout <= d3 && cout > now) return '<span class="mob-ctx mob-ctx-cout">Checkout '+fmtDate(r.lease_end)+'</span>';
  if(cin <= now && (!cout || cout > now)) return '<span class="mob-ctx mob-ctx-instay">In-stay</span>';
  return '';
}

/* ── Get all data unified ── */
function getAllRecords(){
  var records = [];
  // Main data (units table)
  var d = window.data || window.DATA || [];
  if(typeof d === 'function') d = [];
  d.forEach(function(r){
    if(r.archived || r.type==='available' || !r.name) return;
    records.push({
      id: r.id, name: r.name, apt: r.apt, owner: r.owner,
      type: r.type, rent: r.rent, balance: r.balance,
      due: r.due, checkin: r.checkin, lease_end: r.lease_end,
      note: r.note, email: pn(r.note,'Email'), phone: pn(r.note,'Tel'),
      via: pn(r.note,'Via'), source: r.type, raw: r
    });
  });
  return records;
}
function getPipelineBookings(){
  if(typeof window.pipelineState !== 'undefined' && window.pipelineState && window.pipelineState.bookings){
    return window.pipelineState.bookings;
  }
  return [];
}
function getFTJobs(){
  if(typeof FT_state !== 'undefined' && FT_state && FT_state.jobs){
    return FT_state.jobs;
  }
  return [];
}

/* ══════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════ */
function renderHome(){
  var el = document.getElementById('mob-home-content');
  if(!el) return;
  var records = getAllRecords();
  var bookings = getPipelineBookings();
  var jobs = getFTJobs();
  var now = new Date(); now.setHours(0,0,0,0);
  var tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate()+1);

  // arrivals today
  var arrivals = records.filter(function(r){
    var ci = r.checkin ? new Date(r.checkin) : null;
    if(ci){ ci.setHours(0,0,0,0); return ci.getTime()===now.getTime(); }
    return false;
  });
  // departures today
  var departures = records.filter(function(r){
    var co = r.lease_end ? new Date(r.lease_end) : null;
    if(co){ co.setHours(0,0,0,0); return co.getTime()===now.getTime(); }
    return false;
  });
  // pipeline pending (inquiry/pending stages)
  var pendingPL = bookings.filter(function(b){ return b.stage==='inquiry'||b.stage==='pending'; });
  // open work orders
  var openWOs = jobs.filter(function(j){ return j.status && j.status!=='complete' && j.status!=='closed' && j.status!=='cancelled'; });
  // balances due
  var balDue = records.filter(function(r){ return r.balance > 0; });
  // upcoming (next 7 days)
  var d7 = new Date(now); d7.setDate(d7.getDate()+7);
  var upcoming = records.filter(function(r){
    var ci = r.checkin ? new Date(r.checkin) : null;
    if(ci){ ci.setHours(0,0,0,0); return ci > now && ci <= d7; }
    return false;
  }).sort(function(a,b){ return new Date(a.checkin)-new Date(b.checkin); });

  var html = '';

  // Quick stats row
  html += '<div class="mob-stats">';
  html += '<div class="mob-stat mob-stat-blue" onclick="WILLOW_MOBILE.navigate(\'calendar\')"><div class="mob-stat-num">'+arrivals.length+'</div><div class="mob-stat-lbl">Arrivals</div></div>';
  html += '<div class="mob-stat mob-stat-orange" onclick="WILLOW_MOBILE.navigate(\'calendar\')"><div class="mob-stat-num">'+departures.length+'</div><div class="mob-stat-lbl">Departures</div></div>';
  html += '<div class="mob-stat mob-stat-purple" onclick="WILLOW_MOBILE.navigate(\'pipeline\')"><div class="mob-stat-num">'+pendingPL.length+'</div><div class="mob-stat-lbl">Pipeline</div></div>';
  html += '<div class="mob-stat mob-stat-red" onclick="WILLOW_MOBILE.navigate(\'tasks\')"><div class="mob-stat-num">'+openWOs.length+'</div><div class="mob-stat-lbl">Work Orders</div></div>';
  html += '</div>';

  // Today section
  if(arrivals.length || departures.length){
    html += '<div class="mob-section">';
    html += '<div class="mob-sec-hdr">Today</div>';
    arrivals.forEach(function(r){
      html += mobRecordRow(r, 'Check-in', 'mob-tag-cin');
    });
    departures.forEach(function(r){
      html += mobRecordRow(r, 'Check-out', 'mob-tag-cout');
    });
    html += '</div>';
  }

  // Balances due
  if(balDue.length){
    html += '<div class="mob-section">';
    html += '<div class="mob-sec-hdr">Balances Due <span class="mob-sec-count">'+balDue.length+'</span></div>';
    balDue.slice(0,5).forEach(function(r){
      html += mobRecordRow(r, fmt$(r.balance)+' due', 'mob-tag-bal');
    });
    html += '</div>';
  }

  // Upcoming arrivals
  if(upcoming.length){
    html += '<div class="mob-section">';
    html += '<div class="mob-sec-hdr">Upcoming Arrivals</div>';
    upcoming.slice(0,5).forEach(function(r){
      html += mobRecordRow(r, 'Arrives '+fmtDate(r.checkin), 'mob-tag-upcoming');
    });
    html += '</div>';
  }

  // Recent pipeline
  if(pendingPL.length){
    html += '<div class="mob-section">';
    html += '<div class="mob-sec-hdr">Pipeline Activity</div>';
    pendingPL.slice(0,4).forEach(function(b){
      html += '<div class="mob-row" onclick="WILLOW_MOBILE.openBookingDetail(\''+b.id+'\')">';
      html += '<div class="mob-row-main"><div class="mob-row-name">'+(b.guest_name||b.name||'Guest')+'</div>';
      html += '<div class="mob-row-sub">'+(b.unit_apt||b.unit_name||'')+(b.stage?' · '+b.stage:'')+'</div></div>';
      html += '<div class="mob-row-right">'+srcBadge('short-stay')+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}

function mobRecordRow(r, tag, tagCls){
  var h = '<div class="mob-row" onclick="WILLOW_MOBILE.openRecord('+r.id+')">';
  h += '<div class="mob-row-main">';
  h += '<div class="mob-row-name">'+r.name+'</div>';
  h += '<div class="mob-row-sub">'+r.apt+(r.via?' · via '+r.via:'')+'</div>';
  h += '</div>';
  h += '<div class="mob-row-right">';
  if(tag) h += '<span class="mob-tag '+tagCls+'">'+tag+'</span>';
  h += srcBadge(r.type);
  h += '</div>';
  h += '</div>';
  return h;
}

/* ══════════════════════════════════════════════════════
   MESSAGES — Centralized Inbox
   ══════════════════════════════════════════════════════ */
function buildMessageList(){
  var msgs = [];
  var records = getAllRecords();
  var bookings = getPipelineBookings();
  var jobs = getFTJobs();
  var now = new Date();

  // Short-term bookings messages (from pipeline bookings with notes)
  bookings.forEach(function(b){
    if(!b.guest_name && !b.name) return;
    var name = b.guest_name || b.name || 'Guest';
    var unit = b.unit_apt || b.unit_name || '';
    // simulate recent message from booking activity
    var lastActivity = b.updated_at || b.created_at || b.check_in;
    var preview = '';
    if(b.stage === 'inquiry') preview = 'New inquiry for '+unit;
    else if(b.stage === 'confirmed') preview = 'Booking confirmed';
    else if(b.stage === 'checked_in' || b.stage === 'in_stay') preview = 'Currently in-stay';
    else if(b.stage === 'pre_arrival') preview = 'Pre-arrival preparations';
    else preview = (b.stage||'booking')+' update';
    msgs.push({
      id: 'bk-'+b.id, name: name, unit: unit, source: 'short-stay',
      preview: preview, time: lastActivity,
      phone: b.phone||'', email: b.email||'',
      bookingId: b.id, context: b.stage||'',
      cin: b.check_in, cout: b.check_out
    });
  });

  // Long-term / MTM tenant messages
  records.forEach(function(r){
    if(r.type === 'short-stay') return; // already covered by bookings
    var lastNote = '';
    if(r.raw && r.raw.history && r.raw.history.length){
      var last = r.raw.history[r.raw.history.length-1];
      lastNote = last.text || '';
    }
    msgs.push({
      id: 'lt-'+r.id, name: r.name, unit: r.apt, source: r.type,
      preview: lastNote || 'Tenant in '+r.apt,
      time: r.due || r.checkin || '',
      phone: r.phone, email: r.email,
      context: r.balance > 0 ? 'Balance: '+fmt$(r.balance) : (r.lease_end ? 'Lease ends '+fmtDate(r.lease_end) : 'Active'),
      cin: r.checkin, cout: r.lease_end
    });
  });

  // FieldTrack jobs as messages
  jobs.forEach(function(j){
    if(!j.description && !j.title) return;
    var techName = '';
    if(j.techId && typeof FT_state !== 'undefined' && FT_state.technicians){
      var tech = FT_state.technicians.find(function(t){ return t.id === +j.techId; });
      if(tech) techName = tech.name;
    }
    msgs.push({
      id: 'ft-'+j.id, name: (j.requestedBy||techName||'Tech Service'),
      unit: j.unit||j.property||'', source: 'fieldtrack',
      preview: (j.title||j.description||'Work order').substring(0,60),
      time: j.date || j.created || '',
      context: (j.status||'open')+(j.priority==='urgent'?' · URGENT':''),
      phone: '', email: ''
    });
  });

  // Sort by time descending
  msgs.sort(function(a,b){
    var ta = a.time ? new Date(a.time).getTime() : 0;
    var tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });
  return msgs;
}

function renderMessages(){
  var el = document.getElementById('mob-messages-content');
  if(!el) return;
  var msgs = buildMessageList();

  // Filter tabs
  var html = '<div class="mob-filter-bar">';
  ['all','short-stay','long-term','month-to-month','fieldtrack'].forEach(function(f){
    var label = f==='all'?'All':f==='short-stay'?'ST':f==='long-term'?'LT':f==='month-to-month'?'MTM':f==='fieldtrack'?'Tech':'Other';
    html += '<button class="mob-filter-btn'+(msgFilter===f?' active':'')+'" onclick="WILLOW_MOBILE.filterMsg(\''+f+'\')">'+label+'</button>';
  });
  html += '</div>';

  // Filter
  var filtered = msgFilter === 'all' ? msgs : msgs.filter(function(m){ return m.source === msgFilter; });

  if(!filtered.length){
    html += '<div class="mob-empty">No messages</div>';
  } else {
    filtered.forEach(function(m){
      html += '<div class="mob-msg-row" onclick="WILLOW_MOBILE.openThread(\''+m.id+'\')">';
      html += '<div class="mob-msg-avatar">'+(m.name?m.name.charAt(0).toUpperCase():'?')+'</div>';
      html += '<div class="mob-msg-body">';
      html += '<div class="mob-msg-top"><span class="mob-msg-name">'+m.name+'</span><span class="mob-msg-time">'+timeAgo(m.time)+'</span></div>';
      html += '<div class="mob-msg-unit">'+m.unit+(m.context?' · '+m.context:'')+'</div>';
      html += '<div class="mob-msg-preview">'+m.preview+'</div>';
      html += '</div>';
      html += '<div class="mob-msg-src">'+srcBadge(m.source)+'</div>';
      html += '</div>';
    });
  }
  el.innerHTML = html;
}
MOB.filterMsg = function(f){ msgFilter = f; renderMessages(); };

/* ── Thread detail ── */
MOB.openThread = function(msgId){
  var msgs = buildMessageList();
  var m = msgs.find(function(x){ return x.id === msgId; });
  if(!m) return;
  var el = document.getElementById('mob-thread');
  if(!el) return;

  // hide current page, show thread
  document.querySelectorAll('.mob-page').forEach(function(p){ p.style.display='none'; });
  el.style.display = 'block';

  var html = '<div class="mob-thread-header">';
  html += '<button class="mob-back" onclick="WILLOW_MOBILE.navigate(\'messages\')">← Back</button>';
  html += '<span class="mob-thread-title">'+m.name+'</span>';
  html += '</div>';

  // Client summary card
  html += '<div class="mob-client-card">';
  html += '<div class="mob-cc-row"><span class="mob-cc-label">Unit</span><span>'+m.unit+'</span></div>';
  html += '<div class="mob-cc-row"><span class="mob-cc-label">Source</span>'+srcBadge(m.source)+'</div>';
  if(m.cin) html += '<div class="mob-cc-row"><span class="mob-cc-label">Check-in</span><span>'+fmtDate(m.cin)+'</span></div>';
  if(m.cout) html += '<div class="mob-cc-row"><span class="mob-cc-label">Check-out</span><span>'+fmtDate(m.cout)+'</span></div>';
  if(m.context) html += '<div class="mob-cc-row"><span class="mob-cc-label">Status</span><span>'+m.context+'</span></div>';
  html += '<div class="mob-cc-actions">';
  if(m.phone) html += '<a class="mob-action-btn" href="tel:'+m.phone.replace(/[^+0-9]/g,'')+'">📞 Call</a>';
  if(m.email) html += '<a class="mob-action-btn" href="mailto:'+m.email+'">✉ Email</a>';
  html += '<button class="mob-action-btn" onclick="WILLOW_MOBILE.quickReply(\''+msgId+'\')">💬 Reply</button>';
  if(m.bookingId) html += '<button class="mob-action-btn" onclick="WILLOW_MOBILE.openBookingDetail(\''+m.bookingId+'\')">📋 Booking</button>';
  html += '</div>';
  html += '</div>';

  // Message area (placeholder for real messages)
  html += '<div class="mob-thread-msgs">';
  html += '<div class="mob-thread-bubble mob-bubble-them"><div class="mob-bubble-text">'+m.preview+'</div><div class="mob-bubble-time">'+timeAgo(m.time)+'</div></div>';
  html += '</div>';

  // Reply box
  html += '<div class="mob-reply-box">';
  html += '<textarea id="mobReplyText" class="mob-reply-input" placeholder="Type a message..." rows="2"></textarea>';
  html += '<div class="mob-reply-actions">';
  html += '<select id="mobReplyChannel" class="mob-reply-channel"><option value="sms">SMS</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select>';
  html += '<button class="mob-reply-send" onclick="WILLOW_MOBILE.sendReply(\''+msgId+'\')">Send →</button>';
  html += '</div></div>';

  el.innerHTML = html;
};

MOB.quickReply = function(msgId){
  var ta = document.getElementById('mobReplyText');
  if(ta) ta.focus();
};

MOB.sendReply = function(msgId){
  var text = document.getElementById('mobReplyText');
  var ch = document.getElementById('mobReplyChannel');
  if(!text || !text.value.trim()) return;
  var channel = ch ? ch.value : 'sms';
  // Add bubble to thread
  var container = document.querySelector('.mob-thread-msgs');
  if(container){
    var bubble = document.createElement('div');
    bubble.className = 'mob-thread-bubble mob-bubble-me';
    bubble.innerHTML = '<div class="mob-bubble-text">'+text.value+'</div><div class="mob-bubble-time">Just now · via '+channel+'</div>';
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }
  text.value = '';
  // TODO: send via Supabase/API
};

/* ══════════════════════════════════════════════════════
   CALENDAR — Agenda View
   ══════════════════════════════════════════════════════ */
function renderCalendar(){
  var el = document.getElementById('mob-calendar-content');
  if(!el) return;
  var records = getAllRecords();
  var now = new Date(); now.setHours(0,0,0,0);

  // Build agenda for next 14 days
  var days = [];
  for(var i=0; i<14; i++){
    var d = new Date(now); d.setDate(d.getDate()+i);
    days.push({date: new Date(d), items: []});
  }

  records.forEach(function(r){
    var cin = r.checkin ? new Date(r.checkin) : null;
    var cout = r.lease_end ? new Date(r.lease_end) : null;
    if(cin) cin.setHours(0,0,0,0);
    if(cout) cout.setHours(0,0,0,0);
    days.forEach(function(day){
      var dt = day.date.getTime();
      if(cin && cin.getTime() === dt){
        day.items.push({record:r, event:'check-in', cls:'mob-ev-cin'});
      }
      if(cout && cout.getTime() === dt){
        day.items.push({record:r, event:'check-out', cls:'mob-ev-cout'});
      }
      // in-stay indicator (only for first day found within range)
      if(cin && cout && cin < day.date && cout > day.date && i === 0){
        // skip in-stay for agenda brevity
      }
    });
  });

  var html = '<div class="mob-agenda-hdr">Next 14 Days</div>';

  days.forEach(function(day){
    var isToday = day.date.getTime() === now.getTime();
    var dayLabel = isToday ? 'Today' : day.date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    if(day.items.length === 0 && !isToday) return; // skip empty non-today days

    html += '<div class="mob-agenda-day'+(isToday?' mob-agenda-today':'')+'">';
    html += '<div class="mob-agenda-date">'+dayLabel+'</div>';
    if(day.items.length === 0){
      html += '<div class="mob-agenda-empty">No events</div>';
    }
    day.items.forEach(function(item){
      var r = item.record;
      html += '<div class="mob-agenda-item" onclick="WILLOW_MOBILE.openRecord('+r.id+')">';
      html += '<div class="mob-agenda-ev '+item.cls+'">'+item.event+'</div>';
      html += '<div class="mob-agenda-detail">';
      html += '<div class="mob-row-name">'+r.name+'</div>';
      html += '<div class="mob-row-sub">'+r.apt+(r.via?' · '+r.via:'')+'</div>';
      html += '</div>';
      html += '<div class="mob-row-right">'+srcBadge(r.type)+'</div>';
      html += '</div>';
    });
    html += '</div>';
  });

  // Also show all active stays
  var active = records.filter(function(r){
    var cin = r.checkin ? new Date(r.checkin) : null;
    var cout = r.lease_end ? new Date(r.lease_end) : null;
    if(cin) cin.setHours(0,0,0,0);
    if(cout) cout.setHours(0,0,0,0);
    return cin && cin <= now && (!cout || cout >= now);
  });

  if(active.length){
    html += '<div class="mob-section" style="margin-top:16px">';
    html += '<div class="mob-sec-hdr">Currently In-Stay <span class="mob-sec-count">'+active.length+'</span></div>';
    active.forEach(function(r){
      var daysLeft = r.lease_end ? Math.ceil((new Date(r.lease_end)-now)/86400000) : '∞';
      html += '<div class="mob-row" onclick="WILLOW_MOBILE.openRecord('+r.id+')">';
      html += '<div class="mob-row-apt">'+r.apt+'</div>';
      html += '<div class="mob-row-main"><div class="mob-row-name">'+r.name+'</div>';
      html += '<div class="mob-row-sub">'+(r.lease_end?daysLeft+' days left':'Ongoing')+'</div></div>';
      html += '<div class="mob-row-right">'+srcBadge(r.type)+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}

/* ══════════════════════════════════════════════════════
   PIPELINE — Stage-filtered list
   ══════════════════════════════════════════════════════ */
var plFilter = 'all';
function renderPipeline(){
  var el = document.getElementById('mob-pipeline-content');
  if(!el) return;
  var bookings = getPipelineBookings();

  var stages = ['all','inquiry','pending','confirmed','pre_arrival','checked_in','checked_out'];
  var html = '<div class="mob-filter-bar">';
  stages.forEach(function(s){
    var label = s==='all'?'All':s==='pre_arrival'?'Pre-Arr':s==='checked_in'?'In-Stay':s==='checked_out'?'Done':s.charAt(0).toUpperCase()+s.slice(1);
    html += '<button class="mob-filter-btn'+(plFilter===s?' active':'')+'" onclick="WILLOW_MOBILE.filterPL(\''+s+'\')">'+label+'</button>';
  });
  html += '</div>';

  var filtered = plFilter==='all' ? bookings : bookings.filter(function(b){ return b.stage===plFilter; });

  if(!filtered.length){
    html += '<div class="mob-empty">No pipeline items</div>';
  } else {
    filtered.forEach(function(b){
      html += '<div class="mob-row" onclick="WILLOW_MOBILE.openBookingDetail(\''+b.id+'\')">';
      html += '<div class="mob-row-main">';
      html += '<div class="mob-row-name">'+(b.guest_name||b.name||'Guest')+'</div>';
      html += '<div class="mob-row-sub">'+(b.unit_apt||b.unit_name||'')+(b.check_in?' · '+fmtDate(b.check_in)+' → '+fmtDate(b.check_out):'')+'</div>';
      html += '</div>';
      html += '<div class="mob-row-right">';
      html += '<span class="mob-stage mob-stage-'+(b.stage||'').replace(/_/g,'-')+'">'+(b.stage||'').replace(/_/g,' ')+'</span>';
      if(b.total_price) html += '<div class="mob-row-price">'+fmt$(b.total_price)+'</div>';
      html += '</div>';
      html += '</div>';
    });
  }
  el.innerHTML = html;
}
MOB.filterPL = function(s){ plFilter = s; renderPipeline(); };

/* ══════════════════════════════════════════════════════
   UNITS — Property list
   ══════════════════════════════════════════════════════ */
function renderUnits(){
  var el = document.getElementById('mob-units-content');
  if(!el) return;
  var records = getAllRecords();
  var allData = window.data || window.DATA || [];
  if(typeof allData === 'function') allData = [];

  var html = '<input class="mob-search" placeholder="Search units..." oninput="WILLOW_MOBILE.searchUnits(this.value)">';
  html += '<div id="mob-units-list">';
  allData.forEach(function(r){
    if(r.archived) return;
    var status = r.type === 'available' ? 'Vacant' : (r.name||'Occupied');
    var statusCls = r.type === 'available' ? 'mob-unit-vacant' : 'mob-unit-occ';
    html += '<div class="mob-row" onclick="WILLOW_MOBILE.openRecord('+r.id+')">';
    html += '<div class="mob-row-apt">'+r.apt+'</div>';
    html += '<div class="mob-row-main"><div class="mob-row-name">'+(r.name||'Vacant')+'</div>';
    html += '<div class="mob-row-sub">'+(r.owner||'')+'</div></div>';
    html += '<div class="mob-row-right"><span class="mob-unit-badge '+statusCls+'">'+(r.type==='available'?'Vacant':'Active')+'</span></div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}
MOB.searchUnits = function(q){
  q = q.toLowerCase();
  var list = document.getElementById('mob-units-list');
  if(!list) return;
  var rows = list.querySelectorAll('.mob-row');
  rows.forEach(function(row){
    row.style.display = row.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none';
  });
};

/* ══════════════════════════════════════════════════════
   TASKS — Work Orders
   ══════════════════════════════════════════════════════ */
function renderTasks(){
  var el = document.getElementById('mob-tasks-content');
  if(!el) return;
  var jobs = getFTJobs();
  var open = jobs.filter(function(j){ return j.status && j.status!=='complete' && j.status!=='closed' && j.status!=='cancelled'; });
  open.sort(function(a,b){ return (b.priority==='urgent'?1:0) - (a.priority==='urgent'?1:0); });

  var html = '<div class="mob-sec-hdr">Open Work Orders <span class="mob-sec-count">'+open.length+'</span></div>';
  if(!open.length){
    html += '<div class="mob-empty">No open work orders</div>';
  }
  open.forEach(function(j){
    var urgent = j.priority==='urgent';
    html += '<div class="mob-row'+(urgent?' mob-row-urgent':'')+'">';
    html += '<div class="mob-row-main"><div class="mob-row-name">'+(j.woNum||'WO')+ ' — '+(j.title||j.description||'').substring(0,40)+'</div>';
    html += '<div class="mob-row-sub">'+(j.unit||j.property||'')+(j.status?' · '+j.status:'')+'</div></div>';
    html += '<div class="mob-row-right">'+srcBadge('fieldtrack')+'</div>';
    html += '</div>';
  });
  el.innerHTML = html;
}

/* ══════════════════════════════════════════════════════
   MENU
   ══════════════════════════════════════════════════════ */
function renderMenu(){
  var el = document.getElementById('mob-menu-content');
  if(!el) return;
  el.innerHTML = '<div class="mob-menu-list">'
    +'<div class="mob-menu-item" onclick="WILLOW_MOBILE.navigate(\'pipeline\')"><span class="mob-mi-icon">📊</span> Pipeline</div>'
    +'<div class="mob-menu-item" onclick="WILLOW_MOBILE.navigate(\'units\')"><span class="mob-mi-icon">🏠</span> Units & Properties</div>'
    +'<div class="mob-menu-item" onclick="WILLOW_MOBILE.navigate(\'tasks\')"><span class="mob-mi-icon">🔧</span> Work Orders</div>'
    +'<div class="mob-menu-item" onclick="WILLOW_MOBILE.navigate(\'calendar\')"><span class="mob-mi-icon">📅</span> Calendar</div>'
    +'<div class="mob-menu-divider"></div>'
    +'<div class="mob-menu-item" onclick="WILLOW_MOBILE.switchDesktop()"><span class="mob-mi-icon">🖥</span> Switch to Desktop View</div>'
    +'<div class="mob-menu-item" onclick="authLogout()"><span class="mob-mi-icon">🚪</span> Logout</div>'
    +'<div class="mob-menu-ver">Willow PropDesk · Mobile v1.0</div>'
    +'</div>';
}

/* ── Record detail (bottom sheet) ── */
MOB.openRecord = function(id){
  var d = window.data || window.DATA || [];
  if(typeof d === 'function') d = [];
  var r = d.find(function(x){ return x.id === id; });
  if(!r) return;
  var sheet = document.getElementById('mob-sheet');
  if(!sheet) return;
  sheet.style.display = 'flex';

  var phone = pn(r.note,'Tel');
  var email = pn(r.note,'Email');
  var via = pn(r.note,'Via');

  var html = '<div class="mob-sheet-handle" onclick="WILLOW_MOBILE.closeSheet()"></div>';
  html += '<div class="mob-sheet-content">';
  html += '<div class="mob-sheet-name">'+( r.name||'Vacant')+'</div>';
  html += '<div class="mob-sheet-unit">Unit '+r.apt+' · '+(r.owner||'')+'</div>';
  html += srcBadge(r.type);
  html += stayContext(r);
  html += '<div class="mob-sheet-grid">';
  if(r.rent) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Rent</span><span>'+fmt$(r.rent)+'</span></div>';
  if(r.balance) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Balance</span><span class="mob-bal-red">'+fmt$(r.balance)+'</span></div>';
  if(r.checkin) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Check-in</span><span>'+fmtDate(r.checkin)+'</span></div>';
  if(r.lease_end) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Lease/Check-out</span><span>'+fmtDate(r.lease_end)+'</span></div>';
  if(via) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Via</span><span>'+via+'</span></div>';
  if(r.due) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Due</span><span>'+fmtDate(r.due)+'</span></div>';
  html += '</div>';

  // Actions
  html += '<div class="mob-sheet-actions">';
  if(phone) html += '<a class="mob-action-btn" href="tel:'+phone.replace(/[^+0-9]/g,'')+'">📞 Call</a>';
  if(email) html += '<a class="mob-action-btn" href="mailto:'+email+'">✉ Email</a>';
  html += '<button class="mob-action-btn" onclick="WILLOW_MOBILE.msgFromSheet('+id+')">💬 Message</button>';
  html += '</div>';

  // Notes
  if(r.note){
    html += '<div class="mob-sheet-notes"><div class="mob-sg-lbl">Notes</div><div>'+r.note.replace(/\|/g,' · ')+'</div></div>';
  }

  // History
  if(r.history && r.history.length){
    html += '<div class="mob-sheet-history"><div class="mob-sg-lbl">History</div>';
    r.history.slice(-5).reverse().forEach(function(h){
      html += '<div class="mob-hist-item"><span class="mob-hist-date">'+fmtDate(h.date)+'</span> '+h.text+'</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  sheet.innerHTML = html;
};

MOB.closeSheet = function(){
  var sheet = document.getElementById('mob-sheet');
  if(sheet) sheet.style.display = 'none';
};

MOB.msgFromSheet = function(id){
  var d = window.data || window.DATA || [];
  if(typeof d === 'function') d = [];
  var r = d.find(function(x){ return x.id === id; });
  if(!r) return;
  MOB.closeSheet();
  var msgTab = r.type==='short-stay'?'Short-Term':'Long-Term';
  var navEl = document.querySelector('.nav-tab[onclick*="messages"]');
  if(navEl){ navEl.click(); setTimeout(function(){document.querySelectorAll('.sub-tab').forEach(function(t){if(t.textContent.trim().startsWith(msgTab))t.click()});},150); }
};

MOB.openBookingDetail = function(bookingId){
  var bookings = getPipelineBookings();
  var b = bookings.find(function(x){ return x.id == bookingId; });
  if(!b) return;
  var sheet = document.getElementById('mob-sheet');
  if(!sheet) return;
  sheet.style.display = 'flex';

  var html = '<div class="mob-sheet-handle" onclick="WILLOW_MOBILE.closeSheet()"></div>';
  html += '<div class="mob-sheet-content">';
  html += '<div class="mob-sheet-name">'+(b.guest_name||b.name||'Guest')+'</div>';
  html += '<div class="mob-sheet-unit">'+(b.unit_apt||b.unit_name||'')+'</div>';
  html += '<span class="mob-stage mob-stage-'+(b.stage||'').replace(/_/g,'-')+'">'+(b.stage||'').replace(/_/g,' ')+'</span>';
  html += '<div class="mob-sheet-grid">';
  if(b.check_in) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Check-in</span><span>'+fmtDate(b.check_in)+'</span></div>';
  if(b.check_out) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Check-out</span><span>'+fmtDate(b.check_out)+'</span></div>';
  if(b.total_price) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Total</span><span>'+fmt$(b.total_price)+'</span></div>';
  if(b.source) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Source</span><span>'+b.source+'</span></div>';
  if(b.guests) html += '<div class="mob-sg-item"><span class="mob-sg-lbl">Guests</span><span>'+b.guests+'</span></div>';
  html += '</div>';
  html += '<div class="mob-sheet-actions">';
  if(b.phone) html += '<a class="mob-action-btn" href="tel:'+b.phone.replace(/[^+0-9]/g,'')+'">📞 Call</a>';
  if(b.email) html += '<a class="mob-action-btn" href="mailto:'+b.email+'">✉ Email</a>';
  html += '<button class="mob-action-btn" onclick="WILLOW_MOBILE.closeSheet();WILLOW_MOBILE.openThread(\'bk-'+b.id+'\')">💬 Message</button>';
  html += '</div>';
  if(b.notes) html += '<div class="mob-sheet-notes"><div class="mob-sg-lbl">Notes</div><div>'+b.notes+'</div></div>';
  html += '</div>';
  sheet.innerHTML = html;
};

/* ── Desktop toggle ── */
MOB.switchDesktop = function(){
  document.body.classList.remove('mob-active');
  var shell = document.getElementById('mobApp');
  if(shell) shell.style.display = 'none';
  document.querySelectorAll('.header,.module-bar,.main-wrap,.sub-tab-bar').forEach(function(el){ el.style.display=''; });
};

MOB.switchMobile = function(){
  MOB.init();
};

})();
