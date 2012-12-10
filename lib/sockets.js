var net = require('net');

var usingPorts = {};
var Sockets = {};

Sockets.createForwardServer = function () {
  var listenPort = arguments[0];
  var connectPort = arguments[1];
  var connectHost = arguments[2] || "127.0.0.1";

  var buff = new Buffer(0);
  var connected = false;

  var s = net.createConnection(connectPort, connectHost);
  s.on('connect', function () {
    console.log("connected to "+connectHost+":"+connectPort);
    connected = true;
    if (buff.length) s.write(buff);
  });
  s.on('end', function () {
    console.log('client connect end on port '+connectPort);
  });
  s.on('close', function () {
    console.log('client connect close on port '+connectPort);
  });
  s.on('drain', function () {
    console.log('client connect drain on port '+connectPort);
  });

  var server = net.createServer(function (c) {
    c.on('data', function (d) {
      if (connected) {
        s.write(d);
      } else {
        buff = Buffer.concat([buff, d]);
      }
    });
    c.on('close', function () {
      delete usingPorts[listenPort];
    });
    c.on('error', function (e) {
      console.log("error occurs", e);
      s.end();
    });

    s.pipe(c);
  });

  s.on('error', function (e) {
    console.log('client connect error on port '+connectPort, e);
    server.close();
    s.connect(connectPort, connectHost);
  });

  server.listen(listenPort, function () {
    console.log("listening on port:", listenPort);
  });

  usingPorts[listenPort] = 'forwarding';
  return server;
};

Sockets.getAvailablePort = function (start, end) {
  for (var s=start; s<=end; s++) {
    if (usingPorts[s]) continue;
    try {
      var ts = net.createServer().listen(s);
      ts.close();
      return s;
    } catch (e) {
      continue;
    }
  }
};


module.exports = Sockets;
