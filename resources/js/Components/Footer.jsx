import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Crosshair, 
    ShieldCheck, 
    Lock, 
    Mail, 
    Layers, 
    Trophy, 
    ShoppingBag, 
    FileText, 
    Activity,
    Server,
    ExternalLink
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-slate-900 bg-[#02050e] text-slate-400 font-sans relative overflow-hidden">
            {/* Top Glowing Ambient Line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/20 via-pink-500/40 via-amber-400/30 to-cyan-500/20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
                    
                    {/* Col 1: Brand & Identity (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link href="/" className="flex items-center space-x-3 group inline-flex">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
                                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                    <Crosshair className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-black text-2xl tracking-wider text-white">
                                    BLITZ<span className="text-pink-500">GRID</span>
                                </span>
                                <span className="text-[9px] tracking-widest text-cyan-400 font-mono -mt-1 uppercase">
                                    30 TPS Tactical Arena
                                </span>
                            </div>
                        </Link>

                        <p className="text-xs text-slate-400 font-sans leading-relaxed pr-4">
                            Next-generation cyberpunk 2D multiplayer combat arena. Powered by a deterministic 30 TPS server engine with trigonometric AI bots, progressive chassis evolution, and real-time multiplayer telemetry.
                        </p>

                        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 bg-slate-950/80 border border-slate-800/80 px-3 py-2 rounded-xl w-fit">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                            <span className="text-emerald-400 font-bold">GRID ONLINE:</span>
                            <span>30 TPS SERVER STABLE</span>
                        </div>
                    </div>

                    {/* Col 2: Tactical Navigation (2 cols) */}
                    <div className="lg:col-span-2 space-y-3 font-tech">
                        <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                            TACTICAL GRID
                        </div>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/play" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-cyan-500">›</span>
                                    <span>Combat Arena</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/garage" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-cyan-500">›</span>
                                    <span>Chassis Garage</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-cyan-500">›</span>
                                    <span>Armory Shop</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/topup" className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 text-amber-300">
                                    <span className="text-amber-400">›</span>
                                    <span>Treasury Top-Up</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-cyan-500">›</span>
                                    <span>Leaderboard Ranks</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Legal Directives & Policies (3 cols) */}
                    <div className="lg:col-span-3 space-y-3 font-tech">
                        <div className="text-xs font-mono font-bold tracking-widest text-pink-400 uppercase">
                            LEGAL DIRECTIVES
                        </div>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/terms" className="hover:text-pink-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-pink-500">›</span>
                                    <span>Terms & Conditions</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-pink-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-pink-500">›</span>
                                    <span>Privacy & Cookies Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" className="hover:text-pink-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-pink-500">›</span>
                                    <span>Refund & Cancellation Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms#anti-cheat" className="hover:text-pink-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-pink-500">›</span>
                                    <span>Fair Play & Anti-Cheat Protocol</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms#intellectual-property" className="hover:text-pink-400 transition-colors flex items-center space-x-1.5">
                                    <span className="text-pink-500">›</span>
                                    <span>Intellectual Property Rights</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Verified Payments & Security (3 cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase font-tech">
                            SECURITY & PAYMENTS
                        </div>
                        
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                            All treasury transactions are encrypted via 256-bit TLS/SSL and processed under global banking standards.
                        </p>

                        {/* Payment & Compliance Logos Deck */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2.5">
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider text-center">
                                VERIFIED PAYMENT PROVIDERS
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                {/* Visa Logo Container */}
                                <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-center shadow-md h-9 w-18 transition-transform hover:scale-105">
                                    <img 
                                        src="/images/payments/visa.png" 
                                        alt="Visa Verified" 
                                        className="h-5 w-auto object-contain"
                                    />
                                </div>

                                {/* Mastercard Logo Container */}
                                <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-center shadow-md h-9 w-18 transition-transform hover:scale-105">
                                    <img 
                                        src="/images/payments/mastercard.png" 
                                        alt="Mastercard SecureCode" 
                                        className="h-6 w-auto object-contain"
                                    />
                                </div>

                                {/* PCI DSS Compliant Badge Container */}
                                <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-center shadow-md h-9 transition-transform hover:scale-105">
                                    <img 
                                        src="/images/payments/pci-dss.png" 
                                        alt="PCI DSS Compliant" 
                                        className="h-6 w-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Direct Contact Support */}
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                            <span>Direct Inquiries: </span>
                            <a href="mailto:info@blitzgrid.co.uk" className="text-cyan-400 hover:underline font-bold">
                                info@blitzgrid.co.uk
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Compliance Notes */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
                    <div className="text-center sm:text-left">
                        <span>&copy; {new Date().getFullYear()} </span>
                        <span className="text-slate-300 font-bold">BLITZGRID // blitzgrid.co.uk</span>
                        <span>. All tactical assets and trademarks reserved.</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
                        <Link href="/terms" className="hover:text-cyan-400 transition-colors">TERMS OF SERVICE</Link>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY POLICY</Link>
                        <span>•</span>
                        <Link href="/refund" className="hover:text-cyan-400 transition-colors">REFUND POLICY</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
