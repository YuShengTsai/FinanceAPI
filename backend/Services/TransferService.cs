using System.Data;
using FinanceAPI.Data;
using FinanceAPI.Infrastructure.Cache;
using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Services;

public class TransferService : ITransferService
{
    private readonly AppDbContext _context;
    private readonly ICacheService _cacheService;

    public TransferService(AppDbContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<TransferResult> TransferMoneyAsync(TransferRequest request)
    {
        var resultCodeParameter = new SqlParameter("@ResultCode", SqlDbType.Int)
        {
            Direction = ParameterDirection.Output
        };

        var resultMessageParameter = new SqlParameter("@ResultMessage", SqlDbType.NVarChar, 500)
        {
            Direction = ParameterDirection.Output
        };

        var parameters = new[]
        {
            new SqlParameter("@FromAccountId", request.FromAccountId),
            new SqlParameter("@ToAccountId", request.ToAccountId),
            new SqlParameter("@Amount", SqlDbType.Decimal)
            {
                Precision = 18,
                Scale = 2,
                Value = request.Amount
            },
            resultCodeParameter,
            resultMessageParameter
        };

        await _context.Database.ExecuteSqlRawAsync(
            "EXEC TransferMoney @FromAccountId, @ToAccountId, @Amount, @ResultCode OUTPUT, @ResultMessage OUTPUT",
            parameters);

        var result = new TransferResult
        {
            ResultCode = resultCodeParameter.Value is DBNull ? -1 : (int)resultCodeParameter.Value,
            ResultMessage = resultMessageParameter.Value?.ToString() ?? string.Empty
        };

        if (result.ResultCode == 0)
        {
            await _cacheService.RemoveAsync(
                CacheKeys.AccountBalance(request.FromAccountId),
                CacheKeys.AccountTransactions(request.FromAccountId),
                CacheKeys.AccountBalance(request.ToAccountId),
                CacheKeys.AccountTransactions(request.ToAccountId));
        }

        return result;
    }

    public async Task<TransferDetail?> GetTransferDetailAsync(int transferId)
    {
        return await _context.TransferDetails
            .AsNoTracking()
            .FirstOrDefaultAsync(transfer => transfer.TransferId == transferId);
    }

    public async Task<IEnumerable<TransferDetail>> GetTransferDetailsAsync(int? accountId, int? fromAccountId, int? toAccountId)
    {
        var query = _context.TransferDetails
            .AsNoTracking()
            .AsQueryable();

        if (accountId.HasValue)
        {
            query = query.Where(transfer =>
                transfer.FromAccountId == accountId.Value || transfer.ToAccountId == accountId.Value);
        }

        if (fromAccountId.HasValue)
        {
            query = query.Where(transfer => transfer.FromAccountId == fromAccountId.Value);
        }

        if (toAccountId.HasValue)
        {
            query = query.Where(transfer => transfer.ToAccountId == toAccountId.Value);
        }

        return await query
            .OrderByDescending(transfer => transfer.CreatedAt)
            .ThenByDescending(transfer => transfer.TransferId)
            .ToListAsync();
    }
}
