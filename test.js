var geolib = require('geolib');

var p1 = { latitude : 137.01739992, longitude : 36.72362158 };
var p2 = { latitude : 139.929810, longitude : 37.494761 };

console.log(geolib.getDistance(p1, p2) / 1000);
