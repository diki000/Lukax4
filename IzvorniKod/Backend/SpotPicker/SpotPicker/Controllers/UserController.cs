using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SpotPicker.EFCore;
using SpotPicker.Models;
using System;
using System.Text.Json.Nodes;
using System.Xml.Linq;

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
                return BadRequest(e.Message);
                //var statusCode = exc.Data.Keys.Cast<string>().Single();  // retrieves "3"
                //var statusMessage = exc.Data[statusCode].ToString();
                //var statusCode = (int)e.Data[""];
                //return StatusCode(statusCode);
            }
        }
    }
}
