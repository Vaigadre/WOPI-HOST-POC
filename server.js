const fs = require("fs");
const path = require("path");

const app = require("./app").app;

const https = require("https");
const http = require("http");

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "./config/ssl-cert/wopi.key")),
  cert: fs.readFileSync(path.join(__dirname, "./config/ssl-cert/wopi.crt"))
};

/**
 * Start Express server.
 */
function startServer() {
  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(sslOptions, app);
  console.log(
    "  App is running at https://localhost:%d in %s mode",
    3200,
    "test"
  );

  // httpServer.listen(3200);
  httpsServer.listen(443);
  // app.listen(PORT, () => {
  //   console.log(
  //     '  App is running at http://localhost:%d in %s mode',
  //     PORT,
  //     NODE_ENV
  //   );
  //   console.log('  Press CTRL-C to stop\n');
  // });
}

startServer();
