<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class ProductionConfigurationTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_production_check_accepts_configured_secure_settings(): void
    {
        $this->configureProduction();

        $this->artisan('app:check-production')->assertSuccessful();
    }

    #[TestWith(['app.debug', true])]
    #[TestWith(['services.game_server.jwt_secret', 'blitzgrid_super_secret_jwt_key_2026'])]
    #[TestWith(['services.game_server.api_secret', ''])]
    #[TestWith(['session.secure', false])]
    #[TestWith(['mail.default', 'log'])]
    public function test_production_check_rejects_unsafe_configuration(string $key, mixed $value): void
    {
        $this->configureProduction();
        config()->set($key, $value);

        $this->artisan('app:check-production')->assertFailed();
    }

    public function test_cleanup_revokes_only_unchanged_seeded_demo_credentials(): void
    {
        $demo = User::factory()->create(['email' => 'commander@blitzgrid.io', 'username' => 'CommanderAlex', 'password' => Hash::make('password123')]);
        $reclaimed = User::factory()->create(['email' => 'cyberstriker@blitzgrid.io', 'username' => 'CyberStriker', 'password' => Hash::make('NewPrivatePassword456')]);
        $real = User::factory()->create(['email' => 'real@example.com', 'password' => Hash::make('password123')]);
        DB::table('sessions')->insert(['id' => 'old-demo-session', 'user_id' => $demo->id, 'payload' => '', 'last_activity' => time()]);
        Schema::table('users', function ($table) {
            $table->dropIndex(['is_demo']);
            $table->dropColumn('is_demo');
        });
        $migration = require database_path('migrations/2026_10_14_064839_revoke_seeded_demo_credentials.php');

        $migration->up();

        $this->assertDatabaseHas('users', ['id' => $demo->id, 'is_demo' => true, 'remember_token' => null]);
        $this->assertDatabaseMissing('sessions', ['id' => 'old-demo-session']);
        $this->assertFalse(Hash::check('password123', DB::table('users')->where('id', $demo->id)->value('password')));
        $this->assertDatabaseHas('users', ['id' => $reclaimed->id, 'is_demo' => false, 'password' => $reclaimed->password]);
        $this->assertDatabaseHas('users', ['id' => $real->id, 'is_demo' => false, 'password' => $real->password]);
    }

    private function configureProduction(): void
    {
        $this->app->instance('env', 'production');
        config()->set([
            'app.debug' => false,
            'app.key' => 'base64:'.base64_encode(str_repeat('k', 32)),
            'app.url' => 'https://example.com',
            'services.game_server.url' => 'https://example.com',
            'services.game_server.jwt_secret' => str_repeat('j', 64),
            'services.game_server.api_secret' => str_repeat('s', 64),
            'session.secure' => true,
            'mail.default' => 'smtp',
            'mail.mailers.smtp.password' => 'configured-test-password',
        ]);
    }
}
