const clipboardy = require("clipboardy");
const process = require("./adtProcess.js");
const cors = require("cors");
const express = require("express"); 
const { startWebScrapping } = require("./index.js");
const app = express();
app.use(cors());
app.use(express.json());
const users = require("./users.js");
const apps = require("./apps.js");
const environments = require("./environments.js");

app.get("/renault/:env/:id/:front", function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  const user = users.find((el) => el.id === +id);
  const front = req.params.front;
  if (!user) {
    console.log("user not found");
    res.send("Failed");
    return;
  }
  const username = user.username;
  const pwd = user.pwd;
  startWebScrapping(process.keycloak, env, username, pwd, front === "true").then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  }).catch(error => {
    console.error("error: ", error);
    res.send("Failed");
  });
});

app.get("/nissan/:env/:id/:front", function (req, res) {
  const env = req.params.env;
  const id = req.params.id;
  const user = users.find((el) => el.id === +id);
  const front = req.params.front;
  if (!user) {
    console.log("user not found");
    res.send("Failed");
    return;
  }
  const username = user.username;
  const pwd = user.pwd;
  startWebScrapping(process.Nissan, env, username, pwd, front === "true").then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  }).catch(error => {
    console.error("error: ", error);
    res.send("Failed");
  });
});

app.get("/users", function (req, res) {
  let list = [];
  users.forEach(({ id, username, brand, role }) => {
    list.push({ id, username, brand, role });
  });
  res.send(list);
})

app.get("/apps", function (req, res) {
  res.send(apps);
});

app.get("/environments", function(req, res){
  res.send(environments)
})

app.post("/copy", function(req, res){
  const item = req.body.item;
  clipboardy.writeSync(item);
  res.send("Success");
})

app.get("/username/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((el) => el.id === +id);
  if(!user){
    res.send("Failed");
    return;
  }
  clipboardy.writeSync(user.username);
  res.send("Success");
});

app.get("/pwd/:id", function (req, res) {
  const id = req.params.id;
  const user = users.find((el) => el.id === +id);
  if(!user){
    res.send("Failed");
    return;
  }
  clipboardy.writeSync(user.pwd);
  res.send("Success");
})

app.listen(4000);
