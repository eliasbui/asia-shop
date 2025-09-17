using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Users.Commands;

/// <summary>
/// Command for deleting an API key
/// </summary>
public class DeleteApiKeyCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// API key ID to delete
    /// </summary>
    public Guid KeyId { get; set; }
}
