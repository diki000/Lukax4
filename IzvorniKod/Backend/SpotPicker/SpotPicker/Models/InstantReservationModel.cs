namespace SpotPicker.Models
{
    public class InstantReservationModel
    {
        public int UserId { get; set; }
        public int ParkingSpaceId { get; set; }
        public int Duration { get; set; }
        public DateTime Time { get; set; }
        public int PaymentType { get; set; }
        public int Profile {  get; set; }
    } 
}
