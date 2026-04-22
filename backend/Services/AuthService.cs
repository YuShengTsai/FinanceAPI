using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FinanceAPI.Data;
using FinanceAPI.Models;
using FinanceAPI.Options;
using FinanceAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FinanceAPI.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly AuthOptions _authOptions;

    public AuthService(AppDbContext context, IOptions<AuthOptions> authOptions)
    {
        _context = context;
        _authOptions = authOptions.Value;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var matchedUser = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Username == request.Username);

        if (matchedUser is null || !string.Equals(matchedUser.PasswordHash, request.Password, StringComparison.Ordinal))
        {
            return null;
        }

        var expiresAt = DateTime.UtcNow.AddMinutes(_authOptions.Jwt.ExpirationMinutes);
        var accessToken = GenerateAccessToken(matchedUser, expiresAt);

        return new LoginResponse
        {
            AccessToken = accessToken,
            ExpiresAt = expiresAt,
            Username = matchedUser.Username,
            DisplayName = matchedUser.Username,
            Role = matchedUser.Role
        };
    }

    private string GenerateAccessToken(User user, DateTime expiresAt)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Username),
            new(JwtRegisteredClaimNames.UniqueName, user.Username),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authOptions.Jwt.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _authOptions.Jwt.Issuer,
            audience: _authOptions.Jwt.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
