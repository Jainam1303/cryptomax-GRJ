import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base URL
export const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL)
  || (typeof window !== 'undefined' && (window as any).ENV && (window as any).ENV.VITE_API_URL)
  || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

// Latch to prevent multiple redirects to login on 401
let hasRedirectedToLogin = false;

// Set auth token for all requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    // Reset redirect latch when we have a valid token again
    hasRedirectedToLogin = false;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

// Initialize token on app start
const initialToken = getStoredToken();
if (initialToken) {
  setAuthToken(initialToken);
}

// Ensure each request uses the latest token from storage (handles tab changes or token refresh)
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = ((): string | null => {
    const lt = localStorage.getItem('token');
    if (lt) return lt;
    const st = sessionStorage.getItem('token');
    if (st) return st;
    return null;
  })();
  if (token) {
    (config.headers as any)['x-auth-token'] = token;
  } else {
    if (config.headers) {
      delete (config.headers as any)['x-auth-token'];
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Remove tokens from storage
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      // Clear header immediately
      setAuthToken(null);
      
      // Prevent infinite reloads/redirects
      if (!hasRedirectedToLogin && window.location.pathname !== '/login') {
        hasRedirectedToLogin = true;
        window.location.href = '/login';
      } else if (hasRedirectedToLogin) {
        // Show a user-friendly error message (optional: use alert for now)
        alert('Session expired or unauthorized. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;