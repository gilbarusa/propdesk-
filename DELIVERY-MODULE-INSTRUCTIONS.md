# Delivery / Mailroom Module — Build Instructions

**Important:** This app will also be integrated into the main client portal, so tenant identity, unit mapping, contact preferences, package status, and community updates should be built as shared data/services rather than as a completely separate standalone system.

---

## 1. What This Module Is

A package delivery notification and tracking system for residential buildings. It replaces the existing standalone PHP app at `delivery.chelbourne.com` which uses MySQL + Twilio. The new version will be:

1. A **PropDesk admin module** (Delivery tab in the PropDesk SPA)
2. A **standalone kiosk/lobby interface** for front desk staff to log packages
3. An **integrated client-app module** so tenants can view/manage their packages from the tenant portal

---

## 2. Existing System Analysis (delivery-notice.php)

### Current Architecture
- PHP + MySQL (database: `packgdelivery`)
- Twilio SMS (SID: `AC4fe8bfa3c407760bc1b33770fb4f465a`, from: `+19894871292`)
- jQuery frontend with numpad.js for kiosk touch input
- Single config.php handles ALL POST endpoints via `requestType` parameter

### Database Tables (derived from code)
- **signup** — tenant SMS registration: `sId`, `unitNumber`, `phoneNumber`, `createdTime`, `modifiedTime`
- **courierpackages** — active/pending packages: `packId`, `unitNumber`, `packages` (count), `totalPack`, `courier`, `status` (Pending/Collected), `createdTime`, `modifiedTime`, `collectedTime`
- **reports** — activity log: `unitNumber`, `reportLog`, `createdTime`
- **messagelog** — SMS history: `unitNumber`, `messageSid`, `fromNumber`, `toNumber`, `message`, `messageTime`

### Current Features
- **Courier Notice** (delivery-notice.php): Select courier (Amazon/UPS/Fedex/USPS/Food/Other), enter unit #, package count → sends SMS to registered tenant
- **Bulk Notice**: Enter up to 10 unit/package/courier rows at once
- **SMS Signup** (signup.php): Tenant enters unit + phone → registers for notifications, includes SMS consent disclaimer
- **Incoming SMS** (incoming-sms.php): Tenant replies "1" to confirm pickup → marks packages collected; replies "STOP" → deletes from signup
- **Admin** (admin.php): Password = yesterday's date (YYYYMMDD format), sections for report log, signup report, add/edit/delete units, delete packages, rotating images (kiosk display)
- **Daily Cron**: Sends reminder SMS to all pending packages ("your packages are waiting in lobby, returned after 7 days")
- **Auto-timeout**: 60 seconds of inactivity → redirects to index.php (kiosk behavior)

### Current SMS Messages
- Package arrival: "Dear residence unit {unit}, you have {count} package(s) delivered by {courier} waiting for you in lobby area. Visit delivery.chelbourne.com to confirm you picked up your packages or reply 1 to confirm."
- Daily reminder: "Reminder, your package(s) are waiting in lobby, they will be returned after 7 days"
- Pickup confirmed via reply "1", opt-out via reply "STOP"

---

## 2b. Existing UI Reference (from screenshots)

### Layout
- **Two-column layout**: Left side = navigation + rotating content; Right side = active content area
- **Header**: Willow Partnership logo (top-left), "Home" button (top-right, blue pill)
- **Left navigation** (purple/dark blue background): Sign-up | Delivery Notice (UPS, Fedex, Amazon, USPS ETC) | Confirm Collecting | Admin Login — currently selected item gets a darker highlight bar
- **Footer**: "For contact info please call 267-865-0001 or email: general@willowpa.com"
- **Building branding**: "Chelbourne Plaza Condominium Association" in cursive script, displayed above rotating content

### Screen-by-Screen Reference

**1. Home / Dashboard** — "Currently Packages Waiting" table on right showing all pending packages: Unit | #packg | SMS Opt (Y/N) | Time. Left side rotates through uploaded images/announcements. This is the main kiosk idle screen.

**2. Courier Notice — Single Mode** — Six courier buttons in a 2×3 grid, each with the courier's logo (Amazon, UPS, FedEx, USPS, Food, Other). Below: "Unit #" input field, "Number of Packages" input field, "Confirm" button (dark blue). On-screen numpad pops up for input fields.

**3. Courier Notice — Bulk Mode** — Toggle between "Single Notice" and "Bulk Notice" buttons at top. Bulk shows a 10-row table: Unit Number | Packages | Courier (dropdown: Select Courier / Amazon / UPS / Fedex / USPS / Food / Other). "Send Bulk Notice" button at bottom.

**4. Signup for SMS Notifications** — "Unit #" input, "SMS Number" input, consent disclaimer checkbox with full legal text, "Accept" button. Both fields use on-screen numpad.

**5. Confirm Collecting** — Simple screen: "Unit #" input field + "Confirm" button. Tenant or staff enters unit to mark all pending packages as collected.

**6. Admin Area (main menu)** — Six navigation buttons: Admin Login | Report Log | Signup Report | Add/Edit/Delete | Edit Package | Rotating Images. Password = yesterday's date in YYYYMMDD format.

**7. Admin — Report Log** — Date range picker (two date inputs), table with columns: Unit | Date Time | Log. Shows entries like "1 package" logged per unit.

**8. Admin — Add/Edit/Delete (single unit)** — "Show All Units" button at top. Below: single "Unit" input field for searching. When found, shows phone number with Edit/Delete options.

**9. Admin — Add/Edit/Delete (all units)** — Triggered by "Show All Units" button. Full table with checkboxes: ☐ | Unit | Phone Number (editable input). Shows all registered units (101, 102, 103, 104, 105, 106, 107, 108, ... through 345). Bottom: "Update Selected Units" + "Delete Selected Units" buttons.

**10. Admin — Delete/Edit Packages** — Table with checkboxes: ☐ | Unit | #packg | SMS Opt | Time. Shows all pending packages. "DELETE" button at bottom to remove selected. Same data as dashboard but with bulk delete capability.

**11. Admin — Rotating Images** — "Choose File" upload button. Below: list of uploaded images/PDFs with "Delete" link next to each. Currently shows: Official Vehicle Registration form (PDF), tow warning flyer, Community News (January 2023), water leak repair notice, Willow Partnership branding image, basement storage space announcement.

### Rotating Content (kiosk left panel)
The left side of the kiosk cycles through uploaded images/announcements:
- Chelbourne Plaza vehicle registration form (official document)
- "GET A PARKING TAG OR PARK ON THE STREET — WARNING: Your Car Will Be TOWED" flyer
- Community News (dated January 2023) with building updates
- "FREE - In units water leaks repair" notice with no-faucet icon
- Willow Partnership "WE ARE" branding image
- "Basement storage space is available now!" with photo of storage units and guidelines (4×6 sizes, on-demand, no flammable items)

### Current Active Package Data (from screenshots, as of ~Mar-Apr 2026)
20 units with pending packages: 103(1), 104(3), 107(1), 110(8), 111(1), 127(1), 132(3), 219(1), 225(1), 226(4), 305(1), 306(3), 309(1), 311(1), 315(2), 316(3), 317(1), 322(1), 327(1), 333(1). Unit 305 is the only one without SMS opt-in (N). Most were logged around March 20, 2026.

### Registered Units (partial, from screenshots)
Units 101–108 visible with phone numbers: 101(2673338877), 102(2676256117), 103(2158969926), 104(7247575692), 105(2679714434), 106(2156630893), 107(2152903534), 108(2156880386), ... through 345(2159178700).

---

## 3. New Module Architecture

### Storage
- **Flat-file JSON** (matching PropDesk/tech.willowpa.com pattern)
- Data directory: `/propdesk/delivery/data/`
- Files:
  - `tenants.json` — unit-to-contact mapping (shared with client app)
  - `packages.json` — all package records
  - `reports.json` — activity/audit log
  - `messages.json` — SMS/notification log
  - `settings.json` — building config, kiosk images, notification preferences
  - `community-updates.json` — kiosk display messages / building announcements

### SMS Provider
- **Flowroute** (NOT Twilio) — same as tech.willowpa.com and parking module
- Use Flowroute REST API v2.1 for sending SMS
- Credentials shared from tech.willowpa.com config

### File Structure
```
/propdesk/delivery/
  ├── api.php          — REST API (shared backend for all 3 interfaces)
  ├── config.php       — credentials, paths, helpers
  ├── kiosk.html       — standalone lobby/kiosk interface
  ├── receipt.php      — printable package receipt/slip
  ├── data/
  │   ├── tenants.json
  │   ├── packages.json
  │   ├── reports.json
  │   ├── messages.json
  │   ├── settings.json
  │   └── community-updates.json
  └── assets/          — kiosk CSS, images
```

### Three Access Modes

#### Mode 1: PropDesk Admin (Delivery tab)
- Lives inside the PropDesk SPA as a module tab
- Sub-tabs: **Packages** | **Tenants** | **Reports** | **Kiosk Settings**
- Admin can: view all pending/collected packages, log new deliveries, manage tenant contacts, view SMS history, configure kiosk images/messages, run reports

#### Mode 2: Standalone Kiosk (kiosk.html)
- Touch-friendly interface for lobby tablet/screen
- Front desk staff: select courier → enter unit → enter count → confirm
- Bulk entry mode (same as current)
- Auto-timeout to screensaver/rotating images after 60s inactivity
- No authentication needed (public-facing, unit-based input)
- Numpad on-screen keyboard for touch devices

#### Mode 3: Client App Integration (tenant portal module)
- **NOT a separate page** — exposed as reusable service functions and API endpoints
- Shows inside the client app as a native-feeling "Packages" section
- Logged-in tenant sees:
  - Active packages waiting for pickup
  - Package history (delivered, collected, returned)
  - Notification preferences (SMS on/off, phone number)
  - "Confirm Pickup" button
  - Building/community updates (same content as kiosk display)
- Tenant identity comes from the client app session (no re-entering unit/phone)

---

## 4. API Endpoints (api.php)

All endpoints at `/propdesk/delivery/api.php`

### Public Endpoints (kiosk / client app)
| Method | Action | Params | Description |
|--------|--------|--------|-------------|
| POST | `log-package` | unit, count, courier | Log a new delivery (kiosk) |
| POST | `bulk-log` | records[] (unit, count, courier) | Bulk delivery entry |
| GET | `packages-by-unit` | unit | Get active packages for a unit |
| GET | `package-history` | unit, limit? | Package history for a unit |
| POST | `confirm-pickup` | unit | Mark all pending packages as collected |
| POST | `register-tenant` | unit, phone, consent | SMS signup |
| GET | `community-updates` | — | Get kiosk/community announcements |
| GET | `kiosk-images` | — | Get rotating image list |

### Admin Endpoints (Bearer token auth)
| Method | Action | Params | Description |
|--------|--------|--------|-------------|
| GET | `admin-packages` | status?, date_from?, date_to? | List all packages with filters |
| GET | `admin-tenants` | — | List all registered tenants |
| POST | `admin-update-tenant` | unit, phone | Update tenant phone |
| DELETE | `admin-delete-tenant` | unit | Remove tenant registration |
| DELETE | `admin-delete-packages` | units[] | Delete package records |
| GET | `admin-reports` | date_from, date_to, type | Activity/signup reports |
| GET | `admin-stats` | — | Dashboard KPIs |
| POST | `admin-upload-image` | file | Upload kiosk image |
| DELETE | `admin-delete-image` | filename | Remove kiosk image |
| POST | `admin-community-update` | title, body, active | Create/update announcement |
| POST | `admin-send-reminder` | — | Trigger manual reminder to all pending |

### Client App Service Endpoints
These endpoints are specifically designed for the client app to consume:
| Method | Action | Params | Description |
|--------|--------|--------|-------------|
| GET | `tenant-packages` | tenant_id or unit | Active packages for authenticated tenant |
| GET | `tenant-history` | tenant_id or unit, limit? | Package history |
| POST | `tenant-confirm-pickup` | tenant_id or unit | Confirm pickup from client app |
| GET | `tenant-preferences` | tenant_id or unit | Get notification preferences |
| POST | `tenant-preferences` | tenant_id or unit, sms, phone, email, whatsapp | Update notification prefs |
| GET | `tenant-updates` | — | Community updates for tenant view |

---

## 5. Client App Integration Requirements

### Data Sharing
- Tenant/unit/contact data should be **shared, not duplicated**
- The client app is the **source of truth** for tenant identity, unit assignment, phone, email, and WhatsApp preferences
- The delivery module reads tenant data from the shared source; only stores delivery-specific data (packages, logs)
- Package status is queryable by unit or tenant_id

### Reusable Service Functions
The business logic must be extractable, not trapped in page-specific code. Key functions:
```
createPackageNotice(unit, count, courier)    → logs package + sends SMS
getActivePackages(unit)                       → returns pending packages
markPackageCollected(unit)                    → confirms pickup
updateNotificationPrefs(unit, prefs)          → SMS/email/WhatsApp settings
getCommunityUpdates()                         → kiosk/building announcements
getTenantPackageHistory(unit, limit)           → historical records
```

### Login / Identity Logic
- **Kiosk flows**: Unit-based input (no login required)
- **Client app flows**: Everything tied to authenticated tenant/account automatically
- **No duplicate profile records** — if a tenant exists in the client app, don't create a separate signup record
- **Tenant lookup**: api.php should accept both `unit` and `tenant_id` for flexibility

### UI Expectation
- Inside the client app, the package section must feel like a **native module**, not a bolted-on external page
- Consistent styling with the client app design system
- No iframes — direct API integration

---

## 6. PropDesk Admin Module (Delivery Tab)

### Sub-tabs
Uses the existing MODULE_SUB_TABS system with new `dlSec` parameter:
```javascript
'delivery': [
  {label:'Packages',  page:'delivery', dlSec:'packages'},
  {label:'Tenants',   page:'delivery', dlSec:'tenants'},
  {label:'Reports',   page:'delivery', dlSec:'reports'},
  {label:'Kiosk',     page:'delivery', dlSec:'kiosk'}
]
```

### Packages Section
- KPI cards: Pending Packages | Collected Today | Total This Month | Units Waiting
- Table: Unit | Packages | Courier | Status | Logged | Collected | Actions
- Quick-add form: courier selector + unit + count (same flow as kiosk but in admin UI)
- Bulk add option
- Filter by status (Pending/Collected/All), date range
- "Send Reminder" button — sends SMS to all pending

### Tenants Section
- Table: Unit | Phone | Registered | Last Modified | Actions (Edit/Delete)
- Add new tenant form: unit + phone
- Bulk view/edit like current admin "Show All Units"
- Import from client app option

### Reports Section
- Date range picker
- Two report types: Activity Log | Signup Report (matching current)
- Table display with pagination

### Kiosk Section
- Upload/manage rotating images (PNG/JPG/PDF)
- Preview current rotation
- Community updates/announcements editor (title + body + active toggle)
- Kiosk settings: auto-timeout duration, building name display

---

## 7. Kiosk Interface (kiosk.html)

### Design Requirements
- Touch-optimized, large buttons
- On-screen numpad for unit # and package count input
- Courier quick-select buttons: Amazon | UPS | FedEx | USPS | Food | Other
- Single notice mode (default) + Bulk notice mode toggle
- Auto-timeout: 60s inactivity → rotating images/screensaver
- SMS consent disclaimer on signup page
- Building branding header

### Pages/Screens
1. **Home** — rotating images / community updates / navigation
2. **Courier Notice** — select courier → unit → count → confirm
3. **Bulk Notice** — multi-row entry table
4. **SMS Signup** — unit + phone + consent checkbox
5. **Package Check** — tenant enters unit → sees pending packages → can confirm pickup

### SMS Consent Disclaimer
Reuse the existing text from signup.php:
> "By providing my contact information, I give my express written consent to receive SMS messages and emails for service updates, notifications, and promotional content. Message and data rates may apply. Message frequency may vary. Reply STOP to unsubscribe or HELP for assistance."

---

## 8. Notification System

### SMS via Flowroute
- Use same Flowroute credentials as tech.willowpa.com
- Send function: `sendDeliverySMS(toNumber, message)`
- Log all messages to messages.json

### Message Templates
- **New package**: "Unit {unit}: {count} package(s) delivered by {courier} waiting in lobby. Reply 1 to confirm pickup. Reply STOP to opt out."
- **Daily reminder**: "Reminder: your package(s) are waiting in lobby. They will be returned after 7 days."
- **Pickup confirmed**: Internal log only (no SMS to tenant on pickup)

### Incoming SMS Handling
- Reply "1" → mark packages as collected for that phone's unit
- Reply "STOP" → remove from SMS notifications
- Webhook endpoint for Flowroute incoming messages

---

## 9. Data Migration

Migrate from existing MySQL-based system:
- Export `signup` table → `tenants.json`
- Export `courierpackages` table → `packages.json`
- Export `reports` table → `reports.json`
- Rotating images from `uploads/` directory

---

## 10. Function Naming Conventions

Following PropDesk patterns:
- `WPA_` prefix for PropDesk-wide functions
- `DL_` prefix for delivery module internal functions
- `DL_API` = API base URL
- `DL_ADMIN_TOKEN` = admin auth token

### Key Functions
```
showDeliverySection(section)     — route to sub-tab section
dlFetch(action, data)            — API helper with auth
WPA_dlRefresh()                  — reload current section
WPA_dlLoadStats()                — fetch KPI stats
WPA_dlLoadPackages()             — fetch and render packages table
WPA_dlLogPackage(unit,count,courier) — log new delivery via API
WPA_dlConfirmPickup(unit)        — mark collected
WPA_dlLoadTenants()              — fetch tenant list
WPA_dlSaveTenant(unit,phone)     — add/edit tenant
WPA_dlDeleteTenant(unit)         — remove tenant
WPA_dlLoadReports(from,to,type)  — fetch reports
WPA_dlLoadKioskImages()          — manage rotating images
WPA_dlSendReminder()             — trigger bulk reminder
initDeliveryModule()             — module init on tab load
```
