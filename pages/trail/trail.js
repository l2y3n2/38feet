// pages/trail/trail.js
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
    polyline: [{
      points: [],
      color: '#000000',
      width: 4,
      dottedLine: false
    }]
  },

  addPoint: function(res, relocate) {
    this.data.polyline[0].points.push(res);
    if (this.data.polyline[0].points.length > 1) {
      this.setData({'polyline[0].points': this.data.polyline[0].points});
    }
    this.setData({counter: this.data.polyline[0].points.length});
    console.log('polyline', this.data.polyline[0])
    if (relocate) {
      this.setData({
        longitude : res.longitude,
        latitude : res.latitude,
      });
    }
  },

  trailUpdate: function(res) {
    console.log('update location', res);
    this.addPoint(res, true);
  },

  startTrail: function() {
    wx.getLocation({
      type: 'gcj02',
      success : (res) => {
        console.log('start location', res);
        this.addPoint(res, true);
      }
    });
    wx.startLocationUpdateBackground({
    // 执行失败，需要微信申请后台权限？
    // wx.startLocationUpdateBackground({
      type: 'gcj02',
      success : () => {
        this.setData({disableStartButton: true});
        this.setData({disableStopButton: false});
        wx.onLocationChange(this.trailUpdate);
      },
      fail:
    });
  },

  stopTrail: function() {
    wx.offLocationChange(this.trailUpdate);
    this.setData({'polyline[0].points': []});
    this.setData({disableStartButton: false});
    this.setData({disableStopButton: true});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({disableStartButton: false});
    this.setData({disableStopButton: true});
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

  },

  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:23.10229,
        longitude:113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:23.10229,
        longitude:113.3345211,
      }, {
        latitude:23.00229,
        longitude:113.3345211,
      }]
    })
  }
})