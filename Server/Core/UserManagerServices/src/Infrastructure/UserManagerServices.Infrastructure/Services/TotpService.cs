using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Time-based One-Time Password (TOTP) service implementation
/// Compatible with Google Authenticator and other TOTP authenticator apps
/// </summary>
public class TotpService : ITotpService
{
    private readonly ILogger<TotpService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _encryptionKey;

    // TOTP configuration constants
    private const int SecretKeyLength = 32; // 160 bits in Base32
    private const int TotpDigits = 6;
    private const int TotpPeriod = 30; // seconds
    private const string Base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    /// <summary>
    /// Initializes a new instance of the TotpService
    /// </summary>
    /// <param name="logger">Logger instance</param>
    /// <param name="configuration">Configuration instance</param>
    public TotpService(ILogger<TotpService> logger, IConfiguration configuration)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

        // Get encryption key from configuration or generate a default one
        _encryptionKey = _configuration["Security:TotpEncryptionKey"] ??
                         "your-totp-encryption-key-32-chars!!";

        if (_encryptionKey.Length < 32)
            throw new InvalidOperationException("TOTP encryption key must be at least 32 characters long");
    }

    /// <summary>
    /// Generates a new TOTP secret key
    /// </summary>
    /// <returns>Base32-encoded secret key</returns>
    public string GenerateSecretKey()
    {
        try
        {
            var secretBytes = new byte[20]; // 160 bits
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(secretBytes);

            var secretKey = ToBase32(secretBytes);
            _logger.LogDebug("Generated new TOTP secret key");

            return secretKey;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating TOTP secret key");
            throw;
        }
    }

    /// <summary>
    /// Generates a QR code URI for TOTP setup
    /// </summary>
    /// <param name="user">User entity</param>
    /// <param name="secretKey">Base32-encoded secret key</param>
    /// <param name="issuer">Application name/issuer</param>
    /// <returns>QR code URI for authenticator apps</returns>
    public string GenerateQrCodeUri(User user, string secretKey, string issuer = "Asia Shop")
    {
        try
        {
            var accountName = Uri.EscapeDataString($"{user.Email}");
            var issuerEncoded = Uri.EscapeDataString(issuer);

            var uri = $"otpauth://totp/{issuerEncoded}:{accountName}?" +
                      $"secret={secretKey}&" +
                      $"issuer={issuerEncoded}&" +
                      $"algorithm=SHA1&" +
                      $"digits={TotpDigits}&" +
                      $"period={TotpPeriod}";

            _logger.LogDebug("Generated QR code URI for user {UserId}", user.Id);
            return uri;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QR code URI for user {UserId}", user.Id);
            throw;
        }
    }

    /// <summary>
    /// Validates a TOTP code against the user's secret key
    /// </summary>
    /// <param name="secretKey">Base32-encoded secret key</param>
    /// <param name="totpCode">6-digit TOTP code to validate</param>
    /// <param name="windowSize">Time window size for validation</param>
    /// <returns>True if the code is valid, false otherwise</returns>
    public bool ValidateTotpCode(string secretKey, string totpCode, int windowSize = 1)
    {
        try
        {
            if (!IsValidTotpCodeFormat(totpCode))
            {
                _logger.LogWarning("Invalid TOTP code format: {TotpCode}", totpCode);
                return false;
            }

            var secretBytes = FromBase32(secretKey);
            var currentTimeStep = GetCurrentTimeStep();

            // Check current time step and adjacent time steps within the window
            for (var i = -windowSize; i <= windowSize; i++)
            {
                var timeStep = currentTimeStep + i;
                var expectedCode = GenerateTotpCode(secretBytes, timeStep);

                if (expectedCode == totpCode)
                {
                    _logger.LogDebug("TOTP code validated successfully with time step offset: {Offset}", i);
                    return true;
                }
            }

            _logger.LogWarning("TOTP code validation failed");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating TOTP code");
            return false;
        }
    }

    /// <summary>
    /// Generates the current TOTP code for a secret key
    /// </summary>
    /// <param name="secretKey">Base32-encoded secret key</param>
    /// <returns>Current 6-digit TOTP code</returns>
    public string GenerateCurrentTotpCode(string secretKey)
    {
        try
        {
            var secretBytes = FromBase32(secretKey);
            var currentTimeStep = GetCurrentTimeStep();

            return GenerateTotpCode(secretBytes, currentTimeStep);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating current TOTP code");
            throw;
        }
    }

    /// <summary>
    /// Encrypts a TOTP secret key for secure storage
    /// </summary>
    /// <param name="secretKey">Plain text secret key</param>
    /// <returns>Encrypted secret key</returns>
    public string EncryptSecretKey(string secretKey)
    {
        try
        {
            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(_encryptionKey.Substring(0, 32));
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor();
            var secretBytes = Encoding.UTF8.GetBytes(secretKey);
            var encryptedBytes = encryptor.TransformFinalBlock(secretBytes, 0, secretBytes.Length);

            // Combine IV and encrypted data
            var result = new byte[aes.IV.Length + encryptedBytes.Length];
            Array.Copy(aes.IV, 0, result, 0, aes.IV.Length);
            Array.Copy(encryptedBytes, 0, result, aes.IV.Length, encryptedBytes.Length);

            return Convert.ToBase64String(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error encrypting TOTP secret key");
            throw;
        }
    }

    /// <summary>
    /// Decrypts a TOTP secret key for validation
    /// </summary>
    /// <param name="encryptedSecretKey">Encrypted secret key</param>
    /// <returns>Plain text secret key</returns>
    public string DecryptSecretKey(string encryptedSecretKey)
    {
        try
        {
            var encryptedData = Convert.FromBase64String(encryptedSecretKey);

            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(_encryptionKey.Substring(0, 32));

            // Extract IV and encrypted data
            var iv = new byte[16];
            var encryptedBytes = new byte[encryptedData.Length - 16];
            Array.Copy(encryptedData, 0, iv, 0, 16);
            Array.Copy(encryptedData, 16, encryptedBytes, 0, encryptedBytes.Length);

            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor();
            var decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);

            return Encoding.UTF8.GetString(decryptedBytes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error decrypting TOTP secret key");
            throw;
        }
    }

    /// <summary>
    /// Formats a secret key for backup display (groups of 4 characters)
    /// </summary>
    /// <param name="secretKey">Secret key to format</param>
    /// <returns>Formatted secret key</returns>
    public string FormatSecretKeyForBackup(string secretKey)
    {
        if (string.IsNullOrEmpty(secretKey))
            return string.Empty;

        var formatted = new StringBuilder();
        for (var i = 0; i < secretKey.Length; i += 4)
        {
            if (i > 0)
                formatted.Append(' ');

            var length = Math.Min(4, secretKey.Length - i);
            formatted.Append(secretKey.Substring(i, length));
        }

        return formatted.ToString();
    }

    /// <summary>
    /// Validates the format of a TOTP code
    /// </summary>
    /// <param name="totpCode">TOTP code to validate</param>
    /// <returns>True if the format is valid, false otherwise</returns>
    public bool IsValidTotpCodeFormat(string totpCode)
    {
        return !string.IsNullOrWhiteSpace(totpCode) &&
               totpCode.Length == TotpDigits &&
               totpCode.All(char.IsDigit);
    }

    /// <summary>
    /// Gets the remaining time in seconds until the current TOTP code expires
    /// </summary>
    /// <returns>Remaining seconds</returns>
    public int GetRemainingTimeForCurrentCode()
    {
        var currentTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        return TotpPeriod - (int)(currentTime % TotpPeriod);
    }

    #region Private Helper Methods

    /// <summary>
    /// Gets the current time step for TOTP calculation
    /// </summary>
    /// <returns>Current time step</returns>
    private static long GetCurrentTimeStep()
    {
        var currentTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        return currentTime / TotpPeriod;
    }

    /// <summary>
    /// Generates a TOTP code for a specific time step
    /// </summary>
    /// <param name="secretKey">Secret key bytes</param>
    /// <param name="timeStep">Time step</param>
    /// <returns>6-digit TOTP code</returns>
    private static string GenerateTotpCode(byte[] secretKey, long timeStep)
    {
        var timeStepBytes = BitConverter.GetBytes(timeStep);
        if (BitConverter.IsLittleEndian)
            Array.Reverse(timeStepBytes);

        using var hmac = new HMACSHA1(secretKey);
        var hash = hmac.ComputeHash(timeStepBytes);

        var offset = hash[hash.Length - 1] & 0x0F;
        var binaryCode = ((hash[offset] & 0x7F) << 24) |
                         ((hash[offset + 1] & 0xFF) << 16) |
                         ((hash[offset + 2] & 0xFF) << 8) |
                         (hash[offset + 3] & 0xFF);

        var code = binaryCode % (int)Math.Pow(10, TotpDigits);
        return code.ToString($"D{TotpDigits}");
    }

    /// <summary>
    /// Converts bytes to Base32 string
    /// </summary>
    /// <param name="bytes">Bytes to convert</param>
    /// <returns>Base32 string</returns>
    private static string ToBase32(byte[] bytes)
    {
        var result = new StringBuilder();
        var buffer = 0;
        var bitsLeft = 0;

        foreach (var b in bytes)
        {
            buffer = (buffer << 8) | b;
            bitsLeft += 8;

            while (bitsLeft >= 5)
            {
                result.Append(Base32Chars[(buffer >> (bitsLeft - 5)) & 31]);
                bitsLeft -= 5;
            }
        }

        if (bitsLeft > 0) result.Append(Base32Chars[(buffer << (5 - bitsLeft)) & 31]);

        return result.ToString();
    }

    /// <summary>
    /// Converts Base32 string to bytes
    /// </summary>
    /// <param name="base32">Base32 string</param>
    /// <returns>Decoded bytes</returns>
    private static byte[] FromBase32(string base32)
    {
        var result = new List<byte>();
        var buffer = 0;
        var bitsLeft = 0;

        foreach (var c in base32.ToUpper())
        {
            if (c == '=') break;

            var value = Base32Chars.IndexOf(c);
            if (value < 0) throw new ArgumentException("Invalid Base32 character");

            buffer = (buffer << 5) | value;
            bitsLeft += 5;

            if (bitsLeft >= 8)
            {
                result.Add((byte)(buffer >> (bitsLeft - 8)));
                bitsLeft -= 8;
            }
        }

        return result.ToArray();
    }

    #endregion
}