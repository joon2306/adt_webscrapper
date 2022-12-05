const puppeteer = require("puppeteer");
const process = require("./adtProcess.js");
let backendCookie;

async function getBackendCookie(page) {
  const cdpSession = await page.target().createCDPSession();
  await cdpSession.send("Network.enable");
  const addCDPRequestDataListener = (eventName) => {
    cdpSession.on(eventName, (request) => {
      if (
        request.headers &&
        request.headers.cookie &&
        request.headers.cookie.indexOf("adtKCToken") !== -1
      ) {
        backendCookie = request.headers.cookie;
      }
    });
  };

  addCDPRequestDataListener("Network.requestWillBeSent");
  addCDPRequestDataListener("Network.requestWillBeSentExtraInfo");
  addCDPRequestDataListener("Network.responseReceived");
  addCDPRequestDataListener("Network.responseReceivedExtraInfo");
}

async function startWebScrapping(
  adtProcess,
  environment,
  username,
  pwd,
  front
) {
  console.log(">>>> start <<<<<<");
  const adtUrl = `https://gxm-adt-${environment}.mobile.grade-x.com`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await getBackendCookie(page);
  await page.setDefaultNavigationTimeout(0);
  await page.goto(adtUrl);
  console.log("adtUrl: ", adtUrl);

  if (adtProcess === process.Nissan) {
    console.log(">>>>>>> Nissan <<<<<<<");
    await page.click("#zocial-saml");
    await page.waitForNavigation();
    await page.click("#loginButton2");
    await page.waitForNavigation();
    await page.type("#username", username);
    await page.type("#password", pwd);
    await page.click(
      "body > div > div.ping-body-container > div:nth-child(2) > form > div.ping-buttons > a"
    );
    await page.waitForNavigation();
    await page.waitForTimeout(8000);
  } else if (adtProcess === process.keycloak) {
    console.log(">>>>> Keycloak <<<<<");
    await page.type("#username", username);
    await page.type("#password", pwd);
    await page.click("#kc-login");
    await page.waitForNavigation();
  }

  if (front === false) {
    console.log(">>>> backend cookie requested <<<<<");
    return backendCookie;
  }

  const cookies = await page.cookies();
  const token = cookies.find(
    (cookie) => cookie.name === "gxmAuthorisationToken"
  );
  return token.value;
}

module.exports = { startWebScrapping };
