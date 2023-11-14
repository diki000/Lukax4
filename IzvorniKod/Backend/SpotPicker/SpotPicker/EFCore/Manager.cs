using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("Manager")]
    public class Manager
    {
        [Key]
        [ForeignKey("User")]
        public int UserId { get; set; }

        public bool? ConfirmedByAdmin { get; set; } = null;
        public virtual User User { get; set; }

    }
}
