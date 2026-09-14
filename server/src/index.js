import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { CONFIG } from './config.js';
import { World } from './engine/World.js';
import { GameLoop } from './engine/GameLoop.js';
import { setupSocketHandlers } from './socket/handler.js';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health & Status endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        server: 'BlitzGrid Authoritative Engine',
        tps: CONFIG.TPS,
        players: world.players.size,
        bots: world.bots.size,
        bullets: world.bullets.length,
        powerups: world.powerups.length,
        uptime: process.uptime(),
    });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
});

// Initialize World & 30 TPS Authoritative Loop
const world = new World();
const gameLoop = new GameLoop(world, io);

// Setup Socket events
setupSocketHandlers(io, world);

// Start Tick Loop & Server
gameLoop.start();

server.listen(CONFIG.PORT, () => {
    console.log(`=========================================`);
    console.log(`⚡ BLITZGRID REAL-TIME GAME SERVER`);
    console.log(`📡 Listening on: http://localhost:${CONFIG.PORT}`);
    console.log(`⏱️  Target Tick Rate: ${CONFIG.TPS} TPS`);
    console.log(`🗺️  Arena Size: ${CONFIG.WORLD_WIDTH}x${CONFIG.WORLD_HEIGHT}px`);
    console.log(`=========================================`);
});
