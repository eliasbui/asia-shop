#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.API.Endpoints;
using UserManagerServices.API.Endpoints.v1;

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
    public static void MapMinimalApiEndpoints(this WebApplication app)
    {
        // Map authentication endpoints
        app.MapAuthEndpoints();

        // Map user endpoints
        app.MapUserEndpoints();

        // Map MFA endpoints
        app.MapMfaEndpoints();

        // Map Session Management endpoints
        app.MapSessionManagementEndpoints();

        // Map admin endpoints
        app.MapAdminEndpoints();
    }
}