using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Admin.Responses;

/// <summary>
/// Response model for users list
/// </summary>
public class UsersResponse
{
    /// <summary>
    /// List of users
    /// </summary>
    public List<UserInfo> Users { get; set; } = new();

    /// <summary>
    /// Pagination information
    /// </summary>
    public PaginationInfo Pagination { get; set; } = new();

    /// <summary>
    /// Filter information applied
    /// </summary>
    public FilterInfo Filters { get; set; } = new();
}

/// <summary>
/// User information for admin view
/// </summary>
public class UserInfo
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's first name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// User's last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// User's full name
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Whether the user is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Whether email is confirmed
    /// </summary>
    public bool EmailConfirmed { get; set; }

    /// <summary>
    /// Whether phone number is confirmed
    /// </summary>
    public bool PhoneNumberConfirmed { get; set; }

    /// <summary>
    /// Whether two-factor authentication is enabled
    /// </summary>
    public bool TwoFactorEnabled { get; set; }

    /// <summary>
    /// User's roles
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
    /// Last login time
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Whether the user is locked out
    /// </summary>
    public bool IsLockedOut { get; set; }

    /// <summary>
    /// Lockout end time if locked
    /// </summary>
    public DateTimeOffset? LockoutEnd { get; set; }
}

/// <summary>
/// Filter information
/// </summary>
public class FilterInfo
{
    /// <summary>
    /// Search term applied
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Active status filter
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Roles filter
    /// </summary>
    public List<string>? Roles { get; set; }
}
