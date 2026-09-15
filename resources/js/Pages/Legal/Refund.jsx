import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Crosshair, ArrowLeft, RefreshCw, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import Footer from '@/Components/Footer';

export default function Refund() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans bg-cyber-grid">
            <Head title="Refund & Cancellation Policy // BLITZGRID" />

            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(245,158,11,0.7)]"></div>

            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
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
                        href="/"
                        className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 text-xs font-mono font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>RETURN TO ARENA</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8 backdrop-blur-xl">
                    
                    <div className="space-y-2 border-b border-slate-800 pb-6">
                        <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                            <RefreshCw className="w-4 h-4" />
                            <span>BILLING DIRECTIVE // PROTOCOL 2026.4</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
                            REFUND & CANCELLATION POLICY
                        </h1>
                        <p className="text-xs font-mono text-slate-400">
                            Effective Date: September 14, 2026 | Operator: blitzgrid.co.uk
                        </p>
                    </div>

                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-amber-400">
                                1. Digital Goods & Virtual In-Game Currencies
                            </h2>
                            <p>
                                BlitzGrid provides access to digital services, including virtual chassis skins, Cyber Coins, Quantum Gems, and cosmetic enhancements. All virtual purchases are delivered instantaneously to your commander treasury upon successful payment authorization.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-amber-400">
                                2. Refund Eligibility
                            </h2>
                            <p>
                                Due to the immediate delivery nature of digital in-game assets, purchases are generally final once the digital items have been credited or consumed. However, refunds may be granted under the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2 font-mono text-xs">
                                <li><strong>Technical Billing Error:</strong> Duplicate charges or incorrect billing amounts resulting from payment gateway synchronization issues.</li>
                                <li><strong>Undelivered In-Game Assets:</strong> If payment was settled but corresponding Cyber Coins or Gems were not added within 24 hours and could not be resolved by support.</li>
                                <li><strong>Fraudulent / Unauthorized Transactions:</strong> Promptly reported transactions made without the cardholder's consent.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-amber-400">
                                3. How to Request a Refund or Dispute
                            </h2>
                            <p>
                                To request a review of your transaction, please email our billing department with your transaction details:
                            </p>
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
                                <div className="text-cyan-400 font-bold">CONTACT BILLING SUPPORT:</div>
                                <div>Email: <a href="mailto:info@blitzgrid.co.uk" className="text-amber-400 underline">info@blitzgrid.co.uk</a></div>
                                <div>Required Details: Pilot Call-Sign, Email, Transaction ID (from receipt), and Reason for Request.</div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="font-display text-lg font-bold text-amber-400">
                                4. Processing Time
                            </h2>
                            <p>
                                Approved refunds are typically processed within 5–10 business days depending on your issuing bank (Visa / Mastercard network processing). Refunds are issued exclusively back to the original payment method used for the initial purchase.
                            </p>
                        </section>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
