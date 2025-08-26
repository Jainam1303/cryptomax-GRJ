import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Award, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background Pattern - Exactly like Robinhood */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite'
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: 'float 15s linear infinite reverse'
        }}></div>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full px-6 py-3 mb-12 animate-slide-up backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <Users className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">Trusted by 50,000+ investors worldwide</span>
          </div>

          {/* Main Heading - Robinhood Style */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-slide-up leading-tight">
            Join a new generation
            <br />
            <span className="gradient-text">of investors</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-neutral-400 mb-16 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Experience the future of cryptocurrency investing with guaranteed monthly returns 
            and cutting-edge AI technology.
          </p>

          {/* CTA Button */}
          <div className="animate-slide-up mb-20">
            <Link to="/login">
              <Button size="lg" className="text-lg px-12 py-6 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                Get started
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full mb-4 mx-auto">
                <Star className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 mb-2">15%</h3>
              <p className="text-neutral-400">Max Monthly Returns</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full mb-4 mx-auto">
                <Users className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 mb-2">50K+</h3>
              <p className="text-neutral-400">Active Investors</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full mb-4 mx-auto">
                <Award className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 mb-2">100%</h3>
              <p className="text-neutral-400">Secure Platform</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-neutral-800 rounded-full mb-4 mx-auto">
                <Smartphone className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 mb-2">24/7</h3>
              <p className="text-neutral-400">Mobile Access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;