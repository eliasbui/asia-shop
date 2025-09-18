#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

[Table("UserLogins")]
public class UserLogin : IdentityUserLogin<Guid>, IBaseEntity
{
    public new Guid Id { get; } = Guid.CreateVersion7();
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}