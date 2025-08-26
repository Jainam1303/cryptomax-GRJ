import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Using images from public/; reference as "/placeholder.svg" or add your own images there

const About = () => {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-hidden pt-16">
      <Navbar />
      {/* Hero */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 via-neutral-900/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About <span className="gradient-text">CryptoMax</span></h1>
          <p className="mt-4 max-w-3xl text-neutral-300">
            We’re building a modern crypto investing experience with simple plans, predictable daily returns, and
            transparent performance. We use AI‑driven models to analyze market data, automate entries and exits, and
            optimize risk so you can pursue consistent outcomes with bank‑grade security and delightful UX.
          </p>
        </div>
      </section>

      {/* Vision • Aim • Mission (images above each card) */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6 grid gap-6 md:grid-cols-3">
          {/* Vision */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <img
              src="/images/chart-line.svg"
              alt="Growth line chart"
              className="w-full h-40 object-cover bg-neutral-950 border-b border-neutral-800"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                We envision crypto investing that feels approachable and trustworthy. Clear plans, transparent metrics,
                and reliable outcomes—so you always know what you’re choosing and why it fits your goals.
              </p>
            </div>
          </div>

          {/* Aim */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <img
              src="/images/growth-bars.svg"
              alt="Growing bar chart"
              className="w-full h-40 object-cover bg-neutral-950 border-b border-neutral-800"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Aim</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Deliver straightforward fixed-daily plans with 7‑day gaps, fair investment ranges, and automatic
                maturity payouts—reducing friction from deposit to earnings so you can focus on your strategy.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <img
              src="/images/candles.svg"
              alt="Candlestick chart"
              className="w-full h-40 object-cover bg-neutral-950 border-b border-neutral-800"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Empower every investor with bank‑grade security, transparent reporting, and delightful UX. We’re
                committed to clarity at each step—from selecting a plan to receiving your payout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
              <div className="text-3xl font-extrabold">50k+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-neutral-400">Active Users</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
              <div className="text-3xl font-extrabold">$120M+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-neutral-400">Assets Tracked</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
              <div className="text-3xl font-extrabold">99.9%</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-neutral-400">Payout Success</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
              <div className="text-3xl font-extrabold">120+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-neutral-400">Countries</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
