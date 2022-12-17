const clipboardy = require("clipboardy");
const process = require("./adtProcess.js");
const cors = require("cors");
const express = require("express");
const { startWebScrapping } = require("./index.js");
const app = express();
app.use(cors());
app.use(express.json());
const { getUsers, getApps, getEnvironments } = require("./services/csvReader");

app.get("/renault/:env/:id/:front", async function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  let users = await getUsers();
  const user = users.find((el) => el.id === id);
  const front = req.params.front;
  if (!user) {
    console.log("user not found");
    res.send("Failed");
    return;
  }
  const username = user.username;
  const pwd = user.pwd;
  startWebScrapping(process.keycloak, env, username, pwd, front === "true")
    .then((response) => {
      if (response) {
        console.log(">>>>> Done <<<<<");
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

app.get("/nissan/:env/:id/:front", async function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  let users = await getUsers();

  const user = users.find((el) => el.id === id);
  const front = req.params.front;
  if (!user) {
    console.log("user not found");
    res.send("Failed");
    return;
  }
  const username = user.username;
  const pwd = user.pwd;
  startWebScrapping(process.Nissan, env, username, pwd, front === "true")
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
  users = users.map(el => {
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

app.listen(4000);
