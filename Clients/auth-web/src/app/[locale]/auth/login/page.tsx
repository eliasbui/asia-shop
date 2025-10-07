'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuthStore } from '@/lib/state/auth-store';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  
  const [error, setError] = useState<string | null>(null);
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push(returnUrl);
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      console.log('[LoginPage] Attempting login...');
      await login(data.email, data.password);
      console.log('[LoginPage] Login successful, cookies set');
      
      // Wait a bit for cookies to be set and broadcast to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Redirect to return URL or default
      if (returnUrl && returnUrl !== '/') {
        console.log('[LoginPage] Redirecting to returnUrl:', returnUrl);
        // Check if returnUrl is external (different origin)
        try {
          const returnUrlObj = new URL(returnUrl);
          const currentOrigin = window.location.origin;
          
          if (returnUrlObj.origin !== currentOrigin) {
            // External redirect - use full page redirect
            console.log('[LoginPage] External redirect detected');
            window.location.href = returnUrl;
          } else {
            // Same-origin redirect - use Next.js router
            console.log('[LoginPage] Same-origin redirect');
            router.push(returnUrl);
          }
        } catch {
          // If URL parsing fails, treat as relative path
          console.log('[LoginPage] Relative path redirect');
          router.push(returnUrl);
        }
      } else {
        console.log('[LoginPage] Redirecting to home');
        router.push('/');
      }
    } catch (err: unknown) {
      console.error('[LoginPage] Login failed:', err);
      const errorMessage = err instanceof Error ? err.message : t('invalidCredentials');
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-card-foreground mb-2">{t('welcomeBack')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link
            href={`/${locale}/auth/register${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t('register')}
          </Link>
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email" className="text-card-foreground font-medium">{t('email')}</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="pl-10 h-11 bg-background border-input focus:border-primary transition-colors input-glow"
              placeholder="you@example.com"
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 text-sm text-destructive flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-card-foreground font-medium">{t('password')}</Label>
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="pl-10 h-11 bg-background border-input focus:border-primary transition-colors input-glow"
              placeholder="••••••••"
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1.5 text-sm text-destructive flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <Label htmlFor="remember-me" className="ml-2 block text-sm text-card-foreground cursor-pointer">
            {t('rememberMe')}
          </Label>
        </div>
        
        <div>
          <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold button-glow" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" className="text-primary-foreground" />
                {t('loading')}
              </span>
            ) : (
              <span className="relative z-10">{t('login')}</span>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-card text-muted-foreground font-medium">
              {t('orContinueWith')}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-base font-medium hover:bg-accent transition-all duration-300 hover:scale-[1.02] button-glow"
            onClick={() => {
              // TODO: Implement OAuth login
              console.log('Google OAuth login');
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="space-y-6 animate-pulse">
      <div className="h-20 bg-muted rounded-lg"></div>
      <div className="h-12 bg-muted rounded-lg"></div>
      <div className="h-12 bg-muted rounded-lg"></div>
      <div className="h-12 bg-muted rounded-lg"></div>
    </div>}>
      <LoginForm />
    </Suspense>
  );
}