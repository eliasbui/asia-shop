"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/state/authStore';
import { validateOTPForm } from '@/lib/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  emailOrPhone?: string;
  purpose?: 'login' | 'register' | 'forgot_password' | 'enable_2fa';
  onSuccess?: () => void;
  onResend?: () => void;
  onCancel?: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  emailOrPhone: initialEmailOrPhone = '',
  purpose = 'login',
  onSuccess,
  onResend,
  onCancel,
}) => {
  const router = useRouter();
  const { verifyOTP, resendOTP, isLoading, error, clearError } = useAuthStore();

  const [emailOrPhone, setEmailOrPhone] = useState(initialEmailOrPhone);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleInputChange = useCallback((index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(0, 1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Clear field error when user starts typing
    if (fieldErrors.code) {
      setFieldErrors(prev => ({ ...prev, code: '' }));
    }

    // Clear general error when user makes any changes
    if (error) {
      clearError();
    }

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [code, fieldErrors, error, clearError]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    const newCode = ['', '', '', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus the appropriate input
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    if (nextEmptyIndex === -1) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  }, []);

  const validateForm = useCallback(() => {
    const fullCode = code.join('');
    const errors = validateOTPForm(fullCode);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await verifyOTP({
        emailOrPhone,
        code: code.join(''),
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);

    try {
      await resendOTP({
        emailOrPhone,
        purpose,
      });

      // Reset timer
      setTimeLeft(30);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);

      if (onResend) {
        onResend();
      }
    } catch (error) {
      // Error is handled by the store
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/auth/login');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Verify your identity</h2>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit verification code to:
        </p>
        <p className="text-sm font-medium">
          {emailOrPhone.includes('@')
            ? `${emailOrPhone.slice(0, 3)}***${emailOrPhone.slice(emailOrPhone.indexOf('@'))}`
            : `${emailOrPhone.slice(0, 2)}******${emailOrPhone.slice(-2)}`
          }
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-center block">Enter verification code</Label>
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={isLoading}
                aria-label={`Digit ${index + 1} of verification code`}
              />
            ))}
          </div>
          {fieldErrors.code && (
            <p className="text-sm text-destructive text-center">{fieldErrors.code}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isCodeComplete}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify code'
          )}
        </Button>
      </form>

      {/* Resend Code */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?
        </p>
        {canResend ? (
          <Button
            type="button"
            variant="link"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="h-auto p-0 text-sm"
          >
            {resendLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend code'
            )}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Resend code in <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
        )}
      </div>

      {/* Cancel Button */}
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={handleCancel}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Button>

      {/* Help Text */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>
          For security reasons, this code will expire in 10 minutes.
        </p>
        <p>
          If you continue to have issues, please{' '}
          <a
            href="/support"
            className="text-primary hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};