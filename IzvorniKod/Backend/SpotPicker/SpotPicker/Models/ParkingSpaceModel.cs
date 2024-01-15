namespace SpotPicker.Models
{
    public class ParkingSpaceModel
    {
        public int ParkingId { get; set; }

        public int ParkingSpaceType { get; set; }
        public int hasSensor { get; set; }
        public int isOccupied { get; set; }
        public int reservationPossible { get; set; }
        public PointModel[]? points { get; set; }
    }
}
