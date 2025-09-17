using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for bulk creating multiple users
/// </summary>
public class BulkCreateUsersCommandHandler(
    UserManager<User> userManager,
    IUnitOfWork unitOfWork,
    ILogger<BulkCreateUsersCommandHandler> logger,
    IEmailService emailService)
    : IRequestHandler<BulkCreateUsersCommand, BaseResponse<BulkCreateResult>>
{
    public async Task<BaseResponse<BulkCreateResult>> Handle(BulkCreateUsersCommand request,
        CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            logger.LogInformation("Starting bulk create operation for {Count} users by user {RequestingUserId}",
                request.Users.Count, request.RequestingUserId);

            var result = new BulkCreateResult
            {
                TotalTargeted = request.Users.Count,
                WelcomeEmailsSent = request.SendWelcomeEmails
            };

            // Validate the requesting user has permission
            var requestingUser = await userManager.FindByIdAsync(request.RequestingUserId.ToString());
            if (requestingUser == null)
            {
                return BaseResponse<BulkCreateResult>.Failure("Requesting user not found",
                    new Dictionary<string, object> { ["errorCode"] = "REQUESTING_USER_NOT_FOUND" });
            }

            var requestingUserRoles = await userManager.GetRolesAsync(requestingUser);
            if (!requestingUserRoles.Contains("Admin") && !requestingUserRoles.Contains("UserManager"))
            {
                return BaseResponse<BulkCreateResult>.Failure("Insufficient permissions for bulk user creation",
                    new Dictionary<string, object> { ["errorCode"] = "INSUFFICIENT_PERMISSIONS" });
            }

            // Validate input data
            var validationErrors = ValidateUserData(request.Users);
            if (validationErrors.Any())
            {
                result.Errors.AddRange(validationErrors);
                result.FailureCount = validationErrors.Count;
            }

            // Process each user
            foreach (var userData in request.Users.Where(u => !validationErrors.Any(e => e.Email == u.Email)))
            {
                try
                {
                    // Check if user already exists
                    var existingUser = await userManager.FindByEmailAsync(userData.Email);
                    if (existingUser != null)
                    {
                        if (request.SkipExistingUsers)
                        {
                            result.SkippedUsers.Add(new BulkSkippedUser
                            {
                                Email = userData.Email,
                                Reason = "User with this email already exists",
                                RowNumber = userData.RowNumber
                            });
                            result.SkippedCount++;
                            continue;
                        }
                        else
                        {
                            result.Errors.Add(new BulkCreateError
                            {
                                Email = userData.Email,
                                ErrorMessage = "User with this email already exists",
                                ErrorCode = "USER_ALREADY_EXISTS",
                                RowNumber = userData.RowNumber
                            });
                            result.FailureCount++;
                            continue;
                        }
                    }

                    // Generate password if needed
                    var password = userData.Password;
                    if (string.IsNullOrEmpty(password) && request.GenerateRandomPasswords)
                    {
                        password = GenerateRandomPassword();
                    }

                    if (string.IsNullOrEmpty(password))
                    {
                        result.Errors.Add(new BulkCreateError
                        {
                            Email = userData.Email,
                            ErrorMessage = "Password is required",
                            ErrorCode = "PASSWORD_REQUIRED",
                            RowNumber = userData.RowNumber
                        });
                        result.FailureCount++;
                        continue;
                    }

                    // Create the user
                    var user = new User
                    {
                        Email = userData.Email,
                        UserName = userData.Email,
                        FirstName = userData.FirstName,
                        LastName = userData.LastName,
                        PhoneNumber = userData.PhoneNumber,
                        IsActive = userData.IsActive,
                        EmailConfirmed = !request.RequireEmailConfirmation,
                    };

                    var createResult = await userManager.CreateAsync(user, password);
                    if (!createResult.Succeeded)
                    {
                        result.Errors.Add(new BulkCreateError
                        {
                            Email = userData.Email,
                            ErrorMessage = string.Join(", ", createResult.Errors.Select(e => e.Description)),
                            ErrorCode = "USER_CREATION_FAILED",
                            RowNumber = userData.RowNumber,
                            Details = new Dictionary<string, object>
                            {
                                ["identityErrors"] = createResult.Errors.Select(e => new { e.Code, e.Description })
                                    .ToList()
                            }
                        });
                        result.FailureCount++;
                        continue;
                    }

                    // Assign roles
                    var allRoles = request.DefaultRoles.Concat(userData.Roles).Distinct().ToList();
                    if (allRoles.Any())
                    {
                        var roleResult = await userManager.AddToRolesAsync(user, allRoles);
                        if (!roleResult.Succeeded)
                        {
                            logger.LogWarning("Failed to assign roles to user {Email}: {Errors}",
                                userData.Email, string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                        }
                    }

                    // Send welcome email if requested
                    if (request.SendWelcomeEmails)
                    {
                        try
                        {
                            await SendWelcomeEmailAsync(user, password, request.RequireEmailConfirmation,
                                cancellationToken);
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning(ex, "Failed to send welcome email to {Email}", userData.Email);
                        }
                    }

                    // Add to successful results
                    result.CreatedUsers.Add(new BulkCreatedUser
                    {
                        UserId = user.Id,
                        Email = user.Email!,
                        FullName = $"{user.FirstName} {user.LastName}".Trim(),
                        GeneratedPassword = userData.Password != password ? password : null,
                        AssignedRoles = allRoles,
                        RowNumber = userData.RowNumber
                    });
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error creating user {Email} in bulk operation", userData.Email);
                    result.Errors.Add(new BulkCreateError
                    {
                        Email = userData.Email,
                        ErrorMessage = ex.Message,
                        ErrorCode = "PROCESSING_ERROR",
                        RowNumber = userData.RowNumber
                    });
                    result.FailureCount++;
                }
            }

            // Log the bulk operation
            await LogBulkCreateOperationAsync(request, result, cancellationToken);

            stopwatch.Stop();
            result.Duration = stopwatch.Elapsed;

            logger.LogInformation(
                "Completed bulk create operation. Success: {Success}, Failed: {Failed}, Skipped: {Skipped}",
                result.SuccessCount, result.FailureCount, result.SkippedCount);

            return BaseResponse<BulkCreateResult>.Success(result,
                $"Bulk create completed. {result.SuccessCount} successful, {result.FailureCount} failed, {result.SkippedCount} skipped.");
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            logger.LogError(ex, "Error in bulk create operation");
            return BaseResponse<BulkCreateResult>.Failure(
                "An error occurred during the bulk create operation. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "BULK_CREATE_ERROR"
                });
        }
    }

    private List<BulkCreateError> ValidateUserData(List<BulkUserCreateData> users)
    {
        var errors = new List<BulkCreateError>();
        var emailSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var user in users)
        {
            // Validate email
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                errors.Add(new BulkCreateError
                {
                    Email = user.Email ?? "",
                    ErrorMessage = "Email is required",
                    ErrorCode = "EMAIL_REQUIRED",
                    RowNumber = user.RowNumber
                });
                continue;
            }

            if (!IsValidEmail(user.Email))
            {
                errors.Add(new BulkCreateError
                {
                    Email = user.Email,
                    ErrorMessage = "Invalid email format",
                    ErrorCode = "INVALID_EMAIL_FORMAT",
                    RowNumber = user.RowNumber
                });
                continue;
            }

            // Check for duplicate emails in the batch
            if (!emailSet.Add(user.Email))
            {
                errors.Add(new BulkCreateError
                {
                    Email = user.Email,
                    ErrorMessage = "Duplicate email in batch",
                    ErrorCode = "DUPLICATE_EMAIL_IN_BATCH",
                    RowNumber = user.RowNumber
                });
            }
        }

        return errors;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static string GenerateRandomPassword(int length = 12)
    {
        const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
        var result = new StringBuilder();

        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[length];
        rng.GetBytes(bytes);

        foreach (var b in bytes)
        {
            result.Append(validChars[b % validChars.Length]);
        }

        return result.ToString();
    }

    private async Task SendWelcomeEmailAsync(User user, string password, bool requireEmailConfirmation,
        CancellationToken cancellationToken)
    {
        var subject = "Welcome to the Platform";
        var body = $@"
            <h2>Welcome {user.FirstName}!</h2>
            <p>Your account has been created successfully.</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>Temporary Password:</strong> {password}</p>
            <p>Please log in and change your password as soon as possible.</p>
            {(requireEmailConfirmation ? "<p>Please confirm your email address by clicking the confirmation link that will be sent separately.</p>" : "")}
        ";

        await emailService.SendEmailAsync(user.Email!, subject, body, true, cancellationToken);
    }

    private async Task LogBulkCreateOperationAsync(BulkCreateUsersCommand request, BulkCreateResult result,
        CancellationToken cancellationToken)
    {
        try
        {
            var activityLog = new UserActivityLog
            {
                UserId = request.RequestingUserId,
                Action = ActionEnum.BulkCreate,
                Entity = "User",
                Details = JsonSerializer.Serialize(new
                {
                    TotalTargeted = result.TotalTargeted,
                    SuccessCount = result.SuccessCount,
                    FailureCount = result.FailureCount,
                    SkippedCount = result.SkippedCount,
                    Duration = result.Duration.TotalSeconds,
                    SendWelcomeEmails = request.SendWelcomeEmails,
                    GenerateRandomPasswords = request.GenerateRandomPasswords,
                    RequireEmailConfirmation = request.RequireEmailConfirmation,
                    DefaultRoles = request.DefaultRoles,
                    CreatedUserIds = result.CreatedUsers.Select(u => u.UserId).ToList(),
                    Errors = result.Errors.Select(e => new { e.Email, e.ErrorCode, e.ErrorMessage, e.RowNumber })
                        .ToList()
                }),
                Timestamp = DateTime.UtcNow
            };

            await unitOfWork.UserActivityLogs.AddAsync(activityLog, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error logging bulk create operation for user {RequestingUserId}",
                request.RequestingUserId);
        }
    }
}