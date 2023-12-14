using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("Transaction")]
    public class Transaction
    {
        [Key]
        public int ID { get; set; }

        public int UserID { get; set; }

        [ForeignKey("User")]
        public virtual User User { get; set; }

        public int Type { get; set; }

        public float Amount { get; set; }
    }
}