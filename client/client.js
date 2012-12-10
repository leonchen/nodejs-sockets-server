var http = require('http');
var config = require('./config');
var Socket = require('../lib/socket');
var utils = require('../lib/utils');

var sockets = new Socket();
var options = {
  host: config.serverHost,
  port: config.serverPort,
  path: "/requestSocket",
  method: "post"
}
var statsInterval = 2000;

var req = http.request(options, function (res) {
  var data = "";
  res.on('data', function (chunk) {
    data += chunk.toString();
  });
  res.on('end', function () {
    start(data);
  });
});

req.on('error', function (err) {
  console.log("server returns error:", err);
});

req.write("user="+config.user+"&pass="+config.secret);
req.end();

var start = function (port) {
  var server = sockets.createTCPForwardServer(config.listen, parseInt(port), config.serverHost);
  showStats(statsInterval);
};

var showStats = function (interval) {
  var tin = 0;
  var tout = 0;
  var sin = 0;
  var sout = 0;
  setInterval(function () {
    sin = (sockets.inBytes - tin) / (interval / 1000);
    sout = (sockets.outBytes - tout) / (interval / 1000);
    tin = sockets.inBytes;
    tout = sockets.outBytes; 
    process.stdout.write("\033[K\r\033[36mRunning\033[m [ Received: \033[32m"+utils.humanBytes(tin)+"\033[m  \033[32m"+utils.humanBytes(sin)+"\/s\033[m ] [ Sent: \033[31m"+utils.humanBytes(tout)+"\033[m  \033[31m"+utils.humanBytes(sout)+"\/s\033[m ]\033[K");
  }, interval);
}
