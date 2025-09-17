using UserManagerServices.API.Endpoints;

namespace UserManagerServices.API.Extensions;

/// <summary>
/// Extension methods for registering minimal API endpoints
/// </summary>
public static class EndpointExtensions
{
    /// <summary>
    /// Maps all minimal API endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application for chaining</returns>
    public static WebApplication MapMinimalApiEndpoints(this WebApplication app)
    {
        // Map authentication endpoints
        app.MapAuthEndpoints();

        // Map user endpoints
        app.MapUserEndpoints();

        // Map MFA endpoints
        app.MapMfaEndpoints();

        // Map admin endpoints
        app.MapAdminEndpoints();

        // Map health check endpoints
        app.MapHealthEndpoints();

        return app;
    }
}
