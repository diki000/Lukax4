using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SpotPicker.EFCore;
using SpotPicker.Models;
using SpotPicker.Services;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace SpotPicker.Controllers
{
    public class AdminController : Controller
    {
        private _EFCore _db;
        private AdminFunctions _adminFunctions;
        private IConfiguration _config;
        public AdminController(_EFCore dataContext, IConfiguration con)
        {
            _db = dataContext;
            _config = con;
            _adminFunctions = new AdminFunctions(dataContext, _config);
        }

        [HttpGet]
        [Route("api/[controller]/GetUnacceptedManagers")]
        public IActionResult GetUnacceptedManagers()
        {
            var t = _adminFunctions.GetUnacceptedManagers();
            return Ok(t);
        }

        [HttpGet]
        [Route("api/[controller]/AcceptManager")]
        public IActionResult AcceptManager(string username)
        {
            _adminFunctions.AcceptManager(username);
            return Ok();
        }

        [HttpGet]
        [Route("api/[controller]/DeclineManager")]
        public IActionResult DeclineManager(string username)
        {
            _adminFunctions.DeclineManager(username);
            return Ok();
        }
    }
}