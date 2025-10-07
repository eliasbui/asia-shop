'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { authClient } from '@/lib/api/auth-client';
import { useAuthStore } from '@/lib/state/auth-store';
import type { MfaSetupResponse, MfaEnableResponse } from '@/lib/types';

export default function MfaSetupPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { accessToken } = useAuthStore();
  
  const [step, setStep] = useState<'loading' | 'setup' | 'verify' | 'complete'>('loading');
  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }
    initializeSetup();
  }, [accessToken]);

  const initializeSetup = async () => {
    try {
      const data = await authClient.setupMfa(accessToken!);
      setSetupData(data);
      setStep('setup');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initialize MFA setup');
      setStep('setup');
    }
  };

  const handleCopySecret = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.formattedSecretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      
      const response: MfaEnableResponse = await authClient.enableMfa(accessToken!, totpCode);
      
      if (response.isEnabled) {
        setBackupCodes(response.backupCodes);
        setStep('complete');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    const content = `AsiaShop MFA Backup Codes\n\nGenerated: ${new Date().toISOString()}\n\n${backupCodes.join('\n')}\n\nIMPORTANT: Keep these codes safe. Each can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">2FA Enabled Successfully!</h2>
          <p className="text-muted-foreground">Your account is now protected with two-factor authentication</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Save Your Backup Codes
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
            These codes can be used if you lose access to your authenticator app. Each code can only be used once.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded p-4 mb-4 font-mono text-sm grid grid-cols-2 gap-2">
            {backupCodes.map((code, idx) => (
              <div key={idx} className="text-center py-1">{code}</div>
            ))}
          </div>

          <Button onClick={handleDownloadBackupCodes} variant="outline" className="w-full">
            Download Backup Codes
          </Button>
        </div>

        <Button onClick={() => router.push('/')} className="w-full">
          Continue to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Enable Two-Factor Authentication</h2>
        <p className="text-muted-foreground">Add an extra layer of security to your account</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'setup' && setupData && (
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Step 1: Scan QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
            </p>
            <div className="flex justify-center bg-white p-6 rounded-lg">
              <QRCodeSVG value={setupData.qrCodeUri} size={200} level="H" />
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Or enter the code manually</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you can't scan the QR code, enter this code in your authenticator app:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-4 py-3 rounded font-mono text-sm">
                {setupData.formattedSecretKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySecret}
                className="flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Step 2: Verify Code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the 6-digit code from your authenticator app to complete setup:
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="totpCode">Authentication Code</Label>
                <Input
                  id="totpCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>
              <Button
                onClick={handleVerifyAndEnable}
                disabled={isVerifying || totpCode.length !== 6}
                className="w-full"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Verifying...
                  </span>
                ) : (
                  'Enable 2FA'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
