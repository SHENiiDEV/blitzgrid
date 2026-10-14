<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\User;
use App\Services\GameTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function play(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Play', [
            'authToken' => GameTokenService::generateToken($user),
            'playerName' => $user->username ?? $user->name,
            'isGuest' => false,
            'equippedSkin' => $user->equipped_skin,
            'gameServerUrl' => config('services.game_server.url'),
        ]);
    }

    public function getToken(Request $request): JsonResponse
    {
        return response()->json([
            'token' => GameTokenService::generateToken($request->user()),
            'server_url' => config('services.game_server.url'),
        ]);
    }

    public function recordMatchResult(Request $request): JsonResponse
    {
        $secret = config('services.game_server.api_secret');
        abort_unless(is_string($secret) && strlen($secret) >= 32 && hash_equals($secret, $request->bearerToken() ?? ''), 401);

        $validated = $request->validate([
            'result_id' => ['required', 'uuid'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'kills' => ['required', 'integer', 'min:0', 'max:100000'],
            'deaths' => ['required', 'integer', 'min:0', 'max:100000'],
            'damage_dealt' => ['required', 'integer', 'min:0', 'max:100000000'],
            'score' => ['required', 'integer', 'min:0', 'max:100000000'],
            'duration_seconds' => ['required', 'integer', 'min:1', 'max:604800'],
        ]);

        return DB::transaction(function () use ($validated) {
            $user = User::query()->lockForUpdate()->findOrFail($validated['user_id']);
            $match = GameMatch::where('result_id', $validated['result_id'])->first();

            if ($match) {
                abort_unless($match->user_id === $user->id, 409);
            } else {
                $coinsEarned = ($validated['kills'] * 25) + intdiv($validated['score'], 50);
                $gemsEarned = intdiv($validated['kills'], 3);

                $match = GameMatch::create([
                    ...$validated,
                    'player_name' => $user->username ?? $user->name,
                    'coins_earned' => $coinsEarned,
                    'gems_earned' => $gemsEarned,
                    'game_mode' => 'free_for_all',
                ]);

                $user->increment('coins', $coinsEarned);
                $user->increment('gems', $gemsEarned);
                $user->increment('kills_total', $validated['kills']);
                $user->increment('deaths_total', $validated['deaths']);
                $user->increment('matches_played');
            }

            return response()->json([
                'success' => true,
                'match_id' => $match->id,
                'rewards' => ['coins' => $match->coins_earned, 'gems' => $match->gems_earned],
                'user' => $user->only(['coins', 'gems', 'kills_total', 'matches_played']),
            ]);
        });
    }
}
