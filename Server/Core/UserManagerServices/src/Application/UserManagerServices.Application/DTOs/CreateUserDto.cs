#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.DTOs;

public record CreateUserDto(
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber = null);