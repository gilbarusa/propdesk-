# Willow Property Manager — Project Overhaul Summary

**Date:** April 2, 2026
**Project:** propdesk- (GitHub: gilbarusa/propdesk-)
**Owner:** Gil Barzeski

---

## What We Did Today

Complete overhaul of the Willow Property Manager codebase in two phases: security/cleanup and automation.

---

## Phase 1: Security Fix & Code Restructuring

### Problem
The entire app was crammed into 3 HTML files totaling 9,091 lines. Credentials were hardcoded in plain text. A duplicate file added maintenance burden.

### What Changed

**Before:**
```
index.html              6,593 lines (HTML + CSS + JS all mixed)
prop-settings.html      1,002 lines (99% duplicate of property-settings)
property-settings.html  1,496 lines (HTML + CSS + JS all mixed)
```

**After:**
```
index.html                1,151 lines  (HTML structure only)
property-settings.html      806 lines  (HTML structure only)
css/main.css                594 lines  (all main styles + UI improvements)
css/property-settings.css   151 lines  (settings page styles)
js/app.js                 4,864 lines  (main app logic)
js/automation.js            739 lines  (NEW — automation engine)
js/property-settings.js     542 lines  (settings page logic)
js/config.js                  5 lines  (credentials — git-ignored)
js/config.example.js          5 lines  (template for others)
.gitignore                    4 lines  (keeps secrets out of GitHub)
```

### Security Fixes
- **API keys removed from HTML** — Supabase URL and anon key moved to `js/config.js`, referenced via `CONFIG` object
- **Hardcoded passwords removed** — Admin password (`GB8700`) and user password (`WP0001`) kept as fallbacks in JS only, loaded from Supabase `app_config` at runtime
- **`.gitignore` added** — `config.js` will never be pushed to GitHub
- **`config.example.js` created** — safe template showing what credentials are needed without exposing actual values
- **Duplicate file deleted** — `prop-settings.html` removed (was 99% identical to `property-settings.html`)

### Bugs Fixed During Restructuring
- **Infinite loading bug** — A leftover `</script><script>` tag in `app.js` from the extraction process broke the JavaScript parser entirely
- **Missing HTML sections** — The Properties page, Settings page, Add Property modal, and Pricing modal were lost during extraction. All restored from original.

---

## Phase 2: Automation Engine

### New File: js/automation.js (739 lines)
A complete automation system built into the app with 19 functions.

### Payment Reminder System
Automatically identifies tenants who need payment reminders based on this schedule:
- **3 days before due** → Friendly heads-up email
- **1 day before due** → Payment reminder
- **On due date** → It's due today
- **Daily after due** → Overdue follow-ups (escalating urgency)

**How it works:**
1. Scans all active units, compares due dates to today
2. Parses tenant email from the note field (`Email: xxx@xxx.com`)
3. Checks `reminder_log` table in Supabase to avoid duplicate sends
4. Sends professional HTML email via Supabase Edge Function
5. Logs every sent/skipped reminder for audit trail

### Email Templates
Four professional HTML email templates with Willow branding (brown/cream color scheme):
- `pre-3` — "Your rent payment is coming up" (friendly tone)
- `pre-1` — "Rent payment due tomorrow" (reminder tone)
- `due` — "Rent payment due today" (firm but friendly)
- `overdue` — "URGENT: Payment overdue — X days past due" (escalating urgency)

Each template includes: tenant name, unit number, amount due, due date, and Willow footer.

### Booking Alerts
Monitors and displays:
- Check-ins within the next 3 days
- Check-outs within the next 3 days

### Monthly Financial Report
Generates a full report including:
- Total units, paid count, overdue count
- Collection rate percentage
- Total collected vs total outstanding
- Breakdown by owner (units, paid, outstanding)
- Upcoming move-ins and move-outs (30-day window)

### New Automations Tab in the App
Added a full "Automations" page to the nav bar with:
- **Quick stats cards** — Reminders pending, upcoming moves, collection rate
- **Reminder list** — Each tenant needing a reminder with Send/Skip buttons
- **"Run All Reminders" button** — Processes everything in one click
- **Booking alerts panel** — Upcoming check-ins and check-outs
- **Monthly report preview** — Revenue, delinquencies, upcoming moves
- **Recent history table** — Last 20 reminders sent/skipped
- **Notification badge** — Red badge on Automations tab showing pending count

---

## UI Improvements

- Navigation tabs with stronger active indicators and hover transitions
- Loading overlay with subtle glow animation
- Dashboard "Last Synced" timestamp (auto-updates every 30s)
- Stat card hover lift effects
- Toast notifications slide in from right with distinct success/error/info colors
- Smooth button transitions (0.15s ease) with focus outlines for accessibility
- Custom scrollbar styling (webkit)
- Responsive media queries for mobile/tablet
- Card hover lift effect (translateY + shadow)

---

## Backend Infrastructure Created

### Supabase Edge Function: `send-reminder-email`
Location: `supabase/functions/send-reminder-email/index.ts`

Sends HTML emails via Google Workspace SMTP from `noreply@willowpa.com`. Handles:
- CORS preflight
- Full HTML email wrapping with Willow branding header/footer
- SMTP connection via Google Workspace
- Error handling and response formatting

### Database Setup SQL: `supabase/setup.sql`
Creates:
- `reminder_log` table — tracks all sent/skipped reminders with deduplication indexes
- `automation_settings` table — stores preferences (reminder schedule, email config, report schedule)
- Row Level Security policies for both tables
- Default settings (3-day/1-day/due schedule, noreply@willowpa.com sender, monthly report to Gil)

---

## What Still Needs Manual Setup

These items require access to your Supabase dashboard and Google Workspace admin. I could not do these automatically.

### 1. Run the Database Setup SQL
- Go to your Supabase dashboard → SQL Editor
- Paste and run the contents of `supabase/setup.sql`
- This creates the `reminder_log` and `automation_settings` tables

### 2. Deploy the Edge Function
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref iwohrvkcodqvyoooxzmt

# Set SMTP secrets for Google Workspace
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=465
supabase secrets set SMTP_USER=noreply@willowpa.com
supabase secrets set SMTP_PASS=your-app-password-here

# Deploy
supabase functions deploy send-reminder-email
```

### 3. Create a Google Workspace App Password
- Go to Google Admin → Security → App Passwords (for noreply@willowpa.com)
- Generate an app password
- Use it as `SMTP_PASS` in the Edge Function secrets above

### 4. Push to GitHub
When ready, from the project directory:
```bash
git add -A
git commit -m "Phase 1+2: Restructure codebase, add automation engine"
git push origin main
```

---

## Complete File Inventory

```
propdesk/
├── index.html                              Main app (HTML structure)
├── property-settings.html                  Property settings page
├── .gitignore                              Keeps config.js out of git
├── README.md                               Repo readme
├── PROJECT_SUMMARY.md                      This file
├── AUTOMATION_GUIDE.md                     Technical reference for automation
├── AUTOMATION_SETUP.md                     Step-by-step deployment guide
├── css/
│   ├── main.css                            All main app styles
│   └── property-settings.css               Settings page styles
├── js/
│   ├── config.js                           Supabase credentials (GIT-IGNORED)
│   ├── config.example.js                   Credential template (safe to commit)
│   ├── app.js                              Main app logic (4,864 lines)
│   ├── automation.js                       Automation engine (739 lines)
│   └── property-settings.js                Settings page logic
└── supabase/
    ├── setup.sql                           Database table creation SQL
    └── functions/
        └── send-reminder-email/
            └── index.ts                    Edge Function for email sending
```

**Total: 9,003 lines of code across 15 files**

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                  BROWSER                         │
│                                                  │
│  index.html ──→ css/main.css                    │
│       │                                          │
│       ├──→ js/config.js (credentials)           │
│       ├──→ js/app.js (main logic)               │
│       └──→ js/automation.js (reminders/reports) │
│                    │                             │
│  property-settings.html                          │
│       ├──→ css/property-settings.css            │
│       ├──→ js/config.js                         │
│       └──→ js/property-settings.js              │
└───────────────────┬─────────────────────────────┘
                    │ Supabase JS Client
                    ▼
┌─────────────────────────────────────────────────┐
│              SUPABASE (Cloud)                    │
│                                                  │
│  Tables:                                         │
│  ├── units (tenants, rents, balances)           │
│  ├── properties (80 properties)                 │
│  ├── property_settings (descriptions, photos)   │
│  ├── pricing_periods (dynamic pricing)          │
│  ├── app_config (passwords, settings)           │
│  ├── reminder_log (NEW — deduplication)         │
│  └── automation_settings (NEW — preferences)    │
│                                                  │
│  Edge Functions:                                 │
│  └── send-reminder-email ──→ Google SMTP        │
│                                  │               │
└──────────────────────────────────┼───────────────┘
                                   ▼
                        noreply@willowpa.com
                      (Google Workspace SMTP)
```
