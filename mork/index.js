const express = require("express");
const bodyParse = require("body-parser");
const router = require("./router");
const originChange = require("./originChange");
const app = express();

try {
  app.use(
    bodyParse.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParse.json());

  //允许跨域
  app.all("*", originChange);
  app.use(router);

} catch (err) {
  console.log(err);
}

app.listen(3002, () => {
  console.log("server is run");
});
