import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../ui/card';
import Button from '../ui/button';
import { Portfolio } from '../../types';
import { useDispatch } from 'react-redux';
import { getCryptos } from '../../redux/thunks/cryptoThunks';
import { AppDispatch } from '../../redux/store';

interface InvestmentSummaryProps {
  portfolio: Portfolio | null;
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <Card>
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 dark:text-gray-400">Portfolio data not available</p>
        </div>
      </Card>
    );
  }
  
  const { summary } = portfolio;
  const isProfitable = summary.totalProfitLoss >= 0;
  
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    console.log("useEffect: dispatch(getCryptos) running");
    dispatch(getCryptos());
  }, [dispatch]);
  
  return (
    <Card>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${
          isProfitable 
            ? 'bg-success-100 dark:bg-success-900/30 text-success-500' 
            : 'bg-danger-900/30 text-danger-500'
        } mr-4`}>
          {isProfitable ? (
            <TrendingUp className="h-6 w-6" />
          ) : (
            <TrendingDown className="h-6 w-6" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Portfolio</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current performance</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(summary.totalCurrentValue)}
        </div>
        
        <div className="flex items-center mt-1">
          <span className={`text-sm font-medium ${
            isProfitable ? 'text-success-500' : 'text-danger-500'
          }`}>
            {formatCurrency(summary.totalProfitLoss)} ({formatPercentage(summary.totalProfitLossPercentage)})
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Invested</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {formatCurrency(summary.totalInvested)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Investments</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {portfolio.investments.length}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Link to="/invest">
          <Button
            variant="primary"
            fullWidth
          >
            Invest More
          </Button>
        </Link>
                    <Link to="/portfolio">
          <Button
            variant="outline"
            fullWidth
          >
            View Portfolio
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default InvestmentSummary;