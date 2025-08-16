const mongoose = require('mongoose');
const Crypto = require('../models/Crypto');

const sampleCryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    currentPrice: 43250.89,
    marketCap: 847623456789,
    volume24h: 28453789654,
    circulatingSupply: 19602847,
    priceChange24h: 1247.33,
    priceChangePercentage24h: 2.97,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    isActive: true,
    adminSettings: {
      volatility: 0.03,
      trend: 0.2,
      lastUpdated: new Date()
    }
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    currentPrice: 2645.72,
    marketCap: 318547896321,
    volume24h: 15632874563,
    circulatingSupply: 120415829,
    priceChange24h: -42.18,
    priceChangePercentage24h: -1.57,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    isActive: true,
    adminSettings: {
      volatility: 0.04,
      trend: -0.1,
      lastUpdated: new Date()
    }
  },
  {
    name: 'Binance Coin',
    symbol: 'BNB',
    currentPrice: 318.45,
    marketCap: 47589632147,
    volume24h: 1547896325,
    circulatingSupply: 149532710,
    priceChange24h: 12.74,
    priceChangePercentage24h: 4.17,
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    isActive: true,
    adminSettings: {
      volatility: 0.05,
      trend: 0.3,
      lastUpdated: new Date()
    }
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    currentPrice: 0.495,
    marketCap: 17456789123,
    volume24h: 432198765,
    circulatingSupply: 35245689876,
    priceChange24h: 0.023,
    priceChangePercentage24h: 4.87,
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    isActive: true,
    adminSettings: {
      volatility: 0.06,
      trend: 0.4,
      lastUpdated: new Date()
    }
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    currentPrice: 98.73,
    marketCap: 43987654321,
    volume24h: 2341876543,
    circulatingSupply: 445632789,
    priceChange24h: -3.27,
    priceChangePercentage24h: -3.21,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    isActive: true,
    adminSettings: {
      volatility: 0.07,
      trend: -0.2,
      lastUpdated: new Date()
    }
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    currentPrice: 0.847,
    marketCap: 7896543210,
    volume24h: 634512789,
    circulatingSupply: 9319469069,
    priceChange24h: 0.067,
    priceChangePercentage24h: 8.59,
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    isActive: true,
    adminSettings: {
      volatility: 0.08,
      trend: 0.5,
      lastUpdated: new Date()
    }
  }
];

// Generate sample price history for each crypto (last 24 hours)
const generatePriceHistory = (currentPrice, volatility) => {
  const history = [];
  let price = currentPrice * 0.98; // Start slightly lower
  
  for (let i = 0; i < 24; i++) {
    // Random price movement within volatility range
    const change = (Math.random() - 0.5) * 2 * volatility * price;
    price += change;
    
    history.push({
      price: parseFloat(price.toFixed(2)),
      timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000) // 24 hours ago to now
    });
  }
  
  return history;
};

const seedCryptoData = async () => {
  try {
    console.log('🌱 Seeding cryptocurrency data...');
    
    // Clear existing crypto data
    await Crypto.deleteMany({});
    console.log('✅ Cleared existing crypto data');
    
    // Add price history to each crypto
    const cryptosWithHistory = sampleCryptos.map(crypto => ({
      ...crypto,
      priceHistory: generatePriceHistory(crypto.currentPrice, crypto.adminSettings.volatility)
    }));
    
    // Insert sample data
    await Crypto.insertMany(cryptosWithHistory);
    console.log(`✅ Inserted ${cryptosWithHistory.length} cryptocurrencies`);
    
    // Verify data
    const count = await Crypto.countDocuments();
    console.log(`📊 Total cryptocurrencies in database: ${count}`);
    
    console.log('🎉 Cryptocurrency data seeded successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding crypto data:', error);
    return false;
  }
};

module.exports = seedCryptoData;

// Run directly if called as script
if (require.main === module) {
  require('dotenv').config();
  
  const connectDB = require('../config/db');
  
  const runSeed = async () => {
    await connectDB();
    await seedCryptoData();
    process.exit(0);
  };
  
  runSeed();
}