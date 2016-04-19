"use strict"

var request     = require('request');
var client      = require('cheerio-httpcli');
var prefectures = (require('../../resources/prefectures.json'));

var GC = function() {};

GC.prototype.fetchPlaces = function(p1, callback) {

  let reg = /.*\ (..[都道府県])/g;
  // p1: LINE

  // Fetch places
  let p1Pref = (reg.exec(p1.address))[1];

  let url = 'http://nesica.net/playshop/search/?pref_id=' + prefectures[p1Pref] + '&nesica_id=2110';

  client.fetch(url).then(function(result) {
    let places = [];

    let $ = result.$;

    $('.find-list').each(function() {
      $(this).each(function(i) {
        places.push($(this).text().trim().replace(/\r?\n/g, '').split('\t'));
      });
    });


    let shortest = { 'lat' : -1, 'lng' : -1 };

    let promises = [];
    for (let i = 0; i < places.length; i++) {
      let url = 'http://geo.search.olp.yahooapis.jp/OpenLocalPlatform/V1/geoCoder?output=json&appid=' + process.env.YAHOO_APP_ID + '&query=' + places[i][1];
      let options = {
        'url'  : url,
        'json' : true
      };

      promises.push(getPosition(options));
    }

    Promise.all(promises).then(function(p2) {
      if (shortest.lat === -1 && shortest.lng === -1) {
        shortest.lat = p2.lat;
        shortest.lng = p2.lng;
      }

      // places[i].distance = getDistance(p1, p2);

      // 比較
    }).then(function() {
      console.log(places);
      for (let i = 0; i < places.length; i++) {
        if (places[i].distance !== undefined) {
          console.log(places[i][0] + ': ' + places[i].distance);
        }
      }
      callback(places);
    });
  });

  function getPosition(options) {
    return new Promise(function(resolve, reject) {
      request.get(options, function(err, res, body) {
        if (err || !body.Feature) {
          console.log('fetch error');
          //reject(err);
          return;
        }

        let coord = body.Feature[0].Geometry.Coordinates;
        let p2 = {};
        p2.lat = (coord.split(','))[0];
        p2.lng = (coord.split(','))[1];

        resolve(p2);
      });
    });
  }

  /**
   * from http://hamasyou.com/blog/2010/09/07/post-2/
   */
  function getDistance(p1, p2) {
    var distance = 0;
    if ((Math.abs(p1.lat - p2.lat) < 0.00001) && (Math.abs(p1.lng - p2.lng) < 0.00001)) {
      distance = 0;
    } else {
      p1.lat = p1.lat * Math.PI / 180;
      p1.lng = p1.lng * Math.PI / 180;
      p2.lat = p2.lat * Math.PI / 180;
      p2.lng = p2.lng * Math.PI / 180;

      var A = 6378140;
      var B = 6356755;
      var F = (A - B) / A;

      var P1 = Math.atan((B / A) * Math.tan(p1.lat));
      var P2 = Math.atan((B / A) * Math.tan(p2.lat));

      var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(p1.lng - p2.lng));
      var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));

      distance = A * (X + L);
      var decimal_no = Math.pow(10, 5);
      distance = Math.round(decimal_no * distance / 1) / decimal_no;   // kmに変換するときは(1000で割る)
    }

    return distance;
  }
};
module.exports = GC;
