import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getInvestments, sellInvestment } from '../../redux/thunks/investmentThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import { Input } from '../ui/Input';

const InvestmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { investments, loading, error } = useSelector((state: RootState) => state.investment);
  
  useEffect(() => {
    dispatch(getInvestments());
  }, [dispatch]);
  
  const handleSell = async (id: string) => {
    if (window.confirm('Are you sure you want to sell this investment?')) {
      await dispatch(sellInvestment(id));
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert
        variant="danger"
        message={error}
      />
    );
  }
  
  if (!investments || investments.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No active investments
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have any active investments yet. Start investing to grow your portfolio.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {investments.map(investment => {
        const isProfitable = investment.profitLoss >= 0;
        
        return (
          <Card key={investment._id}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                {investment.crypto.image ? (
                  <img
                    src={investment.crypto.image}
                    alt={investment.crypto.symbol}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{investment.crypto.symbol[0]}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{investment.crypto.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{investment.crypto.symbol}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(investment.currentValue)}
                </div>
                <div className="flex items-center">
                  {isProfitable ? (
                    <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-danger-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    isProfitable ? 'text-success-500' : 'text-danger-500'
                  }`}>
                    {formatCurrency(investment.profitLoss)} ({formatPercentage(investment.profitLossPercentage)})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {investment.quantity.toFixed(8)} {investment.crypto.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Buy Price</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatCurrency(investment.buyPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatCurrency(investment.crypto.currentPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Invested On</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(investment.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant={isProfitable ? 'success' : 'danger'}
                  onClick={() => handleSell(investment._id)}
                >
                  Sell {investment.crypto.symbol}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default InvestmentList;