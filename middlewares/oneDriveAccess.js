// const express = require("express");
// const app = require("../app");
// const request = require("request");
// const config = require("../config/officeConfig");

// let oldToken = "";
// module.exports.tokenGenerator = function(req, res, next) {
//   if (!oldToken || isTokenExpired(oldToken)) {
//     console.log("IF BLOCK ===========");
//     getAccessToken()
//       .then(newToken => {
//         oldToken = newToken;
//         req.body.oneDriveToken = newToken.accessToken;

//         //console.log(newToken);
//         next();
//       })
//       .catch(err => {
//         console.log("Error occurred in getAccessToken() ", err);
//         throw new Error("Error occurred in getAccessToken() ");
//       });
//   } else {
//     console.log("ELSE BLOCK ===========");
//     req.body.oneDriveToken = oldToken.accessToken;
//     next();
//   }
// };

// function isTokenExpired(token) {
//   console.log(`token value: `);
//   console.log(token);
//   // let decoded = jwt.decode(token);
//   expTime = Math.floor(new Date(token.expiresOn) / 1000);
//   console.log("==========");
//   console.log(expTime);
//   var isExpired = expTime - Math.floor(Date.now() / 1000) < 0;
//   console.log(`is token expired? ---> ${isExpired}`);
//   return isExpired;
// }

// function getAccessToken() {
//   return new Promise((resolve, reject) => {
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//     request.get(config.accessTokenURL, (err, response, body) => {
//       err ? reject(err) : resolve(JSON.parse(body));
//     });
//     // .end((err, res) => {
//     //   err ? reject(err) : resolve(res.body);
//     // });
//   });
// }
