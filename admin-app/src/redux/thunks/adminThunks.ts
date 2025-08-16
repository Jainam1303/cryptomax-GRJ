import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get all users
export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/users');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch users');
    }
  }
);

// Get withdrawal requests
export const getWithdrawalRequests = createAsyncThunk(
  'admin/getWithdrawalRequests',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/withdrawal-requests');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch withdrawal requests');
    }
  }
);

// Process withdrawal request with adminNotes
export const processWithdrawalRequest = createAsyncThunk(
  'admin/processWithdrawalRequest',
  async (
    {
      requestId,
      status,
      adminNotes,
    }: { requestId: string; status: string; adminNotes?: string },
    thunkAPI
  ) => {
    try {
      const res = await api.put(`/api/admin/withdrawal-requests/${requestId}`, {
        status,
        adminNotes,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to update withdrawal status');
    }
  }
);

// Get admin dashboard statistics
export const getDashboardData = createAsyncThunk(
  'admin/getDashboardData',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/dashboard');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch dashboard data');
    }
  }
);

// Get all cryptocurrencies
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

// Update system-wide crypto settings
export const updateCryptoSettings = createAsyncThunk(
  'admin/updateCryptoSettings',
  async (settings: Record<string, any>, thunkAPI) => {
    try {
      const res = await api.put('/api/admin/settings/crypto', settings);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to update crypto settings');
    }
  }
); 