using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for user logout
/// </summary>
public class LogoutCommand : IRequest<BaseResponse>
{
    /// <summary>
    /// JWT token to blacklist
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// User ID for logging purposes
    /// </summary>
    public Guid? UserId { get; set; }
}

/// <summary>
/// Validator for logout command
/// </summary>
public class LogoutCommandValidator : AbstractValidator<LogoutCommand>
{
    /// <summary>
    /// Initializes validation rules
    /// </summary>
    public LogoutCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Token is required for logout");
    }
}

/// <summary>
/// Handler for logout command
/// </summary>
public class LogoutCommandHandler : IRequestHandler<LogoutCommand, BaseResponse>
{
    private readonly ITokenService _tokenService;
    private readonly ILogger<LogoutCommandHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the LogoutCommandHandler
    /// </summary>
    /// <param name="tokenService">Token service</param>
    /// <param name="logger">Logger</param>
    public LogoutCommandHandler(
        ITokenService tokenService,
        ILogger<LogoutCommandHandler> logger)
    {
        _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the logout command
    /// </summary>
    /// <param name="request">Logout command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response indicating success or failure</returns>
    public async Task<BaseResponse> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Logout attempt for user: {UserId}", request.UserId);

            // Extract token information
            var tokenId = _tokenService.GetTokenId(request.Token);
            var tokenExpiry = _tokenService.GetTokenExpiry(request.Token);

            if (string.IsNullOrEmpty(tokenId))
            {
                _logger.LogWarning("Invalid token provided for logout");
                return BaseResponse.Failure("Invalid token", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_TOKEN"
                });
            }

            if (tokenExpiry == null)
            {
                _logger.LogWarning("Could not determine token expiry for logout");
                return BaseResponse.Failure("Invalid token", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_TOKEN"
                });
            }

            await _tokenService.BlacklistTokenAsync(tokenId, tokenExpiry.Value, cancellationToken);

            _logger.LogInformation("Logout successful for user: {UserId}, token: {TokenId}", request.UserId, tokenId);
            return new BaseResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "Logout successful"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for user: {UserId}", request.UserId);
            return BaseResponse.Failure("An error occurred during logout. Please try again.", new Dictionary<string, object>
            {
                ["errorCode"] = "LOGOUT_ERROR"
            });
        }
    }
}
