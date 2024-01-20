namespace SpotPickerTests
{
    public class IBanFunctionTest
    {
        [Fact]
        public void TestIBANFunctionValid()
        {
            string validIBAN = "HR7723400092999136896";
            bool result = SpotPicker.Services.UserFunctions.CheckIban(validIBAN);
            Assert.True(result);
        }

        [Fact]
        public void TestIBANFunctionInvalid()
        {
            var invalidIBAN = "progiprojekt";
            var result = SpotPicker.Services.UserFunctions.CheckIban(invalidIBAN);
            Assert.False(result);
        }
    }
}