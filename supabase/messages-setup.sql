-- ══════════════════════════════════════════════════════
-- UNIFIED BOOKINGS & MESSAGING SYSTEM
-- Every message thread links to a booking. Every booking blocks the calendar.
-- ══════════════════════════════════════════════════════

-- Master bookings table: ONE booking = ONE reservation from ANY channel
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL, -- 'airbnb', 'vrbo', 'booking', 'direct', 'willowpa'
  external_id TEXT, -- platform confirmation code (e.g. HMCPSJ2BQA)

  -- Guest info
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  guest_email TEXT,
  guest_count INT DEFAULT 1,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  infants INT DEFAULT 0,
  pets INT DEFAULT 0,

  -- Property link
  unit_apt TEXT NOT NULL, -- matches apt field in units table
  listing_name TEXT,
  property_address TEXT,

  -- Dates (THESE ARE THE CALENDAR BLOCKING DATES)
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INT GENERATED ALWAYS AS (check_out - check_in) STORED,

  -- Financial
  total_payout NUMERIC(10,2) DEFAULT 0,
  nightly_rate NUMERIC(10,2) DEFAULT 0,
  cleaning_fee NUMERIC(10,2) DEFAULT 0,
  service_fee NUMERIC(10,2) DEFAULT 0,
  taxes NUMERIC(10,2) DEFAULT 0,
  host_payout NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending', -- pending, partial, paid, refunded

  -- Status
  booking_status TEXT DEFAULT 'confirmed',
  -- confirmed, currently_hosting, completed, canceled_by_guest, canceled_by_host,
  -- pending, inquiry, pre_approved, declined, withdrawn, change_requested

  -- Timestamps
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Updated channels table: links to a booking
CREATE TABLE IF NOT EXISTS channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  external_id TEXT,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  guest_email TEXT,
  listing_name TEXT,
  unit_apt TEXT,
  status TEXT DEFAULT 'active',
  unread_count INT DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  sender_name TEXT,
  body TEXT NOT NULL,
  platform TEXT NOT NULL,
  external_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ,
  message_type TEXT DEFAULT 'text'
);

-- Calendar blocking view: shows all blocked dates across all channels
CREATE OR REPLACE VIEW calendar_blocks AS
SELECT
  b.id as booking_id,
  b.unit_apt,
  b.check_in,
  b.check_out,
  b.guest_name,
  b.platform,
  b.booking_status,
  b.total_payout,
  b.guest_count,
  b.listing_name
FROM bookings b
WHERE b.booking_status NOT IN ('canceled_by_guest', 'canceled_by_host', 'declined', 'withdrawn')
  AND b.check_out >= CURRENT_DATE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_unit_dates ON bookings(unit_apt, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_platform ON bookings(platform, booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_checkin ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_channels_booking ON channels(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_channels_last_msg ON channels(last_message_at DESC);

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_channels" ON channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Function to check if dates conflict for a given unit
CREATE OR REPLACE FUNCTION check_date_conflict(
  p_unit_apt TEXT,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings
    WHERE unit_apt = p_unit_apt
      AND booking_status NOT IN ('canceled_by_guest', 'canceled_by_host', 'declined', 'withdrawn')
      AND check_in < p_check_out
      AND check_out > p_check_in
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
  );
END;
$$ LANGUAGE plpgsql;
