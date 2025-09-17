using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for user login
/// </summary>
public class LoginCommand : IRequest<BaseResponse<LoginResponse>>
{
    /// <summary>
    /// Email or username for login
    /// </summary>
    public string EmailOrUsername { get; set; } = string.Empty;

    /// <summary>
    /// User password
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Remember me flag for extended session
    /// </summary>
    public bool RememberMe { get; set; }

    /// <summary>
    /// Client IP address for security logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for session tracking
    /// </summary>
    public string? UserAgent { get; set; }
}

/// <summary>
/// Login response model
/// </summary>
public class LoginResponse
{
    /// <summary>
    /// JWT access token
    /// </summary>
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Refresh token for token renewal
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>
    /// Token expiry time
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// User information
    /// </summary>
    public UserInfo User { get; set; } = new();
}

/// <summary>
/// User information model
/// </summary>
public class UserInfo
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public string UserName { get; set; } = string.Empty;

    /// <summary>
    /// Email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// First name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// User roles
    /// </summary>
    public List<string> Roles { get; set; } = new();

    /// <summary>
    /// Email confirmation status
    /// </summary>
    public bool EmailConfirmed { get; set; }
}

/// <summary>
/// Validator for login command
/// </summary>
public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    /// <summary>
    /// Initializes validation rules
    /// </summary>
    public LoginCommandValidator()
    {
        RuleFor(x => x.EmailOrUsername)
            .NotEmpty()
            .WithMessage("Email or username is required")
            .MaximumLength(256)
            .WithMessage("Email or username must not exceed 256 characters");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required")
            .MinimumLength(1)
            .WithMessage("Password is required");
    }
}

/// <summary>
/// Handler for login command
/// </summary>
public class LoginCommandHandler : IRequestHandler<LoginCommand, BaseResponse<LoginResponse>>
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly ILogger<LoginCommandHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the LoginCommandHandler
    /// </summary>
    /// <param name="userManager">User manager</param>
    /// <param name="signInManager">Sign-in manager</param>
    /// <param name="tokenService">Token service</param>
    /// <param name="logger">Logger</param>
    public LoginCommandHandler(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        ITokenService tokenService,
        ILogger<LoginCommandHandler> logger)
    {
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
        _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the login command
    /// </summary>
    /// <param name="request">Login command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Login response</returns>
    public async Task<BaseResponse<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Login attempt for user: {EmailOrUsername} from IP: {IpAddress}", 
                request.EmailOrUsername, request.IpAddress);

            // Find user by email or username
            var user = await FindUserAsync(request.EmailOrUsername);
            if (user == null)
            {
                _logger.LogWarning("Login failed: User not found for {EmailOrUsername}", request.EmailOrUsername);
                return BaseResponse<LoginResponse>.Failure("Invalid email/username or password");
            }

            // Check if user is locked out
            if (await _userManager.IsLockedOutAsync(user))
            {
                _logger.LogWarning("Login failed: User {UserId} is locked out", user.Id);
                return BaseResponse<LoginResponse>.Failure("Account is locked. Please try again later.");
            }

            // Attempt sign in
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
            
            if (!result.Succeeded)
            {
                _logger.LogWarning("Login failed for user {UserId}: {Reason}", user.Id, GetFailureReason(result));
                return BaseResponse<LoginResponse>.Failure(GetFailureMessage(result));
            }

            // Generate tokens
            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = await _tokenService.GenerateAccessTokenAsync(user, roles, cancellationToken);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Update user's last login
            user.LastLoginAt = DateTime.UtcNow;
            user.LastLoginIp = request.IpAddress;
            await _userManager.UpdateAsync(user);

            var response = new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60), // Should match JWT expiry
                User = new UserInfo
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty,
                    Roles = roles.ToList(),
                    EmailConfirmed = user.EmailConfirmed
                }
            };

            _logger.LogInformation("Login successful for user {UserId}", user.Id);
            return BaseResponse<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user: {EmailOrUsername}", request.EmailOrUsername);
            return BaseResponse<LoginResponse>.Failure("An error occurred during login. Please try again.");
        }
    }

    /// <summary>
    /// Finds user by email or username
    /// </summary>
    /// <param name="emailOrUsername">Email or username</param>
    /// <returns>User if found, null otherwise</returns>
    private async Task<User?> FindUserAsync(string emailOrUsername)
    {
        // Try to find by email first
        var user = await _userManager.FindByEmailAsync(emailOrUsername);
        if (user != null)
            return user;

        // Try to find by username
        return await _userManager.FindByNameAsync(emailOrUsername);
    }

    /// <summary>
    /// Gets failure reason for logging
    /// </summary>
    /// <param name="result">Sign-in result</param>
    /// <returns>Failure reason</returns>
    private static string GetFailureReason(SignInResult result)
    {
        if (result.IsLockedOut) return "LockedOut";
        if (result.IsNotAllowed) return "NotAllowed";
        if (result.RequiresTwoFactor) return "RequiresTwoFactor";
        return "InvalidCredentials";
    }

    /// <summary>
    /// Gets user-friendly failure message
    /// </summary>
    /// <param name="result">Sign-in result</param>
    /// <returns>Failure message</returns>
    private static string GetFailureMessage(SignInResult result)
    {
        if (result.IsLockedOut)
            return "Account is locked due to multiple failed login attempts. Please try again later.";
        
        if (result.IsNotAllowed)
            return "Login is not allowed. Please confirm your email address.";
        
        if (result.RequiresTwoFactor)
            return "Two-factor authentication is required.";
        
        return "Invalid email/username or password.";
    }
}
