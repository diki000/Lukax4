using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace SpotPickerTests
{
    public class LoginTest
    {
        [Fact]
        public void TestLogin()
        {
            ChromeDriver driver = new ChromeDriver();
            string URL = "https://spotpicker.online/login";
            try {
                driver.Navigate().GoToUrl(URL);
                // Console.WriteLine(driver.Title);
                IWebElement username = driver.FindElement(By.XPath("/html/body/app-root/app-login/body/div/div/form/div[1]/input"));
                IWebElement password = driver.FindElement(By.XPath("/html/body/app-root/app-login/body/div/div/form/div[2]/input"));
                username.SendKeys("admin");
                password.SendKeys("test123123");

                IWebElement loginButton = driver.FindElement(By.XPath("/html/body/app-root/app-login/body/div/div/form/button"));
                loginButton.Click();

                WebDriverWait wait = new WebDriverWait(driver, new System.TimeSpan(0, 0, 5));
                wait.Until(wt => wt.FindElement(By.XPath("/html/body/app-root/app-dashboard/div/app-admin/div[1]/div/div[1]")));
                // Console.WriteLine(driver.Title);
                Assert.Equal("https://spotpicker.online/dashboard", driver.Url);
            } finally
            {
                driver.Dispose();
            }
            
        }
    }
}