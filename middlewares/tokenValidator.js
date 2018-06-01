const jwt = require("jsonwebtoken");
const app = require("../app").app;
const fs = require("fs");
const path = require("path");
const util = require("../utils/wopiUtil");

module.exports.isValidToken = function(req, res, next) {
  const accessToken = req.query["access_token"];
  if (!accessToken) {
    //res = "token is missing";
    res.status(401).send("Access token is empty");
  }
  validateToken(req.query["access_token"])
    .then(data => {
      if (data) {
        console.log("validated token successfully.");
        return next();
      }
    })
    .catch(err => {
      //res.body = "token is invalid";
      res.status(401).send("Invalid access token");
    });
};

const privateCert = fs.readFileSync(
  path.join(__dirname, "../config/ssl-cert/ssl-cert.key")
); // get private key

const publicCert = fs.readFileSync(
  path.join(__dirname, "../config/ssl-cert/ssl-cert.crt")
); // get public key

const createToken = function(userData) {
  const token = jwt.sign(userData, privateCert, {
    algorithm: "RS256",
    expiresIn: "5 days"
  });
  return {
    token
  };
};

const validateToken = function(token) {
  return new Promise((resolve, reject) => {
    const obj = jwt.verify(token, publicCert, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

exports.createToken = createToken;
exports.validateToken = validateToken;
