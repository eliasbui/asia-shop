#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Users.Commands;

/// <summary>
/// Command for bulk creating multiple users
/// </summary>
public class BulkCreateUsersCommand : IRequest<BaseResponse<BulkCreateResult>>
{
    /// <summary>
    /// List of users to create
    /// </summary>
    public List<BulkUserCreateData> Users { get; set; } = new();

    /// <summary>
    /// ID of the user performing the bulk operation
    /// </summary>
    public Guid RequestingUserId { get; set; }

    /// <summary>
    /// Whether to send welcome emails to created users
    /// </summary>
    public bool SendWelcomeEmails { get; set; } = true;

    /// <summary>
    /// Whether to generate random passwords for users without passwords
    /// </summary>
    public bool GenerateRandomPasswords { get; set; } = true;

    /// <summary>
    /// Whether to require email confirmation for created users
    /// </summary>
    public bool RequireEmailConfirmation { get; set; } = true;

    /// <summary>
    /// Default roles to assign to all created users
    /// </summary>
    public List<string> DefaultRoles { get; set; } = new();

    /// <summary>
    /// Whether to skip users that already exist (by email)
    /// </summary>
    public bool SkipExistingUsers { get; set; } = true;
}

/// <summary>
/// Data for creating a single user in bulk operation
/// </summary>
public class BulkUserCreateData
{
    /// <summary>
    /// User's email address (required, must be unique)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's first name
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// User's last name
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// User's password (if not provided, will be generated if GenerateRandomPasswords is true)
    /// </summary>
    public string? Password { get; set; }

    /// <summary>
    /// Roles to assign to this specific user (in addition to default roles)
    /// </summary>
    public List<string> Roles { get; set; } = new();

    /// <summary>
    /// Whether this user should be active upon creation
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Custom metadata for this user
    /// </summary>
    public Dictionary<string, object> Metadata { get; set; } = new();

    /// <summary>
    /// Row number in the source data (for error reporting)
    /// </summary>
    public int RowNumber { get; set; }
}

/// <summary>
/// Result of a bulk create operation
/// </summary>
public class BulkCreateResult
{
    /// <summary>
    /// Total number of users targeted for creation
    /// </summary>
    public int TotalTargeted { get; set; }

    /// <summary>
    /// Number of users successfully created
    /// </summary>
    public int SuccessCount { get; set; }

    /// <summary>
    /// Number of users that failed to create
    /// </summary>
    public int FailureCount { get; set; }

    /// <summary>
    /// Number of users that were skipped (e.g., already exist)
    /// </summary>
    public int SkippedCount { get; set; }

    /// <summary>
    /// List of errors that occurred during the operation
    /// </summary>
    public List<BulkCreateError> Errors { get; set; } = new();

    /// <summary>
    /// List of successfully created users
    /// </summary>
    public List<BulkCreatedUser> CreatedUsers { get; set; } = new();

    /// <summary>
    /// List of users that were skipped
    /// </summary>
    public List<BulkSkippedUser> SkippedUsers { get; set; } = new();

    /// <summary>
    /// Timestamp when the operation was performed
    /// </summary>
    public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Duration of the operation
    /// </summary>
    public TimeSpan Duration { get; set; }

    /// <summary>
    /// Whether welcome emails were sent
    /// </summary>
    public bool WelcomeEmailsSent { get; set; }
}

/// <summary>
/// Information about a successfully created user
/// </summary>
public class BulkCreatedUser
{
    /// <summary>
    /// Generated user ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's full name
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Generated password (if applicable)
    /// </summary>
    public string? GeneratedPassword { get; set; }

    /// <summary>
    /// Roles assigned to the user
    /// </summary>
    public List<string> AssignedRoles { get; set; } = new();

    /// <summary>
    /// Row number in the source data
    /// </summary>
    public int RowNumber { get; set; }
}

/// <summary>
/// Information about a skipped user
/// </summary>
public class BulkSkippedUser
{
    /// <summary>
    /// User's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Reason why the user was skipped
    /// </summary>
    public string Reason { get; set; } = string.Empty;

    /// <summary>
    /// Row number in the source data
    /// </summary>
    public int RowNumber { get; set; }
}

/// <summary>
/// Error that occurred during bulk user creation
/// </summary>
public class BulkCreateError
{
    /// <summary>
    /// User's email address that caused the error
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Error message
    /// </summary>
    public string ErrorMessage { get; set; } = string.Empty;

    /// <summary>
    /// Error code for categorization
    /// </summary>
    public string ErrorCode { get; set; } = string.Empty;

    /// <summary>
    /// Row number in the source data
    /// </summary>
    public int RowNumber { get; set; }

    /// <summary>
    /// Additional error details
    /// </summary>
    public Dictionary<string, object> Details { get; set; } = new();
}