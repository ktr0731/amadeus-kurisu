"use strict";

var request    = require('request');
var bodyParser = require('body-parser');
var express    = require('express');
var app        = express();
var port       = process.env.PORT || 5000;

app.use(bodyParser.json());
app.post('/callback', function(req, res) {
  let result = req.body.result[0];

  let messages = {
    'to'        : [result.content.from],
    'toChannel' : 1383378250,
    'eventType' : '138311608800106203',
    'content'   : {
      'contentType' : 1,
      'toType'      : 1,
      'text'        : result.content.text
    },
  };

  let options = {
    'url'     : 'https://trialbot-api.line.me/v1/events',
    'method'  : 'POST',
    'headers' : {
      'Content-Type'                 : 'application/json; charser=UTF-8',
      'X-Line-ChannelID'             : process.env.CHANNEL_ID,
      'X-Line-ChannelSecret'         : process.env.CHANNEL_SECRET,
      'X-Line-Trusted-User-With-ACL' : process.env.MID
    },
    'body'    : JSON.stringify(messages)
  };

  var customRequest = request.defaults({'proxy' : process.env.FIXIE_URL})

  customRequest(options, function(error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log('OK');
    } else {
      console.log('Failed');
      console.log(JSON.stringify(res));
    }
  });

  res.end();

});

app.listen(port, function() {
  console.log("Amadeus is running on http://localhost:" + port);
});
