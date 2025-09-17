namespace UserManagerServices.Application.Features.Mfa.Responses;

/// <summary>
/// Response for MFA setup operation
/// </summary>
public class MfaSetupResponse
{
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
    /// Instructions for setting up the authenticator
    /// </summary>
    public string Instructions { get; set; } = string.Empty;

    /// <summary>
    /// Whether the setup was successful
    /// </summary>
    public bool IsSuccess { get; set; }

    /// <summary>
    /// Next step in the MFA setup process
    /// </summary>
    public string NextStep { get; set; } = "Verify TOTP code to complete setup";
}