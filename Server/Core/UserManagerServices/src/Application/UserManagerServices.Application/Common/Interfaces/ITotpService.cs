using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Common.Interfaces;

/// <summary>
/// Interface for Time-based One-Time Password (TOTP) service
/// Provides TOTP generation, validation, and QR code functionality compatible with Google Authenticator
/// </summary>
public interface ITotpService
{
    /// <summary>
    /// Generates a new TOTP secret key for a user
    /// </summary>
    /// <returns>Base32-encoded secret key</returns>
    string GenerateSecretKey();

    /// <summary>
    /// Generates a QR code URI for TOTP setup
    /// </summary>
    /// <param name="user">User entity</param>
    /// <param name="secretKey">Base32-encoded secret key</param>
    /// <param name="issuer">Application name/issuer</param>
    /// <returns>QR code URI for authenticator apps</returns>
    string GenerateQrCodeUri(User user, string secretKey, string issuer = "Asia Shop");

    /// <summary>
    /// Validates a TOTP code against the user's secret key
    /// </summary>
    /// <param name="secretKey">Base32-encoded secret key</param>
    /// <param name="totpCode">6-digit TOTP code to validate</param>
    /// <param name="windowSize">Time window size for validation (default: 1)</param>
    /// <returns>True if the code is valid, false otherwise</returns>
    bool ValidateTotpCode(string secretKey, string totpCode, int windowSize = 1);

    /// <summary>
    /// Generates the current TOTP code for a secret key (for testing purposes)
    /// </summary>
    /// <param name="secretKey">Base32-encoded secret key</param>
    /// <returns>Current 6-digit TOTP code</returns>
    string GenerateCurrentTotpCode(string secretKey);

    /// <summary>
    /// Encrypts a TOTP secret key for secure storage
    /// </summary>
    /// <param name="secretKey">Plain text secret key</param>
    /// <returns>Encrypted secret key</returns>
    string EncryptSecretKey(string secretKey);

    /// <summary>
    /// Decrypts a TOTP secret key for validation
    /// </summary>
    /// <param name="encryptedSecretKey">Encrypted secret key</param>
    /// <returns>Plain text secret key</returns>
    string DecryptSecretKey(string encryptedSecretKey);

    /// <summary>
    /// Formats a secret key for backup display (groups of 4 characters)
    /// </summary>
    /// <param name="secretKey">Secret key to format</param>
    /// <returns>Formatted secret key</returns>
    string FormatSecretKeyForBackup(string secretKey);

    /// <summary>
    /// Validates the format of a TOTP code
    /// </summary>
    /// <param name="totpCode">TOTP code to validate</param>
    /// <returns>True if the format is valid (6 digits), false otherwise</returns>
    bool IsValidTotpCodeFormat(string totpCode);

    /// <summary>
    /// Gets the remaining time in seconds until the current TOTP code expires
    /// </summary>
    /// <returns>Remaining seconds</returns>
    int GetRemainingTimeForCurrentCode();
}