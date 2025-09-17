using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

public class UserNotificationSetting : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string NotificationType { get; set; } = null!;
    public string Channel { get; set; } = null!;
    public bool IsEnabled { get; set; } = true;
    [Column(TypeName = "jsonb")] public string Settings { get; set; } = null!;
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}