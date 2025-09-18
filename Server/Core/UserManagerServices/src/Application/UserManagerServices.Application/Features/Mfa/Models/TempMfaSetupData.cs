#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.Features.Mfa.Models;

/// <summary>
/// Temporary MFA setup data stored in cache with expiration
/// </summary>
public class TempMfaSetupData
{
    /// <summary>
    /// User ID this setup belongs to
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Base32-encoded secret key for TOTP
    /// </summary>
    public string SecretKey { get; set; } = string.Empty;

    /// <summary>
    /// QR code URI for authenticator apps
    /// </summary>
    public string QrCodeUri { get; set; } = string.Empty;

    /// <summary>
    /// Human-readable secret key for manual entry
    /// </summary>
    public string FormattedSecretKey { get; set; } = string.Empty;

    /// <summary>
    /// When this setup data was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// When this setup data expires
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Unique setup session ID for this QR code generation
    /// </summary>
    public string SetupSessionId { get; set; } = string.Empty;
}