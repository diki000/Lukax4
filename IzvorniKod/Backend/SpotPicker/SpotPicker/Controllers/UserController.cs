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
        // GET: api/<LoginController>
        [HttpGet]
        [Route("api/[controller]/testing")]
        public IActionResult Get()
        {

            var user = _db.User.ToList();
            var message = "proba novi branch";

            user[0].Name = "Dodm";

            _db.SaveChanges();

            return Ok(user);
        }

        [HttpPost]
        [Route("api/[controller]/Register")]
        public IActionResult Post([FromBody] UserModel user)
        {

            try
            {
                _userFunctions.register(user);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("api/[controller]/Login")]
        public IActionResult LoginPost([FromBody] UserModel user)
        {
            try
            {
                bool userExists = _userFunctions.login(user);

                if (userExists)
                {
                    return Ok("User exists in the database");
                }
                else
                {
                    return BadRequest("User does not exist in the database");
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
