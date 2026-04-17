using System.Data;
using FinanceAPI.Data;
using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Services;

public class TransferService : ITransferService
{
    private readonly AppDbContext _context;

    public TransferService(AppDbContext context)
    {
        _context = context;
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

        return new TransferResult
        {
            ResultCode = resultCodeParameter.Value is DBNull ? -1 : (int)resultCodeParameter.Value,
            ResultMessage = resultMessageParameter.Value?.ToString() ?? string.Empty
        };
    }

    public async Task<TransferDetail?> GetTransferDetailAsync(int transferId)
    {
        return await _context.TransferDetails
            .AsNoTracking()
            .FirstOrDefaultAsync(transfer => transfer.TransferId == transferId);
    }
}
