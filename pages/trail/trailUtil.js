const startMarkerIcon = '../../images/icon5.png';
const endMarkerIcon = '../../images/icon2.png';
const maxMarkerIcon = '../../images/icon3.png';
const iconSize = 24;
// 不同速度路径颜色，单位米/秒
const speedColorList = [
  {
    min: 0,
    max: 1,
    color: '#ffd500'
  },
  {
    min: 1,
    max: 2,
    color: '#ff8800'
  },
  {
    min: 2,
    max: 3,
    color: '#ff5d00'
  },
  {
    min: 3,
    max: 5,
    color: '#ff4d00'
  },
  {
    min: 5,
    max: 10,
    color: '#ff3d00'
  },
  {
    min: 10,
    max: 20,
    color: '#ff2d00'
  },
  {
    min: 20,
    max: 7900,
    color: '#ff1d00'
  },
]

function getUserAuth() {
  wx.getSetting({
    success: function (res) {
      var statu = res.authSetting;
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

function getDistance(p1, p2) {
  let radLat1 = p1.latitude * Math.PI / 180.0;
  let radLat2 = p2.latitude * Math.PI / 180.0;
  let a = radLat1 - radLat2;
  let b = p1.longitude * Math.PI / 180.0 - p2.longitude * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = Math.round(s * 6378137);

  return s
}

function setSpeedRank(point) {
  for (let i = 0; i < speedColorList.length - 1; i++) {
    if (point.speed >= speedColorList[i].min && point.speed < speedColorList[i].max) {
      point.rank = i;
      return;
    }
  }
  point.rank = speedColorList.length - 1;
}

function addPolyline(page, point) {
  let line = page.data.polyline[page.data.polyline.length - 1];
  let prev = page.data.prevPoint;

  setSpeedRank(point);
  if (prev.rank && prev.rank != point.rank) {
    line = {
      points: [prev, point],
      color: speedColorList[point.rank].color,
      width: 8,
      arrowLine: true
    };
    page.data.polyline.push(line);
    page.setData({polyline: page.data.polyline});
  }
  else { 
    line.color = speedColorList[point.rank].color;
    line.points.push(point);
    page.setData({polyline: page.data.polyline});
  }
}

function changeBoundary(page, point) {
  let changed = false;

  if (page.data.minPoint.latitude > point.latitude) {
    page.data.minPoint.latitude = point.latitude;
    changed = true;
  }
  if (page.data.minPoint.longitude > point.longitude) {
    page.data.minPoint.longitude = point.longitude;
    changed = true;
  }
  if (page.data.maxPoint.latitude < point.latitude) {
    page.data.maxPoint.latitude = point.latitude;
    changed = true;
  }
  if (page.data.maxPoint.longitude < point.longitude) {
    page.data.maxPoint.longitude = point.longitude;
    changed = true;
  }
  if (changed) {
    let distance = getDistance(page.data.minPoint, page.data.maxPoint);
    if (distance < 100) {
      page.setData({scale: 18});
    }
    else if (distance < 1000) {
      page.setData({scale: 15});
    }
    else if (distance < 5000) {
      page.setData({scale: 13});
    }
    else if (distance < 10000) {
      page.setData({scale: 12});
    }
    else if (distance < 20000) {
      page.setData({scale: 11});
    }
    else if (distance < 50000) {
      page.setData({scale: 10});
    }
    else if (distance < 200000) {
      page.setData({scale: 8});
    }
    else {
      page.setData({scale: 5});
    }
  }
}

function updateMaxSpeed(page, point) {
  page.data.maxSpeed = point.speed;
  point.id = 2;
  point.width = iconSize;
  point.height = iconSize;
  point.iconPath = maxMarkerIcon;
  point.callout = {
    color: '#5d5d5d',
    fontSize: 14,
    borderRadius: 6,
    padding: 8,
    bgColor: '#fff',
    display: 'ALWAYS',
    content: '最大速度' + point.speed + ' m/s'
  }
  if (page.data.markers.length > 1) {
    page.data.markers.pop();
  }
  page.data.markers.push(point);
  page.setData({markers: page.data.markers});
}

function addPoint(page, point) {
  let now = new Date();

  if (page.data.prevPoint != null) {
    let distance = getDistance(page.data.prevPoint, point);
    let totalDistance = page.data.totalDistance + distance;
    
    // 过滤抖动
    if (distance < page.data.minDistance) {
      return;
    }
    
    point.speed = Math.round(distance / (now - page.data.prevTime) * 1000 * 100) / 100;
    if (page.data.maxSpeed < point.speed) {
      updateMaxSpeed(page, point);
    }
    addPolyline(page, point);
    changeBoundary(page, point);
    page.setData({
      totalTime: Math.round((now - page.data.startTime) / 1000),
      totalDistance: Math.round(totalDistance),
      avgSpeed: Math.round(totalDistance / (now - page.data.startTime) * 1000),
      maxSpeed: Math.round(page.data.maxSpeed)
    });
  }
  else {
    page.data.minPoint = {
      latitude: point.latitude,
      longitude: point.longitude
    };
    page.data.maxPoint = {
      latitude: point.latitude,
      longitude: point.longitude
    };
    page.data.polyline.push({
      points: [point],
      color: speedColorList[0].color,
      width: 8,
      arrowLine: true
    });
    point.id = 1;
    point.width = iconSize;
    point.height = iconSize;
    point.iconPath = startMarkerIcon;
    point.callout = {
      color: '#5d5d5d',
      fontSize: 14,
      borderRadius: 6,
      padding: 8,
      bgColor: '#fff',
      display: 'ALWAYS',
      content: '起点'
    };
    page.data.markers.push(point);
    page.setData({
      markers: page.data.markers
    });
  }

  page.data.prevTime = now;
  page.data.prevPoint = point;
  page.setData({
    longitude: point.longitude,
    latitude: point.latitude,
    counter: page.data.counter + 1
  });
}

function setEndPoint(page) {
  let last = page.data.prevPoint;

  last.id = 3;
  last.width = iconSize;
  last.height = iconSize;
  last.iconPath = endMarkerIcon;
  last.callout = {
    color: '#5d5d5d',
    fontSize: 14,
    borderRadius: 6,
    padding: 8,
    bgColor: '#fff',
    display: 'ALWAYS',
    content: '终点'
  };
  page.data.markers.push(last);
  page.setData({
    latitude: (page.data.minPoint.latitude + page.data.maxPoint.latitude) / 2,
    longitude: (page.data.minPoint.longitude + page.data.maxPoint.longitude) / 2,
    markers: page.data.markers
  });
}

module.exports = {
  addPoint,
  setEndPoint,
  getUserAuth,
}