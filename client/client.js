var http = require('http');
var config = require('./config');
console.log(config);


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
    console.log("server port:"+data);
  });
});

req.on('error', function (err) {
  console.log(err);
});

req.write("user="+config.user+"&pass="+config.secret);
