'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { useAuthStore } from '@/lib/state/auth-store';

// Form validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading, isAuthenticated } = useAuthStore();
  
  const [error, setError] = useState<string | null>(null);
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push(returnUrl);
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      // Redirect to return URL or default
      if (returnUrl && returnUrl !== '/') {
        // If returnUrl is external, use redirect helper
        setTimeout(() => {
          window.location.href = returnUrl;
        }, 500);
      } else {
        router.push(returnUrl);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('serverError');
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('register')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('hasAccount')}{' '}
          <Link
            href={`/auth/login${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
            className="font-medium text-primary hover:text-primary/80"
          >
            {t('login')}
          </Link>
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('firstName')}</Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              className="mt-1"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register('lastName')}
              className="mt-1"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="mt-1"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>
        
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
        
        <div className="flex items-center">
          <input
            id="accept-terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            required
          />
          <Label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
            {t('acceptTerms')}
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('loading') : t('register')}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Implement OAuth registration
              console.log('Google OAuth registration');
            }}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('signInWithGoogle')}
          </Button>
        </div>
      </div>
    </div>
  );
}