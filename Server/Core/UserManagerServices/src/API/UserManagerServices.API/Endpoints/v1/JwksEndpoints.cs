#region Author File

//*
//  * Author: Eliasbui
//  * Created: 2025/09/21
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using UserManagerServices.Application.Common.Interfaces;

namespace UserManagerServices.API.Endpoints.v1;

/// <summary>
/// JWKS (JSON Web Key Set) endpoints for JWT token validation
/// Provides the public keys used to verify JWT tokens issued by this service
/// </summary>
public static class JwksEndpoints
{
    /// <summary>
    /// Maps JWKS endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application for chaining</returns>
    public static void MapJwksEndpoints(this WebApplication app)
    {
        var jwksGroup = app.MapGroup(".well-known")
            .WithTags("JWKS")
            .WithOpenApi();

        // GET /.well-known/jwks.json
        jwksGroup.MapGet("/jwks.json", GetJwksAsync)
            .WithName("GetJwks")
            .WithSummary("Get JSON Web Key Set (JWKS)")
            .WithDescription("Returns the JSON Web Key Set (JWKS) containing the public keys used to verify JWT tokens issued by this service. This endpoint is used by other services to validate JWT tokens.")
            .AllowAnonymous()
            .Produces<object>(200, "application/json")
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .CacheOutput(TimeSpan.FromHours(1).ToString()); 
    }

    /// <summary>
    /// Gets the JSON Web Key Set (JWKS) for JWT token validation
    /// </summary>
    /// <param name="jwksService">JWKS service</param>
    /// <param name="logger">Logger instance</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>JWKS response</returns>
    private static async Task<IResult> GetJwksAsync(
        IJwksService jwksService,
        ILogger<Program> logger,
        CancellationToken cancellationToken = default)
    {
        try
        {
            logger.LogInformation("JWKS endpoint accessed");

            var jwks = await jwksService.GetJwksObjectAsync();
            
            logger.LogDebug("JWKS successfully retrieved");

            return Results.Ok(jwks);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving JWKS");
            
            return Results.Problem(
                title: "Internal Server Error",
                detail: "An error occurred while retrieving the JSON Web Key Set",
                statusCode: 500);
        }
    }
}
