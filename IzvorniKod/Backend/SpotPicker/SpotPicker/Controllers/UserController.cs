using Microsoft.AspNetCore.Mvc;
using SpotPicker.EFCore;
using SpotPicker.Models;
using SpotPicker.Services;

namespace SpotPicker.Controllers
{
    public class UserController : Controller
    {
        private _EFCore _db;
        private UserFunctions _userFunctions;
        private IEmailService _emailService;
        private IConfiguration _config;
        private EmailSender _emailSender;
        public UserController(_EFCore dataContext, IEmailService service, IConfiguration con)
        {
            _db = dataContext;
            _config = con;
            _userFunctions = new UserFunctions(dataContext, _config);
            _emailService = service;
            _emailSender = new EmailSender(_config, _emailService);
        }

        [HttpPost]
        [Route("api/[controller]/Register")]
        public IActionResult RegisterUser([FromBody] UserModel user)
        {
            /*
            try
            {
                _userFunctions.register(user);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            */

            EmailDto em = new EmailDto()
            {
                Body = user.Email,
                To = _config["EmailConfig:EmailUserNameSend"]!,
                From = _config["EmailConfig:EmailUserNameSend"]!,
                Subject = "Proba"
            };

            _emailService.SendEmail(em);
            return Ok();


        }

        [HttpGet]
        [Route("api/[controller]/verifyEmail")]
        public IActionResult verifyEmail(int id, string token)
        {
            try
            {
                bool result = _userFunctions.verifyEmail(id, token);
                if (result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }

                var odgovor = new CustomErrorResponse
                {
                    StatusCode = dogovoreniKod,
                    Message = poruka
                };

                return BadRequest(odgovor);
            }
        }
    }
}
