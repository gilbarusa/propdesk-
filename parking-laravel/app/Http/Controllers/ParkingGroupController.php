<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParkingGroup;
use App\Models\ParkingGroupPlan;
use App\Models\Building;
use App\Models\Unit;

class ParkingGroupController extends Controller
{
    /**
     * List all parking groups.
     */
    public function index()
    {
        $groups = ParkingGroup::with('building', 'plans', 'units')->latest()->get();
        return view('admin.parking-group.index', compact('groups'));
    }

    /**
     * Show the create form.
     */
    public function create()
    {
        $buildings = Building::all();
        return view('admin.parking-group.create', compact('buildings'));
    }

    /**
     * Store a new parking group.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'building_id' => 'required|exists:buildings,id',
        ]);

        $group = ParkingGroup::create([
            'building_id'  => $request->building_id,
            'name'         => $request->name,
            'free'         => $request->free_days,
            'every'        => $request->every_days,
            'per_day'      => $request->per_day,
            'minimum_cost' => $request->minimum_cost,
        ]);

        // Save period plans
        if ($request->has('periods')) {
            foreach ($request->periods as $period) {
                if (!empty($period['days'])) {
                    ParkingGroupPlan::create([
                        'group_id' => $group->id,
                        'days'     => $period['days'],
                        'price'    => $period['price'],
                    ]);
                }
            }
        }

        // Assign selected units to this group
        if ($request->has('unit_ids')) {
            Unit::whereIn('id', $request->unit_ids)
                ->where('building_id', $request->building_id)
                ->update(['parking_group_id' => $group->id]);
        }

        return redirect()->route('parking-group.edit', $group->id)
                         ->with('success', 'Parking group created successfully');
    }

    /**
     * Show the edit form.
     */
    public function edit(string $id)
    {
        $group     = ParkingGroup::with('plans', 'units')->findOrFail($id);
        $buildings = Building::all();
        $units     = Unit::where('building_id', $group->building_id)->get();

        return view('admin.parking-group.edit', compact('group', 'buildings', 'units'));
    }

    /**
     * Update an existing parking group.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'building_id' => 'required|exists:buildings,id',
        ]);

        $group = ParkingGroup::findOrFail($id);

        $group->update([
            'building_id'  => $request->building_id,
            'name'         => $request->name,
            'free'         => $request->free_days,
            'every'        => $request->every_days,
            'per_day'      => $request->per_day,
            'minimum_cost' => $request->minimum_cost,
        ]);

        // Rebuild period plans
        ParkingGroupPlan::where('group_id', $id)->delete();

        if ($request->has('periods')) {
            foreach ($request->periods as $period) {
                if (!empty($period['days'])) {
                    ParkingGroupPlan::create([
                        'group_id' => $group->id,
                        'days'     => $period['days'],
                        'price'    => $period['price'],
                    ]);
                }
            }
        }

        // Update unit assignments:
        // First, remove all units from this group
        Unit::where('parking_group_id', $id)->update(['parking_group_id' => null]);

        // Then assign selected units
        if ($request->has('unit_ids')) {
            Unit::whereIn('id', $request->unit_ids)
                ->where('building_id', $request->building_id)
                ->update(['parking_group_id' => $group->id]);
        }

        return redirect()->route('parking-group.edit', $id)
                         ->with('success', 'Parking group updated successfully');
    }

    /**
     * Delete a parking group.
     */
    public function destroy(string $id)
    {
        // Unassign units first (FK is set null on delete, but be explicit)
        Unit::where('parking_group_id', $id)->update(['parking_group_id' => null]);

        ParkingGroup::where('id', $id)->delete();

        return redirect()->route('parking-group.index')
                         ->with('success', 'Parking group deleted successfully');
    }

    /**
     * AJAX: Get units for a building (used in create/edit forms).
     */
    public function unitsByBuilding(string $buildingId)
    {
        $units = Unit::where('building_id', $buildingId)
                     ->select('id', 'unit_number', 'parking_group_id')
                     ->orderBy('unit_number')
                     ->get();

        return response()->json($units);
    }
}
