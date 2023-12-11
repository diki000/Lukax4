using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using SpotPicker.Models;

namespace SpotPicker.Services
{
    public class EmailService : IEmailService
    {

        public readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }
        public void SendEmail(EmailDto emailData)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(emailData.From));
            email.To.Add(MailboxAddress.Parse(emailData.To));
            email.Subject = emailData.Subject;
            email.Body = new TextPart(TextFormat.Html) { Text = emailData.Body };

            using var smtp = new SmtpClient();
            smtp.Connect(_config["EmailConfig:EmailHost"], 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config["EmailConfig:EmailUserNameLogIn"], _config["EmailConfig:EmailPassword"]);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
