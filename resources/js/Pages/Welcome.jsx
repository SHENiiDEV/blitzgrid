import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Crosshair, 
    Shield, 
    Zap, 
    Flame, 
    Trophy, 
    Play, 
    Cpu, 
    Layers, 
    ShoppingBag, 
    Terminal, 
    Activity, 
    ArrowRight, 
    Check, 
    Award, 
    UserPlus, 
    Radio, 
    Target, 
    Sparkles,
    Coins,
    Gem,
    ArrowUpCircle,
    Star,
    Gauge,
    Sliders,
    Menu,
    X
} from 'lucide-react';

export default function Welcome({ skins = [], topCommanders = [], isAuthenticated = false }) {
    const [selectedSkinIndex, setSelectedSkinIndex] = useState(0);
    const [mouseTurretAngle, setMouseTurretAngle] = useState(0);
    const [simulatorLevel, setSimulatorLevel] = useState(50);
    const [simulatorRarity, setSimulatorRarity] = useState('legendary');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const tankStageRef = useRef(null);

    const activeSkin = skins[selectedSkinIndex] || skins[0] || {
        name: 'Neon Vanguard',
        rarity: 'common',
        color_primary: '#00f0ff',
        color_secondary: '#ff007f',
        color_glow: '#00f0ff',
        description: 'Standard issue cyber-tank chassis equipped with pulse ion reactor and neon trim.',
        stats: { speed: 1.0, fire_rate: 1.0, damage: 1.0, max_hp: 100, shield: 50, special_perk: 'Ion Pulse Core' }
    };

    // Calculate aim angle from mouse or touch coords
    const updateTurretAim = (clientX, clientY) => {
        if (!tankStageRef.current) return;
        const rect = tankStageRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(clientY - centerY, clientX - centerX);
        setMouseTurretAngle(angle);
    };

    // Track mouse or touch to rotate turret in real-time
    useEffect(() => {
        const handleMouseMove = (e) => {
            updateTurretAim(e.clientX, e.clientY);
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                updateTurretAim(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    // Calculate simulated stats based on level
    const maxLevelForRarity = simulatorRarity === 'common' ? 25 : simulatorRarity === 'rare' ? 50 : simulatorRarity === 'epic' ? 75 : simulatorRarity === 'legendary' ? 100 : 1000;
    const clampedLevel = Math.min(maxLevelForRarity, simulatorLevel);
    const levelBonus = clampedLevel - 1;

    const simSpeed = Math.round((1.0 * (1 + levelBonus * 0.012)) * 100);
    const simFireRate = Math.round((1.0 * (1 + levelBonus * 0.015)) * 100);
    const simDamage = Math.round((1.0 * (1 + levelBonus * 0.018)) * 100);
    const simHp = Math.round(100 + (levelBonus * 2.5));
    const simShield = Math.round(50 + (levelBonus * 1.5));
    const simBulletSpeed = Math.round((1.0 * (1 + levelBonus * 0.008)) * 100);

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
            <Head title="BLITZGRID // Real-Time 30 TPS Multiplayer Tank Arena" />

            {/* Glowing Accent Top Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-pink-500 via-amber-400 to-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.8)]"></div>

            {/* Header Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <Crosshair className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white">
                                BLITZ<span className="text-pink-500">GRID</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] tracking-widest text-cyan-400 font-mono -mt-1 uppercase">
                                30 TPS Tactical Arena
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links (Desktop) */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-tech text-sm tracking-wider font-semibold">
                        <a href="#armory" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                            <Layers className="w-4 h-4 text-pink-400" />
                            <span>ARMORY</span>
                        </a>
                        <a href="#upgrades" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center space-x-1.5">
                            <ArrowUpCircle className="w-4 h-4 text-amber-400" />
                            <span>UPGRADES (LVL 1000)</span>
                        </a>
                        <a href="#architecture" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <span>30 TPS ENGINE</span>
                        </a>
                        <a href="#powerups" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>POWER-UPS</span>
                        </a>
                        <Link href="/leaderboard" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                            <span>RANKS</span>
                        </Link>
                    </nav>

                    {/* Auth & Play CTAs (Desktop) */}
                    <div className="hidden sm:flex items-center space-x-3 sm:space-x-4">
                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 border border-cyan-500/60 hover:bg-slate-800 text-cyan-400 font-tech font-bold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-lg"
                            >
                                <Terminal className="w-4 h-4" />
                                <span>COMMAND DECK</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-3.5 py-2 sm:px-4 sm:py-2 font-tech font-bold text-xs tracking-wider text-slate-300 hover:text-white transition-colors"
                            >
                                LOGIN
                            </Link>
                        )}

                        <Link
                            href="/play"
                            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-display font-black text-xs tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center space-x-1.5 transition-all transform hover:scale-105 uppercase"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>PLAY NOW</span>
                        </Link>
                    </div>

                    {/* Mobile Hamburger & Play Button */}
                    <div className="flex sm:hidden items-center space-x-2">
                        <Link
                            href="/play"
                            className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-display font-black text-[11px] tracking-wider rounded-lg shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center space-x-1 uppercase"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>PLAY</span>
                        </Link>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 focus:outline-none"
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-5 space-y-3 font-tech text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            <a 
                                href="#armory" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 flex items-center space-x-2"
                            >
                                <Layers className="w-4 h-4 text-pink-400" />
                                <span>ARMORY</span>
                            </a>
                            <a 
                                href="#upgrades" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-amber-300 flex items-center space-x-2"
                            >
                                <ArrowUpCircle className="w-4 h-4 text-amber-400" />
                                <span>UPGRADES</span>
                            </a>
                            <a 
                                href="#architecture" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 flex items-center space-x-2"
                            >
                                <Cpu className="w-4 h-4 text-cyan-400" />
                                <span>30 TPS ENGINE</span>
                            </a>
                            <a 
                                href="#powerups" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 flex items-center space-x-2"
                            >
                                <Zap className="w-4 h-4 text-amber-400" />
                                <span>POWER-UPS</span>
                            </a>
                            <Link 
                                href="/leaderboard" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 flex items-center space-x-2 col-span-2"
                            >
                                <Trophy className="w-4 h-4 text-emerald-400" />
                                <span>GLOBAL RANKS & LEADERBOARDS</span>
                            </Link>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                            {isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className="flex-1 py-2.5 px-4 bg-slate-900 border border-cyan-500/50 text-cyan-400 font-bold rounded-xl text-center flex items-center justify-center space-x-2"
                                >
                                    <Terminal className="w-4 h-4" />
                                    <span>COMMAND DECK</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex-1 py-2.5 px-3 bg-slate-900 border border-slate-700 text-slate-300 font-bold rounded-xl text-center"
                                    >
                                        LOGIN
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex-1 py-2.5 px-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold rounded-xl text-center"
                                    >
                                        SIGN UP
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-cyber-grid">
                <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                        
                        {/* Left Hero Column */}
                        <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-[10px] sm:text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
                                <span>LIVE ENGINE // 30 TPS AUTHORITATIVE SIMULATION</span>
                            </div>

                            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-wide text-white uppercase leading-tight">
                                <span className="text-cyan-400">NEXT-GEN</span> <br />
                                CYBER TANK <br />
                                <span className="text-pink-500">WARFARE</span>
                            </h1>

                            <p className="text-slate-300 font-sans text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Real-time multiplayer combat with server-side physics, autonomous trigonometry bots, 32 customizable chassis models, and upgrade evolution up to <strong>Level 1000 (Mythic)</strong>!
                            </p>

                            {/* Combat Access Card */}
                            <div className="p-3 sm:p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md max-w-xl mx-auto lg:mx-0">
                                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                                    <Link
                                        href="/play"
                                        className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        <span>ENTER COMBAT ARENA</span>
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="py-3 sm:py-3.5 px-4 sm:px-5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 font-display font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                                    >
                                        <UserPlus className="w-4 h-4 text-amber-400" />
                                        <span>SIGN UP</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Feature Pills */}
                            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px] sm:text-xs text-slate-400 max-w-xl mx-auto lg:mx-0">
                                <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-1.5 bg-slate-950/80 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-lg text-center">
                                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    <span className="truncate">32 Tanks</span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-1.5 bg-slate-950/80 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-lg text-center">
                                    <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                    <span className="truncate">Lvl 1000</span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-1.5 bg-slate-950/80 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-lg text-center">
                                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span className="truncate">Treasury</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column: Interactive Hologram */}
                        <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-slate-800 pb-2.5 sm:pb-3">
                                <div className="flex items-center space-x-2 font-mono text-[11px] sm:text-xs text-cyan-400 uppercase">
                                    <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                                    <span>
                                        HOLOGRAPHIC CHASSIS // <span className="hidden sm:inline">MOVE MOUSE TO AIM</span><span className="sm:hidden">TOUCH TO AIM</span>
                                    </span>
                                </div>
                                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase bg-pink-950 border border-pink-500 text-pink-300">
                                    {activeSkin.rarity}
                                </span>
                            </div>

                            {/* Tank Canvas Stage */}
                            <div 
                                ref={tankStageRef}
                                className="relative h-48 sm:h-64 lg:h-72 rounded-xl sm:rounded-2xl bg-[#01040a] border border-slate-800/80 flex items-center justify-center overflow-hidden bg-cyber-dots cursor-crosshair touch-none"
                            >
                                <div 
                                    className="absolute w-44 sm:w-56 h-44 sm:h-56 rounded-full blur-3xl opacity-35 animate-pulse"
                                    style={{ backgroundColor: activeSkin.color_glow }}
                                />

                                <svg width="200" height="160" viewBox="0 0 160 140" className="relative z-10 drop-shadow-[0_0_25px_rgba(0,240,255,0.4)] max-w-full">
                                    {/* Tracks */}
                                    <rect x="20" y="14" width="120" height="24" rx="4" fill="#090d16" stroke="#334155" strokeWidth="2.5" />
                                    <rect x="20" y="102" width="120" height="24" rx="4" fill="#090d16" stroke="#334155" strokeWidth="2.5" />
                                    <circle cx="36" cy="26" r="5" fill="#475569" />
                                    <circle cx="80" cy="26" r="5" fill="#475569" />
                                    <circle cx="124" cy="26" r="5" fill="#475569" />
                                    <circle cx="36" cy="114" r="5" fill="#475569" />
                                    <circle cx="80" cy="114" r="5" fill="#475569" />
                                    <circle cx="124" cy="114" r="5" fill="#475569" />

                                    {/* Hull Body */}
                                    <rect x="34" y="32" width="92" height="76" rx="8" fill="#1e293b" stroke={activeSkin.color_primary} strokeWidth="4" />
                                    <rect x="48" y="42" width="14" height="56" rx="2" fill={activeSkin.color_secondary} />
                                    <rect x="98" y="42" width="10" height="56" rx="2" fill={activeSkin.color_secondary} />

                                    {/* Rotating Turret */}
                                    <g transform={`rotate(${(mouseTurretAngle * 180) / Math.PI}, 80, 70)`}>
                                        <rect x="80" y="63" width="70" height="14" rx="3" fill="#0f172a" stroke={activeSkin.color_primary} strokeWidth="3" />
                                        <rect x="142" y="60" width="10" height="20" rx="2" fill={activeSkin.color_glow} />
                                        <circle cx="80" cy="70" r="24" fill="#0f172a" stroke={activeSkin.color_primary} strokeWidth="4" />
                                        <circle cx="80" cy="70" r="10" fill={activeSkin.color_glow} />
                                    </g>
                                </svg>
                            </div>

                            {/* Active Tank Title & Stats */}
                            <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-display font-bold text-lg sm:text-xl text-white truncate">
                                            {activeSkin.name}
                                        </h3>
                                        <p className="text-[11px] sm:text-xs font-mono text-slate-400 mt-0.5 line-clamp-1">
                                            {activeSkin.description}
                                        </p>
                                    </div>
                                    <Link
                                        href="/garage"
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tech font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-colors shrink-0"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>GARAGE</span>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:gap-3 font-tech text-xs pt-2.5 sm:pt-3 border-t border-slate-800">
                                    <div>
                                        <div className="flex justify-between text-slate-400 font-mono text-[9px] sm:text-[10px] mb-1">
                                            <span>SPEED</span>
                                            <span className="text-amber-400 font-bold">{Math.round((activeSkin.stats?.speed || 1.0) * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(activeSkin.stats?.speed || 1.0) * 85}%` }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-slate-400 font-mono text-[9px] sm:text-[10px] mb-1">
                                            <span>FIRE RATE</span>
                                            <span className="text-pink-400 font-bold">{Math.round((activeSkin.stats?.fire_rate || 1.0) * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(activeSkin.stats?.fire_rate || 1.0) * 85}%` }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-slate-400 font-mono text-[9px] sm:text-[10px] mb-1">
                                            <span>ARMOR</span>
                                            <span className="text-cyan-400 font-bold">{activeSkin.stats?.max_hp || activeSkin.stats?.armor || 100} HP</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* UPGRADE EVOLUTION SECTION (NEW FEATURE HIGHLIGHT) */}
            <section id="upgrades" className="py-12 sm:py-20 bg-gradient-to-b from-[#02050e] via-slate-950 to-[#02050e] border-t border-slate-900 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2 sm:space-y-3">
                        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30">
                            <ArrowUpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>CHASSIS EVOLUTION // LVL 1 TO 1000</span>
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white">
                            AMPLIFY POWER WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400">UPGRADES</span>
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
                            Upgrade your acquired chassis skins with <strong>Cyber Coins</strong> & <strong>Quantum Gems</strong>. Each level increases speed, firing rate, kinetic damage, armor durability, and shield capacity!
                        </p>
                    </div>

                    {/* 5 Rarity Tier Cards (Responsive Deck) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10 sm:mb-14 font-tech">
                        
                        {/* COMMON: LVL 25 */}
                        <div 
                            onClick={() => { setSimulatorRarity('common'); setSimulatorLevel(25); }}
                            className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border transition-all cursor-pointer select-none relative overflow-hidden ${
                                simulatorRarity === 'common' 
                                    ? 'bg-slate-900 border-slate-500 ring-2 ring-slate-400/50 shadow-[0_0_20px_rgba(148,163,184,0.3)]' 
                                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase mb-0.5">TIER I</div>
                            <h3 className="font-display text-base sm:text-xl font-black text-white">COMMON</h3>
                            <div className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-slate-300 font-bold mt-1 bg-slate-900 border border-slate-700 px-1.5 sm:px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 text-slate-400 fill-current" />
                                <span>MAX LVL 25</span>
                            </div>
                            <ul className="mt-2.5 sm:mt-3 space-y-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                                <li className="text-emerald-400 font-bold">+29% Spd & +45% DMG</li>
                                <li>+60 HP Hull</li>
                                <li>+36 SHD Barrier</li>
                            </ul>
                        </div>

                        {/* RARE: LVL 50 */}
                        <div 
                            onClick={() => { setSimulatorRarity('rare'); setSimulatorLevel(50); }}
                            className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border transition-all cursor-pointer select-none relative overflow-hidden ${
                                simulatorRarity === 'rare' 
                                    ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                            <div className="text-[9px] sm:text-[10px] font-mono text-blue-400 uppercase mb-0.5">TIER II</div>
                            <h3 className="font-display text-base sm:text-xl font-black text-blue-400">RARE</h3>
                            <div className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-blue-300 font-bold mt-1 bg-blue-950 border border-blue-500/50 px-1.5 sm:px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 text-blue-400 fill-current" />
                                <span>MAX LVL 50</span>
                            </div>
                            <ul className="mt-2.5 sm:mt-3 space-y-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                                <li className="text-emerald-400 font-bold">+59% Spd & +88% DMG</li>
                                <li>+122 HP Hull</li>
                                <li>+73 SHD Barrier</li>
                            </ul>
                        </div>

                        {/* EPIC: LVL 75 */}
                        <div 
                            onClick={() => { setSimulatorRarity('epic'); setSimulatorLevel(75); }}
                            className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border transition-all cursor-pointer select-none relative overflow-hidden ${
                                simulatorRarity === 'epic' 
                                    ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                            <div className="text-[9px] sm:text-[10px] font-mono text-purple-400 uppercase mb-0.5">TIER III</div>
                            <h3 className="font-display text-base sm:text-xl font-black text-purple-400">EPIC</h3>
                            <div className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-purple-300 font-bold mt-1 bg-purple-950 border border-purple-500/50 px-1.5 sm:px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 text-purple-400 fill-current" />
                                <span>MAX LVL 75</span>
                            </div>
                            <ul className="mt-2.5 sm:mt-3 space-y-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                                <li className="text-emerald-400 font-bold">+89% Spd & +133% DMG</li>
                                <li>+185 HP Hull</li>
                                <li>+111 SHD Barrier</li>
                            </ul>
                        </div>

                        {/* LEGENDARY: LVL 100 */}
                        <div 
                            onClick={() => { setSimulatorRarity('legendary'); setSimulatorLevel(100); }}
                            className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border transition-all cursor-pointer select-none relative overflow-hidden ${
                                simulatorRarity === 'legendary' 
                                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.4)]' 
                                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                            <div className="text-[9px] sm:text-[10px] font-mono text-amber-400 uppercase mb-0.5">TIER IV</div>
                            <h3 className="font-display text-base sm:text-xl font-black text-amber-400">LEGENDARY</h3>
                            <div className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-amber-300 font-bold mt-1 bg-amber-950 border border-amber-500/50 px-1.5 sm:px-2 py-0.5 rounded-lg">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>MAX LVL 100</span>
                            </div>
                            <ul className="mt-2.5 sm:mt-3 space-y-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                                <li className="text-emerald-400 font-bold">+119% Spd & +178% DMG</li>
                                <li>+247 HP Hull</li>
                                <li>+148 SHD Barrier</li>
                            </ul>
                        </div>

                        {/* MYTHIC: LVL 1000 (Spans 2 cols on mobile) */}
                        <div 
                            onClick={() => { setSimulatorRarity('mythic'); setSimulatorLevel(1000); }}
                            className={`col-span-2 sm:col-span-1 lg:col-span-1 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border transition-all cursor-pointer select-none relative overflow-hidden ${
                                simulatorRarity === 'mythic' 
                                    ? 'bg-slate-900 border-red-500 ring-2 ring-red-400/60 shadow-[0_0_25px_rgba(239,68,68,0.5)]' 
                                    : 'bg-slate-950/80 border-slate-800/80 hover:border-red-900/60'
                            }`}
                        >
                            <div className="text-[9px] sm:text-[10px] font-mono text-red-400 uppercase mb-0.5">TIER V // INFINITE</div>
                            <h3 className="font-display text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-amber-400">MYTHIC</h3>
                            <div className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-red-300 font-bold mt-1 bg-red-950 border border-red-500/50 px-1.5 sm:px-2 py-0.5 rounded-lg">
                                <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
                                <span>MAX LVL 1000</span>
                            </div>
                            <ul className="mt-2.5 sm:mt-3 space-y-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                                <li className="text-emerald-400 font-bold">+1200% Spd & +1800% DMG</li>
                                <li>+2500 HP Hull</li>
                                <li>+1500 SHD Barrier</li>
                            </ul>
                        </div>

                    </div>

                    {/* Interactive Live Upgrade Simulator Card */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                            
                            {/* Left Controls & Slider */}
                            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                                <div>
                                    <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                                        <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span>INTERACTIVE LEVEL SIMULATOR</span>
                                    </div>
                                    <h3 className="font-display text-xl sm:text-3xl font-black text-white">
                                        SLIDE LEVEL: <span className="text-amber-400">LVL {clampedLevel} / {maxLevelForRarity}</span>
                                    </h3>
                                    <p className="text-xs font-sans text-slate-400 mt-1">
                                        Drag the slider to test how chassis multipliers amplify during combat in the authoritative 30 TPS engine.
                                    </p>
                                </div>

                                {/* Slider Component */}
                                <div className="space-y-2">
                                    <div className="flex justify-between font-mono text-[11px] sm:text-xs text-slate-400">
                                        <span>Level 1 (Stock)</span>
                                        <span className="text-cyan-400 font-bold">Level {clampedLevel}</span>
                                        <span>Max {maxLevelForRarity}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max={maxLevelForRarity}
                                        value={clampedLevel}
                                        onChange={(e) => setSimulatorLevel(parseInt(e.target.value))}
                                        className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
                                    />
                                </div>

                                {/* Quick level buttons */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs">
                                    {[1, 25, 50, 75, 100, 250, 500, 1000].filter(l => l <= maxLevelForRarity).map((lvl) => (
                                        <button
                                            key={lvl}
                                            onClick={() => setSimulatorLevel(lvl)}
                                            className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                                clampedLevel === lvl
                                                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                                                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                            }`}
                                        >
                                            Lvl {lvl}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <Link
                                        href="/garage"
                                        className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center space-x-2 transition-all"
                                    >
                                        <ArrowUpCircle className="w-4 h-4" />
                                        <span>UPGRADE IN GARAGE</span>
                                    </Link>
                                    <span className="text-[11px] sm:text-xs font-mono text-slate-500 text-center sm:text-right">Requires Coins & Gems</span>
                                </div>
                            </div>

                            {/* Right Live Stat Gauges */}
                            <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 font-tech">
                                <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span>SIMULATED TELEMETRY</span>
                                    <span className="text-emerald-400 font-bold">LVL {clampedLevel} AMPLIFIED</span>
                                </div>

                                {/* Speed */}
                                <div>
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1.5">
                                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                                            <span>MANEUVER VELOCITY</span>
                                        </span>
                                        <span className="text-amber-400 font-bold text-xs sm:text-sm">{simSpeed}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                        <div className="h-full bg-amber-400 rounded-full transition-all duration-200" style={{ width: `${Math.min(100, simSpeed / 2.2)}%` }}></div>
                                    </div>
                                </div>

                                {/* Damage */}
                                <div>
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1.5">
                                            <Crosshair className="w-3.5 h-3.5 text-red-400" />
                                            <span>KINETIC IMPACT DAMAGE</span>
                                        </span>
                                        <span className="text-red-400 font-bold text-xs sm:text-sm">{simDamage}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                        <div className="h-full bg-red-400 rounded-full transition-all duration-200" style={{ width: `${Math.min(100, simDamage / 2.8)}%` }}></div>
                                    </div>
                                </div>

                                {/* Fire Rate */}
                                <div>
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1.5">
                                            <Flame className="w-3.5 h-3.5 text-pink-400" />
                                            <span>PLASMA FIRE RATE</span>
                                        </span>
                                        <span className="text-pink-400 font-bold text-xs sm:text-sm">{simFireRate}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                        <div className="h-full bg-pink-500 rounded-full transition-all duration-200" style={{ width: `${Math.min(100, simFireRate / 2.5)}%` }}></div>
                                    </div>
                                </div>

                                {/* Armor & Shield 2-Column */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                                    <div className="bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-xl font-mono">
                                        <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center space-x-1">
                                            <Shield className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>HULL ARMOR</span>
                                        </div>
                                        <div className="text-sm sm:text-base font-black text-cyan-300 mt-1">{simHp} HP</div>
                                    </div>

                                    <div className="bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-xl font-mono">
                                        <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center space-x-1">
                                            <Activity className="w-3.5 h-3.5 text-blue-400" />
                                            <span>ENERGY SHIELD</span>
                                        </div>
                                        <div className="text-sm sm:text-base font-black text-blue-300 mt-1">{simShield} SHD</div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* ARMORY CATALOG SECTION */}
            <section id="armory" className="py-12 sm:py-20 bg-[#02050e] border-t border-slate-900">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
                        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-pink-400 uppercase tracking-widest">
                            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>TACTICAL ARMORY // 32 CHASSIS</span>
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-white">
                            SELECT YOUR <span className="text-cyan-400">COMBAT MACHINE</span>
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Click any chassis to preview its live telemetry and rotating turret.
                        </p>
                    </div>

                    {/* 3-Column Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {skins.slice(0, 6).map((skin, idx) => {
                            const isSelected = selectedSkinIndex === idx;

                            return (
                                <div
                                    key={skin.id}
                                    onClick={() => setSelectedSkinIndex(idx)}
                                    className={`rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-200 select-none flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-slate-900 border-cyan-500 shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-cyan-500'
                                            : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase font-bold ${
                                                skin.rarity === 'legendary' ? 'bg-amber-950 border border-amber-500 text-amber-300' :
                                                skin.rarity === 'epic' ? 'bg-purple-950 border border-purple-500 text-purple-300' :
                                                skin.rarity === 'rare' ? 'bg-blue-950 border border-blue-500 text-blue-300' :
                                                'bg-slate-900 border border-slate-700 text-slate-400'
                                            }`}>
                                                {skin.rarity}
                                            </span>

                                            <div 
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full" 
                                                style={{ backgroundColor: skin.color_glow, boxShadow: `0 0 10px ${skin.color_glow}` }}
                                            />
                                        </div>

                                        {/* Tank Mini Preview */}
                                        <div className="h-28 sm:h-32 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center mb-3 sm:mb-4 overflow-hidden relative bg-cyber-dots">
                                            <div 
                                                className="absolute w-20 h-20 rounded-full blur-xl opacity-25"
                                                style={{ backgroundColor: skin.color_glow }}
                                            />
                                            <svg width="100" height="80" viewBox="0 0 120 100" className="relative z-10">
                                                <rect x="20" y="10" width="80" height="18" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                                                <rect x="20" y="72" width="80" height="18" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                                                <rect x="30" y="24" width="60" height="52" rx="6" fill="#1e293b" stroke={skin.color_primary} strokeWidth="3" />
                                                <rect x="40" y="32" width="10" height="36" rx="2" fill={skin.color_secondary} />
                                                <rect x="60" y="45" width="48" height="10" rx="2" fill="#0f172a" stroke={skin.color_primary} strokeWidth="2" />
                                                <rect x="102" y="43" width="8" height="14" rx="2" fill={skin.color_glow} />
                                                <circle cx="60" cy="50" r="16" fill="#0f172a" stroke={skin.color_primary} strokeWidth="3" />
                                                <circle cx="60" cy="50" r="6" fill={skin.color_glow} />
                                            </svg>
                                        </div>

                                        <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1">{skin.name}</h3>
                                        <p className="text-[11px] sm:text-xs font-sans text-slate-400 leading-relaxed mb-3 sm:mb-4 line-clamp-2">{skin.description}</p>
                                    </div>

                                    <div className="pt-2.5 sm:pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-mono">
                                        <span className="text-amber-400 font-bold">
                                            {skin.price_coins === 0 ? 'STARTER TANK' : `${skin.price_coins} COINS`}
                                        </span>
                                        <span className="text-cyan-400 flex items-center space-x-1 font-tech font-bold">
                                            <span>{isSelected ? 'ACTIVE' : 'SELECT'}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 sm:mt-10 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 font-tech font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>VIEW ALL 32 CHASSIS IN ARMORY SHOP</span>
                        </Link>
                    </div>

                </div>
            </section>

            {/* ENGINE ARCHITECTURE SECTION */}
            <section id="architecture" className="py-12 sm:py-20 bg-[#030712] border-t border-slate-900">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 space-y-2">
                        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest">
                            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>ENGINE ARCHITECTURE</span>
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-white">
                            PRECISION <span className="text-cyan-400">ENGINEERING</span>
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Strict architectural boundary between Laravel meta-game portal and standalone Node.js game engine.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-2.5 sm:space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg text-white">30 TPS Authoritative Loop</h3>
                            <p className="text-xs font-sans text-slate-400 leading-relaxed">
                                Continuous server tick simulation computed every 33.33ms. Clients transmit only raw keystrokes (WASD, mouse aim angle). Coordinates are strictly authoritative, neutralizing speed hacks and teleportation.
                            </p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-2.5 sm:space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-950 border border-pink-500/50 flex items-center justify-center text-pink-400">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg text-white">Autonomous Bot AI</h3>
                            <p className="text-xs font-sans text-slate-400 leading-relaxed">
                                Smart combat bots patrol random vectors and dynamically lock targets within 400px. Using trigonometry atan2(dy, dx) with distance leading calculations, bots engage targets dynamically.
                            </p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-2.5 sm:space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="font-display font-bold text-base sm:text-lg text-white">60+ FPS Interpolation</h3>
                            <p className="text-xs font-sans text-slate-400 leading-relaxed">
                                HTML5 Canvas rendering loop uses linear position and rotational slerp interpolation to bridge 30Hz server state packets into fluid 60+ FPS visual motion without micro-stuttering.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TACTICAL POWER-UPS SECTION (2-Col Mobile Grid) */}
            <section id="powerups" className="py-12 sm:py-20 bg-[#02050e] border-t border-slate-900">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
                        <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-amber-400 uppercase tracking-widest">
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>ARENA DROPS</span>
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-white">
                            TACTICAL <span className="text-amber-400">POWER-UPS</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-6 text-center space-y-2 sm:space-y-3 shadow-lg">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                                <Shield className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            <h4 className="font-display font-bold text-xs sm:text-base text-white">ENERGY SHIELD</h4>
                            <p className="text-[10px] sm:text-xs font-mono text-cyan-300 font-bold">+50 BARRIER</p>
                            <p className="text-[11px] sm:text-xs font-sans text-slate-400 hidden sm:block">Absorbs incoming projectile damage prior to hull damage.</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-6 text-center space-y-2 sm:space-y-3 shadow-lg">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl bg-pink-950 border border-pink-500 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                                <Flame className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            <h4 className="font-display font-bold text-xs sm:text-base text-white">OVERDRIVE</h4>
                            <p className="text-[10px] sm:text-xs font-mono text-pink-300 font-bold">TRIPLE SHOT</p>
                            <p className="text-[11px] sm:text-xs font-sans text-slate-400 hidden sm:block">Fires 3 spread plasma rounds simultaneously at double fire-rate.</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-6 text-center space-y-2 sm:space-y-3 shadow-lg">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                                <Zap className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            <h4 className="font-display font-bold text-xs sm:text-base text-white">SPEED BOOST</h4>
                            <p className="text-[10px] sm:text-xs font-mono text-amber-300 font-bold">+45% VELOCITY</p>
                            <p className="text-[11px] sm:text-xs font-sans text-slate-400 hidden sm:block">Supercharges chassis treads for high-speed flanking.</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-6 text-center space-y-2 sm:space-y-3 shadow-lg">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                <Crosshair className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            <h4 className="font-display font-bold text-xs sm:text-base text-white">NANO REPAIR</h4>
                            <p className="text-[10px] sm:text-xs font-mono text-emerald-300 font-bold">+40 HP RECOVERY</p>
                            <p className="text-[11px] sm:text-xs font-sans text-slate-400 hidden sm:block">Instantly patches hull breaches and restores durability.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION BANNER */}
            <section className="py-12 sm:py-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
                <div className="w-full max-w-4xl mx-auto px-4 text-center space-y-4 sm:space-y-6">
                    <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider text-white">
                        THE ARENA AWAITS YOUR COMMAND
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto">
                        Join hundreds of matches daily. Master physics-driven recoil, outsmart bot algorithms, and collect the most prestigious tank hulls.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/play"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            <span>LAUNCH ARENA BATTLE</span>
                        </Link>
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-slate-700 transition-all text-center"
                        >
                            ENLIST CADET ACCOUNT
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-900 bg-slate-950 py-6 sm:py-8 text-xs font-mono text-slate-500">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center space-x-2 justify-center sm:justify-start">
                        <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-slate-300 font-bold">BLITZGRID // TACTICAL TANK ARENA</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-tech text-xs">
                        <Link href="/terms" className="hover:text-cyan-400 transition-colors">TERMS</Link>
                        <Link href="/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY</Link>
                        <Link href="/shop" className="hover:text-cyan-400 transition-colors">SHOP</Link>
                        <Link href="/garage" className="hover:text-cyan-400 transition-colors">GARAGE</Link>
                        <Link href="/leaderboard" className="hover:text-cyan-400 transition-colors">RANKS</Link>
                        <Link href="/login" className="hover:text-cyan-400 transition-colors">LOGIN</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
