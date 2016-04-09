"use strict";

var request = require('request');
var express = require('express');
var app     = express();

app.get('/callback', function(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  var params = (JSON.parse(req.body)).result.content;

  var options = {
    url     : 'https://trialbot-api.line.me/v1/events',
    headers : {
      'Content-Type'                 : 'application/json; charser=UTF-8',
      'X-Line-ChannelID'             : process.env.CHANNEL_ID,
      'X-Line-ChannelSecret'         : process.env.CHANNEL_SECRET,
      'X-Line-Trusted-User-With-ACL' : process.env.CHANNEL_MID
    }
  };

  var messages = {
    'to'        : params.to[0],
    'toChannel' : 1383378250,
    'eventType' : '138311608800106203',
    'content'   : {
      'contentType' : 1,
      'toType'      : 1,
      'text'        : params.text
    }
  };

  request(options, function(error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log('OK');
    } else {
      console.log('Failed');
    }
  });

});

app.listen();
