<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_demo')->default(false)->index();
        });

        $demoAccounts = [
            'commander@blitzgrid.io' => 'CommanderAlex',
            'cyberstriker@blitzgrid.io' => 'CyberStriker',
            'neonghost@blitzgrid.io' => 'NeonGhost',
            'valkyrie99@blitzgrid.io' => 'Valkyrie99',
            'quantumtank@blitzgrid.io' => 'QuantumTank',
            'apexgunner@blitzgrid.io' => 'ApexGunner',
        ];

        foreach ($demoAccounts as $email => $username) {
            $user = DB::table('users')->where('email', $email)->where('username', $username)->first();
            if (! $user || ! Hash::check('password123', $user->password)) {
                continue;
            }

            DB::table('users')->where('id', $user->id)->update([
                'password' => Hash::make(Str::random(64)),
                'remember_token' => null,
                'is_demo' => true,
            ]);
            DB::table('sessions')->where('user_id', $user->id)->delete();
        }
    }

    public function down(): void
    {
        // Revoked public credentials must never be restored by a rollback.
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_demo']);
            $table->dropColumn('is_demo');
        });
    }
};
