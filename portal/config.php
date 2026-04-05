<?php
// ── WILLOW TENANT APP CONFIG ─────────────────────
// app.willowpa.com — Single config file
date_default_timezone_set('America/New_York');

// ── MODE ──────────────────────────────────────────
// LOCAL_MODE: true = read from local JSON files, false = proxy to live APIs
define('LOCAL_MODE', true);

// ── SUPABASE ──────────────────────────────────────
define('SUPABASE_URL', 'https://iwohrvkcodqvyoooxzmt.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2hydmtjb2Rxdnlvb294em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTM3OTksImV4cCI6MjA4OTg2OTc5OX0.PhKo6XiXf-VTBWcYkhT_vfHi0ibftNmYaqm4RApxO6Y');

// ── STRIPE ────────────────────────────────────────
// Used by: app.willowpa.com (ST rent, mLT rent, parking, maintenance)
// Also used by: stay.willowpa.com (separate config there)
define('STRIPE_SECRET_KEY', '');       // sk_live_... or sk_test_...
define('STRIPE_PUBLISHABLE_KEY', ''); // pk_live_... or pk_test_...

// ── ANTHROPIC AI ──────────────────────────────────
define('ANTHROPIC_API_KEY', '');       // sk-ant-...

// ── INTERNAL APIs (production mode) ───────────────
define('DELIVERY_API', 'https://delivery.willowpa.com/api.php');
define('ADMIN_TOKEN', 'willow2026!');

// ── LOCAL DATA PATHS ──────────────────────────────
define('PARKING_DATA_DIR', realpath(__DIR__ . '/../parking/data') ?: __DIR__ . '/../parking/data');
define('DELIVERY_DATA_DIR', realpath(__DIR__ . '/../delivery/data') ?: __DIR__ . '/../delivery/data');

// ── PORTAL DATA ───────────────────────────────────
define('PORTAL_DATA', __DIR__ . '/api/data');
if (!is_dir(PORTAL_DATA)) mkdir(PORTAL_DATA, 0755, true);

// ── FLOWROUTE SMS ─────────────────────────────────
define('FLOWROUTE_ACCESS_KEY', 'cb4e6973');
define('FLOWROUTE_SECRET_KEY', '4e1b842dc0984a04b5b77582c0afef72');
define('FLOWROUTE_FROM', '+12678650150');

// ── SITE ──────────────────────────────────────────
define('SITE_NAME', 'Willow Resident App');
define('SITE_URL', 'https://app.willowpa.com');

// ── UPLOAD DIR ────────────────────────────────────
define('UPLOAD_DIR', __DIR__ . '/uploads');
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

// ═══════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════

function readJson($file, $default = []) {
    $path = PORTAL_DATA . '/' . $file;
    if (!file_exists($path)) return $default;
    $d = json_decode(file_get_contents($path), true);
    return $d !== null ? $d : $default;
}

function writeJson($file, $data) {
    file_put_contents(PORTAL_DATA . '/' . $file, json_encode($data, JSON_PRETTY_PRINT));
}

function readLocalJson($dir, $file) {
    $path = $dir . '/' . $file;
    if (!file_exists($path)) return [];
    $d = json_decode(file_get_contents($path), true);
    return $d !== null ? $d : [];
}

function writeLocalJson($dir, $file, $data) {
    file_put_contents($dir . '/' . $file, json_encode($data, JSON_PRETTY_PRINT));
}

function genId($prefix = 'p') {
    return $prefix . '_' . bin2hex(random_bytes(6));
}

function now() { return date('Y-m-d H:i:s'); }
function today() { return date('Y-m-d'); }

// ── Supabase REST ─────────────────────────────────
function supabase($table, $query = '', $method = 'GET', $body = null) {
    $url = SUPABASE_URL . '/rest/v1/' . $table;
    if ($query) $url .= '?' . $query;
    $headers = [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => $method,
    ]);
    if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'data' => json_decode($resp, true)];
}

// ── Internal API proxy (production mode) ──────────
function proxyApi($baseUrl, $action, $method = 'GET', $body = null, $auth = true) {
    $url = $baseUrl . '?action=' . $action;
    $headers = ['Content-Type: application/json'];
    if ($auth) $headers[] = 'Authorization: Bearer ' . ADMIN_TOKEN;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => $method,
    ]);
    if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $resp = curl_exec($ch);
    curl_close($ch);
    return json_decode($resp, true);
}

// ── Send SMS ──────────────────────────────────────
function sendSMS($to, $message) {
    $toClean = preg_replace('/\D/', '', $to);
    if (strlen($toClean) == 10) $toClean = '1' . $toClean;
    $ch = curl_init('https://api.flowroute.com/v2.1/messages');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'to'   => $toClean,
            'from' => preg_replace('/\D/', '', FLOWROUTE_FROM),
            'body' => $message
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/vnd.api+json'],
        CURLOPT_USERPWD => FLOWROUTE_ACCESS_KEY . ':' . FLOWROUTE_SECRET_KEY,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code >= 200 && $code < 300;
}

// ── Portal session auth ───────────────────────────
function getPortalUser() {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/i', $auth, $m)) return null;
    $sessions = readJson('sessions.json', []);
    $token = $m[1];
    foreach ($sessions as $s) {
        if ($s['token'] === $token && ($s['expires'] ?? '') > now()) return $s;
    }
    return null;
}

function requirePortalAuth() {
    $user = getPortalUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit();
    }
    return $user;
}
?>
