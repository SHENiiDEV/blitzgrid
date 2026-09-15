<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlitzGrid Treasury Receipt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; padding: 30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);">
                    
                    <!-- Top Glowing Accent -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #eab308 0%, #ff007f 50%, #00f0ff 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 30px 35px 20px 35px; text-align: center; border-bottom: 1px solid #1e293b;">
                            <div style="display: inline-block; padding: 8px 16px; background-color: #01040a; border: 1px solid #eab308; border-radius: 8px; margin-bottom: 12px;">
                                <span style="font-size: 20px; font-weight: 900; letter-spacing: 3px; color: #ffffff;">BLITZ<span style="color: #ff007f;">GRID</span></span>
                            </div>
                            <div style="font-size: 11px; letter-spacing: 2px; color: #eab308; font-family: monospace; text-transform: uppercase;">
                                💎 Treasury Dispatch // Transaction Receipt
                            </div>
                        </td>
                    </tr>

                    <!-- Main Body Content -->
                    <tr>
                        <td style="padding: 35px 35px 25px 35px;">
                            <div style="margin-bottom: 15px; font-size: 12px; font-family: monospace; color: #10b981; font-weight: 700;">
                                ✓ PAYMENT SUCCESSFUL & CONFIRMED
                            </div>
                            <h1 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                                Treasury Refill Added, <span style="color: #eab308;">{{ $user->username }}</span>!
                            </h1>
                            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                                We have received your payment and credited your account treasury with <strong>+{{ number_format($amount) }} {{ $currencyLabel }}</strong>.
                            </p>

                            <!-- Receipt Table Card -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; border: 1px solid #334155; border-radius: 12px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <div style="font-size: 11px; font-family: monospace; color: #eab308; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px;">
                                            // INVOICE SUMMARY
                                        </div>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px;">
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Transaction ID:</td>
                                                <td style="padding: 4px 0; text-align: right; font-family: monospace; font-weight: 600; color: #94a3b8;">{{ $transactionId }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Date & Time:</td>
                                                <td style="padding: 4px 0; text-align: right; color: #94a3b8;">{{ now()->toDayDateTimeString() }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Payment Method:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #ffffff;">{{ $paymentMethod }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Package Purchased:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: {{ $currency === 'coins' ? '#eab308' : '#ff007f' }};">
                                                    +{{ number_format($amount) }} {{ $currencyLabel }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Amount Paid:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 800; font-size: 14px; color: #10b981;">
                                                    ${{ number_format($priceUsd, 2) }} USD
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding: 8px 0 0 0; border-top: 1px dashed #334155;"></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #94a3b8; font-weight: 600;">New Coins Balance:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 800; color: #eab308;">{{ number_format($totalCoins) }} COINS</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #94a3b8; font-weight: 600;">New Gems Balance:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 800; color: #ff007f;">{{ number_format($totalGems) }} GEMS</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Call to Action Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $garageUrl }}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #eab308 0%, #ea580c 100%); color: #030712; font-weight: 900; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border-radius: 10px; box-shadow: 0 4px 20px rgba(234, 179, 8, 0.4);">
                                            ⚡ Open Garage & Upgrade Chassis
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                                If you did not authorize this purchase or have questions, contact our billing department at <a href="mailto:info@blitzgrid.co.uk" style="color: #00f0ff; text-decoration: none;">info@blitzgrid.co.uk</a>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 35px; background-color: #030712; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; font-family: monospace; color: #475569;">
                            <div>BLITZGRID // Real-Time 30 TPS Multiplayer Tank Arena</div>
                            <div style="margin-top: 5px;">&copy; {{ date('Y') }} BlitzGrid. All tactical rights reserved.</div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
