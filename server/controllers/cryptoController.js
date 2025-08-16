const Crypto = require('../models/Crypto');
const fs = require('fs');
const path = require('path');

// Load mock data for testing when database is not available
const loadMockCryptos = (includeFullData = false) => {
  try {
    const dataPath = path.join(__dirname, '../data/cryptos.json');
    if (fs.existsSync(dataPath)) {
      const cryptos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      if (includeFullData) {
        // Return full data including price history for specific crypto lookups
        return cryptos;
      } else {
        // Remove price history and admin settings for API lists
        return cryptos.map(crypto => {
          const { priceHistory, adminSettings, ...cryptoData } = crypto;
          return cryptoData;
        });
      }
    }
  } catch (error) {
    console.error('Error loading mock data:', error);
  }
  return [];
};

// @route   GET api/crypto
// @desc    Get all cryptocurrencies
// @access  Private
exports.getCryptos = async (req, res) => {
  try {
    // Try database first, fall back to mock data
    let cryptos;
    try {
      cryptos = await Crypto.find({ isActive: true })
        .select('-priceHistory -adminSettings')
        .sort({ marketCap: -1 });
      
      // If database is empty, use mock data
      if (cryptos.length === 0) {
        console.log('📊 Database empty, using mock cryptocurrency data');
        cryptos = loadMockCryptos();
      }
    } catch (dbError) {
      // Database connection failed, use mock data
      console.log('⚠️ Database unavailable, using mock cryptocurrency data');
      cryptos = loadMockCryptos();
    }
    
    res.json(cryptos);
  } catch (err) {
    console.error('Get cryptos error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/crypto/:id
// @desc    Get cryptocurrency by ID
// @access  Private
exports.getCryptoById = async (req, res) => {
  try {
    let crypto;
    let dbEmpty = false;
    
    // First check if database has any cryptos at all
    try {
      const cryptoCount = await Crypto.countDocuments();
      if (cryptoCount === 0) {
        dbEmpty = true;
        console.log('📊 Database empty, using mock cryptocurrency data for ID lookup');
      }
    } catch (countError) {
      dbEmpty = true;
      console.log('⚠️ Database unavailable, using mock cryptocurrency data');
    }
    
    // If database is empty or unavailable, go straight to mock data
    if (dbEmpty) {
      const mockCryptos = loadMockCryptos(false);
      crypto = mockCryptos.find(c => 
        c._id === req.params.id || 
        c.symbol.toLowerCase() === req.params.id.toLowerCase() ||
        c.name.toLowerCase() === req.params.id.toLowerCase()
      );
    } else {
      // Try database lookups
      try {
        // Try to find by MongoDB ObjectId first
        crypto = await Crypto.findById(req.params.id);
      } catch (objectIdError) {
        // If ObjectId fails, try to find by symbol or name
        crypto = await Crypto.findOne({
          $or: [
            { symbol: req.params.id.toUpperCase() },
            { name: { $regex: new RegExp(req.params.id, 'i') } },
            { _id: req.params.id } // In case it's a string ID in mock data
          ]
        });
      }
      
      // If still not found in database, try mock data
      if (!crypto) {
        console.log('🔍 Crypto not found in database, checking mock data');
        const mockCryptos = loadMockCryptos(false);
        crypto = mockCryptos.find(c => 
          c._id === req.params.id || 
          c.symbol.toLowerCase() === req.params.id.toLowerCase() ||
          c.name.toLowerCase() === req.params.id.toLowerCase()
        );
      }
    }
    
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    res.json(crypto);
  } catch (err) {
    console.error('Get crypto by ID error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/crypto/:id/price-history
// @desc    Get cryptocurrency price history
// @access  Private
exports.getPriceHistory = async (req, res) => {
  try {
    let crypto;
    let dbEmpty = false;
    
    // First check if database has any cryptos at all
    try {
      const cryptoCount = await Crypto.countDocuments();
      if (cryptoCount === 0) {
        dbEmpty = true;
        console.log('📊 Database empty, using mock cryptocurrency data for price history');
      }
    } catch (countError) {
      dbEmpty = true;
      console.log('⚠️ Database unavailable, using mock cryptocurrency data for price history');
    }
    
    // If database is empty or unavailable, go straight to mock data
    if (dbEmpty) {
      const mockCryptos = loadMockCryptos(true); // Need full data including price history
      crypto = mockCryptos.find(c => 
        c._id === req.params.id || 
        c.symbol.toLowerCase() === req.params.id.toLowerCase() ||
        c.name.toLowerCase() === req.params.id.toLowerCase()
      );
    } else {
      // Try database lookups
      try {
        // Try to find by MongoDB ObjectId first
        crypto = await Crypto.findById(req.params.id);
      } catch (objectIdError) {
        // If ObjectId fails, try to find by symbol or name
        crypto = await Crypto.findOne({
          $or: [
            { symbol: req.params.id.toUpperCase() },
            { name: { $regex: new RegExp(req.params.id, 'i') } }
          ]
        });
      }
      
      // If still not found in database, try mock data
      if (!crypto) {
        console.log('🔍 Crypto not found in database, checking mock data for price history');
        const mockCryptos = loadMockCryptos(true); // Need full data including price history
        crypto = mockCryptos.find(c => 
          c._id === req.params.id || 
          c.symbol.toLowerCase() === req.params.id.toLowerCase() ||
          c.name.toLowerCase() === req.params.id.toLowerCase()
        );
      }
    }
    
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    // Get price history for the specified timeframe
    const { timeframe } = req.query;
    let priceHistory = crypto.priceHistory || [];
    
    switch (timeframe) {
      case '1d':
        // Last 24 hours (assuming hourly data points)
        priceHistory = priceHistory.slice(-24);
        break;
      case '7d':
        // Last 7 days (assuming hourly data points)
        priceHistory = priceHistory.slice(-168);
        break;
      case '30d':
        // Last 30 days (assuming hourly data points)
        priceHistory = priceHistory.slice(-720);
        break;
      case '1y':
        // Last year (assuming daily data points)
        priceHistory = priceHistory.filter((p, i) => i % 24 === 0).slice(-365);
        break;
      default:
        // Default to last 24 hours
        priceHistory = priceHistory.slice(-24);
    }
    
    res.json(priceHistory);
  } catch (err) {
    console.error('Get price history error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/crypto/market-data
// @desc    Get market overview data
// @access  Private
exports.getMarketData = async (req, res) => {
  try {
    let cryptos;
    
    try {
      cryptos = await Crypto.find({ isActive: true })
        .select('name symbol currentPrice priceChangePercentage24h marketCap volume24h')
        .sort({ marketCap: -1 })
        .limit(10);
      
      // If database is empty, use mock data
      if (cryptos.length === 0) {
        console.log('📊 Database empty, using mock market data');
        const mockCryptos = loadMockCryptos();
        cryptos = mockCryptos.slice(0, 10).map(crypto => ({
          name: crypto.name,
          symbol: crypto.symbol,
          currentPrice: crypto.currentPrice,
          priceChangePercentage24h: crypto.priceChangePercentage24h,
          marketCap: crypto.marketCap,
          volume24h: crypto.volume24h
        }));
      }
    } catch (dbError) {
      // Database connection failed, use mock data
      console.log('⚠️ Database unavailable, using mock market data');
      const mockCryptos = loadMockCryptos();
      cryptos = mockCryptos.slice(0, 10).map(crypto => ({
        name: crypto.name,
        symbol: crypto.symbol,
        currentPrice: crypto.currentPrice,
        priceChangePercentage24h: crypto.priceChangePercentage24h,
        marketCap: crypto.marketCap,
        volume24h: crypto.volume24h
      }));
    }
    
    // Calculate total market cap and 24h volume
    const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    const total24hVolume = cryptos.reduce((sum, crypto) => sum + crypto.volume24h, 0);
    
    // Calculate market dominance for top cryptocurrencies
    const marketDominance = cryptos.map(crypto => ({
      name: crypto.name,
      symbol: crypto.symbol,
      dominance: (crypto.marketCap / totalMarketCap) * 100
    }));
    
    res.json({
      topCryptos: cryptos,
      marketOverview: {
        totalMarketCap,
        total24hVolume,
        marketDominance
      }
    });
  } catch (err) {
    console.error('Get market data error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};