"use client";

import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const handleGoogleLogin = () => {
    // Handle Google OAuth flow
    console.log('Google OAuth initiated');
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
              &ldquo;Join thousands of satisfied customers who trust AsiaShop for quality products and exceptional service.&rdquo;
            </p>
            <footer className="text-sm">Join our community today</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Join AsiaShop to start shopping amazing deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm onGoogleLogin={handleGoogleLogin} />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </div>
            </CardFooter>
          </Card>

          {/* Benefits List */}
          <div className="rounded-lg border bg-card p-4 text-center text-sm">
            <h3 className="font-medium mb-3">Why join AsiaShop?</h3>
            <ul className="space-y-2 text-left text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Exclusive member-only deals
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Early access to sales and new products
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Personalized recommendations
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Fast and secure checkout
              </li>
            </ul>
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