using SpotPicker.EFCore;
using System.Security.Cryptography;
using System.Text;

namespace SpotPicker.Models
{
    public class UserFunctions
    {
        private readonly _EFCore _db;
        private readonly IConfiguration _config;
        public UserFunctions(_EFCore database, IConfiguration config)
        {
            _db = database;
            _config = config;
        }

        public void register(UserModel user)
        {
            User newUser = new User(){
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email
            };

            _db.User.Add(newUser);
            _db.SaveChanges();
        }

        public bool verifyEmail(int id, string tokenFromUrl)
        {
            string hashKey = _config["SecredHashKey"]!;
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(id.ToString() + hashKey));
                string recreatedToken = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();

                if (recreatedToken == tokenFromUrl)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
