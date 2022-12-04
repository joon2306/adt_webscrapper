const clipboardy = require("clipboardy");
const process = require("./adtProcess.js");
const cors = require("cors");
const express = require("express"); 
const { startWebScrapping } = require("./index.js");
const app = express();
app.use(cors());

app.get("/renault/:env", function (req, res) {
  const env = req.params.env;
  startWebScrapping(process.keycloak, env).then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});


app.get("/nissan/:env", function (req, res) {
  const env = req.params.env;
  startWebScrapping(process.Nissan, env).then((response) => {
    if (response) {
      console.log(">>>>> Done <<<<<");
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});

app.listen(4000);
