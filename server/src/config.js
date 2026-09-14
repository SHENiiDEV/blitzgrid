import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3001,
    LARAVEL_API_URL: process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000/api/game',
    JWT_SECRET: process.env.JWT_SECRET || 'blitzgrid_super_secret_jwt_key_2026',

    // Game Loop
    TPS: 30,
    TICK_MS: 1000 / 30, // 33.33ms

    // World Arena Dimensions
    WORLD_WIDTH: 2800,
    WORLD_HEIGHT: 2800,

    // Tank Physics & Properties
    TANK_RADIUS: 26,
    TANK_SPEED: 260, // px per second
    TANK_ROTATION_SPEED: 3.2, // radians per second
    TURRET_ROTATION_SPEED: 8.0, // radians per second
    MAX_HP: 100,

    // Projectiles
    BULLET_SPEED: 700, // px per second
    BULLET_LIFETIME: 2.2, // seconds
    BULLET_RADIUS: 5,
    BULLET_DAMAGE: 28,
    PLAYER_FIRE_COOLDOWN: 380, // ms

    // Bots
    BOT_COUNT: 7,
    BOT_AGGRO_RADIUS: 420,
    BOT_FIRE_COOLDOWN: 950,
    BOT_ROAM_MIN_TIME: 3000,
    BOT_ROAM_MAX_TIME: 5500,

    // Power-ups
    MAX_POWERUPS: 10,
    POWERUP_SPAWN_INTERVAL: 8000, // ms
    POWERUP_RADIUS: 18,
};
