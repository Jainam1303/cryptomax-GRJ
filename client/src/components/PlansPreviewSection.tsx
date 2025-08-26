import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/Badge';

const plans = [
  {
    name: 'Starter Plan',
    days: 7,
    daily: 1.0,
    total: 7.0,
    range: '$100 – $500',
    highlight: false,
  },
  {
    name: 'Growth Plan',
    days: 14,
    daily: 1.5,
    total: 21.0,
    range: '$500 – $2,000',
    highlight: true,
  },
  {
    name: 'Premium Plan',
    days: 21,
    daily: 2.0,
    total: 42.0,
    range: '$2,000 – $5,000',
    highlight: false,
  },
];

const PlansPreviewSection: React.FC = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-black/90 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Popular Investment Plans</h2>
          <p className="mt-2 text-neutral-400">Fixed daily returns, short durations, and transparent ranges.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border bg-neutral-900/60 backdrop-blur-md p-6 md:p-8 transition-shadow ${
                p.highlight
                  ? 'border-emerald-600/50 shadow-lg shadow-emerald-900/20'
                  : 'border-neutral-800 hover:shadow-lg hover:shadow-black/20'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-1 text-xs font-bold">
                    MOST POPULAR
                  </Badge>
                </div>
              )}

              <h3 className="text-xl font-bold mb-4">{p.name}</h3>

              <div className="grid grid-cols-3 gap-3 text-center mb-6">
                <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-3">
                  <div className="text-2xl font-extrabold text-green-500">{p.daily}%</div>
                  <div className="text-xs text-neutral-400">Daily Return</div>
                </div>
                <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-3">
                  <div className="text-2xl font-extrabold text-blue-500">{p.days}</div>
                  <div className="text-xs text-neutral-400">Days</div>
                </div>
                <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-3">
                  <div className="text-2xl font-extrabold text-orange-500">{p.total}%</div>
                  <div className="text-xs text-neutral-400">Total Return</div>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-lg p-3 mb-6">
                <p className="text-sm">Investment Range: <span className="font-semibold text-neutral-200">{p.range}</span></p>
              </div>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
              >
                <a href="/crypto">Explore & Invest</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansPreviewSection;
