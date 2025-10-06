'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { authClient } from '@/lib/api/auth-client';

// Form validation schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(true);
  
  // Get token from URL
  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await authClient.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('serverError');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Invalid Reset Token
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The password reset link is invalid or has expired.
          </p>
        </div>
        
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-primary hover:text-primary/80"
          >
            Request a new password reset
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('passwordResetSuccess')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been reset successfully.
          </p>
        </div>
        
        <div className="text-center">
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Proceed to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('resetPassword')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('createNewPassword')}
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="password">{t('password')}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            className="mt-1"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className="mt-1"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('loading') : t('resetPassword')}
        </Button>
      </form>
      
      <div className="text-center">
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:text-primary/80"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}