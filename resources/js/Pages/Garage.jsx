import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Layers, 
    Shield, 
    Zap, 
    Flame, 
    Check, 
    ShoppingBag, 
    Lock, 
    Play, 
    Coins, 
    Gem, 
    ArrowUpCircle, 
    Sparkles, 
    Crosshair, 
    Activity, 
    Gauge, 
    Compass, 
    Radio, 
    Search,
    ChevronRight,
    Star,
    Volume2,
    VolumeX,
    Sliders,
    ArrowRightLeft,
    Eye,
    Target,
    RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Garage({ inventory = [], equippedSkinId, user }) {
    const [selectedSkinId, setSelectedSkinId] = useState(equippedSkinId || inventory[0]?.id);
    const [filterClass, setFilterClass] = useState('all');
    const [filterRarity, setFilterRarity] = useState('all');
    const [onlyOwned, setOnlyOwned] = useState(false);
    const [sortBy, setSortBy] = useState('level'); // 'level' | 'rarity' | 'speed' | 'damage' | 'hp'
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('tuning'); // 'tuning' | 'specs' | 'compare'
    const [upgrading, setUpgrading] = useState(false);
    
    // Interactive stage states
    const [mouseTurretAngle, setMouseTurretAngle] = useState(0);
    const [testLaserLasers, setTestLaserLasers] = useState([]);
    const [recoil, setRecoil] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const stageRef = useRef(null);

    const selectedSkin = inventory.find((s) => s.id === selectedSkinId) || inventory[0];
    const equippedSkin = inventory.find((s) => s.id === equippedSkinId) || inventory[0];

    // Web Audio synthesizer for laser sound effect
    const playLaserSound = () => {
        if (!soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            // Audio context not allowed or supported
        }
    };

    // Track mouse on preview stage
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!stageRef.current) return;
            const rect = stageRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            setMouseTurretAngle(angle);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Interactive cannon test firing
    const fireTestCannon = () => {
        setRecoil(true);
        setTimeout(() => setRecoil(false), 120);
        playLaserSound();

        const newLaser = {
            id: Date.now() + Math.random(),
            angle: mouseTurretAngle,
            color: selectedSkin.bullet_color || '#00f0ff',
        };

        setTestLaserLasers((prev) => [...prev.slice(-8), newLaser]);
    };

    // Filter & Sort Inventory
    const filteredInventory = inventory.filter((skin) => {
        if (filterClass !== 'all' && skin.type !== filterClass) return false;
        if (filterRarity !== 'all' && skin.rarity !== filterRarity) return false;
        if (onlyOwned && !skin.is_owned) return false;
        if (searchQuery.trim() && !skin.name.toLowerCase().includes(searchQuery.toLowerCase()) && !skin.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'level') return (b.level || 0) - (a.level || 0);
        if (sortBy === 'speed') return (b.stats?.speed || 0) - (a.stats?.speed || 0);
        if (sortBy === 'damage') return (b.stats?.damage || 0) - (a.stats?.damage || 0);
        if (sortBy === 'hp') return (b.stats?.max_hp || 0) - (a.stats?.max_hp || 0);
        return 0;
    });

    const handleEquip = (skin) => {
        router.post(`/garage/equip/${skin.id}`, {}, {
            preserveScroll: true,
        });
    };

    const handleUpgrade = (skin, steps = 1) => {
        if (upgrading || skin.level >= skin.max_level) return;
        setUpgrading(true);

        router.post(`/garage/upgrade/${skin.id}`, { steps }, {
            preserveScroll: true,
            onSuccess: () => {
                setUpgrading(false);
                confetti({
                    particleCount: steps > 1 ? 120 : 75,
                    spread: 85,
                    origin: { y: 0.6 },
                    colors: [skin.color_primary, skin.color_secondary, skin.color_glow, '#ffd700'],
                });
            },
            onError: () => {
                setUpgrading(false);
            },
        });
    };

    const renderTankSvg = (skin, size = 180, turretAngle = 0, isFiring = false) => {
        const primary = skin.color_primary || '#00f0ff';
        const secondary = skin.color_secondary || '#ff007f';
        const glow = skin.color_glow || '#00f0ff';

        return (
            <svg 
                width={size} 
                height={size * 0.85} 
                viewBox="0 0 160 136" 
                className={`relative z-10 drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-100 ${
                    isFiring ? 'scale-95' : 'scale-100'
                }`}
            >
                {/* Treads */}
                <rect x="18" y="10" width="124" height="24" rx="5" fill="#090d16" stroke="#334155" strokeWidth="2.5" />
                <rect x="18" y="102" width="124" height="24" rx="5" fill="#090d16" stroke="#334155" strokeWidth="2.5" />
                
                {/* Tread Pins */}
                {[32, 58, 84, 110, 130].map((cx, idx) => (
                    <React.Fragment key={idx}>
                        <circle cx={cx} cy="22" r="5" fill="#475569" />
                        <circle cx={cx} cy="114" r="5" fill="#475569" />
                    </React.Fragment>
                ))}

                {/* Main Armor Hull */}
                <rect x="34" y="28" width="92" height="80" rx="10" fill="#111827" stroke={primary} strokeWidth="4" />
                <rect x="46" y="38" width="16" height="60" rx="3" fill={secondary} />
                <rect x="98" y="38" width="12" height="60" rx="3" fill={secondary} />

                {/* Interactive Rotating Turret */}
                <g transform={`rotate(${(turretAngle * 180) / Math.PI}, 80, 68)`}>
                    {skin.type === 'artillery' ? (
                        <>
                            <rect x="80" y="62" width="76" height="12" rx="3" fill="#0f172a" stroke={primary} strokeWidth="3" />
                            <rect x="148" y="58" width="10" height="20" rx="3" fill={glow} />
                            <circle cx="80" cy="68" r="24" fill="#0f172a" stroke={primary} strokeWidth="4" />
                            <circle cx="80" cy="68" r="10" fill={glow} />
                        </>
                    ) : skin.type === 'destroyer' ? (
                        <>
                            <rect x="76" y="56" width="68" height="9" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2.5" />
                            <rect x="76" y="71" width="68" height="9" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2.5" />
                            <rect x="138" y="54" width="8" height="13" rx="2" fill={glow} />
                            <rect x="138" y="69" width="8" height="13" rx="2" fill={glow} />
                            <circle cx="76" cy="68" r="26" fill="#0f172a" stroke={primary} strokeWidth="4" />
                            <circle cx="76" cy="68" r="11" fill={glow} />
                        </>
                    ) : skin.type === 'scout' ? (
                        <>
                            <rect x="80" y="64" width="56" height="8" rx="2" fill="#0f172a" stroke={primary} strokeWidth="2.5" />
                            <rect x="130" y="62" width="8" height="12" rx="2" fill={glow} />
                            <circle cx="80" cy="68" r="20" fill="#0f172a" stroke={primary} strokeWidth="3.5" />
                            <circle cx="80" cy="68" r="8" fill={glow} />
                        </>
                    ) : (
                        <>
                            <rect x="78" y="61" width="64" height="14" rx="3" fill="#0f172a" stroke={primary} strokeWidth="3" />
                            <rect x="134" y="58" width="10" height="20" rx="2" fill={glow} />
                            <circle cx="78" cy="68" r="24" fill="#0f172a" stroke={primary} strokeWidth="4" />
                            <circle cx="78" cy="68" r="10" fill={glow} />
                        </>
                    )}
                </g>
            </svg>
        );
    };

    return (
        <AuthenticatedLayout title="Armory Garage">
            <Head title="Garage Loadout // BLITZGRID" />

            {/* Top Command Banner */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                        <Layers className="w-4 h-4" />
                        <span>TACTICAL WORKSHOP // CHASSIS TUNING TERMINAL</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white">
                        COMMAND <span className="text-pink-500">HANGAR & TUNING</span>
                    </h1>
                </div>

                {/* Treasury and Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 font-mono text-sm shadow-inner">
                        <div className="flex items-center space-x-1.5 text-amber-400">
                            <Coins className="w-4 h-4" />
                            <span className="font-bold">{user?.coins?.toLocaleString() || 0}</span>
                        </div>
                        <div className="w-px h-4 bg-slate-800"></div>
                        <div className="flex items-center space-x-1.5 text-pink-400">
                            <Gem className="w-4 h-4" />
                            <span className="font-bold">{user?.gems?.toLocaleString() || 0}</span>
                        </div>
                        <Link href="/topup" className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black font-tech font-bold transition-all">
                            + TOP UP
                        </Link>
                    </div>

                    <Link
                        href="/shop"
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 font-tech font-bold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>BLACK MARKET ({inventory.length})</span>
                    </Link>

                    <Link
                        href="/play"
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center space-x-1.5 transition-all"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>ENTER BATTLE</span>
                    </Link>
                </div>
            </div>

            {/* Filter Deck & Sorting Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl space-y-3 font-tech">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    
                    {/* Class Archetype Tabs */}
                    <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-1">
                        {[
                            { id: 'all', label: 'ALL CLASSES', count: inventory.length },
                            { id: 'assault', label: 'ASSAULT', count: inventory.filter(s => s.type === 'assault').length },
                            { id: 'heavy', label: 'HEAVY TITAN', count: inventory.filter(s => s.type === 'heavy').length },
                            { id: 'scout', label: 'SCOUT', count: inventory.filter(s => s.type === 'scout').length },
                            { id: 'artillery', label: 'ARTILLERY', count: inventory.filter(s => s.type === 'artillery').length },
                            { id: 'destroyer', label: 'DESTROYER', count: inventory.filter(s => s.type === 'destroyer').length },
                            { id: 'chrono', label: 'CHRONO/VOID', count: inventory.filter(s => s.type === 'chrono').length },
                        ].map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setFilterClass(c.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                                    filterClass === c.id
                                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                            >
                                <span>{c.label}</span>
                                <span className="opacity-70 text-[10px]">({c.count})</span>
                            </button>
                        ))}
                    </div>

                    {/* Search & Only Owned Checkbox */}
                    <div className="flex items-center space-x-3 w-full lg:w-auto">
                        <button
                            onClick={() => setOnlyOwned(!onlyOwned)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border whitespace-nowrap cursor-pointer ${
                                onlyOwned 
                                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            {onlyOwned ? '✓ OWNED ONLY' : 'SHOW ALL'}
                        </button>

                        <div className="relative w-full lg:w-56">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tanks..."
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Sub-Bar: Rarity Filter & Sort Dropdown */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">RARITY:</span>
                        {['all', 'common', 'rare', 'epic', 'legendary', 'mythic'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilterRarity(r)}
                                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
                                    filterRarity === r
                                        ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className="text-slate-500">SORT BY:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-cyan-400 font-bold rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                        >
                            <option value="level">Level (High to Low)</option>
                            <option value="speed">Speed Velocity</option>
                            <option value="damage">Kinetic Damage</option>
                            <option value="hp">Hull Armor (HP)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Garage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: Inventory Chassis Deck */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>ROSTER ({filteredInventory.length} FOUND / {inventory.filter(s => s.is_owned).length} UNLOCKED)</span>
                        <span className="text-cyan-400">CLICK TO INSPECT & TUNE</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[820px] overflow-y-auto pr-1">
                        {filteredInventory.map((skin) => {
                            const isSelected = skin.id === selectedSkin?.id;
                            const isEquipped = skin.is_equipped;

                            return (
                                <div
                                    key={skin.id}
                                    onClick={() => setSelectedSkinId(skin.id)}
                                    className={`relative rounded-2xl p-3.5 transition-all cursor-pointer border select-none group ${
                                        isSelected
                                            ? 'bg-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(0,240,255,0.3)] ring-1 ring-cyan-500'
                                            : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                                    }`}
                                >
                                    {/* Top Row: Rarity & Status */}
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center space-x-1.5">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                                                skin.rarity === 'mythic' ? 'bg-red-950 border border-red-500 text-red-300' :
                                                skin.rarity === 'legendary' ? 'bg-amber-950 border border-amber-500/50 text-amber-300' :
                                                skin.rarity === 'epic' ? 'bg-purple-950 border border-purple-500/50 text-purple-300' :
                                                skin.rarity === 'rare' ? 'bg-blue-950 border border-blue-500/50 text-blue-300' :
                                                'bg-slate-900 border border-slate-700 text-slate-400'
                                            }`}>
                                                {skin.rarity}
                                            </span>

                                            <span className="text-[9px] font-mono text-slate-500 uppercase">
                                                {skin.type}
                                            </span>
                                        </div>

                                        {isEquipped ? (
                                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-[9px] font-mono font-bold text-emerald-300 shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                                                <Check className="w-2.5 h-2.5" />
                                                <span>EQUIPPED</span>
                                            </span>
                                        ) : skin.is_owned ? (
                                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[9px] font-mono font-bold text-cyan-300">
                                                <Star className="w-2.5 h-2.5 fill-current" />
                                                <span>LVL {skin.level}/{skin.max_level}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-500">
                                                <Lock className="w-2.5 h-2.5" />
                                                <span>LOCKED</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Skin Mini Visual & Details */}
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div 
                                            className="w-12 h-12 rounded-xl border flex items-center justify-center bg-slate-950 shadow-inner shrink-0"
                                            style={{ borderColor: skin.color_primary }}
                                        >
                                            <div 
                                                className="w-5 h-5 rounded-md shadow-md"
                                                style={{ 
                                                    backgroundColor: skin.color_primary,
                                                    boxShadow: `0 0 10px ${skin.color_glow}`
                                                }}
                                            />
                                        </div>

                                        <div className="overflow-hidden flex-1">
                                            <h3 className="font-display font-bold text-white text-sm truncate">
                                                {skin.name}
                                            </h3>
                                            <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-2">
                                                <span className="text-amber-400 font-bold">{Math.round((skin.stats?.speed || 1.0) * 100)}% SPD</span>
                                                <span>•</span>
                                                <span className="text-red-400 font-bold">{Math.round((skin.stats?.damage || 1.0) * 100)}% DMG</span>
                                                <span>•</span>
                                                <span className="text-cyan-400 font-bold">{skin.stats?.max_hp || 100} HP</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Quick Action */}
                                    {skin.is_owned && !skin.is_equipped && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEquip(skin); }}
                                            className="w-full py-1 text-[10px] font-tech font-bold uppercase rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-black text-slate-400 transition-all border border-slate-800"
                                        >
                                            Quick Equip
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: High-Tech Tuning & Visualizer Hangar */}
                <div className="lg:col-span-6 bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 sticky top-24">
                    
                    {/* Header with Level & Controls */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                                HANGAR SPECIFICATION
                            </span>
                            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                                {selectedSkin.name}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Sound Toggle */}
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
                                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
                            </button>

                            {selectedSkin.is_owned ? (
                                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-pink-950 border border-cyan-500/50 text-cyan-300 font-display font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                                    <Sparkles className="w-4 h-4 text-pink-400" />
                                    <span>LVL {selectedSkin.level} / {selectedSkin.max_level}</span>
                                </div>
                            ) : (
                                <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-500">
                                    AVAILABLE IN SHOP
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Interactive 3D/SVG Hologram Stage with Live Cannon Test */}
                    <div 
                        ref={stageRef}
                        onClick={fireTestCannon}
                        className="relative h-64 sm:h-72 rounded-3xl bg-[#01040a] border border-slate-800 flex items-center justify-center overflow-hidden bg-cyber-dots cursor-crosshair group shadow-inner"
                    >
                        {/* Ambient Glow */}
                        <div 
                            className="absolute w-52 h-52 rounded-full blur-3xl opacity-35 animate-pulse"
                            style={{ backgroundColor: selectedSkin.color_glow }}
                        />

                        {/* Rotating Radar Grid Pedestal */}
                        <div className="absolute inset-x-8 bottom-4 h-16 border-t border-cyan-500/20 rounded-t-[50%] bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none"></div>

                        {/* Tank Render with Mouse Turret Aiming */}
                        {renderTankSvg(selectedSkin, 200, mouseTurretAngle, recoil)}

                        {/* Animated Laser Bolts fired during test */}
                        {testLaserLasers.map((laser) => (
                            <div
                                key={laser.id}
                                className="absolute w-12 h-2 rounded-full pointer-events-none animate-ping"
                                style={{
                                    backgroundColor: laser.color,
                                    boxShadow: `0 0 15px ${laser.color}`,
                                    transform: `rotate(${(laser.angle * 180) / Math.PI}deg) translate(80px, 0)`,
                                }}
                            />
                        ))}

                        {/* Test Fire Prompt */}
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] font-mono text-cyan-400 flex items-center space-x-1.5">
                            <Target className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            <span>CLICK TO TEST-FIRE CANNON</span>
                        </div>

                        {/* Perk Badge */}
                        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-400">CHASSIS PERK:</span>
                            <span className="text-amber-400 font-bold">{selectedSkin.stats?.special_perk || 'Standard Overdrive'}</span>
                        </div>
                    </div>

                    {/* Mode Navigation Tabs */}
                    <div className="flex border-b border-slate-800 space-x-4 font-tech text-xs">
                        <button
                            onClick={() => setActiveTab('tuning')}
                            className={`pb-2 font-bold tracking-wider transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                                activeTab === 'tuning'
                                    ? 'border-cyan-400 text-cyan-400'
                                    : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                        >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>TUNING & UPGRADES</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`pb-2 font-bold tracking-wider transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                                activeTab === 'specs'
                                    ? 'border-cyan-400 text-cyan-400'
                                    : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                        >
                            <Activity className="w-3.5 h-3.5" />
                            <span>TACTICAL SPECS</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('compare')}
                            className={`pb-2 font-bold tracking-wider transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                                activeTab === 'compare'
                                    ? 'border-cyan-400 text-cyan-400'
                                    : 'border-transparent text-slate-400 hover:text-white'
                            }`}
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>COMPARE VS EQUIPPED</span>
                        </button>
                    </div>

                    {/* TAB 1: TUNING & MULTI-LEVEL UPGRADE TERMINAL */}
                    {activeTab === 'tuning' && (
                        <div className="space-y-4">
                            {/* Level Progress */}
                            {selectedSkin.is_owned && (
                                <div className="space-y-1.5 font-mono">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>UPGRADE LEVEL PROGRESS</span>
                                        <span className="text-cyan-400 font-bold">{selectedSkin.level} / {selectedSkin.max_level} ({selectedSkin.rarity.toUpperCase()})</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 border border-slate-800">
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 rounded-full transition-all duration-500"
                                            style={{ width: `${(selectedSkin.level / selectedSkin.max_level) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Combat Stat Gauges */}
                            <div className="grid grid-cols-2 gap-2.5 font-tech">
                                {/* Speed */}
                                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1">
                                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                                            <span>SPEED</span>
                                        </span>
                                        <span className="text-amber-400 font-bold">{Math.round((selectedSkin.stats?.speed || 1.0) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, ((selectedSkin.stats?.speed || 1.0) / 2.2) * 100)}%` }} />
                                    </div>
                                </div>

                                {/* Damage */}
                                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1">
                                            <Crosshair className="w-3.5 h-3.5 text-red-400" />
                                            <span>DAMAGE</span>
                                        </span>
                                        <span className="text-red-400 font-bold">{Math.round((selectedSkin.stats?.damage || 1.0) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(100, ((selectedSkin.stats?.damage || 1.0) / 2.8) * 100)}%` }} />
                                    </div>
                                </div>

                                {/* Fire Rate */}
                                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1">
                                            <Flame className="w-3.5 h-3.5 text-pink-400" />
                                            <span>FIRE RATE</span>
                                        </span>
                                        <span className="text-pink-400 font-bold">{Math.round((selectedSkin.stats?.fire_rate || 1.0) * 100)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, ((selectedSkin.stats?.fire_rate || 1.0) / 2.5) * 100)}%` }} />
                                    </div>
                                </div>

                                {/* Armor HP */}
                                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                                    <div className="flex justify-between text-xs font-mono mb-1">
                                        <span className="text-slate-400 flex items-center space-x-1">
                                            <Shield className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>ARMOR</span>
                                        </span>
                                        <span className="text-cyan-400 font-bold">{selectedSkin.stats?.max_hp || 100} HP</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, ((selectedSkin.stats?.max_hp || 100) / 350) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* UPGRADE BUTTONS */}
                            {selectedSkin.is_owned ? (
                                selectedSkin.level < selectedSkin.max_level ? (
                                    <div className="space-y-2.5 pt-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* +1 Level Button */}
                                            <button
                                                onClick={() => handleUpgrade(selectedSkin, 1)}
                                                disabled={upgrading || user?.coins < (selectedSkin.upgrade_cost?.coins || 0) || user?.gems < (selectedSkin.upgrade_cost?.gems || 0)}
                                                className="py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-display font-black text-xs uppercase rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                +1 LEVEL
                                            </button>

                                            {/* +5 Levels Button */}
                                            <button
                                                onClick={() => handleUpgrade(selectedSkin, 5)}
                                                disabled={upgrading || selectedSkin.level + 1 > selectedSkin.max_level}
                                                className="py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-display font-black text-xs uppercase rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-40"
                                            >
                                                +5 LEVELS
                                            </button>

                                            {/* Max Affordable Button */}
                                            <button
                                                onClick={() => handleUpgrade(selectedSkin, 'max')}
                                                disabled={upgrading || selectedSkin.level >= selectedSkin.max_level}
                                                className="py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-display font-black text-xs uppercase rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-40"
                                            >
                                                MAX AFFORDABLE
                                            </button>
                                        </div>

                                        {/* Cost Info */}
                                        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs">
                                            <span className="text-slate-400">LVL {selectedSkin.level + 1} COST:</span>
                                            <div className="flex items-center space-x-3">
                                                <span className={`flex items-center space-x-1 ${user?.coins >= selectedSkin.upgrade_cost?.coins ? 'text-amber-400' : 'text-red-400 font-bold'}`}>
                                                    <Coins className="w-3.5 h-3.5" />
                                                    <span>{selectedSkin.upgrade_cost?.coins?.toLocaleString()} Coins</span>
                                                </span>
                                                <span className="text-slate-600">•</span>
                                                <span className={`flex items-center space-x-1 ${user?.gems >= selectedSkin.upgrade_cost?.gems ? 'text-pink-400' : 'text-red-400 font-bold'}`}>
                                                    <Gem className="w-3.5 h-3.5" />
                                                    <span>{selectedSkin.upgrade_cost?.gems?.toLocaleString()} Gems</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-3 px-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300 font-mono text-xs text-center font-bold flex items-center justify-center space-x-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <span>MAX LEVEL REACHED ({selectedSkin.max_level}/{selectedSkin.max_level}) // MAXIMUM OVERDRIVE</span>
                                    </div>
                                )
                            ) : null}
                        </div>
                    )}

                    {/* TAB 2: TACTICAL SPECS & LORE */}
                    {activeTab === 'specs' && (
                        <div className="space-y-3 font-tech text-xs">
                            <p className="text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                {selectedSkin.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 font-mono">
                                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                                    <span className="text-slate-500 block text-[10px]">CHASSIS CLASS</span>
                                    <span className="text-white font-bold uppercase">{selectedSkin.type}</span>
                                </div>
                                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                                    <span className="text-slate-500 block text-[10px]">MAX LEVEL CAPACITY</span>
                                    <span className="text-amber-400 font-bold">LEVEL {selectedSkin.max_level}</span>
                                </div>
                                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                                    <span className="text-slate-500 block text-[10px]">KINETIC BULLET COLOR</span>
                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedSkin.bullet_color }} />
                                        <span className="text-white font-bold">{selectedSkin.bullet_color}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                                    <span className="text-slate-500 block text-[10px]">ENERGY SHIELD REGEN</span>
                                    <span className="text-blue-400 font-bold">{selectedSkin.stats?.shield || 50} SHD</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: COMPARISON MATRIX */}
                    {activeTab === 'compare' && (
                        <div className="space-y-3 font-tech text-xs">
                            <div className="grid grid-cols-2 gap-3 text-center font-mono">
                                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-cyan-500/40">
                                    <div className="text-[10px] text-cyan-400 font-bold">SELECTED</div>
                                    <div className="text-white font-bold">{selectedSkin.name} (Lvl {selectedSkin.level})</div>
                                </div>
                                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/40">
                                    <div className="text-[10px] text-emerald-400 font-bold">EQUIPPED</div>
                                    <div className="text-white font-bold">{equippedSkin.name} (Lvl {equippedSkin.level})</div>
                                </div>
                            </div>

                            <div className="space-y-2 font-mono text-xs">
                                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg">
                                    <span className="text-slate-400">SPEED DELTA:</span>
                                    <span className={selectedSkin.stats?.speed >= equippedSkin.stats?.speed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                        {Math.round((selectedSkin.stats?.speed || 1) * 100)}% vs {Math.round((equippedSkin.stats?.speed || 1) * 100)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg">
                                    <span className="text-slate-400">DAMAGE DELTA:</span>
                                    <span className={selectedSkin.stats?.damage >= equippedSkin.stats?.damage ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                        {Math.round((selectedSkin.stats?.damage || 1) * 100)}% vs {Math.round((equippedSkin.stats?.damage || 1) * 100)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg">
                                    <span className="text-slate-400">HULL ARMOR DELTA:</span>
                                    <span className={selectedSkin.stats?.max_hp >= equippedSkin.stats?.max_hp ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                        {selectedSkin.stats?.max_hp} HP vs {equippedSkin.stats?.max_hp} HP
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Equip / Unlock Footer Action */}
                    <div className="pt-2">
                        {selectedSkin.is_owned ? (
                            selectedSkin.is_equipped ? (
                                <div className="w-full py-3.5 bg-emerald-950/80 border border-emerald-500/80 text-emerald-400 font-display font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2">
                                    <Check className="w-4 h-4" />
                                    <span>CURRENTLY EQUIPPED IN COMBAT ARENA</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleEquip(selectedSkin)}
                                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 hover:opacity-95 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>EQUIP TO ACTIVE COMBAT LOADOUT</span>
                                </button>
                            )
                        ) : (
                            <Link
                                href="/shop"
                                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center space-x-2 transition-all"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>UNLOCK IN BLACK MARKET ({selectedSkin.price_coins} COINS)</span>
                            </Link>
                        )}
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
