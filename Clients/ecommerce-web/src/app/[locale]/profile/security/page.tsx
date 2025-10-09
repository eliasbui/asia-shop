"use client";

import { useState } from "react";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import { MfaService, type MfaStatusResponse, type MfaSetupResponse, type MfaEnableResponse } from "@/lib/api/services/mfa-service";
import { AuthService } from "@/lib/api/services/auth-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Key, Smartphone, Mail, AlertCircle, CheckCircle, Copy, Download, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

// Form validation schemas
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const mfaVerifySchema = z.object({
  totpCode: z.string().length(6, "Code must be 6 digits"),
});

const mfaDisableSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  mfaCode: z.string().min(1, "MFA code is required"),
  reason: z.string().optional(),
});

const emailOtpSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export default function SecurityPage() {
  const { isAuthenticated } = useAuthBridge();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("password");
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [showMfaDisable, setShowMfaDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Forms
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mfaVerifyForm = useForm({
    resolver: zodResolver(mfaVerifySchema),
    defaultValues: {
      totpCode: "",
    },
  });

  const mfaDisableForm = useForm({
    resolver: zodResolver(mfaDisableSchema),
    defaultValues: {
      currentPassword: "",
      mfaCode: "",
      reason: "",
    },
  });

  const emailOtpForm = useForm({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  // Queries
  const { data: mfaStatus, isLoading: mfaLoading } = useQuery({
    queryKey: ["mfa-status"],
    queryFn: () => MfaService.getMfaStatus(),
    enabled: isAuthenticated,
  });

  // Mutations
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
      AuthService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const setupMfaMutation = useMutation({
    mutationFn: () => MfaService.setupMfa(),
    onSuccess: async (data: MfaSetupResponse) => {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(data.qrCodeUri);
        setQrCodeUrl(qrCodeDataUrl);
        setShowMfaSetup(true);
        toast.success("MFA setup initiated");
      } catch (error) {
        toast.error("Failed to generate QR code");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to setup MFA");
    },
  });

  const enableMfaMutation = useMutation({
    mutationFn: (data: { totpCode: string }) => MfaService.enableMfa(data),
    onSuccess: (data: MfaEnableResponse) => {
      setBackupCodes(data.backupCodes);
      setShowMfaSetup(false);
      toast.success("MFA enabled successfully");
      queryClient.invalidateQueries({ queryKey: ["mfa-status"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to enable MFA");
    },
  });

  const disableMfaMutation = useMutation({
    mutationFn: (data: { currentPassword: string; mfaCode: string; reason?: string }) =>
      MfaService.disableMfa(data),
    onSuccess: () => {
      setShowMfaDisable(false);
      mfaDisableForm.reset();
      toast.success("MFA disabled successfully");
      queryClient.invalidateQueries({ queryKey: ["mfa-status"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to disable MFA");
    },
  });

  const generateBackupCodesMutation = useMutation({
    mutationFn: () => MfaService.generateBackupCodes(),
    onSuccess: (data: string[]) => {
      setBackupCodes(data);
      toast.success("New backup codes generated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate backup codes");
    },
  });

  const sendEmailOtpMutation = useMutation({
    mutationFn: (data: { userId: string; purpose?: string }) => MfaService.sendEmailOtp(data),
    onSuccess: () => {
      toast.success("Email OTP sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send email OTP");
    },
  });

  const onPasswordSubmit = (data: any) => {
    changePasswordMutation.mutate(data);
  };

  const onMfaVerifySubmit = (data: { totpCode: string }) => {
    enableMfaMutation.mutate(data);
  };

  const onMfaDisableSubmit = (data: { currentPassword: string; mfaCode: string; reason?: string }) => {
    disableMfaMutation.mutate(data);
  };

  const onEmailOtpSubmit = (data: { email: string }) => {
    // This would need the user ID from the auth context
    toast.info("Email OTP functionality requires user ID");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view security settings</h1>
          <Button onClick={() => window.location.href = "/auth/login"}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Security Settings</h1>
            <p className="text-muted-foreground">Manage your password and two-factor authentication</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="mfa">Two-Factor Auth</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters long
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="w-full"
                    >
                      {changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mfa">
            <div className="space-y-6">
              {/* MFA Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication Status
                  </CardTitle>
                  <CardDescription>
                    {mfaLoading ? "Loading..." : mfaStatus?.isEnabled
                      ? "Two-factor authentication is enabled on your account"
                      : "Two-factor authentication is not enabled on your account"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mfaLoading ? (
                    <Skeleton className="h-20" />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={mfaStatus?.isEnabled ? "default" : "secondary"}>
                            {mfaStatus?.isEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                          {mfaStatus?.isEnabled && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex gap-2">
                          {mfaStatus?.isEnabled ? (
                            <Dialog open={showMfaDisable} onOpenChange={setShowMfaDisable}>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  Disable 2FA
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                                  <DialogDescription>
                                    This will remove the extra security layer on your account. Are you sure?
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...mfaDisableForm}>
                                  <form onSubmit={mfaDisableForm.handleSubmit(onMfaDisableSubmit)} className="space-y-4">
                                    <FormField
                                      control={mfaDisableForm.control}
                                      name="currentPassword"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Current Password</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="password"
                                              placeholder="Enter current password"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={mfaDisableForm.control}
                                      name="mfaCode"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Authentication Code</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Enter 6-digit code"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={mfaDisableForm.control}
                                      name="reason"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Reason (Optional)</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Why are you disabling 2FA?"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowMfaDisable(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={disableMfaMutation.isPending}
                                      >
                                        {disableMfaMutation.isPending ? "Disabling..." : "Disable 2FA"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Button
                              onClick={() => setupMfaMutation.mutate()}
                              disabled={setupMfaMutation.isPending}
                            >
                              {setupMfaMutation.isPending ? "Setting up..." : "Enable 2FA"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {mfaStatus && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <span>TOTP: {mfaStatus.mfaTypes.includes("totp") ? "Enabled" : "Disabled"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>Email OTP: {mfaStatus.emailOtpEnabled ? "Enabled" : "Disabled"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span>Backup Codes: {mfaStatus.backupCodesCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* MFA Setup Dialog */}
              <Dialog open={showMfaSetup} onOpenChange={setShowMfaSetup}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Scan the QR code below with your authenticator app
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {qrCodeUrl && (
                      <div className="flex justify-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                      </div>
                    )}
                    <Form {...mfaVerifyForm}>
                      <form onSubmit={mfaVerifyForm.handleSubmit(onMfaVerifySubmit)} className="space-y-4">
                        <FormField
                          control={mfaVerifyForm.control}
                          name="totpCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verification Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter 6-digit code"
                                  maxLength={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter the 6-digit code from your authenticator app
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowMfaSetup(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={enableMfaMutation.isPending}
                          >
                            {enableMfaMutation.isPending ? "Verifying..." : "Enable 2FA"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Email OTP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email OTP
                  </CardTitle>
                  <CardDescription>
                    Add email-based one-time password as an additional verification method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...emailOtpForm}>
                    <form onSubmit={emailOtpForm.handleSubmit(onEmailOtpSubmit)} className="space-y-4">
                      <FormField
                        control={emailOtpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={sendEmailOtpMutation.isPending}
                        className="w-full"
                      >
                        {sendEmailOtpMutation.isPending ? "Sending..." : "Send Test OTP"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recovery">
            <div className="space-y-6">
              {/* Backup Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Backup Codes
                  </CardTitle>
                  <CardDescription>
                    Generate backup codes to access your account if you lose your authenticator device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={() => generateBackupCodesMutation.mutate()}
                      disabled={generateBackupCodesMutation.isPending}
                      className="w-full"
                    >
                      {generateBackupCodesMutation.isPending ? "Generating..." : "Generate New Backup Codes"}
                    </Button>

                    {backupCodes.length > 0 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Your Backup Codes:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {backupCodes.map((code, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <code className="text-sm font-mono">{code}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(code)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={downloadBackupCodes}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Codes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(backupCodes.join("\n"))}
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy All
                          </Button>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <p>
                            Save these backup codes in a secure location. Each code can only be used once.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}