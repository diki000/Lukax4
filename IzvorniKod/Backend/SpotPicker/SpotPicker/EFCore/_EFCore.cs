using Microsoft.EntityFrameworkCore;
using SpotPicker.Models;

namespace SpotPicker.EFCore
{
    public class _EFCore : DbContext
    {
        public _EFCore(DbContextOptions<_EFCore> options) : base(options) { }

        public DbSet<User> User { get; set; }

        public DbSet<Manager> Manager {  get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Manager>()
                .HasOne(manager => manager.User)
                .WithOne(user => user.Manager)
                .HasForeignKey<Manager>(manager => manager.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Transactions)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserID);

            modelBuilder.Entity<Wallet>()
                .HasOne(wallet => wallet.User)
                .WithOne(user => user.Wallet)
                .HasForeignKey<Wallet>(wallet => wallet.UserID);
        }
    }
}
