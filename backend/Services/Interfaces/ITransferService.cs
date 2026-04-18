using FinanceAPI.Models;

namespace FinanceAPI.Services.Interfaces;

public interface ITransferService
{
    Task<TransferResult> TransferMoneyAsync(TransferRequest request);

    Task<TransferDetail?> GetTransferDetailAsync(int transferId);

    Task<IEnumerable<TransferDetail>> GetTransferDetailsAsync(int? accountId, int? fromAccountId, int? toAccountId);
}
