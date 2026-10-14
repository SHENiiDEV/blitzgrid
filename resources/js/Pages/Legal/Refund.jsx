import React from 'react';
import { Link } from '@inertiajs/react';
import LegalLayout, { LegalSection, LegalContact } from '@/Layouts/LegalLayout';

const sections = [
    { id: 'scope', title: 'What this policy covers' },
    { id: 'delivery', title: 'Digital delivery' },
    { id: 'cancellation', title: 'Cancellation & consumer rights' },
    { id: 'purchase-issues', title: 'Missing items & billing errors' },
    { id: 'request', title: 'How to request help or a refund' },
    { id: 'processing', title: 'Review & repayment' },
    { id: 'account-closure', title: 'Account closure & disputes' },
];

export default function Refund() {
    const content = [
        <><p>This policy covers paid BlitzGrid digital content, including Cyber Coins, Quantum Gems and virtual items. It should be read with the <Link href="/terms" className="text-cyan-400 hover:underline">Terms & Conditions</Link>.</p><p>It applies when a real payment has been collected. Free rewards, promotional balances and demonstration transactions do not create a cash refund entitlement. Your statutory rights take priority over this policy.</p></>,
        <><p>Virtual currency and items are delivered to the account used for the purchase after successful processing. Check your balance, garage and any receipt before retrying a transaction.</p><p>If a payment is shown as pending, check its status with your payment provider. Do not repeat a purchase just because delivery is delayed. Contact us if a confirmed payment has not produced the expected items.</p></>,
        <><p>You may have a statutory right to cancel a distance purchase, including a 14-day cancellation period where applicable. Rights depend on your location and the type of content or service purchased.</p><p>For digital content supplied immediately, a cancellation right may be lost only where applicable law permits it and the required express consent and acknowledgement were obtained before supply began. Delivery or use alone does not automatically establish a valid waiver.</p><p>Content that is faulty, not supplied or not as described may give you rights to a remedy, replacement, price reduction or refund. We assess those rights separately from a change-of-mind request.</p></>,
        <><p>Contact us about duplicate charges, incorrect amounts, items credited to the wrong account or content that was not delivered as described. Include enough information to locate the transaction.</p><p>If you suspect an unauthorised payment, secure your account and notify your bank or payment provider promptly as well as contacting us. We will investigate the service records available to us. Using an item does not remove rights relating to fraud, defects or incorrect supply.</p></>,
        <><p>Send a request to <LegalContact subject="Refund or cancellation request" />. Include:</p><ul className="list-disc pl-5 space-y-2"><li>Your username and the email associated with the account.</li><li>The transaction or receipt reference, purchase date, amount and currency.</li><li>The package or item involved and a description of the issue.</li><li>Whether you are requesting delivery assistance, cancellation or a refund.</li></ul><p>For cancellation, a clear statement that you wish to cancel is sufficient; no special wording is required. Never send passwords, security codes or full card numbers. Redact unrelated details from screenshots.</p></>,
        <><p>We will review the purchase and explain the outcome, including any additional information needed. We may first correct a delivery or billing error where appropriate, without limiting other remedies available by law.</p><p>Approved refunds are returned through the original payment method where possible, unless another lawful method is agreed. We will meet applicable repayment deadlines; the time it takes for a credit to appear also depends on your bank or payment provider. We do not promise a fixed bank processing time.</p><p>Currency or items linked to a refunded transaction may be removed or adjusted to reflect the repayment. Any adjustment will relate to that transaction and will be explained where relevant.</p></>,
        <><p>Closing an account or receiving a fair-play restriction does not automatically cancel a purchase. We consider any remaining statutory rights and unresolved purchase issues separately.</p><p>If you disagree with a decision, reply with the transaction reference and the reason you are requesting a review. This policy does not prevent you from contacting your payment provider, a consumer protection body or another dispute channel available under applicable law.</p></>,
    ];

    return <LegalLayout title="Refunds & Cancellation" summary="Clear steps for purchase problems, digital delivery, cancellation and refunds." path="/refund" sections={sections}>{sections.map((section, index) => <LegalSection key={section.id} {...section} number={index + 1}>{content[index]}</LegalSection>)}</LegalLayout>;
}
