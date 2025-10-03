import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    locale = 'vi';
  }

  return {
    locale,
    messages: (await import(`./src/lib/i18n/messages/${locale}.json`)).default
  };
});