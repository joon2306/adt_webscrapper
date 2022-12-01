const clipboardy = require("clipboardy");
const process = require("./adtProcess.js");
const cors = require("cors");
const express = require("express"); 
const { startWebScrapping } = require("./index.js");
const app = express();
app.use(cors());

app.get("/", function (req, res) {
  startWebScrapping(process.keycloak).then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});


app.get("/nissan", function (req, res) {
  startWebScrapping(process.Nissan).then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});

app.listen(3000);
