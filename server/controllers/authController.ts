import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterRequest, LoginRequest, ResetPasswordRequest } from '../types/auth';

const authService = new AuthService();

export class AuthController {

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body as RegisterRequest;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.register({ email, password, name });

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        user: result.user,
        session: result.session
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as LoginRequest;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login({ email, password });

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        session: result.session
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const result = await authService.logout();

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body as ResetPasswordRequest;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const result = await authService.resetPassword({ email });

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(200).json({
        message: 'Password reset email sent. Please check your email.'
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { password, accessToken } = req.body;

      if (!password || !accessToken) {
        return res.status(400).json({ error: 'Password and access token are required' });
      }

      const result = await authService.updatePassword(password, accessToken);

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const result = await authService.refreshSession(refreshToken);

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(200).json({
        message: 'Token refreshed successfully',
        user: result.user,
        session: result.session
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const result = await authService.verifyToken(token);

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.status(200).json({
        message: 'Token is valid',
        user: result.user
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}