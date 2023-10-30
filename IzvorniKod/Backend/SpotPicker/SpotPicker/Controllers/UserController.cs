using Microsoft.AspNetCore.Mvc;
using SpotPicker.EFCore;
using SpotPicker.Models;
using System;

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
        [Route("api/[controller]/AddNewUser")]
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
        public IActionResult Post([FromBody] UserModel user)
        {

            try
            {
                _userFunctions.login(user);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
