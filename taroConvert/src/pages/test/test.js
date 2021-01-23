import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import httpHelper from '../../utils/request.js'
import { CuPage } from '../../base/index.js'
import userInfo from '../../mixins/userInfo.js'
import './test.scss'
const regeneratorRuntime = require('../../utils/runtime.js')
function noop() {}
noop(regeneratorRuntime)
CuPage({
  mixins: [userInfo],
  data: {
    xing: 'li',
    xing2: '',
    name: 'Hello World',
    firstName: '',
    watchName: ''
  },
  computed: {
    quanming() {
      return this.data.xing + this.data.name
    }
  },
  watch: {
    name(val, old) {
      this.setData({
        watchName: val
      })
    }
  },
  onShow: async function() {
    const rsp = await httpHelper.post({
      url: 'secret/list',
      data: this.params()
    })
    console.log(rsp)
  },
  params() {
    const { upDown = true, pageSize = 10, last = 0 } = this.data
    let result = {
      size: pageSize,
      last,
      upDown
    }
    return result
  },
  changeName: function() {
    this.getUserName()
    this.setData({
      name: 'lishanjun',
      xing: 'zahng'
    })
  }
})
@withWeapp({})
class _C extends Taro.Component {
  config = {}

  render() {
    const {
      xing,
      name,
      userName,
      quanming,
      xing2,
      firstName,
      watchName
    } = this.data
    return (
      <View>
        <View className="user">
          <View className="user__name">{xing + name}</View>
          <View className="user__rel-name">{userName}</View>
          <View className>{'全名：' + quanming}</View>
          <View className="user__btn" onClick={this.changeName}>
            改变name
          </View>
          <View className>{xing2}</View>
          <View className>{firstName}</View>
          <View>{'watchName:' + watchName}</View>
          <View className="user__content">改变name</View>
        </View>
      </View>
    )
  }
}

export default _C
