var config = require('./config');
var sockets = require('../lib/sockets');

var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post("/requestSocket", function(req, res) {
  try {
    var port = sockets.getAvailablePort(config.portsRange[0], config.portsRange[1]);
    sockets.createForwardServer(port, config.connect);
    res.send(port.toString());
  } catch (e) {
    console.log("failed to bind on port ", port, ":", e);
    res.send(404, "no available port for now");
  }
});

app.get("/stats", function (req, res) {
  res.send("TODO: show stats info");
});

app.listen(config.listen);
