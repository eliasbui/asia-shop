# User Manager Services

A .NET 9.0 Web API built with Clean Architecture principles for managing user operations.

## 🏗️ Architecture

This project implements Clean Architecture with the following layers:

```
├── src/
│   ├── Domain/               # Enterprise business rules
│   │   ├── Entities/         # Domain entities
│   │   ├── ValueObjects/     # Value objects
│   │   ├── Interfaces/       # Domain interfaces
│   │   ├── Exceptions/       # Domain exceptions
│   │   └── Common/           # Shared domain logic
│   ├── Application/          # Application business rules
│   │   ├── UseCases/         # CQRS commands and queries
│   │   ├── DTOs/             # Data transfer objects
│   │   ├── Interfaces/       # Application interfaces
│   │   └── Common/           # Shared application logic
│   ├── Infrastructure/       # External concerns
│   │   ├── Data/             # Database implementation
│   │   │   ├── Configurations/  # EF configurations
│   │   │   └── Repositories/    # Repository implementations
│   │   └── Services/         # External services
│   └── API/                  # Presentation layer
│       └── Controllers/      # Web API controllers
└── tests/                    # Test projects
```

## 🚀 Features

- **Clean Architecture**: Separation of concerns with clear dependencies
- **CQRS Pattern**: Command Query Responsibility Segregation with MediatR
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transaction management
- **Domain-Driven Design**: Rich domain models with value objects
- **Entity Framework Core**: Database access with SQL Server
- **AutoMapper**: Object-to-object mapping
- **Swagger/OpenAPI**: API documentation
- **Validation**: Input validation with FluentValidation

## 🛠️ Technology Stack

- **.NET 9.0**: Latest .NET framework
- **ASP.NET Core Web API**: RESTful API framework
- **Entity Framework Core 9**: Object-relational mapping
- **SQL Server**: Database
- **MediatR**: CQRS implementation
- **AutoMapper**: Object mapping
- **FluentValidation**: Input validation
- **Swagger**: API documentation

## 📋 Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or SQL Server LocalDB
- [Visual Studio 2024](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UserManagerServices
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Update Database Connection

Update the connection string in `src/API/UserManagerServices.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UserManagerServicesDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### 4. Create and Apply Database Migrations

```bash
# Navigate to the API project directory
cd src/API/UserManagerServices.API

# Add initial migration
dotnet ef migrations add InitialCreate --project ../../Infrastructure/UserManagerServices.Infrastructure

# Update database
dotnet ef database update --project ../../Infrastructure/UserManagerServices.Infrastructure
```

### 5. Run the Application

```bash
# From the root directory
dotnet run --project src/API/UserManagerServices.API/UserManagerServices.API.csproj
```

The API will be available at:
- **HTTPS**: `https://localhost:5001`
- **HTTP**: `http://localhost:5000`
- **Swagger UI**: `https://localhost:5001/swagger`

## 📚 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users/{id}` | Get user by ID |
| POST   | `/api/users` | Create new user |

### Example Requests

#### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890"
}
```

#### Get User by ID
```bash
GET /api/users/{guid}
```

## 🧪 Testing

Run the test suite:

```bash
dotnet test
```

## 📝 Domain Model

### User Entity
- **Id**: Unique identifier
- **FirstName**: User's first name
- **LastName**: User's last name
- **Email**: Email value object with validation
- **PhoneNumber**: Optional phone number
- **IsActive**: User status
- **CreatedAt**: Creation timestamp
- **UpdatedAt**: Last update timestamp
- **LastLoginAt**: Last login timestamp

### Email Value Object
- Validates email format using regex
- Immutable and self-validating
- Converts to lowercase automatically

## 🏗️ Design Patterns

- **Clean Architecture**: Clear separation of concerns
- **CQRS**: Separate read and write operations
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transaction boundary management
- **Value Objects**: Domain-driven design primitives
- **Dependency Injection**: Loose coupling between components

## 📖 Project Structure Details

### Domain Layer
Contains the core business logic and rules:
- **Entities**: Core business objects (User)
- **Value Objects**: Immutable objects (Email)
- **Interfaces**: Contracts for repositories and services
- **Exceptions**: Domain-specific exceptions

### Application Layer
Contains application-specific business logic:
- **Commands**: Write operations (CreateUserCommand)
- **Queries**: Read operations (GetUserByIdQuery)
- **DTOs**: Data transfer objects for API communication
- **Handlers**: MediatR request handlers

### Infrastructure Layer
Contains external concerns:
- **DbContext**: Entity Framework database context
- **Repositories**: Data access implementations
- **Configurations**: Entity Framework entity configurations

### API Layer
Contains the presentation logic:
- **Controllers**: Web API endpoints
- **Program.cs**: Application bootstrap and DI configuration

## 🔧 Configuration

### Entity Framework
Configured in `Program.cs` with SQL Server provider and connection string from configuration.

### MediatR
Registered with all handlers from the Application assembly.

### AutoMapper
Configured with mapping profiles for entity-to-DTO conversions.

### Swagger
Enabled for development environment with comprehensive API documentation.

## 🚀 Deployment

### Development
```bash
dotnet run --project src/API/UserManagerServices.API/UserManagerServices.API.csproj
```

### Production
```bash
dotnet publish src/API/UserManagerServices.API/UserManagerServices.API.csproj -c Release -o publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Clean Architecture by Robert C. Martin
- Domain-Driven Design by Eric Evans
- CQRS pattern implementation with MediatR
