"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/state/authStore';

export default function TwoFactorPage() {
  const searchParams = useSearchParams();
  const { requires2FA, tempToken, clearError } = useAuthStore();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [purpose, setPurpose] = useState<'login' | 'register' | 'forgot_password' | 'enable_2fa'>('login');

  useEffect(() => {
    // Get email/phone from URL params or store
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const purposeParam = searchParams.get('purpose') as 'login' | 'register' | 'forgot_password' | 'enable_2fa' || 'login';

    if (email || phone) {
      setEmailOrPhone(email || phone || '');
    }

    setPurpose(purposeParam);

    // Clear any existing errors
    clearError();

    // Check if we're in a valid 2FA state
    if (!requires2FA && !tempToken) {
      // Redirect to login if not in 2FA flow
      window.location.href = '/auth/login';
    }
  }, [searchParams, requires2FA, tempToken, clearError]);

  const handleSuccess = () => {
    // Redirect to home page after successful 2FA
    window.location.href = '/';
  };

  const handleCancel = () => {
    // Clear auth state and redirect to login
    const { logout } = useAuthStore.getState();
    logout();
    window.location.href = '/auth/login';
  };

  if (!requires2FA && !tempToken) {
    return (
      <div className="container relative h-screen flex-col items-center justify-center grid">
        <div className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Security Info */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          Enhanced Security
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Two-factor authentication adds an extra layer of security to protect your account from unauthorized access.&rdquo;
            </p>
            <footer className="text-sm">Your account security is our priority</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - 2FA Form */}
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-center">
                Enter the verification code sent to your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OTPVerification
                emailOrPhone={emailOrPhone}
                purpose={purpose}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>

          {/* Security Benefits */}
          <div className="rounded-lg border bg-card p-4 text-center text-sm">
            <h3 className="font-medium mb-3">Why 2FA?</h3>
            <ul className="space-y-2 text-left text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Protects against password theft
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Adds an extra security layer
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Keeps your account secure
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Industry standard security practice
              </li>
            </ul>
          </div>

          {/* Troubleshooting */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              Having trouble receiving codes? Make sure your device has a network connection
              and check that you are using the correct phone number or email address.
            </p>
            <p>
              If you continue to experience issues, please{' '}
              <a
                href="/support"
                className="text-primary hover:underline"
              >
                contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}