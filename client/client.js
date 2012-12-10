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
    console.log("connected to server port:"+data);
  });
});

req.on('error', function (err) {
  console.log("server returns error:", err);
});

req.write("user="+config.user+"&pass="+config.secret);
req.end();

var start = function (port) {
  var server = sockets.createTCPServer(config.listen, parseInt(port), config.serverHost);
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
    process.stdout.write("\033[K\rClient is running [\033[32mReceived\033[m: "+utils.humanBytes(tin)+" via "+utils.humanBytes(sin)+"\/s] [\033[31mSent\033[m: "+utils.humanBytes(tout)+" via "+utils.humanBytes(sout)+"\/s]\033[K");
  }, interval);
}
