#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/21
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.Common.Interfaces;

/// <summary>
/// Interface for JSON Web Key Set (JWKS) operations
/// Provides methods to generate and retrieve JWKS for JWT token validation
/// </summary>
public interface IJwksService
{
    /// <summary>
    /// Gets the JSON Web Key Set (JWKS) for JWT token validation
    /// </summary>
    /// <returns>JWKS as JSON string</returns>
    Task<string> GetJwksAsync();
    
    /// <summary>
    /// Gets the JSON Web Key Set (JWKS) as an object
    /// </summary>
    /// <returns>JWKS object</returns>
    Task<object> GetJwksObjectAsync();
}
