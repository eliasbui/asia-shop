namespace UserManagerServices.Application.DTOs;

public record CreateUserDto(
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber = null);
