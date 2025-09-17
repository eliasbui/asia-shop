using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UserManagerServices.API.Common;
using UserManagerServices.Application.Features.Admin.Commands;
using UserManagerServices.Application.Features.Admin.Queries;
using UserManagerServices.Application.Features.Admin.Responses;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.API.Endpoints;

/// <summary>
/// Admin endpoints for user management system
/// </summary>
public static class AdminEndpoints
{
    /// <summary>
    /// Maps admin endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application with mapped endpoints</returns>
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var adminGroup = app.MapGroup("/api/v1/admin")
            .WithTags("Admin")
            .RequireAuthorization("AdminPolicy");

        // GET /api/v1/admin/users/{userId}/activity
        adminGroup.MapGet("/users/{userId:guid}/activity", GetUserActivityByAdminAsync)
            .WithName("GetUserActivityByAdmin")
            .WithSummary("Get user activity logs (Admin)")
            .WithDescription("Gets a specific user's activity logs with pagination (Admin only)")
            .Produces<UserActivityResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get user activity logs (Admin)",
                Description = "Gets a specific user's activity logs with pagination (Admin only)",
                Responses = new()
                {
                    ["200"] = new() { Description = "User activity logs retrieved successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // GET /api/v1/admin/users
        adminGroup.MapGet("/users", GetUsersAsync)
            .WithName("GetUsers")
            .WithSummary("Get users (Admin)")
            .WithDescription("Gets users with filtering and pagination (Admin only)")
            .Produces<UsersResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get users (Admin)",
                Description = "Gets users with filtering and pagination (Admin only)",
                Responses = new()
                {
                    ["200"] = new() { Description = "Users retrieved successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/admin/users
        adminGroup.MapPost("/users", CreateUserAsync)
            .WithName("CreateUser")
            .WithSummary("Create user (Admin)")
            .WithDescription("Creates a new user (Admin only)")
            .Accepts<CreateUserCommand>("application/json")
            .Produces<UserResponse>(201, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Create user (Admin)",
                Description = "Creates a new user (Admin only)",
                Responses = new()
                {
                    ["201"] = new() { Description = "User created successfully" },
                    ["400"] = new() { Description = "Invalid input or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/admin/users/{userId}
        adminGroup.MapPut("/users/{userId:guid}", UpdateUserAsync)
            .WithName("UpdateUser")
            .WithSummary("Update user (Admin)")
            .WithDescription("Updates a user (Admin only)")
            .Accepts<UpdateUserCommand>("application/json")
            .Produces<UserResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Update user (Admin)",
                Description = "Updates a user (Admin only)",
                Responses = new()
                {
                    ["200"] = new() { Description = "User updated successfully" },
                    ["400"] = new() { Description = "Invalid input or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // DELETE /api/v1/admin/users/{userId}
        adminGroup.MapDelete("/users/{userId:guid}", DeleteUserAsync)
            .WithName("DeleteUser")
            .WithSummary("Delete user (Admin)")
            .WithDescription("Deletes a user (Admin only)")
            .Produces(204)
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Delete user (Admin)",
                Description = "Deletes a user (Admin only)",
                Responses = new()
                {
                    ["204"] = new() { Description = "User deleted successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/admin/users/{userId}/lock
        adminGroup.MapPut("/users/{userId:guid}/lock", LockUserAsync)
            .WithName("LockUser")
            .WithSummary("Lock user account (Admin)")
            .WithDescription("Locks a user account (Admin only)")
            .Accepts<LockUserCommand>("application/json")
            .Produces(204)
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Lock user account (Admin)",
                Description = "Locks a user account (Admin only)",
                Responses = new()
                {
                    ["204"] = new() { Description = "User account locked successfully" },
                    ["400"] = new() { Description = "Invalid input or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/admin/users/{userId}/unlock
        adminGroup.MapPut("/users/{userId:guid}/unlock", UnlockUserAsync)
            .WithName("UnlockUser")
            .WithSummary("Unlock user account (Admin)")
            .WithDescription("Unlocks a user account (Admin only)")
            .Produces(204)
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Unlock user account (Admin)",
                Description = "Unlocks a user account (Admin only)",
                Responses = new()
                {
                    ["204"] = new() { Description = "User account unlocked successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/admin/users/{userId}/roles
        adminGroup.MapPost("/users/{userId:guid}/roles", AssignRoleToUserAsync)
            .WithName("AssignRoleToUser")
            .WithSummary("Assign role to user (Admin)")
            .WithDescription("Assigns a role to a user (Admin only)")
            .Accepts<AssignRoleCommand>("application/json")
            .Produces(204)
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Assign role to user (Admin)",
                Description = "Assigns a role to a user (Admin only)",
                Responses = new()
                {
                    ["204"] = new() { Description = "Role assigned successfully" },
                    ["400"] = new() { Description = "Invalid input or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User or role not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // DELETE /api/v1/admin/users/{userId}/roles/{roleName}
        adminGroup.MapDelete("/users/{userId:guid}/roles/{roleName}", RemoveRoleFromUserAsync)
            .WithName("RemoveRoleFromUser")
            .WithSummary("Remove role from user (Admin)")
            .WithDescription("Removes a role from a user (Admin only)")
            .Produces(204)
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Remove role from user (Admin)",
                Description = "Removes a role from a user (Admin only)",
                Responses = new()
                {
                    ["204"] = new() { Description = "Role removed successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "User or role not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // GET /api/v1/admin/roles
        adminGroup.MapGet("/roles", GetRolesAsync)
            .WithName("GetRoles")
            .WithSummary("Get roles (Admin)")
            .WithDescription("Gets all roles with pagination (Admin only)")
            .Produces<RolesResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get roles (Admin)",
                Description = "Gets all roles with pagination (Admin only)",
                Responses = new()
                {
                    ["200"] = new() { Description = "Roles retrieved successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/admin/roles
        adminGroup.MapPost("/roles", CreateRoleAsync)
            .WithName("CreateRole")
            .WithSummary("Create role (Admin)")
            .WithDescription("Creates a new role (Admin only)")
            .Accepts<CreateRoleCommand>("application/json")
            .Produces<RoleResponse>(201, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Create role (Admin)",
                Description = "Creates a new role (Admin only)",
                Responses = new()
                {
                    ["201"] = new() { Description = "Role created successfully" },
                    ["400"] = new() { Description = "Invalid input or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/admin/roles/{roleId}
        adminGroup.MapPut("/roles/{roleId:guid}", UpdateRoleAsync)
            .WithName("UpdateRole")
            .WithSummary("Update role (Admin)")
            .WithDescription("Updates a role (Admin only)")
            .Accepts<UpdateRoleCommand>("application/json")
            .Produces<RoleResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Update role (Admin)",
                Description = "Updates a role (Admin only)",
                Responses = new()
                {
                    ["200"] = new() { Description = "Role updated successfully" },
                    ["400"] = new() { Description = "Invalid input or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "Role not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // DELETE /api/v1/admin/roles/{roleId}
        adminGroup.MapDelete("/roles/{roleId:guid}", DeleteRoleAsync)
            .WithName("DeleteRole")
            .WithSummary("Delete role (Admin)")
            .WithDescription("Deletes a role (Admin only)")
            .Produces(204)
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(403, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Delete role (Admin)",
                Description = "Deletes a role (Admin only)",
                Responses = new()
                {
                    ["204"] = new() { Description = "Role deleted successfully" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["403"] = new() { Description = "User not authorized (Admin required)" },
                    ["404"] = new() { Description = "Role not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });
    }

    /// <summary>
    /// Gets user activity logs by admin
    /// </summary>
    /// <param name="userId">User ID to get activity for</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="action">Filter by action type</param>
    /// <param name="startDate">Filter by start date</param>
    /// <param name="endDate">Filter by end date</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User activity logs</returns>
    private static async Task<IResult> GetUserActivityByAdminAsync(
        Guid userId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? action = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        ClaimsPrincipal user = default!,
        [FromServices] ISender mediator = default!,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var query = new GetUserActivityQuery
        {
            UserId = userId,
            RequestingUserId = adminUserId.Value,
            IsAdminRequest = true,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Action = action,
            StartDate = startDate,
            EndDate = endDate
        };

        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets users with filtering and pagination
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="searchTerm">Search term</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="roles">Filter by roles</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Users list</returns>
    private static async Task<IResult> GetUsersAsync(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] string[]? roles = null,
        ClaimsPrincipal user = default!,
        [FromServices] ISender mediator = default!,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var query = new GetUsersQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            IsActive = isActive,
            Roles = roles?.ToList(),
            RequestingUserId = adminUserId.Value
        };

        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Creates a new user
    /// </summary>
    /// <param name="command">Create user command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created user</returns>
    private static async Task<IResult> CreateUserAsync(
        [FromBody] CreateUserCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        command.CreatedBy = adminUserId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Updates a user
    /// </summary>
    /// <param name="userId">User ID to update</param>
    /// <param name="command">Update user command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated user</returns>
    private static async Task<IResult> UpdateUserAsync(
        Guid userId,
        [FromBody] UpdateUserCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        command.UserId = userId;
        command.UpdatedBy = adminUserId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Deletes a user
    /// </summary>
    /// <param name="userId">User ID to delete</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> DeleteUserAsync(
        Guid userId,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var command = new DeleteUserCommand
        {
            UserId = userId,
            DeletedBy = adminUserId.Value
        };
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Locks a user account
    /// </summary>
    /// <param name="userId">User ID to lock</param>
    /// <param name="command">Lock user command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> LockUserAsync(
        Guid userId,
        [FromBody] LockUserCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        command.UserId = userId;
        command.LockedBy = adminUserId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Unlocks a user account
    /// </summary>
    /// <param name="userId">User ID to unlock</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> UnlockUserAsync(
        Guid userId,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var command = new UnlockUserCommand
        {
            UserId = userId,
            UnlockedBy = adminUserId.Value
        };
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Assigns a role to a user
    /// </summary>
    /// <param name="userId">User ID to assign role to</param>
    /// <param name="command">Assign role command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> AssignRoleToUserAsync(
        Guid userId,
        [FromBody] AssignRoleCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        command.UserId = userId;
        command.AssignedBy = adminUserId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Removes a role from a user
    /// </summary>
    /// <param name="userId">User ID to remove role from</param>
    /// <param name="roleName">Role name to remove</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> RemoveRoleFromUserAsync(
        Guid userId,
        string roleName,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var command = new RemoveRoleCommand
        {
            UserId = userId,
            RoleName = roleName,
            RemovedBy = adminUserId.Value
        };
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }


    private static async Task<IResult> GetRolesAsync(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        ClaimsPrincipal user = default!,
        [FromServices] ISender mediator = default!,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var query = new GetRolesQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            RequestingUserId = adminUserId.Value
        };

        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Creates a new role
    /// </summary>
    /// <param name="command">Create role command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created role</returns>
    private static async Task<IResult> CreateRoleAsync(
        [FromBody] CreateRoleCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        command.CreatedBy = adminUserId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    private static async Task<IResult> UpdateRoleAsync(
        Guid roleId,
        [FromBody] UpdateRoleCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        command.RoleId = roleId;
        command.UpdatedBy = adminUserId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    private static async Task<IResult> DeleteRoleAsync(
        Guid roleId,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var adminUserId = ApiHelpers.GetCurrentUserId(user);
        if (adminUserId == null)
        {
            return Results.Unauthorized();
        }

        var command = new DeleteRoleCommand
        {
            RoleId = roleId,
            DeletedBy = adminUserId.Value
        };
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }
}