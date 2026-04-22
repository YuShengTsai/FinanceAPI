using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    private readonly IAccessControlService _accessControlService;

    public TransactionsController(ITransactionService transactionService, IAccessControlService accessControlService)
    {
        _transactionService = transactionService;
        _accessControlService = accessControlService;
    }

    [HttpGet("{transactionId:int}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int transactionId)
    {
        if (!await _accessControlService.CanAccessTransactionAsync(User, transactionId))
        {
            return Forbid();
        }

        var transaction = await _transactionService.GetTransactionAsync(transactionId);

        if (transaction is null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions([FromQuery] int? accountId, [FromQuery] string? type)
    {
        if (!User.IsInRole("Admin"))
        {
            if (!accountId.HasValue)
            {
                return BadRequest(new
                {
                    message = "非管理者查詢交易時必須提供 accountId。"
                });
            }

            if (!await _accessControlService.CanAccessAccountAsync(User, accountId.Value))
            {
                return Forbid();
            }
        }

        var transactions = await _transactionService.GetTransactionsAsync(accountId, type);
        return Ok(transactions);
    }
}
