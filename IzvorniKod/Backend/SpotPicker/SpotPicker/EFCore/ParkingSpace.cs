using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("ParkingSpace")]
    public class ParkingSpace
    {
        [Key]
        public int Id {  get; set; }
        [ForeignKey("Parking")]
        public int ParkingId { get; set; }
        public int ParkingManagerId { get; set; }
        public int ParkingSpaceType { get; set; }
        public int hasSensor { get; set; }
        public int isOccupied { get; set; }
        public int reservationPossible { get; set; }

        public virtual List<Reservation> Reservations { get; set; }
    }
}