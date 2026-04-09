<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingGroupPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'days',
        'price',
    ];

    public function group()
    {
        return $this->belongsTo(ParkingGroup::class, 'group_id');
    }
}
