"use client";

import { useState, useEffect } from "react";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import { MfaService, type MfaSetupResponse, type MfaEnableResponse } from "@/lib/api/services/mfa-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Shield, Key, CheckCircle, AlertCircle, Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";

const verifyFormSchema = z.object({
  totpCode: z.string().length(6, "TOTP code must be exactly 6 digits"),
});

export default function MfaSetupPage() {
  const { isAuthenticated, redirectToAuth } = useAuthBridge();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"setup" | "verify" | "complete">("setup");
  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const verifyForm = useForm<{ totpCode: string }>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      totpCode: "",
    },
  });

  // Check MFA status
  const { data: mfaStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["mfa-status"],
    queryFn: () => MfaService.getMfaStatus(),
    enabled: isAuthenticated,
  });

  // Setup MFA mutation
  const setupMfaMutation = useMutation({
    mutationFn: () => MfaService.setupMfa(),
    onSuccess: (data) => {
      setSetupData(data);
      setStep("verify");
      toast.success("MFA setup initiated. Please scan the QR code.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to setup MFA");
    },
  });

  // Enable MFA mutation
  const enableMfaMutation = useMutation({
    mutationFn: (totpCode: string) => MfaService.enableMfa({ totpCode }),
    onSuccess: (data: MfaEnableResponse) => {
      setBackupCodes(data.backupCodes);
      setStep("complete");
      toast.success("MFA enabled successfully!");
      queryClient.invalidateQueries({ queryKey: ["mfa-status"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to enable MFA");
    },
  });

  // Regenerate QR code
  const regenerateQrMutation = useMutation({
    mutationFn: () => MfaService.regenerateQrCode({ setupSessionId: setupData?.setupSessionId || "" }),
    onSuccess: (data) => {
      setSetupData(data);
      toast.success("QR code regenerated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to regenerate QR code");
    },
  });

  const onVerifySubmit = (data: { totpCode: string }) => {
    enableMfaMutation.mutate(data.totpCode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to setup MFA</h1>
          <Button onClick={() => redirectToAuth()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // MFA is already enabled
  if (mfaStatus?.isEnabled) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">MFA Already Enabled</CardTitle>
            <CardDescription>
              Two-factor authentication is already enabled on your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                2FA Enabled
              </Badge>
              {mfaStatus.backupCodesCount > 0 && (
                <Badge variant="outline">
                  {mfaStatus.backupCodesCount} backup codes
                </Badge>
              )}
            </div>
            <div className="text-center">
              <Button onClick={() => window.location.href = "/profile/security"}>
                Back to Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Setup Two-Factor Authentication</h1>
        <p className="text-muted-foreground mt-2">
          Add an extra layer of security to your account with TOTP-based authentication
        </p>
      </div>

      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Generate QR Code</CardTitle>
            <CardDescription>
              Click the button below to generate a QR code for your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Make sure you have an authenticator app installed (Google Authenticator,
                Authy, Microsoft Authenticator, etc.)
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button
                onClick={() => setupMfaMutation.mutate()}
                disabled={setupMfaMutation.isPending}
                size="lg"
              >
                {setupMfaMutation.isPending ? "Generating..." : "Generate QR Code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "verify" && setupData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Step 2: Scan QR Code
              </CardTitle>
              <CardDescription>
                Scan this QR code with your authenticator app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  <img
                    src={setupData.qrCodeUri}
                    alt="QR Code for MFA Setup"
                    className="w-64 h-64"
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => regenerateQrMutation.mutate()}
                  disabled={regenerateQrMutation.isPending}
                >
                  Regenerate QR Code
                </Button>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Manual Entry Key</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={setupData.manualEntryKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(setupData.manualEntryKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  If you can't scan the QR code, enter this key manually in your authenticator app
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 3: Verify Setup
              </CardTitle>
              <CardDescription>
                Enter the 6-digit code from your authenticator app to complete the setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="totpCode">Authentication Code</Label>
                  <Input
                    id="totpCode"
                    {...verifyForm.register("totpCode")}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  {verifyForm.formState.errors.totpCode && (
                    <p className="text-sm text-destructive mt-1">
                      {verifyForm.formState.errors.totpCode.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={enableMfaMutation.isPending}
                  className="w-full"
                >
                  {enableMfaMutation.isPending ? "Verifying..." : "Enable Two-Factor Authentication"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {step === "complete" && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>
              Two-factor authentication is now enabled on your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Save these backup codes in a secure location.
                You can use them to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Backup Codes</Label>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded border cursor-pointer hover:bg-muted/80"
                    onClick={() => copyToClipboard(code)}
                  >
                    {code}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Click on any code to copy it to clipboard
              </p>
            </div>

            <div className="text-center space-y-2">
              <Button onClick={() => window.location.href = "/profile/security"} className="w-full">
                Go to Security Settings
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/profile"} className="w-full">
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}