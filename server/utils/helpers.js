// Generate random price movement for fake charts
const generatePriceMovement = (basePrice, volatility = 0.05, trend = 0) => {
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
const generatePriceHistory = (basePrice, dataPoints = 24, volatility = 0.05, trend = 0) => {
  const priceHistory = [];
  let currentPrice = basePrice;
  
  // Generate data points with timestamps
  for (let i = 0; i < dataPoints; i++) {
    // Calculate timestamp (going back in time from now)
    const timestamp = new Date(Date.now() - (dataPoints - i) * 3600000); // Hourly data
    
    // Add to price history
    priceHistory.push({
      price: currentPrice,
      timestamp
    });
    
    // Calculate next price
    currentPrice = generatePriceMovement(currentPrice, volatility, trend);
  }
  
  return priceHistory;
};

// Format currency
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

// Format percentage
const formatPercentage = (percentage, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percentage / 100);
};

module.exports = {
  generatePriceMovement,
  generatePriceHistory,
  formatCurrency,
  formatPercentage
};