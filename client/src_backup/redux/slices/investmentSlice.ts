// client/src/redux/slices/investmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPortfolio, createInvestment, getInvestments, sellInvestment } from '../thunks/investmentThunks';

interface InvestmentState {
  portfolio: any;
  investments: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InvestmentState = {
  portfolio: null,
  investments: [],
  loading: false,
  error: null,
};

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    setInvestments: (state, action: PayloadAction<any[]>) => {
      state.investments = action.payload;
    },
    setPortfolio: (state, action: PayloadAction<any>) => {
      state.portfolio = action.payload;
    },
    setInvestmentLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInvestmentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearInvestmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Portfolio
    builder
      .addCase(getPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio = action.payload;
        state.error = null;
      })
      .addCase(getPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Investments
    builder
      .addCase(getInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.investments = action.payload;
        state.error = null;
      })
      .addCase(getInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Investment
    builder
      .addCase(createInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvestment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Sell Investment
    builder
      .addCase(sellInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellInvestment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sellInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setInvestments,
  setPortfolio,
  setInvestmentLoading,
  setInvestmentError,
  clearInvestmentError,
} = investmentSlice.actions;
export default investmentSlice.reducer;
