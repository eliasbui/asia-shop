using UserManagerServices.Application.Common.Abstractions;

namespace UserManagerServices.Application.Common.Models;

/// <summary>
/// Base class for queries that retrieve a single entity by ID
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class GetByIdQuery<TResponse> : IQuery<TResponse>
{
    /// <summary>
    /// ID of the entity to retrieve
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Initializes a new instance of GetByIdQuery
    /// </summary>
    /// <param name="id">Entity ID</param>
    protected GetByIdQuery(Guid id)
    {
        Id = id;
    }
}

/// <summary>
/// Base class for paginated list queries
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class GetListQuery<TResponse> : PaginatedRequest, IQuery<PaginatedResponse<TResponse>>
{
    /// <summary>
    /// Initializes a new instance of GetListQuery
    /// </summary>
    protected GetListQuery()
    {
        ValidatePagination();
    }
}

/// <summary>
/// Base class for filtered list queries
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class GetFilteredListQuery<TResponse> : GetListQuery<TResponse>
{
    /// <summary>
    /// Start date for date range filtering
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// End date for date range filtering
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Filter by active status
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Additional filter parameters as key-value pairs
    /// </summary>
    public Dictionary<string, object> Filters { get; set; } = new Dictionary<string, object>();
}

/// <summary>
/// Base class for search queries
/// </summary>
/// <typeparam name="TResponse">Response data type</typeparam>
public abstract class SearchQuery<TResponse> : GetFilteredListQuery<TResponse>
{
    /// <summary>
    /// Minimum length required for search term
    /// </summary>
    public virtual int MinSearchLength => 2;

    /// <summary>
    /// Validates search parameters
    /// </summary>
    public virtual bool IsValidSearch()
    {
        return !string.IsNullOrWhiteSpace(SearchTerm) && SearchTerm.Length >= MinSearchLength;
    }
}

/// <summary>
/// Base class for count queries
/// </summary>
public abstract class GetCountQuery : IQuery<int>
{
    /// <summary>
    /// Filter parameters for counting
    /// </summary>
    public Dictionary<string, object> Filters { get; set; } = new Dictionary<string, object>();
}

/// <summary>
/// Base class for existence check queries
/// </summary>
public abstract class ExistsQuery : IQuery<bool>
{
    /// <summary>
    /// ID to check for existence
    /// </summary>
    public Guid? Id { get; set; }

    /// <summary>
    /// Additional criteria for existence check
    /// </summary>
    public Dictionary<string, object> Criteria { get; set; } = new Dictionary<string, object>();
}

/// <summary>
/// Base class for statistics queries
/// </summary>
/// <typeparam name="TResponse">Statistics response type</typeparam>
public abstract class GetStatisticsQuery<TResponse> : IQuery<TResponse>
{
    /// <summary>
    /// Start date for statistics period
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// End date for statistics period
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Grouping period (daily, weekly, monthly)
    /// </summary>
    public string? GroupBy { get; set; }

    /// <summary>
    /// Additional parameters for statistics calculation
    /// </summary>
    public Dictionary<string, object> Parameters { get; set; } = new Dictionary<string, object>();
}
