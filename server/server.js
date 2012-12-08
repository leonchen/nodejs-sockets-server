var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


app.post("/requestSocket", function(req, res) {
  res.send("9000");
});

app.get("/stats", function (req, res) {
  res.send("TODO: show stats info");
});

app.listen(8080);
