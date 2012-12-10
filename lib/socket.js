var net = require('net');

var Socket = function (app) {
  this.usingPorts = {};
  this.inBytes = 0;
  this.outBytes = 0;
  this.app = app;
};

Socket.prototype.createTCPForwardServer = function (listenPort, connectPort, connectHost) {
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

  var client = net.createServer(function (c) {
    c.on('data', function (d) {
      self.outBytes += d.length;
      if (connected) {
        s.write(d);
      } else {
        buff = Buffer.concat([buff, d]);
      }
    });
    c.on('close', function () {
      // close listen port if client closed connection for now
      delete self.usingPorts[listenPort];
      s.end();
      client.close();
    });
    c.on('error', function (e) {
      console.log("error occurs:", e);
      s.end()
    });

    s.on('data', function (d) {
      self.inBytes += d.length;
      c.write(d);
    });
  });

  client.listen(listenPort, function () {
    self.usingPorts[listenPort] = 'forwarding';
    console.log("listening:", listenPort);
  });

  return client;
};

Socket.prototype.getAvailableTCPPort = function (port, max, cb) {
  var self = this;
  if (port > max) return cb('no port available', null);
  if (this.usingPorts[port]) return this.getAvailableTCPPort(port+1, max, cb);

 var ts = net.createServer()
 ts.on('error', function (e) {
    return self.getAvailableTCPPort(port+1, max, cb);
 });
 ts.listen(port, function () {
   ts.close(function () {
      cb(null, port);
    });
 });
};

module.exports = Socket;
