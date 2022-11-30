const puppeteer = require("puppeteer");

async function startWebScrapping() {
  console.log(">>>> start <<<<<<");
  const adtUrl = "https://gxm-adt-devint.mobile.grade-x.com";
  const username = "mob1csc_adtr";
  const pwd = "GxMobile06";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(adtUrl);
  console.log("starting");

  await page.type("#username", username);
  await page.type("#password", pwd);
  await page.click("#kc-login");
  await page.waitForNavigation();
  const cookies = await page.cookies();
  const token = cookies.find(cookie => cookie.name === "gxmAuthorisationToken");
  return token.value;
}

module.exports = { startWebScrapping };
