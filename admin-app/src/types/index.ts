// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
}

// Auth Types
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Wallet Types
export interface Wallet {
  _id: string;
  user: string | User;
  balance: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalDeposited: number;
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  user: string | User;
  type: string;
  amount: number;
  status: string;
  currency: string;
  description?: string;
  reference?: string;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface DepositData {
  amount: number;
  paymentMethod: string;
  txid?: string;
}

export interface WithdrawalData {
  amount: number;
  paymentMethod: string;
  paymentDetails: any;
}

export interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

// Crypto Types
export interface PriceHistoryItem {
  price: number;
  timestamp: string;
}

export interface AdminSettings {
  volatility: number;
  trend: number;
  lastUpdated: string;
}

export interface Crypto {
  _id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  image?: string;
  isActive: boolean;
  priceHistory: PriceHistoryItem[];
  adminSettings?: AdminSettings;
  createdAt: string;
  updatedAt: string;
}

export interface MarketData {
  topCryptos: Crypto[];
  marketOverview: {
    totalMarketCap: number;
    total24Volume: number;
    marketDominance: {
      name: string;
      symbol: string;
      dominance: number;
    }
  };
}

export interface CryptoState {
  cryptos: Crypto[];
  selectedCrypto: Crypto | null;
  priceHistory: PriceHistoryItem[];
  marketData: MarketData | null;
  loading: boolean;
  error: string | null;
}

// Investment Types
export interface AdminAdjustment {
  enabled: boolean;
  percentage: number;
  lastUpdated: string | null;
}

export interface Investment {
  _id: string;
  user: string | User;
  crypto: Crypto;
  amount: number;
  quantity: number;
  buyPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  status: string;
  adminAdjustment?: AdminAdjustment;
  createdAt: string;
  soldAt?: string;
}

export interface Portfolio {
  investments: Investment[];
  summary: {
    totalInvested: number;
    totalCurrentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
  };
}

export interface InvestmentState {
  investments: Investment[];
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
}

export interface InvestmentData {
  cryptoId: string;
  amount: number;
}

// Admin Types
export interface WithdrawalRequest {
  _id: string;
  user: User;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentDetails: any;
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: User;
}

export interface DashboardData {
  userCount: number;
  financials: {
    totalDeposits: number;
    totalWithdrawals: number;
    pendingWithdrawals: number;
    activeInvestments: number;
    totalInvestmentAmount: number;
  };
  recentTransactions: Transaction[];
}

export interface AdminState {
  users: User[];
  withdrawalRequests: WithdrawalRequest[];
  investments: Investment[];
  cryptos: Crypto[];
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
} 