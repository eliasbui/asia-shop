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
    public DateTime? UpdatedAt { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public bool IsDeleted { get; private set; }

    public virtual List<UserProfile> UserProfiles { get; set; } = null!;
    public virtual List<UserRole> UserRoles { get; set; } = null!;
    public virtual List<UserClaim> UserClaims { get; set; } = null!;
    public virtual List<UserLogin> UserLogins { get; set; } = null!;
    public virtual List<UserToken> UserTokens { get; set; } = null!;
    public virtual List<UserSession> UserSessions { get; set; } = null!;
    public virtual List<UserActivityLog> UserActivityLogs { get; set; } = null!;
    public virtual List<UserApiKey> UserApiKeys { get; set; } = null!;
    public virtual List<UserPreference> UserPreferences { get; set; } = null!;
    public virtual List<UserNotificationSetting> UserNotificationSettings { get; set; } = null!;
}