<?php
// ── PACKAGE RECEIPT / PICKUP SLIP ──────────────────
// Printable receipt for confirmed package pickups
// URL: receipt.php?id=pkg_xxxx  OR  receipt.php?unit=305
require_once __DIR__ . '/config.php';

$pkgId = $_GET['id'] ?? '';
$unit  = $_GET['unit'] ?? '';

$packages = readJson('packages.json', []);
$tenants  = readJson('tenants.json', []);

// Find target package(s)
$found = [];
if ($pkgId) {
    foreach ($packages as $p) {
        if ($p['id'] === $pkgId) { $found[] = $p; break; }
    }
} elseif ($unit) {
    foreach ($packages as $p) {
        if ($p['unit'] === $unit && $p['status'] === 'Collected') {
            $found[] = $p;
        }
    }
    // Sort by collected date descending, take most recent batch
    usort($found, function($a, $b) {
        return strcmp($b['collected'] ?? '', $a['collected'] ?? '');
    });
    // Only show packages collected today
    $today = today();
    $found = array_filter($found, function($p) use ($today) {
        return substr($p['collected'] ?? '', 0, 10) === $today;
    });
    $found = array_values($found);
}

// Build tenant lookup
$tenantInfo = [];
foreach ($tenants as $t) {
    $tenantInfo[$t['unit']] = $t;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Receipt — <?= htmlspecialchars(BUILDING_NAME) ?></title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            color: #333;
        }

        .receipt {
            max-width: 500px;
            margin: 0 auto;
            background: #fff;
            border: 2px solid #333;
            border-radius: 8px;
            overflow: hidden;
        }

        .receipt-header {
            background: #1e293b;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .receipt-header h1 {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        .receipt-header .subtitle {
            font-size: 13px;
            opacity: 0.8;
        }

        .receipt-body {
            padding: 20px;
        }

        .receipt-meta {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #ccc;
            padding-bottom: 12px;
            margin-bottom: 16px;
            font-size: 13px;
            color: #666;
        }

        .receipt-unit {
            text-align: center;
            margin-bottom: 16px;
        }
        .receipt-unit .unit-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
        }
        .receipt-unit .unit-number {
            font-size: 36px;
            font-weight: 800;
            color: #1e293b;
        }
        .receipt-unit .tenant-name {
            font-size: 14px;
            color: #666;
            margin-top: 2px;
        }

        .receipt-items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .receipt-items th {
            background: #f8fafc;
            padding: 8px 10px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #888;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        .receipt-items td {
            padding: 10px;
            font-size: 14px;
            border-bottom: 1px solid #f1f5f9;
        }
        .receipt-items tr:last-child td {
            border-bottom: none;
        }

        .receipt-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 16px;
            font-weight: 700;
        }
        .receipt-total .total-count {
            font-size: 22px;
            color: #059669;
        }

        .receipt-footer {
            border-top: 1px dashed #ccc;
            padding-top: 16px;
            text-align: center;
        }
        .receipt-footer .checkmark {
            font-size: 40px;
            color: #059669;
            margin-bottom: 8px;
        }
        .receipt-footer .status {
            font-size: 16px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 4px;
        }
        .receipt-footer .timestamp {
            font-size: 12px;
            color: #999;
        }

        .receipt-barcode {
            text-align: center;
            border-top: 1px dashed #ccc;
            padding: 16px 20px;
            margin-top: 16px;
        }
        .receipt-barcode .id {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #999;
            letter-spacing: 1px;
        }

        .no-print {
            max-width: 500px;
            margin: 16px auto 0;
            text-align: center;
        }
        .no-print button {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            margin: 0 4px;
        }
        .btn-print {
            background: #1e293b;
            color: #fff;
        }
        .btn-close {
            background: #e2e8f0;
            color: #333;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }
        .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
        .empty-state h2 { font-size: 18px; margin-bottom: 8px; color: #333; }
        .empty-state p { font-size: 14px; color: #888; }

        @media print {
            body { background: #fff; padding: 0; }
            .receipt { border: none; border-radius: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>

<?php if (empty($found)): ?>

<div class="receipt">
    <div class="receipt-header">
        <h1><?= htmlspecialchars(BUILDING_NAME) ?></h1>
        <div class="subtitle">Package Delivery System</div>
    </div>
    <div class="receipt-body">
        <div class="empty-state">
            <div class="icon">📦</div>
            <h2>No Receipt Found</h2>
            <p>
                <?php if ($pkgId): ?>
                    Package <strong><?= htmlspecialchars($pkgId) ?></strong> was not found.
                <?php elseif ($unit): ?>
                    No packages collected today for unit <strong><?= htmlspecialchars($unit) ?></strong>.
                <?php else: ?>
                    Please provide a package ID or unit number.<br>
                    <code>receipt.php?id=pkg_xxx</code> or <code>receipt.php?unit=305</code>
                <?php endif; ?>
            </p>
        </div>
    </div>
</div>

<?php else: ?>

<?php
    // Aggregate info
    $firstPkg  = $found[0];
    $unitNum   = $firstPkg['unit'];
    $totalPkgs = 0;
    foreach ($found as $p) $totalPkgs += intval($p['count'] ?? 1);
    $tenant    = $tenantInfo[$unitNum] ?? null;
    $tenantName = $tenant ? trim(($tenant['first_name'] ?? '') . ' ' . ($tenant['last_name'] ?? '')) : '';
    $collectedAt = $firstPkg['collected'] ?? $firstPkg['modified'] ?? now();
    $receiptNum = strtoupper(substr(md5(implode('', array_column($found, 'id'))), 0, 8));
?>

<div class="receipt">
    <div class="receipt-header">
        <h1><?= htmlspecialchars(BUILDING_NAME) ?></h1>
        <div class="subtitle">Package Pickup Receipt</div>
    </div>

    <div class="receipt-body">
        <div class="receipt-meta">
            <span>Receipt #<?= $receiptNum ?></span>
            <span><?= date('M j, Y') ?></span>
        </div>

        <div class="receipt-unit">
            <div class="unit-label">Unit</div>
            <div class="unit-number"><?= htmlspecialchars($unitNum) ?></div>
            <?php if ($tenantName): ?>
                <div class="tenant-name"><?= htmlspecialchars($tenantName) ?></div>
            <?php endif; ?>
        </div>

        <table class="receipt-items">
            <thead>
                <tr>
                    <th>Courier</th>
                    <th>Qty</th>
                    <th>Delivered</th>
                    <th>Collected</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($found as $p): ?>
                <tr>
                    <td><?= htmlspecialchars($p['courier'] ?: '—') ?></td>
                    <td><?= intval($p['count'] ?? 1) ?></td>
                    <td><?= date('M j g:ia', strtotime($p['created'])) ?></td>
                    <td><?= $p['collected'] ? date('M j g:ia', strtotime($p['collected'])) : '—' ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>

        <div class="receipt-total">
            <span>Total Packages Collected</span>
            <span class="total-count"><?= $totalPkgs ?></span>
        </div>

        <div class="receipt-footer">
            <div class="checkmark">&#10003;</div>
            <div class="status">PICKUP CONFIRMED</div>
            <div class="timestamp"><?= date('l, F j, Y \a\t g:i A', strtotime($collectedAt)) ?></div>
        </div>

        <div class="receipt-barcode">
            <div class="id"><?= implode(' &bull; ', array_column($found, 'id')) ?></div>
        </div>
    </div>
</div>

<?php endif; ?>

<div class="no-print">
    <button class="btn-print" onclick="window.print()">Print Receipt</button>
    <button class="btn-close" onclick="window.close()">Close</button>
</div>

</body>
</html>
