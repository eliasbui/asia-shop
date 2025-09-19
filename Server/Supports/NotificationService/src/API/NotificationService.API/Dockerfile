FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/API/NotificationService.API/NotificationService.API.csproj", "src/API/NotificationService.API/"]
COPY ["src/Infrastructure/NotificationService.Infrastructure/NotificationService.Infrastructure.csproj", "src/Infrastructure/NotificationService.Infrastructure/"]
COPY ["src/Application/NotificationService.Application/NotificationService.Application.csproj", "src/Application/NotificationService.Application/"]
COPY ["src/Domain/NotificationService.Domain/NotificationService.Domain.csproj", "src/Domain/NotificationService.Domain/"]
RUN dotnet restore "src/API/NotificationService.API/NotificationService.API.csproj"
COPY . .
WORKDIR "/src/src/API/NotificationService.API"
RUN dotnet build "./NotificationService.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./NotificationService.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.API.dll"]
