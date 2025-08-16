import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '../hooks/use-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface Wallet {
  _id: string;
  user: string;
  balance: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalDeposited: number;
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  _id: string;
  user: string;
  type: string;
  amount: number;
  status: string;
  currency: string;
  description?: string;
  reference?: string;
  createdAt: string;
  completedAt?: string;
}

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  getWallet: () => Promise<void>;
  getTransactions: () => Promise<void>;
  deposit: (amount: number, paymentMethod: string) => Promise<void>;
  withdraw: (amount: number, paymentMethod: string, paymentDetails: any) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const getWallet = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/wallet');
      setWallet(response.data);
    } catch (error: any) {
      console.error('Error fetching wallet:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch wallet on mount and when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      getWallet();
      getTransactions();
    } else {
      // Clear wallet state on logout
      setWallet(null);
      setTransactions([]);
    }
  }, [isAuthenticated]);

  const getTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/wallet/transactions');
      setTransactions(response.data);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error", 
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deposit = async (amount: number, paymentMethod: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/wallet/deposit', {
        amount,
        paymentMethod
      });
      // Do NOT update wallet balance or show 'Deposit Successful' yet
      // Only show pending toast
      toast({
        title: "Deposit Request Submitted",
        description: `Your deposit of $${amount} is pending admin approval.`,
      });
      // Refresh wallet and transactions to show pending deposit
      await getWallet();
      await getTransactions();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Deposit failed';
      toast({
        title: "Deposit Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: number, paymentMethod: string, paymentDetails: any) => {
    try {
      setLoading(true);
      const response = await api.post('/api/wallet/withdraw', {
        amount,
        paymentMethod,
        paymentDetails
      });
      
      setWallet(response.data.wallet);
      toast({
        title: "Withdrawal Request Submitted",
        description: `Your withdrawal request for $${amount} has been submitted`,
      });
      
      // Refresh transactions
      await getTransactions();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Withdrawal failed';
      toast({
        title: "Withdrawal Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: WalletContextType = {
    wallet,
    transactions,
    loading,
    getWallet,
    getTransactions,
    deposit,
    withdraw
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};