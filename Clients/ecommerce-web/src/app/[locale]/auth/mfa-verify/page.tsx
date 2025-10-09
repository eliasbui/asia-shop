"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MfaService, type VerifyMfaRequest } from "@/lib/api/services/mfa-service";
import { AuthService } from "@/lib/api/services/auth-service";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Smartphone, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const totpFormSchema = z.object({
  totpCode: z.string().length(6, "TOTP code must be exactly 6 digits"),
});

const backupCodeFormSchema = z.object({
  backupCode: z.string().min(8, "Backup code must be at least 8 characters"),
});

const emailOtpFormSchema = z.object({
  emailOtp: z.string().length(6, "Email OTP must be exactly 6 digits"),
});

export default function MfaVerifyPage() {
  const searchParams = useSearchParams();
  const { redirectToAuth } = useAuthBridge();
  const queryClient = useQueryClient();
  const [mfaMethod, setMfaMethod] = useState<"totp" | "backup" | "email">("totp");
  const [userId, setUserId] = useState<string>("");
  const [loginData, setLoginData] = useState<any>(null);

  const totpForm = useForm<{ totpCode: string }>({
    resolver: zodResolver(totpFormSchema),
    defaultValues: {
      totpCode: "",
    },
  });

  const backupCodeForm = useForm<{ backupCode: string }>({
    resolver: zodResolver(backupCodeFormSchema),
    defaultValues: {
      backupCode: "",
    },
  });

  const emailOtpForm = useForm<{ emailOtp: string }>({
    resolver: zodResolver(emailOtpFormSchema),
    defaultValues: {
      emailOtp: "",
    },
  });

  useEffect(() => {
    // Get data from sessionStorage (stored during login redirect)
    const storedUserId = sessionStorage.getItem("mfaUserId");
    const storedLoginData = sessionStorage.getItem("pendingLoginData");

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedLoginData) {
      try {
        setLoginData(JSON.parse(storedLoginData));
      } catch (e) {
        console.error("Failed to parse stored login data");
      }
    }

    // Get userId from URL params if available
    const urlUserId = searchParams.get("userId");
    if (urlUserId) {
      setUserId(urlUserId);
      sessionStorage.setItem("mfaUserId", urlUserId);
    }
  }, [searchParams]);

  // Verify MFA mutation
  const verifyMfaMutation = useMutation({
    mutationFn: (request: VerifyMfaRequest) => MfaService.verifyMfa(request),
    onSuccess: async (response) => {
      if (response.success) {
        toast.success("Authentication successful!");

        // Clear MFA session data
        sessionStorage.removeItem("mfaUserId");
        sessionStorage.removeItem("pendingLoginData");

        // If we have pending login data, complete the login process
        if (loginData) {
          try {
            // This would normally be handled by the auth bridge
            // For now, redirect to profile
            window.location.href = "/profile";
          } catch (error) {
            console.error("Failed to complete login:", error);
            window.location.href = "/";
          }
        } else {
          window.location.href = "/profile";
        }
      } else {
        toast.error("Invalid code. Please try again.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Verification failed");
    },
  });

  // Send Email OTP mutation
  const sendEmailOtpMutation = useMutation({
    mutationFn: () => MfaService.sendEmailOtp({ userId }),
    onSuccess: () => {
      toast.success("Email OTP sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send email OTP");
    },
  });

  const onTotpSubmit = (data: { totpCode: string }) => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    verifyMfaMutation.mutate({
      userId,
      mfaCode: data.totpCode,
      mfaType: "totp",
    });
  };

  const onBackupCodeSubmit = (data: { backupCode: string }) => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    verifyMfaMutation.mutate({
      userId,
      mfaCode: data.backupCode,
      mfaType: "backup",
    });
  };

  const onEmailOtpSubmit = (data: { emailOtp: string }) => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    verifyMfaMutation.mutate({
      userId,
      mfaCode: data.emailOtp,
      mfaType: "email",
    });
  };

  const handleSendEmailOtp = () => {
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }
    sendEmailOtpMutation.mutate();
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem("mfaUserId");
    sessionStorage.removeItem("pendingLoginData");
    redirectToAuth();
  };

  if (!userId) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>Session Expired</CardTitle>
              <CardDescription>
                Your verification session has expired. Please login again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBackToLogin} className="w-full">
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Verify Your Identity</h1>
          <p className="text-muted-foreground mt-2">
            Complete your authentication with two-factor verification
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                2FA Required
              </Badge>
            </div>
            <CardTitle>Choose Verification Method</CardTitle>
            <CardDescription>
              Select one of the available methods to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mfaMethod} onValueChange={(value) => setMfaMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="totp" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  App
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="backup" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Backup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="totp" className="space-y-4 mt-6">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Authenticator App</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <form onSubmit={totpForm.handleSubmit(onTotpSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="totpCode">Authentication Code</Label>
                    <Input
                      id="totpCode"
                      {...totpForm.register("totpCode")}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      autoFocus
                    />
                    {totpForm.formState.errors.totpCode && (
                      <p className="text-sm text-destructive mt-1">
                        {totpForm.formState.errors.totpCode.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={verifyMfaMutation.isPending}
                    className="w-full"
                  >
                    {verifyMfaMutation.isPending ? "Verifying..." : "Verify Code"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-6">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Email Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Click the button below to receive a verification code via email
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  onClick={handleSendEmailOtp}
                  disabled={sendEmailOtpMutation.isPending}
                  className="w-full"
                >
                  {sendEmailOtpMutation.isPending ? "Sending..." : "Send Email Code"}
                </Button>

                <form onSubmit={emailOtpForm.handleSubmit(onEmailOtpSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="emailOtp">Email Code</Label>
                    <Input
                      id="emailOtp"
                      {...emailOtpForm.register("emailOtp")}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    {emailOtpForm.formState.errors.emailOtp && (
                      <p className="text-sm text-destructive mt-1">
                        {emailOtpForm.formState.errors.emailOtp.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={verifyMfaMutation.isPending}
                    className="w-full"
                  >
                    {verifyMfaMutation.isPending ? "Verifying..." : "Verify Email Code"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4 mt-6">
                <div className="text-center">
                  <Key className="w-12 h-12 text-primary mx-auto mb-2" />
                  <h3 className="font-medium">Backup Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter one of your backup recovery codes
                  </p>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Backup codes are one-time use only. Keep them secure!
                  </AlertDescription>
                </Alert>

                <form onSubmit={backupCodeForm.handleSubmit(onBackupCodeSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="backupCode">Backup Code</Label>
                    <Input
                      id="backupCode"
                      {...backupCodeForm.register("backupCode")}
                      placeholder="Enter backup code"
                      className="font-mono"
                    />
                    {backupCodeForm.formState.errors.backupCode && (
                      <p className="text-sm text-destructive mt-1">
                        {backupCodeForm.formState.errors.backupCode.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={verifyMfaMutation.isPending}
                    className="w-full"
                  >
                    {verifyMfaMutation.isPending ? "Verifying..." : "Use Backup Code"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}