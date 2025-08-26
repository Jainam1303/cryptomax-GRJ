import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Button } from '../components/ui/button';
import Card from '../components/ui/card';
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Wallet, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">CryptoMax</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </a>
                <a href="#about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </a>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:text-gray-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Maximize Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Crypto{" "}
              </span>
              Potential
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced cryptocurrency tracking, portfolio management, and investment insights. Take control of your
              digital assets with professional-grade tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/invest">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                      Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
                    >
                      View Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                      Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-pulse">
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₿</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Bitcoin</p>
                  <p className="text-green-400 text-xs">+5.2%</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="absolute top-40 right-10 animate-pulse delay-1000">
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Ethereum</p>
                  <p className="text-green-400 text-xs">+3.8%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features for Crypto Traders</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to track, analyze, and optimize your cryptocurrency investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Real-time Analytics</p>
              <p className="text-gray-300">
                Advanced charts and analytics to track your portfolio performance in real-time
              </p>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Portfolio Management</p>
              <p className="text-gray-300">
                Comprehensive portfolio tracking with detailed insights and performance metrics
              </p>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Smart Alerts</p>
              <p className="text-gray-300">
                Get notified about price movements, market trends, and investment opportunities
              </p>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Secure Trading</p>
              <p className="text-gray-300">
                Bank-level security with encrypted transactions and secure wallet integration
              </p>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Lightning Fast</p>
              <p className="text-gray-300">
                Execute trades in milliseconds with our optimized trading engine
              </p>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-white">Community Insights</p>
              <p className="text-gray-300">
                Learn from experienced traders and share insights with the community
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">$2.5B+</div>
              <div className="text-gray-300">Total Volume Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">150K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Supported Coins</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Maximize Your Crypto Portfolio?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of traders who trust CryptoMax for their cryptocurrency investments
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">CryptoMax</h3>
              <p className="text-gray-300 text-sm">
                The ultimate platform for cryptocurrency trading and portfolio management.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/invest" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; 2024 CryptoMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;