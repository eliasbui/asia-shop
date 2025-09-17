# Asia Shop — User Manager Services

A .NET 9 Web API implementing user management using Clean Architecture principles. This repository contains the solution and layered projects for the User Manager Services API.

## Key points

- Tech: .NET 9, ASP.NET Core Web API, Entity Framework Core, SQL Server
- Architecture: Clean Architecture (Domain, Application, Infrastructure, API)
- API docs: Swagger/OpenAPI (enabled in Development)

## Prerequisites

- .NET 9 SDK
- SQL Server or LocalDB
- (Optional) Visual Studio 2024 or VS Code

## Quick start

From the repository root run:

```powershell
dotnet restore
dotnet run --project Server/Core/UserManagerServices/src/API/UserManagerServices.API/UserManagerServices.API.csproj
```

Then open:

- Swagger UI: https://localhost:5001/swagger

If you need to publish for production:

```powershell
dotnet publish Server/Core/UserManagerServices/src/API/UserManagerServices.API/UserManagerServices.API.csproj -c Release -o publish
```

## Database

Update the connection string in `Server/Core/UserManagerServices/src/API/UserManagerServices.API/appsettings.json` before running. The example connection string used in the subproject README is:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UserManagerServicesDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

To add migrations (from repo root):

```powershell
# navigate to the API project folder
cd Server/Core/UserManagerServices/src/API/UserManagerServices.API
# add migration (pointing to Infrastructure project for DbContext)
dotnet ef migrations add InitialCreate --project ../../Infrastructure/UserManagerServices.Infrastructure
# update database
dotnet ef database update --project ../../Infrastructure/UserManagerServices.Infrastructure
```

## Project structure

See `Server/Core/UserManagerServices/README.md` for a detailed project overview, architecture notes, and available endpoints.

## License

This project is licensed under the MIT License — see the `LICENSE` file.
