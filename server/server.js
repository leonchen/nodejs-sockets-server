var config = require('./config');
var Socket = require('../lib/socket');

var express = require('express');
var app = express();
var sockets = new Socket(app);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post("/requestSocket", function(req, res) {
  try {
    var port = sockets.getAvailableTCPPort(config.portsRange[0], config.portsRange[1]);
    sockets.createTCPServer(port, config.connectPort, config.connectHost);
    res.send(port.toString());
  } catch (e) {
    console.log("failed to bind on port ", port, ":", e);
    res.send(404, "no available port for now");
  }
});
app.get("/stats", function (req, res) {
  res.send("TODO: show stats info");
});
app.get("/", function (req, res) {
  res.send("This is the main page");
});

app.listen(config.listen);
