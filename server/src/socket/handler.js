import { randomUUID } from 'node:crypto';
import axios from 'axios';
import { CONFIG } from '../config.js';
import { validateGameToken } from '../auth/tokenValidator.js';
import { Player } from '../entities/Player.js';

export async function syncPlayerMatchStats(player, socket = null) {
    if (!player || player.syncInFlight) return null;

    const deltaKills = Math.max(0, player.kills - (player.lastSavedKills || 0));
    const deltaDeaths = Math.max(0, player.deaths - (player.lastSavedDeaths || 0));
    const deltaDamage = Math.max(0, player.damageDealt - (player.lastSavedDamage || 0));
    const deltaScore = Math.max(0, player.score - (player.lastSavedScore || 0));
    const durationSeconds = Math.max(1, Math.round((Date.now() - (player.lastSavedAt || player.joinedAt)) / 1000));

    // Idle requests cannot create participation rewards.
    if (deltaKills === 0 && deltaDeaths === 0 && deltaScore === 0 && deltaDamage === 0) {
        return null;
    }

    const payload = player.pendingResult || {
        result_id: randomUUID(),
        user_id: player.userId,
        player_name: player.name,
        kills: deltaKills,
        deaths: deltaDeaths,
        damage_dealt: deltaDamage,
        score: deltaScore,
        duration_seconds: durationSeconds,
    };

    player.pendingResult = payload;
    player.syncInFlight = true;

    try {
        const response = await axios.post(`${CONFIG.LARAVEL_API_URL}/match-result`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${CONFIG.GAME_SERVER_API_SECRET}`,
            },
            timeout: 5000,
        });

        player.lastSavedKills = (player.lastSavedKills || 0) + payload.kills;
        player.lastSavedDeaths = (player.lastSavedDeaths || 0) + payload.deaths;
        player.lastSavedDamage = (player.lastSavedDamage || 0) + payload.damage_dealt;
        player.lastSavedScore = (player.lastSavedScore || 0) + payload.score;
        player.lastSavedAt = Date.now();
        player.pendingResult = null;

        if (socket && response.data?.rewards) {
            socket.emit('match_reward', response.data);
        }

        return response.data;
    } catch (err) {
        console.error('Failed to report match stats:', err.response?.status || err.code);
        return null;
    } finally {
        player.syncInFlight = false;
    }
}

export function setupSocketHandlers(io, world) {
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        let player = null;

        // 1. Client Authentication & Join
        socket.on('auth_join', (data) => {
            const token = data?.token;
            if (player) return;

            const auth = validateGameToken(token);
            if (!auth) {
                socket.emit('auth_error', { message: 'Invalid or expired combat token.' });
                return;
            }

            const playerId = `player_${socket.id.substring(0, 6)}`;
            const playerName = auth.username || auth.name || 'Commander';
            const skin = auth.skin;

            player = new Player({
                id: playerId,
                socketId: socket.id,
                userId: auth.user_id,
                name: playerName,
                skin: skin,
                isGuest: Boolean(auth.is_guest),
            });

            world.addPlayer(player);

            // Send initialization payload
            socket.emit('init_world', {
                playerId: player.id,
                worldWidth: world.width,
                worldHeight: world.height,
                obstacles: world.obstacles,
                tank: player.serialize(),
            });

            console.log(`🎮 Player joined: ${player.name} (User ID: ${player.userId}, Socket: ${player.id})`);
        });

        // 2. Client Raw Input State Stream
        socket.on('input_state', (inputData) => {
            if (player && !player.isDead) {
                player.updateInput(inputData);
            }
        });

        // 3. Report Death / Sync In-Game Progress
        socket.on('report_death', async () => {
            if (player && player.isDead) {
                await syncPlayerMatchStats(player, socket);
            }
        });

        // 4. Request Respawn
        socket.on('request_respawn', async () => {
            if (player && player.isDead) {
                await syncPlayerMatchStats(player, socket);
                const spawn = world.getSafeSpawnPosition();
                player.respawn(spawn.x, spawn.y);
                socket.emit('player_respawned', { x: spawn.x, y: spawn.y });
            }
        });

        // 5. Client Disconnect & Final Match Summary Reporting
        socket.on('disconnect', async () => {
            console.log(`👋 Client disconnected: ${socket.id}`);
            if (player) {
                await syncPlayerMatchStats(player, null);
                world.removePlayer(socket.id);
            }
        });
    });
}

