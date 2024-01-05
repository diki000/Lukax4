namespace SpotPicker.Models
{
    public class ParkingSpaceModel
    {
        public int ParkingId { get; set; }

        public int ParkingSpaceType { get; set; }
        public bool hasSensor { get; set; }
        public bool isOccupied { get; set; }
        public int idPoint1 { get; set; }
        public int idPoint2 { get; set; }
        public int idPoint3 { get; set; }
        public int idPoint4 { get; set; }
        public int idPoint5 { get; set; }
    }
}
