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
    connected: false,
    batteryAt30Degree: 10,
    batteryRemainHours: 10,
    currentTemp: 0,
    targetTemp: 37
  },

  oneStepConnect: function() {
    wx.openBluetoothAdapter({
      success: (res) => {
        this.setData({message: '初始化蓝牙适配器成功' + JSON.stringify(res)});
        wx.createBLEConnection({
          deviceId: this.data.deviceId,
          success: (res) => {
            this.setData({message: '蓝牙设备连接成功\n'});
            this.setData({connected: true});
          },
          fail: (res) => {
            this.setData({message: '蓝牙设备连接失败，请稍后重试，失败原因 = ' + JSON.stringify(res)});
          }
        });
      },   
      fail: (res) => {
        this.setData({message: '初始化蓝牙适配器失败， 失败原因： ' + JSON.stringify(res)});
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

  setTargetTemp: function(e) {
    this.data.targetTemp = e.detail.value;
  },

  writeTemp: function() 
  {
    let buffer = new ArrayBuffer(3);
    let dataView = new DataView(buffer);
    dataView.setUint8(0, 0x01);
    dataView.setUint16(1, this.data.targetTemp * 10);
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
    this.setData({batteryRemainHours: (this.data.batteryAt30Degree / (1 + (this.data.targetTemp - 30) / 30)).toFixed(2)});
  },

  writeTempHigh: function()
  {
    this.setData({targetTemp: 40});
    this.writeTemp();
  },

  writeTempMed: function()
  {
    this.setData({targetTemp: 35});
    this.writeTemp();
  },

  writeTempLow: function()
  {
    this.setData({targetTemp: 30});
    this.writeTemp();
  },

  GetTemp: function()
  {
    let buffer1 = new ArrayBuffer(1);
    let dataView1 = new DataView(buffer1);
    dataView1.setUint8(0, 0x10);
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
      value: buffer1,
      success: (res) => {
        this.setData({message: "发送获取温度命令成功"});
      },
      fail: (res) => {
        this.setData({message: "发送获取温度命令失败，失败原因： " + JSON.stringify(res)});
      },
    }); 
  },

  onBLECharacteristicRead: function(characteristic) {
    let dataView = new DataView(characteristic.value);
    this.setData({currentTemp: dataView.getUint16(0) / 10});
  },

  readTemp: function()
  {
    this.GetTemp();
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