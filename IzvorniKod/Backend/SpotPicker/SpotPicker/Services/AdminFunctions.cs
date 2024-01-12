using Microsoft.EntityFrameworkCore;
using SpotPicker.EFCore;
using SpotPicker.Models;

namespace SpotPicker.Services
{
    public class AdminFunctions
    {
        private readonly _EFCore _db;
        private readonly IConfiguration _config;
        public AdminFunctions(_EFCore database, IConfiguration config)
        {
            _db = database;
            _config = config;
        }

        public List<UserModel> GetUnacceptedManagers()
        {
            var temp = _db.Manager.Where(m => m.ConfirmedByAdmin == null).ToList();
            var res = new List<UserModel>();
            for (int i = 0; i < temp.Count; i++) {
                var u = _db.User.Where(x => x.Id == temp[i].UserId).FirstOrDefault();
                var userm = new UserModel()
                {
                    UserId = u.Id,
                    Username = u.Username,
                    Password = u.Password,
                    Name = u.Name,
                    Surname = u.Surname,
                    Email = u.Email,
                    IBAN = u.IBAN,
                    IsEmailConfirmed = u.IsEmailConfirmed,
                    RoleID = u.RoleID,
                    idImagePath = u.idImagePath
                };

                res.Add(userm);
            }

            return res;
        }

        public void AcceptManager(string username)
        {
            var user = _db.User.Where(u => u.Username == username).FirstOrDefault();
            _db.Manager.Where(m => m.UserId == user.Id).FirstOrDefault().ConfirmedByAdmin = true;
            _db.SaveChanges();
        }

        public void DeclineManager(string username)
        {
            var user = _db.User.Where(u => u.Username == username).FirstOrDefault();
            _db.Manager.Where(m => m.UserId == user.Id).FirstOrDefault().ConfirmedByAdmin = false;
            _db.SaveChanges();
        }
    }
}