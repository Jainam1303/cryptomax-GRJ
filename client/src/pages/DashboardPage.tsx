import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Plus, LogOut, Search, CreditCard, BarChart2, User, Settings, Shield } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { useInvestment } from '../context/InvestmentContext';
import { useDispatch, useSelector } from 'react-redux';
import { getWallet, getTransactions } from '../redux/thunks/walletThunks';
import { getPortfolio, getInvestments } from '../redux/thunks/investmentThunks';
import { getCryptos, getMarketData } from '../redux/thunks/cryptoThunks';
import { useCrypto } from '../context/CryptoContext';
import { useState } from 'react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const wallet = useSelector((state: any) => state.wallet.wallet);
  const transactions = useSelector((state: any) => state.wallet.transactions);
  const portfolio = useSelector((state: any) => state.investment.portfolio);
  const investments = useSelector((state: any) => state.investment.investments);
  const { tickerCryptos } = useCrypto();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    (dispatch as any)(getWallet());
    (dispatch as any)(getTransactions());
    (dispatch as any)(getPortfolio());
    (dispatch as any)(getInvestments());
    (dispatch as any)(getCryptos());
    (dispatch as any)(getMarketData());
  }, [dispatch]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Helper to get live price for a crypto
  const getLivePrice = (cryptoId: string, fallback: number) => {
    const list = Array.isArray(tickerCryptos) ? tickerCryptos : [];
    const ticker = list.find((c: any) => c && c._id === cryptoId);
    return ticker && typeof ticker.currentPrice === 'number' ? ticker.currentPrice : fallback;
  };
  // Helper to get admin-set price for a crypto
  const getAdminPrice = (cryptoId: string, fallback: number) => {
    const list = Array.isArray(tickerCryptos) ? tickerCryptos : [];
    const ticker = list.find((c: any) => c && c._id === cryptoId);
    return ticker && (ticker as any).minPrice ? (ticker as any).minPrice : fallback;
  };
  // Portfolio summary using backend data (subscription-based)
  const portfolioData = portfolio?.summary || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercentage: 0
  };

  const recentTransactions = transactions || [];

  // Add loading and zero-value guards
  const investmentsLoading = !investments || typeof investments === 'undefined';
  if (investmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading portfolio...</div>
      </div>
    );
  }
  const zeroInvestments = investments.filter(inv => inv.amount === 0 || inv.quantity === 0);
  const activeInvestments = investments.filter((inv: any) => inv.status === 'active');
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

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Navigation */}
      <nav className="bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
              <span className="hidden sm:inline text-lg md:text-xl font-bold gradient-text">
                CryptoMax
              </span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden lg:inline text-neutral-300">Welcome, {user?.name}</span>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-neutral-200">{user?.name}</span>
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-lg shadow-lg border border-neutral-800 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <Link
                      to="/profile?tab=kyc"
                      className="flex items-center px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      KYC Verification
                    </Link>
                    <div className="border-t border-neutral-800 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-neutral-800"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Invest button: icon-only on xs, full label from sm+ */}
              <Link to="/crypto" className="inline-flex sm:hidden">
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)] p-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/crypto" className="hidden sm:inline-flex">
                <Button className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Invest Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Dashboard</h1>
          <p className="text-neutral-400">Welcome back, {user?.name}! Here's your portfolio overview.</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Link to="/wallet">
            <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ring-1 ring-emerald-500/10 hover:shadow-[0_0_40px_rgba(132,204,22,0.18)]">
              <div className="p-6 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
                <h3 className="font-semibold text-neutral-100 mb-1">Wallet</h3>
                <p className="text-sm text-neutral-400">Deposit & Withdraw</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/crypto">
            <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <Search className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-neutral-100 mb-1">Explore Crypto</h3>
                <p className="text-sm text-neutral-400">Search & Invest</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/portfolio">
            <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <BarChart2 className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
                <h3 className="font-semibold text-neutral-100 mb-1">Portfolio</h3>
                <p className="text-sm text-neutral-400">Track Performance</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/transactions">
            <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
                <h3 className="font-semibold text-neutral-100 mb-1">Transactions</h3>
                <p className="text-sm text-neutral-400">View History</p>
              </div>
            </Card>
          </Link>
          
          <Link to="/profile?tab=kyc">
            <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-6 text-center">
                <User className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
                <h3 className="font-semibold text-neutral-100 mb-1">Profile</h3>
                <p className="text-sm text-neutral-400">Settings & KYC</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg ring-1 ring-emerald-500/10 hover:shadow-[0_0_40px_rgba(132,204,22,0.18)] transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-neutral-400">Total Portfolio</span>
              <Wallet className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-neutral-100">
                ${portfolioData.totalCurrentValue.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm mt-1 ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.totalProfitLoss >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {portfolioData.totalProfitLoss >= 0 ? '+' : ''}${Math.abs(portfolioData.totalProfitLoss).toLocaleString()} ({portfolioData.totalProfitLossPercentage.toFixed(2)}%)
              </div>
            </div>
          </Card>

          <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-400">Total Invested</span>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-neutral-100">
                ${portfolioData.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-neutral-400 mt-1">Initial investment</p>
            </div>
          </Card>

          <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-neutral-400">Total Profit/Loss</span>
              <PieChart className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className={`text-2xl font-bold ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.totalProfitLoss >= 0 ? '+' : ''}${portfolioData.totalProfitLoss.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm mt-1 ${portfolioData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.totalProfitLoss >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {portfolioData.totalProfitLossPercentage.toFixed(2)}% {portfolioData.totalProfitLoss >= 0 ? 'gain' : 'loss'}
              </div>
            </div>
          </Card>

          <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-neutral-400">Wallet Balance</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-emerald-400">
                ${wallet?.balance?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-neutral-400 mt-1">Available balance</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Holdings */}
          <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg">
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="flex items-center font-semibold text-lg">Your Holdings</span>
              <Link to="/portfolio">
                <Button variant="outline" size="sm" className="border-neutral-800 text-neutral-300 hover:bg-neutral-800/40">View All</Button>
              </Link>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {activeInvestments.length > 0 ? (
                  activeInvestments.map((investment, index) => {
                    // Use backend-calculated values for subscription investments
                    const currentValue = investment.currentValue || investment.amount;
                    const profitLoss = investment.profitLoss || 0;
                    const profitLossPercentage = investment.profitLossPercentage || 0;
                    
                    // Safeguards for possibly missing crypto ref
                    const hasCrypto = Boolean(investment.crypto);
                    const cryptoImage = investment.crypto?.image;
                    const cryptoSymbol = investment.crypto?.symbol || 'N/A';
                    const cryptoName = investment.crypto?.name || 'Unknown Asset';
                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                        <div className="flex items-center space-x-4">
                          {cryptoImage ? (
                            <img
                              src={cryptoImage}
                              alt={cryptoSymbol}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (hasCrypto && cryptoSymbol === 'BTC') ? (
                            <img
                              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                              alt="Bitcoin"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">{cryptoSymbol?.[0] || '?'}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-neutral-100">{cryptoName}</div>
                            <div className="text-sm text-neutral-400">{investment.investmentPlan?.name || 'Subscription Plan'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-emerald-400">${currentValue.toLocaleString()}</div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${profitLossPercentage >= 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                              {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                            </Badge>
                            <span className="text-sm text-neutral-400">{investment.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-neutral-400">
                    <p>No investments yet. Start investing to see your holdings here!</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 shadow-lg">
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="flex items-center font-semibold text-lg">Recent Activity</span>
              <Link to="/transactions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 5).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-neutral-800/50">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'investment' ? 'bg-emerald-900/30' :
                          transaction.type === 'withdrawal' ? 'bg-red-900/30' : 'bg-blue-900/30'
                        }`}>
                          {transaction.type === 'investment' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
                           transaction.type === 'withdrawal' ? <TrendingDown className="w-4 h-4 text-red-400" /> :
                           <Wallet className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-100 capitalize">
                            {transaction.type} {transaction.currency}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-neutral-100">
                          ${(transaction.amount ?? 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-400">
                    <p>No recent activity yet.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
