# E-commerce Web Client

A modern, production-ready e-commerce web application built with Next.js 15, TypeScript, and TailwindCSS.

## 🚀 Features

### Core Features
- **Multi-language Support**: Vietnamese (default) and English via next-intl
- **State Management**: Zustand for cart, auth, and UI preferences
- **Data Fetching**: TanStack Query with caching and optimistic updates
- **Mock API**: MSW for development with realistic data
- **Type Safety**: Full TypeScript with Zod validation
- **Responsive Design**: Mobile-first with TailwindCSS and shadcn/ui
- **Dark/Light Theme**: System-aware theme switching
- **SEO Optimized**: SSR/SSG/ISR for optimal performance

### E-commerce Features
- **Product Catalog**: Grid/list views with faceted search
- **Shopping Cart**: Persistent cart with real-time updates
- **Wishlist**: Save products for later
- **Multi-step Checkout**: Address → Shipping → Payment → Review
- **Guest Checkout**: Purchase without registration
- **Product Variants**: Size, color, storage options
- **Flash Sales**: Time-limited offers with countdown
- **Autosuggest Search**: Debounced search with caching

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **i18n**: next-intl
- **Mocking**: MSW (Mock Service Worker)
- **Forms**: React Hook Form
- **Icons**: Lucide React

## 🏗️ Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx       # Locale-specific layout
│   │   ├── page.tsx         # Home page
│   │   ├── c/[categorySlug] # Category listing
│   │   ├── p/[slug]         # Product detail
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   └── auth/            # Authentication pages
│   ├── layout.tsx           # Root layout
│   └── not-found.tsx        # 404 page
├── components/
│   ├── product/             # Product components
│   ├── cart/                # Cart components
│   ├── auth/                # Auth components
│   ├── search/              # Search components
│   ├── common/              # Shared components
│   └── ui/                  # Base UI components
├── lib/
│   ├── api/                 # API client & query setup
│   ├── state/               # Zustand stores
│   ├── mock/                # MSW handlers & data
│   ├── i18n/                # Internationalization
│   └── utils/               # Utility functions
├── types/                   # TypeScript types & schemas
├── messages/                # i18n translation files
└── styles/                  # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd Clients/ecommerce-web
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Run

By default, the application uses **Mock API** (MSW) for development:
- No backend services required
- Instant setup
- Mock data for all features

To use **Real Backend APIs**, see the [API Integration Guide](./API_INTEGRATION.md).

## 📝 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 🌐 Internationalization

The app supports Vietnamese (default) and English. Language files are located in `src/messages/`.

### Adding New Translations

1. Add the key to both `vi.json` and `en.json`
2. Use the translation in components:

```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations();
  return <p>{t('common.cart')}</p>;
}
```

## 🎨 Components

### Core Components

- **ProductCard**: Display product with image, price, rating
- **PriceBlock**: Show prices with sale/flash sale support
- **VariantSelector**: Choose product variants (color, size, etc.)
- **Rating**: Star rating display and input
- **ErrorBox**: Consistent error display with retry
- **EmptyState**: Empty state with call-to-action
- **Skeleton**: Loading placeholders

### Example Usage

```tsx
import { ProductCard } from '@/components/product/product-card';

<ProductCard
  product={product}
  locale="vi"
  showQuickAdd={true}
/>
```

## 🗄️ State Management

### Cart Store
```tsx
import { useCartStore } from '@/lib/state/cart-store';

const { addItem, removeItem, clearCart } = useCartStore();
```

### Auth Store
```tsx
import { useAuthStore } from '@/lib/state/auth-store';

const { user, login, logout } = useAuthStore();
```

### UI Store
```tsx
import { useUIStore } from '@/lib/state/ui-store';

const { theme, setTheme, wishlistItems } = useUIStore();
```

## 🔌 API Integration

The app uses MSW for mock APIs in development. Real API integration can be done by:

1. Update the API base URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

2. Replace MSW handlers with real API endpoints

## 🎯 Performance Optimizations

- **ISR (Incremental Static Regeneration)**: Product pages cached for 5 minutes
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based splitting
- **Debounced Search**: 250ms debounce on autosuggest
- **Skeleton Loading**: Immediate UI feedback

## 🔐 Security

- **Input Validation**: All API responses validated with Zod
- **XSS Protection**: React's built-in protection
- **CSRF Protection**: Token-based authentication
- **Rate Limiting**: Client-side throttling for heavy actions
- **Secure Headers**: Next.js security headers

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Optimized for all device sizes

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

## 🧪 Testing

```bash
npm run test        # Run unit tests (to be implemented)
npm run test:e2e    # Run E2E tests (to be implemented)
```

## 📈 Analytics

Google Analytics 4 events are tracked for:
- Page views
- Product views
- Add to cart
- Checkout steps
- Search queries

## 🚢 Deployment

The app is ready for deployment to Vercel, Netlify, or any Node.js hosting:

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-key
```

## 🐛 Common Issues

### Images Not Loading in Development

If you see placeholder image errors, this is normal in development when using external placeholder services. The application will still function correctly.

**Solution**: Images from the real Product API will load properly when connected to the backend.

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm run dev
```

### MSW Service Worker Not Found

If you see "Failed to register service worker" in the browser console:

```bash
# Regenerate the service worker
npx msw init public/ --save
npm run dev
```

### Build Errors After Git Pull

After pulling new changes:

```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build
```

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 💬 Support

For issues and questions, please use the GitHub issues page or refer to:
- [API Integration Guide](./API_INTEGRATION.md) - Backend API setup
- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
