using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using UserManagerServices.API.Common;

namespace UserManagerServices.API.Endpoints;

/// <summary>
/// Health check endpoints for monitoring API status
/// Provides endpoints for health monitoring and diagnostics
/// </summary>
public static class HealthEndpoints
{
    /// <summary>
    /// Maps health check endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application for chaining</returns>
    public static WebApplication MapHealthEndpoints(this WebApplication app)
    {
        var healthGroup = app.MapGroup("api/v1/health")
            .WithTags("Health")
            .WithOpenApi();

        // GET /api/v1/health
        healthGroup.MapGet("/", GetHealthAsync)
            .WithName("GetHealth")
            .WithSummary("Get API health status")
            .WithDescription("Returns the overall health status of the API and its dependencies")
            .Produces<HealthCheckResponse>(200, "application/json")
            .Produces<HealthCheckResponse>(503, "application/json")
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get API health status",
                Description = "Returns the overall health status of the API and its dependencies",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "API is healthy" },
                    ["503"] = new OpenApiResponse { Description = "API is unhealthy" }
                }
            });

        // GET /api/v1/health/ping
        healthGroup.MapGet("/ping", GetPingAsync)
            .WithName("GetPing")
            .WithSummary("Simple health ping")
            .WithDescription("Returns a simple response to verify the API is responding")
            .Produces<object>(200, "application/json")
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Simple health ping",
                Description = "Returns a simple response to verify the API is responding",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "API is responding" }
                }
            });

        return app;
    }

    /// <summary>
    /// Gets the overall health status of the API
    /// </summary>
    /// <param name="healthCheckService">Health check service</param>
    /// <returns>Health status information</returns>
    private static async Task<IResult> GetHealthAsync(
        [FromServices] HealthCheckService healthCheckService)
    {
        try
        {
            var healthReport = await healthCheckService.CheckHealthAsync();

            var response = new HealthCheckResponse
            {
                Status = healthReport.Status.ToString(),
                TotalDuration = healthReport.TotalDuration,
                Checks = healthReport.Entries.Select(entry => new HealthCheckItem
                {
                    Name = entry.Key,
                    Status = entry.Value.Status.ToString(),
                    Duration = entry.Value.Duration,
                    Description = entry.Value.Description,
                    Data = entry.Value.Data
                }).ToList()
            };

            return healthReport.Status == HealthStatus.Healthy
                ? Results.Ok(response)
                : Results.Problem(
                    title: "Health Check Failed",
                    detail: "One or more health checks failed",
                    statusCode: 503,
                    instance: "/api/v1/health");
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Health Check Error",
                detail: ex.Message,
                statusCode: 500,
                instance: "/api/v1/health");
        }
    }

    /// <summary>
    /// Gets a simple health check response
    /// </summary>
    /// <returns>Simple health status</returns>
    private static IResult GetPingAsync()
    {
        try
        {
            var response = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
            };

            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Ping Failed",
                detail: ex.Message,
                statusCode: 500,
                instance: "/api/v1/health/ping");
        }
    }
}

/// <summary>
/// Health check response model
/// </summary>
public class HealthCheckResponse
{
    /// <summary>
    /// Overall health status
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Total duration of all health checks
    /// </summary>
    public TimeSpan TotalDuration { get; set; }

    /// <summary>
    /// Individual health check results
    /// </summary>
    public List<HealthCheckItem> Checks { get; set; } = new();
}

/// <summary>
/// Individual health check item
/// </summary>
public class HealthCheckItem
{
    /// <summary>
    /// Name of the health check
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Status of the health check
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Duration of the health check
    /// </summary>
    public TimeSpan Duration { get; set; }

    /// <summary>
    /// Description of the health check
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Additional data from the health check
    /// </summary>
    public IReadOnlyDictionary<string, object> Data { get; set; } = new Dictionary<string, object>();
}