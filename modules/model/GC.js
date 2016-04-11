"use strict"

var request     = require('request');
var util        = require('util');
var $           = require('jquery');
var prefectures = (require('../../resources/prefectures.json'));

var GC = function() {};

GC.prototype.fetchPlaces = function(p1) {

  let reg = /.*\ .*\ (..[都道府県])/g;
  // p1: LINE

  // Fetch places
  let p1Pref = (reg.exec(p1.address))[1];

  request.get(util.format('http://nesica.net/playshop/search/?pref_id=' + prefectures[p1Pref] + '&nesica_id=2110'), function(err, res, body) {
    console.log(body);
  });
  // Parse target prefecture
  console.log(prefectures[p1Pref]);
};

var a = new GC();
var tmp = { 'address' : '' };
tmp.address = "aaa bbb 福島県会津若松市";
a.fetchPlaces(tmp);
