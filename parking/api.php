<?php
// ── PARKING API ─────────────────────────────────────
// All CRUD + Stripe + SMS + QR endpoints
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// ── Route ──
switch ($action) {

    // ═══ PUBLIC: Get Stripe publishable key ═══
    case 'stripe-key':
        echo json_encode(['key' => STRIPE_PUBLISHABLE_KEY ?: '']);
        break;

    // ═══ PUBLIC: Get buildings for guest frontend ═══
    case 'buildings':
        $buildings = readJson('buildings.json', []);
        // Only return active buildings with their pricing
        $public = array_values(array_filter($buildings, function($b) { return !empty($b['active']); }));
        echo json_encode(['ok' => true, 'buildings' => $public]);
        break;

    // ═══ PUBLIC: Get pricing plans for a building ═══
    case 'plans':
        $buildingId = $_GET['building_id'] ?? '';
        $buildings = readJson('buildings.json', []);
        $building = null;
        foreach ($buildings as $b) { if ($b['id'] === $buildingId) { $building = $b; break; } }
        if (!$building) { echo json_encode(['error' => 'Building not found']); break; }
        echo json_encode(['ok' => true, 'plans' => $building['plans'] ?? [], 'building' => $building['name']]);
        break;

    // ═══ PUBLIC: Validate coupon ═══
    case 'validate-coupon':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $code = strtoupper(trim($input['code'] ?? ''));
        $buildingId = $input['building_id'] ?? '';
        $coupons = readJson('coupons.json', []);
        $coupon = null;
        foreach ($coupons as &$c) {
            if (strtoupper($c['code']) === $code && $c['active']) {
                // Check building scope
                if (!empty($c['building_id']) && $c['building_id'] !== $buildingId) continue;
                // Check expiry
                if (!empty($c['expires']) && $c['expires'] < today()) continue;
                // Check usage limit
                if (!empty($c['max_uses']) && ($c['used'] ?? 0) >= $c['max_uses']) continue;
                $coupon = $c;
                break;
            }
        }
        if ($coupon) {
            echo json_encode(['ok' => true, 'coupon' => [
                'code' => $coupon['code'],
                'type' => $coupon['type'], // 'percent', 'fixed', 'free_days'
                'value' => $coupon['value'],
                'description' => $coupon['description'] ?? ''
            ]]);
        } else {
            echo json_encode(['ok' => false, 'error' => 'Invalid or expired coupon']);
        }
        break;

    // ═══ PUBLIC: Create Stripe Payment Intent ═══
    case 'create-payment':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);
        $amount = floatval($input['amount'] ?? 0);
        if ($amount <= 0) { echo json_encode(['error' => 'Invalid amount']); break; }

        if (!STRIPE_SECRET_KEY) { echo json_encode(['error' => 'Stripe not configured']); break; }

        $ch = curl_init('https://api.stripe.com/v1/payment_intents');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_USERPWD, STRIPE_SECRET_KEY . ':');
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'amount' => round($amount * 100), // cents
            'currency' => 'usd',
            'description' => 'WillowPA Parking - ' . ($input['building_name'] ?? 'Guest'),
            'metadata[building]' => $input['building_name'] ?? '',
            'metadata[unit]' => $input['unit'] ?? '',
            'metadata[plate]' => $input['license_plate'] ?? '',
            'automatic_payment_methods[enabled]' => 'true',
        ]));
        $resp = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($resp, true);
        if ($code >= 200 && $code < 300 && !empty($data['client_secret'])) {
            echo json_encode(['ok' => true, 'clientSecret' => $data['client_secret'], 'paymentIntentId' => $data['id']]);
        } else {
            echo json_encode(['error' => 'Stripe error', 'detail' => $data['error']['message'] ?? 'Unknown']);
        }
        break;

    // ═══ PUBLIC: Complete booking (after payment) ═══
    case 'book':
        if ($method !== 'POST') { echo json_encode(['error' => 'POST only']); break; }
        $input = json_decode(file_get_contents('php://input'), true);

        // Validate required fields
        $required = ['building_id', 'unit_number', 'car_make', 'car_color', 'license_plate', 'plan_days', 'amount', 'start_date'];
        foreach ($required as $f) {
            if (empty($input[$f]) && $input[$f] !== '0' && $input[$f] !== 0) {
                echo json_encode(['error' => "Missing field: $f"]); exit();
            }
        }

        // Apply coupon if present
        $couponCode = strtoupper(trim($input['coupon_code'] ?? ''));
        $couponApplied = null;
        if ($couponCode) {
            $coupons = readJson('coupons.json', []);
            foreach ($coupons as &$c) {
                if (strtoupper($c['code']) === $couponCode && $c['active']) {
                    $c['used'] = ($c['used'] ?? 0) + 1;
                    $couponApplied = $c['code'];
                    break;
                }
            }
            if ($couponApplied) writeJson('coupons.json', $coupons);
        }

        $startDate = $input['start_date'];
        $days = intval($input['plan_days']);
        $endDate = date('Y-m-d', strtotime($startDate . " + $days days"));

        $booking = [
            'id' => genId(),
            'building_id' => $input['building_id'],
            'building_name' => $input['building_name'] ?? '',
            'unit_number' => $input['unit_number'],
            'guest_name' => $input['guest_name'] ?? '',
            'car_make' => $input['car_make'],
            'car_model' => $input['car_model'] ?? '',
            'car_color' => $input['car_color'],
            'license_plate' => strtoupper($input['license_plate']),
            'plan_label' => $input['plan_label'] ?? ($days . ' days'),
            'plan_days' => $days,
            'amount' => floatval($input['amount']),
            'original_amount' => floatval($input['original_amount'] ?? $input['amount']),
            'coupon_code' => $couponApplied,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'phone' => $input['phone'] ?? '',
            'email' => $input['email'] ?? '',
            'sms_consent' => !empty($input['sms_consent']),
            'payment_intent' => $input['payment_intent_id'] ?? '',
            'transaction_id' => $input['transaction_id'] ?? '',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
        ];

        // Save booking
        $bookings = readJson('bookings.json', []);
        $bookings[] = $booking;
        writeJson('bookings.json', $bookings);

        // Generate QR receipt URL
        $receiptUrl = SITE_URL . '/receipt.php?id=' . $booking['id'];

        // Send SMS with QR link if phone provided and consent given
        if (!empty($booking['phone']) && $booking['sms_consent']) {
            sendParkingSMS($booking['phone'],
                "WillowPA Parking Confirmation\n" .
                "Unit: " . $booking['unit_number'] . "\n" .
                "Vehicle: " . $booking['car_make'] . " " . $booking['car_color'] . " " . $booking['license_plate'] . "\n" .
                "Dates: " . $booking['start_date'] . " to " . $booking['end_date'] . "\n" .
                "Receipt: " . $receiptUrl
            );
        }

        // Notify admin
        sendParkingSMS(ADMIN_SMS_NUMBER,
            "New Parking: " . $booking['building_name'] . " #" . $booking['unit_number'] .
            " | " . $booking['license_plate'] . " | " . '$' . number_format($booking['amount'], 2) .
            " | " . $booking['start_date'] . "-" . $booking['end_date']
        );

        echo json_encode([
            'ok' => true,
            'booking' => $booking,
            'receipt_url' => $receiptUrl
        ]);
        break;

    // ═══ PUBLIC: Get booking by ID (for receipt page) ═══
    case 'booking':
        $id = $_GET['id'] ?? '';
        $bookings = readJson('bookings.json', []);
        $found = null;
        foreach ($bookings as $b) { if ($b['id'] === $id) { $found = $b; break; } }
        if ($found) {
            echo json_encode(['ok' => true, 'booking' => $found]);
        } else {
            echo json_encode(['error' => 'Booking not found']);
        }
        break;

    // ═══════════════════════════════════════════════
    //  ADMIN ENDPOINTS (require auth header)
    // ═══════════════════════════════════════════════

    // ═══ ADMIN: Get all bookings ═══
    case 'admin-bookings':
        requireAdmin();
        $bookings = readJson('bookings.json', []);
        // Sort newest first
        usort($bookings, function($a, $b) { return strcmp($b['created_at'] ?? '', $a['created_at'] ?? ''); });
        echo json_encode(['ok' => true, 'bookings' => $bookings]);
        break;

    // ═══ ADMIN: CRUD Buildings ═══
    case 'admin-buildings':
        requireAdmin();
        if ($method === 'GET') {
            echo json_encode(['ok' => true, 'buildings' => readJson('buildings.json', [])]);
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $buildings = readJson('buildings.json', []);
            $building = [
                'id' => genId(),
                'name' => $input['name'] ?? '',
                'address' => $input['address'] ?? '',
                'active' => true,
                'plans' => $input['plans'] ?? [],
                'created_at' => date('Y-m-d H:i:s'),
            ];
            $buildings[] = $building;
            writeJson('buildings.json', $buildings);
            echo json_encode(['ok' => true, 'building' => $building]);
        } elseif ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            $buildings = readJson('buildings.json', []);
            foreach ($buildings as &$b) {
                if ($b['id'] === $input['id']) {
                    if (isset($input['name'])) $b['name'] = $input['name'];
                    if (isset($input['address'])) $b['address'] = $input['address'];
                    if (isset($input['active'])) $b['active'] = $input['active'];
                    if (isset($input['plans'])) $b['plans'] = $input['plans'];
                    break;
                }
            }
            writeJson('buildings.json', $buildings);
            echo json_encode(['ok' => true]);
        } elseif ($method === 'DELETE') {
            $id = $_GET['id'] ?? '';
            $buildings = readJson('buildings.json', []);
            $buildings = array_values(array_filter($buildings, function($b) use ($id) { return $b['id'] !== $id; }));
            writeJson('buildings.json', $buildings);
            echo json_encode(['ok' => true]);
        }
        break;

    // ═══ ADMIN: CRUD Coupons ═══
    case 'admin-coupons':
        requireAdmin();
        if ($method === 'GET') {
            echo json_encode(['ok' => true, 'coupons' => readJson('coupons.json', [])]);
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $coupons = readJson('coupons.json', []);
            $coupon = [
                'id' => genId(),
                'code' => strtoupper(trim($input['code'] ?? '')),
                'type' => $input['type'] ?? 'percent', // percent, fixed, free_days
                'value' => floatval($input['value'] ?? 0),
                'description' => $input['description'] ?? '',
                'building_id' => $input['building_id'] ?? '', // empty = all buildings
                'max_uses' => intval($input['max_uses'] ?? 0), // 0 = unlimited
                'used' => 0,
                'expires' => $input['expires'] ?? '',
                'active' => true,
                'created_at' => date('Y-m-d H:i:s'),
            ];
            $coupons[] = $coupon;
            writeJson('coupons.json', $coupons);
            echo json_encode(['ok' => true, 'coupon' => $coupon]);
        } elseif ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            $coupons = readJson('coupons.json', []);
            foreach ($coupons as &$c) {
                if ($c['id'] === $input['id']) {
                    foreach (['code','type','value','description','building_id','max_uses','expires','active'] as $f) {
                        if (isset($input[$f])) $c[$f] = $input[$f];
                    }
                    break;
                }
            }
            writeJson('coupons.json', $coupons);
            echo json_encode(['ok' => true]);
        } elseif ($method === 'DELETE') {
            $id = $_GET['id'] ?? '';
            $coupons = readJson('coupons.json', []);
            $coupons = array_values(array_filter($coupons, function($c) use ($id) { return $c['id'] !== $id; }));
            writeJson('coupons.json', $coupons);
            echo json_encode(['ok' => true]);
        }
        break;

    // ═══ ADMIN: Dashboard stats ═══
    case 'admin-stats':
        requireAdmin();
        $bookings = readJson('bookings.json', []);
        $today = today();
        $active = array_filter($bookings, function($b) use ($today) { return $b['end_date'] >= $today && $b['status'] === 'active'; });
        $expired = array_filter($bookings, function($b) use ($today) { return $b['end_date'] < $today; });
        $totalRevenue = array_sum(array_column($bookings, 'amount'));
        $monthRevenue = array_sum(array_column(array_filter($bookings, function($b) {
            return substr($b['created_at'], 0, 7) === date('Y-m');
        }), 'amount'));

        echo json_encode([
            'ok' => true,
            'stats' => [
                'total_bookings' => count($bookings),
                'active' => count($active),
                'expired' => count($expired),
                'total_revenue' => $totalRevenue,
                'month_revenue' => $monthRevenue,
            ]
        ]);
        break;

    default:
        echo json_encode(['error' => 'Unknown action: ' . $action]);
}

// ═══ Helpers ═══

function requireAdmin() {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $auth);
    if ($token !== ADMIN_PASSWORD) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}

function sendParkingSMS($to, $msg) {
    $to = preg_replace('/[^0-9]/', '', $to);
    if (strlen($to) === 10) $to = '1' . $to;
    if (substr($to, 0, 1) !== '+') $to = '+' . $to;

    $from = FLOWROUTE_FROM;
    if (substr($from, 0, 1) !== '+') $from = '+' . $from;

    $payload = json_encode([
        'data' => [
            'type' => 'message',
            'attributes' => ['to' => $to, 'from' => $from, 'body' => $msg]
        ]
    ]);

    $ch = curl_init('https://api.flowroute.com/v2.1/messages');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_USERPWD, FLOWROUTE_ACCESS_KEY . ':' . FLOWROUTE_SECRET_KEY);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/vnd.api+json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $resp = curl_exec($ch);
    curl_close($ch);
    return $resp;
}
?>
