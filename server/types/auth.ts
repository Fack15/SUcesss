export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user?: any;
  session?: any;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
}