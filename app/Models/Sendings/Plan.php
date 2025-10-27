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
        'servers',
    ];

    protected $casts = [
        'options' => 'json',
        'servers' => 'json',
        'custom_plans' => 'json',
    ];

//    แปลงเป็นข้อความ
    public function getServersAttribute($value)
    {
        $ids = json_decode($value, true) ?? [];
        return Server::whereIn('id', $ids)->get();
    }
//    แปลงกลับตอนบันทึก
    public function setServersAttribute($value)
    {
        $this->attributes['servers'] = json_encode($value);
    }
}
