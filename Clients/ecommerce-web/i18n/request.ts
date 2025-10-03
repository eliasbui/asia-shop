import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales } from "../src/lib/i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  return {
    locale: locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
