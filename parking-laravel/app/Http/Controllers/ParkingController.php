<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Parking;
use Illuminate\Support\Facades\Mail;
use App\Mail\ParkingEmail;
use App\Models\Building;
use App\Models\Unit;
use App\Models\UnitPlan;
use App\Models\BuildingParking;
use App\Models\ParkingGroup;
use App\Models\ParkingGroupPlan;
use App\Models\PrivacyPolicy;
use App\Models\PaymentAccount;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Services\TwilioService;
use Carbon\Carbon;

class ParkingController extends Controller
{
    protected $twilio;

    public function __construct(TwilioService $twilio)
    {
        $this->twilio = $twilio;
    }

    // ═══════════════════════════════════════════════════
    //  ADMIN — list / view / search (auth-protected via routes)
    // ═══════════════════════════════════════════════════

    public function index()
    {
        $parkings = Parking::with('building', 'unit')->latest()->get();
        return view('admin.parking.index', compact('parkings'));
    }

    public function addNew()
    {
        $buildings = Building::all();
        return view('admin.parking.create', compact('buildings'));
    }

    public function edit(Parking $parking)
    {
        $buildings = Building::all();
        return view('admin.parking.edit', compact('buildings', 'parking'));
    }

    public function getParking(Request $request)
    {
        $columns = [
            'parkings.id',
            'buildings.name AS building',
            'units.unit_number',
            'parkings.plan',
            'parkings.amount',
            'parkings.start_date',
            'parkings.end_date',
            'parkings.car_brand',
            'parkings.model',
            'parkings.color',
            'parkings.license_plate',
            'parkings.email',
            'parkings.phone_number',
            'parkings.transaction_id',
            'parkings.note_unit_number',
            'parkings.guest_name',
            'parkings.status',
            'payment_gateway_credentials.title'
        ];

        $query = Parking::select($columns)
            ->join('units', 'parkings.unit_id', '=', 'units.id')
            ->join('payment_gateway_credentials', 'parkings.account_id', '=', 'payment_gateway_credentials.id')
            ->join('buildings', 'units.building_id', '=', 'buildings.id');

        if ($request->filled('building')) {
            $query->where('units.building_id', $request->building);
        }

        if ($request->has('search') && $request->search['value']) {
            $search = $request->search['value'];
            $query->where(function ($q) use ($search) {
                $q->where('buildings.name', 'like', "%{$search}%")
                  ->orWhere('units.unit_number', 'like', "%{$search}%")
                  ->orWhere('parkings.license_plate', 'like', "%{$search}%")
                  ->orWhere('parkings.email', 'like', "%{$search}%")
                  ->orWhere('parkings.phone_number', 'like', "%{$search}%");
            });
        }

        $totalRecords = $query->count();

        if ($request->has('order')) {
            $orderColumnIndex = $request->order[0]['column'];
            $orderDirection   = $request->order[0]['dir'];
            $orderColumn      = $columns[$orderColumnIndex];
            if (strpos($orderColumn, ' AS ') !== false) {
                $orderColumn = explode(' AS ', $orderColumn)[0];
            }
            $query->orderBy($orderColumn, $orderDirection);
        }

        $filteredRecords = $query->count();
        $data = $query->skip($request->start)->take($request->length)->get();

        return response()->json([
            "draw"            => intval($request->draw),
            "recordsTotal"    => $totalRecords,
            "recordsFiltered" => $filteredRecords,
            "data"            => $data
        ]);
    }

    // ═══════════════════════════════════════════════════
    //  ADMIN — manual booking CRUD (not used by public frontend)
    // ═══════════════════════════════════════════════════

    /**
     * Admin-only manual booking creation.
     * Public frontend must use createBooking() instead.
     */
    public function store(Request $request)
    {
        $rules = [
            'building'      => 'required',
            'unit'          => 'required',
            'plan'          => 'required',
            'amount'        => 'required',
            'start_date'    => 'required',
            'car_brand'     => 'required',
            'model'         => 'required',
            'color'         => 'required',
            'license_plate' => 'required',
            'confirmation'  => 'required',
            'note_unit_number' => 'required',
            'guest_name'    => 'required'
        ];

        if ($request->confirmation === 'Email') {
            $rules['email'] = 'required|email';
        } elseif ($request->confirmation === 'Text') {
            $rules['phone'] = 'required';
        }
        $request->validate($rules);

        $days    = (int) $request->plan;
        $endDate = Carbon::parse($request->start_date)->addDays($days);

        Parking::create([
            'building_id'      => $request->building,
            'unit_id'          => $request->unit,
            'account_id'       => $this->resolveAccountId($request->building),
            'plan'             => ($days == 1) ? 'per_day_plan' : $days . 'days',
            'amount'           => $request->amount,
            'start_date'       => $request->start_date,
            'end_date'         => $endDate,
            'total_days'       => $days,
            'car_brand'        => $request->car_brand,
            'model'            => $request->model,
            'color'            => $request->color,
            'license_plate'    => $request->license_plate,
            'email'            => $request->email,
            'phone_number'     => $request->phone_number,
            'note_unit_number' => $request->note_unit_number,
            'guest_name'       => $request->guest_name,
            'status'           => ($request->amount > 0) ? 'paid' : 'booked',
            'public_token'     => bin2hex(random_bytes(16)),
        ]);

        return redirect()->route('parking.index')->with('success', 'Parking created successfully');
    }

    /**
     * Admin-only booking update.
     * Does NOT touch payment status — admin edits are informational only.
     */
    public function update(Parking $parking, Request $request)
    {
        $rules = [
            'building'      => 'required',
            'unit'          => 'required',
            'plan'          => 'required',
            'amount'        => 'required',
            'start_date'    => 'required',
            'car_brand'     => 'required',
            'model'         => 'required',
            'color'         => 'required',
            'license_plate' => 'required',
            'confirmation'  => 'required',
            'note_unit_number' => 'required',
            'guest_name'    => 'required'
        ];

        if ($request->confirmation === 'Email') {
            $rules['email'] = 'required|email';
        } elseif ($request->confirmation === 'Text') {
            $rules['phone'] = 'required';
        }
        $request->validate($rules);

        $days    = (int) $request->plan;
        $endDate = Carbon::parse($request->start_date)->addDays($days);

        $parking->update([
            'building_id'      => $request->building,
            'unit_id'          => $request->unit,
            'plan'             => ($days == 1) ? 'per_day_plan' : $days . 'days',
            'amount'           => $request->amount,
            'start_date'       => $request->start_date,
            'end_date'         => $endDate,
            'total_days'       => $days,
            'car_brand'        => $request->car_brand,
            'model'            => $request->model,
            'color'            => $request->color,
            'license_plate'    => $request->license_plate,
            'email'            => $request->email,
            'phone_number'     => $request->phone_number,
            'note_unit_number' => $request->note_unit_number,
            'guest_name'       => $request->guest_name,
            // NOTE: status is NOT changed here — admin amount edits
            // don't affect payment state. Manual reconciliation if needed.
        ]);

        return redirect()->route('parking.index')->with('success', 'Parking updated successfully');
    }

    public function destroy(Parking $parking)
    {
        $parking->delete();
        return redirect()->route('parking.index')->with('success', 'Parking deleted successfully');
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API — secure booking flow
    // ═══════════════════════════════════════════════════

    /**
     * Step 1: Validate unit + security code on the SERVER.
     * Returns allowed plans, saved vehicles, and Stripe publishable key.
     * Security code is NEVER sent to the browser.
     */
    public function validateUnit(Request $request)
    {
        $request->validate([
            'building_id'   => 'required|integer',
            'unit_id'       => 'required|integer',
            'security_code' => 'required|string',
        ]);

        $unit = Unit::where('id', $request->unit_id)
                     ->where('building_id', $request->building_id)
                     ->first();

        if (!$unit) {
            return response()->json(['success' => false, 'message' => 'Unit not found.'], 404);
        }

        // Server-side security code validation
        if ((string) $unit->security_code !== (string) $request->security_code) {
            return response()->json(['success' => false, 'message' => 'Invalid security code. Please try again.'], 403);
        }

        // Resolve plans: unit-level > building-level
        $plans = $this->resolvePlans($unit);

        // Check free parking eligibility
        $freeEligible = true;
        $freeUsedDays = 0;
        if ($unit->free > 0 && $unit->every > 0) {
            $dateWindowStart = now()->subDays($unit->every);
            $freePlan = Parking::where('building_id', $request->building_id)
                ->where('unit_id', $request->unit_id)
                ->where('plan', 'free_' . $unit->free . 'days')
                ->whereNotIn('status', ['failed', 'cancelled'])
                ->whereBetween('created_at', [$dateWindowStart, now()])
                ->first();

            if ($freePlan) {
                $freeEligible = false;
                $freeUsedDays = Carbon::parse($freePlan->start_date)
                    ->diffInDays(Carbon::parse($freePlan->end_date));
            }
        }

        // Saved vehicles for this unit (distinct, most recent first)
        $vehicles = Parking::where('building_id', $request->building_id)
            ->where('unit_id', $request->unit_id)
            ->whereNotIn('status', ['failed', 'cancelled'])
            ->select('car_brand', 'model', 'color', 'license_plate', 'email', 'phone_number')
            ->distinct()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Resolve payment account
        $account = $this->resolvePaymentAccount($unit->building_id);

        return response()->json([
            'success'        => true,
            'plans'          => $plans,
            'free_eligible'  => $freeEligible,
            'free_used_days' => $freeUsedDays,
            'vehicles'       => $vehicles,
            'stripe_key'     => $account ? $account->publish_key : null,
            'account_id'     => $account ? $account->id : null,
        ]);
    }

    /**
     * Step 2: Create a booking.
     * Server is source of truth for amount/days/plan pricing.
     * For free plans: creates booking directly (status=booked).
     * For paid plans: creates pending booking + Stripe PaymentIntent.
     */
    public function createBooking(Request $request)
    {
        $request->validate([
            'building_id'      => 'required|integer',
            'unit_id'          => 'required|integer',
            'security_code'    => 'required|string',
            'plan'             => 'required|string',
            'total_days'       => 'required_if:plan,per_day_plan|integer|min:1',
            'start_date'       => 'required|date',
            'car_brand'        => 'required|string',
            'model'            => 'required|string',
            'color'            => 'required|string',
            'license_plate'    => 'required|string',
            'guest_name'       => 'required|string',
            'note_unit_number' => 'required|string',
        ]);

        // Re-validate unit + security code (always, no shortcuts)
        $unit = Unit::where('id', $request->unit_id)
                     ->where('building_id', $request->building_id)
                     ->first();

        if (!$unit || (string) $unit->security_code !== (string) $request->security_code) {
            return response()->json(['success' => false, 'message' => 'Invalid unit or security code.'], 403);
        }

        // Server resolves plans and calculates price
        $plans   = $this->resolvePlans($unit);
        $planKey = $request->plan;
        $amount  = 0;
        $days    = 0;

        // Canonical free-plan key: "free_{N}days"
        $canonicalFreePlan = 'free_' . $unit->free . 'days';

        if ($planKey === $canonicalFreePlan || $planKey === 'free' || $planKey === $unit->free . 'days') {
            // ── Free plan ──
            if ($unit->free <= 0) {
                return response()->json(['success' => false, 'message' => 'No free plan available for this unit.'], 422);
            }

            $dateWindowStart = now()->subDays($unit->every);
            $existing = Parking::where('building_id', $request->building_id)
                ->where('unit_id', $request->unit_id)
                ->where('plan', $canonicalFreePlan)
                ->whereNotIn('status', ['failed', 'cancelled'])
                ->whereBetween('created_at', [$dateWindowStart, now()])
                ->first();

            if ($existing) {
                return response()->json(['success' => false, 'message' => 'Free parking already used in this period.'], 422);
            }

            $days    = (int) $unit->free;
            $amount  = 0;
            $planKey = $canonicalFreePlan; // Standardize

        } elseif ($planKey === 'per_day_plan') {
            // ── Per-day plan ──
            $days    = (int) $request->total_days;
            $perDay  = (float) $plans['per_day'];
            $minCost = (float) $plans['minimum_cost'];
            $amount  = $perDay * $days;
            if ($amount > 0 && $amount < $minCost) {
                $amount = $minCost;
            }

        } else {
            // ── Period plan (e.g. "10days", "30days") ──
            $matched = null;
            foreach ($plans['parkings'] as $p) {
                if ($p['days'] . 'days' === $planKey) {
                    $matched = $p;
                    break;
                }
            }
            if (!$matched) {
                return response()->json(['success' => false, 'message' => 'Invalid plan selected.'], 422);
            }
            $days   = (int) $matched['days'];
            $amount = (float) $matched['price'];
        }

        $endDate = Carbon::parse($request->start_date)->addDays($days);

        // Resolve payment account — fail if paid and no valid account
        $account = $this->resolvePaymentAccount($unit->building_id);
        if ($amount > 0 && (!$account || !$account->secret_key || !$account->publish_key)) {
            return response()->json(['success' => false, 'message' => 'No valid payment account configured for this building. Please contact management.'], 500);
        }

        // Proper date-overlap prevention
        // Two ranges overlap when: existing.start < new.end AND existing.end > new.start
        $overlap = Parking::where('building_id', $request->building_id)
            ->where('unit_id', $request->unit_id)
            ->where('license_plate', $request->license_plate)
            ->whereNotIn('status', ['failed', 'cancelled'])
            ->where('start_date', '<', $endDate)
            ->where('end_date', '>', $request->start_date)
            ->first();

        if ($overlap) {
            return response()->json(['success' => false, 'message' => 'An active booking already exists for this vehicle and date range.'], 422);
        }

        // Create the parking record
        $parking = Parking::create([
            'building_id'      => $request->building_id,
            'unit_id'          => $request->unit_id,
            'account_id'       => $account ? $account->id : null,
            'plan'             => $planKey,
            'amount'           => $amount,
            'start_date'       => $request->start_date,
            'end_date'         => $endDate,
            'total_days'       => $days,
            'car_brand'        => $request->car_brand,
            'model'            => $request->model,
            'color'            => $request->color,
            'license_plate'    => $request->license_plate,
            'email'            => $request->email,
            'phone_number'     => $request->phone_number,
            'note_unit_number' => $request->note_unit_number,
            'guest_name'       => $request->guest_name,
            'status'           => $amount > 0 ? 'pending_payment' : 'booked',
            'public_token'     => bin2hex(random_bytes(16)),
        ]);

        // ── Free booking — done ──
        if ($amount <= 0) {
            $this->sendNotifications($parking);
            return response()->json([
                'success'    => true,
                'free'       => true,
                'parking_id' => $parking->id,
                'token'      => $parking->public_token,
            ]);
        }

        // ── Paid booking — create Stripe PaymentIntent ──
        try {
            Stripe::setApiKey($account->secret_key);

            $intent = PaymentIntent::create([
                'amount'   => (int) round($amount * 100), // cents
                'currency' => 'usd',
                'description' => "Parking #{$parking->id} — {$days} days",
                'metadata' => [
                    'parking_id'  => $parking->id,
                    'unit_id'     => $unit->id,
                    'building_id' => $unit->building_id,
                    'plan'        => $planKey,
                    'amount'      => $amount,
                ],
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            $parking->update(['payment_intent_id' => $intent->id]);

            return response()->json([
                'success'       => true,
                'free'          => false,
                'parking_id'    => $parking->id,
                'client_secret' => $intent->client_secret,
                'amount'        => $amount,
            ]);
        } catch (\Exception $e) {
            $parking->update(['status' => 'failed']);
            return response()->json([
                'success' => false,
                'message' => 'Payment setup failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Step 3: Confirm payment after Stripe.
     * Verifies PaymentIntent on server: status, metadata parking_id, amount match.
     * Only finalizes if everything checks out.
     */
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'parking_id'        => 'required|integer',
            'payment_intent_id' => 'required|string',
        ]);

        $parking = Parking::where('id', $request->parking_id)
                          ->where('payment_intent_id', $request->payment_intent_id)
                          ->where('status', 'pending_payment')
                          ->first();

        if (!$parking) {
            return response()->json(['success' => false, 'message' => 'Booking not found or already processed.'], 404);
        }

        $account = PaymentAccount::find($parking->account_id);
        if (!$account || !$account->secret_key) {
            return response()->json(['success' => false, 'message' => 'Payment account not found.'], 500);
        }

        try {
            Stripe::setApiKey($account->secret_key);
            $intent = PaymentIntent::retrieve($request->payment_intent_id);

            // Verify PaymentIntent metadata matches our booking
            $metaParkingId = $intent->metadata->parking_id ?? null;
            if ((int) $metaParkingId !== (int) $parking->id) {
                return response()->json(['success' => false, 'message' => 'Payment metadata mismatch.'], 422);
            }

            // Verify amount matches (cents)
            $expectedCents = (int) round($parking->amount * 100);
            if ($intent->amount !== $expectedCents) {
                return response()->json(['success' => false, 'message' => 'Payment amount mismatch.'], 422);
            }

            // Verify currency
            if (strtolower($intent->currency) !== 'usd') {
                return response()->json(['success' => false, 'message' => 'Unexpected currency.'], 422);
            }

            if ($intent->status === 'succeeded') {
                $parking->update([
                    'status'         => 'paid',
                    'transaction_id' => $intent->latest_charge ?? $intent->id,
                ]);

                $this->sendNotifications($parking);

                return response()->json([
                    'success' => true,
                    'token'   => $parking->public_token,
                ]);
            } else {
                $parking->update(['status' => 'failed']);
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not completed. Status: ' . $intent->status,
                ], 422);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ═══════════════════════════════════════════════════
    //  LEGACY — kept temporarily for backward compat
    // ═══════════════════════════════════════════════════

    /**
     * Legacy plans() endpoint — fixed null-safety and response shape.
     * Returns vehicle history as an array + free eligibility.
     * DEPRECATED: frontend should use validateUnit() instead.
     */
    public function plans(Request $request)
    {
        $unit = Unit::where('id', $request->unit_id)
                     ->where('building_id', $request->building_id)
                     ->first();

        if (!$unit) {
            return response()->json(['success' => false, 'data' => [], 'message' => 'Unit not found.']);
        }

        $freeUsed     = false;
        $freeUsedDays = 0;
        if ($unit->every > 0 && $unit->free > 0) {
            $dateWindowStart = now()->subDays($unit->every);
            $plan = Parking::where('building_id', $request->building_id)
                ->where('unit_id', $request->unit_id)
                ->where(function ($q) use ($unit) {
                    $q->where('plan', 'free_' . $unit->free . 'days')
                      ->orWhere('plan', $unit->free . 'days'); // legacy key compat
                })
                ->whereNotIn('status', ['failed', 'cancelled'])
                ->whereBetween('created_at', [$dateWindowStart, now()])
                ->first();

            if ($plan) {
                $freeUsed     = true;
                $freeUsedDays = Carbon::parse($plan->start_date)
                    ->diffInDays(Carbon::parse($plan->end_date));
            }
        }

        $vehicles = Parking::where('building_id', $request->building_id)
            ->where('unit_id', $request->unit_id)
            ->whereNotIn('status', ['failed', 'cancelled'])
            ->select('car_brand', 'model', 'color', 'license_plate', 'email', 'phone_number')
            ->distinct()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success'   => $freeUsed,
            'free_days' => $freeUsedDays,
            'data'      => $vehicles,
        ]);
    }

    /**
     * Invoice page — uses public_token.
     * Legacy base64 id fallback kept temporarily.
     */
    public function showBookedParking($token)
    {
        // Try public_token first (new flow)
        $parking = Parking::with('building', 'unit')
                          ->where('public_token', $token)
                          ->first();

        // Legacy fallback: base64-encoded id (phase out later)
        if (!$parking) {
            $decodedId = base64_decode($token, true);
            if ($decodedId !== false && is_numeric($decodedId)) {
                $parking = Parking::with('building', 'unit')->find((int) $decodedId);
            }
        }

        if (!$parking) {
            abort(404);
        }

        return view('frontend.invoice', compact('parking'));
    }

    /**
     * Reset free parkings — ADMIN ONLY (auth-protected in routes).
     * Deletes all bookings with the legacy "3days" plan.
     */
    public function reset()
    {
        $parkings      = Parking::where('plan', 'like', 'free_%')
                                ->orWhere('plan', '3days'); // legacy compat
        $parkingsCount = $parkings->count();
        $parkings->delete();

        return response()->json([
            'success'            => true,
            'message'            => 'Free parkings reset successfully!',
            'resetParkingsCount' => $parkingsCount,
        ]);
    }

    // ═══════════════════════════════════════════════════
    //  HELPERS — pricing, accounts, notifications
    // ═══════════════════════════════════════════════════

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

    /**
     * Resolve payment account for a building.
     * Returns building-specific account or default.
     */
    private function resolvePaymentAccount(int $buildingId): ?PaymentAccount
    {
        $building = Building::find($buildingId);
        if ($building && $building->account_id) {
            $account = PaymentAccount::find($building->account_id);
            if ($account) return $account;
        }
        return PaymentAccount::where('is_default', 1)->first();
    }

    /**
     * Convenience wrapper for admin store — returns account id.
     */
    private function resolveAccountId(int $buildingId): int
    {
        $account = $this->resolvePaymentAccount($buildingId);
        return $account ? $account->id : 1;
    }

    /**
     * Send email + SMS notifications after successful booking.
     */
    private function sendNotifications(Parking $parking): void
    {
        if ($parking->email) {
            try {
                Mail::to($parking->email)->send(new ParkingEmail($parking));
            } catch (\Exception $e) {
                // Log but don't fail the booking
            }
        }

        if ($parking->phone_number) {
            $phone      = '+1' . $parking->phone_number;
            $invoiceUrl = route('booked-parking', $parking->public_token ?? $parking->id);
            $message    = "Thanks for booking parking. Visit {$invoiceUrl} for your invoice.";
            try {
                $this->sendSMS($phone, $message);
            } catch (\Exception $e) {
                // Log but don't fail the booking
            }
        }
    }

    // ═══════════════════════════════════════════════════
    //  SMS — Flowroute integration
    // ═══════════════════════════════════════════════════

    public function sendSMS($phoneNumber, $message)
    {
        $account_id  = env('FLOW_ROUTE_ACCOUNT');
        $api_key     = env('FLOW_ROUTE_API_KEY');
        $from_number = env('FLOW_ROUTE_FROM');
        $basic_auth  = base64_encode($account_id . ':' . $api_key);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL            => 'https://api.flowroute.com/v2.1/messages',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => json_encode([
                'data' => [
                    'type'       => 'message',
                    'attributes' => [
                        'to'   => $phoneNumber,
                        'from' => $from_number,
                        'body' => $message,
                    ],
                ],
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/vnd.api+json',
                'Accept: application/vnd.api+json',
                'Authorization: Basic ' . $basic_auth,
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);
        return json_decode($response);
    }

    public function sendMessage($phoneNumber)
    {
        $phone   = '+1' . $phoneNumber;
        $message = 'Thanks for booking parking. Please visit to download invoice.';
        return $this->sendSMS($phone, $message);
    }
}
