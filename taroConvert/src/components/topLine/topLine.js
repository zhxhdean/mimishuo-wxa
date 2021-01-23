import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './topLine.scss'

@withWeapp({
  properties: {},
  data: {},
  methods: {}
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    return <View className="cu-tab-line"></View>
  }
}

export default _C
