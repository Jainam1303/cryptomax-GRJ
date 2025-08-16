import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '../hooks/use-toast';
import api from '../services/api';

interface Investment {
  _id: string;
  user: string;
  crypto: {
    _id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    priceChangePercentage24h: number;
    image?: string;
  };
  investmentPlan?: {
    _id: string;
    name: string;
    dailyReturnPercentage: number;
    duration: number;
  };
  amount: number;
  quantity: number;
  buyPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  dailyReturnPercentage?: number;
  status: string;
  createdAt: string;
  soldAt?: string;
}

interface Portfolio {
  investments: Investment[];
  summary: {
    totalInvested: number;
    totalCurrentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
  };
}

interface InvestmentContextType {
  investments: Investment[];
  portfolio: Portfolio | null;
  loading: boolean;
  getInvestments: () => Promise<void>;
  getPortfolio: () => Promise<void>;
  buyInvestment: (cryptoId: string, amount: number) => Promise<void>;
  sellInvestment: (investmentId: string, sellPrice?: number) => Promise<void>;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

interface InvestmentProviderProps {
  children: ReactNode;
}

export const InvestmentProvider = ({ children }: InvestmentProviderProps) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getInvestments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/investments');
      setInvestments(response.data);
    } catch (error: any) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch investments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPortfolio = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/investments/portfolio');
      setPortfolio(response.data);
    } catch (error: any) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const buyInvestment = async (cryptoId: string, amount: number) => {
    try {
      setLoading(true);
      const response = await api.post('/api/investments', {
        cryptoId,
        amount
      });
      
      toast({
        title: "Investment Successful",
        description: `Successfully invested $${amount}`,
      });
      
      // Refresh data
      await getInvestments();
      await getPortfolio();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Investment failed';
      toast({
        title: "Investment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sellInvestment = async (investmentId: string, sellPrice?: number) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/investments/${investmentId}/sell`, sellPrice !== undefined ? { sellPrice } : {});
      toast({
        title: "Investment Sold",
        description: "Successfully sold your investment",
      });
      // Refresh data
      await getInvestments();
      await getPortfolio();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sale failed';
      toast({
        title: "Sale Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: InvestmentContextType = {
    investments,
    portfolio,
    loading,
    getInvestments,
    getPortfolio,
    buyInvestment,
    sellInvestment
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};