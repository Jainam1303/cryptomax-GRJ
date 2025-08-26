import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { ArrowLeft, Search, TrendingUp, TrendingDown, DollarSign, Loader2, Plus } from "lucide-react";
import { useCrypto } from '../context/CryptoContext';
import { useInvestment } from '../context/InvestmentContext';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { io as socketIOClient } from 'socket.io-client';
import { BASE_URL } from '../services/api';
import InvestmentPlansModal from '../components/invest/InvestmentPlansModal';
import api from '../services/api';

// Define a local Crypto type for this file
interface Crypto {
  _id: string;
  name: string;
  symbol: string;
  image?: string;
  currentPrice: number;
  minPrice?: number;
  maxPrice?: number;
  minChangePct?: number;
  maxChangePct?: number;
  adminFluctuationEnabled?: boolean;
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  isActive?: boolean;
  direction?: 'up' | 'down' | 'random';
}

const CryptoPage = () => {
  const { cryptos, filteredCryptos, loading, searchQuery, setSearchQuery, getCryptos } = useCrypto();
  const { buyInvestment, loading: investmentLoading } = useInvestment();
  const { wallet, getWallet } = useWallet();
  const { user, logout } = useAuth();
  
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [isInvestmentPlansOpen, setIsInvestmentPlansOpen] = useState(false);
  const [tickerCryptos, setTickerCryptos] = useState<Crypto[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [signalVisible, setSignalVisible] = useState<{ [id: string]: boolean }>({});
  const signalTimeouts = useRef<{ [id: string]: NodeJS.Timeout }>({});

  // Initial fetch for cryptos on mount
  useEffect(() => {
    async function fetchInitialCryptos() {
      try {
        const res = await api.get('/api/crypto');
        setTickerCryptos(res.data);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchInitialCryptos();
  }, []);

  // Connect to socket.io and listen for updates
  useEffect(() => {
    // Derive socket origin from BASE_URL
    const socket = socketIOClient(BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    setSocket(socket);
    socket.on('cryptos:update', (updatedCryptos: Crypto[]) => {
      setTickerCryptos(updatedCryptos);
      setLastUpdated(new Date());
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Show signal after 5s if direction is up or down
  useEffect(() => {
    // Clear previous timeouts
    Object.values(signalTimeouts.current).forEach(clearTimeout);
    signalTimeouts.current = {};
    const newSignals: { [id: string]: boolean } = {};
    tickerCryptos.forEach(crypto => {
      if (crypto.direction === 'up' || crypto.direction === 'down') {
        signalTimeouts.current[crypto._id] = setTimeout(() => {
          setSignalVisible(prev => ({ ...prev, [crypto._id]: true }));
        }, 5000);
        newSignals[crypto._id] = false;
      }
    });
    setSignalVisible(newSignals);
    return () => {
      Object.values(signalTimeouts.current).forEach(clearTimeout);
    };
  }, [tickerCryptos.map(c => c._id + c.direction).join(',')]);



  const openInvestmentPlans = (crypto: any) => {
    setSelectedCrypto(crypto);
    setIsInvestmentPlansOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Navigation */}
      <nav className="bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-12 h-12 rounded-lg" />
                <span className="text-xl font-bold gradient-text">
                  CryptoMax
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cryptocurrencies</h1>
          <p className="text-muted-foreground">Discover and invest in cryptocurrencies.</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl mb-8 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Available Balance</h3>
                <p className="text-3xl font-bold text-green-600">
                  ${wallet?.balance?.toLocaleString() || '0.00'}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
        </Card>

        {/* Search */}
        <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl mb-8 shadow-sm">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-md bg-neutral-900/60 border border-neutral-800 text-neutral-100 placeholder-neutral-500"
              />
            </div>
          </div>
        </Card>

        {/* Crypto List */}
        <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Available Cryptocurrencies</h2>
            <p className="text-muted-foreground mb-4">Click on any cryptocurrency to invest</p>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                {tickerCryptos.length > 0 ? (
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow className="bg-neutral-900/70">
                        <TableHead className="w-1/4 text-neutral-300 pl-2 pr-2">Crypto</TableHead>
                        <TableHead className="w-1/4 text-right text-neutral-300 px-2">Price</TableHead>
                        <TableHead className="w-1/4 text-center text-neutral-300 px-2">Change</TableHead>
                        <TableHead className="w-1/4 text-right text-neutral-300 px-2">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickerCryptos
                        .filter(crypto =>
                          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((crypto) => (
                          <TableRow
                            key={crypto._id}
                            onClick={() => openInvestmentPlans(crypto)}
                            className="cursor-pointer hover:bg-neutral-800/60"
                          >
                            <TableCell className="py-3 pl-2 pr-2">
                              <div className="flex items-center gap-3">
                                {crypto.image ? (
                                  <img src={crypto.image} alt={crypto.symbol} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">{crypto.symbol[0]}</span>
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-foreground">{crypto.name}</div>
                                  <div className="text-[11px] text-muted-foreground">{crypto.symbol}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-foreground px-2 tabular-nums whitespace-nowrap">
                              ${crypto.currentPrice.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center px-2 whitespace-nowrap">
                              <Badge
                                className={
                                  (crypto.priceChangePercentage24h ?? 0) >= 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {(crypto.priceChangePercentage24h ?? 0) >= 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {(crypto.priceChangePercentage24h ?? 0) >= 0 ? '+' : ''}
                                {(crypto.priceChangePercentage24h ?? 0).toFixed(2)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-2 whitespace-nowrap">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-black font-semibold shadow-[0_0_12px_rgba(34,197,94,0.45)]"
                                onClick={(e) => { e.stopPropagation(); openInvestmentPlans(crypto); }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Invest
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No cryptocurrencies found matching your search.' : 'No cryptocurrencies available.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Investment Plans Modal */}
        {selectedCrypto && (
          <InvestmentPlansModal
            crypto={selectedCrypto}
            isOpen={isInvestmentPlansOpen}
            onClose={() => {
              setIsInvestmentPlansOpen(false);
              setSelectedCrypto(null);
            }}
            onSuccess={() => {
              getWallet(); // Refresh wallet balance
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CryptoPage;