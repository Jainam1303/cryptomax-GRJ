const User = require('../models/User');
const Referral = require('../models/Referral');

// POST /api/referrals/link
// Link a referral code to the authenticated user (as referee)
// One-time only; cannot refer yourself; idempotent
exports.linkReferral = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body || {};

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ msg: 'Referral code is required' });
    }

    // Prevent duplicate linking
    const existing = await Referral.findOne({ referee: userId });
    if (existing) {
      return res.status(400).json({ msg: 'Referral already linked' });
    }

    const referrer = await User.findOne({ referralCode: code.trim() });
    if (!referrer) {
      return res.status(404).json({ msg: 'Invalid referral code' });
    }

    if (String(referrer._id) === String(userId)) {
      return res.status(400).json({ msg: 'You cannot use your own referral code' });
    }

    await Referral.create({ referrer: referrer._id, referee: userId });

    return res.json({ success: true, msg: 'Referral linked successfully' });
  } catch (err) {
    console.error('linkReferral error:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/referrals/stats
// Returns the user's referral code and simple stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('referralCode');
    const referrals = await Referral.find({ referrer: userId }).populate('referee', 'name email createdAt');
    const hasReferrer = !!(await Referral.findOne({ referee: userId }));

    return res.json({
      referralCode: user?.referralCode || null,
      totalReferrals: referrals.length,
      referredUsers: referrals.map(r => ({
        id: r.referee._id,
        name: r.referee.name,
        email: r.referee.email,
        createdAt: r.createdAt,
      })),
      hasReferrer,
    });
  } catch (err) {
    console.error('getStats error:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
