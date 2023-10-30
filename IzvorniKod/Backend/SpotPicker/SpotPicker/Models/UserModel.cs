namespace SpotPicker.Models
{
    public class UserModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        // slika osobne ?
        public string IBAN { get; set; }
        public string Email { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public int RoleID { get; set; }
    }
}
