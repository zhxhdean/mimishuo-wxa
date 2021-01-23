import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './app.scss'
const { wxLogin, login } = require('./utils/request.js')
const regeneratorRuntime = require('./utils/runtime.js')
function noop() {}
noop(regeneratorRuntime)

@withWeapp({
  onLaunch: function() {
    // login()
  },
  globalData: {
    isIphoneX: false
  },
  onShow: async function() {
    let self = this
    // 获取用户经纬度
    Taro.getLocation({
      type: 'wgs84',
      altitude: true,
      success(res) {
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
    Taro.getSystemInfo({
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
  onHide: function() {}
})
class App extends Taro.Component {
  config = {
    pages: [
      'pages/start/start',
      'pages/talk/talk',
      'pages/index/index',
      'pages/home/home',
      'pages/login/login',
      'pages/main/main',
      'pages/secret/index',
      'pages/test/test'
    ],
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    },
    window: {
      navigationBarTitleText: '秘密说',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black',
      backgroundColor: '#ffffff',
      backgroundTextStyle: 'light'
    },
    networkTimeout: {
      request: 10000,
      downloadFile: 10000
    },
    debug: true,
    sitemapLocation: 'sitemap.json'
  }

  render() {
    return null
  }
}

export default App
Taro.render(<App />, document.getElementById('app'))
