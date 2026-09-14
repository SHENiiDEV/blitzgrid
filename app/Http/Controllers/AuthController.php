<?php

namespace App\Http\Controllers;

use App\Models\Skin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Sanctioned/Excluded countries that cannot register
     */
    public const EXCLUDED_COUNTRIES = [
        'Sudan',
        'Dem. Rep. of the Congo',
        'Democratic Republic of the Congo',
        'Iran',
        'Mali',
        'Myanmar (Burma)',
        'Myanmar',
        'North Korea',
        'South Sudan',
        'Syria',
        'Yemen',
        'Afghanistan',
        'Belarus',
        'Central African Republic',
        'Cuba',
        'Haiti',
        'Iraq',
        'Russia',
        'Russian Federation',
        'Somalia',
        'Venezuela',
        'Zimbabwe',
    ];

    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Support login by email OR username
        $user = User::where('email', $credentials['email'])
            ->orWhere('username', $credentials['email'])
            ->first();

        if ($user && Hash::check($credentials['password'], $user->password)) {
            Auth::login($user, $request->boolean('remember', true));
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'Invalid credentials or commander authorization passphrase.',
        ]);
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'surname' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'max:20', 'alpha_dash', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::min(8)->letters()->numbers()],
            'phone' => ['required', 'string', 'max:30'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'street_address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'country' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (in_array($value, self::EXCLUDED_COUNTRIES, true)) {
                        $fail('Registration from the selected jurisdiction is currently restricted.');
                    }
                },
            ],
            'post_code' => ['required', 'string', 'max:20'],
            'terms_accepted' => ['required', 'accepted'],
        ], [
            'terms_accepted.accepted' => 'You must agree to the Terms & Conditions and Privacy Policy to register.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'date_of_birth' => $validated['date_of_birth'],
            'street_address' => $validated['street_address'],
            'city' => $validated['city'],
            'country' => $validated['country'],
            'post_code' => $validated['post_code'],
            'terms_accepted_at' => now(),
            'coins' => 600, // Enlistment bonus
            'gems' => 50,
        ]);

        // Grant default starter skin
        $defaultSkin = Skin::where('is_default', true)->first() ?? Skin::first();
        if ($defaultSkin) {
            $user->skins()->attach($defaultSkin->id, ['is_equipped' => true]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard')->with('success', 'Cadet registration completed! Welcome to BlitzGrid, Commander ' . $user->username . '!');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
