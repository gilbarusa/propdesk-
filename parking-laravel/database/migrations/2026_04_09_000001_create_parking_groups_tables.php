<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── 1. Parking Groups table ──
        Schema::create('parking_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('building_id');
            $table->string('name');                        // e.g. "Guests", "Owners", "Staff"
            $table->string('free')->nullable();            // free parking days
            $table->string('every')->nullable();           // billing period (e.g. 30)
            $table->float('per_day')->nullable();          // daily rate
            $table->float('minimum_cost')->nullable();     // minimum charge
            $table->timestamps();

            $table->foreign('building_id')
                  ->references('id')->on('buildings')
                  ->onDelete('cascade');
        });

        // ── 2. Parking Group Plans (period pricing) ──
        Schema::create('parking_group_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->string('days')->nullable();            // e.g. "7", "14", "30"
            $table->float('price')->nullable();            // fixed price for this period
            $table->timestamps();

            $table->foreign('group_id')
                  ->references('id')->on('parking_groups')
                  ->onDelete('cascade');
        });

        // ── 3. Add parking_group_id to units ──
        Schema::table('units', function (Blueprint $table) {
            $table->unsignedBigInteger('parking_group_id')->nullable()->after('minimum_cost');

            $table->foreign('parking_group_id')
                  ->references('id')->on('parking_groups')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['parking_group_id']);
            $table->dropColumn('parking_group_id');
        });

        Schema::dropIfExists('parking_group_plans');
        Schema::dropIfExists('parking_groups');
    }
};
