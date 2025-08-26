import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { getCryptos } from '../../redux/thunks/cryptoThunks';
import { RootState, AppDispatch } from '../../redux/store';
import CryptoCard from './CryptoCard';
import { Input } from '../ui/Input';
import Spinner from '../ui/Spinner';

console.log("CryptoList component file loaded");

const CryptoList: React.FC = () => {
  console.log("CryptoList component rendered");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cryptos, loading, error } = useSelector((state: RootState) => state.crypto);
  const [searchTerm, setSearchTerm] = useState('');
  const [tickerCryptos, setTickerCryptos] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    console.log("useEffect: dispatch(getCryptos) running");
    dispatch(getCryptos());
  }, [dispatch]);
  
  // Only set tickerCryptos from cryptos if tickerCryptos is empty or cryptos have changed
  useEffect(() => {
    console.log("useEffect: tickerCryptos init", { cryptos, tickerCryptos });
    if (!cryptos || cryptos.length === 0) return;
    if (
      tickerCryptos.length === 0 ||
      tickerCryptos.length !== cryptos.length ||
      tickerCryptos.some((c, i) => c._id !== cryptos[i]._id)
    ) {
      setTickerCryptos(cryptos);
      setLastUpdated(new Date());
    }
  }, [cryptos]);
  
  // Ticker: update prices every 2-3 seconds
  useEffect(() => {
    console.log("useEffect: ticker logic running", { tickerCryptos });
    if (!tickerCryptos || tickerCryptos.length === 0) return;
    const interval = setInterval(() => {
      setTickerCryptos(prevCryptos => {
        const updated = prevCryptos.map(crypto => {
          if (!crypto.adminFluctuationEnabled) return crypto;
          const min = crypto.minPrice ?? crypto.currentPrice;
          const max = crypto.maxPrice ?? crypto.currentPrice;
          const minPct = crypto.minChangePct ?? -2;
          const maxPct = crypto.maxChangePct ?? 2;
          const pctChange = Math.random() * (maxPct - minPct) + minPct;
          let newPrice = crypto.currentPrice * (1 + pctChange / 100);
          newPrice = Math.max(min, Math.min(max, newPrice));
          return { ...crypto, currentPrice: parseFloat(newPrice.toFixed(6)) };
        });
        setLastUpdated(new Date());
        console.log('Ticker ran at', new Date().toLocaleTimeString(), updated.map(c => ({ symbol: c.symbol, price: c.currentPrice })));
        return updated;
      });
    }, 2000 + Math.random() * 1000); // 2-3 seconds
    return () => clearInterval(interval);
  }, [tickerCryptos]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredCryptos = tickerCryptos?.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCryptoClick = (id: string) => {
    navigate(`/crypto/${id}`);
  };
  
  // Debug: log cryptos and tickerCryptos
  console.log('cryptos from redux:', cryptos);
  console.log('tickerCryptos (local):', tickerCryptos);
  
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
  
  const formatCurrency = (value: number, isMarketCap: boolean = false) => {
    if (value === undefined || value === null) return 'N/A';
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isMarketCap ? 0 : 2,
      maximumFractionDigits: isMarketCap ? 0 : 2,
    });
    return `$${formatter.format(value)}`;
  };

  const formatPercentage = (value: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };
  
  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {filteredCryptos?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No cryptocurrencies found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-none">
            <thead>
              <tr className="bg-white">
                <th className="py-4 px-6 font-medium text-sm text-gray-500 text-left" style={{width: '50%'}}>Cryptocurrency</th>
                <th className="py-4 px-6 font-medium text-sm text-gray-500 text-right" style={{width: '25%'}}>Price</th>
                <th className="py-4 px-6 font-medium text-sm text-gray-500 text-right" style={{width: '15%'}}>24h Change</th>
                <th className="py-4 px-6 font-medium text-sm text-gray-500 text-center" style={{width: '10%'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCryptos?.map(crypto => (
                <tr key={crypto._id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  {/* Name/Icon column */}
                  <td className="py-4 px-6 text-left" onClick={() => handleCryptoClick(crypto._id)}>
                    <div className="flex items-center gap-4">
                      {crypto.image ? (
                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">{crypto.symbol.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  {/* Price column */}
                  <td className="py-4 px-6 text-right" onClick={() => handleCryptoClick(crypto._id)}>
                    <div className="text-sm font-medium font-mono text-gray-900">{formatCurrency(crypto.currentPrice)}</div>
                  </td>
                  {/* 24h Change column */}
                  <td className="py-4 px-6 text-right" onClick={() => handleCryptoClick(crypto._id)}>
                    <div className="inline-flex items-center">
                      {crypto.priceChangePercentage24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium font-mono ${crypto.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatPercentage(crypto.priceChangePercentage24h)}</span>
                    </div>
                  </td>
                  {/* Action column */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={e => { e.stopPropagation(); handleCryptoClick(crypto._id); }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150 ease-in-out"
                    >
                      Invest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CryptoList;