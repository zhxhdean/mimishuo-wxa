const {wxLogin, login} = require('./utils/request')
const regeneratorRuntime = require('./utils/runtime')
function noop () { }
noop(regeneratorRuntime)
App({
  onLaunch: function() {},
  onShow: async function() {
    // 登录
    try {
      await login()
    } catch (err) {
    }
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
