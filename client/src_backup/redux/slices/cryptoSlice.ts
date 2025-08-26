// client/src/redux/slices/cryptoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCryptos, getCryptoById, getPriceHistory, getMarketData } from '../thunks/cryptoThunks';

interface CryptoState {
  cryptos: any[];
  selectedCrypto: any;
  marketData: any;
  priceHistory: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  cryptos: [],
  selectedCrypto: null,
  marketData: null,
  priceHistory: [],
  loading: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCryptos: (state, action: PayloadAction<any[]>) => {
      state.cryptos = action.payload;
    },
    setSelectedCrypto: (state, action: PayloadAction<any>) => {
      state.selectedCrypto = action.payload;
    },
    setMarketData: (state, action: PayloadAction<any>) => {
      state.marketData = action.payload;
    },
    setPriceHistory: (state, action: PayloadAction<any[]>) => {
      state.priceHistory = action.payload;
    },
    setCryptoLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCryptoError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCryptoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Cryptos
    builder
      .addCase(getCryptos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptos = action.payload;
        state.error = null;
      })
      .addCase(getCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Crypto By ID
    builder
      .addCase(getCryptoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCryptoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCrypto = action.payload;
        state.error = null;
      })
      .addCase(getCryptoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Price History
    builder
      .addCase(getPriceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPriceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.priceHistory = action.payload;
        state.error = null;
      })
      .addCase(getPriceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Market Data
    builder
      .addCase(getMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.marketData = action.payload;
        state.error = null;
      })
      .addCase(getMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCryptos,
  setSelectedCrypto,
  setMarketData,
  setPriceHistory,
  setCryptoLoading,
  setCryptoError,
  clearCryptoError,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;
