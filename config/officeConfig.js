const sampleParameters = {
  tenant: "triconinfotechblr.onmicrosoft.com",
  authorityHostUrl: "https://login.windows.net",
  clientId: "8d608fab-d865-4d96-9bf8-e06de95d2a60",
  clientSecret: "y2ERfUvNRNd55K3wetUEFTpQ0l5nqcTycAbMhvPDK9U="
};

module.exports.sampleParameters = sampleParameters;
module.exports.authorityUrl =
  sampleParameters.authorityHostUrl + "/" + sampleParameters.tenant;

module.exports.resource = "https://graph.microsoft.com";

module.exports.userId = "4828d55f-59da-494a-a135-c55315899a46";

module.exports.designTemplate = "0144FD2GHFYYMCVWDSNVBJUQ5HQVUDVPQC";
module.exports.testTemplate = "0144FD2GHFYYMCVWDSNVBJUQ5HQVUDVPQC";
//module.exports.accessTokenURL = 'https://ec2-52-207-181-205.compute-1.amazonaws.com:4000/no-login';
module.exports.accessTokenURL = "https://172.16.18.128/no-login";

module.exports.turnOnLogging = function() {
  var log = require("adal-node").Logging;
  log.setLoggingOptions({
    level: log.LOGGING_LEVEL.VERBOSE,
    log: function(level, message, error) {
      console.log(message);
      if (error) {
        console.log(error);
      }
    }
  });
};
