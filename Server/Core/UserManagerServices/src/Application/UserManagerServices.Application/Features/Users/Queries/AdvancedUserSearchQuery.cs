#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Queries;

/// <summary>
/// Advanced user search query with comprehensive filtering and sorting options
/// </summary>
public class AdvancedUserSearchQuery : IRequest<BaseResponse<AdvancedUserSearchResponse>>
{
    /// <summary>
    /// Page number for pagination
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Page size for pagination
    /// </summary>
    public int PageSize { get; set; } = 20;

    /// <summary>
    /// General search term (searches across name, email, phone)
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Filter by email address (exact or partial match)
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Filter by first name (partial match)
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Filter by last name (partial match)
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// Filter by phone number (partial match)
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Filter by active status
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Filter by email confirmation status
    /// </summary>
    public bool? EmailConfirmed { get; set; }

    /// <summary>
    /// Filter by phone confirmation status
    /// </summary>
    public bool? PhoneNumberConfirmed { get; set; }

    /// <summary>
    /// Filter by two-factor authentication status
    /// </summary>
    public bool? TwoFactorEnabled { get; set; }

    /// <summary>
    /// Filter by lockout status
    /// </summary>
    public bool? IsLockedOut { get; set; }

    /// <summary>
    /// Filter by roles (user must have at least one of these roles)
    /// </summary>
    public List<string>? Roles { get; set; }

    /// <summary>
    /// Filter by creation date range (from)
    /// </summary>
    public DateTime? CreatedFrom { get; set; }

    /// <summary>
    /// Filter by creation date range (to)
    /// </summary>
    public DateTime? CreatedTo { get; set; }

    /// <summary>
    /// Filter by last login date range (from)
    /// </summary>
    public DateTime? LastLoginFrom { get; set; }

    /// <summary>
    /// Filter by last login date range (to)
    /// </summary>
    public DateTime? LastLoginTo { get; set; }

    /// <summary>
    /// Filter by last update date range (from)
    /// </summary>
    public DateTime? UpdatedFrom { get; set; }

    /// <summary>
    /// Filter by last update date range (to)
    /// </summary>
    public DateTime? UpdatedTo { get; set; }

    /// <summary>
    /// Filter users who have never logged in
    /// </summary>
    public bool? NeverLoggedIn { get; set; }

    /// <summary>
    /// Filter users who haven't logged in for X days
    /// </summary>
    public int? InactiveDays { get; set; }

    /// <summary>
    /// Filter by MFA enabled status
    /// </summary>
    public bool? MfaEnabled { get; set; }

    /// <summary>
    /// Filter by users with active sessions
    /// </summary>
    public bool? HasActiveSessions { get; set; }

    /// <summary>
    /// Filter by users with failed login attempts
    /// </summary>
    public bool? HasFailedLoginAttempts { get; set; }

    /// <summary>
    /// Minimum number of failed login attempts
    /// </summary>
    public int? MinFailedLoginAttempts { get; set; }

    /// <summary>
    /// Sort field
    /// </summary>
    public UserSortField SortBy { get; set; } = UserSortField.CreatedAt;

    /// <summary>
    /// Sort direction
    /// </summary>
    public SortDirection SortDirection { get; set; } = SortDirection.Descending;

    /// <summary>
    /// Include soft-deleted users in results
    /// </summary>
    public bool IncludeDeleted { get; set; } = false;

    /// <summary>
    /// Export format (if this is an export request)
    /// </summary>
    public ExportFormat? ExportFormat { get; set; }

    /// <summary>
    /// Fields to include in export
    /// </summary>
    public List<string>? ExportFields { get; set; }

    /// <summary>
    /// ID of the user making the request
    /// </summary>
    public Guid RequestingUserId { get; set; }

    /// <summary>
    /// Whether this is an admin request (affects permissions and data visibility)
    /// </summary>
    public bool IsAdminRequest { get; set; }
}

/// <summary>
/// Available sort fields for user search
/// </summary>
public enum UserSortField
{
    Email,
    FirstName,
    LastName,
    FullName,
    CreatedAt,
    UpdatedAt,
    LastLoginAt,
    IsActive,
    EmailConfirmed,
    TwoFactorEnabled,
    FailedLoginCount
}

/// <summary>
/// Sort direction
/// </summary>
public enum SortDirection
{
    Ascending,
    Descending
}

/// <summary>
/// Export formats
/// </summary>
public enum ExportFormat
{
    Csv,
    Excel,
    Json
}