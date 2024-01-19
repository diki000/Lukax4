using SpotPicker.EFCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SpotPicker.Models
{
    public class WalletModel
    {
        public int WalletID { get; set; }
        public int UserID { get; set; }
        public float Balance { get; set; }
    }
}
