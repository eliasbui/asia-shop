# API Integration Guide

This guide explains how to integrate the E-commerce Web Client with the backend services.

## Backend Services

### 1. ProductCategoryService (Java/Spring Boot)
- **Port**: 8080
- **Base URL**: `http://localhost:8080`
- **API Prefix**: `/api/v1`

### 2. UserManagerServices (.NET Core)
- **Port**: 7031 (HTTPS)
- **Base URL**: `https://localhost:7031`
- **API Prefix**: `/api`

## Configuration Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update the values:

```env
# API URLs
NEXT_PUBLIC_PRODUCT_API_URL=http://localhost:8080
NEXT_PUBLIC_USER_API_URL=https://localhost:7031
NEXT_PUBLIC_STORAGE_API_URL=http://localhost:8080

# Feature flags
NEXT_PUBLIC_USE_MOCK_API=false  # Set to false to use real APIs
NEXT_PUBLIC_ENABLE_MSW=false    # Disable MSW when using real APIs

# Google reCAPTCHA (get from Google reCAPTCHA console)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-actual-site-key

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Start Backend Services

#### ProductCategoryService (Java)
```bash
cd Server/Core/ProductCategoryService

# Start MySQL database (required)
docker-compose up -d mysql

# Run the Spring Boot application
./mvnw spring-boot:run
```

The service will be available at `http://localhost:8080`

#### UserManagerServices (.NET)
```bash
cd Server/Core/UserManagerServices

# Start PostgreSQL database (required)
docker-compose up -d postgres

# Run the .NET application
dotnet run --project src/API/UserManagerServices.API
```

The service will be available at `https://localhost:7031`

### 3. CORS Configuration

Both backend services need CORS configured to allow requests from the frontend.

#### ProductCategoryService
Already configured with `@CrossOrigin(origins = "*")` in controllers.

For production, update to specific origins in `application.properties`:
```properties
cors.allowed.origins=http://localhost:3000,https://yourdomain.com
```

#### UserManagerServices
Already configured in `appsettings.json`:
```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://localhost:3001"
  ]
}
```

### 4. SSL Certificate (Development)

For UserManagerServices HTTPS in development:

1. Trust the .NET development certificate:
```bash
dotnet dev-certs https --trust
```

2. If you get SSL errors in the browser, you can:
   - Accept the certificate warning in your browser
   - Or use HTTP in development by changing UserManagerServices to HTTP

### 5. Database Setup

#### MySQL for ProductCategoryService
```sql
CREATE DATABASE products_db;
```

The application will automatically create tables on startup with `spring.jpa.hibernate.ddl-auto=update`.

#### PostgreSQL for UserManagerServices
```sql
CREATE DATABASE AsiaShop_UserManagerServices;
```

Run migrations:
```bash
cd Server/Core/UserManagerServices
dotnet ef database update -p src/Infrastructure/UserManagerServices.Infrastructure
```

## API Usage

### Using Mock Data (Development)

Set in `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_ENABLE_MSW=true
```

This will use MSW (Mock Service Worker) to intercept API calls and return mock data.

### Using Real APIs

Set in `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_ENABLE_MSW=false
```

## API Endpoints

### Product Service Endpoints

- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product by ID
- `GET /api/v1/products/search` - Search products
- `GET /api/v1/products/by-category/{categoryId}` - Products by category
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/{id}` - Update product (admin)
- `DELETE /api/v1/products/{id}` - Delete product (admin)

- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/{id}` - Get category

### User Service Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/mfa/setup` - Setup 2FA
- `POST /api/mfa/verify` - Verify 2FA code

## Using the API Hooks

The application provides React Query hooks for all API operations:

### Product Hooks

```tsx
import { useProducts, useProduct, useProductSearch } from "@/lib/api/hooks/use-products";

// List products
const { data: products, isLoading } = useProducts({
  page: 1,
  size: 20,
  categoryId: "electronics",
});

// Get single product
const { data: product } = useProduct("product-slug");

// Search products
const { data: searchResults } = useProductSearch("iPhone", {
  minPrice: 10000000,
  maxPrice: 50000000,
});
```

### Auth Hooks

```tsx
import { useLogin, useRegister, useCurrentUser } from "@/lib/api/hooks/use-auth";

// Login
const loginMutation = useLogin();
loginMutation.mutate({
  email: "user@example.com",
  password: "password123",
});

// Get current user
const { data: user } = useCurrentUser();
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check that backend services are running
2. Verify CORS configuration in backend
3. Ensure frontend URL is in allowed origins
4. Try disabling browser security for development:
   ```bash
   # Chrome on macOS
   open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
   ```

### SSL Certificate Issues

For UserManagerServices HTTPS issues:

1. Trust the development certificate:
   ```bash
   dotnet dev-certs https --trust
   ```

2. Or switch to HTTP in development by updating the service URL

### Database Connection Issues

1. Ensure Docker containers are running:
   ```bash
   docker ps
   ```

2. Check database credentials in application settings

3. Verify database exists and is accessible

### API Response Format Differences

The frontend expects specific response formats. If the backend response doesn't match:

1. Update the transformation functions in service files
2. Or update the backend to match expected format
3. Check Zod schemas for validation errors

## Production Deployment

For production deployment:

1. Update API URLs to production endpoints
2. Enable proper CORS with specific domains
3. Use HTTPS for all services
4. Implement proper authentication and authorization
5. Set up API rate limiting
6. Configure CDN for static assets
7. Enable production error tracking

## Testing

Run the application with different configurations:

```bash
# With mock data
NEXT_PUBLIC_USE_MOCK_API=true npm run dev

# With real APIs
NEXT_PUBLIC_USE_MOCK_API=false npm run dev

# Run tests
npm test
```

## Support

For issues related to:
- Frontend: Check `/Clients/ecommerce-web/README.md`
- ProductService: Check `/Server/Core/ProductCategoryService/README.md`
- UserService: Check `/Server/Core/UserManagerServices/README.md`
