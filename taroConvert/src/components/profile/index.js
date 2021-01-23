import { Block, View, Image, Text, Navigator } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
const { get } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const util = require('../../utils/util.js')

@withWeapp({
  properties: {},
  data: {
    userInfo: {}
  },
  async attached() {
    try {
      const rsp = await get({ url: urls.userInfo })
      this.setData({ userInfo: rsp.data })
    } catch (err) {
      util.showToast(rsp.message || '获取用户信息失败')
    }
  },
  methods: {
    swichNav(e) {
      console.log(e)
      let self = this
      const currentTab = e.target.dataset.current
      if (this.data.currentTab === currentTab) {
        return false
      } else {
        self.setData({
          currentTab: e.target.dataset.current
        })
        if (currentTab === 0) {
          Taro.navigateTo({
            url: '/pages/index/index'
          })
        } else {
          Taro.navigateTo({
            url: '/pages/profile/index'
          })
        }
      }
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { userInfo } = this.data
    return (
      <View>
        <View className="cu-profile__user">
          <Image
            className="cu-profile__user-image"
            src={userInfo.headImageUrl}
          ></Image>
          <Image
            className="cu-profile__user-power"
            src={require('../../images/flash.png')}
          ></Image>
          <Text className="cff9 cu-profile__user-text">
            {userInfo.power || 12}
          </Text>
        </View>
        <View className="cu-profile__menu">
          <Navigator url="/pages/secret/index">
            <View className="cu-profile__menu-items">
              <View className="cu-profile__menu-item">
                <Image
                  className="cu-profile__menu-image"
                  src={require('../../images/icon/icon_secret.png')}
                ></Image>
                秘密说
              </View>
              5
            </View>
          </Navigator>
          <View className="cu-profile__menu-items">
            <View className="cu-profile__menu-item">
              <Image
                className="cu-profile__menu-image"
                src={require('../../images/icon/icon_energy.png')}
              ></Image>
              充能值
            </View>
            32
          </View>
          <View className="cu-profile__menu-items">
            <View className="cu-profile__menu-item">
              <Image
                className="cu-profile__menu-image"
                src={require('../../images/icon/icon_reply.png')}
              ></Image>
              已回复
            </View>
            3
          </View>
        </View>
        <CuTabBar></CuTabBar>
      </View>
    )
  }
}

export default _C
