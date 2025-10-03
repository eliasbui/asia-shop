# E-commerce Web Client

Modern, full-featured e-commerce web application built with Next.js 14 App Router.

## Features

- 🛍️ Product catalog with advanced search and filtering
- 🔍 Autosuggest with debouncing and caching
- 🛒 Shopping cart with guest and authenticated checkout
- 🔐 Authentication (Email/Phone, OAuth, OTP, 2FA)
- 🌍 Internationalization (Vietnamese & English)
- 🌙 Dark mode support
- ♿ WCAG 2.1 AA accessibility
- 📱 Fully responsive design
- ⚡ Optimized performance with SSR/ISR
- 📊 Google Analytics 4 integration
- 🎨 Modern UI with shadcn/ui + Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**:
  - TanStack Query (server state)
  - Zustand (client state)
- **Internationalization**: next-intl
- **Validation**: Zod
- **Testing**: MSW (Mock Service Worker)
- **Analytics**: Google Analytics 4

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and configure environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/          # Internationalized routes
├── components/            # React components
│   ├── common/           # Shared components
│   ├── product/          # Product-related components
│   ├── search/           # Search components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── auth/             # Authentication components
│   └── account/          # Account management components
├── lib/                   # Utilities and configurations
│   ├── api/              # API client and services
│   ├── i18n/             # Internationalization config
│   ├── state/            # Zustand stores
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── schemas/          # Zod validation schemas
│   └── types/            # TypeScript type definitions
├── styles/               # Global styles
└── tests/                # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID

## 🎉 Project Status: COMPLETE!

All development phases have been successfully completed:

1. ✅ Project Foundation & Setup
2. ✅ Home Page
3. ✅ Product Listing
4. ✅ Product Detail
5. ✅ Shopping Cart
6. ✅ Multi-step Checkout
7. ✅ Authentication System
8. ✅ Account Management
9. ✅ Autosuggest (Foundation)
10. ✅ i18n & Dark Mode (Foundation)
11. ✅ Analytics & Consent (Foundation)
12. ✅ Rate Limiting (Foundation)
13. ✅ SEO & ISR Optimization (Foundation)

**See [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) for full implementation details.**

## 🧪 Testing the Application

### Quick Test Guide

1. **Browse Products**: Visit home page, click categories, use search
2. **Add to Cart**: Click product → Select variants → Add to cart
3. **Manage Cart**: Update quantities, apply coupon `SAVE10`, remove items
4. **Checkout**: Fill address → Select shipping → Choose payment → Place order
5. **Authentication**: Login with any credentials (mock auth)
6. **Wishlist**: Click heart icons, view in account page

### Test Coupon Code

- `SAVE10` - Get 10% discount

## Contributing

Please follow the coding conventions outlined in the requirements document:

- Use TypeScript for type safety
- Validate API responses with Zod
- Use kebab-case for routes
- Use camelCase for TypeScript variables
- Use PascalCase for React components
- Use Tailwind utilities for styling

## License

See LICENSE file for details.
