<?php
// ── DELIVERY / MAILROOM CONFIG ─────────────────────
// Shares Flowroute credentials with tech.willowpa.com + parking

date_default_timezone_set('America/New_York');

// ── FLOWROUTE SMS ─────────────────────────────────────
define('FLOWROUTE_ACCESS_KEY', 'cb4e6973');
define('FLOWROUTE_SECRET_KEY', '4e1b842dc0984a04b5b77582c0afef72');
define('FLOWROUTE_FROM', '+12678650150');

// ── ADMIN ─────────────────────────────────────────────
define('ADMIN_SMS_NUMBER', '+12678650001');
define('ADMIN_PASSWORD', 'willow2026!');

// ── DATA PATHS ────────────────────────────────────────
define('DATA_DIR', __DIR__ . '/data');
define('UPLOAD_DIR', __DIR__ . '/uploads');

// ── SITE ──────────────────────────────────────────────
define('SITE_NAME', 'Chelbourne Plaza - Package Delivery');
define('SITE_URL', 'https://delivery.willowpa.com');
define('BUILDING_NAME', 'Chelbourne Plaza Condominium Association');

// Ensure directories exist
if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

// ── Helper: read JSON file ──
function readJson($file, $default = []) {
    $path = DATA_DIR . '/' . $file;
    if (!file_exists($path)) return $default;
    $d = json_decode(file_get_contents($path), true);
    return $d !== null ? $d : $default;
}

// ── Helper: write JSON file ──
function writeJson($file, $data) {
    file_put_contents(DATA_DIR . '/' . $file, json_encode($data, JSON_PRETTY_PRINT));
}

// ── Helper: generate unique ID ──
function genId($prefix = 'dl') {
    return $prefix . '_' . bin2hex(random_bytes(6));
}

// ── Helper: today's date ──
function today() {
    return date('Y-m-d');
}

// ── Helper: now timestamp ──
function now() {
    return date('Y-m-d H:i:s');
}

// ── Helper: send SMS via Flowroute ──
function sendDeliverySMS($toNumber, $message) {
    $to = preg_replace('/\D/', '', $toNumber);
    if (strlen($to) == 10) $to = '1' . $to;
    if (strlen($to) != 11) return ['status' => 'error', 'msg' => 'Invalid phone number'];

    $payload = json_encode([
        'to'   => $to,
        'from' => preg_replace('/\D/', '', FLOWROUTE_FROM),
        'body' => $message
    ]);

    $ch = curl_init('https://api.flowroute.com/v2.1/messages');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/vnd.api+json'],
        CURLOPT_USERPWD        => FLOWROUTE_ACCESS_KEY . ':' . FLOWROUTE_SECRET_KEY,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode($resp, true);
    if ($code >= 200 && $code < 300) {
        return ['status' => 'success', 'id' => $data['data']['id'] ?? '', 'from' => FLOWROUTE_FROM];
    }
    return ['status' => 'error', 'msg' => $data['errors'][0]['detail'] ?? 'SMS failed'];
}

// ── Helper: add report entry ──
function addReport($unit, $log) {
    $reports = readJson('reports.json', []);
    array_unshift($reports, [
        'id'        => genId('rpt'),
        'unit'      => $unit,
        'log'       => $log,
        'timestamp' => now()
    ]);
    // Keep last 2000 reports
    if (count($reports) > 2000) $reports = array_slice($reports, 0, 2000);
    writeJson('reports.json', $reports);
}

// ── Helper: log SMS message ──
function logMessage($unit, $toNumber, $message, $sid = '') {
    $messages = readJson('messages.json', []);
    array_unshift($messages, [
        'id'        => genId('msg'),
        'unit'      => $unit,
        'to'        => $toNumber,
        'from'      => FLOWROUTE_FROM,
        'body'      => $message,
        'sid'       => $sid,
        'timestamp' => now()
    ]);
    if (count($messages) > 2000) $messages = array_slice($messages, 0, 2000);
    writeJson('messages.json', $messages);
}

// ── Helper: require admin auth ──
function requireAdmin() {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
        if ($m[1] === ADMIN_PASSWORD) return true;
    }
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}
?>
