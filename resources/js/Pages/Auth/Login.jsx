import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Crosshair, Lock, Mail, Shield, UserPlus } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: 'commander@blitzgrid.io',
        password: 'password123',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center p-4 bg-cyber-grid selection:bg-cyan-500 selection:text-black font-sans">
            <Head title="Commander Authorization // BLITZGRID" />

            {/* Glowing Brand Header */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center space-x-3 mb-2 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-[0_0_25px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-all">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Crosshair className="w-7 h-7 text-cyan-400" />
                        </div>
                    </div>
                    <span className="font-display font-black text-3xl sm:text-4xl tracking-wider text-white">
                        BLITZ<span className="text-pink-500">GRID</span>
                    </span>
                </Link>
                <p className="text-xs font-mono text-cyan-400/90 tracking-widest uppercase">
                    MANDATORY COMMANDER AUTHORIZATION
                </p>
            </div>

            {/* Login Box */}
            <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-tech">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]"></div>

                <h2 className="font-display text-2xl font-bold text-white mb-1">
                    COMMANDER LOGIN
                </h2>
                <p className="text-xs font-mono text-slate-400 mb-6">
                    Enter authorized credentials to access combat arena and armory.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">
                            EMAIL OR CALLSIGN
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            <input
                                type="text"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 font-mono transition-colors outline-none"
                                placeholder="commander@blitzgrid.io"
                                required
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-400 font-mono mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1 font-bold">
                            SECURITY PASSPHRASE
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 font-mono transition-colors outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-400 font-mono mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:opacity-95 text-slate-950 font-display font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
                    >
                        <Shield className="w-4 h-4" />
                        <span>AUTHORIZE & COMMENCE</span>
                    </button>
                </form>

                {/* Demo Credentials hint */}
                <div className="mt-6 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 space-y-1">
                    <div className="text-cyan-400 font-bold">Pre-seeded Test Commander:</div>
                    <div>Email: <strong className="text-white">commander@blitzgrid.io</strong></div>
                    <div>Password: <strong className="text-white">password123</strong></div>
                </div>

                {/* Register Link */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
                    Need new commander credentials?{' '}
                    <Link href="/register" className="text-cyan-400 font-bold hover:underline inline-flex items-center space-x-1">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>ENLIST CADET (+600 COINS)</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
