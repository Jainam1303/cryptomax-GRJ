const mongoose = require('mongoose');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/crypto-investment-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

const createPendingWithdrawals = async () => {
  try {
    // Find an existing user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    // Create pending withdrawal requests
    const pendingWithdrawals = [
      {
        user: user._id,
        amount: 150.00,
        paymentMethod: 'usdt_trc20',
        paymentDetails: 'TRC20_TEST_ADDRESS_123456789',
        status: 'pending',
        requestedAt: new Date(),
        createdAt: new Date()
      },
      {
        user: user._id,
        amount: 75.50,
        paymentMethod: 'paypal',
        paymentDetails: 'paypal@testuser.com',
        status: 'pending',
        requestedAt: new Date(),
        createdAt: new Date()
      },
      {
        user: user._id,
        amount: 200.00,
        paymentMethod: 'usdt_trc20',
        paymentDetails: 'TRC20_TEST_ADDRESS_987654321',
        status: 'pending',
        requestedAt: new Date(),
        createdAt: new Date()
      }
    ];

    // Insert the pending withdrawal requests
    const result = await WithdrawalRequest.insertMany(pendingWithdrawals);
    console.log('✅ Created', result.length, 'pending withdrawal requests');
    console.log('📋 Withdrawal IDs:', result.map(w => w._id));

  } catch (err) {
    console.error('❌ Error creating pending withdrawals:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(createPendingWithdrawals); 