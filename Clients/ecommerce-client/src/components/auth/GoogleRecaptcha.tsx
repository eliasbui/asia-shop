"use client";

import React, { useEffect, useState } from 'react';

interface GoogleRecaptchaProps {
  onVerify: (token: string) => void;
  action: string;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const GoogleRecaptcha: React.FC<GoogleRecaptchaProps> = ({ onVerify, action }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.warn('reCAPTCHA site key not found');
      return;
    }

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Execute reCAPTCHA when ready
    const executeRecaptcha = async () => {
      try {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!siteKey || !window.grecaptcha) return;

        const token = await window.grecaptcha.execute(siteKey, { action });
        onVerify(token);
      } catch (error) {
        console.error('reCAPTCHA execution failed:', error);
      }
    };

    executeRecaptcha();
  }, [isLoaded, onVerify, action]);

  return null; // This component doesn't render anything visible
};