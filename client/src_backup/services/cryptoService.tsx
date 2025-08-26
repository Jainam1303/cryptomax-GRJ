import api from './api';
import { Crypto, PriceHistoryItem, MarketData } from '../types';

// Get all cryptocurrencies
const getCryptos = async (): Promise<Crypto[]> => {
  const response = await api.get<Crypto[]>('/api/crypto');
  return response.data;
};

// Get cryptocurrency by ID
const getCryptoById = async (id: string): Promise<Crypto> => {
  const response = await api.get<Crypto>(`/api/crypto/${id}`);
  return response.data;
};

// Get cryptocurrency price history
const getPriceHistory = async (id: string, timeframe: string): Promise<PriceHistoryItem[]> => {
  const response = await api.get<PriceHistoryItem[]>(`/api/crypto/${id}/price-history?timeframe=${timeframe}`);
  return response.data;
};

// Get market data
const getMarketData = async (): Promise<MarketData> => {
  const response = await api.get<MarketData>('/api/crypto/market-data');
  return response.data;
};

const cryptoService = {
  getCryptos,
  getCryptoById,
  getPriceHistory,
  getMarketData
};

export default cryptoService;