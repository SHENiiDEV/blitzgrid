<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeCadetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address', 'info@blitzgrid.co.uk'),
                config('mail.from.name', 'BlitzGrid Command')
            ),
            subject: "⚡ Welcome to BlitzGrid, Commander {$this->user->username}!"
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
            with: [
                'user' => $this->user,
                'starterCoins' => $this->user->coins,
                'starterGems' => $this->user->gems,
                'arenaUrl' => url('/play'),
                'deckUrl' => url('/dashboard'),
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
