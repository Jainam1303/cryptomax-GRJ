import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Wallet as WalletType } from '../../types';
import { Input } from '../ui/Input';

interface BalanceCardProps {
  wallet: WalletType | null;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ wallet }) => {
  if (!wallet) {
    return (
      <Card>
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 dark:text-gray-400">Wallet data not available</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card>
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 mr-4">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wallet Balance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Available funds</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(wallet.balance)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposited</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {formatCurrency(wallet.totalDeposited)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawn</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {formatCurrency(wallet.totalWithdrawn)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Link to="/wallet?action=deposit">
          <Button
            variant="primary"
            fullWidth
            leftIcon={<ArrowUpRight className="h-4 w-4" />}
          >
            Deposit
          </Button>
        </Link>
        <Link to="/wallet?action=withdraw">
          <Button
            variant="outline"
            fullWidth
            leftIcon={<ArrowDownRight className="h-4 w-4" />}
          >
            Withdraw
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default BalanceCard;