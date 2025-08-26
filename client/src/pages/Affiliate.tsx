import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wallet, Link as LinkIcon, Gift, CheckCircle, ArrowRight } from "lucide-react";

const Affiliate = () => {
  const perks = [
    {
      icon: Wallet,
      title: "Earn Commission",
      desc: "Get 10% recurring commission on platform fees from every client you refer for 12 months.",
      badge: "10% Recurring"
    },
    {
      icon: Gift,
      title: "One-Time Bonus",
      desc: "Earn a $100 bonus for each qualified client who deposits at least $1,000 within 30 days.",
      badge: "$100 Bonus"
    },
    {
      icon: Users,
      title: "Partner Support",
      desc: "Dedicated partner manager, ready-made creatives, and tracking dashboard (coming soon).",
      badge: "Priority"
    }
  ];

  const steps = [
    { title: "Apply", desc: "Submit your details so we can approve your affiliate profile." },
    { title: "Share", desc: "Get your unique referral link and share it with your audience." },
    { title: "Earn", desc: "Track signups and commissions. Payouts made monthly." }
  ];

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-hidden pt-16">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full px-4 py-2 mb-6">
              <LinkIcon className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-neutral-400">Partner with CryptoMax</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">CryptoMax</span> Affiliate Program</h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Refer new investors to CryptoMax and earn industry-leading commissions. It’s free to join.
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {perks.map((p, i) => (
              <Card key={i} className="p-6 bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <p.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{p.badge}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-neutral-400">{p.desc}</p>
              </Card>
            ))}
          </div>

          {/* How it works */}
          <Card className="p-8 bg-neutral-900/60 border border-neutral-800 mb-12">
            <h2 className="text-2xl font-bold mb-6">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, idx) => (
                <div key={idx} className="rounded-lg bg-neutral-900/40 p-5 border border-neutral-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold">Step {idx + 1}: {s.title}</span>
                  </div>
                  <p className="text-sm text-neutral-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Referral Workflow with referral codes */}
          <Card className="p-8 bg-neutral-900/60 border border-neutral-800 mb-12">
            <h2 className="text-2xl font-bold mb-6">Referral Workflow (with codes)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="rounded-lg bg-neutral-900/40 p-5 border border-neutral-800/60">
                  <h3 className="font-semibold mb-1">1) Get your referral code</h3>
                  <p className="text-sm text-neutral-400">
                    Once approved, you’ll receive a unique code like <span className="font-mono">MAX-7F3K9</span> and a trackable link: 
                    <span className="font-mono"> https://cryptomax.com/?ref=MAX-7F3K9</span>.
                  </p>
                </div>
                <div className="rounded-lg bg-neutral-900/40 p-5 border border-neutral-800/60">
                  <h3 className="font-semibold mb-1">2) Share your link or code</h3>
                  <p className="text-sm text-neutral-400">
                    Share it on your site, socials, or directly with clients. We store the ref in a browser cookie for 30 days.
                  </p>
                </div>
                <div className="rounded-lg bg-neutral-900/40 p-5 border border-neutral-800/60">
                  <h3 className="font-semibold mb-1">3) Client enters code in dashboard</h3>
                  <p className="text-sm text-neutral-400">
                    New users sign up and open their dashboard. In the <strong>Settings → Referral</strong> panel, they paste your code to link their account to you.
                  </p>
                </div>
                <div className="rounded-lg bg-neutral-900/40 p-5 border border-neutral-800/60">
                  <h3 className="font-semibold mb-1">4) Commission & payout</h3>
                  <p className="text-sm text-neutral-400">
                    You earn <strong>10% recurring commission</strong> on platform fees for 12 months per linked client. Payouts are processed monthly.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-neutral-900/50 p-6 border border-neutral-800">
                <h4 className="font-semibold mb-3">Example</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between bg-neutral-900/40 rounded-md p-3 border border-neutral-800/60">
                    <span>Your Code</span>
                    <code className="font-mono">MAX-7F3K9</code>
                  </div>
                  <div className="flex items-center justify-between bg-neutral-900/40 rounded-md p-3 border border-neutral-800/60">
                    <span>Share Link</span>
                    <code className="font-mono">cryptomax.com/?ref=MAX-7F3K9</code>
                  </div>
                  <div className="rounded-md p-3 bg-neutral-900/30 border border-neutral-800/60">
                    After signup, clients go to <strong>Dashboard → Settings → Referral</strong> and enter <code className="font-mono">MAX-7F3K9</code>.
                  </div>
                  <ul className="list-disc pl-5 text-neutral-400">
                    <li>Cookie window: 30 days</li>
                    <li>Payouts: monthly, minimum $50</li>
                    <li>Fraud checks apply</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="group bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_12px_rgba(34,197,94,0.45)]">
              <a href="mailto:partners@cryptomax.com?subject=Affiliate%20Application&body=Hi%20CryptoMax%2C%0A%0AI'd%20like%20to%20join%20the%20affiliate%20program.%20Here%20are%20my%20details%3A%0A-%20Name%3A%0A-%20Email%3A%0A-%20Audience%2FLinks%3A%0A-%20Estimated%20monthly%20reach%3A%0A%0AThanks!">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">We review most applications within 2 business days.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Affiliate;
