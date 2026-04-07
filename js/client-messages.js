/* ── PropDesk Client App Messages Integration ─────────────────────
   Connects the Message Center to the Supabase `client_messages` table,
   replacing hardcoded seed data with live two-way messaging.
   Loaded AFTER inbox.js.
   ────────────────────────────────────────────────────────────── */
(function() {
  'use strict';

  // ── Column list for client_messages (must be explicit — Supabase quirk) ──
  var CM_COLS = 'id, thread_id, resident_name, resident_unit, resident_email, resident_phone, subject, body, sender_type, read, property, created_at, updated_at';

  // ── Register platform color for client_app ──
  if (window.PLATFORM_COLORS) {
    window.PLATFORM_COLORS.client_app = { bg: '#10B981', text: '#fff', label: 'Client App' };
  }

  // ── Live client messages cache ──
  window._liveClientMsgs = [];

  // ── Fetch live client messages from Supabase ──
  window._refreshClientMsgs = async function() {
    try {
      var res = await sb.from('client_messages').select(CM_COLS)
        .order('created_at', { ascending: false });
      if (res.error) { console.error('Client fetch error:', res.error); return; }
      var data = res.data || [];

      // Group by thread_id, build Message Center format
      var threadMap = {};
      data.forEach(function(m) {
        var tid = m.thread_id || m.id;
        if (!threadMap[tid]) {
          threadMap[tid] = {
            id: 'ca-' + tid,
            _threadId: tid,
            from: m.resident_name || 'Resident',
            unit: m.resident_unit || '',
            _email: m.resident_email || '',
            _phone: m.resident_phone || '',
            property: m.property || '',
            date: m.created_at,
            subject: m.subject || 'Message',
            body: m.body,
            unread: false,
            source: 'client',
            _messages: []
          };
        }
        threadMap[tid]._messages.push(m);
        if (!m.read && m.sender_type === 'resident') {
          threadMap[tid].unread = true;
        }
        // Use latest message as preview
        if (new Date(m.created_at) > new Date(threadMap[tid].date)) {
          threadMap[tid].date = m.created_at;
          threadMap[tid].body = m.body;
        }
      });

      window._liveClientMsgs = Object.values(threadMap);
    } catch(e) {
      console.error('Client messages load failed:', e);
    }
  };

  // ── Wrap _getAllCenterMessages to replace seed data with live Supabase data ──
  var _origGetAll = window._getAllCenterMessages;
  window._getAllCenterMessages = function() {
    var msgs = _origGetAll();
    // Remove hardcoded seed client messages
    var nonClient = msgs.filter(function(m) { return m.source !== 'client'; });
    // Add live Supabase client messages
    if (window._liveClientMsgs) {
      window._liveClientMsgs.forEach(function(m) {
        nonClient.push(Object.assign({}, m));
      });
    }
    nonClient.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    return nonClient;
  };

  // ── Send management reply to client_messages ──
  window.sendClientReply = async function(msgId) {
    var ta = document.querySelector('textarea');
    var body = ta ? ta.value.trim() : '';
    if (!body) { toast('Please type a reply'); return; }

    var msg = (window._liveClientMsgs || []).find(function(m) { return m.id === msgId; });
    if (!msg) { toast('Message not found', 'error'); return; }

    try {
      var res = await sb.from('client_messages').insert({
        thread_id: msg._threadId,
        resident_name: msg.from,
        resident_unit: msg.unit || '',
        resident_email: msg._email || '',
        resident_phone: msg._phone || '',
        subject: msg.subject,
        body: body,
        sender_type: 'management',
        read: false,
        property: msg.property || 'Chelbourne'
      }).select();

      if (res.error) {
        console.error('Reply error:', res.error);
        toast('Failed to send reply', 'error');
        return;
      }
      toast('Reply sent!');
      await window._refreshClientMsgs();
      renderMessageCenter();
    } catch(e) {
      console.error('Reply failed:', e);
      toast('Error sending reply', 'error');
    }
  };

  // ── Patch openMsgCenterDetail for client message replies & thread view ──
  var _origOpen = window.openMsgCenterDetail;
  window.openMsgCenterDetail = function(id) {
    _origOpen(id);

    // For client messages: wire Send Reply and show full conversation
    if (id && id.indexOf('ca-') === 0) {
      setTimeout(function() {
        // Fix Send Reply button — replace stub onclick with real handler
        var btns = document.querySelectorAll('button');
        for (var i = 0; i < btns.length; i++) {
          if (btns[i].textContent.trim() === 'Send Reply') {
            btns[i].removeAttribute('onclick');
            btns[i].addEventListener('click', function() {
              sendClientReply(id);
            });
            break;
          }
        }

        // Show full conversation thread if multiple messages
        var msg = (window._liveClientMsgs || []).find(function(m) { return m.id === id; });
        if (msg && msg._messages && msg._messages.length > 1) {
          var chatHtml = '<div style="margin:12px 0;border-top:1px solid var(--border);padding-top:12px;">';
          var sorted = msg._messages.slice().sort(function(a, b) {
            return new Date(a.created_at) - new Date(b.created_at);
          });
          sorted.forEach(function(m) {
            var isResident = m.sender_type === 'resident';
            var align = isResident ? 'flex-start' : 'flex-end';
            var bg = isResident ? '#f3f4f6' : 'var(--accent, #7d5228)';
            var color = isResident ? '#1f2937' : '#fff';
            var label = isResident ? m.resident_name : 'Management';
            var time = new Date(m.created_at).toLocaleString();
            chatHtml += '<div style="display:flex;justify-content:' + align + ';margin-bottom:8px;">' +
              '<div style="max-width:70%;padding:8px 12px;border-radius:12px;background:' + bg + ';color:' + color + ';">' +
              '<div style="font-size:11px;opacity:0.7;margin-bottom:2px;">' + label + ' &middot; ' + time + '</div>' +
              '<div style="font-size:13px;">' + m.body + '</div>' +
              '</div></div>';
          });
          chatHtml += '</div>';

          // Replace the single-message body with the full thread
          var bodyEl = document.querySelector('div[style*="padding:16px 20px"] > div[style*="font-size:14px"]');
          if (bodyEl) {
            bodyEl.innerHTML = chatHtml;
          } else {
            // Fallback: insert before the textarea
            var ta = document.querySelector('textarea');
            if (ta && ta.parentElement) {
              var chatDiv = document.createElement('div');
              chatDiv.innerHTML = chatHtml;
              ta.parentElement.insertBefore(chatDiv, ta);
            }
          }
        }
      }, 50);
    }
  };

  // ── Mark client messages as read ──
  var _origMarkRead = window.markChannelRead;
  if (_origMarkRead) {
    window.markChannelRead = async function(channelId) {
      if (typeof channelId === 'string' && channelId.indexOf('client_') === 0) {
        var threadId = channelId.replace('client_', '');
        try {
          await sb.from('client_messages').update({ read: true })
            .eq('thread_id', threadId)
            .eq('sender_type', 'resident')
            .eq('read', false);
        } catch(e) {
          console.error('Mark client read error:', e);
        }
        return;
      }
      return _origMarkRead(channelId);
    };
  }

  // ── Initial load ──
  window._refreshClientMsgs().then(function() {
    if (typeof renderMessageCenter === 'function') {
      // Only re-render if Message Center is currently visible
      var el = document.getElementById('page-msg-center');
      if (el && getComputedStyle(el).display !== 'none') {
        renderMessageCenter();
      }
    }
    console.log('✅ Client App Messages integration loaded (' + window._liveClientMsgs.length + ' threads)');
  });
})();
