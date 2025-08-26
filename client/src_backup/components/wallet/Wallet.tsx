import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { getWallet } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/card';
import { Button } from '../ui/button';
import Spinner from '../ui/Spinner';
import DepositForm from './DepositForm';
import WithdrawalForm from './WithdrawalForm';

const Wallet: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, loading, error } = useSelector((state: RootState) => state.wallet);
  
  const [activeTab, setActiveTab] = useState<'balance' | 'deposit' | 'withdraw'>('balance');
  
  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);
  
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'deposit') {
      setActiveTab('deposit');
    } else if (action === 'withdraw') {
      setActiveTab('withdraw');
    }
  }, [searchParams]);
  
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
  
  if (!wallet) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Wallet not found</p>
      </div>
    );
  }
  
  return (
    <Card>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'balance'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('balance')}
        >
          Balance
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'deposit'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('deposit')}
        >
          Deposit
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'withdraw'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
      </div>
      
      {activeTab === 'balance' && (
        <div>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 mr-4">
              <WalletIcon className="h-6 w-6" />
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ArrowUpRight className="h-5 w-5 text-success-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Total Deposited</h4>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(wallet.totalDeposited)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ArrowDownRight className="h-5 w-5 text-danger-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Total Withdrawn</h4>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(wallet.totalWithdrawn)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-warning-500 mr-2" />
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Pending Withdrawals</h4>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(wallet.pendingWithdrawals)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              onClick={() => setActiveTab('deposit')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Deposit Funds
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab('withdraw')}
              disabled={wallet.balance <= 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </div>
        </div>
      )}
      
      {activeTab === 'deposit' && (
        <DepositForm />
      )}
      
      {activeTab === 'withdraw' && (
        <WithdrawalForm />
      )}
    </Card>
  );
};

export default Wallet;