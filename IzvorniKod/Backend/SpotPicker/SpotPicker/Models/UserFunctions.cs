using SpotPicker.EFCore;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using SpotPicker.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Text.RegularExpressions;

namespace SpotPicker.Models
{
    public class UserFunctions
    {
        private readonly _EFCore _db;
        private readonly IConfiguration _config;
        private EmailSender _emailSender;
        public UserFunctions(_EFCore database, IConfiguration config, IEmailService service)
        {
            _db = database;
            _config = config;
            _emailSender = new EmailSender(_config, service);
        }

        // funkcija za provjeru validnosti IBAN-a
        public static bool CheckIban(string iban)
        {
            iban = iban.Replace(" ", "");

            iban = iban.Substring(4) + iban.Substring(0, 4);

            string digits = "";
            foreach (char c in iban)
            {
                if (char.IsLetter(c))
                {
                    int value = char.ToUpper(c) - 'A' + 10;
                    digits += value.ToString();
                }
                else
                {
                    digits += c;
                }
            }

            System.Numerics.BigInteger ibanNumber = System.Numerics.BigInteger.Parse(digits);

            int remainder = (int)(ibanNumber % 97);

            return remainder == 1;
        }

        public void register(UserModel user)
        {
            bool usernameAvailable = !_db.User.Any(u => u.Username == user.Username);

            if (usernameAvailable)
            {
                var pattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
                Match m = Regex.Match(user.Password, pattern);
                if (!m.Success)
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = 411;
                    throw ex;
                }

                if (!CheckIban(user.IBAN))
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = 412;
                    throw ex;
                }

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
                    RoleID = user.RoleID,
                    idImagePath = ""
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
                var currentUser = _db.User.Where(u => u.Username == newUser.Username).FirstOrDefault();
                _emailSender.SendEmailConfirmation(currentUser.Id, currentUser.Email);
            }
            else
            {
                var ex = new Exception();
                ex.Data["Kod"] = 410;
                throw ex;
            }
        }

        public async Task UpladImages(HttpRequest request)
        {
            try
            {
                string filePath;
                string username = request.Form["username"]!;
                var file = request.Form.Files[0];

                if(file.Length > 0)
                {
                    string uniqueFileName = Guid.NewGuid().ToString();

                    string fileExtension = Path.GetExtension(file.FileName);

                    string fileName = uniqueFileName + fileExtension;

                    string uploadPath = Path.Combine("assets2", "images", "idPhoto");

                    if (!Directory.Exists(uploadPath))
                    {
                        Directory.CreateDirectory(uploadPath);
                    }

                    filePath = Path.Combine(uploadPath, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    var userUpdate = _db.User.Where(user => user.Username.Equals(username)).FirstOrDefault();
                    if(userUpdate != null)
                    {
                        userUpdate.idImagePath = filePath;
                    }

                }
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter("assets2/errorLog.txt"))
                {
                    writer.WriteLine(ex.Message);

                    // You can continue writing more lines or use other writer methods as needed.
                }
                throw new Exception(message: ex.Message);
            }

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
                    var currentUser = _db.User.Where(u => u.Id == id).FirstOrDefault();
                    currentUser.IsEmailConfirmed = true;
                    _db.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public UserModel changePassword(string email, string password)
        {
            //string email = JObject.Parse(JUserCredentials.ToString())["email"].toString();
            //string password = JObject.Parse(JUserCredentials.ToString())["password"].toString();

            string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

            var currentUser = _db.User.Where(u => u.Email == email).FirstOrDefault();
            currentUser.Password = hashedPassword;
            _db.SaveChanges();
            UserModel model = new UserModel()
            {
                Username = currentUser.Username,
                Password = "",
                Name = currentUser.Name,
                Surname = currentUser.Surname,
                IBAN = currentUser.IBAN,
                IsEmailConfirmed = currentUser.IsEmailConfirmed,
                RoleID = currentUser.RoleID,
            };

            return model;
        }

    }
}
