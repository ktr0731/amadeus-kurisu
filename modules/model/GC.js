"use strict"

var request     = require('request');
var util        = require('util');
var client      = require('cheerio-httpcli');
var prefectures = (require('../../resources/prefectures.json'));

var GC = function() {};

GC.prototype.fetchPlaces = function(p1, callback) {

  let reg = /.*\ .*\ (..[都道府県])/g;
  // p1: LINE

  // Fetch places
  let p1Pref = (reg.exec(p1))[1];

  let url = util.format('http://nesica.net/playshop/search/?pref_id=' + prefectures[p1Pref] + '&nesica_id=2110');
  client.fetch(url, function(err, $, res, body) {
    let places = [];
    $('.find-list').each(function() {
      $(this).each(function(i) {
        places.push($(this).text().trim().replace(/\r?\n/g, '').split(/\s*\s/));
      });
    });
    callback(places);
  });

  // Parse target prefecture
};

var a = new GC();
var tmp = { 'address' : '' };
tmp = "aaa bbb 福島県会津若松市";
a.fetchPlaces(tmp, function(places) {
  console.log(places);
});
