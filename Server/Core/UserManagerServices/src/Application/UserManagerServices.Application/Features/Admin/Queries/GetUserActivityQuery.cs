using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Admin.Queries;

/// <summary>
/// Query for getting user activity logs
/// </summary>
public class GetUserActivityQuery : IRequest<BaseResponse<UserActivityResponse>>
{
    /// <summary>
    /// User ID whose activity to retrieve
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// ID of the user making the request
    /// </summary>
    public Guid RequestingUserId { get; set; }

    /// <summary>
    /// Whether this is an admin request
    /// </summary>
    public bool IsAdminRequest { get; set; }

    /// <summary>
    /// Page number for pagination
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Page size for pagination
    /// </summary>
    public int PageSize { get; set; } = 20;

    /// <summary>
    /// Filter by action type
    /// </summary>
    public string? Action { get; set; }

    /// <summary>
    /// Filter by start date
    /// </summary>
    public DateTime? StartDate { get; set; }

    /// <summary>
    /// Filter by end date
    /// </summary>
    public DateTime? EndDate { get; set; }
}