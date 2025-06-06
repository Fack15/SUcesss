
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      localStorage.setItem('supabase.auth.token', data.session.access_token);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || ''
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      localStorage.setItem('supabase.auth.token', data.session.access_token);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    localStorage.removeItem('supabase.auth.token');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const isAuthenticated = user !== null && session !== null;

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const authUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name
        };
        setUser(authUser);
        localStorage.setItem('supabase.auth.token', session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const authUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name
        };
        setUser(authUser);
        localStorage.setItem('supabase.auth.token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
