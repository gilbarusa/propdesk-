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
    //  ADMIN — list / CRUD (unchanged, auth-protected)
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
        $endDate = Carbon::parse($request->start_date)->addDays((int)$request->plan);

        Parking::create([
            'building_id'   => $request->building,
            'unit_id'       => $request->unit,
            'account_id'    => $this->resolveAccountId($request->building),
            'plan'          => ($request->plan == 1) ? 'per_day_plan' : $request->plan . 'days',
            'amount'        => $request->amount,
            'start_date'    => $request->start_date,
            'end_date'      => $endDate,
            'total_days'    => (int)$request->plan,
            'car_brand'     => $request->car_brand,
            'model'         => $request->model,
            'color'         => $request->color,
            'license_plate' => $request->license_plate,
            'email'         => $request->email,
            'phone_number'  => $request->phone_number,
            'note_unit_number' => $request->note_unit_number,
            'guest_name'    => $request->guest_name,
            'status'        => ($request->amount > 0) ? 'paid' : 'booked',
            'public_token'  => bin2hex(random_bytes(16)),
        ]);

        return redirect()->route('parking.index')->with('success', 'Parking created successfully');
    }

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
        $endDate = Carbon::parse($request->start_date)->addDays((int)$request->plan);

        $parking->update([
            'building_id'   => $request->building,
            'unit_id'       => $request->unit,
            'plan'          => ($request->plan == 1) ? 'per_day_plan' : $request->plan . 'days',
            'amount'        => $request->amount,
            'start_date'    => $request->start_date,
            'end_date'      => $endDate,
            'total_days'    => (int)$request->plan,
            'car_brand'     => $request->car_brand,
            'model'         => $request->model,
            'color'         => $request->color,
            'license_plate' => $request->license_plate,
            'email'         => $request->email,
            'phone_number'  => $request->phone_number,
            'note_unit_number' => $request->note_unit_number,
            'guest_name'    => $request->guest_name
        ]);

        return redirect()->route('parking.index')->with('success', 'Parking updated successfully');
    }

    public function destroy(Parking $parking)
    {
        $parking->delete();
        return redirect()->route('parking.index')->with('success', 'Parking deleted successfully');
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

        // Server-side security code check
        if ($unit->security_code !== $request->security_code) {
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
                ->where('plan', $unit->free . 'days')
                ->where('status', '!=', 'failed')
                ->where('status', '!=', 'cancelled')
                ->whereBetween('created_at', [$dateWindowStart, now()])
                ->first();

            if ($freePlan) {
                $freeEligible = false;
                $freeUsedDays = Carbon::parse($freePlan->start_date)->diffInDays(Carbon::parse($freePlan->end_date));
            }
        }

        // Saved vehicles for this unit
        $vehicles = Parking::where('building_id', $request->building_id)
            ->where('unit_id', $request->unit_id)
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
     * For free plans: creates the booking directly.
     * For paid plans: creates a Stripe PaymentIntent and returns client_secret.
     * Server calculates amount — client can't tamper.
     */
    public function createBooking(Request $request)
    {
        $request->validate([
            'building_id'    => 'required|integer',
            'unit_id'        => 'required|integer',
            'security_code'  => 'required|string',
            'plan'           => 'required|string',
            'total_days'     => 'required_if:plan,per_day_plan|integer|min:1',
            'start_date'     => 'required|date',
            'car_brand'      => 'required|string',
            'model'          => 'required|string',
            'color'          => 'required|string',
            'license_plate'  => 'required|string',
            'guest_name'     => 'required|string',
            'note_unit_number' => 'required|string',
        ]);

        // Re-validate unit + security code
        $unit = Unit::where('id', $request->unit_id)
                     ->where('building_id', $request->building_id)
                     ->first();

        if (!$unit || $unit->security_code !== $request->security_code) {
            return response()->json(['success' => false, 'message' => 'Invalid unit or security code.'], 403);
        }

        // Server calculates amount and days
        $plans    = $this->resolvePlans($unit);
        $planKey  = $request->plan;
        $amount   = 0;
        $days     = 0;

        if ($planKey === $unit->free . 'days' || $planKey === 'free') {
            // Free plan — check eligibility
            $dateWindowStart = now()->subDays($unit->every);
            $existing = Parking::where('building_id', $request->building_id)
                ->where('unit_id', $request->unit_id)
                ->where('plan', $unit->free . 'days')
                ->where('status', '!=', 'failed')
                ->where('status', '!=', 'cancelled')
                ->whereBetween('created_at', [$dateWindowStart, now()])
                ->first();

            if ($existing) {
                return response()->json(['success' => false, 'message' => 'Free parking already used in this period.'], 422);
            }
            $days   = (int) $unit->free;
            $amount = 0;
        } elseif ($planKey === 'per_day_plan') {
            $days      = (int) $request->total_days;
            $perDay    = (float) $plans['per_day'];
            $minCost   = (float) $plans['minimum_cost'];
            $amount    = $perDay * $days;
            if ($amount < $minCost && $amount > 0) {
                $amount = $minCost;
            }
        } else {
            // Period plan — look up from plans list
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
        $account = $this->resolvePaymentAccount($unit->building_id);

        // Prevent duplicate overlapping bookings
        $overlap = Parking::where('building_id', $request->building_id)
            ->where('unit_id', $request->unit_id)
            ->where('license_plate', $request->license_plate)
            ->where('status', '!=', 'failed')
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($request, $endDate) {
                $q->whereBetween('start_date', [$request->start_date, $endDate])
                  ->orWhereBetween('end_date', [$request->start_date, $endDate]);
            })
            ->first();

        if ($overlap) {
            return response()->json(['success' => false, 'message' => 'An active booking already exists for this vehicle and date range.'], 422);
        }

        // Create the parking record
        $parking = Parking::create([
            'building_id'      => $request->building_id,
            'unit_id'          => $request->unit_id,
            'account_id'       => $account ? $account->id : 1,
            'plan'             => $planKey === 'free' ? ($unit->free . 'days') : $planKey,
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

        // Free booking — done
        if ($amount <= 0) {
            $this->sendNotifications($parking);
            return response()->json([
                'success'    => true,
                'free'       => true,
                'parking_id' => $parking->id,
                'token'      => $parking->public_token,
            ]);
        }

        // Paid booking — create Stripe PaymentIntent
        try {
            Stripe::setApiKey($account->secret_key);

            $intent = PaymentIntent::create([
                'amount'               => (int) round($amount * 100), // cents
                'currency'             => 'usd',
                'description'          => "Parking #{$parking->id} — {$days} days at {$unit->building->name ?? 'N/A'}",
                'metadata'             => [
                    'parking_id' => $parking->id,
                    'unit_id'    => $unit->id,
                    'plan'       => $planKey,
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
            return response()->json(['success' => false, 'message' => 'Payment setup failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Step 3: Confirm payment.
     * Frontend calls this after Stripe confirms the PaymentIntent.
     * Server verifies with Stripe before finalizing.
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

        // Verify with Stripe
        $account = PaymentAccount::find($parking->account_id);
        if (!$account) {
            return response()->json(['success' => false, 'message' => 'Payment account not found.'], 500);
        }

        try {
            Stripe::setApiKey($account->secret_key);
            $intent = PaymentIntent::retrieve($request->payment_intent_id);

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
                return response()->json(['success' => false, 'message' => 'Payment not completed. Status: ' . $intent->status], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Payment verification failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * LEGACY: plans() — fixed null-safety and response shape.
     * Returns previous vehicles for this unit as an array, plus free eligibility.
     */
    public function plans(Request $request)
    {
        $unit = Unit::where('id', $request->unit_id)
                     ->where('building_id', $request->building_id)
                     ->first();

        if (!$unit) {
            return response()->json(['success' => false, 'data' => [], 'message' => 'Unit not found.']);
        }

        // Check free parking usage
        $freeUsed   = false;
        $freeUsedDays = 0;
        if ($unit->every > 0) {
            $dateWindowStart = now()->subDays($unit->every);
            $plan = Parking::where('building_id', $request->building_id)
                ->where('unit_id', $request->unit_id)
                ->where('plan', $unit->free . 'days')
                ->where('status', '!=', 'failed')
                ->where('status', '!=', 'cancelled')
                ->whereBetween('created_at', [$dateWindowStart, now()])
                ->first();

            if ($plan) {
                $freeUsed = true;
                $freeUsedDays = Carbon::parse($plan->start_date)->diffInDays(Carbon::parse($plan->end_date));
            }
        }

        // Return ALL previous vehicles for this unit as an array
        $vehicles = Parking::where('building_id', $request->building_id)
            ->where('unit_id', $request->unit_id)
            ->select('car_brand', 'model', 'color', 'license_plate', 'email', 'phone_number')
            ->distinct()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success'   => $freeUsed,
            'free_days' => $freeUsedDays,
            'data'      => $vehicles, // Always an array now
        ]);
    }

    /**
     * Invoice page — uses public_token instead of base64 id.
     * Falls back to base64 id for legacy URLs.
     */
    public function showBookedParking($token)
    {
        // Try public_token first
        $parking = Parking::with('building', 'unit')
                          ->where('public_token', $token)
                          ->first();

        // Legacy fallback: base64-encoded id
        if (!$parking) {
            $decodedId = base64_decode($token, true);
            if ($decodedId !== false) {
                $parking = Parking::with('building', 'unit')->find($decodedId);
            }
        }

        if (!$parking) {
            abort(404);
        }

        return view('frontend.invoice', compact('parking'));
    }

    /**
     * Reset free parkings — ADMIN ONLY (moved behind auth middleware in routes).
     */
    public function reset()
    {
        $parkings      = Parking::where('plan', '3days');
        $parkingsCount = $parkings->count();
        $parkings->delete();

        return response()->json([
            'success'            => true,
            'message'            => '3 days parkings reset successfully!',
            'resetParkingsCount' => $parkingsCount,
        ]);
    }

    // ═══════════════════════════════════════════════════
    //  HELPERS
    // ═══════════════════════════════════════════════════

    /**
     * Resolve pricing plans: unit-level overrides > building-level defaults.
     */
    private function resolvePlans(Unit $unit): array
    {
        $unitPlans = UnitPlan::where('building_id', $unit->building_id)
                             ->where('unit_id', $unit->id)
                             ->get();

        if ($unitPlans->isNotEmpty()) {
            // Unit has its own plans
            $parkings = $unitPlans->map(fn($p) => ['days' => $p->days, 'price' => $p->price])->toArray();
        } else {
            // Fall back to building-level plans
            $buildingPlans = BuildingParking::where('building_id', $unit->building_id)->get();
            $parkings = $buildingPlans->map(fn($p) => ['days' => $p->days, 'price' => $p->price])->toArray();
        }

        return [
            'free'         => (int) $unit->free,
            'every'        => (int) $unit->every,
            'per_day'      => (float) $unit->per_day,
            'minimum_cost' => (float) $unit->minimum_cost,
            'parkings'     => $parkings,
        ];
    }

    /**
     * Resolve payment account for a building.
     */
    private function resolvePaymentAccount(int $buildingId): ?PaymentAccount
    {
        $building = Building::find($buildingId);
        if ($building && $building->account_id) {
            return PaymentAccount::find($building->account_id);
        }
        return PaymentAccount::where('is_default', 1)->first();
    }

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
                // Log but don't fail
            }
        }

        if ($parking->phone_number) {
            $customerPhone = '+1' . $parking->phone_number;
            $invoiceUrl    = route('booked-parking', $parking->public_token ?? $parking->id);
            $message       = "Thanks for booking parking. Visit {$invoiceUrl} for your invoice.";
            try {
                $this->sendSMS($customerPhone, $message);
            } catch (\Exception $e) {
                // Log but don't fail
            }
        }
    }

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
            CURLOPT_TIMEOUT        => 0,
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
        $customerPhoneNumber = '+1' . $phoneNumber;
        $message = 'Thanks for booking a parking. Please visit to download invoice.';
        return $this->sendSMS($customerPhoneNumber, $message);
    }
}
