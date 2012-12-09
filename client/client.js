var http = require('http');
var config = require('./config');
var sockets = require('../lib/sockets');

var options = {
  host: config.server,
  port: config.remote,
  path: "/requestSocket",
  method: "post"
}

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
  sockets.createForwardServer(config.local, parseInt(port), config.server);
};
