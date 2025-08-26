const InvestmentPlan = require('../models/InvestmentPlan');
const Crypto = require('../models/Crypto');

// Reusable investment plan templates
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

// Seed investment plans for all active cryptos using current DB connection
async function seedInvestmentPlans() {
  // Ensure there is an active connection by relying on app-level mongoose connect
  try {
    const cryptos = await Crypto.find({ isActive: true });
    if (!cryptos || cryptos.length === 0) {
      return { success: false, message: 'No active cryptocurrencies found. Seed cryptos first.', created: 0, cryptos: 0 };
    }

    await InvestmentPlan.deleteMany({});

    let created = 0;
    for (const crypto of cryptos) {
      for (const plan of investmentPlans) {
        const doc = new InvestmentPlan({
          ...plan,
          crypto: crypto._id,
          totalReturnPercentage: plan.dailyReturnPercentage * plan.duration,
        });
        await doc.save();
        created += 1;
      }
    }

    return { success: true, message: `Created ${created} plans for ${cryptos.length} cryptos`, created, cryptos: cryptos.length };
  } catch (err) {
    console.error('seedInvestmentPlans util error:', err);
    return { success: false, message: err.message, created: 0, cryptos: 0 };
  }
}

module.exports = seedInvestmentPlans;
