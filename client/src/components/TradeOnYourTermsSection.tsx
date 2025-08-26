import { Button } from "@/components/ui/button";
import { Clock, Globe, Shield, Headphones, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TradeOnYourTermsSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Blue gradient background like Robinhood */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-blue-400/10 to-background"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-500/30 via-blue-400/20 to-transparent rounded-t-[100px]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-12">
          
          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-bold leading-tight text-center">
              <span className="gradient-text">Trade on your time</span>
              <br />
              and your terms.
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We have 24/7 support. Oh, and no commission fees on stocks, ETFs, and their options.
              Your first stock is even on us.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>Limitations and risks apply</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="py-8">
            <Link to="/login">
              <Button size="lg" className="text-lg px-12 py-6 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                Get started
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-16">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Trading</h3>
              <p className="text-muted-foreground text-sm">
                Trade cryptocurrencies around the clock, even when traditional markets are closed.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Global Markets</h3>
              <p className="text-muted-foreground text-sm">
                Access global cryptocurrency markets with real-time data and instant execution.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Zero Fees</h3>
              <p className="text-muted-foreground text-sm">
                No commission fees on cryptocurrency trades. Keep more of your profits.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-muted-foreground text-sm">
                24/7 customer support from cryptocurrency and investment experts.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="pt-16 space-y-8">
            <h3 className="text-3xl font-bold">Why Choose CryptoMax?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold">Instant Execution</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast trade execution with advanced order types and market data.
                </p>
              </div>

              <div className="bg-secondary/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold">Bank-Level Security</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your assets are protected with military-grade encryption and cold storage.
                </p>
              </div>

              <div className="bg-secondary/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold">Mobile First</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full-featured mobile app for trading and portfolio management on the go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 right-16 w-6 h-6 bg-primary/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300/40 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default TradeOnYourTermsSection;