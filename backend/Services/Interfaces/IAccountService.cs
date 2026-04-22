using FinanceAPI.Models;

namespace FinanceAPI.Services.Interfaces;

public interface IAccountService
{
    Task<List<Account>> GetAccountsAsync(IEnumerable<int>? accountIds = null);

    Task<Account?> GetAccountAsync(int accountId);

    Task<BalanceResponse?> GetBalanceAsync(int accountId);

    Task<List<Transaction>> GetAccountTransactionsAsync(int accountId);

    Task<OperationResult> DepositAsync(int accountId, decimal amount);

    Task<OperationResult> WithdrawAsync(int accountId, decimal amount);
}
