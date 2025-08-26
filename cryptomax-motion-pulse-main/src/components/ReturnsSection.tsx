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
      minInvestment: "$1,000",
      monthlyReturn: "12%",
      features: [
        "12% Fixed Monthly Returns",
        "24/7 Portfolio Monitoring",
        "Basic Analytics Dashboard",
        "Email Support",
        "Secure Cold Storage"
      ],
      popular: false
    },
    {
      name: "Professional Plan",
      minInvestment: "$5,000",
      monthlyReturn: "14%",
      features: [
        "14% Fixed Monthly Returns",
        "Priority Trading Algorithms",
        "Advanced Analytics Suite",
        "Dedicated Account Manager",
        "Insurance Coverage",
        "Mobile App Access"
      ],
      popular: true
    },
    {
      name: "Elite Plan",
      minInvestment: "$25,000",
      monthlyReturn: "15%",
      features: [
        "15% Fixed Monthly Returns",
        "Exclusive Trading Strategies",
        "White-Glove Service",
        "Private Investment Advisor",
        "Risk Management Tools",
        "Priority Withdrawals",
        "VIP Support Channel"
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary border border-primary/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Consistent Performance</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Predictable{" "}
            <span className="gradient-text">Monthly Returns</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how your investment grows with our proven track record of delivering 
            consistent monthly returns to our investors.
          </p>
        </div>

        {/* Growth Visualization */}
        <div className="bg-secondary/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">
            $10,000 Investment Growth Over 6 Months
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {monthlyGrowth.map((data, index) => (
              <div key={index} className="text-center bg-background/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">{data.month}</div>
                <div className="text-lg font-bold text-primary">${data.amount.toLocaleString()}</div>
                <div className="text-xs text-green-400 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +${data.profit}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 p-4 bg-primary/10 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Profit After 6 Months</div>
            <div className="text-3xl font-bold text-primary">+$7,623</div>
            <div className="text-sm text-green-400">76.23% Total Return</div>
          </div>
        </div>

        {/* Brand strip near Investment Plans */}
        <div className="relative z-10 border-y border-border/30 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 rounded-xl overflow-hidden mb-12">
          <CryptoMarquee speedMs={25000} />
        </div>

        {/* Investment Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {investmentPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-8 hover-lift ${
                plan.popular 
                  ? 'border-primary/50 bg-gradient-to-b from-primary/10 to-secondary/50' 
                  : 'bg-secondary/50 border-primary/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary mb-1">{plan.monthlyReturn}</div>
                <div className="text-sm text-muted-foreground">Monthly Returns</div>
                <div className="text-lg font-semibold mt-2">
                  Min. Investment: {plan.minInvestment}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "hero" : "outline-neon"} 
                className="w-full"
              >
                Choose {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        {/* Reviews Marquee */}
        <div className="mt-16">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-secondary border border-primary/20 rounded-full px-4 py-2 mb-4">
              <span className="text-sm text-muted-foreground">Trusted by US-based clients</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">What Our Clients Say</h3>
          </div>
          <div className="relative z-10 border-y border-border/30 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 rounded-xl overflow-hidden">
            <ReviewsMarquee speedMs={32000} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            All returns are calculated based on our proprietary trading algorithms and market analysis.
          </p>
          <Button variant="outline-neon" size="lg">
            <BarChart3 className="mr-2 h-5 w-5" />
            View Detailed Performance Reports
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReturnsSection;