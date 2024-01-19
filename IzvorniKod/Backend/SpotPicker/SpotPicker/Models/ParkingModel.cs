using System.ComponentModel.DataAnnotations.Schema;

namespace SpotPicker.Models
{
    public class ParkingModel
    {
        public int ParkingId { get; set; }
        public int ManagerId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? idParkingImagePath { get; set; }

        // cjenik?
        public double PricePerHour { get; set; }
        public int NumberOfBikePS { get; set; }

        public ParkingSpaceModel[]? parkingSpaces { get; set; }
    }
}
