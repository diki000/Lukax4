using SpotPicker.EFCore;
using BCrypt.Net;

namespace SpotPicker.Models
{
    public class UserFunctions
    {
        private readonly _EFCore _db;
        public UserFunctions(_EFCore database)
        {
            _db = database;
        }

        public void register(UserModel user)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
            User newUser = new User(){
                Username = user.Username,
                Password = hashedPassword,
                Name = user.Name,
                Surname = user.Surname,
                IBAN = user.IBAN,
                Email = user.Email,
                IsEmailConfirmed = false,
                RoleID = user.RoleID
            };

            _db.User.Add(newUser);

            if (user.RoleID == 2) // ako je manager 
            {
                Manager newManager = new Manager()
                {
                    User = newUser,
                    ConfirmedByAdmin = false
                };

                _db.Manager.Add(newManager);
            }

            _db.SaveChanges();
        }

        public Boolean login(UserModel user)
        {
            // Find the user in the database by username
            var existingUser = _db.User.FirstOrDefault(u => u.Name == user.Name && u.Surname == user.Surname);

            // If the user does not exist, throw an exception or handle the situation accordingly
            if (existingUser == null)
            {
                throw new Exception("User not found");
            }

            // Here you can perform additional checks, such as comparing passwords, implementing hashing and salting, etc.
            // For simplicity, let's assume the check is successful
            // KOMENTAR: dodaj hashing i salting sa Filipovog backenda registera
            // KOMENTAR PS: checkiraj preko usernamea i passworda uz ovo hashanje i saltanje

            // Return the user model if the login is successful
            return true;
        }
    }
}
