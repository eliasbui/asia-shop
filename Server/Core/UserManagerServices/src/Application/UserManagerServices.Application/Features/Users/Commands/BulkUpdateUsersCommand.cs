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
/// Command for bulk updating multiple users
/// </summary>
public class BulkUpdateUsersCommand : IRequest<BaseResponse<BulkOperationResult>>
{
    /// <summary>
    /// List of user IDs to update
    /// </summary>
    public List<Guid> UserIds { get; set; } = new();

    /// <summary>
    /// Bulk update operation to perform
    /// </summary>
    public BulkUpdateOperation Operation { get; set; }

    /// <summary>
    /// Values to update (depends on operation type)
    /// </summary>
    public Dictionary<string, object> UpdateValues { get; set; } = new();

    /// <summary>
    /// ID of the user performing the bulk operation
    /// </summary>
    public Guid RequestingUserId { get; set; }

    /// <summary>
    /// Reason for the bulk operation (for audit logging)
    /// </summary>
    public string? Reason { get; set; }
}

/// <summary>
/// Types of bulk update operations
/// </summary>
public enum BulkUpdateOperation
{
    /// <summary>
    /// Activate multiple users
    /// </summary>
    Activate,

    /// <summary>
    /// Deactivate multiple users
    /// </summary>
    Deactivate,

    /// <summary>
    /// Update roles for multiple users
    /// </summary>
    UpdateRoles,

    /// <summary>
    /// Lock out multiple users
    /// </summary>
    LockOut,

    /// <summary>
    /// Unlock multiple users
    /// </summary>
    Unlock,

    /// <summary>
    /// Force password reset for multiple users
    /// </summary>
    ForcePasswordReset,

    /// <summary>
    /// Update email confirmation status
    /// </summary>
    UpdateEmailConfirmation,

    /// <summary>
    /// Update phone confirmation status
    /// </summary>
    UpdatePhoneConfirmation,

    /// <summary>
    /// Enable/disable two-factor authentication
    /// </summary>
    UpdateTwoFactorAuth,

    /// <summary>
    /// Soft delete multiple users
    /// </summary>
    SoftDelete
}

/// <summary>
/// Result of a bulk operation
/// </summary>
public class BulkOperationResult
{
    /// <summary>
    /// Total number of users targeted for the operation
    /// </summary>
    public int TotalTargeted { get; set; }

    /// <summary>
    /// Number of users successfully updated
    /// </summary>
    public int SuccessCount { get; set; }

    /// <summary>
    /// Number of users that failed to update
    /// </summary>
    public int FailureCount { get; set; }

    /// <summary>
    /// Number of users that were skipped (e.g., already in desired state)
    /// </summary>
    public int SkippedCount { get; set; }

    /// <summary>
    /// List of errors that occurred during the operation
    /// </summary>
    public List<BulkOperationError> Errors { get; set; } = new();

    /// <summary>
    /// List of users that were successfully updated
    /// </summary>
    public List<Guid> SuccessfulUserIds { get; set; } = new();

    /// <summary>
    /// List of users that were skipped
    /// </summary>
    public List<Guid> SkippedUserIds { get; set; } = new();

    /// <summary>
    /// Operation that was performed
    /// </summary>
    public BulkUpdateOperation Operation { get; set; }

    /// <summary>
    /// Timestamp when the operation was performed
    /// </summary>
    public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Duration of the operation
    /// </summary>
    public TimeSpan Duration { get; set; }
}

/// <summary>
/// Error that occurred during a bulk operation
/// </summary>
public class BulkOperationError
{
    /// <summary>
    /// User ID that caused the error
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Error message
    /// </summary>
    public string ErrorMessage { get; set; } = string.Empty;

    /// <summary>
    /// Error code for categorization
    /// </summary>
    public string ErrorCode { get; set; } = string.Empty;

    /// <summary>
    /// Additional error details
    /// </summary>
    public Dictionary<string, object> Details { get; set; } = new();
}