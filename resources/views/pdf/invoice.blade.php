<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BlitzGrid Invoice {{ $invoiceNumber }}</title>
    <style>
        @page {
            margin: 25px 30px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 15px;
        }
        .logo-title {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #0f172a;
        }
        .logo-highlight {
            color: #ff007f;
        }
        .invoice-badge {
            display: inline-block;
            background-color: #10b981;
            color: #ffffff;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: bold;
            border-radius: 4px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .meta-col {
            width: 50%;
            vertical-align: top;
        }
        .section-title {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
        }
        .info-text {
            font-size: 12px;
            color: #334155;
            line-height: 1.5;
        }
        .info-name {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .items-table th {
            background-color: #0f172a;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 8px 10px;
            text-align: left;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
        }
        .items-table .text-right {
            text-align: right;
        }
        .items-table .text-center {
            text-align: center;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .summary-spacer {
            width: 55%;
        }
        .summary-box {
            width: 45%;
            vertical-align: top;
        }
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 5px 8px;
            font-size: 12px;
        }
        .grand-total {
            background-color: #f8fafc;
            border-top: 2px solid #0f172a;
            border-bottom: 2px solid #0f172a;
            font-size: 15px !important;
            font-weight: 900;
            color: #0f172a;
        }
        .grand-total-amount {
            color: #10b981;
            font-size: 15px !important;
            font-weight: 900;
        }
        .payment-box {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px 15px;
            margin-bottom: 25px;
        }
        .payment-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        .payment-table td {
            padding: 3px 0;
        }
        .footer-notice {
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            font-size: 10px;
            color: #64748b;
            line-height: 1.5;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Header Table -->
    <table class="header-table">
        <tr>
            <td style="vertical-align: middle;">
                <div class="logo-title">BLITZ<span class="logo-highlight">GRID</span></div>
                <div style="font-size: 10px; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px;">
                    Multiplayer Tactical Arena // blitzgrid.co.uk
                </div>
            </td>
            <td style="text-align: right; vertical-align: middle;">
                <div style="font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase;">TAX INVOICE / RECEIPT</div>
                <div style="margin-top: 4px;">
                    <span class="invoice-badge">PAID IN FULL</span>
                </div>
            </td>
        </tr>
    </table>

    <!-- Meta / Parties Table -->
    <table class="meta-table">
        <tr>
            <!-- Issuer Details -->
            <td class="meta-col" style="padding-right: 20px;">
                <div class="section-title">ISSUED BY (MERCHANT)</div>
                <div class="info-name">BlitzGrid Tactical Systems Ltd</div>
                <div class="info-text">
                    Domain: <strong>blitzgrid.co.uk</strong><br>
                    Merchant Category: Digital Virtual Currency Services<br>
                    Support & Inquiries: <strong>info@blitzgrid.co.uk</strong><br>
                    Platform Security: 256-bit TLS / PCI DSS Compliant
                </div>
            </td>
            <!-- Customer & Invoice Metadata -->
            <td class="meta-col" style="padding-left: 20px;">
                <div class="section-title">INVOICE & PILOT DETAILS</div>
                <div class="info-text">
                    <strong>Invoice #:</strong> {{ $invoiceNumber }}<br>
                    <strong>Issue Date:</strong> {{ $date->format('F d, Y - H:i:s T') }}<br>
                    <strong>Pilot Handle:</strong> <span class="info-name" style="font-size: 12px;">{{ $user->username }}</span><br>
                    <strong>Player Email:</strong> {{ $user->email }}<br>
                    <strong>Pilot UID:</strong> #BG-{{ str_pad($user->id, 6, '0', STR_PAD_LEFT) }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 50%;">Item Description</th>
                <th class="text-center" style="width: 15%;">Qty</th>
                <th class="text-right" style="width: 15%;">Unit Price</th>
                <th class="text-right" style="width: 15%;">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="color: #64748b;">1</td>
                <td>
                    <strong>BlitzGrid {{ $currencyLabel }} Package</strong><br>
                    <span style="font-size: 10px; color: #64748b;">
                        Digital Virtual In-Game Asset Credit: +{{ number_format($amount) }} {{ $currencyLabel }}
                    </span>
                </td>
                <td class="text-center">1</td>
                <td class="text-right">${{ number_format($priceUsd, 2) }}</td>
                <td class="text-right" style="font-weight: bold; color: #0f172a;">${{ number_format($priceUsd, 2) }} USD</td>
            </tr>
        </tbody>
    </table>

    <!-- Summary & Totals Table -->
    <table class="summary-table">
        <tr>
            <td class="summary-spacer">
                <!-- Additional Telemetry -->
                <div style="font-size: 11px; color: #64748b; padding-right: 15px;">
                    <strong>Account Status After Top-Up:</strong><br>
                    • Current Cyber Coins: <strong style="color: #0f172a;">{{ number_format($totalCoins) }}</strong><br>
                    • Current Quantum Gems: <strong style="color: #0f172a;">{{ number_format($totalGems) }}</strong>
                </div>
            </td>
            <td class="summary-box">
                <table class="totals-table">
                    <tr>
                        <td style="color: #64748b;">Subtotal:</td>
                        <td class="text-right" style="font-weight: bold;">${{ number_format($priceUsd, 2) }} USD</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b;">Tax / VAT (0.00% Digital Goods):</td>
                        <td class="text-right" style="color: #64748b;">$0.00 USD</td>
                    </tr>
                    <tr class="grand-total">
                        <td style="padding: 8px;">TOTAL AMOUNT PAID:</td>
                        <td class="text-right grand-total-amount" style="padding: 8px;">${{ number_format($priceUsd, 2) }} USD</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Payment Verification Box -->
    <div class="payment-box">
        <div class="section-title" style="border: none; margin-bottom: 4px;">PAYMENT TRANSACTION VERIFICATION</div>
        <table class="payment-table">
            <tr>
                <td style="width: 25%; color: #64748b;">Payment Method:</td>
                <td style="width: 25%; font-weight: bold; color: #0f172a;">{{ $paymentMethod }}</td>
                <td style="width: 25%; color: #64748b;">Transaction Reference:</td>
                <td style="width: 25%; font-family: monospace; font-weight: bold; color: #0f172a;">{{ $transactionId }}</td>
            </tr>
            <tr>
                <td style="color: #64748b;">Processing Status:</td>
                <td style="font-weight: bold; color: #10b981;">COMPLETED / AUTHORIZED</td>
                <td style="color: #64748b;">Digital Delivery:</td>
                <td style="font-weight: bold; color: #10b981;">INSTANT CREDIT</td>
            </tr>
        </table>
    </div>

    <!-- Legal & Directives Footer -->
    <div class="footer-notice">
        <strong>LEGAL & REGULATORY DIRECTIVES:</strong><br>
        This official document constitutes proof of purchase for digital virtual game credits delivered directly to the user's account.<br>
        Governed by BlitzGrid Terms of Service (<a href="https://blitzgrid.co.uk/terms" style="color: #0284c7; text-decoration: none;">https://blitzgrid.co.uk/terms</a>), Privacy Policy (<a href="https://blitzgrid.co.uk/privacy" style="color: #0284c7; text-decoration: none;">https://blitzgrid.co.uk/privacy</a>), and Refund Policy (<a href="https://blitzgrid.co.uk/refund" style="color: #0284c7; text-decoration: none;">https://blitzgrid.co.uk/refund</a>).<br>
        &copy; {{ date('Y') }} BlitzGrid Systems Ltd (blitzgrid.co.uk). All rights reserved.
    </div>

</body>
</html>
