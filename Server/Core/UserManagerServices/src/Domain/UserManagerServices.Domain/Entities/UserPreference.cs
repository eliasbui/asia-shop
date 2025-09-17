using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

[Table("UserPreferences")]
public class UserPreference : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public string Category { get; set; } = null!;
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public string DataType { get; set; } = null!;
    
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}