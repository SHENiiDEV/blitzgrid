import { Tank } from './Tank.js';
import { CONFIG } from '../config.js';
import { Physics } from '../engine/Physics.js';

export class Player extends Tank {
    constructor({ id, socketId, userId, name, skin, isGuest = false }) {
        super({ id, name, type: 'player', skin });
        this.socketId = socketId;
        this.userId = userId;
        this.isGuest = isGuest;
        this.fireCooldown = CONFIG.PLAYER_FIRE_COOLDOWN;

        this.input = {
            w: false,
            s: false,
            a: false,
            d: false,
            angle: 0,
            fire: false,
        };

        this.joinedAt = Date.now();
        this.lastSavedKills = 0;
        this.lastSavedDeaths = 0;
        this.lastSavedDamage = 0;
        this.lastSavedScore = 0;
        this.lastSavedAt = Date.now();
    }

    updateInput(inputState) {
        if (!inputState) return;
        this.input.w = Boolean(inputState.w);
        this.input.s = Boolean(inputState.s);
        this.input.a = Boolean(inputState.a);
        this.input.d = Boolean(inputState.d);

        if (typeof inputState.angle === 'number' && !isNaN(inputState.angle)) {
            this.input.angle = inputState.angle;
        }

        this.input.fire = Boolean(inputState.fire);
    }

    update(dt) {
        if (this.isDead) return;

        this.prevX = this.x;
        this.prevY = this.y;

        // 1. Smoothly update Turret Angle towards client mouse target
        this.turretAngle = Physics.rotateTowards(
            this.turretAngle,
            this.input.angle,
            CONFIG.TURRET_ROTATION_SPEED * dt
        );

        // 2. Compute Movement Vectors
        let moveX = 0;
        let moveY = 0;

        if (this.input.w) moveY -= 1;
        if (this.input.s) moveY += 1;
        if (this.input.a) moveX -= 1;
        if (this.input.d) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            const normX = moveX / length;
            const normY = moveY / length;

            const targetHullAngle = Math.atan2(normY, normX);
            this.hullAngle = Physics.rotateTowards(
                this.hullAngle,
                targetHullAngle,
                CONFIG.TANK_ROTATION_SPEED * dt
            );

            const speed = this.currentSpeed;
            this.vx = normX * speed;
            this.vy = normY * speed;

            this.x += this.vx * dt;
            this.y += this.vy * dt;
        } else {
            // Apply braking/damping
            this.vx *= 0.8;
            this.vy *= 0.8;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
            if (Math.abs(this.vy) < 0.1) this.vy = 0;
        }

        // Clamp to world boundaries
        this.x = Math.max(this.radius, Math.min(CONFIG.WORLD_WIDTH - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(CONFIG.WORLD_HEIGHT - this.radius, this.y));
    }
}
