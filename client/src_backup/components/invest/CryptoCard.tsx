import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../ui/card';
import { Crypto } from '../../types';

interface CryptoCardProps {
  crypto: Crypto;
  onClick: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onClick }) => {
  const isPriceUp = crypto.priceChangePercentage24h >= 0;
  
  return (
    <Card
      onClick={onClick}
      className="transition-transform hover:translate-y-[-4px] cursor-pointer bg-black/40 border-white/10 backdrop-blur-sm hover:border-purple-500/50"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          {crypto.image ? (
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold">{crypto.symbol.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{crypto.name}</h3>
            <p className="text-sm text-gray-400">{crypto.symbol}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Price</p>
            <p className="text-xl font-bold text-white font-mono tabular-nums">
              {formatCurrency(crypto.currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">24h Change</p>
            <div className="flex items-center justify-end">
              {isPriceUp ? (
                <TrendingUp className="h-5 w-5 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400 mr-1" />
              )}
              <span className={`text-sm font-medium font-mono tabular-nums ${
                isPriceUp ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(crypto.priceChangePercentage24h)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-400 mb-1">Market Cap</p>
            <p className="text-sm font-medium text-white font-mono tabular-nums">
              {formatCurrency(crypto.marketCap, true)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">24h Volume</p>
            <p className="text-sm font-medium text-white font-mono tabular-nums">
              {formatCurrency(crypto.volume24h, true)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CryptoCard;