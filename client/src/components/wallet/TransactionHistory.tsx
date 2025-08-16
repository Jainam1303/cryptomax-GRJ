import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from 'lucide-react';
import { getTransactions } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../ui/card';
import Spinner from '../ui/Spinner';
import { Badge } from '../ui/Badge';

const TransactionHistory: React.FC = () => {
  console.log('TransactionHistory component loaded');
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: RootState) => state.wallet);
  
  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-500">{error}</p>
      </div>
    );
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your transaction history will appear here once you make deposits, withdrawals, or investments.
          </p>
        </div>
      </Card>
    );
  }

  // Debug: Print transactions to verify failureReason
  console.log('TransactionHistory transactions:', transactions);
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-5 w-5 text-success-500" />;
      case 'withdrawal':
      case 'investment':
        return <ArrowDownRight className="h-5 w-5 text-danger-500" />;
      case 'profit':
        return <ArrowUpRight className="h-5 w-5 text-success-500" />;
      case 'loss':
        return <ArrowDownRight className="h-5 w-5 text-danger-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
    }
  };
  
  const getTransactionText = (type: string) => {
    switch (type) {
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
      case 'referral':
        return 'Referral bonus';
      default:
        return type;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-left" style={{width: '40%'}}>Transaction</th>
              <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-left" style={{width: '25%'}}>Date</th>
              <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-right" style={{width: '20%'}}>Amount</th>
              <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-center" style={{width: '15%'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-muted/30 transition-colors">
                {/* Transaction column */}
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full 
                      ${['profit', 'deposit'].includes(transaction.type) ? 'bg-success-bg' : ''}
                      ${['withdrawal', 'loss', 'investment'].includes(transaction.type) ? 'bg-danger-bg' : ''}
                      ${!['profit', 'deposit', 'withdrawal', 'loss', 'investment'].includes(transaction.type) ? 'bg-muted' : ''}
                    `}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {getTransactionText(transaction.type)}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {transaction.reference}
                      </div>
                      {transaction.type === 'withdrawal' && transaction.status === 'failed' && transaction.failureReason && (
                        <div className="text-xs text-danger mt-1 font-medium">
                          {transaction.failureReason}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {/* Date column */}
                <td className="py-4 px-6 text-left">
                  <div className="text-sm text-foreground font-mono">
                  {formatDate(transaction.createdAt, true)}
                  </div>
                </td>
                {/* Amount column */}
                <td className="py-4 px-6 text-right">
                  <div className="text-sm font-medium font-mono">
                    {['profit', 'deposit'].includes(transaction.type) ? (
                      <span className="text-success">+{formatCurrency(transaction.amount)}</span>
                    ) : ['withdrawal', 'loss', 'investment'].includes(transaction.type) ? (
                      <span className="text-danger">-{formatCurrency(transaction.amount)}</span>
                    ) : (
                      <span className="text-foreground">{formatCurrency(transaction.amount)}</span>
                    )}
                  </div>
                </td>
                {/* Status column */}
                <td className="py-4 px-6 text-center">
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;