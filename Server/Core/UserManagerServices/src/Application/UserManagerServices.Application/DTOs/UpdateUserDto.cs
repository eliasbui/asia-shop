namespace UserManagerServices.Application.DTOs;

public record UpdateUserDto(
    string FirstName,
    string LastName,
    string? PhoneNumber = null);
