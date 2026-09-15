<?php

namespace App\Services;

use App\Models\User;
use Dompdf\Dompdf;
use Dompdf\Options;

class InvoiceService
{
    /**
     * Generate raw binary PDF content for an invoice.
     */
    public function generateInvoicePdf(
        User $user,
        string $currency,
        int $amount,
        float $priceUsd,
        string $paymentMethod,
        string $transactionId,
        ?\DateTimeInterface $date = null
    ): string {
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Helvetica');

        $dompdf = new Dompdf($options);

        $currencyLabel = $currency === 'coins' ? 'Cyber Coins' : 'Quantum Gems';
        $invoiceNumber = 'BG-INV-' . date('Ymd') . '-' . substr($transactionId, 4);

        $html = view('pdf.invoice', [
            'user' => $user,
            'currency' => $currency,
            'currencyLabel' => $currencyLabel,
            'amount' => $amount,
            'priceUsd' => $priceUsd,
            'paymentMethod' => strtoupper($paymentMethod),
            'transactionId' => $transactionId,
            'invoiceNumber' => $invoiceNumber,
            'date' => $date ?? now(),
            'totalCoins' => $user->coins,
            'totalGems' => $user->gems,
        ])->render();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }
}
