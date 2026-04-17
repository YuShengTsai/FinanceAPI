using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet("{transactionId:int}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int transactionId)
    {
        var transaction = await _transactionService.GetTransactionAsync(transactionId);

        if (transaction is null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }
}
