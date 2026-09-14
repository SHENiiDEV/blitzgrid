<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'surname',
        'username',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'street_address',
        'city',
        'country',
        'post_code',
        'terms_accepted_at',
        'coins',
        'gems',
        'kills_total',
        'deaths_total',
        'matches_played',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'terms_accepted_at' => 'datetime',
            'password' => 'hashed',
            'coins' => 'integer',
            'gems' => 'integer',
            'kills_total' => 'integer',
            'deaths_total' => 'integer',
            'matches_played' => 'integer',
        ];
    }

    public function skins(): BelongsToMany
    {
        return $this->belongsToMany(Skin::class, 'user_skins')
            ->withPivot(['is_equipped', 'level'])
            ->withTimestamps();
    }

    public function matches(): HasMany
    {
        return $this->hasMany(GameMatch::class)->latest();
    }

    public function getEquippedSkinAttribute()
    {
        return $this->skins()->wherePivot('is_equipped', true)->first()
            ?? Skin::where('is_default', true)->first();
    }
}
