import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Shield, 
    Crosshair, 
    ShoppingBag, 
    Trophy, 
    Layers, 
    LogOut, 
    Coins, 
    Gem, 
    Play, 
    Menu, 
    X, 
    Zap,
    Sparkles
} from 'lucide-react';

export default function AuthenticatedLayout({ children, title = 'Command Deck' }) {
    const { auth, flash } = usePage().props;
    const { url } = usePage();
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const navLinks = [
        { href: '/dashboard', label: 'COMMAND', icon: Shield, match: '/dashboard' },
        { href: '/garage', label: 'GARAGE', icon: Layers, match: '/garage' },
        { href: '/shop', label: 'ARMORY', icon: ShoppingBag, match: '/shop' },
        { href: '/topup', label: 'TOP UP', icon: Zap, match: '/topup', isSpecial: true },
        { href: '/leaderboard', label: 'RANKS', icon: Trophy, match: '/leaderboard' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black bg-cyber-grid">
            {/* Top Glowing Ambient Border */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-500 shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        
                        {/* Left Group: Logo & Desktop Navigation */}
                        <div className="flex items-center space-x-4 lg:space-x-8 shrink-0">
                            {/* Logo / Brand */}
                            <Link href="/dashboard" className="flex items-center space-x-2.5 group shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all shrink-0">
                                    <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                                        <Crosshair className="w-6 h-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
                                    </div>
                                </div>
                                <div className="flex flex-col shrink-0">
                                    <span className="font-display font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400">
                                        BLITZ<span className="text-pink-500">GRID</span>
                                    </span>
                                    <span className="text-[9px] tracking-widest text-cyan-400/80 font-mono -mt-1 uppercase">
                                        v2.4 Tactical Engine
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav Links */}
                            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
                                {navLinks.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = url.startsWith(item.match);

                                    if (item.isSpecial) {
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-bold tracking-wider font-tech flex items-center space-x-1.5 whitespace-nowrap transition-all shrink-0 ${
                                                    isActive
                                                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                                        : 'text-amber-400 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                                                }`}
                                            >
                                                <Zap className="w-3.5 h-3.5 fill-current" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold tracking-wider font-tech flex items-center space-x-1.5 whitespace-nowrap transition-all shrink-0 ${
                                                isActive
                                                    ? 'bg-slate-900 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                                                    : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-900/80 border border-transparent'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right Group: Player Currency & Launch Battle CTA */}
                        <div className="hidden sm:flex items-center space-x-3 lg:space-x-4 shrink-0">
                            {user && (
                                <Link 
                                    href="/topup"
                                    title="Click to recharge Cyber Coins or Quantum Gems" 
                                    className="flex items-center space-x-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-full px-3.5 py-1.5 text-xs lg:text-sm font-mono shadow-inner transition-all group cursor-pointer shrink-0 whitespace-nowrap"
                                >
                                    <div className="flex items-center space-x-1.5 text-amber-400">
                                        <Coins className="w-4 h-4 fill-amber-400/20" />
                                        <span className="font-bold">{user.coins?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="w-px h-3.5 bg-slate-700"></div>
                                    <div className="flex items-center space-x-1.5 text-pink-400">
                                        <Gem className="w-4 h-4 fill-pink-400/20" />
                                        <span className="font-bold">{user.gems?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center text-[10px] font-bold leading-none group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                                        +
                                    </div>
                                </Link>
                            )}

                            {/* Launch Battle CTA */}
                            <Link 
                                href="/play" 
                                className="relative group overflow-hidden rounded-xl p-px font-display text-xs lg:text-sm font-black tracking-wider uppercase transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 whitespace-nowrap"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 animate-pulse"></div>
                                <div className="relative px-4 py-2 bg-slate-950 rounded-[11px] flex items-center space-x-2 text-cyan-400 group-hover:text-white transition-colors">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>DEPLOY TANK</span>
                                </div>
                            </Link>

                            {/* User Menu / Logout */}
                            {user ? (
                                <button 
                                    onClick={handleLogout}
                                    title="Disconnect Commander Session"
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors border border-transparent hover:border-red-900/40 shrink-0"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="text-xs font-mono font-bold text-cyan-400 hover:underline shrink-0"
                                >
                                    LOGIN
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Trigger */}
                        <div className="flex md:hidden items-center space-x-2 shrink-0">
                            <Link 
                                href="/play" 
                                className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-display font-bold text-xs rounded-xl uppercase flex items-center space-x-1 whitespace-nowrap"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>PLAY</span>
                            </Link>
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-2 backdrop-blur-md">
                        {user && (
                            <Link href="/topup" className="flex items-center justify-between py-2 border-b border-slate-800 font-mono text-sm hover:bg-slate-900 px-2 rounded-xl">
                                <span className="text-slate-400">{user.username || user.name}</span>
                                <div className="flex items-center space-x-3">
                                    <span className="text-amber-400 flex items-center space-x-1"><Coins className="w-3.5 h-3.5" /> <span>{user.coins}</span></span>
                                    <span className="text-pink-400 flex items-center space-x-1"><Gem className="w-3.5 h-3.5" /> <span>{user.gems}</span></span>
                                    <span className="text-amber-400 text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">+ TOP UP</span>
                                </div>
                            </Link>
                        )}
                        <Link href="/dashboard" className="block px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 font-tech">COMMAND DECK</Link>
                        <Link href="/garage" className="block px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 font-tech">GARAGE LOADOUT</Link>
                        <Link href="/shop" className="block px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 font-tech">ARMORY SHOP</Link>
                        <Link href="/topup" className="block px-3 py-2 rounded-xl text-amber-300 hover:bg-slate-900 font-tech flex items-center space-x-1.5">
                            <Zap className="w-4 h-4 text-amber-400 fill-current" />
                            <span>TOP UP CURRENCY</span>
                        </Link>
                        <Link href="/leaderboard" className="block px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-900 font-tech">LEADERBOARD</Link>
                        {user && (
                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-900 rounded-xl font-tech">DISCONNECT SESSION</button>
                        )}
                    </div>
                )}
            </header>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 mt-3 w-full">
                    <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl flex items-center space-x-2 text-sm font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 mt-3 w-full">
                    <div className="bg-red-950/80 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-xl flex items-center space-x-2 text-sm font-mono shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Main Content Viewport */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs font-mono text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>BLITZGRID ARCHITECTURE // 30 TPS Node.js Authoritative + Laravel 13 Inertia</div>
                    <div className="text-cyan-500/70">RADAR STATUS: ACTIVE // TICK: 30HZ</div>
                </div>
            </footer>
        </div>
    );
}
