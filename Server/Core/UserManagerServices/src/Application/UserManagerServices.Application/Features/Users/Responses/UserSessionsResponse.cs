namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for user sessions
/// </summary>
public class UserSessionsResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// List of active sessions
    /// </summary>
    public List<SessionInfo> Sessions { get; set; } = new();

    /// <summary>
    /// Total number of active sessions
    /// </summary>
    public int TotalSessions { get; set; }

    /// <summary>
    /// Current session ID (the one making the request)
    /// </summary>
    public Guid? CurrentSessionId { get; set; }
}

/// <summary>
/// Session information
/// </summary>
public class SessionInfo
{
    /// <summary>
    /// Session ID
    /// </summary>
    public Guid SessionId { get; set; }

    /// <summary>
    /// Device information
    /// </summary>
    public string Device { get; set; } = string.Empty;

    /// <summary>
    /// Operating system
    /// </summary>
    public string OperatingSystem { get; set; } = string.Empty;

    /// <summary>
    /// Browser information
    /// </summary>
    public string Browser { get; set; } = string.Empty;

    /// <summary>
    /// IP address
    /// </summary>
    public string IpAddress { get; set; } = string.Empty;

    /// <summary>
    /// Location (city, country)
    /// </summary>
    public string Location { get; set; } = string.Empty;

    /// <summary>
    /// When the session was created
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Last activity timestamp
    /// </summary>
    public DateTime LastActivity { get; set; }

    /// <summary>
    /// When the session expires
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Whether this is the current session
    /// </summary>
    public bool IsCurrent { get; set; }

    /// <summary>
    /// Whether the session is active
    /// </summary>
    public bool IsActive { get; set; }
}
