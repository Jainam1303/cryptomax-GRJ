const mongoose = require('mongoose');
const Crypto = require('../models/Crypto');
const path = require('path');
const fs = require('fs');

const seedFile = path.join(__dirname, '../data/cryptosAdminSeed.json');

const seedAdminCryptos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-investment-platform');
    const cryptos = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    for (const c of cryptos) {
      // Upsert by symbol
      await Crypto.findOneAndUpdate(
        { symbol: c.symbol },
        {
          name: c.name,
          symbol: c.symbol,
          image: c.image,
          currentPrice: c.currentPrice,
          minPrice: c.minPrice,
          maxPrice: c.maxPrice,
          minChangePct: c.minChangePct,
          maxChangePct: c.maxChangePct,
          adminFluctuationEnabled: c.adminFluctuationEnabled,
          isActive: true
        },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Seeded admin cryptos!');
  } catch (err) {
    console.error('❌ Error seeding admin cryptos:', err);
  } finally {
    mongoose.connection.close();
  }
};

if (require.main === module) {
  seedAdminCryptos();
}

module.exports = seedAdminCryptos; 