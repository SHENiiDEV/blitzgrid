import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { io } from 'socket.io-client';
import TankCanvas from '@/Components/Game/TankCanvas';
import GameHUD from '@/Components/Game/GameHUD';
import GameOverModal from '@/Components/Game/GameOverModal';
import { Loader2, WifiOff } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Play({
    authToken,
    playerName,
    isGuest,
    equippedSkin,
    gameServerUrl = 'http://localhost:3001',
}) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [worldInit, setWorldInit] = useState(null);
    const [playerState, setPlayerState] = useState(null);
    const [killFeed, setKillFeed] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showGameOver, setShowGameOver] = useState(false);
    const [matchRewards, setMatchRewards] = useState(null);

    // Establish WebSocket Connection
    useEffect(() => {
        const socketInstance = io(gameServerUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            timeout: 8000,
        });

        socketInstance.on('connect', () => {
            console.log('⚡ Connected to Game Server. Authenticating...');
            setConnected(true);
            setConnectionError(null);

            // Join arena
            socketInstance.emit('auth_join', {
                token: authToken,
                skin: equippedSkin,
            });
        });

        socketInstance.on('init_world', (data) => {
            console.log('🗺️ World initialized:', data);
            setWorldInit(data);
            setPlayerState(data.tank);
            setShowGameOver(false);
        });

        socketInstance.on('auth_error', (err) => {
            console.error('Auth error:', err);
            setConnectionError(err.message || 'Authorization failed.');
        });

        socketInstance.on('world_state', (state) => {
            if (state.leaderboard) {
                setLeaderboard(state.leaderboard);
            }
        });

        socketInstance.on('match_reward', (data) => {
            console.log('🏆 Match rewards received:', data);
            setMatchRewards(data?.rewards);
        });

        socketInstance.on('connect_error', (err) => {
            console.warn('Socket connect error:', err.message);
            setConnectionError('Cannot connect to real-time game server at ' + gameServerUrl);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [gameServerUrl, authToken]);

    // Handle Player State Update from Canvas
    const handlePlayerStateUpdate = (tank) => {
        setPlayerState(tank);
        if (tank.isDead && !showGameOver) {
            setShowGameOver(true);
            if (socket) {
                socket.emit('report_death');
            }
        }
    };

    // Handle Kill Event
    const handleKillEvent = (ev) => {
        setKillFeed((prev) => [...prev, ev]);

        // If local player scored a kill, fire celebratory confetti sparkles!
        if (ev.killerId === worldInit?.playerId) {
            confetti({
                particleCount: 35,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#00f0ff', '#ff007f', '#eab308'],
            });
        }
    };

    const handleRespawn = () => {
        if (socket) {
            socket.emit('request_respawn');
            setShowGameOver(false);
        }
    };

    const handleExit = () => {
        if (socket) {
            socket.disconnect();
        }
        router.visit(isGuest ? '/login' : '/dashboard');
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
            <Head title="Combat Arena // BLITZGRID" />

            {/* Connecting Screen */}
            {!connected && !connectionError && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-tech">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                    <h2 className="font-display text-xl font-bold tracking-wider text-cyan-400">
                        CONNECTING TO TACTICAL SERVER...
                    </h2>
                    <p className="text-xs font-mono text-slate-500 mt-1">
                        AUTHORIZING TOKEN // INITIALIZING 30 TPS LOOP
                    </p>
                </div>
            )}

            {/* Connection Error Screen */}
            {connectionError && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-6 text-center font-tech">
                    <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/60 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <WifiOff className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white mb-2">
                        RADAR LINK OFFLINE
                    </h2>
                    <p className="text-xs font-mono text-slate-400 max-w-md mb-6">
                        {connectionError}. Ensure the Node.js Game Server is running on port 3001.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm rounded-lg shadow-lg"
                        >
                            RETRY CONNECTION
                        </button>
                        <button
                            onClick={handleExit}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-display text-sm rounded-lg"
                        >
                            RETURN TO BASE
                        </button>
                    </div>
                </div>
            )}

            {/* Real-Time Canvas Game Loop */}
            {connected && worldInit && (
                <>
                    <TankCanvas
                        socket={socket}
                        playerId={worldInit.playerId}
                        worldWidth={worldInit.worldWidth}
                        worldHeight={worldInit.worldHeight}
                        obstacles={worldInit.obstacles}
                        onPlayerStateUpdate={handlePlayerStateUpdate}
                        onKillEvent={handleKillEvent}
                        onGameOver={() => setShowGameOver(true)}
                    />

                    {/* HUD Layer */}
                    <GameHUD
                        player={playerState}
                        killFeed={killFeed}
                        leaderboard={leaderboard}
                        worldWidth={worldInit.worldWidth}
                        worldHeight={worldInit.worldHeight}
                        onExit={handleExit}
                    />

                    {/* Game Over / Redeploy Modal */}
                    {showGameOver && (
                        <GameOverModal
                            player={playerState}
                            rewards={matchRewards}
                            onRespawn={handleRespawn}
                            onReturnToGarage={handleExit}
                        />
                    )}
                </>
            )}
        </div>
    );
}
