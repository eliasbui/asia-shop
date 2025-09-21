# Product Category Service

A RESTful API service for managing product categories in an e-commerce system, built with Spring Boot following best
practices.

## Features

- **Layered Architecture**: Controller-Service-Repository pattern
- **RESTful API**: Following REST principles with proper HTTP methods and status codes
- **Data Transfer Objects (DTOs)**: Decoupled API from internal data models
- **Centralized Exception Handling**: Global exception handler for consistent error responses
- **Security**: Spring Security with HTTP Basic Authentication
- **Validation**: Bean validation with custom error messages
- **Database**: MySQL with JPA/Hibernate
- **Auditing**: Automatic tracking of creation and modification timestamps
- **Pagination**: Support for paginated responses
- **CORS**: Cross-Origin Resource Sharing enabled

## Technology Stack

- **Java**: 25
- **Spring Boot**: 3.5.6
- **Spring Data JPA**: Database access layer
- **Spring Security**: Authentication and authorization
- **Spring Validation**: Input validation
- **MySQL**: Database
- **Maven**: Build tool

## Getting Started

### Prerequisites

- Java 25 or higher
- Maven 3.6+
- MySQL 8.0+

### Database Setup

1. Create a MySQL database named `product_category_db`
2. Update database credentials in `application.properties` if needed

### Running the Application

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd ProductCategoryService

# Run the application
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### Authentication

The API uses HTTP Basic Authentication with default credentials:

- Username: `admin`
- Password: `admin123`

## API Documentation

### Base URL

```
http://localhost:8080/api/v1/categories
```

### Endpoints

#### 1. Create Category

```http
POST /api/v1/categories
Content-Type: application/json
Authorization: Basic admin:admin123

{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "parentId": null,
  "sortOrder": 1,
  "isActive": true
}
```

#### 2. Get Category by ID

```http
GET /api/v1/categories/{id}
```

#### 3. Get All Categories

```http
GET /api/v1/categories
```

With pagination:

```http
GET /api/v1/categories?page=0&size=10
```

With search:

```http
GET /api/v1/categories?search=electronics
```

#### 4. Get Root Categories

```http
GET /api/v1/categories/root
```

#### 5. Get Subcategories

```http
GET /api/v1/categories/{parentId}/subcategories
```

#### 6. Update Category

```http
PUT /api/v1/categories/{id}
Content-Type: application/json
Authorization: Basic admin:admin123

{
  "name": "Updated Electronics",
  "description": "Updated description",
  "sortOrder": 2
}
```

#### 7. Delete Category (Soft Delete)

```http
DELETE /api/v1/categories/{id}
Authorization: Basic admin:admin123
```

#### 8. Hard Delete Category

```http
DELETE /api/v1/categories/{id}/hard
Authorization: Basic admin:admin123
```

#### 9. Activate Category

```http
PATCH /api/v1/categories/{id}/activate
Authorization: Basic admin:admin123
```

#### 10. Deactivate Category

```http
PATCH /api/v1/categories/{id}/deactivate
Authorization: Basic admin:admin123
```

#### 11. Check Category Exists

```http
GET /api/v1/categories/exists?name=Electronics
```

#### 12. Get Category Statistics

```http
GET /api/v1/categories/stats
```

#### 13. Reorder Categories

```http
PUT /api/v1/categories/reorder
Content-Type: application/json
Authorization: Basic admin:admin123

[1, 3, 2, 4]
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "parentId": null,
    "sortOrder": 1,
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T10:00:00"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Category not found",
  "error": "Category with ID 999 not found",
  "timestamp": "2024-01-01T10:00:00"
}
```

### Validation Rules

- **Name**: Required, 2-100 characters, must be unique
- **Description**: Optional, max 500 characters
- **Sort Order**: Must be non-negative integer
- **Parent ID**: Must reference existing category

### HTTP Status Codes

- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Project Structure

```
src/main/java/product/asia/shop/
├── ProductCategoryServiceApplication.java  # Main application class
├── config/                                 # Configuration classes
│   ├── SecurityConfig.java                # Security configuration
│   ├── ValidationConfig.java              # Validation configuration
│   └── WebConfig.java                     # Web configuration
├── controller/                             # REST Controllers
│   └── ProductCategoryController.java     # Category endpoints
├── dto/                                    # Data Transfer Objects
│   ├── ApiResponse.java                   # Standard API response
│   ├── CategoryStatsDto.java              # Statistics DTO
│   ├── ProductCategoryRequestDto.java     # Request DTO
│   └── ProductCategoryResponseDto.java    # Response DTO
├── entity/                                 # JPA Entities
│   └── ProductCategory.java               # Category entity
├── exception/                              # Custom Exceptions
│   ├── CategoryAlreadyExistsException.java
│   ├── CategoryNotFoundException.java
│   └── GlobalExceptionHandler.java        # Global exception handler
├── mapper/                                 # Entity-DTO Mappers
│   └── ProductCategoryMapper.java         # Category mapper
├── repository/                             # Data Access Layer
│   └── ProductCategoryRepository.java     # Category repository
└── service/                               # Business Logic Layer
    ├── ProductCategoryService.java        # Service interface
    └── impl/
        └── ProductCategoryServiceImpl.java # Service implementation
```

## Configuration

### Application Properties

Key configuration properties in `application.properties`:

- Database connection settings
- JPA/Hibernate configuration
- Security settings
- Logging levels
- Management endpoints

### Security

The application uses Spring Security with:

- HTTP Basic Authentication
- CORS enabled for cross-origin requests
- Public read access to category data
- Protected write operations

## Testing

Run tests with:

```bash
./mvnw test
```

## Health Check

Check application health:

```http
GET /actuator/health
```

## Best Practices Implemented

1. **Layered Architecture**: Clear separation of concerns
2. **RESTful Design**: Proper use of HTTP methods and status codes
3. **DTO Pattern**: Decoupled API from internal models
4. **Exception Handling**: Centralized error handling
5. **Validation**: Input validation with meaningful error messages
6. **Security**: Authentication and authorization
7. **Auditing**: Automatic timestamp tracking
8. **Transaction Management**: Proper transaction boundaries
9. **Logging**: Comprehensive logging configuration
10. **Documentation**: Clear API documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
