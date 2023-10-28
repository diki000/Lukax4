using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.Models
{
    public class ManagerModel
    {
        public bool ConfirmedByAdmin { get; set; } 
        public int UserId { get; set; }
    }
}
