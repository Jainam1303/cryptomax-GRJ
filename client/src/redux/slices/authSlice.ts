// client/src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, register, loadUser, logoutUser, updateProfile } from '../thunks/authThunks';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  error: string | null;
  rememberMe: boolean;
}

// Helper function to get token from storage
const getStoredToken = (): string | null => {
  // Check localStorage first (remember me)
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return localToken;
  }
  
  // Check sessionStorage (temporary session)
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken) {
    return sessionToken;
  }
  
  return null;
};

const initialState: AuthState = {
  token: getStoredToken(),
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  rememberMe: localStorage.getItem('rememberMe') === 'true'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    userLoaded: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.rememberMe = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginSuccess, userLoaded, logout, clearError, setRememberMe } = authSlice.actions;
export default authSlice.reducer;
