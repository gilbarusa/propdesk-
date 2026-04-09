<?php

use App\Http\Controllers\ParkingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Secure public booking flow ──
Route::post('/validate-unit', [ParkingController::class, 'validateUnit']);
Route::post('/create-booking', [ParkingController::class, 'createBooking']);
Route::post('/confirm-payment', [ParkingController::class, 'confirmPayment']);

// ── Legacy endpoints (kept for backward compat) ──
Route::post('plans', [ParkingController::class, 'plans']);

// ── Admin-only: destructive reset (requires auth) ──
Route::middleware(['auth'])->group(function () {
    Route::post('reset-free-parkings', [ParkingController::class, 'reset']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
