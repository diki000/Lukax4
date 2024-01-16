using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private UserFunctions _userFunctions;
        public ParkingController(_EFCore dataContext, IConfiguration config)
        {
            _db = dataContext;
            _config = config;
            _parkingFunctions = new ParkingFunctions(dataContext,_config);
            _userFunctions = new UserFunctions(dataContext,_config);
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

        [HttpGet]
        [Route("api/[controller]/GetNearestParkingSpaceCoordinates")]
        public IActionResult GetNearestParkingSpaceCoordinates(int userId, double startLongitude, double startLatitude, double endLongitude, double endLatitude, int profile, int duration, int paymentType)
        {
            try
            {
                PointModel nearest = _parkingFunctions.GetNearestParkingSpaceCoordinates(userId, startLongitude, startLatitude, endLongitude, endLatitude, profile, duration, paymentType);
                

                //_parkingFunctions.
                return Ok(nearest);
            }
            catch (Exception e)
            {
                var statusCode = (int)e.Data["Kod"];
                return StatusCode(statusCode);
            }
        }
        [HttpGet]
        [Route("api/[controller]/DeleteParking")]
        public IActionResult deleteParking([FromQuery] int parkingId)
        {
            try
            {
                _parkingFunctions.deleteParking(parkingId);
                return Ok();
            }catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet]
        [Route("api/[controller]/GetParkingStatistics")]
        public IActionResult getParkingResults([FromQuery] int ownerId)
        {
            try
            {
                StatisticsInformation[] result = _parkingFunctions.getStatistics(ownerId);
                return Ok(result);
            }catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
