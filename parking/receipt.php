<?php
// ── Receipt / QR Code Page ─────────────────────────
// Public page: receipt.php?id=pk_xxxx
require_once __DIR__ . '/config.php';

$id = $_GET['id'] ?? '';
$bookings = readJson('bookings.json', []);
$booking = null;
foreach ($bookings as $b) { if ($b['id'] === $id) { $booking = $b; break; } }

if (!$booking) {
    http_response_code(404);
    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px"><h1>Receipt Not Found</h1><p>This parking receipt does not exist or has been removed.</p></body></html>';
    exit();
}

// QR data = this receipt URL
$qrData = urlencode(SITE_URL . '/receipt.php?id=' . $booking['id']);
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=$qrData";
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Parking Receipt — <?= htmlspecialchars($booking['building_name']) ?></title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f5f1eb;color:#1a1a1a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.receipt{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);max-width:420px;width:100%;overflow:hidden}
.receipt-header{background:linear-gradient(135deg,#2c1810,#5a3a28);color:#fff;padding:24px;text-align:center}
.receipt-header h1{font-size:18px;font-weight:700;letter-spacing:1px;margin-bottom:4px}
.receipt-header .subtitle{font-size:12px;opacity:.7}
.qr-wrap{text-align:center;padding:24px;border-bottom:2px dashed #e8e4de}
.qr-wrap img{width:200px;height:200px;border-radius:8px}
.details{padding:20px 24px}
.detail-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px}
.detail-row:last-child{border:none}
.detail-label{color:#8a7e72;font-weight:500}
.detail-value{font-weight:600;color:#2c1810;text-align:right}
.vehicle-section{background:#faf8f5;margin:0 16px;border-radius:10px;padding:16px 20px;margin-bottom:16px}
.vehicle-section h3{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#8a7e72;margin-bottom:10px}
.vehicle-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.veh-item{font-size:13px}
.veh-item span{display:block;font-size:10px;color:#8a7e72;text-transform:uppercase;letter-spacing:.5px}
.amount-bar{background:#2c1810;color:#fff;margin:0 16px 16px;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center}
.amount-bar .total-label{font-size:12px;opacity:.7}
.amount-bar .total-amount{font-size:28px;font-weight:700}
.receipt-footer{text-align:center;padding:16px 24px 24px;font-size:11px;color:#8a7e72;line-height:1.6}
.print-btn{display:block;width:calc(100% - 32px);margin:0 16px 16px;padding:12px;background:#5a3a28;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
.print-btn:hover{background:#2c1810}
@media print{
  body{background:#fff;padding:0}
  .receipt{box-shadow:none;max-width:100%}
  .print-btn{display:none!important}
}
</style>
</head>
<body>
<div class="receipt">
  <div class="receipt-header">
    <h1>🅿 <?= htmlspecialchars($booking['building_name']) ?></h1>
    <div class="subtitle">Parking Receipt</div>
  </div>

  <div class="qr-wrap">
    <img src="<?= $qrUrl ?>" alt="QR Code">
  </div>

  <div class="details">
    <div class="detail-row">
      <span class="detail-label">Booking ID</span>
      <span class="detail-value"><?= htmlspecialchars($booking['id']) ?></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Unit #</span>
      <span class="detail-value"><?= htmlspecialchars($booking['unit_number']) ?></span>
    </div>
    <?php if (!empty($booking['guest_name'])): ?>
    <div class="detail-row">
      <span class="detail-label">Guest</span>
      <span class="detail-value"><?= htmlspecialchars($booking['guest_name']) ?></span>
    </div>
    <?php endif; ?>
    <div class="detail-row">
      <span class="detail-label">Duration</span>
      <span class="detail-value"><?= htmlspecialchars($booking['plan_label']) ?></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Start</span>
      <span class="detail-value"><?= date('M j, Y', strtotime($booking['start_date'])) ?></span>
    </div>
    <div class="detail-row">
      <span class="detail-label">End</span>
      <span class="detail-value"><?= date('M j, Y', strtotime($booking['end_date'])) ?></span>
    </div>
    <?php if (!empty($booking['transaction_id']) || !empty($booking['payment_intent'])): ?>
    <div class="detail-row">
      <span class="detail-label">Transaction</span>
      <span class="detail-value" style="font-size:11px;word-break:break-all"><?= htmlspecialchars($booking['transaction_id'] ?: $booking['payment_intent']) ?></span>
    </div>
    <?php endif; ?>
  </div>

  <div class="vehicle-section">
    <h3>Vehicle Information</h3>
    <div class="vehicle-grid">
      <div class="veh-item"><span>Make</span><?= htmlspecialchars($booking['car_make']) ?></div>
      <div class="veh-item"><span>Model</span><?= htmlspecialchars($booking['car_model'] ?: '—') ?></div>
      <div class="veh-item"><span>Color</span><?= htmlspecialchars($booking['car_color']) ?></div>
      <div class="veh-item"><span>License Plate</span><strong><?= htmlspecialchars($booking['license_plate']) ?></strong></div>
    </div>
  </div>

  <div class="amount-bar">
    <div>
      <div class="total-label">Amount Paid</div>
    </div>
    <div class="total-amount">$<?= number_format($booking['amount'], 2) ?></div>
  </div>

  <button class="print-btn" onclick="window.print()">🖨 Print Receipt</button>

  <div class="receipt-footer">
    <strong>WillowPA Parking</strong><br>
    Parking is at your own risk. WillowPA is not responsible for theft, damage, vandalism, fire, acts of nature, or any loss to vehicles or personal property. By parking here, you accept these terms.<br><br>
    <?= date('M j, Y g:i A', strtotime($booking['created_at'])) ?>
  </div>
</div>
</body>
</html>
