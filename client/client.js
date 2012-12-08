var net = require('net');
var http = require('http');
var config = require('./config');

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
  net.createServer(function (c) {
    var buff = new Buffer(0);
    var connected = false;
    var s = net.createConnection(port, config.server);
    s.on('connect', function () {
      connected = true;
      if (buff.length) s.write(buff);
    });
    s.on('end', function () {
      console.log('client connect end on port '+port);
    });
    s.on('close', function () {
      console.log('client connect close on port '+port);
    });
    s.on('drain', function () {
      console.log('client connect drain on port '+port);
    });
    s.on('error', function () {
      console.log('client connect error on port '+port);
    });


    c.on('data', function (d) {
      if (connected) {
        s.write(d);
      } else {
        buff += Buffer.concat([buff, d]);;
      }
    });
    s.pipe(c, {end: false});
  }).listen(config.local, function () {
    console.log("listening on port:", config.local);
  });
};
