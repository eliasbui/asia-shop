import { getRequestConfig } from 'next-intl/server';
import { locales, Locale, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    locale: locale || defaultLocale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});