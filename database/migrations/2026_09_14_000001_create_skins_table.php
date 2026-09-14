<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->default('hull'); // 'hull', 'turret', 'bullet_trail'
            $table->string('rarity')->default('common'); // 'common', 'rare', 'epic', 'legendary'
            $table->unsignedInteger('price_coins')->default(0);
            $table->unsignedInteger('price_gems')->default(0);
            $table->string('sprite_url')->nullable();
            $table->string('color_primary')->default('#00f0ff');
            $table->string('color_secondary')->default('#ff007f');
            $table->string('color_glow')->default('#00f0ff');
            $table->string('bullet_color')->default('#ffea00');
            $table->text('description')->nullable();
            $table->json('stats')->nullable(); // e.g. speed_bonus, hp_bonus, recoil_reduction
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skins');
    }
};
