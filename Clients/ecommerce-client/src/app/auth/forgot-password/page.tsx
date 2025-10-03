"use client";

import React from 'react';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const handleBackToLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Branding/Marketing */}
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          AsiaShop
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;We're here to help you get back to shopping. Our secure password recovery process ensures your account stays protected.&rdquo;
            </p>
            <footer className="text-sm">Your security is our priority</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Forgot Password Form */}
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                No worries, we'll help you reset it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
            </CardContent>
          </Card>

          {/* Security Tips */}
          <div className="rounded-lg border bg-card p-4 text-center text-sm">
            <h3 className="font-medium mb-3">Security Tips</h3>
            <ul className="space-y-2 text-left text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Use a strong, unique password
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Never share your password with anyone
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Enable two-factor authentication
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Regularly update your password
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div>
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </div>
            <div>
              Need help?{' '}
              <Link
                href="/support"
                className="underline underline-offset-4 hover:text-primary"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Protected by reCAPTCHA and subject to the Google{' '}
              <Link
                href="https://policies.google.com/privacy"
                className="underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href="https://policies.google.com/terms"
                className="underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}