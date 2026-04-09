# Parking System Security Refactor — Changelog

## New Booking Lifecycle

### Before (insecure)
```
Browser → reads security_code from HTML → validates locally
Browser → picks plan → sends amount/days/account_id to server (trusted)
Browser → calls /api/process-payment with Stripe token → gets transaction_id
Browser → calls /api/create-parking with ALL data (amount, account_id, etc.)
Server → creates parking record without verification
```

### After (secure)
```
Step 1: Browser → POST /api/validate-unit (building_id, unit_id, security_code)
        Server → validates code, returns plans + vehicles + stripe_key
        (security_code never leaves server → browser)

Step 2: Browser → user selects plan, enters vehicle/contact info

Step 3: Browser → POST /api/create-booking (all form data + security_code)
        Server → re-validates code
        Server → calculates amount from its own plan data (not client)
        Server → checks free eligibility, overlap prevention
        Server → creates parking record
        - If free: status=booked, done, returns token
        - If paid: status=pending_payment, creates Stripe PaymentIntent
                   returns client_secret

Step 4: Browser → stripe.confirmCardPayment(client_secret)
        Browser → POST /api/confirm-payment (parking_id, payment_intent_id)
        Server → verifies PaymentIntent with Stripe
        Server → updates status to 'paid', sends notifications
        → redirects to /parking-booked/{public_token}
```

## Files Changed

| File | What Changed |
|------|-------------|
| `database/migrations/2026_04_08_000001_secure_parkings_table.php` | NEW — adds status, payment_intent_id, total_days, public_token columns |
| `app/Http/Controllers/ParkingController.php` | REWRITTEN — new endpoints: validateUnit, createBooking, confirmPayment; fixed plans() null-safety; resolvePlans helper; sendNotifications helper; showBookedParking supports public_token |
| `app/Http/Controllers/UnitController.php` | unitByBuilding() no longer exposes security_code |
| `routes/api.php` | New secure routes; reset-free-parkings behind auth; removed /create-parking and /process-payment |
| `public/assets/frontend/js/script.js` | REWRITTEN — server-side validation, PaymentIntent flow, no client-trusted amount/account_id |
| `resources/views/frontend/partials/step-1.blade.php` | Removed inline JS that loaded plans and exposed data-password; all handled by script.js |

## Security Fixes

1. **Security code no longer exposed to browser** — removed from unit dropdown data attributes and from unitByBuilding() JSON response
2. **Server is source of truth for pricing** — amount/days calculated on server in createBooking(), not trusted from client
3. **Stripe PaymentIntent flow** — replaces legacy token/Charge; server creates intent, browser confirms, server verifies
4. **Booking record created BEFORE payment** — status=pending_payment prevents orphaned charges
5. **reset-free-parkings moved behind auth** — no longer publicly accessible
6. **Overlap prevention** — server checks for duplicate bookings on same unit/plate/dates
7. **Invoice URLs use public_token** — 64-char random token instead of guessable base64(id)

## Bug Fixes

1. **plans() null crash** — $plan->start_date was accessed before checking if $plan exists; now null-safe
2. **plans() response shape** — returned single Parking via first(), frontend expected array; now returns distinct vehicles array
3. **Invoice URL consistency** — showBookedParking accepts both public_token and legacy base64 id

## Booking Statuses

| Status | Meaning |
|--------|---------|
| `pending_payment` | Booking created, awaiting Stripe payment |
| `paid` | Payment verified by server via Stripe |
| `booked` | Free booking, no payment needed |
| `failed` | Payment failed or setup error |
| `cancelled` | Cancelled by admin |

## Deployment Steps

1. Upload files to server
2. Run `php artisan migrate` to add new columns
3. Verify Stripe API version supports PaymentIntents (any version after 2019-02-11)
4. Test: book free plan → should work immediately
5. Test: book paid plan → should show Stripe card form → confirm → redirect to invoice
6. Verify old invoice URLs (base64) still work (backward compatible)
