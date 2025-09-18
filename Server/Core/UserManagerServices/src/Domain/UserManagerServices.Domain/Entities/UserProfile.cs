#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

[Table("UserProfiles")]
public class UserProfile : IBaseEntity
{
    public new Guid Id { get; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public string? Address { get; set; } = null!;

    public string? PostalCode { get; set; }
    public string? City { get; set; } = null!;
    public string? Country { get; set; } = null!;
    public string? Province { get; set; } = null!;
    public string? State { get; set; } = null!;
    public string? District { get; set; } = null!;

    public string? TimeZone { get; set; } = "UTC";
    public string? Language { get; set; } = "en";

    //preferences jsonb
    [Column(TypeName = "jsonb")] public string? Preferences { get; set; } = null!;

    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}