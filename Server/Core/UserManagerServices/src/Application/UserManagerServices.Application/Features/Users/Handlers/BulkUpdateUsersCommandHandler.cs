using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Text.Json;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for bulk updating multiple users
/// </summary>
public class BulkUpdateUsersCommandHandler(
    UserManager<User> userManager,
    IUnitOfWork unitOfWork,
    ILogger<BulkUpdateUsersCommandHandler> logger,
    IEmailService emailService)
    : IRequestHandler<BulkUpdateUsersCommand, BaseResponse<BulkOperationResult>>
{
    public async Task<BaseResponse<BulkOperationResult>> Handle(BulkUpdateUsersCommand request,
        CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            logger.LogInformation(
                "Starting bulk update operation {Operation} for {Count} users by user {RequestingUserId}",
                request.Operation, request.UserIds.Count, request.RequestingUserId);

            var result = new BulkOperationResult
            {
                Operation = request.Operation,
                TotalTargeted = request.UserIds.Count
            };

            // Validate the requesting user has permission
            var requestingUser = await userManager.FindByIdAsync(request.RequestingUserId.ToString());
            if (requestingUser == null)
            {
                return BaseResponse<BulkOperationResult>.Failure("Requesting user not found",
                    new Dictionary<string, object> { ["errorCode"] = "REQUESTING_USER_NOT_FOUND" });
            }

            var requestingUserRoles = await userManager.GetRolesAsync(requestingUser);
            if (!requestingUserRoles.Contains("Admin") && !requestingUserRoles.Contains("UserManager"))
            {
                return BaseResponse<BulkOperationResult>.Failure("Insufficient permissions for bulk operations",
                    new Dictionary<string, object> { ["errorCode"] = "INSUFFICIENT_PERMISSIONS" });
            }

            // Process each user
            foreach (var userId in request.UserIds)
            {
                try
                {
                    var user = await userManager.FindByIdAsync(userId.ToString());
                    if (user == null)
                    {
                        result.Errors.Add(new BulkOperationError
                        {
                            UserId = userId,
                            ErrorMessage = "User not found",
                            ErrorCode = "USER_NOT_FOUND"
                        });
                        result.FailureCount++;
                        continue;
                    }

                    var operationResult = await PerformOperationAsync(user, request.Operation, request.UpdateValues,
                        cancellationToken);

                    if (operationResult.Success)
                    {
                        if (operationResult.WasSkipped)
                        {
                            result.SkippedUserIds.Add(userId);
                            result.SkippedCount++;
                        }
                        else
                        {
                            result.SuccessfulUserIds.Add(userId);
                            result.SuccessCount++;
                        }
                    }
                    else
                    {
                        result.Errors.Add(new BulkOperationError
                        {
                            UserId = userId,
                            ErrorMessage = operationResult.ErrorMessage,
                            ErrorCode = operationResult.ErrorCode,
                            Details = operationResult.Details
                        });
                        result.FailureCount++;
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error processing user {UserId} in bulk operation {Operation}", userId,
                        request.Operation);
                    result.Errors.Add(new BulkOperationError
                    {
                        UserId = userId,
                        ErrorMessage = ex.Message,
                        ErrorCode = "PROCESSING_ERROR"
                    });
                    result.FailureCount++;
                }
            }

            // Log the bulk operation
            await LogBulkOperationAsync(request, result, cancellationToken);

            stopwatch.Stop();
            result.Duration = stopwatch.Elapsed;

            logger.LogInformation(
                "Completed bulk update operation {Operation}. Success: {Success}, Failed: {Failed}, Skipped: {Skipped}",
                request.Operation, result.SuccessCount, result.FailureCount, result.SkippedCount);

            return BaseResponse<BulkOperationResult>.Success(result,
                $"Bulk operation completed. {result.SuccessCount} successful, {result.FailureCount} failed, {result.SkippedCount} skipped.");
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            logger.LogError(ex, "Error in bulk update operation {Operation}", request.Operation);
            return BaseResponse<BulkOperationResult>.Failure(
                "An error occurred during the bulk operation. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "BULK_OPERATION_ERROR",
                    ["operation"] = request.Operation.ToString()
                });
        }
    }

    private async Task<OperationResult> PerformOperationAsync(User user, BulkUpdateOperation operation,
        Dictionary<string, object> updateValues, CancellationToken cancellationToken)
    {
        try
        {
            switch (operation)
            {
                case BulkUpdateOperation.Activate:
                    if (user.IsActive)
                        return OperationResult.Skipped("User is already active");

                    user.IsActive = true;
                    user.UpdatedAt = DateTime.UtcNow;
                    var activateResult = await userManager.UpdateAsync(user);
                    return activateResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to activate user", "ACTIVATION_FAILED");

                case BulkUpdateOperation.Deactivate:
                    if (!user.IsActive)
                        return OperationResult.Skipped("User is already inactive");

                    user.IsActive = false;
                    user.UpdatedAt = DateTime.UtcNow;
                    var deactivateResult = await userManager.UpdateAsync(user);
                    return deactivateResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to deactivate user", "DEACTIVATION_FAILED");

                case BulkUpdateOperation.LockOut:
                    if (await userManager.IsLockedOutAsync(user))
                        return OperationResult.Skipped("User is already locked out");

                    var lockoutEnd = updateValues.ContainsKey("LockoutEnd") &&
                                     updateValues["LockoutEnd"] is DateTime lockoutDate
                        ? lockoutDate
                        : DateTime.UtcNow.AddDays(30);

                    var lockoutResult = await userManager.SetLockoutEndDateAsync(user, lockoutEnd);
                    return lockoutResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to lock out user", "LOCKOUT_FAILED");

                case BulkUpdateOperation.Unlock:
                    if (!await userManager.IsLockedOutAsync(user))
                        return OperationResult.Skipped("User is not locked out");

                    var unlockResult = await userManager.SetLockoutEndDateAsync(user, null);
                    return unlockResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to unlock user", "UNLOCK_FAILED");

                case BulkUpdateOperation.UpdateRoles:
                    if (!updateValues.ContainsKey("Roles") || updateValues["Roles"] is not List<string> newRoles)
                        return OperationResult.Failure("Roles not specified", "ROLES_NOT_SPECIFIED");

                    var currentRoles = await userManager.GetRolesAsync(user);
                    var rolesToRemove = currentRoles.Except(newRoles).ToList();
                    var rolesToAdd = newRoles.Except(currentRoles).ToList();

                    if (!rolesToRemove.Any() && !rolesToAdd.Any())
                        return OperationResult.Skipped("User already has the specified roles");

                    if (rolesToRemove.Any())
                    {
                        var removeResult = await userManager.RemoveFromRolesAsync(user, rolesToRemove);
                        if (!removeResult.Succeeded)
                            return OperationResult.Failure("Failed to remove roles", "ROLE_REMOVAL_FAILED");
                    }

                    if (rolesToAdd.Any())
                    {
                        var addResult = await userManager.AddToRolesAsync(user, rolesToAdd);
                        if (!addResult.Succeeded)
                            return OperationResult.Failure("Failed to add roles", "ROLE_ADDITION_FAILED");
                    }

                    return OperationResult.SuccessOperation();

                case BulkUpdateOperation.ForcePasswordReset:
                    // Generate a password reset token and send email
                    var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);

                    // Send password reset email
                    await emailService.SendTemplatedEmailAsync(user.Email!, "password-reset",
                        new Dictionary<string, object>
                        {
                            { "FirstName", user.FirstName ?? "User" },
                            { "Email", user.Email },
                            { "CompanyName", "Asia Shop" },
                            { "ResetUrl", $"https://yourdomain.com/reset-password?token={resetToken}" },
                            { "ExpiryHours", "24" },
                            { "SupportEmail", "support@yourdomain.com" }
                        }, cancellationToken);

                    return OperationResult.SuccessOperation();

                case BulkUpdateOperation.UpdateEmailConfirmation:
                    if (!updateValues.ContainsKey("EmailConfirmed") ||
                        updateValues["EmailConfirmed"] is not bool emailConfirmed)
                        return OperationResult.Failure("EmailConfirmed value not specified",
                            "EMAIL_CONFIRMED_NOT_SPECIFIED");

                    if (user.EmailConfirmed == emailConfirmed)
                        return OperationResult.Skipped($"User email confirmation is already {emailConfirmed}");

                    user.EmailConfirmed = emailConfirmed;


                    var emailResult = await userManager.UpdateAsync(user);
                    return emailResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to update email confirmation",
                            "EMAIL_CONFIRMATION_UPDATE_FAILED");

                case BulkUpdateOperation.UpdateTwoFactorAuth:
                    if (!updateValues.ContainsKey("TwoFactorEnabled") ||
                        updateValues["TwoFactorEnabled"] is not bool twoFactorEnabled)
                        return OperationResult.Failure("TwoFactorEnabled value not specified",
                            "TWO_FACTOR_NOT_SPECIFIED");

                    if (user.TwoFactorEnabled == twoFactorEnabled)
                        return OperationResult.Skipped(
                            $"User two-factor authentication is already {(twoFactorEnabled ? "enabled" : "disabled")}");

                    var twoFactorResult = await userManager.SetTwoFactorEnabledAsync(user, twoFactorEnabled);
                    return twoFactorResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to update two-factor authentication",
                            "TWO_FACTOR_UPDATE_FAILED");

                case BulkUpdateOperation.SoftDelete:
                    if (user.IsDeleted)
                        return OperationResult.Skipped("User is already deleted");

                    user.IsDeleted = true;
                    user.IsActive = false;
                    user.UpdatedAt = DateTime.UtcNow;

                    var deleteResult = await userManager.UpdateAsync(user);
                    return deleteResult.Succeeded
                        ? OperationResult.SuccessOperation()
                        : OperationResult.Failure("Failed to soft delete user", "SOFT_DELETE_FAILED");

                default:
                    return OperationResult.Failure("Unsupported operation", "UNSUPPORTED_OPERATION");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error performing operation {Operation} on user {UserId}", operation, user.Id);
            return OperationResult.Failure(ex.Message, "OPERATION_EXCEPTION");
        }
    }

    private async Task LogBulkOperationAsync(BulkUpdateUsersCommand request, BulkOperationResult result,
        CancellationToken cancellationToken)
    {
        try
        {
            var activityLog = new UserActivityLog
            {
                UserId = request.RequestingUserId,
                Action = ActionEnum.BulkUpdate,
                Entity = "User",
                Details = JsonSerializer.Serialize(new
                {
                    Operation = request.Operation.ToString(),
                    TotalTargeted = result.TotalTargeted,
                    SuccessCount = result.SuccessCount,
                    FailureCount = result.FailureCount,
                    SkippedCount = result.SkippedCount,
                    Duration = result.Duration.TotalSeconds,
                    Reason = request.Reason,
                    UpdateValues = request.UpdateValues,
                    SuccessfulUserIds = result.SuccessfulUserIds,
                    Errors = result.Errors.Select(e => new { e.UserId, e.ErrorCode, e.ErrorMessage }).ToList()
                }),
                Timestamp = DateTime.UtcNow
            };

            await unitOfWork.UserActivityLogs.AddAsync(activityLog, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error logging bulk operation for user {RequestingUserId}", request.RequestingUserId);
        }
    }

    private class OperationResult
    {
        public bool Success { get; set; }
        public bool WasSkipped { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string ErrorCode { get; set; } = string.Empty;
        public Dictionary<string, object> Details { get; set; } = new();

        public static OperationResult SuccessOperation() => new() { Success = true };

        public static OperationResult Skipped(string reason) =>
            new() { Success = true, WasSkipped = true, ErrorMessage = reason };

        public static OperationResult Failure(string message, string code) =>
            new() { Success = false, ErrorMessage = message, ErrorCode = code };
    }
}