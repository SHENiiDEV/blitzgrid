<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GarageController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\ShopController;
use App\Models\Skin;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// High-Tech Cyberpunk Landing Page
Route::get('/', function () {
    $skins = Skin::all();
    $topCommanders = User::orderByDesc('kills_total')->take(5)->get();

    return Inertia::render('Welcome', [
        'skins' => $skins,
        'topCommanders' => $topCommanders,
        'isAuthenticated' => auth()->check(),
    ]);
})->name('home');

// Legal Policies
Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('Legal/Privacy');
})->name('privacy');

Route::get('/refund', function () {
    return Inertia::render('Legal/Refund');
})->name('refund');

// Authentication (Guest only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Protected Portal & Arena Routes (Strictly Authenticated)
Route::middleware('auth')->group(function () {
    Route::get('/play', [GameController::class, 'play'])->name('game.play');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/garage', [GarageController::class, 'index'])->name('garage');
    Route::post('/garage/equip/{skin}', [GarageController::class, 'equip'])->name('garage.equip');
    Route::post('/garage/upgrade/{skin}', [GarageController::class, 'upgrade'])->name('garage.upgrade');
    Route::post('/shop/purchase/{skin}', [ShopController::class, 'purchase'])->name('shop.purchase');
    Route::get('/topup', [\App\Http\Controllers\TopupController::class, 'index'])->name('topup');
    Route::post('/topup/process', [\App\Http\Controllers\TopupController::class, 'process'])->name('topup.process');
    Route::get('/topup/invoice/preview', [\App\Http\Controllers\TopupController::class, 'previewInvoice'])->name('topup.invoice.preview');
});

// Public Informational Routes
Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');

// Real-Time Game Server API Endpoints
Route::prefix('api/game')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class])->group(function () {
    Route::get('/token', [GameController::class, 'getToken'])->name('api.game.token');
    Route::post('/match-result', [GameController::class, 'recordMatchResult'])->name('api.game.match_result');
});
