import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { DepositData, WithdrawalData } from '../../types';

// ✅ Get wallet balance & summary
export const getWallet = createAsyncThunk(
  'wallet/getWallet',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/wallet');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch wallet');
    }
  }
);

// ✅ Get transaction history
export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/wallet/transactions');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch transactions');
    }
  }
);

// ✅ Deposit funds
export const deposit = createAsyncThunk(
  'wallet/deposit',
  async (data: DepositData, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/deposit', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Deposit failed');
    }
  }
);

// ✅ Request withdrawal (admin approval flow)
export const withdraw = createAsyncThunk(
  'wallet/withdraw',
  async (data: WithdrawalData, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/withdraw', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || 'Withdrawal failed');
    }
  }
);
