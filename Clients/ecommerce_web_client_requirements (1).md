# E-commerce Web Client (Frontend Only) Requirements

## 1) Scope & Roles
- **Buyer-facing only**: guest users + logged-in users.
- **Guest checkout**: checkout without account (login encouraged at Payment/Review).

## 2) Search & Catalog
- Scale: up to **100k products**.  
- **Facets**: price, brand, category, dynamic attributes, shipping range, rating, flash sale.  
- **Autosuggest**: keyword suggestions, categories, lite products (image/price).  
  - Debounce: **250ms**  
  - Cache: **5 min per session**  
  - Prefetch trending terms on input focus (every 10 min).

## 3) Account & Authentication (FE flow)
- Email/Phone + Password, **Google reCAPTCHA v3** (Login/Register/Checkout).  
- OTP, **Google OAuth**, **2FA** after login.  
- **Bearer Access Token** (in-memory only).  
- **Mask sensitive data**: `ph***@mail.com`, `09******45`.

## 4) Cart & Checkout
- **Multi-step**: Cart → Address → Shipping → Payment → Review.  
- Manage variants, apply coupon, shipping fee (mock), addresses, payment methods (mock SDK).  
- **Discount rule**: coupon + flash sale → **highest discount only**.

## 5) i18n & Currency
- **next-intl** (App Router).  
- Languages: **vi** default, **en** fallback.  
- Format number/date/currency using **Intl**.  
- Primary currency: **VND**, optional extra.

## 6) UI/UX & Design System
- **Next.js (latest)** on **Node.js 24**.  
- **shadcn/ui + Tailwind CSS**.  
- **Dark Mode**, **Theming + Design Tokens**.  
- **Skeleton loading**: cards/lists/detail with shimmer effect.  
- Empty state: clear text + CTA.  
- Error state: message + error code + Retry.

## 7) Performance & Rendering
- **SSR/SSG/ISR** for SEO.  
- **ISR/Edge** for listing & product.  
- **Code splitting**, **lazy images**, **Image CDN**.  
- ISR TTL:  
  - Listing/Search: **60s**  
  - Product: **300s**  

## 8) Accessibility
- Target: **WCAG 2.1 AA**.  
- Full keyboard navigation, visible focus, skip link.  
- Autosuggest: proper `aria-*` + **aria-live polite**.

## 9) Analytics & Consent
- **GA4** events: search, view item, add-to-cart, checkout steps, promo apply, login, signup.  
- **Consent banner**: toggle analytics per GDPR/CCPA.

## 10) Client Rate-limit
- Throttle heavy actions: search, autosuggest, coupon apply, OTP requests.  
- Prevent spam: disable buttons with loading states.

---

## 11) Domain Models (TypeScript)
```ts
export type Money = { currency: string; amount: number };

export type Price = {
  list: Money;
  sale?: Money;
  percentOff?: number;
  flashSale?: { endsAt: string; timezone: 'UTC+7' };
};

export type Media = { url: string; alt: string; type?: 'image'|'video' };

export type Variant = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price?: Price;
  stock: { status: 'in-stock'|'low-stock'|'out-of-stock'; qty?: number };
  media?: Media[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  attributes: Record<string, string | string[]>;
  media: Media[];
  rating: number;
  reviewCount: number;
  price: Price;
  badges?: ('flashSale'|'new'|'bestseller')[];
  specs?: Record<string, string>;
  shortDesc?: string;
  longDesc?: string;
  variants?: Variant[];
};

export type Paginated<T> = { page: number; size: number; total: number; items: T[]; };

export type SuggestPayload = {
  suggestedQueries: string[];
  topCategories: { slug: string; name: string }[];
  topProducts: Pick<Product,'id'|'slug'|'title'|'media'|'price'>[];
};
```

---

## 12) API Contract (REST)
- **Listing/Search**  
  `GET /products?page=1&size=24&sort=price:asc&brand=Apple&category=phones`  
  → `Paginated<Product>`  

- **Detail**  
  `GET /products/{slug}` → `Product`  

- **Suggest**  
  `GET /suggest?q=ip&limit=10` → `SuggestPayload`  

- **Shipping (mock)**  
  `GET /shipping/quotes?dest=HCM&items=...` → list of `{id, name, etaDays, price, tag}`  

- **Coupon**  
  `POST /coupons/validate { code, cart }` → `{ valid, discount, reason? }`  

- **Auth**  
  - `POST /auth/login`, `/auth/register` (reCAPTCHA token)  
  - `POST /auth/otp/send`, `/auth/otp/verify`  
  - `POST /auth/2fa/verify`  
  → `{ accessToken, user }`  

- **Errors**: HTTP status + `{ code, message }`.

---

## 13) Information Architecture & Routes
- `/` – home (banner, flash sale, categories, trending keywords)  
- `/c/[categorySlug]` – listing + facets  
- `/s` – search  
- `/p/[slug]` – product detail  
- `/cart` – cart  
- `/checkout` – Address → Shipping → Payment → Review  
- `/auth/*` – login, register, 2FA  
- `/account` – profile, addresses, orders (mock), wishlist  
- `/collections/[slug]` – thematic landing pages  
- `/wishlist`  
- `/help`, `/legal/*`

---

## 14) Project Structure (Next.js App Router)
```
src/
  app/
    page.tsx                 // Home
    c/[categorySlug]/page.tsx
    s/page.tsx
    p/[slug]/page.tsx
    cart/page.tsx
    checkout/(steps)/...
    auth/login/page.tsx
    auth/register/page.tsx
    auth/2fa/page.tsx
    account/(tabs)/...
    collections/[slug]/page.tsx
  components/
    product/...
    search/...
    common/...
  lib/
    api/
    i18n/
    state/
    utils/
  styles/
  tests/
```

---

## 15) Libraries & Config
- **Next.js (App Router)**  
- **TanStack Query** (server state)  
- **Zustand** (cart/auth/preferences)  
- **Zod** (API response validation)  
- **MSW** (mock API)  
- **next-intl**, **Tailwind + shadcn/ui**  
- **next/image** optimization  
- **GA4**, **reCAPTCHA v3**

---

## 16) Core Components
- `ProductCard`, `PriceBlock`, `VariantSelector`, `ShippingOptions`, `Countdown`  
- `AutosuggestInput`, `FacetFilter`  
- `Skeletons`, `ErrorBox`, `EmptyState`, `Rating`

---

## 17) MVP Backlog (Phased)
1. Home  
2. Listing  
3. Product  
4. Cart  
5. Checkout (multi-step, guest allowed)  
6. Auth (Login/Register/OTP/OAuth/2FA)  
7. Account (Profile, Addresses, Orders mock, Wishlist)  
8. Autosuggest  
9. i18n (vi/en) & Dark mode  
10. Analytics + Consent  
11. Rate-limit actions  
12. SEO/ISR basics

---

## 18) Coding Conventions
- **Type-safe API**: validate with Zod.  
- **Fetch wrapper**: auto-attach Bearer, handle 401.  
- **State separation**: TanStack Query (server) vs Zustand (client).  
- **Naming**: kebab-case routes, camelCase TS vars, PascalCase components.  
- **Styling**: Tailwind utilities + tokens.
