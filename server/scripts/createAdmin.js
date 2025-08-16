require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-investment-platform');
    
    // Check if admin already exists
    let adminUser = await User.findOne({ email: 'admin@cryptomax.com' });
    
    if (adminUser) {
      // Update existing user to admin
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('✅ Updated existing user to admin role');
    } else {
      // Create new admin user
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@cryptomax.com',
        password: 'admin123', // Will be hashed automatically
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('✅ Created new admin user');
    }
    
    console.log('👤 Admin Credentials:');
    console.log('   Email: admin@cryptomax.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    
    // Also upgrade first user if exists
    const firstUser = await User.findOne({ role: 'user' });
    if (firstUser) {
      firstUser.role = 'admin';
      await firstUser.save();
      console.log(`✅ Upgraded first user (${firstUser.email}) to admin role`);
    }
    
    console.log('🎉 Admin setup complete! You can now access the admin panel.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;