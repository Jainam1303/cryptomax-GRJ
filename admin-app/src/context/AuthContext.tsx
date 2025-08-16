import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import api, { setAuthToken } from '../services/api';
// import { useToast } from '../hooks/use-toast'; // Uncomment if you migrate use-toast
// import { loginSuccess, userLoaded, logout as reduxLogout } from '../redux/slices/authSlice'; // Uncomment if you migrate authSlice

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  // const { toast } = useToast(); // Uncomment if you migrate use-toast
  // const dispatch = useDispatch();

  // Load user on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    
    if (token) {
      loadUser();
    } else {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/user');
      setUser(response.data);
      setIsAuthenticated(true);
      // Sync Redux
      // dispatch(userLoaded(response.data));
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      // Sync Redux
      // dispatch(reduxLogout());
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      // Sync Redux
      // dispatch(loginSuccess({ token }));
      // dispatch(userLoaded(user));
      // toast({ title: "Login Successful", description: `Welcome back, ${user.name}!`, });
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message || 'Login failed';
      // toast({ title: "Login Failed", description: errorMessage, variant: "destructive", });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/register', { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      // Sync Redux
      // dispatch(loginSuccess({ token }));
      // dispatch(userLoaded(user));
      // toast({ title: "Registration Successful", description: `Welcome to CryptoMax, ${user.name}!`, });
    } catch (error: any) {
      // const errorMessage = error.response?.data?.message || 'Registration failed';
      // toast({ title: "Registration Failed", description: errorMessage, variant: "destructive", });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Sync Redux
    // dispatch(reduxLogout());
    // toast({ title: "Logged Out", description: "You have been successfully logged out.", });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading: loading && !initialized, // Only show loading on initial load
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 