"use strict"

var GC       = require('../model/GC.js');
var Dialogue = require('../model/Dialogue.js');
var Line     = require('../model/line.js');
var express  = require('express');
var router   = express.Router();

router.post('/callback', function(req, res) {
  let line = new Line();

  let result = req.body.result[0];
  let content = {};

  // Send message by text
  content.contentType = 1;
  content.text        = result.content.text;

  if (result.content.location != null) {
    let gc = new GC();
    let p = {
      'address' : result.content.location.address,
      'lat'     : result.content.location.longitude,
      'lng'     : result.content.location.latitude
    };

    gc.fetchPlaces(p, function(places) {
      let text = '';
      for (let i=0; i < places.length || i < 5; i++) {
        if (!isNaN(places[i].distance)) {
          text += "[ " + places[i].distance/1000 + " km ]\r\n"
          text += places[i][0].trim() + "\r\n";
          text += places[i][1] + "\r\n\r\n";
        }
      }

      content.text = text;

      line.send(result.content.from, content);
    });

  } else {
    let dialogue = new Dialogue();
    dialogue.getMessage(content, function(message) {
      line.send(result.content.from, message);
    });

  }

  res.end();
});

module.exports = router;
