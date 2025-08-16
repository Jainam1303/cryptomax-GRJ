const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const Crypto = require('../../models/Crypto');

// GET /api/cryptos - list all cryptos
router.get('/', auth, admin, async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.json(cryptos);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/cryptos/:id - update a crypto
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updateFields = (({
      currentPrice, minPrice, maxPrice, minChangePct, maxChangePct, adminFluctuationEnabled, direction
    }) => ({
      currentPrice, minPrice, maxPrice, minChangePct, maxChangePct, adminFluctuationEnabled, direction
    }))(req.body);
    const crypto = await Crypto.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!crypto) return res.status(404).json({ msg: 'Crypto not found' });
    res.json(crypto);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 