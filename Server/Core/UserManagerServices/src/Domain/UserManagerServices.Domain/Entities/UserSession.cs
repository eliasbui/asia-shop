using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

[Table("UserSessions")]
public class UserSession : IBaseEntity
{
    public new Guid Id { get; } = Guid.CreateVersion7();

    //one user have many sessions
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public string SessionToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;

    public string? OperatingSystem { get; set; } = null!;

    public string? Browser { get; set; } = null!;

    public string? Location { get; set; } = null!;

    [Column(TypeName = "jsonb")] public string DeviceInfo { get; set; } = null!;

    public string IpAddress { get; set; } = null!;
    public string UserAgent { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(15);
    public DateTime? LastAccessedAt { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}