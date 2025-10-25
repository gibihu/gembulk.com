<?php

namespace App\Models\Sendings;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Sender extends Model
{
    use HasUuids;
    protected $table = 'sd_senders';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'server_id',
        'status',
    ];
}
