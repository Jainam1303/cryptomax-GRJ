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
    dailyReturnPercentage: 0.5,
    duration: 30,
    description: "Perfect for beginners. Start with a small investment and earn daily returns.",
    features: [
      "Daily returns of 0.5%",
      "30-day investment period",
      "Minimum $100 investment",
      "Maximum $500 investment",
      "Total return: 15%"
    ]
  },
  {
    name: "Growth Plan",
    minAmount: 500,
    maxAmount: 2000,
    dailyReturnPercentage: 0.8,
    duration: 60,
    description: "Balanced growth with moderate risk and higher returns.",
    features: [
      "Daily returns of 0.8%",
      "60-day investment period",
      "Minimum $500 investment",
      "Maximum $2,000 investment",
      "Total return: 48%"
    ]
  },
  {
    name: "Premium Plan",
    minAmount: 2000,
    maxAmount: 5000,
    dailyReturnPercentage: 1.2,
    duration: 90,
    description: "Premium investment with higher daily returns and longer duration.",
    features: [
      "Daily returns of 1.2%",
      "90-day investment period",
      "Minimum $2,000 investment",
      "Maximum $5,000 investment",
      "Total return: 108%"
    ]
  },
  {
    name: "Elite Plan",
    minAmount: 5000,
    maxAmount: 10000,
    dailyReturnPercentage: 1.5,
    duration: 120,
    description: "Elite investment plan for serious investors with maximum returns.",
    features: [
      "Daily returns of 1.5%",
      "120-day investment period",
      "Minimum $5,000 investment",
      "Maximum $10,000 investment",
      "Total return: 180%"
    ]
  },
  {
    name: "Ultimate Plan",
    minAmount: 10000,
    maxAmount: 10000,
    dailyReturnPercentage: 2.0,
    duration: 150,
    description: "Ultimate investment plan with the highest returns for VIP investors.",
    features: [
      "Daily returns of 2.0%",
      "150-day investment period",
      "Fixed $10,000 investment",
      "Maximum returns available",
      "Total return: 300%"
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
    console.log('- Starter Plan: $100-$500, 0.5% daily, 30 days, 15% total');
    console.log('- Growth Plan: $500-$2,000, 0.8% daily, 60 days, 48% total');
    console.log('- Premium Plan: $2,000-$5,000, 1.2% daily, 90 days, 108% total');
    console.log('- Elite Plan: $5,000-$10,000, 1.5% daily, 120 days, 180% total');
    console.log('- Ultimate Plan: $10,000, 2.0% daily, 150 days, 300% total');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding investment plans:', err.message);
    process.exit(1);
  }
};

seedInvestmentPlans(); 