import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import api from '../services/api';

interface Crypto {
  _id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MarketData {
  topCryptos: Crypto[];
  marketOverview: {
    totalMarketCap: number;
    total24hVolume: number;
    marketDominance: {
      name: string;
      symbol: string;
      dominance: number;
    }[];
  };
}

interface PriceHistoryItem {
  price: number;
  timestamp: string;
}

interface CryptoContextType {
  cryptos: Crypto[];
  tickerCryptos: Crypto[];
  lastUpdated: Date | null;
  marketData: MarketData | null;
  selectedCrypto: Crypto | null;
  priceHistory: PriceHistoryItem[];
  loading: boolean;
  searchQuery: string;
  filteredCryptos: Crypto[];
  getCryptos: () => Promise<void>;
  getMarketData: () => Promise<void>;
  getCryptoById: (id: string) => Promise<void>;
  getPriceHistory: (id: string, timeframe?: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

interface CryptoProviderProps {
  children: ReactNode;
}

export const CryptoProvider = ({ children }: CryptoProviderProps) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [tickerCryptos, setTickerCryptos] = useState<Crypto[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter cryptos based on search query
  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCryptos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/crypto');
      setCryptos(response.data);
      setTickerCryptos(response.data);
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error('Error fetching cryptos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cryptocurrency data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMarketData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/crypto/market-data');
      setMarketData(response.data);
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch market data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCryptoById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/crypto/${id}`);
      setSelectedCrypto(response.data);
    } catch (error: any) {
      console.error('Error fetching crypto details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cryptocurrency details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriceHistory = async (id: string, timeframe: string = '7d') => {
    try {
      setLoading(true);
      const response = await api.get(`/api/crypto/${id}/price-history?timeframe=${timeframe}`);
      setPriceHistory(response.data);
    } catch (error: any) {
      console.error('Error fetching price history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch price history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value: CryptoContextType = {
    cryptos,
    tickerCryptos,
    lastUpdated,
    marketData,
    selectedCrypto,
    priceHistory,
    loading,
    searchQuery,
    filteredCryptos,
    getCryptos,
    getMarketData,
    getCryptoById,
    getPriceHistory,
    setSearchQuery
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
};