"use strict"

var request = require('request');

var Line = function() {

  /*
   * for post request
   */

  this.customRequest  = request.defaults({'proxy' : process.env.FIXIE_URL});

  this.requestHandler = function(error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log('OK');
    } else {
      console.log('Failed');
      console.log(JSON.stringify(res));
    }
  };

  /**
   * for sending messages
   */

  this.content = {};

  this.messages = {
    'toChannel' : 1383378250,
    'eventType' : '138311608800106203'
  };

  this.options = {
    'url'     : 'https://trialbot-api.line.me/v1/events',
    'method'  : 'POST',
    'headers' : {
      'Content-Type'                 : 'application/json; charser=UTF-8',
      'X-Line-ChannelID'             : process.env.CHANNEL_ID,
      'X-Line-ChannelSecret'         : process.env.CHANNEL_SECRET,
      'X-Line-Trusted-User-With-ACL' : process.env.MID
    }
  }
};

Line.prototype.send = function(to, content) {
  switch(content.contentType) {
    case 1:  // text
      this.messages.to = [to];

      this.content.contentType = content.contentType;
      this.content.toType      = 1;  // Fixed value?
      this.content.text        = content.text;
      break;
  }

  this.messages.content = this.content;
  this.options.body     = JSON.stringify(this.messages);

  this.customRequest(this.options, this.requestHandler);
};

module.exports = Line;
