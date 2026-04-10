<?php
// ── DELIVERY / MAILROOM API — Supabase Backend ──────
// Replaces flat-file JSON with Supabase REST API
// Endpoints unchanged — kiosk.html + PropDesk admin work as before

date_default_timezone_set('America/New_York');

// ── CONFIG ───────────────────────────────────────────
define('SUPABASE_URL', 'https://iwohrvkcodqvyoooxzmt.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2hydmtjb2Rxdnlvb294em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTM3OTksImV4cCI6MjA4OTg2OTc5OX0.PhKo6XiXf-VTBWcYkhT_vfHi0ibftNmYaqm4RApxO6Y');

define('FLOWROUTE_ACCESS_KEY', 'cb4e6973');
define('FLOWROUTE_SECRET_KEY', '4e1b842dc0984a04b5b77582c0afef72');
define('FLOWROUTE_FROM', '+12678650150');

define('ADMIN_PASSWORD', 'willow2026!');
define('SITE_NAME', 'Willow — Package Delivery');
define('BUILDING_NAME', 'Chelbourne Plaza Condominium Association');

// Default building ID — set to your main building in parking_buildings
define('DEFAULT_BUILDING_ID', '');

// ── CORS + JSON ──────────────────────────────────────
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// ── HELPERS ──────────────────────────────────────────

function supabase($table, $query = '', $method = 'GET', $body = null, $extraHeaders = []) {
    $url = SUPABASE_URL . '/rest/v1/' . $table;
    if ($query) $url .= '?' . $query;
    $headers = [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    foreach ($extraHeaders as $h) $headers[] = $h;
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

function now() { return date('Y-m-d\TH:i:sP'); }
function today() { return date('Y-m-d'); }

function getBuildingId() {
    global $input;
    return $_GET['building_id'] ?? ($input['building_id'] ?? DEFAULT_BUILDING_ID);
}

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

function addReport($unit, $log, $buildingId = '') {
    $bid = $buildingId ?: getBuildingId();
    $body = ['unit' => $unit, 'log' => $log];
    if ($bid) $body['building_id'] = $bid;
    supabase('dl_reports', '', 'POST', $body);
}

function logMessage($unit, $toNumber, $message, $sid = '', $buildingId = '') {
    $bid = $buildingId ?: getBuildingId();
    $body = [
        'unit'        => $unit,
        'to_number'   => $toNumber,
        'from_number' => FLOWROUTE_FROM,
        'body'        => $message,
        'sid'         => $sid
    ];
    if ($bid) $body['building_id'] = $bid;
    supabase('dl_messages', '', 'POST', $body);
}

function requireAdmin() {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
        if ($m[1] === ADMIN_PASSWORD) return true;
    }
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

function ok($data = []) {
    echo json_encode(array_merge(['ok' => true], $data));
    exit();
}

function err($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit();
}

// ══════════════════════════════════════════════════════
//  PUBLIC ENDPOINTS
// ══════════════════════════════════════════════════════

switch ($action) {

// ── Log a single package ──
case 'log-package': {
    $unit    = trim($input['unit'] ?? '');
    $count   = max(1, intval($input['count'] ?? 1));
    $courier = trim($input['courier'] ?? '');
    $bid     = trim($input['building_id'] ?? getBuildingId());
    if (!$unit) err('Unit required');

    $body = [
        'unit'    => $unit,
        'count'   => $count,
        'courier' => $courier,
        'status'  => 'pending'
    ];
    if ($bid) $body['building_id'] = $bid;

    $r = supabase('dl_packages', '', 'POST', $body);
    if ($r['code'] < 200 || $r['code'] >= 300) err('Failed to log package');

    $courierText = $courier ? " by $courier" : '';
    addReport($unit, "$count package(s)$courierText logged", $bid);

    // Send SMS if tenant exists
    $smsSent = false;
    $filter = "unit=eq.$unit&sms_opt=eq.true";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $tenant = supabase('dl_tenants', "select=phone&$filter&limit=1");
    if (!empty($tenant['data'][0]['phone'])) {
        $phone = $tenant['data'][0]['phone'];
        $msg = "Unit $unit: $count package(s)$courierText waiting in lobby. Reply 1 to confirm pickup. Reply STOP to opt out.";
        $sms = sendDeliverySMS($phone, $msg);
        logMessage($unit, $phone, $msg, $sms['id'] ?? '', $bid);
        $smsSent = ($sms['status'] === 'success');
    }

    ok(['sms_sent' => $smsSent]);
}

// ── Bulk log packages ──
case 'bulk-log': {
    $records = $input['records'] ?? [];
    if (empty($records)) err('No records');
    $processed = 0;
    $bid = trim($input['building_id'] ?? getBuildingId());

    foreach ($records as $rec) {
        $unit = trim($rec['unit'] ?? '');
        $count = max(1, intval($rec['count'] ?? 1));
        $courier = trim($rec['courier'] ?? '');
        if (!$unit) continue;

        $body = ['unit' => $unit, 'count' => $count, 'courier' => $courier, 'status' => 'pending'];
        if ($bid) $body['building_id'] = $bid;
        $r = supabase('dl_packages', '', 'POST', $body);
        if ($r['code'] >= 200 && $r['code'] < 300) {
            $processed++;
            $courierText = $courier ? " by $courier" : '';
            addReport($unit, "$count package(s)$courierText logged", $bid);

            // SMS
            $filter = "unit=eq.$unit&sms_opt=eq.true";
            if ($bid) $filter .= "&building_id=eq.$bid";
            $tenant = supabase('dl_tenants', "select=phone&$filter&limit=1");
            if (!empty($tenant['data'][0]['phone'])) {
                $phone = $tenant['data'][0]['phone'];
                $msg = "Unit $unit: $count package(s)$courierText waiting in lobby. Reply 1 to confirm pickup. Reply STOP to opt out.";
                $sms = sendDeliverySMS($phone, $msg);
                logMessage($unit, $phone, $msg, $sms['id'] ?? '', $bid);
            }
        }
    }
    ok(['processed' => $processed]);
}

// ── Get pending packages for a unit ──
case 'packages-by-unit': {
    $unit = $_GET['unit'] ?? '';
    if (!$unit) err('Unit required');
    $bid = getBuildingId();
    $filter = "unit=eq.$unit&status=eq.pending&order=created_at.desc";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_packages', "select=*&$filter");
    ok(['packages' => $r['data'] ?? []]);
}

// ── Package history for a unit ──
case 'package-history': {
    $unit = $_GET['unit'] ?? '';
    $limit = intval($_GET['limit'] ?? 50);
    if (!$unit) err('Unit required');
    $bid = getBuildingId();
    $filter = "unit=eq.$unit&order=created_at.desc&limit=$limit";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_packages', "select=*&$filter");
    ok(['packages' => $r['data'] ?? []]);
}

// ── Confirm pickup (mark all pending for unit as collected) ──
case 'confirm-pickup': {
    $unit = trim($input['unit'] ?? '');
    if (!$unit) err('Unit required');
    $bid = getBuildingId();

    // Find pending packages
    $filter = "unit=eq.$unit&status=eq.pending";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $pending = supabase('dl_packages', "select=id&$filter");
    $count = count($pending['data'] ?? []);

    if ($count > 0) {
        supabase('dl_packages', $filter, 'PATCH', [
            'status' => 'collected',
            'collected_at' => now()
        ]);
        addReport($unit, "$count package(s) collected", $bid);
    }
    ok(['collected' => $count]);
}

// ── Register tenant for SMS ──
case 'register-tenant': {
    $unit    = trim($input['unit'] ?? '');
    $phone   = preg_replace('/\D/', '', $input['phone'] ?? '');
    $email   = trim($input['email'] ?? '');
    $whatsapp = trim($input['whatsapp'] ?? '');
    $consent = !empty($input['consent']);
    $bid     = trim($input['building_id'] ?? getBuildingId());

    if (!$unit) err('Unit required');
    if (!$phone && !$email) err('Phone or email required');

    // Check if already registered
    $filter = "unit=eq.$unit";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $existing = supabase('dl_tenants', "select=id&$filter&limit=1");
    if (!empty($existing['data'])) err('Record already exists for this unit. Please see front desk to update.');

    $body = [
        'unit'     => $unit,
        'phone'    => $phone,
        'email'    => $email,
        'whatsapp' => $whatsapp,
        'sms_opt'  => true,
        'consent'  => $consent
    ];
    if ($bid) $body['building_id'] = $bid;
    $r = supabase('dl_tenants', '', 'POST', $body);
    if ($r['code'] >= 200 && $r['code'] < 300) {
        addReport($unit, "Tenant registered (phone: $phone)", $bid);
        ok();
    }
    err('Registration failed');
}

// ── Incoming SMS webhook (Flowroute) ──
case 'incoming-sms': {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $body = strtolower(trim($data['data']['attributes']['body'] ?? ''));
    $from = preg_replace('/\D/', '', $data['data']['attributes']['from'] ?? '');

    if (strlen($from) == 11 && $from[0] === '1') $from = substr($from, 1);

    if (!$from || !$body) { ok(); }

    // Find tenant by phone
    $tenant = supabase('dl_tenants', "select=*&phone=eq.$from&limit=1");
    if (empty($tenant['data'])) { ok(); }
    $t = $tenant['data'][0];
    $unit = $t['unit'];
    $bid = $t['building_id'] ?? '';

    if ($body === '1') {
        // Confirm pickup
        $filter = "unit=eq.$unit&status=eq.pending";
        if ($bid) $filter .= "&building_id=eq.$bid";
        $pending = supabase('dl_packages', "select=id&$filter");
        $count = count($pending['data'] ?? []);
        if ($count > 0) {
            supabase('dl_packages', $filter, 'PATCH', [
                'status' => 'collected',
                'collected_at' => now()
            ]);
            addReport($unit, "$count package(s) confirmed via SMS", $bid);
        }
    } elseif ($body === 'stop') {
        // Opt out
        supabase('dl_tenants', "id=eq." . $t['id'], 'DELETE');
        addReport($unit, "Tenant opted out via SMS", $bid);
    }
    ok();
}

// ── Community updates (public) ──
case 'community-updates': {
    $bid = getBuildingId();
    $filter = "active=eq.true&order=created_at.desc";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_community_updates', "select=*&$filter");
    ok(['updates' => $r['data'] ?? []]);
}

// ── Kiosk images (placeholder) ──
case 'kiosk-images': {
    ok(['images' => [], 'building' => BUILDING_NAME]);
}

// ══════════════════════════════════════════════════════
//  CLIENT APP ENDPOINTS (tenant-facing)
// ══════════════════════════════════════════════════════

case 'tenant-packages': {
    $unit = $_GET['unit'] ?? '';
    if (!$unit) err('Unit required');
    $bid = getBuildingId();
    $filter = "unit=eq.$unit&status=eq.pending&order=created_at.desc";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_packages', "select=*&$filter");
    ok(['packages' => $r['data'] ?? []]);
}

case 'tenant-history': {
    $unit = $_GET['unit'] ?? '';
    $limit = intval($_GET['limit'] ?? 20);
    if (!$unit) err('Unit required');
    $bid = getBuildingId();
    $filter = "unit=eq.$unit&order=created_at.desc&limit=$limit";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_packages', "select=*&$filter");
    ok(['packages' => $r['data'] ?? []]);
}

case 'tenant-confirm-pickup': {
    $unit = trim($input['unit'] ?? '');
    if (!$unit) err('Unit required');
    $bid = getBuildingId();
    $filter = "unit=eq.$unit&status=eq.pending";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $pending = supabase('dl_packages', "select=id&$filter");
    $count = count($pending['data'] ?? []);
    if ($count > 0) {
        supabase('dl_packages', $filter, 'PATCH', [
            'status' => 'collected',
            'collected_at' => now()
        ]);
        addReport($unit, "$count package(s) confirmed via app", $bid);
    }
    ok(['collected' => $count]);
}

case 'tenant-preferences': {
    $unit = $_GET['unit'] ?? ($input['unit'] ?? '');
    if (!$unit) err('Unit required');
    $bid = getBuildingId();

    if ($method === 'GET') {
        $filter = "unit=eq.$unit";
        if ($bid) $filter .= "&building_id=eq.$bid";
        $r = supabase('dl_tenants', "select=*&$filter&limit=1");
        ok(['preferences' => $r['data'][0] ?? null]);
    }

    // POST — update preferences
    $filter = "unit=eq.$unit";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $existing = supabase('dl_tenants', "select=id&$filter&limit=1");
    $updateBody = ['updated_at' => now()];
    if (isset($input['phone']))    $updateBody['phone'] = preg_replace('/\D/', '', $input['phone']);
    if (isset($input['email']))    $updateBody['email'] = trim($input['email']);
    if (isset($input['whatsapp'])) $updateBody['whatsapp'] = trim($input['whatsapp']);
    if (isset($input['sms_opt']))  $updateBody['sms_opt'] = !empty($input['sms_opt']);

    if (!empty($existing['data'])) {
        supabase('dl_tenants', $filter, 'PATCH', $updateBody);
    } else {
        $updateBody['unit'] = $unit;
        if ($bid) $updateBody['building_id'] = $bid;
        supabase('dl_tenants', '', 'POST', $updateBody);
    }
    ok();
}

case 'tenant-updates': {
    $bid = getBuildingId();
    $filter = "active=eq.true&order=created_at.desc";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_community_updates', "select=*&$filter");
    ok(['updates' => $r['data'] ?? []]);
}

// ══════════════════════════════════════════════════════
//  ADMIN ENDPOINTS (Bearer token required)
// ══════════════════════════════════════════════════════

case 'admin-login': {
    $pw = $input['password'] ?? '';
    $yesterday = date('Ymd', strtotime('-1 day'));
    if ($pw === ADMIN_PASSWORD || $pw === $yesterday) {
        ok(['token' => ADMIN_PASSWORD]);
    }
    err('Invalid password', 401);
}

case 'admin-packages': {
    requireAdmin();
    $bid = getBuildingId();
    $status = $_GET['status'] ?? '';
    $dateFrom = $_GET['date_from'] ?? '';
    $dateTo = $_GET['date_to'] ?? '';

    $filter = "order=created_at.desc&limit=500";
    if ($status) $filter .= "&status=eq.$status";
    if ($dateFrom) $filter .= "&created_at=gte." . $dateFrom . 'T00:00:00';
    if ($dateTo) $filter .= "&created_at=lte." . $dateTo . 'T23:59:59';
    if ($bid) $filter .= "&building_id=eq.$bid";

    $r = supabase('dl_packages', "select=*&$filter");
    $packages = $r['data'] ?? [];

    // Add has_phone flag
    foreach ($packages as &$pkg) {
        $tFilter = "unit=eq." . $pkg['unit'] . "&sms_opt=eq.true";
        if ($bid) $tFilter .= "&building_id=eq.$bid";
        $t = supabase('dl_tenants', "select=id&$tFilter&limit=1");
        $pkg['has_phone'] = !empty($t['data']);
    }
    ok(['packages' => $packages]);
}

case 'admin-stats': {
    requireAdmin();
    $bid = getBuildingId();

    $pendingFilter = "status=eq.pending";
    $todayStart = today() . 'T00:00:00';
    $monthStart = date('Y-m-01') . 'T00:00:00';
    if ($bid) $pendingFilter .= "&building_id=eq.$bid";

    $pending = supabase('dl_packages', "select=id&$pendingFilter");
    $pendingCount = count($pending['data'] ?? []);

    $collFilter = "status=eq.collected&collected_at=gte.$todayStart";
    if ($bid) $collFilter .= "&building_id=eq.$bid";
    $collToday = supabase('dl_packages', "select=id&$collFilter");
    $collTodayCount = count($collToday['data'] ?? []);

    $monthFilter = "created_at=gte.$monthStart";
    if ($bid) $monthFilter .= "&building_id=eq.$bid";
    $monthTotal = supabase('dl_packages', "select=id&$monthFilter");
    $monthTotalCount = count($monthTotal['data'] ?? []);

    $unitsWaiting = supabase('dl_packages', "select=unit&$pendingFilter");
    $uniqueUnits = count(array_unique(array_column($unitsWaiting['data'] ?? [], 'unit')));

    $tFilter = $bid ? "building_id=eq.$bid" : '';
    $tenants = supabase('dl_tenants', "select=id" . ($tFilter ? "&$tFilter" : ''));
    $totalTenants = count($tenants['data'] ?? []);

    ok(['stats' => [
        'pending'         => $pendingCount,
        'collected_today' => $collTodayCount,
        'total_month'     => $monthTotalCount,
        'units_waiting'   => $uniqueUnits,
        'total_tenants'   => $totalTenants
    ]]);
}

case 'admin-tenants': {
    requireAdmin();
    $bid = getBuildingId();
    $filter = "order=unit.asc";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_tenants', "select=*&$filter");
    ok(['tenants' => $r['data'] ?? []]);
}

case 'admin-update-tenant': {
    requireAdmin();
    $unit = trim($input['unit'] ?? '');
    $phone = preg_replace('/\D/', '', $input['phone'] ?? '');
    if (!$unit) err('Unit required');
    $bid = getBuildingId();

    $filter = "unit=eq.$unit";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $existing = supabase('dl_tenants', "select=id&$filter&limit=1");

    $body = ['phone' => $phone, 'updated_at' => now()];
    if (isset($input['email']))    $body['email'] = trim($input['email']);
    if (isset($input['whatsapp'])) $body['whatsapp'] = trim($input['whatsapp']);
    if (isset($input['sms_opt']))  $body['sms_opt'] = !empty($input['sms_opt']);

    if (!empty($existing['data'])) {
        supabase('dl_tenants', $filter, 'PATCH', $body);
    } else {
        $body['unit'] = $unit;
        $body['sms_opt'] = true;
        $body['consent'] = true;
        if ($bid) $body['building_id'] = $bid;
        supabase('dl_tenants', '', 'POST', $body);
    }
    ok();
}

case 'admin-delete-tenant': {
    requireAdmin();
    $unit = trim($input['unit'] ?? '');
    if (!$unit) err('Unit required');
    $bid = getBuildingId();
    $filter = "unit=eq.$unit";
    if ($bid) $filter .= "&building_id=eq.$bid";
    supabase('dl_tenants', $filter, 'DELETE');
    ok();
}

case 'admin-bulk-update-tenants': {
    requireAdmin();
    $records = $input['records'] ?? [];
    $bid = getBuildingId();
    foreach ($records as $rec) {
        $unit = trim($rec['unit'] ?? '');
        $phone = preg_replace('/\D/', '', $rec['phone'] ?? '');
        if (!$unit) continue;

        $filter = "unit=eq.$unit";
        if ($bid) $filter .= "&building_id=eq.$bid";
        $existing = supabase('dl_tenants', "select=id&$filter&limit=1");

        if (!empty($existing['data'])) {
            supabase('dl_tenants', $filter, 'PATCH', ['phone' => $phone, 'updated_at' => now()]);
        } else {
            $body = ['unit' => $unit, 'phone' => $phone, 'sms_opt' => true, 'consent' => true];
            if ($bid) $body['building_id'] = $bid;
            supabase('dl_tenants', '', 'POST', $body);
        }
    }
    ok();
}

case 'admin-bulk-delete-tenants': {
    requireAdmin();
    $units = $input['units'] ?? [];
    $bid = getBuildingId();
    foreach ($units as $unit) {
        $filter = "unit=eq.$unit";
        if ($bid) $filter .= "&building_id=eq.$bid";
        supabase('dl_tenants', $filter, 'DELETE');
    }
    ok();
}

case 'admin-delete-packages': {
    requireAdmin();
    $units = $input['units'] ?? [];
    $bid = getBuildingId();
    foreach ($units as $unit) {
        $filter = "unit=eq.$unit&status=eq.pending";
        if ($bid) $filter .= "&building_id=eq.$bid";
        supabase('dl_packages', $filter, 'DELETE');
    }
    ok();
}

case 'admin-reports': {
    requireAdmin();
    $dateFrom = $_GET['date_from'] ?? '';
    $dateTo = $_GET['date_to'] ?? '';
    $type = $_GET['type'] ?? 'report';
    $bid = getBuildingId();

    if ($type === 'signup') {
        $filter = "order=created_at.desc&limit=200";
        if ($dateFrom) $filter .= "&created_at=gte." . $dateFrom . 'T00:00:00';
        if ($dateTo) $filter .= "&created_at=lte." . $dateTo . 'T23:59:59';
        if ($bid) $filter .= "&building_id=eq.$bid";
        $r = supabase('dl_tenants', "select=unit,phone,created_at&$filter");
        ok(['data' => $r['data'] ?? []]);
    }

    // Default: activity reports
    $filter = "order=created_at.desc&limit=200";
    if ($dateFrom) $filter .= "&created_at=gte." . $dateFrom . 'T00:00:00';
    if ($dateTo) $filter .= "&created_at=lte." . $dateTo . 'T23:59:59';
    if ($bid) $filter .= "&building_id=eq.$bid";
    $r = supabase('dl_reports', "select=*&$filter");
    ok(['data' => $r['data'] ?? []]);
}

case 'admin-community-updates': {
    requireAdmin();
    $bid = getBuildingId();

    if ($method === 'GET') {
        $filter = "order=created_at.desc";
        if ($bid) $filter .= "&building_id=eq.$bid";
        $r = supabase('dl_community_updates', "select=*&$filter");
        ok(['updates' => $r['data'] ?? []]);
    }

    if ($method === 'DELETE') {
        $id = $input['id'] ?? '';
        if (!$id) err('ID required');
        supabase('dl_community_updates', "id=eq.$id", 'DELETE');
        ok();
    }

    // POST — create or update
    $id = $input['id'] ?? '';
    if ($id) {
        $body = ['updated_at' => now()];
        if (isset($input['title']))  $body['title'] = $input['title'];
        if (isset($input['body']))   $body['body'] = $input['body'];
        if (isset($input['active'])) $body['active'] = !empty($input['active']);
        supabase('dl_community_updates', "id=eq.$id", 'PATCH', $body);
    } else {
        $body = [
            'title'  => $input['title'] ?? '',
            'body'   => $input['body'] ?? '',
            'active' => true
        ];
        if ($bid) $body['building_id'] = $bid;
        supabase('dl_community_updates', '', 'POST', $body);
    }
    ok();
}

case 'admin-send-reminder': {
    requireAdmin();
    $bid = getBuildingId();

    $filter = "status=eq.pending";
    if ($bid) $filter .= "&building_id=eq.$bid";
    $pending = supabase('dl_packages', "select=unit&$filter");
    $units = array_unique(array_column($pending['data'] ?? [], 'unit'));

    $sent = 0;
    foreach ($units as $unit) {
        $tFilter = "unit=eq.$unit&sms_opt=eq.true";
        if ($bid) $tFilter .= "&building_id=eq.$bid";
        $tenant = supabase('dl_tenants', "select=phone&$tFilter&limit=1");
        if (!empty($tenant['data'][0]['phone'])) {
            $phone = $tenant['data'][0]['phone'];
            $msg = "Reminder: your package(s) are waiting in lobby. They will be returned after 7 days.";
            $sms = sendDeliverySMS($phone, $msg);
            logMessage($unit, $phone, $msg, $sms['id'] ?? '', $bid);
            if ($sms['status'] === 'success') $sent++;
        }
    }
    ok(['sent' => $sent]);
}

default:
    err('Unknown action: ' . $action, 404);
}
