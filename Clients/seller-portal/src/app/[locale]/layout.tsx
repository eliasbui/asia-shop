import './globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import { MswLoader } from '@/components/dev/msw-loader';
import { AppProviders } from '@/lib/providers/app-providers';
import { locales } from '@/i18n/locales';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'AsiaShop Seller Portal',
  description: 'Seller portal for managing multi-store e-commerce operations.'
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <MswLoader />
            {children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
