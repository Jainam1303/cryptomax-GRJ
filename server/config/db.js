const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set default MongoDB URI if not provided
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-investment-platform';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log('📊 Database URI:', mongoUri);
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });

    console.log('✅ MongoDB Connected Successfully!');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('💡 To fix this:');
    console.log('1. Install MongoDB: https://docs.mongodb.com/manual/installation/');
    console.log('2. Start MongoDB service');
    console.log('3. Or use MongoDB Atlas: https://www.mongodb.com/atlas');
    console.log('4. Set MONGO_URI in your environment variables');
    process.exit(1); // Exit if database connection fails
  }
};

module.exports = connectDB;
