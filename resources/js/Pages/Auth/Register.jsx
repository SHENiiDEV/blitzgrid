import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Crosshair, 
    Lock, 
    Mail, 
    User, 
    Shield, 
    Zap, 
    Phone, 
    Calendar, 
    MapPin, 
    Globe, 
    Building, 
    FileText,
    ArrowRight,
    Check
} from 'lucide-react';
import { ALLOWED_COUNTRIES } from '@/constants/countries';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        date_of_birth: '',
        street_address: '',
        city: '',
        country: 'United States',
        post_code: '',
        terms_accepted: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-cyber-grid selection:bg-cyan-500 selection:text-black font-sans">
            <Head title="Commander Enlistment // BLITZGRID" />

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
                    MANDATORY CADET ENLISTMENT & COMPLIANCE REGISTRATION
                </p>
            </div>

            {/* Main Form Container */}
            <div className="max-w-3xl w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]"></div>

                {/* Bonus Announcement */}
                <div className="mb-6 p-4 bg-amber-950/70 border border-amber-500/50 rounded-2xl flex items-center justify-between text-xs font-mono text-amber-300">
                    <div className="flex items-center space-x-2.5">
                        <Zap className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                        <span>ENLISTMENT BONUS: 600 CYBER COINS + 50 GEMS ALLOCATED ON COMPLETION</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION 1: Personal & Account Credentials */}
                    <div className="space-y-4">
                        <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center space-x-2 border-b border-slate-800 pb-2">
                            <User className="w-4 h-4" />
                            <span>1. COMMANDER IDENTITY & ACCESS</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    FIRST NAME <span className="text-pink-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                    placeholder="Alex"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-400 font-mono mt-1">{errors.name}</p>}
                            </div>

                            {/* Surname */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    SURNAME (LAST NAME) <span className="text-pink-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.surname}
                                    onChange={(e) => setData('surname', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                    placeholder="Mercer"
                                    required
                                />
                                {errors.surname && <p className="text-xs text-red-400 font-mono mt-1">{errors.surname}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Combat Username Callsign */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    COMBAT CALLSIGN (USERNAME) <span className="text-pink-500">*</span>
                                </label>
                                <div className="relative">
                                    <Crosshair className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                        placeholder="CyberStriker"
                                        maxLength={20}
                                        required
                                    />
                                </div>
                                {errors.username && <p className="text-xs text-red-400 font-mono mt-1">{errors.username}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    EMAIL ADDRESS <span className="text-pink-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                        placeholder="commander@blitzgrid.io"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-400 font-mono mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Password */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    PASSWORD <span className="text-pink-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-400 font-mono mt-1">{errors.password}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    PHONE NUMBER <span className="text-pink-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                        placeholder="+1 (555) 019-2834"
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-400 font-mono mt-1">{errors.phone}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    DATE OF BIRTH <span className="text-pink-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white font-mono outline-none transition-colors"
                                        required
                                    />
                                </div>
                                {errors.date_of_birth && <p className="text-xs text-red-400 font-mono mt-1">{errors.date_of_birth}</p>}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Billing & Verification Address */}
                    <div className="space-y-4 pt-2">
                        <div className="text-xs font-mono text-pink-400 uppercase tracking-widest font-bold flex items-center space-x-2 border-b border-slate-800 pb-2">
                            <MapPin className="w-4 h-4" />
                            <span>2. ADDRESS & PAYMENT VERIFICATION</span>
                        </div>

                        {/* 1. Street, house number, apartment */}
                        <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                1. STREET, HOUSE NUMBER, APARTMENT / SUITE <span className="text-pink-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.street_address}
                                onChange={(e) => setData('street_address', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                placeholder="742 Evergreen Terrace, Apt 4B"
                                required
                            />
                            {errors.street_address && <p className="text-xs text-red-400 font-mono mt-1">{errors.street_address}</p>}
                        </div>

                        {/* 2. City, 3. Country, 4. Post code */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* City */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    2. CITY <span className="text-pink-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                    placeholder="Neo Tokyo"
                                    required
                                />
                                {errors.city && <p className="text-xs text-red-400 font-mono mt-1">{errors.city}</p>}
                            </div>

                            {/* Country (Filtered List excluding 19 sanctioned jurisdictions) */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    3. COUNTRY <span className="text-pink-500">*</span>
                                </label>
                                <select
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                    required
                                >
                                    {ALLOWED_COUNTRIES.map((c) => (
                                        <option key={c} value={c} className="bg-slate-900 text-white">
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && <p className="text-xs text-red-400 font-mono mt-1">{errors.country}</p>}
                            </div>

                            {/* Post Code */}
                            <div>
                                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                                    4. POST CODE (ZIP) <span className="text-pink-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.post_code}
                                    onChange={(e) => setData('post_code', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition-colors"
                                    placeholder="10001"
                                    required
                                />
                                {errors.post_code && <p className="text-xs text-red-400 font-mono mt-1">{errors.post_code}</p>}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Terms & Conditions Checkbox */}
                    <div className="pt-3 border-t border-slate-800">
                        <label className="flex items-start space-x-3 cursor-pointer group select-none">
                            <input
                                type="checkbox"
                                checked={data.terms_accepted}
                                onChange={(e) => setData('terms_accepted', e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
                                required
                            />
                            <span className="text-xs font-mono text-slate-300 leading-relaxed">
                                I agree to the{' '}
                                <Link href="/terms" target="_blank" className="text-cyan-400 font-bold hover:underline">
                                    Terms & Conditions
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" target="_blank" className="text-pink-400 font-bold hover:underline">
                                    Privacy Policy
                                </Link>
                                . I confirm that the details provided are accurate for payment verification.
                            </span>
                        </label>
                        {errors.terms_accepted && (
                            <p className="text-xs text-red-400 font-mono mt-1">{errors.terms_accepted}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing || !data.terms_accepted}
                        className={`w-full py-4 rounded-2xl font-display font-black text-sm tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-xl ${
                            data.terms_accepted && !processing
                                ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:opacity-95 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer'
                                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                    >
                        <Shield className="w-5 h-5" />
                        <span>COMPLETE ENLISTMENT & RECEIVE 600 COINS</span>
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
                    Already registered as commander?{' '}
                    <Link href="/login" className="text-cyan-400 font-bold hover:underline">
                        AUTHORIZE HERE
                    </Link>
                </div>
            </div>
        </div>
    );
}
