using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response for advanced user search with comprehensive user information
/// </summary>
public class AdvancedUserSearchResponse
{
    /// <summary>
    /// List of users matching the search criteria
    /// </summary>
    public List<DetailedUserInfo> Users { get; set; } = new();

    /// <summary>
    /// Pagination information
    /// </summary>
    public PaginationInfo Pagination { get; set; } = new();

    /// <summary>
    /// Applied filters information
    /// </summary>
    public SearchFilterInfo Filters { get; set; } = new();

    /// <summary>
    /// Search statistics and aggregations
    /// </summary>
    public UserSearchStatistics Statistics { get; set; } = new();

    /// <summary>
    /// Export information (if this was an export request)
    /// </summary>
    public ExportInfo? Export { get; set; }
}

/// <summary>
/// Detailed user information for search results
/// </summary>
public class DetailedUserInfo
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// First name
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Last name
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// Full name (computed)
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Whether the user is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Whether the email is confirmed
    /// </summary>
    public bool EmailConfirmed { get; set; }

    /// <summary>
    /// When the email was confirmed
    /// </summary>
    public DateTime? EmailConfirmedAt { get; set; }

    /// <summary>
    /// Whether the phone number is confirmed
    /// </summary>
    public bool PhoneNumberConfirmed { get; set; }

    /// <summary>
    /// Whether two-factor authentication is enabled
    /// </summary>
    public bool TwoFactorEnabled { get; set; }

    /// <summary>
    /// Whether MFA is enabled
    /// </summary>
    public bool MfaEnabled { get; set; }

    /// <summary>
    /// User roles
    /// </summary>
    public List<string> Roles { get; set; } = new();

    /// <summary>
    /// When the user was created
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// When the user was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// When the user last logged in
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Whether the user is currently locked out
    /// </summary>
    public bool IsLockedOut { get; set; }

    /// <summary>
    /// When the lockout ends (if locked out)
    /// </summary>
    public DateTime? LockoutEnd { get; set; }

    /// <summary>
    /// Number of failed login attempts
    /// </summary>
    public int FailedLoginAttempts { get; set; }

    /// <summary>
    /// Number of active sessions
    /// </summary>
    public int ActiveSessions { get; set; }

    /// <summary>
    /// Last known IP address
    /// </summary>
    public string? LastIpAddress { get; set; }

    /// <summary>
    /// Last known location
    /// </summary>
    public string? LastLocation { get; set; }

    /// <summary>
    /// Whether the user is soft deleted
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// When the user was deleted (if soft deleted)
    /// </summary>
    public DateTime? DeletedAt { get; set; }

    /// <summary>
    /// Days since last login
    /// </summary>
    public int? DaysSinceLastLogin { get; set; }

    /// <summary>
    /// User's security score (0-100)
    /// </summary>
    public int SecurityScore { get; set; }

    /// <summary>
    /// Risk level based on recent activity
    /// </summary>
    public string RiskLevel { get; set; } = "Low";

    /// <summary>
    /// Tags associated with the user
    /// </summary>
    public List<string> Tags { get; set; } = new();
}

/// <summary>
/// Information about applied search filters
/// </summary>
public class SearchFilterInfo
{
    /// <summary>
    /// General search term used
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Active status filter
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Email confirmation filter
    /// </summary>
    public bool? EmailConfirmed { get; set; }

    /// <summary>
    /// Two-factor authentication filter
    /// </summary>
    public bool? TwoFactorEnabled { get; set; }

    /// <summary>
    /// Lockout status filter
    /// </summary>
    public bool? IsLockedOut { get; set; }

    /// <summary>
    /// Roles filter
    /// </summary>
    public List<string>? Roles { get; set; }

    /// <summary>
    /// Date range filters
    /// </summary>
    public DateRangeFilter? CreatedDateRange { get; set; }

    /// <summary>
    /// Last login date range filter
    /// </summary>
    public DateRangeFilter? LastLoginDateRange { get; set; }

    /// <summary>
    /// Sort information
    /// </summary>
    public SortInfo Sort { get; set; } = new();

    /// <summary>
    /// Whether deleted users are included
    /// </summary>
    public bool IncludeDeleted { get; set; }
}

/// <summary>
/// Date range filter information
/// </summary>
public class DateRangeFilter
{
    /// <summary>
    /// Start date of the range
    /// </summary>
    public DateTime? From { get; set; }

    /// <summary>
    /// End date of the range
    /// </summary>
    public DateTime? To { get; set; }
}

/// <summary>
/// Sort information
/// </summary>
public class SortInfo
{
    /// <summary>
    /// Field being sorted by
    /// </summary>
    public string Field { get; set; } = "CreatedAt";

    /// <summary>
    /// Sort direction
    /// </summary>
    public string Direction { get; set; } = "Descending";
}

/// <summary>
/// Statistics and aggregations for the search results
/// </summary>
public class UserSearchStatistics
{
    /// <summary>
    /// Total number of users matching the criteria (before pagination)
    /// </summary>
    public int TotalUsers { get; set; }

    /// <summary>
    /// Number of active users
    /// </summary>
    public int ActiveUsers { get; set; }

    /// <summary>
    /// Number of inactive users
    /// </summary>
    public int InactiveUsers { get; set; }

    /// <summary>
    /// Number of users with confirmed emails
    /// </summary>
    public int EmailConfirmedUsers { get; set; }

    /// <summary>
    /// Number of users with two-factor authentication enabled
    /// </summary>
    public int TwoFactorEnabledUsers { get; set; }

    /// <summary>
    /// Number of locked out users
    /// </summary>
    public int LockedOutUsers { get; set; }

    /// <summary>
    /// Number of users who have never logged in
    /// </summary>
    public int NeverLoggedInUsers { get; set; }

    /// <summary>
    /// Role distribution
    /// </summary>
    public Dictionary<string, int> RoleDistribution { get; set; } = new();

    /// <summary>
    /// Registration trends (users created per month for last 12 months)
    /// </summary>
    public Dictionary<string, int> RegistrationTrends { get; set; } = new();

    /// <summary>
    /// Average security score
    /// </summary>
    public double AverageSecurityScore { get; set; }

    /// <summary>
    /// Risk level distribution
    /// </summary>
    public Dictionary<string, int> RiskLevelDistribution { get; set; } = new();
}

/// <summary>
/// Export information
/// </summary>
public class ExportInfo
{
    /// <summary>
    /// Export format used
    /// </summary>
    public string Format { get; set; } = string.Empty;

    /// <summary>
    /// Number of records exported
    /// </summary>
    public int RecordCount { get; set; }

    /// <summary>
    /// Export file name
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Export file size in bytes
    /// </summary>
    public long FileSizeBytes { get; set; }

    /// <summary>
    /// When the export was generated
    /// </summary>
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fields included in the export
    /// </summary>
    public List<string> IncludedFields { get; set; } = new();
}
