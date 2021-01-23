import { Block, View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './tabBar.scss'
const app = Taro.getApp()

@withWeapp({
  properties: {
    currentTab: {
      type: Number,
      value: 0
    }
  },
  data: {
    isIphoneX: !!app.globalData.isIphoneX,
    currentTab: 0,
    items: [
      {
        iconPath: require('../../images/icon/tabbar_square.png'),
        selectedIconPath: require('../../images/icon/tabbar_square_on.png'),
        text: '广场',
        url: '/pages/index/index'
      },
      {
        iconPath: require('../../images/icon/tabbar_me.png'),
        selectedIconPath: require('../../images/icon/tabbar_me_on.png'),
        text: '我的',
        url: '/pages/home/home'
      }
    ]
  },
  attached() {
    const { currentTab } = this.properties
    this.setData({ currentTab })
  },
  methods: {
    swichNav(e) {
      let self = this
      const { items } = self.data
      const currentTab = e.target.dataset.current
      if (this.data.currentTab === currentTab) {
        return false
      } else {
        self.setData({
          currentTab
        })
        Taro.reLaunch({
          url: items[currentTab].url
        })
      }
    },
    toComplaints() {
      Taro.reLaunch({
        url: '/pages/talk/talk'
      })
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { isIphoneX, items, currentTab } = this.data
    return (
      <View className={'cu-tab-bar' + (isIphoneX ? ' cu-ipx' : '')}>
        {items.map((item, idx) => {
          return (
            <View
              className="cu-tab-bar__item"
              key="prototype"
              data-current={idx}
              onClick={this.swichNav}
            >
              <Image
                className={'tab-bar_img ' + (idx == 0 ? 'left_img' : '')}
                wx:for-index="idx"
                data-current={idx}
                src={currentTab == idx ? item.selectedIconPath : item.iconPath}
              ></Image>
              <View
                className={'tab-text ' + (currentTab == idx ? 'active' : '')}
                wx:for-index="idx"
                data-current={idx}
                src={currentTab == idx ? item.selectedIconPath : item.iconPath}
              >
                {item.text}
              </View>
            </View>
          )
        })}
        <View className="bar-complaints_btn" onClick={this.toComplaints}>
          <Image
            className="tabbar_talk_img"
            src={require('../../images/icon/tabbar_talk.png')}
          ></Image>
          立刻吐槽
        </View>
      </View>
    )
  }
}

export default _C
