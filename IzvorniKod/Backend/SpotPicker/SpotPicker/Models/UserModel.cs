namespace SpotPicker.Models
{
    public class UserModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        public string IBAN { get; set; }
        public string Email { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public int RoleID { get; set; }
        public string? idImagePath { get; set; }
        public string? AccessToken { get; set; } = null;
    }
}
