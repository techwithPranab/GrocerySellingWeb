import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '@/lib/api';
import { User, AuthResponse, LoginFormData, RegisterFormData } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  adminLogin: (data: LoginFormData) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (data: LoginFormData): Promise<void> => {
    try {
      const response: AuthResponse = await apiClient.post('/auth/login', data);
      apiClient.setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      const response: AuthResponse = await apiClient.post('/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      apiClient.setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const adminLogin = async (data: LoginFormData): Promise<User> => {
    try {
      console.log('🚀 Admin login attempt for:', data.email);
      const response: AuthResponse = await apiClient.post('/auth/admin/login', data);
      console.log('✅ Admin login response:', response);
      console.log('🔑 Setting token:', response.token.substring(0, 20) + '...');
      apiClient.setToken(response.token);
      setUser(response.user);
      console.log('👤 User set:', response.user);
      return response.user;
    } catch (error) {
      console.error('❌ Admin login failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    apiClient.clearToken();
    setUser(null);
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.get('/auth/profile');
      setUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      apiClient.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    adminLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
