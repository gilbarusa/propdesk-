<?php
// ── PARKING.WILLOWPA.COM CONFIG ─────────────────────
// Copy this to config.php and fill in your keys

// ── STRIPE ────────────────────────────────────────────
define('STRIPE_SECRET_KEY', ''); // sk_test_... or sk_live_...
define('STRIPE_PUBLISHABLE_KEY', ''); // pk_test_... or pk_live_...

// ── FLOWROUTE SMS ─────────────────────────────────────
define('FLOWROUTE_ACCESS_KEY', 'YOUR_FLOWROUTE_KEY');
define('FLOWROUTE_SECRET_KEY', 'YOUR_FLOWROUTE_SECRET');
define('FLOWROUTE_FROM', '+1XXXXXXXXXX');

// ── ADMIN ─────────────────────────────────────────────
define('ADMIN_SMS_NUMBER', '+1XXXXXXXXXX');
define('ADMIN_PASSWORD', 'YOUR_ADMIN_PASSWORD');

// ── DATA PATHS ────────────────────────────────────────
define('DATA_DIR', __DIR__ . '/data');

// ── SITE ──────────────────────────────────────────────
define('SITE_NAME', 'WillowPA Parking');
define('SITE_URL', 'https://parking.willowpa.com');

// Ensure data directory exists
if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!is_dir(DATA_DIR . '/receipts')) mkdir(DATA_DIR . '/receipts', 0755, true);

// Helper: read JSON file
function readJson($file, $default = []) {
    $path = DATA_DIR . '/' . $file;
    if (!file_exists($path)) return $default;
    $d = json_decode(file_get_contents($path), true);
    return $d !== null ? $d : $default;
}

// Helper: write JSON file
function writeJson($file, $data) {
    file_put_contents(DATA_DIR . '/' . $file, json_encode($data, JSON_PRETTY_PRINT));
}

// Helper: generate unique ID
function genId() {
    return 'pk_' . bin2hex(random_bytes(6));
}

// Helper: today's date
function today() {
    return date('Y-m-d');
}
?>
