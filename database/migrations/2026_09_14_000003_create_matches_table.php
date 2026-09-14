<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('player_name')->default('Tank Commander');
            $table->unsignedInteger('kills')->default(0);
            $table->unsignedInteger('deaths')->default(0);
            $table->unsignedInteger('damage_dealt')->default(0);
            $table->unsignedInteger('score')->default(0);
            $table->unsignedInteger('coins_earned')->default(0);
            $table->unsignedInteger('gems_earned')->default(0);
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->string('game_mode')->default('free_for_all');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
