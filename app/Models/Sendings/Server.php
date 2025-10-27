<?php

namespace App\Models\Sendings;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Server extends Model
{

    use HasUuids;
    protected $table = 'sd_servers';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'static_name',
        'host',
        'url',
        'method',
        'settings',
        'headers',
        'body',
        'callbacks',
    ];

    protected $casts = [
        'settings' => 'json',
        'body' => 'json',
        'callbacks' => 'json',
    ];

    protected $with = [
        'senders',
    ];

    protected $hidden = [
        'server_id',
    ];


    public function senders(): HasMany
    {
        return $this->hasMany(Sender::class, 'server_id');
    }
}
