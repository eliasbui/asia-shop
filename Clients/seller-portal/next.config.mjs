import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query']
  }
};

export default withNextIntl(config);
