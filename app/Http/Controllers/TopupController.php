<?php

namespace App\Http\Controllers;

use App\Mail\TopupReceiptMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TopupController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $coinPackages = [
            ['id' => 'c_scout', 'amount' => 500, 'bonus' => 0, 'price_usd' => 4.99, 'badge' => 'STARTER'],
            ['id' => 'c_vanguard', 'amount' => 1200, 'bonus' => 100, 'price_usd' => 9.99, 'badge' => 'POPULAR'],
            ['id' => 'c_battalion', 'amount' => 3200, 'bonus' => 500, 'price_usd' => 24.99, 'badge' => '+20% BONUS'],
            ['id' => 'c_armada', 'amount' => 7500, 'bonus' => 1500, 'price_usd' => 49.99, 'badge' => 'BEST VALUE'],
        ];

        $gemPackages = [
            ['id' => 'g_shards', 'amount' => 50, 'bonus' => 0, 'price_usd' => 4.99, 'badge' => 'STARTER'],
            ['id' => 'g_cluster', 'amount' => 120, 'bonus' => 15, 'price_usd' => 9.99, 'badge' => 'POPULAR'],
            ['id' => 'g_core', 'amount' => 320, 'bonus' => 60, 'price_usd' => 24.99, 'badge' => '+25% BONUS'],
            ['id' => 'g_singularity', 'amount' => 750, 'bonus' => 180, 'price_usd' => 49.99, 'badge' => 'BEST VALUE'],
        ];

        return Inertia::render('Topup', [
            'coinPackages' => $coinPackages,
            'gemPackages' => $gemPackages,
            'user' => [
                'coins' => $user->coins,
                'gems' => $user->gems,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function process(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'currency' => ['required', 'in:coins,gems'],
            'amount' => ['required', 'integer', 'min:10', 'max:500000'],
            'price_usd' => ['required', 'numeric', 'min:0.5'],
            'payment_method' => ['required', 'string'],
        ]);

        $currency = $validated['currency'];
        $amount = (int) $validated['amount'];
        $price = (float) $validated['price_usd'];

        if ($currency === 'coins') {
            $user->increment('coins', $amount);
            $msg = "Success! {$amount} Cyber Coins added to your armory treasury.";
        } else {
            $user->increment('gems', $amount);
            $msg = "Success! {$amount} Quantum Gems infused into your core.";
        }

        // Refresh user instance to have exact updated coin/gem balances
        $user->refresh();

        // Dispatch Topup Receipt Email
        $transactionId = 'TXN-' . strtoupper(substr(md5(uniqid((string) mt_rand(), true)), 0, 10));
        try {
            Mail::to($user->email)->send(new TopupReceiptMail(
                user: $user,
                currency: $currency,
                amount: $amount,
                priceUsd: $price,
                paymentMethod: $validated['payment_method'],
                transactionId: $transactionId
            ));
        } catch (\Throwable $e) {
            Log::error('Failed sending topup receipt email to ' . $user->email . ': ' . $e->getMessage());
        }

        return redirect()->back()->with('success', $msg);
    }
}
