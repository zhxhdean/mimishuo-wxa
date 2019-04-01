const {wxLogin, login} = require('./utils/request')
const regeneratorRuntime = require('./utils/runtime')
function noop () { }
noop(regeneratorRuntime)
App({
  onLaunch: function () {
    // login()
  },
  globalData: {
    isIphoneX: false
  },
  onShow: async function () {
    let self = this
    // 获取用户经纬度
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        self.globalData.userLocation = {
          latitude: latitude,
          longitude: longitude
        }
        console.log(res)
      }
    })
    // 全局值中设定是否iponex，为了在界面中设定显示安全区
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model
        if (modelmes.indexOf('iPhone X') !== -1) {
          self.globalData.isIphoneX = true
        }
      }
    })
    self.globalData.userPortrait = 40
    self.globalData.nationalFlag = 189
  },
  onHide: function () {}

})
