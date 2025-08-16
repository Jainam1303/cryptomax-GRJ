import { useState } from 'react';
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Shield, Zap, BarChart3, Wallet, Users, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isLoggedIn] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Investments",
      description: "AI-powered portfolio optimization with real-time market analysis"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Advanced encryption and multi-factor authentication protect your assets"
    },
    {
      icon: Zap,
      title: "Instant Trading",
      description: "Execute trades in milliseconds with our high-performance engine"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Professional-grade charts and market insights at your fingertips"
    }
  ];

  const cryptos = [
    { name: "Bitcoin", symbol: "BTC", price: "$43,250", change: "+2.45%", positive: true },
    { name: "Ethereum", symbol: "ETH", price: "$2,380", change: "+1.23%", positive: true },
    { name: "Solana", symbol: "SOL", price: "$98.50", change: "-0.87%", positive: false },
    { name: "Cardano", symbol: "ADA", price: "$0.45", change: "+3.21%", positive: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CryptoMax
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#markets" className="text-gray-600 hover:text-blue-600 transition-colors">Markets</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            </div>

            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              ) : (
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 100,000+ investors
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Invest in Crypto with
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Maximum Confidence
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional-grade cryptocurrency investment platform with advanced analytics, 
              AI-powered insights, and bank-level security. Start building your digital wealth today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8">
                <Link to="/register">
                  Start Investing Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 hover:border-blue-300">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Crypto Prices */}
      <section id="markets" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Market Prices</h2>
            <p className="text-gray-600">Real-time cryptocurrency prices updated every second</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptos.map((crypto, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
                    <p className="text-sm text-gray-500">{crypto.symbol}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{crypto.symbol[0]}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{crypto.price}</span>
                  <Badge className={crypto.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {crypto.change}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CryptoMax?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for serious investors who demand the best tools, security, and performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">$2.5B+</div>
              <div className="text-blue-100">Assets Under Management</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100K+</div>
              <div className="text-blue-100">Active Investors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Crypto Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of investors who trust CryptoMax with their digital assets
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8">
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 hover:border-blue-300">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CM</span>
                </div>
                <span className="text-xl font-bold">CryptoMax</span>
              </div>
              <p className="text-gray-400">
                Professional cryptocurrency investment platform for modern investors.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CryptoMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
