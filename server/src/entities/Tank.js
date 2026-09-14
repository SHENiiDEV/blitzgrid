import { CONFIG } from '../config.js';
import { Physics } from '../engine/Physics.js';

export class Tank {
    constructor({ id, name, type = 'player', x = 500, y = 500, skin = null }) {
        this.id = id;
        this.name = name;
        this.type = type; // 'player' | 'bot'
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = CONFIG.TANK_RADIUS;

        this.hullAngle = 0;
        this.turretAngle = 0;

        this.skin = skin || {
            name: 'Neon Vanguard',
            slug: 'neon-vanguard',
            color_primary: '#00f0ff',
            color_secondary: '#ff007f',
            color_glow: '#00f0ff',
            bullet_color: '#00f0ff',
        };

        this.maxHp = this.skin?.stats?.max_hp || CONFIG.MAX_HP;
        this.hp = this.maxHp;
        this.maxShield = this.skin?.stats?.shield || 50;
        this.shield = 0;

        this.score = 0;
        this.kills = 0;
        this.deaths = 0;
        this.damageDealt = 0;
        this.streak = 0;

        this.lastFiredAt = 0;
        this.fireCooldown = CONFIG.PLAYER_FIRE_COOLDOWN;

        // Active temporary buffs
        this.buffs = {
            speedBoostUntil: 0,
            overdriveUntil: 0,
        };

        this.isDead = false;
        this.respawnAt = 0;
    }

    get isSpeedBoosted() {
        return Date.now() < this.buffs.speedBoostUntil;
    }

    get isOverdrive() {
        return Date.now() < this.buffs.overdriveUntil;
    }

    get currentSpeed() {
        let speed = CONFIG.TANK_SPEED;
        if (this.skin?.stats?.speed) {
            speed *= this.skin.stats.speed;
        }
        if (this.isSpeedBoosted) {
            speed *= 1.45;
        }
        return speed;
    }

    get currentFireCooldown() {
        let cd = this.fireCooldown;
        if (this.skin?.stats?.fire_rate) {
            cd /= this.skin.stats.fire_rate;
        }
        if (this.isOverdrive) {
            cd *= 0.55; // Much faster firing rate in overdrive
        }
        return cd;
    }

    canFire() {
        return !this.isDead && (Date.now() - this.lastFiredAt >= this.currentFireCooldown);
    }

    takeDamage(amount, attacker = null) {
        if (this.isDead) return { killed: false, actualDamage: 0 };

        let remainingDamage = amount;
        let actualDamage = 0;

        // Absorb damage with shield first
        if (this.shield > 0) {
            if (this.shield >= remainingDamage) {
                this.shield -= remainingDamage;
                actualDamage += remainingDamage;
                remainingDamage = 0;
            } else {
                actualDamage += this.shield;
                remainingDamage -= this.shield;
                this.shield = 0;
            }
        }

        // Damage HP
        if (remainingDamage > 0) {
            this.hp = Math.max(0, this.hp - remainingDamage);
            actualDamage += remainingDamage;
        }

        if (attacker && attacker.id !== this.id) {
            attacker.damageDealt += actualDamage;
            attacker.score += Math.round(actualDamage * 1.5);
        }

        if (this.hp <= 0) {
            this.isDead = true;
            this.deaths += 1;
            this.streak = 0;

            if (attacker && attacker.id !== this.id) {
                attacker.kills += 1;
                attacker.streak += 1;
                attacker.score += 250 + (attacker.streak * 50);
            }

            return { killed: true, actualDamage };
        }

        return { killed: false, actualDamage };
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    addShield(amount) {
        this.shield = Math.min(this.maxShield, this.shield + amount);
    }

    applyBuff(type, durationMs) {
        if (type === 'speed') {
            this.buffs.speedBoostUntil = Date.now() + durationMs;
        } else if (type === 'overdrive') {
            this.buffs.overdriveUntil = Date.now() + durationMs;
        }
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.vx = 0;
        this.vy = 0;
        this.hp = this.maxHp;
        this.shield = 0;
        this.isDead = false;
        this.respawnAt = 0;
        this.buffs.speedBoostUntil = 0;
        this.buffs.overdriveUntil = 0;
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            x: Math.round(this.x),
            y: Math.round(this.y),
            vx: Number(this.vx.toFixed(1)),
            vy: Number(this.vy.toFixed(1)),
            hullAngle: Number(this.hullAngle.toFixed(2)),
            turretAngle: Number(this.turretAngle.toFixed(2)),
            hp: Math.round(this.hp),
            maxHp: this.maxHp,
            shield: Math.round(this.shield),
            maxShield: this.maxShield,
            score: this.score,
            kills: this.kills,
            deaths: this.deaths,
            streak: this.streak,
            isDead: this.isDead,
            buffs: {
                speed: this.isSpeedBoosted,
                overdrive: this.isOverdrive,
            },
            skin: {
                color_primary: this.skin?.color_primary || '#00f0ff',
                color_secondary: this.skin?.color_secondary || '#ff007f',
                color_glow: this.skin?.color_glow || '#00f0ff',
                bullet_color: this.skin?.bullet_color || '#00f0ff',
            },
        };
    }
}
