# Parking Groups Feature — Installation Guide

## What This Adds

**Parking Groups** let you define pricing for groups of units (e.g. "Guests", "Owners", "Staff")
instead of configuring each unit individually.

**Resolution hierarchy:** Unit-level plans > Group-level plans > Building-level defaults

## Files to Deploy

### New Files (copy to your Laravel app)

| File | Destination |
|------|-------------|
| `migrations/2026_04_09_000001_create_parking_groups_tables.php` | `database/migrations/` |
| `models/ParkingGroup.php` | `app/Models/` |
| `models/ParkingGroupPlan.php` | `app/Models/` |
| `controllers/ParkingGroupController.php` | `app/Http/Controllers/` |
| `views/admin/parking-group/index.blade.php` | `resources/views/admin/parking-group/` |
| `views/admin/parking-group/create.blade.php` | `resources/views/admin/parking-group/` |
| `views/admin/parking-group/edit.blade.php` | `resources/views/admin/parking-group/` |

### Modified Files (replace or patch)

| File | What Changed |
|------|-------------|
| `views/sidebar.blade.php` | Added "Parking Groups" menu item → replaces `resources/views/layouts/components/sidebar.blade.php` |
| `ParkingController.php` | Updated `resolvePlans()` to check group plans → see `ParkingController-resolvePlans-patch.php` |

### Route Changes (`routes/web.php`)

Add these lines:

```php
// At top with other use statements:
use App\Http\Controllers\ParkingGroupController;

// Inside the auth middleware group (after Route::resources):
Route::resource('parking-group', ParkingGroupController::class);

// Outside auth group (AJAX endpoint):
Route::get('/parking-group/units-by-building/{buildingId}', [ParkingGroupController::class, 'unitsByBuilding']);
```

### ParkingController Changes

Add these use statements at the top:
```php
use App\Models\ParkingGroup;
use App\Models\ParkingGroupPlan;
```

Replace the `resolvePlans()` method with the version in `ParkingController-resolvePlans-patch.php`.

## After Deployment

Run the migration:
```bash
php artisan migrate
```

## How It Works

1. **Admin creates a Parking Group** in the new "Parking Groups" sidebar menu
2. Picks a building, names the group (e.g. "Guests"), sets pricing + period plans
3. Assigns units to the group via checkboxes
4. When a guest books parking for that unit, the system checks:
   - Does the unit have its own plans? → Use those
   - Does the unit belong to a group? → Use group pricing
   - Neither? → Fall back to building defaults

## Database Changes

- New table: `parking_groups` (id, building_id, name, free, every, per_day, minimum_cost)
- New table: `parking_group_plans` (id, group_id, days, price)
- Modified table: `units` — added `parking_group_id` (nullable FK)
