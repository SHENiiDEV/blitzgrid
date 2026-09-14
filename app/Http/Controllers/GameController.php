<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\Skin;
use App\Models\User;
use App\Services\GameTokenService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function play(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please authorize your commander account to enter the battle arena.');
        }

        $token = GameTokenService::generateToken($user);
        $playerName = $user->username ?? $user->name;
        $skin = $user->equipped_skin;

        return Inertia::render('Play', [
            'authToken' => $token,
            'playerName' => $playerName,
            'isGuest' => false,
            'equippedSkin' => $skin,
            'gameServerUrl' => config('services.game_server.url', 'http://localhost:3001'),
        ]);
    }

    public function getToken(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $token = GameTokenService::generateToken($user);
        } else {
            $guestName = $request->input('nickname', 'Guest_' . rand(1000, 9999));
            $token = GameTokenService::generateGuestToken($guestName);
        }

        return response()->json([
            'token' => $token,
            'server_url' => config('services.game_server.url', 'http://localhost:3001'),
        ]);
    }

    public function recordMatchResult(Request $request)
    {
        $validated = $request->validate([
            'token' => ['nullable', 'string'],
            'user_id' => ['nullable'],
            'player_name' => ['required', 'string'],
            'kills' => ['required', 'integer', 'min:0'],
            'deaths' => ['required', 'integer', 'min:0'],
            'damage_dealt' => ['required', 'integer', 'min:0'],
            'score' => ['required', 'integer', 'min:0'],
            'duration_seconds' => ['required', 'integer', 'min:0'],
        ]);

        $userId = null;
        $user = null;

        // Try to decode token or lookup user
        if (!empty($validated['token'])) {
            $decoded = GameTokenService::validateToken($validated['token']);
            if ($decoded && !empty($decoded->user_id) && is_numeric($decoded->user_id)) {
                $userId = (int) $decoded->user_id;
                $user = User::find($userId);
            }
        } elseif (!empty($validated['user_id']) && is_numeric($validated['user_id'])) {
            $userId = (int) $validated['user_id'];
            $user = User::find($userId);
        }

        // Calculate rewards: 25 coins per kill + 1 coin per 50 score + 10 coins for participation
        $coinsEarned = ($validated['kills'] * 25) + intval($validated['score'] / 50) + 10;
        // 1 gem if kills >= 3
        $gemsEarned = $validated['kills'] >= 3 ? intval($validated['kills'] / 3) : 0;

        $match = GameMatch::create([
            'user_id' => $userId,
            'player_name' => $validated['player_name'],
            'kills' => $validated['kills'],
            'deaths' => $validated['deaths'],
            'damage_dealt' => $validated['damage_dealt'],
            'score' => $validated['score'],
            'coins_earned' => $coinsEarned,
            'gems_earned' => $gemsEarned,
            'duration_seconds' => $validated['duration_seconds'],
            'game_mode' => 'free_for_all',
        ]);

        if ($user) {
            $user->increment('coins', $coinsEarned);
            if ($gemsEarned > 0) {
                $user->increment('gems', $gemsEarned);
            }
            $user->increment('kills_total', $validated['kills']);
            $user->increment('deaths_total', $validated['deaths']);
            $user->increment('matches_played', 1);
        }

        return response()->json([
            'success' => true,
            'match_id' => $match->id,
            'rewards' => [
                'coins' => $coinsEarned,
                'gems' => $gemsEarned,
            ],
            'user' => $user ? [
                'coins' => $user->coins,
                'gems' => $user->gems,
                'kills_total' => $user->kills_total,
                'matches_played' => $user->matches_played,
            ] : null,
        ]);
    }
}
