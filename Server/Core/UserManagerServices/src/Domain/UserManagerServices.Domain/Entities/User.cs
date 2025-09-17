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
    
    public GenderEnum? Gender { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public string? Address { get; set; } = null!;
    
    public string? PostalCode { get; set; } 
    public string? City { get; set; } = null!;
    public string? Country { get; set; } = null!;
    public string? Province { get; set; } = null!;
    public string? Ward { get; set; } = null!;

    //CORE PROPERTIES
    public override Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public bool IsDeleted { get; private set; }
}