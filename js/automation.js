// ══════════════════════════════════════════════════════
//  AUTOMATION ENGINE
//  Reminder scheduling, tracking, and email sending
// ══════════════════════════════════════════════════════

// ── Email Templates ──
function getEmailContent(unit, reminderType) {
  const dueDate = new Date(unit.due);
  const dueDateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const amountDue = unit.balance > 0 ? unit.balance : unit.rent;

  let subject, body;

  if (reminderType === 'pre-3') {
    subject = `Rent Payment Coming Up – ${unit.apt}`;
    body = `
      <h2 style="color:#7d5228;margin:0 0 16px 0;font-size:20px;font-weight:600;">Rent Payment Reminder</h2>
      <p style="margin:0 0 12px 0;color:#635c4e;line-height:1.6;">Hi ${unit.name},</p>
      <p style="margin:0 0 16px 0;color:#635c4e;line-height:1.6;">
        This is a friendly reminder that your rent payment is coming up in 3 days. Please ensure payment is received by <strong>${dueDateStr}</strong>.
      </p>
      <div style="background:#f7f4ef;border-left:4px solid #b5784a;padding:12px 14px;margin:16px 0;border-radius:4px;">
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">AMOUNT DUE</span><br/>
          <strong style="color:#7d5228;font-size:18px;">$${amountDue.toFixed(2)}</strong>
        </div>
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">DUE DATE</span><br/>
          <strong style="color:#7d5228;">${dueDateStr}</strong>
        </div>
        <div>
          <span style="color:#9e9485;font-size:11px;">UNIT</span><br/>
          <strong style="color:#7d5228;">${unit.apt}</strong>
        </div>
      </div>
      <p style="margin:16px 0;color:#635c4e;line-height:1.6;">
        Please submit payment as soon as possible. If you have any questions, don't hesitate to reach out.
      </p>
    `;
  } else if (reminderType === 'pre-1') {
    subject = `Rent Due Tomorrow – ${unit.apt}`;
    body = `
      <h2 style="color:#7d5228;margin:0 0 16px 0;font-size:20px;font-weight:600;">Rent Payment Due Tomorrow</h2>
      <p style="margin:0 0 12px 0;color:#635c4e;line-height:1.6;">Hi ${unit.name},</p>
      <p style="margin:0 0 16px 0;color:#635c4e;line-height:1.6;">
        Your rent payment is due <strong>tomorrow, ${dueDateStr}</strong>. Please arrange for payment to be received by this date.
      </p>
      <div style="background:#fdf3e8;border-left:4px solid #b86818;padding:12px 14px;margin:16px 0;border-radius:4px;">
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">AMOUNT DUE</span><br/>
          <strong style="color:#b86818;font-size:18px;">$${amountDue.toFixed(2)}</strong>
        </div>
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">DUE DATE</span><br/>
          <strong style="color:#b86818;">${dueDateStr}</strong>
        </div>
        <div>
          <span style="color:#9e9485;font-size:11px;">UNIT</span><br/>
          <strong style="color:#b86818;">${unit.apt}</strong>
        </div>
      </div>
      <p style="margin:16px 0;color:#635c4e;line-height:1.6;">
        Thank you for your prompt attention to this matter.
      </p>
    `;
  } else if (reminderType === 'due') {
    subject = `Rent Due Today – ${unit.apt}`;
    body = `
      <h2 style="color:#7d5228;margin:0 0 16px 0;font-size:20px;font-weight:600;">Rent Payment Due Today</h2>
      <p style="margin:0 0 12px 0;color:#635c4e;line-height:1.6;">Hi ${unit.name},</p>
      <p style="margin:0 0 16px 0;color:#635c4e;line-height:1.6;">
        Your rent payment is due <strong>today, ${dueDateStr}</strong>. Please submit payment immediately.
      </p>
      <div style="background:#fdf3e8;border-left:4px solid #b86818;padding:12px 14px;margin:16px 0;border-radius:4px;">
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">AMOUNT DUE</span><br/>
          <strong style="color:#b86818;font-size:18px;">$${amountDue.toFixed(2)}</strong>
        </div>
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">DUE DATE</span><br/>
          <strong style="color:#b86818;">${dueDateStr}</strong>
        </div>
        <div>
          <span style="color:#9e9485;font-size:11px;">UNIT</span><br/>
          <strong style="color:#b86818;">${unit.apt}</strong>
        </div>
      </div>
      <p style="margin:16px 0;color:#635c4e;line-height:1.6;">
        If payment has already been sent, please disregard this notice.
      </p>
    `;
  } else if (reminderType.startsWith('overdue')) {
    const daysPastDue = parseInt(reminderType.split('-')[1]);
    subject = `URGENT: Rent Overdue – ${unit.apt}`;
    body = `
      <h2 style="color:#b83228;margin:0 0 16px 0;font-size:20px;font-weight:600;">URGENT: Payment Overdue</h2>
      <p style="margin:0 0 12px 0;color:#635c4e;line-height:1.6;">Hi ${unit.name},</p>
      <p style="margin:0 0 16px 0;color:#b83228;line-height:1.6;font-weight:600;">
        Your rent payment is now <strong>${daysPastDue} day${daysPastDue > 1 ? 's' : ''} overdue</strong> as of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
      </p>
      <div style="background:#fdf1f0;border-left:4px solid #b83228;padding:12px 14px;margin:16px 0;border-radius:4px;">
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">AMOUNT DUE</span><br/>
          <strong style="color:#b83228;font-size:18px;">$${amountDue.toFixed(2)}</strong>
        </div>
        <div style="margin-bottom:8px;">
          <span style="color:#9e9485;font-size:11px;">WAS DUE</span><br/>
          <strong style="color:#b83228;">${dueDateStr}</strong>
        </div>
        <div>
          <span style="color:#9e9485;font-size:11px;">DAYS OVERDUE</span><br/>
          <strong style="color:#b83228;">${daysPastDue}</strong>
        </div>
      </div>
      <p style="margin:16px 0;color:#b83228;line-height:1.6;font-weight:600;">
        Immediate payment is required. Please contact us if you are experiencing difficulties.
      </p>
    `;
  }

  body += `
    <hr style="border:none;border-top:1px solid #ddd8ce;margin:24px 0;">
    <div style="font-size:11px;color:#9e9485;">
      <p style="margin:0 0 8px 0;">Questions? Contact us at noreply@willowpa.com</p>
      <p style="margin:0;">Willow Property Manager</p>
    </div>
  `;

  return { subject, body };
}

// ── Contact Parsing ──
function parseContactFromNote(note) {
  if (!note) return { email: null, phone: null };

  const emailMatch = note.match(/Email:\s*([^\s|]+)/i);
  const phoneMatch = note.match(/Tel:\s*([^|]+?)(?:\||$)/);

  return {
    email: emailMatch ? emailMatch[1].trim() : null,
    phone: phoneMatch ? phoneMatch[1].trim() : null
  };
}

// ── Reminder Type Determination ──
function getReminderType(daysDiff) {
  if (daysDiff === 3) return 'pre-3';
  if (daysDiff === 1) return 'pre-1';
  if (daysDiff === 0) return 'due';
  if (daysDiff < 0) {
    const overdueDays = Math.abs(daysDiff);
    return `overdue-${overdueDays}`;
  }
  return null;
}

// ── Date Utilities ──
function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysBetween(dateStr, today = getToday()) {
  const d1 = new Date(dateStr);
  const d2 = new Date(today);
  const diffTime = d1 - d2;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// ── Supabase Reminder Logging ──
async function hasReminderBeenSent(apt, reminderType, dueDate) {
  try {
    if (!sb) {
      console.warn('Supabase client not initialized');
      return false;
    }

    const { data, error } = await sb
      .from('reminder_log')
      .select('id')
      .eq('apt', apt)
      .eq('reminder_type', reminderType)
      .eq('due_date', dueDate)
      .eq('status', 'sent')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (e) {
    console.error('Error checking reminder log:', e);
    return false;
  }
}

async function logReminderSent(apt, reminderType, dueDate, email) {
  try {
    if (!sb) {
      console.warn('Supabase client not initialized');
      return;
    }

    const { error } = await sb
      .from('reminder_log')
      .insert([{
        apt,
        reminder_type: reminderType,
        due_date: dueDate,
        email,
        sent_at: new Date().toISOString(),
        status: 'sent'
      }]);

    if (error) throw error;
  } catch (e) {
    console.error('Error logging reminder:', e);
  }
}

async function logReminderSkipped(apt, reminderType, dueDate) {
  try {
    if (!sb) {
      console.warn('Supabase client not initialized');
      return;
    }

    const { error } = await sb
      .from('reminder_log')
      .insert([{
        apt,
        reminder_type: reminderType,
        due_date: dueDate,
        email: null,
        sent_at: new Date().toISOString(),
        status: 'skipped'
      }]);

    if (error) throw error;
  } catch (e) {
    console.error('Error logging skip:', e);
  }
}

// ── Reminder Sending ──
async function sendReminder(unit, reminderType, tenantEmail) {
  if (!tenantEmail) {
    console.warn(`No email for unit ${unit.apt}. Skipping.`);
    return { success: false, reason: 'no-email' };
  }

  if (!sb) {
    console.warn('Supabase client not initialized');
    return { success: false, reason: 'supabase-not-ready' };
  }

  const { subject, body } = getEmailContent(unit, reminderType);

  try {
    const { data, error } = await sb.functions.invoke('send-reminder-email', {
      body: {
        to: tenantEmail,
        subject,
        htmlBody: body
      }
    });

    if (error) throw error;
    await logReminderSent(unit.apt, reminderType, unit.due, tenantEmail);
    return { success: true };
  } catch (e) {
    console.error(`Error sending reminder for ${unit.apt}:`, e);
    return { success: false, reason: e.message };
  }
}

// ── Get Tenants Needing Reminders ──
async function getTenantsNeedingReminders() {
  const today = getToday();
  const results = [];

  if (!data || !Array.isArray(data)) {
    console.error('Data array not initialized');
    return results;
  }

  for (const unit of data) {
    if (!unit.due) continue;
    if (unit.balance === 0 && unit.rent === 0) continue;
    if (unit.archived) continue;

    const daysDiff = daysBetween(unit.due, today);
    const reminderType = getReminderType(daysDiff);

    if (!reminderType) continue;

    const alreadySent = await hasReminderBeenSent(unit.apt, reminderType, unit.due);
    if (alreadySent) continue;

    const contact = parseContactFromNote(unit.note);
    if (!contact.email) continue;

    results.push({
      unit,
      reminderType,
      daysDiff,
      tenantEmail: contact.email,
      tenantName: unit.name,
      tenantPhone: contact.phone
    });
  }

  return results;
}

// ── Main Reminder Orchestration ──
async function runDailyReminders() {
  const reminders = await getTenantsNeedingReminders();
  const results = [];

  for (const reminder of reminders) {
    const result = await sendReminder(reminder.unit, reminder.reminderType, reminder.tenantEmail);
    results.push({
      apt: reminder.unit.apt,
      name: reminder.unit.name,
      reminderType: reminder.reminderType,
      success: result.success,
      reason: result.reason
    });
  }

  return {
    timestamp: new Date().toISOString(),
    total: results.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

// ── Booking Alerts (Check-ins/Outs) ──
async function checkBookingAlerts() {
  const today = getToday();
  const checkIns = [];
  const checkOuts = [];
  const gaps = [];

  if (!data || !Array.isArray(data)) {
    return { checkIns, checkOuts, gapCount: gaps.length };
  }

  // Collect upcoming check-ins and check-outs in next 3 days
  for (const unit of data) {
    if (unit.archived) continue;

    if (unit.checkin) {
      const ciDays = daysBetween(unit.checkin, today);
      if (ciDays >= 0 && ciDays <= 3) {
        checkIns.push({
          apt: unit.apt,
          name: unit.name,
          date: unit.checkin,
          daysAway: ciDays
        });
      }
    }
    if (unit.lease_end) {
      const coDays = daysBetween(unit.lease_end, today);
      if (coDays >= 0 && coDays <= 3) {
        checkOuts.push({
          apt: unit.apt,
          name: unit.name,
          date: unit.lease_end,
          daysAway: coDays
        });
      }
    }
  }

  // Sort by daysAway
  checkIns.sort((a, b) => a.daysAway - b.daysAway);
  checkOuts.sort((a, b) => a.daysAway - b.daysAway);

  return {
    checkIns,
    checkOuts,
    gapCount: gaps.length
  };
}

// ── Monthly Report Generation ──
async function generateMonthlyReport() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (!data || !Array.isArray(data)) {
    return {
      generatedAt: now.toISOString(),
      month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalUnits: 0,
      paidCount: 0,
      overdueCount: 0,
      collectionRate: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      byOwner: {},
      upcomingCheckIns: [],
      upcomingCheckOuts: []
    };
  }

  const activeUnits = data.filter(u => !u.archived);
  const totalUnits = activeUnits.length;
  let paidCount = 0;
  let overdueCount = 0;
  let totalCollected = 0;
  let totalOutstanding = 0;
  const byOwner = {};

  for (const unit of activeUnits) {
    if (unit.balance === 0) {
      paidCount++;
      totalCollected += unit.rent;
    } else {
      overdueCount++;
      totalOutstanding += unit.balance;
    }

    if (!byOwner[unit.owner]) {
      byOwner[unit.owner] = {
        units: 0,
        paid: 0,
        outstanding: 0,
        total: 0
      };
    }
    byOwner[unit.owner].units++;
    byOwner[unit.owner].total += unit.rent;
    if (unit.balance === 0) {
      byOwner[unit.owner].paid += unit.rent;
    } else {
      byOwner[unit.owner].outstanding += unit.balance;
    }
  }

  // Upcoming moves
  const upcomingCheckIns = activeUnits.filter(u => u.checkin && daysBetween(u.checkin) >= 0 && daysBetween(u.checkin) <= 30);
  const upcomingCheckOuts = activeUnits.filter(u => u.lease_end && daysBetween(u.lease_end) >= 0 && daysBetween(u.lease_end) <= 30);

  return {
    generatedAt: now.toISOString(),
    month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    totalUnits,
    paidCount,
    overdueCount,
    collectionRate: totalUnits > 0 ? Math.round((paidCount / totalUnits) * 100) : 0,
    totalCollected: Math.round(totalCollected * 100) / 100,
    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
    byOwner,
    upcomingCheckIns: upcomingCheckIns.slice(0, 10),
    upcomingCheckOuts: upcomingCheckOuts.slice(0, 10)
  };
}

// ── Recent Reminders History ──
async function getRecentReminders(limit = 20) {
  try {
    if (!sb) {
      console.warn('Supabase client not initialized');
      return [];
    }

    const { data, error } = await sb
      .from('reminder_log')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error fetching reminder history:', e);
    return [];
  }
}

// ── Helper: get property record for a unit ──
function getPropertyForUnit(apt) {
  if (!window.propertiesData) return null;
  return propertiesData.find(p => p.internal_apt === apt || p.apt === apt) || null;
}

// ── Helper: fill template variables from unit + property data ──
function fillTemplateVars(templateBody, unit, prop) {
  const checkinDate = unit.checkin ? new Date(unit.checkin).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}) : '';
  const checkoutDate = unit.lease_end ? new Date(unit.lease_end).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}) : '';
  const nights = unit.checkin && unit.lease_end ? Math.max(0, Math.round((new Date(unit.lease_end)-new Date(unit.checkin))/(1000*60*60*24))) : '';

  const vars = {
    '{{guest_name}}': unit.name || 'Guest',
    '{{listing_name}}': (prop && prop.public_name) || (prop && prop.name) || unit.apt,
    '{{unit_name}}': unit.apt,
    '{{check_in}}': checkinDate,
    '{{check_out}}': checkoutDate,
    '{{nights}}': nights,
    '{{total_payout}}': unit.rent ? '$'+Number(unit.rent).toFixed(2) : '',
    '{{confirm_code}}': '',
    '{{address}}': (prop && prop.address) || '',
    '{{door_code}}': (prop && prop.door_code) || '',
    '{{wifi_ssid}}': (prop && prop.wifi_name) || '',
    '{{wifi_password}}': (prop && prop.wifi_password) || '',
    '{{parking_info}}': (prop && prop.parking_info) || 'See property listing for parking details',
    '{{emergency_contact}}': '',
    '{{thermostat_temp}}': '72',
    '{{pre_arrival_form_link}}': ''
  };
  let result = templateBody;
  for (const [k,v] of Object.entries(vars)) {
    result = result.split(k).join(v);
  }
  return result;
}

// ── Built-in message templates for automation ──
const AUTO_TEMPLATES = {
  tpl_check_in_instructions: {
    subject: 'Check-in Instructions - {{unit_name}}',
    body: `Welcome to {{unit_name}}!

ARRIVAL
Address: {{address}}

ENTRY
Door code: {{door_code}}
(Keypad by main entrance)

WIFI
Network: {{wifi_ssid}}
Password: {{wifi_password}}

PARKING
{{parking_info}}

Enjoy your stay!`
  },
  tpl_pre_arrival: {
    subject: 'Your check-in details for {{listing_name}}',
    body: `Hi {{guest_name}},

Welcome! Your check-in is {{check_in}}.

CHECK-IN DETAILS
Address: {{address}}
Door Code: {{door_code}}
WiFi: {{wifi_ssid}} / {{wifi_password}}

PARKING
{{parking_info}}

HOUSE RULES
- Check-in after 4 PM, check-out before 11 AM
- No smoking inside
- Respect quiet hours after 10 PM

Questions? Reply to this email.`
  },
  tpl_welcome: {
    subject: 'Welcome, {{guest_name}}!',
    body: `Hi {{guest_name}},

We're excited to welcome you to {{listing_name}}!

Your stay details:
- Check-in: {{check_in}}
- Check-out: {{check_out}}
- {{nights}} nights

We'll send detailed instructions 24 hours before check-in.

Questions before arrival? Reply to this email.`
  },
  tpl_check_out_instructions: {
    subject: 'Check-out Information - {{listing_name}}',
    body: `Hi {{guest_name}},

Thank you for staying with us! Check-out is tomorrow at 11 AM.

CHECK-OUT STEPS
1. Pack all belongings
2. Turn off lights
3. Lock all doors and windows
4. Door code will be deactivated at noon

WHAT TO LEAVE
- Keys on kitchen counter
- Trash and recycling in bins outside
- Dishes washed or loaded in dishwasher

We hope you enjoyed your stay!`
  },
  tpl_extension_offer: {
    subject: 'Enjoying your stay at {{listing_name}}? Extend it!',
    body: `Hi {{guest_name}},

We hope you're enjoying your stay at {{listing_name}}!

Your check-out is {{check_out}}. If you'd like to extend your stay, we'd love to have you longer.

Just reply to this email and we'll check availability and send you an updated quote.

Looking forward to hearing from you!`
  },
  tpl_review_request: {
    subject: 'How was your stay at {{listing_name}}?',
    body: `Hi {{guest_name}},

Thank you for staying with us! We'd love to hear about your experience at {{listing_name}}.

Your feedback helps us improve. Please leave a review when you get a chance.

Thanks!`
  }
};

// ── Show message composer modal for a check-in/out unit ──
function showAutoMessageModal(apt, messageType) {
  const unit = data.find(u => u.apt === apt);
  if (!unit) { toast('Unit not found','error'); return; }
  const prop = getPropertyForUnit(apt);

  // Pick the right template
  let templates;
  if (messageType === 'checkin') {
    templates = [
      { id:'tpl_check_in_instructions', label:'Check-In Instructions' },
      { id:'tpl_pre_arrival', label:'Pre-Arrival Details' },
      { id:'tpl_welcome', label:'Welcome Message' }
    ];
  } else if (messageType === 'checkout') {
    templates = [
      { id:'tpl_check_out_instructions', label:'Check-Out Instructions' },
      { id:'tpl_extension_offer', label:'Extension Offer' },
      { id:'tpl_review_request', label:'Review Request' }
    ];
  }

  // Get the default template
  const defaultTpl = AUTO_TEMPLATES[templates[0].id];
  const defaultBody = defaultTpl ? fillTemplateVars(defaultTpl.body, unit, prop) : '';
  const defaultSubject = defaultTpl ? fillTemplateVars(defaultTpl.subject, unit, prop) : '';

  // Parse contact from note
  const contact = parseContactFromNote(unit.note || '');

  // Build modal
  const existing = document.getElementById('autoMsgModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'autoMsgModal';
  modal.className = 'modal open';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);';
  modal.innerHTML = `
    <div style="background:var(--bg);border-radius:14px;width:620px;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25);padding:0;">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3 style="margin:0;font-size:16px;color:var(--text);font-weight:700;">
            ${messageType === 'checkin' ? '📥 Send Check-In Info' : '📤 Send Check-Out Info'}
          </h3>
          <div style="font-size:12px;color:var(--text3);margin-top:4px;">
            <strong>${unit.apt}</strong> — ${unit.name || 'Guest'}
          </div>
        </div>
        <button onclick="document.getElementById('autoMsgModal').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3);padding:4px 8px;">✕</button>
      </div>

      <div style="padding:20px 24px;">
        <div style="margin-bottom:14px;">
          <label style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);display:block;margin-bottom:4px;">Template</label>
          <select id="autoMsgTemplate" onchange="autoMsgTemplateChange('${apt}','${messageType}')" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-family:'DM Mono',monospace;font-size:12px;background:var(--surface);color:var(--text);">
            ${templates.map((t,i) => `<option value="${t.id}" ${i===0?'selected':''}>${t.label}</option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);display:block;margin-bottom:4px;">To (Email)</label>
          <input id="autoMsgTo" type="email" value="${contact.email || ''}" placeholder="guest@email.com" style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-family:'DM Mono',monospace;font-size:12px;background:var(--surface);color:var(--text);" />
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);display:block;margin-bottom:4px;">Subject</label>
          <input id="autoMsgSubject" type="text" value="${defaultSubject}" style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-family:'DM Mono',monospace;font-size:12px;background:var(--surface);color:var(--text);" />
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);display:block;margin-bottom:4px;">Message</label>
          <textarea id="autoMsgBody" rows="12" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-family:'DM Mono',monospace;font-size:12px;background:var(--surface);color:var(--text);resize:vertical;line-height:1.5;">${defaultBody}</textarea>
        </div>

        <div style="background:var(--surface2);border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:10px;color:var(--text3);">
          <strong style="color:var(--text2);">Auto-filled fields:</strong>
          Guest: ${unit.name || '—'} | Unit: ${unit.apt} | Door: ${(prop && prop.door_code) || '—'} | WiFi: ${(prop && prop.wifi_name) || '—'} | Address: ${(prop && prop.address) || '—'}
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button onclick="document.getElementById('autoMsgModal').remove()" style="padding:9px 18px;background:var(--surface2);color:var(--text2);border:1px solid var(--border);border-radius:8px;font-size:12px;cursor:pointer;font-family:'DM Mono',monospace;">Cancel</button>
          <button onclick="sendAutoMessage('${apt}')" style="padding:9px 18px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;border-radius:8px;font-size:12px;cursor:pointer;font-family:'DM Mono',monospace;font-weight:600;">✉ Send Message</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if(e.target === modal) modal.remove(); });
}

// ── Template change handler ──
function autoMsgTemplateChange(apt, messageType) {
  const unit = data.find(u => u.apt === apt);
  if (!unit) return;
  const prop = getPropertyForUnit(apt);
  const tplId = document.getElementById('autoMsgTemplate').value;
  const tpl = AUTO_TEMPLATES[tplId];
  if (tpl) {
    document.getElementById('autoMsgSubject').value = fillTemplateVars(tpl.subject, unit, prop);
    document.getElementById('autoMsgBody').value = fillTemplateVars(tpl.body, unit, prop);
  }
}

// ── Send the composed message ──
async function sendAutoMessage(apt) {
  const toEmail = document.getElementById('autoMsgTo').value.trim();
  const subject = document.getElementById('autoMsgSubject').value.trim();
  const body = document.getElementById('autoMsgBody').value.trim();

  if (!toEmail) { toast('Please enter an email address', 'error'); return; }
  if (!subject || !body) { toast('Subject and message are required', 'error'); return; }

  try {
    const res = await fetch('https://iwohrvkcodqvyoooxzmt.supabase.co/functions/v1/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sb.supabaseKey },
      body: JSON.stringify({ to: toEmail, subject, body: body.replace(/\n/g, '<br/>') })
    });
    if (!res.ok) throw new Error('Send failed');
    toast('Message sent to ' + toEmail, 'success');
    document.getElementById('autoMsgModal').remove();
  } catch(e) {
    toast('Failed to send: ' + e.message, 'error');
  }
}

// ── Render Automations Page ──
async function renderAutomations() {
  const container = document.getElementById('automationsContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="padding:32px;text-align:center;color:var(--text3);">
      Loading automations...
    </div>
  `;

  try {
    const remindersNeeded = await getTenantsNeedingReminders();
    const bookingAlerts = await checkBookingAlerts();
    const monthlyReport = await generateMonthlyReport();
    const recentReminders = await getRecentReminders(20);

    // Helper for timing label
    const timeLabel = (d) => d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : 'In ' + d + ' days';
    const timeBadgeColor = (d) => d === 0 ? 'var(--red)' : d === 1 ? 'var(--orange)' : 'var(--accent)';

    // ── Build check-in rows with actions ──
    const checkInRows = bookingAlerts.checkIns.map(ci => {
      const unitRec = data.find(u => u.apt === ci.apt);
      const unitId = unitRec ? unitRec.id : '';
      return `
        <div class="auto-move-row" style="padding:12px 14px;border-bottom:1px solid var(--blue-border);display:flex;align-items:center;gap:12px;">
          <div style="width:6px;height:6px;border-radius:50%;background:var(--blue);flex-shrink:0;"></div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;">
              <a href="#" onclick="event.preventDefault();${unitId ? `openEditModal('${unitId}')` : ''}" style="font-weight:700;color:var(--text);text-decoration:none;font-size:13px;cursor:pointer;" title="Open unit">${ci.apt}</a>
              <span style="font-size:11px;color:var(--text3);">${ci.name || ''}</span>
            </div>
            <div style="font-size:10px;color:${timeBadgeColor(ci.daysAway)};margin-top:2px;font-weight:600;">${timeLabel(ci.daysAway)} · ${ci.date}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button onclick="showAutoMessageModal('${ci.apt}','checkin')" style="padding:5px 10px;background:var(--blue);color:#fff;border:none;border-radius:6px;font-size:10px;cursor:pointer;font-family:'DM Mono',monospace;display:flex;align-items:center;gap:4px;" title="Send check-in instructions">✉ Send Info</button>
          </div>
        </div>`;
    }).join('');

    // ── Build check-out rows with actions ──
    const checkOutRows = bookingAlerts.checkOuts.map(co => {
      const unitRec = data.find(u => u.apt === co.apt);
      const unitId = unitRec ? unitRec.id : '';
      return `
        <div class="auto-move-row" style="padding:12px 14px;border-bottom:1px solid var(--orange-border);display:flex;align-items:center;gap:12px;">
          <div style="width:6px;height:6px;border-radius:50%;background:var(--orange);flex-shrink:0;"></div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;">
              <a href="#" onclick="event.preventDefault();${unitId ? `openEditModal('${unitId}')` : ''}" style="font-weight:700;color:var(--text);text-decoration:none;font-size:13px;cursor:pointer;" title="Open unit">${co.apt}</a>
              <span style="font-size:11px;color:var(--text3);">${co.name || ''}</span>
            </div>
            <div style="font-size:10px;color:${timeBadgeColor(co.daysAway)};margin-top:2px;font-weight:600;">${timeLabel(co.daysAway)} · ${co.date}</div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button onclick="showAutoMessageModal('${co.apt}','checkout')" style="padding:5px 10px;background:var(--orange);color:#fff;border:none;border-radius:6px;font-size:10px;cursor:pointer;font-family:'DM Mono',monospace;display:flex;align-items:center;gap:4px;" title="Send check-out instructions">✉ Send Info</button>
          </div>
        </div>`;
    }).join('');

    let html = `
      <div style="padding:32px;">
        <h2 style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:var(--text);">Automations</h2>

        <!-- ── KPI Cards (clickable drill-downs) ── -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:32px;">
          <div onclick="document.getElementById('auto-section-reminders').scrollIntoView({behavior:'smooth'})" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:var(--shadow);cursor:pointer;transition:transform .15s,box-shadow .15s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.1)'" onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow)'">
            <h3 style="margin:0 0 10px 0;font-size:12px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:1px;">Reminders Due</h3>
            <div style="font-size:32px;font-weight:700;color:var(--accent);font-family:'Playfair Display',serif;">${remindersNeeded.length}</div>
            <p style="margin:4px 0 0;font-size:11px;color:var(--text3);">${remindersNeeded.length === 0 ? 'All caught up!' : remindersNeeded.length + ' to contact'}</p>
          </div>

          <div onclick="document.getElementById('auto-section-checkins').scrollIntoView({behavior:'smooth'})" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:var(--shadow);cursor:pointer;transition:transform .15s,box-shadow .15s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.1)'" onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow)'">
            <h3 style="margin:0 0 10px 0;font-size:12px;font-weight:600;color:var(--blue);text-transform:uppercase;letter-spacing:1px;">Check-Ins</h3>
            <div style="font-size:32px;font-weight:700;color:var(--blue);font-family:'Playfair Display',serif;">${bookingAlerts.checkIns.length}</div>
            <p style="margin:4px 0 0;font-size:11px;color:var(--text3);">next 3 days</p>
          </div>

          <div onclick="document.getElementById('auto-section-checkouts').scrollIntoView({behavior:'smooth'})" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:var(--shadow);cursor:pointer;transition:transform .15s,box-shadow .15s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.1)'" onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow)'">
            <h3 style="margin:0 0 10px 0;font-size:12px;font-weight:600;color:var(--orange);text-transform:uppercase;letter-spacing:1px;">Check-Outs</h3>
            <div style="font-size:32px;font-weight:700;color:var(--orange);font-family:'Playfair Display',serif;">${bookingAlerts.checkOuts.length}</div>
            <p style="margin:4px 0 0;font-size:11px;color:var(--text3);">next 3 days</p>
          </div>

          <div onclick="document.getElementById('auto-section-report').scrollIntoView({behavior:'smooth'})" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:var(--shadow);cursor:pointer;transition:transform .15s,box-shadow .15s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.1)'" onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow)'">
            <h3 style="margin:0 0 10px 0;font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:1px;">Collection Rate</h3>
            <div style="font-size:32px;font-weight:700;color:var(--green);font-family:'Playfair Display',serif;">${monthlyReport.collectionRate}%</div>
            <p style="margin:4px 0 0;font-size:11px;color:var(--text3);">${monthlyReport.paidCount} of ${monthlyReport.totalUnits} paid</p>
          </div>
        </div>

        <!-- ── Check-Ins & Check-Outs (SEPARATE boxes) ── -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;">
          <!-- CHECK-INS -->
          <div id="auto-section-checkins">
            <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:8px;">
              <span style="width:20px;height:20px;background:var(--blue);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#fff;">📥</span>
              Check-Ins <span style="font-size:11px;font-weight:400;color:var(--text3);">(Next 3 Days)</span>
            </h3>
            ${bookingAlerts.checkIns.length === 0 ? `
              <div style="background:var(--blue-bg);border:1px solid var(--blue-border);border-radius:10px;padding:20px;text-align:center;color:var(--text3);font-size:12px;">
                No upcoming check-ins
              </div>
            ` : `
              <div style="background:var(--blue-bg);border:1px solid var(--blue-border);border-radius:10px;overflow:hidden;">
                ${checkInRows}
              </div>
            `}
          </div>

          <!-- CHECK-OUTS -->
          <div id="auto-section-checkouts">
            <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:8px;">
              <span style="width:20px;height:20px;background:var(--orange);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#fff;">📤</span>
              Check-Outs <span style="font-size:11px;font-weight:400;color:var(--text3);">(Next 3 Days)</span>
            </h3>
            ${bookingAlerts.checkOuts.length === 0 ? `
              <div style="background:var(--orange-bg);border:1px solid var(--orange-border);border-radius:10px;padding:20px;text-align:center;color:var(--text3);font-size:12px;">
                No upcoming check-outs
              </div>
            ` : `
              <div style="background:var(--orange-bg);border:1px solid var(--orange-border);border-radius:10px;overflow:hidden;">
                ${checkOutRows}
              </div>
            `}
          </div>
        </div>

        <!-- ── Reminders Section ── -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px;">
          <div id="auto-section-reminders">
            <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:var(--text);">Reminders to Send</h3>
            <button onclick="runRemindersClick()" style="width:100%;padding:10px 16px;margin-bottom:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-family:'DM Mono',monospace;">
              ✉ Run All Reminders
            </button>
            ${remindersNeeded.length === 0 ? `
              <div style="background:var(--green-bg);border:1px solid var(--green-border);border-radius:10px;padding:16px;color:var(--text);">
                <p style="margin:0;font-size:12px;">No reminders needed today.</p>
              </div>
            ` : `
              <div style="border:1px solid var(--border);border-radius:10px;max-height:400px;overflow-y:auto;">
                ${remindersNeeded.map(r => {
                  const unitId = r.unit.id || '';
                  return `
                  <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                    <div>
                      <a href="#" onclick="event.preventDefault();${unitId ? `openEditModal('${unitId}')` : ''}" style="font-weight:600;color:var(--text);text-decoration:none;cursor:pointer;">${r.unit.apt}</a>
                      <div style="font-size:11px;color:var(--text3);">${r.unit.name}</div>
                      <div style="font-size:10px;color:${r.reminderType.startsWith('overdue') ? 'var(--red)' : r.reminderType === 'due' ? 'var(--orange)' : 'var(--accent)'};">
                        ${r.reminderType === 'pre-3' ? '3 days before' : r.reminderType === 'pre-1' ? '1 day before' : r.reminderType === 'due' ? 'Due today' : r.reminderType.replace('overdue-', '') + ' days overdue'}
                      </div>
                    </div>
                    <div style="display:flex;gap:6px;">
                      <button onclick="sendSingleReminder('${r.unit.apt}','${r.reminderType}')" style="padding:6px 10px;background:var(--green);color:#fff;border:none;border-radius:6px;font-size:10px;cursor:pointer;font-family:'DM Mono',monospace;">Send</button>
                      <button onclick="skipReminder('${r.unit.apt}','${r.reminderType}')" style="padding:6px 10px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);border-radius:6px;font-size:10px;cursor:pointer;font-family:'DM Mono',monospace;">Skip</button>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Monthly Report Section -->
          <div id="auto-section-report">
            <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:var(--text);">Monthly Report</h3>
            <button onclick="emailMonthlyReport()" style="width:100%;padding:10px 16px;margin-bottom:12px;background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:10px;font-weight:600;cursor:pointer;font-family:'DM Mono',monospace;">
              📧 Email Report
            </button>
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;font-size:12px;">
              <div style="margin-bottom:12px;">
                <div style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Collected</div>
                <div style="font-size:18px;font-weight:700;color:var(--green);">$${monthlyReport.totalCollected.toFixed(2)}</div>
              </div>
              <div style="margin-bottom:12px;">
                <div style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Outstanding</div>
                <div style="font-size:18px;font-weight:700;color:var(--red);">$${monthlyReport.totalOutstanding.toFixed(2)}</div>
              </div>
              <div>
                <div style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Collection Rate</div>
                <div style="font-size:18px;font-weight:700;color:var(--accent);">${monthlyReport.collectionRate}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Recent Reminders ── -->
        <div>
          <h3 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:var(--text);">Recent Reminders</h3>
          ${recentReminders.length === 0 ? `
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;text-align:center;color:var(--text3);">
              <p style="margin:0;">No reminders sent yet.</p>
            </div>
          ` : `
            <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;max-height:400px;overflow-y:auto;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:var(--surface2);border-bottom:2px solid var(--border);">
                    <th style="padding:10px 14px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Apt</th>
                    <th style="padding:10px 14px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Type</th>
                    <th style="padding:10px 14px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Status</th>
                    <th style="padding:10px 14px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentReminders.map(r => `
                    <tr style="border-bottom:1px solid var(--border);">
                      <td style="padding:10px 14px;font-weight:600;">${r.apt}</td>
                      <td style="padding:10px 14px;font-size:11px;color:var(--text3);">${r.reminder_type}</td>
                      <td style="padding:10px 14px;">
                        <span style="font-size:10px;padding:4px 8px;border-radius:4px;background:${r.status === 'sent' ? 'var(--green-bg);color:var(--green)' : 'var(--orange-bg);color:var(--orange)'};">
                          ${r.status === 'sent' ? '✓ Sent' : r.status === 'skipped' ? '⊘ Skipped' : 'Pending'}
                        </span>
                      </td>
                      <td style="padding:10px 14px;font-size:10px;color:var(--text3);">
                        ${new Date(r.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (e) {
    console.error('Error rendering automations:', e);
    container.innerHTML = `
      <div style="padding:32px;color:var(--red);">
        <p>Error loading automations: ${e.message}</p>
      </div>
    `;
  }
}

// ── Button Handlers ──
async function runRemindersClick() {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = '⏳ Processing...';

  try {
    const result = await runDailyReminders();
    toast(`${result.sent} reminder${result.sent !== 1 ? 's' : ''} sent successfully!`, 'success');
    renderAutomations();
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
  }
}

async function sendSingleReminder(apt, reminderType) {
  const unit = data.find(u => u.apt === apt);
  if (!unit) return;

  const contact = parseContactFromNote(unit.note);
  const result = await sendReminder(unit, reminderType, contact.email);

  if (result.success) {
    toast(`Reminder sent to ${unit.name}!`, 'success');
    renderAutomations();
  } else {
    toast(`Failed to send reminder: ${result.reason}`, 'error');
  }
}

async function skipReminder(apt, reminderType) {
  const unit = data.find(u => u.apt === apt);
  if (!unit) return;

  await logReminderSkipped(apt, reminderType, unit.due);
  toast(`Reminder skipped for ${apt}`, 'info');
  renderAutomations();
}

async function emailMonthlyReport() {
  const report = await generateMonthlyReport();
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = '📤 Sending...';

  try {
    // This would call the Edge Function to email the report
    // For now, just show confirmation
    toast('Monthly report would be emailed (feature coming soon)', 'info');
    btn.disabled = false;
    btn.textContent = '📧 Email Report';
  } catch (e) {
    toast(`Error: ${e.message}`, 'error');
    btn.disabled = false;
    btn.textContent = '📧 Email Report';
  }
}
