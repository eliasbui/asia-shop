FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/API/UserManagerServices.API/UserManagerServices.API.csproj", "src/API/UserManagerServices.API/"]
COPY ["src/Application/UserManagerServices.Application/UserManagerServices.Application.csproj", "src/Application/UserManagerServices.Application/"]
COPY ["src/Domain/UserManagerServices.Domain/UserManagerServices.Domain.csproj", "src/Domain/UserManagerServices.Domain/"]
COPY ["src/Infrastructure/UserManagerServices.Infrastructure/UserManagerServices.Infrastructure.csproj", "src/Infrastructure/UserManagerServices.Infrastructure/"]
RUN dotnet restore "src/API/UserManagerServices.API/UserManagerServices.API.csproj"
COPY . .
WORKDIR "/src/src/API/UserManagerServices.API"
RUN dotnet build "./UserManagerServices.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./UserManagerServices.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserManagerServices.API.dll"]
