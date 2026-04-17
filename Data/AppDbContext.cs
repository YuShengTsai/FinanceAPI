using FinanceAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<TransferDetail> TransferDetails => Set<TransferDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Accounts");

            entity.HasKey(account => account.AccountId);

            entity.Property(account => account.AccountId)
                .ValueGeneratedOnAdd();

            entity.Property(account => account.CustomerId)
                .IsRequired();

            entity.Property(account => account.AccountNumber)
                .IsRequired();

            entity.Property(account => account.Currency)
                .IsRequired();

            entity.Property(account => account.Balance)
                .HasColumnType("decimal(18,2)");

            entity.Property(account => account.CreatedAt)
                .HasColumnType("datetime")
                .HasDefaultValueSql("GETDATE()");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transactions");

            entity.HasKey(transaction => transaction.TransactionId);

            entity.Property(transaction => transaction.TransactionId)
                .ValueGeneratedOnAdd();

            entity.Property(transaction => transaction.Type)
                .IsRequired();

            entity.Property(transaction => transaction.Amount)
                .HasColumnType("decimal(18,2)");

            entity.Property(transaction => transaction.Status)
                .IsRequired();

            entity.Property(transaction => transaction.CreatedAt)
                .HasColumnType("datetime")
                .HasDefaultValueSql("GETDATE()");
        });

        modelBuilder.Entity<TransferDetail>(entity =>
        {
            entity.ToTable("TransferDetails");

            entity.HasKey(transfer => transfer.TransferId);

            entity.Property(transfer => transfer.TransferId)
                .ValueGeneratedOnAdd();

            entity.Property(transfer => transfer.Amount)
                .HasColumnType("decimal(18,2)");

            entity.Property(transfer => transfer.CreatedAt)
                .HasColumnType("datetime")
                .HasDefaultValueSql("GETDATE()");
        });
    }
}
