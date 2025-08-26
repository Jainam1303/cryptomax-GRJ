import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CryptoMarquee from "@/components/CryptoMarquee";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";

const ReturnsSection = () => {
  const investmentPlans = [
    {
      name: "Starter Plan",
      investmentRange: "$100 – $500",
      dailyReturn: "1.0%",
      days: 7,
      totalReturn: "7%",
      features: [
        "Fixed daily yield",
        "Short 7-day duration",
        "Beginner friendly",
        "Secure cold storage",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Growth Plan",
      investmentRange: "$500 – $2,000",
      dailyReturn: "1.5%",
      days: 14,
      totalReturn: "21%",
      features: [
        "1.5% daily returns",
        "14-day compounding period",
        "Priority strategies",
        "Advanced analytics",
        "Mobile app access"
      ],
      popular: true
    },
    {
      name: "Premium Plan",
      investmentRange: "$2,000 – $5,000",
      dailyReturn: "2.0%",
      days: 21,
      totalReturn: "42%",
      features: [
        "Higher daily yield",
        "21-day duration",
        "Dedicated advisor",
        "Risk management tools",
        "Priority withdrawals"
      ],
      popular: false
    }
  ];

  const monthlyGrowth = [
    { month: "Jan", amount: 10000, profit: 1200 },
    { month: "Feb", amount: 11200, profit: 1344 },
    { month: "Mar", amount: 12544, profit: 1505 },
    { month: "Apr", amount: 14049, profit: 1686 },
    { month: "May", amount: 15735, profit: 1888 },
    { month: "Jun", amount: 17623, profit: 2115 }
  ];

  return (
    <section id="returns" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-neutral-400">Consistent Performance</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Predictable{" "}
            <span className="gradient-text">Daily Returns</span>
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            See how your investment grows with our proven track record of delivering 
            consistent daily returns to our investors.
          </p>
        </div>

        {/* Growth Visualization */}
        <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">
            $10,000 Investment Growth Over 6 Months
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {monthlyGrowth.map((data, index) => (
              <div key={index} className="text-center bg-neutral-800/50 rounded-lg p-4">
                <div className="text-sm text-neutral-400 mb-1">{data.month}</div>
                <div className="text-lg font-bold text-emerald-400">${data.amount.toLocaleString()}</div>
                <div className="text-xs text-green-400 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +${data.profit}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 p-4 bg-neutral-800 rounded-lg">
            <div className="text-sm text-neutral-400">Total Profit After 6 Months</div>
            <div className="text-3xl font-bold text-emerald-400">+$7,623</div>
            <div className="text-sm text-green-400">76.23% Total Return</div>
          </div>
        </div>

        {/* Brand strip near Investment Plans */}
        <div className="relative z-10 border-y border-neutral-800 bg-neutral-900/40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/30 rounded-xl overflow-hidden mb-12">
          <CryptoMarquee speedMs={25000} />
        </div>

        {/* Investment Plans (Daily) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {investmentPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-8 hover-lift bg-neutral-900/60 border border-neutral-800 ${
                plan.popular ? 'ring-1 ring-emerald-500/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-emerald-400 mb-1">{plan.dailyReturn}</div>
                <div className="text-sm text-neutral-400">Daily Return</div>
                <div className="text-sm text-neutral-400 mt-1">Duration: <span className="font-semibold text-neutral-200">{plan.days} days</span></div>
                <div className="text-sm text-neutral-400">Total: <span className="font-semibold text-neutral-200">{plan.totalReturn}</span></div>
                <div className="text-lg font-semibold mt-2">
                  Investment Range: {plan.investmentRange}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={"w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)]"}
              >
                Choose {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Reviews Marquee */}
        <div className="mt-16">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full px-4 py-2 mb-4">
              <span className="text-sm text-neutral-400">Trusted by US-based clients</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">What Our Clients Say</h3>
          </div>
          <div className="relative z-10 border-y border-neutral-800 bg-neutral-900/40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/30 rounded-xl overflow-hidden">
            <ReviewsMarquee speedMs={32000} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-neutral-400 mb-6">
            All returns are calculated based on our proprietary trading algorithms and market analysis.
          </p>
          <Button variant="outline" size="lg" className="border-neutral-800 text-neutral-300 hover:bg-neutral-800/40">
            <BarChart3 className="mr-2 h-5 w-5" />
            View Detailed Performance Reports
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReturnsSection;