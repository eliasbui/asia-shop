using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Entities;

[Table("Users")]
public class User : IdentityUser<Guid>, IBaseEntity
{
    //BUSINESS PROPERTIES CUSTOMIZE

    public string? FirstName { get; set; } = null!;

    public string? LastName { get; set; } = null!;

    public DateTime? DateOfBirth { get; set; }

    [Column(TypeName = "int")] public GenderEnum? Gender { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? LastLoginAt { get; set; }
    public DateTime? LastLogoutAt { get; set; }

    public string? LastLoginIp { get; set; } = null!;
    public string? LastLogoutIp { get; set; } = null!;


    //CORE PROPERTIES
    public override Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }

    public virtual List<UserProfile> UserProfiles { get; set; } = null!;
    public virtual List<UserRole> UserRoles { get; set; } = null!;
    public virtual List<UserClaim> UserClaims { get; set; } = null!;
    public virtual List<UserLogin> UserLogins { get; set; } = null!;
    public virtual List<UserToken> UserTokens { get; set; } = null!;
    public virtual List<UserSession> UserSessions { get; set; } = null!;
    public virtual List<UserActivityLog> UserActivityLogs { get; set; } = null!;
    public virtual List<UserApiKey> UserApiKeys { get; set; } = null!;
    public virtual List<UserPreference> UserPreferences { get; set; } = null!;
    public virtual List<UserMfaSettings> UserMfaSettings { get; set; } = null!;
    public virtual List<UserMfaBackupCode> UserMfaBackupCodes { get; set; } = null!;
    public virtual List<UserMfaAuditLog> UserMfaAuditLogs { get; set; } = null!;
    public virtual List<UserEmailOtp> UserEmailOtps { get; set; } = null!;
    public virtual List<UserLoginAttempt> UserLoginAttempts { get; set; } = null!;
    public virtual List<UserLockoutHistory> UserLockoutHistory { get; set; } = null!;
    public virtual UserSecuritySettings? UserSecuritySettings { get; set; }
    public virtual List<UserConsent> UserConsents { get; set; } = null!;
    public virtual UserNotificationSettings? NotificationSettings { get; set; }
}