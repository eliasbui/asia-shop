using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Entities;

[Table("UserActivityLogs")]
public class UserActivityLog : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    [Column(TypeName = "int")] public ActionEnum Action { get; set; }

    public string? Entity { get; set; } = null!;
    public Guid? EntityId { get; set; }

    [Column(TypeName = "jsonb")] public string Details { get; set; } = null!;
    public string? IpAddress { get; set; } = null!;
    public string? UserAgent { get; set; } = null!;
    public DateTime? Timestamp { get; set; } = DateTime.UtcNow!;

    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}