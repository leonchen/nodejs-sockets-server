var net = require('net');

var Socket = function (app) {
  this.usingPorts = {};
  this.inBytes = 0;
  this.outBytes = 0;
  this.app = app;
};

Socket.prototype.createTCPServer = function (listenPort, connectPort, connectHost) {
  var self = this;
  var buff = new Buffer(0);
  var connected = false;

  var s = net.createConnection(connectPort, connectHost);
  s.on('connect', function () {
    console.log("connected to "+connectHost+":"+connectPort);
    connected = true;
    if (buff.length) s.write(buff);
  });
  s.on('error', function (e) {
    console.log('client connect error:', e);
    // reconnect
    s.connect(connectPort, connectHost);
  });
  s.on('end', function () {
  });
  s.on('close', function () {
  });
  s.on('drain', function () {
  });

  var server = net.createServer(function (c) {
    c.on('data', function (d) {
      self.outBytes += d.length;
      if (connected) {
        s.write(d);
      } else {
        buff = Buffer.concat([buff, d]);
      }
    });
    c.on('close', function () {
      delete self.usingPorts[listenPort];
    });
    c.on('error', function (e) {
      console.log("error occurs:", e);
      s.end();
    });

  });
  s.on('data', function (d) {
    self.inBytes += d.length;
    server.write(d); 
  });

  server.listen(listenPort, function () {
    console.log("listening:", listenPort);
  });

  self.usingPorts[listenPort] = 'forwarding';
  return server;
};

Socket.prototype.getAvailableTCPPort = function (start, end) {
  for (var s=start; s<=end; s++) {
    if (this.usingPorts[s]) continue;
    try {
      var ts = net.createServer().listen(s);
      ts.close();
      return s;
    } catch (e) {
      continue;
    }
  }
};

module.exports = Socket;
