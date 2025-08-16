const Wallet = require('../models/Wallet');

// Middleware to ensure user has a wallet
const ensureWallet = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    // Check if wallet exists
    let wallet = await Wallet.findOne({ user: req.user.id });
    
    // If no wallet exists, create one
    if (!wallet) {
      wallet = new Wallet({
        user: req.user.id
      });
      await wallet.save();
      console.log(`Created wallet for user ${req.user.id}`);
    }
    
    // Attach wallet to request object for controllers to use
    req.wallet = wallet;
    next();
  } catch (err) {
    console.error('Ensure wallet error:', err.message);
    res.status(500).json({ msg: 'Server error while ensuring wallet' });
  }
};

module.exports = ensureWallet;