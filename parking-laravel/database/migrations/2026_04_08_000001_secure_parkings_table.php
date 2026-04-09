<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('parkings', function (Blueprint $table) {
            // Booking lifecycle status
            $table->string('status', 30)->default('booked')->after('transaction_id');
            // Values: pending_payment | paid | booked (free) | failed | cancelled

            // Stripe PaymentIntent ID — replaces client-supplied transaction_id for verification
            $table->string('payment_intent_id')->nullable()->after('status');

            // Server-calculated fields stored at booking creation time
            $table->integer('total_days')->nullable()->after('payment_intent_id');

            // Public token for invoice access (replaces base64-encoded id)
            $table->string('public_token', 64)->nullable()->unique()->after('total_days');
        });

        // Backfill existing records with public tokens and status
        $parkings = \App\Models\Parking::all();
        foreach ($parkings as $parking) {
            $parking->update([
                'public_token' => bin2hex(random_bytes(16)),
                'status' => $parking->amount > 0 ? 'paid' : 'booked',
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('parkings', function (Blueprint $table) {
            $table->dropColumn(['status', 'payment_intent_id', 'total_days', 'public_token']);
        });
    }
};
