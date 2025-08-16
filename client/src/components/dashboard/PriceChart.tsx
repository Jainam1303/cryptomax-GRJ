import React, { useState } from 'react';
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
import { Crypto } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  cryptos: Crypto[] | undefined;
}

const PriceChart: React.FC<PriceChartProps> = ({ cryptos }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<number>(0);
  
  if (!cryptos || cryptos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No cryptocurrency data available</p>
      </div>
    );
  }
  
  const crypto = cryptos[selectedCrypto];
  
  // Generate sample data for the chart
  const generateChartData = () => {
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i - 1));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const basePrice = crypto.currentPrice;
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
          label: crypto.symbol,
          data,
          borderColor: crypto.priceChangePercentage24h >= 0 ? '#16C784' : '#EA3943',
          backgroundColor: crypto.priceChangePercentage24h >= 0 ? 'rgba(22, 199, 132, 0.1)' : 'rgba(234, 57, 67, 0.1)',
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
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {cryptos.map((crypto, index) => (
          <button
            key={crypto._id}
            onClick={() => setSelectedCrypto(index)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCrypto === index
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {crypto.symbol}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{crypto.name}</h3>
          <div className="flex items-center mt-1">
            <span className="text-lg font-medium text-gray-900 dark:text-white mr-2">
              {formatCurrency(crypto.currentPrice)}
            </span>
            <span className={`text-sm font-medium ${
              crypto.priceChangePercentage24h >= 0 ? 'text-success-500' : 'text-danger-500'
            }`}>
              {formatPercentage(crypto.priceChangePercentage24h)}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatCurrency(crypto.marketCap, true)}
          </p>
        </div>
      </div>
      
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;