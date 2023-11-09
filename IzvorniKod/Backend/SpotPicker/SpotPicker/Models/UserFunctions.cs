using SpotPicker.EFCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;

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
            bool usernameAvailable = !_db.User.Any(u => u.Username == user.Username);

            if (usernameAvailable)
            {
                string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
                User newUser = new User()
                {
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
            else
            {
                // korisnicko ime nije dostupno
                // vrati dogovoreni kod i prikladnu poruku

                var ex = new Exception(string.Format("{0} - {1}", poruka, dogovoreniKod));
                ex.Data.Add(410, "Korisničko ime nije dostupno.");
                throw ex;
            }
        }
    }
}
