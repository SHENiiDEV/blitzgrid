<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\Skin;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $equippedSkin = $user->equipped_skin;
        $totalSkinsOwned = $user->skins()->count();
        $totalSkinsAvailable = Skin::count();

        // Recent matches
        $recentMatches = GameMatch::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Calculate K/D ratio & win percentage
        $kdRatio = $user->deaths_total > 0 ? round($user->kills_total / $user->deaths_total, 2) : $user->kills_total;

        // Top 3 rivals
        $topPlayers = User::orderByDesc('kills_total')
            ->take(3)
            ->select('id', 'name', 'username', 'kills_total', 'matches_played')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'coins' => $user->coins,
                'gems' => $user->gems,
                'kills_total' => $user->kills_total,
                'deaths_total' => $user->deaths_total,
                'kd_ratio' => $kdRatio,
                'matches_played' => $user->matches_played,
                'total_skins_owned' => $totalSkinsOwned,
                'total_skins_available' => $totalSkinsAvailable,
            ],
            'equippedSkin' => $equippedSkin,
            'recentMatches' => $recentMatches,
            'topPlayers' => $topPlayers,
        ]);
    }
}
