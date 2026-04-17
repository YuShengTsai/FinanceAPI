using FinanceAPI.Data;
using FinanceAPI.Models;
using FinanceAPI.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace FinanceAPI.Tests.Services;

public class AccountServiceTests
{
    [Fact]
    public async Task DepositAsync_WhenAccountExists_ShouldUpdateBalanceAndCreateTransaction()
    {
        await using var context = CreateContext();
        context.Accounts.Add(CreateAccount(accountId: 1, balance: 1000m));
        await context.SaveChangesAsync();

        var service = new AccountService(context);

        var result = await service.DepositAsync(1, 250m);

        Assert.True(result.Success);
        Assert.Equal(1250m, result.Balance);
        Assert.NotNull(result.TransactionId);

        var account = await context.Accounts.FindAsync(1);
        Assert.NotNull(account);
        Assert.Equal(1250m, account!.Balance);

        var transaction = await context.Transactions.SingleAsync();
        Assert.Equal(1, transaction.AccountId);
        Assert.Equal("Deposit", transaction.Type);
        Assert.Equal(250m, transaction.Amount);
        Assert.Equal("Success", transaction.Status);
    }

    [Fact]
    public async Task DepositAsync_WhenAccountDoesNotExist_ShouldReturnFailureAndNotCreateTransaction()
    {
        await using var context = CreateContext();
        var service = new AccountService(context);

        var result = await service.DepositAsync(999, 250m);

        Assert.False(result.Success);
        Assert.Null(result.TransactionId);
        Assert.Null(result.Balance);
        Assert.Empty(await context.Transactions.ToListAsync());
    }

    [Fact]
    public async Task WithdrawAsync_WhenBalanceIsInsufficient_ShouldReturnFailureAndKeepOriginalBalance()
    {
        await using var context = CreateContext();
        context.Accounts.Add(CreateAccount(accountId: 1, balance: 100m));
        await context.SaveChangesAsync();

        var service = new AccountService(context);

        var result = await service.WithdrawAsync(1, 200m);

        Assert.False(result.Success);
        Assert.Equal(100m, result.Balance);

        var account = await context.Accounts.FindAsync(1);
        Assert.NotNull(account);
        Assert.Equal(100m, account!.Balance);
        Assert.Empty(await context.Transactions.ToListAsync());
    }

    [Fact]
    public async Task WithdrawAsync_WhenAccountExistsAndBalanceIsEnough_ShouldUpdateBalanceAndCreateTransaction()
    {
        await using var context = CreateContext();
        context.Accounts.Add(CreateAccount(accountId: 1, balance: 1000m));
        await context.SaveChangesAsync();

        var service = new AccountService(context);

        var result = await service.WithdrawAsync(1, 300m);

        Assert.True(result.Success);
        Assert.Equal(700m, result.Balance);
        Assert.NotNull(result.TransactionId);

        var account = await context.Accounts.FindAsync(1);
        Assert.NotNull(account);
        Assert.Equal(700m, account!.Balance);

        var transaction = await context.Transactions.SingleAsync();
        Assert.Equal("Withdraw", transaction.Type);
        Assert.Equal(300m, transaction.Amount);
        Assert.Equal("Success", transaction.Status);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static Account CreateAccount(int accountId, decimal balance)
    {
        return new Account
        {
            AccountId = accountId,
            CustomerId = 1001,
            AccountNumber = $"ACC-{accountId:0000}",
            Balance = balance,
            Currency = "TWD",
            CreatedAt = DateTime.UtcNow
        };
    }
}
