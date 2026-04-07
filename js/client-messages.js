/* ── PropDesk Client App Messages Integration ─────────────────────
   Connects the Message Center to the Supabase `client_messages` table,
   replacing hardcoded seed data with live two-way messaging.
   Loaded AFTER inbox.js.
   v2 — single chat per resident, read receipts
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

  // ── Build a unique resident key (one chat per person) ──
  function residentKey(m) {
    if (m.resident_email) return m.resident_email.toLowerCase().trim();
    return (m.resident_name || 'Resident').toLowerCase().trim() + '|' + (m.resident_unit || '').trim();
  }

  // ── Fetch live client messages from Supabase ──
  window._refreshClientMsgs = async function() {
    try {
      var res = await sb.from('client_messages').select(CM_COLS)
        .order('created_at', { ascending: false });
      if (res.error) { console.error('Client fetch error:', res.error); return; }
      var data = res.data || [];

      // Group by RESIDENT (single ongoing chat), not by thread_id
      var resMap = {};
      data.forEach(function(m) {
        var key = residentKey(m);
        if (!resMap[key]) {
          resMap[key] = {
            id: 'ca-' + key.replace(/[^a-z0-9]/g, '_'),
            _residentKey: key,
            _allThreadIds: [],
            from: m.resident_name || 'Resident',
            unit: m.resident_unit || '',
            _email: m.resident_email || '',
            _phone: m.resident_phone || '',
            property: m.property || '',
            date: m.created_at,
            subject: m.subject || 'Message',
            body: m.body,
            unread: false,
            _unreadCount: 0,
            source: 'client',
            _messages: []
          };
        }
        var entry = resMap[key];
        entry._messages.push(m);

        // Track all thread_ids this resident has
        if (m.thread_id && entry._allThreadIds.indexOf(m.thread_id) === -1) {
          entry._allThreadIds.push(m.thread_id);
        }

        // Count unread resident messages
        if (!m.read && m.sender_type === 'resident') {
          entry.unread = true;
          entry._unreadCount++;
        }

        // Use the latest message as preview
        if (new Date(m.created_at) > new Date(entry.date)) {
          entry.date = m.created_at;
          entry.body = m.body;
          entry.subject = m.subject || entry.subject;
        }
      });

      window._liveClientMsgs = Object.values(resMap);
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

    // Use the most recent thread_id for the reply
    var latestThread = msg._allThreadIds.length > 0
      ? msg._allThreadIds[msg._allThreadIds.length - 1]
      : msg._residentKey;

    try {
      var res = await sb.from('client_messages').insert({
        thread_id: latestThread,
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
      // Reopen the detail to show updated conversation
      var refreshedMsg = (window._liveClientMsgs || []).find(function(m) { return m.id === msgId; });
      if (refreshedMsg) {
        renderMessageCenter();
        setTimeout(function() { openMsgCenterDetail(msgId); }, 100);
      } else {
        renderMessageCenter();
      }
    } catch(e) {
      console.error('Reply failed:', e);
      toast('Error sending reply', 'error');
    }
  };

  // ── Read-receipt badge helper ──
  function readBadge(m) {
    if (m.sender_type === 'management') {
      // Management message — show if resident has read it
      if (m.read) {
        return '<span style="margin-left:6px;color:#10B981;font-size:12px;" title="Read by resident">✓✓</span>';
      } else {
        return '<span style="margin-left:6px;color:#9ca3af;font-size:12px;" title="Delivered">✓</span>';
      }
    }
    // Resident message — show if management has read it
    if (m.read) {
      return '<span style="margin-left:6px;color:#10B981;font-size:11px;" title="Read">● read</span>';
    }
    return '';
  }

  // ── Patch openMsgCenterDetail for client message replies & thread view ──
  var _origOpen = window.openMsgCenterDetail;
  window.openMsgCenterDetail = function(id) {
    _origOpen(id);

    // For client messages: wire Send Reply and show full conversation
    if (id && id.indexOf('ca-') === 0) {
      setTimeout(function() {
        // Mark all unread resident messages as read in Supabase
        var msg = (window._liveClientMsgs || []).find(function(m) { return m.id === id; });
        if (msg && msg._messages) {
          var unreadIds = [];
          msg._messages.forEach(function(m) {
            if (!m.read && m.sender_type === 'resident') unreadIds.push(m.id);
          });
          if (unreadIds.length > 0) {
            sb.from('client_messages').update({ read: true })
              .in('id', unreadIds)
              .then(function() {
                // Update local cache
                msg._messages.forEach(function(m) {
                  if (m.sender_type === 'resident') m.read = true;
                });
                msg.unread = false;
                msg._unreadCount = 0;
              });
          }
        }

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

        // Show full conversation thread with read receipts
        if (msg && msg._messages && msg._messages.length > 0) {
          var chatHtml = '<div style="margin:12px 0;border-top:1px solid var(--border);padding-top:12px;max-height:400px;overflow-y:auto;" id="clientChatThread">';
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
            var badge = readBadge(m);
            chatHtml += '<div style="display:flex;justify-content:' + align + ';margin-bottom:8px;">' +
              '<div style="max-width:70%;padding:8px 12px;border-radius:12px;background:' + bg + ';color:' + color + ';">' +
              '<div style="font-size:11px;opacity:0.7;margin-bottom:2px;">' + label + ' &middot; ' + time + badge + '</div>' +
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

          // Scroll to bottom of thread
          setTimeout(function() {
            var thread = document.getElementById('clientChatThread');
            if (thread) thread.scrollTop = thread.scrollHeight;
          }, 50);
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
    console.log('✅ Client App Messages v2 loaded (' + window._liveClientMsgs.length + ' residents)');
  });
})();
