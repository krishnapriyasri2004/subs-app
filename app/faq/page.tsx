import React from 'react';

const faqs = [
  { q: 'How does the free trial work?', a: 'Start with a 14-day free trial — no card required. You can upgrade anytime.' },
  { q: 'Is invoicing GST compliant?', a: 'Yes — smart invoicing supports GST fields and export for accounting.' },
  { q: 'Which payment gateways are supported?', a: 'Stripe, PayPal, Razorpay, and more via plugins.' },
  { q: 'Do you support usage-based billing?', a: 'Yes — meter usage, bill per unit, and configure add-ons.' },
  { q: 'Can I have multiple tenants?', a: 'Multi-tenant and team management are included in Growth and Enterprise plans.' },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/90 flex items-center justify-center text-primary-foreground font-bold">S</div>
          <div className="text-lg font-semibold">Subscription Studio</div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold">Frequently asked questions</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="card-elevated p-4">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <div className="mt-2 text-sm text-muted-foreground">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
