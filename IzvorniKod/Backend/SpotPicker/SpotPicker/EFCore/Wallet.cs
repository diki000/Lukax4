using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("Wallet")]
    public class Wallet
    {
        [Key]
        public int WalletID { get; set; }

        public int UserID { get; set; }

        [ForeignKey("User")]
        public virtual User User { get; set; }

        public float Balance { get; set; }
    }
}
