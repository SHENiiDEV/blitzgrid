<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Services\InvoiceService;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TopupReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $currency,
        public int $amount,
        public float $priceUsd,
        public string $paymentMethod,
        public string $transactionId
    ) {}

    public function envelope(): Envelope
    {
        $currencyLabel = $this->currency === 'coins' ? 'Cyber Coins' : 'Quantum Gems';
        return new Envelope(
            from: new Address(
                config('mail.from.address', 'info@blitzgrid.co.uk'),
                config('mail.from.name', 'BlitzGrid Treasury')
            ),
            subject: "💎 BlitzGrid Invoice & Receipt: +{$this->amount} {$currencyLabel} Confirmed"
        );
    }

    public function content(): Content
    {
        $currencyLabel = $this->currency === 'coins' ? 'Cyber Coins' : 'Quantum Gems';
        return new Content(
            view: 'emails.topup_receipt',
            with: [
                'user' => $this->user,
                'currency' => $this->currency,
                'currencyLabel' => $currencyLabel,
                'amount' => $this->amount,
                'priceUsd' => $this->priceUsd,
                'paymentMethod' => strtoupper($this->paymentMethod),
                'transactionId' => $this->transactionId,
                'totalCoins' => $this->user->coins,
                'totalGems' => $this->user->gems,
                'garageUrl' => url('/garage'),
                'deckUrl' => url('/dashboard'),
            ]
        );
    }

    public function attachments(): array
    {
        $invoiceService = app(InvoiceService::class);
        $pdfData = $invoiceService->generateInvoicePdf(
            user: $this->user,
            currency: $this->currency,
            amount: $this->amount,
            priceUsd: $this->priceUsd,
            paymentMethod: $this->paymentMethod,
            transactionId: $this->transactionId
        );

        return [
            Attachment::fromData(fn () => $pdfData, "BlitzGrid-Invoice-{$this->transactionId}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
