import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Minus, Loader2, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInvestment } from '../context/InvestmentContext';
import { useAuth } from '../context/AuthContext';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCrypto } from '../context/CryptoContext';

const PortfolioPage: React.FC = () => {
  const { investments, portfolio, loading, getPortfolio, getInvestments } = useInvestment();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance'>('overview');
  const { tickerCryptos } = useCrypto();

  useEffect(() => {
    getPortfolio();
    getInvestments();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Active holdings: always filter to status==='active' to be safe (backend or mock mode)
  const activeInvestments = (portfolio?.investments && Array.isArray(portfolio.investments))
    ? portfolio.investments.filter(inv => inv.status === 'active')
    : investments.filter(inv => inv.status === 'active');

  // Helper to get live price for a crypto
  const getLivePrice = (cryptoId: string, fallback: number) => {
    const ticker = tickerCryptos.find(c => c._id === cryptoId);
    return ticker ? ticker.currentPrice : fallback;
  };

  // Portfolio summary using backend data (subscription-based)
  const portfolioData = portfolio?.summary || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0
  };

  const isProfitable = portfolioData.totalProfitLoss >= 0;

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Navigation */}
      <nav className="bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-12 h-12 rounded-lg" />
                <span className="text-xl font-bold gradient-text">
                  CryptoMax
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your investment performance and manage your holdings.</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-muted-foreground">Total Invested</div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${portfolioData.totalInvested.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Initial investment</p>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-muted-foreground">Current Value</div>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${portfolioData.totalCurrentValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Subscription value</p>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-muted-foreground">Total P&L</div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`text-2xl font-bold ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{portfolioData.totalProfitLoss >= 0 ? '+' : ''}${portfolioData.totalProfitLoss.toLocaleString()}</div>
            <div className={`flex items-center text-sm mt-1 ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{portfolioData.totalProfitLoss >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}{portfolioData.totalProfitLossPercentage.toFixed(2)}%</div>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-muted-foreground">Holdings</div>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary">
              {activeInvestments?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active positions</p>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between px-6 pt-6">
            <div className="text-sm font-medium text-foreground">
              Your Holdings
            </div>
            <Link to="/crypto">
              <Button variant="outline" size="sm" className="border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-800">Invest More</Button>
            </Link>
          </div>
          <div className="space-y-4 p-6 pt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {activeInvestments && activeInvestments.length > 0 ? (
                  activeInvestments.map((investment) => {
                    // Use backend-calculated values for subscription investments
                    const currentValue = investment.currentValue || investment.amount;
                    const profitLoss = investment.profitLoss || 0;
                    const profitLossPercentage = investment.profitLossPercentage || 0;
                    
                    return (
                      <div key={investment._id} className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800/60 transition-colors">
                        <div className="flex items-center space-x-4">
                          {investment.crypto.image ? (
                            <img
                              src={investment.crypto.image}
                              alt={investment.crypto.symbol}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : investment.crypto.symbol === 'BTC' ? (
                            <img
                              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                              alt="Bitcoin"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{investment.crypto.symbol[0]}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-foreground">{investment.crypto.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {investment.investmentPlan?.name || 'Subscription Plan'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Invested</div>
                          <div className="font-semibold text-foreground">${investment.amount.toLocaleString()}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Current Value</div>
                          <div className="font-semibold text-green-600">${currentValue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {investment.dailyReturnPercentage}% daily return
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">P&L</div>
                          <div className={`font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Badge className={`${profitLoss >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {profitLoss >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">Status</div>
                          <Badge className={`mb-2 ${
                            investment.status === 'active' ? 'bg-green-100 text-green-700' : 
                            investment.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {investment.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {investment.status === 'active' ? 'Earning daily returns' : 
                             investment.status === 'completed' ? 'Maturity reached' : 
                             'Investment ended'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No investments yet. Start building your portfolio!</p>
                    <Link to="/crypto">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        Start Investing
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>


      </div>
    </div>
  );
};

export default PortfolioPage;