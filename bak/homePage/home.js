var tool = require("../../tools/login.js") //引入登录函数
import templates from '../../template/template.js'
// pages/homePage/home.js
Page({

  //页面的初始数据
  data: {
    yue: true,
    yue1: true,
    yue2: true,
    condition: false, //是否连接设备
    isMacth: false, //设备是否配对
    Attribute: [{
        text: "服饰温度",
        attribute: 30,
      },
      {
        text: "衣外温度",
        attribute: -5,
      },
      {
        text: "当前功率",
        attribute: "30W",
      },
      {
        text: "剩余电量",
        attribute: "36%",
      }
    ],
    gearInformation: [{
        disconnected: "/images/icon_low_down.png",
        connected: "/images/icon_low_open.png",
        text: "低"
      },
      {
        disconnected: "/images/icon_medium_down.png",
        connected: "/images/icon_medium_open.png",
        text: "中"
      },
      {
        disconnected: "/images/icon_high_down.png",
        connected: "/images/icon_high_open.png",
        text: "高"
      },
    ], //控温档位相关信息
    isConnected: false, //是否连接
    isOpen:true, //switch开关是否打开
    whichGear:3, //选择哪个档位
    menuButton: {
      height: 0, //高度 px
      width: 0, //宽度 px
      top: 0, //离顶部的距离 px
    }, //胶囊的信息
    screen: {
      height: 667, //高度 px
      width: 375, //宽度 px
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
          ["menuButton.height"]: menuButtonObject.height,
          ["menuButton.width"]: menuButtonObject.width,
          ["menuButton.top"]: menuButtonObject.top,
          ["screen.height"]: res.screenHeight,
          ["screen.width"]: res.screenWidth,
        })

      },
    })

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {
    //文字渐出
    // this.app.show(this, 'slide_up1',1,2000)
    console.log(1111)
    console.log("设备为：" + this.data.a)
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
    //文字渐出
    // this.app.show(this, 'slide_up1',0,1500)
  },

  //跳转到equipment页面
  toEquipment: function () {
    wx.redirectTo({
      url: '/pages/equipmentPage/equipment'
    })
  },

  //跳转到mine页面
  toMine: function () {
    wx.redirectTo({
      url: '/pages/minePage/mine'
    })
  },

  // 配对
  Match: function () {
    this.setData({
      isMacth: true
    })
  },

  //切换日月数据
  change: function (e) {
    this.setData({
      yue: !this.data.yue
    })
  },
  change1: function (e) {
    this.setData({
      yue1: !this.data.yue1
    })
  },
  change2: function (e) {
    this.setData({
      yue2: !this.data.yue2
    })
  },

  //改变连接状态
  changeCondition: function () {
    this.setData({
      condition: !this.data.condition
    })
  },

  //跳转到测量页面
  to: function () {
    wx.navigateTo({
      url: '/pages/homePage/measure/measure'
    })
  },

  //跳转至添加设备
  addMachine() {
    wx.navigateTo({
      url: '/pages/minePage/addMachine/addMachine',
    })
  },
  isOpen:function(e)
  {
    var that = this
    that.setData({
      isOpen:e.detail.value,
      whichGear:3,
    })
    console.log(e.detail.value)
  },
  chooseGear: function (event) {
    var that = this
    console.log(event.currentTarget.dataset.index)
    var whichGear = event.currentTarget.dataset.index
    that.setData({
      whichGear: event.currentTarget.dataset.index
    })
    if (that.data.isConnected) {
      if (whichGear == 0) {
        wx.writeBLECharacteristicValue({
          deviceId: that.data._deviceId,
          serviceId: that.data._deviceId,
          characteristicId: that.data._characteristicId,
          value: 0x4C54,
          success: function () {
            wx.showToast({
              title: '已开启低档！',
              icon: 'success',
              duration: 1000,
            })
          },
          fail: function () {
            wx.showToast({
              title: '开启失败！',
              icon: 'error',
              duration: 1000,
            })
          }
        })
      } else if (whichGear == 1) {
        wx.writeBLECharacteristicValue({
          deviceId: that.data._deviceId,
          serviceId: that.data._deviceId,
          characteristicId: that.data._characteristicId,
          value: 0x4D54,
          success: function () {
            wx.showToast({
              title: '已开启中档！',
              icon: 'success',
              duration: 1000,
            })
          },
          fail: function () {
            wx.showToast({
              title: '开启失败！',
              icon: 'error',
              duration: 1000,
            })
          }
        })
      } else if (whichGear == 2) {
        wx.writeBLECharacteristicValue({
          deviceId: that.data._deviceId,
          serviceId: that.data._deviceId,
          characteristicId: that.data._characteristicId,
          value: 0x4854,
          success: function () {
            wx.showToast({
              title: '已开启高档！',
              icon: 'success',
              duration: 1000,
            })
          },
          fail: function () {
            wx.showToast({
              title: '开启失败！',
              icon: 'error',
              duration: 1000,
            })
          }
        })
      }
    }
    else{
      wx.showToast({
        title: '设备未连接！',
        icon: 'error',
        duration: 1000,
      })
    }
  }

})