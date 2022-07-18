var tool = require("../../../tools/login.js") //引入登录函数

// pages/homePage/home.js
Page({

  //页面的初始数据
  data: {
    end:false,
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

    setTimeout(() => {
      this.setData({
        end:true
      })
    }, 15000);
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {
    //文字渐出
    // this.app.show(this, 'slide_up1',1,2000)
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
  },

  //返回上一级
  back:function(){
    wx.navigateBack({
      delta: 1,
    })
  }

})