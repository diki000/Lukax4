using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SpotPicker.Controllers
{

    [ApiController]
    public class LoginController : ControllerBase
    {
        // GET: api/<LoginController>
        [HttpGet]
        [Route("api/[controller]/testing")]
        public IActionResult Get()
        {
            var message = "sent from backend";
            return Ok(message);
        }

        
    }
}
