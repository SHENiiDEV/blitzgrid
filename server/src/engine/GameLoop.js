import { CONFIG } from '../config.js';

export class GameLoop {
    constructor(world, io) {
        this.world = world;
        this.io = io;
        this.isRunning = false;
        this.intervalId = null;
        this.lastTime = Date.now();
        this.tickCount = 0;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = Date.now();

        this.intervalId = setInterval(() => {
            this.tick();
        }, CONFIG.TICK_MS);

        console.log(`🚀 BlitzGrid Authoritative Game Loop started at ${CONFIG.TPS} TPS (${CONFIG.TICK_MS.toFixed(2)}ms per tick)`);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    tick() {
        const now = Date.now();
        const dt = Math.min((now - this.lastTime) / 1000, 0.1); // Clamp dt to prevent spiral of death
        this.lastTime = now;
        this.tickCount++;

        // 1. Advance simulation
        this.world.update(dt);

        // 2. Broadcast authoritative world_state to all connected clients
        const worldState = this.world.getWorldState();
        this.io.emit('world_state', worldState);
    }
}
