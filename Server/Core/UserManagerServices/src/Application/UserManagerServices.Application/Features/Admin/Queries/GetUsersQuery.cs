using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Responses;

namespace UserManagerServices.Application.Features.Admin.Queries;

/// <summary>
/// Query for getting users with filtering and pagination
/// </summary>
public class GetUsersQuery : IRequest<BaseResponse<UsersResponse>>
{
    /// <summary>
    /// Page number for pagination
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Page size for pagination
    /// </summary>
    public int PageSize { get; set; } = 20;

    /// <summary>
    /// Search term for filtering users
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Filter by active status
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Filter by roles
    /// </summary>
    public List<string>? Roles { get; set; }

    /// <summary>
    /// ID of the user making the request
    /// </summary>
    public Guid RequestingUserId { get; set; }
}
