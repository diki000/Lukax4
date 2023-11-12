using SpotPicker.EFCore;
using SpotPicker.Models;
using System.Security.Cryptography;
using System.Text;

namespace SpotPicker.Services
{
    public class EmailSender
    {
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly _EFCore _db;

        public EmailSender(IConfiguration config, IEmailService emailservice, _EFCore db)
        {
            _config = config;
            _emailService = emailservice;
            _db = db;
        }

        public void SendEmailConfirmation(int id, string email)
        {
            string hashKey = _config["SecredHashKey"]!;
            string idString = id.ToString();
            string token;

            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(idString + hashKey));
                token = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }

            string url = "https://localhost:7020/api/User/verifyEmail?id=" + id.ToString() + "&token=" + token;

            string emailText = File.ReadAllText("assets2/emailVerification.html");
            string emaildata = string.Format(emailText, url);

            EmailDto newEmail = new EmailDto()
            {
                To = email,
                From = _config["EmailConfig:EmailUserNameSend"]!,
                Subject = "Potvrda registracije",
                Body = emaildata
            };

            _emailService.SendEmail(newEmail);
        }

        public int SendChangePasswordCode(string email)
        {
            const string allowedChars = "0123456789";

            var result = new StringBuilder(6);

            using (var rng = new RNGCryptoServiceProvider())
            {
                var buffer = new byte[sizeof(uint)];

                while (result.Length < 6)
                {

                    rng.GetBytes(buffer);
                    uint randomNumber = BitConverter.ToUInt32(buffer, 0);

                    int index = (int)(randomNumber % allowedChars.Length);

                    result.Append(allowedChars[index]);
                }
            }

            string emailText = File.ReadAllText("assets2/changePasswordEmail.html");
            string emailData = string.Format(emailText, result.ToString());

            EmailDto newEmail = new EmailDto()
            {
                To = email,
                From = _config["EmailConfig:EmailUserNameSend"]!,
                Subject = "Promjena lozinke",
                Body = emailData
            };

            _emailService.SendEmail(newEmail);

            return int.Parse(result.ToString());


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
    }
}
