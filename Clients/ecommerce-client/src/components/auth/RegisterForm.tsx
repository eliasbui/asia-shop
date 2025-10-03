"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/state/authStore';
import { validateRegisterForm, generateRecaptchaToken } from '@/lib/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Loader2, Check, X } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onGoogleLogin?: () => void;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onGoogleLogin,
}) => {
  const router = useRouter();
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const errors = validateRegisterForm(formData);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
    ];

    score = checks.filter(Boolean).length;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const renderPasswordRequirement = (met: boolean, text: string) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-300" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const recaptchaToken = await generateRecaptchaToken('register');
      await register(formData, recaptchaToken || undefined);

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
      const recaptchaToken = await generateRecaptchaToken('google_register');

      // Mock Google login - in reality, you'd use Google's API
      await loginWithGoogle({
        token: 'mock-google-token',
        rememberMe: false
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
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="pl-10"
                disabled={isLoading}
                aria-invalid={!!fieldErrors.firstName}
              />
            </div>
            {fieldErrors.firstName && (
              <p className="text-sm text-destructive">{fieldErrors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="pl-10"
                disabled={isLoading}
                aria-invalid={!!fieldErrors.lastName}
              />
            </div>
            {fieldErrors.lastName && (
              <p className="text-sm text-destructive">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.email}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-sm text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="pl-10"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.phone}
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-sm text-destructive">{fieldErrors.phone}</p>
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
              placeholder="Create a strong password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Password strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.score <= 2 ? 'text-red-500' :
                  passwordStrength.score <= 3 ? 'text-yellow-500' :
                  passwordStrength.score <= 4 ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Password Requirements */}
              <div className="space-y-1 pt-2">
                {renderPasswordRequirement(formData.password.length >= 8, 'At least 8 characters')}
                {renderPasswordRequirement(/[A-Z]/.test(formData.password), 'One uppercase letter')}
                {renderPasswordRequirement(/[a-z]/.test(formData.password), 'One lowercase letter')}
                {renderPasswordRequirement(/\d/.test(formData.password), 'One number')}
                {renderPasswordRequirement(/[@$!%*?&]/.test(formData.password), 'One special character (@$!%*?&)')}
              </div>
            </div>
          )}

          {fieldErrors.password && (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Marketing */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="agreeToTerms" className="text-sm font-normal leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          {fieldErrors.agreeToTerms && (
            <p className="text-sm text-destructive ml-6">{fieldErrors.agreeToTerms}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="subscribeToNewsletter"
              checked={formData.subscribeToNewsletter}
              onCheckedChange={(checked) => handleInputChange('subscribeToNewsletter', checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="subscribeToNewsletter" className="text-sm font-normal">
              Subscribe to newsletter for exclusive offers and updates
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData.agreeToTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
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
            Or sign up with
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