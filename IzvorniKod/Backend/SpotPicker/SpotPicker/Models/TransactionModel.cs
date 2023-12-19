using SpotPicker.EFCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SpotPicker.Models
{
    public class TransactionModel
    {
        public int ID { get; set; }

        public int UserID { get; set; }

        public int Type { get; set; }

        public float Amount { get; set; }

        public DateTime TimeAndDate { get; set; }
    }
}
