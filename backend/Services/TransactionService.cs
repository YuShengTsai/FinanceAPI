using FinanceAPI.Data;
using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetTransactionAsync(int transactionId)
    {
        return await _context.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.TransactionId == transactionId);
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsAsync(int? accountId, string? type)
    {
        var query = _context.Transactions
            .AsNoTracking()
            .AsQueryable();

        if (accountId.HasValue)
        {
            query = query.Where(transaction => transaction.AccountId == accountId.Value);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(transaction => transaction.Type == type);
        }

        return await query
            .OrderByDescending(transaction => transaction.CreatedAt)
            .ThenByDescending(transaction => transaction.TransactionId)
            .ToListAsync();
    }
}
