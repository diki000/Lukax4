namespace SpotPickerTests
{
    public class DistanceFunctionTest
    {
        [Fact]
        public void TestDistanceFunction()
        {
            var (c1, c2) = (41.507483, -99.436554);
            var (c3, c4) = (38.504048, -98.315949);
            var result = 347.3;

            Assert.True(Math.Abs(result - SpotPicker.Services.ParkingFunctions.HaversineDistance(c1, c2, c3, c4)) <= 0.05);
        }
    }
}