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

        public List<UserModel> GetAllUsers()
        {
            List<UserModel> allUsers = new List<UserModel>();
            var data = _db.User.ToList();
            for(int i = 0; i < data.Count; i++)
            {
                var userm = new UserModel()
                {
                    Id = data[i].Id,
                    Username = data[i].Username,
                    Password = data[i].Password,
                    Name = data[i].Name,
                    Surname = data[i].Surname,
                    Email = data[i].Email,
                    IBAN = data[i].IBAN,
                    IsEmailConfirmed = data[i].IsEmailConfirmed,
                    RoleID = data[i].RoleID,
                    idImagePath = data[i].idImagePath
                };

                allUsers.Add(userm);
            }

            return allUsers;
        }

        public void UpdateUser(UserModel user)
        {
            var userToUpdate = _db.User.Where(u => u.Id == user.Id).FirstOrDefault();
            bool usernameAvailable = true;
            bool emailAvailable = true;
            bool roleChanged = false;

            if (userToUpdate != null)
            {
                if(userToUpdate.Username != user.Username)
                {
                    usernameAvailable = !_db.User.Any(u => u.Username == user.Username);
                }

                if(userToUpdate.Email != user.Email)
                {
                    emailAvailable = !_db.User.Any(u => u.Email == user.Email);
                }

                if (!usernameAvailable || !emailAvailable)
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = !usernameAvailable ? 410 : 414; // 410 kad je nedostupno korisnicko ime, 414 kad je nedostupan mail
                    throw ex;
                }
                    if (!CheckIban(user.IBAN))
                    {
                        var ex = new Exception();
                        ex.Data["Kod"] = 412; // 412 je neispravan IBAN
                        throw ex;
                    }

                if(userToUpdate.RoleID != user.RoleID)
                {
                    roleChanged = true;
                }

                userToUpdate.Username = user.Username;
                userToUpdate.Password = user.Password;
                userToUpdate.Name = user.Name;
                userToUpdate.Surname = user.Surname;
                userToUpdate.IBAN = user.IBAN;
                userToUpdate.Email = user.Email;
                userToUpdate.IsEmailConfirmed = user.IsEmailConfirmed;
                userToUpdate.RoleID = user.RoleID;
                userToUpdate.idImagePath = user.idImagePath;


                if (roleChanged == true && user.RoleID == 2) 
                {
                    Manager newManager = new Manager()
                    {
                        User = userToUpdate
                    };

                    _db.Manager.Add(newManager);
                } else if(roleChanged == true && userToUpdate.RoleID == 1)
                {
                    var man = _db.Manager.Where(r => r.UserId == user.Id).FirstOrDefault();
                    _db.Manager.Remove(man);
                }

                _db.SaveChanges();

            }
        }

        public void DeleteUser(string username)
        {
            var userToDelete = _db.User.Where(u => u.Username.Equals(username)).FirstOrDefault();

            if(userToDelete != null)
            {
                if(userToDelete.RoleID == 2)
                {
                    var man = _db.Manager.Where(r => r.UserId == userToDelete.Id).FirstOrDefault();
                    if(man != null) { 
                        _db.Manager.Remove(man);
                    }
                }
                _db.User.Remove(userToDelete);
                _db.SaveChanges();
            }
        }

        public static bool CheckIban(string iban)
        {
            iban = iban.Replace(" ", "");

            iban = iban.Substring(4) + iban.Substring(0, 4);

            string digits = "";
            foreach (char c in iban)
            {
                if (char.IsLetter(c))
                {
                    int value = char.ToUpper(c) - 'A' + 10;
                    digits += value.ToString();
                }
                else
                {
                    digits += c;
                }
            }

            System.Numerics.BigInteger ibanNumber = System.Numerics.BigInteger.Parse(digits);

            int remainder = (int)(ibanNumber % 97);

            return remainder == 1;
        }
    }
}