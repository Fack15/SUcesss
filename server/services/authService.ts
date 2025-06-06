import { supabaseAdmin } from '../config/supabase';
import { RegisterRequest, LoginRequest, ResetPasswordRequest, AuthResponse } from '../types/auth';

export class AuthService {
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          name: data.name || ''
        }
      });

      if (error) {
        return { error: error.message };
      }

      // Create a session for the new user
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name,
          email_confirmed_at: authData.user.email_confirmed_at,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at
        },
        session: sessionData?.session || null
      };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabaseAdmin.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        return { error: error.message };
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name,
          email_confirmed_at: authData.user.email_confirmed_at,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at
        },
        session: authData.session
      };
    } catch (error) {
      return { error: 'Login failed' };
    }
  }

  async logout(): Promise<{ error?: string }> {
    try {
      const { error } = await supabaseAdmin.auth.signOut();
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
      const { error } = await supabaseAdmin.auth.resetPasswordForEmail(data.email);
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
      const { error } = await supabaseAdmin.auth.updateUser({
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
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (error) {
        return { error: error.message };
      }
      return { 
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name
        } 
      };
    } catch (error) {
      return { error: 'Token verification failed' };
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabaseAdmin.auth.refreshSession({
        refresh_token: refreshToken
      });
      if (error) {
        return { error: error.message };
      }
      return { 
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at
        },
        session: data.session 
      };
    } catch (error) {
      return { error: 'Session refresh failed' };
    }
  }
}