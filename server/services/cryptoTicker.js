const Crypto = require('../models/Crypto');

function randomFluctuation(price, minPct = -0.2, maxPct = 0.2) {
  const pctChange = Math.random() * (maxPct - minPct) + minPct;
  return parseFloat((price * (1 + pctChange / 100)).toFixed(2));
}

async function updateCryptoPrices(io) {
  const Crypto = require('../models/Crypto');
  const cryptos = await Crypto.find();
  const updatedCryptos = [];
  for (const crypto of cryptos) {
    if (crypto.isActive !== false) {
      // Use direction field
      let minPct = -0.2, maxPct = 0.2;
      let minUp = 0.05, maxUp = 0.2;
      let minDown = -0.2, maxDown = -0.05;
      let pctChange;
      if (crypto.direction === 'up') {
        pctChange = Math.random() * (maxUp - minUp) + minUp;
      } else if (crypto.direction === 'down') {
        pctChange = Math.random() * (maxDown - minDown) + minDown;
      } else {
        pctChange = Math.random() * (maxPct - minPct) + minPct;
      }
      let newPrice = parseFloat((crypto.currentPrice * (1 + pctChange / 100)).toFixed(2));
      // Optionally clamp to min/max if you want
      // const min = crypto.minPrice ?? 0;
      // const max = crypto.maxPrice ?? Number.MAX_SAFE_INTEGER;
      // newPrice = Math.max(min, Math.min(max, newPrice));
      const oldPrice = crypto.currentPrice;
      crypto.currentPrice = newPrice;
      crypto.priceChange24h = (crypto.priceChange24h || 0) + (newPrice - oldPrice);
      crypto.priceChangePercentage24h = oldPrice !== 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
      await crypto.save();
      updatedCryptos.push(crypto.toObject());
    }
  }
  // Emit updated cryptos to all clients
  if (io) {
    io.emit('cryptos:update', updatedCryptos);
  }
}

function startCryptoTicker(io, intervalMs = 2500) {
  setInterval(() => updateCryptoPrices(io), intervalMs);
}

module.exports = { startCryptoTicker }; 