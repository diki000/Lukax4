using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SpotPicker.EFCore;
using SpotPicker.Models;
using SpotPicker.Services;
using System.Text.Json.Nodes;

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
            _userFunctions = new UserFunctions(dataContext, _config, service);
            _emailService = service;
            _emailSender = new EmailSender(_config, _emailService, dataContext);
        }

        [HttpPost]
        [Route("api/[controller]/Register")]
        public IActionResult RegisterUser([FromBody] UserModel user)
        {

            try
            {
                _userFunctions.register(user);
                return Ok();
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }
        [HttpPost]
        [Route("api/[controller]/Login")]
        public IActionResult Login([FromBody] JsonObject JUserCredentials)
        {

            try
            {
                string username = JObject.Parse(JUserCredentials.ToString())["username"].ToString();
                string password = JObject.Parse(JUserCredentials.ToString())["password"].ToString();


                //_userFunctions.login(username, password);
                UserModel korisnik = _userFunctions.login(username, password);
                return Ok(korisnik);
            }
            catch (Exception e)
            {
                //return BadRequest(e.Message);
                //var statusCode = exc.Data.Keys.Cast<string>().Single();  // retrieves "3"
                //var statusMessage = exc.Data[statusCode].ToString();
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }
        [HttpPost]
        [Route("api/[controller]/UploadImage")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                string username = Request.Form["username"]!;
                var files = Request.Form.Files;

                await _userFunctions.UpladImages(Request);

                return Ok();
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter("assets2/errorLog.txt"))
                {
                    writer.WriteLine(ex.Message);

                }
                Console.WriteLine(ex.Message + ex.StackTrace);
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("api/[controller]/verifyEmail")]
        public IActionResult verifyEmail(int id, string token)
        {
            try
            {
                bool result = _emailSender.verifyEmail(id, token);
                if (result)
                {
                    return Redirect("http://localhost:4200/login");
                }
                else
                {
                    return StatusCode(413);
                }
            } catch (Exception e) { return StatusCode(413); }
        }

        [HttpGet]
        [Route("api/[controller]/GetRecoveryEmail")]
        public IActionResult getRecoveryEmail(string email)
        {
            try
            {
                var code = _emailSender.SendChangePasswordCode(email);
                return Ok(code);
            } catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("api/[controller]/ChangePassword")]
        public IActionResult changePassword([FromBody] JsonObject JUserCredentials)
        {
            try
            {
                string email = JObject.Parse(JUserCredentials.ToString())["email"].ToString();
                string password = JObject.Parse(JUserCredentials.ToString())["password"].ToString();
                UserModel result = _userFunctions.changePassword(email, password);
                return Ok(result);

            }
            catch (Exception e)
            {
                //return BadRequest(e.Message);
                //var statusCode = exc.Data.Keys.Cast<string>().Single();  // retrieves "3"
                //var statusMessage = exc.Data[statusCode].ToString();
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }
    }
}
