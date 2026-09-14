<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\Skin;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class LeaderboardSeeder extends Seeder
{
    public function run(): void
    {
        $skins = Skin::all();
        if ($skins->isEmpty()) {
            return;
        }

        // Clean up old [AI] bots if any
        User::where('username', 'LIKE', '%[AI]%')->orWhere('surname', 'AI Core')->delete();

        $cyberCommanders = [
            // Tier 1 Legends (High Kills)
            ['name' => 'Kaelen Voss', 'username' => 'Valkyrie_Prime', 'country' => 'Sweden', 'kills' => 540, 'deaths' => 72, 'matches' => 88, 'skin_idx' => 27],
            ['name' => 'Renjiro Sato', 'username' => 'Sigma_Overlord', 'country' => 'Japan', 'kills' => 485, 'deaths' => 65, 'matches' => 79, 'skin_idx' => 28],
            ['name' => 'Elena Rostova', 'username' => 'MatrixPhantom', 'country' => 'Germany', 'kills' => 420, 'deaths' => 80, 'matches' => 70, 'skin_idx' => 29],
            ['name' => 'Travis Drake', 'username' => 'CyberStriker', 'country' => 'United States', 'kills' => 380, 'deaths' => 76, 'matches' => 64, 'skin_idx' => 31],
            ['name' => 'Arthur Pendelton', 'username' => 'TitanForge_9', 'country' => 'United Kingdom', 'kills' => 340, 'deaths' => 85, 'matches' => 58, 'skin_idx' => 22],
            ['name' => 'Jin Kazama', 'username' => 'NeonGhost', 'country' => 'South Korea', 'kills' => 310, 'deaths' => 70, 'matches' => 52, 'skin_idx' => 28],
            ['name' => 'Cyril Meyer', 'username' => 'ChronoDrifter', 'country' => 'Switzerland', 'kills' => 280, 'deaths' => 62, 'matches' => 48, 'skin_idx' => 16],
            ['name' => 'Marcus Thorne', 'username' => 'Solaris_Ace', 'country' => 'Canada', 'kills' => 260, 'deaths' => 58, 'matches' => 45, 'skin_idx' => 21],
            ['name' => 'Rasmus Tamm', 'username' => 'GlitchBlade', 'country' => 'Estonia', 'kills' => 245, 'deaths' => 55, 'matches' => 42, 'skin_idx' => 12],
            ['name' => 'Astrid Lind', 'username' => 'Valkyrie_99', 'country' => 'Norway', 'kills' => 230, 'deaths' => 50, 'matches' => 40, 'skin_idx' => 27],
            
            // Tier 2 Veterans
            ['name' => 'Eero Virtanen', 'username' => 'QuantumTank', 'country' => 'Finland', 'kills' => 215, 'deaths' => 48, 'matches' => 38, 'skin_idx' => 29],
            ['name' => 'Kai Takahashi', 'username' => 'HyperDrift', 'country' => 'Japan', 'kills' => 195, 'deaths' => 45, 'matches' => 35, 'skin_idx' => 9],
            ['name' => 'Julian Tan', 'username' => 'OmegaSniper', 'country' => 'Singapore', 'kills' => 180, 'deaths' => 42, 'matches' => 33, 'skin_idx' => 23],
            ['name' => 'Chloe Bennett', 'username' => 'ApexGunner', 'country' => 'Australia', 'kills' => 170, 'deaths' => 40, 'matches' => 31, 'skin_idx' => 24],
            ['name' => 'Lars van Dijk', 'username' => 'SynapseCore', 'country' => 'Netherlands', 'kills' => 155, 'deaths' => 38, 'matches' => 29, 'skin_idx' => 19],
            ['name' => 'Lucas Morales', 'username' => 'VortexGunner', 'country' => 'Spain', 'kills' => 145, 'deaths' => 35, 'matches' => 27, 'skin_idx' => 11],
            ['name' => 'Jakub Wisniewski', 'username' => 'ShadowByte', 'country' => 'Poland', 'kills' => 135, 'deaths' => 34, 'matches' => 26, 'skin_idx' => 14],
            ['name' => 'Aria Sterling', 'username' => 'LaserFang', 'country' => 'France', 'kills' => 125, 'deaths' => 32, 'matches' => 24, 'skin_idx' => 15],
            ['name' => 'Maximilian Gruber', 'username' => 'DarkAegis', 'country' => 'Austria', 'kills' => 115, 'deaths' => 30, 'matches' => 23, 'skin_idx' => 13],
            ['name' => 'Viktor Vance', 'username' => 'PixelWarlord', 'country' => 'Czech Republic', 'kills' => 105, 'deaths' => 28, 'matches' => 22, 'skin_idx' => 17],
            
            // Tier 3 Active Aces
            ['name' => 'Liam Gallagher', 'username' => 'QuantumGhost', 'country' => 'Ireland', 'kills' => 95, 'deaths' => 26, 'matches' => 20, 'skin_idx' => 10],
            ['name' => 'Sophia Rossi', 'username' => 'PulseRider', 'country' => 'Italy', 'kills' => 88, 'deaths' => 24, 'matches' => 19, 'skin_idx' => 8],
            ['name' => 'Mads Mikkelsen', 'username' => 'ZeroKelvin_Pro', 'country' => 'Denmark', 'kills' => 82, 'deaths' => 22, 'matches' => 18, 'skin_idx' => 26],
            ['name' => 'Dante Silva', 'username' => 'InfernoTank', 'country' => 'Portugal', 'kills' => 76, 'deaths' => 21, 'matches' => 17, 'skin_idx' => 13],
            ['name' => 'Logan Walker', 'username' => 'AeroPhantom', 'country' => 'New Zealand', 'kills' => 70, 'deaths' => 19, 'matches' => 16, 'skin_idx' => 14],
            ['name' => 'Liam O\'Connor', 'username' => 'IronClaw', 'country' => 'Ireland', 'kills' => 65, 'deaths' => 18, 'matches' => 15, 'skin_idx' => 1],
            ['name' => 'Lucas Peeters', 'username' => 'PlasmaSpecter', 'country' => 'Belgium', 'kills' => 58, 'deaths' => 16, 'matches' => 14, 'skin_idx' => 11],
            ['name' => 'Freja Nielsen', 'username' => 'VoidWalker', 'country' => 'Denmark', 'kills' => 52, 'deaths' => 15, 'matches' => 13, 'skin_idx' => 16],
            ['name' => 'Erik Lindqvist', 'username' => 'ByteSlayer', 'country' => 'Sweden', 'kills' => 46, 'deaths' => 14, 'matches' => 12, 'skin_idx' => 7],
            ['name' => 'Mateo Gomez', 'username' => 'NovaStriker', 'country' => 'Mexico', 'kills' => 40, 'deaths' => 12, 'matches' => 11, 'skin_idx' => 24],
            
            // Tier 4 Rising Recruits
            ['name' => 'Tyler Hayes', 'username' => 'RogueCore', 'country' => 'United States', 'kills' => 35, 'deaths' => 11, 'matches' => 10, 'skin_idx' => 5],
            ['name' => 'Zara Chen', 'username' => 'EchoProtocol', 'country' => 'Taiwan', 'kills' => 30, 'deaths' => 10, 'matches' => 9, 'skin_idx' => 4],
            ['name' => 'David Cohen', 'username' => 'VectorSiege', 'country' => 'Israel', 'kills' => 25, 'deaths' => 8, 'matches' => 8, 'skin_idx' => 2],
            ['name' => 'Felix Weber', 'username' => 'HelixStrike', 'country' => 'Switzerland', 'kills' => 20, 'deaths' => 7, 'matches' => 7, 'skin_idx' => 3],
            ['name' => 'Olivier Tremblay', 'username' => 'ZenithPilot', 'country' => 'Canada', 'kills' => 16, 'deaths' => 6, 'matches' => 6, 'skin_idx' => 0],
            ['name' => 'Nora Lindqvist', 'username' => 'NeonRebel', 'country' => 'Finland', 'kills' => 12, 'deaths' => 5, 'matches' => 5, 'skin_idx' => 0],
        ];

        foreach ($cyberCommanders as $c) {
            $user = User::updateOrCreate(
                ['username' => $c['username']],
                [
                    'name' => $c['name'],
                    'surname' => explode(' ', $c['name'])[1] ?? 'Vanguard',
                    'email' => strtolower(str_replace([' ', '-', '\''], '', $c['username'])) . '@blitzgrid.io',
                    'password' => Hash::make('pilot2026!'),
                    'coins' => rand(1500, 18000),
                    'gems' => rand(50, 480),
                    'kills_total' => $c['kills'],
                    'deaths_total' => $c['deaths'],
                    'matches_played' => $c['matches'],
                    'country' => $c['country'],
                    'city' => 'Metro Cyber ' . rand(1, 9),
                    'street_address' => 'District ' . rand(10, 99),
                    'post_code' => (string) rand(10000, 99999),
                    'terms_accepted_at' => now(),
                ]
            );

            $skin = $skins[$c['skin_idx'] % $skins->count()] ?? $skins->first();
            $level = max(1, min(Skin::find($skin->id) ? \App\Services\SkinUpgradeService::getMaxLevel($skin->rarity) : 10, rand(2, 25)));

            // Attach skin
            $user->skins()->syncWithoutDetaching([
                $skin->id => ['is_equipped' => true, 'level' => $level]
            ]);

            // Add simulated battle match
            GameMatch::create([
                'user_id' => $user->id,
                'player_name' => $user->username,
                'kills' => rand(3, 14),
                'deaths' => rand(0, 3),
                'damage_dealt' => rand(800, 3200),
                'score' => rand(1600, 5800),
                'coins_earned' => rand(120, 380),
                'gems_earned' => rand(1, 6),
                'duration_seconds' => rand(90, 320),
                'game_mode' => 'free_for_all',
                'created_at' => now()->subMinutes(rand(5, 720)),
            ]);
        }
    }
}
