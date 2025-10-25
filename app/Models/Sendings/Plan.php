<?php

namespace App\Models\Sendings;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasUuids;
    protected $table = 'sd_plans';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'description',
        'details',
        'price',
        'currency',
        'credits',
        'orders',
        'options',
        'custom_plans',
        'duration',
        'duration_unit',
    ];

    protected $casts = [
        'options' => 'json',
    ];
}
