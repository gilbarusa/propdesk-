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

console.log('[blast] loaded v20260423-phase3b.12');

(function(){
  'use strict';

  // ── Module state (reset on each fresh render) ─────────────────────────
  const _state = {
    subject:    '',
    body:       '',
    targetType: 'owners',        // 'owners' | 'residents' | 'all'
    communityIds: [],            // empty = all communities
    channels:   { sms: true, email: true, app: false },
    recipients: [],              // last resolved list
    cats:       [],              // community catalog
    editingId:  null,            // if opened a draft
    notes:      '',
  };
  let _resolveTimer = null;

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
      const cr = await s.from('hoa_communities')
        .select('id,name,display_name,is_active')
        .eq('is_active', true)
        .order('name');
      _state.cats = cr.data || [];
      renderComposer();
    } catch (e) {
      page.innerHTML = '<div style="padding:24px;color:#a22;">Error: ' + esc(e.message || e) + '</div>';
    }
  }

  function renderComposer() {
    const page = document.getElementById('page-blast');
    if (!page) return;

    const commChips = _state.cats.map(c => {
      const selected = _state.communityIds.includes(c.id);
      return '<label class="blast-chip" data-id="' + esc(c.id) + '" ' +
        'style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;margin-right:6px;margin-bottom:6px;' +
               'border-radius:14px;cursor:pointer;font-size:12px;border:1px solid ' +
               (selected ? '#7a9f75;background:#eaf4ea;color:#1a5a25;' : '#d9d3c5;background:#fff;color:#5a5040;') + '">' +
        '<input type="checkbox" value="' + esc(c.id) + '"' + (selected ? ' checked' : '') +
          ' onchange="WPA_blastToggleComm(\'' + esc(c.id) + '\')" ' +
          'style="margin:0;">' +
        esc(c.display_name || c.name) +
        '</label>';
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

            // Target section
            '<div class="dash-panel" style="padding:16px;">' +
              '<h3 style="font-size:13px;margin:0 0 10px;">🎯 Target</h3>' +

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
                'None selected = all communities. Tap a chip to add/remove.' +
              '</div>' +
            '</div>' +

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

            // Message section
            '<div class="dash-panel" style="padding:16px;margin-top:12px;">' +
              '<h3 style="font-size:13px;margin:0 0 10px;">✍ Message</h3>' +
              '<label style="font-size:11px;color:#7e7567;">Subject</label>' +
              '<input id="blastSubject" type="text" value="' + esc(_state.subject) + '" ' +
                'oninput="WPA_blastSetSubject(this.value)" ' +
                'style="width:100%;padding:8px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:13px;margin:4px 0 12px;">' +
              '<label style="font-size:11px;color:#7e7567;">Body</label>' +
              '<textarea id="blastBody" rows="6" oninput="WPA_blastSetBody(this.value)" ' +
                'style="width:100%;padding:8px 10px;border:1px solid #d9d3c5;border-radius:4px;font:inherit;font-size:13px;margin:4px 0 4px;resize:vertical;">' +
                esc(_state.body) +
              '</textarea>' +
              '<div style="font-size:11px;color:#9e9485;">' +
                'Plain text for SMS (auto-converted to HTML for email). Future: template placeholders like {{name}}, {{unit}}.' +
              '</div>' +
            '</div>' +

            // Action bar
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">' +
              '<button class="btn-subtle" onclick="WPA_blastClose()">Cancel</button>' +
              '<div style="display:flex;gap:8px;">' +
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

      // 1. Units in scope (filter by selected communities).
      let unitQuery = s.from('hoa_units').select('id,unit_label,community_id,building_label');
      if (_state.communityIds.length) {
        unitQuery = unitQuery.in('community_id', _state.communityIds);
      }
      const { data: units, error: unitErr } = await unitQuery;
      if (unitErr) throw unitErr;
      if (!units || !units.length) {
        _state.recipients = [];
        renderPreview();
        return;
      }
      const unitIds   = units.map(u => u.id);
      const unitById  = {};
      units.forEach(u => { unitById[u.id] = u; });

      // 2. Active unit_contacts for those units, filtered by relationship
      //    per targetType.
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
      if (!contactIds.length) {
        _state.recipients = [];
        renderPreview();
        return;
      }

      // 3. Contacts — dedup happens here (one row per contact_id even
      //    if they link to multiple units in scope).
      const { data: contacts, error: contErr } = await s.from('hoa_contacts')
        .select('id,full_name,first_name,last_name,email,phone,phone_e164,is_active')
        .in('id', contactIds)
        .eq('is_active', true);
      if (contErr) throw contErr;

      // Build recipients with first-matching unit context (for reply threading).
      const firstUnitByContact = {};
      (ucRows || []).forEach(r => {
        if (!firstUnitByContact[r.contact_id]) {
          firstUnitByContact[r.contact_id] = r.unit_id;
        }
      });

      _state.recipients = (contacts || []).map(c => ({
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
      })).sort((a, b) => a.name.localeCompare(b.name));

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

    let h =
      '<div style="font-size:12px;color:#3a3428;margin-bottom:10px;">' +
        '<strong style="font-size:20px;color:#1a5a25;">' + n + '</strong>' +
        ' recipient' + (n === 1 ? '' : 's') +
        ' <span style="color:#9e9485;font-size:11px;">· deduped by contact</span>' +
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
      h += '<div style="padding:14px;background:#faf6ee;border-radius:4px;color:#9e9485;text-align:center;font-size:12px;">' +
           'No recipients match the current target + community filter.' +
           '</div>';
      box.innerHTML = h;
      return;
    }

    h += '<div style="max-height:480px;overflow-y:auto;border:1px solid #e5dfd4;border-radius:4px;">';
    _state.recipients.forEach(r => {
      h += '<div style="padding:8px 10px;border-bottom:1px solid #f0ebe2;font-size:12px;">' +
           '<strong>' + esc(r.name) + '</strong>' +
             (r.unit_label ? ' <span style="color:#9e9485;">· Unit ' + esc(r.unit_label) + '</span>' : '') +
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
    const i = _state.communityIds.indexOf(id);
    if (i === -1) _state.communityIds.push(id);
    else          _state.communityIds.splice(i, 1);
    renderComposer();
  }
  function toggleChannel(k) {
    _state.channels[k] = !_state.channels[k];
    renderPreview();
  }
  function setSubject(v) { _state.subject = v; }
  function setBody(v)    { _state.body = v; }

  // ── Save Draft ────────────────────────────────────────────────────────
  async function saveDraft() {
    if (!_state.subject.trim()) { toast('Subject required to save draft', 'error'); return; }
    if (!_state.body.trim())    { toast('Body required to save draft',    'error'); return; }
    const s = await sb();
    const channels = Object.keys(_state.channels).filter(k => _state.channels[k]);
    const payload = {
      subject:       _state.subject,
      body:          _state.body,
      created_by:    'admin-ui',
      target_type:   _state.targetType,
      target_filter: { communities: _state.communityIds },
      channels:      channels,
      status:        'draft',
      total_count:   _state.recipients.length,
      notes:         _state.notes || null,
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
          contact_id:          rec.contact_id,
          recipient_kind:      'hoa_contact',
          name_snapshot:       rec.name,
          phone_e164_snapshot: rec.phone_e164 || null,
          email_snapshot:      rec.email      || null,
          unit_id:             rec.unit_id,
          community_id:        rec.community_id,
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

  // ── Stubs for features queued in later iterations ─────────────────────
  function sendBlast() {
    alert(
      'Sending is wired in the next iteration (3B.6.3).\n\n' +
      'For now, "Save draft" persists the blast + its resolved recipients. ' +
      'Next iteration adds the actual SMS + Email dispatch + cost preview.'
    );
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
  window.WPA_blastSaveDraft    = saveDraft;
  window.WPA_blastSend         = sendBlast;
  window.WPA_blastOpenDrafts   = openDrafts;
  window.WPA_blastClose        = closeBlast;
})();
