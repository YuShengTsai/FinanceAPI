using FinanceAPI.Models;

namespace FinanceAPI.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}
