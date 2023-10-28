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
    }
}
