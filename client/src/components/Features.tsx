import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Clock, 
  BarChart3, 
  Users,
  Zap,
  Target,
  ArrowRight
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: DollarSign,
      title: "Fixed Monthly Returns",
      description: "Earn consistent 12-15% monthly returns on your cryptocurrency investments with our proven strategies.",
      highlight: "12-15% Monthly"
    },
    {
      icon: TrendingUp,
      title: "Advanced AI Trading",
      description: "Our sophisticated AI algorithms analyze market trends 24/7 to maximize your investment potential.",
      highlight: "AI-Powered"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your investments are protected with military-grade encryption and multi-layer security protocols.",
      highlight: "100% Secure"
    },
    {
      icon: Clock,
      title: "Real-Time Monitoring",
      description: "Track your investments and returns in real-time with our comprehensive dashboard and mobile app.",
      highlight: "24/7 Access"
    },
    {
      icon: BarChart3,
      title: "Transparent Analytics",
      description: "Get detailed insights into your portfolio performance with advanced analytics and reporting tools.",
      highlight: "Full Transparency"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our team of crypto experts and financial advisors are available 24/7 to help optimize your investments.",
      highlight: "Expert Team"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 animated-dots opacity-10"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-neutral-400">Why Choose CryptoMax</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for the Modern{" "}
            <span className="gradient-text">Crypto Investor</span>
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Experience the future of cryptocurrency investing with our cutting-edge platform 
            designed to maximize your returns while minimizing risk.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 p-6 hover-lift group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/15 rounded-lg group-hover:bg-emerald-500/25 transition-colors">
                  <feature.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-neutral-800 px-2 py-1 rounded-full border border-neutral-700">
                  {feature.highlight}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-neutral-900/60 rounded-2xl p-12 border border-neutral-800">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Start Earning?
          </h3>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied investors who are already earning consistent monthly returns 
            with CryptoMax. Start your journey to financial freedom today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)]">
              Start Investing Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-neutral-800 text-neutral-300 hover:bg-neutral-800/40">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 w-3 h-3 bg-emerald-500/30 rounded-full float-animation"></div>
      <div className="absolute bottom-1/3 left-16 w-4 h-4 bg-emerald-400/25 rounded-full float-animation" style={{animationDelay: '1.5s'}}></div>
    </section>
  );
};

export default Features;