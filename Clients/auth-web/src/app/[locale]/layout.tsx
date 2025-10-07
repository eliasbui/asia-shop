import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}