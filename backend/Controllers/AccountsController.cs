using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly IAccessControlService _accessControlService;

    public AccountsController(IAccountService accountService, IAccessControlService accessControlService)
    {
        _accountService = accountService;
        _accessControlService = accessControlService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
    {
        IEnumerable<int>? accessibleAccountIds = null;

        if (!User.IsInRole("Admin"))
        {
            accessibleAccountIds = await _accessControlService.GetAccessibleAccountIdsAsync(User);
        }

        var accounts = await _accountService.GetAccountsAsync(accessibleAccountIds);
        return Ok(accounts);
    }

    [HttpGet("{accountId:int}")]
    public async Task<ActionResult<Account>> GetAccount(int accountId)
    {
        if (!await _accessControlService.CanAccessAccountAsync(User, accountId))
        {
            return Forbid();
        }

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
        if (!await _accessControlService.CanAccessAccountAsync(User, accountId))
        {
            return Forbid();
        }

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
        if (!await _accessControlService.CanAccessAccountAsync(User, accountId))
        {
            return Forbid();
        }

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
        if (!await _accessControlService.CanAccessAccountAsync(User, accountId))
        {
            return Forbid();
        }

        var result = await _accountService.DepositAsync(accountId, request.Amount);

        if (!result.Success)
        {
            if (string.Equals(result.Message, "找不到帳戶。", StringComparison.Ordinal))
            {
                return NotFound(result);
            }

            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("{accountId:int}/withdraw")]
    public async Task<ActionResult<OperationResult>> Withdraw(int accountId, AmountRequest request)
    {
        if (!await _accessControlService.CanAccessAccountAsync(User, accountId))
        {
            return Forbid();
        }

        var result = await _accountService.WithdrawAsync(accountId, request.Amount);

        if (!result.Success)
        {
            if (string.Equals(result.Message, "找不到帳戶。", StringComparison.Ordinal))
            {
                return NotFound(result);
            }

            return BadRequest(result);
        }

        return Ok(result);
    }
}
