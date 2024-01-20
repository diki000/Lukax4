using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace SpotPickerTests
{
    public class AdminChangeTest
    {
        [Fact]
        public void TestChangingPartRole()
        {
            ChromeDriver driver = new ChromeDriver();
            string URL = "https://spotpicker.online/login";
            try
            {
                driver.Navigate().GoToUrl(URL);
                // Console.WriteLine(driver.Title);
                IWebElement username = driver.FindElement(By.XPath("/html/body/app-root/app-login/body/div/div/form/div[1]/input"));
                IWebElement password = driver.FindElement(By.XPath("/html/body/app-root/app-login/body/div/div/form/div[2]/input"));
                username.SendKeys("admin");
                password.SendKeys("test123123");

                IWebElement loginButton = driver.FindElement(By.XPath("/html/body/app-root/app-login/body/div/div/form/button"));
                loginButton.Click();

                //WebDriverWait wait = new WebDriverWait(driver, new System.TimeSpan(0, 0, 5));
                //wait.Until(wt => wt.FindElement(By.XPath("/html/body/app-root/app-dashboard/div/app-admin/div[2]/div[4]/div[6]/div[1]/span[1]")));
                // Console.WriteLine(driver.Title);

                Thread.Sleep(1000);

                IWebElement child = driver.FindElement(By.XPath("//span[contains(text(), 'tempmail@test.com')]"));
                IWebElement parent = child.FindElement(By.XPath(".."));
                var children = parent.FindElements(By.XPath("./*"));
                var role = int.Parse(children[2].Text);
                children[4].Click();

                Thread.Sleep(1000);

                parent = driver.FindElement(By.XPath("/html/body/app-root/app-dashboard/div/app-admin/div[2]/div[4]/div[1]/div[2]/div[2]/div[1]"));
                children = parent.FindElements(By.XPath("./*"));
                var div = children[3];

                children = div.FindElements(By.XPath("./*"));
                Thread.Sleep(1000);
                SelectElement select = new SelectElement(div.FindElements(By.XPath("./*"))[1]);

                
                int desiredRole = role == 1 ? 1 : 0;
                select.SelectByIndex(desiredRole);
                Thread.Sleep(1000);

                IWebElement save = driver.FindElement(By.XPath("/html/body/app-root/app-dashboard/div/app-admin/div[2]/div[4]/div[1]/div[2]/div[2]/div[3]/button[1]"));
                save.Click();
                driver.Navigate().Refresh();

                Thread.Sleep(1000);

                child = driver.FindElement(By.XPath("//span[contains(text(), 'tempmail@test.com')]"));
                parent = child.FindElement(By.XPath(".."));
                children = parent.FindElements(By.XPath("./*"));
                var newRole = int.Parse(children[2].Text);

                Assert.NotEqual(newRole, role);
            }
            finally
            {
                driver.Dispose();
            }
        }
    }
}