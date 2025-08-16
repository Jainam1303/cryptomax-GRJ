import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getUsers, getWithdrawalRequests, processWithdrawalRequest, getDashboardData } from '../thunks/adminThunks';

interface AdminState {
  users: any[];
  withdrawalRequests: any[];
  investments: any[];
  cryptos: any[];
  dashboardData: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  withdrawalRequests: [],
  investments: [],
  cryptos: [],
  dashboardData: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setWithdrawalRequests: (state, action: PayloadAction<any[]>) => {
      state.withdrawalRequests = action.payload;
    },
    setInvestments: (state, action: PayloadAction<any[]>) => {
      state.investments = action.payload;
    },
    setCryptos: (state, action: PayloadAction<any[]>) => {
      state.cryptos = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<any>) => {
      state.dashboardData = action.payload;
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getWithdrawalRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWithdrawalRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalRequests = action.payload;
      })
      .addCase(getWithdrawalRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(processWithdrawalRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processWithdrawalRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific withdrawal request in the array
        const updatedRequest = action.payload;
        const index = state.withdrawalRequests.findIndex(req => req._id === updatedRequest._id);
        if (index !== -1) {
          state.withdrawalRequests[index] = updatedRequest;
        }
      })
      .addCase(processWithdrawalRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add getDashboardData reducers
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUsers,
  setWithdrawalRequests,
  setInvestments,
  setCryptos,
  setDashboardData,
  setAdminLoading,
  setAdminError
} = adminSlice.actions;

export default adminSlice.reducer; 