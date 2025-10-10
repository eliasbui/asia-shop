using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using UserManagerServices.Application.Common.Interfaces;

namespace UserManagerServices.Infrastructure.Services
{
    public class RecaptchaService : IRecaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public RecaptchaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<bool> ValidateRecaptchaAsync(string token)
        {
            var secretKey = _configuration["RecaptchaSettings:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                // Log error or handle missing configuration
                return false;
            }

            var response = await _httpClient.PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}", null);
            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var recaptchaResponse = JsonConvert.DeserializeObject<RecaptchaResponse>(jsonResponse);
                return recaptchaResponse?.Success ?? false;
            }
            return false;
        }

        private class RecaptchaResponse
        {
            public bool Success { get; set; }
            // Can add other properties like 'challenge_ts', 'hostname', 'error-codes' if needed
        }
    }
}