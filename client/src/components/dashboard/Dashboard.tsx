import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getPortfolio } from '../../redux/thunks/investmentThunks';
import { getWallet, getTransactions } from '../../redux/thunks/walletThunks';
import { getCryptos, getMarketData } from '../../redux/thunks/cryptoThunks';
import { RootState, AppDispatch } from '../../redux/store';
import BalanceCard from './BalanceCard';
import InvestmentSummary from './InvestmentSummary';
import RecentTransactions from './RecentTransactions';
import PriceChart from './PriceChart';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { Input } from '../ui/Input';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { wallet, transactions, loading: walletLoading } = useSelector((state: RootState) => state.wallet);
  const { portfolio, loading: portfolioLoading } = useSelector((state: RootState) => state.investment);
  const { cryptos, marketData, loading: cryptoLoading } = useSelector((state: RootState) => state.crypto);
  
  // useEffect(() => {
  //   dispatch(getWallet());
  //   dispatch(getTransactions());
  //   dispatch(getPortfolio());
  //   dispatch(getCryptos());
  //   dispatch(getMarketData());
  // }, [dispatch]);
  
  const isLoading = walletLoading || portfolioLoading || cryptoLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your investments and wallet
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BalanceCard wallet={wallet} />
        <InvestmentSummary portfolio={portfolio} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card title="Market Overview">
            <PriceChart cryptos={cryptos?.slice(0, 5)} />
            <div className="mt-4 text-right">
              <Link to="/invest">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all cryptocurrencies
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Recent Transactions">
            <RecentTransactions transactions={transactions?.slice(0, 5)} />
            <div className="mt-4 text-right">
              <Link to="/wallet">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all transactions
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
      
      {portfolio?.investments.length === 0 && (
        <Card>
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start your investment journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any active investments yet. Explore cryptocurrencies and start investing.
            </p>
            <Link to="/invest">
              <Button variant="primary">
                Explore cryptocurrencies
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;