using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("Parking")]
    public class Parking
    {
        [Key]
        public int Id { get; set; }
     
        [ForeignKey("Manager")]
        public int ManagerId { get; set; }
        public string Name { get; set; }
        public string Description {  get; set; }
        public string? idParkingImagePath { get; set; }

        public double PricePerHour {  get; set; }
        public int NumberOfBikePS {  get; set; }
    }
}