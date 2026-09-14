import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Crosshair, 
    Shield, 
    Zap, 
    Trophy, 
    Award, 
    Play, 
    Layers, 
    ShoppingBag, 
    ChevronRight, 
    Flame,
    Coins,
    Gem,
    Activity
} from 'lucide-react';

export default function Dashboard({ stats, equippedSkin, recentMatches = [], topPlayers = [] }) {
    return (
        <AuthenticatedLayout title="Command Deck">
            <Head title="Command Deck // BLITZGRID" />

            {/* Hero Deployment Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 mb-8 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -left-10 -top-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="space-y-3 max-w-xl text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono">
                            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            <span>GRID ARENA 01 // 30 TPS REAL-TIME ACTIVE</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white">
                            READY FOR COMBAT, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">COMMANDER</span>
                        </h1>
                        <p className="text-slate-400 font-sans text-sm leading-relaxed">
                            Engage in 30Hz physics-authoritative tank warfare. Destroy autonomous combat bots, outmaneuver rivals, collect quantum power-ups, and dominate the global rankings.
                        </p>
                    </div>

                    {/* Launch Match Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/play"
                            className="group relative px-8 py-4 rounded-xl font-display font-black text-lg tracking-widest uppercase overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 group-hover:opacity-90 transition-opacity"></div>
                            <div className="relative flex items-center space-x-3 text-slate-950">
                                <Play className="w-6 h-6 fill-current" />
                                <span>ENTER COMBAT ARENA</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-tech">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4">
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-400">
                        <Crosshair className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-slate-400">TOTAL KILLS</div>
                        <div className="font-display text-2xl font-bold text-white">{stats.kills_total}</div>
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4">
                    <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-slate-400">K/D RATIO</div>
                        <div className="font-display text-2xl font-bold text-cyan-300">{stats.kd_ratio}</div>
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4">
                    <div className="p-3 bg-amber-950/80 border border-amber-500/40 rounded-xl text-amber-400">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-slate-400">MATCHES</div>
                        <div className="font-display text-2xl font-bold text-white">{stats.matches_played}</div>
                    </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4">
                    <div className="p-3 bg-pink-950/80 border border-pink-500/40 rounded-xl text-pink-400">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-mono text-slate-400">ARMORY LOADOUT</div>
                        <div className="font-display text-2xl font-bold text-pink-300">
                            {stats.total_skins_owned} / {stats.total_skins_available}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2-Column: Equipped Tank & Recent Match Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Equipped Tank Visualizer Card */}
                <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                                ACTIVE CHASSIS
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                                {equippedSkin?.rarity || 'EQUIPPED'}
                            </span>
                        </div>

                        {/* Tank Render Preview Box */}
                        <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden mb-4 bg-cyber-dots">
                            {/* Ambient Glow */}
                            <div 
                                className="absolute w-32 h-32 rounded-full blur-2xl opacity-40"
                                style={{ backgroundColor: equippedSkin?.color_primary || '#00f0ff' }}
                            ></div>

                            {/* SVG Tank Model */}
                            <div className="relative flex flex-col items-center">
                                <svg width="120" height="100" viewBox="0 0 120 100" className="drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                                    {/* Left & Right Treads */}
                                    <rect x="20" y="10" width="80" height="18" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                                    <rect x="20" y="72" width="80" height="18" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                                    {/* Tread wheels */}
                                    <circle cx="32" cy="19" r="4" fill="#475569" />
                                    <circle cx="60" cy="19" r="4" fill="#475569" />
                                    <circle cx="88" cy="19" r="4" fill="#475569" />
                                    <circle cx="32" cy="81" r="4" fill="#475569" />
                                    <circle cx="60" cy="81" r="4" fill="#475569" />
                                    <circle cx="88" cy="81" r="4" fill="#475569" />

                                    {/* Main Hull Body */}
                                    <rect 
                                        x="30" y="24" width="60" height="52" rx="6" 
                                        fill="#1e293b" 
                                        stroke={equippedSkin?.color_primary || '#00f0ff'} 
                                        strokeWidth="3" 
                                    />
                                    {/* Accent stripes */}
                                    <rect 
                                        x="40" y="32" width="10" height="36" rx="2" 
                                        fill={equippedSkin?.color_secondary || '#ff007f'} 
                                    />

                                    {/* Cannon Barrel */}
                                    <rect 
                                        x="60" y="45" width="48" height="10" rx="2" 
                                        fill="#0f172a" 
                                        stroke={equippedSkin?.color_primary || '#00f0ff'} 
                                        strokeWidth="2" 
                                    />
                                    <rect 
                                        x="102" y="43" width="8" height="14" rx="2" 
                                        fill={equippedSkin?.color_glow || '#00f0ff'} 
                                    />

                                    {/* Turret Center Dome */}
                                    <circle 
                                        cx="60" cy="50" r="16" 
                                        fill="#0f172a" 
                                        stroke={equippedSkin?.color_primary || '#00f0ff'} 
                                        strokeWidth="3" 
                                    />
                                    <circle 
                                        cx="60" cy="50" r="6" 
                                        fill={equippedSkin?.color_glow || '#00f0ff'} 
                                    />
                                </svg>
                            </div>
                        </div>

                        <h3 className="font-display text-lg font-bold text-white mb-1">
                            {equippedSkin?.name || 'Neon Vanguard'}
                        </h3>
                        <p className="text-xs font-sans text-slate-400 mb-4 line-clamp-2">
                            {equippedSkin?.description || 'Standard high-frequency combat chassis.'}
                        </p>
                    </div>

                    <Link
                        href="/garage"
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-tech font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all"
                    >
                        <Layers className="w-4 h-4" />
                        <span>OPEN GARAGE CUSTOMIZER</span>
                    </Link>
                </div>

                {/* Recent Battle History */}
                <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <span>RECENT COMBAT TELEMETRY</span>
                            </span>
                            <Link href="/leaderboard" className="text-xs font-mono text-cyan-400 hover:underline flex items-center">
                                <span>GLOBAL RANKS</span>
                                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </Link>
                        </div>

                        {recentMatches.length === 0 ? (
                            <div className="py-12 text-center text-slate-500 font-mono text-sm">
                                No combat records found. Deploy your first match!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm font-tech">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs font-mono text-slate-500">
                                            <th className="pb-3">GAME MODE</th>
                                            <th className="pb-3 text-center">KILLS</th>
                                            <th className="pb-3 text-center">DEATHS</th>
                                            <th className="pb-3 text-right">SCORE</th>
                                            <th className="pb-3 text-right">REWARDS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                                        {recentMatches.map((m) => (
                                            <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-3 text-slate-300 font-tech font-bold uppercase">
                                                    FREE-FOR-ALL
                                                </td>
                                                <td className="py-3 text-center text-emerald-400 font-bold">
                                                    {m.kills}
                                                </td>
                                                <td className="py-3 text-center text-red-400">
                                                    {m.deaths}
                                                </td>
                                                <td className="py-3 text-right text-amber-400 font-bold">
                                                    {m.score}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <span className="text-amber-300 flex items-center space-x-0.5">
                                                            <Coins className="w-3 h-3" />
                                                            <span>+{m.coins_earned}</span>
                                                        </span>
                                                        {m.gems_earned > 0 && (
                                                            <span className="text-pink-300 flex items-center space-x-0.5">
                                                                <Gem className="w-3 h-3" />
                                                                <span>+{m.gems_earned}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>ARENA PROTOCOL: 30 TPS FIX-STEP</span>
                        <Link href="/shop" className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-bold">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>VISIT BLACK MARKET SHOP</span>
                        </Link>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
