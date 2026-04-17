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
}
