const app = getApp()

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进制字符串示例
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
  data: {
    devices: [],
    connected: false,
    chs: [],
    ifSearching: 0, //0为搜索前，1为搜索中，-1为搜索完毕
    hasFound: 0, //0为未发现设备，1为发现设备（配对成功）
    targetName: "37WARM" // 目标设备的name，名字不对请改这里
  },

  onLoad: function (options) {
    this.app = getApp();
    console.log(this.data.ifSearching, this.data.hasFound)
  },

  onShow: function () {
    // this.app.show(this, 'slide_up1',1,2000);
  },

  //点击箭头返回
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //点击下方按钮
  tap() {
    let ifSearching = this.data.ifSearching;
    let hasFound = this.data.hasFound;
    //console.log(ifSearching,hasFound)
    //开始搜索
    if (ifSearching == 0) {
      this.setData({
        ifSearching: ++ifSearching
      });
      this.onShow();
      this.openBluetoothAdapter()
      return;
    } else if (ifSearching == 1) {
      this.closeBluetoothAdapter()
      this.setData({
        ifSearching: --ifSearching
      });
      this.onShow();
      return;
    } else if (ifSearching == -1) {
      this.setData({
        ifSearching: 1
      });
      this.stopBluetoothDevicesDiscovery();
      this.closeBluetoothAdapter()
      this.onShow();
      this.openBluetoothAdapter()
      return;
    }
  },

  /*1.初始化蓝牙设备*/
  openBluetoothAdapter() { //打开蓝牙适配器
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        wx.showToast({
          title: '初始化成功',
          icon: 'success',
          duration: 1000
        })
        this.startBluetoothDevicesDiscovery() //开始搜索附近的蓝牙设备
      },
      fail: (res) => {
        wx.showToast({
          title: '请打开蓝牙!',
          icon: 'error',
          duration: 1000
        })
        this.setData({
          ifSearching: 0
        })
      }
    })
  },

  /*2.初始化成功之后开始搜索蓝牙设备*/
  startBluetoothDevicesDiscovery() { //开始搜索附近的蓝牙设备
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true //开始搜索的标志
    wx.showLoading({
      title: '正在搜索',
    })
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false, //是否允许重复上报同一设备
      interval: 0, //上报设备的间隔
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        wx.hideLoading()
        this.onBluetoothDeviceFound() //监听是否搜索到新设备
      },
    })
  },

  /*3.监听是否搜索到新设备（若在 wx.onBluetoothDeviceFound 回调了某个设备，则此设备会添加到 wx.getBluetoothDevices 接口获取到的数组中） */
  onBluetoothDeviceFound() { //监听搜索到新设备的事件（是否搜索到新设备）
    wx.showLoading({
      title: '正在查找设备',
    })
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices //搜索到的设备集合
        const idx = inArray(foundDevices, 'deviceId', device.deviceId) //查找搜索到的设备集合中是否有当前设备？
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
        this.getBluetoothDevices();
      })
    })
  },

  /*4.获取搜索到的蓝牙设备的信息*/
  getBluetoothDevices() {
    var that = this
    wx.getBluetoothDevices({
      success: function (res) {
        for (var i = 0; i < res.devices.length; i++) { //遍历devices数组，从所有能搜索到的设备中查找目标设备
          if (res.devices[i].name == that.data.targetName ||
            res.devices[i].localName == that.data.targetName) {
            that.setData({
              deviceId: res.devices[i].deviceId,
              name: res.devices[i].name
            })
            that.createBLEConnection() //如果查找到目标设备，则进行连接
            return;
          }
        }
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '未找到设备',
              icon: 'error',
              duration: 1000
            })
          },
        })
      },
      fail: function () {
        wx.showToast({
          title: '搜索蓝牙设备失败！',
          icon: "error",
          duration: 1000,
        })
      }
    })

  },

  /*5.搜索成功后根据deviceId建立连接*/
  createBLEConnection() { //若小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需再次进行搜索操作
    var that = this
    wx.showLoading({
      title: '正在连接......',
    })
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: (res) => {
        this.setData({
          connected: true,
        })
        wx.hideLoading({ //连接成功后给出提示
          success: (res) => {
            wx.showToast({
              title: '连接成功！',
            })
            this.setData({
              hasFound: 1,
              ifSearching: -1
            })
          },
        })
        this.getBLEDeviceServices() //连接成功后获取uuid
      },
      fail: function () {
        wx.hideLoading({
          success: (res) => { //连接失败后给出提示
            wx.showToast({
              title: '连接失败！',
              icon: 'error',
              duration: 1000
            })
          },
        })
      }
    })
    this.stopBluetoothDevicesDiscovery() //停止扫描
  },

  /*6.建立连接之后获取蓝牙设备的服务uuid*/
  getBLEDeviceServices() { //获取蓝牙低功耗设备所有服务
    var that = this
    wx.getBLEDeviceServices({
      deviceId: that.data.deviceId,
      success: (res) => {
        this.getBLEDeviceCharacteristics(deviceId, res.services[0].uuid) //获取uuid之后查看特征值
      }
    })
  },

  /*7.查看当前蓝牙设备的特征值*/
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    var that = this
    wx.getBLEDeviceCharacteristics({ //获取蓝牙低功耗设备某个服务中所有特征
      deviceId, //蓝牙设备id
      serviceId, //蓝牙主服务id
      success: (res) => {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.write) { //支持write操作
            this.setData({
              canWrite: true //能写的标志
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            var pages = getCurrentPages();
            var prePage = pages[pages.length - 2];
            prePage.setData({
              _deviceId: deviceId,
              _serviceId: serviceId,
              _characteristicId: item.uuid,
              isConnected:true
            })
          }
          if (item.properties.notify) {
            /*创建连接，发送指令 */
            wx.notifyBLECharacteristicValueChange({ //启用蓝牙低功耗设备特征值变化时的 notify 功能
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
              success: function (res) {
                //开始监听
                /* wx.onBLECharacteristicValueChange(function (res) {
                   //拿到蓝牙设备返回的数据并转化为字符串
                   var noticeId = that.ab2hex(res.value)
                   //拿到值后去后台请求服务（具体需求根据实际情况）
                   wx.request({
                     url: 'url',
                     method: "POST",
                     data: {
                       'xx': noticeId
                     }, //这里的url和xx都根据实际情况写
                     success: function (res) {
                       //将服务器返回的数据转化为ArrayBuffer格式的数据，然后写入蓝牙设备
                       this.writeBLECharacteristicValue(that.string2buffer(res.data.data.ciphertext))
                     }
                   })
                 })*/
              }
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })

  },

  /*8.将指令写入蓝牙设备 */
  writeBLECharacteristicValue(buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._deviceId,
      characteristicId: this._characteristicId,
      value: buffer,
      success: function () {
        wx.showToast({
          title: '写入成功！',
          icon: 'success',
          duration: 1000,
        })
      },
      fail: function () {
        wx.showToast({
          title: '写入失败！',
          icon: 'error',
          duration: 1000,
        })
      }
    })
  },

  //停止扫描
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },

  //关闭连接
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },

  //关闭蓝牙适配器
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: '已取消搜索',
          icon: "error",
          duration: 1000,
        })
      },
    })
  },

  /*获取本机蓝牙适配器状态*/
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({ //获取本机蓝牙适配器状态
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) { //正在搜索设备
          this.onBluetoothDeviceFound()
        } else if (res.available) { //蓝牙适配器可用
          this.startBluetoothDevicesDiscovery() //开始搜索附近的蓝牙设备
        }
      }
    })
  },

})