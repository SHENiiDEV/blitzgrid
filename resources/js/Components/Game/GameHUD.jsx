import React, { useEffect, useRef } from 'react';
import { Shield, Zap, Flame, Trophy, Crosshair, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function GameHUD({
    player,
    killFeed = [],
    leaderboard = [],
    worldWidth = 2800,
    worldHeight = 2800,
    onExit,
}) {
    const minimapRef = useRef(null);

    // Render Minimap Radar
    useEffect(() => {
        const canvas = minimapRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 150;
        canvas.width = size;
        canvas.height = size;

        // Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, size, size);

        // Grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, size, size);
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2, size);
        ctx.moveTo(0, size / 2);
        ctx.lineTo(size, size / 2);
        ctx.stroke();

        // Player dot
        if (player && !player.isDead) {
            const px = (player.x / worldWidth) * size;
            const py = (player.y / worldHeight) * size;

            // Player cyan dot with pulse
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Heading indicator line
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(
                px + Math.cos(player.turretAngle || 0) * 8,
                py + Math.sin(player.turretAngle || 0) * 8
            );
            ctx.stroke();
        }
    }, [player, worldWidth, worldHeight]);

    const hp = player?.hp ?? 100;
    const maxHp = player?.maxHp ?? 100;
    const shield = player?.shield ?? 0;
    const maxShield = player?.maxShield ?? 50;
    const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    const shieldPercent = Math.max(0, Math.min(100, (shield / maxShield) * 100));

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 select-none font-tech">
            
            {/* Top Bar: Back Button, Match Stats, Minimap */}
            <div className="flex items-start justify-between w-full">
                
                {/* Top-Left: Controls & Scoreboard */}
                <div className="flex flex-col space-y-3 pointer-events-auto">
                    <button
                        onClick={onExit}
                        className="px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 hover:border-red-500/80 rounded-lg text-xs font-mono text-slate-300 hover:text-red-400 transition-colors flex items-center space-x-1.5 shadow-lg backdrop-blur-md"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>DISCONNECT</span>
                    </button>

                    {/* Live Match Scoreboard */}
                    <div className="backdrop-blur-md bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 w-56 shadow-xl">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 tracking-wider mb-2 border-b border-slate-800/80 pb-1 font-display">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>ARENA LEADERS</span>
                        </div>
                        <div className="space-y-1.5 text-xs font-mono">
                            {leaderboard.slice(0, 5).map((entry, idx) => (
                                <div
                                    key={entry.id || idx}
                                    className={`flex items-center justify-between px-1.5 py-0.5 rounded ${
                                        entry.id === player?.id
                                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                                            : 'text-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-1.5 truncate max-w-[130px]">
                                        <span className="text-slate-500 w-3">{idx + 1}.</span>
                                        <span className="truncate">{entry.name}</span>
                                    </div>
                                    <span className="text-amber-400 font-bold">{entry.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top-Right: Kill Feed & Minimap */}
                <div className="flex flex-col items-end space-y-3 pointer-events-auto">
                    {/* Minimap Radar */}
                    <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] backdrop-blur-md">
                        <canvas ref={minimapRef} className="w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] block" />
                        <div className="absolute top-1 left-1.5 text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase">
                            RADAR // 2.8KM
                        </div>
                    </div>

                    {/* Dynamic Kill Feed */}
                    <div className="space-y-1.5 w-64 flex flex-col items-end">
                        {killFeed.slice(-4).map((kill, i) => (
                            <div
                                key={kill.timestamp || i}
                                className="backdrop-blur-md bg-slate-950/85 border border-slate-800 px-2.5 py-1 rounded-md text-xs font-mono text-slate-200 shadow-md flex items-center space-x-1.5 animate-in fade-in slide-in-from-right duration-200"
                            >
                                <span className={kill.killerId === player?.id ? 'text-cyan-400 font-bold' : 'text-slate-300'}>
                                    {kill.killerName}
                                </span>
                                <Crosshair className="w-3 h-3 text-red-400" />
                                <span className={kill.victimId === player?.id ? 'text-red-400 font-bold' : 'text-slate-400'}>
                                    {kill.victimName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom HUD: Health, Shields, Ammo, Active Buffs, Controls Guide */}
            <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-3 pointer-events-auto">
                
                {/* Active Buffs Notification Badges */}
                <div className="flex items-center space-x-2">
                    {player?.buffs?.overdrive && (
                        <div className="bg-pink-950/90 border border-pink-500/80 text-pink-300 px-3 py-1 rounded-full text-xs font-mono flex items-center space-x-1.5 shadow-[0_0_15px_rgba(236,72,153,0.4)] animate-pulse">
                            <Flame className="w-3.5 h-3.5 text-pink-400" />
                            <span>PLASMA OVERDRIVE ACTIVE</span>
                        </div>
                    )}
                    {player?.buffs?.speed && (
                        <div className="bg-amber-950/90 border border-amber-500/80 text-amber-300 px-3 py-1 rounded-full text-xs font-mono flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>SPEED BOOST ACTIVE</span>
                        </div>
                    )}
                </div>

                {/* Primary Vitals Panel */}
                <div className="w-full backdrop-blur-md bg-slate-950/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-2xl space-y-2.5">
                    
                    {/* Top Row: Commander info & score summary */}
                    <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-cyan-400 font-display">{player?.name || 'Commander'}</span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400">KILLS: <strong className="text-emerald-400">{player?.kills || 0}</strong></span>
                            <span className="text-slate-400">STREAK: <strong className="text-pink-400">{player?.streak || 0}</strong></span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-slate-400">SCORE: <strong className="text-amber-400 font-bold">{player?.score || 0}</strong></span>
                        </div>
                    </div>

                    {/* Health Gauge */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400 flex items-center space-x-1">
                                <span>ARMOR INTEGRITY</span>
                            </span>
                            <span className={hpPercent < 30 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-200'}>
                                {hp} / {maxHp} HP
                            </span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div
                                className={`h-full rounded-full transition-all duration-150 ${
                                    hpPercent > 50
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                                        : hpPercent > 25
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                                        : 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse'
                                }`}
                                style={{ width: `${hpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Shield Gauge (if active) */}
                    {shield > 0 && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-cyan-400">
                                <span className="flex items-center space-x-1">
                                    <Shield className="w-3 h-3" />
                                    <span>ENERGY BARRIER</span>
                                </span>
                                <span>{shield} / {maxShield}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-cyan-900/60">
                                <div
                                    className="h-full rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-150"
                                    style={{ width: `${shieldPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Keyboard Controls Guide */}
                    <div className="flex items-center justify-center space-x-4 pt-1 text-[10px] font-mono text-slate-500">
                        <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">W A S D</kbd> Move</span>
                        <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">MOUSE</kbd> Aim</span>
                        <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">L-CLICK / SPACE</kbd> Fire</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
