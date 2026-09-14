<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use App\Services\SkinUpgradeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GarageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $allSkins = Skin::all();
        $userSkins = $user->skins()->get()->keyBy('id');
        $equippedSkinId = $userSkins->where('pivot.is_equipped', true)->first()?->id ?? ($allSkins->first()?->id);

        $inventory = $allSkins->map(function ($skin) use ($userSkins, $equippedSkinId) {
            $userSkin = $userSkins->get($skin->id);
            $isOwned = $userSkin !== null;
            $level = $isOwned ? ($userSkin->pivot->level ?? 1) : 1;
            $isEquipped = $skin->id === $equippedSkinId;

            $maxLevel = SkinUpgradeService::getMaxLevel($skin->rarity);
            $currentStats = SkinUpgradeService::calculateStats($skin->stats, $level, $skin->rarity);
            $nextStats = SkinUpgradeService::calculateStats($skin->stats, $level + 1, $skin->rarity);
            $upgradeCost = SkinUpgradeService::calculateUpgradeCost($level, $skin->rarity);

            return [
                'id' => $skin->id,
                'name' => $skin->name,
                'slug' => $skin->slug,
                'type' => $skin->type,
                'rarity' => $skin->rarity,
                'price_coins' => $skin->price_coins,
                'price_gems' => $skin->price_gems,
                'color_primary' => $skin->color_primary,
                'color_secondary' => $skin->color_secondary,
                'color_glow' => $skin->color_glow,
                'bullet_color' => $skin->bullet_color,
                'description' => $skin->description,
                'base_stats' => $skin->stats,
                'stats' => $currentStats,
                'next_stats' => $nextStats,
                'level' => $level,
                'max_level' => $maxLevel,
                'upgrade_cost' => $upgradeCost,
                'is_owned' => $isOwned,
                'is_equipped' => $isEquipped,
            ];
        });

        return Inertia::render('Garage', [
            'inventory' => $inventory,
            'equippedSkinId' => $equippedSkinId,
            'user' => [
                'coins' => $user->coins,
                'gems' => $user->gems,
            ],
        ]);
    }

    public function equip(Request $request, Skin $skin)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Verify ownership
        $hasSkin = $user->skins()->where('skin_id', $skin->id)->exists();
        if (!$hasSkin) {
            return back()->with('error', 'You do not own this skin yet.');
        }

        // Unequip all
        $user->skins()->updateExistingPivot(
            $user->skins()->pluck('skins.id'),
            ['is_equipped' => false]
        );

        // Equip the selected skin
        $user->skins()->updateExistingPivot($skin->id, ['is_equipped' => true]);

        return back()->with('success', "{$skin->name} equipped to combat loadout!");
    }

    public function upgrade(Request $request, Skin $skin)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userSkin = $user->skins()->where('skin_id', $skin->id)->first();
        if (!$userSkin) {
            return back()->with('error', 'You do not own this chassis yet. Acquire it in the Armory Shop.');
        }

        $maxLevel = SkinUpgradeService::getMaxLevel($skin->rarity);
        $currentLevel = $userSkin->pivot->level ?? 1;
        if ($currentLevel >= $maxLevel) {
            return back()->with('error', "{$skin->name} has already reached MAX Level {$maxLevel}!");
        }

        $targetStep = $request->input('steps', 1);
        $stepCount = 0;
        $totalCoins = 0;
        $totalGems = 0;
        $simLevel = $currentLevel;

        $maxSteps = ($targetStep === 'max') ? ($maxLevel - $currentLevel) : (int) $targetStep;
        $maxSteps = max(1, min($maxLevel - $currentLevel, $maxSteps));

        for ($i = 0; $i < $maxSteps; $i++) {
            $cost = SkinUpgradeService::calculateUpgradeCost($simLevel, $skin->rarity);
            if ($user->coins >= ($totalCoins + $cost['coins']) && $user->gems >= ($totalGems + $cost['gems'])) {
                $totalCoins += $cost['coins'];
                $totalGems += $cost['gems'];
                $simLevel++;
                $stepCount++;
            } else {
                break;
            }
        }

        if ($stepCount === 0) {
            $singleCost = SkinUpgradeService::calculateUpgradeCost($currentLevel, $skin->rarity);
            return back()->with('error', "Insufficient resources! Level " . ($currentLevel + 1) . " requires {$singleCost['coins']} Coins and {$singleCost['gems']} Gems.");
        }

        $user->decrement('coins', $totalCoins);
        $user->decrement('gems', $totalGems);
        $user->skins()->updateExistingPivot($skin->id, ['level' => $simLevel]);

        $msg = $stepCount === 1 
            ? "⚡ UPGRADE COMPLETE! {$skin->name} enhanced to Level {$simLevel}!" 
            : "⚡ MULTI-TIER UPGRADE! {$skin->name} surged +{$stepCount} levels to Level {$simLevel}!";

        return back()->with('success', $msg);
    }
}
