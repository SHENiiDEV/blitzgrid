import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ShoppingBag, 
    Coins, 
    Gem, 
    Check, 
    Shield, 
    Zap, 
    Flame, 
    Lock, 
    Layers, 
    Search, 
    Crosshair,
    Sparkles,
    Star,
    ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Shop({ skins = [], user }) {
    const [filterClass, setFilterClass] = useState('all');
    const [filterRarity, setFilterRarity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [purchasingId, setPurchasingId] = useState(null);

    const filteredSkins = skins.filter((s) => {
        if (filterClass !== 'all' && s.type !== filterClass) return false;
        if (filterRarity !== 'all' && s.rarity !== filterRarity) return false;
        if (searchQuery.trim() && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handlePurchase = (skin, currency) => {
        setPurchasingId(skin.id);
        router.post(`/shop/purchase/${skin.id}`, { currency }, {
            preserveScroll: true,
            onSuccess: () => {
                setPurchasingId(null);
                confetti({
                    particleCount: 75,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: [skin.color_primary, skin.color_secondary, skin.color_glow, '#ffd700'],
                });
            },
            onError: () => {
                setPurchasingId(null);
            },
        });
    };

    const renderTankSvg = (skin) => {
        const primary = skin.color_primary || '#00f0ff';
        const secondary = skin.color_secondary || '#ff007f';
        const glow = skin.color_glow || '#00f0ff';

        return (
            <svg width="130" height="105" viewBox="0 0 140 115" className="relative z-10 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:scale-110 transition-transform duration-300">
                <rect x="15" y="8" width="110" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="15" y="87" width="110" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <rect x="28" y="22" width="84" height="71" rx="7" fill="#1e293b" stroke={primary} strokeWidth="3.5" />
                <rect x="40" y="30" width="14" height="55" rx="2" fill={secondary} />
                <rect x="88" y="30" width="10" height="55" rx="2" fill={secondary} />

                {skin.type === 'artillery' ? (
                    <>
                        <rect x="70" y="52" width="65" height="11" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2.5" />
                        <rect x="128" y="49" width="8" height="17" rx="2" fill={glow} />
                        <circle cx="70" cy="57" r="21" fill="#0f172a" stroke={primary} strokeWidth="3.5" />
                        <circle cx="70" cy="57" r="9" fill={glow} />
                    </>
                ) : skin.type === 'destroyer' ? (
                    <>
                        <rect x="68" y="47" width="58" height="8" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2" />
                        <rect x="68" y="60" width="58" height="8" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2" />
                        <rect x="120" y="45" width="6" height="12" rx="1" fill={glow} />
                        <rect x="120" y="58" width="6" height="12" rx="1" fill={glow} />
                        <circle cx="68" cy="57" r="22" fill="#0f172a" stroke={primary} strokeWidth="3.5" />
                        <circle cx="68" cy="57" r="9" fill={glow} />
                    </>
                ) : (
                    <>
                        <rect x="70" y="51" width="56" height="13" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2.5" />
                        <rect x="120" y="49" width="8" height="17" rx="2" fill={glow} />
                        <circle cx="70" cy="57" r="21" fill="#0f172a" stroke={primary} strokeWidth="3.5" />
                        <circle cx="70" cy="57" r="8" fill={glow} />
                    </>
                )}
            </svg>
        );
    };

    return (
        <AuthenticatedLayout title="Armory Shop">
            <Head title="Armory Shop // BLITZGRID" />

            {/* Shop Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span>BLACK MARKET ARMORY // 32 COMBAT MODELS</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white">
                        ACQUIRE COMBAT <span className="text-amber-400">CHASSIS</span>
                    </h1>
                </div>

                {user && (
                    <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-2.5 shadow-xl font-mono">
                        <div className="flex items-center space-x-2 text-amber-400">
                            <Coins className="w-5 h-5 fill-amber-400/20" />
                            <div>
                                <div className="text-[9px] text-slate-400">CYBER COINS</div>
                                <div className="font-bold text-base">{user.coins?.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <div className="flex items-center space-x-2 text-pink-400">
                            <Gem className="w-5 h-5 fill-pink-400/20" />
                            <div>
                                <div className="text-[9px] text-slate-400">QUANTUM GEMS</div>
                                <div className="font-bold text-base">{user.gems?.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <Link
                            href="/topup"
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-tech font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all flex items-center space-x-1"
                        >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>TOP UP</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl space-y-3 font-tech">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Class Archetype Tabs */}
                    <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1">
                        {[
                            { id: 'all', label: 'ALL CLASSES' },
                            { id: 'assault', label: 'ASSAULT' },
                            { id: 'heavy', label: 'HEAVY TITAN' },
                            { id: 'scout', label: 'PHANTOM SCOUT' },
                            { id: 'artillery', label: 'ARTILLERY' },
                            { id: 'destroyer', label: 'DESTROYER' },
                            { id: 'chrono', label: 'CHRONO/VOID' },
                        ].map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setFilterClass(c.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                                    filterClass === c.id
                                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search 32 tanks..."
                            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white outline-none"
                        />
                    </div>
                </div>

                {/* Rarity Filter */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 overflow-x-auto">
                    <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">RARITY:</span>
                    {['all', 'common', 'rare', 'epic', 'legendary', 'mythic'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilterRarity(r)}
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
                                filterRarity === r
                                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skins Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredSkins.map((skin) => {
                    const canAffordCoins = user && user.coins >= skin.price_coins;
                    const canAffordGems = user && skin.price_gems > 0 && user.gems >= skin.price_gems;
                    const isPurchasing = purchasingId === skin.id;

                    return (
                        <div
                            key={skin.id}
                            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group relative overflow-hidden"
                        >
                            <div>
                                {/* Top Badge Row */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-1.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                                            skin.rarity === 'mythic' ? 'bg-red-950 border border-red-500 text-red-300' :
                                            skin.rarity === 'legendary' ? 'bg-amber-950 border border-amber-500/50 text-amber-300' :
                                            skin.rarity === 'epic' ? 'bg-purple-950 border border-purple-500/50 text-purple-300' :
                                            skin.rarity === 'rare' ? 'bg-blue-950 border border-blue-500/50 text-blue-300' :
                                            'bg-slate-950 border border-slate-700 text-slate-400'
                                        }`}>
                                            {skin.rarity}
                                        </span>

                                        <span className="text-[9px] font-mono text-slate-400 uppercase">
                                            {skin.type}
                                        </span>
                                    </div>

                                    {skin.is_owned ? (
                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300">
                                            <Check className="w-3 h-3" />
                                            <span>OWNED</span>
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                                            <Lock className="w-3 h-3" />
                                            <span>AVAILABLE</span>
                                        </span>
                                    )}
                                </div>

                                {/* Visual Tank Model Preview */}
                                <div className="relative h-40 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden mb-4 bg-cyber-dots">
                                    <div 
                                        className="absolute w-28 h-28 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"
                                        style={{ backgroundColor: skin.color_glow }}
                                    />

                                    {renderTankSvg(skin)}

                                    {/* Perk Chip */}
                                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 rounded-lg px-2 py-1 flex items-center justify-between text-[10px] font-mono">
                                        <span className="text-slate-400 truncate">PERK:</span>
                                        <span className="text-amber-400 font-bold truncate">{skin.stats?.special_perk || 'Pulse Core'}</span>
                                    </div>
                                </div>

                                <h3 className="font-display text-lg font-bold text-white mb-1">
                                    {skin.name}
                                </h3>
                                <p className="text-xs font-sans text-slate-400 mb-3 line-clamp-2">
                                    {skin.description}
                                </p>

                                {/* Base Stats Bar Preview */}
                                <div className="grid grid-cols-3 gap-1.5 mb-4 font-mono text-[10px] bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                                    <div className="text-center">
                                        <div className="text-slate-500">SPD</div>
                                        <div className="font-bold text-amber-400">{Math.round((skin.stats?.speed || 1.0) * 100)}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-slate-500">DMG</div>
                                        <div className="font-bold text-red-400">{Math.round((skin.stats?.damage || 1.0) * 100)}%</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-slate-500">ARMOR</div>
                                        <div className="font-bold text-cyan-400">{skin.stats?.max_hp || 100} HP</div>
                                    </div>
                                </div>
                            </div>

                            {/* Purchase Controls */}
                            <div className="pt-3 border-t border-slate-800">
                                {skin.is_owned ? (
                                    <Link
                                        href="/garage"
                                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-cyan-300 font-tech font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>TUNE IN GARAGE</span>
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        {/* Buy with Coins */}
                                        <button
                                            onClick={() => handlePurchase(skin, 'coins')}
                                            disabled={!canAffordCoins || isPurchasing}
                                            className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                                                canAffordCoins
                                                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)] cursor-pointer'
                                                    : 'bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed'
                                            }`}
                                        >
                                            <Coins className="w-3.5 h-3.5" />
                                            <span>{skin.price_coins}</span>
                                        </button>

                                        {/* Buy with Gems */}
                                        {skin.price_gems > 0 && (
                                            <button
                                                onClick={() => handlePurchase(skin, 'gems')}
                                                disabled={!canAffordGems || isPurchasing}
                                                className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                                                    canAffordGems
                                                        ? 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)] cursor-pointer'
                                                        : 'bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed'
                                                }`}
                                            >
                                                <Gem className="w-3.5 h-3.5" />
                                                <span>{skin.price_gems}</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AuthenticatedLayout>
    );
}
