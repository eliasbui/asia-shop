using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Mfa.Commands;

namespace UserManagerServices.Application.Features.Mfa.Handlers;

/// <summary>
/// Handler for sending email OTP command
/// </summary>
public class SendEmailOtpCommandHandler : IRequestHandler<SendEmailOtpCommand, BaseResponse<bool>>
{
    private readonly IMfaService _mfaService;
    private readonly ILogger<SendEmailOtpCommandHandler> _logger;

    public SendEmailOtpCommandHandler(
        IMfaService mfaService,
        ILogger<SendEmailOtpCommandHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<bool>> Handle(SendEmailOtpCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Sending email OTP for user {UserId} with purpose {Purpose}",
                request.UserId, request.Purpose);

            // Check rate limiting - get recent attempts
            var recentAttempts = await _mfaService.GetRecentEmailOtpAttemptsAsync(
                request.UserId, request.Purpose, 5, cancellationToken);

            if (recentAttempts >= 3)
            {
                _logger.LogWarning("Rate limit exceeded for email OTP requests for user {UserId}", request.UserId);
                return BaseResponse<bool>.Failure("Too many OTP requests. Please wait before requesting another code.");
            }

            // Send email OTP
            var success = await _mfaService.SendEmailOtpAsync(request.UserId, request.Purpose, cancellationToken);

            if (success)
            {
                _logger.LogInformation("Email OTP sent successfully for user {UserId}", request.UserId);
                return BaseResponse<bool>.Success(true, "OTP code has been sent to your email address");
            }
            else
            {
                _logger.LogWarning("Failed to send email OTP for user {UserId}", request.UserId);
                return BaseResponse<bool>.Failure("Failed to send OTP code. Please try again.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email OTP for user {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while sending the OTP code");
        }
    }
}