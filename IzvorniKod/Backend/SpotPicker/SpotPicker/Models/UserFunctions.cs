using SpotPicker.EFCore;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using SpotPicker.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Text.RegularExpressions;
using System.Text.Json.Nodes;

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
        public bool CheckIban(string iban)
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

        public bool checkPasswordRegex(string password)
        {
            // TODO: promijeni regex da bude konzistentno sa zmakovim
            var pattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
            Match m = Regex.Match(password, pattern);
            if (!m.Success)
            {
                return false;
            } else
            {
                return true;
            }
        }

        public void register(UserModel user)
        {
            bool usernameAvailable = !_db.User.Any(u => u.Username == user.Username);
            bool emailAvailable = !_db.User.Any(u => u.Email == user.Email);

            if (usernameAvailable && emailAvailable)
            {
                if (!checkPasswordRegex(user.Password))
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = 411; // 411 je slaba lozinka
                    throw ex;
                }

                if (!CheckIban(user.IBAN))
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = 412; // 412 je neispravan IBAN
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
                var currentUser = _db.User.Where(u => u.Username == newUser.Username).FirstOrDefault();
                _emailSender.SendEmailConfirmation(currentUser.Id, currentUser.Email);
            }
            else
            {
                var ex = new Exception();
                ex.Data["Kod"] = !usernameAvailable ? 410 : 414; // 410 kad je nedostupno korisnicko ime, 414 kad je nedostupan mail
                throw ex;
            }
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
