using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace SpotPicker.EFCore
{
    [Table("InstantReservation")]
    public class InstantReservation
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int ParkingSpaceId { get; set; }
        public int Duration { get; set; }
        public DateTime Time { get; set; }
        public int PaymentType { get; set; }
        public int Profile {  get; set; }
    }
}
