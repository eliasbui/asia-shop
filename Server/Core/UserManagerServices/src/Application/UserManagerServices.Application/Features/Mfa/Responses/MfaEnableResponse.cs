namespace UserManagerServices.Application.Features.Mfa.Responses;

/// <summary>
/// Response for MFA enable operation
/// </summary>
public class MfaEnableResponse
{
    /// <summary>
    /// Whether MFA was successfully enabled
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// List of backup codes for recovery
    /// </summary>
    public List<string> BackupCodes { get; set; } = new();

    /// <summary>
    /// Number of backup codes generated
    /// </summary>
    public int BackupCodesCount { get; set; }

    /// <summary>
    /// Date when MFA was enabled
    /// </summary>
    public DateTime EnabledAt { get; set; }

    /// <summary>
    /// Important instructions for the user
    /// </summary>
    public List<string> Instructions { get; set; } = new()
    {
        "Save these backup codes in a secure location",
        "Each backup code can only be used once",
        "You can generate new backup codes if needed",
        "Keep your authenticator app secure and backed up"
    };

    /// <summary>
    /// Warning message about backup codes
    /// </summary>
    public string Warning { get; set; } =
        "These backup codes will not be shown again. Please save them securely.";
}