const {wxLogin} = require('./utils/request')

App({
  onLaunch: function() {},
  onShow: function() {
    // 登录
    wxLogin()

    // 获取用户经纬度
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(res)
      }
     })

  },
  onHide: function() {},
  globalData: 11
})
