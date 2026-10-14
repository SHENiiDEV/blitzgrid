<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class TopupController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Topup');
    }

    public function process(): JsonResponse
    {
        return response()->json([
            'message' => 'Purchases are currently unavailable. No payment has been taken.',
        ], 503);
    }
}
