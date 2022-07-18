function login(){
  var that = this;
  //查看是否授权
  wx.getSetting({
     success: function(res) {
       if (res.authSetting['scope.userInfo']) {
         console.log("用户授权了");
       } else {
         //用户没有授权
         console.log("用户没有授权");
       }
     }
   })
}