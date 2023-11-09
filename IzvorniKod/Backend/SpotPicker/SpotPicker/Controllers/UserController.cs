using Microsoft.AspNetCore.Mvc;
using SpotPicker.EFCore;
using SpotPicker.Models;

namespace SpotPicker.Controllers
{
    public class UserController : Controller
    {
        private _EFCore _db;
        private UserFunctions _userFunctions;
        public UserController(_EFCore dataContext)
        {
            _db = dataContext;
            _userFunctions = new UserFunctions(dataContext);
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
                var kod = exc.Data.Keys.Cast<string>().Single();
                var poruka = exc.Data[statusCode].ToString();

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
