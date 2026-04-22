using FinanceAPI.Data;
using FinanceAPI.Infrastructure.Cache;
using FinanceAPI.Models;
using FinanceAPI.Options;
using FinanceAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Services;

public class AccountService : IAccountService
{
    private readonly AppDbContext _context;
    private readonly ICacheService _cacheService;
    private readonly RedisOptions _redisOptions;

    public AccountService(AppDbContext context, ICacheService cacheService, Microsoft.Extensions.Options.IOptions<RedisOptions> redisOptions)
    {
        _context = context;
        _cacheService = cacheService;
        _redisOptions = redisOptions.Value;
    }

    public async Task<List<Account>> GetAccountsAsync(IEnumerable<int>? accountIds = null)
    {
        var query = _context.Accounts
            .AsNoTracking()
            .AsQueryable();

        if (accountIds is not null)
        {
            var accountIdList = accountIds.Distinct().ToList();
            query = query.Where(account => accountIdList.Contains(account.AccountId));
        }

        return await query
            .OrderBy(account => account.AccountId)
            .ToListAsync();
    }

    public async Task<Account?> GetAccountAsync(int accountId)
    {
        return await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(account => account.AccountId == accountId);
    }

    public async Task<BalanceResponse?> GetBalanceAsync(int accountId)
    {
        var cacheKey = CacheKeys.AccountBalance(accountId);
        var cachedBalance = await _cacheService.GetAsync<BalanceResponse>(cacheKey);

        if (cachedBalance is not null)
        {
            return cachedBalance;
        }

        var balance = await _context.Accounts
            .AsNoTracking()
            .Where(account => account.AccountId == accountId)
            .Select(account => new BalanceResponse
            {
                AccountId = account.AccountId,
                AccountNumber = account.AccountNumber,
                Balance = account.Balance,
                Currency = account.Currency
            })
            .FirstOrDefaultAsync();

        if (balance is not null)
        {
            await _cacheService.SetAsync(
                cacheKey,
                balance,
                TimeSpan.FromMinutes(_redisOptions.BalanceCacheMinutes));
        }

        return balance;
    }

    public async Task<List<Transaction>> GetAccountTransactionsAsync(int accountId)
    {
        var cacheKey = CacheKeys.AccountTransactions(accountId);
        var cachedTransactions = await _cacheService.GetAsync<List<Transaction>>(cacheKey);

        if (cachedTransactions is not null)
        {
            return cachedTransactions;
        }

        var transactions = await _context.Transactions
            .AsNoTracking()
            .Where(transaction => transaction.AccountId == accountId)
            .OrderByDescending(transaction => transaction.CreatedAt)
            .ThenByDescending(transaction => transaction.TransactionId)
            .ToListAsync();

        await _cacheService.SetAsync(
            cacheKey,
            transactions,
            TimeSpan.FromMinutes(_redisOptions.AccountTransactionsCacheMinutes));

        return transactions;
    }

    public async Task<OperationResult> DepositAsync(int accountId, decimal amount)
    {
        var account = await _context.Accounts.FindAsync(accountId);

        if (account is null)
        {
            return new OperationResult
            {
                Success = false,
                Message = "找不到帳戶。"
            };
        }

        account.Balance += amount;

        var transaction = new Transaction
        {
            AccountId = accountId,
            Type = "Deposit",
            Amount = amount,
            Status = "Success",
            CreatedAt = DateTime.Now
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        await InvalidateAccountCacheAsync(accountId);

        return new OperationResult
        {
            Success = true,
            Message = "存款成功。",
            TransactionId = transaction.TransactionId,
            Balance = account.Balance
        };
    }

    public async Task<OperationResult> WithdrawAsync(int accountId, decimal amount)
    {
        var account = await _context.Accounts.FindAsync(accountId);

        if (account is null)
        {
            return new OperationResult
            {
                Success = false,
                Message = "找不到帳戶。"
            };
        }

        if (account.Balance < amount)
        {
            return new OperationResult
            {
                Success = false,
                Message = "帳戶餘額不足。",
                Balance = account.Balance
            };
        }

        account.Balance -= amount;

        var transaction = new Transaction
        {
            AccountId = accountId,
            Type = "Withdraw",
            Amount = amount,
            Status = "Success",
            CreatedAt = DateTime.Now
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        await InvalidateAccountCacheAsync(accountId);

        return new OperationResult
        {
            Success = true,
            Message = "提款成功。",
            TransactionId = transaction.TransactionId,
            Balance = account.Balance
        };
    }

    private Task InvalidateAccountCacheAsync(int accountId)
    {
        return _cacheService.RemoveAsync(
            CacheKeys.AccountBalance(accountId),
            CacheKeys.AccountTransactions(accountId));
    }
}
