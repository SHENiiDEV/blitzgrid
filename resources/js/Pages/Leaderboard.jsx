import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Trophy, 
    Medal, 
    Crosshair, 
    Shield, 
    Award, 
    Play, 
    Globe, 
    Search, 
    Sparkles, 
    Zap, 
    Flame, 
    Activity,
    Swords,
    ChevronRight,
    Target
} from 'lucide-react';

export default function Leaderboard({ 
    topCommanders = [], 
    currentUserRank = null, 
    recentMatches = [],
    totalCommandersCount = 0 
}) {
    const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'top10' | 'veterans' | 'high_kd'
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCommanders = useMemo(() => {
        return topCommanders.filter((c) => {
            // Category filter
            if (filterCategory === 'top10' && c.rank > 10) return false;
            if (filterCategory === 'veterans' && (c.matches || 0) < 30) return false;
            if (filterCategory === 'high_kd' && (c.kd_ratio || 0) < 3.0) return false;

            // Search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchName = c.name?.toLowerCase().includes(query);
                const matchUsername = c.username?.toLowerCase().includes(query);
                const matchCountry = c.country?.toLowerCase().includes(query);
                const matchTank = c.equipped_skin?.name?.toLowerCase().includes(query);
                if (!matchName && !matchUsername && !matchCountry && !matchTank) {
                    return false;
                }
            }

            return true;
        });
    }, [topCommanders, filterCategory, searchQuery]);

    const topThree = topCommanders.slice(0, 3);

    return (
        <AuthenticatedLayout title="Global Combat Leaderboards">
            <Head title="Leaderboard // BLITZGRID" />

            {/* Header Title & CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
                        <Trophy className="w-4 h-4" />
                        <span>GLOBAL COMBAT RANKINGS // {totalCommandersCount} REGISTERED PILOTS</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white">
                        ACE <span className="text-emerald-400">COMMANDERS</span> & <span className="text-pink-500">GLOBAL LADDER</span>
                    </h1>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        href="/play"
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:opacity-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center space-x-2 transition-all transform hover:scale-105"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>CLIMB THE RANKS</span>
                    </Link>
                </div>
            </div>

            {/* CURRENT USER STATUS STICKY BANNER */}
            {currentUserRank && (
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-pink-950/60 border border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-4 font-tech">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-display font-black text-lg text-cyan-300 shadow-inner">
                            #{currentUserRank.rank}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] uppercase">
                                    YOUR POSITION
                                </span>
                                <span className="text-xs font-mono text-slate-400">GLOBAL LEADERBOARD</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-white">
                                You are ranked <span className="text-cyan-400">#{currentUserRank.rank}</span> overall
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-6 font-mono text-xs">
                        <div className="text-center sm:text-left">
                            <div className="text-[10px] text-slate-400 uppercase">TOTAL KILLS</div>
                            <div className="font-display font-black text-lg text-emerald-400">
                                {currentUserRank.kills}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
                        <div className="text-center sm:text-left">
                            <div className="text-[10px] text-slate-400 uppercase">K/D RATIO</div>
                            <div className="font-display font-black text-lg text-cyan-300">
                                {currentUserRank.kd_ratio}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
                        <div className="text-center sm:text-left">
                            <div className="text-[10px] text-slate-400 uppercase">MATCHES</div>
                            <div className="font-display font-black text-lg text-amber-400">
                                {currentUserRank.matches}
                            </div>
                        </div>
                        <Link
                            href="/play"
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase rounded-xl shadow-md transition-colors"
                        >
                            DEPLOY
                        </Link>
                    </div>
                </div>
            )}

            {/* TOP 3 PODIUM CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-tech">
                {topThree.map((commander, index) => {
                    const podiumStyles = [
                        {
                            border: 'border-amber-400/80 ring-1 ring-amber-400/30',
                            badge: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
                            glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
                            tag: 'CHAMPION // #1',
                            tagColor: 'text-amber-300 bg-amber-950/80 border-amber-500/50'
                        },
                        {
                            border: 'border-slate-300/80 ring-1 ring-slate-300/30',
                            badge: 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-[0_0_15px_rgba(203,213,225,0.3)]',
                            glow: 'shadow-[0_0_25px_rgba(203,213,225,0.15)]',
                            tag: 'RUNNER UP // #2',
                            tagColor: 'text-slate-300 bg-slate-900 border-slate-700'
                        },
                        {
                            border: 'border-amber-700/80 ring-1 ring-amber-700/30',
                            badge: 'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-[0_0_15px_rgba(180,83,9,0.3)]',
                            glow: 'shadow-[0_0_25px_rgba(180,83,9,0.15)]',
                            tag: 'BRONZE ACE // #3',
                            tagColor: 'text-amber-500 bg-amber-950/60 border-amber-800/60'
                        },
                    ][index] || { border: 'border-slate-800', badge: 'bg-slate-800', glow: '', tag: `#${commander.rank}`, tagColor: 'text-slate-400' };

                    return (
                        <div
                            key={commander.id}
                            className={`bg-slate-900/90 border ${podiumStyles.border} ${podiumStyles.glow} rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center transition-transform hover:-translate-y-1`}
                        >
                            {/* Giant background rank number */}
                            <div className="absolute -top-3 -right-2 font-display font-black text-6xl text-slate-800/40 select-none pointer-events-none">
                                #{commander.rank}
                            </div>

                            {/* Tag */}
                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase mb-4 border ${podiumStyles.tagColor}`}>
                                <Sparkles className="w-3 h-3" />
                                <span>{podiumStyles.tag}</span>
                            </div>

                            {/* Rank Badge */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-2xl mb-3 ${podiumStyles.badge}`}>
                                #{commander.rank}
                            </div>

                            <div className="flex items-center space-x-1.5 mb-1">
                                <h3 className="font-display font-bold text-xl text-white">
                                    {commander.username}
                                </h3>
                                {commander.is_current_user && (
                                    <span className="px-1.5 py-0.5 bg-cyan-500 text-slate-950 font-mono font-black text-[9px] rounded uppercase">
                                        YOU
                                    </span>
                                )}
                            </div>

                            <div className="text-xs font-mono text-slate-400 mb-4 flex items-center space-x-2">
                                <Globe className="w-3.5 h-3.5 text-slate-500" />
                                <span>{commander.country}</span>
                                <span>•</span>
                                <span>{commander.matches} Matches</span>
                            </div>

                            {/* Equipped Tank chassis banner */}
                            {commander.equipped_skin && (
                                <div className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 mb-4 flex items-center justify-between text-xs font-mono">
                                    <div className="flex items-center space-x-2">
                                        <div 
                                            className="w-3.5 h-3.5 rounded-sm shadow-sm"
                                            style={{ backgroundColor: commander.equipped_skin.color_primary }}
                                        />
                                        <span className="text-white font-bold">{commander.equipped_skin.name}</span>
                                    </div>
                                    <span className="text-cyan-400 font-bold text-[10px]">
                                        LVL {commander.equipped_skin.level}
                                    </span>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-800 pt-3 text-xs font-mono">
                                <div className="bg-slate-950/80 rounded-xl p-2.5">
                                    <div className="text-[10px] text-slate-500">TOTAL KILLS</div>
                                    <div className="font-display font-black text-emerald-400 text-xl">{commander.kills}</div>
                                </div>
                                <div className="bg-slate-950/80 rounded-xl p-2.5">
                                    <div className="text-[10px] text-slate-500">K/D RATIO</div>
                                    <div className="font-display font-black text-cyan-300 text-xl">{commander.kd_ratio}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 font-tech">
                {/* Categories */}
                <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    {[
                        { id: 'all', label: 'ALL COMMANDERS' },
                        { id: 'top10', label: 'TOP 10 ELITE' },
                        { id: 'veterans', label: 'VETERANS (30+ MATCHES)' },
                        { id: 'high_kd', label: 'HIGH K/D (3.0+)' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterCategory(tab.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                                filterCategory === tab.id
                                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search commander, country, chassis..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white outline-none"
                    />
                </div>
            </div>

            {/* MAIN LEADERBOARD TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Table (8 cols on large screens) */}
                <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2 font-display text-base font-bold text-white">
                            <Medal className="w-5 h-5 text-emerald-400" />
                            <span>OFFICIAL COMMANDER LADDER ({filteredCommanders.length} PILOTS)</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-tech text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs font-mono text-slate-500">
                                    <th className="pb-3 w-16">RANK</th>
                                    <th className="pb-3">COMMANDER</th>
                                    <th className="pb-3">CHASSIS LOADOUT</th>
                                    <th className="pb-3 text-center">MATCHES</th>
                                    <th className="pb-3 text-center">KILLS</th>
                                    <th className="pb-3 text-center">DEATHS</th>
                                    <th className="pb-3 text-right">K/D</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                                {filteredCommanders.map((c) => {
                                    const isCurrentUser = c.is_current_user;
                                    return (
                                        <tr 
                                            key={c.id} 
                                            className={`transition-colors ${
                                                isCurrentUser 
                                                    ? 'bg-cyan-950/60 hover:bg-cyan-900/50 ring-1 ring-cyan-500' 
                                                    : 'hover:bg-slate-800/40'
                                            }`}
                                        >
                                            {/* Rank */}
                                            <td className="py-3.5 font-bold font-display text-sm">
                                                {c.rank === 1 ? (
                                                    <span className="text-amber-400 font-black">👑 #1</span>
                                                ) : c.rank === 2 ? (
                                                    <span className="text-slate-300 font-black">🥈 #2</span>
                                                ) : c.rank === 3 ? (
                                                    <span className="text-amber-600 font-black">🥉 #3</span>
                                                ) : (
                                                    <span className="text-cyan-400">#{c.rank}</span>
                                                )}
                                            </td>

                                            {/* Commander Name & Tag */}
                                            <td className="py-3.5">
                                                <div className="flex items-center space-x-2">
                                                    <div className="font-tech font-bold text-sm text-white flex items-center space-x-1.5">
                                                        <span>{c.username}</span>
                                                        {isCurrentUser && (
                                                            <span className="px-1.5 py-0.5 bg-cyan-500 text-slate-950 font-mono font-black text-[9px] rounded uppercase shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                                                                YOU
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] text-slate-400">
                                                        {c.country}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Equipped Chassis */}
                                            <td className="py-3.5">
                                                {c.equipped_skin ? (
                                                    <div className="flex items-center space-x-1.5">
                                                        <div 
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ backgroundColor: c.equipped_skin.color_primary }}
                                                        />
                                                        <span className="text-slate-300 font-mono text-xs">{c.equipped_skin.name}</span>
                                                        <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-1.5 rounded">
                                                            L{c.equipped_skin.level}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600 font-mono">Standard</span>
                                                )}
                                            </td>

                                            {/* Matches */}
                                            <td className="py-3.5 text-center text-slate-300 font-mono">
                                                {c.matches}
                                            </td>

                                            {/* Total Kills */}
                                            <td className="py-3.5 text-center text-emerald-400 font-bold font-mono text-sm">
                                                {c.kills}
                                            </td>

                                            {/* Deaths */}
                                            <td className="py-3.5 text-center text-red-400 font-mono">
                                                {c.deaths}
                                            </td>

                                            {/* K/D Ratio */}
                                            <td className="py-3.5 text-right font-mono font-bold text-cyan-300">
                                                {c.kd_ratio}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Recent Battle Skirmishes (4 cols) */}
                <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                            <Swords className="w-4 h-4" />
                            <span>LIVE ARENA TELEMETRY</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[9px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>30 TPS</span>
                        </span>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 font-tech">
                        {recentMatches.map((match) => (
                            <div 
                                key={match.id}
                                className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors text-xs"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-display font-bold text-white text-sm">
                                        {match.player_name}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500">
                                        {match.time_ago}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] mb-2">
                                    <div className="bg-slate-900 p-1.5 rounded-lg text-center">
                                        <div className="text-[9px] text-slate-500">KILLS</div>
                                        <div className="font-bold text-emerald-400">+{match.kills}</div>
                                    </div>
                                    <div className="bg-slate-900 p-1.5 rounded-lg text-center">
                                        <div className="text-[9px] text-slate-500">SCORE</div>
                                        <div className="font-bold text-amber-400">{match.score}</div>
                                    </div>
                                    <div className="bg-slate-900 p-1.5 rounded-lg text-center">
                                        <div className="text-[9px] text-slate-500">BOUNTY</div>
                                        <div className="font-bold text-cyan-300">+{match.coins_earned} C</div>
                                    </div>
                                </div>

                                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                                    <span>Combat Time: {match.duration_seconds}s</span>
                                    {match.gems_earned > 0 && (
                                        <span className="text-pink-400 font-bold">+{match.gems_earned} Gems</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}


