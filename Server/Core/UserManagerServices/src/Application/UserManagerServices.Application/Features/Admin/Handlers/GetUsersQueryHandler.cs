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
/// Handler for getting users with filtering and pagination
/// </summary>
public class GetUsersQueryHandler(
    UserManager<User> userManager,
    ILogger<GetUsersQueryHandler> logger) : IRequestHandler<GetUsersQuery, BaseResponse<UsersResponse>>
{
    /// <summary>
    /// Handles the get users query
    /// </summary>
    /// <param name="request">Get users query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Users list with pagination</returns>
    public async Task<BaseResponse<UsersResponse>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting users list (requested by: {RequestingUserId})", request.RequestingUserId);

            // Build query with filters
            var query = userManager.Users.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(u =>
                    u.Email!.ToLower().Contains(searchTerm) ||
                    u.FirstName!.ToLower().Contains(searchTerm) ||
                    u.LastName!.ToLower().Contains(searchTerm) ||
                    (u.FirstName + " " + u.LastName).ToLower().Contains(searchTerm));
            }

            // Apply active status filter
            if (request.IsActive.HasValue)
            {
                query = query.Where(u => u.IsActive == request.IsActive.Value);
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination
            var users = await query
                .OrderBy(u => u.Email)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to response model
            var userInfos = new List<UserInfo>();
            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var isLockedOut = await userManager.IsLockedOutAsync(user);

                userInfos.Add(new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = $"{user.FirstName} {user.LastName}".Trim(),
                    PhoneNumber = user.PhoneNumber,
                    IsActive = user.IsActive,
                    EmailConfirmed = user.EmailConfirmed,
                    PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                    TwoFactorEnabled = user.TwoFactorEnabled,
                    Roles = roles.ToList(),
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    LastLoginAt = user.LastLoginAt,
                    IsLockedOut = isLockedOut,
                    LockoutEnd = user.LockoutEnd
                });
            }

            // Apply role filter after mapping (since roles are loaded separately)
            if (request.Roles?.Any() == true)
            {
                userInfos = userInfos.Where(u => request.Roles.Any(role =>
                    u.Roles.Contains(role, StringComparer.OrdinalIgnoreCase))).ToList();
                totalCount = userInfos.Count;
            }

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

            var filterInfo = new FilterInfo
            {
                SearchTerm = request.SearchTerm,
                IsActive = request.IsActive,
                Roles = request.Roles
            };

            var response = new UsersResponse
            {
                Users = userInfos,
                Pagination = paginationInfo,
                Filters = filterInfo
            };

            logger.LogInformation("Successfully retrieved {Count} users (page {PageNumber}/{TotalPages})",
                userInfos.Count, request.PageNumber, totalPages);

            return BaseResponse<UsersResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting users list");
            return BaseResponse<UsersResponse>.Failure("An error occurred while retrieving users. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}