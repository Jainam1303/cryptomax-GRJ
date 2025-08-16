import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ Get user's investment portfolio
export const getPortfolio = createAsyncThunk(
  'investment/getPortfolio',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/investments/portfolio');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to load portfolio');
    }
  }
);

// ✅ Make a new subscription investment
export const createInvestment = createAsyncThunk(
  'investment/createInvestment',
  async (
    data: { 
      cryptoId: string; 
      amount: number; 
      planId: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await api.post('/api/investments', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Investment failed');
    }
  }
);

// ✅ Get user's investments
export const getInvestments = createAsyncThunk(
  'investment/getInvestments',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/investments');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to load investments');
    }
  }
);

// ✅ Sell an investment
export const sellInvestment = createAsyncThunk(
  'investment/sellInvestment',
  async (investmentId: string, thunkAPI) => {
    try {
      const res = await api.put(`/api/investments/${investmentId}/sell`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to sell investment');
    }
  }
);
