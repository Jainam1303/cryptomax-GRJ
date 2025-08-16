import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Minus, Loader2, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInvestment } from '../context/InvestmentContext';
import { useAuth } from '../context/AuthContext';
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Warning for zero amount or quantity
  const zeroInvestments = investments.filter(inv => inv.amount === 0 || inv.quantity === 0);
  if (zeroInvestments.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Data Warning</h2>
          <p>Some investments have zero amount or quantity. Please contact support or check backend data integrity.</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CM</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CryptoMax
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Track your investment performance and manage your holdings.</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Total Invested</div>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${portfolioData.totalInvested.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Initial investment</p>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Current Value</div>
              <PieChart className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${portfolioData.totalCurrentValue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">Subscription value</p>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Total P&L</div>
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <div className={`text-2xl font-bold ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{portfolioData.totalProfitLoss >= 0 ? '+' : ''}${portfolioData.totalProfitLoss.toLocaleString()}</div>
            <div className={`flex items-center text-sm mt-1 ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>{portfolioData.totalProfitLoss >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}{portfolioData.totalProfitLossPercentage.toFixed(2)}%</div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium text-gray-600">Holdings</div>
              <PieChart className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {investments?.length || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Active positions</p>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900">
              Your Holdings
            </div>
            <Link to="/crypto">
              <Button variant="outline" size="sm">Invest More</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {investments && investments.length > 0 ? (
                  investments.map((investment) => {
                    // Use backend-calculated values for subscription investments
                    const currentValue = investment.currentValue || investment.amount;
                    const profitLoss = investment.profitLoss || 0;
                    const profitLossPercentage = investment.profitLossPercentage || 0;
                    
                    return (
                      <div key={investment._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
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
                            <div className="font-semibold text-gray-900">{investment.crypto.name}</div>
                            <div className="text-sm text-gray-500">
                              {investment.investmentPlan?.name || 'Subscription Plan'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Invested</div>
                          <div className="font-semibold text-gray-900">${investment.amount.toLocaleString()}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Current Value</div>
                          <div className="font-semibold text-green-600">${currentValue.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">
                            {investment.dailyReturnPercentage}% daily return
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">P&L</div>
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
                          <div className="text-sm text-gray-500 mb-2">Status</div>
                          <Badge className={`mb-2 ${
                            investment.status === 'active' ? 'bg-green-100 text-green-700' : 
                            investment.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {investment.status}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {investment.status === 'active' ? 'Earning daily returns' : 
                             investment.status === 'completed' ? 'Maturity reached' : 
                             'Investment ended'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
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