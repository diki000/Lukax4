using Microsoft.EntityFrameworkCore;

namespace SpotPicker.EFCore
{
    public class _EFCore : DbContext
    {
        public _EFCore(DbContextOptions<_EFCore> options) : base(options) { }

        public DbSet<User> User { get; set; }
    }
}
