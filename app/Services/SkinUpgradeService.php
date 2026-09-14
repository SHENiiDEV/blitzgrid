<?php

namespace App\Services;

class SkinUpgradeService
{
    /**
     * Get maximum level allowed for a given rarity
     */
    public static function getMaxLevel(string $rarity): int
    {
        return match (strtolower($rarity)) {
            'common' => 25,
            'rare' => 50,
            'epic' => 75,
            'legendary' => 100,
            'mythic' => 1000,
            default => 25,
        };
    }

    /**
     * Calculate combat stats for a given skin, level, and rarity
     */
    public static function calculateStats(?array $baseStats, int $level = 1, string $rarity = 'common'): array
    {
        $maxLevel = self::getMaxLevel($rarity);
        $level = max(1, min($maxLevel, $level));
        
        $base = array_merge([
            'speed' => 1.0,
            'fire_rate' => 1.0,
            'damage' => 1.0,
            'max_hp' => 100,
            'shield' => 50,
            'bullet_speed' => 1.0,
            'special_perk' => 'Ion Pulse Core',
        ], $baseStats ?? []);

        $levelBonus = $level - 1;

        return [
            'speed' => round($base['speed'] * (1 + ($levelBonus * 0.012)), 3),
            'fire_rate' => round($base['fire_rate'] * (1 + ($levelBonus * 0.015)), 3),
            'damage' => round($base['damage'] * (1 + ($levelBonus * 0.018)), 3),
            'max_hp' => (int) round($base['max_hp'] + ($levelBonus * 2.5)),
            'shield' => (int) round($base['shield'] + ($levelBonus * 1.5)),
            'bullet_speed' => round($base['bullet_speed'] * (1 + ($levelBonus * 0.008)), 3),
            'special_perk' => $base['special_perk'] ?? 'Ion Pulse Core',
            'level' => $level,
            'max_level' => $maxLevel,
        ];
    }

    /**
     * Calculate upgrade cost from current level to level + 1 for a given rarity
     */
    public static function calculateUpgradeCost(int $currentLevel, string $rarity = 'common'): array
    {
        $maxLevel = self::getMaxLevel($rarity);
        if ($currentLevel >= $maxLevel) {
            return [
                'coins' => 0,
                'gems' => 0,
                'is_max' => true,
                'max_level' => $maxLevel,
            ];
        }

        // Coins scaling: 40 + 35*L + 2.2*L^1.6
        $coins = (int) round(40 + (35 * $currentLevel) + (2.2 * pow($currentLevel, 1.6)));
        // Gems scaling: 1 + 0.8*L + 0.15*L^1.3
        $gems = (int) round(1 + (0.8 * $currentLevel) + (0.15 * pow($currentLevel, 1.3)));

        return [
            'coins' => max(10, $coins),
            'gems' => max(1, $gems),
            'is_max' => false,
            'max_level' => $maxLevel,
        ];
    }
}
