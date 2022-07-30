// pages/trail/trail.js
const utils = require("../../tools/distance.js") //引入登录函数

Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    disableStartButton: false,
    disableStopButton: true,
    counter: 0,
    totalDistance: 0,
    totalTime: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    polyline: [{
      points: [],
      color: '#000000',
      width: 4,
      dottedLine: false
    }]
  },

  addPoint: function(res) {
    var now = new Date();

    this.data.polyline[0].points.push(res);
    console.log('this.data: ', this.data)
    if (this.data.counter > 0) {
      var distance = utils.getDistance(this.data.polyline[0].points[this.data.counter - 1], res);
      var totalDistance = this.data.totalDistance + distance;
      var speed = distance / (now - this.data.prevTime) * 1000;

      if (this.data.maxSpeed < speed) {
        this.data.maxSpeed = speed;
      }

      this.setData({'polyline[0].points': this.data.polyline[0].points});
      this.setData({
        totalTime: Math.round((now - this.data.startTime) / 1000),
        totalDistance: Math.round(totalDistance),
        avgSpeed: Math.round(totalDistance / (now - this.data.startTime) * 1000),
        maxSpeed: Math.round(this.data.maxSpeed)
      });
    }

    this.data.prevTime = now;
    this.setData({
      counter: this.data.polyline[0].points.length,
      longitude: res.longitude,
      latitude: res.latitude
    });
  },

  trailUpdate: function(res) {
    this.addPoint(res);
  },

  startTrail: function() {
    this.setData({
      avgSpeed: 0,
      maxSpeed: 0,
      totalDistance: 0,
      totalTime: 0,
      counter: 0
    });
    this.setData({'polyline[0].points': []});
    wx.getLocation({
      type: 'gcj02',
      success : (res) => {
        this.addPoint(res);
      }
    });
    wx.startLocationUpdateBackground({
      type: 'gcj02',
      success : () => {
        this.setData({
          disableStartButton: true,
          disableStopButton: false,
          startTime: new Date(),
          prevTime: new Date()
        });
        wx.onLocationChange(this.trailUpdate);
      },
      fail: (msg) => {
        //授权失败后引导用户打开定位信息
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
    });
  },

  stopTrail: function() {
    wx.offLocationChange(this.trailUpdate);
    this.setData({
      disableStartButton: false,
      disableStopButton: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      disableStartButton: false,
      disableStopButton: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})