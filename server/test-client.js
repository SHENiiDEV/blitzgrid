import { io } from 'socket.io-client';

if (!process.env.GAME_TOKEN) throw new Error('Provide a signed GAME_TOKEN from your own account.');

console.log('Connecting to BlitzGrid Game Server...');
const socket = io('http://localhost:3001', {
    transports: ['websocket'],
});

socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
    socket.emit('auth_join', {
        token: process.env.GAME_TOKEN,
    });
});

socket.on('init_world', (data) => {
    console.log('✅ Received init_world. Player ID:', data.playerId, 'Obstacles count:', data.obstacles.length);
});

let tickCount = 0;
socket.on('world_state', (state) => {
    tickCount++;
    if (tickCount <= 3) {
        console.log(`[Tick ${tickCount}] Tanks: ${state.tanks.length}, Bullets: ${state.bullets.length}, Powerups: ${state.powerups.length}`);
    }
    if (tickCount === 3) {
        console.log('✅ Server loop verification passed. Disconnecting.');
        socket.disconnect();
        process.exit(0);
    }
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
});
