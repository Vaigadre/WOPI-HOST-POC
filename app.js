const express = require("express");
//const dotenv = require("dotenv");
// import * as compression from "compression";
//const logger = require("morgan");
const bodyParser = require("body-parser");
//const expressValidator = require("express-validator");
const path = require("path");
const xml2js = require("xml2js");
const http = require("http");
const request = require("superagent");
var fs = require("fs");
const ejs = require("ejs");
const multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });
//var upload = multer({ dest: "uploads/" });
// controllers
const wopiUtil = require("./utils/wopiUtil");
// const filesController = require("./controllers/files");
// token security code
const tokenValidator = require("./middlewares/tokenValidator");
const app = express();
app.set("port", process.env.PORT || 3000);
// app.use(compression());
// app.use(logger("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(expressValidator());
app.use(express.static(path.join(__dirname, "public")));
// Routes
const storage = require("./utils/fileStorageUtil");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wopi");

var db = mongoose.connection;

mongoose.Promise = global.Promise;

db.on("error", err => {
  console.log(err);
});

db.once("open", function() {
  console.log("The DB is connected successfully.");
});

const config = require("./config/officeConfig.js");
const adal = require("adal-node");
const oneDriveAccess = require("./middlewares/oneDriveAccess");

//Authentication request for oneDrive without user login
app.get("/no-login", (req, res) => {
  var AuthenticationContext = adal.AuthenticationContext;
  config.turnOnLogging();

  var context = new AuthenticationContext(config.authorityUrl);
  let token;
  context.acquireTokenWithClientCredentials(
    config.resource,
    config.sampleParameters.clientId,
    config.sampleParameters.clientSecret,
    function(err, tokenResponse) {
      if (err) {
        throw new Error("Error while generating access token: ");
        console.log("well that didn't work: " + err.stack);
      } else {
        // setTimeout(function() {
        console.log("Fetching token");
        //token = tokenResponse.accessToken;
        res.send(tokenResponse);
        // }, 0);
      }
    }
  );
});

app.get("/", (req, res) => {
  res.render("index", {
    actionUrl:
      "https://excel.officeapps-df.live.com/x/_layouts/xlviewerinternal.aspx?ui=en-US&rs=en-US&dchat=1&IsLicensedUser=0&WOPISrc=https://localhost:3200/wopi/files/5b0d3deeba232f389ceddf44",
    accessToken:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0cmljb24iLCJpc3MiOiJodHRwczovL3dvcGkudHJpY29uaW5mb3RlY2guY29tIiwicGVybWlzc2lvbnMiOiJlZGl0LWZpbGVzIiwiaWF0IjoxNTI2NjMzMTM0LCJleHAiOjE1MjcwNjUxMzR9.McAW6gSo_dn581lXCU-lfm27_mSQ8RXfCgS4tSAgthQkBUKZknpjJgLKPEtEE27fdpWcYgOxEBTPkOuckZe6ViN3n9SI_251NoeIrFultPMKws870OOSPv6gPHLSpvxEyqnH0fs3p4oGpHfH_g15OxGIYQVnhjj10gFpactFMN0",
    accessTokenTtl: "1527065134"
  });
});

app.get(
  "/download-file",
  /*oneDriveAccess.tokenGenerator, */ async (req, res) => {
    const accessToken = req.body.oneDriveToken;
    res.send(
      ondeDriveStorage.getFile(
        accessToken,
        "0144FD2GF7ZS4NE2LCS5BI2OIA4WIAKELQ",
        res
      )
    );
  }
);

app.post("/file-upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  // fs.writeFile("temp.xlsx", req.file.buffer, err => {
  //   if (err) {
  //     res.send(err);
  //   }
  // });
  var result = await storage.savefile(req.file);
  res.send(result);
});

app.get("/get-file/:fileId", async (req, res) => {
  var result = await storage.getFileInfo(req.params.fileId);
  // fs.writeFile("temp.xlsx", result.buffer, err => {
  //   if (err) {
  //     res.send(err);
  //   }
  // });
  res.send(result);
});

app.put("/get-file", async (req, res) => {
  var result = await storage.updateFileInfo(req.body);
  // fs.writeFile("temp.xlsx", result.buffer, err => {
  //   if (err) {
  //     res.send(err);
  //   }
  // });
  res.send(result);
});
app.get("/upload-file", oneDriveAccess.tokenGenerator, (req, res) => {
  const accessToken = req.body.oneDriveToken;
  ondeDriveStorage.uploadFile(accessToken, res);

  //res.end("download completed");
});

app.get("/access-token", (req, res) => {
  const token = tokenValidator.createToken({
    userId: "tricon",
    iss: "https://wopi.triconinfotech.com",
    permissions: "edit-files"
  });
  tokenValidator
    .validateToken(token.token)
    .then(decoded => {
      res.send({ decoded, token });
    })
    .catch(err => {
      res.send(err);
    });
});

app
  .route("/wopi/files/:id")
  //.all(tokenValidator.isValidToken) //oneDriveAccess.tokenGenerator
  .get(wopiUtil.processWopiRequest)
  .post(wopiUtil.processWopiRequest);
app
  .route("/wopi/files/:id/contents")
  //.all(tokenValidator.isValidToken)
  .get(wopiUtil.processWopiRequest)
  .post(wopiUtil.processWopiRequest);

module.exports.app = app;

// start the server
// app.listen(app.get("port"), () => {
//   console.log(
//     "  App is running at http://localhost:%d in %s mode",
//     app.get("port"),
//     app.get("env")
//   );
//   console.log("  Press CTRL-C to stop\n");
// });

// {/* <action name="view" ext="xlsx" default="true"
//  urlsrc="https://excel.officeapps-df.live.com/x/_layouts/xlviewerinternal.aspx?ui=en-US&rs=en-US&dchat=1&IsLicensedUser=0&WOPISrc=https://localhost:3200/wopi/files/01N7NB4CGFCVLYGC2E7NEKEBGDPZJ27QEI" */}
