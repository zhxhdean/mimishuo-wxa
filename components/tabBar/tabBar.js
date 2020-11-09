const app = getApp()
Component({
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
        'iconPath': '../../images/icon/tabbar_square.png',
        'selectedIconPath': '../../images/icon/tabbar_square_on.png',
        'text': '广场',
        'url': '/pages/index/index'
      },
      {
        'iconPath': '../../images/icon/tabbar_me.png',
        'selectedIconPath': '../../images/icon/tabbar_me_on.png',
        'text': '我的',
        'url': '/pages/home/home'
      }
    ]
  },
  attached () {
    const {currentTab} = this.properties
    this.setData({currentTab})
  },
  methods: {
    swichNav (e) {
      let self = this
      const {items} = self.data
      const currentTab = e.target.dataset.current
      if (this.data.currentTab === currentTab) {
        return false
      } else {
        self.setData({
          currentTab
        })
        wx.reLaunch({
          url: items[currentTab].url
        })
      }
    },
    toComplaints () {
      wx.reLaunch({
        url: '/pages/talk/talk'
      })
    }
  }
})
