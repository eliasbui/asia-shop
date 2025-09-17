using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Queries;
using UserManagerServices.Application.Features.Admin.Responses;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for getting roles with pagination
/// </summary>
public class GetRolesQueryHandler(
    RoleManager<Role> roleManager,
    ILogger<GetRolesQueryHandler> logger) : IRequestHandler<GetRolesQuery, BaseResponse<RolesResponse>>
{
    /// <summary>
    /// Handles the get roles query
    /// </summary>
    /// <param name="request">Get roles query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Roles list with pagination</returns>
    public async Task<BaseResponse<RolesResponse>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting roles list (requested by: {RequestingUserId})", request.RequestingUserId);

            // Build query with filters
            var query = roleManager.Roles.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(r =>
                    r.Name!.ToLower().Contains(searchTerm) ||
                    (r.Description.ToLower().Contains(searchTerm)));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination
            var roles = await query
                .OrderBy(r => r.Name)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to response model
            var roleInfos = roles.Select(role => new RoleInfo
            {
                Id = role.Id,
                Name = role.Name ?? string.Empty,
                Description = role.Description,
                IsActive = role.IsActive,
                CreatedAt = role.CreatedAt,
                UpdatedAt = role.UpdatedAt,
                UserCount = 0 // This would require a separate query to get user count per role
            }).ToList();

            // Calculate pagination info
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);
            var paginationInfo = new PaginationInfo
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalItems = totalCount,
                TotalPages = totalPages,
                HasPreviousPage = request.PageNumber > 1,
                HasNextPage = request.PageNumber < totalPages
            };

            var response = new RolesResponse
            {
                Roles = roleInfos,
                Pagination = paginationInfo,
                SearchTerm = request.SearchTerm
            };

            logger.LogInformation("Successfully retrieved {Count} roles (page {PageNumber}/{TotalPages})",
                roleInfos.Count, request.PageNumber, totalPages);

            return BaseResponse<RolesResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting roles list");
            return BaseResponse<RolesResponse>.Failure("An error occurred while retrieving roles. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}