import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Crosshair, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans bg-cyber-grid">
            <Head title="Privacy Policy // BLITZGRID" />

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
                            <Lock className="w-4 h-4" />
                            <span>DATA PROTECTION & PRIVACY POLICY</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
                            PRIVACY POLICY
                        </h1>
                        <p className="text-xs font-mono text-slate-400">
                            Effective Date: September 14, 2026 | Last Updated: 2026-09-14
                        </p>
                    </div>

                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-cyan-400">
                                1. Information We Collect
                            </h2>
                            <p>
                                When registering an account or initiating payments on BlitzGrid, we collect required personal details including your full name, email address, phone number, date of birth, and billing address (street, city, country, postal code) to comply with international anti-money laundering (AML) and payment gateway standards.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-cyan-400">
                                2. How We Use Your Data
                            </h2>
                            <ul className="list-disc pl-5 space-y-1 text-slate-400 font-mono text-xs">
                                <li>Authenticate match tokens and session states with the real-time game server.</li>
                                <li>Process secure transactions and inventory acquisitions through verified gateways.</li>
                                <li>Maintain global leaderboard integrity and prevent fraudulent accounts.</li>
                                <li>Provide account recovery and critical security alerts.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-cyan-400">
                                3. Data Protection & Encryption
                            </h2>
                            <p>
                                All sensitive data, authentication tokens, and passwords are encrypted using state-of-the-art bcrypt hashing and SHA-256 HMAC cryptographic signatures. We do not sell or monetize personal player telemetry.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-cyan-400">
                                4. Your Rights
                            </h2>
                            <p>
                                You have the right to request access to your personal data, rectify inaccuracies, or request account and data deletion at any time by contacting our compliance officers.
                            </p>
                        </section>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
                        <span>GDPR & CCPA COMPLIANT PLATFORM</span>
                        <Link href="/terms" className="text-cyan-400 hover:underline">VIEW TERMS & CONDITIONS</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
