namespace UserManagerServices.Application.Common.Interfaces;

public interface IRecaptchaService
{
    Task<bool> ValidateRecaptchaAsync(string token);
}