import { CONFIG } from '../config.js';

export class Powerup {
    constructor({ id, type, x, y }) {
        this.id = id;
        this.type = type; // 'health', 'shield', 'speed', 'overdrive'
        this.x = x;
        this.y = y;
        this.radius = CONFIG.POWERUP_RADIUS;
        this.createdAt = Date.now();
        this.isDead = false;
    }

    serialize() {
        return {
            id: this.id,
            type: this.type,
            x: Math.round(this.x),
            y: Math.round(this.y),
        };
    }
}
