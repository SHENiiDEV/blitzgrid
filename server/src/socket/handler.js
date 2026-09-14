import axios from 'axios';
import { CONFIG } from '../config.js';
import { validateGameToken } from '../auth/tokenValidator.js';
import { Player } from '../entities/Player.js';

export async function syncPlayerMatchStats(player, socket = null) {
    if (!player) return null;

    const deltaKills = Math.max(0, player.kills - (player.lastSavedKills || 0));
    const deltaDeaths = Math.max(0, player.deaths - (player.lastSavedDeaths || 0));
    const deltaDamage = Math.max(0, player.damageDealt - (player.lastSavedDamage || 0));
    const deltaScore = Math.max(0, player.score - (player.lastSavedScore || 0));
    const durationSeconds = Math.max(1, Math.round((Date.now() - (player.lastSavedAt || player.joinedAt)) / 1000));

    // Only sync if there is meaningful delta or duration
    if (deltaKills === 0 && deltaDeaths === 0 && deltaScore === 0 && durationSeconds < 5) {
        return null;
    }

    const payload = {
        token: player.rawToken,
        user_id: player.userId,
        player_name: player.name,
        kills: deltaKills,
        deaths: deltaDeaths,
        damage_dealt: deltaDamage,
        score: deltaScore,
        duration_seconds: durationSeconds,
    };

    try {
        const response = await axios.post(`${CONFIG.LARAVEL_API_URL}/match-result`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 5000,
        });

        player.lastSavedKills = player.kills;
        player.lastSavedDeaths = player.deaths;
        player.lastSavedDamage = player.damageDealt;
        player.lastSavedScore = player.score;
        player.lastSavedAt = Date.now();

        console.log(`📊 Match stats synced for ${player.name}: +${deltaKills} Kills, +${deltaDeaths} Deaths, +${deltaScore} Score. DB Total Kills: ${response.data?.user?.kills_total}`);

        if (socket && response.data?.rewards) {
            socket.emit('match_reward', response.data);
        }

        return response.data;
    } catch (err) {
        console.error(`⚠️ Failed to report match stats to Laravel API:`, err.response?.data || err.message);
        return null;
    }
}

export function setupSocketHandlers(io, world) {
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        let player = null;

        // 1. Client Authentication & Join
        socket.on('auth_join', (data) => {
            const token = data?.token;
            const clientSkin = data?.skin;

            const auth = validateGameToken(token);
            if (!auth) {
                socket.emit('auth_error', { message: 'Invalid or expired combat token.' });
                return;
            }

            const playerId = `player_${socket.id.substring(0, 6)}`;
            const playerName = auth.username || auth.name || 'Commander';
            const skin = clientSkin || auth.skin;

            player = new Player({
                id: playerId,
                socketId: socket.id,
                userId: auth.user_id,
                name: playerName,
                skin: skin,
                isGuest: Boolean(auth.is_guest),
            });
            player.rawToken = token;

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
            if (player) {
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

