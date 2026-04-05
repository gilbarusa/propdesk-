// ══════════════════════════════════════════════════════
//  AIRBNB SYNC BRIDGE
//  Run this on any airbnb.com page (as bookmarklet or Tampermonkey script)
//  It fetches inbox + messages from Airbnb's internal API
//  and pushes everything to Supabase for PropDesk to read.
//
//  BOOKMARKLET (paste into bookmark URL):
//  javascript:void(fetch('http://localhost:8080/airbnb-bridge.js').then(r=>r.text()).then(eval))
//
//  Or use Tampermonkey with @match https://www.airbnb.com/*
// ══════════════════════════════════════════════════════

(async function AirbnbSyncBridge() {
  'use strict';

  const SUPABASE_URL = 'https://iwohrvkcodqvyoooxzmt.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2hydmtjb2Rxdnlvb294em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTM3OTksImV4cCI6MjA4OTg2OTc5OX0.PhKo6XiXf-VTBWcYkhT_vfHi0ibftNmYaqm4RApxO6Y';
  const API_KEY = 'd306zoyjsyarp7ifhu67rjxn52tv0t20';
  const USER_ID = 'Vmlld2VyOjIyMDUxMzU0';
  const HOST_ACCOUNT = '22051354';
  const HASHES = {
    inbox: 'a1f810915d3eedd16bdd993fba56c12afcbed17aea6930f446260ce409af0524',
    thread: '3c4670eae924e2892d7c71e60c2def5e35b72f5b21b7ee0faafe6a81a247671d',
    reservation: '8697e73596888f082a32846bcd83c5ebcc95d6cb1e98b13feb3f93bcfaa6ffa0'
  };

  // ── Status toast ──
  function showStatus(msg, color = '#333') {
    let el = document.getElementById('_wb_status');
    if (!el) {
      el = document.createElement('div');
      el.id = '_wb_status';
      Object.assign(el.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '999999',
        padding: '12px 20px', borderRadius: '8px', fontSize: '13px',
        fontFamily: 'system-ui', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'opacity 0.3s', maxWidth: '400px'
      });
      document.body.appendChild(el);
    }
    el.style.background = color;
    el.textContent = msg;
    el.style.opacity = '1';
  }

  // ── Load Supabase ──
  showStatus('Loading Supabase client...', '#7d5228');
  if (!window._supabaseLib) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = () => { window._supabaseLib = true; resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // ── API helpers ──
  async function apiFetch(op, hash, vars) {
    const url = `https://www.airbnb.com/api/v3/${op}/${hash}?` + new URLSearchParams({
      operationName: op, locale: 'en', currency: 'USD',
      variables: JSON.stringify(vars),
      extensions: JSON.stringify({ persistedQuery: { version: 1, sha256Hash: hash } })
    });
    const r = await fetch(url, { credentials: 'include', headers: { 'x-airbnb-api-key': API_KEY } });
    if (!r.ok) throw new Error(`${op}: ${r.status}`);
    return r.json();
  }

  function stageToStatus(s) {
    return { CURRENTLY_HOSTING: 'currently_hosting', PRE_TRIP: 'confirmed', UPCOMING: 'confirmed',
      POST_TRIP: 'completed', PAST_RESERVATIONS: 'completed', CANCELED: 'canceled_by_guest', INQUIRY: 'inquiry', PENDING: 'pending' }[s] || 'confirmed';
  }

  function parseInfo(info) {
    const parts = (info || '').split('·').map(s => s.trim());
    let unit = '';
    if (parts.length >= 3) unit = parts.slice(2).join(' · ');
    else if (parts.length === 2) unit = parts[1];
    return { unit };
  }

  // Airbnb inbox titles use "Last, First" format → convert to "First Last"
  function fixGuestName(name) {
    if (!name) return '';
    if (name.includes(',')) {
      const parts = name.split(',').map(s => s.trim());
      if (parts.length === 2 && parts[0] && parts[1]) return parts[1] + ' ' + parts[0];
    }
    return name;
  }

  // Parse reservation details from HostReservationDetailsQuery response
  function parseReservation(json) {
    try {
      const sections = json?.data?.presentation?.hostReservationDetailsV2?.sectionConfiguration?.rootPlacement || [];
      const header = sections.find(s => s.sectionId === 'HEADER_SECTION')?.sectionData?.reservationDetails;
      if (!header) return null;

      // Parse "Mar 27 – Apr 6 (10 nights)" or "Mar 20 – 22 (2 nights)" → check_in, check_out
      const datesText = header.tripDatesAndNightsCountText || '';
      let check_in = null, check_out = null;
      const dateMatch = datesText.match(/^(.+?)\s*[–—-]\s*(.+?)\s*\(/);
      if (dateMatch) {
        const year = new Date().getFullYear();
        const tryDate = (s) => {
          const d = new Date(s + ' ' + year);
          return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
        };
        check_in = tryDate(dateMatch[1].trim());
        check_out = tryDate(dateMatch[2].trim());
        // If check_out failed (e.g. "22" without month), prepend month from check_in
        if (!check_out && check_in) {
          const monthMatch = dateMatch[1].trim().match(/^([A-Za-z]+)/);
          if (monthMatch) check_out = tryDate(monthMatch[1] + ' ' + dateMatch[2].trim());
        }
        // Handle year rollover (check_out before check_in means next year)
        if (check_in && check_out && check_out < check_in) {
          check_out = tryDate(dateMatch[2].trim() + ' ' + (year + 1));
        }
      }

      // Parse "2 guests · $883.02"
      const gpText = header.guestCountAndPriceText || '';
      const guestMatch = gpText.match(/(\d+)\s*guest/);
      const priceMatch = gpText.match(/\$[\d,.]+/);

      return {
        guest_name: header.reservationTitle || null,
        listing_name: header.listingDescription || null,
        check_in,
        check_out,
        guest_count: guestMatch ? parseInt(guestMatch[1]) : null,
        total_price: priceMatch ? priceMatch[0] : null,
        confirmation_code: null // Will be set from sidebarParams
      };
    } catch (e) { return null; }
  }

  const T0 = Date.now();

  // ── Step 1: Fetch inbox ──
  showStatus('Fetching Airbnb inbox...', '#7d5228');
  const inboxData = await apiFetch('ViaductInboxData', HASHES.inbox, {
    getParticipants: true, numRequestedThreads: 50, numPriorityThreads: 2,
    getPriorityInbox: false, useUserThreadTag: true, userId: USER_ID,
    originType: "USER_INBOX", threadVisibility: "UNARCHIVED",
    threadTagFilters: [], query: null, getLastReads: false,
    getThreadState: false, getInboxFields: true, getInboxOnlyFields: true,
    getMessageFields: false, getThreadOnlyFields: false, skipOldMessagePreviewFields: false
  });

  const edges = inboxData?.data?.node?.messagingInbox?.inboxItems?.edges || [];
  const threads = edges.map(e => {
    const n = e.node;
    const tid = atob(n.id).replace('MessageThread:', '');
    const tags = {};
    (n.userThreadTags || []).forEach(t => { tags[t.userThreadTagName] = t.additionalValues; });
    return {
      threadId: tid, globalId: n.id,
      guestName: n.inboxTitle?.accessibilityText || '',
      info: n.inboxDescription?.accessibilityText || '',
      tripStage: tags.trip_stages?.[0] || '',
      confirmCode: tags.confirmation_codes?.[0] || '',
      activityAt: n.mostRecentInboxActivityAtMsFromROS || ''
    };
  });

  // ── Step 1b: Incremental sync — check what we already have ──
  showStatus(`Got ${threads.length} threads. Checking for new activity...`, '#7d5228');

  // Fetch all existing Airbnb channels from Supabase in one query
  const { data: existingChannels } = await sb
    .from('channels')
    .select('id, external_id, last_message_at')
    .eq('platform', 'airbnb');

  const channelLookup = {};
  (existingChannels || []).forEach(ch => {
    channelLookup[ch.external_id] = ch;
  });

  // Check which channels have zero messages (need initial fetch even if timestamps match)
  const channelIds = (existingChannels || []).map(c => c.id);
  const channelsWithMsgs = new Set();
  if (channelIds.length > 0) {
    const { data: hasMsgs } = await sb
      .from('messages')
      .select('channel_id')
      .in('channel_id', channelIds)
      .limit(500);
    (hasMsgs || []).forEach(m => channelsWithMsgs.add(m.channel_id));
  }

  // ── Step 2: Fetch messages for threads with conversations ──
  // Include POST_TRIP and PAST_RESERVATIONS so completed stays also get their messages
  const active = threads.filter(t =>
    ['CURRENTLY_HOSTING', 'PRE_TRIP', 'UPCOMING', 'POST_TRIP', 'PAST_RESERVATIONS'].includes(t.tripStage)
  ).slice(0, 30);

  // Determine which active threads actually need message fetching
  const needsFetch = active.filter(thread => {
    const existing = channelLookup[thread.threadId];
    if (!existing || !existing.last_message_at) return true; // New channel → fetch
    // Channel exists but has zero messages → fetch (was metadata-only before)
    if (!channelsWithMsgs.has(existing.id)) return true;
    if (!thread.activityAt) return false; // No activity timestamp → skip
    const airbnbActivity = new Date(parseInt(thread.activityAt)).getTime();
    const storedActivity = new Date(existing.last_message_at).getTime();
    return airbnbActivity - storedActivity > 2000; // Only fetch if Airbnb is >2s newer
  });

  const skipped = active.length - needsFetch.length;
  showStatus(`${needsFetch.length} threads have new messages (${skipped} unchanged). Fetching...`, '#7d5228');

  const threadMsgs = await Promise.all(needsFetch.map(async thread => {
    try {
      const data = await apiFetch('ViaductGetThreadAndDataQuery', HASHES.thread, {
        numRequestedMessages: 20, getThreadState: true, getParticipants: true,
        mockThreadIdentifier: null, mockMessageTestIdentifier: null,
        getLastReads: true, forceUgcTranslation: false, isNovaLite: false,
        globalThreadId: thread.globalId, mockListFooterSlot: null,
        forceReturnAllReadReceipts: false, originType: "USER_INBOX",
        getInboxFields: true, getInboxOnlyFields: false,
        getMessageFields: true, getThreadOnlyFields: true, skipOldMessagePreviewFields: false
      });
      const td = data?.data?.threadData;
      const rawMsgs = td?.messageData?.messages || [];
      const participants = (td?.orderedParticipants || []).map(p => ({
        id: p.accountId, name: p.displayName, role: p.participantRole
      }));
      const messages = rawMsgs.map(m => ({
        sender: m.account?.accountId === HOST_ACCOUNT ? 'host' : 'guest',
        body: m.hydratedContent?.content?.subMessages?.map(s => s.body).filter(Boolean).join('\n')
              || m.hydratedContent?.content?.body || m.contentPreview?.content || '',
        createdAt: m.createdAtMs ? new Date(parseInt(m.createdAtMs)).toISOString() : null,
        messageId: m.id ? atob(m.id).replace('Message:', '') : m.uuid
      }));
      // Extract confirmation code from sidebar params
      const confCode = td?.threadContent?.detailPanel?.sidebarParams?.confirmationCode || null;
      return { threadId: thread.threadId, participants, messages, confirmationCode: confCode };
    } catch (e) {
      return { threadId: thread.threadId, participants: [], messages: [], confirmationCode: null };
    }
  }));

  const totalMsgs = threadMsgs.reduce((s, t) => s + t.messages.length, 0);

  // ── Step 2b: Fetch reservation details ──
  // Confirmation codes come from thread detail API (sidebarParams), NOT inbox tags.
  // For threads we already fetched, use those codes. For skipped threads missing
  // reservation data in Supabase, do a lightweight thread fetch to get the code.
  const confCodeMap = {}; // threadId → confirmationCode
  for (const t of threadMsgs) {
    if (t.confirmationCode) confCodeMap[t.threadId] = t.confirmationCode;
  }

  // Find active threads that were skipped (no messages fetched) AND have no reservation data yet
  const skippedThreadIds = new Set(active.map(t => t.threadId));
  needsFetch.forEach(t => skippedThreadIds.delete(t.threadId));
  // Already have conf codes for fetched threads; remove those
  Object.keys(confCodeMap).forEach(id => skippedThreadIds.delete(id));

  // Check which of these skipped threads already have reservation data in Supabase
  const skippedArr = [...skippedThreadIds];
  const needConfCodeFetch = [];
  if (skippedArr.length > 0) {
    const { data: existingRes } = await sb
      .from('channels')
      .select('external_id, confirmation_code')
      .eq('platform', 'airbnb')
      .in('external_id', skippedArr);
    const hasRes = new Set();
    (existingRes || []).forEach(ch => {
      if (ch.confirmation_code) hasRes.add(ch.external_id);
    });
    for (const tid of skippedArr) {
      if (!hasRes.has(tid)) needConfCodeFetch.push(tid);
    }
  }

  // Lightweight thread fetch just for confirmation codes
  if (needConfCodeFetch.length > 0) {
    showStatus(`Fetching ${needConfCodeFetch.length} confirmation codes...`, '#7d5228');
    const threadMap = {};
    active.forEach(t => { threadMap[t.threadId] = t; });
    await Promise.all(needConfCodeFetch.map(async tid => {
      try {
        const thread = threadMap[tid];
        if (!thread) return;
        const data = await apiFetch('ViaductGetThreadAndDataQuery', HASHES.thread, {
          numRequestedMessages: 1, getThreadState: true, getParticipants: false,
          mockThreadIdentifier: null, mockMessageTestIdentifier: null,
          getLastReads: false, forceUgcTranslation: false, isNovaLite: false,
          globalThreadId: thread.globalId, mockListFooterSlot: null,
          forceReturnAllReadReceipts: false, originType: "USER_INBOX",
          getInboxFields: true, getInboxOnlyFields: false,
          getMessageFields: false, getThreadOnlyFields: true, skipOldMessagePreviewFields: true
        });
        const code = data?.data?.threadData?.threadContent?.detailPanel?.sidebarParams?.confirmationCode;
        if (code) confCodeMap[tid] = code;
      } catch (e) { /* skip */ }
    }));
  }

  // Now fetch reservation details for all threads with confirmation codes
  const resLookup = {};
  const threadsToFetchRes = Object.keys(confCodeMap);
  if (threadsToFetchRes.length > 0) {
    showStatus(`Fetching ${threadsToFetchRes.length} reservation details...`, '#7d5228');
    await Promise.all(threadsToFetchRes.map(async tid => {
      try {
        const code = confCodeMap[tid];
        const data = await apiFetch('HostReservationDetailsQuery', HASHES.reservation, {
          requestSource: 'MESSAGING',
          confirmationCode: code,
          stayReservationConfirmationCode: code,
          hasStayReservationConfirmationCode: true,
          threadId: tid
        });
        const parsed = parseReservation(data);
        if (parsed) {
          parsed.confirmation_code = code;
          resLookup[tid] = parsed;
        }
      } catch (e) { /* skip */ }
    }));
  }

  console.log(`[Bridge] confCodes: ${Object.keys(confCodeMap).length}, needing res fetch: ${threadsToFetchRes.length}, fetched: ${Object.keys(resLookup).length}`);
  if (Object.keys(resLookup).length > 0) {
    const sampleKey = Object.keys(resLookup)[0];
    console.log('[Bridge] Sample reservation:', JSON.stringify(resLookup[sampleKey]));
  }
  showStatus(`Fetched ${totalMsgs} msgs, ${Object.keys(resLookup).length} reservations. Syncing...`, '#1565c0');

  // ── Step 3: Batch upsert to Supabase ──
  const msgLookup = {};
  threadMsgs.forEach(t => { msgLookup[t.threadId] = t; });

  let channelCount = 0, msgCount = 0, errors = 0;
  const T_upsert = Date.now();

  // 3a: Batch upsert all channels at once
  showStatus(`Batch upserting ${threads.length} channels...`, '#1565c0');
  // Build lookup of channels that already have reservation data (to preserve good names)
  const hasResInDb = new Set();
  if (existingChannels) {
    const { data: withConf } = await sb.from('channels')
      .select('external_id').eq('platform', 'airbnb').not('confirmation_code', 'is', null);
    (withConf || []).forEach(ch => hasResInDb.add(ch.external_id));
  }

  const channelRecords = threads.map(thread => {
    const parsed = parseInfo(thread.info);
    const res = resLookup[thread.threadId];
    const record = {
      platform: 'airbnb', external_id: thread.threadId,
      unit_apt: parsed.unit,
      status: stageToStatus(thread.tripStage),
      last_message_at: thread.activityAt ? new Date(parseInt(thread.activityAt)).toISOString() : null,
      unread_count: 0
    };
    // Set guest_name: prefer reservation data, skip overwrite if DB already has res data
    if (res) {
      record.guest_name = res.guest_name;
    } else if (!hasResInDb.has(thread.threadId)) {
      record.guest_name = fixGuestName(thread.guestName);
    }
    // Add reservation fields if available
    if (res) {
      record.check_in = res.check_in;
      record.check_out = res.check_out;
      record.guest_count = res.guest_count;
      record.total_price = res.total_price;
      record.confirmation_code = res.confirmation_code;
      record.listing_name = res.listing_name;
    }
    return record;
  });

  const { data: upsertedChannels, error: chErr } = await sb
    .from('channels')
    .upsert(channelRecords, { onConflict: 'platform,external_id' })
    .select('id, external_id');

  if (chErr) {
    console.error('[Willow Bridge] Channel upsert error:', chErr);
    errors++;
  }
  channelCount = upsertedChannels?.length || 0;

  // Build external_id → channel id map
  const idMap = {};
  (upsertedChannels || []).forEach(ch => { idMap[ch.external_id] = ch.id; });

  // 3b: Batch upsert all messages at once
  const allMsgRecords = [];
  const guestNameUpdates = [];

  for (const thread of threads) {
    const channelId = idMap[thread.threadId];
    if (!channelId || !msgLookup[thread.threadId]) continue;

    const msgs = msgLookup[thread.threadId];
    for (const msg of msgs.messages) {
      if (!msg.body || !msg.messageId) continue;
      allMsgRecords.push({
        channel_id: channelId, external_id: String(msg.messageId),
        sender: msg.sender, body: msg.body, sent_at: msg.createdAt,
        platform: 'airbnb', message_type: 'text'
      });
    }

    // Only update guest name from participants if no reservation data (fallback to first name)
    if (!resLookup[thread.threadId]) {
      const guestP = msgs.participants.find(p => p.role === 'GUEST');
      if (guestP?.name) {
        guestNameUpdates.push({ id: channelId, guest_name: guestP.name });
      }
    }
  }

  if (allMsgRecords.length > 0) {
    showStatus(`Batch upserting ${allMsgRecords.length} messages...`, '#1565c0');
    // Upsert in chunks of 200 to stay within Supabase limits
    const CHUNK = 200;
    for (let i = 0; i < allMsgRecords.length; i += CHUNK) {
      const chunk = allMsgRecords.slice(i, i + CHUNK);
      const { data: inserted, error: msgErr } = await sb
        .from('messages')
        .upsert(chunk, { onConflict: 'channel_id,external_id', ignoreDuplicates: true })
        .select('id');
      if (msgErr) {
        console.error('[Willow Bridge] Message upsert error:', msgErr);
        errors++;
      } else {
        msgCount += inserted?.length || 0;
      }
    }
  }

  // 3c: Batch update guest names from participants
  for (const upd of guestNameUpdates) {
    await sb.from('channels').update({ guest_name: upd.guest_name }).eq('id', upd.id);
  }

  console.log(`[Willow Bridge] Upsert phase: ${((Date.now() - T_upsert) / 1000).toFixed(1)}s`);

  const elapsed = ((Date.now() - T0) / 1000).toFixed(1);
  const resCount = Object.keys(resLookup).length;
  showStatus(`Sync done ${elapsed}s: ${channelCount} ch, ${msgCount} new msgs, ${resCount} res, ${skipped} skipped${errors ? `, ${errors} err` : ''}`, '#2e7d32');

  // Auto-hide after 15 seconds
  setTimeout(() => {
    const el = document.getElementById('_wb_status');
    if (el) el.style.opacity = '0';
  }, 15000);

  console.log(`[Bridge] TOTAL:${elapsed}s | ${channelCount}ch ${msgCount}msgs ${resCount}res ${skipped}skip ${errors}err`);
})();
