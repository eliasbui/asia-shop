#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

[Table("UserApiKeys")]
public class UserApiKey : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public string KeyName { get; set; } = null!;
    public string KeyValue { get; set; } = null!;

    public bool IsActive { get; set; } = true;

    [Column(TypeName = "jsonb")] public string Permissions { get; set; } = null!;

    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddYears(1);
    public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
    public int RequestLimit { get; set; } = 1000;
    public int RequestCount { get; set; } = 0;

    [Column(TypeName = "jsonb")] public string? IpWhitelist { get; set; } = null!;
    [Column(TypeName = "jsonb")] public string[]? IpBlacklist { get; set; } = null!;

    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}