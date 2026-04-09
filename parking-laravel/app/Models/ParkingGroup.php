<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'building_id',
        'name',
        'free',
        'every',
        'per_day',
        'minimum_cost',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function plans()
    {
        return $this->hasMany(ParkingGroupPlan::class, 'group_id');
    }

    public function units()
    {
        return $this->hasMany(Unit::class, 'parking_group_id');
    }
}
