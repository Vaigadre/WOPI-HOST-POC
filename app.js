const express = require("express");
//const dotenv = require("dotenv");
// import * as compression from "compression";
//const logger = require("morgan");
const bodyParser = require("body-parser");
//const expressValidator = require("express-validator");
const path = require("path");
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(expressValidator());
app.use(express.static(path.join(__dirname, "public")));
// Routes
const storage = require("./utils/fileStorageUtil");
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/wopi",
  { useNewUrlParser: true }
);

var db = mongoose.connection;

mongoose.Promise = global.Promise;

db.on("error", err => {
  console.log(err);
});

db.once("open", function() {
  console.log("The DB is connected successfully.");
});

//Authentication request for oneDrive without user login

app.get("/", (req, res) => {
  res.render("index", {
    actionUrl:
      "https://onenote.officeapps-df.live.com/hosting/WopiTestFrame.aspx?ui=en-US&rs=en-US&dchat=1&IsLicensedUser=0&testcategory=OfficeOnline&WOPISrc=https://wopi.triconinfotech.net/wopi/files/5b2d1a8cc364472468d6616f",
    // "https://excel.officeapps-df.live.com/x/_layouts/xlviewerinternal.aspx?ui=en-US&rs=en-US&dchat=1&IsLicensedUser=0&WOPISrc=https://wopi.triconinfotech.net/wopi/files/5b0fa37cfeafff149c25d8da",
    accessToken:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0cmljb24iLCJpc3MiOiJodHRwczovL3dvcGkudHJpY29uaW5mb3RlY2guY29tIiwicGVybWlzc2lvbnMiOiJlZGl0LWZpbGVzIiwiaWF0IjoxNTM1NTU1MDg3LCJleHAiOjE1Nzg3NTUwODd9.AOz24xHKh6EgyaXEUzJBVU57dCtGtSjpRsSi4EG08nQaxwxYrzJHtwpfYdyNM1wyfcSU7BEOi_CLIZIaE-J2oPsUil2rdehxi_gBB-JsWOJ2fj2Ca2ZCNva40sDhsyfQdArKT7L8EuNi6xh3Ryx6vcwwNZXTvR7Gg9mybjPVkHM",
    accessTokenTtl: new Date().getTime()
  });
});

app.post("/file-upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  var result = await storage.savefile(req.file);
  res.send(result);
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
