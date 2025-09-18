#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.API.Records;

/// <summary>
/// Request model for regenerating QR code
/// </summary>
public record GenerateQrCodeRequest(string SetupSessionId);

/// <summary>
/// Request model for enabling MFA
/// </summary>
public record EnableMfaRequest(string TotpCode);

/// <summary>
/// Request model for verifying MFA
/// </summary>
public record VerifyMfaRequest(Guid UserId, string MfaCode, string MfaType);

/// <summary>
/// Request model for disabling MFA
/// </summary>
public record DisableMfaRequest(string CurrentPassword, string MfaCode, string? Reason = null);

/// <summary>
/// Request model for sending email OTP
/// </summary>
public record SendEmailOtpRequest(Guid UserId, string? Purpose = "MFA");