/* == PropDesk Client App Messages Integration =======================
   Connects the Message Center to the Supabase `client_messages` table,
   replacing hardcoded seed data with live two-way messaging.
   Loaded AFTER inbox.js.
   v2 -- single chat per resident, read receipts
   ================================================================= */
(function() {
  'use strict';

  // -- Column list for client_messages (must be explicit -- Supabase quirk) --
  var CM_COLS = 'id, thread_id, resident_name, resident_unit, resident_email, resident_phone, subject, body, sender_type, read, property, created_at, updated_at';

  // -- Register platform color for client_app --
  if (window.PLATFORM_COLORS) {
    window.PLATFORM_COLORS.client_app = { bg: '#10B981', text: '#fff', label: 'Client App' };
  }

  // -- Live client messages cache --
  window._liveClientMsgs = [];

  // -- Build a unique resident key (one chat per person) --
  function residentKey(m) {
    if (m.resident_email) return m.resident_email.toLowerCase().trim();
    return (m.resident_name || 'Resident').toLowerCase().trim() + '|' + (m.resident_unit || '').trim();
  }

  // -- Fetch live client messages from Supabase --
  window._refreshClientMsgs = async function() {
    try {
      var res = await sb.from('client_messages').select(CM_COLS)
        .order('created_at', { ascending: false });
      if (res.error) { console.error('Client fetch error:', res.error); return; }
      var data = res.data || [];
CenterDetail(msgId); }, 100);
      } else {
        renderMessageCenter();
      }
    } catch(e) {
      console.error('Reply failed:', e);
      toast('Error sending reply', 'error');
    }
  };

  // -- Read-receipt badge helper --
  function readBadge(m) {
    if (m.sender_type === 'management') {
      // Management message -- show if resident has read it
      if (m.read) {
        return '<span style="margin-left:6px;color:#10B981;font-size:12px;" title="Read by resident">&#10003;&#10003;</span>';
      } else {
        return '<span style="margin-left:6px;color:#9ca3af;font-size:12px;" title="Delivered">&#10003;</span>';
      }
    }
    // Resident message -- show if management has read it
    if (m.read) {
      return '<span style="margin-left:6px;color:#10B981;font-size:11px;" title="Read">&#9679; read</span>';
    }
    return '';
  }

  // -- AI Proxy URL (reuse existing FieldTrack proxy with Anthropic key) --
  var AI_PROXY = 'https://tech.willowpa.com/proxy.php';

  // -- Build system prompt from WILLOW_KB for AI suggestions --
  function buildAISystemPrompt() {
    var kb = (typeof WILLOW_KB !== 'undefined') ? WILLOW_KB : {};
    var prompt = 'You are a helpful property management assistant for Willow Partnership, LLC. ';
    prompt += 'You help draft replies to resident and guest messages.\n\n';
    prompt += '## Company Info\n';
    if (kb.company) {
      prompt += '- Name: ' + (kb.company.name || '') + '\n';
      prompt += '- Phone: ' + (kb.company.phone || '') + '\n';
      prompt += '- Email: ' + (kb.company.email || '') + '\n';
      prompt += '- Hours: ' + (kb.company.hours || '') + '\n';
      prompt += '- After Hours Policy: ' + (kb.company.afterHours || '') + '\n';
    }
    prompt += '\n## Properties\n';
    if (kb.properties) {
      var props = kb.properties;
      if (props.chelbourne) {
        prompt += '- Chelbourne Plaza: ' + props.chelbourne.address + '\n';
        prompt += '  Entrance PIN: ' + props.chelbourne.entrancePin + '\n';
        prompt += '  WiFi: ' + props.chelbourne.wifi.network + ' / ' + props.chelbourne.wifi.password + '\n';
        prompt += '  Alt WiFi: ' + (props.chelbourne.altWifi ? props.chelbourne.altWifi.network + ' / ' + props.chelbourne.altWifi.password : '') + '\n';
        prompt += '  Laundry: ' + props.chelbourne.laundry + '\n';
        prompt += '  Parking: ' + props.chelbourne.parking + '\n';
        prompt += '  Trash: ' + props.chelbourne.trash + '\n';
      }
      if (props.central) {
        prompt += '- Central Ave: ' + props.central.address + '\n';
        prompt += '  Entrance: ' + props.central.entranceCode + '\n';
        prompt += '  WiFi: ' + props.central.wifi.network + ' / ' + props.central.wifi.password + '\n';
      }
      if (props.valleyRd) {
        prompt += '- Valley Rd: ' + props.valleyRd.address + '\n';
      }
    }
    prompt += '\n## Tone Guidelines\n';
    prompt += '- Always use "We" not "I"\n';
    prompt += '- Professional but warm tone\n';
    prompt += '- Never use slang or overly casual language\n';
    prompt += '- Never promise specific outcomes for refunds\n';
    prompt += '- Never share other guests information\n';
    prompt += '- Sign off with: Best regards, Thank you!, or See you soon!\n';
    prompt += '\n## Key Policies\n';
    prompt += '- Parking tags must be displayed immediately or vehicles may be towed\n';
    prompt += '- Extra parking: https://parking.willowpa.com/ select property, password: 1234\n';
    prompt += '- Guests are not responsible for utilities\n';
    prompt += '- Pets require approval with breed/type description first\n';
    prompt += '- Cancellation policy does not typically allow refunds for reserved days\n';
    prompt += '- Check-in info sent 1 day before reservation\n';
    prompt += '- After hours: only urgent matters addressed, others next business day\n';
    prompt += '\nDraft a concise, helpful reply. Do NOT include subject lines or email headers. Just the message body. Keep it under 150 words unless the topic requires more detail.';
    return prompt;
  }

  // -- Call Anthropic API for AI suggestion --
  window._getAISuggestion = async function(msg) {
    if (!msg || !msg._messages) return null;

    // Build conversation context from the last 10 messages
    var sorted = msg._messages.slice().sort(function(a, b) {
      return new Date(a.created_at) - new Date(b.created_at);
    });
    var recent = sorted.slice(-10);
    var convoText = recent.map(function(m) {
      var who = m.sender_type === 'resident' ? (m.resident_name || 'Resident') : 'Management';
      return who + ': ' + m.body;
    }).join('\n');

    var userPrompt = 'Resident: ' + msg.from;
    if (msg.unit) userPrompt += ' (Unit ' + msg.unit + ')';
    if (msg.property) userPrompt += ' at ' + msg.property;
    userPrompt += '\n\nConversation:\n' + convoText;
    userPrompt += '\n\nDraft a reply to the resident\'s latest message.';

    try {
      var resp = await fetch(AI_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: buildAISystemPrompt(),
          messages: [{ role: 'user', content: userPrompt }]
        })
      });
      var data = await resp.json();
      if (data.error) {
        console.error('AI suggestion error:', data.error);
        return null;
      }
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      }
      return null;
    } catch(e) {
      console.error('AI suggestion failed:', e);
      return null;
    }
  };

  // -- Build AI suggestion UI panel --
  function buildSuggestionPanel(msg) {
    // Get quick KB suggestion first
    var kbResult = null;
    if (typeof WillowReplyBot !== 'undefined' && WillowReplyBot && msg._messages) {
      var lastResident = null;
      var sorted = msg._messages.slice().sort(function(a, b) {
        return new Date(a.created_at) - new Date(b.created_at);
      });
      for (var i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i].sender_type === 'resident') {
          lastResident = sorted[i];
          break;
        }
      }
      if (lastResident) {
        kbResult = WillowReplyBot.suggestReply(lastResident.body, {
          guestName: msg.from,
          property: msg.property || 'chelbourne',
          unit: msg.unit || ''
        });
      }
    }

    var html = '<div id="aiSuggestionPanel" style="margin:12px 0;padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#fefce8;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">';
    html += '<div style="display:flex;align-items:center;gap:8px;">';
    html += '<span style="font-size:16px;">&#9889;</span>';
    html += '<span style="font-weight:700;font-size:14px;color:#92400e;">AI Reply Assistant</span>';
    html += '</div>';
    html += '<button id="aiSuggestBtn" onclick="window._triggerAISuggest()" style="padding:6px 16px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">AI Suggest Reply</button>';
    html += '</div>';

    // Quick KB suggestion
    if (kbResult && kbResult.suggestion) {
      html += '<div id="kbSuggestionBox" style="margin-bottom:10px;">';
      html += '<div style="font-size:11px;color:#6b7280;margin-bottom:4px;">Quick suggestion (' + Math.round(kbResult.confidence * 100) + '% match - ' + kbResult.category + '/' + kbResult.subcategory + '):</div>';
      html += '<div style="background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:10px;font-size:13px;color:#374151;line-height:1.5;white-space:pre-wrap;">' + kbResult.suggestion.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
      html += '<button onclick="window._useKBSuggestion()" style="margin-top:6px;padding:4px 12px;background:#10B981;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Use This</button>';
      html += '</div>';
    }

    // AI suggestion area (populated after clicking button)
    html += '<div id="aiSuggestionResult" style="display:none;margin-top:10px;">';
    html += '<div style="font-size:11px;color:#6b7280;margin-bottom:4px;">AI-generated suggestion:</div>';
    html += '<div id="aiSuggestionText" style="background:#fff;border:1px solid #7c3aed;border-radius:8px;padding:10px;font-size:13px;color:#374151;line-height:1.5;white-space:pre-wrap;"></div>';
    html += '<div style="display:flex;gap:8px;margin-top:6px;">';
    html += '<button onclick="window._useAISuggestion()" style="padding:4px 12px;background:#7c3aed;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Use This</button>';
    html += '<button onclick="window._triggerAISuggest()" style="padding:4px 12px;background:#e5e7eb;color:#374151;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Regenerate</button>';
    html += '</div>';
    html += '</div>';

    // Loading state
    html += '<div id="aiSuggestionLoading" style="display:none;margin-top:10px;text-align:center;padding:12px;">';
    html += '<span style="color:#7c3aed;font-size:13px;">Thinking...</span>';
    html += '</div>';

    html += '</div>';
    return { html: html, kbSuggestion: kbResult ? kbResult.suggestion : '' };
  }

  // -- Stash current message ID for AI handlers --
  window._currentAIMsgId = null;
  window._currentKBText = '';

  // -- Trigger AI suggestion --
  window._triggerAISuggest = async function() {
    var btn = document.getElementById('aiSuggestBtn');
    var loading = document.getElementById('aiSuggestionLoading');
    var result = document.getElementById('aiSuggestionResult');
    if (btn) btn.disabled = true;
    if (btn) btn.textContent = 'Thinking...';
    if (loading) loading.style.display = 'block';
    if (result) result.style.display = 'none';

    var msg = (window._liveClientMsgs || []).find(function(m) { return m.id === window._currentAIMsgId; });
    if (!msg) {
      if (btn) { btn.disabled = false; btn.textContent = 'AI Suggest Reply'; }
      if (loading) loading.style.display = 'none';
      return;
    }

    var suggestion = await window._getAISuggestion(msg);
    if (loading) loading.style.display = 'none';
    if (btn) { btn.disabled = false; btn.textContent = 'AI Suggest Reply'; }

    if (suggestion) {
      var textEl = document.getElementById('aiSuggestionText');
      if (textEl) textEl.textContent = suggestion;
      if (result) result.style.display = 'block';
    } else {
      toast('AI suggestion unavailable right now', 'error');
    }
  };

  // -- Use KB suggestion --
  window._useKBSuggestion = function() {
    var ta = document.querySelector('textarea[placeholder="Type your reply..."]');
    if (ta && window._currentKBText) {
      ta.value = window._currentKBText;
      ta.focus();
    }
  };

  // -- Use AI suggestion --
  window._useAISuggestion = function() {
    var textEl = document.getElementById('aiSuggestionText');
    var ta = document.querySelector('textarea[placeholder="Type your reply..."]');
    if (ta && textEl) {
      ta.value = textEl.textContent;
      ta.focus();
    }
  };

  // -- Patch openMsgCenterDetail for client message replies & thread view --
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

        // Fix Send Reply button -- replace stub onclick with real handler
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
            var ta = document.querySelector('textarea[placeholder="Type your reply..."]');
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

        // Inject AI suggestion panel above the reply textarea
        window._currentAIMsgId = id;
        var panel = buildSuggestionPanel(msg);
        window._currentKBText = panel.kbSuggestion;
        var ta = document.querySelector('textarea[placeholder="Type your reply..."]');
        if (ta && ta.parentElement && !document.getElementById('aiSuggestionPanel')) {
          var panelDiv = document.createElement('div');
          panelDiv.innerHTML = panel.html;
          ta.parentElement.insertBefore(panelDiv, ta);
        }
      }, 50);
    }
  };

  // -- Mark client messages as read --
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

  // -- Compose New Message (outbound) --
  window.openComposeMessage = function() {
    var page = document.getElementById('page-msg-center');
    if (!page) return;

    page.innerHTML = '<div style="padding:20px;max-width:700px;">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">' +
        '<button onclick="renderMessageCenter()" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--text);">&#8592; Back to Messages</button>' +
        '<h2 style="margin:0;font-size:22px;">New Message</h2>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;">' +
        '<div>' +
          '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Resident Name *</label>' +
          '<input id="compose-name" type="text" placeholder="e.g. John Smith" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;">' +
        '</div>' +
        '<div style="display:flex;gap:12px;">' +
          '<div style="flex:1;">' +
            '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Unit</label>' +
            '<input id="compose-unit" type="text" placeholder="e.g. 4B" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;">' +
          '</div>' +
          '<div style="flex:1;">' +
            '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Property</label>' +
            '<input id="compose-property" type="text" placeholder="e.g. Chelbourne" value="Chelbourne" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;">' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;">' +
          '<div style="flex:1;">' +
            '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Email</label>' +
            '<input id="compose-email" type="email" placeholder="email@example.com" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;">' +
          '</div>' +
          '<div style="flex:1;">' +
            '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Phone</label>' +
            '<input id="compose-phone" type="tel" placeholder="+1 555-000-0000" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;">' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Channel *</label>' +
          '<div id="compose-channel-btns" style="display:flex;gap:8px;">' +
            '<button data-ch="app" class="compose-ch-btn" style="padding:8px 18px;border-radius:20px;border:2px solid #10B981;background:#10B981;color:#fff;font-weight:600;cursor:pointer;">APP</button>' +
            '<button data-ch="sms" class="compose-ch-btn" style="padding:8px 18px;border-radius:20px;border:2px solid var(--border);background:#fff;color:var(--text);font-weight:600;cursor:pointer;">SMS</button>' +
            '<button data-ch="whatsapp" class="compose-ch-btn" style="padding:8px 18px;border-radius:20px;border:2px solid var(--border);background:#fff;color:var(--text);font-weight:600;cursor:pointer;">WhatsApp</button>' +
            '<button data-ch="email" class="compose-ch-btn" style="padding:8px 18px;border-radius:20px;border:2px solid var(--border);background:#fff;color:var(--text);font-weight:600;cursor:pointer;">Email</button>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Subject</label>' +
          '<input id="compose-subject" type="text" placeholder="Subject line" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;">' +
        '</div>' +
        '<div>' +
          '<label style="font-weight:600;font-size:13px;display:block;margin-bottom:4px;">Message *</label>' +
          '<textarea id="compose-body" placeholder="Type your message..." rows="5" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:14px;resize:vertical;"></textarea>' +
        '</div>' +
        '<button id="compose-send-btn" style="padding:12px 28px;background:var(--accent,#7d5228);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;align-self:flex-start;">Send Message</button>' +
      '</div>' +
    '</div>';

    // Channel toggle logic
    var selectedChannel = 'app';
    var chBtns = document.querySelectorAll('.compose-ch-btn');
    chBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        selectedChannel = btn.getAttribute('data-ch');
        chBtns.forEach(function(b) {
          var active = b.getAttribute('data-ch') === selectedChannel;
          b.style.background = active ? '#10B981' : '#fff';
          b.style.color = active ? '#fff' : 'var(--text)';
          b.style.borderColor = active ? '#10B981' : 'var(--border)';
        });
      });
    });

    // Send handler
    document.getElementById('compose-send-btn').addEventListener('click', async function() {
      var name = document.getElementById('compose-name').value.trim();
      var body = document.getElementById('compose-body').value.trim();
      if (!name) { toast('Please enter a resident name'); return; }
      if (!body) { toast('Please type a message'); return; }

      var unit = document.getElementById('compose-unit').value.trim();
      var property = document.getElementById('compose-property').value.trim() || 'Chelbourne';
      var email = document.getElementById('compose-email').value.trim();
      var phone = document.getElementById('compose-phone').value.trim();
      var subject = document.getElementById('compose-subject').value.trim() || 'Message';

      // For APP channel, insert into client_messages table
      if (selectedChannel === 'app') {
        try {
          var newThreadId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
          var res = await sb.from('client_messages').insert({
            thread_id: newThreadId,
            resident_name: name,
            resident_unit: unit,
            resident_email: email,
            resident_phone: phone,
            subject: subject,
            body: body,
            sender_type: 'management',
            read: false,
            property: property
          }).select();

          if (res.error) {
            console.error('Compose send error:', res.error);
            toast('Failed to send message', 'error');
            return;
          }
          toast('Message sent via APP!');
          await window._refreshClientMsgs();
          renderMessageCenter();
        } catch(e) {
          console.error('Compose send failed:', e);
          toast('Error sending message', 'error');
        }
      } else {
        // SMS, WhatsApp, Email -- placeholder for future integration
        toast('Message queued via ' + selectedChannel.toUpperCase() + ' (integration pending)');
        // Still save to client_messages for record keeping
        try {
          var newThreadId2 = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
          await sb.from('client_messages').insert({
            thread_id: newThreadId2,
            resident_name: name,
            resident_unit: unit,
            resident_email: email,
            resident_phone: phone,
            subject: '[' + selectedChannel.toUpperCase() + '] ' + (subject || 'Message'),
            body: body,
            sender_type: 'management',
            read: false,
            property: property
          }).select();
          await window._refreshClientMsgs();
          renderMessageCenter();
        } catch(e) {
          console.error('Compose record failed:', e);
        }
      }
    });
  };

  // -- Inject "New Message" button into Message Center header --
  var _origRender = window.renderMessageCenter;
  window.renderMessageCenter = function() {
    _origRender();
    // Add compose button after render
    setTimeout(function() {
      var header = document.querySelector('#page-msg-center h2, #page-msg-center [style*="font-size:22px"]');
      if (header && !document.getElementById('compose-msg-btn')) {
        var btn = document.createElement('button');
        btn.id = 'compose-msg-btn';
        btn.innerHTML = '+ New Message';
        btn.style.cssText = 'margin-left:16px;padding:8px 18px;background:var(--accent,#7d5228);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;vertical-align:middle;';
        btn.addEventListener('click', function() { openComposeMessage(); });
        header.parentElement.insertBefore(btn, header.nextSibling);
      }
    }, 20);
  };

  // -- Override openMsgModal: redirect Message buttons to Message Center --
  // When user clicks "Message" from any booking detail, navigate to Message Center
  // and open a compose form pre-filled with the resident's info
  var _origMsgModal = window.openMsgModal;
  window.openMsgModal = function(name, email, phone, bookingId, type) {
    // Navigate to Message Center
    if (typeof showPage === 'function') showPage('msg-center');
    // Pre-fill compose with resident info
    setTimeout(function() {
      window.openComposeMessage();
      setTimeout(function() {
        var nameInput = document.getElementById('compose-name');
        var emailInput = document.getElementById('compose-email');
        var phoneInput = document.getElementById('compose-phone');
        if (nameInput) nameInput.value = name || '';
        if (emailInput) emailInput.value = email || '';
        if (phoneInput) phoneInput.value = phone || '';
      }, 50);
    }, 100);
  };

  // -- Patch openMsgModal channel list: add APP as first option --
  // Also patch sendMsgFromModal to handle APP channel via client_messages
  var _origSendMsg = window.sendMsgFromModal;
  window.sendMsgFromModal = function() {
    var channelEl = document.querySelector('.msg-ch-btn.active');
    var ch = channelEl ? channelEl.dataset.channel : 'sms';
    if (ch === 'app') {
      // Handle APP channel -- insert into client_messages
      var body = document.getElementById('msgBody').value.trim();
      if (!body) { alert('Please type a message.'); return; }
      var name = document.getElementById('msgRecipientName').textContent;
      var contact = document.getElementById('msgRecipientContact').textContent;
      var parts = contact.split(' . ');
      var email = '', phone = '';
      parts.forEach(function(p) {
        p = p.trim();
        if (p.indexOf('@') > -1) email = p;
        else if (p.match(/\d/)) phone = p;
      });
      var newThreadId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
      sb.from('client_messages').insert({
        thread_id: newThreadId,
        resident_name: name,
        resident_unit: '',
        resident_email: email,
        resident_phone: phone,
        subject: 'Message',
        body: body,
        sender_type: 'management',
        read: false,
        property: 'Chelbourne'
      }).select().then(function(res) {
        if (res.error) {
          console.error('APP msg error:', res.error);
          toast('Failed to send via APP', 'error');
        } else {
          toast('Message sent via APP!');
          window._refreshClientMsgs().then(function() {
            if (typeof renderMessageCenter === 'function') renderMessageCenter();
          });
        }
      });
      if (typeof closeMsgModal === 'function') closeMsgModal();
    } else {
      // Fall through to original handler for SMS/Email/WhatsApp
      if (_origSendMsg) _origSendMsg();
    }
  };

  // -- Initial load --
  window._refreshClientMsgs().then(function() {
    if (typeof renderMessageCenter === 'function') {
      // Only re-render if Message Center is currently visible
      var el = document.getElementById('page-msg-center');
      if (el && getComputedStyle(el).display !== 'none') {
        renderMessageCenter();
      }
    }
    console.log('[OK] Client App Messages v2 loaded (' + window._liveClientMsgs.length + ' residents)');
  });
})();
