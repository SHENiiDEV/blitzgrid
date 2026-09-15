<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BlitzGrid</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; padding: 30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);">
                    
                    <!-- Top Glowing Accent -->
                    <tr>
                        <td style="height: 4px; background: linear-gradient(90deg, #00f0ff 0%, #ff007f 50%, #eab308 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 30px 35px 20px 35px; text-align: center; border-bottom: 1px solid #1e293b;">
                            <div style="display: inline-block; padding: 8px 16px; background-color: #01040a; border: 1px solid #00f0ff; border-radius: 8px; margin-bottom: 12px;">
                                <span style="font-size: 20px; font-weight: 900; letter-spacing: 3px; color: #ffffff;">BLITZ<span style="color: #ff007f;">GRID</span></span>
                            </div>
                            <div style="font-size: 11px; letter-spacing: 2px; color: #00f0ff; font-family: monospace; text-transform: uppercase;">
                                30 TPS Tactical Arena // Cadet Enlistment Dispatch
                            </div>
                        </td>
                    </tr>

                    <!-- Main Body Content -->
                    <tr>
                        <td style="padding: 35px 35px 25px 35px;">
                            <h1 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                                Welcome to the Arena, <span style="color: #00f0ff;">Commander {{ $user->username }}</span>!
                            </h1>
                            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                                Your tactical clearance has been granted and your pilot credentials have been registered in the authoritative 30 TPS combat simulation grid.
                            </p>

                            <!-- Enlistment Summary Card -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; border: 1px solid #334155; border-radius: 12px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <div style="font-size: 11px; font-family: monospace; color: #00f0ff; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px;">
                                            // ENLISTMENT CREDENTIALS & TREASURY
                                        </div>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px;">
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Pilot Call-Sign:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #ffffff;">{{ $user->username }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Registered Email:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #94a3b8;">{{ $user->email }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Starting Cyber Coins:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #eab308;">+{{ number_format($starterCoins) }} COINS</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Starting Quantum Gems:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #ff007f;">+{{ number_format($starterGems) }} GEMS</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 4px 0; color: #64748b;">Default Chassis:</td>
                                                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #00f0ff;">Neon Vanguard MK-I</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Call to Action Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 25px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $arenaUrl }}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #00f0ff 0%, #2563eb 100%); color: #030712; font-weight: 900; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 240, 255, 0.4);">
                                            ▶ Launch Combat Arena
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                                Need assistance or telemetry support? Reach out directly to <a href="mailto:info@blitzgrid.co.uk" style="color: #00f0ff; text-decoration: none;">info@blitzgrid.co.uk</a>.
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
