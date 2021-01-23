import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import CuTalk from '../../components/talk/index'
import CuTopLine from '../../components/topLine/topLine'
import CuProfile from '../../components/profile/index'
import CuTabBar from '../../components/tabBar/tabBar'
import CuSquare from '../../components/index/index'

const { formatTimeFromStamp } = require('../../utils/timeUtil.js')
const regeneratorRuntime = require('../../utils/runtime.js')

function noop() {}
noop(regeneratorRuntime)

@withWeapp({
  data: {
    currentTab: 0 // 当前tab选择项  默认 0 广场   1 个人中心
  },
  onLoad: async function(options) {
    const { currentTab = 0 } = options
    if (currentTab === 1) {
      Taro.setNavigationBarTitle({
        title: '我的'
      })
    } else {
      Taro.setNavigationBarTitle({
        title: '广场'
      })
    }
    this.setData({ currentTab })
  },
  onShow: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},
  onReachBottom: function() {
    if (this.data.currentTab == 0) {
      this.selectComponent('#cusquare').loadMore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  swichNav: function(event) {
    const currentTab = event.detail
    this.setData({ currentTab })
  }
})
class _C extends Taro.Component {
  config = {
    navigationBarTitleText: ''
  }

  render() {
    const { currentTab } = this.data
    return (
      <View>
        <CuTopLine></CuTopLine>
        {currentTab == 0 && <CuSquare id="cusquare"></CuSquare>}
        {currentTab == 1 && <CuProfile id="cuprofile"></CuProfile>}
        {currentTab == 2 && (
          <CuTalk id="talk" onSwichNav={this.swichNav}></CuTalk>
        )}
        <CuTabBar currentTab={currentTab} onSwichNav={this.swichNav}></CuTabBar>
      </View>
    )
  }
}

export default _C
