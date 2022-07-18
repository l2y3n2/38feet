
Page({

  data: {
    oldName:"",//重命名前的名字
  },

  onLoad: function (options) {
      let oldName=options.oldName;
      this.setData({
        newName:oldName,
        oldName:oldName,
      })
  },

  //实时获取输入框中的信息
  getNewName(e){
     let newName=this.data.oldName;
     newName=e.detail.value;
     this.setData({newName:newName});
     //console.log(newName)
  },

  //点击箭头返回
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },

  //点击保存键，进行重命名
  new(){
      let newName=this.data.newName;
      let oldName=this.data.oldName;
      //判空和判相同
      if(!newName){
        wx.showModal({
          content: '新名称不能为空',
          showCancel:false,
        });
        return;
      }
      else if(newName==oldName){
        wx.showModal({
          content: '新名称和原名称相同',
          showCancel:false,
        });
        return;
      }
      //输入合法，可以更改
      else{
        wx.showModal({
          content: '修改成功',
          showCancel:false,
          success:function(res){
            wx.setStorageSync('newName', newName);
            wx.setStorageSync('oldName', oldName);
            wx.setStorageSync('ifRename', true);
            wx.switchTab({
              url: '/pages/minePage/mine',
              success:function(res){
              }
            });
          }
        });
      }
  },
})