"use strict"

var request = require('request');

var Dialogue = function() {};

Dialogue.prototype.getMessage = function(content, callback) {

  var options = {
    url  : 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=' + process.env.DOCOMO_AMADEUS_API_KEY,
    json : true,
    body : {
      utt : content.text
    }
  };

  request.post(options, function(err, res, body) {
    callback(body.utt);
  });
};

module.exports = Dialogue;
