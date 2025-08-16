import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCryptos, updateCryptoSettings } from '../../redux/thunks/adminThunks';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Card from '../ui/card';
import Button from '../ui/button';
import { Input } from '../ui/Input';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
// import { Alert } from '../ui/Alert'; // Uncomment and migrate Alert if needed

const SystemSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { cryptos, loading, error } = useSelector((state: any) => state.admin);
  
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [volatility, setVolatility] = useState<string>('0.05');
  const [trend, setTrend] = useState<string>('0');
  
  useEffect(() => {
    dispatch(getCryptos() as any);
  }, [dispatch]);
  
  const handleUpdateSettings = (id: string, currentVolatility: number, currentTrend: number) => {
    setSelectedCrypto(id);
    setVolatility(currentVolatility.toString());
    setTrend(currentTrend.toString());
    setIsModalOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedCrypto) return;
    await dispatch(updateCryptoSettings({
      id: selectedCrypto,
      volatility: parseFloat(volatility),
      trend: parseFloat(trend)
    }) as any);
    setIsModalOpen(false);
    setSelectedCrypto(null);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
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
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cryptocurrency Price Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure the volatility and trend of cryptocurrency prices. These settings control how prices are simulated for the demo platform.
          </p>
        </div>
        {/*
        <Alert
          variant="warning"
          title="Important Notice"
          message="These settings are for demonstration purposes only. In a production environment, cryptocurrency prices would be fetched from real market data."
          className="mb-6"
        />
        */}
        {cryptos?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No cryptocurrencies found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cryptocurrency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Volatility
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trend
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
                {cryptos?.map((crypto: any) => (
                  <tr key={crypto._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {crypto.image ? (
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                            <span className="text-primary-500 font-bold">{crypto.symbol.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {crypto.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(crypto.currentPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        crypto.priceChangePercentage24h >= 0 ? 'text-success-500' : 'text-danger-500'
                      }`}>
                        {formatPercentage(crypto.priceChangePercentage24h)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {(crypto.adminSettings?.volatility || 0.05) * 100}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {crypto.adminSettings?.trend === 0
                          ? 'Neutral'
                          : crypto.adminSettings?.trend > 0
                          ? `Uptrend (${crypto.adminSettings.trend})`
                          : `Downtrend (${crypto.adminSettings.trend})`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateSettings(
                          crypto._id,
                          crypto.adminSettings?.volatility || 0.05,
                          crypto.adminSettings?.trend || 0
                        )}
                      >
                        Update Settings
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Cryptocurrency Settings"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="number"
            name="volatility"
            id="volatility"
            value={volatility}
            onChange={(e) => setVolatility(e.target.value)}
            placeholder="Enter volatility (e.g., 0.05 for 5%)"
            min="0.01"
            max="0.5"
            step="0.01"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Higher volatility means larger price swings. For example, 0.05 means prices can vary by up to 15% in a single update.
          </p>
          <Input
            type="number"
            name="trend"
            id="trend"
            value={trend}
            onChange={(e) => setTrend(e.target.value)}
            placeholder="Enter trend (-1 for downtrend, 0 for neutral, 1 for uptrend)"
            min="-1"
            max="1"
            step="0.1"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Trend influences the direction of price movements. -1 means strong downtrend, 0 means neutral, and 1 means strong uptrend.
          </p>
          {/*
          <Alert
            variant="info"
            message="These settings control the simulated price movements for the demo platform. Changes will affect how prices are generated for all users."
          />
          */}
        </div>
      </Modal>
    </div>
  );
};

export default SystemSettings; 