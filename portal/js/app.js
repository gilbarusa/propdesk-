/* ═══════════════════════════════════════════════════
   WILLOW RESIDENT APP — Frontend App
   Vanilla JS SPA — all routing, auth, pages
   app.willowpa.com
   ═══════════════════════════════════════════════════ */

var PL = (function() {

  // ── CONFIG ──
  var API = 'api/index.php';
  var DEMO_MODE = (location.protocol === 'file:' || !location.hostname || location.hostname === 'localhost');
  var TOKEN = localStorage.getItem('pl_token') || '';
  var USER  = JSON.parse(localStorage.getItem('pl_user') || 'null');
  var SKIN  = localStorage.getItem('pl_skin') || 'a';

  // ── SUPABASE DIRECT (for live data in demo mode) ──
  var SB_URL = 'https://iwohrvkcodqvyoooxzmt.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2hydmtjb2Rxdnlvb294em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTM3OTksImV4cCI6MjA4OTg2OTc5OX0.PhKo6XiXf-VTBWcYkhT_vfHi0ibftNmYaqm4RApxO6Y';

  // ── PAGE HISTORY ──
  var _history = [];
  var _currentPage = 'dashboard';

  // ── PERMISSIONS BY USER TYPE ──
  // short-term = all, long-term = no checkin/checkout/forms, limited = maint + parking only
  var FEATURES = {
    'short-term':   ['checkin','checkout','forms','parking','maintenance','messages','packages','payments','info','ai'],
    'short-stay':   ['checkin','checkout','forms','parking','maintenance','messages','packages','payments','info','ai'],
    'month-to-month':['parking','maintenance','messages','packages','payments','info','ai'],
    'long-term':    ['parking','maintenance','messages','packages','payments','info','ai'],
    'limited':      ['maintenance','parking']
  };

  // ── CARD DEFINITIONS ──
  var CARDS = [
    { id:'checkin',   icon:'🔑', title:'Check-In',      sub:'Entry codes & instructions', ci:'ci-checkin',   page:'checkin' },
    { id:'checkout',  icon:'📋', title:'Check-Out',      sub:'Departure info',             ci:'ci-checkout',  page:'checkout' },
    { id:'forms',     icon:'📝', title:'Forms',          sub:'Agreements & signatures',    ci:'ci-forms',     page:'forms' },
    { id:'parking',   icon:'🚗', title:'Parking',        sub:'Reserve or manage spot',     ci:'ci-parking',   page:'parking' },
    { id:'maintenance',icon:'🔧',title:'Maintenance',    sub:'Submit or track requests',   ci:'ci-maint',     page:'maintenance' },
    { id:'messages',  icon:'💬', title:'Messages',       sub:'Chat with management',       ci:'ci-chat',      page:'messages' },
    { id:'packages',  icon:'📦', title:'Packages',       sub:'Package notifications',      ci:'ci-packages',  page:'packages' },
    { id:'payments',  icon:'💳', title:'Payments',       sub:'Pay rent or view history',   ci:'ci-payments',  page:'payments' },
    { id:'info',      icon:'ℹ️', title:'Useful Info',    sub:'WiFi, rules, contacts',      ci:'ci-info',      page:'info' },
    { id:'ai',        icon:'🤖', title:'AI Assistant',   sub:'Ask anything about your stay',ci:'ci-ai',       page:'ai' }
  ];

  // ═══════════════════════════════════════════════════
  //  DEMO DATA (works without PHP server)
  // ═══════════════════════════════════════════════════

  var DEMO = {
    users: {
      'test1234':  { user_type:'short-term', name:'Test User',      unit:'225', phone:'2159178700', email:'test@test.com', rent:1200, balance:150, due:'2026-05-01', lease_end:'2026-12-31', checkin:'2026-04-01' },
      'long1234':  { user_type:'long-term',  name:'Long Term User', unit:'103', phone:'2671231234', email:'long@test.com', rent:950,  balance:0,   due:'2026-05-01', lease_end:'2027-06-30', checkin:'' },
      'guest1234': { user_type:'short-term', name:'Guest User',     unit:'311', phone:'2670001234', email:'guest@test.com',rent:800,  balance:75,  due:'',           lease_end:'',           checkin:'2026-04-05' }
    },
    parking_buildings: [
      { id:'bld_1', name:'46 Township Line RD - Chelbourne Plaza', address:'46 Township Line RD', plans:[{id:'plan_1a',name:'10days',days:10,price:24},{id:'plan_1b',name:'20days',days:20,price:46},{id:'plan_1c',name:'30days',days:30,price:64},{id:'plan_1d',name:'60days',days:60,price:125}] },
      { id:'bld_2', name:'431 Valley RD', address:'431 Valley RD', plans:[{id:'plan_2a',name:'per_day_plan',days:1,price:2.5},{id:'plan_2b',name:'30days',days:30,price:70}] },
      { id:'bld_3', name:'278 N. Keswick', address:'278 N. Keswick', plans:[{id:'plan_3a',name:'per_day_plan',days:1,price:0.5}] },
      { id:'bld_4', name:'7845 Montgomery', address:'7845 Montgomery', plans:[{id:'plan_4a',name:'30days',days:30,price:60}] }
    ],
    parking_bookings: [
      { id:'pk_134', building_id:'bld_2', building_name:'431 Valley RD', unit:'225', plan:'per_day_plan', amount:12.5, start_date:'2026-04-04', end_date:'2026-04-09', car_brand:'Ford', car_model:'Prius', car_color:'Gold', license_plate:'FYZ-2409', status:'active' },
      { id:'pk_130', building_id:'bld_1', building_name:'Chelbourne Plaza', unit:'103', plan:'30days', amount:64, start_date:'2026-03-15', end_date:'2026-04-14', car_brand:'Toyota', car_model:'Camry', car_color:'Silver', license_plate:'ABC-1234', status:'active' }
    ],
    packages: [
      { id:'pkg_009', unit:'225', count:1, total:1, courier:'UPS', status:'Pending', created:'2026-04-02 14:31:00' },
      { id:'pkg_003', unit:'103', count:1, total:1, courier:'FedEx', status:'Pending', created:'2026-03-25 10:58:00' },
      { id:'pkg_014', unit:'311', count:1, total:1, courier:'USPS', status:'Pending', created:'2026-03-20 12:46:00' }
    ],
    maintenance: [],
    notifications: [
      { id:'ntf_001', unit:'225', type:'package', title:'Package Arrived', body:'You have 1 package waiting in the mailroom.', read:false, time:'2026-04-04 15:00:00' },
      { id:'ntf_002', unit:'225', type:'parking', title:'Parking Active', body:'Your parking at 431 Valley RD is active until Apr 9.', read:true, time:'2026-04-04 10:00:00' },
      { id:'ntf_003', unit:'103', type:'package', title:'Package Arrived', body:'1 package from FedEx waiting for pickup.', read:false, time:'2026-03-25 11:00:00' }
    ],
    forms: [
      { id:'form_001', title:'Lease Agreement', description:'Standard residential lease agreement for your unit.', type:'lease', for_types:['short-term','long-term','month-to-month'], created:'2026-01-01' },
      { id:'form_002', title:'House Rules Acknowledgment', description:'Please read and sign the house rules.', type:'rules', for_types:['short-term'], created:'2026-01-01' }
    ],
    payments: [
      { id:'pay_001', unit:'225', name:'Test User', amount:1200, payment_type:'rent', method:'card', description:'Rent - March 2026', status:'completed', created:'2026-03-01 09:00:00' },
      { id:'pay_002', unit:'225', name:'Test User', amount:12.5, payment_type:'parking', method:'card', description:'Parking - 431 Valley RD', status:'completed', created:'2026-04-04 10:30:00' }
    ],
    checkin_info: { unit:'*', entry_code:'4527#', wifi_name:'ChelPlaza-Guest', wifi_pass:'Welcome2026!', checkin_time:'3:00 PM', checkout_time:'11:00 AM', instructions:'1. Enter the main lobby using code 4527# on the keypad.\n2. Take the elevator to your floor.\n3. Your unit key is in the lockbox on the door \u2014 code will be texted to you.\n4. WiFi info is posted inside the unit.\n\nParking is in the rear lot \u2014 visitor spots are marked in yellow.', house_rules:'No smoking in units or common areas.\nQuiet hours: 10 PM - 8 AM.\nNo pets without prior written approval.\nNo parties or events without management approval.\nReport any maintenance issues promptly.', checkout_instructions:'1. Remove all personal belongings.\n2. Place used towels in the bathtub.\n3. Run the dishwasher if needed.\n4. Lock all windows and doors.\n5. Return the key to the lockbox.\n6. Text management when you\u2019ve left.' },
    useful_info: [
      { title:'WiFi', icon:'📶', text:'Network: ChelPlaza-Guest | Password: Welcome2026!' },
      { title:'Emergency Contacts', icon:'🚨', text:'Building Emergency: (267) 865-0001 | Police: 911 | Maintenance Emergency: (215) 917-8700' },
      { title:'Trash & Recycling', icon:'♻️', text:'Trash chute on each floor. Recycling bins in rear parking lot. Pickup: Mon & Thu.' },
      { title:'Parking', icon:'🚗', text:'Visitor parking in rear lot. Residents reserve through this app. Garage code: 4527#' },
      { title:'Laundry', icon:'🧺', text:'Laundry room on basement level. Open 7am-10pm. Quarters and app payment accepted.' },
      { title:'Mail', icon:'📬', text:'Mailboxes in main lobby. Packages held in mailroom — you will be notified.' },
      { title:'House Rules', icon:'📋', text:'No smoking in building. Quiet hours 10pm-8am. No grills on balconies. Pets require approval and deposit.' }
    ],
    community_updates: [
      { title:'Lobby Renovation', body:'The main lobby will be undergoing renovation starting April 15. Please use the side entrance.', active:true, date:'2026-04-02' }
    ]
  };

  // Demo API handler
  function demoApi(action, method, body) {
    var u = USER || {};
    var unit = u.unit || '';

    switch(action.split('&')[0]) {
      case 'login':
        var usr = DEMO.users[(body||{}).username];
        if (!usr) return Promise.resolve({error:'Invalid credentials. Try: test1234, long1234, or guest1234'});
        return Promise.resolve({ok:true, token:'demo_'+Date.now(), user_type:usr.user_type, name:usr.name, unit:usr.unit, phone:usr.phone, email:usr.email});

      case 'guest-access':
        return Promise.resolve({ok:true, token:'demo_guest_'+Date.now(), user_type:'limited', name:(body||{}).name||'Guest', unit:(body||{}).unit||'000'});

      case 'me':
        return Promise.resolve(u.name ? {ok:true, user_type:u.user_type, name:u.name, unit:u.unit} : {error:'Not authenticated'});

      case 'dashboard':
        var pkgs = DEMO.packages.filter(function(p){return p.unit===unit && p.status==='Pending';});
        var pkgCount = 0; pkgs.forEach(function(p){pkgCount+=p.count;});
        var myParking = DEMO.parking_bookings.find(function(b){return b.unit===unit && b.status==='active' && b.end_date>='2026-04-05';});
        var myMaint = DEMO.maintenance.filter(function(r){return r.unit===unit && r.status!=='completed';});
        var myNotifs = DEMO.notifications.filter(function(n){return n.unit===unit && !n.read;});
        return Promise.resolve({
          unit:unit, user_type:u.user_type, name:u.name,
          packages_pending:pkgCount,
          parking_active:myParking||null,
          maintenance_open:myMaint.length,
          unread_count:myNotifs.length,
          community_updates:DEMO.community_updates
        });

      case 'checkin-info':
      case 'checkout-info':
        return sbAppContent(unit).then(function(ac) {
          if (!ac) return DEMO.checkin_info;
          return {
            unit: unit, entry_code: ac.entry_code||'', wifi_name: ac.wifi_name||'',
            wifi_pass: ac.wifi_pass||'', checkin_time: ac.checkin_time||'3:00 PM',
            checkout_time: ac.checkout_time||'11:00 AM',
            instructions: ac.checkin_instructions||'',
            house_rules: ac.house_rules||'',
            checkout_instructions: ac.checkout_instructions||''
          };
        }).catch(function() { return DEMO.checkin_info; });

      case 'useful-info':
        return sbAppContent(unit).then(function(ac) {
          if (!ac) return DEMO.useful_info;
          var rules = ac.house_rules||'';
          var rulesArr = typeof rules==='string' ? rules.split('\n').filter(function(r){return r.trim();}) : rules;
          return {
            wifi: { name: ac.wifi_name||'', password: ac.wifi_pass||'' },
            emergency: { police:'911', fire:'911', maintenance: ac.emergency_maintenance||'', management: ac.emergency_management||'' },
            trash: ac.trash||'', parking: ac.parking||'', roku: ac.roku||'',
            laundry: ac.laundry||'', mail: ac.mail||'',
            house_rules: rulesArr,
            checkin_time: ac.checkin_time||'', checkout_time: ac.checkout_time||''
          };
        }).catch(function() { return DEMO.useful_info; });

      case 'parking-buildings':
        return Promise.resolve(DEMO.parking_buildings);

      case 'parking-plans':
        var bid = action.split('building_id=')[1]||'';
        var bld = DEMO.parking_buildings.find(function(b){return b.id===bid;});
        return Promise.resolve(bld ? bld.plans : []);

      case 'parking-my':
        return Promise.resolve(DEMO.parking_bookings.filter(function(b){return b.unit===unit;}));

      case 'parking-book':
        var nb = {id:'pk_'+Date.now(), building_id:(body||{}).building_id, building_name:(body||{}).building_name||'', unit:unit, plan:(body||{}).plan||'', amount:(body||{}).amount||0, start_date:(body||{}).start_date||'2026-04-05', end_date:(body||{}).end_date||'2026-04-10', car_brand:(body||{}).car_brand||'', car_model:(body||{}).car_model||'', car_color:(body||{}).car_color||'', license_plate:(body||{}).license_plate||'', status:'active'};
        DEMO.parking_bookings.push(nb);
        return Promise.resolve({ok:true, booking:nb});

      case 'packages':
        return Promise.resolve(DEMO.packages.filter(function(p){return p.unit===unit && p.status==='Pending';}));

      case 'packages-history':
        return Promise.resolve(DEMO.packages.filter(function(p){return p.unit===unit && p.status!=='Pending';}));

      case 'packages-confirm':
        DEMO.packages.forEach(function(p){if(p.unit===unit && p.status==='Pending'){p.status='Collected';p.collected='2026-04-05';}});
        return Promise.resolve({ok:true});

      case 'maintenance-list':
        return Promise.resolve(DEMO.maintenance.filter(function(r){return r.unit===unit;}));

      case 'maintenance-submit':
        var req = {id:'mnt_'+Date.now(), unit:unit, name:u.name, user_type:u.user_type, category:(body||{}).category||'General', description:(body||{}).description||'', urgency:(body||{}).urgency||'normal', status:'submitted', created:new Date().toISOString().replace('T',' ').slice(0,19), chat:[{from:'system',text:'Maintenance request submitted.',time:new Date().toISOString().replace('T',' ').slice(0,19)}]};
        DEMO.maintenance.unshift(req);
        return Promise.resolve({ok:true, request:req});

      case 'maintenance-detail':
        var mid = action.split('id=')[1] || (body||{}).id || '';
        var mr = DEMO.maintenance.find(function(r){return r.id===mid;});
        return Promise.resolve(mr || {error:'Not found'});

      case 'maintenance-chat':
        var cid = (body||{}).request_id||'';
        var cr = DEMO.maintenance.find(function(r){return r.id===cid;});
        if(cr){cr.chat=cr.chat||[];cr.chat.push({from:'tenant',text:(body||{}).message||'',time:new Date().toISOString().replace('T',' ').slice(0,19)});}
        return Promise.resolve({ok:true});

      case 'forms':
        var ut = u.user_type || 'short-term';
        var myForms = DEMO.forms.filter(function(f){return f.for_types.indexOf(ut)>=0;});
        myForms.forEach(function(f){f.signed=false;});
        return Promise.resolve(myForms);

      case 'form-detail':
        var fid = action.split('id=')[1] || (body||{}).id || '';
        var ff = DEMO.forms.find(function(f){return f.id===fid;});
        return Promise.resolve(ff || {error:'Not found'});

      case 'form-sign':
        return Promise.resolve({ok:true});

      case 'create-payment-intent':
        var payAmt = (body||{}).amount || (u.balance||150);
        DEMO.payments.unshift({id:'pay_'+Date.now(), unit:unit, name:u.name, amount:payAmt, payment_type:(body||{}).payment_type||'rent', method:'card', description:(body||{}).description||'Payment', status:'recorded', created:new Date().toISOString().replace('T',' ').slice(0,19)});
        return Promise.resolve({ok:true, demo:true, message:'Payment recorded (demo mode). Stripe integration pending.'});

      case 'payment-history':
        return Promise.resolve(DEMO.payments.filter(function(p){return p.unit===unit;}));

      case 'notifications':
        return Promise.resolve(DEMO.notifications.filter(function(n){return n.unit===unit;}));

      case 'notifications-read':
        var nid = (body||{}).id||'';
        DEMO.notifications.forEach(function(n){if(n.id===nid) n.read=true;});
        return Promise.resolve({ok:true});

      case 'notifications-read-all':
        DEMO.notifications.forEach(function(n){if(n.unit===unit) n.read=true;});
        return Promise.resolve({ok:true});

      case 'ai-ask':
        var msg = ((body||{}).message||'').toLowerCase();
        var reply = 'I\'m running in demo mode! In production, I\'ll be powered by AI. ';
        if(msg.indexOf('wifi')>=0) reply='WiFi: ChelPlaza-Guest, Password: Welcome2026!';
        else if(msg.indexOf('parking')>=0) reply='You can manage parking from the Parking section. We have spots at 4 buildings.';
        else if(msg.indexOf('checkout')>=0||msg.indexOf('check out')>=0) reply='Check-out time is 11:00 AM. Please leave keys on the counter.';
        else if(msg.indexOf('checkin')>=0||msg.indexOf('check in')>=0) reply='Check-in is at 3:00 PM. Entry code: 4527#';
        else if(msg.indexOf('maintenance')>=0||msg.indexOf('fix')>=0) reply='I can help! Go to the Maintenance section to submit a request.';
        else if(msg.indexOf('package')>=0) reply='Check the Packages section to see if you have anything waiting.';
        else reply+='Try asking about WiFi, parking, check-in, check-out, maintenance, or packages!';
        return Promise.resolve({reply:reply, action:null});

      case 'community-updates':
        return Promise.resolve(DEMO.community_updates);

      default:
        return Promise.resolve({ok:true});
    }
  }

  // ── Supabase direct fetch for live app_content ──
  var _sbCache = {};
  function sbAppContent(unit) {
    var key = unit || '*';
    if (_sbCache[key]) return Promise.resolve(_sbCache[key]);
    var url = SB_URL + '/rest/v1/property_settings?select=apt,app_content&app_content=not.is.null&order=apt';
    return fetch(url, { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY } })
      .then(function(r) { return r.json(); })
      .then(function(rows) {
        if (!rows || !rows.length) return null;
        // Try exact unit match first, then apt containing unit, then wildcard *
        var match = null;
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].apt === unit) { match = rows[i].app_content; break; }
        }
        if (!match) {
          for (var j = 0; j < rows.length; j++) {
            if (rows[j].apt && rows[j].apt.indexOf(unit) !== -1) { match = rows[j].app_content; break; }
          }
        }
        if (!match) {
          for (var k = 0; k < rows.length; k++) {
            if (rows[k].apt === '*') { match = rows[k].app_content; break; }
          }
        }
        if (!match && rows[0].app_content) match = rows[0].app_content;
        _sbCache[key] = match;
        return match;
      });
  }

  // ═══════════════════════════════════════════════════
  //  API HELPER
  // ═══════════════════════════════════════════════════

  function api(action, method, body) {
    // In demo mode, use mock data
    if (DEMO_MODE) return demoApi(action, method, body);

    method = method || 'GET';
    var opts = { method: method, headers: {} };
    if (TOKEN) opts.headers['Authorization'] = 'Bearer ' + TOKEN;
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch(API + '?action=' + action, opts)
      .then(function(r) { return r.json(); })
      .catch(function() {
        // Fallback to demo mode if server unreachable
        DEMO_MODE = true;
        return demoApi(action, method, body);
      });
  }

  function apiUpload(action, formData) {
    if (DEMO_MODE) return demoApi(action, 'POST', {});
    var opts = { method: 'POST', body: formData, headers: {} };
    if (TOKEN) opts.headers['Authorization'] = 'Bearer ' + TOKEN;
    return fetch(API + '?action=' + action, opts)
      .then(function(r) { return r.json(); })
      .catch(function() { return { error: 'Upload failed' }; });
  }

  // ═══════════════════════════════════════════════════
  //  AUTH
  // ═══════════════════════════════════════════════════

  function authTab(tab) {
    var tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    if (tab === 'login') {
      tabs[0].classList.add('active');
      document.getElementById('loginForm').style.display = '';
      document.getElementById('guestForm').style.display = 'none';
    } else {
      tabs[1].classList.add('active');
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('guestForm').style.display = '';
    }
  }

  function login() {
    var user = (document.getElementById('loginUser').value || '').trim().toLowerCase();
    var errEl = document.getElementById('loginErr');
    errEl.className = 'auth-error';
    if (!user) { errEl.textContent = 'Enter your username'; errEl.className = 'auth-error show'; return; }

    api('login', 'POST', { username: user }).then(function(d) {
      if (d.error) { errEl.textContent = d.error; errEl.className = 'auth-error show'; return; }
      TOKEN = d.token;
      USER = { token: d.token, user_type: d.user_type, name: d.name, unit: d.unit, phone: d.phone, email: d.email };
      localStorage.setItem('pl_token', TOKEN);
      localStorage.setItem('pl_user', JSON.stringify(USER));
      enterApp();
    });
  }

  function guestAccess() {
    var name = (document.getElementById('guestName').value || '').trim();
    var address = (document.getElementById('guestAddress').value || '').trim();
    var unit = (document.getElementById('guestUnit').value || '').trim();
    var phone = (document.getElementById('guestPhone').value || '').trim();
    var errEl = document.getElementById('guestErr');
    errEl.className = 'auth-error';

    if (!name || !unit || !phone) { errEl.textContent = 'Name, unit, and phone are required.'; errEl.className = 'auth-error show'; return; }

    api('guest-access', 'POST', { name: name, unit: unit, phone: phone, address: address }).then(function(d) {
      if (d.error) { errEl.textContent = d.error; errEl.className = 'auth-error show'; return; }
      TOKEN = d.token;
      USER = { token: d.token, user_type: 'limited', name: d.name, unit: d.unit };
      localStorage.setItem('pl_token', TOKEN);
      localStorage.setItem('pl_user', JSON.stringify(USER));
      enterApp();
    });
  }

  function logout() {
    api('logout', 'POST');
    TOKEN = '';
    USER = null;
    localStorage.removeItem('pl_token');
    localStorage.removeItem('pl_user');
    document.getElementById('appShell').style.display = 'none';
    document.getElementById('authScreen').className = 'screen active';
    document.getElementById('loginUser').value = '';
  }

  function enterApp() {
    document.getElementById('authScreen').className = 'screen';
    document.getElementById('appShell').style.display = '';
    _history = [];
    showScreen('dashboard');
    loadDashboard();
  }

  // ═══════════════════════════════════════════════════
  //  ROUTING
  // ═══════════════════════════════════════════════════

  function showScreen(name) {
    // Hide all pages
    var pages = document.querySelectorAll('#pageContainer .page');
    pages.forEach(function(p) { p.style.display = 'none'; p.classList.remove('active'); });

    // Show target
    var target = document.getElementById('page' + capitalize(name));
    if (target) { target.style.display = ''; target.classList.add('active'); }

    // Update top bar
    var titles = {
      dashboard:'Home', checkin:'Check-In', checkout:'Check-Out',
      forms:'Forms & Agreements', parking:'Parking', parkingBook:'Reserve Parking',
      maintenance:'Maintenance', maintenanceNew:'New Request', maintenanceDetail:'Request',
      messages:'Messages', packages:'Packages', payments:'Payments',
      info:'Useful Info', ai:'AI Assistant', notifications:'Notifications',
      formDetail:'Agreement', settings:'Settings'
    };
    document.getElementById('topTitle').textContent = titles[name] || name;

    // Back button
    var backBtn = document.getElementById('backBtn');
    backBtn.style.display = (name === 'dashboard') ? 'none' : '';

    // Track history
    if (name !== _currentPage) {
      _history.push(_currentPage);
    }
    _currentPage = name;

    // Update nav
    updateNav(name);

    // Load page data
    if (name === 'dashboard') loadDashboard();
    else if (name === 'checkin') loadCheckin();
    else if (name === 'checkout') loadCheckout();
    else if (name === 'forms') loadForms();
    else if (name === 'parking') loadParking();
    else if (name === 'maintenance') loadMaintenance();
    else if (name === 'packages') loadPackages();
    else if (name === 'payments') loadPayments();
    else if (name === 'info') loadInfo();
    else if (name === 'ai') initAI();
    else if (name === 'notifications') loadNotifications();
  }

  function goBack() {
    var prev = _history.pop();
    if (prev) {
      _currentPage = prev;
      showScreen(prev);
      _history.pop(); // remove duplicate
    } else {
      showScreen('dashboard');
    }
  }

  function navTo(page) {
    _history = [];
    showScreen(page);
  }

  function updateNav(page) {
    var navMap = { dashboard:'dashboard', maintenance:'maintenance', maintenanceNew:'maintenance',
      maintenanceDetail:'maintenance', parking:'parking', parkingBook:'parking',
      packages:'packages', info:'info' };
    var active = navMap[page] || '';
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.page === active);
    });
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ═══════════════════════════════════════════════════
  //  DASHBOARD
  // ═══════════════════════════════════════════════════

  function loadDashboard() {
    if (!USER) return;

    // Greeting
    var h = new Date().getHours();
    var greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    document.getElementById('dashHello').textContent = greet;
    document.getElementById('dashName').textContent = 'Hi, ' + (USER.name || '').split(' ')[0];

    // Build cards based on user type
    var allowed = FEATURES[USER.user_type] || FEATURES['limited'];
    var html = '';
    CARDS.forEach(function(c) {
      if (allowed.indexOf(c.id) === -1) return;
      html += '<div class="dash-card" onclick="PL.showScreen(\'' + c.page + '\')">' +
        '<div class="dash-card-icon ' + c.ci + '">' + c.icon + '</div>' +
        '<div class="dash-card-title">' + c.title + '</div>' +
        '<div class="dash-card-sub">' + c.sub + '</div>' +
        '<span class="dash-card-badge" id="badge_' + c.id + '" style="display:none">0</span>' +
        '<span class="dash-card-tag" id="tag_' + c.id + '" style="display:none"></span>' +
        '</div>';
    });
    document.getElementById('dashCards').innerHTML = html;

    // Fetch dashboard data
    api('dashboard').then(function(d) {
      if (d.error) return;

      // Package alert
      if (d.packages_pending > 0) {
        document.getElementById('dashAlert').style.display = '';
        document.getElementById('dashAlertText').innerHTML = '<strong>' + d.packages_pending + ' package' + (d.packages_pending > 1 ? 's' : '') + '</strong> waiting in the lobby for pickup';
        setBadge('packages', d.packages_pending);
        setTag('packages', d.packages_pending + ' pending', 'warning');
      } else {
        document.getElementById('dashAlert').style.display = 'none';
      }

      // Parking active
      if (d.parking_active) {
        setTag('parking', 'Spot ' + (d.parking_active.spot || 'reserved'), 'info');
      }

      // Maintenance open
      if (d.maintenance_open > 0) {
        setBadge('maintenance', d.maintenance_open);
      }

      // Notification badge
      if (d.unread_count > 0) {
        var nb = document.getElementById('notifBadge');
        if (nb) { nb.textContent = d.unread_count; nb.style.display = ''; }
      }

      // Payment status
      if (USER.user_type !== 'limited') {
        if (d.balance && d.balance > 0) {
          setTag('payments', '$' + d.balance + ' due', 'danger');
        } else {
          setTag('payments', 'Paid', 'success');
        }
      }

      // Check-in ready
      setTag('checkin', 'Ready', 'success');
    });
  }

  function setBadge(id, count) {
    var el = document.getElementById('badge_' + id);
    if (el) { el.textContent = count; el.style.display = ''; }
  }

  function setTag(id, text, type) {
    var el = document.getElementById('tag_' + id);
    if (el) { el.textContent = text; el.className = 'dash-card-tag tag-' + type; el.style.display = ''; }
  }

  // ═══════════════════════════════════════════════════
  //  CHECK-IN / CHECK-OUT
  // ═══════════════════════════════════════════════════

  function loadCheckin() {
    api('checkin-info').then(function(d) {
      if (d.error) { document.getElementById('checkinContent').innerHTML = '<div class="info-loading">' + d.error + '</div>'; return; }
      var html = '';
      if (d.entry_code) html += infoCard('Entry Code', '', '<div class="info-value">' + esc(d.entry_code) + '</div>');
      if (d.checkin_time) html += infoCard('Check-In Time', d.checkin_time);
      if (d.wifi_name) html += infoCard('WiFi Network', '<strong>' + esc(d.wifi_name) + '</strong>' + (d.wifi_pass ? '<br>Password: <span class="info-value" style="font-size:14px;padding:4px 10px;margin-top:4px">' + esc(d.wifi_pass) + '</span>' : ''));
      if (d.instructions) html += infoCard('Instructions', nl2br(esc(d.instructions)));
      if (d.house_rules) html += infoCard('House Rules', nl2br(esc(d.house_rules)));
      if (!html) html = '<div class="info-loading">Check-in info will be available before your arrival.</div>';
      document.getElementById('checkinContent').innerHTML = html;
    });
  }

  function loadCheckout() {
    api('checkin-info').then(function(d) {
      if (d.error) { document.getElementById('checkoutContent').innerHTML = '<div class="info-loading">' + d.error + '</div>'; return; }
      var html = '';
      if (d.checkout_time) html += infoCard('Check-Out Time', d.checkout_time);
      if (d.checkout_instructions) html += infoCard('Departure Instructions', nl2br(esc(d.checkout_instructions)));
      if (USER.lease_end) html += infoCard('Lease End', USER.lease_end);
      if (!html) html = '<div class="info-loading">Check-out details will appear closer to your departure.</div>';
      document.getElementById('checkoutContent').innerHTML = html;
    });
  }

  // ═══════════════════════════════════════════════════
  //  FORMS / AGREEMENTS
  // ═══════════════════════════════════════════════════

  function loadForms() {
    api('forms').then(function(d) {
      var el = document.getElementById('formsList');
      if (!el) return;
      if (d.error || !Array.isArray(d) || d.length === 0) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>No Forms</h3><p>You have no pending forms or agreements.</p></div>';
        return;
      }
      var html = '';
      d.forEach(function(f) {
        var statusClass = f.signed ? 'tag-success' : 'tag-warning';
        var statusText  = f.signed ? 'Signed' : 'Needs Signature';
        html += '<div class="form-card" onclick="PL.openForm(\'' + f.id + '\')">' +
          '<div class="fc-icon">' + (f.signed ? '✅' : '📝') + '</div>' +
          '<div class="fc-body"><h4>' + esc(f.title) + '</h4><p>' + esc(f.description || '') + '</p></div>' +
          '<div class="fc-status"><span class="dash-card-tag ' + statusClass + '">' + statusText + '</span></div>' +
          '</div>';
      });
      el.innerHTML = html;
    });
  }

  function openForm(id) {
    api('form-detail&id=' + id).then(function(d) {
      if (d.error) { toast(d.error); return; }
      var el = document.getElementById('formDetailContent');
      if (!el) return;
      var html = '<div class="info-card"><h3>' + esc(d.title) + '</h3><p>' + nl2br(esc(d.content || '')) + '</p></div>';
      if (!d.signed) {
        html += '<div class="form-group mt-16"><label class="checkbox-row"><input type="checkbox" id="formAgree"><span>I have read and agree to the above terms</span></label></div>';
        html += '<button class="btn-primary btn-full mt-8" onclick="PL.signForm(\'' + id + '\')">Sign Agreement</button>';
      } else {
        html += '<div class="info-card mt-16" style="text-align:center"><p style="color:var(--success);font-weight:600">✅ Signed on ' + esc(d.signed_at || '') + '</p></div>';
      }
      el.innerHTML = html;
      showScreen('formDetail');
    });
  }

  function signForm(id) {
    var agreed = document.getElementById('formAgree');
    if (!agreed || !agreed.checked) { toast('Please check the agreement box'); return; }
    api('form-sign', 'POST', { id: id }).then(function(d) {
      if (d.error) { toast(d.error); return; }
      toast('Agreement signed!');
      showScreen('forms');
    });
  }

  // ═══════════════════════════════════════════════════
  //  MAINTENANCE
  // ═══════════════════════════════════════════════════

  var _maintPhotos = [];

  function loadMaintenance() {
    api('maintenance-list').then(function(d) {
      var el = document.getElementById('maintenanceList');
      if (!Array.isArray(d) || d.length === 0) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">🔧</div><h3>No Requests</h3><p>You haven\'t submitted any maintenance requests yet.</p></div>';
        return;
      }
      var html = '';
      d.forEach(function(r) {
        var statusClass = { submitted:'tag-warning', assigned:'tag-info', 'in progress':'tag-info', completed:'tag-success', cancelled:'tag-danger' }[r.status] || 'tag-info';
        html += '<div class="maint-item" onclick="PL.openMaintDetail(\'' + r.id + '\')">' +
          '<div class="maint-icon">' + categoryIcon(r.category) + '</div>' +
          '<div class="maint-body"><h4>' + esc(r.category) + '</h4><p>' + esc(r.description) + '</p></div>' +
          '<span class="maint-status ' + statusClass + '">' + esc(r.status) + '</span>' +
          '</div>';
      });
      el.innerHTML = html;
    });
  }

  function categoryIcon(cat) {
    var map = { Plumbing:'🚰', Electrical:'⚡', 'HVAC / Heating':'🌡', Appliance:'🏠', 'Lock / Key':'🔑', 'Pest Control':'🐛', 'Water Damage':'💧', General:'🔧' };
    return map[cat] || '🔧';
  }

  function addMaintPhotos(files) {
    for (var i = 0; i < files.length; i++) {
      (function(file) {
        var fd = new FormData();
        fd.append('photo', file);
        apiUpload('maintenance-photo', fd).then(function(d) {
          if (d.ok) {
            _maintPhotos.push(d.url);
            var grid = document.getElementById('maintPhotos');
            grid.innerHTML += '<img src="' + d.url + '">';
          }
        });
      })(files[i]);
    }
  }

  function submitMaintenance() {
    var desc = (document.getElementById('maintDesc').value || '').trim();
    var errEl = document.getElementById('maintErr');
    errEl.className = 'auth-error';

    if (!desc) { errEl.textContent = 'Please describe the issue.'; errEl.className = 'auth-error show'; return; }

    var urg = 'normal';
    var radios = document.querySelectorAll('input[name="maintUrg"]');
    radios.forEach(function(r) { if (r.checked) urg = r.value; });

    api('maintenance-submit', 'POST', {
      category: document.getElementById('maintCategory').value,
      description: desc,
      urgency: urg,
      permission_to_enter: document.getElementById('maintPermission').checked,
      photos: _maintPhotos
    }).then(function(d) {
      if (d.error) { errEl.textContent = d.error; errEl.className = 'auth-error show'; return; }
      _maintPhotos = [];
      document.getElementById('maintDesc').value = '';
      document.getElementById('maintPhotos').innerHTML = '';
      toast('Request submitted!');
      showScreen('maintenance');
    });
  }

  function openMaintDetail(id) {
    api('maintenance-detail&id=' + id).then(function(d) {
      if (d.error) { toast(d.error); return; }

      // Header
      var hdr = document.getElementById('maintDetailHeader');
      var statusClass = { submitted:'tag-warning', assigned:'tag-info', 'in progress':'tag-info', completed:'tag-success', cancelled:'tag-danger' }[d.status] || 'tag-info';
      hdr.innerHTML = '<h3>' + categoryIcon(d.category) + ' ' + esc(d.category) + '</h3>' +
        '<p>' + esc(d.description) + '</p>' +
        '<span class="dash-card-tag ' + statusClass + '" style="margin-top:8px;display:inline-block">' + esc(d.status) + '</span>';

      // Chat
      var chat = document.getElementById('maintChat');
      var html = '';
      (d.chat || []).forEach(function(m) {
        var cls = m.from === 'tenant' ? 'from-tenant' : (m.from === 'system' ? 'from-system' : 'from-admin');
        html += '<div class="chat-msg ' + cls + '">' + esc(m.text) +
          '<div class="chat-time">' + fmtTime(m.time) + '</div></div>';
      });
      chat.innerHTML = html;
      chat.scrollTop = chat.scrollHeight;

      // Store current request ID
      document.getElementById('chatInput').dataset.requestId = id;
      showScreen('maintenanceDetail');
    });
  }

  function sendChat() {
    var input = document.getElementById('chatInput');
    var msg = (input.value || '').trim();
    var id = input.dataset.requestId;
    if (!msg || !id) return;

    input.value = '';
    api('maintenance-chat', 'POST', { id: id, message: msg }).then(function(d) {
      if (d.ok) openMaintDetail(id); // Refresh
    });
  }

  // ═══════════════════════════════════════════════════
  //  PARKING
  // ═══════════════════════════════════════════════════

  var _selectedPlan = null;

  function loadParking() {
    api('parking-my').then(function(d) {
      var el = document.getElementById('parkingList');
      var activeEl = document.getElementById('parkingActive');
      activeEl.style.display = 'none';

      if (!Array.isArray(d) || d.length === 0) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">🚗</div><h3>No Reservations</h3><p>You don\'t have any parking reservations.</p></div>';
        return;
      }

      // Show active reservation
      var active = d.find(function(b) { return b.status === 'active' && (b.end_date || '') >= today(); });
      if (active) {
        activeEl.style.display = '';
        activeEl.innerHTML = '<div style="font-size:14px;font-weight:600;color:var(--success);margin-bottom:6px">Active Reservation</div>' +
          '<div style="font-size:13px;color:var(--text-secondary)">Building: ' + esc(active.building || '') + '</div>' +
          '<div style="font-size:13px;color:var(--text-secondary)">Spot: ' + esc(active.spot || 'TBD') + ' &bull; ' + esc(active.plan || '') + '</div>' +
          '<div style="font-size:13px;color:var(--text-secondary)">' + esc(active.start_date || '') + ' to ' + esc(active.end_date || '') + '</div>';
      }

      var html = '';
      d.forEach(function(b) {
        var tag = b.status === 'active' ? 'tag-success' : 'tag-info';
        html += '<div class="maint-item">' +
          '<div class="maint-icon">🚗</div>' +
          '<div class="maint-body"><h4>' + esc(b.building || 'Parking') + '</h4><p>' + esc(b.plan || '') + ' &bull; ' + esc(b.start_date || '') + '</p></div>' +
          '<span class="maint-status ' + tag + '">' + esc(b.status || '') + '</span>' +
          '</div>';
      });
      el.innerHTML = html;
    });
  }

  function loadParkingPlans() {
    var buildingId = document.getElementById('pkBuilding').value;
    if (!buildingId) { document.getElementById('pkPlans').style.display = 'none'; return; }

    api('parking-plans&building_id=' + buildingId).then(function(d) {
      var el = document.getElementById('pkPlans');
      if (!Array.isArray(d) || d.length === 0) { el.innerHTML = '<p style="color:var(--text-secondary)">No plans available</p>'; el.style.display = ''; return; }

      var html = '';
      d.forEach(function(p) {
        html += '<div class="plan-card" onclick="PL.selectPlan(this,\'' + esc(p.id) + '\')">' +
          '<h4>' + esc(p.name) + '</h4><p>' + esc(p.description || '') + '</p>' +
          '<div class="price">$' + (p.price || 0) + '/month</div></div>';
      });
      el.innerHTML = html;
      el.style.display = '';
      document.getElementById('pkVehicleSection').style.display = '';
      document.getElementById('pkBookBtn').style.display = '';
    });
  }

  function selectPlan(el, planId) {
    document.querySelectorAll('.plan-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    _selectedPlan = planId;
  }

  function bookParking() {
    if (!_selectedPlan) { toast('Select a plan first'); return; }
    var errEl = document.getElementById('pkErr');
    errEl.className = 'auth-error';

    api('parking-book', 'POST', {
      building_id: document.getElementById('pkBuilding').value,
      plan_id: _selectedPlan,
      car_brand: document.getElementById('pkMake').value,
      car_model: document.getElementById('pkModel').value,
      car_color: document.getElementById('pkColor').value,
      license_plate: document.getElementById('pkPlate').value
    }).then(function(d) {
      if (d.error) { errEl.textContent = d.error; errEl.className = 'auth-error show'; return; }
      toast('Parking reserved!');
      showScreen('parking');
    });
  }

  // ═══════════════════════════════════════════════════
  //  PACKAGES
  // ═══════════════════════════════════════════════════

  function loadPackages() {
    api('packages').then(function(d) {
      var el = document.getElementById('pkgPending');
      var btnEl = document.getElementById('pkgConfirmBtn');
      btnEl.style.display = 'none';

      if (d.error) { el.innerHTML = '<div class="info-loading">' + d.error + '</div>'; return; }

      var pending = Array.isArray(d) ? d.filter(function(p) { return p.status === 'Pending'; }) : [];
      if (pending.length === 0) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><h3>No Packages</h3><p>No packages waiting for pickup.</p></div>';
      } else {
        var html = '';
        pending.forEach(function(p) {
          html += '<div class="pkg-card"><div class="pkg-icon">📦</div><div class="pkg-body">' +
            '<h4>' + (p.courier || 'Package') + ' — ' + p.count + ' item' + (p.count > 1 ? 's' : '') + '</h4>' +
            '<p>Delivered ' + fmtTime(p.created) + '</p></div></div>';
        });
        el.innerHTML = html;
        btnEl.style.display = '';
      }
    });

    api('packages-history').then(function(d) {
      var el = document.getElementById('pkgHistory');
      if (!Array.isArray(d) || d.length === 0) {
        el.innerHTML = '<div class="info-loading">No package history yet.</div>';
        return;
      }
      var html = '';
      d.forEach(function(p) {
        html += '<div class="maint-item"><div class="maint-icon">📦</div><div class="maint-body">' +
          '<h4>' + esc(p.courier || 'Package') + '</h4><p>Collected ' + fmtTime(p.collected || p.modified) + '</p></div>' +
          '<span class="maint-status tag-success">Collected</span></div>';
      });
      el.innerHTML = html;
    });
  }

  function confirmPickup() {
    api('packages-confirm', 'POST').then(function(d) {
      if (d.error) { toast(d.error); return; }
      toast('Pickup confirmed!');
      loadPackages();
    });
  }

  // ═══════════════════════════════════════════════════
  //  PAYMENTS
  // ═══════════════════════════════════════════════════

  var _payMethod = 'card';

  function loadPayments() {
    var el = document.getElementById('payContent');
    if (!el) return;

    var balance = USER.balance || 0;
    var rent = USER.rent || 0;
    var due = USER.due || '';

    var html = '<div class="pay-summary">' +
      '<div class="pay-label">Balance Due</div>' +
      '<div class="pay-amount">$' + balance.toFixed(2) + '</div>' +
      (due ? '<div class="pay-due">Due: ' + due + '</div>' : '') +
      (rent ? '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Monthly rent: $' + rent.toFixed(2) + '</div>' : '') +
      '</div>';

    if (balance > 0) {
      html += '<div class="section-label" style="padding:0">Payment Method</div>' +
        '<div class="pay-methods">' +
        '<div class="pay-method selected" onclick="PL.selectPayMethod(this,\'card\')"><div class="pay-method-icon">💳</div><div><strong>Credit / Debit Card</strong><br><span style="font-size:12px;color:var(--text-secondary)">Visa, Mastercard, Amex</span></div></div>' +
        '<div class="pay-method" onclick="PL.selectPayMethod(this,\'ach\')"><div class="pay-method-icon">🏦</div><div><strong>Bank Transfer (ACH)</strong><br><span style="font-size:12px;color:var(--text-secondary)">Direct from your bank account</span></div></div>' +
        '</div>' +
        '<div id="stripeContainer" style="margin-bottom:16px"></div>' +
        '<button class="btn-primary btn-full" onclick="PL.processPayment()">Pay $' + balance.toFixed(2) + '</button>';
    } else {
      html += '<div class="info-card" style="text-align:center"><p style="color:var(--success);font-weight:600">✅ No balance due</p></div>';
    }

    html += '<div class="section-label mt-16" style="padding:0">Payment History</div><div id="payHistoryList"><div class="info-loading">Loading...</div></div>';

    el.innerHTML = html;

    // Load payment history
    api('payment-history').then(function(d) {
      var hel = document.getElementById('payHistoryList');
      if (!hel) return;
      if (!Array.isArray(d) || d.length === 0) {
        hel.innerHTML = '<div class="info-loading">No payment history.</div>';
        return;
      }
      var hhtml = '';
      d.forEach(function(p) {
        hhtml += '<div class="pay-item"><div class="pay-item-left"><h4>' + esc(p.description || 'Payment') + '</h4>' +
          '<p>' + fmtTime(p.date || p.created) + '</p></div>' +
          '<div class="pay-item-right" style="color:var(--success)">$' + (p.amount || 0).toFixed(2) + '</div></div>';
      });
      hel.innerHTML = hhtml;
    });
  }

  function selectPayMethod(el, method) {
    document.querySelectorAll('.pay-method').forEach(function(m) { m.classList.remove('selected'); });
    el.classList.add('selected');
    _payMethod = method;
  }

  function processPayment() {
    // Stripe integration placeholder — in production, use Stripe Elements
    toast('Connecting to payment processor...');
    api('create-payment-intent', 'POST', { method: _payMethod }).then(function(d) {
      if (d.error) { toast(d.error); return; }
      if (d.client_secret) {
        // In production: mount Stripe Elements and confirm payment
        toast('Payment processing — Stripe integration pending');
      } else {
        toast(d.message || 'Payment submitted');
      }
    });
  }

  // ═══════════════════════════════════════════════════
  //  USEFUL INFO
  // ═══════════════════════════════════════════════════

  function loadInfo() {
    api('useful-info').then(function(d) {
      if (d.error) { document.getElementById('infoContent').innerHTML = '<div class="info-loading">' + d.error + '</div>'; return; }
      var html = '';

      if (d.wifi) {
        html += infoCard('WiFi', '<strong>' + esc(d.wifi.name || '') + '</strong>' +
          (d.wifi.password ? '<br>Password: <span class="info-value" style="font-size:14px;padding:4px 10px;margin-top:4px">' + esc(d.wifi.password) + '</span>' : ''));
      }
      if (d.roku) html += infoCard('Roku / TV', nl2br(esc(d.roku)));
      if (d.trash) html += infoCard('Trash & Recycling', nl2br(esc(d.trash)));
      if (d.laundry) html += infoCard('Laundry', nl2br(esc(d.laundry)));
      if (d.parking) html += infoCard('Parking', nl2br(esc(d.parking)));
      if (d.mail) html += infoCard('Mail & Packages', nl2br(esc(d.mail)));

      if (d.house_rules && Array.isArray(d.house_rules)) {
        var rules = d.house_rules.map(function(r) { return '• ' + esc(r); }).join('<br>');
        html += infoCard('House Rules', rules);
      }

      if (d.emergency) {
        var emg = '';
        if (d.emergency.police) emg += 'Emergency: <strong>' + esc(d.emergency.police) + '</strong><br>';
        if (d.emergency.maintenance) emg += 'Maintenance: <strong>' + esc(d.emergency.maintenance) + '</strong><br>';
        if (d.emergency.management) emg += 'Management: <strong>' + esc(d.emergency.management) + '</strong>';
        html += infoCard('Emergency Contacts', emg);
      }

      document.getElementById('infoContent').innerHTML = html || '<div class="info-loading">No information available.</div>';
    });
  }

  // ═══════════════════════════════════════════════════
  //  AI ASSISTANT
  // ═══════════════════════════════════════════════════

  var _aiMessages = [];

  function initAI() {
    var el = document.getElementById('aiChat');
    if (!el) return;
    if (_aiMessages.length === 0) {
      el.innerHTML = '<div class="ai-welcome"><div class="ai-icon">🤖</div>' +
        '<h3>Hi! I\'m your AI assistant</h3>' +
        '<p>I can help with questions about your stay, building info, or help you navigate the portal.</p>' +
        '<div class="ai-suggestions">' +
        '<button class="ai-suggestion" onclick="PL.aiAsk(\'What\'s the WiFi password?\')">WiFi password?</button>' +
        '<button class="ai-suggestion" onclick="PL.aiAsk(\'How do I submit a maintenance request?\')">Maintenance help</button>' +
        '<button class="ai-suggestion" onclick="PL.aiAsk(\'What are the house rules?\')">House rules</button>' +
        '<button class="ai-suggestion" onclick="PL.aiAsk(\'When is checkout?\')">Checkout time?</button>' +
        '</div></div>';
    }
  }

  function aiAsk(question) {
    if (!question) {
      var input = document.getElementById('aiInput');
      if (!input) return;
      question = (input.value || '').trim();
      input.value = '';
    }
    if (!question) return;

    _aiMessages.push({ from: 'user', text: question });
    renderAIChat();

    api('ai-ask', 'POST', { message: question, history: _aiMessages.slice(-10) }).then(function(d) {
      var reply = (d && d.reply) ? d.reply : 'Sorry, I couldn\'t process that. Try asking differently or use the menu to navigate.';
      _aiMessages.push({ from: 'ai', text: reply });
      renderAIChat();

      // Check for action suggestions
      if (d && d.action) {
        if (d.action === 'maintenance') showScreen('maintenanceNew');
        else if (d.action === 'parking') showScreen('parking');
        else if (d.action === 'info') showScreen('info');
      }
    });
  }

  function renderAIChat() {
    var el = document.getElementById('aiChat');
    if (!el) return;
    var html = '';
    _aiMessages.forEach(function(m) {
      var cls = m.from === 'user' ? 'from-tenant' : 'from-admin';
      html += '<div class="chat-msg ' + cls + '">' + nl2br(esc(m.text)) + '</div>';
    });
    el.innerHTML = html;
    el.scrollTop = el.scrollHeight;
  }

  // ═══════════════════════════════════════════════════
  //  NOTIFICATIONS
  // ═══════════════════════════════════════════════════

  function loadNotifications() {
    api('notifications').then(function(d) {
      var el = document.getElementById('notifList');
      if (!Array.isArray(d) || d.length === 0) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">🔔</div><h3>No Notifications</h3><p>You\'re all caught up!</p></div>';
        return;
      }
      var html = '';
      d.forEach(function(n) {
        html += '<div class="notif-item ' + (n.read ? '' : 'unread') + '" onclick="PL.readNotif(\'' + n.id + '\')">' +
          '<h4>' + esc(n.title || '') + '</h4><p>' + esc(n.body || '') + '</p>' +
          '<div class="notif-time">' + fmtTime(n.time) + '</div></div>';
      });
      el.innerHTML = html;
    });
  }

  function readNotif(id) {
    api('notifications-read', 'POST', { id: id }).then(function() {
      loadNotifications();
    });
  }

  function readAllNotifs() {
    api('notifications-read-all', 'POST').then(function() {
      loadNotifications();
      var nb = document.getElementById('notifBadge');
      if (nb) nb.style.display = 'none';
    });
  }

  // ═══════════════════════════════════════════════════
  //  SKIN SWITCHER
  // ═══════════════════════════════════════════════════

  function setSkin(skin) {
    SKIN = skin;
    localStorage.setItem('pl_skin', skin);
    document.getElementById('skinCSS').href = 'css/skin-' + skin + '.css';
    // Update skin picker dots
    document.querySelectorAll('.skin-dot').forEach(function(d) {
      d.classList.toggle('active', d.dataset.skin === skin);
    });
  }

  // ═══════════════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════════════

  function infoCard(title, content, extra) {
    return '<div class="info-card"><h3>' + title + '</h3><p>' + (content || '') + '</p>' + (extra || '') + '</div>';
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  function nl2br(s) { return (s || '').replace(/\n/g, '<br>'); }
  function today() { return new Date().toISOString().slice(0, 10); }

  function fmtTime(t) {
    if (!t) return '';
    try {
      var d = new Date(t.replace(' ', 'T'));
      var now = new Date();
      var diff = now - d;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
      if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
      if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
      return d.toLocaleDateString();
    } catch(e) { return t; }
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show';
    setTimeout(function() { el.className = 'toast'; }, 3000);
  }

  // ═══════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════

  function init() {
    // Apply saved skin
    setSkin(SKIN);

    // Check if already logged in
    if (TOKEN && USER) {
      // Verify session is still valid
      api('me').then(function(d) {
        if (d.ok) {
          enterApp();
        } else {
          logout();
        }
      });
    }

    // Load parking buildings for booking form
    api('parking-buildings').then(function(d) {
      var sel = document.getElementById('pkBuilding');
      if (!sel || !Array.isArray(d)) return;
      d.forEach(function(b) {
        var opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = b.name;
        sel.appendChild(opt);
      });
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function() {});
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── PUBLIC API ──
  return {
    authTab: authTab,
    login: login,
    guestAccess: guestAccess,
    logout: logout,
    showScreen: showScreen,
    goBack: goBack,
    navTo: navTo,
    addMaintPhotos: addMaintPhotos,
    submitMaintenance: submitMaintenance,
    openMaintDetail: openMaintDetail,
    sendChat: sendChat,
    loadParkingPlans: loadParkingPlans,
    selectPlan: selectPlan,
    bookParking: bookParking,
    confirmPickup: confirmPickup,
    openForm: openForm,
    signForm: signForm,
    selectPayMethod: selectPayMethod,
    processPayment: processPayment,
    aiAsk: aiAsk,
    readNotif: readNotif,
    readAllNotifs: readAllNotifs,
    setSkin: setSkin,
    toast: toast
  };

})();
