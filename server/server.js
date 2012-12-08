var net = require('net');
var config = require('./config');
var express = require('express');
var app = express();

var usingPorts = {};

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post("/requestSocket", function(req, res) {
  try {
    var port = getAvailablePort();
    openSocket(port);
    res.send(port.toString());
  } catch (e) {
    console.log("failed to bind on port ", port, ":", e);
    res.send(404, "no available port for now");
  }
});

app.get("/stats", function (req, res) {
  res.send("TODO: show stats info");
});

app.listen(config.serverPort);


function getAvailablePort() {
  for (var s=config.portsRange[0], e=config.portsRange[1]; s<=e; s++) {
    if (usingPorts[s]) continue;
    try {
      var ts = net.createServer().listen(s);
      ts.close();
      return s;
    } catch (e) {
      continue;
    }
  }
}

function openSocket(port) {
  net.createServer(function (s) {
    s.on('connect', function () {
      console.log('connect successfully on port '+port);
    });
    s.on('data', function (d) {
      s.write("server get:"+d);
    });
    s.on('end', function () {
      console.log('server connect end on port '+port);
    });
    s.on('close', function () {
      console.log('server connect close on port '+port);
    });
    s.on('drain', function () {
      console.log('server connect drain on port '+port);
    });
    s.on('error', function () {
      console.log('server connect error on port '+port);
    });
    s.on('timeout', function () {
      console.log('server connect timeout on port '+port);
    });

  }).listen(port);
}
