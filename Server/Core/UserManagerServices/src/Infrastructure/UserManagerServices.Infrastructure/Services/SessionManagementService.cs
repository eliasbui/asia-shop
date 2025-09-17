using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Service implementation for enhanced session management
/// Provides concurrent session limits, remote revocation, and configurable timeouts
/// </summary>
public class SessionManagementService(
    IUnitOfWork unitOfWork,
    ILogger<SessionManagementService> logger,
    IEmailService emailService)
    : ISessionManagementService
{
    private readonly IEmailService _emailService = emailService;

    /// <summary>
    /// Creates a new session with concurrent session limit enforcement
    /// </summary>
    public async Task<(UserSession session, List<UserSession> terminatedSessions)> CreateSessionAsync(
        Guid userId,
        string sessionToken,
        string refreshToken,
        string ipAddress,
        string? userAgent = null,
        string? deviceInfo = null,
        string? locationInfo = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Get user security settings for session timeout and concurrent limits
            var securitySettings = await unitOfWork.UserSecuritySettings.GetUserSecuritySettingsAsync(userId, cancellationToken);
            
            // Parse device info and user agent for better tracking
            var parsedDeviceInfo = ParseDeviceInfo(userAgent, deviceInfo);
            
            // Create new session
            var session = new UserSession
            {
                UserId = userId,
                SessionToken = sessionToken,
                RefreshToken = refreshToken,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                OperatingSystem = parsedDeviceInfo.OperatingSystem,
                Browser = parsedDeviceInfo.Browser,
                Location = locationInfo ?? "Unknown",
                DeviceInfo = JsonSerializer.Serialize(parsedDeviceInfo),
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddMinutes(securitySettings.SessionTimeoutMinutes),
                LastAccessedAt = DateTime.UtcNow
            };

            await unitOfWork.UserSessions.AddAsync(session, cancellationToken);

            // Enforce concurrent session limits
            var terminatedSessions = await EnforceConcurrentSessionLimitAsync(
                userId, securitySettings.MaxConcurrentSessions, cancellationToken);

            // Check for suspicious activity
            var isSuspicious = await IsSuspiciousSessionActivityAsync(userId, ipAddress, userAgent, locationInfo, cancellationToken);
            
            if (isSuspicious)
            {
                logger.LogWarning("Suspicious session activity detected for user {UserId} from IP {IpAddress}", userId, ipAddress);
                
                // Send security alert
                var sessionInfo = new SessionInfo
                {
                    SessionId = session.Id,
                    IpAddress = ipAddress,
                    Location = locationInfo ?? "Unknown",
                    Device = parsedDeviceInfo.DeviceType,
                    OperatingSystem = parsedDeviceInfo.OperatingSystem,
                    Browser = parsedDeviceInfo.Browser,
                    CreatedAt = session.CreatedAt,
                    LastActivity = session.LastAccessedAt ?? session.CreatedAt,
                    ExpiresAt = session.ExpiresAt,
                    IsSuspicious = true,
                    SecurityRisk = "New location or device detected"
                };

                await SendSessionSecurityAlertAsync(userId, sessionInfo, "Suspicious Login", cancellationToken);
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Session created for user {UserId}. Terminated {TerminatedCount} sessions due to limits", 
                userId, terminatedSessions.Count);

            return (session, terminatedSessions);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating session for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Updates session activity and extends timeout if needed
    /// </summary>
    public async Task<UserSession?> UpdateSessionActivityAsync(string sessionToken, CancellationToken cancellationToken = default)
    {
        try
        {
            var session = await unitOfWork.UserSessions.GetBySessionTokenAsync(sessionToken, cancellationToken);
            
            if (session == null || !session.IsActive || session.ExpiresAt <= DateTime.UtcNow)
                return null;

            // Update last accessed time
            session.LastAccessedAt = DateTime.UtcNow;
            
            // Extend session if needed (sliding expiration)
            var securitySettings = await unitOfWork.UserSecuritySettings.GetUserSecuritySettingsAsync(session.UserId, cancellationToken);
            session.ExpiresAt = DateTime.UtcNow.AddMinutes(securitySettings.SessionTimeoutMinutes);
            session.UpdatedAt = DateTime.UtcNow;

            await unitOfWork.UserSessions.UpdateAsync(session, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return session;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating session activity for token {SessionToken}", sessionToken);
            throw;
        }
    }

    /// <summary>
    /// Terminates a specific session
    /// </summary>
    public async Task<bool> TerminateSessionAsync(Guid userId, Guid sessionId, string reason = "User requested", 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var session = await unitOfWork.UserSessions.GetByIdAsync(sessionId, cancellationToken);
            
            if (session == null || session.UserId != userId)
                return false;

            session.IsActive = false;
            session.UpdatedAt = DateTime.UtcNow;

            await unitOfWork.UserSessions.UpdateAsync(session, cancellationToken);

            // Log the session termination
            await LogSessionActivityAsync(userId, ActionEnum.SessionTerminated, new
            {
                SessionId = sessionId,
                Reason = reason,
                IpAddress = session.IpAddress,
                Device = session.DeviceInfo
            }, cancellationToken);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Session {SessionId} terminated for user {UserId}. Reason: {Reason}", 
                sessionId, userId, reason);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error terminating session {SessionId} for user {UserId}", sessionId, userId);
            throw;
        }
    }

    /// <summary>
    /// Terminates all sessions for a user except the current one
    /// </summary>
    public async Task<int> TerminateAllOtherSessionsAsync(Guid userId, Guid? currentSessionId = null, 
        string reason = "User requested", CancellationToken cancellationToken = default)
    {
        try
        {
            var activeSessions = await unitOfWork.UserSessions.GetActiveSessionsAsync(userId, cancellationToken);
            var sessionsToTerminate = activeSessions.Where(s => s.Id != currentSessionId).ToList();

            foreach (var session in sessionsToTerminate)
            {
                session.IsActive = false;
                session.UpdatedAt = DateTime.UtcNow;
                await unitOfWork.UserSessions.UpdateAsync(session, cancellationToken);
            }

            // Log the bulk session termination
            await LogSessionActivityAsync(userId, ActionEnum.SessionTerminated, new
            {
                TerminatedSessions = sessionsToTerminate.Count,
                CurrentSessionId = currentSessionId,
                Reason = reason
            }, cancellationToken);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Terminated {Count} sessions for user {UserId}. Reason: {Reason}", 
                sessionsToTerminate.Count, userId, reason);

            return sessionsToTerminate.Count;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error terminating other sessions for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Terminates all sessions for a user
    /// </summary>
    public async Task<int> TerminateAllUserSessionsAsync(Guid userId, string reason = "Security measure", 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var activeSessions = await unitOfWork.UserSessions.GetActiveSessionsAsync(userId, cancellationToken);

            foreach (var session in activeSessions)
            {
                session.IsActive = false;
                session.UpdatedAt = DateTime.UtcNow;
                await unitOfWork.UserSessions.UpdateAsync(session, cancellationToken);
            }

            // Log the complete session termination
            await LogSessionActivityAsync(userId, ActionEnum.SessionTerminated, new
            {
                TerminatedSessions = activeSessions.Count(),
                Reason = reason,
                Type = "All sessions terminated"
            }, cancellationToken);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogWarning("All sessions terminated for user {UserId}. Reason: {Reason}", userId, reason);

            return activeSessions.Count();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error terminating all sessions for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Gets active sessions for a user with enhanced information
    /// </summary>
    public async Task<List<SessionInfo>> GetActiveSessionsAsync(Guid userId, Guid? currentSessionId = null, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var sessions = await unitOfWork.UserSessions.GetActiveSessionsAsync(userId, cancellationToken);
            var sessionInfos = new List<SessionInfo>();

            foreach (var session in sessions)
            {
                var deviceInfo = ParseStoredDeviceInfo(session.DeviceInfo);
                var isSuspicious = await EvaluateSessionSuspiciousness(session, cancellationToken);

                sessionInfos.Add(new SessionInfo
                {
                    SessionId = session.Id,
                    Device = deviceInfo.DeviceType,
                    OperatingSystem = session.OperatingSystem ?? deviceInfo.OperatingSystem,
                    Browser = session.Browser ?? deviceInfo.Browser,
                    IpAddress = session.IpAddress,
                    Location = session.Location ?? "Unknown",
                    CreatedAt = session.CreatedAt,
                    LastActivity = session.LastAccessedAt ?? session.CreatedAt,
                    ExpiresAt = session.ExpiresAt,
                    IsCurrent = session.Id == currentSessionId,
                    IsActive = session.IsActive && session.ExpiresAt > DateTime.UtcNow,
                    IsSuspicious = isSuspicious,
                    SecurityRisk = isSuspicious ? "Unusual activity detected" : null,
                    ActivityScore = CalculateActivityScore(session)
                });
            }

            return sessionInfos.OrderByDescending(s => s.LastActivity).ToList();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting active sessions for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Validates if a session is still valid and active
    /// </summary>
    public async Task<UserSession?> ValidateSessionAsync(string sessionToken, CancellationToken cancellationToken = default)
    {
        try
        {
            var session = await unitOfWork.UserSessions.GetBySessionTokenAsync(sessionToken, cancellationToken);
            
            if (session == null || !session.IsActive || session.ExpiresAt <= DateTime.UtcNow)
                return null;

            return session;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error validating session token {SessionToken}", sessionToken);
            return null;
        }
    }

    #region Private Helper Methods

    private async Task LogSessionActivityAsync(Guid userId, ActionEnum action, object details, CancellationToken cancellationToken)
    {
        try
        {
            var activityLog = new UserActivityLog
            {
                UserId = userId,
                Action = action,
                Entity = "UserSession",
                Details = JsonSerializer.Serialize(details),
                Timestamp = DateTime.UtcNow
            };

            await unitOfWork.UserActivityLogs.AddAsync(activityLog, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error logging session activity for user {UserId}", userId);
        }
    }

    private static DeviceInfo ParseDeviceInfo(string? userAgent, string? deviceInfo)
    {
        // Simplified device parsing - in production, use a proper user agent parser
        var info = new DeviceInfo
        {
            DeviceType = "Desktop",
            OperatingSystem = "Unknown",
            Browser = "Unknown"
        };

        if (!string.IsNullOrEmpty(userAgent))
        {
            var ua = userAgent.ToLower();
            
            // Detect mobile devices
            if (ua.Contains("mobile") || ua.Contains("android") || ua.Contains("iphone"))
                info.DeviceType = "Mobile";
            else if (ua.Contains("tablet") || ua.Contains("ipad"))
                info.DeviceType = "Tablet";

            // Detect operating system
            if (ua.Contains("windows")) info.OperatingSystem = "Windows";
            else if (ua.Contains("mac")) info.OperatingSystem = "macOS";
            else if (ua.Contains("linux")) info.OperatingSystem = "Linux";
            else if (ua.Contains("android")) info.OperatingSystem = "Android";
            else if (ua.Contains("ios") || ua.Contains("iphone") || ua.Contains("ipad")) info.OperatingSystem = "iOS";

            // Detect browser
            if (ua.Contains("chrome")) info.Browser = "Chrome";
            else if (ua.Contains("firefox")) info.Browser = "Firefox";
            else if (ua.Contains("safari")) info.Browser = "Safari";
            else if (ua.Contains("edge")) info.Browser = "Edge";
        }

        return info;
    }

    /// <summary>
    /// Checks for suspicious session activity
    /// </summary>
    public async Task<bool> IsSuspiciousSessionActivityAsync(Guid userId, string ipAddress, string? userAgent = null,
        string? locationInfo = null, CancellationToken cancellationToken = default)
    {
        try
        {
            // Get recent sessions for comparison
            var recentSessions = await _unitOfWork.UserSessions.GetRecentSessionsAsync(userId, 30, cancellationToken);

            if (!recentSessions.Any())
                return false; // First session, not suspicious

            // Check for new IP address
            var knownIpAddresses = recentSessions.Select(s => s.IpAddress).Distinct().ToList();
            if (!knownIpAddresses.Contains(ipAddress))
            {
                _logger.LogInformation("New IP address detected for user {UserId}: {IpAddress}", userId, ipAddress);
                return true;
            }

            // Check for unusual user agent
            if (!string.IsNullOrEmpty(userAgent))
            {
                var knownUserAgents = recentSessions
                    .Where(s => !string.IsNullOrEmpty(s.UserAgent))
                    .Select(s => s.UserAgent)
                    .Distinct()
                    .ToList();

                var browserFamily = ExtractBrowserFamily(userAgent);
                var knownBrowsers = knownUserAgents.Select(ExtractBrowserFamily).Distinct().ToList();

                if (!knownBrowsers.Contains(browserFamily))
                {
                    _logger.LogInformation("New browser detected for user {UserId}: {Browser}", userId, browserFamily);
                    return true;
                }
            }

            // Check for unusual location (if available)
            if (!string.IsNullOrEmpty(locationInfo))
            {
                var knownLocations = recentSessions
                    .Where(s => !string.IsNullOrEmpty(s.Location))
                    .Select(s => s.Location)
                    .Distinct()
                    .ToList();

                if (!knownLocations.Any(loc => loc!.Contains(ExtractCountryFromLocation(locationInfo))))
                {
                    _logger.LogInformation("New location detected for user {UserId}: {Location}", userId, locationInfo);
                    return true;
                }
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking suspicious session activity for user {UserId}", userId);
            return false; // Default to not suspicious on error
        }
    }

    /// <summary>
    /// Gets session statistics for a user
    /// </summary>
    public async Task<SessionStatistics> GetSessionStatisticsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var allSessions = await _unitOfWork.UserSessions.GetUserSessionsAsync(userId, 1, 1000, cancellationToken);
            var sessions = allSessions.sessions;
            var activeSessions = sessions.Where(s => s.IsActive && s.ExpiresAt > DateTime.UtcNow).ToList();
            var expiredSessions = sessions.Where(s => !s.IsActive || s.ExpiresAt <= DateTime.UtcNow).ToList();

            var suspiciousCount = 0;
            var recentLocations = new List<string>();
            var recentDevices = new List<string>();
            var locationBreakdown = new Dictionary<string, int>();
            var deviceBreakdown = new Dictionary<string, int>();

            foreach (var session in sessions.Take(50)) // Last 50 sessions for analysis
            {
                if (await EvaluateSessionSuspiciousness(session, cancellationToken))
                    suspiciousCount++;

                if (!string.IsNullOrEmpty(session.Location) && session.Location != "Unknown")
                {
                    recentLocations.Add(session.Location);
                    var country = ExtractCountryFromLocation(session.Location);
                    locationBreakdown[country] = locationBreakdown.GetValueOrDefault(country, 0) + 1;
                }

                var deviceInfo = ParseStoredDeviceInfo(session.DeviceInfo);
                var deviceKey = $"{deviceInfo.DeviceType} - {deviceInfo.OperatingSystem}";
                recentDevices.Add(deviceKey);
                deviceBreakdown[deviceKey] = deviceBreakdown.GetValueOrDefault(deviceKey, 0) + 1;
            }

            var lastSession = sessions.OrderByDescending(s => s.CreatedAt).FirstOrDefault();

            return new SessionStatistics
            {
                TotalSessions = sessions.Count,
                ActiveSessions = activeSessions.Count,
                ExpiredSessions = expiredSessions.Count,
                SuspiciousSessions = suspiciousCount,
                LastLoginAt = lastSession?.CreatedAt,
                LastLoginLocation = lastSession?.Location,
                LastLoginDevice = lastSession != null ? ParseStoredDeviceInfo(lastSession.DeviceInfo).DeviceType : null,
                RecentLocations = recentLocations.Distinct().Take(10).ToList(),
                RecentDevices = recentDevices.Distinct().Take(10).ToList(),
                LocationBreakdown = locationBreakdown,
                DeviceBreakdown = deviceBreakdown
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting session statistics for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Cleans up expired sessions
    /// </summary>
    public async Task<int> CleanupExpiredSessionsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var cleanedUp = await _unitOfWork.UserSessions.CleanupExpiredSessionsAsync(cancellationToken);

            _logger.LogInformation("Cleaned up {Count} expired sessions", cleanedUp);

            return cleanedUp;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning up expired sessions");
            throw;
        }
    }

    /// <summary>
    /// Gets concurrent session count for a user
    /// </summary>
    public async Task<int> GetConcurrentSessionCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var activeSessions = await _unitOfWork.UserSessions.GetActiveSessionsAsync(userId, cancellationToken);
            return activeSessions.Count();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting concurrent session count for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Enforces concurrent session limits by terminating oldest sessions
    /// </summary>
    public async Task<List<UserSession>> EnforceConcurrentSessionLimitAsync(Guid userId, int maxSessions,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var activeSessions = await _unitOfWork.UserSessions.GetActiveSessionsAsync(userId, cancellationToken);
            var sessionsList = activeSessions.OrderBy(s => s.LastAccessedAt ?? s.CreatedAt).ToList();

            var terminatedSessions = new List<UserSession>();

            if (sessionsList.Count >= maxSessions)
            {
                var sessionsToTerminate = sessionsList.Take(sessionsList.Count - maxSessions + 1).ToList();

                foreach (var session in sessionsToTerminate)
                {
                    session.IsActive = false;
                    session.UpdatedAt = DateTime.UtcNow;
                    await _unitOfWork.UserSessions.UpdateAsync(session, cancellationToken);
                    terminatedSessions.Add(session);
                }

                _logger.LogInformation("Terminated {Count} sessions for user {UserId} due to concurrent session limit",
                    sessionsToTerminate.Count, userId);
            }

            return terminatedSessions;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enforcing concurrent session limit for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Sends security alert for suspicious session activity
    /// </summary>
    public async Task SendSessionSecurityAlertAsync(Guid userId, SessionInfo sessionInfo, string alertType,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user == null) return;

            var securitySettings = await _unitOfWork.UserSecuritySettings.GetUserSecuritySettingsAsync(userId, cancellationToken);

            if (!securitySettings.SendSecurityAlerts) return;

            var subject = $"Security Alert: {alertType}";
            var body = $@"
                <h2>Security Alert</h2>
                <p>We detected {alertType.ToLower()} activity on your account:</p>
                <ul>
                    <li><strong>Time:</strong> {sessionInfo.CreatedAt:yyyy-MM-dd HH:mm:ss} UTC</li>
                    <li><strong>Location:</strong> {sessionInfo.Location}</li>
                    <li><strong>IP Address:</strong> {sessionInfo.IpAddress}</li>
                    <li><strong>Device:</strong> {sessionInfo.Device}</li>
                    <li><strong>Browser:</strong> {sessionInfo.Browser}</li>
                </ul>
                <p>If this was you, you can ignore this message. If not, please secure your account immediately.</p>
            ";

            await _emailService.SendEmailAsync(user.Email!, subject, body, cancellationToken);

            _logger.LogInformation("Security alert sent to user {UserId} for {AlertType}", userId, alertType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending security alert to user {UserId}", userId);
        }
    }

    private static DeviceInfo ParseStoredDeviceInfo(string? deviceInfoJson)
    {
        if (string.IsNullOrEmpty(deviceInfoJson))
            return new DeviceInfo();

        try
        {
            return JsonSerializer.Deserialize<DeviceInfo>(deviceInfoJson) ?? new DeviceInfo();
        }
        catch
        {
            return new DeviceInfo();
        }
    }

    private async Task<bool> EvaluateSessionSuspiciousness(UserSession session, CancellationToken cancellationToken)
    {
        // Simple suspiciousness evaluation - can be enhanced with ML models
        try
        {
            var recentSessions = await _unitOfWork.UserSessions.GetRecentSessionsAsync(session.UserId, 10, cancellationToken);
            var otherSessions = recentSessions.Where(s => s.Id != session.Id).ToList();

            if (!otherSessions.Any()) return false;

            // Check for unusual IP
            var knownIps = otherSessions.Select(s => s.IpAddress).Distinct().ToList();
            if (!knownIps.Contains(session.IpAddress)) return true;

            // Check for unusual location
            var knownLocations = otherSessions.Where(s => !string.IsNullOrEmpty(s.Location))
                .Select(s => ExtractCountryFromLocation(s.Location!)).Distinct().ToList();
            var sessionCountry = ExtractCountryFromLocation(session.Location ?? "");

            if (!string.IsNullOrEmpty(sessionCountry) && !knownLocations.Contains(sessionCountry)) return true;

            return false;
        }
        catch
        {
            return false;
        }
    }

    private static int CalculateActivityScore(UserSession session)
    {
        // Simple activity score calculation
        var daysSinceCreated = (DateTime.UtcNow - session.CreatedAt).TotalDays;
        var daysSinceLastActivity = (DateTime.UtcNow - (session.LastAccessedAt ?? session.CreatedAt)).TotalDays;

        var score = 100;
        score -= (int)(daysSinceLastActivity * 10); // Reduce score for inactivity
        score = Math.Max(0, Math.Min(100, score));

        return score;
    }

    private static string ExtractBrowserFamily(string userAgent)
    {
        var ua = userAgent.ToLower();
        if (ua.Contains("chrome")) return "Chrome";
        if (ua.Contains("firefox")) return "Firefox";
        if (ua.Contains("safari")) return "Safari";
        if (ua.Contains("edge")) return "Edge";
        return "Other";
    }

    private static string ExtractCountryFromLocation(string location)
    {
        // Simplified country extraction - in production, use proper geolocation parsing
        if (string.IsNullOrEmpty(location) || location == "Unknown") return "";

        var parts = location.Split(',');
        return parts.LastOrDefault()?.Trim() ?? "";
    }

    #endregion
}

/// <summary>
/// Device information model
/// </summary>
public class DeviceInfo
{
    public string DeviceType { get; set; } = "Unknown";
    public string OperatingSystem { get; set; } = "Unknown";
    public string Browser { get; set; } = "Unknown";
}
