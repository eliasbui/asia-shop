"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/state/authStore';
import { validateForgotPasswordForm, generateRecaptchaToken } from '@/lib/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onBackToLogin,
}) => {
  const router = useRouter();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = useCallback((value: string) => {
    setEmailOrPhone(value);

    // Clear field error when user starts typing
    if (fieldErrors.emailOrPhone) {
      setFieldErrors(prev => ({ ...prev, emailOrPhone: '' }));
    }

    // Clear general error when user makes any changes
    if (error) {
      clearError();
    }

    // Reset submitted state when user changes input
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }, [fieldErrors, error, clearError, isSubmitted]);

  const validateForm = useCallback(() => {
    const errors = validateForgotPasswordForm(emailOrPhone);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [emailOrPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const recaptchaToken = await generateRecaptchaToken('forgot_password');
      await forgotPassword({ emailOrPhone }, recaptchaToken || undefined);

      setIsSubmitted(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      router.push('/auth/login');
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md space-y-6">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Check your {emailOrPhone.includes('@') ? 'email' : 'phone'}</h3>
            <p className="text-sm text-muted-foreground">
              We've sent you instructions to reset your password.
              Please check your {emailOrPhone.includes('@') ? 'inbox' : 'messages'} and follow the link.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or try again.
          </div>
        </div>

        {/* Back to Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleBackToLogin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Forgot your password?</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email or phone number and we'll send you instructions to reset your password.
        </p>
      </div>

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
              value={emailOrPhone}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.emailOrPhone}
            />
          </div>
          {fieldErrors.emailOrPhone && (
            <p className="text-sm text-destructive">{fieldErrors.emailOrPhone}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !emailOrPhone.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending instructions...
            </>
          ) : (
            'Send reset instructions'
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={handleBackToLogin}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Button>

      {/* Additional Help */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          Need help? Contact our{' '}
          <a
            href="/support"
            className="text-primary hover:underline"
          >
            customer support
          </a>
        </p>
        <p>
          Remember your password?{' '}
          <button
            onClick={handleBackToLogin}
            className="text-primary hover:underline"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};