import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { AppLocale, defaultLocale, locales } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale;

  if (!locales.includes(locale as AppLocale)) {
    notFound();
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});
