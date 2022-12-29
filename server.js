const clipboardy = require("clipboardy");
const process = require("./adtProcess.js");
const cors = require("cors");
const express = require("express");
const { startWebScrapping } = require("./index.js");
const app = express();
app.use(cors());
app.use(express.json());
const { getUsers, getApps, getEnvironments } = require("./services/csvReader");
const { openGoogle } = require("./services/openChrome");

app.get("/:brand/:env/:id/:front", async function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  let brand = req.params.brand.toLowerCase();
  let users = await getUsers();

  if (brand === process.Nissan.toLowerCase()) {
    brand = process.Nissan;
  } else if (brand === process.Arca.toLowerCase()) {
    brand = process.Arca;
  } else {
    brand = process.keycloak;
  }
  let username;
  let pwd;
  let front;

  if (brand !== process.Arca) {
    const user = users.find((el) => el.id === id);
    front = req.params.front;
    if (!user) {
      console.log("user not found");
      res.send("Failed");
      return;
    }
    username = user.username;
    pwd = user.pwd;
  }

  startWebScrapping(
    brand,
    env,
    username,
    pwd,
    front === "true",
    brand !== process.Arca
  )
    .then((response) => {
      if (response) {
        clipboardy.writeSync(response);
        res.send("Successful");
      } else {
        res.send("Failed");
      }
    })
    .catch((error) => {
      console.error("error: ", error);
      res.send("Failed");
    });
});

app.get("/users", async function (req, res) {
  let users = await getUsers();
  users = users.map((el) => {
    delete el.pwd;
    return el;
  });
  res.send(users);
});

app.get("/apps", async function (req, res) {
  const apps = await getApps();
  res.send(apps);
});

app.get("/environments", async function (req, res) {
  const environments = await getEnvironments();
  res.send(environments);
});

app.post("/copy", function (req, res) {
  const item = req.body.item;
  clipboardy.writeSync(item);
  res.send("Success");
});

app.get("/username/:id", async function (req, res) {
  let users = await getUsers();
  const id = req.params.id;
  const user = users.find((el) => el.id === id);
  if (!user) {
    res.send("Failed");
    return;
  }
  clipboardy.writeSync(user.username);
  res.send("Success");
});

app.get("/pwd/:id", async function (req, res) {
  let users = await getUsers();
  const id = req.params.id;
  const user = users.find((el) => el.id === id);
  if (!user) {
    res.send("Failed");
    return;
  }
  clipboardy.writeSync(user.pwd);
  res.send("Success");
});

app.get("/test", async function (req, res) {
  await openGoogle();
  res.send("Success");
});

app.listen(4000);
