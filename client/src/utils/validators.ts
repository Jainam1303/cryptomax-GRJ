// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  // At least 6 characters, containing at least one number and one letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Validate name
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Validate amount
export const isValidAmount = (amount: string | number): boolean => {
  const amountValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(amountValue) && amountValue > 0;
};

// Validate withdrawal amount
export const isValidWithdrawalAmount = (amount: string | number, balance: number): boolean => {
  const amountValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(amountValue) && amountValue > 0 && amountValue <= balance;
};

// Validate payment details
export const validatePaymentDetails = (paymentMethod: string, details: any): boolean => {
  switch (paymentMethod) {
    case 'crypto':
      return !!details.walletAddress && !!details.network;
    default:
      return false;
  }
};