import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import CompanyDetails from '@/Components/CompanyDetails';

const navigation = [
    ['/play', 'Combat arena'],
    ['/garage', 'Chassis garage'],
    ['/shop', 'Armory shop'],
    ['/topup', 'Treasury top-up'],
    ['/leaderboard', 'Leaderboard'],
];
const legal = [
    ['/terms', 'Terms & Conditions'],
    ['/privacy', 'Privacy & Cookies'],
    ['/refund', 'Refunds & Cancellation'],
    ['/terms#anti-cheat', 'Fair play & anti-cheat'],
    ['/terms#intellectual-property', 'Intellectual property'],
];

function FooterLinks({ title, links }) {
    return <nav aria-label={title} className="min-w-0"><h2 className="font-mono text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">{title}</h2><ul>{links.map(([href, label]) => <li key={href}><Link href={href} className="inline-flex items-center gap-2 min-h-11 py-2 text-sm text-slate-400 hover:text-white transition-colors"><span>{label}</span><ArrowUpRight size={12} className="shrink-0 text-slate-600" aria-hidden="true" /></Link></li>)}</ul></nav>;
}

export default function Footer() {
    const { company = {} } = usePage().props;
    const hasCompanyDetails = Object.values(company).some(Boolean);

    return (
        <footer className="border-t border-slate-800 bg-[#02050e] text-slate-400 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6">
                <div className={`grid grid-cols-2 gap-x-5 gap-y-9 pb-9 ${hasCompanyDetails ? 'lg:grid-cols-[1.2fr_1fr_1.1fr_1.2fr]' : 'lg:grid-cols-[1.5fr_1fr_1fr]'}`}>
                    <div className="col-span-2 lg:col-span-1 min-w-0 space-y-4">
                        <Link href="/" aria-label="BlitzGrid home" className="inline-flex items-center gap-3">
                            <img src="/favicon.svg" alt="" width="44" height="44" />
                            <span className="font-display font-black text-2xl text-white">BLITZ<span className="text-pink-500">GRID</span></span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">A multiplayer tank arena. Build your loadout, find your rivals and make your mark on the grid.</p>
                        <p className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">Tactical combat / Real-time multiplayer</p>
                    </div>
                    <FooterLinks title="Explore" links={navigation} />
                    <FooterLinks title="Legal" links={legal} />
                    {hasCompanyDetails && <div className="col-span-2 lg:col-span-1 min-w-0 border-t border-slate-800 pt-6 lg:pt-0 lg:border-0"><h2 className="font-mono text-xs font-bold tracking-widest uppercase text-pink-400 mb-4">Company & contact</h2><CompanyDetails /></div>}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 border-t border-slate-800 py-6" aria-label="Payment logos">
                    {[
                        ['visa', 'Visa'],
                        ['mastercard', 'Mastercard'],
                        ['pci-dss', 'PCI DSS'],
                    ].map(([file, label]) => (
                        <img
                            key={file}
                            src={`/images/payments/${file}.png`}
                            alt={label}
                            width="1024"
                            height="566"
                            loading="lazy"
                            decoding="async"
                            className="block h-auto w-20 sm:w-24 shrink-0"
                        />
                    ))}
                </div>
                <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed text-slate-500">
                    <p>&copy; {new Date().getFullYear()} {company.name || 'BlitzGrid'}. All rights reserved.</p>
                    <p>Virtual items have no cash redemption value.</p>
                </div>
            </div>
        </footer>
    );
}
