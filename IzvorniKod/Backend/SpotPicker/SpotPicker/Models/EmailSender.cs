using SpotPicker.Services;
using System.Security.Cryptography;
using System.Text;

namespace SpotPicker.Models
{
    public class EmailSender
    {
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        
        public EmailSender(IConfiguration config, IEmailService emailservice)
        {
            _config = config;
            _emailService = emailservice;
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

            string emailText = File.ReadAllText("assets2/emailVerification.txt");
            string emaildata = String.Format(emailText, url);

            EmailDto newEmail = new EmailDto()
            {
                To = email,
                From = _config["EmailConfig:EmailUserNameSend"]!,
                Subject = "Proba",
                Body = emaildata
            };

            _emailService.SendEmail(newEmail);
        } 
    }
}
