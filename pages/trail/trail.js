// pages/trail/trail.js
const utils = require("./trailUtil.js") //引入登录函数
const scale = wx.getSystemInfoSync().windowWidth / 750

Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    scale: 15,
    disableStartButton: false,
    disableStopButton: true,
    counter: 0,
    totalDistance: 0,
    totalTime: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    polyline: [],
    markers: [],
    shareUrl: "",
    url:"",
    minDistance: 50,
  },

  trailUpdate: function(res) {
    utils.addPoint(this, res);
  },

  changeMinDistance: function (e) {
    this.setData({minDistance: e.detail.value});
  },

  startTrail: function() {
    this.setData({
      polyline: [],
      markers: [],
      avgSpeed: 0,
      maxSpeed: 0,
      totalDistance: 0,
      totalTime: 0,
      counter: 0
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
        utils.getUserAuth();
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

  onShareAppMessage: function () {
    return {
      title: '邀请您使用37°Warm小程序',
      path: '/pages/login/login', // 当对方点击你分享的小程序时到达的页面
      //imageUrl: '/images/logo.png'  //转发时显示此图片，若没有此参数，默认是传送当前页面截图
    };
  },
  onShareTimeline() {
    this.Creatshareimg();
    return {
      title: '邀请您使用37°Warm小程序',
      path: '/pages/login/login', // 当对方点击你分享的小程序时到达的页面
      imageUrl: this.data.url  //转发时显示此图片，若没有此参数，默认是传送当前页面截图
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      disableStartButton: false,
      disableStopButton: true
    });
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],// 需要显示的转发按钮名称列表.合法值包含 "shareAppMessage"、"shareTimeline"
      success(res) {
        console.log(res);
      },
      fail(e) {
        console.log(e);
      }
    });
  },

Creatshareimg: function () {  
  // 通过 SelectorQuery 获取 Canvas 节点,创建画布
  wx.createSelectorQuery()
    .select('#canvas')
    .fields({
      node: true,
      size: true,
    })
    .exec(this.init.bind(this))
    
},

init(res) {
  const width = res[0].width
  const height = res[0].height
  const canvas = res[0].node
  const ctx = canvas.getContext('2d')
  const dpr = wx.getSystemInfoSync().pixelRatio  
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.scale(dpr, dpr)
  console.log( canvas.width,canvas.height, dpr,width,height,scale ,ctx.width, ctx.height); 
  //const img = canvas.createImage() 
  //this._img = img
  //img.src = './share.png'
  const a = this.data.totalDistance+"km";
  const b = this.data.avgSpeed+"km/h";
  const c = this.data.maxSpeed+"km/s";
  this.render(canvas, ctx,a,b,c);
  
},

render(canvas, ctx,a,b,c) {
  //this.drawshareimg(ctx)
  const imgObj = canvas.createImage()
  imgObj.src = "/images/share.png";
  imgObj.onload = function(){
  ctx.drawImage(this, 0, 0, 750*scale,900*scale);
  ctx.font = "27px serif";
  
  console.log(a,b,c)
  ctx.strokeText(a, 500*scale, 335*scale);
  ctx.strokeText(b, 500*scale, 412.5*scale);
  ctx.strokeText(b, 500*scale, 490*scale);
}; 
  let _this = this 
  wx.canvasToTempFilePath({
    canvas: canvas,
    success(res) {
      console.log('res-->', res);
      _this.setData({
        url: res.tempFilePath,
      })
    },
    fail(err) {
      console.log('err-->', err);
    },
  })
},
// 按钮触发分享功能  
  SharetoFriend: function () { 
    this.Creatshareimg();
    wx.showToast({
      title: '图片生成中...',
      icon: "none",
      duration: 1000
    })
    setTimeout(() => {
      console.log(this.data.url);
      wx.showShareImageMenu({
        //path: '/images/logo.png',
        path: this.data.url,
      })
    },1000)
  
    
    
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