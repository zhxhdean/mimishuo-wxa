import { Block, View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './login.scss'
const { login } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const { formatTimeFromStamp } = require('../../utils/timeUtil.js')
const regeneratorRuntime = require('../../utils/runtime.js')

function noop() {}
noop(regeneratorRuntime)

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    to: '' // 上一个页面来自哪个页面
  },

  onLoad: function(options) {
    const to = options.to
    this.setData({
      to
    })
  },

  onShow: function() {},
  againLogin: async function() {
    try {
      await login(2)
      const to = this.data.to
      if (to) {
        Taro.redirectTo({ url: decodeURIComponent(to) })
        return
      }
      Taro.navigateBack()
    } catch (err) {}
  }
})
class _C extends Taro.Component {
  config = {
    disableScroll: true
  }

  render() {
    return (
      <View className="login">
        <View className="login__content">
          <Image
            className="login__img"
            src={require('../../images/icon/square_empty.jpg')}
          ></Image>
          <Text className="login__text">登录遇到问题，请重新登录</Text>
        </View>
        <View className="login__again" onClick={this.againLogin}>
          重新登录
        </View>
      </View>
    )
  }
}

export default _C
