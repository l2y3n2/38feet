function Rad(d) { //根据经纬度判断距离
  return d * Math.PI / 180.0;
}

function getDistance(p1, p2) {
  // lat1用户的纬度
  // lng1用户的经度
  // lat2商家的纬度
  // lng2商家的经度
  var lat1 = p1.latitude;
  var lng1 = p1.longitude;
  var lat2 = p2.latitude;
  var lng2 = p2.longitude;
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10;
  return s
}

module.exports = {
  getDistance
}