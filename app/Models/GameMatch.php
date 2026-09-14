<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'user_id',
        'player_name',
        'kills',
        'deaths',
        'damage_dealt',
        'score',
        'coins_earned',
        'gems_earned',
        'duration_seconds',
        'game_mode',
    ];

    protected function casts(): array
    {
        return [
            'kills' => 'integer',
            'deaths' => 'integer',
            'damage_dealt' => 'integer',
            'score' => 'integer',
            'coins_earned' => 'integer',
            'gems_earned' => 'integer',
            'duration_seconds' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
