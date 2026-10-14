import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react';
import Footer from '@/Components/Footer';
import CompanyDetails from '@/Components/CompanyDetails';

const policies = [
    { href: '/terms', label: 'Terms & Conditions' },
    { href: '/privacy', label: 'Privacy & Cookies' },
    { href: '/refund', label: 'Refunds & Cancellation' },
];

export default function LegalLayout({ title, summary, path, sections, children }) {
    const { company = {} } = usePage().props;
    const hasCompanyDetails = Object.values(company).some(Boolean);
    const tableOfContents = <ol className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-4">{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} className="flex gap-3 py-2.5 text-sm text-slate-400 hover:text-cyan-400"><span className="text-slate-600 font-mono">{String(index + 1).padStart(2, '0')}</span>{section.title}</a></li>)}</ol>;

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans bg-cyber-grid">
            <Head title={`${title} // BLITZGRID`} />
            <header className="border-b border-slate-800 bg-slate-950/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 flex items-center justify-between gap-3">
                    <Link href="/" aria-label="BlitzGrid home" className="inline-flex items-center gap-2 sm:gap-3 shrink-0">
                        <img src="/favicon.svg" alt="" width="40" height="40" />
                        <span className="font-display font-black text-base sm:text-2xl">BLITZ<span className="text-pink-500">GRID</span></span>
                    </Link>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 min-h-11 px-3 sm:px-4 rounded-xl border border-slate-700 text-xs text-cyan-400 hover:border-cyan-400">
                        <ArrowLeft size={16} aria-hidden="true" /><span>Back to home</span>
                    </Link>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
                <div className="max-w-3xl mb-8 sm:mb-12">
                    <p className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-4"><FileText size={16} aria-hidden="true" /> Legal / Player information</p>
                    <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight break-words">{title}</h1>
                    <p className="mt-4 text-slate-400 leading-relaxed">{summary}</p>
                    <p className="mt-4 text-xs font-mono text-slate-500">Last updated: <time dateTime="2026-10-14">14 October 2026</time></p>
                </div>
                <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-12 items-start">
                    <aside className="lg:sticky lg:top-6 space-y-6 min-w-0">
                        <nav aria-label="Legal policies" className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                            {policies.map(policy => <Link key={policy.href} href={policy.href} aria-current={path === policy.href ? 'page' : undefined} className={`flex items-center justify-between gap-2 px-4 py-4 text-sm border-l-2 ${path === policy.href ? 'border-cyan-400 bg-cyan-400/5 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}>{policy.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
                        </nav>
                        <details className="lg:hidden rounded-xl border border-slate-800 bg-slate-950 px-4">
                            <summary className="cursor-pointer min-h-11 py-3 text-sm text-cyan-400">On this page · {sections.length} sections</summary>
                            <nav aria-label="On this page" className="pb-3">{tableOfContents}</nav>
                        </details>
                        <nav aria-label="On this page" className="hidden lg:block px-1">
                            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-3">On this page</p>
                            {tableOfContents}
                        </nav>
                    </aside>
                    <article className="min-w-0 rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-6 sm:p-10 lg:p-12">
                        {children}
                        {hasCompanyDetails && <section id="company" className="scroll-mt-6 mt-10 pt-8 border-t border-slate-700 text-slate-400"><h2 className="font-display text-base text-white mb-4">Company & contact details</h2><CompanyDetails /></section>}
                        <p className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">Read these policies together. Nothing in them limits rights that cannot be excluded under the law that applies to you.</p>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export function LegalSection({ id, title, number, children }) {
    return <section id={id} className="scroll-mt-6 mb-9 last:mb-0"><h2 className="flex gap-3 font-display text-base sm:text-lg font-bold text-white mb-4"><span className="text-cyan-400 font-mono shrink-0">{String(number).padStart(2, '0')}.</span>{title}</h2><div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-400 break-words">{children}</div></section>;
}

export function LegalContact({ subject = 'BlitzGrid support' }) {
    const { company = {} } = usePage().props;
    return company.email
        ? <a className="text-cyan-400 hover:underline break-all" href={`mailto:${company.email}?subject=${encodeURIComponent(subject)}`}>{company.email}</a>
        : <span>the operator using the contact details provided on this page when available</span>;
}
