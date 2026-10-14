<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckProduction extends Command
{
    protected $signature = 'app:check-production';

    protected $description = 'Check required production settings without displaying secrets';

    public function handle(): int
    {
        $jwtSecret = config('services.game_server.jwt_secret');
        $apiSecret = config('services.game_server.api_secret');
        $checks = [
            'APP_ENV must be production.' => app()->environment('production'),
            'APP_DEBUG must be false.' => ! config('app.debug'),
            'APP_KEY must be configured.' => filled(config('app.key')),
            'APP_URL must use HTTPS.' => str_starts_with((string) config('app.url'), 'https://'),
            'GAME_SERVER_URL must use HTTPS.' => str_starts_with((string) config('services.game_server.url'), 'https://'),
            'JWT_SECRET must be at least 32 characters and must replace the old shared demo key.' => is_string($jwtSecret) && strlen($jwtSecret) >= 32 && $jwtSecret !== 'blitzgrid_super_secret_jwt_key_2026',
            'GAME_SERVER_API_SECRET must be at least 32 characters and different from JWT_SECRET.' => is_string($apiSecret) && strlen($apiSecret) >= 32 && $apiSecret !== $jwtSecret,
            'SESSION_SECURE_COOKIE must be true.' => (bool) config('session.secure'),
            'Configure a real mail transport instead of log or array.' => ! in_array(config('mail.default'), ['log', 'array'], true),
            'Replace the example SMTP password.' => config('mail.mailers.smtp.password') !== 'YOUR_PRIVATEEMAIL_PASSWORD',
        ];

        $failed = array_keys(array_filter($checks, fn (bool $passed) => ! $passed));
        foreach ($failed as $message) {
            $this->error($message);
        }

        if ($failed !== []) {
            return self::FAILURE;
        }

        $this->info('Required production settings are configured.');

        return self::SUCCESS;
    }
}
