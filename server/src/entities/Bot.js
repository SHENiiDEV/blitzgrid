import { Tank } from './Tank.js';
import { CONFIG } from '../config.js';
import { Physics } from '../engine/Physics.js';

const BOT_NAMES = [
    'VORTEX-9',
    'SENTRY-ALPHA',
    'CYBER-HOUND',
    'IRON-PHANTOM',
    'DREADNOUGHT-X',
    'OBLIVION-BOT',
    'NEON-STALKER',
    'TITAN-ZERO',
    'KINETIC-VIPER',
    'CHRONO-WARRIOR',
];

const BOT_SKINS = [
    { name: 'Toxic Viper', color_primary: '#10b981', color_secondary: '#84cc16', color_glow: '#22c55e', bullet_color: '#a3e635' },
    { name: 'Crimson Titan', color_primary: '#ef4444', color_secondary: '#f59e0b', color_glow: '#ff2200', bullet_color: '#fbbf24' },
    { name: 'Plasma Void', color_primary: '#8b5cf6', color_secondary: '#ec4899', color_glow: '#a855f7', bullet_color: '#d946ef' },
    { name: 'Frost Glitch', color_primary: '#0284c7', color_secondary: '#38bdf8', color_glow: '#7dd3fc', bullet_color: '#bae6fd' },
];

export class Bot extends Tank {
    constructor({ id, x, y }) {
        const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)] + '#' + Math.floor(100 + Math.random() * 900);
        const skin = BOT_SKINS[Math.floor(Math.random() * BOT_SKINS.length)];
        super({ id, name, type: 'bot', x, y, skin });

        this.fireCooldown = CONFIG.BOT_FIRE_COOLDOWN;

        // State Machine: 'ROAMING' | 'ENGAGING' | 'EVADING'
        this.state = 'ROAMING';
        this.targetEntity = null;

        // Roaming vector
        this.roamAngle = Math.random() * Math.PI * 2;
        this.nextRoamChange = Date.now() + this.getRandomRoamDuration();

        this.wantsToFire = false;
    }

    getRandomRoamDuration() {
        return CONFIG.BOT_ROAM_MIN_TIME + Math.random() * (CONFIG.BOT_ROAM_MAX_TIME - CONFIG.BOT_ROAM_MIN_TIME);
    }

    updateAI(world, dt) {
        if (this.isDead) return;

        this.wantsToFire = false;
        const now = Date.now();

        // 1. Scan for Targets within aggro radius (400px)
        let closestTarget = null;
        let closestDistSq = CONFIG.BOT_AGGRO_RADIUS * CONFIG.BOT_AGGRO_RADIUS;

        // Scan players
        for (const player of world.players.values()) {
            if (player.isDead) continue;
            const distSq = Physics.distanceSq(this.x, this.y, player.x, player.y);
            if (distSq < closestDistSq) {
                closestDistSq = distSq;
                closestTarget = player;
            }
        }

        // Also engage rival bots if no player is immediately near
        if (!closestTarget) {
            for (const otherBot of world.bots.values()) {
                if (otherBot.id === this.id || otherBot.isDead) continue;
                const distSq = Physics.distanceSq(this.x, this.y, otherBot.x, otherBot.y);
                if (distSq < (CONFIG.BOT_AGGRO_RADIUS * 0.75) ** 2) {
                    closestDistSq = distSq;
                    closestTarget = otherBot;
                    break;
                }
            }
        }

        this.targetEntity = closestTarget;

        if (this.targetEntity) {
            this.state = 'ENGAGING';
            this.handleCombatState(this.targetEntity, Math.sqrt(closestDistSq), dt);
        } else {
            this.state = 'ROAMING';
            this.handleRoamingState(now, dt);
        }

        // Boundary reflection: avoid walls
        const margin = 120;
        if (this.x < margin) this.roamAngle = 0;
        else if (this.x > CONFIG.WORLD_WIDTH - margin) this.roamAngle = Math.PI;
        if (this.y < margin) this.roamAngle = Math.PI / 2;
        else if (this.y > CONFIG.WORLD_HEIGHT - margin) this.roamAngle = -Math.PI / 2;

        // Clamp within arena
        this.x = Math.max(this.radius, Math.min(CONFIG.WORLD_WIDTH - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(CONFIG.WORLD_HEIGHT - this.radius, this.y));
    }

    handleRoamingState(now, dt) {
        if (now >= this.nextRoamChange) {
            this.roamAngle = Math.random() * Math.PI * 2;
            this.nextRoamChange = now + this.getRandomRoamDuration();
        }

        // Smoothly rotate hull towards movement angle
        this.hullAngle = Physics.rotateTowards(this.hullAngle, this.roamAngle, CONFIG.TANK_ROTATION_SPEED * dt);
        // Turret looks in heading direction with slight sweep
        this.turretAngle = Physics.rotateTowards(this.turretAngle, this.roamAngle, CONFIG.TURRET_ROTATION_SPEED * dt);

        const speed = this.currentSpeed * 0.65; // Cruise speed while patrolling
        this.vx = Math.cos(this.roamAngle) * speed;
        this.vy = Math.sin(this.roamAngle) * speed;

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    handleCombatState(target, distance, dt) {
        // Calculate aiming angle to target with leading estimation
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        let aimAngle = Math.atan2(dy, dx);

        // Simple predictive leading if target is moving fast
        if (target.vx || target.vy) {
            const timeToHit = distance / CONFIG.BULLET_SPEED;
            const predX = target.x + target.vx * timeToHit * 0.5;
            const predY = target.y + target.vy * timeToHit * 0.5;
            aimAngle = Math.atan2(predY - this.y, predX - this.x);
        }

        // Rotate turret towards aim angle
        this.turretAngle = Physics.rotateTowards(
            this.turretAngle,
            aimAngle,
            CONFIG.TURRET_ROTATION_SPEED * dt
        );

        // Maneuver: circle around target or advance/retreat
        let desiredHeading = aimAngle;
        if (distance < 160) {
            desiredHeading = aimAngle + Math.PI; // Back away if too close
        } else if (distance > 260) {
            desiredHeading = aimAngle; // Move closer
        } else {
            desiredHeading = aimAngle + Math.PI / 2; // Strafe flank
        }

        this.hullAngle = Physics.rotateTowards(this.hullAngle, desiredHeading, CONFIG.TANK_ROTATION_SPEED * dt);

        const speed = this.currentSpeed * 0.85;
        this.vx = Math.cos(this.hullAngle) * speed;
        this.vy = Math.sin(this.hullAngle) * speed;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Check if turret is aligned with target within 15 degrees (~0.26 rad)
        const angleErr = Math.abs(Physics.angleDifference(aimAngle, this.turretAngle));
        if (angleErr < 0.28 && this.canFire()) {
            this.wantsToFire = true;
        }
    }
}
