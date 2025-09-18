#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Queries;

/// <summary>
/// Query for getting user notification settings
/// </summary>
public class GetNotificationSettingsQuery : IRequest<BaseResponse<NotificationSettingsResponse>>
{
    /// <summary>
    /// User ID whose notification settings to retrieve
    /// </summary>
    public Guid UserId { get; set; }
}