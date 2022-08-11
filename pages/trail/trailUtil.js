function getUserAuth() {
  wx.getSetting({
    success: function (res) {
      var statu = res.authSetting;
      console.log(statu)
      if (!statu["scope.userLocationBackground"]) {
        wx.showModal({
          title: "是否授权后台使用地理位置",
          content: "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
          success: function (tip) {
            if (tip.confirm) {
              wx.openSetting({
                success: function (data) {
                  if (data.authSetting["scope.userLocationBackground"] === true) {}
                }
              });
            } else {
              console.log('用户拒绝打开设置界面')
            }
          }
        });
      }
    }
  });
}

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

function addPoint(page, res) {
  var now = new Date();

  if (page.data.counter > 0) {
    var distance = getDistance(page.data.polyline[0].points[page.data.counter - 1], res);
    var totalDistance = page.data.totalDistance + distance;
    var speed = distance / (now - page.data.prevTime) * 1000;

    // 过滤抖动
    if (distance < page.data.minDistance) {
      return;
    }      
    if (page.data.maxSpeed < speed) {
      page.data.maxSpeed = speed;
    }
    page.data.polyline[0].points.push(res);
    page.setData({'polyline[0].points': page.data.polyline[0].points});
    page.setData({
      totalTime: Math.round((now - page.data.startTime) / 1000),
      totalDistance: Math.round(totalDistance),
      avgSpeed: Math.round(totalDistance / (now - page.data.startTime) * 1000),
      maxSpeed: Math.round(page.data.maxSpeed)
    });
  }
  else {
    page.data.polyline[0].points.push(res);
  }

  page.data.prevTime = now;
  page.setData({
    counter: page.data.polyline[0].points.length,
    longitude: res.longitude,
    latitude: res.latitude
  });
}

module.exports = {
  addPoint,
  getUserAuth,
}