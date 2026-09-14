<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserSkin extends Pivot
{
    protected $table = 'user_skins';

    protected $fillable = [
        'user_id',
        'skin_id',
        'is_equipped',
    ];

    protected function casts(): array
    {
        return [
            'is_equipped' => 'boolean',
        ];
    }
}
