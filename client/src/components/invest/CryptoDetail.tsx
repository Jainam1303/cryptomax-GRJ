import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Hash } from 'lucide-react';
import { getCryptoById, getPriceHistory } from '../../redux/thunks/cryptoThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import InvestmentForm from './InvestmentForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCrypto, priceHistory, loading } = useSelector((state: RootState) => state.crypto);
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [showInvestForm, setShowInvestForm] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      dispatch(getCryptoById(id));
      dispatch(getPriceHistory({ id, timeframe }));
    }
  }, [dispatch, id, timeframe]);
  
  if (loading || !selectedCrypto) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const isPriceUp = selectedCrypto.priceChangePercentage24h >= 0;
  
  // Generate chart data
  const generateChartData = () => {
    if (!priceHistory || priceHistory.length === 0) {
      // Generate sample data if no price history
      const labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (30 - i - 1));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      const basePrice = selectedCrypto.currentPrice;
      const volatility = 0.05; // 5% volatility
      
      let currentPrice = basePrice;
      const data = [currentPrice];
      
      for (let i = 1; i < 30; i++) {
        // Random price movement
        const change = (Math.random() - 0.5) * 2 * volatility;
        currentPrice = currentPrice * (1 + change);
        data.push(currentPrice);
      }
      
      return {
        labels,
        datasets: [
          {
            label: selectedCrypto.symbol,
            data,
            borderColor: isPriceUp ? '#16C784' : '#EA3943',
            backgroundColor: isPriceUp ? 'rgba(22, 199, 132, 0.1)' : 'rgba(234, 57, 67, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
    
    // Use actual price history
    const labels = priceHistory.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const data = priceHistory.map(item => item.price);
    
    return {
      labels,
      datasets: [
        {
          label: selectedCrypto.symbol,
          data,
          borderColor: isPriceUp ? '#16C784' : '#EA3943',
          backgroundColor: isPriceUp ? 'rgba(22, 199, 132, 0.1)' : 'rgba(234, 57, 67, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };
  
  const chartData = generateChartData();
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(160, 160, 160, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number, true);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center">
            {selectedCrypto.image ? (
              <img
                src={selectedCrypto.image}
                alt={selectedCrypto.name}
                className="w-12 h-12 rounded-full mr-4"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                <span className="text-primary-500 font-bold text-lg">{selectedCrypto.symbol.charAt(0)}</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCrypto.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{selectedCrypto.symbol}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(selectedCrypto.currentPrice)}
            </div>
            <div className="flex items-center">
              {isPriceUp ? (
                <TrendingUp className="h-5 w-5 text-success-500 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 text-danger-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                isPriceUp ? 'text-success-500' : 'text-danger-500'
              }`}>
                {formatPercentage(selectedCrypto.priceChangePercentage24h)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTimeframe('1d')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              timeframe === '1d'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            24H
          </button>
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              timeframe === '7d'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              timeframe === '30d'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => setTimeframe('1y')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              timeframe === '1y'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            1Y
          </button>
        </div>
        
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Cap</h3>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(selectedCrypto.marketCap)}
          </p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">24h Volume</h3>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(selectedCrypto.volume24h)}
          </p>
        </Card>
        
        <Card>
          <div className="flex items-center mb-2">
            <Hash className="h-5 w-5 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Circulating Supply</h3>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatNumber(selectedCrypto.circulatingSupply)}
          </p>
        </Card>
      </div>
      
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Invest in {selectedCrypto.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start investing with as little as $10. Monitor your investment in real-time.
            </p>
          </div>
          
          {showInvestForm ? (
            <Button
              variant="outline"
              onClick={() => setShowInvestForm(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowInvestForm(true)}
            >
              Invest Now
            </Button>
          )}
        </div>
        
        {showInvestForm && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <InvestmentForm
              crypto={selectedCrypto}
              onSuccess={() => setShowInvestForm(false)}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default CryptoDetail;