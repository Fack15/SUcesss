
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { login, register, resetPassword } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is being redirected after email verification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      toast({
        title: "Email verified!",
        description: "Your email has been verified. You can now log in.",
      });
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      setLocation('/products');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(email, password, name);
      toast({
        title: "Registration successful",
        description: "Please check your email and click the verification link to complete registration.",
      });
      // Don't redirect - user needs to verify email first
      setIsRegisterMode(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
      setIsResetMode(false);
      setEmail('');
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "An error occurred while sending reset email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Sending reset email...' : 'Send Reset Email'}
              </Button>
            </form>
            
            <div className="text-center">
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                onClick={() => {
                  setIsResetMode(false);
                  setEmail('');
                }}
              >
                Back to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            {isRegisterMode ? 'Register' : 'Login'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isRegisterMode ? 'Create a new account' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-gray-100 border-0 text-gray-900"
                required
              />
            </div>
            
            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-gray-100 border-0 text-gray-900"
                  required
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium mt-6"
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? 'Creating account...' : 'Signing in...') 
                : (isRegisterMode ? 'Register' : 'Login')
              }
            </Button>
          </form>

          {!isRegisterMode && (
            <div className="text-center">
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                onClick={() => setIsResetMode(true)}
              >
                Forgot your password?
              </button>
            </div>
          )}
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setName('');
                }}
              >
                {isRegisterMode ? 'Login' : 'Register'}
              </button>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
