import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No recent transactions</p>
      </div>
    );
  }
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-success-500" />;
      case 'withdrawal':
        return <ArrowDownRight className="h-4 w-4 text-danger-500" />;
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-primary-500" />;
      case 'profit':
        return <TrendingUp className="h-4 w-4 text-success-500" />;
      case 'loss':
        return <TrendingUp className="h-4 w-4 text-danger-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-warning-500" />;
    }
  };
  
  const getTransactionText = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'investment':
        return 'Investment';
      case 'profit':
        return 'Profit from investment';
      case 'loss':
        return 'Loss from investment';
      default:
        return transaction.type;
    }
  };
  
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'completed':
        return <span className={`${baseClasses} bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300`}>Completed</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300`}>Pending</span>;
      case 'failed':
        return <span className={`${baseClasses} bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300`}>Failed</span>;
      case 'cancelled':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</span>;
    }
  };
  
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const isProfit = transaction.type === 'profit';
        const isLoss = transaction.type === 'loss';
        const amountDisplay = isProfit
          ? `+${formatCurrency(transaction.amount)}`
          : isLoss
            ? `-${formatCurrency(transaction.amount)}`
            : formatCurrency(transaction.amount);
        return (
          <div key={transaction._id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getTransactionText(transaction)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.createdAt, true)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${isProfit ? 'text-green-600' : isLoss ? 'text-red-600' : 'text-gray-900'} dark:text-white`}>
                {amountDisplay}
              </p>
              <div className="mt-1">
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransactions;