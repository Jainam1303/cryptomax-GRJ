const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const adminController = require('../../controllers/adminController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// All routes in this file require both auth and admin middleware
router.use(auth);
router.use(admin);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', (req, res, next) => { console.log('GET /api/admin/users'); next(); }, adminController.getUsers);

// @route   GET api/admin/withdrawal-requests
// @desc    Get all withdrawal requests
// @access  Private/Admin
router.get('/withdrawal-requests', (req, res, next) => { console.log('GET /api/admin/withdrawal-requests'); next(); }, adminController.getWithdrawalRequests);

// @route   PUT api/admin/withdrawal-requests/:id
// @desc    Process withdrawal request
// @access  Private/Admin
router.put('/withdrawal-requests/:id', adminController.processWithdrawalRequest);

// @route   PUT api/admin/crypto/:id
// @desc    Update cryptocurrency settings
// @access  Private/Admin
router.put('/crypto/:id', adminController.updateCryptoSettings);

// @route   PUT api/admin/investments/:id/adjust
// @desc    Adjust investment profit/loss display
// @access  Private/Admin
router.put('/investments/:id/adjust', adminController.adjustInvestment);

// @route   PUT api/admin/investments/:id/manual-adjust
// @desc    Manually adjust investment profit/loss without creating transaction records
// @access  Private/Admin
router.put('/investments/:id/manual-adjust', adminController.manualAdjustInvestment);

// @route   GET api/admin/investments
// @desc    Get all investments (admin)
// @access  Private/Admin
router.get('/investments', (req, res, next) => { console.log('GET /api/admin/investments'); next(); }, adminController.getInvestments);

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', (req, res, next) => { console.log('GET /api/admin/dashboard'); next(); }, adminController.getDashboardData);

// Admin: Update deposit wallet info
router.put('/deposit-wallets/:coin', adminController.updateDepositWallet);

// Admin: Upload deposit wallet QR code image
router.post('/deposit-wallets/:coin/qr-upload', upload.single('qr'), adminController.uploadDepositWalletQr);

// Admin: List all pending deposit requests
router.get('/deposit-requests', (req, res, next) => { 
  console.log('🔍 GET /api/admin/deposit-requests called');
  console.log('👤 User making request:', req.user);
  next(); 
}, adminController.getDepositRequests);
// Admin: Approve/reject a deposit request
router.put('/deposit-requests/:id', adminController.processDepositRequest);

// ==================== SUBSCRIPTION INVESTMENT MANAGEMENT ROUTES ====================

// @route   GET api/admin/subscription-investments
// @desc    Get all subscription investments with user details
// @access  Private/Admin
router.get('/subscription-investments', adminController.getSubscriptionInvestments);

// @route   GET api/admin/subscription-investments/:id
// @desc    Get specific subscription investment details
// @access  Private/Admin
router.get('/subscription-investments/:id', adminController.getSubscriptionInvestment);

// @route   PUT api/admin/subscription-investments/:id/daily-return
// @desc    Update daily return percentage for a subscription investment
// @access  Private/Admin
router.put('/subscription-investments/:id/daily-return', adminController.updateDailyReturn);

// @route   PUT api/admin/subscription-investments/:id/manual-adjustment
// @desc    Manually adjust profit/loss for a subscription investment
// @access  Private/Admin
router.put('/subscription-investments/:id/manual-adjustment', adminController.manualProfitAdjustment);

// @route   PUT api/admin/subscription-investments/:id/reset-adjustment
// @desc    Reset manual adjustment and use calculated earnings
// @access  Private/Admin
router.put('/subscription-investments/:id/reset-adjustment', adminController.resetManualAdjustment);

// @route   PUT api/admin/subscription-investments/:id/status
// @desc    Update investment status (active, completed, paused)
// @access  Private/Admin
router.put('/subscription-investments/:id/status', adminController.updateInvestmentStatus);

// @route   GET api/admin/subscription-investments/user/:userId
// @desc    Get all subscription investments for a specific user
// @access  Private/Admin
router.get('/subscription-investments/user/:userId', adminController.getUserSubscriptionInvestments);

// @route   POST api/admin/subscription-investments/bulk-update
// @desc    Bulk update daily returns for multiple investments
// @access  Private/Admin
router.post('/subscription-investments/bulk-update', adminController.bulkUpdateDailyReturns);

// KYC review endpoints
router.get('/kyc/pending', adminController.getPendingKycUsers);
router.post('/kyc/:userId/approve', adminController.approveKyc);
router.post('/kyc/:userId/reject', adminController.rejectKyc);

module.exports = router;