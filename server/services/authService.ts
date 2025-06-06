import { storage } from '../storage';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterRequest, LoginRequest, ResetPasswordRequest, AuthResponse } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return { error: 'User already exists' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        username: data.email.split('@')[0]
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      return {
        user: { id: user.id, email: user.email, name: user.name },
        session: { access_token: token }
      };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return { error: 'Invalid credentials' };
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(data.password, user.password || '');
      if (!isPasswordValid) {
        return { error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      return {
        user: { id: user.id, email: user.email, name: user.name },
        session: { access_token: token }
      };
    } catch (error) {
      return { error: 'Login failed' };
    }
  }

  async logout(): Promise<{ error?: string }> {
    try {
      // For JWT-based auth, logout is handled client-side by removing the token
      return {};
    } catch (error) {
      return { error: 'Logout failed' };
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ error?: string }> {
    try {
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        // Don't reveal if user exists or not
        return {};
      }

      // In a real app, you would send an email with a reset token
      return {};
    } catch (error) {
      return { error: 'Password reset failed' };
    }
  }

  async updatePassword(password: string, accessToken: string): Promise<{ error?: string }> {
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // In a real implementation, you would update the user's password in the database
      return {};
    } catch (error) {
      return { error: 'Password update failed' };
    }
  }

  async verifyToken(token: string): Promise<{ user?: any; error?: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await storage.getUser(decoded.userId);
      
      if (!user) {
        return { error: 'User not found' };
      }

      return { user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
      return { error: 'Token verification failed' };
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    try {
      // For simplicity, we'll just return the same token structure
      // In a real app, you'd validate the refresh token and issue a new access token
      return { session: { access_token: refreshToken } };
    } catch (error) {
      return { error: 'Session refresh failed' };
    }
  }
}