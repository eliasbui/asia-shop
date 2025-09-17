using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Password hashing service implementation using BCrypt
/// Provides secure password hashing and verification with configurable work factor
/// </summary>
public class PasswordHashingService : IPasswordHashingService
{
    private readonly ILogger<PasswordHashingService> _logger;
    private const int DefaultWorkFactor = 12; // BCrypt work factor (cost)
    private const int MinWorkFactor = 10;
    private const int MaxWorkFactor = 15;

    /// <summary>
    /// Initializes a new instance of the PasswordHashingService
    /// </summary>
    /// <param name="logger">Logger instance</param>
    public PasswordHashingService(ILogger<PasswordHashingService> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Hashes a password using BCrypt with a secure work factor
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <returns>Hashed password</returns>
    /// <exception cref="ArgumentException">Thrown when password is null or empty</exception>
    public string HashPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Password cannot be null or empty", nameof(password));
        }

        try
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, DefaultWorkFactor);
            _logger.LogDebug("Password hashed successfully with work factor {WorkFactor}", DefaultWorkFactor);
            return hashedPassword;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hashing password");
            throw;
        }
    }

    /// <summary>
    /// Verifies a password against its hash using BCrypt
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <param name="hashedPassword">Hashed password</param>
    /// <returns>True if password matches, false otherwise</returns>
    /// <exception cref="ArgumentException">Thrown when password or hashedPassword is null or empty</exception>
    public bool VerifyPassword(string password, string hashedPassword)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Password cannot be null or empty", nameof(password));
        }

        if (string.IsNullOrEmpty(hashedPassword))
        {
            throw new ArgumentException("Hashed password cannot be null or empty", nameof(hashedPassword));
        }

        try
        {
            var isValid = BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            _logger.LogDebug("Password verification result: {IsValid}", isValid);
            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying password");
            return false; // Fail closed for security
        }
    }

    /// <summary>
    /// Checks if a password hash needs to be rehashed (for security upgrades)
    /// This is useful when upgrading the work factor or switching algorithms
    /// </summary>
    /// <param name="hashedPassword">Hashed password</param>
    /// <returns>True if rehashing is needed, false otherwise</returns>
    public bool NeedsRehash(string hashedPassword)
    {
        if (string.IsNullOrEmpty(hashedPassword))
        {
            return true; // Invalid hash needs rehashing
        }

        try
        {
            // Check if the hash was created with the current work factor
            var currentWorkFactor = ExtractWorkFactor(hashedPassword);
            var needsRehash = currentWorkFactor < DefaultWorkFactor;
            
            if (needsRehash)
            {
                _logger.LogInformation("Password hash needs rehashing. Current work factor: {CurrentWorkFactor}, Target work factor: {TargetWorkFactor}", 
                    currentWorkFactor, DefaultWorkFactor);
            }

            return needsRehash;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error checking if password hash needs rehashing");
            return true; // If we can't determine, assume it needs rehashing for security
        }
    }

    /// <summary>
    /// Extracts the work factor from a BCrypt hash
    /// </summary>
    /// <param name="hashedPassword">BCrypt hashed password</param>
    /// <returns>Work factor used in the hash</returns>
    private static int ExtractWorkFactor(string hashedPassword)
    {
        // BCrypt hash format: $2a$[cost]$[salt][hash]
        // Example: $2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
        
        if (string.IsNullOrEmpty(hashedPassword) || hashedPassword.Length < 7)
        {
            throw new ArgumentException("Invalid BCrypt hash format", nameof(hashedPassword));
        }

        var parts = hashedPassword.Split('$');
        if (parts.Length < 4)
        {
            throw new ArgumentException("Invalid BCrypt hash format", nameof(hashedPassword));
        }

        if (!int.TryParse(parts[2], out var workFactor))
        {
            throw new ArgumentException("Invalid work factor in BCrypt hash", nameof(hashedPassword));
        }

        if (workFactor < MinWorkFactor || workFactor > MaxWorkFactor)
        {
            throw new ArgumentException($"Work factor {workFactor} is outside valid range ({MinWorkFactor}-{MaxWorkFactor})", nameof(hashedPassword));
        }

        return workFactor;
    }

    /// <summary>
    /// Validates password strength according to security requirements
    /// </summary>
    /// <param name="password">Password to validate</param>
    /// <returns>Validation result with errors if any</returns>
    public PasswordValidationResult ValidatePasswordStrength(string password)
    {
        var result = new PasswordValidationResult { IsValid = true };

        if (string.IsNullOrEmpty(password))
        {
            result.IsValid = false;
            result.Errors.Add("Password is required");
            return result;
        }

        // Minimum length check
        if (password.Length < 8)
        {
            result.IsValid = false;
            result.Errors.Add("Password must be at least 8 characters long");
        }

        // Maximum length check (prevent DoS attacks)
        if (password.Length > 128)
        {
            result.IsValid = false;
            result.Errors.Add("Password must not exceed 128 characters");
        }

        // Character type requirements
        if (!password.Any(char.IsLower))
        {
            result.IsValid = false;
            result.Errors.Add("Password must contain at least one lowercase letter");
        }

        if (!password.Any(char.IsUpper))
        {
            result.IsValid = false;
            result.Errors.Add("Password must contain at least one uppercase letter");
        }

        if (!password.Any(char.IsDigit))
        {
            result.IsValid = false;
            result.Errors.Add("Password must contain at least one digit");
        }

        if (!password.Any(c => !char.IsLetterOrDigit(c)))
        {
            result.IsValid = false;
            result.Errors.Add("Password must contain at least one special character");
        }

        // Common password patterns check
        var commonPatterns = new[] { "password", "123456", "qwerty", "admin", "letmein" };
        if (commonPatterns.Any(pattern => password.ToLowerInvariant().Contains(pattern)))
        {
            result.IsValid = false;
            result.Errors.Add("Password contains common patterns and is not secure");
        }

        return result;
    }
}

/// <summary>
/// Result of password validation
/// </summary>
public class PasswordValidationResult
{
    /// <summary>
    /// Indicates if the password is valid
    /// </summary>
    public bool IsValid { get; set; }

    /// <summary>
    /// List of validation errors
    /// </summary>
    public List<string> Errors { get; set; } = new();
}
