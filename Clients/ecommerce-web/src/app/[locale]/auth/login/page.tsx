"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/components/common/link";
import { Button } from "@/components/common/button";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { authConfig } from "@/lib/auth/config";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthActions();
  
  // Get return URL from query params or use current page
  const returnUrl = searchParams.get("returnUrl") || window.location.href;

  useEffect(() => {
    // If already authenticated, redirect to account
    if (isAuthenticated) {
      router.push("/account");
      return;
    }

    // Redirect to auth-web service
    const authLoginUrl = `${authConfig.authWebUrl}/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = authLoginUrl;
  }, [isAuthenticated, router, returnUrl]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Redirecting to Login...</h1>
        <p className="text-muted-foreground mb-6">
          You will be redirected to our secure login page.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => login(returnUrl)} 
            className="w-full"
            disabled={false}
          >
            Go to Login
          </Button>
          
          <Link href="/auth/register" className="block">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 text-sm">
          <p className="text-muted-foreground">
            Do not have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
