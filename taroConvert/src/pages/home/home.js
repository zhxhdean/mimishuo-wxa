import { Block, View, Image, Text, Navigator } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import TabBar from '../../components/tabBar/tabBar'
import CuTopLine from '../../components/topLine/topLine'
import './home.scss'
const { get } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const util = require('../../utils/util.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const storage = require('../../utils/storage.js')

function noop() {}
noop(regeneratorRuntime)

@withWeapp({
  data: {
    userInfo: {},
    clickCount: 0,
    userData: {}
  },
  onLoad: async function(options) {
    try {
      const rsp = await get({ url: urls.userInfo })
      if (rsp.code === 0) {
        this.setData({ userInfo: rsp.data })
      } else {
        util.showToast(rsp.content || '获取用户信息失败，请退出重试')
      }
    } catch (err) {
      util.showToast(err || '获取用户信息失败')
    }
    try {
      const rsp = await get({ url: urls.secretNum })
      if (rsp.code === 0) {
        this.setData({ userData: rsp.data })
      } else {
        util.showToast(rsp.content || '用户秘密统计信息失败')
      }
    } catch (err) {
      util.showToast(err || '获取用户信息失败')
    }
  },
  onShow: function() {
    this.setData({
      clickCount: 0
    })
  },

  onPullDownRefresh: function() {},
  /* 加载更多 */
  onReachBottom: function() {
    this.loadMore()
  },
  onShareAppMessage: function() {},
  addCount: function() {
    if (this.data.clickCount === 15) {
      const user = storage.authStorage.getAuth()
      const companyId = user ? user.companyId : 0
      const initCompanyId = Taro.getStorageSync('initCompanyId')
      if (initCompanyId) {
        util.showToast(
          '公司id:' + companyId + '        初始注册公司id：' + initCompanyId
        )
      } else {
        util.showToast('公司id:' + companyId)
      }
      this.setData({
        clickCount: 0
      })
    } else {
      this.setData({
        clickCount: this.data.clickCount + 1
      })
    }
  }
})
class _C extends Taro.Component {
  config = {
    navigationBarTitleText: '我的',
    onReachBottomDistance: 100,
    navigationStyle: 'custom'
  }

  render() {
    const { userInfo, userData } = this.data
    return (
      <View className="home_page">
        <View className="tab_title">我的</View>
        <View className="cu-profile__user profile_user">
          <Div className="cu-profile__user-author">
            <Image
              onClick={this.addCount}
              className="cu-profile__user-image"
              src={userInfo.headImageUrl}
            ></Image>
          </Div>
          {/* <image class="cu-profile__user-power" src="../../images/flash.png"/> */}
          {/* <text class="cff9 cu-profile__user-text">{{userInfo.power || 12}}</text> */}
          <View className="cu-profile__user-power">
            <Image
              className="cu-profile__user-img"
              src={require('../../images/dianzan.png')}
            ></Image>
            <Text className="cff9 cu-profile__user-text">
              {userData.totalLikeNum || 0}
            </Text>
          </View>
        </View>
        <View className="cu-profile__menu">
          <Navigator url="/pages/secret/index">
            <View className="cu-profile__menu-items">
              <View className="cu-profile__menu-item">
                <Image
                  className="cu-profile__menu-image top1"
                  src={require('../../images/icon/icon_secret.png')}
                ></Image>
                秘密说
              </View>
              {userData.totalNum || ''}
            </View>
          </Navigator>
          <View className="cu-profile__menu-items">
            <View className="cu-profile__menu-item">
              <Image
                className="cu-profile__menu-image top2"
                src={require('../../images/icon/icon_energy.png')}
              ></Image>
              充能值
            </View>
            {userData.energyNum}
          </View>
          <View className="cu-profile__menu-items">
            <View className="cu-profile__menu-item">
              <Image
                className="cu-profile__menu-image top3"
                src={require('../../images/icon/icon_reply.png')}
              ></Image>
              已回复
            </View>
            {userData.totalReplyNum}
          </View>
        </View>
        <TabBar currentTab="1"></TabBar>
      </View>
    )
  }
}

export default _C
