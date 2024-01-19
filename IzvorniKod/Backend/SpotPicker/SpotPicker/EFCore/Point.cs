using SpotPicker.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.EFCore
{
    [Table("Point")]
    public class Point
    {
        [Key]
        public int Id { get; set; }

        public int ParkingSpaceId { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }

    }
}