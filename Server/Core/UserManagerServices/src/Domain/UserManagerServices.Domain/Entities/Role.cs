#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

[Table("Roles")]
public class Role : IdentityRole<Guid>, IBaseEntity
{
    public override Guid Id { get; set; } = Guid.CreateVersion7();

    //BUSINESS PROPERTIES CUSTOMIZE
    public string Description { get; set; } = null!;

    public bool IsActive { get; set; } = true;

    public bool IsSystemRole { get; set; } = false;


    //CORE PROPERTIES
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}