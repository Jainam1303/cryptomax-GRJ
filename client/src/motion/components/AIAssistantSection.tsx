import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Lightbulb, Brain, Sparkles, TrendingUp, Calendar } from "lucide-react";

const AIAssistantSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Introducing CryptoMax Cortex, coming Fall 2025</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Meet your AI
                <br />
                <span className="text-muted-foreground">research assistant</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Harness AI, real-time news, and set your price/time target to 
                explore trades that fit your strategies.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-secondary/50 border-primary/10 p-6 hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Smart Analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered market analysis with real-time insights and trend predictions.
                </p>
              </Card>

              <Card className="bg-secondary/50 border-primary/10 p-6 hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Strategy Builder</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Build custom investment strategies tailored to your risk profile.
                </p>
              </Card>
            </div>
          </div>

          {/* Right - Mobile App Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-gray-900 rounded-[2.5rem] p-6 relative overflow-hidden">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center text-white text-sm mb-6">
                  <span>9:12</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* App Content */}
                <div className="text-white space-y-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-2">+ 4 insights available</div>
                  </div>

                  {/* Dots Pattern Background */}
                  <div className="relative h-48 bg-gray-800 rounded-2xl p-6 overflow-hidden">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle, rgba(34, 197, 94, 0.3) 2px, transparent 2px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                    
                    {/* Investment Points */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className="space-y-8">
                        {/* Green dots (profits) */}
                        <div className="flex justify-center gap-4">
                          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        </div>
                        
                        {/* Orange dots (opportunities) */}
                        <div className="flex justify-center gap-6">
                          <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                          <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;