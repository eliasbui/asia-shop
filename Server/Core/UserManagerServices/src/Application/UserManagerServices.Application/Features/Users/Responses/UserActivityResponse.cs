namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for user activity logs
/// </summary>
public class UserActivityResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// List of activity logs
    /// </summary>
    public List<ActivityLogInfo> Activities { get; set; } = new();

    /// <summary>
    /// Pagination information
    /// </summary>
    public PaginationInfo Pagination { get; set; } = new();
}

/// <summary>
/// Activity log information
/// </summary>
public class ActivityLogInfo
{
    /// <summary>
    /// Activity log ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Action performed
    /// </summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>
    /// Description of the action
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// IP address from which the action was performed
    /// </summary>
    public string IpAddress { get; set; } = string.Empty;

    /// <summary>
    /// User agent string
    /// </summary>
    public string UserAgent { get; set; } = string.Empty;

    /// <summary>
    /// Additional metadata about the action
    /// </summary>
    public Dictionary<string, object> Metadata { get; set; } = new();

    /// <summary>
    /// Whether the action was successful
    /// </summary>
    public bool IsSuccess { get; set; }

    /// <summary>
    /// Error message if the action failed
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// When the action was performed
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Resource that was affected by the action
    /// </summary>
    public string? Resource { get; set; }

    /// <summary>
    /// Resource ID that was affected
    /// </summary>
    public string? ResourceId { get; set; }
}

/// <summary>
/// Pagination information
/// </summary>
public class PaginationInfo
{
    /// <summary>
    /// Current page number
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Page size
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of items
    /// </summary>
    public int TotalItems { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    /// Whether there is a previous page
    /// </summary>
    public bool HasPreviousPage { get; set; }

    /// <summary>
    /// Whether there is a next page
    /// </summary>
    public bool HasNextPage { get; set; }
}