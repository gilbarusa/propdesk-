<?php

/*
 * REPLACE the existing resolvePlans() method in ParkingController.php with this version.
 * Also add: use App\Models\ParkingGroup; and use App\Models\ParkingGroupPlan; at the top.
 *
 * Resolution hierarchy: Unit > Group > Building
 */

    /**
     * Resolve pricing plans: Unit-level > Group-level > Building-level.
     *
     * Base pricing (free, every, per_day, minimum_cost):
     *   - Uses unit values if any are set (non-null, non-zero).
     *   - Otherwise, checks the unit's parking group (if assigned).
     *   - Otherwise, falls back to the building defaults.
     *
     * Period plans (7 days, 14 days, etc.):
     *   - UnitPlan rows if any exist for this unit.
     *   - Otherwise, ParkingGroupPlan rows if unit belongs to a group.
     *   - Otherwise, BuildingParking rows.
     */
    private function resolvePlans(Unit $unit): array
    {
        // ── 1. Period plans: Unit > Group > Building ──
        $unitPlans = UnitPlan::where('building_id', $unit->building_id)
                             ->where('unit_id', $unit->id)
                             ->get();

        if ($unitPlans->isNotEmpty()) {
            $parkings = $unitPlans->map(fn($p) => ['days' => $p->days, 'price' => $p->price])->toArray();
        } elseif ($unit->parking_group_id) {
            // Check group plans
            $groupPlans = ParkingGroupPlan::where('group_id', $unit->parking_group_id)->get();
            $parkings = $groupPlans->map(fn($p) => ['days' => $p->days, 'price' => $p->price])->toArray();
        } else {
            // Fall back to building plans
            $buildingPlans = BuildingParking::where('building_id', $unit->building_id)->get();
            $parkings = $buildingPlans->map(fn($p) => ['days' => $p->days, 'price' => $p->price])->toArray();
        }

        // ── 2. Base pricing: Unit > Group > Building ──
        $free        = $unit->free;
        $every       = $unit->every;
        $perDay      = $unit->per_day;
        $minimumCost = $unit->minimum_cost;

        // If unit has no pricing, try the group
        $hasUnitPricing = ($free || $every || $perDay || $minimumCost);

        if (!$hasUnitPricing && $unit->parking_group_id) {
            $group = ParkingGroup::find($unit->parking_group_id);
            if ($group) {
                $free        = $group->free;
                $every       = $group->every;
                $perDay      = $group->per_day;
                $minimumCost = $group->minimum_cost;
            }
        }

        // If still empty, fall back to building
        $hasPricing = ($free || $every || $perDay || $minimumCost);
        if (!$hasPricing) {
            $building = Building::find($unit->building_id);
            if ($building) {
                $free        = $building->free;
                $every       = $building->every;
                $perDay      = $building->per_day;
                $minimumCost = $building->minimum_cost;
            }
        }

        return [
            'free'         => (int) $free,
            'every'        => (int) $every,
            'per_day'      => (float) $perDay,
            'minimum_cost' => (float) $minimumCost,
            'parkings'     => $parkings,
        ];
    }
