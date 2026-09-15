import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Coins, 
    Gem, 
    CreditCard, 
    Zap, 
    Check, 
    Sparkles, 
    ShieldCheck, 
    Lock, 
    ArrowRight, 
    Sliders, 
    DollarSign,
    Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Topup({ coinPackages = [], gemPackages = [], user }) {
    const [selectedTab, setSelectedTab] = useState('coins'); // 'coins' | 'gems'
    const [customAmount, setCustomAmount] = useState(1500);
    const [checkoutModal, setCheckoutModal] = useState(null); // { currency, amount, bonus, price }
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvc, setCardCvc] = useState('888');
    const [processing, setProcessing] = useState(false);

    // Calculate dynamic price for custom amounts
    const calculateCustomPrice = (currency, rawAmount) => {
        const amt = Math.max(10, parseInt(rawAmount) || 0);
        if (currency === 'coins') {
            // Rate: 100 coins = $1.00
            const basePrice = amt / 100;
            // Tier bonuses
            let bonusPercent = 0;
            if (amt >= 10000) bonusPercent = 35;
            else if (amt >= 3000) bonusPercent = 20;
            else if (amt >= 1000) bonusPercent = 10;
            const bonusCoins = Math.floor(amt * (bonusPercent / 100));

            return {
                amount: amt,
                bonus: bonusCoins,
                totalAmount: amt + bonusCoins,
                priceUsd: Number(basePrice.toFixed(2)),
                bonusPercent,
            };
        } else {
            // Gems Rate: 10 gems = $1.00
            const basePrice = amt / 10;
            let bonusPercent = 0;
            if (amt >= 1000) bonusPercent = 35;
            else if (amt >= 300) bonusPercent = 20;
            else if (amt >= 100) bonusPercent = 10;
            const bonusGems = Math.floor(amt * (bonusPercent / 100));

            return {
                amount: amt,
                bonus: bonusGems,
                totalAmount: amt + bonusGems,
                priceUsd: Number(basePrice.toFixed(2)),
                bonusPercent,
            };
        }
    };

    const customCalculation = calculateCustomPrice(selectedTab, customAmount);

    const handleOpenPackageCheckout = (pkg, currency) => {
        setCheckoutModal({
            currency,
            amount: pkg.amount + pkg.bonus,
            baseAmount: pkg.amount,
            bonus: pkg.bonus,
            price: pkg.price_usd,
        });
    };

    const handleOpenCustomCheckout = () => {
        setCheckoutModal({
            currency: selectedTab,
            amount: customCalculation.totalAmount,
            baseAmount: customCalculation.amount,
            bonus: customCalculation.bonus,
            price: customCalculation.priceUsd,
        });
    };

    const handleConfirmPayment = (e) => {
        e.preventDefault();
        if (!checkoutModal) return;

        setProcessing(true);

        router.post('/topup/process', {
            currency: checkoutModal.currency,
            amount: checkoutModal.amount,
            price_usd: checkoutModal.price,
            payment_method: paymentMethod,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setCheckoutModal(null);
                confetti({
                    particleCount: 70,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: checkoutModal.currency === 'coins' ? ['#ffaa00', '#ffd700', '#ff8800'] : ['#ff007f', '#a855f7', '#00f0ff'],
                });
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AuthenticatedLayout title="Treasury Top-Up">
            <Head title="Treasury Top-Up // BLITZGRID" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                        <Zap className="w-4 h-4" />
                        <span>TACTICAL TREASURY // SECURE PAYMENT VAULT</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-white">
                        ACQUIRE <span className="text-amber-400">CREDITS & GEMS</span>
                    </h1>
                </div>

                {/* Current Player Balance */}
                <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-2.5 shadow-xl font-mono">
                    <div className="flex items-center space-x-2 text-amber-400">
                        <Coins className="w-5 h-5 fill-amber-400/20" />
                        <div>
                            <div className="text-[9px] text-slate-400">CYBER COINS</div>
                            <div className="font-bold text-base">{user.coins?.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div className="flex items-center space-x-2 text-pink-400">
                        <Gem className="w-5 h-5 fill-pink-400/20" />
                        <div>
                            <div className="text-[9px] text-slate-400">QUANTUM GEMS</div>
                            <div className="font-bold text-base">{user.gems?.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency Selector Tabs */}
            <div className="flex space-x-3 mb-8 font-tech">
                <button
                    onClick={() => setSelectedTab('coins')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                        selectedTab === 'coins'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                    <Coins className="w-5 h-5 fill-current" />
                    <span>CYBER COINS (TOP-UP)</span>
                </button>

                <button
                    onClick={() => setSelectedTab('gems')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                        selectedTab === 'gems'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                    <Gem className="w-5 h-5 fill-current" />
                    <span>QUANTUM GEMS (PREMIUM)</span>
                </button>
            </div>

            {/* SECTION 1: Preset Tier Packages */}
            <div className="mb-12">
                <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>POPULAR {selectedTab.toUpperCase()} PACKAGES</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(selectedTab === 'coins' ? coinPackages : gemPackages).map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group relative overflow-hidden"
                        >
                            {/* Top Badge */}
                            <div className="flex justify-between items-center mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                                    pkg.badge === 'BEST VALUE' ? 'bg-amber-950 border border-amber-500 text-amber-300' :
                                    pkg.badge === 'POPULAR' ? 'bg-cyan-950 border border-cyan-500 text-cyan-300' :
                                    'bg-slate-950 border border-slate-800 text-slate-400'
                                }`}>
                                    {pkg.badge}
                                </span>

                                {pkg.bonus > 0 && (
                                    <span className="text-xs font-mono font-bold text-emerald-400">
                                        +{pkg.bonus} BONUS
                                    </span>
                                )}
                            </div>

                            {/* Center Currency Icon & Amount */}
                            <div className="text-center py-6 space-y-2">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                    {selectedTab === 'coins' ? (
                                        <Coins className="w-9 h-9 text-amber-400 fill-amber-400/20" />
                                    ) : (
                                        <Gem className="w-9 h-9 text-pink-400 fill-pink-400/20" />
                                    )}
                                </div>

                                <div className="font-display font-black text-3xl text-white">
                                    {(pkg.amount + pkg.bonus).toLocaleString()}
                                </div>
                                <div className="text-xs font-mono text-slate-400 uppercase">
                                    {selectedTab === 'coins' ? 'Cyber Coins' : 'Quantum Gems'}
                                </div>
                            </div>

                            {/* Purchase CTA */}
                            <div className="pt-4 border-t border-slate-800">
                                <button
                                    onClick={() => handleOpenPackageCheckout(pkg, selectedTab)}
                                    className={`w-full py-3 rounded-2xl font-display font-bold text-sm tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                                        selectedTab === 'coins'
                                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                            : 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                    }`}
                                >
                                    <span>${pkg.price_usd.toFixed(2)} USD</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 2: Custom Amount Calculator ("Своя сумма") */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
                        <Sliders className="w-4 h-4" />
                        <span>CUSTOM AMOUNT CALCULATOR (СВОЯ СУММА)</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white mb-2">
                        ENTER ANY CUSTOM {selectedTab.toUpperCase()} QUANTITY
                    </h2>
                    <p className="text-xs font-sans text-slate-400 mb-6">
                        Enter any custom amount you desire. Larger top-ups automatically unlock up to +35% bonus volume.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        
                        {/* Custom Input */}
                        <div className="sm:col-span-7 space-y-3">
                            <label className="block text-xs font-mono text-slate-300 font-bold">
                                DESIRED {selectedTab.toUpperCase()} AMOUNT:
                            </label>
                            <div className="relative">
                                {selectedTab === 'coins' ? (
                                    <Coins className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
                                ) : (
                                    <Gem className="w-5 h-5 text-pink-400 absolute left-4 top-3.5" />
                                )}
                                <input
                                    type="number"
                                    min="10"
                                    max="500000"
                                    step="50"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl pl-12 pr-4 py-3.5 text-lg font-mono font-bold text-white outline-none"
                                    placeholder="e.g. 1500"
                                />
                            </div>

                            {/* Preset quick buttons */}
                            <div className="flex gap-2">
                                {[500, 1500, 5000, 12000].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setCustomAmount(preset)}
                                        className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-mono rounded-lg text-slate-300 hover:text-cyan-400 transition-colors"
                                    >
                                        +{preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Calculated USD Price & Checkout Button */}
                        <div className="sm:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
                            <div className="text-xs font-mono text-slate-400">TOTAL COST (USD)</div>
                            <div className="font-display font-black text-3xl text-cyan-400 flex items-center justify-center">
                                <span>${customCalculation.priceUsd.toFixed(2)}</span>
                            </div>

                            {customCalculation.bonus > 0 && (
                                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                                    Includes +{customCalculation.bonus.toLocaleString()} ({customCalculation.bonusPercent}%) Extra Bonus!
                                </div>
                            )}

                            <button
                                onClick={handleOpenCustomCheckout}
                                className={`w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                                    selectedTab === 'coins'
                                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                        : 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                                }`}
                            >
                                <span>TOP UP {customCalculation.totalAmount.toLocaleString()} {selectedTab.toUpperCase()}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* CHECKOUT MODAL */}
            {checkoutModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
                    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
                        
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                                <span className="font-display font-bold text-base text-white">SECURE CHECKOUT</span>
                            </div>
                            <button
                                onClick={() => setCheckoutModal(null)}
                                className="text-slate-500 hover:text-white font-mono text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between font-mono">
                            <div>
                                <div className="text-xs text-slate-400 uppercase">ACQUIRING ITEM</div>
                                <div className="font-display font-bold text-lg text-white">
                                    {checkoutModal.amount.toLocaleString()} {checkoutModal.currency === 'coins' ? 'Cyber Coins' : 'Quantum Gems'}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase">AMOUNT DUE</div>
                                <div className="font-display font-black text-xl text-cyan-400">
                                    ${checkoutModal.price.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Details */}
                        <form onSubmit={handleConfirmPayment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">
                                    CARD NUMBER
                                </label>
                                <div className="relative">
                                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-white outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">
                                        EXPIRY (MM/YY)
                                    </label>
                                    <input
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm font-mono text-white outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">
                                        CVC / CVV
                                    </label>
                                    <input
                                        type="text"
                                        value={cardCvc}
                                        onChange={(e) => setCardCvc(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm font-mono text-white outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1.5 text-[11px] font-mono">
                                <div className="flex items-center space-x-1.5 text-slate-400">
                                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>256-BIT SSL ENCRYPTED GATEWAY // INSTANT CREDIT</span>
                                </div>
                                <div className="text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
                                    <span>📧 Official Tax Invoice attached to email</span>
                                    <a 
                                        href="/topup/invoice/preview" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:underline hover:text-cyan-300 font-bold"
                                    >
                                        [View Sample PDF]
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:opacity-95 text-slate-950 font-display font-black text-sm uppercase rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{processing ? 'PROCESSING...' : `PAY $${checkoutModal.price.toFixed(2)}`}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCheckoutModal(null)}
                                    className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
