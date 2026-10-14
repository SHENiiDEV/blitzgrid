<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class CompanyLegalPagesTest extends TestCase
{
    #[TestWith(['/terms', 'Legal/Terms'])]
    #[TestWith(['/privacy', 'Legal/Privacy'])]
    #[TestWith(['/refund', 'Legal/Refund'])]
    public function test_legal_pages_share_only_public_company_details(string $url, string $component): void
    {
        config()->set('company', [
            'name' => 'Arena Company Ltd',
            'reg_number' => '00123456',
            'address' => "10 Arena Street\nRiga, Latvia",
            'email' => 'legal@example.com',
            'private_key' => 'must-not-be-exposed',
        ]);

        $response = $this->get($url);

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component($component)
            ->where('company', [
                'name' => 'Arena Company Ltd',
                'reg_number' => '00123456',
                'address' => "10 Arena Street\nRiga, Latvia",
                'email' => 'legal@example.com',
            ])
            ->etc());
    }

    public function test_blank_company_details_do_not_prevent_public_pages_from_loading(): void
    {
        config()->set('company', ['name' => '', 'reg_number' => '', 'address' => '', 'email' => '']);

        $response = $this->get('/login');

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login')
            ->where('company', ['name' => '', 'reg_number' => '', 'address' => '', 'email' => ''])
            ->etc());
    }
}
