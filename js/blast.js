// blast.js — HOA blast messaging composer (Phase 3B.6 iter 1+2 · 2026-04-23)
//
// Lives under Messages → 📢 Blast. Admin composes a subject + body, picks
// a target (Owners / Residents / All within selected communities), picks
// channels (SMS / Email / App), sees a deduped live recipient preview,
// and can Save as Draft. Actual sending (3B.6.3+) is wired in a later
// iteration — the Send button in this iteration is stubbed.
//
// Depends on:
//   * window.sb  (Supabase client exposed by app.js)
//   * window.toast
//   * showSubPage routing via app.js MODULE_SUB_TABS
//
// Renders into #page-blast.

console.log('[blast] loaded v20260424-phase3b.22 — long-message-as-link (SMS teaser + web view)');

(function(){
  'use strict';

  // ── Module state (reset on each fresh render) ─────────────────────────
  const _state = {
    subject:      '',
    body:         '',
    categoryCode: 'other',
    targetType:   'owners',
    communityIds: [],
    channels:     { sms: true, email: true, app: false },
    recipients:   [],
    cats:         [],
    notifCats:    [],
    editingId:    null,
    notes:        '',
    // 3B.6.4 test-mode safety valve. When checked, ALL outgoing emails/
    // SMS are routed to the admin addresses below instead of each
    // recipient's snapshot. Recipient rows still transition normally
    // for audit.
    testMode:          false,
    testRedirectEmail: '',
    testRedirectPhone: '',
    // 3B.6.5a — rental property targeting. Independent of HOA.
    includeRentalTenants:   false,
    rentalProperties:       [],    // selected property strings (from tenants_lt.property)
    rentalCatalog:          [],    // distinct property values available
    // 3B.6.7 — tenants_lt.status filter. Table currently has 'Active' and
    // 'Future' (signed lease, not yet moved in). Include Future by default
    // since most blast categories (community_info, alerts) apply to them,
    // but give the admin a toggle so payment-reminder blasts can exclude.
    includeFutureTenants:   true,
    // 3B.6.7 — short_token for the public web view URL. Generated on
    // first saveDraft, persisted across edits.
    shortToken:             '',
  };
  let _resolveTimer = null;
  const PORTAL_API_BASE = 'https://app.willowpa.com/api/';

  async function callPortalApi(action, body) {
    const resp = await fetch(PORTAL_API_BASE + '?action=' + encodeURIComponent(action), {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body || {}),
    });
    const text = await resp.text();
    let data = null;
    try { data = JSON.parse(text); } catch (_) { data = text; }
    return { http: resp.status, ok: resp.ok, data };
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  async function sb() {
    const s = window.sb || window.supa || window.supabaseClient;
    if (!s) throw new Error('Supabase not ready');
    return s;
  }
  function toast(msg, type) {
    if (typeof window.toast === 'function') return window.toast(msg, type || '');
    console.log('[blast]', msg);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // ── Public entry (called from app.js showSubPage) ─────────────────────
  async function renderBlastPage() {
    const page = document.getElementById('page-blast');
    if (!page) return;
    page.style.display = '';
    page.classList.add('active');
    page.innerHTML = '<div style="padding:24px;text-align:center;color:#7e7567;">Loading blast composer…</div>';

    try {
      const s = await sb();
      const [cr, ncr, tpr] = await Promise.all([
        s.from('hoa_communities')
          .select('id,name,display_name,is_active')
          .eq('is_active', true)
          .order('name'),
        s.from('hoa_notification_categories')
          .select('id,code,name,description,has_cadence,sort_order,is_active')
          .eq('is_active', true)
          .order('sort_order'),
        // Distinct rental-property values from tenants_lt (3B.6.5a).
        // No dedicated properties.name canonicalization yet — tenants_lt.property
        // is the natural filter key since it's what the tenant row stores.
        s.from('tenants_lt').select('property').limit(1000),
      ]);
      _state.cats      = cr.data || [];
      _state.notifCats = ncr.data || [];

      // Build rental property catalog with variant grouping. The same
      // building often has multiple string variants in tenants_lt
      // ("46 Township Line Rd" vs "46 Township Line Rd, Elkins Park, PA 19027"),
      // because different admins typed it differently over the years.
      // We group by the canonical key = the segment before the first
      // comma, lowercased + collapsed whitespace. The chip label is the
      // shortest variant. Filtering expands the chip back out to every
      // raw variant it covers, so .in('property', [...]) still matches.
      const canonKey = (s) =>
        String(s || '')
          .split(',')[0]
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase();
      const groups = new Map(); // key → { key, label, variants: [] }
      (tpr.data || []).forEach(r => {
        if (!r.property) return;
        const k = canonKey(r.property);
        if (!k) return;
        let g = groups.get(k);
        if (!g) { g = { key: k, label: r.property, variants: [] }; groups.set(k, g); }
        if (!g.variants.includes(r.property)) g.variants.push(r.property);
        // Keep the shortest variant as the display label.
        if (r.property.length < g.label.length) g.label = r.property;
      });
      _state.rentalCatalog = Array.from(groups.values())
        .sort((a, b) => a.label.localeCompare(b.label));
      // Migrate any pre-existing selections from raw strings → canonical keys.
      _state.rentalProperties = (_state.rentalProperties || [])
        .map(p => canonKey(p))
        .filter((v, i, a) => a.indexOf(v) === i);
      renderComposer();
    } catch (e) {
      page.innerHTML = '<div style="padding:24px;color:#a22;">Error: ' + esc(e.message || e) + '</div>';
    }
  }

  function renderComposer() {
    const page = document.getElementById('page-blast');
    if (!page) return;

    // Chips are plain clickable spans (no nested checkbox) — we paint
    // the check state ourselves with ☑ / ▢. The earlier label-wrapped
    // checkbox pattern was flaky on Safari/iOS and occasionally
    // swallowed the click in desktop Chrome too (phase3b.16 fix).
    const commChips = _state.cats.map(c => {
      const selected = _state.communityIds.includes(c.id);
      return '<span class="blast-chip" data-id="' + esc(c.id) + '" ' +
        'role="button" tabindex="0" ' +
        'onclick="WPA_blastToggleComm(\'' + esc(c.id) + '\')" ' +
        'onkeydown="if(event.key===\' \'||event.key===\'Enter\'){event.preventDefault();WPA_blastToggleComm(\'' + esc(c.id) + '\');}" ' +
        'style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;margin-right:6px;margin-bottom:6px;' +
               'border-radius:14px;cursor:pointer;font-size:12px;user-select:none;' +
               'border:1px solid ' +
               (selected ? '#7a9f75;background:#eaf4ea;color:#1a5a25;' : '#d9d3c5;background:#fff;color:#5a5040;') + '">' +
        '<span style="font-size:13px;line-height:1;">' + (selected ? '☑' : '▢') + '</span>' +
        esc(c.display_name || c.name) +
        '</span>';
    }).join('');

    const targetRadio = (value, label, desc) => {
      const checked = _state.targetType === value;
      return '<label style="display:flex;align-items:flex-start;gap:8px;padding:8px 12px;margin-bottom:6px;' +
             'border:1px solid ' + (checked ? '#7a9f75' : '#e5dfd4') + ';border-radius:6px;cursor:pointer;' +
             'background:' + (checked ? '#eaf4ea' : '#fff') + ';">' +
        '<input type="radio" name="blast_tgt" value="' + value + '"' + (checked ? ' checked' : '') +
           ' onchange="WPA_blastSetTarget(\'' + value + '\')">' +
        '<div>' +
          '<div style="font-size:13px;font-weight:500;">' + esc(label) + '</div>' +
          '<div style="font-size:11px;color:#7e7567;">' + esc(desc) + '</div>' +
        '</div>' +
      '</label>';
    };

    const channelChk = (key, label, desc, disabled) => {
      const checked = !!_state.channels[key];
      return '<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;margin-bottom:6px;' +
             'border:1px solid ' + (checked ? '#7a9f75' : '#e5dfd4') + ';border-radius:6px;cursor:pointer;' +
             'background:' + (checked ? '#eaf4ea' : '#fff') + ';' +
             (disabled ? 'opacity:0.55;cursor:not-allowed;' : '') + '">' +
        '<input type="checkbox"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') +
          ' onchange="WPA_blastToggleChannel(\'' + key + '\')">' +
        '<div>' +
          '<div style="font-size:13px;">' + esc(label) + '</div>' +
          '<div style="font-size:11px;color:#7e7567;">' + esc(desc) + '</div>' +
        '</div>' +
      '</label>';
    };

    page.innerHTML =
      '<div class="dash-wrap" style="max-width:1100px;margin:0 auto;padding:20px;">' +
        '<div class="dash-header">' +
          '<div>' +
            '<div class="dash-title">📢 Blast messaging</div>' +
            '<div class="dash-synced">Compose a one-to-many message. Each recipient\'s reply arrives as its own thread.</div>' +
          '</div>' +
          '<div class="dash-header-actions">' +
            '<button class="btn-subtle" onclick="WPA_blastOpenDrafts()">📁 Drafts</button>' +
          '</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 360px;gap:18px;margin-top:14px;">' +

          // ── LEFT: composer ────────────────────────────────────────────
          '<div>' +

            // Target section · HOA
            '<div class="dash-panel" style="padding:16px;">' +
              '<h3 style="font-size:13px;margin:0 0 10px;">🎯 HOA target</h3>' +

              '<div style="font-size:11px;color:#7e7567;text-transform:uppercase;letter-spacing:0.5px;margin:6px 0 4px;">Who</div>' +
              targetRadio('owners',    'Owners',
                'Everyone with an owner or owner-occupant link on units in scope') +
              targetRadio('residents', 'Residents',
                'People actually living in the units (owner-occupants + tenants)') +
              targetRadio('all',       'All',
                'Every active contact linked to units in scope (owners + residents + other)') +

              '<div style="font-size:11px;color:#7e7567;text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 4px;">Communities</div>' +
              '<div>' + (commChips || '<em style="color:#9e9485;">No active communities found.</em>') + '</div>' +
              '<div style="font-size:11px;color:#9e9485;margin-top:6px;">' +
                'Tap a chip to add/remove. <strong>Empty = skip HOA entirely</strong> — no HOA contacts are added to the blast until at least one community is checked.' +
              '</div>' +
            '</div>' +

            // Target section · Rental properties (3B.6.5a)
            (function(){
              const props = _state.rentalCatalog || [];
              const chips = props.map(g => {
                const selected = _state.rentalProperties.indexOf(g.key) !== -1;
                const jsArg = g.key.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                // Variants-hint shown on hover when a chip collapses >1
                // raw string from tenants_lt.
                const hintAttr = g.variants.length > 1
                  ? ' title="' + esc('Matches variants: ' + g.variants.join(' | ')) + '"'
                  : '';
                return '<span class="blast-pchip" role="button" tabindex="0"' + hintAttr + ' ' +
                       'onclick="WPA_blastToggleRentalProp(\'' + jsArg + '\')" ' +
                       'onkeydown="if(event.key===\' \'||event.key===\'Enter\'){event.preventDefault();WPA_blastToggleRentalProp(\'' + jsArg + '\');}" ' +
                       'style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;margin-right:6px;margin-bottom:6px;' +
                       'border-radius:14px;cursor:pointer;font-size:12px;user-select:none;' +
                       'border:1px solid ' +
                       (selected ? '#7a9f75;background:#eaf4ea;color:#1a5a25;' : '#d9d3c5;background:#fff;color:#5a5040;') + '">' +
                  '<span style="font-size:13px;line-height:1;">' + (selected ? '☑' : '▢') + '</span>' +
                  esc(g.label) +
                  (g.variants.length > 1 ? ' <span style="font-size:10px;color:#9e9485;">×' + g.variants.length + '</span>' : '') +
                  '</span>';
              }).join('');
              return '<div class="dash-panel" style="padding:16px;margin-top:12px;' +
                       (_state.includeRentalTenants ? 'border:1px solid #7a9f75;' : '') + '">' +
                '<label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;cursor:pointer;">' +
                  '<input type="checkbox"' + (_state.includeRentalTenants ? ' checked' : '') +
                    ' onchange="WPA_blastToggleRental()">' +
                  '🏠 Include rental tenants' +
                '</label>' +
                '<div style="font-size:11px;color:#9e9485;margin:6px 0 10px;">' +
                  'Adds long-term tenants from <code>tenants_lt</code> to the blast. Deduped across HOA + rental by phone / email.' +
                '</div>' +
                (_state.includeRentalTenants
                  ? ('<div style="font-size:11px;color:#7e7567;text-transform:uppercase;letter-spacing:0.5px;margin:4px 0 4px;">' +
                       'Rental properties' +
                     '</div>' +
                     (props.length
                        ? ('<div>' + chips + '</div>' +
                           '<div style="font-size:11px;color:#9e9485;margin-top:6px;">' +
                             'None selected = all rental properties. ' + props.length + ' available.' +
                           '</div>')
                        : '<em style="color:#9e9485;">No rental properties found in tenants_lt.</em>') +
                     // 3B.6.7 · Future-tenant toggle. Active always included;
                     // Future (signed but not moved in) is opt-out so payment
                     // reminders can target only current residents.
                     '<label style="display:flex;align-items:center;gap:8px;margin-top:12px;padding:8px 10px;border-top:1px solid #f0ebe2;font-size:12px;cursor:pointer;">' +
                       '<input type="checkbox"' + (_state.includeFutureTenants ? ' checked' : '') +
                         ' onchange="WPA_blastToggleFutureTenants()">' +
                       '<div>' +
                         '<div style="font-weight:500;color:#3a3428;">Include <em>Future</em> tenants</div>' +
                         '<div style="font-size:11px;color:#9e9485;">Signed a lease but haven\'t moved in yet. Uncheck for payment reminders or move-in-only blasts. <em>Active</em> tenants are always included.</div>' +
                       '</div>' +
                     '</label>')
                  : '') +
              '</div>';
            })() +

            // Channels section
            '<div class="dash-panel" style="padding:16px;margin-top:12px;">' +
              '<h3 style="font-size:13px;margin:0 0 10px;">📡 Channels</h3>' +
              channelChk('sms',   'SMS',   'Delivered via Flowroute. Standard carrier rates apply. Recipients must have phone_e164.', false) +
              channelChk('email', 'Email', 'Delivered via configured SMTP. Recipients must have an email.',                              false) +
              channelChk('app',   'App',   'In-app push + inbox entry. Requires portal account. (Wiring in Phase 3B.6.6.)',              true) +
              '<div style="font-size:11px;color:#9e9485;margin-top:2px;">' +
                'Per-recipient subscription preferences (Alerts tab) override these at send time — if a contact has App off, they won\'t get App even if it\'s checked here.' +
              '</div>' +
            '</div>' +

            // 🧪 Test mode (3B.6.4)
            '<div class="dash-panel" style="padding:16px;margin-top:12px;border:1px solid ' +
              (_state.testMode ? '#d4a32b' : '#e5dfd4') + ';' +
              (_state.testMode ? 'background:#fff8e7;' : '') + '">' +
              '<label style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;cursor:pointer;">' +
                '<input type="checkbox"' + (_state.testMode ? ' checked' : '') +
                  ' onchange="WPA_blastToggleTestMode()">' +
                '🧪 Test mode — redirect all sends to me' +
              '</label>' +
              '<div style="font-size:11px;color:#6a5020;margin:6px 0 10px;">' +
                'When on, every email/SMS is redirected to the addresses below regardless of recipient. Each recipient row is still marked <em>sent</em> so you can see who WOULD have received. A banner is prepended to the message identifying the intended recipient.' +
              '</div>' +
              (_state.testMode
                ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
                    '<div>' +
                      '<label style="font-size:11px;color:#7e7567;">Redirect email</label>' +
                      '<input id="blastTestEmail" type="email" value="' + esc(_state.testRedirectEmail) + '" ' +
                        'placeholder="your.email@example.com" ' +
                        'oninput="WPA_blastSetTestEmail(this.value)" ' +
                        'style="width:100%;padding:6px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:12px;margin-top:2px;">' +
                    '</div>' +
                    '<div>' +
                      '<label style="font-size:11px;color:#7e7567;">Redirect phone (E.164)</label>' +
                      '<input id="blastTestPhone" type="tel" value="' + esc(_state.testRedirectPhone) + '" ' +
                        'placeholder="+15551234567" ' +
                        'oninput="WPA_blastSetTestPhone(this.value)" ' +
                        'style="width:100%;padding:6px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:12px;margin-top:2px;">' +
                    '</div>' +
                  '</div>'
                : '') +
            '</div>' +

            // Message section
            '<div class="dash-panel" style="padding:16px;margin-top:12px;">' +
              '<h3 style="font-size:13px;margin:0 0 10px;">✍ Message</h3>' +
              '<label style="font-size:11px;color:#7e7567;">Category</label>' +
              '<select id="blastCategory" onchange="WPA_blastSetCategory(this.value)" ' +
                'style="width:100%;padding:8px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:13px;margin:4px 0 12px;">' +
                _state.notifCats.map(c =>
                  '<option value="' + esc(c.code) + '"' +
                    (c.code === _state.categoryCode ? ' selected' : '') + '>' +
                    esc(c.name) +
                  '</option>'
                ).join('') +
              '</select>' +
              '<label style="font-size:11px;color:#7e7567;">Subject</label>' +
              '<input id="blastSubject" type="text" value="' + esc(_state.subject) + '" ' +
                'oninput="WPA_blastSetSubject(this.value)" ' +
                'style="width:100%;padding:8px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:13px;margin:4px 0 12px;">' +
              '<label style="font-size:11px;color:#7e7567;">Body</label>' +
              '<textarea id="blastBody" rows="6" oninput="WPA_blastSetBody(this.value);WPA_blastUpdateCharCounter()" ' +
                'style="width:100%;padding:8px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:13px;margin:4px 0 4px;resize:vertical;">' +
                esc(_state.body) +
              '</textarea>' +
              // 3B.6.7 · live SMS char counter. Segments calc:
              //   ≤ 160 → 1 SMS (green)
              //   161–300 → 2 SMS, double charge (amber)
              //   > 300 → SMS auto-skipped for this blast (red)
              '<div id="blastCharCounter" style="font-size:11px;color:#9e9485;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;min-height:16px;">' +
                '<div id="blastCharCounterMsg" style="flex:1;"></div>' +
                '<div id="blastCharCounterNum" style="font-variant-numeric:tabular-nums;color:#7e7567;"></div>' +
              '</div>' +
              '<div style="font-size:11px;color:#9e9485;margin-top:4px;">' +
                'Plain text for SMS (auto-converted to branded HTML for email). SMS limit: 160 chars per segment. Above 300 chars, SMS is skipped and only email/app deliver.' +
              '</div>' +
            '</div>' +

            // Action bar
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">' +
              '<button class="btn-subtle" onclick="WPA_blastClose()">Cancel</button>' +
              '<div style="display:flex;gap:8px;">' +
                '<button class="btn-subtle" onclick="WPA_blastPreviewEmail()" title="Preview the branded email template with sample data">👁 Preview email</button>' +
                '<button class="btn-subtle" onclick="WPA_blastPreviewWebView()" title="Preview the public web view that long-blast SMS recipients tap into">🔗 Preview web view</button>' +
                '<button class="btn-subtle" onclick="WPA_blastSaveDraft()">💾 Save draft</button>' +
                '<button class="btn-backup" onclick="WPA_blastSend()" ' +
                  'style="background:#c9404b;" title="Sending wired in Phase 3B.6.3">' +
                  '🚀 Send blast</button>' +
              '</div>' +
            '</div>' +

          '</div>' +

          // ── RIGHT: live recipient preview ─────────────────────────────
          '<div>' +
            '<div class="dash-panel" style="padding:16px;position:sticky;top:12px;">' +
              '<h3 style="font-size:13px;margin:0 0 10px;">👥 Recipients</h3>' +
              '<div id="blastRecipientList">' +
                '<em style="color:#9e9485;">Resolving…</em>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    // Kick off initial recipient resolution.
    scheduleResolve();
    // Populate char counter after the DOM exists.
    updateCharCounter();
  }

  // ── SMS char counter (3B.6.7) ─────────────────────────────────────────
  function updateCharCounter() {
    const msgEl = document.getElementById('blastCharCounterMsg');
    const numEl = document.getElementById('blastCharCounterNum');
    if (!msgEl || !numEl) return;
    const n = (_state.body || '').length;
    const smsOn = !!_state.channels.sms;

    let msg, color, numColor;
    if (!smsOn) {
      msg = '';
      color = '#9e9485'; numColor = '#9e9485';
    } else if (n === 0) {
      msg = 'SMS: 1 segment (up to 160 chars)';
      color = '#9e9485'; numColor = '#9e9485';
    } else if (n <= 160) {
      msg = '✓ Fits in 1 SMS';
      color = '#1a5a25'; numColor = '#1a5a25';
    } else if (n <= 300) {
      msg = '⚠ 2 SMS segments — each recipient counts 2× for billing';
      color = '#8a6d3c'; numColor = '#8a6d3c';
    } else {
      // Long-message-as-link mode (3B.6.7).
      msg = '🔗 Too long for SMS body — recipients will get a short SMS with a tap-able link to the full message';
      color = '#1a2874'; numColor = '#1a2874';
    }
    msgEl.textContent = msg;
    msgEl.style.color = color;
    numEl.textContent = n + (smsOn ? ' chars' : ' chars');
    numEl.style.color = numColor;
  }

  // ── short_token generation (3B.6.7) ───────────────────────────────────
  // Mirrors the server-side format (8-char lowercase hex) so a token
  // generated here is collision-compatible with one generated by PHP's
  // random_bytes path. Used in saveDraft so blasts always have a public
  // view URL ready before send.
  function generateShortToken() {
    let s = '';
    if (window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint8Array(4);
      window.crypto.getRandomValues(buf);
      s = Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for ancient browsers — lower entropy but still
      // unique-enough for our scale.
      s = (Math.random().toString(36) + '00000000').substr(2, 8);
    }
    return s.slice(0, 8).toLowerCase();
  }

  // ── Recipient resolver ────────────────────────────────────────────────
  function scheduleResolve() {
    clearTimeout(_resolveTimer);
    _resolveTimer = setTimeout(resolveRecipients, 150);
  }

  async function resolveRecipients() {
    const box = document.getElementById('blastRecipientList');
    if (!box) return;
    box.innerHTML = '<em style="color:#9e9485;">Resolving…</em>';

    try {
      const s = await sb();

      let hoaRecipients = [];
      let unitById      = {};

      // HOA path is explicit now: zero communities selected = skip HOA
      // entirely (matches the rental-tenants opt-in pattern and avoids
      // surprise "blast to everyone" blasts when the admin expected an
      // empty chip row to mean "nothing yet").
      if (_state.communityIds.length) {
        // 1. Units in scope.
        const { data: units, error: unitErr } = await s.from('hoa_units')
          .select('id,unit_label,community_id,building_label')
          .in('community_id', _state.communityIds);
        if (unitErr) throw unitErr;

        if (units && units.length) {
          const unitIds = units.map(u => u.id);
          units.forEach(u => { unitById[u.id] = u; });

          // 2. Active unit_contacts for those units, filtered by
          //    relationship per targetType.
          const rels =
            _state.targetType === 'owners'    ? ['owner', 'owner_resident']
          : _state.targetType === 'residents' ? ['owner_resident', 'resident']
          : /* all */                           ['owner','owner_resident','resident','other'];

          const { data: ucRows, error: ucErr } = await s.from('hoa_unit_contacts')
            .select('contact_id,unit_id,relationship_type,is_primary,is_active')
            .in('unit_id', unitIds)
            .eq('is_active', true)
            .in('relationship_type', rels);
          if (ucErr) throw ucErr;

          const contactIds = Array.from(new Set((ucRows || []).map(r => r.contact_id)));

          if (contactIds.length) {
            // 3. Contacts — dedup happens here (one row per contact_id
            //    even if they link to multiple units in scope).
            const { data: contacts, error: contErr } = await s.from('hoa_contacts')
              .select('id,full_name,first_name,last_name,email,phone,phone_e164,is_active')
              .in('id', contactIds)
              .eq('is_active', true);
            if (contErr) throw contErr;

            // First-matching unit context (for reply threading).
            const firstUnitByContact = {};
            (ucRows || []).forEach(r => {
              if (!firstUnitByContact[r.contact_id]) {
                firstUnitByContact[r.contact_id] = r.unit_id;
              }
            });

            hoaRecipients = (contacts || []).map(c => ({
              kind:        'hoa_contact',
              contact_id:  c.id,
              name:        c.full_name
                           || [c.first_name, c.last_name].filter(Boolean).join(' ')
                           || c.email || c.phone_e164 || '(unnamed)',
              phone_e164:  c.phone_e164 || '',
              email:       c.email      || '',
              phone_raw:   c.phone      || '',
              unit_id:     firstUnitByContact[c.id] || null,
              community_id: (() => {
                const uid = firstUnitByContact[c.id];
                const u = uid ? unitById[uid] : null;
                return u ? u.community_id : null;
              })(),
              unit_label:  (() => {
                const uid = firstUnitByContact[c.id];
                const u = uid ? unitById[uid] : null;
                return u ? u.unit_label : null;
              })(),
            }));
          }
        }
      }

      // ── Rental tenants (3B.6.5a) ───────────────────────────────────
      // If the admin opted in, union in matching rows from tenants_lt.
      // Dedup across sources by phone_e164 then email (prefer HOA row
      // since it has richer context).
      let rentalRecipients = [];
      if (_state.includeRentalTenants) {
        // Status filter: always include Active; include Future only if
        // the composer toggle is on (default ON). This defensively
        // excludes any future Archived/Ended statuses someone might add
        // later without us noticing.
        const allowedStatuses = _state.includeFutureTenants
          ? ['Active', 'Future']
          : ['Active'];
        let q = s.from('tenants_lt')
          .select('id,name,email,phone,phone_e164,property,unit,status')
          .in('status', allowedStatuses)
          .order('name')
          .limit(2000);
        if (_state.rentalProperties.length) {
          // Expand canonical chip keys → every raw tenants_lt.property
          // string they cover (so filtering "46 Township Line Rd" also
          // catches "46 Township Line Rd, Elkins Park, PA 19027").
          const groupByKey = {};
          (_state.rentalCatalog || []).forEach(g => { groupByKey[g.key] = g; });
          const rawVariants = [];
          _state.rentalProperties.forEach(key => {
            const g = groupByKey[key];
            if (g) g.variants.forEach(v => rawVariants.push(v));
          });
          if (rawVariants.length) q = q.in('property', rawVariants);
        }
        const { data: tenants, error: tErr } = await q;
        if (tErr) console.warn('[blast] tenants_lt fetch error:', tErr);
        rentalRecipients = (tenants || []).map(t => ({
          kind:         'tenant_lt',
          contact_id:   null,
          tenant_id:    t.id,
          name:         t.name || t.email || t.phone_e164 || '(unnamed)',
          phone_e164:   t.phone_e164 || '',
          email:        t.email      || '',
          phone_raw:    t.phone      || '',
          unit_id:      null,
          community_id: null,
          unit_label:   t.unit || null,
          property:     t.property || null,
          tenant_status: t.status || null,
        }));
      }

      // Dedup — HOA wins on phone match, email match. Key preference:
      // phone_e164 (most unique), then email. Missing both = never dedupes.
      const seenPhones = new Set();
      const seenEmails = new Set();
      const merged = [];
      const add = (r) => {
        const p = (r.phone_e164 || '').trim().toLowerCase();
        const e = (r.email      || '').trim().toLowerCase();
        if (p && seenPhones.has(p)) return;
        if (e && seenEmails.has(e)) return;
        if (p) seenPhones.add(p);
        if (e) seenEmails.add(e);
        merged.push(r);
      };
      hoaRecipients.forEach(add);
      rentalRecipients.forEach(add);

      _state.recipients = merged.sort((a, b) => a.name.localeCompare(b.name));

      renderPreview();
    } catch (e) {
      if (box) box.innerHTML =
        '<div style="color:#a22;font-size:12px;">Error: ' + esc(e.message || e) + '</div>';
      console.error('[blast] resolve error:', e);
    }
  }

  function renderPreview() {
    const box = document.getElementById('blastRecipientList');
    if (!box) return;
    const n = _state.recipients.length;

    // Channel-availability stats.
    const phones  = _state.recipients.filter(r => r.phone_e164).length;
    const emails  = _state.recipients.filter(r => r.email).length;
    const smsRequested   = !!_state.channels.sms;
    const emailRequested = !!_state.channels.email;
    const willSms   = smsRequested   ? phones : 0;
    const willEmail = emailRequested ? emails : 0;

    const nHoa    = _state.recipients.filter(r => r.kind === 'hoa_contact').length;
    const nRental = _state.recipients.filter(r => r.kind === 'tenant_lt').length;

    let h =
      '<div style="font-size:12px;color:#3a3428;margin-bottom:10px;">' +
        '<strong style="font-size:20px;color:#1a5a25;">' + n + '</strong>' +
        ' recipient' + (n === 1 ? '' : 's') +
        ' <span style="color:#9e9485;font-size:11px;">· deduped by phone / email</span>' +
        (nRental
          ? '<div style="font-size:11px;color:#7e7567;margin-top:4px;">' +
              nHoa + ' HOA · ' + nRental + ' rental'
            + '</div>'
          : '') +
      '</div>' +
      '<div style="font-size:11px;color:#5a5040;margin-bottom:10px;">' +
        (smsRequested
          ? '<div>📱 SMS: <strong>' + willSms + '</strong> will receive · <span style="color:#9e9485;">' + (n - willSms) + ' no phone</span></div>'
          : '<div style="color:#9e9485;">📱 SMS channel off</div>') +
        (emailRequested
          ? '<div>✉ Email: <strong>' + willEmail + '</strong> will receive · <span style="color:#9e9485;">' + (n - willEmail) + ' no email</span></div>'
          : '<div style="color:#9e9485;">✉ Email channel off</div>') +
      '</div>';

    if (!n) {
      const hasAnySource = _state.communityIds.length || _state.includeRentalTenants;
      h += '<div style="padding:14px;background:#faf6ee;border-radius:4px;color:#9e9485;text-align:center;font-size:12px;">' +
           (hasAnySource
             ? 'No recipients match the current target + community filter.'
             : 'No recipients yet. Pick a <strong>community</strong> above, or toggle <strong>Include rental tenants</strong>, to start building your audience.') +
           '</div>';
      box.innerHTML = h;
      return;
    }

    h += '<div style="max-height:480px;overflow-y:auto;border:1px solid #e5dfd4;border-radius:4px;">';
    _state.recipients.forEach(r => {
      const sourceBadge = r.kind === 'tenant_lt'
        ? '<span style="font-size:10px;background:#e3eef5;color:#1a3a6b;padding:1px 6px;border-radius:8px;margin-left:4px;">rental</span>'
        : '<span style="font-size:10px;background:#faf6ee;color:#8a6d3c;padding:1px 6px;border-radius:8px;margin-left:4px;">HOA</span>';
      h += '<div style="padding:8px 10px;border-bottom:1px solid #f0ebe2;font-size:12px;">' +
           '<strong>' + esc(r.name) + '</strong>' + sourceBadge +
             (r.unit_label ? ' <span style="color:#9e9485;">· Unit ' + esc(r.unit_label) + '</span>' : '') +
             (r.property   ? ' <span style="color:#9e9485;">· ' + esc(r.property) + '</span>' : '') +
           '<div style="font-size:11px;color:#7e7567;margin-top:1px;">' +
             (r.phone_e164 ? '📱 ' + esc(r.phone_e164) + ' ' : '') +
             (r.email      ? '✉ '  + esc(r.email)           : '') +
             (!r.phone_e164 && !r.email ? '<em style="color:#a22;">no contact info</em>' : '') +
           '</div>' +
           '</div>';
    });
    h += '</div>';
    box.innerHTML = h;
  }

  // ── State setters (wired to window.* for inline onclicks) ─────────────
  function setTarget(v)  { _state.targetType = v; scheduleResolve(); }
  function toggleComm(id) {
    console.log('[blast] toggleComm fired · id=', JSON.stringify(id),
                '· before=', _state.communityIds.slice());
    const i = _state.communityIds.indexOf(id);
    if (i === -1) _state.communityIds.push(id);
    else          _state.communityIds.splice(i, 1);
    console.log('[blast] toggleComm after=', _state.communityIds.slice());
    renderComposer();
  }
  function toggleChannel(k) {
    _state.channels[k] = !_state.channels[k];
    renderPreview();
    updateCharCounter();  // SMS on/off changes the counter guidance
  }
  function toggleRental() {
    _state.includeRentalTenants = !_state.includeRentalTenants;
    renderComposer();
  }
  function toggleFutureTenants() {
    _state.includeFutureTenants = !_state.includeFutureTenants;
    scheduleResolve();
  }
  function toggleRentalProp(p) {
    const i = _state.rentalProperties.indexOf(p);
    if (i === -1) _state.rentalProperties.push(p);
    else          _state.rentalProperties.splice(i, 1);
    renderComposer();
  }
  function setSubject(v)      { _state.subject = v; }
  function setBody(v)         { _state.body = v; }
  function setCategory(v)     { _state.categoryCode = v || 'other'; }
  function toggleTestMode()   { _state.testMode = !_state.testMode; renderComposer(); }
  function setTestEmail(v)    { _state.testRedirectEmail = (v || '').trim(); }
  function setTestPhone(v)    { _state.testRedirectPhone = (v || '').trim(); }

  // ── Email preview (3B.6.6) ────────────────────────────────────────────
  // POSTs the current subject/body/category to blast_preview_email and
  // renders the returned HTML in a modal iframe so the admin can see
  // exactly what the branded email looks like before sending. Sample
  // recipient context (Unit 120 · Chelbourne Plaza · owner) is baked in
  // server-side unless caller overrides.
  async function previewEmail() {
    if (!_state.subject.trim() && !_state.body.trim()) {
      toast('Add a subject or body first', 'error');
      return;
    }
    // Pick a real recipient from the resolved preview as sample context
    // when available — otherwise fall back to server defaults.
    const sampleR = _state.recipients.find(r => r.kind === 'hoa_contact')
                 || _state.recipients[0] || null;
    const sample = sampleR ? {
      name:         sampleR.name || '',
      community:    (_state.cats.find(c => c.id === sampleR.community_id) || {}).display_name
                    || (_state.cats.find(c => c.id === sampleR.community_id) || {}).name
                    || '',
      unit:         sampleR.unit_label || '',
      relationship: _state.targetType === 'residents' ? 'resident' : 'owner',
    } : {};

    let html = '';
    try {
      const resp = await callPortalApi('blast_preview_email', {
        subject:      _state.subject,
        body:         _state.body,
        sender_label: 'Willow Partnership',
        category:     _state.categoryCode || 'other',
        sample:       sample,
      });
      if (!resp.ok || !resp.data || !resp.data.ok) {
        toast('Preview failed: ' + ((resp.data && resp.data.error) || resp.http), 'error');
        return;
      }
      html = resp.data.html || '';
    } catch (e) {
      toast('Preview failed: ' + (e.message || e), 'error');
      return;
    }

    // Modal with an iframe so the email's own HTML (<html><body>…) renders
    // in isolation from the admin SPA's styles.
    const existing = document.getElementById('blastEmailPreviewModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'blastEmailPreviewModal';
    modal.style.cssText =
      'position:fixed;inset:0;background:rgba(24,20,14,0.55);z-index:9999;' +
      'display:flex;align-items:center;justify-content:center;padding:24px;';
    modal.innerHTML =
      '<div style="background:#fff;border-radius:6px;max-width:720px;width:100%;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;">' +
        '<div style="padding:12px 18px;border-bottom:1px solid #e5dfd4;display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<div style="font-size:14px;font-weight:600;color:#1a1410;">Email preview</div>' +
            '<div style="font-size:11px;color:#7e7567;">Sample context: ' +
              esc(sample.name || 'Sample Resident') + ' · Unit ' + esc(sample.unit || '120') +
              ' · ' + esc(sample.community || 'Chelbourne Plaza') +
            '</div>' +
          '</div>' +
          '<button class="btn-subtle" onclick="document.getElementById(\'blastEmailPreviewModal\').remove()">Close</button>' +
        '</div>' +
        '<iframe id="blastPreviewFrame" sandbox="allow-same-origin" ' +
          'style="flex:1;min-height:560px;border:0;background:#f4f1ea;"></iframe>' +
      '</div>';
    document.body.appendChild(modal);

    const iframe = document.getElementById('blastPreviewFrame');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  }

  // ── Web-view preview (3B.6.7) ─────────────────────────────────────────
  // Shows what an SMS recipient sees after tapping the short link in a
  // long-blast SMS. Reuses the email template (no test banner, no
  // recipient context — anyone with the link reads the same page) and
  // also shows the SMS body that would be sent so the admin sees both
  // halves of the user experience.
  async function previewWebView() {
    if (!_state.subject.trim() && !_state.body.trim()) {
      toast('Add a subject or body first', 'error');
      return;
    }

    let html = '';
    try {
      const resp = await callPortalApi('blast_preview_email', {
        subject:      _state.subject,
        body:         _state.body,
        sender_label: 'Willow Partnership',
        category:     _state.categoryCode || 'other',
        sample:       {},  // empty → no recipient context, like the real public view
      });
      if (!resp.ok || !resp.data || !resp.data.ok) {
        toast('Preview failed: ' + ((resp.data && resp.data.error) || resp.http), 'error');
        return;
      }
      html = resp.data.html || '';
    } catch (e) {
      toast('Preview failed: ' + (e.message || e), 'error');
      return;
    }

    // Compute the SMS body the recipient would actually receive when in
    // teaser mode — purely for display alongside the web view.
    const tokenSample = _state.shortToken || 'k7m2x9pq';
    const viewUrl = 'https://app.willowpa.com/api/?action=blast_view&t=' + tokenSample;
    let subjEx = _state.subject || '';
    if (subjEx.length > 60) subjEx = subjEx.slice(0, 57).trimEnd() + '…';
    const smsTeaser = '[Willow Partnership] ' + subjEx +
                      (subjEx ? ' — Read: ' : 'New message: ') + viewUrl;

    const existing = document.getElementById('blastEmailPreviewModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'blastEmailPreviewModal';
    modal.style.cssText =
      'position:fixed;inset:0;background:rgba(24,20,14,0.55);z-index:9999;' +
      'display:flex;align-items:center;justify-content:center;padding:24px;';
    modal.innerHTML =
      '<div style="background:#fff;border-radius:6px;max-width:780px;width:100%;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;">' +
        '<div style="padding:12px 18px;border-bottom:1px solid #e5dfd4;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">' +
          '<div>' +
            '<div style="font-size:14px;font-weight:600;color:#1a1410;">🔗 Web view — what tappers see</div>' +
            '<div style="font-size:11px;color:#7e7567;margin-top:2px;">No login required. Tokenized URL is the credential.</div>' +
          '</div>' +
          '<button class="btn-subtle" onclick="document.getElementById(\'blastEmailPreviewModal\').remove()">Close</button>' +
        '</div>' +
        // Show the SMS teaser side-by-side at the top so the admin sees
        // exactly what's in the recipient's text app before they tap.
        '<div style="padding:10px 18px;background:#f5f7fc;border-bottom:1px solid #e5eaf4;font-size:12px;">' +
          '<div style="color:#1a2874;font-weight:600;margin-bottom:4px;">📱 The SMS recipients see:</div>' +
          '<div style="background:#fff;padding:10px 12px;border-radius:8px;border:1px solid #e5eaf4;font-family:-apple-system,Menlo,monospace;font-size:12px;color:#1a1a2e;line-height:1.4;">' +
            esc(smsTeaser) +
          '</div>' +
        '</div>' +
        '<iframe id="blastPreviewFrame" sandbox="allow-same-origin" ' +
          'style="flex:1;min-height:540px;border:0;background:#eef1f8;"></iframe>' +
      '</div>';
    document.body.appendChild(modal);

    const iframe = document.getElementById('blastPreviewFrame');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  }

  // ── Save Draft ────────────────────────────────────────────────────────
  async function saveDraft() {
    if (!_state.subject.trim()) { toast('Subject required to save draft', 'error'); return; }
    if (!_state.body.trim())    { toast('Body required to save draft',    'error'); return; }
    const s = await sb();
    const channels = Object.keys(_state.channels).filter(k => _state.channels[k]);
    const payload = {
      subject:             _state.subject,
      body:                _state.body,
      created_by:          'admin-ui',
      target_type:         _state.targetType,
      target_filter:       { communities: _state.communityIds },
      channels:            channels,
      category_code:       _state.categoryCode || 'other',
      status:              'draft',
      total_count:         _state.recipients.length,
      notes:               _state.notes || null,
      // 3B.6.4 — test-mode redirect. Only set when testMode is on AND the
      // corresponding field is populated. null for real sends.
      test_redirect_email: _state.testMode && _state.testRedirectEmail
        ? _state.testRedirectEmail : null,
      test_redirect_phone: _state.testMode && _state.testRedirectPhone
        ? _state.testRedirectPhone : null,
      // 3B.6.7 — short_token. Generated on first save, preserved on
      // subsequent edits via _state.shortToken (server may also
      // self-heal on send if missing). 8-char lowercase hex.
      short_token: _state.shortToken
        || (_state.shortToken = generateShortToken()),
    };
    try {
      const r = _state.editingId
        ? await s.from('blast_messages').update(payload).eq('id', _state.editingId).select().single()
        : await s.from('blast_messages').insert(payload).select().single();
      if (r.error) throw r.error;
      _state.editingId = r.data.id;

      // Snapshot the currently-resolved recipients. For an edit we
      // clear-and-reinsert so the snapshot reflects the latest filter
      // state.
      if (_state.editingId) {
        await s.from('blast_recipients').delete().eq('blast_id', _state.editingId);
      }
      if (_state.recipients.length) {
        const rows = _state.recipients.map(rec => ({
          blast_id:            _state.editingId,
          contact_id:          rec.kind === 'hoa_contact' ? rec.contact_id : null,
          recipient_kind:      rec.kind === 'tenant_lt' ? 'tenant_lt' : 'hoa_contact',
          name_snapshot:       rec.name,
          phone_e164_snapshot: rec.phone_e164 || null,
          email_snapshot:      rec.email      || null,
          unit_id:             rec.unit_id    || null,
          community_id:        rec.community_id || null,
          status:              'pending',
        }));
        const rr = await s.from('blast_recipients').insert(rows);
        if (rr.error) throw rr.error;
      }
      toast('Draft saved · ' + _state.recipients.length + ' recipients', 'success');
    } catch (e) {
      toast('Save failed: ' + (e.message || e), 'error');
    }
  }

  // ── Real send flow (3B.6.3) ───────────────────────────────────────────
  // 1. Require subject+body+recipients.
  // 2. If no persisted draft yet, save one (so blast_recipients exist).
  // 3. Confirm with a breakdown: X recipients · channels selected.
  // 4. Loop `blast_send` endpoint in batches until remaining=0.
  // 5. Show live progress in the Recipients sidebar.
  async function sendBlast() {
    if (!_state.subject.trim()) { toast('Subject required', 'error'); return; }
    if (!_state.body.trim())    { toast('Body required',    'error'); return; }
    if (!_state.recipients.length) {
      toast('No recipients match the current filter', 'error');
      return;
    }
    const channels = Object.keys(_state.channels).filter(k => _state.channels[k]);
    if (!channels.length) {
      toast('Pick at least one channel', 'error');
      return;
    }
    // 3B.6.7 — SMS length gate. If body > 300 chars, warn that SMS
    // will be silently skipped server-side and give the admin a chance
    // to trim before committing.
    if (channels.indexOf('sms') !== -1 && (_state.body || '').length > 300) {
      const proceed = confirm(
        'Your message is ' + _state.body.length + ' chars — too long for SMS.\n\n' +
        'SMS will be skipped for this blast. Only email (and app, when wired) will deliver.\n\n' +
        'Continue?'
      );
      if (!proceed) return;
    }

    // Test-mode validation — require a redirect for any channel that's on.
    if (_state.testMode) {
      if (_state.channels.email && !_state.testRedirectEmail) {
        toast('Test mode: fill in redirect email', 'error');
        return;
      }
      if (_state.channels.sms && !_state.testRedirectPhone) {
        toast('Test mode: fill in redirect phone', 'error');
        return;
      }
    }

    // Confirmation dialog — include category, count, channels, test mode.
    const catName = (_state.notifCats.find(c => c.code === _state.categoryCode) || {}).name
                 || _state.categoryCode;
    const phones = _state.recipients.filter(r => r.phone_e164).length;
    const emails = _state.recipients.filter(r => r.email).length;
    const willEmail = _state.channels.email ? emails : 0;
    let confirmMsg;
    const willSms     = _state.channels.sms ? phones : 0;
    const smsTooLong  = (_state.body || '').length > 300;
    const smsLine     = !_state.channels.sms
      ? 'channel off'
      : smsTooLong
        ? '0 (body > 300 chars — SMS will be skipped)'
        : willSms + ' will receive';

    if (_state.testMode) {
      confirmMsg =
        '🧪 TEST MODE — send this blast?\n\n' +
        'Category:    ' + catName + '\n' +
        'Subject:     ' + _state.subject.slice(0, 80) + '\n' +
        'Recipients:  ' + _state.recipients.length + ' (all marked sent, none get real message)\n' +
        'Email:       ' + willEmail + ' redirected to ' + (_state.testRedirectEmail || '—') + '\n' +
        'SMS:         ' + (_state.channels.sms
          ? (smsTooLong
              ? 'skipped (body > 300 chars)'
              : willSms + ' redirected to ' + (_state.testRedirectPhone || '—'))
          : 'channel off') + '\n' +
        '\nYou will receive ' + willEmail + ' test emails' +
        (_state.channels.sms && !smsTooLong ? ' and ' + willSms + ' test SMS' : '') + '.';
    } else {
      confirmMsg =
        '⚠ REAL SEND — this goes to actual recipients.\n\n' +
        'Category:    ' + catName + '\n' +
        'Subject:     ' + _state.subject.slice(0, 80) + '\n' +
        'Recipients:  ' + _state.recipients.length + '\n' +
        'Email:       ' + willEmail + ' will receive' +
          (_state.channels.email ? '' : ' (channel off)') + '\n' +
        'SMS:         ' + smsLine + '\n' +
        'App:         not yet wired (3B.6.8)\n\n' +
        'Per-recipient subscription preferences will override channels at send time.';
    }
    if (!confirm(confirmMsg)) return;

    // Persist as "sending" (saveDraft + flip status).
    await saveDraft();
    if (!_state.editingId) { toast('Could not save blast before send', 'error'); return; }

    // Enter send-in-progress UI.
    setSendingUI(true, 'Starting…');

    let total = _state.recipients.length;
    let sent = 0, failed = 0;
    let smsSkippedForLength = false;
    let safety = 0;
    while (safety++ < 40) {   // ≤ 40 * 20 = 800 recipients max per session
      const r = await callPortalApi('blast_send', {
        blast_id: _state.editingId,
        limit: 20,
      });
      if (r.http !== 200 || !r.data || !r.data.ok) {
        setSendingUI(false,
          'Send failed: ' + (r.data && r.data.error ? r.data.error : ('HTTP ' + r.http)));
        toast('Send failed', 'error');
        return;
      }
      sent   += r.data.batch_sent   || 0;
      failed += r.data.batch_failed || 0;
      if (r.data.sms_skipped_for_length) smsSkippedForLength = true;
      setSendingUI(true,
        'Sent ' + sent + ' / ' + total +
        (failed ? ' · ' + failed + ' failed' : '') +
        ' · ' + r.data.remaining + ' remaining');
      if ((r.data.remaining || 0) === 0) break;
    }
    setSendingUI(false,
      'Blast complete · ' + sent + ' sent' +
      (failed ? ' · ' + failed + ' failed' : '') +
      (smsSkippedForLength ? ' · SMS skipped (body > 300 chars)' : '') +
      (failed ? ' (check Drafts to re-run failed recipients)' : ''));
    toast(
      failed ? ('Sent ' + sent + ' · ' + failed + ' failed') : ('Sent ' + sent + ' ✓'),
      failed ? 'error' : 'success');
  }

  function setSendingUI(busy, msg) {
    const box = document.getElementById('blastRecipientList');
    if (!box) return;
    if (busy) {
      box.innerHTML =
        '<div style="padding:10px;background:#eaf4ea;border:1px solid #7a9f75;border-radius:4px;font-size:13px;color:#1a5a25;">' +
          '<div style="font-weight:600;margin-bottom:4px;">📤 Sending…</div>' +
          '<div style="font-size:12px;">' + esc(msg) + '</div>' +
        '</div>';
    } else {
      box.innerHTML =
        '<div style="padding:10px;background:#f9f6f0;border:1px solid #d9d3c5;border-radius:4px;font-size:13px;color:#3a3428;">' +
          '<div style="font-weight:600;margin-bottom:4px;">✅ Done</div>' +
          '<div style="font-size:12px;">' + esc(msg) + '</div>' +
          '<div style="margin-top:10px;">' +
            '<button class="btn-subtle" onclick="WPA_renderBlastPage()" ' +
              'style="padding:6px 14px;font-size:12px;">Compose another</button>' +
          '</div>' +
        '</div>';
    }
  }

  async function openDrafts() {
    const s = await sb();
    const { data } = await s.from('blast_messages')
      .select('id,subject,status,total_count,sent_count,created_at')
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(25);
    if (!data || !data.length) {
      toast('No saved drafts', '');
      return;
    }
    const list = data.map(d =>
      '• ' + (d.subject || '(no subject)') +
      ' · ' + d.total_count + ' recipients' +
      ' · ' + (d.created_at || '').slice(0, 10)
    ).join('\n');
    alert('Saved drafts:\n\n' + list + '\n\n(Draft-loading UI lands in Phase 3B.6.3.)');
  }

  function closeBlast() {
    // Go back to Messages → All (the default)
    if (typeof window.switchModule === 'function') {
      window.switchModule('messages');
    }
  }

  // ── Exports ───────────────────────────────────────────────────────────
  window.WPA_renderBlastPage   = renderBlastPage;
  window.WPA_blastSetTarget    = setTarget;
  window.WPA_blastToggleComm   = toggleComm;
  window.WPA_blastToggleChannel= toggleChannel;
  window.WPA_blastSetSubject   = setSubject;
  window.WPA_blastSetBody      = setBody;
  window.WPA_blastSetCategory  = setCategory;
  window.WPA_blastToggleTestMode = toggleTestMode;
  window.WPA_blastSetTestEmail   = setTestEmail;
  window.WPA_blastSetTestPhone   = setTestPhone;
  // 3B.6.5a rental targeting
  window.WPA_blastToggleRental     = toggleRental;
  window.WPA_blastToggleRentalProp = toggleRentalProp;
  // 3B.6.7 future-tenant filter
  window.WPA_blastToggleFutureTenants = toggleFutureTenants;
  // 3B.6.6 email HTML template polish
  window.WPA_blastPreviewEmail = previewEmail;
  // 3B.6.7 SMS send + char counter + long-message-as-link
  window.WPA_blastUpdateCharCounter = updateCharCounter;
  window.WPA_blastPreviewWebView    = previewWebView;
  window.WPA_blastSaveDraft    = saveDraft;
  window.WPA_blastSend         = sendBlast;
  window.WPA_blastOpenDrafts   = openDrafts;
  window.WPA_blastClose        = closeBlast;
})();
