"use strict"

var request     = require('request');
var util        = require('util');
var client      = require('cheerio-httpcli');
var prefectures = (require('../../resources/prefectures.json'));

var GC = function() {};

GC.prototype.fetchPlaces = function(p1) {

  let reg = /.*\ .*\ (..[都道府県])/g;
  // p1: LINE

  // Fetch places
  let p1Pref = (reg.exec(p1.address))[1];

  let url = util.format('http://nesica.net/playshop/search/?pref_id=' + prefectures[p1Pref] + '&nesica_id=2110');
  client.fetch(url, function(err, $, res, body) {
    $('.find-list').each(function() {
      $(this).each(function(i) {
        console.log($(this).text());
      });
    });

  });

  // Parse target prefecture
  console.log(prefectures[p1Pref]);
};

var a = new GC();
var tmp = { 'address' : '' };
tmp.address = "aaa bbb 福島県会津若松市";
a.fetchPlaces(tmp);
