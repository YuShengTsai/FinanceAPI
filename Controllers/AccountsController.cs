using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet("{accountId:int}")]
    public async Task<ActionResult<Account>> GetAccount(int accountId)
    {
        var account = await _accountService.GetAccountAsync(accountId);

        if (account is null)
        {
            return NotFound();
        }

        return Ok(account);
    }

    [HttpGet("{accountId:int}/balance")]
    public async Task<ActionResult<BalanceResponse>> GetBalance(int accountId)
    {
        var balance = await _accountService.GetBalanceAsync(accountId);

        if (balance is null)
        {
            return NotFound();
        }

        return Ok(balance);
    }

    [HttpGet("{accountId:int}/transactions")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetAccountTransactions(int accountId)
    {
        var account = await _accountService.GetAccountAsync(accountId);
        if (account is null)
        {
            return NotFound();
        }

        var transactions = await _accountService.GetAccountTransactionsAsync(accountId);
        return Ok(transactions);
    }

    [HttpPost("{accountId:int}/deposit")]
    public async Task<ActionResult<OperationResult>> Deposit(int accountId, AmountRequest request)
    {
        var result = await _accountService.DepositAsync(accountId, request.Amount);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("{accountId:int}/withdraw")]
    public async Task<ActionResult<OperationResult>> Withdraw(int accountId, AmountRequest request)
    {
        var result = await _accountService.WithdrawAsync(accountId, request.Amount);

        if (!result.Success)
        {
            if (string.Equals(result.Message, "Account not found.", StringComparison.Ordinal))
            {
                return NotFound(result);
            }

            return BadRequest(result);
        }

        return Ok(result);
    }
}
