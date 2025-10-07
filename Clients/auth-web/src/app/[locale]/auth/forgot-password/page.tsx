'use client';

import { useState, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { authClient } from '@/lib/api/auth-client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authClient.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            {t('passwordResetSent')}
          </h2>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to your email. Please check your inbox and follow the instructions.
          </p>
        </div>
        
        <div className="text-center">
          <Link
            href={`/${locale}/auth/login`}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-card-foreground mb-2">{t('forgotPassword')}</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
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
          <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold button-glow" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" className="text-primary-foreground" />
                Sending...
              </span>
            ) : (
              <span className="relative z-10">Send Reset Link</span>
            )}
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm">
        <Link
          href={`/${locale}/auth/login`}
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="space-y-6 animate-pulse">
      <div className="h-20 bg-muted rounded-lg"></div>
      <div className="h-12 bg-muted rounded-lg"></div>
    </div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
