namespace SpotPickerTests
{
    public class PasswordRegexTest
    {
        [Fact]
        public void TestPasswordRegexFunctionValid()
        {
            // osam charova i barem jedna znamenka
            string validPassword = "strongpassword123";
            bool result = SpotPicker.Services.UserFunctions.checkPasswordRegex(validPassword);
            Assert.True(result);
        }

        [Fact]
        public void TestPasswordRegexFunctionInvalid()
        {
            string invalidPassword1 = "weakpw"; // samo 6 charova
            string invalidPassword2 = "weakpw1"; // barem jedna znamenka, ali 7 charova
            string invalidPassword3 = "weakpwwwww"; // 8 ili vise charova, ali 0 znamenki

            bool result = SpotPicker.Services.UserFunctions.checkPasswordRegex(invalidPassword1) || 
                          SpotPicker.Services.UserFunctions.checkPasswordRegex(invalidPassword2) ||
                          SpotPicker.Services.UserFunctions.checkPasswordRegex(invalidPassword3);

            Assert.False(result);
        }
    }
}