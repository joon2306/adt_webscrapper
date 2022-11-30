const clipboardy = require("clipboardy");
const express = require("express"); 
const { startWebScrapping } = require("./index.js");
const app = express();

app.get("/", function (req, res) {
  startWebScrapping().then((response) => {
    if (response) {
      clipboardy.writeSync(response);
      res.send("Successful");
    } else {
      res.send("Failed");
    }
  });
});

app.listen(3000);
