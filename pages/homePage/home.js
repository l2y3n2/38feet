// pages/ble/ble.js
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: 'BLE测试',
    // **********这里指定ID************
    deviceId: 'CF05C15E-2CB9-B19B-6BE2-34EBF1D5B554',
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
    currentTemp: 0,
    targetTemp: 37,
    myvalue: new ArrayBuffer(4)
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
            //wx.stopBluetoothDevicesDiscovery();              
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

  oneStepConnect: function() {
    this.openBLE();
    this.connectDevice();
  },

  changeTargetTemp: function (e) {
    this.setData({minDistance: e.detail.value});
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

  writeTemp: function()
  {
    let buffer = new ArrayBuffer(2);
    let dataView = new DataView(buffer);
    dataView.setUint8(0,48);
    // 目标温度
    dataView.setUint8(1,this.data.targetTemp);
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
      value: buffer,
      success: (res) => {
        this.setData({message: "蓝牙设置温度成功"});
      },
      fail: (res) => {
        this.setData({message: "蓝牙设置温度失败，失败原因： " + JSON.stringify(res)});
      },
    }); 
  },

  onBLECharacteristicRead: function(characteristic) {
    this.setData({message: '读取到蓝牙数据:' + JSON.stringify(ab2hex(characteristic.value))});
    // 根据格式设置
    this.setData({currentTemp: 0});
    //wx.offBLECharacteristicValueChange(onBLECharacteristicRead);
  },

  readTemp: function()
  {
    wx.onBLECharacteristicValueChange(this.onBLECharacteristicRead);
    //wx.readBLECharacteristicValue({
    wx.notifyBLECharacteristicValueChange({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
      state: true,
      success: (res) => {
        this.setData({message: "蓝牙读取温度成功"});
      },
      fail: (res) => {
        this.setData({message: "蓝牙读取温度失败，失败原因： " + JSON.stringify(res)});
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