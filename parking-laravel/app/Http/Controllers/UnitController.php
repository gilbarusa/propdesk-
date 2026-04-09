<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Building;
use App\Models\BuildingParking;
use App\Models\Unit;
use App\Models\UnitPlan;
use App\Models\PaymentAccount;
use App\Imports\UnitsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Session;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $buildings = Building::latest()->get();
        return view('admin.unit.index', compact('buildings'));
    }

    public function getUnits(Request $request)
    {
        $columns = ['units.id', 'units.building_id', 'buildings.name AS building', 'units.unit_number', 'units.security_code','units.free'];

        $query = Unit::select($columns)
            ->join('buildings', 'units.building_id', '=', 'buildings.id') // Adjust this line to match your foreign key relationship
            ->with('building');

        if($request->building){
            $query->where('units.building_id', $request->building);
        }

        // Check if the search parameter exists and is not empty
        if ($request->has('search') && $request->search['value']) {
            $search = $request->search['value'];
            $query->where(function($q) use ($search) {
                $q->where('buildings.name', 'like', "%{$search}%")
                ->orWhere('units.unit_number', 'like', "%{$search}%")
                ->orWhere('units.security_code', 'like', "%{$search}%");
            });
        }

        // Get total records before filtering
        $totalRecords = $query->count();

        // Apply ordering if specified
        if ($request->has('order')) {
            $orderColumn = $columns[$request->order[0]['column']];
            $orderDirection = $request->order[0]['dir'];
            $query->orderBy($orderColumn, $orderDirection);
        }

        // Get filtered records count
        $filteredRecords = $query->count();

        // Paginate the results
        $data = $query->skip($request->start)->take($request->length)->get();

        // Return the response as JSON
        return response()->json([
            "draw" => intval($request->draw),
            "recordsTotal" => $totalRecords,
            "recordsFiltered" => $filteredRecords,
            "data" => $data
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $buildings = Building::all();
        $accounts = PaymentAccount::all();
        return view('admin.unit.create', compact('buildings','accounts'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'building'   => 'required',
            'unit_number'   => 'required',
            'security_code' => 'required',
            'free' => 'required',
            'every' => 'required',
        ]);

        $exist = Unit::where('building_id', $request->building)->where('unit_number', $request->unit_number)->first();
        if ($exist) {
            return redirect()->route('unit.create')->with('error', 'Unit already exist');
        } else {
            $unit = Unit::create([
                "building_id" => $request->building,
                "unit_number" => $request->unit_number,
                "security_code" => $request->security_code,
                "free" => $request->free,
                "every" => $request->every,
                "per_day" => $request->per_day,
                "minimum_cost" => $request->minimum_cost,
            ]);
            if(isset($request->periods)){
                foreach ($request->periods as $period) {
                    UnitPlan::create([
                        "building_id" => $request->building,
                        "unit_id" => $unit->id,
                        "days" => $period['days'],
                        "price" => $period['price'],
                    ]);
                }
            }
            return redirect()->route('unit.edit',$unit->id)->with('success', 'Unit created successfully');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $units = Unit::with('building')->with('parkings')->where('id', $id)->first();
        $buildings = Building::all();
        return view('admin.unit.edit', compact('buildings', 'units'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'building'   => 'required',
            'unit_number'   => 'required',
            'security_code' => 'required',
            'free' => 'required',
            'every' => 'required',
        ]);

        Unit::where('id', $id)->update([
            "building_id" => $request->building,
            "unit_number" => $request->unit_number,
            "security_code" => $request->security_code,
            "free" => $request->free,
            "every" => $request->every,
            "per_day" => $request->per_day,
            "minimum_cost" => $request->minimum_cost,
        ]);

        if(isset($request->periods)){
            UnitPlan::where('unit_id', $id)->where('building_id', $request->building)->delete();
            foreach ($request->periods as $period) {
                UnitPlan::create([
                    "building_id" => $request->building,
                    "unit_id" => $id,
                    "days" => $period['days'],
                    "price" => $period['price'],
                ]);
            }
        }else{
            UnitPlan::where('unit_id', $id)->where('building_id', $request->building)->delete();
        }
        return redirect()->route('unit.edit', $id)->with('success', 'Unit updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unit = Unit::where('id', $id)->delete();
        UnitPlan::where('unit_id', $id)->delete();
        return redirect()->route('unit.index')->with('success', 'unit deleted successfully');
    }


    public function unitByBuilding($buildingId)
    {
        // Only return id + unit_number — NEVER expose security_code to frontend
        $units = Unit::where('building_id', $buildingId)
                     ->select('id', 'unit_number', 'building_id')
                     ->get();

        if ($units->isEmpty()) {
            return response()->json(['message' => 'No units found for this building.'], 404);
        }

        return response()->json([
            'success' => true,
            'units'   => $units
        ]);
    }

    public function unitPlanList($buildingId = null,$planId = null){
        //return 
        if($buildingId && $planId){
            $unitPlans =  UnitPlan::where('building_id',$buildingId)->where('unit_id',$planId)->get();
            if(count($unitPlans) === 0){
                $unitPlans = Building::with('parkings')->where('id',$buildingId)->first();
            }
        }else{
            $unitPlans = Building::with('parkings')->where('id',$buildingId)->first();
        }

            $plans = '<div class="col-lg-6">
            <div class="mb-3">
                <label for="basicpill-building-input">Number of days</label>
                <div id="days-section">

                    <!-- Free and Every Section -->
                    <div class="row mb-3">
                        <div class="col-md-2">
                            <label for="free-days">Free</label>
                            <input type="number" id="free-days" name="free" 
                                value="'.$unitPlans->free.'" class="form-control">
                        </div>
                        <div class="col-md-2">
                            <label for="every-days">Every</label>
                            <input type="number" id="every-days" name="every" 
                                value="'.$unitPlans->every.'" class="form-control">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <label for="per-day">Per Day Cost</label>
                            <input type="number" id="per-day" name="per_day" value="'.$unitPlans->per_day.'" class="form-control" step="0.1" min="0" required>
                        </div>
                        <div class="col-md-3">
                            <label for="minimum-cost">Minimum Cost</label>
                            <input type="number" id="minimum-cost" name="minimum_cost" value="'.$unitPlans->minimum_cost.'" class="form-control" step="0.1" min="0" required>
                        </div>
                    </div>
                    <div id="periods">';
                    foreach($unitPlans->parkings as $index => $unitPlan){
                        $plans .= '<div class="row mb-3 period-section" id="period-'.$index + 1 .'">
                                        <div class="col-md-2">
                                            <label>Period '.$index + 1 .'</label>
                                            <input type="number" name="periods['.$index.'][days]" 
                                                value="'. old('periods.' . $index . '.days', $unitPlan->days) .'" 
                                                class="form-control period_days">
                                        </div>
                                        <div class="col-md-3">
                                            <label>Default$</label>
                                            <input type="number" name="periods['.$index.'][price]" 
                                                value="'. old('periods.' . $index . '.price', $unitPlan->price) .'" 
                                                class="form-control period_price">
                                        </div>
                                        <div class="col-md-2">
                                            <button class="btn btn-danger mt-4 remove-period-btn" data-period="'.$index + 1 .'">
                                                Remove
                                            </button>
                                        </div>
                                    </div>';
                    }
                    $plans .= '</div>
                    <button type="button" id="add-period-btn" class="btn btn-primary mt-2">Add Period</button>
                </div>
            </div>
        </div>';
            
        return  $plans;

    }
    public function planByUnitNumber($unit_id,$unit_number){

        $buildingParking = Unit::with('parkings')->with('building')->where('id',$unit_id)->where('unit_number',$unit_number)->first();
        if($buildingParking->building->account_id){
            $account = PaymentAccount::where('id',$buildingParking->building->account_id)->first();
        }else{
            $account = PaymentAccount::where('is_default',1)->first();
        }
        if($buildingParking){
            $data = [
                "success" => true,
                "plans" => $buildingParking,
                "account" => $account
            ];
        }else{
            $data = [
                "message" => "No plans found for this building."
            ];
        }
        return response()->json($data);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,xlsx',
        ]);

        $import = new UnitsImport;
        Excel::import($import, $request->file('file'));

        if ($errors = $import->getErrors()) {
            $flattenedErrors = array_merge(...$errors);

            return redirect()->back()->withErrors($flattenedErrors)->withInput(); // Redirect back with errors
        }

        return redirect()->route('unit.index')->with('success', 'Units imported successfully.');
    }
}
