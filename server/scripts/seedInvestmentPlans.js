const mongoose = require('mongoose');
const config = require('config');
const InvestmentPlan = require('../models/InvestmentPlan');
const Crypto = require('../models/Crypto');

const connectDB = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const investmentPlans = [
  {
    name: "Starter Plan",
    minAmount: 100,
    maxAmount: 500,
    dailyReturnPercentage: 1.0,
    duration: 7,
    description: "Perfect for beginners. Start with a small investment and earn daily returns.",
    features: [
      "Daily returns of 1.0%",
      "7-day investment period",
      "Minimum $100 investment",
      "Maximum $500 investment",
      "Total return: 7%"
    ]
  },
  {
    name: "Growth Plan",
    minAmount: 500,
    maxAmount: 2000,
    dailyReturnPercentage: 1.5,
    duration: 14,
    description: "Balanced growth with moderate risk and higher returns.",
    features: [
      "Daily returns of 1.5%",
      "14-day investment period",
      "Minimum $500 investment",
      "Maximum $2,000 investment",
      "Total return: 21%"
    ]
  },
  {
    name: "Premium Plan",
    minAmount: 2000,
    maxAmount: 5000,
    dailyReturnPercentage: 2.0,
    duration: 21,
    description: "Premium investment with higher daily returns and moderate duration.",
    features: [
      "Daily returns of 2.0%",
      "21-day investment period",
      "Minimum $2,000 investment",
      "Maximum $5,000 investment",
      "Total return: 42%"
    ]
  },
  {
    name: "Elite Plan",
    minAmount: 5000,
    maxAmount: 10000,
    dailyReturnPercentage: 2.5,
    duration: 28,
    description: "Elite investment plan for serious investors with strong returns.",
    features: [
      "Daily returns of 2.5%",
      "28-day investment period",
      "Minimum $5,000 investment",
      "Maximum $10,000 investment",
      "Total return: 70%"
    ]
  },
  {
    name: "Ultimate Plan",
    minAmount: 10000,
    maxAmount: 10000,
    dailyReturnPercentage: 3.0,
    duration: 35,
    description: "Ultimate plan with the highest daily returns for VIP investors.",
    features: [
      "Daily returns of 3.0%",
      "35-day investment period",
      "Fixed $10,000 investment",
      "Maximum returns available",
      "Total return: 105%"
    ]
  }
];

const seedInvestmentPlans = async () => {
  try {
    await connectDB();
    
    // Get all active cryptocurrencies
    const cryptos = await Crypto.find({ isActive: true });
    console.log(`Found ${cryptos.length} active cryptocurrencies`);
    
    if (cryptos.length === 0) {
      console.log('No active cryptocurrencies found. Please seed cryptocurrencies first.');
      process.exit(1);
    }
    
    // Clear existing investment plans
    await InvestmentPlan.deleteMany({});
    console.log('Cleared existing investment plans');
    
    // Create investment plans for each crypto
    let totalPlans = 0;
    
    for (const crypto of cryptos) {
      console.log(`Creating investment plans for ${crypto.name} (${crypto.symbol})`);
      
      for (const plan of investmentPlans) {
        const investmentPlan = new InvestmentPlan({
          ...plan,
          crypto: crypto._id,
          totalReturnPercentage: plan.dailyReturnPercentage * plan.duration
        });
        
        await investmentPlan.save();
        totalPlans++;
        console.log(`  ✓ Created ${plan.name}`);
      }
    }
    
    console.log(`\n✅ Successfully created ${totalPlans} investment plans for ${cryptos.length} cryptocurrencies`);
    console.log('\nInvestment Plans Summary:');
    console.log('- Starter Plan: $100-$500, 1.0% daily, 7 days, 7% total');
    console.log('- Growth Plan: $500-$2,000, 1.5% daily, 14 days, 21% total');
    console.log('- Premium Plan: $2,000-$5,000, 2.0% daily, 21 days, 42% total');
    console.log('- Elite Plan: $5,000-$10,000, 2.5% daily, 28 days, 70% total');
    console.log('- Ultimate Plan: $10,000, 3.0% daily, 35 days, 105% total');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding investment plans:', err.message);
    process.exit(1);
  }
};

seedInvestmentPlans(); 