import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Smartphone, 
  PieChart, 
  TrendingUp, 
  Target, 
  Calendar,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react";

const MobileAppSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-800/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Mobile Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-gray-900 rounded-[2.5rem] p-6 relative overflow-hidden">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center text-white text-sm mb-6">
                  <span>9:12</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Portfolio Header */}
                <div className="text-white mb-6">
                  <div className="text-sm text-gray-400 mb-2">BTC</div>
                  <div className="text-2xl font-bold mb-1">Bitcoin</div>
                  <div className="text-xl font-semibold mb-2">$67,540.25</div>
                  
                  {/* Performance indicators */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>+$842 (1.26%) Today</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>+$156 (0.23%) Overnight</span>
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="relative h-48 bg-gray-800 rounded-xl mb-6 p-4">
                  {/* Simple line chart representation */}
                  <div className="relative h-full">
                    <svg className="w-full h-full" viewBox="0 0 300 150">
                      <path
                        d="M 20 120 Q 80 100 120 80 Q 160 60 200 40 Q 240 30 280 20"
                        stroke="#22c55e"
                        strokeWidth="2"
                        fill="none"
                        className="animate-pulse"
                      />
                      <circle cx="280" cy="20" r="3" fill="#22c55e" className="animate-pulse" />
                    </svg>
                  </div>
                  
                  {/* Time period buttons */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 text-xs">
                    <span className="text-green-400 bg-green-400/20 px-2 py-1 rounded">1D</span>
                    <span className="text-gray-400">1W</span>
                    <span className="text-gray-400">1M</span>
                    <span className="text-gray-400">3M</span>
                    <span className="text-gray-400">1Y</span>
                    <span className="text-gray-400">ALL</span>
                  </div>
                </div>

                {/* Bottom notification */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="text-white text-sm">
                    <div className="font-semibold mb-1">March 15, 2025</div>
                    <div className="text-gray-300 text-xs">We added 10% to value stocks.</div>
                    <div className="text-gray-400 text-xs mt-2">
                      We believe the market is more sensitive to current valuations and earnings are already expected to be robust.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -top-6 -left-6 bg-secondary/90 backdrop-blur-sm border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-semibold">Live Trading</div>
                  <div className="text-xs text-muted-foreground">+$2,847 today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold gradient-text">CryptoMax Strategies</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Get the 'why' behind the
                <br />
                <span className="text-muted-foreground">'how' of every investment</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Get an expert managed portfolio and timely market insights. 
                CryptoMax Gold members unlock zero management fees on every 
                dollar over $100K.
              </p>

              <div className="text-sm text-muted-foreground">
                Terms apply. Gold subscription $5/month.
              </div>

              <Button variant="hero" size="lg" className="rounded-full">
                Get started
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <Card className="bg-secondary/50 border-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <PieChart className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Portfolio Analytics</div>
                    <div className="text-xs text-muted-foreground">Real-time insights</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-secondary/50 border-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Smart Strategies</div>
                    <div className="text-xs text-muted-foreground">AI-powered decisions</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
    </section>
  );
};

export default MobileAppSection;