using System.Security.Claims;

namespace FinanceAPI.Services.Interfaces;

public interface IAccessControlService
{
    Task<bool> CanAccessAccountAsync(ClaimsPrincipal user, int accountId);

    Task<bool> CanAccessTransactionAsync(ClaimsPrincipal user, int transactionId);

    Task<bool> CanAccessTransferAsync(ClaimsPrincipal user, int transferId);

    Task<IEnumerable<int>> GetAccessibleAccountIdsAsync(ClaimsPrincipal user);
}
