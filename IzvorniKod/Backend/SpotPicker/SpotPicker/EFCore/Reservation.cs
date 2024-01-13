using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("Reservation")]
    public class Reservation
    {
        [Key]
        public int ReservationID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; } //JEL TREBA OVO?

        [ForeignKey("ParkingSpace")]
        public int ParkingSpaceID { get; set; }
        public virtual ParkingSpace ParkingSpace { get; set; } //JEL TREBA OVO?
        public DateTime ReservationDate { get; set; }
        public DateTime ReservationDuration { get; set; }
        public bool IsRepeating { get; set; }    
    }
}
