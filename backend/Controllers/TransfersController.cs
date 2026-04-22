using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransfersController : ControllerBase
{
    private readonly ITransferService _transferService;
    private readonly IAccessControlService _accessControlService;

    public TransfersController(ITransferService transferService, IAccessControlService accessControlService)
    {
        _transferService = transferService;
        _accessControlService = accessControlService;
    }

    [HttpPost]
    public async Task<ActionResult<TransferResult>> TransferMoney(TransferRequest request)
    {
        if (!User.IsInRole("Admin"))
        {
            var canAccessFromAccount = await _accessControlService.CanAccessAccountAsync(User, request.FromAccountId);

            if (!canAccessFromAccount)
            {
                return Forbid();
            }
        }

        var result = await _transferService.TransferMoneyAsync(request);

        if (result.ResultCode != 0)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{transferId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TransferDetail>> GetTransferDetail(int transferId)
    {
        var transferDetail = await _transferService.GetTransferDetailAsync(transferId);

        if (transferDetail is null)
        {
            return NotFound();
        }

        return Ok(transferDetail);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<TransferDetail>>> GetTransferDetails(
        [FromQuery] int? accountId,
        [FromQuery] int? fromAccountId,
        [FromQuery] int? toAccountId)
    {
        var transferDetails = await _transferService.GetTransferDetailsAsync(accountId, fromAccountId, toAccountId);
        return Ok(transferDetails);
    }
}
