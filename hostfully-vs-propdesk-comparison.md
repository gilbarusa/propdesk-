# Hostfully vs PropDesk — Feature Comparison Report

**Date:** April 3, 2026
**Purpose:** Identify Hostfully features that PropDesk doesn't have, does differently, or could improve upon. This serves as a roadmap for building PropDesk into a full Hostfully replacement.

---

## Executive Summary

After a systematic exploration of the Hostfully platform (platform.hostfully.com), this report catalogs every significant feature observed and compares it against PropDesk's current capabilities. Features are organized by module and rated by priority for implementation.

**Legend:**
- ✅ PropDesk has this feature
- ⚠️ PropDesk has a partial or simpler version
- ❌ PropDesk is missing this feature entirely
- 🔵 Nice-to-have / low priority

---

## 1. Dashboard

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| KPI Cards (Revenue, Nights Booked, Occupancy Rate, ADR, RevPar) | Yes, with % change indicators vs prior period | Has basic analytics | ⚠️ |
| New Leads / Check-ins / Checkouts tabs | Yes, with action buttons (Assign to me / View / Ignore) | No lead management | ❌ |
| Revenue by Channel pie chart | Yes (Airbnb, Hostfully, Vrbo breakdown) | No channel revenue breakdown | ❌ |
| Period comparison (this month vs last month) | Yes, percentage change on each KPI | Not implemented | ❌ |
| Lead cards with channel source icons | Yes, shows booking source and $ amount | No lead cards | ❌ |
| "+ Add lead" button | Yes, manual lead creation | No manual lead entry | ❌ |

**Priority items to build:**
- Revenue by channel breakdown chart
- KPI cards with period-over-period comparison
- Check-in / Check-out today summary

---

## 2. Inbox / Messaging

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| 3-panel layout (conversations / thread / details) | Yes | Yes (similar layout) | ✅ |
| "Suggest an answer" AI button | Yes, AI-powered reply suggestions | Has reply-kb.js with keyword matching | ⚠️ |
| "Send via channel" dropdown | Yes, choose which platform to send through | No channel selection | ❌ |
| Check-out countdown circle | Yes, visual countdown in thread header | No visual countdown | ❌ |
| Assignee field | Yes, assign conversations to team members | No team assignment | ❌ |
| Guest breakdown (adults / infants) | Yes | Has guest count but no breakdown | ⚠️ |
| Cancel booking button in thread | Yes, directly from inbox | No in-thread booking actions | ❌ |
| Unread badges | Yes | Yes | ✅ |
| Message caching | Unknown | Yes (60s TTL) | ✅ |

**Priority items to build:**
- "Send via channel" — critical for multi-platform messaging when APIs are connected
- AI-powered reply suggestions (upgrade reply-kb.js to use LLM)
- Check-out countdown display
- Team member assignment (if expanding beyond solo use)

---

## 3. Pipeline

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Visual stage flow (Quote → Hold → Booked → Stay → Check-out) | Yes, with circular progress indicators | Has pipeline.js with stages | ⚠️ |
| Countdown timers per booking | Yes, days until next stage | Not implemented | ❌ |
| Filters: Status / Channel / Agent / Property / Dates | Yes, comprehensive filtering | Basic filtering | ⚠️ |
| Stage progression indicators | Yes, circular completion rings | No visual indicators | ❌ |
| Booking type badges | Yes (inquiry vs confirmed) | Not differentiated | ❌ |

**Priority items to build:**
- Visual countdown timers
- Channel and date range filters
- Stage progression indicators

---

## 4. Calendar

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Gantt-style timeline view | Yes, horizontal bars across dates | Yes (similar) | ✅ |
| Booking View / Price View toggle | Yes, two separate modes | Yes (dual mode) | ✅ |
| Slider filters (bedrooms, guests, daily rate) | Yes, interactive range sliders | Search/filter but no sliders | ⚠️ |
| Amenities / Tags multi-select filter | Yes | Not implemented | ❌ |
| "Email property list" feature | Yes, email filtered property list to someone | Not implemented | 🔵 |
| Price management in calendar | Yes, set prices directly on calendar cells | Yes (drag-to-set pricing) | ✅ |
| Minimum stay by day of week in calendar | Yes | Not implemented in calendar view | ❌ |
| Check-in/out restrictions in calendar | Yes | Not implemented in calendar view | ❌ |

**Priority items to build:**
- Amenity/tag filtering on calendar
- Min stay and check-in/out rules visible on calendar

---

## 5. Analytics

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Analytics + Hosting Quality tabs | Yes, two separate views | Basic analytics only | ⚠️ |
| Period comparison | Yes, compare across date ranges | Not implemented | ❌ |
| Financial Performance chart | Yes | Has Chart.js but limited | ⚠️ |
| Revenue by Channel pie | Yes | Not implemented | ❌ |
| Property / Channel / Date filters | Yes | Basic filters | ⚠️ |
| Hosting Quality metrics | Yes (separate tab) | Not implemented | ❌ |

**Priority items to build:**
- Revenue by channel chart
- Period comparison
- Hosting quality metrics (response time, review scores, etc.)

---

## 6. Channels Management

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Per-channel ON/OFF toggles | Yes | Has channel enable/disable per property | ✅ |
| Rate Multiplier per channel | Yes (e.g., Airbnb +12%, Booking.com +15%) | Yes — Airbnb +12%, VRBO +8%, Booking.com +15%, Direct 0% with live preview | ✅ |
| Channel-specific settings | Yes | Yes — per-channel status, multiplier, rate preview | ✅ |
| Channel icons and branding | Yes | Basic text labels | ⚠️ |

**Priority items to build:**
- Channel icons and visual branding (cosmetic improvement)
- NOTE: Rate multiplier already fully implemented with commission tips per channel

---

## 7. Properties / Property Settings

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Property Type dropdown | Yes | Yes | ✅ |
| Weblink | Yes (custom property URL) | Not implemented | 🔵 |
| Number of Floors | Yes | Not implemented | 🔵 |
| Property Size (sq ft) | Yes | Not implemented | 🔵 |
| Internal Thumbnail | Yes (upload per property) | Has photo management | ✅ |
| Base Guests / Max Guests | Yes | Yes | ✅ |
| Extra Guest Fee (per guest/night) | Yes ($10/guest/night) | Yes | ✅ |
| Set rooms and bed types | Yes (detailed room config) | Has bedrooms/bathrooms | ⚠️ |
| Booking Type dropdown (inquiry vs instant) | Yes | Not implemented | ❌ |
| Minimum Stay (with day-of-week override) | Yes | Has min stay, no day-of-week | ⚠️ |
| Maximum Stay | Yes (365 nights) | Has max stay | ✅ |
| Min. Weekend Stay | Yes (separate weekend minimum) | Has weekend minimums | ✅ |
| Booking Window | Yes (e.g., 12 months out) | Not implemented | ❌ |
| Turnover Days | Yes (gap between bookings) | Not implemented | ❌ |
| Booking Lead Time | Yes (e.g., -12h minimum) | Not implemented | ❌ |
| Only Check-in On (day restrictions) | Yes (restrict to specific days) | Not implemented | ❌ |
| Check-in Time / Checkout Time | Yes | Basic check-in/out info | ⚠️ |
| % At Reservation | Yes (e.g., 50% deposit) | Not implemented | ❌ |
| Collect Balance At (X days before) | Yes (e.g., 7 days before) | Not implemented | ❌ |
| Wifi Network / Password | Yes | Yes | ✅ |
| External ID | Yes | Yes (Airbnb/VRBO/Booking IDs) | ✅ |
| Active/Inactive toggle | Yes | Not a toggle on property card | ⚠️ |
| "Set Permissions" per property | Yes (user access control) | Not implemented | ❌ |
| Tagging system ("Add tag...") | Yes | Not implemented | ❌ |
| Property search by name or UID | Yes | Yes (search) | ✅ |
| Descriptions (10 fields) | Yes | Yes (10 fields) | ✅ |
| Photos with upload | Yes | Yes | ✅ |
| Amenities (categorized) | Yes | Yes (60+ items) | ✅ |
| Service Providers tab | Yes | Yes | ✅ |
| Owner tab | Yes | Yes | ✅ |

**Priority items to build:**
- Turnover days — CRITICAL for preventing back-to-back bookings without cleaning time
- Booking lead time — prevents last-minute bookings
- % At Reservation / Collect Balance — payment scheduling
- Booking window limit
- Check-in day restrictions
- Property tagging system

---

## 8. Pricing

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Nightly Base Price | Yes | Yes | ✅ |
| Currency selector | Yes | Not implemented (assumes USD) | 🔵 |
| Tax Rate (%) | Yes | Yes | ✅ |
| Long-term stay exemption | Yes (checkbox) | Not implemented | ❌ |
| Security Deposit | Yes | Yes | ✅ |
| Weekend Rate Adjustment (%) | Yes | Yes | ✅ |
| Cleaning Fee | Yes | Yes | ✅ |
| Cleaning Fee Tax (%) | Yes (separate from room tax) | Not separate | ⚠️ |
| Minimum Price Rule | Yes (enable/disable) | Not implemented | ❌ |
| Bulk-Save pricing | Yes (save to multiple properties) | Has bulk operations | ✅ |
| Price Rules table | Yes (Name, Type, Channels, % Change, Condition, Applies to) | Has dynamic price rules | ⚠️ |
| "Override Airbnb Rule Sets" toggle | Yes | Not implemented | ❌ |
| Length of Stay discount rules | Yes (e.g., stay >= 13 nights = -2%) | Yes (length of stay discounts) | ✅ |
| Short-stay premium rules | Yes | Yes | ✅ |
| Per-channel price rule targeting | Yes (apply rule to specific channels) | Not per-channel | ❌ |

**Priority items to build:**
- Per-channel price rule targeting — lets you have different discount structures per OTA
- Long-term stay tax exemption
- Minimum price floor rule
- Separate cleaning fee tax rate

---

## 9. Fees, Taxes & Policies

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Custom fee items table | Yes (Name, Type, Value, Tax Rate, Scope, Channels) | Yes (name, type, value, tax rate) | ⚠️ |
| Fee scope options (per booking, per night, per pet per night, etc.) | Yes | Has basic scope | ⚠️ |
| Per-channel fee assignment | Yes (fee applies to specific channels only) | Not per-channel | ❌ |
| "Applies to X properties" bulk assignment | Yes | Not implemented | ❌ |
| House Rules section | Yes (with Add Rule) | Has rules in amenities | ⚠️ |
| Property Expectations | Yes (with Add Expectation) | Not implemented | ❌ |

**Priority items to build:**
- Per-channel fee assignment
- Bulk fee assignment across properties

---

## 10. Templates & Triggers (Automation)

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| System Templates (Quote, Hold Confirmation, Hold Reminder, etc.) | Yes, 6+ built-in templates | Has 7 email templates | ✅ |
| Template variables ([$PROPERTY_NAME$] etc.) | Yes | Yes (dynamic variable substitution) | ✅ |
| Multi-language templates | Yes ([Add Language]) | Not implemented | 🔵 |
| Rich text editor with HTML view | Yes | Basic template editing | ⚠️ |
| "Insert a Variable" button | Yes (visual variable picker) | Not implemented | ⚠️ |
| ON/OFF toggle per template | Yes | Not implemented | ❌ |
| "Send copy to agency" checkbox | Yes | Not implemented | 🔵 |
| Custom Templates tab | Yes (create your own) | Has template management | ✅ |
| Triggers tab | Yes (event → action mapping) | Has mailing rules | ⚠️ |
| Trigger events: Booking inquiry, confirmed, request, paid, complex condition | Yes | Has scheduling triggers | ⚠️ |
| Trigger actions: Send Email, Send SMS, Post Review | Yes (3 action types) | Email only | ⚠️ |
| Send to: Guest, Team, Multiple | Yes | Guest only | ⚠️ |
| Automatic Airbnb 5-star review posting | Yes (complex condition trigger) | Not implemented | ❌ |
| Balance due reminders (complex condition) | Yes | Yes (automation.js) | ✅ |
| Scheduled Messages queue | Yes (view upcoming messages with dates) | Not visible as queue | ❌ |
| Message Log | Yes (history of sent messages) | Not implemented | ❌ |
| Custom Data tab | Yes | Not implemented | 🔵 |
| Reviews management tab | Yes | Not implemented | ❌ |
| Pre-Arrival Form | Yes (dedicated tab) | Has pre-arrival in pipeline | ⚠️ |

**Priority items to build:**
- SMS sending capability (when APIs connected)
- Automatic review posting — HIGH PRIORITY, saves significant time
- Scheduled messages queue view
- Message log / history
- Template ON/OFF toggles
- "Send to team" notification triggers

---

## 11. Reports

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Financial Reports | Yes (Bookings Report with full financial breakdown) | Basic reports | ⚠️ |
| Owner Statements | Yes (per-owner financial statements) | Not implemented | ❌ |
| Transactions tab | Yes | Not implemented | ❌ |
| Logistics Reports | Yes | Not implemented | ❌ |
| Enhanced Reports | Yes | Not implemented | ❌ |
| Bookings Report columns (Property, Guest, Source, Res#, Check-In/Out, Nights, Rent, Discount, Fees, Tax, Total, Guest Paid, Guest Balance, Due Agency, Due Owner) | Yes, very detailed | Has basic booking data | ⚠️ |
| Owner Adjustments Report | Yes (expenses by property/owner) | Not implemented | ❌ |
| Date range filters | Yes | Not implemented | ⚠️ |
| Owner / Property dropdown filters | Yes | Not implemented | ⚠️ |
| Export Extended Data | Yes | Has CSV export | ⚠️ |
| Generate Statement | Yes (formal owner statements) | Not implemented | ❌ |

**Priority items to build:**
- Owner Statements — HIGH PRIORITY if managing properties for owners
- Full financial report with all columns
- Transaction history
- Formal statement generation (PDF/printable)

---

## 12. Integrations / Marketplace

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Integration marketplace | Yes (15+ categories) | No marketplace | ❌ |
| Stripe payment processing | Yes (connected to 32 properties) | Not implemented | ❌ |
| Dynamic pricing (PriceLabs) | Yes | Not implemented | ❌ |
| Cleaning & Turnover tools | Yes (category) | Not implemented | ❌ |
| Smart locks / Home Automation | Yes (category) | Not implemented | ❌ |
| Digital Signatures | Yes (category) | Not implemented | ❌ |
| Guest Experience tools | Yes (category) | Not implemented | ❌ |
| Insurance & Screening | Yes (category) | Not implemented | ❌ |

**Priority items to build:**
- Stripe integration — HIGH PRIORITY for direct booking payments
- Smart lock integration (for access code management)

---

## 13. Agency / Account Settings

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Company profile (name, address, phone, website, logo) | Yes | Has basic config | ⚠️ |
| Team management (invite members, assign roles) | Yes (Manager roles) | Single user only | ❌ |
| Account Status tab | Yes | Not implemented | 🔵 |
| Service Providers (agency level) | Yes | Has per-property providers | ⚠️ |
| Rental Conditions | Yes (dedicated tab) | Has cancellation policies | ⚠️ |
| Email Settings | Yes (dedicated tab) | Not implemented | ❌ |
| Direct Booking Website | Yes (hosted booking site) | Not implemented | ❌ |
| White Labeling | Yes | Not implemented | 🔵 |

**Priority items to build:**
- Direct Booking Website — would enable taking bookings without OTA fees
- Email settings (custom sender, signatures)
- Team management (if scaling beyond solo use)

---

## 14. Other Hostfully Features

| Feature | Hostfully | PropDesk | Status |
|---------|-----------|----------|--------|
| Owners management page | Yes (alphabetical, add new) | Has owner field per property | ⚠️ |
| Publishing Tools | Yes (in dropdown menu) | Not explored | ❌ |
| Third Party Agency | Yes (in dropdown menu) | Not implemented | 🔵 |
| Calendar Tools | Yes (in dropdown menu) | Not explored | ❌ |
| Promo Codes | Yes | Not implemented | ❌ |
| Refer a Friend | Yes | Not applicable | 🔵 |

---

## Top Priority Roadmap

### Phase 1 — Critical Missing Features (High Impact)
1. **Stripe Payment Integration** — Per-property Stripe accounts for short-term bookings. Also implement ACH payments for long-term and month-to-month rent collection. This is a major differentiator since PropDesk handles both rental types.
2. **Pre-Arrival Form & Rental Agreement System** — Hostfully automatically sends pre-arrival forms and rental agreements to confirmed guests, then shows tiny status icons on each pipeline booking (green checkmark = filled/signed). PropDesk needs: a configurable pre-arrival form (government ID, extra guests, visitors, party policy, flight number, reason for trip), a digital rental agreement with e-signature, automatic sending via trigger, and status tracking icons on pipeline cards.
3. **Turnover Days** — Prevent back-to-back bookings without cleaning gaps
4. **Owner Statements / Financial Reports** — Hostfully generates formal statements with Due Agency / Due Owner columns, transactions log, and exportable data
5. **Automatic Review Posting** — Hostfully auto-posts 5-star Airbnb reviews via a complex condition trigger

### Phase 2 — Important Operational Features
6. **Booking Lead Time & Booking Window** — Control when guests can book
7. **% At Reservation / Balance Collection** — Payment scheduling (50% deposit, balance X days before)
8. **Per-Channel Price Rules & Fees** — Different discount rules and fee structures per OTA
9. **Scheduled Messages Queue View** — See what automated messages are going out and when
10. **Message Log** — Full audit trail for all automated communications sent

### Phase 3 — Enhancement & Polish
11. **Revenue by Channel Analytics** — Understand which platforms perform best
12. **KPI Dashboard with Period Comparison** — Business intelligence with % change indicators
13. **Check-in Day Restrictions** — Useful for weekly rentals (only check-in on Saturday, etc.)
14. **SMS Sending** — Multi-channel guest communication (when APIs connected)
15. **Property Tagging System** — Better organization and filtering

### Phase 4 — Advanced Features
16. **Long-term & MTM Rental Development** — Full lease management with Stripe ACH, payment tracking, lease renewal automation
17. **Direct Booking Website** — Bypass OTA commissions entirely
18. **Team Management** — Multi-user support with roles
19. **Integrations Marketplace** — Smart locks, dynamic pricing tools, etc.
20. **AI Reply Suggestions** — Upgrade keyword matching to LLM-powered responses

---

## What PropDesk Already Does Well

PropDesk has strong foundations in several areas that match or exceed Hostfully:

- **Rate Multiplier per Channel** — Full implementation with Airbnb +12%, VRBO +8%, Booking.com +15%, Direct 0%, live rate preview, and commission tips
- **Property Settings depth** — 10 description fields, 60+ amenities, detailed room configs
- **Dynamic Pricing** — Drag-to-set calendar pricing, multiple rule types (length of stay, short-stay premium, early bird, last minute)
- **Reply Knowledge Base** — Intent detection with confidence scoring across 8 categories
- **Long-term Rental Support** — Hostfully is purely short-term; PropDesk handles long-term leases, month-to-month, and short-stays
- **Rent Payment Tracking** — Due dates, overdue escalation, payment status — not a Hostfully feature
- **Action Items / Drill Down** — Unit-level actionable items and detailed drill-down capabilities
- **Audit Logging** — Change tracking per unit
- **Archive System** — Moved-out tenant management
- **Backup Management** — Built-in backup with history
- **Multi-rental-type Support** — Hostfully only handles short-term vacation rentals. PropDesk's ability to manage long-term, month-to-month, AND short-stay in one system is a major competitive advantage.

These are competitive advantages that should be maintained and highlighted.

---

## Key Hostfully Feature Deep-Dive: Pre-Arrival & Agreement Workflow

One of Hostfully's most valuable operational features is the automated pre-arrival and agreement system:

**How it works in Hostfully:**
1. When a booking is confirmed, Hostfully automatically sends a pre-arrival form link to the guest (via email trigger)
2. The guest fills in: Government ID, phone number, extra guest names, whether they'll have visitors or parties, email address, flight number, reason for trip
3. Hostfully also sends a rental agreement for e-signature
4. On the Pipeline page, each booking shows small green checkmark icons indicating whether the form was completed and the agreement was signed
5. All this data is visible in the booking's "Stay Details" tab

**What PropDesk should build:**
- Configurable pre-arrival form builder (select which fields to require per property)
- Digital rental agreement template with e-signature capture
- Automatic trigger to send both upon booking confirmation
- Status icons on pipeline cards (form filled / agreement signed)
- Stay Details view in booking modal showing collected guest data
- Payment Timeline tab showing deposit/balance schedule and payment status
