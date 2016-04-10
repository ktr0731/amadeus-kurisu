"use strict"

var config = require('config');
var request = require('request');

var line = (function() {

  /*
   * for post request
   */

  let customRequest  = request.defaults({'proxy' : process.env.FIXIE_URL});

  let requestHandler = function(error, res, body) {
    if (!error && res.statusCode === 200) {
      console.log('OK');
    } else {
      console.log('Failed');
      console.log(JSON.stringify(res));
      res.end();
    }
  };

  /**
   * for sending messages
   */

  let content = {};

  let messages = {
    'toChannel' : 1383378250,
    'eventType' : '138311608800106203'
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
  }

  let send = function(to, content) {
    console.log(JSON.stringify(content));
    switch(content.contentType) {
      case config.get('Send.text'):
        this.messages.to = to;

        this.content.contentType = content.contentType;
        this.content.toType      = 1;  // Fixed value?
        this.content.text        = content.text;
        break;
    }

    messages.content = this.content;
    customRequest(options, this.requestHandler);
  };
})();

module.exports = line;
