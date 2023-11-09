using SpotPicker.Models;

namespace SpotPicker.Services
{
    public interface IEmailService
    {
        void SendEmail(EmailDto emailData);
    }
}
