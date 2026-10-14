<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#030712">
        <meta name="apple-mobile-web-app-title" content="BlitzGrid">
        <link rel="icon" href="/favicon.ico?v=2" sizes="16x16 32x32 48x48">
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" sizes="180x180">
        <link rel="manifest" href="/site.webmanifest">

        <title>{{ config('app.name', 'BLITZGRID // Real-Time Tank Arena') }}</title>

        <!-- Cyberpunk / Sci-Fi Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

        <!-- Scripts & Styles -->
        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden selection:bg-cyan-500 selection:text-black">
        @inertia
    </body>
</html>
