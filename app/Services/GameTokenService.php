<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class GameTokenService
{
    public static function getSecret(): string
    {
        $secret = config('services.game_server.jwt_secret');
        if (! is_string($secret) || strlen($secret) < 32) {
            throw new \RuntimeException('JWT_SECRET must contain at least 32 characters.');
        }

        return $secret;
    }

    /**
     * Generate a signed JWT token for the Node.js Game Server
     */
    public static function generateToken(User $user): string
    {
        $equippedSkin = $user->equipped_skin;
        $userSkinPivot = $equippedSkin ? $user->skins()->where('skin_id', $equippedSkin->id)->first()?->pivot : null;
        $level = $userSkinPivot ? ($userSkinPivot->level ?? 1) : 1;
        $stats = SkinUpgradeService::calculateStats($equippedSkin?->stats, $level, $equippedSkin?->rarity ?? 'common');

        $payload = [
            'iss' => 'blitzgrid-portal',
            'sub' => (string) $user->id,
            'user_id' => $user->id,
            'username' => $user->username ?? $user->name,
            'name' => $user->name,
            'coins' => $user->coins,
            'gems' => $user->gems,
            'skin' => [
                'id' => $equippedSkin ? $equippedSkin->id : 1,
                'name' => $equippedSkin ? $equippedSkin->name : 'Neon Vanguard',
                'slug' => $equippedSkin ? $equippedSkin->slug : 'neon-vanguard',
                'level' => $level,
                'color_primary' => $equippedSkin ? $equippedSkin->color_primary : '#00f0ff',
                'color_secondary' => $equippedSkin ? $equippedSkin->color_secondary : '#ff007f',
                'color_glow' => $equippedSkin ? $equippedSkin->color_glow : '#00f0ff',
                'bullet_color' => $equippedSkin ? $equippedSkin->bullet_color : '#00f0ff',
                'stats' => $stats,
            ],
            'iat' => time(),
            'exp' => time() + (3600 * 2), // 2 hours
        ];

        return JWT::encode($payload, self::getSecret(), 'HS256');
    }

    /**
     * Validate JWT Token
     */
    public static function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key(self::getSecret(), 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
