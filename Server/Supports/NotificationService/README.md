# Notification Service

A comprehensive notification service built with .NET 9.0 following Clean Architecture principles. This service handles multiple notification channels including Email, SMS, Push Notifications, and WebSocket communications.

## 🚀 Features

- **Multi-channel Notifications**: Email, SMS, Push Notifications, In-app notifications via WebSocket
- **Template Management**: Dynamic notification templates with variable substitution
- **Message Queue Integration**: Apache Kafka for distributed messaging
- **Real-time Communication**: SignalR WebSocket support
- **Clean Architecture**: Domain-Driven Design with clear separation of concerns
- **API Documentation**: Scalar API documentation with OpenAPI support
- **Authentication & Authorization**: JWT Bearer authentication
- **Rate Limiting**: IP-based rate limiting for API protection
- **API Versioning**: Support for multiple API versions
- **Caching**: Redis cache integration
- **Logging**: Structured logging with Serilog
- **Database**: MongoDB for data persistence

## 📋 Prerequisites

- .NET 9.0 SDK
- Docker & Docker Compose
- MongoDB (via Docker)
- Apache Kafka (via Docker)
- Redis (via Docker)

## 🏗️ Architecture

The project follows Clean Architecture principles with the following layers:

```
NotificationService/
├── src/
│   ├── Domain/                 # Core business entities and interfaces
│   ├── Application/            # Business logic and use cases
│   ├── Infrastructure/         # External services implementation
│   └── API/                    # Web API with minimal APIs
├── docker-compose.yml          # Docker orchestration
└── NotificationService.sln     # Solution file
```

### Layer Dependencies
- **Domain**: No dependencies (Core layer)
- **Application**: Depends on Domain
- **Infrastructure**: Depends on Application and Domain
- **API**: Depends on Infrastructure, Application, and Domain

## 🚀 Quick Start

### Using Docker Compose

1. Clone the repository
```bash
git clone <repository-url>
cd NotificationService
```

2. Start all services with Docker Compose
```bash
docker-compose up -d
```

This will start:
- MongoDB (port 27017)
- Apache Kafka (port 9092)
- Zookeeper (port 2181)
- Kafka UI (port 8080)
- Redis (port 6379)
- Notification Service API (port 5000)

### Local Development

1. Ensure MongoDB, Kafka, and Redis are running (use Docker Compose for infrastructure only):
```bash
docker-compose up mongodb kafka zookeeper redis -d
```

2. Restore packages
```bash
dotnet restore
```

3. Build the solution
```bash
dotnet build
```

4. Run the API
```bash
cd src/API/NotificationService.API
dotnet run
```

5. Access the API documentation
- Scalar UI: https://localhost:5001/scalar/v1
- OpenAPI: https://localhost:5001/openapi/v1.json

## 📡 API Endpoints

### Notification Endpoints (v1)

#### Send Notification
```http
POST /api/v1/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "Email",
  "priority": "High",
  "templateCode": "WELCOME_EMAIL",
  "recipients": [
    {
      "email": "user@example.com",
      "name": "John Doe"
    }
  ],
  "templateVariables": {
    "firstName": "John",
    "activationLink": "https://example.com/activate"
  }
}
```

#### Get Notification Status
```http
GET /api/v1/notifications/{id}
Authorization: Bearer {token}
```

#### List Notifications
```http
GET /api/v1/notifications?status=Sent&type=Email&page=1&pageSize=20
Authorization: Bearer {token}
```

### Template Management

#### Create Template
```http
POST /api/v1/templates
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Welcome Email",
  "code": "WELCOME_EMAIL",
  "type": "Email",
  "subjectTemplate": "Welcome {{firstName}}!",
  "bodyTemplate": "Hello {{firstName}}, click <a href='{{activationLink}}'>here</a> to activate.",
  "requiredVariables": ["firstName", "activationLink"]
}
```

## 🔧 Configuration

### appsettings.json

Key configuration sections:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "NotificationDB"
  },
  "Kafka": {
    "BootstrapServers": "localhost:9092",
    "ClientId": "notification-service",
    "GroupId": "notification-consumer-group"
  },
  "Jwt": {
    "Issuer": "NotificationService",
    "Audience": "NotificationServiceClient",
    "SecretKey": "your-secret-key-here",
    "ExpirationInMinutes": 60
  },
  "Email": {
    "Host": "smtp.gmail.com",
    "Port": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  },
  "Sms": {
    "AccountSid": "twilio-account-sid",
    "AuthToken": "twilio-auth-token",
    "FromPhoneNumber": "+1234567890"
  }
}
```

## 📦 NuGet Packages

### Domain Layer
- MongoDB.Bson (3.0.0)
- FluentValidation (11.11.0)

### Application Layer
- MediatR (12.4.1)
- AutoMapper (13.0.1)
- Confluent.Kafka (2.6.1)

### Infrastructure Layer
- MongoDB.Driver (3.0.0)
- MongoDB.EntityFrameworkCore (9.0.0)
- MailKit (4.8.0)
- Twilio (7.8.1)
- FirebaseAdmin (3.2.0)
- Handlebars.Net (2.2.0)

### API Layer
- Microsoft.AspNetCore.Authentication.JwtBearer (9.0.0)
- Asp.Versioning.Http (8.1.0)
- AspNetCoreRateLimit (5.0.0)
- Scalar.AspNetCore (1.2.70)
- Serilog.AspNetCore (8.0.3)
- Microsoft.AspNetCore.SignalR (9.0.0)

## 🔌 WebSocket Integration

Connect to the SignalR hub for real-time notifications:

```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/hubs/notifications", {
        accessTokenFactory: () => "your-jwt-token"
    })
    .build();

connection.on("ReceiveNotification", (notification) => {
    console.log("New notification:", notification);
});

await connection.start();
```

## 🚦 Rate Limiting

The API implements IP-based rate limiting:
- 10 requests per second
- 100 requests per minute

Custom rate limits can be configured in `appsettings.json`.

## 📊 Monitoring

### Kafka UI
Access Kafka UI at http://localhost:8080 to monitor:
- Topics
- Messages
- Consumer groups
- Broker status

### Logs
Logs are written to:
- Console (structured JSON)
- Files in `/logs` directory (daily rotation)
- MongoDB (optional, for centralized logging)

## 🧪 Health Checks

The service provides health check endpoints:

```http
GET /health        # Basic health check
GET /health/ready  # Readiness check (includes dependencies)
GET /health/live   # Liveness check
```

## 🔐 Security

- JWT Bearer authentication for API endpoints
- Rate limiting to prevent abuse
- Input validation using FluentValidation
- Secure configuration management
- HTTPS enforcement in production

## 📝 Development Guidelines

1. **Domain Layer**: Keep it pure with no external dependencies
2. **Use Cases**: Implement business logic in Application layer
3. **Dependency Injection**: Register services in Program.cs
4. **Validation**: Use FluentValidation for input validation
5. **Error Handling**: Global exception middleware handles errors
6. **Logging**: Use structured logging with Serilog

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t notification-service .

# Run the container
docker run -d \
  -p 5000:80 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e MongoDB__ConnectionString=mongodb://mongo:27017 \
  -e Kafka__BootstrapServers=kafka:9092 \
  notification-service
```

## 📚 Additional Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [MongoDB Driver Documentation](https://www.mongodb.com/docs/drivers/csharp/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [SignalR Documentation](https://docs.microsoft.com/aspnet/core/signalr)
- [Scalar API Documentation](https://github.com/scalar/scalar)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name (@yourusername)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request