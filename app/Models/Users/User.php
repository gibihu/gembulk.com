<?php

namespace App\Models\Users;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Sendings\Plan;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasUuids;
    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'credit',
        'senders',
        'plan_id',
        'roles',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'plan_id'
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'roles' => 'json',
        ];
    }

    protected $with = [
        'plan'
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }

//    แปลงเป็นข้อความ
    public function getRolesAttribute($value)
    {
        $ids = json_decode($value, true) ?? [];
        return Role::whereIn('id', $ids)->pluck('name');
    }
//    แปลงกลับตอนบันทึก
    public function setRolesAttribute($value)
    {
        $this->attributes['roles'] = json_encode($value);
    }
}
