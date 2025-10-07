"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/components/common/link";
import { Button } from "@/components/common/button";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { authConfig } from "@/lib/auth/config";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuthActions();
  
  // Get return URL from query params or use current page
  const returnUrl = searchParams.get("returnUrl") || window.location.href;

  useEffect(() => {
    // If already authenticated, redirect to account
    if (isAuthenticated) {
      router.push("/account");
      return;
    }

    // Redirect to auth-web service
    const authRegisterUrl = `${authConfig.authWebUrl}/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = authRegisterUrl;
  }, [isAuthenticated, router, returnUrl]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Redirecting to Registration...</h1>
        <p className="text-muted-foreground mb-6">
          You will be redirected to our secure registration page.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => register(returnUrl)} 
            className="w-full"
            disabled={false}
          >
            Create Account
          </Button>
          
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
