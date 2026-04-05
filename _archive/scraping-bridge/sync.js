// ══════════════════════════════════════════════════════
//  PLATFORM SYNC ENGINE
//  Two modes:
//    1. Bridge mode (on airbnb.com): Fetches API → pushes to Supabase
//    2. App mode (on localhost): Refreshes data from Supabase
// ══════════════════════════════════════════════════════

const PlatformSync = (() => {
  // ── Config ──
  const AIRBNB_API_KEY = 'd306zoyjsyarp7ifhu67rjxn52tv0t20';
  const AIRBNB_USER_ID = 'Vmlld2VyOjIyMDUxMzU0';
  const AIRBNB_HOST_ACCOUNT = '22051354';

  const AIRBNB_HASHES = {
    inbox: 'a1f810915d3eedd16bdd993fba56c12afcbed17aea6930f446260ce409af0524',
    thread: '3c4670eae924e2892d7c71e60c2def5e35b72f5b21b7ee0faafe6a81a247671d',
    reservation: '8697e73596888f082a32846bcd83c5ebcc95d6cb1e98b13feb3f93bcfaa6ffa0'
  };

  let syncLog = [];
  let lastSyncAt = null;
  let isSyncing = false;

  function log(msg) {
    const ts = new Date().toLocaleTimeString();
    syncLog.push(`[${ts}] ${msg}`);
    console.log(`[Sync] ${msg}`);
  }

  const isOnAirbnb = () => location.hostname.includes('airbnb.com');

  // ═══════════════════════════════════════════════════════
  // AIRBNB API FETCH (only works on airbnb.com domain)
  // ═══════════════════════════════════════════════════════

  async function airbnbApiFetch(operationName, hash, variables) {
    const url = `https://www.airbnb.com/api/v3/${operationName}/${hash}?` + new URLSearchParams({
      operationName, locale: 'en', currency: 'USD',
      variables: JSON.stringify(variables),
      extensions: JSON.stringify({ persistedQuery: { version: 1, sha256Hash: hash } })
    });
    const resp = await fetch(url, {
      credentials: 'include',
      headers: { 'x-airbnb-api-key': AIRBNB_API_KEY }
    });
    if (!resp.ok) throw new Error(`Airbnb API ${operationName}: ${resp.status}`);
    return resp.json();
  }

  async function airbnbFetchInbox(count = 50) {
    const data = await airbnbApiFetch('ViaductInboxData', AIRBNB_HASHES.inbox, {
      getParticipants: true, numRequestedThreads: count, numPriorityThreads: 2,
      getPriorityInbox: false, useUserThreadTag: true, userId: AIRBNB_USER_ID,
      originType: "USER_INBOX", threadVisibility: "UNARCHIVED",
      threadTagFilters: [], query: null, getLastReads: false,
      getThreadState: false, getInboxFields: true, getInboxOnlyFields: true,
      getMessageFields: false, getThreadOnlyFields: false,
      skipOldMessagePreviewFields: false
    });

    const edges = data?.data?.node?.messagingInbox?.inboxItems?.edges || [];
    return edges.map(e => {
      const n = e.node;
      const threadId = atob(n.id).replace('MessageThread:', '');
      const tags = {};
      (n.userThreadTags || []).forEach(t => { tags[t.userThreadTagName] = t.additionalValues; });
      const guest = (n.participants?.edges || []).find(p => p.node?.participantRole === 'GUEST');

      return {
        threadId,
        globalId: n.id,
        guestName: n.inboxTitle?.accessibilityText || '',
        info: n.inboxDescription?.accessibilityText || '',
        tripStage: tags.trip_stages?.[0] || '',
        confirmCode: tags.confirmation_codes?.[0] || '',
        listingId: tags.stay_listing_ids?.[0] || '',
        guestAccountId: guest?.node?.accountId || '',
        activityAt: n.mostRecentInboxActivityAtMsFromROS || ''
      };
    });
  }

  async function airbnbFetchThread(thread) {
    const data = await airbnbApiFetch('ViaductGetThreadAndDataQuery', AIRBNB_HASHES.thread, {
      numRequestedMessages: 20, getThreadState: true, getParticipants: true,
      mockThreadIdentifier: null, mockMessageTestIdentifier: null,
      getLastReads: true, forceUgcTranslation: false, isNovaLite: false,
      globalThreadId: thread.globalId, mockListFooterSlot: null,
      forceReturnAllReadReceipts: false, originType: "USER_INBOX",
      getInboxFields: true, getInboxOnlyFields: false,
      getMessageFields: true, getThreadOnlyFields: true,
      skipOldMessagePreviewFields: false
    });

    const td = data?.data?.threadData;
    const rawMsgs = td?.messageData?.messages || [];
    const participants = (td?.orderedParticipants || []).map(p => ({
      id: p.accountId, name: p.displayName, role: p.participantRole
    }));

    const messages = rawMsgs.map(m => {
      const body = m.hydratedContent?.content?.subMessages?.map(s => s.body).filter(Boolean).join('\n')
              || m.hydratedContent?.content?.body
              || m.contentPreview?.content
              || '';
      return {
        sender: m.account?.accountId === AIRBNB_HOST_ACCOUNT ? 'host' : 'guest',
        senderAccountId: m.account?.accountId,
        body,
        createdAt: m.createdAtMs ? new Date(parseInt(m.createdAtMs)).toISOString() : null,
        messageId: m.id ? atob(m.id).replace('Message:', '') : m.uuid
      };
    });

    const confCode = td?.threadContent?.detailPanel?.sidebarParams?.confirmationCode || null;
    return { threadId: thread.threadId, participants, messages, confirmationCode: confCode };
  }

  async function airbnbFetchReservation(threadId, confirmationCode) {
    const data = await airbnbApiFetch('HostReservationDetailsQuery', AIRBNB_HASHES.reservation, {
      requestSource: 'MESSAGING',
      confirmationCode,
      stayReservationConfirmationCode: confirmationCode,
      hasStayReservationConfirmationCode: true,
      threadId
    });
    const parsed = parseReservation(data);
    if (parsed) parsed.confirmation_code = confirmationCode;
    return parsed;
  }

  // ═══════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════

  function tripStageToStatus(stage) {
    return {
      'CURRENTLY_HOSTING': 'currently_hosting',
      'PRE_TRIP': 'confirmed',
      'UPCOMING': 'confirmed',
      'POST_TRIP': 'completed',
      'PAST_RESERVATIONS': 'completed',
      'CANCELED': 'canceled_by_guest',
      'INQUIRY': 'inquiry',
      'PENDING': 'pending'
    }[stage] || 'confirmed';
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

  function parseThreadInfo(info) {
    const parts = (info || '').split('·').map(s => s.trim());
    let unit = '', checkin = '', checkout = '';
    const year = new Date().getFullYear();
    if (parts.length >= 3) unit = parts.slice(2).join(' · ');
    else if (parts.length === 2) unit = parts[1];
    const dates = parts.length >= 2 ? parts[parts.length >= 3 ? 1 : 0] : '';
    const m = dates.match(/(\w+ \d+)\s*[–-]\s*(\w+ \d+)/);
    if (m) { checkin = m[1] + ', ' + year; checkout = m[2] + ', ' + year; }
    return { unit, checkin, checkout };
  }

  // Parse reservation details from HostReservationDetailsQuery response
  function parseReservation(json) {
    try {
      const sections = json?.data?.presentation?.hostReservationDetailsV2?.sectionConfiguration?.rootPlacement || [];
      const header = sections.find(s => s.sectionId === 'HEADER_SECTION')?.sectionData?.reservationDetails;
      if (!header) return null;
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
        if (check_in && check_out && check_out < check_in) {
          check_out = tryDate(dateMatch[2].trim() + ' ' + (year + 1));
        }
      }
      const gpText = header.guestCountAndPriceText || '';
      const guestMatch = gpText.match(/(\d+)\s*guest/);
      const priceMatch = gpText.match(/\$[\d,.]+/);
      return {
        guest_name: header.reservationTitle || null,
        listing_name: header.listingDescription || null,
        check_in, check_out,
        guest_count: guestMatch ? parseInt(guestMatch[1]) : null,
        total_price: priceMatch ? priceMatch[0] : null,
        confirmation_code: null
      };
    } catch (e) { return null; }
  }

  // ═══════════════════════════════════════════════════════
  // SUPABASE UPSERT (used by bridge mode)
  // ═══════════════════════════════════════════════════════

  async function batchUpsertChannels(sbClient, threads, resLookup, hasResInDb) {
    const records = threads.map(thread => {
      const parsed = parseThreadInfo(thread.info);
      const res = resLookup?.[thread.threadId];
      const record = {
        platform: 'airbnb',
        external_id: thread.threadId,
        unit_apt: parsed.unit,
        status: tripStageToStatus(thread.tripStage),
        last_message_at: thread.activityAt ? new Date(parseInt(thread.activityAt)).toISOString() : null,
        unread_count: 0
      };
      // Set guest_name: prefer reservation data, skip overwrite if DB already has res data
      if (res) {
        record.guest_name = res.guest_name;
      } else if (!hasResInDb || !hasResInDb.has(thread.threadId)) {
        record.guest_name = fixGuestName(thread.guestName);
      }
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
    const { data, error } = await sbClient
      .from('channels')
      .upsert(records, { onConflict: 'platform,external_id' })
      .select('id, external_id');
    if (error) throw error;
    const idMap = {};
    (data || []).forEach(ch => { idMap[ch.external_id] = ch.id; });
    return idMap;
  }

  async function batchUpsertMessages(sbClient, allMsgRecords) {
    if (!allMsgRecords || allMsgRecords.length === 0) return 0;
    let count = 0;
    const CHUNK = 200;
    for (let i = 0; i < allMsgRecords.length; i += CHUNK) {
      const chunk = allMsgRecords.slice(i, i + CHUNK);
      const { data, error } = await sbClient
        .from('messages')
        .upsert(chunk, { onConflict: 'channel_id,external_id', ignoreDuplicates: true })
        .select('id');
      if (error) throw error;
      count += data?.length || 0;
    }
    return count;
  }

  // ═══════════════════════════════════════════════════════
  // BRIDGE MODE: Full Airbnb scrape → Supabase
  // (runs on airbnb.com domain with session cookies)
  // ═══════════════════════════════════════════════════════

  async function bridgeSyncAirbnb(sbClient, options = {}) {
    const { maxThreads = 50, maxActiveMessages = 15 } = options;
    const T = { start: Date.now() };
    const summary = { threads: 0, messages: 0, newMessages: 0, skipped: 0, errors: [] };

    // Step 1: Fetch inbox
    log('Bridge: Fetching Airbnb inbox...');
    const threads = await airbnbFetchInbox(maxThreads);
    T.inbox = Date.now();
    summary.threads = threads.length;
    log(`Bridge: ${threads.length} threads in ${T.inbox - T.start}ms`);

    // Step 1b: Incremental sync — check existing channels in one batch
    const { data: existingChannels } = await sbClient
      .from('channels')
      .select('id, external_id, last_message_at')
      .eq('platform', 'airbnb');

    const channelLookup = {};
    (existingChannels || []).forEach(ch => {
      channelLookup[ch.external_id] = ch;
    });

    // Check which channels already have messages stored
    const channelIds = (existingChannels || []).map(c => c.id);
    const channelsWithMsgs = new Set();
    if (channelIds.length > 0) {
      const { data: hasMsgs } = await sbClient
        .from('messages')
        .select('channel_id')
        .in('channel_id', channelIds)
        .limit(500);
      (hasMsgs || []).forEach(m => channelsWithMsgs.add(m.channel_id));
    }

    // Step 2: Only fetch messages for active threads with NEW activity
    const active = threads.filter(t =>
      ['CURRENTLY_HOSTING', 'PRE_TRIP', 'UPCOMING', 'POST_TRIP', 'PAST_RESERVATIONS'].includes(t.tripStage)
    ).slice(0, maxActiveMessages);

    const needsFetch = active.filter(thread => {
      const existing = channelLookup[thread.threadId];
      if (!existing || !existing.last_message_at) return true;
      if (!channelsWithMsgs.has(existing.id)) return true; // Has channel but no messages
      if (!thread.activityAt) return false;
      const airbnbActivity = new Date(parseInt(thread.activityAt)).getTime();
      const storedActivity = new Date(existing.last_message_at).getTime();
      return airbnbActivity - storedActivity > 2000;
    });

    summary.skipped = active.length - needsFetch.length;
    log(`Bridge: ${needsFetch.length} threads need fetch, ${summary.skipped} unchanged`);

    const threadResults = await Promise.all(needsFetch.map(t =>
      airbnbFetchThread(t).catch(err => {
        summary.errors.push(`Thread ${t.threadId}: ${err.message}`);
        return { threadId: t.threadId, participants: [], messages: [] };
      })
    ));
    T.messages = Date.now();
    summary.messages = threadResults.reduce((s, t) => s + t.messages.length, 0);
    log(`Bridge: ${summary.messages} messages in ${T.messages - T.inbox}ms`);

    // Step 2b: Fetch reservation details
    // Build confirmation code map from fetched threads
    const confCodeMap = {};
    for (const t of threadResults) {
      if (t.confirmationCode) confCodeMap[t.threadId] = t.confirmationCode;
    }

    // Lightweight thread fetch for skipped threads missing conf codes in Supabase
    const skippedThreadIds = new Set(active.map(t => t.threadId));
    needsFetch.forEach(t => skippedThreadIds.delete(t.threadId));
    Object.keys(confCodeMap).forEach(id => skippedThreadIds.delete(id));

    const skippedArr = [...skippedThreadIds];
    const needConfCodeFetch = [];
    if (skippedArr.length > 0) {
      const { data: existingRes } = await sbClient
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

    if (needConfCodeFetch.length > 0) {
      log(`Bridge: Fetching ${needConfCodeFetch.length} confirmation codes...`);
      const threadMap = {};
      active.forEach(t => { threadMap[t.threadId] = t; });
      await Promise.all(needConfCodeFetch.map(async tid => {
        try {
          const thread = threadMap[tid];
          if (!thread) return;
          const data = await airbnbApiFetch('ViaductGetThreadAndDataQuery', AIRBNB_HASHES.thread, {
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

    // Fetch reservation details for all threads with confirmation codes
    const resLookup = {};
    const threadsToFetchRes = Object.keys(confCodeMap);
    if (threadsToFetchRes.length > 0) {
      log(`Bridge: Fetching ${threadsToFetchRes.length} reservation details...`);
      await Promise.all(threadsToFetchRes.map(async tid => {
        try {
          const res = await airbnbFetchReservation(tid, confCodeMap[tid]);
          if (res) resLookup[tid] = res;
        } catch (e) { /* skip */ }
      }));
    }

    log(`Bridge: ${Object.keys(confCodeMap).length} conf codes, ${Object.keys(resLookup).length} reservations`);

    // Step 3: Batch upsert to Supabase
    log('Bridge: Batch upserting to Supabase...');
    const msgLookup = {};
    threadResults.forEach(tr => { msgLookup[tr.threadId] = tr; });

    try {
      // Build lookup of channels that already have reservation data (to preserve names)
      const hasResInDb = new Set();
      const { data: withConfInDb } = await sbClient
        .from('channels')
        .select('external_id')
        .eq('platform', 'airbnb')
        .not('confirmation_code', 'is', null);
      (withConfInDb || []).forEach(ch => hasResInDb.add(ch.external_id));

      // 3a: Batch upsert all channels (with reservation data)
      const idMap = await batchUpsertChannels(sbClient, threads, resLookup, hasResInDb);

      // 3b: Collect all messages and batch upsert
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
        // Only fallback to first-name from participants if no reservation data
        if (!resLookup[thread.threadId]) {
          const guestP = msgs.participants.find(p => p.role === 'GUEST');
          if (guestP?.name) guestNameUpdates.push({ id: channelId, guest_name: guestP.name });
        }
      }

      summary.newMessages = await batchUpsertMessages(sbClient, allMsgRecords);

      // 3c: Update guest names (fallback only)
      for (const upd of guestNameUpdates) {
        await sbClient.from('channels').update({ guest_name: upd.guest_name }).eq('id', upd.id);
      }
    } catch (err) {
      summary.errors.push(`Batch upsert: ${err.message}`);
    }

    T.end = Date.now();
    log(`Bridge: DONE ${T.end - T.start}ms — ${summary.threads} ch, ${summary.newMessages} new msgs, ${summary.skipped} skipped`);
    return { timing: { totalMs: T.end - T.start }, summary };
  }

  // ═══════════════════════════════════════════════════════
  // APP MODE: Refresh from Supabase (runs on localhost)
  // ═══════════════════════════════════════════════════════

  async function syncAll() {
    if (isSyncing) {
      log('Sync already in progress, skipping');
      return null;
    }
    isSyncing = true;
    syncLog = [];
    const T0 = Date.now();

    log('═══ Starting full platform sync ═══');

    const results = {};

    if (isOnAirbnb()) {
      // Bridge mode — shouldn't normally be called from here
      // but support it for the bookmarklet
      log('Running in bridge mode on airbnb.com');
      try {
        results.airbnb = await bridgeSyncAirbnb(sb);
      } catch (err) {
        results.airbnb = { error: err.message };
      }
    } else {
      // App mode — just confirm Supabase is reachable
      try {
        const { count, error } = await sb
          .from('channels')
          .select('id', { count: 'exact', head: true })
          .eq('platform', 'airbnb');

        if (error) throw error;
        results.airbnb = {
          timing: { totalMs: Date.now() - T0 },
          summary: { threads: count, messages: 0, newMessages: 0, errors: [],
            note: 'App mode: reading from Supabase. Use bridge bookmarklet to fetch fresh data from Airbnb.' }
        };
        log(`App mode: ${count} Airbnb channels in Supabase`);
      } catch (err) {
        results.airbnb = { error: err.message };
        log(`Airbnb: ERROR — ${err.message}`);
      }
    }

    const totalMs = Date.now() - T0;
    log(`═══ Full sync complete in ${totalMs}ms ═══`);

    lastSyncAt = new Date().toISOString();
    isSyncing = false;

    return { totalMs, lastSyncAt, results, log: syncLog };
  }

  // ═══════════════════════════════════════════════════════
  // AUTO-SYNC INTERVAL
  // ═══════════════════════════════════════════════════════

  let syncInterval = null;

  function startAutoSync(intervalMs = 5 * 60 * 1000) {
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(() => {
      syncAll().then(result => {
        if (result) {
          console.log(`[AutoSync] Completed in ${result.totalMs}ms`);
          if (typeof renderInbox === 'function') renderInbox();
        }
      });
    }, intervalMs);
    log(`Auto-sync started: every ${intervalMs / 1000}s`);
  }

  function stopAutoSync() {
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
      log('Auto-sync stopped');
    }
  }

  // ── Public API ──
  return {
    syncAll,
    bridgeSyncAirbnb,
    startAutoSync,
    stopAutoSync,
    getLog: () => syncLog,
    getLastSync: () => lastSyncAt,
    isSyncing: () => isSyncing,

    // Expose for bridge bookmarklet
    _airbnbFetchInbox: airbnbFetchInbox,
    _airbnbFetchThread: airbnbFetchThread,
    _batchUpsertChannels: batchUpsertChannels,
    _batchUpsertMessages: batchUpsertMessages
  };
})();
