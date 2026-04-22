using System.Security.Claims;
using FinanceAPI.Data;
using FinanceAPI.Extensions;
using FinanceAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Services;

public class AccessControlService : IAccessControlService
{
    private readonly AppDbContext _context;

    public AccessControlService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CanAccessAccountAsync(ClaimsPrincipal user, int accountId)
    {
        if (user.IsInRole("Admin"))
        {
            return true;
        }

        var userId = user.GetUserId();
        if (!userId.HasValue)
        {
            return false;
        }

        return await _context.Accounts
            .AsNoTracking()
            .AnyAsync(account => account.AccountId == accountId && account.CustomerId == userId.Value);
    }

    public async Task<bool> CanAccessTransactionAsync(ClaimsPrincipal user, int transactionId)
    {
        if (user.IsInRole("Admin"))
        {
            return true;
        }

        var userId = user.GetUserId();
        if (!userId.HasValue)
        {
            return false;
        }

        return await _context.Transactions
            .AsNoTracking()
            .Join(
                _context.Accounts.AsNoTracking(),
                transaction => transaction.AccountId,
                account => account.AccountId,
                (transaction, account) => new { transaction.TransactionId, account.CustomerId })
            .AnyAsync(item => item.TransactionId == transactionId && item.CustomerId == userId.Value);
    }

    public async Task<bool> CanAccessTransferAsync(ClaimsPrincipal user, int transferId)
    {
        if (user.IsInRole("Admin"))
        {
            return true;
        }

        var accessibleAccountIds = (await GetAccessibleAccountIdsAsync(user)).ToHashSet();
        if (accessibleAccountIds.Count == 0)
        {
            return false;
        }

        return await _context.TransferDetails
            .AsNoTracking()
            .AnyAsync(transfer =>
                transfer.TransferId == transferId &&
                (accessibleAccountIds.Contains(transfer.FromAccountId) ||
                 accessibleAccountIds.Contains(transfer.ToAccountId)));
    }

    public async Task<IEnumerable<int>> GetAccessibleAccountIdsAsync(ClaimsPrincipal user)
    {
        if (user.IsInRole("Admin"))
        {
            return await _context.Accounts
                .AsNoTracking()
                .Select(account => account.AccountId)
                .ToListAsync();
        }

        var userId = user.GetUserId();
        if (!userId.HasValue)
        {
            return [];
        }

        return await _context.Accounts
            .AsNoTracking()
            .Where(account => account.CustomerId == userId.Value)
            .Select(account => account.AccountId)
            .ToListAsync();
    }
}
