using FinanceAPI.Data;
using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Services;

public class AccountService : IAccountService
{
    private readonly AppDbContext _context;

    public AccountService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Account?> GetAccountAsync(int accountId)
    {
        return await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(account => account.AccountId == accountId);
    }

    public async Task<BalanceResponse?> GetBalanceAsync(int accountId)
    {
        return await _context.Accounts
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
    }

    public async Task<List<Transaction>> GetAccountTransactionsAsync(int accountId)
    {
        return await _context.Transactions
            .AsNoTracking()
            .Where(transaction => transaction.AccountId == accountId)
            .OrderByDescending(transaction => transaction.CreatedAt)
            .ThenByDescending(transaction => transaction.TransactionId)
            .ToListAsync();
    }

    public async Task<OperationResult> DepositAsync(int accountId, decimal amount)
    {
        var account = await _context.Accounts.FindAsync(accountId);

        if (account is null)
        {
            return new OperationResult
            {
                Success = false,
                Message = "Account not found."
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

        return new OperationResult
        {
            Success = true,
            Message = "Deposit completed successfully.",
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
                Message = "Account not found."
            };
        }

        if (account.Balance < amount)
        {
            return new OperationResult
            {
                Success = false,
                Message = "Insufficient balance.",
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

        return new OperationResult
        {
            Success = true,
            Message = "Withdraw completed successfully.",
            TransactionId = transaction.TransactionId,
            Balance = account.Balance
        };
    }
}
