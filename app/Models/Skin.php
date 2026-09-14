<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skin extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'rarity',
        'price_coins',
        'price_gems',
        'sprite_url',
        'color_primary',
        'color_secondary',
        'color_glow',
        'bullet_color',
        'description',
        'stats',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'price_coins' => 'integer',
            'price_gems' => 'integer',
            'is_default' => 'boolean',
            'stats' => 'array',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_skins')
            ->withPivot(['is_equipped', 'level'])
            ->withTimestamps();
    }
}
