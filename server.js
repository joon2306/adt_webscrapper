const clipboardy = require("clipboardy");
const process = require("./adtProcess.js");
const cors = require("cors");
const express = require("express");
const { startWebScrapping } = require("./index.js");
const app = express();
app.use(cors());
const users = require("./users.js");

app.get("/renault/:env/:id", function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  const user = users.find((el) => el.id === +id);
  if (!user) {
    console.log("user not found");
    res.send("Failed");
    return;
  }
  const username = user.username;
  const pwd = user.pwd;
  startWebScrapping(process.keycloak, env, username, pwd).then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});

app.get("/nissan/:env/:id", function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  const user = users.find((el) => el.id === +id);
  if (!user) {
    console.log("user not found");
    res.send("Failed");
    return;
  }
  const username = user.username;
  const pwd = user.pwd;
  startWebScrapping(process.Nissan, env, username, pwd).then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});

app.get("/users", function (req, res) {
  let list = [];
  users.forEach(({ id, username, brand, role }) => {
    list.push({ id, username, brand, role });
  });
  res.send(list);
});

app.listen(4000);
