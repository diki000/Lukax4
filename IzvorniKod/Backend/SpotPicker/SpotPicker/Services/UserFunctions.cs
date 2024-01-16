using SpotPicker.EFCore;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Text.RegularExpressions;
using SpotPicker.Models;
using System.Runtime.InteropServices;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace SpotPicker.Services
{
    public class UserFunctions
    {
        private readonly _EFCore _db;
        private readonly IConfiguration _config;
        private EmailSender _emailSender;
        public UserFunctions(_EFCore database, IConfiguration config, IEmailService service)
        {
            _db = database;
            _config = config;
            _emailSender = new EmailSender(_config, service,  database);
        }

        public UserFunctions(_EFCore database, IConfiguration config)
        {
            _db = database;
            _config = config;
        }

        // funkcija za provjeru validnosti IBAN-a
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
                korisnik.UserId = existingUser.Id;
                korisnik.Username = existingUser.Username;
                korisnik.Name = existingUser.Name;
                korisnik.Surname = existingUser.Surname;
                korisnik.IBAN = existingUser.IBAN;
                korisnik.Email = existingUser.Email;
                korisnik.IsEmailConfirmed = existingUser.IsEmailConfirmed;
                korisnik.RoleID = existingUser.RoleID;
                korisnik.AccessToken = GetToken(korisnik, existingUser.Id);
            }

            //povezi ga s manager tablicom
            Manager managerCheck = _db.Manager.FirstOrDefault(m => m.UserId == existingUser.Id);

            if (isPasswordValid)
            {
                if (existingUser.IsEmailConfirmed == false)
                {
                    // throw new Exception(string.Format("{0} - {1}", statusMessage, statusCode));
                    //throw new Exception("Mail not confirmed. Status code: 401"); // nije potvrdjen mail
                    var ex = new Exception();
                    ex.Data["Kod"] = 401;
                    throw ex;

                }

                // ako je user vlasnik parkinga, provjeri je li potvrdjen od admina, ako nije returnaj error
            if (existingUser.RoleID == 2 && managerCheck.ConfirmedByAdmin != null && managerCheck.ConfirmedByAdmin == false)
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

        private string GetToken(UserModel korisnik, int Id)
        {
            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _config["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserId", Id.ToString()),
                        new Claim("Username", korisnik.Username),
                        new Claim("Name", korisnik.Name),
                        new Claim("Email", korisnik.Email),
                        new Claim("RoleID", korisnik.RoleID.ToString()),
                        new Claim("Surname", korisnik.Surname)
                    };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddMinutes(10),
                signingCredentials: signIn);

            string Token = new JwtSecurityTokenHandler().WriteToken(token);
            return Token;
        }

        public bool checkPasswordRegex(string password)
        {
            var pattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
            Match m = Regex.Match(password, pattern);
            if (!m.Success)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        public void register(UserModel user)
        {
            try {
                bool usernameAvailable = !_db.User.Any(u => u.Username == user.Username);
                bool emailAvailable = !_db.User.Any(u => u.Email == user.Email);

                if (usernameAvailable && emailAvailable)
                {
                    if (!checkPasswordRegex(user.Password))
                    {
                        var ex = new Exception();
                        ex.Data["Kod"] = 411; // 411 je slaba lozinka
                        throw ex;
                    }

                    if (!CheckIban(user.IBAN))
                    {
                        var ex = new Exception();
                        ex.Data["Kod"] = 412; // 412 je neispravan IBAN
                        throw ex;
                    }

                    // TODO: provjeri ispravnost maila

                    string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
                    User newUser = new User()
                    {
                        
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
                            User = newUser
                        };

                        _db.Manager.Add(newManager);
                    }

                    Wallet newWallet = new Wallet()
                    {
                        User = newUser,
                        Balance = 0

                    };

                    _db.Wallets.Add(newWallet);

                    _db.SaveChanges();
                    var currentUser = _db.User.Where(u => u.Username == newUser.Username).FirstOrDefault();
                    _emailSender.SendEmailConfirmation(currentUser.Id, currentUser.Email);
                }
                else
                {
                    var ex = new Exception();
                    ex.Data["Kod"] = !usernameAvailable ? 410 : 414; // 410 kad je nedostupno korisnicko ime, 414 kad je nedostupan mail
                    throw ex;
                }
            } catch(Exception e) {
                throw e;
            }
            
        }

        public async Task UpladImages(HttpRequest request)
        {
            try
            {
                string filePath;
                string username = request.Form["username"]!;
                var file = request.Form.Files[0];

                if (file.Length > 0)
                {
                    string uniqueFileName = Guid.NewGuid().ToString();

                    string fileExtension = Path.GetExtension(file.FileName);

                    string fileName = uniqueFileName + fileExtension;

                    string uploadPath = Path.Combine("assets2", "images", "idPhoto");

                    if (!Directory.Exists(uploadPath))
                    {
                        Directory.CreateDirectory(uploadPath);
                    }

                    filePath = Path.Combine(uploadPath, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    var userUpdate = _db.User.Where(user => user.Username.Equals(username)).FirstOrDefault();
                    if (userUpdate != null)
                    {
                        userUpdate.idImagePath = filePath;
                    }

                }
            }
            catch (Exception ex)
            {
                using (StreamWriter writer = new StreamWriter("assets2/errorLog.txt"))
                {
                    writer.WriteLine(ex.Message);

                    // You can continue writing more lines or use other writer methods as needed.
                }
                throw new Exception(message: ex.Message);
            }

            _db.SaveChanges();
        }

        public UserModel changePassword(string email, string password)
        {
            //string email = JObject.Parse(JUserCredentials.ToString())["email"].toString();
            //string password = JObject.Parse(JUserCredentials.ToString())["password"].toString();

            string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

            var currentUser = _db.User.Where(u => u.Email == email).FirstOrDefault();
            currentUser.Password = hashedPassword;
            _db.SaveChanges();
            UserModel model = new UserModel()
            {
                Username = currentUser.Username,
                Password = "",
                Name = currentUser.Name,
                Surname = currentUser.Surname,
                IBAN = currentUser.IBAN,
                IsEmailConfirmed = currentUser.IsEmailConfirmed,
                RoleID = currentUser.RoleID,
            };

            return model;
        }

        public WalletModel getWallet(int id)
        {
            Wallet existingWallet = _db.Wallets.FirstOrDefault(wallet => wallet.UserID == id);

            if (existingWallet == null)
            {
                Console.Write("NEPOSTOJI OVAJ WALLET \n\n\n");
                var ex = new Exception();
                ex.Data["Kod"] = 400;
                throw ex;
            }

            else
            {
                WalletModel noviNovcanik = new WalletModel();

                noviNovcanik.UserID = id;
                noviNovcanik.WalletID = existingWallet.WalletID;
                noviNovcanik.Balance = existingWallet.Balance;

                return noviNovcanik;
            }
        }

        public List<TransactionModel> getTransactions(int id)
        {
            // Retrieve the last 5 transactions for the user with the specified id
            List<Transaction> transakcije = _db.Transactions
                .Where(t => t.UserID == id)
                .ToList();

            // Convert Transaction entities to TransactionModel (if necessary)
            List<TransactionModel> transactionModels = transakcije.Select(t => new TransactionModel
            {
                ID = t.ID,
                UserID = t.UserID,
                Type = t.Type,
                Amount = t.Amount,
                TimeAndDate = t.TimeAndDate
            }).ToList();

            return transactionModels;
        }

        public void newPayment(int id, float paymentAmount)
        {
            Wallet userWallet = _db.Wallets.FirstOrDefault(w => w.UserID == id);

            if (userWallet == null)
            {
                Console.WriteLine("NE POSTOJI USER >> ");
                Console.WriteLine(id);
                var ex = new Exception("Wallet not found for the user.");
                ex.Data["Code"] = 400;
                throw ex;
            }

            // Update the wallet balance
            userWallet.Balance += paymentAmount;

            // Create a new transaction
            Transaction transaction = new Transaction
            { // Generate a random ID for the transaction
                UserID = id,
                Type = 1,
                Amount = paymentAmount,
                TimeAndDate = DateTime.UtcNow // Current date and time
            };

            // Add the new transaction to the DbSet
            _db.Transactions.Add(transaction);

            // Save the changes to the database
            _db.SaveChanges();
        }

        public int payForReservation(int id, float amount)
        {
            int transactionId = 0;
            Wallet userWallet = _db.Wallets.FirstOrDefault(w => w.UserID == id);

            if (userWallet == null)
            {
                Console.WriteLine("NE POSTOJI USER >> ");
                Console.WriteLine(id);
                var ex = new Exception("Wallet not found for the user.");
                ex.Data["Code"] = 400;
                throw ex;
            }


            if (userWallet.Balance >= amount)
            {
                userWallet.Balance -= amount;
            } else
            {
                var ex = new Exception();
                ex.Data["Kod"] = 421; // nedovoljno na racunu
                throw ex;
            }

            Transaction transaction = new Transaction
            { 
                UserID = id,
                Type = 0,
                Amount = amount,
                TimeAndDate = DateTime.UtcNow 
            };

            _db.Transactions.Add(transaction);

            _db.SaveChanges();
            transactionId = transaction.ID;
            return transactionId;

        }

        public List<Tuple<int, DateTime, DateTime>> checkReservations(List<int> ids)
        {
            try
            {
                // Validate input
                if (ids == null || !ids.Any())
                {
                    var ex = new Exception("Given dataset isn't a list of IDs.");
                    ex.Data["Code"] = 400;
                    throw ex;
                }

                // Get reserved dates and duration times for each parking space from frontend
                List<Tuple<int, DateTime, DateTime>> reservedTimes = new List<Tuple<int, DateTime, DateTime>>();

                foreach (var parkingSpaceId in ids)
                {
                    // Find reservations for the parking space
                    var reservations = _db.Reservations
                        .Where(r => r.ParkingSpaceID == parkingSpaceId &&
                                    r.ReservationDate >= DateTimeOffset.UtcNow)
                        .Select(r => Tuple.Create(parkingSpaceId, r.ReservationDate, r.ReservationDuration))
                        .ToList();

                    // Add reservations to the reservedTimes list
                    reservedTimes.AddRange(reservations);
                }

                return reservedTimes;
            }
            catch (Exception e)
            {
                var ex = new Exception("Something went wrong.");
                ex.Data["Code"] = 401;
                throw ex;
            }
        }


        public List<int> getAllAvailableSpots(DateTime reservationDate, DateTime reservationDuration)
        {
            try
            {
                // Find all reservations that overlap with the specified period
                var overlappingReservations = _db.Reservations
                    .Where(r => (r.ReservationDate <= reservationDate && r.ReservationDuration >= reservationDate) ||
                                (r.ReservationDate <= reservationDuration && r.ReservationDuration >= reservationDuration) ||
                                (r.ReservationDate >= reservationDate && r.ReservationDuration <= reservationDuration)) 
                    .Select(r => r.ParkingSpaceID)
                    .ToList();

                // Find all parking spaces that are NOT in the list of overlapping reservations
                var availableSpots = _db.ParkingSpaces
                    .Where(ps => !overlappingReservations.Contains(ps.Id) && ps.reservationPossible == 1)
                    .Select(ps => ps.Id)
                    .ToList();

                return availableSpots;
            }
            catch (Exception e)
            {
                var ex = new Exception("Something went wrong.");
                ex.Data["Code"] = 401;
                throw ex;
            }
        }
        public void makeReservation(int userId, int psId, DateTime rDate, DateTime rDuration, bool repeat, bool payedWithCard, int pmID)
        {
            try
            {
                // Check if the given userId exists in the database
                if (!_db.User.Any(u => u.Id == userId))
                {
                    var ex = new Exception("User with the given ID does not exist.");
                    ex.Data["Code"] = 402;
                    throw ex;
                }

                // Check if the given psId exists in the database
                if (!_db.ParkingSpaces.Any(ps => ps.Id == psId))
                {
                    var ex = new Exception("Parking space with the given ID does not exist.");
                    ex.Data["Code"] = 403;
                    throw ex;
                }

                // Generate a unique reservation ID
                int reservationId = Math.Abs((int)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds.GetHashCode());

                // Create a new ReservationModel
                Reservation reservation = new Reservation
                {
                    ReservationID = reservationId,
                    UserID = userId,
                    ParkingSpaceID = psId,
                    ParkingManagerID = pmID,
                    ReservationDate = rDate,
                    ReservationDuration = rDuration,
                    IsRepeating = repeat,
                    PayedWithCard = payedWithCard
                };


                // Check if a reservation with the given criteria exists in the database
                bool reservationExists = _db.Reservations.Any(r =>
                    r.ParkingSpaceID == psId &&
                    r.ReservationDate == rDate &&
                    r.ReservationDuration == rDuration
                );

                if (reservationExists)
                {
                    var ex = new Exception("Reservation already exists.");
                    ex.Data["Code"] = 405;
                    throw ex;
                }

                // Check if there are overlapping reservations for the given parking space
                bool hasOverlappingReservations = _db.Reservations.Any(r =>
                        r.ParkingSpaceID == reservation.ParkingSpaceID &&
                        ((r.ReservationDate <= reservation.ReservationDate && r.ReservationDuration >= reservation.ReservationDate) ||
                        (r.ReservationDate <= reservation.ReservationDuration && r.ReservationDuration >= reservation.ReservationDuration) ||
                        (r.ReservationDate >= reservation.ReservationDate && r.ReservationDuration <= reservation.ReservationDuration))
                    );

                // Check if there are overlapping reservations for the parking space
                if (hasOverlappingReservations)
                {
                    var ex = new Exception("Overlapping reservations exist for the selected time period.");
                    ex.Data["Code"] = 406;
                    throw ex;
                }

                // Calculate the total parking price
                double userHours = (rDuration - rDate).TotalMinutes / 60.0;
                Console.WriteLine("userHours " + userHours);
                int parkingId = _db.ParkingSpaces.FirstOrDefault(p => p.Id == psId)?.Id ?? 0;
                Console.WriteLine("parkingId " + parkingId);
                double pricePerHour = _db.Parkings.FirstOrDefault(p => p.Id == parkingId)?.PricePerHour ?? 0;
                Console.WriteLine("pricePerHour " + pricePerHour);
                double parkingPrice = userHours * pricePerHour;
                Console.WriteLine("parkingPrice " + parkingPrice);
                double totalParkingPrice = Math.Round(parkingPrice, 2);
                Console.WriteLine("totalParkingPrice" + totalParkingPrice);


                // Check if the user has enough money in the wallet
                Wallet userWallet = _db.Wallets.FirstOrDefault(w => w.UserID == userId);
                if (userWallet == null || userWallet.Balance < totalParkingPrice)
                {
                    var ex = new Exception("Not enough money in the wallet.");
                    ex.Data["Code"] = 406;
                    throw ex;
                }

                // Pay for the reservation
                Console.WriteLine(totalParkingPrice);
                int transactionId = payForReservation(userId, (float)totalParkingPrice);

                // Add the transaction ID to the reservation
                //reservation.TransactionID = transactionId;

                // Add the reservation to the database
                _db.Reservations.Add(reservation);

                // Save changes to the database
                _db.SaveChanges();
            }
            catch (Exception e)
            {
                var ex = new Exception("Something went wrong.");
                ex.Data["Code"] = 401;
                throw ex;
            }
        }

    }
}
