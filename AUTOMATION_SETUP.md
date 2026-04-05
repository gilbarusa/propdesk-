# Automation System Setup Guide

## Quick Start

The complete automation system has been built and integrated into Willow Property Manager. Here's what was created and what you need to do to activate it.

## What Was Built

### Files Created
1. **js/automation.js** — 739 lines of complete automation engine
2. **AUTOMATION_GUIDE.md** — Comprehensive documentation

### Files Modified
1. **index.html** — Added Automations page and nav tab
2. **js/app.js** — Integrated renderAutomations() function
3. **css/main.css** — Added 46 CSS classes for styling

## To Activate the System

### Step 1: Create Supabase Table
Create a new table called `reminder_log` in your Supabase project:

```sql
CREATE TABLE reminder_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  apt TEXT NOT NULL,
  reminder_type TEXT NOT NULL,
  due_date TEXT NOT NULL,
  email TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminder_apt ON reminder_log(apt);
CREATE INDEX idx_reminder_type ON reminder_log(reminder_type);
CREATE INDEX idx_reminder_sent ON reminder_log(status);
```

### Step 2: Create Edge Function
Create a Supabase Edge Function called `send-reminder-email` that:

**Input:**
```javascript
{
  to: "tenant@example.com",
  subject: "Rent Due Today",
  htmlBody: "<html>...</html>"
}
```

**Implementation Notes:**
- Use Google Workspace SMTP
- From: noreply@willowpa.com
- Handle HTML email bodies
- Return success/error status

**Example Edge Function (Deploy to Supabase):**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const { to, subject, htmlBody } = await req.json()

  try {
    const client = new SmtpClient({
      hostname: Deno.env.get("SMTP_HOST"),
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      username: Deno.env.get("SMTP_USER"),
      password: Deno.env.get("SMTP_PASS"),
      tls: true,
    })

    await client.connect()
    await client.send({
      from: "noreply@willowpa.com",
      to,
      subject,
      html: htmlBody,
    })
    await client.close()

    return new Response(JSON.stringify({ success: true }))
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
```

### Step 3: Set Up Scheduled Task
Use your preferred scheduler to call `runDailyReminders()` daily:

**Option A: Browser Console (for testing)**
```javascript
await runDailyReminders()
```

**Option B: External API Call (Production)**
```bash
curl -X POST https://yourdomain.com/api/automation/reminders \
  -H "Authorization: Bearer YOUR_SECRET_KEY"
```

**Option C: Supabase Scheduled Functions** (Recommended)
- Create a scheduled function that calls the endpoint
- Set to run daily at 8:00 AM

### Step 4: Test the System

1. **Open Automations Page**
   - Click "⚡ Automations" nav tab
   - Verify page loads without errors

2. **Check Dashboard**
   - Should show "Reminders Due" count
   - Should show "Upcoming Moves" count
   - Should show "Collection Rate" percentage

3. **Test Reminder**
   - Find a unit with a due date in the past 3 days
   - Ensure unit.note contains email
   - Click "Send" button
   - Watch for success toast notification
   - Check Supabase reminder_log table for entry

4. **Verify Email** (when Edge Function is ready)
   - Confirm tenant received email
   - Check formatting and branding

## Features Available Now

### Dashboard Metrics
- ✅ Reminders due count
- ✅ Upcoming moves (check-ins/outs)
- ✅ Collection rate percentage
- ✅ Collections vs outstanding amounts

### Reminder Management
- ✅ View pending reminders
- ✅ Send individual reminders
- ✅ Skip reminders
- ✅ Run all reminders at once
- ✅ View recent reminder history

### Booking Alerts
- ✅ Check-ins within 3 days
- ✅ Check-outs within 3 days
- ✅ Formatted dates and names

### Monthly Report
- ✅ Total units and paid count
- ✅ Collection rate calculation
- ✅ Amounts collected vs outstanding
- ✅ By-owner breakdown
- ✅ Upcoming moves preview
- ✅ Email button (ready for integration)

## Reminder Schedule

The system automatically determines when to send each reminder:

| Days Until Due | Reminder Type | Message | Frequency |
|---|---|---|---|
| 3 | pre-3 | Friendly heads-up | Once |
| 1 | pre-1 | Reminder (tomorrow) | Once |
| 0 | due | Due today | Once |
| -1, -2, -3... | overdue-N | Overdue escalation | Daily |

## Data Structure

### Unit Requirements
Units need these fields populated:
- `apt` — Apartment number (required)
- `due` — Due date in YYYY-MM-DD format (required)
- `rent` — Monthly rent amount (required)
- `balance` — Outstanding balance
- `name` — Tenant name (for emails)
- `note` — Must contain: `Email: xxx@xxx.com`

### Contact Info Format
```
"Via: Airbnb | Tel: (555) 123-4567 | Email: tenant@example.com"
```

Both email and phone are optional, but email is required for reminders.

## Customization

### Change Reminder Schedule
Edit `getReminderType()` in automation.js:
```javascript
function getReminderType(daysDiff) {
  if (daysDiff === 5) return 'pre-5';  // Add 5-day reminder
  if (daysDiff === 3) return 'pre-3';
  // ... etc
}
```

### Modify Email Templates
Edit `getEmailContent()` function for different:
- Subject lines
- HTML styling
- Email copy/tone
- Branding colors

### Change Dashboard Layout
Edit `renderAutomations()` function to:
- Add/remove sections
- Change card order
- Modify statistics shown
- Add new data displays

## Troubleshooting

### Reminders Not Showing
1. Check that `data` array is populated
2. Verify units have valid `due` dates
3. Ensure `unit.note` contains email address
4. Check browser console for errors

### Supabase Errors
1. Verify `reminder_log` table exists
2. Check table schema matches expected format
3. Verify Supabase client (`sb`) is initialized
4. Check network tab for failed requests

### Email Not Sending
1. Verify Edge Function deployed to correct name
2. Check SMTP credentials in Edge Function
3. Verify tenant email format is valid
4. Check spam folder

### Page Not Loading
1. Verify `automationsContainer` div exists in HTML
2. Check browser console for JavaScript errors
3. Verify `automation.js` script tag is present
4. Clear browser cache and reload

## Performance Notes

- Dashboard loads recent reminders from Supabase (limited to 20)
- Reminder checking loops through active units only
- No archived units included in calculations
- Email sending is asynchronous (non-blocking)
- Database queries are indexed for performance

## Security Considerations

- All Supabase calls use authenticated client
- Edge Function should validate API key
- Email addresses are only used for sending
- No sensitive data stored in reminder_log
- All user input is sanitized before display

## Next Steps

1. Create reminder_log table in Supabase
2. Deploy send-reminder-email Edge Function
3. Configure SMTP credentials
4. Set up daily scheduler
5. Test with sample unit
6. Monitor first few days for issues
7. Adjust reminder schedule as needed

## Support

For issues or questions, refer to:
- **AUTOMATION_GUIDE.md** — Complete technical documentation
- **js/automation.js** — Source code with inline comments
- Browser console — Error messages and logs

---

**System Status:** ✅ Ready to Deploy

All components are built and integrated. Just need:
1. Supabase table
2. Edge Function
3. Scheduler
