import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ Get all cryptocurrencies
export const getCryptos = createAsyncThunk(
  'crypto/getCryptos',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/crypto');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch cryptocurrencies');
    }
  }
);

// ✅ Get single crypto by ID
export const getCryptoById = createAsyncThunk(
  'crypto/getCryptoById',
  async (id: string, thunkAPI) => {
    try {
      const res = await api.get(`/api/crypto/${id}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch crypto details');
    }
  }
);

// ✅ Get price history for chart
export const getPriceHistory = createAsyncThunk(
  'crypto/getPriceHistory',
  async ({ id, timeframe }: { id: string; timeframe: string }, thunkAPI) => {
    try {
      const res = await api.get(`/api/crypto/${id}/history?timeframe=${timeframe}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch chart data');
    }
  }
);

// ✅ Get market-level data (optional)
export const getMarketData = createAsyncThunk(
  'crypto/getMarketData',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/crypto/market-data');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch market data');
    }
  }
);
