import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Crosshair, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import Footer from '@/Components/Footer';

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans bg-cyber-grid">
            <Head title="Terms & Conditions // BLITZGRID" />

            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 shadow-[0_0_20px_rgba(0,240,255,0.7)]"></div>

            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-md">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <Crosshair className="w-6 h-6 text-cyan-400" />
                            </div>
                        </div>
                        <span className="font-display font-black text-2xl tracking-wider text-white">
                            BLITZ<span className="text-pink-500">GRID</span>
                        </span>
                    </Link>

                    <Link
                        href="/register"
                        className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 text-xs font-mono font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK TO REGISTRATION</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 backdrop-blur-xl">
                    
                    <div className="space-y-2 border-b border-slate-800 pb-6">
                        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                            <FileText className="w-4 h-4" />
                            <span>LEGAL DIRECTIVE // PROTOCOL 2026.1</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
                            TERMS & CONDITIONS
                        </h1>
                        <p className="text-xs font-mono text-slate-400">
                            Effective Date: September 14, 2026 | Last Updated: 2026-09-14
                        </p>
                    </div>

                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-white text-cyan-400">
                                1. Acceptance of Terms
                            </h2>
                            <p>
                                By creating an account, accessing the BlitzGrid tactical gaming platform, or participating in the real-time multiplayer arena, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-white text-cyan-400">
                                2. Eligibility & Account Security
                            </h2>
                            <p>
                                You must be at least 16 years of age or the age of majority in your jurisdiction to create an account. You agree to provide accurate and complete personal details (including valid address, phone number, and date of birth) to enable anti-fraud verification and payment processing.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-white text-cyan-400">
                                3. Prohibited Conduct & Fair Play
                            </h2>
                            <p>
                                BlitzGrid uses a 30 TPS server-authoritative physics simulation. Any attempt to modify client packets, reverse-engineer server sockets, exploit latency manipulation, or deploy unauthorized bot automation is strictly prohibited and results in immediate permanent ban.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-white text-cyan-400">
                                4. Virtual Currencies & Purchases
                            </h2>
                            <p>
                                Cyber Coins and Quantum Gems are virtual utility tokens used solely for in-game cosmetic customization (tank hulls, turrets, and bullet trails). Virtual items hold no real-world monetary value and cannot be transferred or exchanged outside the platform.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-white text-cyan-400">
                                5. Termination of Service
                            </h2>
                            <p>
                                We reserve the right to suspend or terminate accounts that violate our security policies or fair-play directives without prior notice.
                            </p>
                        </section>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
                        <span>BLITZGRID COMPLIANCE DIVISION</span>
                        <Link href="/privacy" className="text-cyan-400 hover:underline">VIEW PRIVACY POLICY</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
