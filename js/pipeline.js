/**
 * PIPELINE MODULE
 * Comprehensive booking pipeline, templates, pre-arrival forms, check-in/out instructions, and mailing rules
 * for Willow Property Manager
 *
 * Requires: global `sb` (Supabase client), `data` (units array), `propertiesData` (properties array)
 */
(function() {
'use strict';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters (use existing if available)
 */
function _pipelineEscapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Use the global escapeHtml if available (from inbox.js), otherwise use local version
var _escHtml = (typeof escapeHtml === 'function') ? escapeHtml : _pipelineEscapeHtml;

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Format date for display (e.g., "Apr 2, 2026")
 */
function formatDateDisplay(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    // Append T12:00:00 to date-only strings to avoid timezone shift
    if (date.length === 10) date = date + 'T12:00:00';
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Calculate days between two dates
 */
function daysBetween(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Days until a date from today
 */
function daysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Get initials from a name
 */
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Get avatar background color based on name (consistent hash)
 */
function getAvatarColor(name) {
  if (!name) return '#ccc';
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// ============================================================================
// STATE & SEED DATA
// ============================================================================

let pipelineState = {
  bookings: [],
  templates: [],
  mailingRules: [],
  unitInstructions: [],
  preArrivalForms: [],
  currentTab: 'pipeline',
  filters: {
    platform: null,
    dateRange: { start: null, end: null },
    search: '',
    stage: 'all'
  },
  selectedBooking: null,
  editingTemplate: null,
  editingRule: null,
  editingInstructions: null
};
// Expose pipelineState globally so app.js can read bookings for badges & popups
window.pipelineState = pipelineState;

/**
 * Default message templates
 */
const DEFAULT_TEMPLATES = [
  {
    id: 'tpl_booking_confirmation',
    name: 'Booking Confirmation',
    type: 'booking_confirmation',
    subject: 'Your booking is confirmed - {{listing_name}}',
    body: `Hi {{guest_name}},

Your booking for {{listing_name}} has been confirmed!

Check-in: {{check_in}}
Check-out: {{check_out}}
Duration: {{nights}} nights
Total: {{total_payout}}

Confirmation code: {{confirm_code}}

We'll send you check-in details 24 hours before arrival.

Looking forward to hosting you!`,
    isDefault: true
  },
  {
    id: 'tpl_pre_arrival',
    name: 'Pre-Arrival Instructions',
    type: 'pre_arrival',
    subject: 'Your check-in details for {{listing_name}}',
    body: `Hi {{guest_name}},

Welcome! Your check-in is tomorrow ({{check_in}}).

**CHECK-IN DETAILS**
Address: {{address}}
Door Code: {{door_code}}
WiFi: {{wifi_ssid}} / {{wifi_password}}

**PARKING**
{{parking_info}}

**HOUSE RULES**
- Check-in after 4 PM, check-out before 11 AM
- No smoking inside
- Respect quiet hours after 10 PM

Please complete this pre-arrival form: {{pre_arrival_form_link}}

Questions? Reply to this email.`,
    isDefault: true
  },
  {
    id: 'tpl_check_in_instructions',
    name: 'Check-In Instructions',
    type: 'check_in_instructions',
    subject: 'Check-in Instructions - {{unit_name}} at {{listing_name}}',
    body: `Welcome to {{unit_name}}!

**ARRIVAL**
Address: {{address}}
Phone: {{emergency_contact}}

**ENTRY**
Door code: {{door_code}}
(Keypad by main entrance)

**WIFI**
Network: {{wifi_ssid}}
Password: {{wifi_password}}

**PARKING**
{{parking_info}}

**APPLIANCES**
- Coffee maker in kitchen (filters in drawer)
- TV remotes on coffee table
- Thermostat set to {{thermostat_temp}}°

**EMERGENCY**
Police/Fire: 911
Property Manager: {{emergency_contact}}

Enjoy your stay!`,
    isDefault: true
  },
  {
    id: 'tpl_check_out_instructions',
    name: 'Check-Out Instructions',
    type: 'check_out_instructions',
    subject: 'Check-out Information - {{listing_name}}',
    body: `Hi {{guest_name}},

Thank you for staying with us! Check-out is tomorrow at 11 AM.

**CHECK-OUT STEPS**
1. Pack all belongings
2. Turn off lights
3. Lock all doors and windows
4. Door code will be deactivated at noon

**WHAT TO LEAVE**
- Keys on kitchen counter
- Trash and recycling in bins outside
- Dishes washed or loaded in dishwasher

**CONTACT**
Questions? Email us immediately.

We hope you enjoyed your stay!`,
    isDefault: true
  },
  {
    id: 'tpl_review_request',
    name: 'Review Request',
    type: 'review_request',
    subject: 'How was your stay at {{listing_name}}?',
    body: `Hi {{guest_name}},

Thank you for staying with us! We'd love to hear about your experience at {{listing_name}}.

Your feedback helps us improve. Please leave a review:
[Review Link]

Thanks!`,
    isDefault: true
  },
  {
    id: 'tpl_welcome',
    name: 'Welcome Message',
    type: 'welcome',
    subject: 'Welcome, {{guest_name}}!',
    body: `Hi {{guest_name}},

We're excited to welcome you to {{listing_name}}!

Your stay details:
- Check-in: {{check_in}}
- Check-out: {{check_out}}
- {{nights}} nights

We'll send detailed instructions 24 hours before check-in.

Questions before arrival? Reply to this email.`,
    isDefault: true
  },
  {
    id: 'tpl_extension_offer',
    name: 'Extension Offer',
    type: 'extension_offer',
    subject: 'Enjoying your stay at {{listing_name}}? Extend it!',
    body: `Hi {{guest_name}},

We hope you're enjoying your stay at {{listing_name}}!

Your check-out is in 2 days ({{check_out}}). If you'd like to extend your stay, we'd love to have you longer.

Just reply to this email or message us on the platform and we'll check availability and send you an updated quote.

Looking forward to hearing from you!`,
    isDefault: true
  }
];

/**
 * Default mailing rules
 */
const DEFAULT_MAILING_RULES = [
  {
    id: 'rule_pre_checkin',
    name: '24h before check-in',
    trigger: 'before_check_in',
    timing: { value: 24, unit: 'hours' },
    templateId: 'tpl_pre_arrival',
    conditions: { platformFilter: null, minNights: 0, propertyFilter: null },
    enabled: true
  },
  {
    id: 'rule_checkin_day',
    name: 'Day of check-in',
    trigger: 'after_check_in',
    timing: { value: 0, unit: 'hours' },
    templateId: 'tpl_check_in_instructions',
    conditions: { platformFilter: null, minNights: 0, propertyFilter: null },
    enabled: true
  },
  {
    id: 'rule_checkout_day',
    name: 'Day of check-out',
    trigger: 'before_check_out',
    timing: { value: 0, unit: 'hours' },
    templateId: 'tpl_check_out_instructions',
    conditions: { platformFilter: null, minNights: 0, propertyFilter: null },
    enabled: true
  },
  {
    id: 'rule_review_request',
    name: '1 day after check-out',
    trigger: 'after_check_out',
    timing: { value: 1, unit: 'days' },
    templateId: 'tpl_review_request',
    conditions: { platformFilter: null, minNights: 0, propertyFilter: null },
    enabled: true
  },
  {
    id: 'rule_extension_offer',
    name: '2 days before check-out — extension offer',
    trigger: 'before_check_out',
    timing: { value: 2, unit: 'days' },
    templateId: 'tpl_extension_offer',
    conditions: { platformFilter: null, minNights: 3, propertyFilter: null },
    enabled: true
  }
];

// ============================================================================
// SUPABASE OPERATIONS
// ============================================================================

/**
 * Initialize pipeline data from Supabase (with fallbacks)
 */
async function initializePipelineData() {
  try {
    // Try to load bookings from Supabase
    const { data: bookingsData, error: bookingsError } = await sb
      .from('bookings')
      .select('*')
      .order('check_in', { ascending: true });

    if (bookingsError) {
      console.warn('Could not load bookings from Supabase:', bookingsError.message);
      pipelineState.bookings = generateMockBookings();
    } else {
      pipelineState.bookings = bookingsData || [];
    }

    // Try to load templates
    const { data: templatesData, error: templatesError } = await sb
      .from('message_templates')
      .select('*');

    if (templatesError) {
      console.warn('Could not load templates:', templatesError.message);
      pipelineState.templates = [...DEFAULT_TEMPLATES];
    } else {
      pipelineState.templates = templatesData && templatesData.length > 0
        ? templatesData
        : [...DEFAULT_TEMPLATES];
    }

    // Try to load mailing rules
    const { data: rulesData, error: rulesError } = await sb
      .from('mailing_rules')
      .select('*');

    if (rulesError) {
      console.warn('Could not load mailing rules:', rulesError.message);
      pipelineState.mailingRules = [...DEFAULT_MAILING_RULES];
    } else {
      pipelineState.mailingRules = rulesData && rulesData.length > 0
        ? rulesData
        : [...DEFAULT_MAILING_RULES];
    }

    // Try to load unit instructions
    const { data: instructionsData, error: instructionsError } = await sb
      .from('unit_instructions')
      .select('*');

    if (instructionsError) {
      console.warn('Could not load unit instructions:', instructionsError.message);
      pipelineState.unitInstructions = [];
    } else {
      pipelineState.unitInstructions = instructionsData || [];
    }

    // Try to load pre-arrival forms
    const { data: formsData, error: formsError } = await sb
      .from('pre_arrival_forms')
      .select('*');

    if (formsError) {
      console.warn('Could not load pre-arrival forms:', formsError.message);
      pipelineState.preArrivalForms = [];
    } else {
      pipelineState.preArrivalForms = formsData || [];
    }

  } catch (error) {
    console.error('Error initializing pipeline data:', error);
    // Fallback to mock data
    pipelineState.bookings = generateMockBookings();
    pipelineState.templates = [...DEFAULT_TEMPLATES];
    pipelineState.mailingRules = [...DEFAULT_MAILING_RULES];
  }
}

/**
 * Save booking status update to Supabase
 */
async function updateBookingStatus(bookingId, newStatus) {
  try {
    const { error } = await sb
      .from('bookings')
      .update({ booking_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (error) throw error;

    // Update local state
    const booking = pipelineState.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.booking_status = newStatus;
      booking.updated_at = new Date().toISOString();
    }

    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
}

/**
 * Save template to Supabase
 */
async function saveTemplate(template) {
  try {
    if (template.id && !template.id.startsWith('tpl_booking') && !template.isDefault) {
      // Update existing
      const { error } = await sb
        .from('message_templates')
        .update(template)
        .eq('id', template.id);

      if (error) throw error;
    } else if (!template.id) {
      // Insert new
      const { data, error } = await sb
        .from('message_templates')
        .insert([template])
        .select();

      if (error) throw error;
      return data[0];
    }

    return template;
  } catch (error) {
    console.error('Error saving template:', error);
    return null;
  }
}

/**
 * Delete template from Supabase
 */
async function deleteTemplate(templateId) {
  try {
    const { error } = await sb
      .from('message_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;

    pipelineState.templates = pipelineState.templates.filter(t => t.id !== templateId);
    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
}

/**
 * Save mailing rule to Supabase
 */
async function saveMailingRule(rule) {
  try {
    if (rule.id && !rule.id.startsWith('rule_')) {
      // Update existing
      const { error } = await sb
        .from('mailing_rules')
        .update(rule)
        .eq('id', rule.id);

      if (error) throw error;
    } else if (!rule.id) {
      // Insert new
      const { data, error } = await sb
        .from('mailing_rules')
        .insert([rule])
        .select();

      if (error) throw error;
      return data[0];
    }

    return rule;
  } catch (error) {
    console.error('Error saving mailing rule:', error);
    return null;
  }
}

/**
 * Delete mailing rule from Supabase
 */
async function deleteMailingRule(ruleId) {
  try {
    const { error } = await sb
      .from('mailing_rules')
      .delete()
      .eq('id', ruleId);

    if (error) throw error;

    pipelineState.mailingRules = pipelineState.mailingRules.filter(r => r.id !== ruleId);
    return true;
  } catch (error) {
    console.error('Error deleting mailing rule:', error);
    return false;
  }
}

// ============================================================================
// MOCK DATA GENERATION
// ============================================================================

/**
 * Generate mock bookings for demo/fallback purposes
 */
function generateMockBookings() {
  const statuses = ['inquiry', 'pending', 'pre_approved', 'confirmed', 'currently_hosting', 'completed', 'canceled_by_guest'];
  const platforms = ['airbnb', 'vrbo', 'booking', 'direct', 'willowpa'];
  const guests = [
    { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567890' },
    { name: 'Michael Chen', email: 'michael@example.com', phone: '+1234567891' },
    { name: 'Emma Davis', email: 'emma@example.com', phone: '+1234567892' },
    { name: 'James Wilson', email: 'james@example.com', phone: '+1234567893' },
    { name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1234567894' }
  ];

  const bookings = [];
  const baseDate = new Date();

  for (let i = 0; i < 12; i++) {
    const status = statuses[i % statuses.length];
    const daysOffset = (i - 5) * 3;
    const checkIn = new Date(baseDate);
    checkIn.setDate(checkIn.getDate() + daysOffset);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + (2 + Math.random() * 5));

    const guest = guests[i % guests.length];
    const nights = daysBetween(checkIn, checkOut);
    const nightly = 150 + Math.random() * 200;
    const total = nightly * nights + 50 + Math.random() * 100;

    bookings.push({
      id: `booking_${i}`,
      platform: platforms[i % platforms.length],
      external_id: `ext_${i}`,
      listing_name: `Beautiful Downtown Loft #${i % 3 + 1}`,
      property_id: `prop_${i % 3}`,
      unit_name: `Unit ${String.fromCharCode(65 + i % 3)}`,
      guest_name: guest.name,
      guest_email: guest.email,
      guest_phone: guest.phone,
      check_in: formatDate(checkIn),
      check_out: formatDate(checkOut),
      nights: nights,
      guest_count: 2 + Math.floor(Math.random() * 4),
      adults: 2,
      children: Math.random() > 0.7 ? 1 : 0,
      infants: 0,
      pets: Math.random() > 0.8 ? 1 : 0,
      nightly_rate: Math.round(nightly),
      cleaning_fee: 50,
      service_fee: Math.round(total * 0.15),
      taxes: Math.round(total * 0.08),
      total_payout: Math.round(total),
      host_payout: Math.round(total * 0.8),
      currency: 'USD',
      booking_status: status,
      booked_at: formatDate(new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
      confirm_code: `CONFIRM${Math.random().toString(36).substring(7).toUpperCase()}`,
      notes: i % 3 === 0 ? 'Pet: 1 small dog' : '',
      created_at: formatDate(new Date()),
      updated_at: formatDate(new Date())
    });
  }

  return bookings;
}

// ============================================================================
// PIPELINE FILTERING & GROUPING
// ============================================================================

/**
 * Get booking status column name (for display)
 */
function getStatusColumnName(status) {
  const map = {
    'inquiry': 'Inquiry',
    'pending': 'Pending',
    'pre_approved': 'Pre-Approved',
    'pre_arrival': 'Pre-Arrival',
    'confirmed': 'Confirmed',
    'currently_hosting': 'Currently Hosting',
    'completed': 'Post-Stay',
    'canceled_by_guest': 'Canceled',
    'canceled_by_host': 'Canceled',
    'declined': 'Declined',
    'withdrawn': 'Withdrawn',
    'change_requested': 'Change Requested'
  };
  return map[status] || status;
}

/**
 * Determine column for a booking
 */
function getBookingColumn(booking) {
  const now = new Date();
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));

  if (booking.booking_status === 'currently_hosting') {
    return 'currently_hosting';
  }

  if (booking.booking_status === 'completed') {
    const daysAgoCheckOut = Math.ceil((now - checkOut) / (1000 * 60 * 60 * 24));
    if (daysAgoCheckOut <= 7) {
      return 'completed';
    }
  }

  // Return the booking's status for inquiry, pending, confirmed columns
  if (['inquiry', 'pending', 'pre_approved', 'confirmed'].includes(booking.booking_status)) {
    return booking.booking_status;
  }

  return booking.booking_status;
}

/**
 * Get platform color
 */
function getPlatformColor(platform) {
  const colors = {
    'airbnb': '#FF5A5F',
    'vrbo': '#3B5998',
    'booking': '#003580',
    'direct': '#4CAF50',
    'willowpa': '#7d5228'
  };
  return colors[platform] || '#999';
}

/**
 * Get platform display name
 */
function getPlatformName(platform) {
  const names = {
    'airbnb': 'Airbnb',
    'vrbo': 'VRBO',
    'booking': 'Booking',
    'direct': 'Direct',
    'willowpa': 'Willow'
  };
  return names[platform] || platform;
}

/**
 * Filter bookings based on current filter state
 */
function getFilteredBookings() {
  let filtered = pipelineState.bookings;

  // Platform filter
  if (pipelineState.filters.platform) {
    filtered = filtered.filter(b => b.platform === pipelineState.filters.platform);
  }

  // Search filter
  if (pipelineState.filters.search) {
    const search = pipelineState.filters.search.toLowerCase();
    filtered = filtered.filter(b =>
      (b.guest_name || '').toLowerCase().includes(search) ||
      (b.listing_name || '').toLowerCase().includes(search) ||
      (b.unit_name || '').toLowerCase().includes(search)
    );
  }

  // Date range filter
  if (pipelineState.filters.dateRange.start) {
    filtered = filtered.filter(b => new Date(b.check_in) >= new Date(pipelineState.filters.dateRange.start));
  }
  if (pipelineState.filters.dateRange.end) {
    filtered = filtered.filter(b => new Date(b.check_out) <= new Date(pipelineState.filters.dateRange.end));
  }

  // Stage filter (from clickable tabs)
  if (pipelineState.filters.stage && pipelineState.filters.stage !== 'all') {
    filtered = filtered.filter(b => getBookingPipelineStage(b) === pipelineState.filters.stage);
  }

  return filtered;
}

/**
 * Group filtered bookings by column
 */
function getBookingsByColumn() {
  const filtered = getFilteredBookings();
  const grouped = {
    'inquiry': [],
    'pending': [],
    'pre_approved': [],
    'confirmed': [],
    'currently_hosting': [],
    'completed': []
  };

  filtered.forEach(booking => {
    const column = getBookingColumn(booking);
    if (grouped.hasOwnProperty(column)) {
      grouped[column].push(booking);
    }
  });

  return grouped;
}

/**
 * Calculate pipeline statistics
 */
function getPipelineStats() {
  // Use ALL bookings (before stage filter) for the tab counts
  const allBookings = pipelineState.bookings;
  const stats = {
    total: allBookings.length,
    byStage: { currently_hosting: 0, booked: 0, inquiry: 0, completed: 0, canceled: 0 },
    totalRevenue: 0,
    completedRevenue: 0
  };

  allBookings.forEach(b => {
    const stage = getBookingPipelineStage(b);
    stats.byStage[stage] = (stats.byStage[stage] || 0) + 1;
    stats.totalRevenue += b.host_payout || 0;
    if (stage === 'completed') {
      stats.completedRevenue += b.host_payout || 0;
    }
  });

  // Keep byStatus for backward compat
  stats.byStatus = stats.byStage;
  return stats;
}

// ============================================================================
// RENDER: PIPELINE VIEW
// ============================================================================

/**
 * Status definitions with colors and icons for pipeline circles
 */
const PIPELINE_STATUSES = [
  { key: 'inquiry',            label: 'Inquiry',   color: '#e67e22', icon: '?' },
  { key: 'booked',             label: 'Booked',    color: '#27ae60', icon: '✓' },
  { key: 'currently_hosting',  label: 'Hosting',   color: '#2980b9', icon: '⌂' },
  { key: 'completed',          label: 'Past Stay', color: '#7d5228', icon: '★' },
  { key: 'canceled',           label: 'Cancel',    color: '#c0392b', icon: '✕' }
];

/**
 * Map booking status to pipeline circle index
 */
function getBookingPipelineStage(booking) {
  const s = booking.booking_status;
  // Canceled / declined always stay canceled
  if (['canceled_by_guest','canceled_by_host','declined','withdrawn'].includes(s)) return 'canceled';
  // Already manually marked completed
  if (s === 'completed') return 'completed';

  // ── Date-based auto-staging ──
  const today = new Date();
  today.setHours(0,0,0,0);
  const checkIn  = booking.check_in  ? new Date(booking.check_in)  : null;
  const checkOut = booking.check_out ? new Date(booking.check_out) : null;
  if (checkIn)  checkIn.setHours(0,0,0,0);
  if (checkOut) checkOut.setHours(0,0,0,0);

  // Checkout is in the past → completed (past stay)
  if (checkOut && checkOut < today) return 'completed';
  // Check-in has passed (or today) but checkout is still in the future → currently hosting
  if (checkIn && checkIn <= today && (!checkOut || checkOut >= today)) return 'currently_hosting';

  // Otherwise fall back to stored status
  if (s === 'currently_hosting') return 'currently_hosting';
  if (['confirmed','pre_approved','pending'].includes(s)) return 'booked';
  if (s === 'inquiry') return 'inquiry';
  return 'inquiry';
}

/**
 * Check if booking has payment missing (yellow indicator)
 */
function isPaymentMissing(booking) {
  const stage = getBookingPipelineStage(booking);
  if (stage !== 'currently_hosting') return false;
  const payout = booking.host_payout || booking.total_payout || 0;
  if (payout <= 0) return true;
  if (booking.payment_status === 'pending' || booking.payment_status === 'unpaid') return true;
  if (booking.balance_due && booking.balance_due > 0) return true;
  return false;
}

/**
 * Render status circle progression for a booking row
 */
function renderStatusCircles(booking) {
  const stage = getBookingPipelineStage(booking);
  const paymentMissing = isPaymentMissing(booking);
  const stageIdx = PIPELINE_STATUSES.findIndex(s => s.key === stage);

  return PIPELINE_STATUSES.map((s, i) => {
    const isActive = s.key === stage;
    const isPast = i < stageIdx && stage !== 'canceled';
    const isCanceled = stage === 'canceled' && s.key === 'canceled';

    let circleColor = '#d5d0c8';
    let textColor = '#b0a898';
    let fillOpacity = '0';
    let borderWidth = '2px';
    let innerContent = '';

    if (isActive || isCanceled) {
      circleColor = s.color;
      textColor = s.color;
      fillOpacity = '1';
      innerContent = `<span style="color:#fff;font-size:10px;font-weight:700;">${s.icon}</span>`;
      if (paymentMissing && s.key === 'currently_hosting') {
        circleColor = '#f1c40f';
        textColor = '#f1c40f';
      }
    } else if (isPast) {
      circleColor = '#27ae60';
      textColor = '#27ae60';
      fillOpacity = '1';
      innerContent = `<span style="color:#fff;font-size:10px;">✓</span>`;
    }

    // Connector line between circles
    const connector = i < PIPELINE_STATUSES.length - 1 ? `<div style="flex:1;height:2px;background:${isPast || isActive ? '#27ae60' : '#d5d0c8'};margin:0 -2px;"></div>` : '';

    return `
      <div style="display:flex;flex-direction:column;align-items:center;z-index:1;">
        <div style="
          width:28px;height:28px;border-radius:50%;
          border:${borderWidth} solid ${circleColor};
          background:${fillOpacity === '1' ? circleColor : 'transparent'};
          display:flex;align-items:center;justify-content:center;
          transition:all .2s;
        ">${innerContent}</div>
        <div style="font-size:8px;color:${textColor};margin-top:3px;font-weight:${isActive || isCanceled ? '700' : '400'};white-space:nowrap;text-transform:uppercase;letter-spacing:.5px;">${s.label}</div>
      </div>
      ${connector}
    `;
  }).join('');
}

/**
 * Status pill colors and labels
 */
const STAGE_PILL = {
  'currently_hosting': { bg: '#e8f4fd', color: '#2980b9', border: '#b3d9f2', label: 'Hosting' },
  'booked':            { bg: '#eafaf1', color: '#27ae60', border: '#a9dfbf', label: 'Booked' },
  'inquiry':           { bg: '#fef5e7', color: '#e67e22', border: '#f5cba7', label: 'Inquiry' },
  'completed':         { bg: '#f4f0eb', color: '#7d5228', border: '#d4c5b0', label: 'Past Stay' },
  'canceled':          { bg: '#fdedec', color: '#c0392b', border: '#f5b7b1', label: 'Canceled' }
};

/**
 * Render a single booking row — modern compact card
 */
function renderBookingCard(booking) {
  const platformColor = getPlatformColor(booking.platform);
  const platformName = getPlatformName(booking.platform);
  const paymentMissing = isPaymentMissing(booking);
  const stage = getBookingPipelineStage(booking);
  const pill = STAGE_PILL[stage] || STAGE_PILL['inquiry'];

  // Time label
  const daysUntilCI = daysUntil(booking.check_in);
  let timeLabel = '';
  let timeLabelColor = 'var(--text3)';
  if (stage === 'currently_hosting') {
    const daysLeft = daysUntil(booking.check_out);
    timeLabel = daysLeft <= 0 ? 'Check-out today' : daysLeft === 1 ? 'Check-out tomorrow' : `Check-out in ${daysLeft}d`;
    timeLabelColor = daysLeft <= 1 ? 'var(--red)' : 'var(--blue)';
  } else if (stage === 'booked' || stage === 'inquiry') {
    timeLabel = daysUntilCI <= 0 ? 'Check-in today' : daysUntilCI === 1 ? 'Tomorrow' : `In ${daysUntilCI}d`;
    timeLabelColor = daysUntilCI <= 1 ? 'var(--green)' : 'var(--text3)';
  } else if (stage === 'completed') {
    const daysAgo = Math.ceil((new Date() - new Date(booking.check_out)) / (1000*60*60*24));
    timeLabel = daysAgo <= 1 ? 'Yesterday' : `${daysAgo}d ago`;
  }

  // Contact info
  const email = booking.guest_email || '';
  const phone = booking.guest_phone || '';
  const contactBits = [];
  if (email) contactBits.push(`<a href="mailto:${_escHtml(email)}" onclick="event.stopPropagation()" style="color:var(--blue);text-decoration:none;font-size:11px;" title="${_escHtml(email)}">✉ Email</a>`);
  if (phone) contactBits.push(`<a href="tel:${_escHtml(phone)}" onclick="event.stopPropagation()" style="color:var(--blue);text-decoration:none;font-size:11px;" title="${_escHtml(phone)}">☎ ${_escHtml(phone)}</a>`);

  // Confirmation code
  const confCode = booking.confirm_code ? `<span style="font-size:10px;color:var(--text3);font-family:'DM Mono',monospace;">#${_escHtml(booking.confirm_code)}</span>` : '';

  // Badges
  const badges = typeof getPersonBadges === 'function' ? getPersonBadges(booking) : '';

  // Status change dropdown options
  const statusOptions = ['inquiry','booked','currently_hosting','completed','canceled'].map(s => {
    const p = STAGE_PILL[s] || {};
    const sel = s === stage ? ' selected' : '';
    return `<option value="${s}"${sel}>${p.label || s}</option>`;
  }).join('');

  return `
    <div class="pipeline-card" data-booking-id="${booking.id}" style="
      background:var(--surface);border-radius:10px;padding:12px 16px;margin-bottom:8px;
      border-left:4px solid ${paymentMissing ? '#f1c40f' : pill.color};
      cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04);
    " onmouseover="this.style.boxShadow='0 3px 12px rgba(0,0,0,.08)'"
       onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)'">

      <div style="display:flex;align-items:center;gap:12px;">
        <!-- Avatar -->
        <div style="
          width:38px;height:38px;border-radius:50%;flex-shrink:0;
          background:${getAvatarColor(booking.guest_name)};
          display:flex;align-items:center;justify-content:center;
          color:#fff;font-weight:700;font-size:13px;
        ">${_escHtml(getInitials(booking.guest_name))}</div>

        <!-- Left: Name + details -->
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <div class="person-name-wrap" data-booking-id="${booking.id}" onclick="showPersonSummary(this, event)" style="cursor:pointer;">
              <span class="person-name-text" style="font-weight:700;font-size:13px;color:var(--text);">${_escHtml(booking.guest_name)}</span>
            </div>
            <!-- Status pill -->
            <span style="font-size:10px;padding:2px 10px;border-radius:10px;font-weight:600;
              background:${pill.bg};color:${pill.color};border:1px solid ${pill.border};white-space:nowrap;">
              ${pill.label}
            </span>
            <!-- Platform -->
            <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:var(--surface2);color:${platformColor};font-weight:500;white-space:nowrap;">
              ${_escHtml(platformName)}
            </span>
            ${paymentMissing ? '<span style="font-size:9px;padding:2px 8px;border-radius:10px;background:#fef9e7;color:#e67e22;font-weight:700;white-space:nowrap;border:1px solid #f5cba7;">⚠ Payment</span>' : ''}
            ${confCode}
          </div>

          <!-- Second row: dates + unit + badges -->
          <div style="display:flex;align-items:center;gap:8px;margin-top:4px;flex-wrap:wrap;">
            <span style="font-size:11px;color:var(--text3);">
              ${formatDateDisplay(booking.check_in)} → ${formatDateDisplay(booking.check_out)} · ${booking.nights || ''}n
            </span>
            ${booking.unit_name ? `<span style="font-size:11px;color:var(--text2);font-weight:500;">📍 ${_escHtml(booking.unit_name)}</span>` : ''}
            ${badges ? `<span class="person-badges">${badges}</span>` : ''}
          </div>

          <!-- Third row: contact links -->
          ${contactBits.length ? `<div style="display:flex;gap:10px;margin-top:3px;">${contactBits.join('')}</div>` : ''}
        </div>

        <!-- Right side: time label + amount + status change -->
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
          ${timeLabel ? `<span style="font-size:10px;color:${timeLabelColor};font-weight:600;white-space:nowrap;">${timeLabel}</span>` : ''}
          <div style="
            font-weight:700;font-size:15px;
            color:${paymentMissing ? '#e67e22' : pill.color};
          ">${formatCurrency(booking.host_payout || booking.total_payout, booking.currency)}</div>
          <select class="pipeline-status-change" data-booking-id="${booking.id}" onclick="event.stopPropagation()" onchange="handlePipelineStatusChange(this)" style="
            font-size:10px;padding:2px 4px;border:1px solid var(--border);border-radius:4px;
            background:var(--bg);color:var(--text2);cursor:pointer;font-family:inherit;
          ">${statusOptions}</select>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render pipeline main view — Hostfully-style list with status circles
 */
function renderPipelineMain() {
  const stats = getPipelineStats();
  const filteredBookings = getFilteredBookings();

  // Sort: currently_hosting first, then by check_in date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const aStage = getBookingPipelineStage(a);
    const bStage = getBookingPipelineStage(b);
    const order = { 'currently_hosting': 0, 'booked': 1, 'inquiry': 2, 'completed': 3, 'canceled': 4 };
    if (order[aStage] !== order[bStage]) return (order[aStage] ?? 9) - (order[bStage] ?? 9);
    return new Date(a.check_in) - new Date(b.check_in);
  });

  const bookingRows = sortedBookings.map(b => renderBookingCard(b)).join('');
  const activeStage = pipelineState.filters.stage || 'all';

  // Build filter tabs
  const tabs = [
    { key: 'all',               label: 'All',       count: stats.total,                            color: 'var(--accent)' },
    { key: 'currently_hosting', label: 'Hosting',    count: stats.byStage['currently_hosting'] || 0, color: '#2980b9' },
    { key: 'booked',            label: 'Booked',     count: stats.byStage['booked'] || 0,           color: '#27ae60' },
    { key: 'inquiry',           label: 'Inquiry',    count: stats.byStage['inquiry'] || 0,          color: '#e67e22' },
    { key: 'completed',         label: 'Past Stay',  count: stats.byStage['completed'] || 0,        color: '#7d5228' },
    { key: 'canceled',          label: 'Canceled',   count: stats.byStage['canceled'] || 0,         color: '#c0392b' }
  ];
  const tabsHtml = tabs.map(t => {
    const isActive = t.key === activeStage;
    return `<button class="pipeline-stage-tab" data-stage="${t.key}" style="
      padding:8px 16px;border-radius:8px;border:1px solid ${isActive ? t.color : 'var(--border)'};
      background:${isActive ? t.color + '15' : 'var(--surface)'};
      color:${isActive ? t.color : 'var(--text2)'};font-weight:${isActive ? '700' : '500'};
      font-size:12px;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;
    ">${t.label} <span style="font-size:10px;opacity:.7;">${t.count}</span></button>`;
  }).join('');

  return `
    <div style="padding:20px;">
      <!-- REVENUE SUMMARY -->
      <div style="display:flex;gap:12px;margin-bottom:16px;align-items:center;">
        <div style="font-size:13px;color:var(--text3);">
          Revenue: <strong style="color:var(--green);font-size:15px;">${formatCurrency(stats.totalRevenue)}</strong>
        </div>
      </div>

      <!-- FILTER TABS -->
      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;" id="pipeline-stage-tabs">
        ${tabsHtml}
      </div>

      <!-- SEARCH + PLATFORM -->
      <div style="
        display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;
      ">
        <input type="text" id="pipeline-search" placeholder="Search guest, unit, or listing..." style="
          flex:1;min-width:200px;padding:8px 12px;border:1px solid var(--border);
          border-radius:6px;font-family:inherit;font-size:13px;background:var(--surface);color:var(--text);box-sizing:border-box;
        " value="${_escHtml(pipelineState.filters.search)}">

        <select id="pipeline-platform" style="
          padding:8px 12px;border:1px solid var(--border);border-radius:6px;
          font-family:inherit;font-size:13px;background:var(--surface);color:var(--text);
        ">
          <option value="">All Platforms</option>
          <option value="airbnb" ${pipelineState.filters.platform === 'airbnb' ? 'selected' : ''}>Airbnb</option>
          <option value="vrbo" ${pipelineState.filters.platform === 'vrbo' ? 'selected' : ''}>VRBO</option>
          <option value="booking" ${pipelineState.filters.platform === 'booking' ? 'selected' : ''}>Booking.com</option>
          <option value="direct" ${pipelineState.filters.platform === 'direct' ? 'selected' : ''}>Direct</option>
          <option value="willowpa" ${pipelineState.filters.platform === 'willowpa' ? 'selected' : ''}>Willow</option>
        </select>

        <button id="pipeline-clear-filters" style="
          padding:8px 12px;background:var(--surface2);border:1px solid var(--border);
          border-radius:6px;cursor:pointer;font-size:13px;color:var(--text2);transition:all .15s;font-family:inherit;
        ">Clear</button>
      </div>

      <!-- BOOKING LIST -->
      <div id="pipeline-booking-list">
        ${bookingRows || '<div style="text-align:center;padding:40px;color:var(--text3);font-size:13px;">No bookings found</div>'}
      </div>
    </div>
  `;
}

// ============================================================================
// RENDER: BOOKING DETAIL SLIDEOUT
// ============================================================================

/**
 * Render booking detail slideout
 */
function renderBookingDetail(booking) {
  if (!booking) return '';

  const platformColor = getPlatformColor(booking.platform);
  const platformName = getPlatformName(booking.platform);
  const daysUntilCheckIn = daysUntil(booking.check_in);
  const isUpcoming = daysUntilCheckIn >= 0 && daysUntilCheckIn <= 3;

  return `
    <div style="
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      width: 420px;
      background: var(--surface);
      box-shadow: -4px 0 12px rgba(0,0,0,0.15);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      animation: slideInRight 0.3s ease;
    ">
      <style>
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .bd-tab { padding:8px 16px; border:none; background:none; cursor:pointer; font-size:13px; font-weight:500; color:var(--text2); border-bottom:2px solid transparent; font-family:inherit; }
        .bd-tab.active { color:var(--accent); border-bottom-color:var(--accent); }
        .bd-tab-content { display:none; }
        .bd-tab-content.active { display:block; }
        .form-status-badge { display:inline-block; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600; text-transform:capitalize; }
        .form-status-badge.pending { background:#fef3cd; color:#856404; }
        .form-status-badge.submitted { background:#cce5ff; color:#004085; }
        .form-status-badge.approved { background:#d4edda; color:#155724; }
        .form-status-badge.rejected { background:#f8d7da; color:#721c24; }
        .form-action-btn { padding:6px 14px; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; font-family:inherit; }
        .form-action-btn.approve { background:#28a745; color:white; }
        .form-action-btn.reject { background:#dc3545; color:white; }
        .form-action-btn.resubmit { background:#ffc107; color:#333; }
      </style>

      <!-- Header -->
      <div style="
        padding: 16px 20px 0;
        border-bottom: 1px solid #e0ddd5;
      ">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h2 style="margin: 0; font-size: 18px; color: var(--text);">${_escHtml(booking.guest_name)}</h2>
          <button id="close-booking-detail" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text2);
            padding: 0;
            width: 30px;
            height: 30px;
          ">×</button>
        </div>
        <div style="font-size:12px; color:var(--text2); line-height:1.6; margin-bottom:10px;">
          <span>📧 <a href="mailto:${_escHtml(booking.guest_email)}" style="color:var(--accent);text-decoration:none;">${_escHtml(booking.guest_email)}</a></span>
          <span style="margin-left:12px;">📱 ${_escHtml(booking.guest_phone)}</span>
        </div>
        <div style="display:flex; gap:0;">
          <button class="bd-tab active" data-bd-tab="details">Details</button>
          <button class="bd-tab" data-bd-tab="forms">Forms</button>
        </div>
      </div>

      <!-- Tab: Details -->
      <div class="bd-tab-content active" data-bd-panel="details" style="flex:1; overflow-y:auto; padding:20px;">
        <!-- Guest Info -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
            <div style="
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: ${getAvatarColor(booking.guest_name)};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 16px;
            ">${_escHtml(getInitials(booking.guest_name))}</div>
            <div>
              <div style="font-weight: 600; color: var(--text); font-size: 16px;">${_escHtml(booking.guest_name)}</div>
              <div style="display:flex;gap:4px;margin-top:3px;">${typeof getPersonBadges === 'function' ? getPersonBadges(booking) : ''}</div>
              <div style="font-size: 12px; color: var(--text2);">${booking.guest_count} guest${booking.guest_count !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: var(--text2); line-height: 1.6;">
            <div>📧 <a href="mailto:${_escHtml(booking.guest_email)}" style="color: var(--accent); text-decoration: none;">${_escHtml(booking.guest_email)}</a></div>
            <div>📱 ${_escHtml(booking.guest_phone)}</div>
          </div>
        </div>

        <!-- Forms Status Summary -->
        <div id="forms-status-summary" style="
          background: var(--surface2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: none;
        ">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">FORMS STATUS</div>
          <div id="forms-status-content" style="font-size: 12px; color: var(--text2); line-height: 1.8;"></div>
        </div>

        <!-- Booking Info -->
        <div style="
          background: var(--surface2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">BOOKING INFO</div>
          <div style="font-size: 12px; color: var(--text2); line-height: 1.8;">
            <div><strong>Confirmation:</strong> ${_escHtml(booking.confirm_code)}</div>
            <div><strong>Platform:</strong> <span style="display: inline-block; background: ${platformColor}20; color: ${platformColor}; padding: 2px 6px; border-radius: 4px; font-weight: 500;">${_escHtml(platformName)}</span></div>
            <div><strong>External ID:</strong> ${_escHtml(booking.external_id)}</div>
            <div><strong>Status:</strong> <span style="text-transform: capitalize;">${booking.booking_status}</span></div>
          </div>
        </div>

        <!-- Dates -->
        <div style="
          background: var(--surface2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">STAY DATES</div>
          <div style="font-size: 12px; color: var(--text2); line-height: 1.8;">
            <div><strong>Check-in:</strong> ${formatDateDisplay(booking.check_in)} ${isUpcoming && daysUntilCheckIn === 0 ? '🔔 TODAY' : isUpcoming ? `🔔 in ${daysUntilCheckIn} days` : ''}</div>
            <div><strong>Check-out:</strong> ${formatDateDisplay(booking.check_out)}</div>
            <div><strong>Duration:</strong> ${booking.nights} night${booking.nights !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <!-- Property Info -->
        <div style="
          background: var(--surface2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">PROPERTY</div>
          <div style="font-size: 12px; color: var(--text2); line-height: 1.8;">
            <div><strong>Listing:</strong> ${_escHtml(booking.listing_name)}</div>
            <div><strong>Unit:</strong> ${_escHtml(booking.unit_name)}</div>
          </div>
        </div>

        <!-- Guests Info -->
        <div style="
          background: var(--surface2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">GUEST COMPOSITION</div>
          <div style="font-size: 12px; color: var(--text2); line-height: 1.8;">
            <div>👥 Adults: ${booking.adults}</div>
            <div>👧 Children: ${booking.children}</div>
            <div>👶 Infants: ${booking.infants}</div>
            ${booking.pets ? `<div>🐕 Pets: ${booking.pets}</div>` : ''}
          </div>
        </div>

        <!-- Financial -->
        <div style="
          background: var(--surface2);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">FINANCIAL</div>
          <div style="font-size: 12px; color: var(--text2); line-height: 1.8;">
            <div>Nightly: ${formatCurrency(booking.nightly_rate, booking.currency)}</div>
            <div>Cleaning: ${formatCurrency(booking.cleaning_fee, booking.currency)}</div>
            <div>Service fee: ${formatCurrency(booking.service_fee, booking.currency)}</div>
            <div>Taxes: ${formatCurrency(booking.taxes, booking.currency)}</div>
            <div style="border-top: 1px solid #d0ccc5; padding-top: 8px; margin-top: 8px;">
              <strong>Total Guest Pays:</strong> ${formatCurrency(booking.total_payout, booking.currency)}
            </div>
            <div>
              <strong>Host Payout:</strong> ${formatCurrency(booking.host_payout, booking.currency)}
            </div>
          </div>
        </div>

        <!-- Notes -->
        ${booking.notes ? `
          <div style="
            background: var(--surface2);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
          ">
            <div style="font-weight: 600; color: var(--text); margin-bottom: 10px; font-size: 13px;">NOTES</div>
            <div style="font-size: 12px; color: var(--text2);">${_escHtml(booking.notes)}</div>
          </div>
        ` : ''}
      </div>

      <!-- Tab: Forms -->
      <div class="bd-tab-content" data-bd-panel="forms" style="flex:1; overflow-y:auto; padding:20px;">
        <div id="bd-forms-loading" style="text-align:center; padding:40px; color:var(--text2);">Loading forms...</div>
        <div id="bd-forms-content" style="display:none;"></div>
        <div id="bd-forms-empty" style="display:none; text-align:center; padding:40px;">
          <div style="font-size:40px; margin-bottom:12px;">📋</div>
          <h3 style="color:var(--text); margin:0 0 6px;">No Forms Submitted</h3>
          <p style="color:var(--text2); font-size:13px;">Guest hasn't submitted any forms yet.</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div style="
        padding: 12px 20px;
        border-top: 1px solid #e0ddd5;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      ">
        <select id="detail-status-select" style="
          padding: 8px 12px;
          border: 1px solid #e0ddd5;
          border-radius: 6px;
          font-family: inherit;
          font-size: 12px;
          flex: 1;
        ">
          <option value="inquiry" ${booking.booking_status === 'inquiry' ? 'selected' : ''}>Inquiry</option>
          <option value="pending" ${booking.booking_status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="pre_approved" ${booking.booking_status === 'pre_approved' ? 'selected' : ''}>Pre-Approved</option>
          <option value="confirmed" ${booking.booking_status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="currently_hosting" ${booking.booking_status === 'currently_hosting' ? 'selected' : ''}>Currently Hosting</option>
          <option value="completed" ${booking.booking_status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="canceled_by_guest" ${booking.booking_status === 'canceled_by_guest' ? 'selected' : ''}>Canceled by Guest</option>
        </select>
        <button id="detail-update-status" style="
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        ">Update</button>
      </div>
    </div>
  `;
}

// ============================================================================
// GUEST FORMS — fetch, render, approve/reject/resubmit
// ============================================================================

async function loadGuestForms(booking) {
  const el = document.getElementById('bd-forms-content');
  const loading = document.getElementById('bd-forms-loading');
  const empty = document.getElementById('bd-forms-empty');
  if (!el || !booking) return;

  try {
    // Try matching by unit_apt first, then by guest name as fallback
    const unitKey = booking.unit_apt || booking.unit_name || '';
    let data = null, error = null;

    if (unitKey && unitKey !== 'unit') {
      const res = await sb
        .from('guest_forms')
        .select('*')
        .eq('unit', unitKey)
        .order('created_at', { ascending: false })
        .limit(1);
      data = res.data;
      error = res.error;
    }

    // Fallback: match by guest first+last name
    if ((!data || data.length === 0) && booking.guest_name) {
      const parts = booking.guest_name.trim().split(/\s+/);
      const first = parts[0] || '';
      const last = parts.slice(1).join(' ') || '';
      if (first) {
        const res2 = await sb
          .from('guest_forms')
          .select('*')
          .ilike('guest_first', first)
          .ilike('guest_last', last || '%')
          .order('created_at', { ascending: false })
          .limit(1);
        if (!res2.error && res2.data && res2.data.length > 0) {
          data = res2.data;
          error = null;
        }
      }
    }

    if (loading) loading.style.display = 'none';

    if (error || !data || data.length === 0) {
      if (empty) empty.style.display = 'block';
      updateFormsSummary(null);
      return;
    }

    const form = data[0];
    el.style.display = 'block';
    el.innerHTML = renderGuestFormDetail(form);
    updateFormsSummary(form);

    // Attach action button listeners
    el.querySelectorAll('[data-form-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.formAction;
        const formId = btn.dataset.formId;
        handleFormAction(formId, action);
      });
    });
  } catch (e) {
    if (loading) loading.style.display = 'none';
    if (empty) { empty.style.display = 'block'; empty.querySelector('p').textContent = 'Error loading forms.'; }
  }
}

function renderGuestFormDetail(f) {
  const statusBadge = (s) => `<span class="form-status-badge ${s || 'pending'}">${s || 'pending'}</span>`;

  let html = '';

  // Pre-Arrival Form
  html += `<div style="background:var(--surface2); padding:14px; border-radius:8px; margin-bottom:16px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="font-weight:600; color:var(--text); font-size:13px;">PRE-ARRIVAL FORM</div>
      ${statusBadge(f.pre_arrival_status)}
    </div>`;

  if (f.pre_arrival_status !== 'pending') {
    html += `<div style="font-size:12px; color:var(--text2); line-height:2;">
      <div><strong>Name:</strong> ${_escHtml((f.guest_first || '') + ' ' + (f.guest_last || ''))}</div>
      <div><strong>Email:</strong> ${_escHtml(f.guest_email || '—')}</div>
      <div><strong>Phone:</strong> ${_escHtml(f.guest_phone || '—')}</div>
      <div><strong>Guests:</strong> ${f.num_guests || 1}</div>
      <div><strong>Vehicle:</strong> ${_escHtml(f.vehicle_info || '—')}</div>
    </div>`;
  } else {
    html += `<div style="font-size:12px; color:var(--text2);">Not submitted yet.</div>`;
  }

  // Action buttons for pre-arrival
  if (f.pre_arrival_status === 'submitted') {
    html += `<div style="display:flex; gap:6px; margin-top:10px;">
      <button class="form-action-btn approve" data-form-action="approve-pre-arrival" data-form-id="${f.id}">Approve</button>
      <button class="form-action-btn reject" data-form-action="reject-pre-arrival" data-form-id="${f.id}">Reject</button>
      <button class="form-action-btn resubmit" data-form-action="resubmit-pre-arrival" data-form-id="${f.id}">Request Resubmit</button>
    </div>`;
  }
  html += `</div>`;

  // Government ID
  html += `<div style="background:var(--surface2); padding:14px; border-radius:8px; margin-bottom:16px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="font-weight:600; color:var(--text); font-size:13px;">GOVERNMENT ID</div>
      ${statusBadge(f.id_status)}
    </div>`;

  if (f.id_file_path) {
    html += `<div style="font-size:12px; color:var(--text2); line-height:2;">
      <div><strong>File:</strong> ${_escHtml(f.id_file_name || 'Uploaded')}</div>
      <div><a href="${_escHtml(f.id_file_path)}" target="_blank" style="color:var(--accent);">View ID Image</a></div>
    </div>`;
    if (f.id_status === 'submitted') {
      html += `<div style="display:flex; gap:6px; margin-top:10px;">
        <button class="form-action-btn approve" data-form-action="approve-id" data-form-id="${f.id}">Approve</button>
        <button class="form-action-btn reject" data-form-action="reject-id" data-form-id="${f.id}">Reject</button>
        <button class="form-action-btn resubmit" data-form-action="resubmit-id" data-form-id="${f.id}">Request Resubmit</button>
      </div>`;
    }
  } else {
    html += `<div style="font-size:12px; color:var(--text2);">Not uploaded yet.</div>`;
  }
  html += `</div>`;

  // Rental Agreement
  html += `<div style="background:var(--surface2); padding:14px; border-radius:8px; margin-bottom:16px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="font-weight:600; color:var(--text); font-size:13px;">RENTAL AGREEMENT</div>
      ${statusBadge(f.agreement_status)}
    </div>`;

  if (f.agreement_accepted) {
    html += `<div style="font-size:12px; color:var(--text2); line-height:2;">
      <div><strong>Accepted:</strong> ${f.agreement_accepted_at ? new Date(f.agreement_accepted_at).toLocaleString() : 'Yes'}</div>
      <div><strong>IP:</strong> ${_escHtml(f.agreement_ip || '—')}</div>
    </div>`;
    if (f.agreement_status === 'submitted') {
      html += `<div style="display:flex; gap:6px; margin-top:10px;">
        <button class="form-action-btn approve" data-form-action="approve-agreement" data-form-id="${f.id}">Approve</button>
        <button class="form-action-btn reject" data-form-action="reject-agreement" data-form-id="${f.id}">Reject</button>
        <button class="form-action-btn resubmit" data-form-action="resubmit-agreement" data-form-id="${f.id}">Request Resubmit</button>
      </div>`;
    }
  } else {
    html += `<div style="font-size:12px; color:var(--text2);">Not accepted yet.</div>`;
  }
  html += `</div>`;

  // Overall status + approve all / reject all
  html += `<div style="background:var(--surface2); padding:14px; border-radius:8px; margin-bottom:16px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <div style="font-weight:600; color:var(--text); font-size:13px;">OVERALL</div>
      ${statusBadge(f.overall_status)}
    </div>
    <div style="display:flex; gap:6px; margin-top:10px;">
      <button class="form-action-btn approve" data-form-action="approve-all" data-form-id="${f.id}">Approve All</button>
      <button class="form-action-btn reject" data-form-action="reject-all" data-form-id="${f.id}">Reject All</button>
      <button class="form-action-btn resubmit" data-form-action="resubmit-all" data-form-id="${f.id}">Resubmit All</button>
    </div>
  </div>`;

  // Admin notes
  html += `<div style="background:var(--surface2); padding:14px; border-radius:8px;">
    <div style="font-weight:600; color:var(--text); margin-bottom:8px; font-size:13px;">ADMIN NOTES</div>
    <textarea id="form-admin-notes" style="width:100%;min-height:60px;border:1px solid #e0ddd5;border-radius:6px;padding:8px;font-size:12px;font-family:inherit;resize:vertical;">${_escHtml(f.admin_notes || '')}</textarea>
    <button class="form-action-btn" data-form-action="save-notes" data-form-id="${f.id}" style="background:var(--accent);color:white;margin-top:8px;">Save Notes</button>
  </div>`;

  return html;
}

function updateFormsSummary(form) {
  const wrap = document.getElementById('forms-status-summary');
  const content = document.getElementById('forms-status-content');
  if (!wrap || !content) return;

  if (!form) { wrap.style.display = 'none'; return; }

  const dot = (status) => {
    const colors = { pending:'#ffc107', submitted:'#17a2b8', approved:'#28a745', rejected:'#dc3545' };
    return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${colors[status] || colors.pending};margin-right:6px;"></span>`;
  };

  wrap.style.display = 'block';
  content.innerHTML = `
    <div>${dot(form.pre_arrival_status)}Pre-Arrival: <span style="text-transform:capitalize;">${form.pre_arrival_status || 'pending'}</span></div>
    <div>${dot(form.id_status)}Government ID: <span style="text-transform:capitalize;">${form.id_status || 'pending'}</span></div>
    <div>${dot(form.agreement_status)}Agreement: <span style="text-transform:capitalize;">${form.agreement_status || 'pending'}</span></div>
  `;
}

async function handleFormAction(formId, action) {
  if (!formId || !action) return;

  let updateData = {};
  const now = new Date().toISOString();

  switch (action) {
    case 'approve-pre-arrival': updateData = { pre_arrival_status: 'approved', updated_at: now }; break;
    case 'reject-pre-arrival':  updateData = { pre_arrival_status: 'rejected', updated_at: now }; break;
    case 'resubmit-pre-arrival': updateData = { pre_arrival_status: 'pending', updated_at: now }; break;
    case 'approve-id':          updateData = { id_status: 'approved', updated_at: now }; break;
    case 'reject-id':           updateData = { id_status: 'rejected', updated_at: now }; break;
    case 'resubmit-id':         updateData = { id_status: 'pending', id_file_path: null, id_file_name: null, updated_at: now }; break;
    case 'approve-agreement':   updateData = { agreement_status: 'approved', updated_at: now }; break;
    case 'reject-agreement':    updateData = { agreement_status: 'rejected', updated_at: now }; break;
    case 'resubmit-agreement':  updateData = { agreement_status: 'pending', agreement_accepted: false, agreement_accepted_at: null, updated_at: now }; break;
    case 'approve-all':
      updateData = { pre_arrival_status:'approved', id_status:'approved', agreement_status:'approved', overall_status:'approved', updated_at: now };
      break;
    case 'reject-all':
      updateData = { pre_arrival_status:'rejected', id_status:'rejected', agreement_status:'rejected', overall_status:'rejected', updated_at: now };
      break;
    case 'resubmit-all':
      updateData = { pre_arrival_status:'pending', id_status:'pending', agreement_status:'pending', overall_status:'pending',
                     id_file_path:null, id_file_name:null, agreement_accepted:false, agreement_accepted_at:null, updated_at: now };
      break;
    case 'save-notes':
      const notes = document.getElementById('form-admin-notes');
      updateData = { admin_notes: notes ? notes.value : '', updated_at: now };
      break;
    default: return;
  }

  // If approving individual items, check if all are now approved to update overall
  if (action.startsWith('approve-') && action !== 'approve-all') {
    // We'll recalculate overall after the update
  }

  const { error } = await sb.from('guest_forms').update(updateData).eq('id', formId);

  if (error) {
    alert('Error updating form: ' + error.message);
    return;
  }

  // Recalculate overall status for individual actions
  if (action !== 'approve-all' && action !== 'reject-all' && action !== 'resubmit-all' && action !== 'save-notes') {
    const { data } = await sb.from('guest_forms').select('pre_arrival_status,id_status,agreement_status').eq('id', formId).single();
    if (data) {
      const statuses = [data.pre_arrival_status, data.id_status, data.agreement_status];
      let overall = 'pending';
      if (statuses.every(s => s === 'approved')) overall = 'approved';
      else if (statuses.some(s => s === 'rejected')) overall = 'rejected';
      else if (statuses.some(s => s === 'submitted')) overall = 'submitted';
      await sb.from('guest_forms').update({ overall_status: overall, updated_at: now }).eq('id', formId);
    }
  }

  // Reload the forms tab
  if (pipelineState.selectedBooking) {
    loadGuestForms(pipelineState.selectedBooking);
  }
}

// ============================================================================
// RENDER: TEMPLATES
// ============================================================================

/**
 * Render template card
 */
function renderTemplateCard(template) {
  const typeColors = {
    'booking_confirmation': '#FF6B6B',
    'pre_arrival': '#4ECDC4',
    'check_in_instructions': '#45B7D1',
    'check_out_instructions': '#FFA07A',
    'welcome': '#98D8C8',
    'review_request': '#F7DC6F',
    'extension_offer': '#BB8FCE',
    'custom': '#85C1E2'
  };

  const color = typeColors[template.type] || '#999';

  return `
    <div class="template-card" style="
      background: var(--surface);
      border-radius: 12px;
      padding: 16px;
      border-left: 4px solid ${color};
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    ">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
        <div>
          <div style="font-weight: 600; color: var(--text); font-size: 14px;">
            ${_escHtml(template.name)}
          </div>
          <div style="font-size: 11px; color: var(--text3); margin-top: 4px; text-transform: capitalize;">
            ${template.type.replace(/_/g, ' ')}
            ${template.isDefault ? ' • Default' : ''}
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="edit-template-btn" data-template-id="${template.id}" style="
            background: none;
            border: none;
            color: var(--accent);
            cursor: pointer;
            font-size: 14px;
            padding: 4px;
          ">✎</button>
          ${!template.isDefault ? `
            <button class="delete-template-btn" data-template-id="${template.id}" style="
              background: none;
              border: none;
              color: var(--red);
              cursor: pointer;
              font-size: 14px;
              padding: 4px;
            ">×</button>
          ` : ''}
        </div>
      </div>
      <div style="font-size: 12px; color: var(--text2); line-height: 1.5;">
        <div><strong>Subject:</strong> ${_escHtml(template.subject)}</div>
        <div style="margin-top: 8px; color: var(--text3); max-height: 60px; overflow: hidden; text-overflow: ellipsis;">
          ${_escHtml(template.body.substring(0, 150))}...
        </div>
      </div>
    </div>
  `;
}

/**
 * Render template editor modal
 */
function renderTemplateEditor(template = null) {
  const isNew = !template;
  const id = template?.id || '';
  const name = template?.name || '';
  const type = template?.type || 'custom';
  const subject = template?.subject || '';
  const body = template?.body || '';

  const mergeTags = [
    '{{guest_name}}',
    '{{listing_name}}',
    '{{unit_name}}',
    '{{check_in}}',
    '{{check_out}}',
    '{{nights}}',
    '{{total_payout}}',
    '{{confirm_code}}',
    '{{address}}',
    '{{door_code}}',
    '{{wifi_ssid}}',
    '{{wifi_password}}',
    '{{parking_info}}',
    '{{emergency_contact}}',
    '{{thermostat_temp}}',
    '{{pre_arrival_form_link}}'
  ];

  return `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    ">
      <div style="
        background: var(--surface);
        border-radius: 16px;
        padding: 24px;
        max-width: 700px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; color: var(--text);">${isNew ? 'New Template' : 'Edit Template'}</h2>
          <button id="close-template-editor" style="
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: var(--text2);
            padding: 0;
            width: 32px;
            height: 32px;
          ">×</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Name -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Template Name</label>
            <input id="template-name" type="text" value="${_escHtml(name)}" placeholder="e.g., Booking Confirmation" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 13px;
              box-sizing: border-box;
            ">
          </div>

          <!-- Type -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Template Type</label>
            <select id="template-type" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 13px;
            ">
              <option value="booking_confirmation" ${type === 'booking_confirmation' ? 'selected' : ''}>Booking Confirmation</option>
              <option value="pre_arrival" ${type === 'pre_arrival' ? 'selected' : ''}>Pre-Arrival Instructions</option>
              <option value="check_in_instructions" ${type === 'check_in_instructions' ? 'selected' : ''}>Check-In Instructions</option>
              <option value="check_out_instructions" ${type === 'check_out_instructions' ? 'selected' : ''}>Check-Out Instructions</option>
              <option value="welcome" ${type === 'welcome' ? 'selected' : ''}>Welcome Message</option>
              <option value="review_request" ${type === 'review_request' ? 'selected' : ''}>Review Request</option>
              <option value="extension_offer" ${type === 'extension_offer' ? 'selected' : ''}>Extension Offer</option>
              <option value="custom" ${type === 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Email Subject</label>
            <input id="template-subject" type="text" value="${_escHtml(subject)}" placeholder="Email subject line" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 13px;
              box-sizing: border-box;
            ">
          </div>

          <!-- Merge Tags Help -->
          <div style="background: var(--accent-bg); padding: 12px; border-radius: 6px;">
            <div style="font-weight: 600; color: var(--text); margin-bottom: 8px; font-size: 12px;">Available Merge Tags</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 11px;">
              ${mergeTags.map(tag => `
                <button class="merge-tag-btn" data-tag="${tag}" style="
                  background: var(--surface);
                  border: 1px solid #d0ccc5;
                  padding: 4px 8px;
                  border-radius: 4px;
                  cursor: pointer;
                  color: var(--accent);
                  font-family: 'DM Mono', monospace;
                  font-size: 11px;
                  transition: all 0.2s;
                ">${_escHtml(tag)}</button>
              `).join('')}
            </div>
          </div>

          <!-- Body -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Email Body</label>
            <textarea id="template-body" placeholder="Email body (supports merge tags)" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 12px;
              box-sizing: border-box;
              min-height: 200px;
            ">${_escHtml(body)}</textarea>
          </div>

          <!-- Preview -->
          <div>
            <div style="font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Preview</div>
            <div style="
              background: var(--surface2);
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e0ddd5;
              font-size: 12px;
              color: var(--text2);
              line-height: 1.6;
              max-height: 200px;
              overflow-y: auto;
            ">
              <div style="font-weight: 600; margin-bottom: 8px; color: var(--text);">Subject: ${_escHtml(subject || '(Subject preview)')}</div>
              <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word; font-family: inherit;">${_escHtml(body || '(Body preview)')}</pre>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px;">
            <button id="cancel-template-editor" style="
              padding: 10px 16px;
              background: var(--surface2);
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              cursor: pointer;
              font-size: 13px;
              color: var(--text);
              font-weight: 600;
            ">Cancel</button>
            <button id="save-template-btn" style="
              padding: 10px 16px;
              background: var(--accent);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 13px;
              font-weight: 600;
            ">Save Template</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render templates list
 */
function renderTemplatesMain() {
  const templatesHTML = pipelineState.templates
    .map(t => renderTemplateCard(t))
    .join('');

  return `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px; color: var(--text);">Message Templates</h2>
        <button id="new-template-btn" style="
          padding: 10px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        ">+ New Template</button>
      </div>

      <div style="
        background: var(--surface);
        border-radius: 12px;
        padding: 16px;
      ">
        ${templatesHTML || '<div style="color: var(--text3); text-align: center; padding: 20px;">No templates yet</div>'}
      </div>
    </div>
  `;
}

// ============================================================================
// RENDER: MAILING RULES
// ============================================================================

/**
 * Render mailing rule card
 */
function renderMailingRuleCard(rule) {
  const template = pipelineState.templates.find(t => t.id === rule.templateId);
  const templateName = template?.name || '(Template deleted)';

  return `
    <div class="mailing-rule-card" style="
      background: var(--surface);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border: 1px solid #e0ddd5;
    ">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: var(--text); font-size: 14px;">
            ${_escHtml(rule.name)}
          </div>
          <div style="font-size: 12px; color: var(--text2); margin-top: 4px;">
            ${rule.trigger.replace(/_/g, ' ')} • ${rule.timing.value} ${rule.timing.unit} • ${_escHtml(templateName)}
          </div>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" class="rule-toggle" data-rule-id="${rule.id}" ${rule.enabled ? 'checked' : ''} style="cursor: pointer;">
            <span style="font-size: 11px; color: var(--text2);">Enabled</span>
          </label>
          <button class="edit-rule-btn" data-rule-id="${rule.id}" style="
            background: none;
            border: none;
            color: var(--accent);
            cursor: pointer;
            font-size: 14px;
            padding: 4px;
          ">✎</button>
          ${!rule.id.startsWith('rule_') ? `
            <button class="delete-rule-btn" data-rule-id="${rule.id}" style="
              background: none;
              border: none;
              color: var(--red);
              cursor: pointer;
              font-size: 14px;
              padding: 4px;
            ">×</button>
          ` : ''}
        </div>
      </div>

      ${rule.conditions && (rule.conditions.platformFilter || rule.conditions.minNights || rule.conditions.propertyFilter) ? `
        <div style="font-size: 11px; color: var(--text3); padding-top: 8px; border-top: 1px solid #f0ede7;">
          <strong>Conditions:</strong>
          ${rule.conditions.platformFilter ? `Platform: ${rule.conditions.platformFilter} • ` : ''}
          ${rule.conditions.minNights ? `Min nights: ${rule.conditions.minNights} • ` : ''}
          ${rule.conditions.propertyFilter ? `Property: ${rule.conditions.propertyFilter}` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render mailing rule editor modal
 */
function renderMailingRuleEditor(rule = null) {
  const isNew = !rule;
  const id = rule?.id || '';
  const name = rule?.name || '';
  const trigger = rule?.trigger || 'after_booking';
  const timing = rule?.timing || { value: 0, unit: 'hours' };
  const templateId = rule?.templateId || '';
  const enabled = rule?.enabled !== false;
  const conditions = rule?.conditions || { platformFilter: null, minNights: 0, propertyFilter: null };

  const templates = pipelineState.templates;

  return `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    ">
      <div style="
        background: var(--surface);
        border-radius: 16px;
        padding: 24px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; color: var(--text);">${isNew ? 'New Mailing Rule' : 'Edit Mailing Rule'}</h2>
          <button id="close-rule-editor" style="
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: var(--text2);
            padding: 0;
            width: 32px;
            height: 32px;
          ">×</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Name -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Rule Name</label>
            <input id="rule-name" type="text" value="${_escHtml(name)}" placeholder="e.g., 24h before check-in" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 13px;
              box-sizing: border-box;
            ">
          </div>

          <!-- Trigger -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Trigger Event</label>
            <select id="rule-trigger" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 13px;
            ">
              <option value="after_booking" ${trigger === 'after_booking' ? 'selected' : ''}>After Booking Confirmed</option>
              <option value="before_check_in" ${trigger === 'before_check_in' ? 'selected' : ''}>Before Check-In</option>
              <option value="after_check_in" ${trigger === 'after_check_in' ? 'selected' : ''}>After Check-In</option>
              <option value="before_check_out" ${trigger === 'before_check_out' ? 'selected' : ''}>Before Check-Out</option>
              <option value="after_check_out" ${trigger === 'after_check_out' ? 'selected' : ''}>After Check-Out</option>
              <option value="on_status_change" ${trigger === 'on_status_change' ? 'selected' : ''}>On Status Change</option>
            </select>
          </div>

          <!-- Timing -->
          <div style="display: flex; gap: 8px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Timing Value</label>
              <input id="rule-timing-value" type="number" value="${timing.value}" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #e0ddd5;
                border-radius: 6px;
                font-family: inherit;
                font-size: 13px;
                box-sizing: border-box;
              ">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Unit</label>
              <select id="rule-timing-unit" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #e0ddd5;
                border-radius: 6px;
                font-family: inherit;
                font-size: 13px;
              ">
                <option value="hours" ${timing.unit === 'hours' ? 'selected' : ''}>Hours</option>
                <option value="days" ${timing.unit === 'days' ? 'selected' : ''}>Days</option>
              </select>
            </div>
          </div>

          <!-- Template -->
          <div>
            <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 13px;">Select Template</label>
            <select id="rule-template" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              font-family: inherit;
              font-size: 13px;
            ">
              <option value="">-- Select a template --</option>
              ${templates.map(t => `
                <option value="${t.id}" ${templateId === t.id ? 'selected' : ''}>${_escHtml(t.name)}</option>
              `).join('')}
            </select>
          </div>

          <!-- Conditions -->
          <div style="background: var(--surface2); padding: 12px; border-radius: 6px;">
            <div style="font-weight: 600; color: var(--text); margin-bottom: 12px; font-size: 13px;">Conditions (Optional)</div>

            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 12px;">Platform Filter</label>
              <select id="rule-platform" style="
                width: 100%;
                padding: 8px;
                border: 1px solid #e0ddd5;
                border-radius: 6px;
                font-family: inherit;
                font-size: 12px;
              ">
                <option value="">All Platforms</option>
                <option value="airbnb" ${conditions.platformFilter === 'airbnb' ? 'selected' : ''}>Airbnb</option>
                <option value="vrbo" ${conditions.platformFilter === 'vrbo' ? 'selected' : ''}>VRBO</option>
                <option value="booking" ${conditions.platformFilter === 'booking' ? 'selected' : ''}>Booking.com</option>
                <option value="direct" ${conditions.platformFilter === 'direct' ? 'selected' : ''}>Direct</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-weight: 600; color: var(--text); margin-bottom: 6px; font-size: 12px;">Minimum Nights</label>
              <input id="rule-min-nights" type="number" value="${conditions.minNights || 0}" style="
                width: 100%;
                padding: 8px;
                border: 1px solid #e0ddd5;
                border-radius: 6px;
                font-family: inherit;
                font-size: 12px;
                box-sizing: border-box;
              ">
            </div>
          </div>

          <!-- Enabled -->
          <div>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input id="rule-enabled" type="checkbox" ${enabled ? 'checked' : ''} style="cursor: pointer;">
              <span style="font-weight: 600; color: var(--text); font-size: 13px;">Enabled</span>
            </label>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px;">
            <button id="cancel-rule-editor" style="
              padding: 10px 16px;
              background: var(--surface2);
              border: 1px solid #e0ddd5;
              border-radius: 6px;
              cursor: pointer;
              font-size: 13px;
              color: var(--text);
              font-weight: 600;
            ">Cancel</button>
            <button id="save-rule-btn" style="
              padding: 10px 16px;
              background: var(--accent);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 13px;
              font-weight: 600;
            ">Save Rule</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render mailing rules main
 */
function renderMailingRulesMain() {
  const rulesHTML = pipelineState.mailingRules
    .map(r => renderMailingRuleCard(r))
    .join('');

  return `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px; color: var(--text);">Automated Mailing Rules</h2>
        <button id="new-rule-btn" style="
          padding: 10px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        ">+ New Rule</button>
      </div>

      <div style="background: var(--surface); border-radius: 12px; padding: 16px;">
        ${rulesHTML || '<div style="color: var(--text3); text-align: center; padding: 20px;">No mailing rules configured</div>'}
      </div>
    </div>
  `;
}

// ============================================================================
// RENDER: PRE-ARRIVAL FORMS & INSTRUCTIONS (STUBS)
// ============================================================================

/**
 * Render pre-arrival forms
 */
function renderPreArrivalFormsMain() {
  return `
    <div style="padding: 20px;">
      <h2 style="margin: 0 0 20px 0; font-size: 18px; color: var(--text);">Pre-Arrival Forms</h2>
      <div style="background: var(--surface); border-radius: 12px; padding: 20px; text-align: center;">
        <div style="color: var(--text2); margin-bottom: 12px;">Pre-arrival form management coming soon</div>
        <p style="color: var(--text3); font-size: 12px; margin: 0;">
          Define custom fields, send form links to guests, and track completion status.
        </p>
      </div>
    </div>
  `;
}

/**
 * Render check-in/out instructions
 */
function renderInstructionsMain() {
  return `
    <div style="padding: 20px;">
      <h2 style="margin: 0 0 20px 0; font-size: 18px; color: var(--text);">Check-In / Check-Out Instructions</h2>
      <div style="background: var(--surface); border-radius: 12px; padding: 20px; text-align: center;">
        <div style="color: var(--text2); margin-bottom: 12px;">Unit-specific instructions coming soon</div>
        <p style="color: var(--text3); font-size: 12px; margin: 0;">
          Define check-in and check-out instructions per unit with door codes, wifi, parking, and house rules.
        </p>
      </div>
    </div>
  `;
}

// ============================================================================
// RENDER: MAIN PIPELINE PAGE
// ============================================================================

/**
 * Render the complete pipeline page with tabs
 */
function renderPipelinePageContent() {
  let content = '';

  switch (pipelineState.currentTab) {
    case 'pipeline':
      content = renderPipelineMain();
      break;
    case 'templates':
      content = renderTemplatesMain();
      break;
    case 'pre-arrival':
      content = renderPreArrivalFormsMain();
      break;
    case 'instructions':
      content = renderInstructionsMain();
      break;
    case 'mailing-rules':
      content = renderMailingRulesMain();
      break;
    default:
      content = renderPipelineMain();
  }

  return `
    <div style="display: flex; flex-direction: column; height: calc(100vh - 110px); background: var(--bg);">
      <!-- Tab Navigation -->
      <div style="
        background: var(--surface);
        border-bottom: 1px solid #e0ddd5;
        display: flex;
        gap: 0;
        padding: 0;
      ">
        <button class="pipeline-tab" data-tab="pipeline" style="
          padding: 16px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid ${pipelineState.currentTab === 'pipeline' ? 'var(--accent)' : 'transparent'};
          color: ${pipelineState.currentTab === 'pipeline' ? 'var(--accent)' : 'var(--text2)'};
          cursor: pointer;
          font-weight: ${pipelineState.currentTab === 'pipeline' ? '600' : '500'};
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          transition: all 0.2s;
        ">🔀 Pipeline</button>
        <button class="pipeline-tab" data-tab="templates" style="
          padding: 16px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid ${pipelineState.currentTab === 'templates' ? 'var(--accent)' : 'transparent'};
          color: ${pipelineState.currentTab === 'templates' ? 'var(--accent)' : 'var(--text2)'};
          cursor: pointer;
          font-weight: ${pipelineState.currentTab === 'templates' ? '600' : '500'};
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          transition: all 0.2s;
        ">📝 Templates</button>
        <button class="pipeline-tab" data-tab="instructions" style="
          padding: 16px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid ${pipelineState.currentTab === 'instructions' ? 'var(--accent)' : 'transparent'};
          color: ${pipelineState.currentTab === 'instructions' ? 'var(--accent)' : 'var(--text2)'};
          cursor: pointer;
          font-weight: ${pipelineState.currentTab === 'instructions' ? '600' : '500'};
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          transition: all 0.2s;
        ">🏠 Instructions</button>
        <button class="pipeline-tab" data-tab="mailing-rules" style="
          padding: 16px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid ${pipelineState.currentTab === 'mailing-rules' ? 'var(--accent)' : 'transparent'};
          color: ${pipelineState.currentTab === 'mailing-rules' ? 'var(--accent)' : 'var(--text2)'};
          cursor: pointer;
          font-weight: ${pipelineState.currentTab === 'mailing-rules' ? '600' : '500'};
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          transition: all 0.2s;
        ">📨 Mailing Rules</button>
      </div>

      <!-- Content -->
      <div style="flex: 1; overflow-y: auto; background: var(--bg);">
        ${content}
      </div>

      <!-- Booking Detail Slideout -->
      ${pipelineState.selectedBooking ? renderBookingDetail(pipelineState.selectedBooking) : ''}

      <!-- Modals -->
      ${pipelineState.editingTemplate ? renderTemplateEditor(pipelineState.editingTemplate) : ''}
      ${pipelineState.editingRule ? renderMailingRuleEditor(pipelineState.editingRule) : ''}
    </div>
  `;
}

/**
 * Re-render only the booking list (for search/filter without losing input focus)
 */
function renderPipelineBookingListOnly() {
  const listEl = document.getElementById('pipeline-booking-list');
  if (!listEl) return;
  const filteredBookings = getFilteredBookings();
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const aStage = getBookingPipelineStage(a);
    const bStage = getBookingPipelineStage(b);
    const order = { 'currently_hosting': 0, 'booked': 1, 'inquiry': 2, 'completed': 3, 'canceled': 4 };
    if (order[aStage] !== order[bStage]) return (order[aStage] ?? 9) - (order[bStage] ?? 9);
    return new Date(a.check_in) - new Date(b.check_in);
  });
  const bookingRows = sortedBookings.map(b => renderBookingCard(b)).join('');
  listEl.innerHTML = bookingRows || '<div style="text-align:center;padding:40px;color:var(--text3);font-size:13px;">No bookings found</div>';

  // Re-attach card click listeners
  listEl.querySelectorAll('.pipeline-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.person-name-wrap') || e.target.closest('.pipeline-status-change') || e.target.closest('a')) return;
      const bookingId = card.dataset.bookingId;
      const booking = pipelineState.bookings.find(b => b.id === bookingId);
      if (booking) {
        pipelineState.selectedBooking = booking;
        renderPipeline();
      }
    });
  });
}

// ============================================================================
// STATUS CHANGE HANDLER
// ============================================================================

/**
 * Handle manual status change from inline dropdown on a card
 */
function handlePipelineStatusChange(selectEl) {
  const bookingId = selectEl.dataset.bookingId;
  const newStage = selectEl.value;

  // Map display stage back to booking_status value
  const stageToStatus = {
    'inquiry': 'inquiry',
    'booked': 'confirmed',
    'currently_hosting': 'currently_hosting',
    'completed': 'completed',
    'canceled': 'canceled_by_host'
  };
  const newStatus = stageToStatus[newStage] || newStage;

  // Update local state
  const booking = pipelineState.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.booking_status = newStatus;
  }

  // Save to Supabase
  updateBookingStatus(bookingId, newStatus);

  // Re-render just the list
  renderPipelineBookingListOnly();
}
// Expose globally for inline onchange
window.handlePipelineStatusChange = handlePipelineStatusChange;

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Attach all event listeners
 */
function attachPipelineEventListeners() {
  const container = document.getElementById('pipeline-page');
  if (!container) return;

  // Tab switching
  container.querySelectorAll('.pipeline-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      pipelineState.currentTab = e.target.dataset.tab;
      renderPipeline();
    });
  });

  // Booking card clicks
  container.querySelectorAll('.pipeline-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open detail if clicking on interactive elements inside the card
      if (e.target.closest('.person-name-wrap') || e.target.closest('.pipeline-status-change') || e.target.closest('a')) return;
      const bookingId = card.dataset.bookingId;
      const booking = pipelineState.bookings.find(b => b.id === bookingId);
      if (booking) {
        pipelineState.selectedBooking = booking;
        renderPipeline();
      }
    });
  });

  // Close booking detail
  const closeDetailBtn = container.querySelector('#close-booking-detail');
  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', () => {
      pipelineState.selectedBooking = null;
      renderPipeline();
    });
  }

  // Booking detail tab switching
  container.querySelectorAll('.bd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.bdTab;
      container.querySelectorAll('.bd-tab').forEach(t => t.classList.toggle('active', t.dataset.bdTab === target));
      container.querySelectorAll('.bd-tab-content').forEach(p => p.classList.toggle('active', p.dataset.bdPanel === target));
      // Auto-load forms when Forms tab is clicked
      if (target === 'forms' && pipelineState.selectedBooking) {
        loadGuestForms(pipelineState.selectedBooking);
      }
    });
  });

  // Auto-load forms summary on detail open
  if (pipelineState.selectedBooking) {
    loadGuestForms(pipelineState.selectedBooking);
  }

  // Update booking status
  const updateStatusBtn = container.querySelector('#detail-update-status');
  const statusSelect = container.querySelector('#detail-status-select');
  if (updateStatusBtn && statusSelect) {
    updateStatusBtn.addEventListener('click', async () => {
      const newStatus = statusSelect.value;
      const success = await updateBookingStatus(pipelineState.selectedBooking.id, newStatus);
      if (success) {
        pipelineState.selectedBooking.booking_status = newStatus;
        renderPipeline();
      }
    });
  }

  // Filter handlers — use lightweight re-render to keep input focus
  const searchInput = container.querySelector('#pipeline-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      pipelineState.filters.search = e.target.value;
      renderPipelineBookingListOnly();
    });
  }

  const platformSelect = container.querySelector('#pipeline-platform');
  if (platformSelect) {
    platformSelect.addEventListener('change', (e) => {
      pipelineState.filters.platform = e.target.value || null;
      renderPipelineBookingListOnly();
    });
  }

  // Stage filter tabs
  container.querySelectorAll('.pipeline-stage-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      pipelineState.filters.stage = btn.dataset.stage;
      renderPipeline();
    });
  });

  const clearFiltersBtn = container.querySelector('#pipeline-clear-filters');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      pipelineState.filters = {
        platform: null,
        dateRange: { start: null, end: null },
        search: '',
        stage: 'all'
      };
      // Full re-render needed to clear input values
      renderPipeline();
    });
  }

  // TEMPLATE HANDLERS
  const newTemplateBtn = container.querySelector('#new-template-btn');
  if (newTemplateBtn) {
    newTemplateBtn.addEventListener('click', () => {
      pipelineState.editingTemplate = {};
      renderPipeline();
    });
  }

  container.querySelectorAll('.edit-template-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const templateId = btn.dataset.templateId;
      const template = pipelineState.templates.find(t => t.id === templateId);
      if (template) {
        pipelineState.editingTemplate = { ...template };
        renderPipeline();
      }
    });
  });

  container.querySelectorAll('.delete-template-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const templateId = btn.dataset.templateId;
      if (confirm('Delete this template?')) {
        deleteTemplate(templateId);
      }
    });
  });

  const closeTemplateEditorBtn = container.querySelector('#close-template-editor');
  if (closeTemplateEditorBtn) {
    closeTemplateEditorBtn.addEventListener('click', () => {
      pipelineState.editingTemplate = null;
      renderPipeline();
    });
  }

  const cancelTemplateEditorBtn = container.querySelector('#cancel-template-editor');
  if (cancelTemplateEditorBtn) {
    cancelTemplateEditorBtn.addEventListener('click', () => {
      pipelineState.editingTemplate = null;
      renderPipeline();
    });
  }

  const saveTemplateBtn = container.querySelector('#save-template-btn');
  if (saveTemplateBtn) {
    saveTemplateBtn.addEventListener('click', async () => {
      const name = container.querySelector('#template-name')?.value || '';
      const type = container.querySelector('#template-type')?.value || 'custom';
      const subject = container.querySelector('#template-subject')?.value || '';
      const body = container.querySelector('#template-body')?.value || '';

      if (!name || !subject || !body) {
        alert('Please fill in all fields');
        return;
      }

      const template = {
        id: pipelineState.editingTemplate.id || `tpl_${Date.now()}`,
        name,
        type,
        subject,
        body,
        isDefault: false
      };

      await saveTemplate(template);

      // Update local state
      const existingIndex = pipelineState.templates.findIndex(t => t.id === template.id);
      if (existingIndex >= 0) {
        pipelineState.templates[existingIndex] = template;
      } else {
        pipelineState.templates.push(template);
      }

      pipelineState.editingTemplate = null;
      renderPipeline();
    });
  }

  // Merge tag buttons
  container.querySelectorAll('.merge-tag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = btn.dataset.tag;
      const bodyField = container.querySelector('#template-body');
      if (bodyField) {
        bodyField.value += tag;
        bodyField.focus();
      }
    });
  });

  // MAILING RULE HANDLERS
  const newRuleBtn = container.querySelector('#new-rule-btn');
  if (newRuleBtn) {
    newRuleBtn.addEventListener('click', () => {
      pipelineState.editingRule = {};
      renderPipeline();
    });
  }

  container.querySelectorAll('.edit-rule-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ruleId = btn.dataset.ruleId;
      const rule = pipelineState.mailingRules.find(r => r.id === ruleId);
      if (rule) {
        pipelineState.editingRule = { ...rule };
        renderPipeline();
      }
    });
  });

  container.querySelectorAll('.delete-rule-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ruleId = btn.dataset.ruleId;
      if (confirm('Delete this rule?')) {
        deleteMailingRule(ruleId);
      }
    });
  });

  container.querySelectorAll('.rule-toggle').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const ruleId = checkbox.dataset.ruleId;
      const rule = pipelineState.mailingRules.find(r => r.id === ruleId);
      if (rule) {
        rule.enabled = e.target.checked;
        await saveMailingRule(rule);
        renderPipeline();
      }
    });
  });

  const closeRuleEditorBtn = container.querySelector('#close-rule-editor');
  if (closeRuleEditorBtn) {
    closeRuleEditorBtn.addEventListener('click', () => {
      pipelineState.editingRule = null;
      renderPipeline();
    });
  }

  const cancelRuleEditorBtn = container.querySelector('#cancel-rule-editor');
  if (cancelRuleEditorBtn) {
    cancelRuleEditorBtn.addEventListener('click', () => {
      pipelineState.editingRule = null;
      renderPipeline();
    });
  }

  const saveRuleBtn = container.querySelector('#save-rule-btn');
  if (saveRuleBtn) {
    saveRuleBtn.addEventListener('click', async () => {
      const name = container.querySelector('#rule-name')?.value || '';
      const trigger = container.querySelector('#rule-trigger')?.value || 'after_booking';
      const timingValue = parseInt(container.querySelector('#rule-timing-value')?.value) || 0;
      const timingUnit = container.querySelector('#rule-timing-unit')?.value || 'hours';
      const templateId = container.querySelector('#rule-template')?.value || '';
      const enabled = container.querySelector('#rule-enabled')?.checked || false;
      const platformFilter = container.querySelector('#rule-platform')?.value || null;
      const minNights = parseInt(container.querySelector('#rule-min-nights')?.value) || 0;

      if (!name || !templateId) {
        alert('Please fill in required fields');
        return;
      }

      const rule = {
        id: pipelineState.editingRule.id || `rule_${Date.now()}`,
        name,
        trigger,
        timing: { value: timingValue, unit: timingUnit },
        templateId,
        conditions: { platformFilter, minNights, propertyFilter: null },
        enabled
      };

      await saveMailingRule(rule);

      // Update local state
      const existingIndex = pipelineState.mailingRules.findIndex(r => r.id === rule.id);
      if (existingIndex >= 0) {
        pipelineState.mailingRules[existingIndex] = rule;
      } else {
        pipelineState.mailingRules.push(rule);
      }

      pipelineState.editingRule = null;
      renderPipeline();
    });
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Main render function for the pipeline page
 */
async function renderPipeline() {
  const pageElement = document.getElementById('pipeline-page') || document.getElementById('main-content');

  if (!pageElement) {
    console.error('No container found for pipeline page');
    return;
  }

  // Render the page content
  pageElement.innerHTML = renderPipelinePageContent();

  // Attach event listeners
  attachPipelineEventListeners();

  // Log some debug info
  console.log('Pipeline rendered', {
    bookings: pipelineState.bookings.length,
    templates: pipelineState.templates.length,
    mailingRules: pipelineState.mailingRules.length,
    currentTab: pipelineState.currentTab
  });
}

// ============================================================================
// INITIALIZATION & EXPORTS
// ============================================================================

// Initialize pipeline data on module load
initializePipelineData().catch(error => {
  console.error('Failed to initialize pipeline:', error);
});

// Export main functions
window.renderPipeline = renderPipeline;
window.renderTemplates = renderTemplates;
window.renderMailingRules = renderMailingRules;

/**
 * Convenience export - renders the templates tab
 */
async function renderTemplates() {
  pipelineState.currentTab = 'templates';
  await renderPipeline();
}

/**
 * Convenience export - renders the mailing rules tab
 */
async function renderMailingRules() {
  pipelineState.currentTab = 'mailing-rules';
  await renderPipeline();
}

})(); // end IIFE
