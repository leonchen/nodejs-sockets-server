var config = require('./config');
var Socket = require('../lib/socket');

var express = require('express');
var app = express();
var sockets = new Socket(app);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post("/requestSocket", function(req, res) {
  sockets.getAvailableTCPPort(config.portsRange[0], config.portsRange[1], function (err, port) {
    if (err) {
      res.send(404, "no available ports");
    } else {
      sockets.createTCPForwardServer(port, config.connectPort, config.connectHost);
      res.send(200, port.toString());
    }
  });
});
app.get("/stats", function (req, res) {
  res.send("TODO: show stats info");
});
app.get("/", function (req, res) {
  res.send("This is the main page");
});

app.listen(config.listen);
