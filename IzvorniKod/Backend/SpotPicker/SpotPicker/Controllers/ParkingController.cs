using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SpotPicker.EFCore;
using SpotPicker.Models;
using SpotPicker.Services;
using System.Text.Json.Nodes;

namespace SpotPicker.Controllers
{
    public class ParkingController : Controller
    {
        private _EFCore _db;
        private IConfiguration _config;
        private ParkingFunctions _parkingFunctions;

        public ParkingController(_EFCore dataContext, IConfiguration config)
        {
            _db = dataContext;
            _config = config;
            _parkingFunctions = new ParkingFunctions(dataContext,_config);
        }
        [HttpPost]
        [Route("api/[controller]/AddNewParking")]
        public IActionResult AddNewParking([FromBody] ParkingModel parking)
        {
            try
            {
                _parkingFunctions.addNewParking(parking);
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("api/[controller]/GetAllParkings")]
        public IActionResult GetAllParkings()
        {
            try
            {
                ParkingModel[] result = _parkingFunctions.getAllParkings();
                return Ok(result);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
