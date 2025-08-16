import axios from 'axios';
// If you need types, use:
// import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
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

// Set auth token for all requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

// Initialize token on app start
const initialToken = getStoredToken();
if (initialToken) {
  setAuthToken(initialToken);
}

let hasRedirectedToLogin = false;

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Remove tokens from storage
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      // Prevent infinite reloads/redirects
      if (!hasRedirectedToLogin && window.location.pathname !== '/login') {
        hasRedirectedToLogin = true;
        window.location.href = '/login';
      } else if (hasRedirectedToLogin) {
        alert('Session expired or unauthorized. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default api; 