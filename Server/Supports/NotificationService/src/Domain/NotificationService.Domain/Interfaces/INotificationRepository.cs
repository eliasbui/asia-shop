#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using NotificationService.Domain.Entities;
using System.Linq.Expressions;

namespace NotificationService.Domain.Interfaces;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Notification>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<IEnumerable<Notification>> FindAsync(Expression<Func<Notification, bool>> predicate,
        CancellationToken cancellationToken = default);

    Task<Notification> CreateAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<Notification> UpdateAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);

    Task<long> CountAsync(Expression<Func<Notification, bool>>? predicate = null,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Notification>> GetPendingNotificationsAsync(int limit = 100,
        CancellationToken cancellationToken = default);
}

public interface INotificationTemplateRepository
{
    Task<NotificationTemplate?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<NotificationTemplate?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<IEnumerable<NotificationTemplate>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<NotificationTemplate> CreateAsync(NotificationTemplate template,
        CancellationToken cancellationToken = default);

    Task<NotificationTemplate> UpdateAsync(NotificationTemplate template,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}