<?php
// ── DELIVERY / MAILROOM API ─────────────────────────
// Shared backend for PropDesk admin, kiosk, and client app
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {

// ═════════════════════════════════════════════════════
//  PUBLIC ENDPOINTS (kiosk + client app)
// ═════════════════════════════════════════════════════

    // ── Log a single package delivery ──
    case 'log-package':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $unit    = trim($input['unit'] ?? '');
        $count   = max(1, intval($input['count'] ?? 1));
        $courier = trim($input['courier'] ?? '');

        if ($unit === '') { echo json_encode(['error' => 'Unit required']); break; }

        $packages = readJson('packages.json', []);

        // Check if unit already has pending packages
        $found = false;
        foreach ($packages as &$p) {
            if ($p['unit'] === $unit && $p['status'] === 'Pending') {
                $p['count']     += $count;
                $p['total']     += $count;
                $p['courier']    = $courier;
                $p['modified']   = now();
                $found = true;
                break;
            }
        }
        unset($p);

        if (!$found) {
            $packages[] = [
                'id'        => genId('pkg'),
                'unit'      => $unit,
                'count'     => $count,
                'total'     => $count,
                'courier'   => $courier,
                'status'    => 'Pending',
                'created'   => now(),
                'modified'  => now(),
                'collected' => null
            ];
        }
        writeJson('packages.json', $packages);
        addReport($unit, $courier . ' ' . $count . ' package(s)');

        // Send SMS if tenant registered
        $tenants = readJson('tenants.json', []);
        $phone = '';
        foreach ($tenants as $t) {
            if ($t['unit'] === $unit && !empty($t['phone']) && ($t['sms_opt'] ?? true)) {
                $phone = $t['phone'];
                break;
            }
        }
        $smsSent = false;
        if ($phone) {
            $msg = $courier
                ? "Unit $unit: $count package(s) delivered by $courier waiting in lobby. Reply 1 to confirm pickup. Reply STOP to opt out."
                : "Unit $unit: $count package(s) waiting in lobby. Reply 1 to confirm pickup. Reply STOP to opt out.";
            $resp = sendDeliverySMS($phone, $msg);
            if ($resp['status'] === 'success') {
                logMessage($unit, $phone, $msg, $resp['id'] ?? '');
                addReport($unit, 'SMS sent to ' . $phone . ' about ' . $count . ' package(s)');
                $smsSent = true;
            }
        }

        echo json_encode(['ok' => true, 'sms_sent' => $smsSent]);
        break;

    // ── Bulk log packages ──
    case 'bulk-log':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $records = $input['records'] ?? [];
        if (!is_array($records) || count($records) === 0) {
            echo json_encode(['error' => 'No records']); break;
        }

        $packages = readJson('packages.json', []);
        $tenants  = readJson('tenants.json', []);
        $processed = 0;

        foreach ($records as $r) {
            $unit    = trim($r['unit'] ?? '');
            $count   = max(1, intval($r['count'] ?? 1));
            $courier = trim($r['courier'] ?? '');
            if ($unit === '') continue;

            // Upsert package
            $found = false;
            foreach ($packages as &$p) {
                if ($p['unit'] === $unit && $p['status'] === 'Pending') {
                    $p['count']   += $count;
                    $p['total']   += $count;
                    $p['courier']  = $courier;
                    $p['modified'] = now();
                    $found = true;
                    break;
                }
            }
            unset($p);

            if (!$found) {
                $packages[] = [
                    'id'        => genId('pkg'),
                    'unit'      => $unit,
                    'count'     => $count,
                    'total'     => $count,
                    'courier'   => $courier,
                    'status'    => 'Pending',
                    'created'   => now(),
                    'modified'  => now(),
                    'collected' => null
                ];
            }

            addReport($unit, $count . ' package(s) added via bulk notice (' . $courier . ')');

            // SMS
            $phone = '';
            foreach ($tenants as $t) {
                if ($t['unit'] === $unit && !empty($t['phone']) && ($t['sms_opt'] ?? true)) {
                    $phone = $t['phone']; break;
                }
            }
            if ($phone) {
                $msg = $courier
                    ? "Unit $unit: $count package(s) delivered by $courier. Reply 1 to confirm pickup. Reply STOP to opt out."
                    : "Unit $unit: $count package(s) waiting in lobby. Reply 1 to confirm pickup. Reply STOP to opt out.";
                $resp = sendDeliverySMS($phone, $msg);
                if ($resp['status'] === 'success') {
                    logMessage($unit, $phone, $msg, $resp['id'] ?? '');
                }
            }
            $processed++;
        }

        writeJson('packages.json', $packages);
        echo json_encode(['ok' => true, 'processed' => $processed]);
        break;

    // ── Get packages by unit (public) ──
    case 'packages-by-unit':
        $unit = $_GET['unit'] ?? '';
        $packages = readJson('packages.json', []);
        $active = array_values(array_filter($packages, function($p) use ($unit) {
            return $p['unit'] === $unit && $p['status'] === 'Pending';
        }));
        echo json_encode(['ok' => true, 'packages' => $active]);
        break;

    // ── Package history by unit ──
    case 'package-history':
        $unit  = $_GET['unit'] ?? '';
        $limit = intval($_GET['limit'] ?? 50);
        $packages = readJson('packages.json', []);
        $history = array_values(array_filter($packages, function($p) use ($unit) {
            return $p['unit'] === $unit;
        }));
        usort($history, function($a, $b) { return strcmp($b['modified'], $a['modified']); });
        echo json_encode(['ok' => true, 'packages' => array_slice($history, 0, $limit)]);
        break;

    // ── Confirm pickup ──
    case 'confirm-pickup':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $unit = trim($input['unit'] ?? '');
        if ($unit === '') { echo json_encode(['error' => 'Unit required']); break; }

        $packages = readJson('packages.json', []);
        $collected = 0;
        foreach ($packages as &$p) {
            if ($p['unit'] === $unit && $p['status'] === 'Pending') {
                $collected = $p['count'];
                $p['status']    = 'Collected';
                $p['count']     = 0;
                $p['collected'] = now();
                $p['modified']  = now();
            }
        }
        unset($p);
        writeJson('packages.json', $packages);
        if ($collected > 0) {
            addReport($unit, $collected . ' package(s) collected at ' . now());
        }
        echo json_encode(['ok' => true, 'collected' => $collected]);
        break;

    // ── Register tenant for SMS ──
    case 'register-tenant':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $unit  = trim($input['unit'] ?? '');
        $phone = preg_replace('/\D/', '', $input['phone'] ?? '');
        $consent = $input['consent'] ?? false;

        if ($unit === '') { echo json_encode(['error' => 'Unit required']); break; }
        if (strlen($phone) == 11) $phone = preg_replace('/^1/', '', $phone);
        if (strlen($phone) != 10) { echo json_encode(['error' => 'Enter valid phone number']); break; }

        $tenants = readJson('tenants.json', []);

        // Check if already exists
        foreach ($tenants as $t) {
            if ($t['unit'] === $unit) {
                echo json_encode(['error' => 'Record already exists for this unit']); break 2;
            }
        }

        $tenants[] = [
            'id'       => genId('tnt'),
            'unit'     => $unit,
            'phone'    => $phone,
            'email'    => trim($input['email'] ?? ''),
            'whatsapp' => trim($input['whatsapp'] ?? ''),
            'sms_opt'  => true,
            'consent'  => $consent ? true : false,
            'created'  => now(),
            'modified' => now()
        ];
        writeJson('tenants.json', $tenants);
        addReport($unit, 'SMS signup - phone ' . $phone);
        echo json_encode(['ok' => true]);
        break;

    // ── Community updates (kiosk + client app) ──
    case 'community-updates':
        $updates = readJson('community-updates.json', []);
        $active = array_values(array_filter($updates, function($u) { return !empty($u['active']); }));
        echo json_encode(['ok' => true, 'updates' => $active]);
        break;

    // ── Kiosk images ──
    case 'kiosk-images':
        $settings = readJson('settings.json', []);
        $images = $settings['kiosk_images'] ?? [];
        echo json_encode(['ok' => true, 'images' => $images, 'building' => BUILDING_NAME]);
        break;

    // ── Incoming SMS webhook (Flowroute) ──
    case 'incoming-sms':
        $input = json_decode(file_get_contents('php://input'), true);
        $body = trim($input['data']['attributes']['body'] ?? '');
        $from = preg_replace('/\D/', '', $input['data']['attributes']['from'] ?? '');
        if (strlen($from) == 11) $from = substr($from, 1);

        if ($from && $body) {
            $tenants = readJson('tenants.json', []);

            if ($body === '1') {
                // Confirm pickup by phone number
                $unit = '';
                foreach ($tenants as $t) {
                    if ($t['phone'] === $from) { $unit = $t['unit']; break; }
                }
                if ($unit) {
                    $packages = readJson('packages.json', []);
                    foreach ($packages as &$p) {
                        if ($p['unit'] === $unit && $p['status'] === 'Pending') {
                            $cnt = $p['count'];
                            $p['status']    = 'Collected';
                            $p['count']     = 0;
                            $p['collected'] = now();
                            $p['modified']  = now();
                            addReport($unit, $cnt . ' package(s) collected via SMS at ' . now());
                        }
                    }
                    unset($p);
                    writeJson('packages.json', $packages);
                }
            } elseif (strtolower($body) === 'stop') {
                // Opt out of SMS
                $tenants = array_values(array_filter($tenants, function($t) use ($from) {
                    return $t['phone'] !== $from;
                }));
                writeJson('tenants.json', $tenants);
            }
        }
        echo json_encode(['ok' => true]);
        break;


// ═════════════════════════════════════════════════════
//  CLIENT APP SERVICE ENDPOINTS
// ═════════════════════════════════════════════════════

    // ── Tenant packages (for authenticated client app) ──
    case 'tenant-packages':
        $unit = $_GET['unit'] ?? '';
        $packages = readJson('packages.json', []);
        $active = array_values(array_filter($packages, function($p) use ($unit) {
            return $p['unit'] === $unit && $p['status'] === 'Pending';
        }));
        echo json_encode(['ok' => true, 'packages' => $active]);
        break;

    // ── Tenant history ──
    case 'tenant-history':
        $unit  = $_GET['unit'] ?? '';
        $limit = intval($_GET['limit'] ?? 20);
        $packages = readJson('packages.json', []);
        $all = array_values(array_filter($packages, function($p) use ($unit) {
            return $p['unit'] === $unit;
        }));
        usort($all, function($a, $b) { return strcmp($b['modified'], $a['modified']); });
        echo json_encode(['ok' => true, 'packages' => array_slice($all, 0, $limit)]);
        break;

    // ── Tenant confirm pickup ──
    case 'tenant-confirm-pickup':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $unit = trim($input['unit'] ?? '');
        if (!$unit) { echo json_encode(['error' => 'Unit required']); break; }

        $packages = readJson('packages.json', []);
        $cnt = 0;
        foreach ($packages as &$p) {
            if ($p['unit'] === $unit && $p['status'] === 'Pending') {
                $cnt = $p['count'];
                $p['status']    = 'Collected';
                $p['count']     = 0;
                $p['collected'] = now();
                $p['modified']  = now();
            }
        }
        unset($p);
        writeJson('packages.json', $packages);
        if ($cnt > 0) addReport($unit, $cnt . ' package(s) confirmed via client app');
        echo json_encode(['ok' => true, 'collected' => $cnt]);
        break;

    // ── Tenant notification preferences ──
    case 'tenant-preferences':
        $unit = $_GET['unit'] ?? '';
        if ($method === 'GET') {
            $tenants = readJson('tenants.json', []);
            $tenant = null;
            foreach ($tenants as $t) { if ($t['unit'] === $unit) { $tenant = $t; break; } }
            echo json_encode(['ok' => true, 'preferences' => $tenant ? [
                'phone'    => $tenant['phone'] ?? '',
                'email'    => $tenant['email'] ?? '',
                'whatsapp' => $tenant['whatsapp'] ?? '',
                'sms_opt'  => $tenant['sms_opt'] ?? true
            ] : null]);
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $unit = trim($input['unit'] ?? $unit);
            $tenants = readJson('tenants.json', []);
            $found = false;
            foreach ($tenants as &$t) {
                if ($t['unit'] === $unit) {
                    if (isset($input['phone']))    $t['phone']    = preg_replace('/\D/', '', $input['phone']);
                    if (isset($input['email']))    $t['email']    = trim($input['email']);
                    if (isset($input['whatsapp'])) $t['whatsapp'] = trim($input['whatsapp']);
                    if (isset($input['sms_opt']))  $t['sms_opt']  = (bool)$input['sms_opt'];
                    $t['modified'] = now();
                    $found = true;
                    break;
                }
            }
            unset($t);
            if ($found) writeJson('tenants.json', $tenants);
            echo json_encode(['ok' => $found]);
        }
        break;

    // ── Tenant community updates ──
    case 'tenant-updates':
        $updates = readJson('community-updates.json', []);
        $active = array_values(array_filter($updates, function($u) { return !empty($u['active']); }));
        echo json_encode(['ok' => true, 'updates' => $active]);
        break;


// ═════════════════════════════════════════════════════
//  ADMIN ENDPOINTS (Bearer token auth)
// ═════════════════════════════════════════════════════

    // ── Admin: Get all packages with filters ──
    case 'admin-packages':
        requireAdmin();
        $status = $_GET['status'] ?? '';
        $from   = $_GET['date_from'] ?? '';
        $to     = $_GET['date_to'] ?? '';
        $packages = readJson('packages.json', []);
        $tenants  = readJson('tenants.json', []);

        // Build phone lookup
        $phoneLookup = [];
        foreach ($tenants as $t) { $phoneLookup[$t['unit']] = $t['phone'] ?? ''; }

        if ($status) {
            $packages = array_filter($packages, function($p) use ($status) {
                return $p['status'] === $status;
            });
        }
        if ($from) {
            $packages = array_filter($packages, function($p) use ($from) {
                return substr($p['modified'], 0, 10) >= $from;
            });
        }
        if ($to) {
            $packages = array_filter($packages, function($p) use ($to) {
                return substr($p['modified'], 0, 10) <= $to;
            });
        }

        // Add sms_opt info
        $result = [];
        foreach (array_values($packages) as $p) {
            $p['has_phone'] = !empty($phoneLookup[$p['unit']]);
            $result[] = $p;
        }

        // Sort by modified desc
        usort($result, function($a, $b) { return strcmp($b['modified'], $a['modified']); });

        echo json_encode(['ok' => true, 'packages' => $result]);
        break;

    // ── Admin: Get stats ──
    case 'admin-stats':
        requireAdmin();
        $packages = readJson('packages.json', []);
        $tenants  = readJson('tenants.json', []);
        $todayStr = today();

        $pending = 0; $collectedToday = 0; $totalMonth = 0; $unitsWaiting = [];
        foreach ($packages as $p) {
            if ($p['status'] === 'Pending') {
                $pending += $p['count'];
                $unitsWaiting[$p['unit']] = true;
            }
            if ($p['status'] === 'Collected' && substr($p['collected'], 0, 10) === $todayStr) {
                $collectedToday++;
            }
            if (substr($p['created'], 0, 7) === substr($todayStr, 0, 7)) {
                $totalMonth++;
            }
        }

        echo json_encode(['ok' => true, 'stats' => [
            'pending'         => $pending,
            'collected_today' => $collectedToday,
            'total_month'     => $totalMonth,
            'units_waiting'   => count($unitsWaiting),
            'total_tenants'   => count($tenants)
        ]]);
        break;

    // ── Admin: List all tenants ──
    case 'admin-tenants':
        requireAdmin();
        $tenants = readJson('tenants.json', []);
        usort($tenants, function($a, $b) { return strcmp($a['unit'], $b['unit']); });
        echo json_encode(['ok' => true, 'tenants' => $tenants]);
        break;

    // ── Admin: Update tenant ──
    case 'admin-update-tenant':
        requireAdmin();
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $unit  = trim($input['unit'] ?? '');
        $phone = preg_replace('/\D/', '', $input['phone'] ?? '');

        if (strlen($phone) == 11) $phone = preg_replace('/^1/', '', $phone);
        if (strlen($phone) != 10) { echo json_encode(['error' => 'Invalid phone number']); break; }

        $tenants = readJson('tenants.json', []);
        $found = false;
        foreach ($tenants as &$t) {
            if ($t['unit'] === $unit) {
                $t['phone']    = $phone;
                $t['modified'] = now();
                $found = true;
                break;
            }
        }
        unset($t);

        if (!$found) {
            // Create new
            $tenants[] = [
                'id'       => genId('tnt'),
                'unit'     => $unit,
                'phone'    => $phone,
                'email'    => '',
                'whatsapp' => '',
                'sms_opt'  => true,
                'consent'  => true,
                'created'  => now(),
                'modified' => now()
            ];
        }

        writeJson('tenants.json', $tenants);
        addReport($unit, ($found ? 'Updated' : 'Added') . ' phone number ' . $phone);
        echo json_encode(['ok' => true]);
        break;

    // ── Admin: Delete tenant ──
    case 'admin-delete-tenant':
        requireAdmin();
        if ($method !== 'DELETE' && $method !== 'POST') { echo json_encode(['error' => 'DELETE/POST']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $unit = trim($input['unit'] ?? '');

        $tenants = readJson('tenants.json', []);
        $tenants = array_values(array_filter($tenants, function($t) use ($unit) {
            return $t['unit'] !== $unit;
        }));
        writeJson('tenants.json', $tenants);
        addReport($unit, 'Tenant deleted by admin');
        echo json_encode(['ok' => true]);
        break;

    // ── Admin: Bulk update tenants ──
    case 'admin-bulk-update-tenants':
        requireAdmin();
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $records = $input['records'] ?? [];

        $tenants = readJson('tenants.json', []);
        foreach ($records as $r) {
            $unit  = trim($r['unit'] ?? '');
            $phone = preg_replace('/\D/', '', $r['phone'] ?? '');
            if (strlen($phone) == 11) $phone = preg_replace('/^1/', '', $phone);
            if (strlen($phone) != 10 || $unit === '') continue;

            $found = false;
            foreach ($tenants as &$t) {
                if ($t['unit'] === $unit) {
                    $t['phone'] = $phone;
                    $t['modified'] = now();
                    $found = true;
                    break;
                }
            }
            unset($t);
        }
        writeJson('tenants.json', $tenants);
        echo json_encode(['ok' => true]);
        break;

    // ── Admin: Bulk delete tenants ──
    case 'admin-bulk-delete-tenants':
        requireAdmin();
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $units = $input['units'] ?? [];

        $tenants = readJson('tenants.json', []);
        $tenants = array_values(array_filter($tenants, function($t) use ($units) {
            return !in_array($t['unit'], $units);
        }));
        writeJson('tenants.json', $tenants);
        echo json_encode(['ok' => true]);
        break;

    // ── Admin: Delete packages ──
    case 'admin-delete-packages':
        requireAdmin();
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $units = $input['units'] ?? [];

        $packages = readJson('packages.json', []);
        $packages = array_values(array_filter($packages, function($p) use ($units) {
            return !in_array($p['unit'], $units);
        }));
        writeJson('packages.json', $packages);
        echo json_encode(['ok' => true]);
        break;

    // ── Admin: Reports ──
    case 'admin-reports':
        requireAdmin();
        $from = $_GET['date_from'] ?? today();
        $to   = $_GET['date_to'] ?? today();
        $type = $_GET['type'] ?? 'report';

        if ($type === 'signup') {
            $tenants = readJson('tenants.json', []);
            $filtered = array_values(array_filter($tenants, function($t) use ($from, $to) {
                $d = substr($t['modified'], 0, 10);
                return $d >= $from && $d <= $to;
            }));
            usort($filtered, function($a, $b) { return strcmp($b['modified'], $a['modified']); });
            echo json_encode(['ok' => true, 'data' => array_slice($filtered, 0, 200)]);
        } else {
            $reports = readJson('reports.json', []);
            $filtered = array_values(array_filter($reports, function($r) use ($from, $to) {
                $d = substr($r['timestamp'], 0, 10);
                return $d >= $from && $d <= $to;
            }));
            echo json_encode(['ok' => true, 'data' => array_slice($filtered, 0, 200)]);
        }
        break;

    // ── Admin: Upload kiosk image ──
    case 'admin-upload-image':
        requireAdmin();
        if (!isset($_FILES['file'])) { echo json_encode(['error' => 'No file']); break; }

        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['png','jpg','jpeg','gif','webp','pdf'])) {
            echo json_encode(['error' => 'Allowed: PNG/JPG/JPEG/GIF/WEBP/PDF']);
            break;
        }

        $fname = bin2hex(random_bytes(8));
        $path = UPLOAD_DIR . '/' . $fname . '.' . $ext;
        move_uploaded_file($file['tmp_name'], $path);

        // Add to settings
        $settings = readJson('settings.json', []);
        if (!isset($settings['kiosk_images'])) $settings['kiosk_images'] = [];
        $settings['kiosk_images'][] = [
            'id'       => $fname,
            'filename' => $fname . '.' . $ext,
            'ext'      => $ext,
            'uploaded' => now()
        ];
        writeJson('settings.json', $settings);

        echo json_encode(['ok' => true, 'filename' => $fname . '.' . $ext, 'id' => $fname]);
        break;

    // ── Admin: Delete kiosk image ──
    case 'admin-delete-image':
        requireAdmin();
        if ($method !== 'POST' && $method !== 'DELETE') { echo json_encode(['error' => 'POST/DELETE']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $filename = trim($input['filename'] ?? '');

        if ($filename) {
            @unlink(UPLOAD_DIR . '/' . $filename);
            $settings = readJson('settings.json', []);
            if (isset($settings['kiosk_images'])) {
                $settings['kiosk_images'] = array_values(array_filter($settings['kiosk_images'], function($img) use ($filename) {
                    return $img['filename'] !== $filename;
                }));
                writeJson('settings.json', $settings);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    // ── Admin: Community updates CRUD ──
    case 'admin-community-updates':
        requireAdmin();
        $updates = readJson('community-updates.json', []);

        if ($method === 'GET') {
            echo json_encode(['ok' => true, 'updates' => $updates]);
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';

            if ($id) {
                // Update existing
                foreach ($updates as &$u) {
                    if ($u['id'] === $id) {
                        if (isset($input['title']))  $u['title']  = $input['title'];
                        if (isset($input['body']))   $u['body']   = $input['body'];
                        if (isset($input['active'])) $u['active'] = (bool)$input['active'];
                        $u['modified'] = now();
                        break;
                    }
                }
                unset($u);
            } else {
                // Create new
                $updates[] = [
                    'id'       => genId('upd'),
                    'title'    => $input['title'] ?? '',
                    'body'     => $input['body'] ?? '',
                    'active'   => true,
                    'created'  => now(),
                    'modified' => now()
                ];
            }
            writeJson('community-updates.json', $updates);
            echo json_encode(['ok' => true]);
        } elseif ($method === 'DELETE') {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';
            $updates = array_values(array_filter($updates, function($u) use ($id) { return $u['id'] !== $id; }));
            writeJson('community-updates.json', $updates);
            echo json_encode(['ok' => true]);
        }
        break;

    // ── Admin: Send bulk reminder ──
    case 'admin-send-reminder':
        requireAdmin();
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }

        $packages = readJson('packages.json', []);
        $tenants  = readJson('tenants.json', []);
        $phoneLookup = [];
        foreach ($tenants as $t) { if (!empty($t['phone']) && ($t['sms_opt'] ?? true)) $phoneLookup[$t['unit']] = $t['phone']; }

        $sent = 0;
        foreach ($packages as $p) {
            if ($p['status'] === 'Pending' && isset($phoneLookup[$p['unit']])) {
                $phone = $phoneLookup[$p['unit']];
                $msg = "Reminder: your package(s) are waiting in lobby. They will be returned after 7 days.";
                $resp = sendDeliverySMS($phone, $msg);
                if ($resp['status'] === 'success') {
                    logMessage($p['unit'], $phone, $msg, $resp['id'] ?? '');
                    addReport($p['unit'], 'Reminder SMS sent');
                    $sent++;
                }
            }
        }
        echo json_encode(['ok' => true, 'sent' => $sent]);
        break;

    // ── Admin: Login check ──
    case 'admin-login':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $password = trim($input['password'] ?? '');
        // Accept yesterday's date (legacy) OR admin password
        if ($password === date('Ymd', strtotime('-1 day')) || $password === ADMIN_PASSWORD) {
            echo json_encode(['ok' => true, 'token' => ADMIN_PASSWORD]);
        } else {
            echo json_encode(['error' => 'Invalid password']);
        }
        break;

    default:
        echo json_encode(['error' => 'Unknown action: ' . $action]);
        break;
}
?>
