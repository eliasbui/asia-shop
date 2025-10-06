"use client";

import { Button } from '@/components/ui/button';
import { uiStore } from '@/lib/state/ui-store';

export function AnalyticsConsentBanner() {
  const consent = uiStore((state) => state.analyticsConsent);
  const setConsent = uiStore((state) => state.setAnalyticsConsent);

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-4 right-4 flex max-w-md flex-col gap-3 rounded-lg border bg-background/95 p-4 shadow-lg">
      <div className="text-sm font-semibold">Analytics consent</div>
      <p className="text-sm text-muted-foreground">
        We use GA4 and PostHog to understand how the portal is used. Analytics is optional and helps us improve order and payout features.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setConsent(false)}>
          Reject
        </Button>
        <Button size="sm" onClick={() => setConsent(true)}>
          Allow
        </Button>
      </div>
    </div>
  );
}
