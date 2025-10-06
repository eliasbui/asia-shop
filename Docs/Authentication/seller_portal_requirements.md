# E-commerce Seller Portal (Frontend Only) — Requirements

## 1. Scope & Roles
- **User types**
  - **Owner:** full control, store configuration, staff management.
  - **Manager:** product, pricing, order, and promotion management.
  - **Staff (CS/Fulfillment):** order handling, stock updates, customer chat/reply.
  - **Accountant:** revenue view, payouts, reconciliation.
- **Role-based access control (RBAC):** per-feature permissions (e.g., `products.view`, `orders.edit`, `reports.export`).
- **Multi-store support:** one seller account can manage multiple storefronts.

---

## 2. Product & Inventory Management
- **Product creation / editing**
  - Fields: `id`, `sku`, `slug`, `title`, `brand`, `category`, `attributes`, `media gallery`, `price`, `stock`, `variant mapping`.
  - Dynamic attributes per category.
- **Bulk operations**
  - Import/export CSV/XLSX.
  - Mass edit (price, stock, visibility).
  - Barcode generation & print.
- **Inventory**
  - Track per variant: `available`, `reserved`, `sold`, `defective`.
  - Low-stock alerts & thresholds.
  - Warehouse assignment (mock).

---

## 3. Orders & Fulfillment
- **Lifecycle:** `Pending → Confirmed → Packed → Shipped → Delivered → Returned/Cancelled`.
- **Operations**
  - Batch fulfillment, bulk updates.
  - Shipping label print (mock).
  - Barcode/QR scanning.
  - Integration placeholder for 3PL/shipping APIs.
- **Customer Service**
  - Message center (mock), disputes, refunds.

---

## 4. Pricing, Promotion & Flash Sale
- Seller-defined:
  - Base price, discount price, %off, flash sale (time-bound).
  - Coupons/vouchers (code, validity, usage limit).
  - Tiered pricing (volume-based).
  - Channel-specific prices.
- **Validation:** apply the **highest discount** only (no stacking).

---

## 5. Payment & Reconciliation
- Dashboard includes:
  - Gross revenue, platform fees, net payout.
  - Payout schedule & history.
  - Export reports (CSV/PDF).
- Mock ledger: transaction + fee breakdown.
- Tax summary (optional).

---

## 6. UI / UX & Framework
- **Next.js (latest)** on **Node.js 24**.
- **shadcn/ui + Tailwind CSS**, **Dark mode**, **Design Tokens**, **Theming**.
- Responsive desktop/tablet layout.
- Data grids (TanStack Table).
- Skeletons & shimmer loaders.
- Empty/error states with clear CTAs.
- **i18n:** English + Vietnamese via **next-intl**.
- **Accessibility:** WCAG 2.1 AA.

---

## 7. Performance & Rendering
- **SSR/ISR** for SEO & speed.
- ISR TTL: Dashboard 120s, Product list 300s.
- Code-splitting by route/module.
- Lazy load charts/tables.

---

## 8. Analytics & Logging
- **GA4 / PostHog:** track login, product publish, order update, payout request.
- **Consent banner** for analytics.
- **Sentry (optional)** for error tracking.

---

## 9. API Contracts (REST)
### Product
```
GET    /seller/products?page=1&size=20&status=active
POST   /seller/products
PUT    /seller/products/{id}
DELETE /seller/products/{id}
POST   /seller/products/import
GET    /seller/products/export
```
### Orders
```
GET    /seller/orders?status=shipped
PATCH  /seller/orders/{id}/status
POST   /seller/orders/batch-fulfill
```
### Promotion
```
POST   /seller/discounts
GET    /seller/discounts
```
### Finance
```
GET /seller/payouts
GET /seller/reports/revenue?period=monthly
```
**Error format:** `{ code, message }`

---

## 10. Information Architecture
```
/seller
  /dashboard
  /products
    /new
    /[id]/edit
  /inventory
  /orders
    /[id]
  /promotions
  /payouts
  /reports
  /settings
    /profile
    /staff
    /permissions
```

---

## 11. State & Data Layer
- **TanStack Query** – server state (products, orders, reports).
- **Zustand** – client/UI state (auth, layout, filters).
- **Zod** – schema validation.
- **MSW** – mock API dev/test.
- **Axios/fetch wrapper** – token attach, error normalization.

---

## 12. Authentication & Security
- **Bearer Token (in-memory)**.
- **reCAPTCHA v3** for login/register.
- **2FA** optional for owners.
- **Rate limit:** throttle uploads, discount creations.
- **Mask sensitive data:** partial email/phone display.
- **RBAC menu gating.**

---

## 13. Dashboard & Reports
- Sales KPIs: daily/weekly/monthly.
- Charts: revenue trend, top categories, refund ratio.
- Filters: time range & store.
- Export: CSV/PDF.

---

## 14. Project Structure
```
src/
  app/seller/
    dashboard/page.tsx
    products/[id]/edit/page.tsx
    products/new/page.tsx
    orders/[id]/page.tsx
    promotions/page.tsx
    payouts/page.tsx
    reports/page.tsx
    settings/(tabs)/...
  components/seller/
    charts/
    tables/
    forms/
  lib/
    api/seller/
    state/seller/
    utils/
  styles/
```

---

## 15. Core Components
- `SellerNavbar`, `Sidebar`, `DashboardCard`
- `ProductTable`, `ProductForm`, `InventoryTable`
- `OrderTable`, `OrderDetail`, `FulfillmentModal`
- `PromotionForm`, `CouponTable`
- `RevenueChart`, `PayoutCard`
- `RolePermissionForm`, `StaffTable`
- Shared: `Skeleton`, `EmptyState`, `ErrorBox`, `ConfirmDialog`

---

## 16. MVP Backlog
1. Auth + Role Management  
2. Dashboard Overview  
3. Product CRUD + Variants + Bulk import/export  
4. Inventory Tracking  
5. Order List + Fulfillment Flow  
6. Promotions Management  
7. Payouts & Reports  
8. Settings & Permissions  
9. Analytics + Consent  
10. SEO/ISR Optimization

---

## 17. Coding Conventions
- Type-safe via TypeScript + Zod.  
- Fetch wrapper handles token & error refresh.  
- Clear separation: TanStack Query (server) vs Zustand (client).  
- Naming: kebab-case (routes), camelCase (vars), PascalCase (components).  
- Tailwind utility + token-based theme.  
- Testing: Jest/Vitest + RTL + Playwright E2E.
