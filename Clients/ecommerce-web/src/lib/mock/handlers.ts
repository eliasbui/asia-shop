import { http, HttpResponse } from "msw";
import {
  allMockProducts,
  mockCategories,
  mockUser,
  mockAddresses,
  mockShippingQuotes,
} from "./data";
import { Paginated, Product, SuggestPayload } from "@/types/models";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const handlers = [
  // Products listing/search
  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const size = Number(url.searchParams.get("size") || "24");
    const sort = url.searchParams.get("sort");
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const minPrice = Number(url.searchParams.get("minPrice") || "0");
    const maxPrice = Number(url.searchParams.get("maxPrice") || "999999999");
    const q = url.searchParams.get("q");
    
    let filtered = [...allMockProducts];
    
    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    
    // Filter by brand
    if (brand) {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    
    // Filter by price range
    filtered = filtered.filter((p) => {
      const price = p.price.sale?.amount || p.price.list.amount;
      return price >= minPrice && price <= maxPrice;
    });
    
    // Sort
    if (sort) {
      const [field, order] = sort.split(":");
      filtered.sort((a, b) => {
        if (field === "price") {
          const priceA = a.price.sale?.amount || a.price.list.amount;
          const priceB = b.price.sale?.amount || b.price.list.amount;
          return order === "asc" ? priceA - priceB : priceB - priceA;
        }
        if (field === "rating") {
          return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
        }
        return 0;
      });
    }
    
    // Paginate
    const start = (page - 1) * size;
    const end = start + size;
    const items = filtered.slice(start, end);
    
    const response: Paginated<Product> = {
      page,
      size,
      total: filtered.length,
      items,
    };
    
    return HttpResponse.json(response);
  }),
  
  // Product detail
  http.get(`${API_BASE_URL}/products/:slug`, ({ params }) => {
    const product = allMockProducts.find((p) => p.slug === params.slug);
    
    if (!product) {
      return HttpResponse.json(
        { code: "NOT_FOUND", message: "Product not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(product);
  }),
  
  // Autosuggest
  http.get(`${API_BASE_URL}/suggest`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const limit = Number(url.searchParams.get("limit") || "10");
    
    const query = q.toLowerCase();
    
    const suggestedQueries = [
      `${q} phone`,
      `${q} laptop`,
      `${q} case`,
      `${q} charger`,
      `${q} screen protector`,
    ].slice(0, Math.min(limit, 5));
    
    const topCategories = mockCategories
      .filter((c) => c.name.toLowerCase().includes(query))
      .slice(0, 3);
    
    const topProducts = allMockProducts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        media: p.media,
        price: p.price,
      }));
    
    const response: SuggestPayload = {
      suggestedQueries,
      topCategories,
      topProducts,
    };
    
    return HttpResponse.json(response);
  }),
  
  // Shipping quotes
  http.get(`${API_BASE_URL}/shipping/quotes`, () => {
    return HttpResponse.json(mockShippingQuotes);
  }),
  
  // Coupon validation
  http.post(`${API_BASE_URL}/coupons/validate`, async ({ request }) => {
    const body = await request.json() as { code: string; cart: any };
    
    // Mock validation logic
    const validCoupons = ["SAVE10", "WELCOME20", "FREESHIP"];
    
    if (validCoupons.includes(body.code.toUpperCase())) {
      const discountPercent = body.code === "SAVE10" ? 10 : 20;
      return HttpResponse.json({
        valid: true,
        discount: {
          currency: "VND",
          amount: 100000, // Mock discount amount
        },
      });
    }
    
    return HttpResponse.json({
      valid: false,
      reason: "Invalid or expired coupon code",
    });
  }),
  
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Mock authentication
    if (body.email && body.password) {
      return HttpResponse.json({
        accessToken: "mock-jwt-token-" + Date.now(),
        user: mockUser,
      });
    }
    
    return HttpResponse.json(
      { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      { status: 401 }
    );
  }),
  
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
      name: string;
    };
    
    if (body.email && body.password && body.name) {
      return HttpResponse.json({
        accessToken: "mock-jwt-token-" + Date.now(),
        user: {
          ...mockUser,
          id: "user-" + Date.now(),
          email: body.email,
          name: body.name,
        },
      });
    }
    
    return HttpResponse.json(
      { code: "INVALID_DATA", message: "Invalid registration data" },
      { status: 400 }
    );
  }),
  
  http.post(`${API_BASE_URL}/auth/otp/send`, async ({ request }) => {
    const body = await request.json() as { phone?: string; email?: string };
    
    if (body.phone || body.email) {
      return HttpResponse.json({
        success: true,
        message: "OTP sent successfully",
      });
    }
    
    return HttpResponse.json(
      { code: "INVALID_DATA", message: "Phone or email required" },
      { status: 400 }
    );
  }),
  
  http.post(`${API_BASE_URL}/auth/otp/verify`, async ({ request }) => {
    const body = await request.json() as { otp: string };
    
    // Mock OTP verification (accept any 6-digit code)
    if (body.otp && body.otp.length === 6) {
      return HttpResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    }
    
    return HttpResponse.json(
      { code: "INVALID_OTP", message: "Invalid or expired OTP" },
      { status: 400 }
    );
  }),
  
  http.post(`${API_BASE_URL}/auth/2fa/verify`, async ({ request }) => {
    const body = await request.json() as { code: string };
    
    // Mock 2FA verification
    if (body.code && body.code.length === 6) {
      return HttpResponse.json({
        success: true,
        message: "2FA verified successfully",
      });
    }
    
    return HttpResponse.json(
      { code: "INVALID_2FA", message: "Invalid 2FA code" },
      { status: 400 }
    );
  }),
  
  // User profile
  http.get(`${API_BASE_URL}/user/profile`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401 }
      );
    }
    
    return HttpResponse.json(mockUser);
  }),
  
  // User addresses
  http.get(`${API_BASE_URL}/user/addresses`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401 }
      );
    }
    
    return HttpResponse.json(mockAddresses);
  }),
  
  http.post(`${API_BASE_URL}/user/addresses`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401 }
      );
    }
    
    const body = await request.json() as any;
    const newAddress = {
      ...body,
      id: "addr-" + Date.now(),
    };
    
    return HttpResponse.json(newAddress);
  }),
];
