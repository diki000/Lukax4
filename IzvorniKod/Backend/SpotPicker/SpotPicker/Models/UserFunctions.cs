using SpotPicker.EFCore;
using System.Collections.Specialized;
//using BCrypt.Net;

namespace SpotPicker.Models
{
    public class UserFunctions
    {
        private readonly _EFCore _db;
        public UserFunctions(_EFCore database)
        {
            _db = database;
        }

        public void register(UserModel user)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
            User newUser = new User(){
                Username = user.Username,
                Password = hashedPassword,
                Name = user.Name,
                Surname = user.Surname,
                IBAN = user.IBAN,
                Email = user.Email,
                IsEmailConfirmed = false,
                RoleID = user.RoleID
            };

            _db.User.Add(newUser);

            if (user.RoleID == 2) // ako je manager 
            {
                Manager newManager = new Manager()
                {
                    User = newUser,
                    ConfirmedByAdmin = false
                };

                _db.Manager.Add(newManager);
            }

            _db.SaveChanges();
        }

        public UserModel login(string username, string password)
        {
            // Find the user in the database by username
            User existingUser = _db.User.FirstOrDefault(user => user.Username == username);

            // If the user does not exist, throw an exception or handle the situation accordingly
            if (existingUser == null)
            {
                Console.Write("NEPOSTOJI OVAJ USER \n\n\n");


                //return 400; //vrati 400, user not found
                var ex = new Exception();
                ex.Data["Kod"] = 400;
                throw ex;
                //throw new Exception("User not found. Status code: 400");
            }


            if (existingUser != null)
            {
                Console.Write("\n\nPOSTOJI OVAJ USER\n\n");
                Console.Write(existingUser.Username);
                Console.Write("\n\n");
                Console.Write(existingUser.Password);
                Console.Write("\n\n");

            }

            // User-entered password
            string enteredPassword = password; // uzmi lozinku unesenu od strane usera na frontu
            string storedPasswordHash = existingUser.Password; // checkiraj lozinku iz baze
            // Verify the entered password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(enteredPassword, storedPasswordHash); // odradi hashing

            if (isPasswordValid)
            {
                Console.Write("VALJA LOZINKA NAKON HASHINGA \n\n");
            }
            else
            {
                Console.Write("NEVALJA LOZINKA NAKON HASHINGA \n\n");
            }

            UserModel korisnik = new UserModel();

            if (existingUser != null)
            {
                korisnik.Username = existingUser.Username;
                korisnik.Password = existingUser.Password;
                korisnik.Name = existingUser.Name;
                korisnik.Surname = existingUser.Surname;
                korisnik.IBAN = existingUser.IBAN;
                korisnik.Email = existingUser.Email;
                korisnik.IsEmailConfirmed = existingUser.IsEmailConfirmed;
                korisnik.RoleID = existingUser.RoleID;
            }

            //povezi ga s manager tablicom
            Manager managerCheck = _db.Manager.FirstOrDefault(m => m.UserId == existingUser.Id);

            if (isPasswordValid)
            {
                if(existingUser.IsEmailConfirmed == false)
                {
                    // throw new Exception(string.Format("{0} - {1}", statusMessage, statusCode));
                    //throw new Exception("Mail not confirmed. Status code: 401"); // nije potvrdjen mail
                    var ex = new Exception();
                    ex.Data["Kod"] = 401;
                    throw ex;

                }

                // ako je user vlasnik parkinga, provjeri je li potvrdjen od admina, ako nije returnaj error
                if(existingUser.RoleID == 2 && !managerCheck.ConfirmedByAdmin)
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = 403;
                    throw ex;
                    //throw new Exception("Owner not confirmed by admin. Status code: 403"); // vlasnik parkinga nije potvrdjen od admina
                }

                return korisnik; // AKO SVE VALJA, VRATI USERA NA FRONT
            }
            else
            {
                //throw new Exception("Incorrect password. Status code: 402"); //lozinka nevalja
                var ex = new Exception();
                ex.Data["Kod"] = 402;
                throw ex;
            }
        }
    }
}
