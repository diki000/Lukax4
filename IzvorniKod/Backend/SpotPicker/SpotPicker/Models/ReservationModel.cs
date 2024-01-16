using SpotPicker.EFCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SpotPicker.Models
{
    public class ReservationModel
    {
        public int ReservationID { get; set; }
        public int UserID { get; set; }
        public int ParkingSpaceID { get; set; }
        public int ParkingManagerID { get; set; }

        public DateTime ReservationDate { get; set; }
        public DateTime ReservationDuration { get; set; }
        public bool IsRepeating { get; set; }
    }
}
