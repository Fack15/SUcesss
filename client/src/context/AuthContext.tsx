
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      if (result.user && result.session) {
        const authUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name
        };
        setUser(authUser);
        setSession(result.session);
        localStorage.setItem('auth.token', result.session.access_token);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      if (result.user && result.session) {
        const authUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name
        };
        setUser(authUser);
        setSession(result.session);
        localStorage.setItem('auth.token', result.session.access_token);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
        },
      });
      
      localStorage.removeItem('auth.token');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Reset password failed');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const isAuthenticated = user !== null && session !== null;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth.token');
        if (token) {
          const response = await fetch('/api/auth/verify-token', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.user) {
              const authUser: User = {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name
              };
              setUser(authUser);
              setSession({ access_token: token });
            }
          } else {
            localStorage.removeItem('auth.token');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth.token');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
