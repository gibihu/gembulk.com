<?php

namespace App\Models\Sendings;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasUuids;
    protected $table = 'sd_reports';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'phone',
        'msg',
        'response',
        'send_status',
        'cost',
        'user_id',
        'sender_id',
        'server_id',
        'status',
    ];
}
