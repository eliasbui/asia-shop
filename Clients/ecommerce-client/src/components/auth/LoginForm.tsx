"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/state/authStore';
import { validateLoginForm, generateRecaptchaToken } from '@/lib/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onGoogleLogin?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onGoogleLogin,
}) => {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear general error when user makes any changes
    if (error) {
      clearError();
    }
  }, [fieldErrors, error, clearError]);

  const validateForm = useCallback(() => {
    const errors = validateLoginForm(formData.emailOrPhone, formData.password);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const recaptchaToken = await generateRecaptchaToken('login');
      await login(formData, recaptchaToken || undefined);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleGoogleLogin = async () => {
    if (onGoogleLogin) {
      onGoogleLogin();
      return;
    }

    try {
      // In a real implementation, you would use Google's OAuth flow
      // For now, this is a placeholder
      const recaptchaToken = await generateRecaptchaToken('google_login');

      // Mock Google login - in reality, you'd use Google's API
      await loginWithGoogle({
        token: 'mock-google-token',
        rememberMe: formData.rememberMe
      }, recaptchaToken || undefined);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email/Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="emailOrPhone"
              type="text"
              placeholder="Enter your email or phone number"
              value={formData.emailOrPhone}
              onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
              className="pl-10"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.emailOrPhone}
            />
          </div>
          {fieldErrors.emailOrPhone && (
            <p className="text-sm text-destructive">{fieldErrors.emailOrPhone}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={onForgotPassword}
            disabled={isLoading}
          >
            Forgot password?
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg
          className="mr-2 h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  );
};