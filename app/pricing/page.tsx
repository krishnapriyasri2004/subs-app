import React from 'react';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/90 flex items-center justify-center text-primary-foreground font-bold">S</div>
          <div className="text-lg font-semibold">Subscription Studio</div>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/vendor/auth" className="btn-sm">Sign in</a>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">Simple, transparent pricing</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Choose a plan that grows with you — billing, metering, and revenue analytics built-in.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="card-elevated p-6">
            <div className="text-sm font-semibold">Starter</div>
            <div className="mt-4 text-2xl font-bold">$0</div>
            <div className="text-sm text-muted-foreground mt-2">Up to 100 customers • Email support</div>
            <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
              <li>Recurring billing</li>
              <li>Basic invoicing</li>
              <li>Revenue snapshot</li>
            </ul>
            <div className="mt-6">
              <a className="btn-sm bg-primary text-primary-foreground" href="/vendor/auth">Start free</a>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="text-sm font-semibold">Growth</div>
            <div className="mt-4 text-2xl font-bold">$49/mo</div>
            <div className="text-sm text-muted-foreground mt-2">Advanced billing • 24/7 support</div>
            <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
              <li>Smart invoicing (GST ready)</li>
              <li>Usage & add-ons</li>
              <li>MRR & churn analytics</li>
            </ul>
            <div className="mt-6">
              <a className="btn-sm bg-primary text-primary-foreground" href="/vendor/auth">Start trial</a>
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="text-sm font-semibold">Enterprise</div>
            <div className="mt-4 text-2xl font-bold">Custom</div>
            <div className="text-sm text-muted-foreground mt-2">SLA, dedicated support, on-prem options</div>
            <ul className="mt-4 text-sm space-y-2 text-muted-foreground">
              <li>Multi-tenant controls</li>
              <li>Multiple gateways</li>
              <li>Custom integrations</li>
            </ul>
            <div className="mt-6">
              <a className="btn-sm border border-border" href="/book-demo">Contact sales</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Subscription Studio</div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
