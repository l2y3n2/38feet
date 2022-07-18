var tool = require("../../tools/login.js") //引入登录函数

// pages/homePage/home.js
Page({

  //页面的初始数据
  data: {
    machine:[{
      name:"Terminal P1",
      condition:"已启用"
    },
    {
      name:"Airbear P1",
      condition:"已启用"
    }], //设备信息
    isHave:true, //是否拥有设备
    user:{}, //存储用户信息
    menuButton:{
      height:0, //高度 px
      width:0,  //宽度 px
      top:0,    //离顶部的距离 px
    }, //胶囊的信息
    screen:{
      height:667, //高度 px
      width:375,  //宽度 px
    }, //屏幕信息
    showDialog:false,//是否显示解绑弹窗

  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.app = getApp();

    // 获取用户信息
    wx.getStorage({key:"user",success:(res)=>{
      this.setData({
        user:res.data
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

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  //生命周期函数--监听页面显示
  onShow: function () {

    //判断是否来自重命名跳转
    let ifRename=wx.getStorageSync('ifRename');
    console.log(ifRename)
    if(ifRename){
    //获取重命名后的新名称
    var that=this;
    let newName=wx.getStorageSync('newName');
    let oldName=wx.getStorageSync('oldName');
    console.log(newName,oldName);
    (that.data.machine).forEach(function(item,index){
       if(oldName===item.name){
         console.log(item.name)
         let machine=that.data.machine;
         machine[index].name=newName;
         that.setData({
            machine:machine,
         });
       }
       wx.removeStorageSync('ifRename');
       wx.removeStorageSync('newName');
       wx.removeStorageSync('oldName');
       return;
    });
   }
    console.log(this.data.machine)

      //文字渐出
      // this.app.show(this, 'slide_up1',1,2000);
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
    //文字渐出
    // this.app.show(this, 'slide_up1',0,1500)
  },

  //跳转到equipment页面
  toEquipment: function(){
    wx.redirectTo({
      url: '/pages/equipmentPage/equipment'
    })
  },

  //跳转到mine页面
  toMine: function(){
    wx.redirectTo({
      url: '/pages/minePage/mine'
    })
  },

  //跳转到个人资料界面
  toDetail:function(){
    wx.navigateTo({
      url: '/pages/minePage/mineDetail/mineDetail',
    })
  },

  //跳转到重命名界面
  rename(e){
    let name=e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/minePage/rename/rename?oldName='+name,
      })
  },

  //点击解绑键,生成解绑弹窗
  toUnbind(e){
    let index=e.currentTarget.id;
    this.setData({
      showDialog:(!this.data.showDialog),
      obj_unbind_index:this.data.machine[index],//被选中的将要解绑的设备在machine数组的下标
    })
  },

  //点击阴影区域或取消键，或解绑成功后，退出弹窗
  toggleDialog(){
    this.setData({
      showDialog:!(this.data.showDialog),
      obj_unbind_index:-1,
    })
  },

  //点击解绑弹窗的确定
  unbind(e){
    let machine=this.data.machine; 
    let id=this.data.obj_unbind_index;
    machine.splice(id,1);
    this.setData({
      machine:machine,
    });
    wx.showModal({
      content: '解绑成功',
      showCancel:false,
    });
    this.toggleDialog();
  },

  //跳转至添加设备
  addMachine(){
   wx.navigateTo({
     url: '/pages/minePage/addMachine/addMachine',
   })
  },
  
})
