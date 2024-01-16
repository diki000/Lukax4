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
                    return Redirect("https://spotpicker.online/login");
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

        [HttpGet]
        [Route("api/[controller]/GetWallet")]
        public IActionResult getWallet(int id)
        {
            try
            { 
                WalletModel wallet = _userFunctions.getWallet(id);
                return Ok(wallet);

            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }

        [HttpGet]
        [Route("api/[controller]/GetLast5Transactions")]
        public IActionResult GetLast5Transactions(int id)
        {
            try
            {
                List<TransactionModel> transactions = _userFunctions.getTransactions(id);
                return Ok(transactions);

            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }

        [HttpPost]
        [Route("api/[controller]/addPayment")]
        public IActionResult addPayment([FromBody] PaymentModel payment)
        {
            try
            {
                _userFunctions.newPayment(payment.Id, payment.Amount);
                return Ok();
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }

        [HttpPost]
        [Route("api/[controller]/payForReservation")]
        public IActionResult payForReservation([FromBody] PaymentModel payment)
        {
            try
            {
                _userFunctions.payForReservation(payment.Id, payment.Amount);
                return Ok();
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }

        [HttpGet]
        [Route("api/[controller]/getAllReservationsForChosenPlaces")]
        public IActionResult getReservations([FromQuery] List<int> numbers)
        {
            try
            {
                List<Tuple<int, DateTime, DateTime>> reservationsForCalendar = _userFunctions.checkReservations(numbers);
                return Ok(reservationsForCalendar);
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }

        [HttpPost]
        [Route("api/[controller]/getAllFreePlacesForGivenTime")]
        public IActionResult getAllFreePlacesForGivenTime([FromBody] JsonObject obj)
        {
            try
            {
                DateTime reservationDate = DateTimeOffset.Parse( JObject.Parse(obj.ToString())["start"].ToString()).UtcDateTime;
                DateTime reservationDuration = DateTimeOffset.Parse(JObject.Parse(obj.ToString())["end"].ToString()).UtcDateTime;
                
                List<int> freePlaces = _userFunctions.getAllAvailableSpots(reservationDate, reservationDuration);
                
                return Ok(freePlaces);
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }

        [HttpPost]
        [Route("api/[controller]/makeReservation")]
        public IActionResult makeReservation([FromBody] JsonObject obj)
        {
            try
            {
                int userId = int.Parse( JObject.Parse(obj.ToString())["userId"].ToString());
                int psId = int.Parse(JObject.Parse(obj.ToString())["psId"].ToString());
                DateTime rDate = DateTimeOffset.Parse(JObject.Parse(obj.ToString())["rDate"].ToString()).UtcDateTime;
                DateTime rDuration = DateTimeOffset.Parse(JObject.Parse(obj.ToString())["rDuration"].ToString()).UtcDateTime;
                bool repeat = bool.Parse(JObject.Parse(obj.ToString())["repeat"].ToString());
                bool payedWithCard = bool.Parse(JObject.Parse(obj.ToString())["payedWithCard"].ToString());
                int pmID = int.Parse(JObject.Parse(obj.ToString())["pmID"].ToString());
                _userFunctions.makeReservation(userId, psId, rDate, rDuration, repeat, payedWithCard, pmID);
                return Ok();
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }
    }
}
