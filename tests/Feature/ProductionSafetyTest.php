<?php

namespace Tests\Feature;

use App\Models\GameMatch;
use App\Models\Skin;
use App\Models\User;
use App\Services\SkinUpgradeService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductionSafetyTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_topup_cannot_grant_currency_or_send_a_fake_receipt(): void
    {
        Mail::fake();
        $user = User::factory()->create(['coins' => 100, 'gems' => 5]);

        $response = $this->actingAs($user)->postJson('/topup/process', [
            'currency' => 'coins', 'amount' => 500000, 'price_usd' => 0.5, 'payment_method' => 'card',
        ]);

        $response->assertServiceUnavailable();
        $this->assertDatabaseHas('users', ['id' => $user->id, 'coins' => 100, 'gems' => 5]);
        Mail::assertNothingSent();
    }

    public function test_sample_invoice_route_is_removed(): void
    {
        $this->actingAs(User::factory()->create())->get('/topup/invoice/preview')->assertNotFound();
    }

    public function test_catalog_seeding_creates_no_demo_users_or_matches(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('skins', 32);
        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('matches', 0);
    }

    public function test_game_result_without_server_secret_is_rejected_without_rewards(): void
    {
        config()->set('services.game_server.api_secret', str_repeat('a', 64));
        $user = User::factory()->create(['coins' => 100]);

        $this->postJson('/api/game/match-result', $this->resultPayload($user))->assertUnauthorized();

        $this->assertDatabaseHas('users', ['id' => $user->id, 'coins' => 100]);
        $this->assertDatabaseCount('matches', 0);
    }

    public function test_game_result_is_rejected_if_server_secret_is_not_configured(): void
    {
        config()->set('services.game_server.api_secret', '');

        $this->postJson('/api/game/match-result')->assertUnauthorized();
    }

    public function test_authorised_game_result_is_credited_once_when_retried(): void
    {
        $secret = str_repeat('a', 64);
        config()->set('services.game_server.api_secret', $secret);
        $user = User::factory()->create(['username' => 'RealPlayer', 'coins' => 100, 'gems' => 5]);
        $payload = $this->resultPayload($user);

        $this->withToken($secret)->postJson('/api/game/match-result', $payload)
            ->assertOk()->assertJsonPath('rewards.coins', 77)->assertJsonPath('rewards.gems', 1);
        $this->withToken($secret)->postJson('/api/game/match-result', $payload)->assertOk();

        $this->assertDatabaseCount('matches', 1);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'coins' => 177, 'gems' => 6, 'kills_total' => 3, 'matches_played' => 1]);
        $this->assertDatabaseHas('matches', ['result_id' => $payload['result_id'], 'player_name' => 'RealPlayer']);
    }

    public function test_idle_results_do_not_grant_free_participation_currency(): void
    {
        $secret = str_repeat('a', 64);
        config()->set('services.game_server.api_secret', $secret);
        $user = User::factory()->create(['coins' => 100]);
        $payload = [...$this->resultPayload($user), 'kills' => 0, 'score' => 0];

        $this->withToken($secret)->postJson('/api/game/match-result', $payload)->assertOk()->assertJsonPath('rewards.coins', 0);

        $this->assertDatabaseHas('users', ['id' => $user->id, 'coins' => 100]);
    }

    public function test_home_page_does_not_expose_private_player_details(): void
    {
        $user = User::factory()->create(['username' => 'VisibleCallsign', 'phone' => 'private-phone']);

        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('topCommanders.0', ['id' => $user->id, 'username' => 'VisibleCallsign', 'kills_total' => 0])
            ->etc());
    }

    public function test_demo_accounts_are_hidden_and_cannot_log_in(): void
    {
        $user = User::factory()->create(['email' => 'disabled@example.com', 'password' => Hash::make('ValidPassword123')]);
        GameMatch::create(['user_id' => $user->id, 'player_name' => 'Demo player']);
        DB::table('users')->where('id', $user->id)->update(['is_demo' => true]);

        $this->post('/login', ['email' => $user->email, 'password' => 'ValidPassword123'])->assertSessionHasErrors('email');

        $this->assertGuest();
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('topCommanders', 0)->etc());
        $this->get('/leaderboard')->assertInertia(fn (Assert $page) => $page->has('topCommanders', 0)->has('recentMatches', 0)->etc());
    }

    public function test_guest_cannot_obtain_game_token(): void
    {
        $this->getJson('/api/game/token')->assertUnauthorized();
    }

    public function test_invalid_login_attempts_are_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/login', ['email' => 'missing@example.com', 'password' => 'wrong'])->assertRedirect()->assertSessionHasErrors('email');
        }

        $this->postJson('/login', ['email' => 'missing@example.com', 'password' => 'wrong'])->assertTooManyRequests();
    }

    public function test_shop_purchase_deducts_once_and_does_not_duplicate_ownership(): void
    {
        $this->seed(DatabaseSeeder::class);
        $skin = Skin::where('price_coins', '>', 0)->firstOrFail();
        $user = User::factory()->create(['coins' => $skin->price_coins]);

        $this->actingAs($user)->post('/shop/purchase/'.$skin->id, ['currency' => 'coins'])->assertRedirect()->assertSessionHas('success');
        $this->actingAs($user)->post('/shop/purchase/'.$skin->id, ['currency' => 'coins'])->assertRedirect()->assertSessionHas('error');

        $this->assertDatabaseHas('users', ['id' => $user->id, 'coins' => 0]);
        $this->assertDatabaseCount('user_skins', 1);
    }

    public function test_skin_upgrade_deducts_resources_and_updates_the_owned_level(): void
    {
        $this->seed(DatabaseSeeder::class);
        $skin = Skin::where('is_default', true)->firstOrFail();
        $user = User::factory()->create(['coins' => 10000, 'gems' => 1000]);
        $user->skins()->attach($skin->id, ['level' => 1, 'is_equipped' => true]);
        $cost = SkinUpgradeService::calculateUpgradeCost(1, $skin->rarity);

        $this->actingAs($user)->post('/garage/upgrade/'.$skin->id, ['steps' => 1])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('user_skins', ['user_id' => $user->id, 'skin_id' => $skin->id, 'level' => 2]);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'coins' => 10000 - $cost['coins'], 'gems' => 1000 - $cost['gems']]);
    }

    private function resultPayload(User $user): array
    {
        return [
            'result_id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'player_name' => 'Untrusted name',
            'kills' => 3,
            'deaths' => 1,
            'damage_dealt' => 100,
            'score' => 100,
            'duration_seconds' => 30,
        ];
    }
}
