using FinanceAPI.Models;

namespace FinanceAPI.Services.Interfaces;

public interface ITransactionService
{
    Task<Transaction?> GetTransactionAsync(int transactionId);

    Task<IEnumerable<Transaction>> GetTransactionsAsync(int? accountId, string? type);
}
