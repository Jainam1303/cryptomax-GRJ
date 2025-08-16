import api from './api';
import { LoginCredentials, RegisterData, UpdateProfileData, User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

// Register user
const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', userData);
  return response.data;
};

// Login user
const login = async (userData: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', userData);
  return response.data;
};

// Get user data
const getUser = async (): Promise<User> => {
  const response = await api.get<User>('/api/auth/user');
  return response.data;
};

// Update user profile
const updateProfile = async (userData: UpdateProfileData): Promise<User> => {
  const response = await api.put<User>('/api/users/profile', userData);
  return response.data;
};

const authService = {
  register,
  login,
  getUser,
  updateProfile
};

export default authService;