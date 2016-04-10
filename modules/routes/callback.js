"use strict"

var line    = require('../model/line.js');
var express = require('express');
var router = express.Router();

router.post('/callback', function(req, res) {
  let result = req.body.result[0];
  let content = {};

  // Send message by text
  content.contentType = 1;
  content.text        = result.content.text;
  line.send(result.content.from, content);
});

module.exports = router;
