// ══════════════════════════════════════════════════════
//  UNIFIED BOOKING + MESSAGING SYSTEM
//  Every message thread tied to a booking with full financial & calendar data
// ══════════════════════════════════════════════════════

const PLATFORM_COLORS = {
  airbnb: { bg: '#FF5A5F', text: '#fff', label: 'Airbnb' },
  vrbo: { bg: '#3B5998', text: '#fff', label: 'VRBO' },
  booking: { bg: '#003580', text: '#fff', label: 'Booking.com' },
  direct: { bg: '#4CAF50', text: '#fff', label: 'Direct' },
  willowpa: { bg: '#7d5228', text: '#fff', label: 'WillowPA' }
};

const STATUS_COLORS = {
  confirmed: { bg: '#e3f2fd', text: '#1565c0', label: 'Confirmed' },
  currently_hosting: { bg: '#e8f5e9', text: '#2e7d32', label: 'Currently Hosting' },
  completed: { bg: '#f3e5f5', text: '#7b1fa2', label: 'Completed' },
  canceled_by_guest: { bg: '#ffebee', text: '#c62828', label: 'Canceled' },
  canceled_by_host: { bg: '#ffebee', text: '#c62828', label: 'Canceled' },
  pending: { bg: '#fff3e0', text: '#e65100', label: 'Pending' },
  inquiry: { bg: '#fff8e1', text: '#f57f17', label: 'Inquiry' },
  pre_approved: { bg: '#e0f7fa', text: '#00838f', label: 'Pre-approved' },
  declined: { bg: '#efebe9', text: '#4e342e', label: 'Declined' },
  withdrawn: { bg: '#efebe9', text: '#4e342e', label: 'Withdrawn' },
  change_requested: { bg: '#fff3e0', text: '#e65100', label: 'Change Requested' }
};

const AIRBNB_BOOKINGS_SEED = [
  { guest: 'Richard ODonnell', phone: '+1 404-626-0337', listing: 'Inviting 1BR Apartment — Rockledge', unit: '926-1', checkin: '2026-01-13', checkout: '2026-04-30', nights: 107, payout: 8296.24, guests: 1, adults: 1, children: 0, infants: 0, pets: 0, status: 'change_requested', confirmCode: 'HMCPSJ2BQA', bookedAt: '2026-01-10', lastMsg: 'Change requested: New dates', lastMsgAt: '2026-04-02T09:50:00', unread: 1, threadId: '2406009482' },
  { guest: 'Maureen Kacillas', phone: '+1 570-592-4712', listing: '1BR w/ Balcony & Parking – Monthly Discount', unit: '1BR 46-206', checkin: '2026-02-24', checkout: '2026-06-30', nights: 126, payout: 7600.95, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HMENFDSTS4', bookedAt: '2026-02-23', lastMsg: '', lastMsgAt: '2026-02-23T12:58:00', unread: 0, threadId: '2452427591' },
  { guest: 'Joe Masalta', phone: '+1 267-644-7092', listing: 'Modern 2BR/2BA | Extended Stay Discounts', unit: '2BR 46-210', checkin: '2026-03-01', checkout: '2026-06-01', nights: 92, payout: 7191.96, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HMWPDP3J9S', bookedAt: '2026-03-01', lastMsg: '', lastMsgAt: '2026-03-01T12:01:00', unread: 0, threadId: '2458185435' },
  { guest: 'Hider Shaaban', phone: '+1 215-789-5616', listing: 'Cozy Studio on Montgomery Ave', unit: 'Montgomery 5B', checkin: '2026-03-08', checkout: '2026-04-06', nights: 29, payout: 1694.26, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HM98JDXKBF', bookedAt: '2026-02-22', lastMsg: '', lastMsgAt: '2026-02-22T07:23:00', unread: 0, threadId: '2451130169' },
  { guest: 'Gabrielle Pereira', phone: '+1 203-919-6929', listing: '1-bedroom apartment in Rockledge Monthly', unit: '926-2', checkin: '2026-03-13', checkout: '2026-04-13', nights: 31, payout: 1846.32, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HM3MS92HHF', bookedAt: '2026-02-22', lastMsg: '', lastMsgAt: '2026-02-22T06:44:00', unread: 0, threadId: '2450975714' },
  { guest: 'Tetiana Holoborodko', phone: '+380 67 492 3971', listing: 'Updated 1BR Apartment | Moss Rehab | Save Monthly', unit: '1BR 46-330', checkin: '2026-03-14', checkout: '2026-04-30', nights: 47, payout: 2986.91, guests: 1, adults: 1, children: 0, infants: 1, pets: 0, status: 'currently_hosting', confirmCode: 'HM4KJYDXEN', bookedAt: '2026-03-11', lastMsg: '', lastMsgAt: '2026-03-11T08:00:00', unread: 0, threadId: '2467263465' },
  { guest: 'Damaris Suyapa Bejarano Reyes', phone: '+1 713-253-3856', listing: 'First-Floor Comfort: 2BR/2BA Monthly Discount', unit: '2BR 46-112', checkin: '2026-03-17', checkout: '2026-04-17', nights: 31, payout: 2535.84, guests: 2, adults: 2, children: 0, infants: 0, pets: 1, status: 'currently_hosting', confirmCode: 'HMAS3TFNCM', bookedAt: '2026-03-15', lastMsg: 'We may have a person live in the building and s...', lastMsgAt: '2026-03-31T12:00:00', unread: 0, threadId: '2472144458' },
  { guest: 'Avi Freedman', phone: '+1 267-994-5061', listing: 'Comfortable 2BR + Office Setup', unit: '2BR 46-318', checkin: '2026-03-27', checkout: '2026-04-03', nights: 7, payout: 839.08, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HMXTMJQRRF', bookedAt: '2026-03-25', lastMsg: 'Dear Avi, We are delighted...', lastMsgAt: '2026-04-01T12:00:00', unread: 1, threadId: '2482316193' },
  { guest: 'Anaya Cheeseboro', phone: '+1 267-438-2598', listing: 'Modern 1BR Near Moss Rehab Center Monthly Discount', unit: '1BR 46-331', checkin: '2026-03-27', checkout: '2026-04-06', nights: 10, payout: 883.02, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HM3XPR5XNW', bookedAt: '2026-03-27', lastMsg: '', lastMsgAt: '2026-03-27T15:20:00', unread: 0, threadId: '2484005158' },
  { guest: 'Mosheh Ellison', phone: '+1 267-269-6246', listing: 'Short & Long-Term Rentals — Monthly Discount', unit: '426-3', checkin: '2026-03-28', checkout: '2026-04-04', nights: 7, payout: 682.76, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HMEKRWJ3ZS', bookedAt: '2026-03-28', lastMsg: '', lastMsgAt: '2026-03-28T16:59:00', unread: 0, threadId: '2485032961' },
  { guest: 'Sofokli Telo', phone: '+30 693 420 2534', listing: 'A place you call home in Elkins Park -30 days min', unit: '1br 46-305', checkin: '2026-03-29', checkout: '2026-04-07', nights: 9, payout: 903.30, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HMFRDFEK92', bookedAt: '2026-03-29', lastMsg: '', lastMsgAt: '2026-03-29T10:01:00', unread: 0, threadId: '2485600408' },
  { guest: 'Nicholas Willoughby', phone: '+1 904-329-5655', listing: 'Stylish & Charming 2BR | Monthly Discount', unit: 'A1 Valley Rd', checkin: '2026-03-29', checkout: '2026-04-12', nights: 14, payout: 1344.06, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'currently_hosting', confirmCode: 'HMC5XBBDZZ', bookedAt: '2026-03-28', lastMsg: 'Sounds great! Thank you!!', lastMsgAt: '2026-03-29T12:00:00', unread: 0, threadId: '2484888109' },
  { guest: 'Beth, Katarina', phone: '', listing: 'Walk to Lift, 3br/2b Gym, Sauna, Hot tub', unit: 'Mt Green KT', checkin: '2026-03-20', checkout: '2026-03-22', nights: 2, payout: 860.00, guests: 5, adults: 5, children: 0, infants: 0, pets: 0, status: 'completed', confirmCode: 'HMBT2KLN20', bookedAt: '2026-03-05', lastMsg: 'RFID should be there! I got a delivery message this morning.', lastMsgAt: '2026-04-02T10:15:00', unread: 1, threadId: '2462231995' },
  { guest: 'Olena Petriieva', phone: '+1 773-754-9745', listing: 'Stylish 1BR | Moss Rehab | Monthly Discount', unit: '1BR 46-128', checkin: '2026-04-08', checkout: '2026-04-15', nights: 7, payout: 662.48, guests: 1, adults: 1, children: 0, infants: 0, pets: 0, status: 'confirmed', confirmCode: 'HMA4CXTZZT', bookedAt: '2026-04-01', lastMsg: 'Hello Olena Petriieva, Thank you for booking...', lastMsgAt: '2026-04-01T13:33:00', unread: 0, threadId: '2488972931' },
  { guest: 'Maria Salmeron', phone: '+1 845-704-0101', listing: 'Stylish 2BR/2BA | Monthly Stay Offers', unit: '2BR 46-104', checkin: '2026-05-13', checkout: '2026-06-27', nights: 45, payout: 4472.41, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'confirmed', confirmCode: 'HMCZ3XW9WQ', bookedAt: '2026-03-19', lastMsg: '', lastMsgAt: '2026-03-19T18:20:00', unread: 0, threadId: '2476382960' },
  { guest: 'Brent Humeston', phone: '+1 209-499-1179', listing: 'Bright 2BR/2BA Retreat | Perfect for Monthly Stays', unit: '2BR 46-115', checkin: '2026-05-16', checkout: '2026-05-23', nights: 7, payout: 968.37, guests: 3, adults: 3, children: 0, infants: 0, pets: 0, status: 'confirmed', confirmCode: 'HM8XZCXZST', bookedAt: '2026-02-11', lastMsg: '', lastMsgAt: '2026-02-11T18:30:00', unread: 0, threadId: '2440987778' },
  { guest: 'Kristie Snyder', phone: '+1 607-279-8945', listing: 'Spacious 2BR/2BA | Monthly Discount', unit: '2BR 46-104', checkin: '2026-06-02', checkout: '2026-07-08', nights: 36, payout: 3790.67, guests: 3, adults: 3, children: 0, infants: 0, pets: 1, status: 'confirmed', confirmCode: 'HMRNBDYZ9B', bookedAt: '2026-03-23', lastMsg: '', lastMsgAt: '2026-03-23T16:36:00', unread: 0, threadId: '2479967158' },
  { guest: 'Mason Sobelman', phone: '+1 445-900-4686', listing: 'Cozy Studio on Montgomery Ave', unit: 'Montgomery 5B', checkin: '2026-06-30', checkout: '2026-07-10', nights: 10, payout: 672.62, guests: 2, adults: 2, children: 0, infants: 0, pets: 0, status: 'confirmed', confirmCode: 'HM8SJAKYPY', bookedAt: '2026-03-01', lastMsg: '', lastMsgAt: '2026-03-01T15:33:00', threadId: 'HM8SJAKYPY' }
];

// ── Global State ──
let currentChannelId = null;
let allChannels = [];
let currentFilter = 'all';
let currentSearch = '';
const _msgCache = {}; // channelId → { messages, fetchedAt }

// ═══════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════

async function loadChannels() {
  try {
    // Join booking data so we have financial + calendar info on each channel
    const { data: channels, error } = await sb
      .from('channels')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error loading channels:', error);
      return [];
    }

    // Enrich each channel with its booking data
    const enriched = [];
    for (const ch of (channels || [])) {
      if (ch.booking_id) {
        const { data: booking } = await sb
          .from('bookings')
          .select('*')
          .eq('id', ch.booking_id)
          .single();

        if (booking) {
          enriched.push({
            ...ch,
            check_in: booking.check_in,
            check_out: booking.check_out,
            nights: booking.nights,
            total_payout: booking.total_payout,
            nightly_rate: booking.nightly_rate,
            cleaning_fee: booking.cleaning_fee,
            service_fee: booking.service_fee,
            taxes: booking.taxes,
            host_payout: booking.host_payout,
            booking_status: booking.booking_status,
            guest_count: booking.guest_count,
            adults: booking.adults,
            children: booking.children,
            infants: booking.infants,
            pets: booking.pets,
            confirm_code: booking.external_id,
            payment_status: booking.payment_status
          });
          continue;
        }
      }
      enriched.push(ch);
    }
    return enriched;
  } catch (e) {
    console.error('Channel load failed:', e);
    return [];
  }
}

async function loadMessages(channelId, forceRefresh = false) {
  // Return cached messages if fresh (< 60s old)
  const cached = _msgCache[channelId];
  if (!forceRefresh && cached && (Date.now() - cached.fetchedAt < 60000)) {
    return cached.messages;
  }
  try {
    const { data, error } = await sb
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return cached?.messages || [];
    }
    const msgs = data || [];
    _msgCache[channelId] = { messages: msgs, fetchedAt: Date.now() };
    return msgs;
  } catch (e) {
    console.error('Messages load failed:', e);
    return cached?.messages || [];
  }
}

async function getCalendarBlocks(unitApt) {
  try {
    const { data, error } = await sb
      .from('bookings')
      .select('*')
      .eq('unit_apt', unitApt)
      .neq('booking_status', 'canceled_by_guest')
      .neq('booking_status', 'canceled_by_host')
      .neq('booking_status', 'declined')
      .neq('booking_status', 'withdrawn')
      .gte('check_out', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('Error loading calendar blocks:', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Calendar blocks load failed:', e);
    return [];
  }
}

function isDateBlocked(unitApt, date, bookings) {
  const checkDate = new Date(date);
  return bookings.some(b => {
    const checkIn = new Date(b.check_in);
    const checkOut = new Date(b.check_out);
    return checkDate >= checkIn && checkDate < checkOut;
  });
}

function getBlockingBookings(unitApt, startDate, endDate, bookings) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return bookings.filter(b => {
    const checkIn = new Date(b.check_in);
    const checkOut = new Date(b.check_out);
    return checkIn < end && checkOut > start;
  });
}

async function sendMessage(channelId, body) {
  try {
    const { data, error } = await sb
      .from('messages')
      .insert([{
        channel_id: channelId,
        sender: 'host',
        sender_name: 'You',
        body: body,
        platform: 'willowpa',
        sent_at: new Date().toISOString(),
        message_type: 'text'
      }])
      .select();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    // Update channel last_message_at and preview
    await sb
      .from('channels')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: body
      })
      .eq('id', channelId);

    return data?.[0] || null;
  } catch (e) {
    console.error('Send message failed:', e);
    return null;
  }
}

async function markChannelRead(channelId) {
  try {
    await sb
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('channel_id', channelId)
      .is('read_at', null);

    await sb
      .from('channels')
      .update({ unread_count: 0 })
      .eq('id', channelId);
  } catch (e) {
    console.error('Mark read failed:', e);
  }
}

async function seedAllBookingsData() {
  try {
    // Clear existing data first to avoid duplicates
    await sb.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await sb.from('channels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await sb.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const seededAirbnbGuests = new Set();

    // PART A: Seed the 18 Airbnb bookings from AIRBNB_BOOKINGS_SEED with rich data
    for (const item of AIRBNB_BOOKINGS_SEED) {
      const nightly = item.nights > 0 ? Math.round(item.payout / item.nights * 100) / 100 : 0;

      // Create booking
      const { data: bookingData, error: bookingError } = await sb
        .from('bookings')
        .insert({
          platform: 'airbnb',
          external_id: item.confirmCode,
          guest_name: item.guest,
          guest_phone: item.phone || null,
          guest_email: null,
          guest_count: item.guests,
          adults: item.adults,
          children: item.children,
          infants: item.infants,
          pets: item.pets,
          unit_apt: item.unit,
          listing_name: item.listing,
          check_in: item.checkin,
          check_out: item.checkout,
          total_payout: item.payout,
          nightly_rate: nightly,
          host_payout: item.payout,
          booking_status: item.status,
          booked_at: item.bookedAt
        })
        .select();

      if (bookingError) {
        console.error('Booking seed error for', item.guest, bookingError);
        continue;
      }

      const bookingId = bookingData?.[0]?.id;
      seededAirbnbGuests.add(item.guest);

      // Create channel linked to booking
      await sb
        .from('channels')
        .insert({
          booking_id: bookingId,
          platform: 'airbnb',
          external_id: item.threadId,
          guest_name: item.guest,
          guest_phone: item.phone || null,
          listing_name: item.listing,
          unit_apt: item.unit,
          status: 'active',
          unread_count: item.unread,
          last_message_at: item.lastMsgAt,
          last_message_preview: item.lastMsg
        });
    }
    console.log('Seeded 18 Airbnb bookings with rich data');

    // PART B: Seed ALL 171 bookings from ALL_BOOKINGS_SEED for financial tracking
    if (typeof ALL_BOOKINGS_SEED !== 'undefined') {
      for (const item of ALL_BOOKINGS_SEED) {
        // Skip Airbnb entries that are already in the rich dataset
        if (item.platform === 'airbnb' && seededAirbnbGuests.has(item.guest_name)) {
          continue;
        }

        // Insert booking
        const { data: bookingData, error: bookingError } = await sb
          .from('bookings')
          .insert({
            platform: item.platform,
            guest_name: item.guest_name,
            guest_count: item.guest_count,
            unit_apt: item.unit_apt,
            check_in: item.check_in,
            check_out: item.check_out,
            total_payout: item.total_payout,
            nightly_rate: item.nightly_rate,
            cleaning_fee: item.cleaning_fee,
            service_fee: item.service_fee,
            taxes: item.taxes,
            host_payout: item.host_payout,
            payment_status: item.payment_status,
            booking_status: item.booking_status,
            booked_at: item.booked_at
          })
          .select();

        if (bookingError) {
          console.error('Booking seed error for', item.guest_name, bookingError);
          continue;
        }

        const bookingId = bookingData?.[0]?.id;

        // PART C: Create channel for VRBO, Booking.com, and Direct bookings only (not Airbnb, since they have thread data)
        if (item.platform !== 'airbnb') {
          const platformLabel = item.platform === 'booking' ? 'Booking.com' :
                                item.platform === 'vrbo' ? 'VRBO' :
                                'Direct';

          await sb
            .from('channels')
            .insert({
              booking_id: bookingId,
              platform: item.platform,
              guest_name: item.guest_name,
              unit_apt: item.unit_apt,
              status: 'active',
              unread_count: 0,
              last_message_at: item.booked_at + 'T12:00:00',
              last_message_preview: `${platformLabel} reservation`
            });
        }
      }
      console.log('Seeded all 171 bookings from financial data');
    }

    console.log('Seeded all bookings and channels');
    return true;
  } catch (e) {
    console.error('Seed failed:', e);
    return false;
  }
}

// ═══════════════════════════════════════════════════════
// UI RENDERING
// ═══════════════════════════════════════════════════════

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatMessageTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getFilteredChannels() {
  let filtered = [...allChannels];

  if (currentFilter !== 'all') {
    filtered = filtered.filter(c => c.platform === currentFilter);
  }

  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(c =>
      c.guest_name?.toLowerCase().includes(q) ||
      c.listing_name?.toLowerCase().includes(q) ||
      c.unit_apt?.toLowerCase().includes(q)
    );
  }

  return filtered;
}

async function renderInbox() {
  const container = document.getElementById('page-messages');
  if (!container) return;

  allChannels = await loadChannels();

  if (allChannels.length === 0) {
    container.innerHTML = `
      <div style="padding:40px;text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">📬</div>
        <h2 style="color:#7d5228;margin:0 0 8px 0;">No Messages Yet</h2>
        <p style="color:#9e9485;margin:0 0 24px 0;">Your inbox will appear here when you connect messaging platforms.</p>
        <button onclick="this.disabled=true;this.textContent='Loading...';seedAllBookingsData().then(()=>renderInbox())" style="background:#7d5228;color:#fff;border:none;border-radius:6px;padding:12px 24px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;">
          📥 Load All Booking Data
        </button>
      </div>
    `;
    return;
  }

  const filtered = getFilteredChannels();
  const platformCounts = {};
  allChannels.forEach(c => {
    platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
  });

  let html = `
    <div style="display:flex;height:calc(100vh - 200px);gap:0;background:#fff;">
      <!-- LEFT PANEL: Channel List -->
      <div style="width:320px;border-right:1px solid #ddd8ce;display:flex;flex-direction:column;background:#faf8f5;">
        <!-- Toolbar -->
        <div style="padding:16px;border-bottom:1px solid #ddd8ce;flex-shrink:0;">
          <div style="display:flex;gap:8px;margin-bottom:12px;">
            <input
              type="text"
              placeholder="Search…"
              value="${currentSearch}"
              oninput="currentSearch=this.value;renderInbox()"
              style="flex:1;padding:8px 12px;border:1px solid #ddd8ce;border-radius:6px;font-family:inherit;font-size:12px;background:#fff;"
            />
            <button onclick="syncMessages()" title="Sync messages" style="width:36px;height:36px;border:1px solid #ddd8ce;border-radius:6px;background:#fff;cursor:pointer;font-size:16px;">🔄</button>
          </div>
          <div id="syncStatus" style="font-size:10px;color:#998e7d;margin-bottom:6px;"></div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button
              onclick="currentFilter='all';renderInbox()"
              style="padding:6px 12px;border-radius:4px;border:${currentFilter==='all' ? 'none' : '1px solid #ddd8ce'};background:${currentFilter==='all' ? '#7d5228' : '#fff'};color:${currentFilter==='all' ? '#fff' : '#635c4e'};font-family:inherit;font-size:11px;cursor:pointer;">
              All (${allChannels.length})
            </button>
            ${['airbnb','vrbo','booking','direct','willowpa'].map(p => `
              <button
                onclick="currentFilter='${p}';renderInbox()"
                style="padding:6px 12px;border-radius:4px;border:${currentFilter===p ? 'none' : '1px solid #ddd8ce'};background:${currentFilter===p ? PLATFORM_COLORS[p].bg : '#fff'};color:${currentFilter===p ? '#fff' : '#635c4e'};font-family:inherit;font-size:11px;cursor:pointer;white-space:nowrap;">
                ${PLATFORM_COLORS[p].label} ${platformCounts[p] ? '('+platformCounts[p]+')' : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Channel List -->
        <div style="flex:1;overflow-y:auto;">
  `;

  if (filtered.length === 0) {
    html += `<div style="padding:24px;text-align:center;color:#9e9485;font-size:12px;">No channels match your search.</div>`;
  } else {
    filtered.forEach(ch => {
      const colors = PLATFORM_COLORS[ch.platform] || PLATFORM_COLORS.direct;
      const isActive = currentChannelId === ch.id;
      const checkInDate = ch.check_in ? new Date(ch.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      const checkOutDate = ch.check_out ? new Date(ch.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      const timeStr = formatMessageTime(ch.last_message_at);

      html += `
        <div
          onclick="currentChannelId='${ch.id}';renderInbox()"
          style="padding:12px 12px;border-bottom:1px solid #f0ebe4;cursor:pointer;background:${isActive ? '#f0ebe4' : 'transparent'};transition:background 0.1s;"
        >
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
              <div style="flex-shrink:0;width:8px;height:8px;border-radius:50%;background:${colors.bg};" title="${colors.label}"></div>
              <div style="min-width:0;flex:1;">
                <div style="font-weight:500;font-size:12px;color:#2c2416;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ch.guest_name}</div>
                <div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#9e9485;">
                  <span style="padding:1px 5px;border-radius:3px;background:${colors.bg};color:${colors.text};font-size:8px;font-weight:600;letter-spacing:0.3px;flex-shrink:0;">${colors.label}</span>
                  <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ch.unit_apt || ch.listing_name}</span>
                </div>
              </div>
            </div>
            ${ch.unread_count > 0 ? `<div style="background:#FF5A5F;color:#fff;font-size:10px;padding:2px 6px;border-radius:10px;flex-shrink:0;font-weight:600;">${ch.unread_count}</div>` : ''}
          </div>
          <div style="font-size:11px;color:#635c4e;line-height:1.4;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            ${ch.last_message_preview || '(no messages)'}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;color:#9e9485;margin-bottom:4px;">
            <span>${timeStr}</span>
            <span>${checkInDate}${checkOutDate ? ' → ' + checkOutDate : ''}</span>
          </div>
        </div>
      `;
    });
  }

  html += `
        </div>

        <!-- Connected Platforms -->
        <div style="padding:10px 12px;border-top:1px solid #ddd8ce;flex-shrink:0;">
          <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">
            ${['airbnb','vrbo','booking','direct'].filter(p => platformCounts[p]).map(p => `
              <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;background:${PLATFORM_COLORS[p].bg}15;border:1px solid ${PLATFORM_COLORS[p].bg}30;font-size:9px;color:${PLATFORM_COLORS[p].bg};">
                <span style="width:6px;height:6px;border-radius:50%;background:${PLATFORM_COLORS[p].bg};"></span>
                ${PLATFORM_COLORS[p].label}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- CENTER + RIGHT PANELS -->
      <div style="flex:1;display:flex;background:#fff;">
  `;

  if (!currentChannelId) {
    html += `
      <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#9e9485;">
        <div style="text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">👋</div>
          <p style="margin:0;">Select a conversation to get started</p>
        </div>
      </div>
    </div>
    </div>
    `;
  } else {
    const channel = allChannels.find(c => c.id === currentChannelId);
    if (!channel) {
      html += `</div></div>`;
    } else {
      const colors = PLATFORM_COLORS[channel.platform] || PLATFORM_COLORS.direct;
      const messages = await loadMessages(currentChannelId);
      const checkInDate = channel.check_in ? new Date(channel.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
      const checkOutDate = channel.check_out ? new Date(channel.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
      const bookingStatus = STATUS_COLORS[channel.booking_status || channel.status] || STATUS_COLORS.confirmed;

      if (channel.unread_count > 0) {
        markChannelRead(currentChannelId);
      }

      // ── CENTER COLUMN: Messages + Reply ──
      html += `
        <div style="flex:1;display:flex;flex-direction:column;min-width:0;">
          <!-- Thin header bar -->
          <div style="padding:10px 16px;border-bottom:1px solid #ddd8ce;flex-shrink:0;background:#faf8f5;display:flex;align-items:center;gap:10px;">
            <h3 style="margin:0;font-size:15px;color:#2c2416;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(channel.guest_name)}</h3>
            <span style="background:${colors.bg};color:${colors.text};font-size:9px;padding:3px 7px;border-radius:4px;font-weight:600;flex-shrink:0;">${colors.label}</span>
            <span style="font-size:10px;color:#9e9485;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(channel.unit_apt || channel.listing_name || '')}</span>
            <span style="flex:1;"></span>
            <button onclick="generateSuggestion()" title="AI-suggested reply" style="background:#e8b94a;color:#fff;border:none;border-radius:4px;padding:5px 10px;font-family:inherit;font-size:9px;cursor:pointer;font-weight:600;flex-shrink:0;">🤖 Auto-Suggest</button>
          </div>

          <!-- Messages area (full height) -->
          <div id="messagesContainer" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;">
      `;

      let lastDate = null;
      messages.forEach(msg => {
        const msgDate = new Date(msg.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const msgTime = new Date(msg.sent_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        if (lastDate !== msgDate) {
          html += `<div style="text-align:center;color:#9e9485;font-size:10px;margin:4px 0;">${msgDate}</div>`;
          lastDate = msgDate;
        }

        const isHost = msg.sender === 'host';
        const isSys = msg.sender === 'system';

        if (isSys) {
          html += `
            <div style="text-align:center;margin:4px 0;">
              <span style="background:#f0ebe4;color:#9e9485;font-size:10px;padding:4px 12px;border-radius:12px;">${escapeHtml(msg.body)}</span>
            </div>
          `;
        } else {
          html += `
            <div style="display:flex;${isHost ? 'justify-content:flex-end' : 'justify-content:flex-start'};">
              <div style="max-width:75%;background:${isHost ? '#7d5228' : '#f0ebe4'};color:${isHost ? '#fff' : '#2c2416'};padding:8px 12px;border-radius:${isHost ? '12px 12px 2px 12px' : '12px 12px 12px 2px'};font-size:12px;line-height:1.45;">
                <div style="white-space:pre-wrap;">${escapeHtml(msg.body)}</div>
                <div style="font-size:9px;opacity:0.6;margin-top:3px;text-align:${isHost ? 'right' : 'left'};">${msgTime}</div>
              </div>
            </div>
          `;
        }
      });

      html += `
          </div>

          <!-- AI Suggestion Panel -->
          <div id="suggestionPanel" style="display:none;padding:8px 16px;border-top:2px solid #e8b94a;flex-shrink:0;background:linear-gradient(to bottom, #fffbf0, #fff8e8);">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="font-size:13px;">🤖</span>
              <span style="font-size:10px;font-weight:600;color:#7d5228;">Willow Bot Suggestion</span>
              <span id="suggestionConfidence" style="font-size:8px;padding:2px 5px;border-radius:10px;background:#e8b94a;color:#fff;font-weight:600;"></span>
              <span id="suggestionCategory" style="font-size:8px;padding:2px 5px;border-radius:10px;background:#7d5228;color:#fff;margin-left:auto;"></span>
            </div>
            <div id="suggestionReasoning" style="font-size:10px;color:#9e9485;margin-bottom:4px;font-style:italic;"></div>
            <textarea id="suggestionText" style="width:100%;min-height:50px;max-height:100px;padding:8px;border:1px solid #e8b94a;border-radius:6px;font-family:inherit;font-size:11px;resize:vertical;line-height:1.4;box-sizing:border-box;background:#fff;"></textarea>
            <div style="display:flex;gap:6px;margin-top:6px;align-items:center;">
              <button onclick="approveSuggestion()" style="background:#4CAF50;color:#fff;border:none;border-radius:5px;padding:6px 12px;font-family:inherit;font-size:10px;cursor:pointer;font-weight:600;">✅ Approve</button>
              <button onclick="editSuggestion()" style="background:#e8b94a;color:#fff;border:none;border-radius:5px;padding:6px 12px;font-family:inherit;font-size:10px;cursor:pointer;font-weight:600;">✏️ Edit</button>
              <button onclick="dismissSuggestion()" style="background:#fff;color:#c62828;border:1px solid #c62828;border-radius:5px;padding:6px 10px;font-family:inherit;font-size:10px;cursor:pointer;">✕</button>
              <button onclick="regenerateSuggestion()" style="background:#fff;color:#7d5228;border:1px solid #7d5228;border-radius:5px;padding:6px 10px;font-family:inherit;font-size:10px;cursor:pointer;">🔄 Retry</button>
              <button onclick="triggerInboxAISuggest()" style="background:#7c3aed;color:#fff;border:none;border-radius:5px;padding:6px 12px;font-family:inherit;font-size:10px;cursor:pointer;font-weight:600;margin-left:auto;">⚡ AI Suggest</button>
            </div>
          </div>

          <!-- Reply Input -->
          <div style="padding:10px 16px;border-top:1px solid #ddd8ce;flex-shrink:0;background:#faf8f5;">
            <div style="display:flex;gap:6px;margin-bottom:6px;">
              <select id="templateSelect" onchange="loadTemplate(this.value)" style="padding:5px 6px;border:1px solid #ddd8ce;border-radius:4px;font-family:inherit;font-size:10px;background:#fff;color:#635c4e;cursor:pointer;">
                <option value="">📋 Templates…</option>
                <option value="booking_confirm">Booking Confirmation</option>
                <option value="checkin_instructions">Check-in Instructions</option>
                <option value="extension_offer">Extension Offer</option>
                <option value="checkout_reminder">Checkout Reminder</option>
                <option value="maintenance_ack">Maintenance Ack</option>
                <option value="technician_dispatch">Technician Dispatch</option>
                <option value="wifi_troubleshoot">WiFi Troubleshoot</option>
                <option value="review_thanks">Review Thanks</option>
                <option value="longterm_mention">Long-term Mention</option>
              </select>
              <span style="flex:1;"></span>
              <button onclick="viewSendQueue()" title="View pending messages" style="background:#fff;color:#7d5228;border:1px solid #ddd8ce;border-radius:4px;padding:5px 8px;font-family:inherit;font-size:9px;cursor:pointer;position:relative;">📤 Queue<span id="queueBadge" style="display:none;position:absolute;top:-5px;right:-5px;background:#c62828;color:#fff;font-size:8px;font-weight:700;padding:1px 4px;border-radius:10px;min-width:12px;text-align:center;"></span></button>
            </div>
            ${typeof buildChannelSelector === 'function' ? buildChannelSelector('channel') : ''}
            <div style="display:flex;gap:6px;align-items:flex-end;">
              <textarea
                id="replyInput"
                placeholder="Type a reply… nothing is sent until you approve."
                onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();queueReply()}"
                style="flex:1;padding:8px 10px;border:1px solid #ddd8ce;border-radius:6px;font-family:inherit;font-size:12px;resize:none;height:48px;line-height:1.4;"
              ></textarea>
              <button onclick="queueReply()" style="background:#4CAF50;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-family:inherit;font-size:10px;cursor:pointer;font-weight:600;white-space:nowrap;height:48px;">✅ Send</button>
              <button onclick="sendReply()" style="background:#7d5228;color:#fff;border:none;border-radius:6px;padding:8px 10px;font-family:inherit;font-size:10px;cursor:pointer;height:48px;" title="Save as internal note">💾</button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Guest & Booking Details -->
        <div style="width:280px;border-left:1px solid #ddd8ce;background:#faf8f5;overflow-y:auto;flex-shrink:0;">
          <!-- Guest Info -->
          <div style="padding:16px;border-bottom:1px solid #ddd8ce;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <div style="width:44px;height:44px;border-radius:50%;background:${colors.bg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;flex-shrink:0;">
                ${(channel.guest_name || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style="font-weight:600;font-size:13px;color:#2c2416;">${escapeHtml(channel.guest_name)}</div>
                <div style="font-size:10px;color:#9e9485;">via ${colors.label}</div>
              </div>
            </div>
            ${channel.guest_phone ? `<div style="font-size:11px;color:#635c4e;margin-bottom:4px;">📞 <a href="tel:${channel.guest_phone}" style="color:#7d5228;text-decoration:none;">${channel.guest_phone}</a></div>` : ''}
            ${channel.guest_email ? `<div style="font-size:11px;color:#635c4e;margin-bottom:4px;">✉ <a href="mailto:${channel.guest_email}" style="color:#7d5228;text-decoration:none;">${channel.guest_email}</a></div>` : ''}
            <div style="display:flex;gap:6px;margin-top:10px;">
              <button onclick="openOnPlatform('${channel.platform}','${channel.external_id}')" style="flex:1;background:${colors.bg};color:${colors.text};border:none;border-radius:5px;padding:7px 8px;font-size:10px;cursor:pointer;font-weight:500;font-family:inherit;">Message on ${colors.label}</button>
            </div>
          </div>

          <!-- Booking Details -->
          <div style="padding:16px;border-bottom:1px solid #ddd8ce;">
            <div style="font-size:10px;font-weight:600;color:#9e9485;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Booking Details</div>

            <div style="margin-bottom:10px;">
              <div style="font-size:10px;color:#9e9485;margin-bottom:2px;">Property</div>
              <div style="font-size:12px;color:#2c2416;font-weight:500;">${escapeHtml(channel.listing_name || 'N/A')}</div>
              <div style="font-size:11px;color:#635c4e;">${escapeHtml(channel.unit_apt || '')}</div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
              <div>
                <div style="font-size:10px;color:#9e9485;margin-bottom:2px;">Check-in</div>
                <div style="font-size:11px;color:#2c2416;font-weight:500;">${checkInDate || 'N/A'}</div>
              </div>
              <div>
                <div style="font-size:10px;color:#9e9485;margin-bottom:2px;">Check-out</div>
                <div style="font-size:11px;color:#2c2416;font-weight:500;">${checkOutDate || 'N/A'}</div>
              </div>
            </div>

            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
              <span style="background:${bookingStatus.bg};color:${bookingStatus.text};padding:4px 8px;border-radius:4px;font-size:10px;font-weight:500;">${bookingStatus.label}</span>
              ${channel.confirm_code ? `<span style="background:#f0ebe4;color:#635c4e;padding:4px 8px;border-radius:4px;font-size:10px;">#${channel.confirm_code}</span>` : ''}
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <div style="font-size:10px;color:#9e9485;margin-bottom:2px;">Guests</div>
                <div style="font-size:11px;color:#2c2416;font-weight:500;">${channel.guest_count || channel.adults || 0}</div>
              </div>
              <div>
                <div style="font-size:10px;color:#9e9485;margin-bottom:2px;">Nights</div>
                <div style="font-size:11px;color:#2c2416;font-weight:500;">${channel.nights || 0}</div>
              </div>
            </div>
          </div>

          <!-- Financials -->
          <div style="padding:16px;border-bottom:1px solid #ddd8ce;">
            <div style="font-size:10px;font-weight:600;color:#9e9485;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Financials</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:11px;color:#635c4e;">Nightly rate</span>
              <span style="font-size:11px;color:#2c2416;font-weight:500;">${formatMoney(channel.nightly_rate || 0)}</span>
            </div>
            ${channel.cleaning_fee ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:11px;color:#635c4e;">Cleaning fee</span>
              <span style="font-size:11px;color:#2c2416;">${formatMoney(channel.cleaning_fee)}</span>
            </div>` : ''}
            ${channel.service_fee ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:11px;color:#635c4e;">Service fee</span>
              <span style="font-size:11px;color:#2c2416;">${formatMoney(channel.service_fee)}</span>
            </div>` : ''}
            <div style="display:flex;justify-content:space-between;padding-top:6px;border-top:1px solid #ddd8ce;">
              <span style="font-size:12px;color:#2c2416;font-weight:600;">Total</span>
              <span style="font-size:12px;color:#1565c0;font-weight:700;">${formatMoney(channel.total_payout || 0)}</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="padding:16px;">
            <div style="font-size:10px;font-weight:600;color:#9e9485;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Actions</div>
            <button onclick="viewReservation('${channel.platform}','${channel.confirm_code || ''}')" style="width:100%;background:#fff;color:#2c2416;border:1px solid #ddd8ce;border-radius:5px;padding:8px;font-family:inherit;font-size:10px;cursor:pointer;margin-bottom:6px;">View Booking on ${colors.label}</button>
            <button onclick="openOnPlatform('${channel.platform}','${channel.external_id}')" style="width:100%;background:#fff;color:#2c2416;border:1px solid #ddd8ce;border-radius:5px;padding:8px;font-family:inherit;font-size:10px;cursor:pointer;">Open Thread on ${colors.label}</button>
          </div>
        </div>
      </div>
      `;
    }
  }

  html += `</div>`;
  container.innerHTML = html;

  // Update nav badge
  const totalUnread = allChannels.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  const badge = document.getElementById('msgBadge');
  if (badge) {
    if (totalUnread > 0) {
      badge.textContent = totalUnread;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // Update send queue badge
  updateQueueBadge();

  // Preload messages for the first 10 visible channels in background
  const toPreload = filtered.slice(0, 10).filter(c => !_msgCache[c.id]);
  if (toPreload.length > 0) {
    setTimeout(() => {
      toPreload.forEach(c => loadMessages(c.id)); // fire-and-forget
    }, 200);
  }
}

function updateQueueBadge() {
  const qBadge = document.getElementById('queueBadge');
  if (!qBadge) return;
  const queue = getSendQueue();
  const pending = queue.filter(q => q.status === 'pending').length;
  if (pending > 0) {
    qBadge.textContent = pending;
    qBadge.style.display = 'inline-block';
  } else {
    qBadge.style.display = 'none';
  }
}

async function sendReply() {
  const input = document.getElementById('replyInput');
  if (!input || !input.value.trim() || !currentChannelId) return;

  const body = input.value.trim();
  input.value = '';

  const result = await sendMessage(currentChannelId, body);
  if (result) {
    renderInbox();
    setTimeout(() => {
      const container = document.getElementById('messagesContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }
}

// ═══════════════════════════════════════════════════════
// AI SUGGESTION ENGINE UI
// ═══════════════════════════════════════════════════════

let currentSuggestion = null;

function getFirstName(fullName) {
  if (!fullName) return 'Guest';
  // Handle "Beth, Katarina" -> "Beth", "Richard ODonnell" -> "Richard", "Damaris Suyapa Bejarano Reyes" -> "Damaris"
  return fullName.split(/[,\s]/)[0].trim();
}

function generateSuggestion() {
  const channel = allChannels.find(c => c.id === currentChannelId);
  if (!channel) return;

  // Find the last guest message to generate a reply for
  const messagesContainer = document.getElementById('messagesContainer');
  // Get last messages from DB (we need the actual data, use a quick approach)
  loadMessages(currentChannelId).then(messages => {
    // Find last guest message
    let lastGuestMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'guest') {
        lastGuestMsg = messages[i];
        break;
      }
    }

    if (!lastGuestMsg) {
      // No guest message — maybe suggest a proactive message
      const context = {
        guestName: channel.guest_name,
        property: channel.unit_apt,
        checkin: channel.check_in,
        checkout: channel.check_out,
        status: channel.booking_status
      };

      // Check if guest is arriving soon (within 2 days)
      const checkinDate = new Date(channel.check_in);
      const now = new Date();
      const daysTilCheckin = Math.ceil((checkinDate - now) / (1000 * 60 * 60 * 24));

      if (daysTilCheckin === 1 || daysTilCheckin === 0) {
        currentSuggestion = {
          suggestion: `Check-in instructions will be sent automatically for ${channel.guest_name}.`,
          confidence: 0.5,
          category: 'proactive',
          subcategory: 'checkin_reminder',
          reasoning: 'Guest checking in tomorrow/today — might need check-in instructions',
          needsReview: true
        };
      } else if (channel.booking_status === 'currently_hosting') {
        currentSuggestion = {
          suggestion: WILLOW_KB.templates.extensionOffer(getFirstName(channel.guest_name)),
          confidence: 0.6,
          category: 'proactive',
          subcategory: 'extension_offer',
          reasoning: 'Guest is currently hosting — suggest extension offer',
          needsReview: true
        };
      } else {
        currentSuggestion = {
          suggestion: `Hello ${getFirstName(channel.guest_name)}! How can we help you today?`,
          confidence: 0.3,
          category: 'proactive',
          subcategory: 'greeting',
          reasoning: 'No guest messages to respond to — generic greeting',
          needsReview: true
        };
      }
    } else {
      // Generate suggestion based on last guest message
      const context = {
        guestName: channel.guest_name,
        property: channel.unit_apt,
        unit: channel.unit_apt,
        checkin: channel.check_in,
        checkout: channel.check_out,
        status: channel.booking_status,
        platform: channel.platform,
        confirmCode: channel.confirm_code,
        threadId: channel.external_id
      };

      currentSuggestion = WillowReplyBot.suggestReply(lastGuestMsg.body, context);
    }

    showSuggestion();
  });
}

function showSuggestion() {
  if (!currentSuggestion) return;
  const panel = document.getElementById('suggestionPanel');
  const textArea = document.getElementById('suggestionText');
  const confidence = document.getElementById('suggestionConfidence');
  const category = document.getElementById('suggestionCategory');
  const reasoning = document.getElementById('suggestionReasoning');

  if (!panel) return;

  textArea.value = currentSuggestion.suggestion;
  confidence.textContent = `${Math.round(currentSuggestion.confidence * 100)}% match`;
  confidence.style.background = currentSuggestion.confidence >= 0.7 ? '#4CAF50' : currentSuggestion.confidence >= 0.4 ? '#e8b94a' : '#c62828';
  category.textContent = `${currentSuggestion.category} / ${currentSuggestion.subcategory}`;
  reasoning.textContent = currentSuggestion.reasoning || '';

  panel.style.display = 'block';

  // Auto-resize textarea
  textArea.style.height = 'auto';
  textArea.style.height = Math.min(textArea.scrollHeight, 140) + 'px';
}

function dismissSuggestion() {
  const panel = document.getElementById('suggestionPanel');
  if (panel) panel.style.display = 'none';
  currentSuggestion = null;
}

function editSuggestion() {
  const textArea = document.getElementById('suggestionText');
  if (textArea) {
    textArea.focus();
    textArea.setSelectionRange(0, textArea.value.length);
  }
}

function regenerateSuggestion() {
  // If we have multiple suggestions, cycle through them
  const channel = allChannels.find(c => c.id === currentChannelId);
  if (!channel) return;

  loadMessages(currentChannelId).then(messages => {
    let lastGuestMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'guest') {
        lastGuestMsg = messages[i];
        break;
      }
    }

    if (lastGuestMsg) {
      const context = {
        guestName: channel.guest_name,
        property: channel.unit_apt,
        status: channel.booking_status,
        platform: channel.platform
      };
      const suggestions = WillowReplyBot.suggestMultiple(lastGuestMsg.body, context);
      // Find next suggestion different from current
      const current = document.getElementById('suggestionText')?.value;
      const next = suggestions.find(s => s.suggestion !== current) || suggestions[0];
      currentSuggestion = next;
      showSuggestion();
    }
  });
}

async function approveSuggestion() {
  const textArea = document.getElementById('suggestionText');
  if (!textArea || !textArea.value.trim()) return;

  // Copy suggestion text to the reply input and use queueReply
  const input = document.getElementById('replyInput');
  if (input) {
    input.value = textArea.value.trim();
  }

  // Dismiss the suggestion panel first
  dismissSuggestion();

  // Queue it
  await queueReply();
}

function loadTemplate(templateKey) {
  if (!templateKey) return;
  const channel = allChannels.find(c => c.id === currentChannelId);
  if (!channel) return;

  const firstName = getFirstName(channel.guest_name);
  const input = document.getElementById('replyInput');
  if (!input) return;

  const templates = {
    booking_confirm: WILLOW_KB.templates.bookingConfirmation(channel.guest_name, channel.listing_name || '', channel.check_in || ''),
    checkin_instructions: `Dear ${channel.guest_name},\n\nYour check-in date is ${channel.check_in || '[DATE]'}, and you'll be staying in the designated apartment. Check-in is available anytime after 3 PM.\n\nAddress: [PROPERTY_ADDRESS]\nApartment: ${channel.unit_apt || '[UNIT]'}\nMain Entrance Pin: [PIN]\nApartment Door Code: [CODE]\n\nWi-Fi Info:\nNetwork Name: [NETWORK]\nPassword: [PASSWORD]\n\nParking: A parking tag has been left for your vehicle. Please display the tag immediately.\n\nTrash Disposal: Trash bins are located outside the building at each corner. Please do not leave trash in the hallways.\n\nHouse Rules:\n- No smoking in the apartment or on the balcony\n- No parties or loud noise\n\nMaintenance & Emergencies: 9 AM – 7 PM\nText us at 267-865-0001\nEmergencies: Dial 911\n\nThank you, and enjoy your stay!`,
    extension_offer: WILLOW_KB.templates.extensionOffer(firstName),
    checkout_reminder: WILLOW_KB.templates.checkoutReminder(firstName),
    maintenance_ack: WILLOW_KB.responses.maintenance.general.sendTechnician,
    technician_dispatch: `A technician is on his way, will be there in 5-10 minutes.`,
    wifi_troubleshoot: WILLOW_KB.responses.maintenance.wifi.initial,
    review_thanks: WILLOW_KB.responses.social.review.thankForReview(firstName),
    longterm_mention: WILLOW_KB.templates.longTermMention(channel.guest_name, channel.check_in),
  };

  const text = templates[templateKey];
  if (text) {
    input.value = text;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
    input.focus();
  }

  // Reset dropdown
  document.getElementById('templateSelect').value = '';
}

async function queueReply() {
  const input = document.getElementById('replyInput');
  if (!input || !input.value.trim() || !currentChannelId) return;

  const channel = allChannels.find(c => c.id === currentChannelId);
  if (!channel) return;

  const message = input.value.trim();

  // Check if a non-default channel is selected via the unified selector
  var selectedCh = typeof getSelectedChannel === 'function' ? getSelectedChannel() : 'channel';
  if (selectedCh && selectedCh !== 'channel') {
    sendViaChannel(selectedCh, channel.guest_name, channel.guest_email || '', channel.guest_phone || '', message, {subject: 'Booking Message', threadId: channel.external_id || ''});
    input.value = '';
    input.style.height = '60px';
    dismissSuggestion();
    return;
  }

  // Save approved message to Supabase as host message
  await sendMessage(currentChannelId, message);

  // Queue for platform send (works for airbnb, vrbo, booking)
  if (['airbnb', 'vrbo', 'booking'].includes(channel.platform) && channel.external_id) {
    const queue = JSON.parse(localStorage.getItem('willowSendQueue') || '[]');
    queue.push({
      platform: channel.platform,
      threadId: channel.external_id,
      message: message,
      guestName: channel.guest_name,
      channelId: currentChannelId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('willowSendQueue', JSON.stringify(queue));

    const platformLabel = PLATFORM_COLORS[channel.platform]?.label || channel.platform;
    showToast(`✅ Approved & queued for ${platformLabel}.\nGuest: ${channel.guest_name}\nMessage will be sent via browser automation.`, 'success');
  } else {
    showToast(`✅ Reply saved for ${channel.guest_name}.`, 'success');
  }

  input.value = '';
  input.style.height = '60px';

  // Also dismiss suggestion panel if open
  dismissSuggestion();

  renderInbox();
  setTimeout(() => {
    const container = document.getElementById('messagesContainer');
    if (container) container.scrollTop = container.scrollHeight;
  }, 200);
}

function showToast(msg, type = 'info') {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const colors = { success: '#4CAF50', error: '#c62828', info: '#1565c0', warning: '#e8b94a' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    padding:12px 20px;background:${colors[type] || colors.info};color:#fff;
    border-radius:8px;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.2);
    margin-bottom:8px;animation:fadeIn 0.3s ease;max-width:400px;white-space:pre-line;
  `;
  toast.textContent = msg;
  wrap.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ═══════════════════════════════════════════════════════
// ANTHROPIC AI REPLY ASSISTANT — powered by Claude API
// Works alongside the KB-based Willow Bot suggestion
// ═══════════════════════════════════════════════════════

const _AI_PROXY = 'https://tech.willowpa.com/proxy.php';

function _buildInboxAISystemPrompt() {
  var kb = (typeof WILLOW_KB !== 'undefined') ? WILLOW_KB : {};
  var prompt = 'You are a helpful property management assistant for Willow Partnership, LLC. ';
  prompt += 'You help draft replies to guest and resident messages.\n\n';
  prompt += '## Company Info\n';
  if (kb.company) {
    prompt += '- Name: ' + (kb.company.name || '') + '\n';
    prompt += '- Phone: ' + (kb.company.phone || '') + '\n';
    prompt += '- Email: ' + (kb.company.email || '') + '\n';
    prompt += '- Hours: ' + (kb.company.hours || '') + '\n';
  }
  var props = kb.properties || {};
  if (Object.keys(props).length > 0) {
    prompt += '\n## Properties\n';
    Object.keys(props).forEach(function(k) {
      var p = props[k];
      if (p && p.address) {
        prompt += '- ' + k + ': ' + p.address + '\n';
        if (p.entrancePin) prompt += '  Entrance PIN: ' + p.entrancePin + '\n';
        if (p.wifi) prompt += '  WiFi: ' + p.wifi.network + ' / ' + p.wifi.password + '\n';
      }
    });
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

async function triggerInboxAISuggest() {
  if (!currentChannelId) return;
  const channel = allChannels.find(c => c.id === currentChannelId);
  if (!channel) return;

  // Show loading state in suggestion panel
  const panel = document.getElementById('suggestionPanel');
  const textArea = document.getElementById('suggestionText');
  const confidence = document.getElementById('suggestionConfidence');
  const reasoning = document.getElementById('suggestionReasoning');

  if (panel) panel.style.display = 'block';
  if (confidence) { confidence.textContent = 'AI thinking...'; confidence.style.background = '#7c3aed'; }
  if (reasoning) reasoning.textContent = 'Generating response with Claude AI...';
  if (textArea) textArea.value = '';

  try {
    const messages = await loadMessages(currentChannelId);
    // Build conversation context
    const recent = messages.slice(-10);
    const convoText = recent.map(function(m) {
      const who = m.sender === 'guest' ? (channel.guest_name || 'Guest') : 'Management';
      return who + ': ' + m.body;
    }).join('\n');

    let userPrompt = 'Guest: ' + channel.guest_name;
    if (channel.unit_apt) userPrompt += ' (Unit ' + channel.unit_apt + ')';
    if (channel.listing_name) userPrompt += ' at ' + channel.listing_name;
    if (channel.check_in) userPrompt += '\nCheck-in: ' + channel.check_in;
    if (channel.check_out) userPrompt += ' | Check-out: ' + channel.check_out;
    if (channel.booking_status) userPrompt += '\nStatus: ' + channel.booking_status;
    userPrompt += '\n\nConversation:\n' + convoText;
    userPrompt += '\n\nDraft a reply to the guest\'s latest message.';

    const resp = await fetch(_AI_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: _buildInboxAISystemPrompt(),
        messages: [{ role: 'user', content: userPrompt }]
      })
    });
    const data = await resp.json();

    if (data.content && data.content[0] && data.content[0].text) {
      const suggestion = data.content[0].text;
      if (textArea) textArea.value = suggestion;
      if (confidence) { confidence.textContent = 'AI Generated'; confidence.style.background = '#7c3aed'; }
      if (reasoning) reasoning.textContent = 'Claude AI suggestion based on conversation context';
      currentSuggestion = { suggestion: suggestion, confidence: 0.9, category: 'ai', subcategory: 'anthropic', reasoning: 'AI-generated reply' };
    } else {
      if (confidence) { confidence.textContent = 'Error'; confidence.style.background = '#c62828'; }
      if (reasoning) reasoning.textContent = data.error ? data.error.message : 'AI suggestion unavailable';
    }
  } catch (e) {
    console.error('AI suggestion failed:', e);
    if (confidence) { confidence.textContent = 'Error'; confidence.style.background = '#c62828'; }
    if (reasoning) reasoning.textContent = 'Failed to get AI suggestion: ' + e.message;
  }
}

// ═══════════════════════════════════════════════════════
// MULTI-PLATFORM BROWSER SEND QUEUE
// Supports: Airbnb, VRBO, Booking.com
// Messages are queued here, then sent via browser automation
// ═══════════════════════════════════════════════════════

function getSendQueue() {
  return JSON.parse(localStorage.getItem('willowSendQueue') || '[]');
}

function saveSendQueue(queue) {
  localStorage.setItem('willowSendQueue', JSON.stringify(queue));
}

function viewSendQueue() {
  const queue = getSendQueue();
  const pending = queue.filter(q => q.status === 'pending');
  const sent = queue.filter(q => q.status === 'sent');
  const failed = queue.filter(q => q.status === 'failed');

  // Remove any existing modal
  const existing = document.getElementById('sendQueueModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'sendQueueModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  let itemsHtml = '';
  if (queue.length === 0) {
    itemsHtml = '<div style="padding:32px;text-align:center;color:#9e9485;font-size:13px;">📭 No messages in queue.</div>';
  } else {
    queue.forEach((q, i) => {
      const colors = PLATFORM_COLORS[q.platform] || PLATFORM_COLORS.direct;
      const statusIcon = q.status === 'pending' ? '⏳' : q.status === 'sent' ? '✅' : '❌';
      const statusColor = q.status === 'pending' ? '#e65100' : q.status === 'sent' ? '#2e7d32' : '#c62828';
      const timeStr = new Date(q.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const sentStr = q.sentAt ? ' — Sent ' + new Date(q.sentAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      const failStr = q.failReason ? ' — ' + q.failReason : '';

      itemsHtml += `
        <div style="padding:12px 16px;border-bottom:1px solid #f0ebe4;${q.status === 'pending' ? 'background:#fffbf0;' : ''}">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:14px;">${statusIcon}</span>
            <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:${colors.bg};color:${colors.text};font-weight:600;">${colors.label}</span>
            <span style="font-size:12px;font-weight:600;color:#2c2416;">${q.guestName}</span>
            <span style="font-size:10px;color:${statusColor};font-weight:600;margin-left:auto;">${q.status.toUpperCase()}${sentStr}${failStr}</span>
          </div>
          <div style="font-size:11px;color:#635c4e;line-height:1.4;background:#fff;border:1px solid #ebe7df;border-radius:6px;padding:8px 10px;max-height:80px;overflow-y:auto;white-space:pre-wrap;">${escapeHtml(q.message)}</div>
          <div style="display:flex;gap:6px;margin-top:8px;align-items:center;">
            <span style="font-size:9px;color:#9e9485;">Queued: ${timeStr}</span>
            ${q.status === 'pending' ? `
              <span style="flex:1;"></span>
              <button onclick="processSingleMessage(${i})" style="background:#4CAF50;color:#fff;border:none;border-radius:4px;padding:5px 12px;font-size:10px;cursor:pointer;font-weight:600;">📤 Send Now</button>
              <button onclick="removeFromQueue(${i})" style="background:#fff;color:#c62828;border:1px solid #c62828;border-radius:4px;padding:5px 10px;font-size:10px;cursor:pointer;">✕ Remove</button>
            ` : ''}
            ${q.status === 'failed' ? `
              <span style="flex:1;"></span>
              <button onclick="retryQueueMessage(${i})" style="background:#e8b94a;color:#fff;border:none;border-radius:4px;padding:5px 12px;font-size:10px;cursor:pointer;font-weight:600;">🔄 Retry</button>
              <button onclick="removeFromQueue(${i})" style="background:#fff;color:#c62828;border:1px solid #c62828;border-radius:4px;padding:5px 10px;font-size:10px;cursor:pointer;">✕ Remove</button>
            ` : ''}
          </div>
        </div>
      `;
    });
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;width:600px;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="padding:16px 20px;border-bottom:1px solid #ebe7df;display:flex;align-items:center;gap:12px;">
        <span style="font-size:20px;">📤</span>
        <div>
          <div style="font-size:14px;font-weight:700;color:#2c2416;">Send Queue</div>
          <div style="font-size:10px;color:#9e9485;">Messages approved for platform delivery</div>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
          ${pending.length > 0 ? `<span style="background:#e65100;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600;">${pending.length} pending</span>` : ''}
          ${sent.length > 0 ? `<span style="background:#2e7d32;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600;">${sent.length} sent</span>` : ''}
          ${failed.length > 0 ? `<span style="background:#c62828;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600;">${failed.length} failed</span>` : ''}
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;">${itemsHtml}</div>
      <div style="padding:12px 20px;border-top:1px solid #ebe7df;display:flex;gap:8px;justify-content:space-between;">
        ${pending.length > 0 ? `<button onclick="processAllPending()" style="background:#4CAF50;color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:11px;cursor:pointer;font-weight:600;">📤 Send All Pending (${pending.length})</button>` : '<span></span>'}
        <div style="display:flex;gap:8px;">
          ${sent.length + failed.length > 0 ? `<button onclick="clearCompletedQueue()" style="background:#fff;color:#635c4e;border:1px solid #ddd8ce;border-radius:6px;padding:8px 12px;font-size:11px;cursor:pointer;">Clear Completed</button>` : ''}
          <button onclick="document.getElementById('sendQueueModal').remove()" style="background:#7d5228;color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:11px;cursor:pointer;font-weight:500;">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function clearSendQueue() {
  saveSendQueue([]);
  showToast('Send queue cleared.', 'info');
}

/**
 * Process the next pending message in the send queue.
 * This opens the platform's messaging page and types + sends the message.
 * Called by Claude browser automation or manually.
 *
 * Returns the next pending item for external automation to process.
 */
function getNextPendingMessage() {
  const queue = getSendQueue();
  const pending = queue.find(q => q.status === 'pending');
  return pending || null;
}

function markMessageSent(timestamp) {
  const queue = getSendQueue();
  const idx = queue.findIndex(q => q.timestamp === timestamp);
  if (idx !== -1) {
    queue[idx].status = 'sent';
    queue[idx].sentAt = new Date().toISOString();
    saveSendQueue(queue);
    showToast(`✅ Message sent to ${queue[idx].guestName} on ${PLATFORM_COLORS[queue[idx].platform]?.label || queue[idx].platform}!`, 'success');
  }
}

function markMessageFailed(timestamp, reason) {
  const queue = getSendQueue();
  const idx = queue.findIndex(q => q.timestamp === timestamp);
  if (idx !== -1) {
    queue[idx].status = 'failed';
    queue[idx].failReason = reason;
    saveSendQueue(queue);
    showToast(`❌ Failed to send to ${queue[idx].guestName}: ${reason}`, 'error');
  }
}

/**
 * Get the messaging URL for a platform thread
 */
function getPlatformMessageUrl(platform, threadId) {
  const urls = {
    airbnb: `https://www.airbnb.com/hosting/messages/${threadId}`,
    vrbo: `https://www.vrbo.com/messages/${threadId}`,
    booking: `https://secure.booking.com/messaging/${threadId}`
  };
  return urls[platform] || null;
}

/**
 * Open the next pending message's platform page for manual or automated sending
 */
function openNextPending() {
  const next = getNextPendingMessage();
  if (!next) {
    showToast('No pending messages in queue.', 'info');
    return;
  }

  const url = getPlatformMessageUrl(next.platform, next.threadId);
  if (url) {
    // Copy message to clipboard for easy paste
    navigator.clipboard.writeText(next.message).then(() => {
      showToast(`📋 Message copied to clipboard!\nOpening ${PLATFORM_COLORS[next.platform]?.label} for ${next.guestName}...\nPaste and send manually, or let automation handle it.`, 'info');
    }).catch(() => {
      showToast(`Opening ${PLATFORM_COLORS[next.platform]?.label} for ${next.guestName}...`, 'info');
    });
    window.open(url, '_blank');
  } else {
    showToast(`No messaging URL available for ${next.platform}.`, 'error');
  }
}

/**
 * Process a single message from the queue — opens platform page, copies message to clipboard
 * @param {number} index - Index in the queue array
 */
function processSingleMessage(index) {
  const queue = getSendQueue();
  const item = queue[index];
  if (!item) return;

  const url = getPlatformMessageUrl(item.platform, item.threadId);
  if (!url) {
    showToast(`No messaging URL for ${item.platform}.`, 'error');
    return;
  }

  // Copy message to clipboard
  navigator.clipboard.writeText(item.message).then(() => {
    const colors = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS.direct;
    showToast(`📋 Message copied to clipboard!\nOpening ${colors.label} for ${item.guestName}...\n\n1. Paste the message (Ctrl+V)\n2. Click Send on the platform\n3. Come back and click "Mark Sent"`, 'info');
  }).catch(() => {
    showToast(`Opening ${PLATFORM_COLORS[item.platform]?.label}...`, 'info');
  });

  // Open platform messaging page
  window.open(url, '_blank');

  // Show a "Mark Sent" confirmation after a moment
  setTimeout(() => {
    showSendConfirmation(item, index);
  }, 1500);
}

/**
 * Show a floating confirmation bar to mark message as sent or failed
 */
function showSendConfirmation(item, index) {
  const existing = document.getElementById('sendConfirmBar');
  if (existing) existing.remove();

  const colors = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS.direct;
  const bar = document.createElement('div');
  bar.id = 'sendConfirmBar';
  bar.style.cssText = `
    position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:10000;
    background:#2c2416;color:#fff;border-radius:12px;padding:12px 20px;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);display:flex;align-items:center;gap:12px;
    font-family:inherit;max-width:600px;animation:fadeIn 0.3s ease;
  `;
  bar.innerHTML = `
    <span style="font-size:11px;color:#e8b94a;">Did you send the message to <strong>${item.guestName}</strong> on ${colors.label}?</span>
    <button onclick="confirmSent('${item.timestamp}', ${index})" style="background:#4CAF50;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:11px;cursor:pointer;font-weight:600;white-space:nowrap;">✅ Mark Sent</button>
    <button onclick="confirmFailed('${item.timestamp}', ${index})" style="background:#c62828;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:11px;cursor:pointer;font-weight:600;white-space:nowrap;">❌ Failed</button>
    <button onclick="document.getElementById('sendConfirmBar').remove()" style="background:transparent;color:#9e9485;border:none;font-size:16px;cursor:pointer;padding:0 4px;">✕</button>
  `;
  document.body.appendChild(bar);

  // Auto-dismiss after 5 minutes
  setTimeout(() => { if (document.getElementById('sendConfirmBar')) document.getElementById('sendConfirmBar').remove(); }, 300000);
}

function confirmSent(timestamp, index) {
  markMessageSent(timestamp);
  const bar = document.getElementById('sendConfirmBar');
  if (bar) bar.remove();
  // Refresh the modal if open
  const modal = document.getElementById('sendQueueModal');
  if (modal) { modal.remove(); viewSendQueue(); }
}

function confirmFailed(timestamp, index) {
  markMessageFailed(timestamp, 'Manually marked as failed');
  const bar = document.getElementById('sendConfirmBar');
  if (bar) bar.remove();
  const modal = document.getElementById('sendQueueModal');
  if (modal) { modal.remove(); viewSendQueue(); }
}

/**
 * Process all pending messages one by one
 */
function processAllPending() {
  const queue = getSendQueue();
  const pendingIndices = [];
  queue.forEach((q, i) => { if (q.status === 'pending') pendingIndices.push(i); });

  if (pendingIndices.length === 0) {
    showToast('No pending messages.', 'info');
    return;
  }

  // Process the first one — user can click "Send All" again for the next
  processSingleMessage(pendingIndices[0]);

  if (pendingIndices.length > 1) {
    showToast(`Processing 1 of ${pendingIndices.length} pending messages.\nAfter sending, click "Send All" again for the next.`, 'info');
  }
}

/**
 * Remove a message from the queue
 */
function removeFromQueue(index) {
  const queue = getSendQueue();
  queue.splice(index, 1);
  saveSendQueue(queue);
  // Refresh modal
  const modal = document.getElementById('sendQueueModal');
  if (modal) { modal.remove(); viewSendQueue(); }
  showToast('Removed from queue.', 'info');
}

/**
 * Retry a failed message
 */
function retryQueueMessage(index) {
  const queue = getSendQueue();
  if (queue[index]) {
    queue[index].status = 'pending';
    delete queue[index].failReason;
    saveSendQueue(queue);
    // Refresh modal
    const modal = document.getElementById('sendQueueModal');
    if (modal) { modal.remove(); viewSendQueue(); }
    showToast('Message re-queued for sending.', 'info');
  }
}

/**
 * Clear completed (sent + failed) messages from the queue
 */
function clearCompletedQueue() {
  const queue = getSendQueue();
  const pending = queue.filter(q => q.status === 'pending');
  saveSendQueue(pending);
  const modal = document.getElementById('sendQueueModal');
  if (modal) { modal.remove(); viewSendQueue(); }
  showToast('Cleared completed messages from queue.', 'info');
}

async function syncMessages() {
  const btn = event?.target;
  if (btn) {
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    btn.textContent = '⏳';
  }

  const statusEl = document.getElementById('syncStatus');
  if (statusEl) statusEl.textContent = 'Syncing…';

  try {
    if (typeof PlatformSync !== 'undefined') {
      // Clear message cache so fresh data loads after sync
      Object.keys(_msgCache).forEach(k => delete _msgCache[k]);
      const t0 = performance.now();
      const result = await PlatformSync.syncAll();
      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
      console.log(`[Sync] Completed in ${elapsed}s`, result);
      if (statusEl) statusEl.textContent = `Last sync: ${new Date().toLocaleTimeString()} (${elapsed}s)`;
      showToast(`Sync complete in ${elapsed}s`, 'success');
    } else {
      console.warn('[Sync] PlatformSync not loaded');
      showToast('Sync engine not loaded', 'error');
    }
  } catch (err) {
    console.error('[Sync] Error:', err);
    if (statusEl) statusEl.textContent = 'Sync failed';
    showToast('Sync failed: ' + err.message, 'error');
  }

  if (btn) {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.textContent = '🔄';
  }
  renderInbox();
}

function openOnPlatform(platform, externalId) {
  const urls = {
    airbnb: `https://www.airbnb.com/hosting/messages/${externalId}`,
    vrbo: `https://www.vrbo.com/messages/${externalId}`,
    booking: `https://secure.booking.com/messaging/${externalId}`,
    direct: `#`,
    willowpa: `#`
  };

  const url = urls[platform];
  if (url !== '#') {
    window.open(url, '_blank');
  } else {
    alert(`Platform ${platform} is not yet connected to external messaging.`);
  }
}

function viewReservation(platform, confirmCode) {
  const urls = {
    airbnb: `https://www.airbnb.com/hosting/reservations/details/${confirmCode}`,
    vrbo: `https://www.vrbo.com/reservations/${confirmCode}`,
    booking: `https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?res_id=${confirmCode}`,
    direct: `#`,
    willowpa: `#`
  };
  const url = urls[platform];
  if (url !== '#') {
    window.open(url, '_blank');
  } else {
    alert('No external reservation page for this platform.');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Auto-sync lifecycle ─────────────────────
let _autoSyncStarted = false;
function startPlatformAutoSync() {
  if (_autoSyncStarted) return;
  _autoSyncStarted = true;
  if (typeof PlatformSync !== 'undefined') {
    // Initial sync on first visit to Messages
    syncMessages();
    // Then every 5 minutes
    PlatformSync.startAutoSync(5 * 60 * 1000);
    console.log('[Sync] Auto-sync started (5 min interval)');
  }
}

// ═══════════════════════════════════════════════════════
// GLOBAL: Open inbox view and auto-select a guest's thread
// Called from Pipeline, Long-Term, Client App "Message" buttons
// Smart routing: short-term → inbox view, long-term → modal with channels
// ═══════════════════════════════════════════════════════
window.openInboxThread = function(guestName) {
  if (!guestName) return;
  var normalName = guestName.toLowerCase().replace(/[^a-z]/g, '');

  // 1. Check if this is a short-term guest (in AIRBNB_BOOKINGS_SEED or allChannels)
  var isShortTerm = false;
  if (typeof AIRBNB_BOOKINGS_SEED !== 'undefined') {
    isShortTerm = AIRBNB_BOOKINGS_SEED.some(function(b) {
      return b.guest && b.guest.toLowerCase().replace(/[^a-z]/g, '') === normalName;
    });
  }
  // Also check loaded channels
  if (!isShortTerm && allChannels && allChannels.length > 0) {
    isShortTerm = allChannels.some(function(ch) {
      return ch.guest_name && ch.guest_name.toLowerCase().replace(/[^a-z]/g, '') === normalName;
    });
  }

  if (isShortTerm) {
    // Navigate to Short-Term → Messages → auto-select thread
    var stTab = document.querySelector('.nav-tab[onclick*="Short-Term"], .nav-tab[onclick*="short-term"]');
    if (!stTab) {
      document.querySelectorAll('.nav-tab').forEach(function(t) {
        if (t.textContent.trim().indexOf('Short-Term') > -1) stTab = t;
      });
    }
    if (stTab) stTab.click();

    setTimeout(function() {
      document.querySelectorAll('.sub-tab').forEach(function(t) {
        if (t.textContent.trim() === 'Messages') t.click();
      });
      setTimeout(function() {
        if (allChannels && allChannels.length > 0) {
          var match = allChannels.find(function(ch) {
            return ch.guest_name && ch.guest_name.toLowerCase().replace(/[^a-z]/g, '') === normalName;
          });
          if (match) {
            currentChannelId = match.id;
            renderInbox();
          }
        }
      }, 150);
    }, 100);
    return;
  }

  // 2. Check if this is a long-term tenant (in INNAGO_TENANTS)
  var tenant = null;
  if (typeof INNAGO_TENANTS !== 'undefined') {
    tenant = INNAGO_TENANTS.find(function(t) {
      return t.name && t.name.toLowerCase().replace(/[^a-z]/g, '') === normalName;
    });
  }

  if (tenant) {
    // Open modal with full channel options for long-term tenant
    if (typeof openMsgModal === 'function') {
      openMsgModal(tenant.name, tenant.email || '', tenant.phone || '', '', 'mtm');
    }
    return;
  }

  // 3. Fallback: open modal with whatever info we have
  if (typeof openMsgModal === 'function') {
    openMsgModal(guestName, '', '', '', '');
  }
};
