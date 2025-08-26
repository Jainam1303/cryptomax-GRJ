const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const referralController = require('../../controllers/referralController');

// Link a referral code to the current user (post-signup)
router.post('/link', auth, referralController.linkReferral);

// Get referral stats for current user
router.get('/stats', auth, referralController.getStats);

module.exports = router;
