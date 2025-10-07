'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, Key, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { authClient } from '@/lib/api/auth-client';
import type { MfaType } from '@/lib/types';

function MfaVerifyForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mfaType, setMfaType] = useState<MfaType>('TOTP');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const userId = searchParams.get('userId');
  const returnUrl = searchParams.get('returnUrl');

  useEffect(() => {
    if (!userId) {
      router.push(`/${locale}/auth/login`);
    }
  }, [userId, locale, router]);

  const handleVerify = async () => {
    if (!mfaCode || !userId) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);

      const verified = await authClient.verifyMfa({
        userId,
        mfaCode,
        mfaType,
      });

      if (verified) {
        // Redirect to return URL or home
        router.push(returnUrl || `/${locale}`);
      } else {
        setError('Invalid verification code');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!userId) return;

    try {
      setIsSendingOtp(true);
      setError(null);

      await authClient.sendEmailOtp({ userId });
      setOtpSent(true);
      setMfaType('EmailOTP');
      setMfaCode('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mfaCode.length >= 6) {
      handleVerify();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Enter the verification code to complete login
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setMfaType('TOTP')}
          className={`flex-1 pb-3 font-medium transition-colors ${
            mfaType === 'TOTP'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Key className="w-4 h-4" />
            Authenticator App
          </span>
        </button>
        <button
          onClick={() => setMfaType('BackupCode')}
          className={`flex-1 pb-3 font-medium transition-colors ${
            mfaType === 'BackupCode'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Backup Code
        </button>
      </div>

      <div className="space-y-4">
        {mfaType === 'TOTP' && (
          <div>
            <Label htmlFor="totpCode">6-Digit Code from App</Label>
            <Input
              id="totpCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              className="text-center text-2xl tracking-widest font-mono mt-2"
              autoFocus
            />
          </div>
        )}

        {mfaType === 'BackupCode' && (
          <div>
            <Label htmlFor="backupCode">Backup Code</Label>
            <Input
              id="backupCode"
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.trim())}
              onKeyPress={handleKeyPress}
              placeholder="Enter backup code"
              className="text-center font-mono mt-2"
              autoFocus
            />
          </div>
        )}

        {mfaType === 'EmailOTP' && (
          <div>
            <Label htmlFor="emailOtp">Email OTP</Label>
            <Input
              id="emailOtp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              className="text-center text-2xl tracking-widest font-mono mt-2"
              autoFocus
            />
          </div>
        )}

        <Button
          onClick={handleVerify}
          disabled={isVerifying || !mfaCode}
          className="w-full"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Verifying...
            </span>
          ) : (
            'Verify'
          )}
        </Button>

        {mfaType !== 'EmailOTP' && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendEmailOtp}
              disabled={isSendingOtp}
              className="text-sm"
            >
              {isSendingOtp ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Sending...
                </span>
              ) : otpSent ? (
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  OTP sent to your email
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send code via email instead
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <button
          onClick={() => router.push(`/${locale}/auth/login`)}
          className="hover:text-foreground transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default function MfaVerifyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MfaVerifyForm />
    </Suspense>
  );
}
