<?php
// ── WILLOW TENANT APP API ─────────────────────────
// Single endpoint for app.willowpa.com frontend
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {

// ═══════════════════════════════════════════════════
//  AUTH — login / limited access / session
// ═══════════════════════════════════════════════════

    // ── Registered user login ──
    // username = last name (lowercased) + last 4 digits of phone
    case 'login':
        $username = strtolower(trim($input['username'] ?? ''));
        if (!$username) { echo json_encode(['error' => 'Username required']); break; }

        // LOCAL_MODE: test accounts for local testing
        $localTestUsers = LOCAL_MODE ? [
            'test1234' => ['id'=>999, 'apt'=>'225', 'name'=>'Test User', 'note'=>'Tel: 2159178700 Email: test@test.com', 'type'=>'short-stay', 'owner'=>'Willow', 'rent'=>1200, 'balance'=>0, 'due'=>'2026-05-01', 'lease_end'=>'2026-12-31', 'checkin'=>'2026-04-01'],
            'long1234' => ['id'=>998, 'apt'=>'103', 'name'=>'Long Term User', 'note'=>'Tel: 2671231234 Email: long@test.com', 'type'=>'long-term', 'owner'=>'Willow', 'rent'=>950, 'balance'=>0, 'due'=>'2026-05-01', 'lease_end'=>'2027-06-30', 'checkin'=>''],
            'guest1234' => ['id'=>997, 'apt'=>'311', 'name'=>'Guest User', 'note'=>'Tel: 2670001234 Email: guest@test.com', 'type'=>'short-stay', 'owner'=>'Willow', 'rent'=>800, 'balance'=>0, 'due'=>'', 'lease_end'=>'', 'checkin'=>'2026-04-05'],
        ] : [];

        $matched = null;

        // Check local test accounts first
        if (isset($localTestUsers[$username])) {
            $matched = $localTestUsers[$username];
        }

        // Then try Supabase
        if (!$matched) {
            $result = supabase('units', 'select=*&archived=is.false');
            if ($result['code'] !== 200 || !is_array($result['data'])) {
                if (!LOCAL_MODE) {
                    echo json_encode(['error' => 'Could not reach database']);
                    break;
                }
            } else {
                foreach ($result['data'] as $unit) {
                    $phone = '';
                    if (preg_match('/Tel:\s*\(?(\d[\d\s\-\(\)]*)/i', $unit['note'] ?? '', $pm)) {
                        $phone = preg_replace('/\D/', '', $pm[1]);
                    }
                    $last4 = strlen($phone) >= 4 ? substr($phone, -4) : '';
                    $nameParts = preg_split('/\s+/', trim($unit['name'] ?? ''));
                    $lastName = strtolower(end($nameParts));
                    $expected = $lastName . $last4;
                    if ($expected && $username === $expected) {
                        $matched = $unit;
                        break;
                    }
                }
            }
        }

        if (!$matched) {
            echo json_encode(['error' => 'Invalid credentials. Use your last name + last 4 digits of your phone number.']);
            break;
        }

        // Parse contact info from note
        $phone = ''; $email = '';
        if (preg_match('/Tel:\s*\(?(\d[\d\s\-\(\)]*)/i', $matched['note'] ?? '', $pm)) {
            $phone = preg_replace('/\D/', '', $pm[1]);
        }
        if (preg_match('/Email:\s*(\S+)/i', $matched['note'] ?? '', $em)) {
            $email = $em[1];
        }

        // Determine user type
        $type = $matched['type'] ?? 'short-stay';
        $userType = 'short-term';
        if ($type === 'long-term') $userType = 'long-term';
        elseif ($type === 'month-to-month') $userType = 'month-to-month';

        // Create session
        $token = bin2hex(random_bytes(24));
        $session = [
            'token'      => $token,
            'unit_id'    => $matched['id'],
            'unit'       => $matched['apt'],
            'name'       => $matched['name'],
            'owner'      => $matched['owner'] ?? '',
            'user_type'  => $userType,
            'type_raw'   => $type,
            'phone'      => $phone,
            'email'      => $email,
            'rent'       => $matched['rent'] ?? 0,
            'balance'    => $matched['balance'] ?? 0,
            'due'        => $matched['due'] ?? '',
            'lease_end'  => $matched['lease_end'] ?? '',
            'checkin'    => $matched['checkin'] ?? '',
            'created'    => now(),
            'expires'    => date('Y-m-d H:i:s', strtotime('+7 days'))
        ];

        $sessions = readJson('sessions.json', []);
        // Remove old sessions for this unit
        $sessions = array_values(array_filter($sessions, fn($s) => $s['unit'] !== $matched['apt']));
        $sessions[] = $session;
        writeJson('sessions.json', $sessions);

        echo json_encode([
            'ok'        => true,
            'token'     => $token,
            'user_type' => $userType,
            'name'      => $matched['name'],
            'unit'      => $matched['apt'],
            'phone'     => $phone,
            'email'     => $email
        ]);
        break;

    // ── Limited / guest access (no login) ──
    case 'guest-access':
        $name    = trim($input['name'] ?? '');
        $unit    = trim($input['unit'] ?? '');
        $phone   = trim($input['phone'] ?? '');
        $address = trim($input['address'] ?? '');

        if (!$name || !$unit || !$phone) {
            echo json_encode(['error' => 'Name, unit, and phone are required']);
            break;
        }

        $token = bin2hex(random_bytes(24));
        $session = [
            'token'     => $token,
            'unit'      => $unit,
            'name'      => $name,
            'phone'     => $phone,
            'address'   => $address,
            'user_type' => 'limited',
            'created'   => now(),
            'expires'   => date('Y-m-d H:i:s', strtotime('+24 hours'))
        ];

        $sessions = readJson('sessions.json', []);
        $sessions[] = $session;
        writeJson('sessions.json', $sessions);

        echo json_encode([
            'ok'        => true,
            'token'     => $token,
            'user_type' => 'limited',
            'name'      => $name,
            'unit'      => $unit
        ]);
        break;

    // ── Get current session info ──
    case 'me':
        $user = requirePortalAuth();
        echo json_encode(['ok' => true, 'user' => $user]);
        break;

    // ── Logout ──
    case 'logout':
        $user = getPortalUser();
        if ($user) {
            $sessions = readJson('sessions.json', []);
            $sessions = array_values(array_filter($sessions, fn($s) => $s['token'] !== $user['token']));
            writeJson('sessions.json', $sessions);
        }
        echo json_encode(['ok' => true]);
        break;

// ═══════════════════════════════════════════════════
//  DASHBOARD — aggregated data
// ═══════════════════════════════════════════════════

    case 'dashboard':
        $user = requirePortalAuth();
        $unit = $user['unit'];
        $data = ['unit' => $unit, 'user_type' => $user['user_type'], 'name' => $user['name']];

        // Package count
        if (LOCAL_MODE) {
            $pkgs = readLocalJson(DELIVERY_DATA_DIR, 'packages.json');
            $data['packages_pending'] = 0;
            foreach ($pkgs as $p) {
                if (($p['unit'] ?? '') === $unit && ($p['status'] ?? '') === 'Pending')
                    $data['packages_pending'] += intval($p['count'] ?? 1);
            }
        } else {
            $pkgs = proxyApi(DELIVERY_API, 'packages-by-unit&unit=' . urlencode($unit), 'GET', null, false);
            $data['packages_pending'] = 0;
            if (is_array($pkgs)) {
                foreach ($pkgs as $p) {
                    if (($p['status'] ?? '') === 'Pending') $data['packages_pending'] += intval($p['count'] ?? 1);
                }
            }
        }

        // Active parking
        if (LOCAL_MODE) {
            $bookings = readLocalJson(PARKING_DATA_DIR, 'bookings.json');
            $data['parking_active'] = null;
            foreach ($bookings as $b) {
                if (($b['unit'] ?? '') === $unit && ($b['status'] ?? '') === 'active' &&
                    ($b['end_date'] ?? '') >= today()) {
                    $data['parking_active'] = $b;
                    break;
                }
            }
        } else {
            $bookings = proxyApi(PARKING_API, 'admin-bookings');
            $data['parking_active'] = null;
            if (is_array($bookings)) {
                foreach ($bookings as $b) {
                    if (($b['unit_number'] ?? '') === $unit && ($b['status'] ?? '') === 'active' &&
                        ($b['end_date'] ?? '') >= today()) {
                        $data['parking_active'] = $b;
                        break;
                    }
                }
            }
        }

        // Maintenance requests from portal data
        $requests = readJson('maintenance.json', []);
        $data['maintenance_open'] = count(array_filter($requests, fn($r) =>
            $r['unit'] === $unit && !in_array($r['status'], ['completed', 'cancelled'])
        ));

        // Unread notifications
        $notifs = readJson('notifications.json', []);
        $data['unread_count'] = count(array_filter($notifs, fn($n) =>
            $n['unit'] === $unit && !($n['read'] ?? false)
        ));

        // Community updates
        if (LOCAL_MODE) {
            $updates = readLocalJson(DELIVERY_DATA_DIR, 'community-updates.json');
            $data['community_updates'] = array_values(array_filter($updates, fn($u) => ($u['active'] ?? true)));
        } else {
            $updates = proxyApi(DELIVERY_API, 'community-updates', 'GET', null, false);
            $data['community_updates'] = is_array($updates) ? array_filter($updates, fn($u) => ($u['active'] ?? true)) : [];
            $data['community_updates'] = array_values($data['community_updates']);
        }

        echo json_encode($data);
        break;

// ═══════════════════════════════════════════════════
//  CHECK-IN / CHECK-OUT / USEFUL INFO
// ═══════════════════════════════════════════════════

    case 'checkin-info':
        $user = requirePortalAuth();
        if ($user['user_type'] === 'limited') {
            echo json_encode(['error' => 'Not available for guest access']);
            break;
        }

        // Try Supabase property_settings.app_content first
        if (!LOCAL_MODE) {
            $unit = $user['unit'] ?? '*';
            // Try unit-specific, then wildcard
            $res = supabase('property_settings', 'select=app_content&apt=eq.' . urlencode($unit));
            if ($res['code'] === 200 && !empty($res['data'][0]['app_content'])) {
                $ac = $res['data'][0]['app_content'];
                echo json_encode([
                    'entry_code'    => $ac['entry_code'] ?? '',
                    'wifi_name'     => $ac['wifi_name'] ?? '',
                    'wifi_pass'     => $ac['wifi_pass'] ?? '',
                    'checkin_time'  => $ac['checkin_time'] ?? '3:00 PM',
                    'checkout_time' => $ac['checkout_time'] ?? '11:00 AM',
                    'instructions'  => $ac['checkin_instructions'] ?? '',
                    'house_rules'   => $ac['house_rules'] ?? '',
                    'checkout_instructions' => $ac['checkout_instructions'] ?? ''
                ]);
                break;
            }
            // Try wildcard
            $res = supabase('property_settings', 'select=app_content&apt=eq.*');
            if ($res['code'] === 200 && !empty($res['data'][0]['app_content'])) {
                $ac = $res['data'][0]['app_content'];
                echo json_encode([
                    'entry_code'    => $ac['entry_code'] ?? '',
                    'wifi_name'     => $ac['wifi_name'] ?? '',
                    'wifi_pass'     => $ac['wifi_pass'] ?? '',
                    'checkin_time'  => $ac['checkin_time'] ?? '3:00 PM',
                    'checkout_time' => $ac['checkout_time'] ?? '11:00 AM',
                    'instructions'  => $ac['checkin_instructions'] ?? '',
                    'house_rules'   => $ac['house_rules'] ?? '',
                    'checkout_instructions' => $ac['checkout_instructions'] ?? ''
                ]);
                break;
            }
        }

        // Fallback: local JSON
        $info = readJson('checkin-info.json', []);
        $unitInfo = null;
        $defaultInfo = null;
        foreach ($info as $i) {
            if (($i['unit'] ?? '') === $user['unit']) { $unitInfo = $i; break; }
            if (($i['unit'] ?? '') === '*') $defaultInfo = $i;
        }
        echo json_encode($unitInfo ?? $defaultInfo ?? [
            'entry_code'  => '',
            'wifi_name'   => 'ChelPlaza-Guest',
            'wifi_pass'   => '',
            'instructions' => 'Check-in instructions will be sent before your arrival.',
            'house_rules' => '',
            'checkout_instructions' => '',
            'checkout_time' => '11:00 AM',
            'checkin_time'  => '3:00 PM'
        ]);
        break;

    case 'useful-info':
        $user = requirePortalAuth();

        // Try Supabase property_settings.app_content first
        if (!LOCAL_MODE) {
            $unit = $user['unit'] ?? '*';
            $res = supabase('property_settings', 'select=app_content&apt=eq.' . urlencode($unit));
            if ($res['code'] !== 200 || empty($res['data'][0]['app_content'])) {
                $res = supabase('property_settings', 'select=app_content&apt=eq.*');
            }
            if ($res['code'] === 200 && !empty($res['data'][0]['app_content'])) {
                $ac = $res['data'][0]['app_content'];
                $rules = $ac['house_rules'] ?? '';
                echo json_encode([
                    'wifi' => ['name' => $ac['wifi_name'] ?? '', 'password' => $ac['wifi_pass'] ?? ''],
                    'emergency' => [
                        'police' => '911', 'fire' => '911',
                        'maintenance_urgent' => $ac['emergency_maintenance'] ?? '',
                        'management' => $ac['emergency_management'] ?? ''
                    ],
                    'trash' => $ac['trash'] ?? '',
                    'parking' => $ac['parking'] ?? '',
                    'roku' => $ac['roku'] ?? '',
                    'laundry' => $ac['laundry'] ?? '',
                    'mail' => $ac['mail'] ?? '',
                    'house_rules' => is_string($rules) ? array_filter(array_map('trim', explode("\n", $rules))) : (array)$rules,
                    'checkin_time' => $ac['checkin_time'] ?? '3:00 PM',
                    'checkout_time' => $ac['checkout_time'] ?? '11:00 AM'
                ]);
                break;
            }
        }

        // Fallback: local JSON
        $info = readJson('useful-info.json', [
            'wifi' => ['name' => 'ChelPlaza-Guest', 'password' => ''],
            'emergency' => ['police' => '911', 'maintenance' => '+12678650001', 'management' => '+12678650001'],
            'trash' => 'Trash room is on each floor near the elevator. Recycling bins are in the basement.',
            'parking' => 'Visitor parking is available in the rear lot. Contact management for a permit.',
            'roku' => 'Roku devices are pre-configured. Use the remote to access streaming apps.',
            'house_rules' => [
                'No smoking in units or common areas',
                'Quiet hours: 10 PM - 8 AM',
                'No pets without prior approval',
                'Report maintenance issues promptly'
            ],
            'laundry' => 'Laundry room on basement level. Coin-operated machines available 7 AM - 10 PM.',
            'mail' => 'Mailboxes are in the lobby. Packages are held at the front desk.'
        ]);
        echo json_encode($info);
        break;

// ═══════════════════════════════════════════════════
//  MAINTENANCE REQUESTS + CHAT
// ═══════════════════════════════════════════════════

    case 'maintenance-submit':
        $user = requirePortalAuth();
        if ($user['user_type'] !== 'limited' || true) { // all types can submit
            $requests = readJson('maintenance.json', []);

            $req = [
                'id'          => genId('mnt'),
                'unit'        => $user['unit'],
                'name'        => $user['name'],
                'user_type'   => $user['user_type'],
                'phone'       => $user['phone'] ?? '',
                'category'    => trim($input['category'] ?? 'General'),
                'description' => trim($input['description'] ?? ''),
                'urgency'     => trim($input['urgency'] ?? 'normal'),
                'permission_to_enter' => $input['permission_to_enter'] ?? false,
                'photos'      => $input['photos'] ?? [],
                'status'      => 'submitted',
                'created'     => now(),
                'updated'     => now(),
                'chat'        => [[
                    'from'    => 'system',
                    'text'    => 'Maintenance request submitted.',
                    'time'    => now()
                ]]
            ];

            array_unshift($requests, $req);
            writeJson('maintenance.json', $requests);

            // Add notification
            $notifs = readJson('notifications.json', []);
            array_unshift($notifs, [
                'id'    => genId('ntf'),
                'unit'  => $user['unit'],
                'type'  => 'maintenance',
                'title' => 'Request Submitted',
                'body'  => 'Your maintenance request has been submitted. We\'ll update you soon.',
                'ref'   => $req['id'],
                'read'  => false,
                'time'  => now()
            ]);
            writeJson('notifications.json', $notifs);

            echo json_encode(['ok' => true, 'request' => $req]);
        }
        break;

    case 'maintenance-list':
        $user = requirePortalAuth();
        $requests = readJson('maintenance.json', []);
        $mine = array_values(array_filter($requests, fn($r) => $r['unit'] === $user['unit']));
        echo json_encode($mine);
        break;

    case 'maintenance-detail':
        $user = requirePortalAuth();
        $id = $_GET['id'] ?? '';
        $requests = readJson('maintenance.json', []);
        $found = null;
        foreach ($requests as $r) {
            if ($r['id'] === $id && $r['unit'] === $user['unit']) { $found = $r; break; }
        }
        if ($found) echo json_encode($found);
        else { http_response_code(404); echo json_encode(['error' => 'Not found']); }
        break;

    // ── Chat on maintenance request ──
    case 'maintenance-chat':
        $user = requirePortalAuth();
        $id   = $input['id'] ?? '';
        $msg  = trim($input['message'] ?? '');
        if (!$id || !$msg) { echo json_encode(['error' => 'ID and message required']); break; }

        $requests = readJson('maintenance.json', []);
        $found = false;
        foreach ($requests as &$r) {
            if ($r['id'] === $id && $r['unit'] === $user['unit']) {
                $r['chat'][] = [
                    'from' => 'tenant',
                    'name' => $user['name'],
                    'text' => $msg,
                    'time' => now()
                ];
                $r['updated'] = now();
                $found = true;
                break;
            }
        }
        unset($r);

        if ($found) {
            writeJson('maintenance.json', $requests);
            echo json_encode(['ok' => true]);
        } else {
            echo json_encode(['error' => 'Request not found']);
        }
        break;

    // ── Upload photo for maintenance ──
    case 'maintenance-photo':
        $user = requirePortalAuth();
        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!isset($_FILES['photo'])) {
            echo json_encode(['error' => 'No file uploaded']);
            break;
        }

        $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg','jpeg','png','gif','webp'])) {
            echo json_encode(['error' => 'Invalid file type']);
            break;
        }

        $filename = genId('img') . '.' . $ext;
        move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . '/' . $filename);
        echo json_encode(['ok' => true, 'filename' => $filename, 'url' => 'api/uploads/' . $filename]);
        break;

// ═══════════════════════════════════════════════════
//  PARKING
// ═══════════════════════════════════════════════════

    case 'parking-buildings':
        if (LOCAL_MODE) {
            $buildings = readLocalJson(PARKING_DATA_DIR, 'buildings.json');
            $active = array_values(array_filter($buildings, fn($b) => !empty($b['active'])));
            echo json_encode($active);
        } else {
            $result = proxyApi(PARKING_API, 'buildings', 'GET', null, false);
            echo json_encode($result ?? []);
        }
        break;

    case 'parking-plans':
        $buildingId = $_GET['building_id'] ?? '';
        if (LOCAL_MODE) {
            $buildings = readLocalJson(PARKING_DATA_DIR, 'buildings.json');
            $plans = [];
            foreach ($buildings as $b) {
                if ($b['id'] === $buildingId) { $plans = $b['plans'] ?? []; break; }
            }
            echo json_encode($plans);
        } else {
            $result = proxyApi(PARKING_API, 'plans&building_id=' . urlencode($buildingId), 'GET', null, false);
            echo json_encode($result ?? []);
        }
        break;

    case 'parking-book':
        $user = requirePortalAuth();
        if (LOCAL_MODE) {
            $bookings = readLocalJson(PARKING_DATA_DIR, 'bookings.json');
            $booking = [
                'id' => 'pk_' . rand(1000,9999),
                'building_id' => $input['building_id'] ?? '',
                'building_name' => $input['building_name'] ?? '',
                'unit' => $user['unit'],
                'guest_name' => $user['name'],
                'plan' => $input['plan'] ?? '',
                'amount' => floatval($input['amount'] ?? 0),
                'start_date' => $input['start_date'] ?? today(),
                'end_date' => $input['end_date'] ?? today(),
                'car_brand' => $input['car_brand'] ?? '',
                'car_model' => $input['car_model'] ?? '',
                'car_color' => $input['car_color'] ?? '',
                'license_plate' => $input['license_plate'] ?? '',
                'phone' => $user['phone'] ?? '',
                'email' => $user['email'] ?? '',
                'transaction_id' => 'local_' . bin2hex(random_bytes(8)),
                'payment_account' => 'Local Test',
                'status' => 'active',
                'created' => today()
            ];
            array_unshift($bookings, $booking);
            writeLocalJson(PARKING_DATA_DIR, 'bookings.json', $bookings);
            echo json_encode(['ok' => true, 'booking' => $booking]);
        } else {
            $input['unit_number'] = $user['unit'];
            $input['guest_name']  = $user['name'];
            $input['phone']       = $user['phone'] ?? '';
            $input['email']       = $user['email'] ?? '';
            $result = proxyApi(PARKING_API, 'book', 'POST', $input, false);
            echo json_encode($result ?? ['error' => 'Booking failed']);
        }
        break;

    case 'parking-my':
        $user = requirePortalAuth();
        if (LOCAL_MODE) {
            $bookings = readLocalJson(PARKING_DATA_DIR, 'bookings.json');
            $mine = array_values(array_filter($bookings, fn($b) => ($b['unit'] ?? '') === $user['unit']));
            usort($mine, fn($a, $b) => strcmp($b['start_date'] ?? '', $a['start_date'] ?? ''));
            echo json_encode($mine);
        } else {
            $bookings = proxyApi(PARKING_API, 'admin-bookings');
            $mine = [];
            if (is_array($bookings)) {
                foreach ($bookings as $b) {
                    if (($b['unit_number'] ?? '') === $user['unit']) $mine[] = $b;
                }
            }
            usort($mine, fn($a, $b) => strcmp($b['start_date'] ?? '', $a['start_date'] ?? ''));
            echo json_encode($mine);
        }
        break;

// ═══════════════════════════════════════════════════
//  PACKAGES
// ═══════════════════════════════════════════════════

    case 'packages':
        $user = requirePortalAuth();
        if ($user['user_type'] === 'limited') {
            echo json_encode(['error' => 'Not available for guest access']);
            break;
        }
        if (LOCAL_MODE) {
            $packages = readLocalJson(DELIVERY_DATA_DIR, 'packages.json');
            $pending = array_values(array_filter($packages, fn($p) =>
                ($p['unit'] ?? '') === $user['unit'] && ($p['status'] ?? '') === 'Pending'
            ));
            echo json_encode($pending);
        } else {
            $pending = proxyApi(DELIVERY_API, 'tenant-packages&unit=' . urlencode($user['unit']), 'GET', null, false);
            echo json_encode($pending ?? []);
        }
        break;

    case 'packages-history':
        $user = requirePortalAuth();
        if (LOCAL_MODE) {
            $packages = readLocalJson(DELIVERY_DATA_DIR, 'packages.json');
            $history = array_values(array_filter($packages, fn($p) =>
                ($p['unit'] ?? '') === $user['unit'] && ($p['status'] ?? '') !== 'Pending'
            ));
            echo json_encode(array_slice($history, 0, 20));
        } else {
            $history = proxyApi(DELIVERY_API, 'tenant-history&unit=' . urlencode($user['unit']) . '&limit=20', 'GET', null, false);
            echo json_encode($history ?? []);
        }
        break;

    case 'packages-confirm':
        $user = requirePortalAuth();
        if (LOCAL_MODE) {
            $packages = readLocalJson(DELIVERY_DATA_DIR, 'packages.json');
            $found = false;
            foreach ($packages as &$p) {
                if (($p['unit'] ?? '') === $user['unit'] && ($p['status'] ?? '') === 'Pending') {
                    $p['status'] = 'Collected';
                    $p['collected'] = date('Y-m-d H:i:s');
                    $p['modified'] = date('Y-m-d H:i:s');
                    $found = true;
                }
            }
            unset($p);
            if ($found) {
                writeLocalJson(DELIVERY_DATA_DIR, 'packages.json', $packages);
                echo json_encode(['ok' => true]);
            } else {
                echo json_encode(['error' => 'No pending packages']);
            }
        } else {
            $result = proxyApi(DELIVERY_API, 'tenant-confirm-pickup', 'POST', ['unit' => $user['unit']], false);
            echo json_encode($result ?? ['error' => 'Failed']);
        }
        break;

// ═══════════════════════════════════════════════════
//  NOTIFICATIONS (in-app)
// ═══════════════════════════════════════════════════

    case 'notifications':
        $user = requirePortalAuth();
        $notifs = readJson('notifications.json', []);
        $mine = array_values(array_filter($notifs, fn($n) => $n['unit'] === $user['unit']));
        // Return last 50
        echo json_encode(array_slice($mine, 0, 50));
        break;

    case 'notifications-read':
        $user = requirePortalAuth();
        $id = $input['id'] ?? '';
        $notifs = readJson('notifications.json', []);
        foreach ($notifs as &$n) {
            if ($n['id'] === $id && $n['unit'] === $user['unit']) {
                $n['read'] = true;
                break;
            }
        }
        unset($n);
        writeJson('notifications.json', $notifs);
        echo json_encode(['ok' => true]);
        break;

    case 'notifications-read-all':
        $user = requirePortalAuth();
        $notifs = readJson('notifications.json', []);
        foreach ($notifs as &$n) {
            if ($n['unit'] === $user['unit']) $n['read'] = true;
        }
        unset($n);
        writeJson('notifications.json', $notifs);
        echo json_encode(['ok' => true]);
        break;

// ═══════════════════════════════════════════════════
//  COMMUNITY UPDATES
// ═══════════════════════════════════════════════════

    case 'community-updates':
        $updates = proxyApi(DELIVERY_API, 'community-updates', 'GET', null, false);
        echo json_encode(is_array($updates) ? $updates : []);
        break;

// ═══════════════════════════════════════════════════
//  FORMS / AGREEMENTS
// ═══════════════════════════════════════════════════

    case 'forms':
        $user = requirePortalAuth();
        if ($user['user_type'] === 'limited') {
            echo json_encode(['error' => 'Not available for guest access']);
            break;
        }
        $forms = readJson('forms.json', []);
        // Return forms for this unit or universal forms
        $mine = array_values(array_filter($forms, function($f) use ($user) {
            return ($f['unit'] ?? '*') === '*' || ($f['unit'] ?? '') === $user['unit'];
        }));
        // Filter by user type
        $mine = array_values(array_filter($mine, function($f) use ($user) {
            $types = $f['user_types'] ?? ['short-term','short-stay'];
            return in_array($user['user_type'], $types);
        }));
        // Check signed status from signatures
        $sigs = readJson('signatures.json', []);
        foreach ($mine as &$f) {
            $f['signed'] = false;
            $f['signed_at'] = '';
            foreach ($sigs as $s) {
                if ($s['form_id'] === $f['id'] && $s['unit'] === $user['unit']) {
                    $f['signed'] = true;
                    $f['signed_at'] = $s['signed_at'] ?? '';
                    break;
                }
            }
        }
        unset($f);
        echo json_encode($mine);
        break;

    case 'form-detail':
        $user = requirePortalAuth();
        $id = $_GET['id'] ?? '';
        $forms = readJson('forms.json', []);
        $found = null;
        foreach ($forms as $f) {
            if ($f['id'] === $id) { $found = $f; break; }
        }
        if (!$found) { http_response_code(404); echo json_encode(['error'=>'Form not found']); break; }

        // Check if signed
        $sigs = readJson('signatures.json', []);
        $found['signed'] = false;
        $found['signed_at'] = '';
        foreach ($sigs as $s) {
            if ($s['form_id'] === $id && $s['unit'] === $user['unit']) {
                $found['signed'] = true;
                $found['signed_at'] = $s['signed_at'];
                break;
            }
        }
        echo json_encode($found);
        break;

    case 'form-sign':
        $user = requirePortalAuth();
        $id = $input['id'] ?? '';
        if (!$id) { echo json_encode(['error'=>'Form ID required']); break; }

        $sigs = readJson('signatures.json', []);
        // Check not already signed
        foreach ($sigs as $s) {
            if ($s['form_id'] === $id && $s['unit'] === $user['unit']) {
                echo json_encode(['error'=>'Already signed']);
                break 2;
            }
        }

        $sigs[] = [
            'id'        => genId('sig'),
            'form_id'   => $id,
            'unit'      => $user['unit'],
            'name'      => $user['name'],
            'signed_at' => now(),
            'ip'        => $_SERVER['REMOTE_ADDR'] ?? ''
        ];
        writeJson('signatures.json', $sigs);

        // Notification
        $notifs = readJson('notifications.json', []);
        array_unshift($notifs, [
            'id'    => genId('ntf'),
            'unit'  => $user['unit'],
            'type'  => 'forms',
            'title' => 'Agreement Signed',
            'body'  => 'You have successfully signed the agreement.',
            'ref'   => $id,
            'read'  => false,
            'time'  => now()
        ]);
        writeJson('notifications.json', $notifs);

        echo json_encode(['ok' => true]);
        break;

// ═══════════════════════════════════════════════════
//  PAYMENTS
// ═══════════════════════════════════════════════════

    case 'create-payment-intent':
        $user = requirePortalAuth();
        if ($user['user_type'] === 'limited') {
            echo json_encode(['error' => 'Not available for guest access']);
            break;
        }

        // Payment types: rent, parking, maintenance, other
        $payType    = $input['payment_type'] ?? 'rent';
        $amount     = floatval($input['amount'] ?? 0);
        $description = trim($input['description'] ?? '');

        // For rent, use balance from user profile if no amount specified
        if ($payType === 'rent' && $amount <= 0) {
            $amount = floatval($user['balance'] ?? 0);
            $description = $description ?: 'Rent payment — Unit ' . ($user['unit'] ?? '');
        }
        if (!$description) {
            $labels = ['rent' => 'Rent', 'parking' => 'Parking', 'maintenance' => 'Maintenance'];
            $description = ($labels[$payType] ?? 'Payment') . ' — Unit ' . ($user['unit'] ?? '');
        }

        if ($amount <= 0) {
            echo json_encode(['error' => 'No amount due']);
            break;
        }

        // If Stripe is configured, create a payment intent
        if (defined('STRIPE_SECRET_KEY') && STRIPE_SECRET_KEY) {
            $ch = curl_init('https://api.stripe.com/v1/payment_intents');
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query([
                    'amount'   => intval($amount * 100),
                    'currency' => 'usd',
                    'description' => $description,
                    'metadata' => [
                        'unit' => $user['unit'],
                        'name' => $user['name'],
                        'payment_type' => $payType,
                        'source' => 'app.willowpa.com'
                    ]
                ]),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_USERPWD => STRIPE_SECRET_KEY . ':',
            ]);
            $resp = json_decode(curl_exec($ch), true);
            curl_close($ch);

            if (!empty($resp['client_secret'])) {
                // Also record locally
                $payments = readJson('payments.json', []);
                array_unshift($payments, [
                    'id'           => genId('pay'),
                    'unit'         => $user['unit'],
                    'name'         => $user['name'],
                    'amount'       => $amount,
                    'payment_type' => $payType,
                    'method'       => 'stripe',
                    'description'  => $description,
                    'stripe_pi'    => $resp['id'] ?? '',
                    'status'       => 'processing',
                    'created'      => now()
                ]);
                writeJson('payments.json', $payments);

                echo json_encode(['ok' => true, 'client_secret' => $resp['client_secret'], 'publishable_key' => STRIPE_PUBLISHABLE_KEY]);
            } else {
                echo json_encode(['error' => $resp['error']['message'] ?? 'Stripe error']);
            }
        } else {
            // Record payment locally (demo mode — no Stripe keys yet)
            $payments = readJson('payments.json', []);
            array_unshift($payments, [
                'id'           => genId('pay'),
                'unit'         => $user['unit'],
                'name'         => $user['name'],
                'amount'       => $amount,
                'payment_type' => $payType,
                'method'       => $input['method'] ?? 'card',
                'description'  => $description,
                'status'       => 'recorded',
                'created'      => now()
            ]);
            writeJson('payments.json', $payments);

            echo json_encode(['ok' => true, 'demo' => true, 'message' => 'Payment recorded (demo mode). Stripe integration pending.']);
        }
        break;

    case 'payment-history':
        $user = requirePortalAuth();
        $payments = readJson('payments.json', []);
        $mine = array_values(array_filter($payments, fn($p) => ($p['unit'] ?? '') === $user['unit']));
        echo json_encode(array_slice($mine, 0, 20));
        break;

// ═══════════════════════════════════════════════════
//  AI ASSISTANT
// ═══════════════════════════════════════════════════

    case 'ai-ask':
        $user = requirePortalAuth();
        $message = trim($input['message'] ?? '');
        if (!$message) { echo json_encode(['error' => 'Message required']); break; }

        // Load context
        $info = readJson('useful-info.json', []);
        $checkin = readJson('checkin-info.json', []);
        $unitInfo = null;
        foreach ($checkin as $ci) {
            if (($ci['unit'] ?? '') === $user['unit'] || ($ci['unit'] ?? '') === '*') {
                $unitInfo = $ci;
            }
        }

        // Build context for AI
        $context = "You are a helpful building assistant for " . ($user['name'] ?? 'a resident') . " in unit " . ($user['unit'] ?? '') . ".\n";
        $context .= "Building: Chelbourne Plaza.\n";
        if ($unitInfo) {
            if (!empty($unitInfo['wifi_name'])) $context .= "WiFi: " . $unitInfo['wifi_name'] . ($unitInfo['wifi_pass'] ? " / Password: " . $unitInfo['wifi_pass'] : '') . "\n";
            if (!empty($unitInfo['checkin_time'])) $context .= "Check-in time: " . $unitInfo['checkin_time'] . "\n";
            if (!empty($unitInfo['checkout_time'])) $context .= "Check-out time: " . $unitInfo['checkout_time'] . "\n";
            if (!empty($unitInfo['house_rules'])) $context .= "House rules: " . $unitInfo['house_rules'] . "\n";
        }
        if (is_array($info)) {
            if (!empty($info['trash'])) $context .= "Trash: " . $info['trash'] . "\n";
            if (!empty($info['laundry'])) $context .= "Laundry: " . $info['laundry'] . "\n";
            if (!empty($info['parking'])) $context .= "Parking: " . $info['parking'] . "\n";
            if (!empty($info['roku'])) $context .= "TV/Roku: " . $info['roku'] . "\n";
            if (!empty($info['emergency'])) {
                $context .= "Emergency contacts: Police: " . ($info['emergency']['police'] ?? '') .
                    ", Maintenance: " . ($info['emergency']['maintenance'] ?? '') .
                    ", Management: " . ($info['emergency']['management'] ?? '') . "\n";
            }
        }
        $context .= "\nIf the user needs maintenance help, include {\"action\":\"maintenance\"} in your response. For parking help, include {\"action\":\"parking\"}. For info, include {\"action\":\"info\"}.\n";
        $context .= "Keep answers short, friendly, and helpful. Don't mention you're an AI unless asked.";

        // If Anthropic API configured, use it
        if (defined('ANTHROPIC_API_KEY') && ANTHROPIC_API_KEY) {
            $messages = [['role' => 'user', 'content' => $message]];
            // Include recent history
            $history = $input['history'] ?? [];
            if (is_array($history) && count($history) > 0) {
                $messages = [];
                foreach ($history as $h) {
                    $messages[] = ['role' => $h['from'] === 'user' ? 'user' : 'assistant', 'content' => $h['text']];
                }
            }

            $ch = curl_init('https://api.anthropic.com/v1/messages');
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode([
                    'model'      => 'claude-sonnet-4-20250514',
                    'max_tokens' => 300,
                    'system'     => $context,
                    'messages'   => $messages
                ]),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'x-api-key: ' . ANTHROPIC_API_KEY,
                    'anthropic-version: 2023-06-01'
                ],
            ]);
            $resp = json_decode(curl_exec($ch), true);
            curl_close($ch);

            $reply = $resp['content'][0]['text'] ?? 'Sorry, I couldn\'t process that right now.';

            // Check for action tags
            $action = null;
            if (preg_match('/\{"action":"(\w+)"\}/', $reply, $am)) {
                $action = $am[1];
                $reply = preg_replace('/\{"action":"\w+"\}/', '', $reply);
                $reply = trim($reply);
            }

            echo json_encode(['reply' => $reply, 'action' => $action]);
        } else {
            // Fallback: simple keyword matching
            $reply = 'I\'m not fully connected to the AI service yet, but I can try to help! ';
            $action = null;
            $lower = strtolower($message);

            if (strpos($lower, 'wifi') !== false || strpos($lower, 'internet') !== false) {
                if ($unitInfo && !empty($unitInfo['wifi_name'])) {
                    $reply = 'The WiFi network is "' . $unitInfo['wifi_name'] . '"';
                    if (!empty($unitInfo['wifi_pass'])) $reply .= ' and the password is "' . $unitInfo['wifi_pass'] . '"';
                    $reply .= '.';
                } else {
                    $reply = 'WiFi details should be in your check-in info. Let me take you there.';
                    $action = 'info';
                }
            } elseif (strpos($lower, 'checkout') !== false || strpos($lower, 'check out') !== false || strpos($lower, 'check-out') !== false) {
                $reply = 'Check-out time is ' . ($unitInfo['checkout_time'] ?? '11:00 AM') . '. Check the Check-Out section for full details.';
            } elseif (strpos($lower, 'checkin') !== false || strpos($lower, 'check in') !== false || strpos($lower, 'check-in') !== false) {
                $reply = 'Check-in time is ' . ($unitInfo['checkin_time'] ?? '3:00 PM') . '. Your entry codes are in the Check-In section.';
            } elseif (strpos($lower, 'maintenance') !== false || strpos($lower, 'fix') !== false || strpos($lower, 'repair') !== false || strpos($lower, 'broken') !== false) {
                $reply = 'I can help you submit a maintenance request. Let me open that for you.';
                $action = 'maintenance';
            } elseif (strpos($lower, 'parking') !== false || strpos($lower, 'park') !== false || strpos($lower, 'car') !== false) {
                $reply = 'Let me take you to the parking section where you can reserve a spot.';
                $action = 'parking';
            } elseif (strpos($lower, 'trash') !== false || strpos($lower, 'garbage') !== false || strpos($lower, 'recycl') !== false) {
                $reply = is_array($info) && !empty($info['trash']) ? $info['trash'] : 'Trash info is in the Useful Info section.';
            } elseif (strpos($lower, 'rule') !== false) {
                $reply = 'House rules are available in the Useful Info section. Let me take you there.';
                $action = 'info';
            } elseif (strpos($lower, 'pay') !== false || strpos($lower, 'rent') !== false) {
                $reply = 'You can manage your payments in the Payments section.';
            } elseif (strpos($lower, 'package') !== false || strpos($lower, 'mail') !== false || strpos($lower, 'delivery') !== false) {
                $reply = 'Package notifications are in the Packages section. You\'ll get an alert when something arrives.';
            } elseif (strpos($lower, 'emergency') !== false || strpos($lower, '911') !== false) {
                $reply = 'For emergencies call 911. For building maintenance emergencies, call ' . ($info['emergency']['maintenance'] ?? 'the management office') . '.';
            } else {
                $reply = 'I\'m not sure about that. Try checking the Useful Info section, or you can submit a maintenance request if you need help with something in your unit.';
            }

            echo json_encode(['reply' => $reply, 'action' => $action]);
        }
        break;

    // Return Stripe publishable key (frontend needs this to mount Elements)
    case 'stripe-config':
        echo json_encode([
            'publishable_key' => defined('STRIPE_PUBLISHABLE_KEY') ? STRIPE_PUBLISHABLE_KEY : '',
            'enabled' => defined('STRIPE_SECRET_KEY') && STRIPE_SECRET_KEY ? true : false
        ]);
        break;

// ═══════════════════════════════════════════════════
//  PUBLIC ENDPOINTS (no login required)
//  For unregistered guests at app.willowpa.com
// ═══════════════════════════════════════════════════

    // Public maintenance request — goes to unlinked queue
    case 'public-maintenance-submit':
        $name    = trim($input['name'] ?? '');
        $phone   = trim($input['phone'] ?? '');
        $address = trim($input['address'] ?? '');
        $unit    = trim($input['unit'] ?? '');
        $desc    = trim($input['description'] ?? '');
        $cat     = trim($input['category'] ?? 'General');
        $urgency = trim($input['urgency'] ?? 'normal');

        if (!$name || !$phone || !$desc) {
            echo json_encode(['error' => 'Name, phone, and description are required']);
            break;
        }

        $requests = readJson('maintenance.json', []);
        $req = [
            'id'          => genId('mnt'),
            'unit'        => $unit ?: 'UNLINKED',
            'address'     => $address,
            'name'        => $name,
            'user_type'   => 'public',
            'phone'       => $phone,
            'category'    => $cat,
            'description' => $desc,
            'urgency'     => $urgency,
            'permission_to_enter' => $input['permission_to_enter'] ?? false,
            'photos'      => [],
            'status'      => 'submitted',
            'linked_unit' => null,   // Admin fills this in later
            'linked_property' => null,
            'created'     => now(),
            'updated'     => now(),
            'chat'        => [[
                'from' => 'system',
                'text' => 'Public maintenance request submitted by ' . $name . ' (' . $phone . ').' . ($address ? ' Address: ' . $address : ''),
                'time' => now()
            ]]
        ];

        array_unshift($requests, $req);
        writeJson('maintenance.json', $requests);

        echo json_encode(['ok' => true, 'request_id' => $req['id']]);
        break;

    // Admin: link an unregistered maintenance request to a property/unit
    case 'maintenance-link':
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/Bearer\s+(.+)/i', $auth, $m) || $m[1] !== ADMIN_TOKEN) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        $reqId = $input['request_id'] ?? '';
        $linkedUnit = $input['linked_unit'] ?? '';
        $linkedProp = $input['linked_property'] ?? '';

        $requests = readJson('maintenance.json', []);
        $found = false;
        foreach ($requests as &$r) {
            if ($r['id'] === $reqId) {
                $r['linked_unit'] = $linkedUnit;
                $r['linked_property'] = $linkedProp;
                if ($r['unit'] === 'UNLINKED' && $linkedUnit) $r['unit'] = $linkedUnit;
                $r['updated'] = now();
                $r['chat'][] = [
                    'from' => 'admin',
                    'text' => 'Request linked to unit ' . $linkedUnit . ($linkedProp ? ' at ' . $linkedProp : '') . '.',
                    'time' => now()
                ];
                $found = true;
                break;
            }
        }
        unset($r);

        if ($found) {
            writeJson('maintenance.json', $requests);
            echo json_encode(['ok' => true]);
        } else {
            echo json_encode(['error' => 'Request not found']);
        }
        break;

    // Public: list parking buildings (no auth needed)
    case 'public-parking-buildings':
        if (LOCAL_MODE) {
            $buildings = readLocalJson(PARKING_DATA_DIR, 'buildings.json');
            $active = array_values(array_filter($buildings, fn($b) => !empty($b['active'])));
            echo json_encode($active);
        } else {
            echo json_encode(proxyApi(DELIVERY_API, 'buildings', 'GET', null, false) ?? []);
        }
        break;

// ═══════════════════════════════════════════════════
//  DEFAULT
// ═══════════════════════════════════════════════════

    default:
        echo json_encode(['error' => 'Unknown action', 'action' => $action]);
        break;
}
?>
