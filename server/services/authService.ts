import { supabase, supabaseAdmin } from '../config/supabase';
import { RegisterRequest, LoginRequest, ResetPasswordRequest, AuthResponse } from '../types/auth';

export class AuthService {
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name || ''
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        return { error: error.message };
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      return { error: 'Login failed' };
    }
  }

  async logout(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'Logout failed' };
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password`
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Password reset failed' };
    }
  }

  async updatePassword(password: string, accessToken: string): Promise<{ error?: string }> {
    try {
      // Set the session first
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: ''
      });

      if (sessionError) {
        return { error: sessionError.message };
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Password update failed' };
    }
  }

  async verifyToken(token: string): Promise<{ user?: any; error?: string }> {
    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        return { error: error.message };
      }

      return { user: data.user };
    } catch (error) {
      return { error: 'Token verification failed' };
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        return { error: error.message };
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      return { error: 'Session refresh failed' };
    }
  }
}