"use strict"

var GC      = require('../model/GC.js');
var Line    = require('../model/line.js');
var express = require('express');
var router = express.Router();

router.post('/callback', function(req, res) {
  let result = req.body.result[0];
  let content = {};

  console.log(JSON.stringify(req.body));

  // Send message by text
  content.contentType = 1;
  content.text        = result.content.text;

  let line = new Line();
  line.send(result.content.from, content);

  res.end();
});

module.exports = router;
