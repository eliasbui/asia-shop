using Microsoft.AspNetCore.Identity;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

public class UserClaim : IdentityUserClaim<Guid> ,IBaseEntity
{
    public Guid Id { get; }
    public DateTime CreatedAt { get; }
    public DateTime? UpdatedAt { get; }
    public Guid? CreatedBy { get; }
    public Guid? UpdatedBy { get; }
    public bool IsDeleted { get; }
}