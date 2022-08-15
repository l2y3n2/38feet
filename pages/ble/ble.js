// pages/ble/ble.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: 'BLE测试',
    // **********这里指定ID************
    deviceId: null,
    serviceId: null,
  },

  openBLE: function() {
    wx.openBluetoothAdapter({
      success: (res) => {
        this.setData({message: '初始化蓝牙适配器成功' + JSON.stringify(res)});
      },   
      fail: (res) => {
        this.setData({message: '初始化蓝牙适配器失败， 失败原因： ' + JSON.stringify(res)});
      }
    });
  },

  findDevice: function() {
    wx.startBluetoothDevicesDiscovery({
      success: (res) => {
        this.setData({message: '成功打开，开始搜寻附近的蓝牙外围设备 ...' + JSON.stringify(res)});
        wx.getBluetoothDevices({
          success: (res) => {
            this.setData({message: '发现外围蓝牙设备， 设备信息 =' + JSON.stringify(res)});
          },   
          fail: (res) => {
            this.setData({message: '发送外围蓝牙设备失败， 失败原因 =' + JSON.stringify(res)});
          }
        });
      },   
      fail: (res) => {
        this.setData({message: '扫描失败蓝牙设备 ...' + JSON.stringify(res)});
      }
    });
  },

  connectDevice: function() {
    let deviceId = this.data.deviceId;
    let serviceUUID = this.data.serviceId;
    
    wx.createBLEConnection({
      deviceId: deviceId,
      success: (res) => {
        this.setData({message: '蓝牙设备连接成功\n'});
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: (res) => {
            this.setData({message: this.data.message + '获取蓝牙设备Service信息 = ' + JSON.stringify(res)});
            wx.stopBluetoothDevicesDiscovery();              
            wx.getBLEDeviceCharacteristics({
              deviceId: deviceId,
              serviceId: serviceUUID,
              success: (res) => {
                this.setData({message: this.data.message + '蓝牙设备特征值信息读取成功'});
                for (var ik = 0; ik < res.characteristics.length; ik++) {
                  var characteristicsUUID = res.characteristics[ik].uuid;
                  this.setData({message: this.data.message + 'res.characteristics[' + ik + '] uuid = ' + characteristicsUUID});
                  this.setData({message: this.data.message + 'res.characteristics[' + ik + '] properties = ' + JSON.stringify(res.characteristics[ik].properties)});
                }
              },
              fail: (res) => {
                this.setData({message: this.data.message + '获取设备特征值失败, 失败原因 =' + JSON.stringify(res)});
              },
            });
          },
          fail: (res) => {
            this.setData({message: this.data.message + '获取设备服务失败，失败原因 = ' + JSON.stringify(res)});
          }
        });
      },
      fail: (res) => {
        this.setData({message: '蓝牙设备连接失败，请稍后重试，失败原因 = ' + JSON.stringify(res)});
      }
    });
  },

  disconnectDevice: function() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: (res) => {
        this.setData({message: '断开蓝牙设备成功：' + JSON.stringify(res)});
      },   
      fail: (res) => {
        this.setData({message: '断开蓝牙设备失败：' + JSON.stringify(res)});
      }
    });
  },

  testWriteBLE: function()
  {
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: null,
      value: null,
      success: (res) => {
        this.setData({message: "蓝牙发送成功"});
      },
      fail: (res) => {
        this.setData({message: "蓝牙发送失败，失败原因： " + JSON.stringify(res)});
      },
    }); 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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