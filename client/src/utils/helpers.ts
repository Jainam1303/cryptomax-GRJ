import { Crypto, Investment } from '../types';

// Generate random ID
export const generateId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return id;
};

// Calculate profit/loss
export const calculateProfitLoss = (investment: Investment): { value: number; percentage: number } => {
  if (!investment || !investment.crypto) return { value: 0, percentage: 0 };
  
  const currentValue = investment.quantity * investment.crypto.currentPrice;
  const profitLoss = currentValue - investment.amount;
  const profitLossPercentage = (profitLoss / investment.amount) * 100;
  
  return {
    value: profitLoss,
    percentage: profitLossPercentage
  };
};

// Generate random price movement for fake charts
export const generatePriceMovement = (basePrice: number, volatility = 0.05, trend = 0): number => {
  // Random movement based on volatility
  const randomFactor = (Math.random() - 0.5) * 2 * volatility;
  
  // Trend factor (-1 to 1, where -1 is downtrend, 0 is neutral, 1 is uptrend)
  const trendFactor = trend * (volatility / 2);
  
  // Combine random and trend factors
  const changeFactor = randomFactor + trendFactor;
  
  // Calculate new price
  const newPrice = basePrice * (1 + changeFactor);
  
  return Math.max(newPrice, 0.01); // Ensure price doesn't go below 0.01
};

// Generate fake price history data
export const generatePriceHistory = (
  basePrice: number, 
  dataPoints = 24, 
  volatility = 0.05, 
  trend = 0
): { price: number; timestamp: string }[] => {
  const priceHistory = [];
  let currentPrice = basePrice;
  
  // Generate data points with timestamps
  for (let i = 0; i < dataPoints; i++) {
    // Calculate timestamp (going back in time from now)
    const timestamp = new Date(Date.now() - (dataPoints - i) * 3600000); // Hourly data
    
    // Add to price history
    priceHistory.push({
      price: currentPrice,
      timestamp: timestamp.toISOString()
    });
    
    // Calculate next price
    currentPrice = generatePriceMovement(currentPrice, volatility, trend);
  }
  
  return priceHistory;
};

// Truncate text with ellipsis
export const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
};

// Get browser local storage item safely
export const getLocalStorageItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return defaultValue;
  }
};

// Set browser local storage item safely
export const setLocalStorageItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
    return false;
  }
};