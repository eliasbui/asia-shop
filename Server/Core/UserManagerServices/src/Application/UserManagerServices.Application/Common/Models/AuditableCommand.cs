using UserManagerServices.Application.Common.Abstractions;

namespace UserManagerServices.Application.Common.Models;

/// <summary>
/// Base class for commands that require audit information
/// Automatically captures user context for audit trails
/// </summary>
public abstract class AuditableCommand : ICommand
{
    /// <summary>
    /// User ID performing the operation (set by authentication middleware)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// IP address of the user performing the operation
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent of the client performing the operation
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Timestamp when the command was created
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Base class for commands that require audit information and return data
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class AuditableCommand<TResponse> : ICommand<TResponse>
{
    /// <summary>
    /// User ID performing the operation (set by authentication middleware)
    /// </summary>
    public Guid? UserId { get; set; }

    /// <summary>
    /// IP address of the user performing the operation
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent of the client performing the operation
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Timestamp when the command was created
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Base class for entity creation commands
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class CreateCommand<TResponse> : AuditableCommand<TResponse>
{
}

/// <summary>
/// Base class for entity update commands
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class UpdateCommand<TResponse> : AuditableCommand<TResponse>
{
    /// <summary>
    /// ID of the entity to update
    /// </summary>
    public Guid Id { get; set; }
}

/// <summary>
/// Base class for entity deletion commands
/// </summary>
public abstract class DeleteCommand : AuditableCommand
{
    /// <summary>
    /// ID of the entity to delete
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Whether to perform hard delete (true) or soft delete (false)
    /// </summary>
    public bool HardDelete { get; set; } = false;
}

/// <summary>
/// Base class for bulk operation commands
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class BulkCommand<TResponse> : AuditableCommand<TResponse>
{
    /// <summary>
    /// Collection of IDs to process
    /// </summary>
    public IEnumerable<Guid> Ids { get; set; } = new List<Guid>();
}
