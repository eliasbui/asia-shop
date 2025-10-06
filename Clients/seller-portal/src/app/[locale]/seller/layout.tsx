import { ReactNode } from 'react';

import { SellerNavbar } from '@/components/seller/layout/seller-navbar';
import { SellerSidebar } from '@/components/seller/layout/seller-sidebar';
import { AnalyticsConsentBanner } from '@/components/seller/settings/analytics-consent-banner';

export default function SellerLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      <SellerNavbar />
      <div className="flex">
        <SellerSidebar locale={params.locale} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          {children}
          <AnalyticsConsentBanner />
        </main>
      </div>
    </div>
  );
}
