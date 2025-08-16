const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const CryptoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  minPrice: {
    type: Number,
    default: 0
  },
  maxPrice: {
    type: Number,
    default: 0
  },
  minChangePct: {
    type: Number,
    default: 0
  },
  maxChangePct: {
    type: Number,
    default: 0
  },
  adminFluctuationEnabled: {
    type: Boolean,
    default: true
  },
  marketCap: {
    type: Number,
    default: 0
  },
  volume24h: {
    type: Number,
    default: 0
  },
  circulatingSupply: {
    type: Number,
    default: 0
  },
  priceChange24h: {
    type: Number,
    default: 0
  },
  priceChangePercentage24h: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  direction: {
    type: String,
    enum: ['up', 'down', 'random'],
    default: 'random'
  },
  priceHistory: [PriceHistorySchema],
  // Admin controlled settings for fake price movements
  adminSettings: {
    volatility: {
      type: Number,
      default: 0.05 // 5% default volatility
    },
    trend: {
      type: Number,
      default: 0 // -1 to 1, where -1 is downtrend, 0 is neutral, 1 is uptrend
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crypto', CryptoSchema);