import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Coins, Gem, ArrowRight } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Topup() {
    return (
        <AuthenticatedLayout title="Treasury Top-Up">
            <Head title="Treasury Top-Up // BLITZGRID" />
            <div className="max-w-2xl mx-auto my-8 sm:my-16 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10 space-y-6">
                <div className="flex gap-3 text-amber-400"><Coins size={28} /><Gem size={28} className="text-pink-400" /></div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Purchases are currently unavailable</h1>
                <p className="text-slate-400 leading-relaxed">You can still earn Cyber Coins and Quantum Gems by playing matches. Your existing balance and items remain available in the garage and shop.</p>
                <Link href="/play" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-400 text-slate-950 font-bold px-5 py-3">Play a match<ArrowRight size={16} /></Link>
            </div>
        </AuthenticatedLayout>
    );
}
