import api from './api';
import { Wallet, Transaction, DepositData, WithdrawalData } from '../types';

interface DepositResponse {
  wallet: Wallet;
  transaction: Transaction;
}

interface WithdrawalResponse {
  wallet: Wallet;
  transaction: Transaction;
}

// Get wallet
const getWallet = async (): Promise<Wallet> => {
  const response = await api.get<Wallet>('/api/wallet');
  return response.data;
};

// Get transactions
const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/api/wallet/transactions');
  return response.data;
};

// Deposit funds
const deposit = async (depositData: DepositData): Promise<DepositResponse> => {
  const response = await api.post<DepositResponse>('/api/wallet/deposit', depositData);
  return response.data;
};

// Request withdrawal
const requestWithdrawal = async (withdrawalData: WithdrawalData): Promise<WithdrawalResponse> => {
  const response = await api.post<WithdrawalResponse>('/api/wallet/withdraw', withdrawalData);
  return response.data;
};

const walletService = {
  getWallet,
  getTransactions,
  deposit,
  requestWithdrawal
};

export default walletService;