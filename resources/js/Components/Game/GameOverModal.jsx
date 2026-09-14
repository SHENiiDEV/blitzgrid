import React from 'react';
import { Skull, RotateCcw, Home, Award, Coins, Gem, Crosshair } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function GameOverModal({
    player,
    rewards,
    onRespawn,
    onReturnToGarage,
}) {
    const kills = player?.kills || 0;
    const score = player?.score || 0;
    const coins = rewards?.coins || (kills * 25 + Math.floor(score / 50) + 10);
    const gems = rewards?.gems || (kills >= 3 ? Math.floor(kills / 3) : 0);

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-tech animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-center">
                {/* Neon Top Banner */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>

                {/* Skull Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <Skull className="w-8 h-8 text-red-400 animate-pulse" />
                </div>

                <h2 className="font-display text-2xl font-bold text-white tracking-wider mb-1">
                    CHASSIS DESTROYED
                </h2>
                <p className="text-xs font-mono text-slate-400 mb-6">
                    COMBAT SIMULATION TERMINATED // TELEMETRY LOGGED
                </p>

                {/* Match Summary Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                        <div className="text-[11px] font-mono text-slate-500 mb-0.5">ENEMIES DESTROYED</div>
                        <div className="font-display text-xl font-bold text-emerald-400 flex items-center justify-center space-x-1">
                            <Crosshair className="w-4 h-4" />
                            <span>{kills}</span>
                        </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                        <div className="text-[11px] font-mono text-slate-500 mb-0.5">TOTAL SCORE</div>
                        <div className="font-display text-xl font-bold text-amber-400 flex items-center justify-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{score}</span>
                        </div>
                    </div>
                </div>

                {/* Rewards Earned Box */}
                <div className="bg-gradient-to-r from-cyan-950/40 via-slate-950/60 to-pink-950/40 border border-cyan-500/30 rounded-xl p-3.5 mb-6 flex items-center justify-around">
                    <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                        <div className="text-left">
                            <div className="text-[10px] font-mono text-slate-400">CYBER COINS</div>
                            <div className="font-display text-base font-bold text-amber-300">+{coins}</div>
                        </div>
                    </div>

                    {gems > 0 && (
                        <div className="flex items-center space-x-2">
                            <Gem className="w-5 h-5 text-pink-400 fill-pink-400/20" />
                            <div className="text-left">
                                <div className="text-[10px] font-mono text-slate-400">QUANTUM GEMS</div>
                                <div className="font-display text-base font-bold text-pink-300">+{gems}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onRespawn}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>REDEPLOY NOW</span>
                    </button>

                    <button
                        onClick={onReturnToGarage}
                        className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-display text-sm font-semibold rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        <span>GARAGE</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
