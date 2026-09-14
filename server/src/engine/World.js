import { CONFIG } from '../config.js';
import { Physics } from './Physics.js';
import { Bot } from '../entities/Bot.js';
import { Bullet } from '../entities/Bullet.js';
import { Powerup } from '../entities/Powerup.js';

export class World {
    constructor() {
        this.width = CONFIG.WORLD_WIDTH;
        this.height = CONFIG.WORLD_HEIGHT;

        this.players = new Map(); // socketId -> Player
        this.bots = new Map(); // botId -> Bot
        this.bullets = [];
        this.powerups = [];
        this.recentEvents = []; // kill events, hit events, etc.

        this.nextBulletId = 1;
        this.nextPowerupId = 1;
        this.nextBotId = 1;

        this.lastPowerupSpawn = Date.now();

        // Generate arena layout with futuristic barriers
        this.obstacles = this.generateObstacles();

        // Spawn initial bots
        this.maintainBots();
    }

    generateObstacles() {
        const obs = [];
        const w = this.width;
        const h = this.height;

        // Central Power Core Bunker
        obs.push({ id: 'core_c', x: w / 2 - 90, y: h / 2 - 90, w: 180, h: 180, type: 'core' });

        // 4 Quadrant Defense Forts
        const offsets = [
            { x: w * 0.25, y: h * 0.25 },
            { x: w * 0.75, y: h * 0.25 },
            { x: w * 0.25, y: h * 0.75 },
            { x: w * 0.75, y: h * 0.75 },
        ];

        offsets.forEach((pos, i) => {
            // L-shaped or cross barriers
            obs.push({ id: `fort_${i}_h`, x: pos.x - 140, y: pos.y - 20, w: 280, h: 40, type: 'barrier' });
            obs.push({ id: `fort_${i}_v`, x: pos.x - 20, y: pos.y - 140, w: 40, h: 280, type: 'barrier' });
        });

        // Corner Bunker Pillars
        const cornerPillars = [
            { x: 350, y: 350 },
            { x: w - 350, y: 350 },
            { x: 350, y: h - 350 },
            { x: w - 350, y: h - 350 },
            { x: w / 2, y: 400 },
            { x: w / 2, y: h - 400 },
            { x: 400, y: h / 2 },
            { x: w - 400, y: h / 2 },
        ];

        cornerPillars.forEach((p, i) => {
            obs.push({ id: `pillar_${i}`, x: p.x - 45, y: p.y - 45, w: 90, h: 90, type: 'pillar' });
        });

        return obs;
    }

    getSafeSpawnPosition() {
        const margin = 180;
        for (let attempt = 0; attempt < 30; attempt++) {
            const x = margin + Math.random() * (this.width - margin * 2);
            const y = margin + Math.random() * (this.height - margin * 2);

            // Check distance to obstacles
            let inObstacle = false;
            for (const obs of this.obstacles) {
                if (Physics.circleAABBCollision(x, y, CONFIG.TANK_RADIUS + 30, obs).collided) {
                    inObstacle = true;
                    break;
                }
            }
            if (inObstacle) continue;

            // Check distance to other active tanks
            let tooClose = false;
            const allTanks = [...this.players.values(), ...this.bots.values()];
            for (const tank of allTanks) {
                if (!tank.isDead && Physics.distanceSq(x, y, tank.x, tank.y) < 250 * 250) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                return { x, y };
            }
        }

        return { x: this.width / 2 + (Math.random() - 0.5) * 400, y: 250 };
    }

    maintainBots() {
        while (this.bots.size < CONFIG.BOT_COUNT) {
            const id = `bot_${this.nextBotId++}`;
            const spawn = this.getSafeSpawnPosition();
            const bot = new Bot({ id, x: spawn.x, y: spawn.y });
            this.bots.set(id, bot);
        }
    }

    addPlayer(player) {
        const spawn = this.getSafeSpawnPosition();
        player.x = spawn.x;
        player.y = spawn.y;
        this.players.set(player.socketId, player);
    }

    removePlayer(socketId) {
        const player = this.players.get(socketId);
        if (player) {
            this.players.delete(socketId);
        }
        return player;
    }

    spawnBullet(tank) {
        const muzzleDist = tank.radius + 12;
        const startX = tank.x + Math.cos(tank.turretAngle) * muzzleDist;
        const startY = tank.y + Math.sin(tank.turretAngle) * muzzleDist;

        tank.lastFiredAt = Date.now();

        const baseDamage = CONFIG.BULLET_DAMAGE;
        const bulletDamage = Math.round(baseDamage * (tank.skin?.stats?.damage || 1.0));
        const bulletSpeed = Math.round(CONFIG.BULLET_SPEED * (tank.skin?.stats?.bullet_speed || 1.0));

        if (tank.isOverdrive) {
            // Spread triple shot
            const spreadAngles = [-0.15, 0, 0.15];
            for (const offset of spreadAngles) {
                const b = new Bullet({
                    id: this.nextBulletId++,
                    ownerId: tank.id,
                    ownerName: tank.name,
                    x: startX,
                    y: startY,
                    angle: tank.turretAngle + offset,
                    damage: bulletDamage,
                    speed: bulletSpeed,
                    color: tank.skin?.bullet_color || '#00f0ff',
                    multiShot: true,
                });
                this.bullets.push(b);
            }
        } else {
            const b = new Bullet({
                id: this.nextBulletId++,
                ownerId: tank.id,
                ownerName: tank.name,
                x: startX,
                y: startY,
                angle: tank.turretAngle,
                damage: bulletDamage,
                speed: bulletSpeed,
                color: tank.skin?.bullet_color || '#00f0ff',
            });
            this.bullets.push(b);
        }
    }

    spawnPowerup() {
        if (this.powerups.length >= CONFIG.MAX_POWERUPS) return;

        const types = ['health', 'shield', 'speed', 'overdrive'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const spawn = this.getSafeSpawnPosition();

        const p = new Powerup({
            id: this.nextPowerupId++,
            type: chosenType,
            x: spawn.x,
            y: spawn.y,
        });

        this.powerups.push(p);
    }

    update(dt) {
        const now = Date.now();

        // 1. Maintain bot population
        this.maintainBots();

        // 2. Powerups spawn timer
        if (now - this.lastPowerupSpawn > CONFIG.POWERUP_SPAWN_INTERVAL) {
            this.spawnPowerup();
            this.lastPowerupSpawn = now;
        }

        // 3. Update Players
        for (const player of this.players.values()) {
            if (!player.isDead) {
                player.update(dt);
                if (player.input.fire && player.canFire()) {
                    this.spawnBullet(player);
                }
            } else if (player.respawnAt && now >= player.respawnAt) {
                const spawn = this.getSafeSpawnPosition();
                player.respawn(spawn.x, spawn.y);
            }
        }

        // 4. Update Bots
        for (const bot of this.bots.values()) {
            if (!bot.isDead) {
                bot.updateAI(this, dt);
                if (bot.wantsToFire && bot.canFire()) {
                    this.spawnBullet(bot);
                }
            } else {
                // Auto-respawn bot after 4 seconds
                if (!bot.respawnAt) {
                    bot.respawnAt = now + 4000;
                } else if (now >= bot.respawnAt) {
                    const spawn = this.getSafeSpawnPosition();
                    bot.respawn(spawn.x, spawn.y);
                }
            }
        }

        // 5. Resolve Obstacle Collisions for all alive tanks
        const allTanks = [...this.players.values(), ...this.bots.values()];
        for (const tank of allTanks) {
            if (tank.isDead) continue;

            for (const obs of this.obstacles) {
                const col = Physics.circleAABBCollision(tank.x, tank.y, tank.radius, obs);
                if (col.collided) {
                    tank.x = col.resolvedX;
                    tank.y = col.resolvedY;
                }
            }
        }

        // 6. Tank vs Tank collision pushing
        for (let i = 0; i < allTanks.length; i++) {
            const t1 = allTanks[i];
            if (t1.isDead) continue;

            for (let j = i + 1; j < allTanks.length; j++) {
                const t2 = allTanks[j];
                if (t2.isDead) continue;

                if (Physics.circleCircleOverlap(t1.x, t1.y, t1.radius, t2.x, t2.y, t2.radius)) {
                    const dist = Physics.distance(t1.x, t1.y, t2.x, t2.y) || 0.001;
                    const overlap = (t1.radius + t2.radius) - dist;
                    const nx = (t2.x - t1.x) / dist;
                    const ny = (t2.y - t1.y) / dist;

                    t1.x -= nx * overlap * 0.5;
                    t1.y -= ny * overlap * 0.5;
                    t2.x += nx * overlap * 0.5;
                    t2.y += ny * overlap * 0.5;
                }
            }
        }

        // 7. Update Bullets & Collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update(dt);

            if (bullet.isDead) {
                this.bullets.splice(i, 1);
                continue;
            }

            // Bullet vs Obstacles
            let hitObstacle = false;
            for (const obs of this.obstacles) {
                const col = Physics.circleAABBCollision(bullet.x, bullet.y, bullet.radius, obs);
                if (col.collided) {
                    bullet.isDead = true;
                    hitObstacle = true;
                    this.recentEvents.push({
                        type: 'hit_obstacle',
                        x: bullet.x,
                        y: bullet.y,
                        color: bullet.color,
                    });
                    break;
                }
            }
            if (hitObstacle) {
                this.bullets.splice(i, 1);
                continue;
            }

            // Bullet vs Tanks
            for (const tank of allTanks) {
                if (tank.isDead || tank.id === bullet.ownerId) continue;

                if (Physics.lineCircleIntersection(bullet.prevX, bullet.prevY, bullet.x, bullet.y, tank.x, tank.y, tank.radius)) {
                    bullet.isDead = true;

                    // Find attacker
                    const attacker = allTanks.find(t => t.id === bullet.ownerId);
                    const damageResult = tank.takeDamage(bullet.damage, attacker);

                    this.recentEvents.push({
                        type: 'tank_hit',
                        x: bullet.x,
                        y: bullet.y,
                        targetId: tank.id,
                        damage: damageResult.actualDamage,
                        color: bullet.color,
                    });

                    if (damageResult.killed) {
                        this.recentEvents.push({
                            type: 'event_kill',
                            killerId: bullet.ownerId,
                            killerName: bullet.ownerName,
                            victimId: tank.id,
                            victimName: tank.name,
                            x: tank.x,
                            y: tank.y,
                            timestamp: Date.now(),
                        });
                    }

                    break;
                }
            }

            if (bullet.isDead) {
                this.bullets.splice(i, 1);
            }
        }

        // 8. Tank vs Powerup Pickups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const p = this.powerups[i];
            for (const tank of allTanks) {
                if (tank.isDead) continue;

                if (Physics.circleCircleOverlap(tank.x, tank.y, tank.radius, p.x, p.y, p.radius)) {
                    if (p.type === 'health') {
                        tank.heal(40);
                    } else if (p.type === 'shield') {
                        tank.addShield(50);
                    } else if (p.type === 'speed') {
                        tank.applyBuff('speed', 8000);
                    } else if (p.type === 'overdrive') {
                        tank.applyBuff('overdrive', 7000);
                    }

                    this.recentEvents.push({
                        type: 'powerup_collected',
                        tankId: tank.id,
                        powerupType: p.type,
                        x: p.x,
                        y: p.y,
                    });

                    this.powerups.splice(i, 1);
                    break;
                }
            }
        }
    }

    getLeaderboard() {
        const allTanks = [...this.players.values(), ...this.bots.values()];
        return allTanks
            .sort((a, b) => b.score - a.score || b.kills - a.kills)
            .slice(0, 10)
            .map(t => ({
                id: t.id,
                name: t.name,
                score: t.score,
                kills: t.kills,
                deaths: t.deaths,
                isPlayer: t.type === 'player',
            }));
    }

    getWorldState() {
        const tanks = [];
        for (const p of this.players.values()) {
            tanks.push(p.serialize());
        }
        for (const b of this.bots.values()) {
            tanks.push(b.serialize());
        }

        const state = {
            tick: Date.now(),
            tanks,
            bullets: this.bullets.map(b => b.serialize()),
            powerups: this.powerups.map(p => p.serialize()),
            events: this.recentEvents.splice(0, this.recentEvents.length),
            leaderboard: this.getLeaderboard(),
        };

        return state;
    }
}
