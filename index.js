const puppeteer = require("puppeteer");
const process = require("./adtProcess.js");

async function startWebScrapping(adtProcess, environment, username, pwd) {
  console.log(">>>> start <<<<<<");
  const adtUrl = `https://gxm-adt-${environment}.mobile.grade-x.com`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(adtUrl);

  if (adtProcess === process.Nissan) {
    console.log(">>>>>>> Nissan <<<<<<<");
    console.log("adtUrl: ", adtUrl);
    await page.click("#zocial-saml");
    await page.waitForNavigation();
    await page.click("#loginButton2");
    await page.waitForNavigation();
    await page.type("#username", username);
    await page.type("#password", pwd);
    await page.click("body > div > div.ping-body-container > div:nth-child(2) > form > div.ping-buttons > a");
    await page.waitForNavigation();
    await page.waitForTimeout(8000);

  } else if (adtProcess === process.keycloak) {
    console.log(">>>>> Keycloak <<<<<");
    await page.type("#username", username);
    await page.type("#password", pwd);
    await page.click("#kc-login");
    await page.waitForNavigation();
  }

  const cookies = await page.cookies();
  const token = cookies.find(
    (cookie) => cookie.name === "gxmAuthorisationToken"
  );
  return token.value;
}

module.exports = { startWebScrapping };
