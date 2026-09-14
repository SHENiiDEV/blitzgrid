<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $ownedSkinIds = $user ? $user->skins()->pluck('skins.id')->toArray() : [];

        $skins = Skin::all()->map(function ($skin) use ($ownedSkinIds) {
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
                'max_level' => \App\Services\SkinUpgradeService::getMaxLevel($skin->rarity),
                'base_stats' => \App\Services\SkinUpgradeService::calculateStats($skin->stats, 1, $skin->rarity),
                'max_stats' => \App\Services\SkinUpgradeService::calculateStats($skin->stats, \App\Services\SkinUpgradeService::getMaxLevel($skin->rarity), $skin->rarity),
                'stats' => $skin->stats,
                'is_owned' => in_array($skin->id, $ownedSkinIds),
            ];
        });

        return Inertia::render('Shop', [
            'skins' => $skins,
            'user' => $user ? [
                'coins' => $user->coins,
                'gems' => $user->gems,
            ] : null,
        ]);
    }

    public function purchase(Request $request, Skin $skin)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Check if already owned
        if ($user->skins()->where('skin_id', $skin->id)->exists()) {
            return back()->with('error', 'You already own this skin.');
        }

        $currency = $request->input('currency', 'coins'); // 'coins' or 'gems'

        if ($currency === 'coins') {
            if ($user->coins < $skin->price_coins) {
                return back()->with('error', 'Insufficient Cyber Coins. Battle more in the arena!');
            }
            $user->decrement('coins', $skin->price_coins);
        } elseif ($currency === 'gems') {
            if ($skin->price_gems <= 0) {
                return back()->with('error', 'This skin cannot be purchased with gems.');
            }
            if ($user->gems < $skin->price_gems) {
                return back()->with('error', 'Insufficient Quantum Gems.');
            }
            $user->decrement('gems', $skin->price_gems);
        } else {
            return back()->with('error', 'Invalid currency selected.');
        }

        // Attach skin to user inventory at Level 1
        $user->skins()->attach($skin->id, ['is_equipped' => false, 'level' => 1]);

        return back()->with('success', "Congratulations! {$skin->name} added to your Armory.");
    }
}
