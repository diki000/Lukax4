using SpotPicker.EFCore;

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
            User newUser = new User(){
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email
            };

            _db.User.Add(newUser);
            _db.SaveChanges();
        }

        public Boolean login(UserModel user)
        {
            // Find the user in the database by username
            var existingUser = _db.User.FirstOrDefault(u => u.Name == user.Name && u.Surname == user.Surname);

            // If the user does not exist, throw an exception or handle the situation accordingly
            if (existingUser == null)
            {
                throw new Exception("User not found");
            }

            // Here you can perform additional checks, such as comparing passwords, implementing hashing and salting, etc.
            // For simplicity, let's assume the check is successful
            // KOMENTAR: dodaj hashing i salting sa Filipovog backenda registera
            // KOMENTAR PS: checkiraj preko usernamea i passworda uz ovo hashanje i saltanje

            // Return the user model if the login is successful
            return true;
        }
    }
}
