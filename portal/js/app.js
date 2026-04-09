/* ═══════════════════════════════════════════════════
   WILLOW RESIDENT APP — Frontend App
   Vanilla JS SPA — all routing, auth, pages
   app.willowpa.com
   ═══════════════════════════════════════════════════ */

window.PL = (function() {

  // ── CONFIG ──
  var API = 'api/index.php';
  var DEMO_MODE = (location.protocol === 'file:' || !location.hostname || location.hostname === 'localhost');
  var TOKEN = localStorage.getItem('pl_token') || '';
  var USER  = JSON.parse(localStorage.getItem('pl_user') || 'null');
  var SKIN  = localStorage.getItem('pl_skin') || 'a';

  // ── SUPABASE DIRECT (for live data in demo mode) ──
  var SB_URL = 'https://iwohrvkcodqvyoooxzmt.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2hydmtjb2Rxdnlvb294em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTM3OTksImV4cCI6MjA4OTg2OTc5OX0.PhKo6XiXf-VTBWcYkhT_vfHi0ibftNmYaqm4RApxO6Y';

  // ── Expose config globally so messages.js can create its own Supabase client ──
  window.CONFIG = { SB_URL: SB_URL, SB_KEY: SB_KEY };

  // ── PAGE HISTORY ──
  var _history = [];
  var _currentPage = 'dashboard';

  // ── PERMISSIONS BY USER TYPE ──
  // forms available to all authenticated users; limited = maint + parking + forms only
  var FEATURES = {
    'short-term':   ['checkin','checkout','forms','parking','maintenance','messages','packages','payments','info','ai'],
    'short-stay':   ['checkin','checkout','forms','parking','maintenance','messages','packages','payments','info','ai'],
    'month-to-month':['forms','parking','maintenance','messages','packages','payments','info','ai'],
    'long-term':    ['forms','parking','maintenance','messages','packages','payments','info','ai'],
    'limited':      ['forms','maintenance','parking']
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
      'guest1234': { user_type:'short-term', name:'Guest User',     unit:'311', phone:'2670001234', email:'guest@test.com',rent:800,  balance:75,  due:'',           lease_end:'',           checkin:'2026-04-05' },
      // Short-term guests — lastname + last 4 digits of phone
      'odonnell0337':  { user_type:'short-term', name:'Richard ODonnell',  unit:'926-1',       phone:'4046260337', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-01-13' },
      'kacillas4712':  { user_type:'short-term', name:'Maureen Kacillas',  unit:'1BR 46-206',  phone:'5705924712', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-02-24' },
      'masalta7092':   { user_type:'short-term', name:'Joe Masalta',       unit:'2BR 46-210',  phone:'2676447092', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-01' },
      'shaaban5616':   { user_type:'short-term', name:'Hider Shaaban',     unit:'Montgomery 5B', phone:'2157895616', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-08' },
      'pereira6929':   { user_type:'short-term', name:'Gabrielle Pereira', unit:'926-2',       phone:'2039196929', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-13' },
      'holoborodko3971':{ user_type:'short-term', name:'Tetiana Holoborodko', unit:'1BR 46-330', phone:'380674923971', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-14' },
      'reyes3856':     { user_type:'short-term', name:'Damaris Suyapa Bejarano Reyes', unit:'2BR 46-112', phone:'7132533856', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-17' },
      'freedman5061':  { user_type:'short-term', name:'Avi Freedman',      unit:'2BR 46-318',  phone:'2679945061', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-27' },
      'cheeseboro2598':{ user_type:'short-term', name:'Anaya Cheeseboro', unit:'1BR 46-331',  phone:'2674382598', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-27' },
      'willoughby5655':{ user_type:'short-term', name:'Nicholas Willoughby', unit:'A1 Valley Rd', phone:'9043295655', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-03-29' },
      'petriieva9745': { user_type:'short-term', name:'Olena Petriieva',   unit:'1BR 46-128',  phone:'7737549745', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-04-08' },
      // Also allow simple first names for easy testing
      'richard':   { user_type:'short-term', name:'Richard ODonnell', unit:'926-1', phone:'4046260337', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-01-13' },
      'maureen':   { user_type:'short-term', name:'Maureen Kacillas', unit:'1BR 46-206', phone:'5705924712', email:'', rent:0, balance:0, due:'', lease_end:'', checkin:'2026-02-24' }
    },
    parking_buildings: [
      { id:'bld_1', name:'46 Township Line RD - Chelbourne Plaza', address:'46 Township Line RD', per_day:2.5, minimum_cost:7, free:0, plans:[{id:'plan_1a',name:'10 days',days:10,price:24},{id:'plan_1b',name:'20 days',days:20,price:46},{id:'plan_1c',name:'30 days',days:30,price:64},{id:'plan_1d',name:'60 days',days:60,price:125}] },
      { id:'bld_2', name:'431 Valley RD', address:'431 Valley RD', per_day:2.5, minimum_cost:7, free:0, plans:[{id:'plan_2a',name:'7 days',days:7,price:15},{id:'plan_2b',name:'30 days',days:30,price:70}] },
      { id:'bld_3', name:'278 N. Keswick', address:'278 N. Keswick', per_day:0.5, minimum_cost:2, free:0, plans:[] },
      { id:'bld_4', name:'7845 Montgomery', address:'7845 Montgomery', per_day:2, minimum_cost:5, free:0, plans:[{id:'plan_4a',name:'30 days',days:30,price:60}] }
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
    message_threads: [
      { id:'thr_001', unit:'225', subject:'Welcome to Chelbourne Plaza!', source:'management', last_message:'Feel free to reach out if you need anything.', last_time:'2026-04-05 10:00:00', unread:1, messages:[
        {from:'admin',name:'Willow Management',text:'Welcome to Chelbourne Plaza! We hope you enjoy your stay. Your unit is all set up and ready.', time:'2026-04-05 09:30:00'},
        {from:'admin',name:'Willow Management',text:'Feel free to reach out if you need anything.', time:'2026-04-05 10:00:00'}
      ]},
      { id:'thr_002', unit:'225', subject:'Parking Question', source:'tenant', last_message:'Yes, visitor spots are in the rear lot marked in yellow.', last_time:'2026-04-03 14:20:00', unread:0, messages:[
        {from:'tenant',name:'Test User',text:'Hi, where can my guests park when visiting?', time:'2026-04-03 14:00:00'},
        {from:'admin',name:'Willow Management',text:'Yes, visitor spots are in the rear lot marked in yellow.', time:'2026-04-03 14:20:00'}
      ]},
      { id:'thr_003', unit:'103', subject:'Lease Renewal Reminder', source:'management', last_message:'Your lease is up for renewal in June. Let us know if you have questions.', last_time:'2026-04-01 09:00:00', unread:1, messages:[
        {from:'admin',name:'Willow Management',text:'Your lease is up for renewal in June. Let us know if you have questions.', time:'2026-04-01 09:00:00'}
      ]}
    ],
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
        if (!usr) return Promise.resolve({error:'Invalid credentials. Use your lastname + last 4 digits of phone (e.g. odonnell0337)'});
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
        if (bid) bid = bid.split('&')[0];
        var bld = DEMO.parking_buildings.find(function(b){return b.id===bid;});
        return Promise.resolve(bld ? {plans:bld.plans, per_day:bld.per_day||0, minimum_cost:bld.minimum_cost||0, free:bld.free||0, max_days:25} : {plans:[], per_day:0, minimum_cost:0, free:0, max_days:25});

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

      case 'messages-list':
        return sbLoadMessages(unit, u).then(function(threads){
          return threads;
        }).catch(function(){
          return DEMO.message_threads.filter(function(t){ return t.unit===unit; });
        });

      case 'messages-thread':
        var threadId = (body||{}).thread_id || '';
        return sbLoadThread(threadId).catch(function(){
          var t = DEMO.message_threads.find(function(x){ return x.id===threadId; });
          return t || {id:threadId, messages:[]};
        });

      case 'messages-send':
        var tid = (body||{}).thread_id || '';
        var msgText = (body||{}).message || '';
        return sbSendMessage(tid, msgText, unit, u).then(function(r){ return r; }).catch(function(){
          var thread = DEMO.message_threads.find(function(x){ return x.id===tid; });
          if(!thread){
            thread = {id:'thr_'+Date.now(), unit:unit, subject:'New conversation', source:'tenant', messages:[], created:new Date().toISOString()};
            DEMO.message_threads.push(thread);
            tid = thread.id;
          }
          thread.messages.push({from:'tenant', name:u.name||'You', text:msgText, time:new Date().toISOString().replace('T',' ').slice(0,19)});
          thread.last_message = msgText;
          thread.last_time = new Date().toISOString();
          return {ok:true, thread_id:tid};
        });

      case 'messages-new':
        var subject = (body||{}).subject || 'New message';
        var newMsg = (body||{}).message || '';
        return sbCreateThread(unit, u, subject, newMsg).catch(function(){
          var nt = {id:'thr_'+Date.now(), unit:unit, subject:subject, source:'tenant', last_message:newMsg, last_time:new Date().toISOString(), unread:0, messages:[{from:'tenant', name:u.name||'You', text:newMsg, time:new Date().toISOString().replace('T',' ').slice(0,19)}], created:new Date().toISOString()};
          DEMO.message_threads.push(nt);
          return {ok:true, thread_id:nt.id};
        });

      case 'forms':
        var ut = u.user_type || 'short-term';
        var myForms = DEMO.forms.filter(function(f){return f.for_types.indexOf(ut)>=0;});
        // Check agreement status from localStorage
        var localAg = null;
        try { localAg = JSON.parse(localStorage.getItem('pl_agreement_accepted') || 'null'); } catch(e) {}
        // Check pre-arrival status from localStorage
        var localPA = null;
        try { localPA = JSON.parse(localStorage.getItem('pl_prearrival_submitted') || 'null'); } catch(e) {}
        myForms.forEach(function(f){
          if (f.type === 'lease' && localAg && localAg.accepted) { f.signed = true; f.status = 'approved'; }
        });
        // Build forms list with statuses for the loadForms() renderer
        var formsList = [
          { id: 'pre-arrival', title: 'Pre-Arrival Form', description: 'Complete your pre-arrival information and ID verification.', status: (localPA ? localPA.status : 'pending') },
          { id: 'agreement', title: 'Rental Agreement', description: 'Review and sign your rental agreement.', status: (localAg && localAg.accepted ? 'approved' : 'pending') }
        ];
        return Promise.resolve({ forms: formsList });

      case 'form-detail':
        // Handle type=agreement requests from openAgreement()
        if (action.indexOf('type=agreement') !== -1) {
          var localAg2 = null;
          try { localAg2 = JSON.parse(localStorage.getItem('pl_agreement_accepted') || 'null'); } catch(e2) {}
          return Promise.resolve({
            template_id: 'agreement_001',
            title: 'Rental Agreement',
            text: 'By signing below you agree to the terms and conditions of your rental agreement, including all house rules, payment schedules, and property guidelines.',
            prefill: { first: (localAg2 && localAg2.name ? localAg2.name.split(' ')[0] : ''), last: (localAg2 && localAg2.name ? localAg2.name.split(' ').slice(1).join(' ') : ''), email: (localAg2 ? localAg2.email : '') },
            form: { guest_postal_code: (localAg2 ? localAg2.postal_code : '') },
            accepted: (localAg2 ? localAg2.accepted : false),
            accepted_at: (localAg2 ? localAg2.accepted_at : null)
          });
        }
        // Handle type=pre-arrival requests from openPreArrival()
        if (action.indexOf('type=pre-arrival') !== -1) {
          var localPA2 = null;
          try { localPA2 = JSON.parse(localStorage.getItem('pl_prearrival_submitted') || 'null'); } catch(e3) {}
          var paUser = USER || {};
          return Promise.resolve({
            prefill: { first: (localPA2 ? localPA2.guest_first : '') || (paUser.name ? paUser.name.split(' ')[0] : ''), last: (localPA2 ? localPA2.guest_last : '') || (paUser.name ? paUser.name.split(' ').slice(1).join(' ') : ''), email: (localPA2 ? localPA2.guest_email : '') || paUser.email || '', phone: (localPA2 ? localPA2.guest_phone : '') || paUser.phone || '' },
            form: localPA2 ? { gov_id_country: localPA2.gov_id_country, gov_id_number: localPA2.gov_id_number, num_guests: localPA2.num_guests, additional_adult_name: localPA2.additional_adult_name, additional_adult_phone: localPA2.additional_adult_phone, vehicle_info: localPA2.vehicle_info, additional_guests: localPA2.additional_guests, id_file_name: localPA2.id_file_name, pre_arrival_status: localPA2.status, submitted_at: localPA2.submitted_at } : null
          });
        }
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
      .then(function(r) {
        if (!r.ok) console.error('API error:', action, r.status, r.statusText);
        return r.json();
      })
      .then(function(d) {
        if (d && d.error) {
          console.warn('API returned error:', action, d.error, d.detail || '');
          // If PHP doesn't know the action, fall back to Supabase/demo
          if (d.error === 'Unknown action' || d.error === 'unknown_action') {
            return demoApi(action, method, body);
          }
        }
        return d;
      })
      .catch(function(e) {
        console.error('API fetch failed:', action, e);
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
    var appShell = document.getElementById('appShell');
    if (appShell) appShell.style.display = 'none';
    var authScreen = document.getElementById('authScreen');
    if (authScreen) authScreen.className = 'screen active';
    var loginUser = document.getElementById('loginUser');
    if (loginUser) loginUser.value = '';
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
      formDetail:'Agreement', preArrival:'Pre-Arrival Form', agreement:'Rental Agreement', settings:'Settings'
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

    // Stop message polling when navigating away from messages
    if (name !== 'messages' && name !== 'messageThread') {
      _stopMsgPoll();
      _currentThreadId = null;
    }

    // Load page data
    if (name === 'dashboard') loadDashboard();
    else if (name === 'checkin') loadCheckin();
    else if (name === 'checkout') loadCheckout();
    else if (name === 'forms') loadForms();
    else if (name === 'preArrival') { /* loaded by openPreArrival */ }
    else if (name === 'agreement') { /* loaded by openAgreement */ }
    else if (name === 'parking') loadParking();
    else if (name === 'maintenance') loadMaintenance();
    else if (name === 'maintenanceNew') initMaintForm();
    else if (name === 'messages') loadMessages();
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
    var unitLabel = USER.unit || USER.apt || '';
    document.getElementById('dashName').textContent = 'Hi, ' + (USER.name || '').split(' ')[0] + (unitLabel ? ' — Unit ' + unitLabel : '');

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
    // Check the gate first — forms must be approved + time must be right
    api('checkin-gate').then(function(gate) {
      if (!gate.can_access) {
        var gateHtml = '<div class="info-card" style="text-align:center;padding:32px">' +
          '<div style="font-size:48px;margin-bottom:16px">🔒</div>' +
          '<h3 style="margin-bottom:8px">Check-In Locked</h3>' +
          '<p style="color:var(--text3)">' + esc(gate.reason || 'Check-in info is not yet available.') + '</p>';
        if (gate.form_status && (gate.form_status.pre_arrival === 'pending' || gate.form_status.agreement === 'pending' || gate.form_status.id_upload === 'pending')) {
          gateHtml += '<button class="btn-primary" style="margin-top:16px" onclick="PL.showScreen(\'forms\')">Complete Forms</button>';
        }
        gateHtml += '</div>';
        document.getElementById('checkinContent').innerHTML = gateHtml;
        return;
      }
      // Gate passed — load checkin info
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

  var _idFile = null;
  var _agreementTemplateId = null;
  var _checkinGateData = null;

  function loadForms() {
    api('forms').then(function(d) {
      var el = document.getElementById('formsList');
      if (!el) return;
      if (d.error) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>No Forms</h3><p>' + esc(d.error) + '</p></div>';
        return;
      }

      var forms = d.forms || [];
      if (forms.length === 0) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><h3>No Forms</h3><p>You have no pending forms or agreements.</p></div>';
        return;
      }

      // Store gate data for checkin
      _checkinGateData = d;

      var html = '';
      forms.forEach(function(f) {
        var icon = '📝';
        var statusClass = 'tag-warning';
        var statusText = 'Pending';
        if (f.status === 'submitted') { statusClass = 'tag-info'; statusText = 'Submitted'; icon = '📤'; }
        else if (f.status === 'approved') { statusClass = 'tag-success'; statusText = 'Approved'; icon = '✅'; }
        else if (f.status === 'rejected') { statusClass = 'tag-danger'; statusText = 'Needs Revision'; icon = '❌'; }

        html += '<div class="form-card" onclick="PL.openForm(\'' + f.id + '\')">' +
          '<div class="fc-icon">' + icon + '</div>' +
          '<div class="fc-body"><h4>' + esc(f.title) + '</h4><p>' + esc(f.description || '') + '</p></div>' +
          '<div class="fc-status"><span class="dash-card-tag ' + statusClass + '">' + statusText + '</span></div>' +
          '</div>';
      });
      el.innerHTML = html;
    });
  }

  function openForm(id) {
    if (id === 'pre-arrival') {
      openPreArrival();
    } else if (id === 'agreement') {
      openAgreement();
    }
  }

  // ── PRE-ARRIVAL FORM ──

  function openPreArrival() {
    // Check localStorage first — source of truth for lock state
    var localPA = null;
    try { localPA = JSON.parse(localStorage.getItem('pl_prearrival_submitted') || 'null'); } catch(e) {}

    api('form-detail&type=pre-arrival').then(function(d) {
      if (!d || d.error) d = {};

      // Prefill fields from API
      var pf = d.prefill || {};
      var el;
      el = document.getElementById('paFirstName'); if (el && el.tagName === 'INPUT') el.value = pf.first || (localPA ? localPA.guest_first : '') || '';
      el = document.getElementById('paLastName'); if (el && el.tagName === 'INPUT') el.value = pf.last || (localPA ? localPA.guest_last : '') || '';
      el = document.getElementById('paEmail'); if (el && el.tagName === 'INPUT') el.value = pf.email || (localPA ? localPA.guest_email : '') || '';
      el = document.getElementById('paPhone'); if (el && el.tagName === 'INPUT') el.value = pf.phone || (localPA ? localPA.guest_phone : '') || '';

      // Prefill from existing form data (API or localStorage)
      var f = d.form || (localPA ? localPA : null);
      if (f) {
        el = document.getElementById('paIdCountry'); if (el && el.tagName === 'SELECT') el.value = f.gov_id_country || 'US';
        el = document.getElementById('paIdNumber'); if (el && el.tagName === 'INPUT') el.value = f.gov_id_number || '';
        el = document.getElementById('paNumGuests'); if (el && el.tagName === 'SELECT') { el.value = f.num_guests || 2; updateGuestFields(); }
        el = document.getElementById('paAddAdultName'); if (el && el.tagName === 'INPUT') el.value = f.additional_adult_name || '';
        el = document.getElementById('paAddAdultPhone'); if (el && el.tagName === 'INPUT') el.value = f.additional_adult_phone || '';
        el = document.getElementById('paVehicle'); if (el && el.tagName === 'INPUT') el.value = f.vehicle_info || '';

        if (f.id_file_name) {
          var fn = document.getElementById('idFileName');
          if (fn) { fn.textContent = '✅ ' + f.id_file_name; fn.style.display = ''; }
        }

        if (f.additional_guests) {
          try {
            var guests = typeof f.additional_guests === 'string' ? JSON.parse(f.additional_guests) : f.additional_guests;
            setTimeout(function() {
              guests.forEach(function(g, i) {
                var fi = document.getElementById('guestFirst_' + (i + 2));
                var li = document.getElementById('guestLast_' + (i + 2));
                if (fi) fi.value = g.first || '';
                if (li) li.value = g.last || '';
              });
            }, 100);
          } catch(e) {}
        }
      }

      // Determine lock status
      var paStatus = (d.form && d.form.pre_arrival_status) || (localPA ? localPA.status : '') || 'pending';
      var isLocked = (paStatus === 'submitted' || paStatus === 'approved');
      var isReturned = (paStatus === 'returned' || paStatus === 'rejected');
      var submittedAt = (d.form && d.form.submitted_at) || (localPA ? localPA.submitted_at : null);

      var btn = document.getElementById('paSubmitBtn');
      var submittedBanner = document.getElementById('paAlreadySubmitted');
      var submittedDate = document.getElementById('paSubmittedDate');
      var uploadArea = document.getElementById('idUploadArea');

      // All pre-arrival field IDs (inputs, selects)
      var paFields = ['paFirstName', 'paLastName', 'paEmail', 'paPhone', 'paIdCountry', 'paIdNumber', 'paNumGuests', 'paAddAdultName', 'paAddAdultPhone', 'paVehicle'];

      if (isLocked) {
        // --- LOCKED: replace inputs with plain text ---
        if (btn) btn.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'none';
        if (submittedBanner) {
          submittedBanner.style.display = '';
          if (submittedDate && submittedAt) submittedDate.textContent = 'Submitted on ' + new Date(submittedAt).toLocaleString();
        }
        // Replace all editable fields with plain text divs
        paFields.forEach(function(fid) {
          var field = document.getElementById(fid);
          if (field && (field.tagName === 'INPUT' || field.tagName === 'SELECT' || field.tagName === 'TEXTAREA')) {
            var val = '';
            if (field.tagName === 'SELECT') {
              val = field.options[field.selectedIndex] ? field.options[field.selectedIndex].text : field.value;
            } else {
              val = field.value || '';
            }
            var span = document.createElement('div');
            span.style.cssText = 'padding:12px 14px;background:#f3f4f6;border-radius:8px;font-size:14px;color:#1a1a1a;border:1px solid #e5e7eb;user-select:none;';
            span.textContent = val || '—';
            field.parentNode.replaceChild(span, field);
          }
        });
        // Also lock any dynamically created guest fields
        setTimeout(function() {
          var guestContainer = document.getElementById('additionalGuestFields');
          if (guestContainer) {
            var inputs = guestContainer.querySelectorAll('input');
            for (var gi = 0; gi < inputs.length; gi++) {
              var gInput = inputs[gi];
              var gSpan = document.createElement('div');
              gSpan.style.cssText = 'padding:12px 14px;background:#f3f4f6;border-radius:8px;font-size:14px;color:#1a1a1a;border:1px solid #e5e7eb;user-select:none;';
              gSpan.textContent = gInput.value || '—';
              gInput.parentNode.replaceChild(gSpan, gInput);
            }
          }
        }, 150);
      } else if (isReturned) {
        // --- RETURNED: allow editing, show resubmit ---
        if (btn) { btn.style.display = ''; btn.textContent = 'Resubmit Pre-Arrival Form'; }
        if (uploadArea) uploadArea.style.display = '';
        if (submittedBanner) submittedBanner.style.display = 'none';
      } else {
        // --- PENDING: normal editable ---
        if (btn) { btn.style.display = ''; btn.textContent = 'Submit Pre-Arrival Form'; }
        if (uploadArea) uploadArea.style.display = '';
        if (submittedBanner) submittedBanner.style.display = 'none';
      }

      _idFile = null;
      showScreen('preArrival');
    }).catch(function() {
      // Even on total API failure, still lock if localStorage says submitted
      var isLocked2 = localPA && (localPA.status === 'submitted' || localPA.status === 'approved');
      var btn = document.getElementById('paSubmitBtn');
      var submittedBanner = document.getElementById('paAlreadySubmitted');
      var uploadArea = document.getElementById('idUploadArea');
      var paFields = ['paFirstName', 'paLastName', 'paEmail', 'paPhone', 'paIdCountry', 'paIdNumber', 'paNumGuests', 'paAddAdultName', 'paAddAdultPhone', 'paVehicle'];
      if (isLocked2) {
        if (btn) btn.style.display = 'none';
        if (uploadArea) uploadArea.style.display = 'none';
        if (submittedBanner) submittedBanner.style.display = '';
        paFields.forEach(function(fid) {
          var field = document.getElementById(fid);
          if (field && (field.tagName === 'INPUT' || field.tagName === 'SELECT')) {
            var span = document.createElement('div');
            span.style.cssText = 'padding:12px 14px;background:#f3f4f6;border-radius:8px;font-size:14px;color:#1a1a1a;border:1px solid #e5e7eb;user-select:none;';
            span.textContent = field.value || '—';
            field.parentNode.replaceChild(span, field);
          }
        });
      }
      showScreen('preArrival');
    });
  }

  function updateGuestFields() {
    var n = parseInt(document.getElementById('paNumGuests').value) || 1;
    var el = document.getElementById('additionalGuestFields');
    if (!el) return;
    var html = '';
    for (var i = 2; i <= n; i++) {
      html += '<div style="margin-top:12px"><p style="font-weight:600;font-size:14px;margin-bottom:8px">Guest ' + i + '</p>' +
        '<div class="form-group"><label>First Name *</label><input type="text" id="guestFirst_' + i + '" placeholder="First name"></div>' +
        '<div class="form-group"><label>Last Name *</label><input type="text" id="guestLast_' + i + '" placeholder="Last name"></div></div>';
    }
    el.innerHTML = html;
  }

  function handleIdFile(input) {
    if (input.files && input.files[0]) {
      _idFile = input.files[0];
      var fn = document.getElementById('idFileName');
      if (fn) {
        fn.textContent = '📎 ' + _idFile.name;
        fn.style.display = '';
      }
      document.getElementById('idUploadArea').style.borderColor = 'var(--success)';
    }
  }

  function submitPreArrival() {
    var first = (document.getElementById('paFirstName').value || '').trim();
    var last = (document.getElementById('paLastName').value || '').trim();
    var email = (document.getElementById('paEmail').value || '').trim();
    var phone = (document.getElementById('paPhone').value || '').trim();
    var idCountry = document.getElementById('paIdCountry').value || 'US';
    var idNumber = (document.getElementById('paIdNumber').value || '').trim();
    var numGuests = parseInt(document.getElementById('paNumGuests').value) || 1;
    var addName = (document.getElementById('paAddAdultName').value || '').trim();
    var addPhone = (document.getElementById('paAddAdultPhone').value || '').trim();
    var vehicle = (document.getElementById('paVehicle').value || '').trim();

    var errEl = document.getElementById('paError');
    if (errEl) errEl.className = 'auth-error';

    if (!first || !last || !phone || !email) {
      if (errEl) { errEl.textContent = 'Please fill in all required fields (name, phone, email)'; errEl.className = 'auth-error show'; }
      return;
    }
    if (!idNumber) {
      if (errEl) { errEl.textContent = 'Please enter your Government ID number'; errEl.className = 'auth-error show'; }
      return;
    }

    // Collect additional guests
    var addGuests = [];
    for (var i = 2; i <= numGuests; i++) {
      var gf = (document.getElementById('guestFirst_' + i) || {}).value || '';
      var gl = (document.getElementById('guestLast_' + i) || {}).value || '';
      if (gf.trim() || gl.trim()) addGuests.push({ first: gf.trim(), last: gl.trim() });
    }

    var btn = document.getElementById('paSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

    // Step 1: Upload ID file if selected
    var uploadPromise = Promise.resolve();
    if (_idFile) {
      uploadPromise = apiUpload('upload-id', (function() {
        var fd = new FormData();
        fd.append('id_file', _idFile);
        return fd;
      })());
    }

    uploadPromise.then(function(uploadResult) {
      // Step 2: Submit form data
      return api('submit-pre-arrival', 'POST', {
        guest_first: first,
        guest_last: last,
        guest_email: email,
        guest_phone: phone,
        gov_id_country: idCountry,
        gov_id_number: idNumber,
        num_guests: numGuests,
        additional_guests: addGuests,
        additional_adult_name: addName,
        additional_adult_phone: addPhone,
        vehicle_info: vehicle
      });
    }).then(function(d) {
      if (btn) { btn.disabled = false; }
      if (d.error) {
        if (btn) btn.textContent = 'Submit Pre-Arrival Form';
        if (errEl) { errEl.textContent = d.error; errEl.className = 'auth-error show'; }
        return;
      }
      // Save submitted state to localStorage — form will be locked on next open
      localStorage.setItem('pl_prearrival_submitted', JSON.stringify({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        guest_first: first,
        guest_last: last,
        guest_email: email,
        guest_phone: phone,
        gov_id_country: idCountry,
        gov_id_number: idNumber,
        num_guests: numGuests,
        additional_guests: addGuests,
        additional_adult_name: addName,
        additional_adult_phone: addPhone,
        vehicle_info: vehicle,
        id_file_name: (_idFile ? _idFile.name : '')
      }));
      toast('Pre-Arrival form submitted!');
      showScreen('forms');
    }).catch(function(e) {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Pre-Arrival Form'; }
      if (errEl) { errEl.textContent = 'Error saving form. Please try again.'; errEl.className = 'auth-error show'; }
    });
  }

  // ── RENTAL AGREEMENT ──

  function openAgreement() {
    // Always check localStorage FIRST — this is the source of truth for lock state
    var localAg = null;
    try { localAg = JSON.parse(localStorage.getItem('pl_agreement_accepted') || 'null'); } catch(e) {}

    api('form-detail&type=agreement').then(function(d) {
      // Don't exit on error — still show the form (possibly locked)
      if (!d || d.error) d = {};

      _agreementTemplateId = d.template_id || 'agreement_001';

      // Set title
      var titleEl = document.getElementById('agreementTitle');
      if (titleEl) titleEl.textContent = d.title || 'Rental Agreement';

      // Set agreement text
      var textEl = document.getElementById('agreementText');
      if (textEl) textEl.textContent = d.text || 'By signing below you agree to the terms and conditions of your rental agreement.';

      // Prefill from API or localStorage
      var pf = d.prefill || {};
      var el;
      el = document.getElementById('agFirstName');
      if (el) el.value = pf.first || (localAg && localAg.name ? localAg.name.split(' ')[0] : '') || '';
      el = document.getElementById('agLastName');
      if (el) el.value = pf.last || (localAg && localAg.name ? localAg.name.split(' ').slice(1).join(' ') : '') || '';
      el = document.getElementById('agEmail');
      if (el) el.value = pf.email || (localAg ? localAg.email : '') || '';

      var f = d.form;
      if (f && f.guest_postal_code) {
        el = document.getElementById('agPostalCode'); if (el) el.value = f.guest_postal_code || '';
      } else if (localAg && localAg.postal_code) {
        el = document.getElementById('agPostalCode'); if (el) el.value = localAg.postal_code;
      }

      // Check if already accepted — from API or localStorage
      var isAccepted = d.accepted || (localAg && localAg.accepted);
      var acceptedAt = d.accepted_at || (localAg ? localAg.accepted_at : null);

      var btn = document.getElementById('agSubmitBtn');
      var signed = document.getElementById('agAlreadySigned');
      var cb = document.getElementById('agAccept');
      var formFields = ['agFirstName', 'agLastName', 'agEmail', 'agPostalCode'];
      if (isAccepted) {
        if (btn) btn.style.display = 'none';
        if (cb) cb.parentElement.style.display = 'none';
        if (signed) {
          signed.style.display = '';
          var dt = document.getElementById('agSignedDate');
          if (dt && acceptedAt) dt.textContent = 'Accepted on ' + new Date(acceptedAt).toLocaleString();
        }
        // Replace input fields with plain text — no editing possible
        formFields.forEach(function(fid) {
          var field = document.getElementById(fid);
          if (field && field.tagName === 'INPUT') {
            var val = field.value || '';
            var span = document.createElement('div');
            span.style.cssText = 'padding:12px 14px;background:#f3f4f6;border-radius:8px;font-size:14px;color:#1a1a1a;border:1px solid #e5e7eb;user-select:none;';
            span.textContent = val || '—';
            field.parentNode.replaceChild(span, field);
          }
        });
      } else {
        if (btn) btn.style.display = '';
        if (cb) { cb.checked = false; cb.parentElement.style.display = ''; }
        if (signed) signed.style.display = 'none';
        formFields.forEach(function(fid) {
          var field = document.getElementById(fid);
          if (field) { field.readOnly = false; field.disabled = false; field.style.opacity = ''; field.style.cursor = ''; }
        });
      }

      showScreen('agreement');
    }).catch(function() {
      // Even if API completely fails, still show form with lock if localStorage says accepted
      var isAccepted2 = localAg && localAg.accepted;
      var titleEl = document.getElementById('agreementTitle');
      if (titleEl) titleEl.textContent = 'Rental Agreement';
      var btn = document.getElementById('agSubmitBtn');
      var signed = document.getElementById('agAlreadySigned');
      var cb = document.getElementById('agAccept');
      var formFields = ['agFirstName', 'agLastName', 'agEmail', 'agPostalCode'];
      if (isAccepted2) {
        if (btn) btn.style.display = 'none';
        if (cb) cb.parentElement.style.display = 'none';
        if (signed) signed.style.display = '';
        formFields.forEach(function(fid) {
          var field = document.getElementById(fid);
          if (field && field.tagName === 'INPUT') {
            var val = field.value || (fid === 'agEmail' ? localAg.email : '') || '';
            var span = document.createElement('div');
            span.style.cssText = 'padding:12px 14px;background:#f3f4f6;border-radius:8px;font-size:14px;color:#1a1a1a;border:1px solid #e5e7eb;user-select:none;';
            span.textContent = val || '—';
            field.parentNode.replaceChild(span, field);
          }
        });
      }
      showScreen('agreement');
    });
  }

  function submitAgreement() {
    var cb = document.getElementById('agAccept');
    if (!cb || !cb.checked) { toast('Please accept the terms and conditions'); return; }

    var postal = (document.getElementById('agPostalCode').value || '').trim();
    var email = (document.getElementById('agEmail').value || '').trim();
    if (!postal) { toast('Please enter your postal code'); return; }

    var errEl = document.getElementById('agError');
    var btn = document.getElementById('agSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

    api('submit-agreement', 'POST', {
      template_id: _agreementTemplateId,
      postal_code: postal,
      email: email
    }).then(function(d) {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Agreement'; }
      if (d.error) {
        if (errEl) { errEl.textContent = d.error; errEl.className = 'auth-error show'; }
        return;
      }
      // Save acceptance to localStorage so form stays locked
      var user = getUser();
      localStorage.setItem('pl_agreement_accepted', JSON.stringify({
        accepted: true,
        accepted_at: new Date().toISOString(),
        name: (user.name || ''),
        email: email,
        postal_code: postal
      }));
      toast('Agreement accepted!');
      showScreen('forms');
    }).catch(function() {
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Agreement'; }
    });
  }

  // ── CHECK-IN GATE ──

  function checkCheckinGate() {
    return api('checkin-gate').then(function(d) {
      _checkinGateData = d;
      return d;
    });
  }

  // Legacy compat
  function signForm(id) { openForm(id); }

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

  // ── Calendar state for maintenance form ──
  var _maintCalYear, _maintCalMonth;
  var _maintSelectedDate = '';
  var _maintSelectedSlot = '';
  var _maintPhotoData = null;

  function initMaintForm() {
    var now = new Date();
    _maintCalYear = now.getFullYear();
    _maintCalMonth = now.getMonth();
    _maintSelectedDate = '';
    _maintSelectedSlot = '';
    _maintPhotoData = null;
    renderMaintCalendar();
    updateMaintSmsVisibility();

    // Show/hide guest fields based on auth
    var gf = document.getElementById('maintGuestFields');
    if (gf) gf.style.display = USER ? 'none' : 'block';

    // Reset form
    document.getElementById('maintDesc').value = '';
    document.getElementById('maintBlock').value = '';
    var preview = document.getElementById('maintPhotoPreview');
    if (preview) { preview.style.display = 'none'; }
    var ptxt = document.getElementById('maintPhotoText');
    if (ptxt) ptxt.textContent = 'Tap to take a photo or choose from gallery';
    var radios = document.querySelectorAll('input[name="maintUrg"]');
    radios.forEach(function(r) { r.checked = r.value === 'normal'; });
    var cb = document.getElementById('maintNoAccess'); if (cb) cb.checked = false;
    var cp = document.getElementById('maintPermission'); if (cp) cp.checked = false;
    var sc = document.getElementById('maintSmsConsent'); if (sc) sc.checked = false;
    var wa = document.getElementById('maintWaiverAgree'); if (wa) wa.checked = false;
    var wb = document.getElementById('maintWaiverBlock'); if (wb) wb.style.display = 'none';
    updateMaintCheckboxStyles();
  }

  function renderMaintCalendar() {
    var container = document.getElementById('maintCalContainer');
    if (!container) return;
    var now = new Date();
    var todayStr = formatMaintDate(now);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var html = '<div style="margin-top:4px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'
      + '<button type="button" onclick="PL.maintCalPrev()" style="background:none;border:1px solid #e5e7eb;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:16px;color:#374151;display:flex;align-items:center;justify-content:center">‹</button>'
      + '<span style="font-size:15px;font-weight:600;color:#374151">' + months[_maintCalMonth] + ' ' + _maintCalYear + '</span>'
      + '<button type="button" onclick="PL.maintCalNext()" style="background:none;border:1px solid #e5e7eb;border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:16px;color:#374151;display:flex;align-items:center;justify-content:center">›</button>'
      + '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">';
    var dows = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    for (var i = 0; i < 7; i++) html += '<div style="text-align:center;font-size:10px;font-weight:600;color:#9ca3af;padding:4px 0">' + dows[i] + '</div>';

    var firstDay = new Date(_maintCalYear, _maintCalMonth, 1).getDay();
    var daysInMonth = new Date(_maintCalYear, _maintCalMonth + 1, 0).getDate();

    for (var e = 0; e < firstDay; e++) html += '<div style="aspect-ratio:1"></div>';

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(_maintCalYear, _maintCalMonth, d);
      var ds = formatMaintDate(date);
      var isPast = ds < todayStr;
      var isWknd = date.getDay() === 0 || date.getDay() === 6;
      var isOff = isPast || isWknd;
      var isSel = ds === _maintSelectedDate;
      var bg = isSel ? 'background:var(--accent, #c47f00);color:#fff;' : '';
      var off = isOff ? 'color:#d1d5db;pointer-events:none;' : 'cursor:pointer;';
      var hover = !isOff && !isSel ? 'onmouseover="this.style.background=\'#fffbeb\'" onmouseout="this.style.background=\'transparent\'"' : '';
      html += '<div data-maint-date="' + ds + '" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:13px;font-weight:500;border:2px solid ' + (isSel ? 'var(--accent,#c47f00)' : 'transparent') + ';' + bg + off + '" ' + hover + '>' + d + '</div>';
    }
    html += '</div>';

    if (_maintSelectedDate) {
      var nowHour = new Date().getHours();
      var isToday = _maintSelectedDate === formatMaintDate(new Date());
      var amBlocked = isToday && nowHour >= 10;
      var pmBlocked = isToday && nowHour >= 14;

      html += '<div style="display:flex;gap:10px;margin-top:12px">'
        + '<button type="button" data-maint-slot="AM" ' + (amBlocked ? 'disabled' : '') + ' style="flex:1;padding:12px 8px;border:2px solid ' + (_maintSelectedSlot === 'AM' ? 'var(--accent,#c47f00)' : '#e5e7eb') + ';border-radius:10px;background:' + (_maintSelectedSlot === 'AM' ? '#fffbeb' : '#f9fafb') + ';cursor:' + (amBlocked ? 'not-allowed;opacity:.45' : 'pointer') + ';text-align:center;font-family:inherit">'
        + '<div style="font-size:14px;font-weight:700;color:var(--accent,#c47f00)">Morning</div><div style="font-size:11px;color:#6b7280;margin-top:2px">9:00 AM - 1:00 PM</div></button>'
        + '<button type="button" data-maint-slot="PM" ' + (pmBlocked ? 'disabled' : '') + ' style="flex:1;padding:12px 8px;border:2px solid ' + (_maintSelectedSlot === 'PM' ? 'var(--accent,#c47f00)' : '#e5e7eb') + ';border-radius:10px;background:' + (_maintSelectedSlot === 'PM' ? '#fffbeb' : '#f9fafb') + ';cursor:' + (pmBlocked ? 'not-allowed;opacity:.45' : 'pointer') + ';text-align:center;font-family:inherit">'
        + '<div style="font-size:14px;font-weight:700;color:var(--accent,#c47f00)">Afternoon</div><div style="font-size:11px;color:#6b7280;margin-top:2px">1:00 PM - 5:00 PM</div></button>'
        + '</div>';
    } else {
      html += '<p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:10px">Tap a date to select it</p>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Attach click handlers
    container.onclick = function(ev) {
      var dayEl = ev.target.closest('[data-maint-date]');
      if (dayEl && dayEl.style.pointerEvents !== 'none') {
        _maintSelectedDate = dayEl.getAttribute('data-maint-date');
        _maintSelectedSlot = '';
        document.getElementById('maintBlock').value = '';
        renderMaintCalendar();
        return;
      }
      var slotEl = ev.target.closest('[data-maint-slot]');
      if (slotEl && !slotEl.disabled) {
        var slot = slotEl.getAttribute('data-maint-slot');
        var slotLabel = slot === 'AM' ? '9:00 AM - 1:00 PM' : '1:00 PM - 5:00 PM';
        var mnths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var dd = new Date(_maintSelectedDate + 'T12:00:00');
        var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        document.getElementById('maintBlock').value = dayNames[dd.getDay()] + ' ' + mnths[dd.getMonth()] + ' ' + dd.getDate() + ' | ' + slotLabel;
        _maintSelectedSlot = slot;
        renderMaintCalendar();
      }
    };
  }

  function formatMaintDate(d) {
    var mm = d.getMonth() + 1; var dd = d.getDate();
    return d.getFullYear() + '-' + (mm < 10 ? '0' : '') + mm + '-' + (dd < 10 ? '0' : '') + dd;
  }

  function maintCalPrev() { _maintCalMonth--; if (_maintCalMonth < 0) { _maintCalMonth = 11; _maintCalYear--; } renderMaintCalendar(); }
  function maintCalNext() { _maintCalMonth++; if (_maintCalMonth > 11) { _maintCalMonth = 0; _maintCalYear++; } renderMaintCalendar(); }

  function handleMaintPhoto(input) {
    var file = input.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var MAX = 800, w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        _maintPhotoData = canvas.toDataURL('image/jpeg', 0.80);
        document.getElementById('maintPhotoPreview').src = _maintPhotoData;
        document.getElementById('maintPhotoPreview').style.display = 'block';
        document.getElementById('maintPhotoText').textContent = '✓ Photo added — tap to change';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function toggleMaintCheckbox(id, ev) {
    var el = document.getElementById(id); if (!el) return;
    if (!ev || ev.target !== el) el.checked = !el.checked;
    updateMaintCheckboxStyles();
    if (id === 'maintPermission') {
      var wb = document.getElementById('maintWaiverBlock');
      if (wb) wb.style.display = el.checked ? 'block' : 'none';
    }
  }

  function updateMaintCheckboxStyles() {
    var na = document.getElementById('maintNoAccess');
    var pe = document.getElementById('maintPermission');
    var rowNa = document.getElementById('maintRowNoAccess');
    var rowPe = document.getElementById('maintRowPermission');
    if (rowNa && na) rowNa.style.borderColor = na.checked ? 'var(--accent,#c47f00)' : '';
    if (rowPe && pe) rowPe.style.borderColor = pe.checked ? 'var(--accent,#c47f00)' : '';
    var wb = document.getElementById('maintWaiverBlock');
    if (wb && pe) wb.style.display = pe.checked ? 'block' : 'none';
  }

  function updateMaintSmsVisibility() {
    var pref = (document.getElementById('maintCommPref') || {}).value || 'sms';
    var wrap = document.getElementById('maintSmsConsentWrap');
    var cb = document.getElementById('maintSmsConsent');
    if (wrap) wrap.style.display = (pref === 'sms' || pref === 'both') ? 'flex' : 'none';
    if (cb && pref === 'email') cb.checked = false;
  }

  function submitMaintenance() {
    var errEl = document.getElementById('maintErr');
    errEl.className = 'auth-error';

    var desc = (document.getElementById('maintDesc').value || '').trim();
    if (!desc) { errEl.textContent = 'Please describe the issue.'; errEl.className = 'auth-error show'; return; }

    var urg = 'normal';
    var radios = document.querySelectorAll('input[name="maintUrg"]');
    radios.forEach(function(r) { if (r.checked) urg = r.value; });

    var commPref = (document.getElementById('maintCommPref') || {}).value || 'sms';
    var smsConsent = !!(document.getElementById('maintSmsConsent') || {}).checked;
    var permToEnter = !!(document.getElementById('maintPermission') || {}).checked;
    var waiverAgreed = !!(document.getElementById('maintWaiverAgree') || {}).checked;
    var noAccess = !!(document.getElementById('maintNoAccess') || {}).checked;

    // SMS consent validation
    if ((commPref === 'sms' || commPref === 'both') && !smsConsent) {
      errEl.textContent = 'Please consent to receive SMS updates.';
      errEl.className = 'auth-error show'; return;
    }
    // Waiver validation
    if (permToEnter && !waiverAgreed) {
      errEl.textContent = 'Please read and agree to the Permission to Enter waiver.';
      errEl.className = 'auth-error show'; return;
    }

    var body = {
      category: document.getElementById('maintCategory').value,
      description: desc,
      urgency: urg,
      photo: _maintPhotoData,
      preferred_date: _maintSelectedDate || null,
      preferred_slot: _maintSelectedSlot || null,
      preferred_block: document.getElementById('maintBlock').value || null,
      no_access_needed: noAccess,
      permission_to_enter: permToEnter,
      waiver_agreed: waiverAgreed,
      sms_consent: smsConsent,
      preferred_comm: commPref
    };

    // If logged in, use authenticated endpoint
    if (USER) {
      api('maintenance-submit', 'POST', body).then(function(d) {
        if (d.error) { errEl.textContent = d.error; errEl.className = 'auth-error show'; return; }
        _maintPhotoData = null;
        toast('Request submitted!');
        showScreen('maintenance');
      });
    } else {
      // Guest mode — require name, phone, address
      var gName = (document.getElementById('maintGuestName') || {}).value;
      var gPhone = (document.getElementById('maintGuestPhone') || {}).value;
      var gAddr = (document.getElementById('maintGuestAddress') || {}).value;
      if (!gName || !gName.trim()) { errEl.textContent = 'Please enter your name.'; errEl.className = 'auth-error show'; return; }
      if (!gPhone || !gPhone.trim()) { errEl.textContent = 'Please enter your phone number.'; errEl.className = 'auth-error show'; return; }
      if (!gAddr || !gAddr.trim()) { errEl.textContent = 'Please enter your address.'; errEl.className = 'auth-error show'; return; }

      body.name = gName.trim();
      body.phone = gPhone.trim();
      body.email = (document.getElementById('maintGuestEmail') || {}).value || '';
      body.property = (document.getElementById('maintGuestProperty') || {}).value || '';
      body.unit = (document.getElementById('maintGuestUnit') || {}).value || '';
      body.address = gAddr.trim();

      // Guest endpoint — no auth needed
      fetch(API + '?action=maintenance-submit-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function(r) { return r.json(); })
        .then(function(d) {
          if (d.error) { errEl.textContent = d.error; errEl.className = 'auth-error show'; return; }
          _maintPhotoData = null;
          toast('Request submitted!');
          showScreen('maintenance');
        })
        .catch(function() {
          errEl.textContent = 'Could not submit. Please try again.';
          errEl.className = 'auth-error show';
        });
    }
  }

  // Keep old addMaintPhotos for backward compat (no longer used)
  function addMaintPhotos(files) {}

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
  var _pkPricing = { per_day:0, minimum_cost:0, free:0, max_days:25 };
  var _pkMode = 'days'; // 'days' or 'bulk'

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
    var dayPicker = document.getElementById('pkDayPicker');
    var bulkSection = document.getElementById('pkBulkSection');

    if (!buildingId) {
      dayPicker.style.display = 'none';
      bulkSection.style.display = 'none';
      document.getElementById('pkVehicleSection').style.display = 'none';
      document.getElementById('pkBookBtn').style.display = 'none';
      return;
    }

    api('parking-plans&building_id=' + buildingId).then(function(d) {
      // d = { plans:[], per_day, minimum_cost, free, max_days }
      var plans = d.plans || [];
      _pkPricing.per_day = parseFloat(d.per_day) || 0;
      _pkPricing.minimum_cost = parseFloat(d.minimum_cost) || 0;
      _pkPricing.free = parseInt(d.free) || 0;
      _pkPricing.max_days = parseInt(d.max_days) || 25;

      // Reset state
      _selectedPlan = null;
      _pkMode = 'days';
      document.getElementById('pkDays').value = 1;
      document.getElementById('pkDays').max = _pkPricing.max_days;

      // Show day picker if per_day pricing exists
      if (_pkPricing.per_day > 0) {
        dayPicker.style.display = '';
        pkUpdatePrice();
      } else {
        dayPicker.style.display = 'none';
      }

      // Show bulk plans if any exist
      var el = document.getElementById('pkPlans');
      if (plans.length > 0) {
        var html = '';
        plans.forEach(function(p) {
          html += '<div class="plan-card" onclick="PL.selectBulkPlan(this,' + (p.days||0) + ',' + (p.price||0) + ')">' +
            '<h4>' + esc(p.name || p.days + ' days') + '</h4>' +
            '<div class="price">$' + (p.price || 0) + '</div></div>';
        });
        el.innerHTML = html;
        bulkSection.style.display = '';
      } else {
        bulkSection.style.display = 'none';
      }

      // Show vehicle section and book button
      document.getElementById('pkVehicleSection').style.display = '';
      document.getElementById('pkBookBtn').style.display = '';
    });
  }

  function pkAdjustDays(delta) {
    var inp = document.getElementById('pkDays');
    var v = parseInt(inp.value) || 1;
    v = Math.max(1, Math.min(_pkPricing.max_days, v + delta));
    inp.value = v;
    // Deselect any bulk plan — user is in custom day mode
    _pkMode = 'days';
    _selectedPlan = null;
    document.querySelectorAll('.plan-card').forEach(function(c) { c.classList.remove('selected'); });
    pkUpdatePrice();
  }

  function pkUpdatePrice() {
    var days = parseInt(document.getElementById('pkDays').value) || 1;
    days = Math.max(1, Math.min(_pkPricing.max_days, days));

    var rawCost = days * _pkPricing.per_day;
    var totalCost = Math.max(rawCost, _pkPricing.minimum_cost);

    var calcEl = document.getElementById('pkPriceCalc');
    var totalEl = document.getElementById('pkPriceTotal');

    if (rawCost < _pkPricing.minimum_cost) {
      calcEl.innerHTML = days + ' day' + (days > 1 ? 's' : '') + ' &times; $' + _pkPricing.per_day.toFixed(2) + '/day = $' + rawCost.toFixed(2) +
        ' <span style="color:#e67e22">(min charge applies)</span>';
    } else {
      calcEl.innerHTML = days + ' day' + (days > 1 ? 's' : '') + ' &times; $' + _pkPricing.per_day.toFixed(2) + '/day';
    }
    totalEl.textContent = '$' + totalCost.toFixed(2);

    // If user is in custom day mode, update the selection
    if (_pkMode === 'days') {
      _selectedPlan = { type:'custom', days:days, price:totalCost };
    }
  }

  function selectBulkPlan(el, days, price) {
    document.querySelectorAll('.plan-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    _pkMode = 'bulk';
    _selectedPlan = { type:'bulk', days:days, price:price };

    // Update day picker to reflect the bulk plan
    document.getElementById('pkDays').value = days;
    var calcEl = document.getElementById('pkPriceCalc');
    var totalEl = document.getElementById('pkPriceTotal');
    calcEl.innerHTML = 'Package: ' + days + ' days';
    totalEl.textContent = '$' + price.toFixed(2);
  }

  function selectPlan(el, planId) {
    document.querySelectorAll('.plan-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    _selectedPlan = planId;
  }

  function bookParking() {
    if (!_selectedPlan) { toast('Select days or a plan first'); return; }
    var errEl = document.getElementById('pkErr');
    errEl.className = 'auth-error';

    var plan = _selectedPlan;
    var days = plan.days || 1;
    var amount = plan.price || 0;
    var planName = plan.type === 'bulk' ? (days + ' day package') : (days + ' days');

    // Calculate end date
    var startDate = today();
    var end = new Date();
    end.setDate(end.getDate() + days);
    var endDate = end.toISOString().split('T')[0];

    api('parking-book', 'POST', {
      building_id: document.getElementById('pkBuilding').value,
      plan: planName,
      days: days,
      amount: amount,
      start_date: startDate,
      end_date: endDate,
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
    document.getElementById('skinCSS').href = 'css/skin-' + skin + '.css?v=20260408';
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
  //  MESSAGES — Full inbox + thread + send/receive
  // ═══════════════════════════════════════════════════

  var _currentThreadId = null;
  var _msgPollTimer = null;

  function _startMsgPoll() {
    _stopMsgPoll();
    _msgPollTimer = setInterval(function() {
      if (_currentThreadId) {
        _refreshThread(true); // silent refresh
      } else {
        loadMessages();
      }
    }, 5000);
  }

  function _stopMsgPoll() {
    if (_msgPollTimer) { clearInterval(_msgPollTimer); _msgPollTimer = null; }
  }

  function loadMessages() {
    api('messages-list').then(function(threads) {
      var el = document.getElementById('msgInbox');
      if (!threads || !threads.length) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div>' +
          '<p>No messages yet.</p>' +
          '<button class="btn-primary" onclick="PL.newMessage()" style="margin-top:12px">Start a Conversation</button></div>';
        _startMsgPoll();
        return;
      }
      // Single unified thread: if only one thread (or all same unit), go directly into thread view
      if (threads.length === 1) {
        openThread(threads[0].id);
        return;
      }
      // Multiple threads — show list but with option to view all as one
      var html = '<button class="btn-primary" onclick="PL.newMessage()" style="width:100%;margin-bottom:12px">✏ New Message</button>';
      threads.forEach(function(t) {
        var unreadCls = t.unread > 0 ? ' msg-unread' : '';
        var initial = (t.source === 'management' ? 'W' : (t.messages && t.messages.length ? t.messages[0].name||'?' : '?'));
        if (typeof initial === 'string' && initial.length > 1) initial = initial.charAt(0).toUpperCase();
        html += '<div class="msg-inbox-row' + unreadCls + '" onclick="PL.openThread(\'' + t.id + '\')">';
        html += '<div class="msg-avatar">' + initial + '</div>';
        html += '<div class="msg-inbox-body">';
        html += '<div class="msg-inbox-top"><span class="msg-inbox-name">' + esc(t.subject || 'Conversation') + '</span>';
        html += '<span class="msg-inbox-time">' + fmtTime(t.last_time) + '</span></div>';
        html += '<div class="msg-inbox-preview">' + esc(t.last_message || '') + '</div>';
        html += '</div>';
        if (t.unread > 0) html += '<span class="msg-unread-dot"></span>';
        html += '</div>';
      });
      el.innerHTML = html;
      _startMsgPoll();
    });
  }

  function openThread(threadId) {
    _currentThreadId = threadId;
    _refreshThread(false);
  }

  function _refreshThread(silent) {
    if (!_currentThreadId) return;
    api('messages-thread', 'POST', { thread_id: _currentThreadId }).then(function(t) {
      if (!t || t.error) { if (!silent) toast('Could not load thread'); return; }

      // Mark unread host messages as read (read receipt)
      if (!silent) {
        _markMessagesRead(_currentThreadId);
      }
      document.getElementById('msgThreadName').textContent = t.subject || 'Conversation';
      // Info card
      var info = document.getElementById('msgThreadInfo');
      info.innerHTML = '<span style="color:var(--text2)">Unit: ' + esc(t.unit || '') + '</span>' +
        (t.source ? ' · <span style="color:var(--accent)">' + esc(t.source) + '</span>' : '');
      // Chat bubbles
      var chat = document.getElementById('msgThreadChat');
      var wasNearBottom = silent ? (chat.scrollHeight - chat.scrollTop - chat.clientHeight < 80) : true;
      var html = '';
      (t.messages || []).forEach(function(m) {
        var cls = m.from === 'tenant' ? 'from-tenant' : (m.from === 'system' ? 'from-system' : 'from-admin');
        html += '<div class="chat-msg ' + cls + '">';
        if (m.from !== 'tenant') html += '<div class="chat-sender">' + esc(m.name || 'Management') + '</div>';
        html += esc(m.text);
        if (m.attachment_url) {
          if (m.message_type === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(m.attachment_url)) {
            html += '<div style="margin:6px 0;"><a href="' + esc(m.attachment_url) + '" target="_blank"><img src="' + esc(m.attachment_url) + '" style="max-width:200px;max-height:180px;border-radius:8px;cursor:pointer;" onerror="this.style.display=\'none\'"></a></div>';
          } else {
            var fname = m.attachment_url.split('/').pop() || 'File';
            html += '<div style="margin:6px 0;"><a href="' + esc(m.attachment_url) + '" target="_blank" style="color:var(--accent);font-size:12px;text-decoration:underline;">📎 ' + esc(fname) + '</a></div>';
          }
        }
        html += '<div class="chat-time">' + fmtTime(m.time) + '</div></div>';
      });
      chat.innerHTML = html;
      if (wasNearBottom) {
        setTimeout(function() { chat.scrollTop = chat.scrollHeight; }, 50);
      }
      if (!silent) {
        document.getElementById('msgInput').value = '';
        showScreen('messageThread');
        _startMsgPoll();
      }
    });
  }

  var _pendingFile = null;

  function handleFileSelect(input) {
    if (input.files && input.files[0]) {
      _pendingFile = input.files[0];
      var preview = document.getElementById('msgAttachPreview');
      var nameEl = document.getElementById('msgAttachName');
      if (preview) preview.style.display = 'flex';
      if (nameEl) nameEl.textContent = '📎 ' + _pendingFile.name;
    }
  }

  function clearAttachment() {
    _pendingFile = null;
    var preview = document.getElementById('msgAttachPreview');
    if (preview) preview.style.display = 'none';
    var fi = document.getElementById('msgFileInput');
    if (fi) fi.value = '';
  }

  function sendMessage() {
    var input = document.getElementById('msgInput');
    var msg = (input.value || '').trim();
    if (!msg && !_pendingFile) return;
    if (!_currentThreadId) return;

    if (_pendingFile) {
      // Upload file to Supabase storage, then send message with attachment
      var file = _pendingFile;
      var ext = file.name.split('.').pop() || 'bin';
      var path = 'portal/' + _currentThreadId + '/' + Date.now() + '.' + ext;
      var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

      toast('Uploading file...');
      sb.storage.from('message-attachments').upload(path, file, { cacheControl: '3600', upsert: false }).then(function(res) {
        if (res.error) { toast('Upload failed: ' + res.error.message); return; }
        var attachmentUrl = SB_URL + '/storage/v1/object/public/message-attachments/' + path;
        var messageType = file.type && file.type.startsWith('image/') ? 'image' : 'file';
        var body = msg || ('📎 ' + file.name);
        clearAttachment();

        // Insert into messages table with attachment
        return fetch(SB_URL + '/rest/v1/messages', {
          method: 'POST', headers: sbHeaders(),
          body: JSON.stringify({ channel_id: _currentThreadId, sender: 'tenant', sender_name: (USER || {}).name || 'Tenant', body: body, platform: 'willowpa', sent_at: new Date().toISOString(), message_type: messageType, attachment_url: attachmentUrl })
        }).then(function() {
          return fetch(SB_URL + '/rest/v1/channels?id=eq.' + _currentThreadId, {
            method: 'PATCH', headers: sbHeaders(),
            body: JSON.stringify({ last_message_preview: body.substring(0, 100), last_message_at: new Date().toISOString() })
          });
        }).then(function() {
          if (input) input.value = '';
          _refreshThread(false);
        });
      });
    } else {
      input.value = '';
      api('messages-send', 'POST', { thread_id: _currentThreadId, message: msg }).then(function(d) {
        if (d.ok) _refreshThread(false);
      });
    }
  }

  function newMessage() {
    // Show a proper modal instead of browser prompts
    var overlay = document.createElement('div');
    overlay.id = '_newMsgOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;width:400px;max-width:90vw;box-shadow:0 8px 30px rgba(0,0,0,.2);">'
      + '<h3 style="margin:0 0 16px;font-size:18px;color:#333;">New Conversation</h3>'
      + '<label style="display:block;font-size:12px;font-weight:600;color:#666;margin-bottom:4px;">Topic</label>'
      + '<select id="_newMsgSubject" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;margin-bottom:12px;background:#fff;">'
      + '<option value="">Select a topic...</option>'
      + '<option value="General Question">General Question</option>'
      + '<option value="Maintenance Request">Maintenance Request</option>'
      + '<option value="Lease Question">Lease Question</option>'
      + '<option value="Billing / Payment">Billing / Payment</option>'
      + '<option value="Move-in / Move-out">Move-in / Move-out</option>'
      + '<option value="Noise Complaint">Noise Complaint</option>'
      + '<option value="Package / Delivery">Package / Delivery</option>'
      + '<option value="Parking">Parking</option>'
      + '<option value="Other">Other</option>'
      + '</select>'
      + '<label style="display:block;font-size:12px;font-weight:600;color:#666;margin-bottom:4px;">Your Message</label>'
      + '<textarea id="_newMsgBody" placeholder="Type your message here..." style="width:100%;min-height:120px;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;box-sizing:border-box;"></textarea>'
      + '<div style="display:flex;gap:10px;margin-top:16px;">'
      + '<button onclick="PL._submitNewMsg()" style="flex:1;padding:12px;background:#7c3aed;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">Send</button>'
      + '<button onclick="document.getElementById(\'_newMsgOverlay\').remove()" style="padding:12px 20px;background:#fff;color:#666;border:1px solid #ddd;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit;">Cancel</button>'
      + '</div></div>';
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    setTimeout(function() { document.getElementById('_newMsgSubject').focus(); }, 100);
  }

  function _submitNewMsg() {
    var subjectEl = document.getElementById('_newMsgSubject');
    var bodyEl = document.getElementById('_newMsgBody');
    var subject = subjectEl ? subjectEl.value : '';
    var msg = bodyEl ? bodyEl.value.trim() : '';
    if (!subject) { toast('Please select a topic'); return; }
    if (!msg) { toast('Please type a message'); return; }
    var overlay = document.getElementById('_newMsgOverlay');
    if (overlay) overlay.remove();
    api('messages-new', 'POST', { subject: subject, message: msg }).then(function(d) {
      if (d.ok && d.thread_id) {
        toast('Message sent!');
        openThread(d.thread_id);
      } else {
        toast('Message sent!');
        loadMessages();
        showScreen('messages');
      }
    });
  }

  // ── Read Receipts ──
  function _markMessagesRead(threadId) {
    // Update all host messages in this thread that have no read_at timestamp
    var url = SB_URL + '/rest/v1/messages?channel_id=eq.' + threadId + '&sender=eq.host&read_at=is.null';
    fetch(url, {
      method: 'PATCH',
      headers: sbHeaders(),
      body: JSON.stringify({ read_at: new Date().toISOString() })
    }).catch(function() { /* ignore - column may not exist yet */ });
  }

  // ── Supabase direct message functions ──
  function sbHeaders() {
    return { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
  }

  function sbLoadMessages(unit, user) {
    // Load channels for this unit, join with latest message
    var url = SB_URL + '/rest/v1/channels?select=*&unit_apt=eq.' + encodeURIComponent(unit) + '&order=last_message_at.desc';
    return fetch(url, { headers: sbHeaders() }).then(function(r) { return r.json(); }).then(function(channels) {
      return channels.map(function(ch) {
        return {
          id: ch.id, unit: ch.unit_apt, subject: ch.guest_name || 'Conversation',
          source: ch.platform || 'management', last_message: ch.last_message_preview || '',
          last_time: ch.last_message_at || ch.created_at, unread: ch.unread_count || 0,
          messages: []
        };
      });
    });
  }

  function sbLoadThread(threadId) {
    // Load channel info + messages
    var chUrl = SB_URL + '/rest/v1/channels?select=*&id=eq.' + threadId;
    var msgUrl = SB_URL + '/rest/v1/messages?select=*&channel_id=eq.' + threadId + '&order=sent_at.asc';
    return Promise.all([
      fetch(chUrl, { headers: sbHeaders() }).then(function(r) { return r.json(); }),
      fetch(msgUrl, { headers: sbHeaders() }).then(function(r) { return r.json(); })
    ]).then(function(results) {
      var ch = results[0][0] || {};
      var msgs = results[1] || [];
      return {
        id: ch.id, unit: ch.unit_apt, subject: ch.guest_name || 'Conversation',
        source: ch.platform || '', messages: msgs.map(function(m) {
          return { from: m.sender, name: m.sender_name || m.sender, text: m.body, time: m.sent_at, attachment_url: m.attachment_url || '', message_type: m.message_type || 'text' };
        })
      };
    });
  }

  function sbSendMessage(threadId, text, unit, user) {
    var msgBody = { channel_id: threadId, sender: 'tenant', sender_name: user.name || 'Tenant', body: text, platform: 'willowpa', sent_at: new Date().toISOString() };
    return fetch(SB_URL + '/rest/v1/messages', {
      method: 'POST', headers: sbHeaders(), body: JSON.stringify(msgBody)
    }).then(function(r) { return r.json(); }).then(function() {
      // Update channel last_message
      return fetch(SB_URL + '/rest/v1/channels?id=eq.' + threadId, {
        method: 'PATCH', headers: sbHeaders(),
        body: JSON.stringify({ last_message_preview: text.substring(0, 100), last_message_at: new Date().toISOString() })
      });
    }).then(function() { return { ok: true, thread_id: threadId }; });
  }

  function sbCreateThread(unit, user, subject, text) {
    var channel = { guest_name: user.name || 'Tenant', guest_email: user.email || '', unit_apt: unit, platform: 'willowpa', status: 'active', last_message_preview: text.substring(0, 100), last_message_at: new Date().toISOString() };
    return fetch(SB_URL + '/rest/v1/channels', {
      method: 'POST', headers: sbHeaders(), body: JSON.stringify(channel)
    }).then(function(r) { return r.json(); }).then(function(rows) {
      var ch = rows[0] || {};
      var msgBody = { channel_id: ch.id, sender: 'tenant', sender_name: user.name || 'Tenant', body: text, platform: 'willowpa', sent_at: new Date().toISOString() };
      return fetch(SB_URL + '/rest/v1/messages', {
        method: 'POST', headers: sbHeaders(), body: JSON.stringify(msgBody)
      }).then(function() { return { ok: true, thread_id: ch.id }; });
    });
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
    loadMessages: loadMessages,
    openThread: openThread,
    sendMessage: sendMessage,
    handleFileSelect: handleFileSelect,
    clearAttachment: clearAttachment,
    newMessage: newMessage,
    _submitNewMsg: _submitNewMsg,
    initMaintForm: initMaintForm,
    handleMaintPhoto: handleMaintPhoto,
    toggleMaintCheckbox: toggleMaintCheckbox,
    updateMaintCheckboxStyles: updateMaintCheckboxStyles,
    updateMaintSmsVisibility: updateMaintSmsVisibility,
    maintCalPrev: maintCalPrev,
    maintCalNext: maintCalNext,
    loadParkingPlans: loadParkingPlans,
    selectPlan: selectPlan,
    selectBulkPlan: selectBulkPlan,
    pkAdjustDays: pkAdjustDays,
    pkUpdatePrice: pkUpdatePrice,
    bookParking: bookParking,
    confirmPickup: confirmPickup,
    openForm: openForm,
    signForm: signForm,
    openPreArrival: openPreArrival,
    openAgreement: openAgreement,
    handleIdFile: handleIdFile,
    updateGuestFields: updateGuestFields,
    submitPreArrival: submitPreArrival,
    submitAgreement: submitAgreement,
    checkCheckinGate: checkCheckinGate,
    selectPayMethod: selectPayMethod,
    processPayment: processPayment,
    aiAsk: aiAsk,
    readNotif: readNotif,
    readAllNotifs: readAllNotifs,
    setSkin: setSkin,
    toast: toast
  };

})();
