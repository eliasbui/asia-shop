# E-commerce Client - Requirements Document

## 📌 Project Overview

Build a modern e-commerce web application similar to Shopee/Tiki with full customer-facing features using Next.js, TypeScript, and modern UI libraries.

## 🎯 Project Goals

- Create a fully functional e-commerce client interface
- Implement responsive design for mobile and desktop
- Use mock data (no backend integration required)
- Focus on excellent UX/UI and smooth interactions
- Demonstrate modern React/Next.js development practices

## 🛠 Tech Stack

### Core Framework

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **React 18+**

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **scrollxui.dev** - Additional UI components
- **Lucide React** - Icon library
- **class-variance-authority** - For component variants
- **tailwind-merge** - Merge Tailwind classes

### State Management & Data

- **Zustand** - Lightweight state management (for cart)
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### UI Interactions

- **embla-carousel-react** - Carousel/slider components
- **date-fns** - Date formatting
- **sonner** - Toast notifications

## 🎨 Design Requirements

### Color Palette (Shopee-inspired)

```css
--primary: 238 77 45 (Orange #EE4D2D)
--primary-foreground: 255 255 255
--secondary: 26 148 255 (Blue #1A94FF)
--accent: 255 87 34 (Red for deals)
--success: 34 197 94 (Green)
--warning: 251 191 36 (Yellow)
--background: 255 255 255
--surface: 248 248 248
--border: 229 229 229
```

### Typography

- Font Family: Inter, system-ui, sans-serif
- Base Size: 16px (1rem)
- Scale: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px

### Spacing

- Use Tailwind's default spacing scale (4px base unit)
- Container max-width: 1200px
- Section padding: 16px (mobile), 24px (tablet), 32px (desktop)

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ✨ Core Features

### 1. Homepage

**Components:**

- [ ] Hero Slider - Auto-play banner carousel (5-6 slides)
- [ ] Category Grid - 10-12 main categories with icons
- [ ] Flash Sale Section - Countdown timer + horizontal product scroll
- [ ] Product Carousels:
  - Best Sellers
  - New Arrivals
  - Recommended For You
  - Trending Products
- [ ] Brand Showcase - Partner brands grid
- [ ] Promotional Banners - Multiple CTA sections
- [ ] Newsletter Signup

**Requirements:**

- Hero slider with 5 second auto-advance
- Flash sale countdown updates every second
- Smooth horizontal scrolling for product carousels
- Lazy load images below fold
- Skeleton loading states

### 2. Product Listing Page

**Components:**

- [ ] Breadcrumb navigation
- [ ] Filter Sidebar:
  - Category tree
  - Price range slider
  - Rating filter (5-1 stars)
  - Brand checkbox list
  - Shipping options
- [ ] Sort Dropdown:
  - Popular
  - Newest
  - Best Selling
  - Price: Low to High
  - Price: High to Low
- [ ] View Toggle (Grid/List)
- [ ] Product Grid - Responsive (2-4 columns)
- [ ] Pagination
- [ ] Results count
- [ ] Quick View Modal

**Requirements:**

- URL params for filters/sort (shareable links)
- Persist view preference
- Smooth filter transitions
- Mobile: filters in bottom sheet
- Show active filter badges

### 3. Product Detail Page

**Components:**

- [ ] Image Gallery:
  - Main image with zoom on hover
  - Thumbnail navigation
  - Image fullscreen modal
- [ ] Product Information:
  - Product name
  - Rating + review count
  - Price (current, original, discount %)
  - Sold count
  - Stock availability
- [ ] Variant Selector:
  - Size buttons
  - Color swatches
- [ ] Quantity Selector (input + increment/decrement)
- [ ] Action Buttons:
  - Add to Cart
  - Buy Now
  - Add to Wishlist
- [ ] Tabbed Content:
  - Description
  - Specifications table
  - Reviews (rating distribution + review list)
- [ ] Seller Information Card
- [ ] Similar Products Carousel
- [ ] Recently Viewed Products

**Requirements:**

- Update URL on variant selection
- Disable "Add to Cart" if out of stock
- Show delivery estimation
- Return policy information
- Social share buttons

### 4. Shopping Cart

**Components:**

- [ ] Cart Items List:
  - Product image + name
  - Variant details
  - Price per unit
  - Quantity adjuster
  - Subtotal
  - Remove button
- [ ] Select All Checkbox
- [ ] Remove Selected Button
- [ ] Voucher Input Section
- [ ] Price Breakdown:
  - Subtotal
  - Shipping fee
  - Voucher discount
  - Total
- [ ] Checkout Button
- [ ] Continue Shopping Link
- [ ] Empty Cart State

**Requirements:**

- Persist cart in localStorage
- Real-time total calculation
- Show cart count badge in header
- Prevent negative quantities
- Confirm before removing items
- Show savings amount

### 5. Checkout Page

**Components:**

- [ ] Multi-step Flow:
  1. Shipping Address
  2. Payment Method
  3. Review Order
- [ ] Shipping Address Form:
  - Name, Phone
  - Address, City, District, Ward
  - Address type (Home/Office)
  - Save address checkbox
- [ ] Payment Method Selection:
  - COD (Cash on Delivery)
  - Bank Transfer
  - E-wallet (Momo, ZaloPay)
  - Credit/Debit Card
- [ ] Order Summary Sidebar:
  - Product list
  - Quantities
  - Price breakdown
  - Terms checkbox
- [ ] Place Order Button
- [ ] Order Confirmation Page

**Requirements:**

- Form validation with error messages
- Save shipping info for next time
- Calculate shipping based on location
- Terms & conditions modal
- Success animation on order placed

### 6. User Account

**Components:**

- [ ] Account Sidebar Menu:
  - Profile
  - Orders
  - Addresses
  - Wishlist
  - Settings
- [ ] Profile Page:
  - Avatar upload
  - Basic info form
  - Change password
- [ ] Orders Page:
  - Order list with filters (All, To Pay, To Ship, Completed, Cancelled)
  - Order cards with status
  - Track order modal
  - Order detail page
  - Reorder button
  - Review button (for completed orders)
- [ ] Saved Addresses:
  - Address list
  - Add/Edit/Delete
  - Set default
- [ ] Wishlist Grid

**Requirements:**

- Order status timeline
- Filter orders by status
- Search orders by ID or product name
- Download invoice (PDF)
- Request return/refund

### 7. Search Functionality

**Components:**

- [ ] Search Bar (in header)
- [ ] Search Suggestions Dropdown:
  - Recent searches
  - Popular searches
  - Product suggestions (with image)
- [ ] Search Results Page:
  - Same as product listing
  - Highlight search terms
  - "Did you mean...?" for typos

**Requirements:**

- Debounced search (300ms)
- Search history (localStorage)
- Clear search button
- Voice search (optional)

### 8. Additional Features

- [ ] Mobile Bottom Navigation
- [ ] Back to Top Button
- [ ] Sticky Header on Scroll
- [ ] Product Comparison (up to 4 products)
- [ ] Live Chat Widget (UI only)
- [ ] Currency Selector (VND, USD)
- [ ] Language Toggle (EN/VI)
- [ ] Dark Mode Toggle
- [ ] 404 Page
- [ ] Loading Page
- [ ] Maintenance Page

## 📊 Mock Data Requirements

### Products (50-100 items)

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  sold: number;
  stock: number;
  images: string[];
  thumbnail: string;
  category: string;
  categoryId: string;
  brand: string;
  brandId: string;
  variants?: {
    sizes?: string[];
    colors?: { name: string; hex: string }[];
  };
  specifications: { label: string; value: string }[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  freeShipping: boolean;
  createdAt: string;
}
```

### Categories (10-15 items)

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name
  image: string;
  parentId?: string;
  subcategories?: Category[];
  productCount: number;
}
```

### Brands (20-30 items)

```typescript
interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
}
```

### Reviews (100+ items)

```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  variant?: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
}
```

### Cart

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
  selected: boolean;
}
```

### Orders

```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    variant?: { size?: string; color?: string };
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}
```

## 🎭 User Experience Requirements

### Performance

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.5s
- Image optimization (WebP, lazy loading)
- Code splitting per route

### Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Alt text for all images
- Sufficient color contrast (WCAG AA)
- Screen reader friendly

### Animations

- Page transitions (fade in)
- Hover effects on cards/buttons
- Skeleton loaders for async data
- Smooth scroll
- Add to cart animation (item flies to cart icon)
- Success/error toast animations

### Error Handling

- Form validation errors (inline)
- Network error states
- Empty states (no products, empty cart)
- 404 page for invalid routes
- Toast notifications for actions

### Loading States

- Skeleton loaders for:
  - Product cards
  - Product detail
  - Cart items
- Spinner for:
  - Button actions
  - Page navigation
- Progress bar for image uploads

## 🔒 Data Persistence

### LocalStorage Keys

- `cart` - Shopping cart items
- `wishlist` - Saved products
- `recentlyViewed` - Product history
- `searchHistory` - Search queries
- `preferences` - User settings (theme, language, currency)
- `addresses` - Saved shipping addresses

### Session Management (Mock)

- Mock user authentication state
- Pre-defined user data
- Demo login (no real auth)

## 📱 Responsive Design

### Mobile (< 640px)

- Single column layout
- Bottom navigation (Home, Categories, Cart, Account)
- Hamburger menu
- Filters in bottom sheet
- Sticky "Add to Cart" bar on product detail
- 2 columns product grid

### Tablet (640px - 1024px)

- 2-3 column layouts
- Side navigation
- 3 columns product grid

### Desktop (> 1024px)

- Multi-column layouts
- Persistent sidebars
- 4 columns product grid
- Mega menu for categories

## 🧪 Quality Standards

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component-based architecture
- Custom hooks for reusable logic
- Proper prop types

### File Organization

- Group by feature/route
- Shared components in `/components`
- Utilities in `/lib`
- Types in `/types`
- Hooks in `/hooks`
- Mock data in `/lib/mock-data`

### Documentation

- JSDoc comments for complex functions
- README with setup instructions
- Component prop documentation
- Mock data structure examples

## 🚀 Future Enhancements (Phase 2)

- Real API integration
- User authentication (NextAuth.js)
- Payment gateway integration
- Email notifications
- Real-time order tracking
- Admin dashboard
- Product recommendations AI
- Multi-vendor support
- Auction functionality
- Live streaming shopping

## 📝 Notes

- All currency in VND (₫)
- Default language: Vietnamese
- Images: Use placeholder services (Unsplash, Lorem Picsum)
- Focus on Vietnamese e-commerce UX patterns
- Mobile-first approach
- Progressive enhancement
