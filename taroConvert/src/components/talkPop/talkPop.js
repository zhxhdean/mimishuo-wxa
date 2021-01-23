import { Block, View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './talkPop.scss'

@withWeapp({
  properties: {},
  data: {},
  methods: {
    toMySecret() {
      Taro.navigateTo({
        url: '/pages/secret/index'
      })
    },
    closePop() {
      this.triggerEvent('closePop')
    },
    again() {
      this.triggerEvent('closePop', true)
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    return (
      <View className="talkPop">
        <View className="content">
          <Image
            src={require('../../images/icon/close.png')}
            className="icon"
            onClick={this.closePop}
          ></Image>
          <Text>已成功发布</Text>
          <Image
            src={require('../../images/talk_finish.png')}
            className="image"
          ></Image>
          <View className="btns">
            <View className="btn" onClick={this.toMySecret}>
              查看我的吐糟
            </View>
            <View className="btn" onClick={this.again}>
              继续吐槽
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default _C
