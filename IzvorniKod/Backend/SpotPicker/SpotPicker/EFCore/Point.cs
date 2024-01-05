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

        public int Longitude { get; set; }
        public int Latitude { get; set; }

    }
}