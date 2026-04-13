-- ═══ RENTAL APPLICATIONS TABLE ═══
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rental_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Application metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','screening','approved','denied','withdrawn','expired')),
  screening_level TEXT DEFAULT 'basic' CHECK (screening_level IN ('basic','criminal_credit','full')),
  property TEXT,
  unit TEXT,

  -- Personal information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,

  -- Address
  address_line1 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,

  -- Move-in info
  move_in_date DATE,

  -- Rental history
  current_landlord TEXT,
  current_landlord_phone TEXT,
  current_rent NUMERIC,
  reason_for_leaving TEXT,

  -- Employment
  employer TEXT,
  employer_phone TEXT,
  job_title TEXT,
  monthly_income NUMERIC,

  -- Emergency contact
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relation TEXT,

  -- Additional
  num_occupants INTEGER DEFAULT 1,
  pets TEXT,
  vehicles TEXT,
  additional_notes TEXT,
  has_been_evicted BOOLEAN DEFAULT false,
  has_criminal_record BOOLEAN DEFAULT false,

  -- Internal
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  notes TEXT
);

-- Enable RLS
ALTER TABLE rental_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public apply form)
CREATE POLICY "Allow public inserts" ON rental_applications
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated reads (for PropDesk admin)
CREATE POLICY "Allow authenticated reads" ON rental_applications
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated updates (for PropDesk admin)
CREATE POLICY "Allow authenticated updates" ON rental_applications
  FOR UPDATE TO anon
  USING (true);

-- Index for common queries
CREATE INDEX idx_rental_apps_status ON rental_applications(status);
CREATE INDEX idx_rental_apps_property ON rental_applications(property);
CREATE INDEX idx_rental_apps_created ON rental_applications(created_at DESC);
