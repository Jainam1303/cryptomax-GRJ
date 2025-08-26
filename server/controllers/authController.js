const User = require('../models/User');
const Wallet = require('../models/Wallet');
const generateToken = require('../utils/generateToken');


// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Create wallet for new user
    const wallet = new Wallet({
      user: user._id
    });

    await wallet.save();

    // If a referral code was provided, try to record the referral (non-blocking)
    if (referralCode && typeof referralCode === 'string' && referralCode.trim()) {
      try {
        const Referral = require('../models/Referral');
        const referrer = await User.findOne({ referralCode: referralCode.trim() });
        if (referrer && String(referrer._id) !== String(user._id)) {
          const existing = await Referral.findOne({ referee: user._id });
          if (!existing) {
            await Referral.create({ referrer: referrer._id, referee: user._id });
          }
        }
      } catch (e) {
        // Log but do not fail registration
        console.warn('Referral record error:', e?.message);
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/auth/kyc/submit
// @desc    Submit or update KYC information for the authenticated user
// @access  Private
exports.submitKyc = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const {
      fullName = '',
      dateOfBirth = '',
      nationality = '',
      address = '',
      city = '',
      country = '',
      postalCode = '',
      phoneNumber = '',
      idType = '',
      idNumber = '',
      idFrontImage = '',
      idBackImage = '',
      selfieImage = ''
    } = req.body || {};

    user.kyc = user.kyc || {};
    user.kyc.status = 'pending';
    user.kyc.adminNotes = '';
    user.kyc.reviewedAt = null;
    user.kyc.data = {
      fullName,
      dateOfBirth,
      nationality,
      address,
      city,
      country,
      postalCode,
      phoneNumber,
      idType,
      idNumber,
      idFrontImage,
      idBackImage,
      selfieImage,
      submittedAt: new Date()
    };

    await user.save();

    return res.json({ success: true, message: 'KYC submitted', kyc: user.kyc });
  } catch (err) {
    console.error('Submit KYC error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/auth/kyc/status
// @desc    Get current KYC status for the authenticated user
// @access  Private
exports.getKycStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({ status: user.kyc?.status || 'not_submitted', kyc: user.kyc || null });
  } catch (err) {
    console.error('Get KYC status error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};