
// pages/login/login.js
Page({

  // 页面的初始数据
  data: {
    isHide: true, //控制页面显示
    menuButton:{
      height:0, //高度 px
      width:0,  //宽度 px
      top:0,    //离顶部的距离 px
    }, //胶囊的信息
    screen:{
      height:667, //高度 px
      width:375,  //宽度 px
    }, //屏幕信息
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.app = getApp();

    // 获取胶囊按钮信息
    let menuButtonObject = wx.getMenuButtonBoundingClientRect()
    console.log(menuButtonObject)

    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)

        //更新胶囊和屏幕信息
        this.setData({
          ["menuButton.height"]:menuButtonObject.height,
          ["menuButton.width"]:menuButtonObject.width,
          ["menuButton.top"]:menuButtonObject.top,
          ["screen.height"]:res.screenHeight,
          ["screen.width"]:res.screenWidth,
        })
      },
    })

  },

  //登录函数
  login:function(){
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        wx.setStorage({key:"user",data:res.userInfo})
        wx.switchTab({
          url: '../homePage/home'
        });
      },
      fail() {
        wx.showModal({
          title: "登录失败",
          content: "授权失败",
          showCancel: false,
          success: function () {}
        })
      }
    })
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    //文字渐出
    this.app.show(this, 'slide_up1',1,6000)
    this.app.slideupshow(this, 'slide_up1', this.data.screen.height/2-80, 1)

    //按钮渐出
    this.app.show(this, 'slide_up2',1)
    this.app.slideupshow(this, 'slide_up2', this.data.screen.height/2-20, 1)
  }

})