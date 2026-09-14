import { CONFIG } from '../config.js';

export class Bullet {
    constructor({ id, ownerId, ownerName, x, y, angle, damage = CONFIG.BULLET_DAMAGE, speed = CONFIG.BULLET_SPEED, color = '#00f0ff', multiShot = false }) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.angle = angle;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = CONFIG.BULLET_RADIUS;
        this.damage = damage;
        this.color = color;
        this.multiShot = multiShot;
        this.createdAt = Date.now();
        this.lifeTime = CONFIG.BULLET_LIFETIME * 1000;
        this.isDead = false;
    }

    update(dt) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (Date.now() - this.createdAt > this.lifeTime) {
            this.isDead = true;
        }

        // Boundary check
        if (
            this.x < 0 ||
            this.x > CONFIG.WORLD_WIDTH ||
            this.y < 0 ||
            this.y > CONFIG.WORLD_HEIGHT
        ) {
            this.isDead = true;
        }
    }

    serialize() {
        return {
            id: this.id,
            x: Math.round(this.x),
            y: Math.round(this.y),
            angle: Number(this.angle.toFixed(2)),
            color: this.color,
        };
    }
}
