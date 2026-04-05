-- ═══════════════════════════════════════════════════
-- WILLOW PROPERTY MANAGER — Database Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL)
-- ═══════════════════════════════════════════════════

-- 1. REMINDER LOG TABLE
-- Tracks all sent/skipped reminders to prevent duplicates
CREATE TABLE IF NOT EXISTS reminder_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  apt TEXT NOT NULL,
  reminder_type TEXT NOT NULL,
  due_date TEXT NOT NULL,
  email TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'skipped', 'failed'))
);

-- Index for fast duplicate checks
CREATE INDEX IF NOT EXISTS idx_reminder_log_lookup
  ON reminder_log (apt, reminder_type, due_date, status);

-- Index for recent history queries
CREATE INDEX IF NOT EXISTS idx_reminder_log_recent
  ON reminder_log (sent_at DESC);

-- Enable Row Level Security
ALTER TABLE reminder_log ENABLE ROW LEVEL SECURITY;

-- Allow anon role to read/write (matches your existing app pattern)
CREATE POLICY "Allow anon read reminder_log"
  ON reminder_log FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert reminder_log"
  ON reminder_log FOR INSERT TO anon WITH CHECK (true);


-- 2. AUTOMATION SETTINGS TABLE (optional, for future use)
-- Stores automation preferences like reminder timing, email templates, etc.
CREATE TABLE IF NOT EXISTS automation_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read automation_settings"
  ON automation_settings FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon upsert automation_settings"
  ON automation_settings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon update automation_settings"
  ON automation_settings FOR UPDATE TO anon USING (true);

-- Insert default settings
INSERT INTO automation_settings (key, value) VALUES
  ('reminder_schedule', '{"pre_days": [3, 1, 0], "overdue_daily": true}'::jsonb),
  ('email_from', '{"address": "noreply@willowpa.com", "name": "Willow Property Manager"}'::jsonb),
  ('report_schedule', '{"day_of_month": 1, "send_to": "gilbarzeski@gmail.com"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
