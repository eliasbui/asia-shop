using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Mfa.Commands;

/// <summary>
/// Command to generate new backup codes for a user
/// </summary>
public class GenerateBackupCodesCommand : IRequest<BaseResponse<List<string>>>
{
    /// <summary>
    /// User ID to generate backup codes for
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Number of backup codes to generate (default: 10)
    /// </summary>
    public int Count { get; set; } = 10;

    /// <summary>
    /// User who initiated the generation (for audit)
    /// </summary>
    public Guid? GeneratedBy { get; set; }

    /// <summary>
    /// Reason for generating new codes
    /// </summary>
    public string? Reason { get; set; }
}