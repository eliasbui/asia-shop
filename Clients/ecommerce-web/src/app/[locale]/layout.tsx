import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { locales } from "@/lib/i18n/config";
import { Providers } from "./providers";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
