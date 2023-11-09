﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpotPicker.EFCore;
using SpotPicker.Models;
using SpotPicker.Services;

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
            _emailSender = new EmailSender(_config, _emailService);
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
        [Route("api/[controller]/UploadImage")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                string username = Request.Form["username"]!;
                var files = Request.Form.Files;

                await  _userFunctions.UpladImages(Request);

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
                bool result = _userFunctions.verifyEmail(id, token);
                if (result)
                {
                    return Redirect("http://localhost:4200/login");
                }
                else
                {
                    return StatusCode(413);
                }
            } catch(Exception e) { return StatusCode(413); }
        }
    }
}