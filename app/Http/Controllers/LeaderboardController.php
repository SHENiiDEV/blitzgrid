<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $allUsers = User::orderByDesc('kills_total')->get();

        $currentUserRank = null;
        if ($currentUser) {
            $userRankIndex = $allUsers->search(fn ($u) => $u->id === $currentUser->id);
            if ($userRankIndex !== false) {
                $currentUserRank = [
                    'rank' => $userRankIndex + 1,
                    'kills' => $currentUser->kills_total,
                    'deaths' => $currentUser->deaths_total,
                    'matches' => $currentUser->matches_played,
                    'kd_ratio' => $currentUser->deaths_total > 0 ? round($currentUser->kills_total / $currentUser->deaths_total, 2) : $currentUser->kills_total,
                ];
            }
        }

        $topCommanders = $allUsers->take(100)->map(function ($user, $index) use ($currentUser) {
            $equippedSkin = $user->equipped_skin;
            $pivot = $equippedSkin ? $user->skins()->where('skin_id', $equippedSkin->id)->first()?->pivot : null;

            return [
                'rank' => $index + 1,
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username ?? $user->name,
                'is_current_user' => $currentUser && $currentUser->id === $user->id,
                'country' => $user->country ?? 'United States',
                'kills' => $user->kills_total,
                'deaths' => $user->deaths_total,
                'kd_ratio' => $user->deaths_total > 0 ? round($user->kills_total / $user->deaths_total, 2) : $user->kills_total,
                'matches' => $user->matches_played,
                'equipped_skin' => $equippedSkin ? [
                    'name' => $equippedSkin->name,
                    'type' => $equippedSkin->type,
                    'rarity' => $equippedSkin->rarity,
                    'color_primary' => $equippedSkin->color_primary,
                    'color_secondary' => $equippedSkin->color_secondary,
                    'color_glow' => $equippedSkin->color_glow,
                    'level' => $pivot->level ?? 1,
                ] : null,
            ];
        });

        $recentGlobalMatches = GameMatch::with('user')
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'player_name' => $match->player_name,
                    'kills' => $match->kills,
                    'deaths' => $match->deaths,
                    'damage_dealt' => $match->damage_dealt,
                    'score' => $match->score,
                    'coins_earned' => $match->coins_earned,
                    'gems_earned' => $match->gems_earned,
                    'duration_seconds' => $match->duration_seconds,
                    'time_ago' => $match->created_at ? $match->created_at->diffForHumans() : 'Just now',
                ];
            });

        return Inertia::render('Leaderboard', [
            'topCommanders' => $topCommanders,
            'currentUserRank' => $currentUserRank,
            'recentMatches' => $recentGlobalMatches,
            'totalCommandersCount' => $allUsers->count(),
        ]);
    }
}
