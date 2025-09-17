namespace UserManagerServices.Domain.Common;

public interface IBaseEntity
{
    public Guid Id { get; }
    public DateTime CreatedAt { get; }
    public DateTime? UpdatedAt { get; }

    public Guid? CreatedBy { get; }
    public Guid? UpdatedBy { get; }

    public bool IsDeleted { get; }
    
}

