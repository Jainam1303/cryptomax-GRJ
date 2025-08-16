// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  // At least 6 characters, containing at least one number and one letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Validate withdrawal amount
const isValidWithdrawalAmount = (amount, balance) => {
  return amount > 0 && amount <= balance;
};

// Validate payment details
const isValidPaymentDetails = (paymentMethod, details) => {
  switch (paymentMethod) {
    case 'bank_transfer':
      return details.accountNumber && details.bankName && details.accountName;
    case 'crypto':
      return details.walletAddress && details.network;
    case 'paypal':
      return details.email;
    default:
      return false;
  }
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidWithdrawalAmount,
  isValidPaymentDetails
};