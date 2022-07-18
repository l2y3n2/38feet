// pages/minePage/mineDetail/mineDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    input:"", //input里的占位符名字
    isDetail:true, //是否进入编辑
    user:{}, //存储用户信息
    userDetail:[{
      nick:'昵称',
      name:'金乌用户123'
    },{
      nick:'身高',
      name:'点击设置'
    },{
      nick:'体重',
      name:'点击设置'
    },{
      nick:'年龄',
      name:'点击设置'
    },], //个人资料
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.app = getApp();

    // 获取用户信息
    wx.getStorage({key:"user",success:(res)=>{
      this.setData({
        user:res.data
      })
    }})
    wx.getStorage({key:"userDetail",success:(res)=>{
      this.setData({
        userDetail:res.data
      })
    }})

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //文字渐出
    // this.app.show(this, 'slide_up1',1,2000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //文字渐出
    // this.app.show(this, 'slide_up1',0,1500)
  },

  // 返回到上一个页面
  back:function(){
    wx.navigateBack({
      delta: 1,
    })
  },

  // 退出编辑
  change:function(){
    this.setData({
      isDetail:!this.data.isDetail
    })
    wx.setStorage({
      key: "userDetail",
      data: this.data.userDetail,
      success(res) {
        console.log(res)
      }
    })
  },


  // 进入设置
  shezhi:function(res){
    console.log(res)
    this.data.id = res.currentTarget.dataset.id
    this.setData({
      input:this.data.userDetail[this.data.id].name,
      isDetail:!this.data.isDetail
    })
  },

  // 改input里的值
  changeInput:function(res){
    console.log(res.detail.value)
    this.setData({
      ["userDetail["+this.data.id+"].name"]:res.detail.value
    })

  }
})