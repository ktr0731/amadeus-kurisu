"use strict";

var bodyParser = require('body-parser');
var express    = require('express');
var callback   = require('./modules/routes/callback');
var app        = express();
var port       = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/callback', callback);
app.listen(port, function() {
  console.log("Amadeus is running on http://localhost:" + port);
});
