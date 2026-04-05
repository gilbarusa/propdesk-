# Willow Property Manager — Automation System

Complete automation engine for rent reminders, booking alerts, and financial reporting.

## Files Created/Modified

### New Files
- **js/automation.js** (730 lines) — Complete automation engine with all functions and features

### Modified Files
- **index.html** — Added Automations page and nav tab
- **js/app.js** — Added renderAutomations() call to showPage()
- **css/main.css** — Added comprehensive styling for automations page

## Core Features

### 1. Reminder Engine
Automatically sends rent reminders on a schedule:
- **3 days before due date** — Friendly heads-up
- **1 day before due date** — Reminder
- **On due date** — "It's due today" notice
- **Daily after due date** — Escalating overdue notices

#### Key Functions
```javascript
getTenantsNeedingReminders()      // Returns array of units needing reminders
getReminderType(daysDiff)         // Determines reminder type from days difference
sendReminder(unit, type, email)   // Sends email via Supabase Edge Function
runDailyReminders()               // Main orchestrator function
```

### 2. Email Templates
Professional HTML email templates with Willow branding (brown/cream color scheme):
- Pre-3: Friendly upcoming reminder
- Pre-1: Urgent one-day notice
- Due: Same-day notice
- Overdue: Escalating urgency for past-due amounts

All templates include:
- Property/unit information
- Amount due
- Due date
- Payment instructions placeholder
- Professional Willow footer

#### Template Function
```javascript
getEmailContent(unit, reminderType)  // Returns {subject, body} with HTML
```

### 3. Contact Parsing
Extracts email and phone from unit notes:
```javascript
parseContactFromNote(note)  // Parses "Email: xxx@xxx.com" and "Tel: xxx" format
```

### 4. Reminder Logging & Deduplication
Prevents duplicate reminders via Supabase reminder_log table:
```javascript
hasReminderBeenSent(apt, type, date)  // Checks if already sent today
logReminderSent(apt, type, date, email)  // Records sent reminder
logReminderSkipped(apt, type, date)   // Records skipped reminder
```

### 5. Booking Alerts
Monitors upcoming check-ins and check-outs within next 3 days:
```javascript
checkBookingAlerts()  // Returns {checkIns[], checkOuts[], gapCount}
```

### 6. Monthly Financial Report
Comprehensive report generation:
```javascript
generateMonthlyReport()  // Returns report object with:
  - Total units, paid count, overdue count
  - Collection rate percentage
  - Total collected vs outstanding
  - By-owner breakdown
  - Upcoming moves (30-day window)
```

### 7. Dashboard Page
Full automations dashboard with:
- Quick stats cards (reminders due, upcoming moves, collection rate)
- Reminders to send list with send/skip buttons
- Recent reminders history table
- Booking alerts (check-ins/outs)
- Monthly report preview
- Email report button

## Supabase Integration

### Tables Required
The system expects a `reminder_log` table with schema:
```sql
- id (auto)
- apt (text) — Unit apartment number
- reminder_type (text) — 'pre-3', 'pre-1', 'due', 'overdue-N'
- due_date (text) — Due date in YYYY-MM-DD format
- email (text) — Recipient email
- sent_at (timestamptz) — When sent
- status (text) — 'sent', 'skipped', or 'pending'
```

### Edge Function
The system calls the Edge Function:
```javascript
sb.functions.invoke('send-reminder-email', {
  body: {
    to: tenantEmail,
    subject: emailSubject,
    htmlBody: emailHTML
  }
})
```

**Function should:**
- Accept email parameters
- Send via Google Workspace SMTP (noreply@willowpa.com)
- Handle any errors gracefully

## Data Model

### Global Variables Used
- `data` — Array of active unit records
- `archived` — Array of archived unit records
- `sb` — Supabase client (initialized in app.js)

### Unit Record Structure
```javascript
{
  id, apt, owner, name, type, rent, balance, due, lease_end,
  checkin, note, history, archived, archived_date
}
```

### Note Field Format
```
"Via: Source | Tel: 555-1234 | Email: tenant@example.com"
```

## UI/UX

### Automations Page
- **Path**: Click "⚡ Automations" in nav bar
- **Location**: Between Archive and Settings tabs

### Components
1. **Dashboard Cards**
   - Quick stats (reminders, moves, collection rate)
   - Color-coded status indicators

2. **Reminders Section**
   - List of pending reminders
   - Send/Skip buttons for each
   - "Run All" button for bulk processing

3. **Booking Alerts**
   - Check-ins (blue) and check-outs (orange)
   - Days away indicator
   - Last 3 days only

4. **Monthly Report**
   - Collections vs outstanding
   - Collection rate percentage
   - By-owner breakdown
   - Email button (placeholder for future)

5. **Recent History**
   - Last 20 reminders sent/skipped
   - Status indicators
   - Timestamp

## Usage

### Manual Reminder Sending
1. Navigate to Automations page
2. View "Reminders to Send" section
3. Click "Send" for individual reminders or "Run All Reminders"
4. Reminders are logged in Supabase to prevent duplicates

### Viewing Status
- Dashboard cards show quick counts
- Recent history table shows all activity
- Timestamps show when sent
- Status badges indicate sent/skipped

### Booking Alerts
- Automatically detects upcoming check-ins/outs
- Shows within next 3 days only
- Useful for preparation and unit management

### Monthly Reports
- Auto-calculates collection metrics
- Shows per-owner breakdown
- Reports on upcoming moves
- Can be emailed (feature ready for Edge Function)

## Error Handling

### Safety Checks
- Validates Supabase client is initialized
- Checks data array exists before processing
- Skips units without email addresses
- Handles missing fields gracefully
- Try/catch blocks on all Supabase queries

### User Feedback
- Toast notifications for success/failure
- Loading states while processing
- Error messages with details
- Disabled buttons during processing

## Styling

### CSS Classes
- `.automation-grid` — 3-column responsive layout
- `.automation-card` — Dashboard stat cards
- `.automation-section` — Content sections
- `.automation-list` — Reminder item list
- `.automation-table` — History table
- `.automation-badge-*` — Status indicators

### Color Scheme
Uses existing CSS variables from app:
- `--accent` — Primary color (brown)
- `--red` — Overdue/urgent
- `--orange` — Warning
- `--green` — Success/paid
- `--blue` — Info/pending

## Deployment Checklist

- [x] automation.js created and loaded
- [x] HTML page added
- [x] Nav tab added
- [x] showPage() updated
- [x] CSS styles included
- [x] Supabase client checks added
- [x] Email templates created
- [x] Error handling implemented

## Next Steps

To complete the system:
1. Create `reminder_log` table in Supabase
2. Deploy or create `send-reminder-email` Edge Function
3. Test reminder sending with sample unit
4. Set up scheduled task to call runDailyReminders() daily (e.g., via cron)
5. Configure Google Workspace SMTP credentials for Edge Function
6. Optionally add email report functionality to Edge Function

## Code Structure

### Organization
- Email templates (lines 1-130)
- Helper functions (lines 133-170)
- Supabase operations (lines 171-242)
- Core business logic (lines 244-487)
- UI rendering (lines 487-680)
- Event handlers (lines 684-740)

### Async Flow
1. getTenantsNeedingReminders() → checks each unit
2. getReminderType() → determines type
3. hasReminderBeenSent() → prevents duplicates
4. sendReminder() → calls Edge Function
5. logReminderSent() → records in database
6. toast() → user notification
7. renderAutomations() → refreshes UI

## Testing

### Manual Testing
1. Navigate to Automations page
2. Verify all data loads
3. Check reminders list populates
4. Test send/skip buttons
5. Verify booking alerts appear
6. Check monthly report calculates

### Unit Testing
Test each function independently:
```javascript
// Parse note format
parseContactFromNote("Email: test@example.com | Tel: 555-1234")
// Calculate days
daysBetween("2026-04-05", "2026-04-02")  // = 3
getReminderType(3)  // = 'pre-3'
```

## License
Part of Willow Property Manager
