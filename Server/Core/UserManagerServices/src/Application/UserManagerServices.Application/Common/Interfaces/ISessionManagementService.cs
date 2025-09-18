#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Common.Interfaces;

/// <summary>
/// Service interface for enhanced session management
/// Provides concurrent session limits, remote revocation, and configurable timeouts
/// </summary>
public interface ISessionManagementService
{
    /// <summary>
    /// Creates a new session with concurrent session limit enforcement
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="sessionToken">Session token</param>
    /// <param name="refreshToken">Refresh token</param>
    /// <param name="ipAddress">IP address</param>
    /// <param name="userAgent">User agent</param>
    /// <param name="deviceInfo">Device information</param>
    /// <param name="locationInfo">Location information</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created session and information about terminated sessions</returns>
    Task<(UserSession session, List<UserSession> terminatedSessions)> CreateSessionAsync(
        Guid userId,
        string sessionToken,
        string refreshToken,
        string ipAddress,
        string? userAgent = null,
        string? deviceInfo = null,
        string? locationInfo = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates session activity and extends timeout if needed
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated session or null if not found</returns>
    Task<UserSession?> UpdateSessionActivityAsync(string sessionToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Terminates a specific session
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="sessionId">Session ID to terminate</param>
    /// <param name="reason">Termination reason</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was terminated</returns>
    Task<bool> TerminateSessionAsync(Guid userId, Guid sessionId, string reason = "User requested",
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Terminates all sessions for a user except the current one
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="currentSessionId">Current session ID to keep active</param>
    /// <param name="reason">Termination reason</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions terminated</returns>
    Task<int> TerminateAllOtherSessionsAsync(Guid userId, Guid? currentSessionId = null,
        string reason = "User requested", CancellationToken cancellationToken = default);

    /// <summary>
    /// Terminates all sessions for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="reason">Termination reason</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions terminated</returns>
    Task<int> TerminateAllUserSessionsAsync(Guid userId, string reason = "Security measure",
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active sessions for a user with enhanced information
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="currentSessionId">Current session ID for identification</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of active sessions with metadata</returns>
    Task<List<SessionInfo>> GetActiveSessionsAsync(Guid userId, Guid? currentSessionId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates if a session is still valid and active
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if valid, null otherwise</returns>
    Task<UserSession?> ValidateSessionAsync(string sessionToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks for suspicious session activity
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="ipAddress">Current IP address</param>
    /// <param name="userAgent">Current user agent</param>
    /// <param name="locationInfo">Current location info</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if activity is suspicious</returns>
    Task<bool> IsSuspiciousSessionActivityAsync(Guid userId, string ipAddress, string? userAgent = null,
        string? locationInfo = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets session statistics for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session statistics</returns>
    Task<SessionStatistics> GetSessionStatisticsAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cleans up expired sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions cleaned up</returns>
    Task<int> CleanupExpiredSessionsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets concurrent session count for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of active concurrent sessions</returns>
    Task<int> GetConcurrentSessionCountAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Enforces concurrent session limits by terminating oldest sessions
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="maxSessions">Maximum allowed sessions</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of terminated sessions</returns>
    Task<List<UserSession>> EnforceConcurrentSessionLimitAsync(Guid userId, int maxSessions,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends security alert for suspicious session activity
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="sessionInfo">Session information</param>
    /// <param name="alertType">Type of security alert</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task SendSessionSecurityAlertAsync(Guid userId, SessionInfo sessionInfo, string alertType,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Enhanced session information model
/// </summary>
public class SessionInfo
{
    public Guid SessionId { get; set; }
    public string Device { get; set; } = null!;
    public string OperatingSystem { get; set; } = null!;
    public string Browser { get; set; } = null!;
    public string IpAddress { get; set; } = null!;
    public string Location { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime LastActivity { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsCurrent { get; set; }
    public bool IsActive { get; set; }
    public bool IsSuspicious { get; set; }
    public string? SecurityRisk { get; set; }
    public int ActivityScore { get; set; }
}

/// <summary>
/// Session statistics model
/// </summary>
public class SessionStatistics
{
    public int TotalSessions { get; set; }
    public int ActiveSessions { get; set; }
    public int ExpiredSessions { get; set; }
    public int SuspiciousSessions { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? LastLoginLocation { get; set; }
    public string? LastLoginDevice { get; set; }
    public List<string> RecentLocations { get; set; } = new();
    public List<string> RecentDevices { get; set; } = new();
    public Dictionary<string, int> LocationBreakdown { get; set; } = new();
    public Dictionary<string, int> DeviceBreakdown { get; set; } = new();
}