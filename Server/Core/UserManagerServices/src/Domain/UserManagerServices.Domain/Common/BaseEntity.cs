#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

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