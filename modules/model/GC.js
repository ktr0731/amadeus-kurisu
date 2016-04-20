"use strict"

var request     = require('request');
var client      = require('cheerio-httpcli');
var prefectures = require('../../resources/prefectures.json');
var geolib      = require('geolib');

var GC = function() {};

GC.prototype.fetchPlaces = function(p1, callback) {

  var reg = /.*\ (..[都道府県])/g;
  // p1: LINE

  // Fetch places
  var p1Pref = (reg.exec(p1.address))[1];
  var url = 'http://nesica.net/playshop/search/?pref_id=' + prefectures[p1Pref] + '&nesica_id=2110';
  var places = [];

  client.fetch(url).then(function(result) {

    var $ = result.$;

    $('.find-list').each(function() {
      $(this).each(function(i) {
        places.push($(this).text().trim().replace(/\r?\n/g, '').split('\t'));
      });
    });

    var promises = [];
    for (var i = 0; i < places.length; i++) {
      var url = 'http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder?output=json&appid=' + process.env.YAHOO_APP_ID + '&query=' + encodeURIComponent(places[i][1]);
      var options = {
        'url'  : url,
        'json' : true
      };

      promises.push(getPosition(i, options));
    }

    Promise.all(promises).then(function() {
      for (var i = 0; i < places.length; i++) {
        if (places[i].lat !== undefined && places[i].lng !== undefined) {
          console.log(p1.lat + ", " + p1.lng);
          places[i].distance = geolib.getDistance({ latitude : p1.lat, longitude : p1.lng }, { latitude : places[i].lat, longitude : places[i].lng });
        }
      }

      places.sort(function(a, b) {
        if (a.distance > b.distance) {
          return 1;
        } else if (a.distance < b.distance) {
          return -1;
        }

        return 0;
      });

      for (var i = 0; i < places.length; i++) {
        if (places[i].distance !== undefined && !isNaN(places[i].distance)) {
          console.log(i + "番目 - " + places[i][0].trim() + ': ' + places[i].distance + "(" + places[i].distance/1000 + "km)");
        }
      }

      callback(places);
    });
  });

  function getPosition(i, options) {
    return new Promise(function(resolve, reject) {
      request.get(options, function(err, res, body) {
        if (err || !body.Feature) {
          console.log('fetch error');
          //return;
        } else {
          var coord = body.Feature[0].Geometry.Coordinates;
          places[i].lat = (coord.split(','))[0];
          places[i].lng = (coord.split(','))[1];
        }

        resolve();
      });
    });
  }
};
module.exports = GC;
