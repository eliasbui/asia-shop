using Serilog;
using UserManagerServices.API.Extensions;
using UserManagerServices.API.Middleware;
using UserManagerServices.Application.Extensions;
using UserManagerServices.Infrastructure.Extensions;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("Starting UserManagerServices API");

    var builder = WebApplication.CreateBuilder(args);

    var configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", false, true)
        .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true)
        .AddEnvironmentVariables()
        .Build();

    // Add Serilog
    builder.Host.UseSerilog((context, loggerConfiguration) =>
        loggerConfiguration.ReadFrom.Configuration(context.Configuration));

    // Add services to the container
    builder.Services.AddApplication(configuration);
    builder.Services.AddInfrastructure(configuration);
    builder.Services.AddApiServices(configuration);
    builder.Services.AddScalar();

    var app = builder.Build();

    // Configure the HTTP request pipeline
    app.UseGlobalExceptionHandling();
    app.UseSecurityHeaders();

    if (app.Environment.IsDevelopment()) app.UseScalar();

    app.UseHttpsRedirection();
    app.UseResponseCompression();
    app.UseCors("DefaultCorsPolicy");
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseRateLimiter();

    // Add health checks endpoint
    app.MapHealthChecks("/health");

    // Map minimal API endpoints
    app.MapMinimalApiEndpoints();

    Log.Information("UserManagerServices API started successfully");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "UserManagerServices API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}