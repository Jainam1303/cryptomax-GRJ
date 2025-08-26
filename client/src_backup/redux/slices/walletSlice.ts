// client/src/redux/slices/walletSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWallet, getTransactions, deposit, withdraw } from '../thunks/walletThunks';

interface WalletState {
  wallet: any;
  transactions: any[];
  error: string | null;
  loading: boolean;
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  error: null,
  loading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<any>) => {
      state.wallet = action.payload;
    },
    setTransactions: (state, action: PayloadAction<any[]>) => {
      state.transactions = action.payload;
    },
    setWalletLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setWalletError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Wallet
    builder
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
        state.error = null;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Transactions
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Deposit
    builder
      .addCase(deposit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload.wallet;
        state.error = null;
      })
      .addCase(deposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Withdraw
    builder
      .addCase(withdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures from the server
        if (action.payload.wallet) {
          state.wallet = action.payload.wallet;
        } else if (action.payload.withdrawalRequest) {
          // For withdrawal requests that don't immediately update balance
          state.error = null;
        }
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


  },
});

export const { setWallet, setTransactions, setWalletLoading, setWalletError, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
