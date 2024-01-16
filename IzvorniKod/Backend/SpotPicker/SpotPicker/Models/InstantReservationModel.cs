namespace SpotPicker.Models
{
    public class InstantReservationModel
    {
        public int UserId { get; set; }
        public int ParkingSpaceId { get; set; }
        public int ParkingManagerId { get; set; }

        public int Duration { get; set; }
        public DateTime Time { get; set; }
        public int PaymentType { get; set; }
        public int TransactionId { get; set; }
        public int Profile {  get; set; }
    } 
}
