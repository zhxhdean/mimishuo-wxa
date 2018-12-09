Component({
  properties: {
    currentTab: {
      type: Number,
      value: 0
    }
  },
  data: {
    currentTab: 0,
    items: [
      {
        "iconPath": "../../images/icon/tabbar_square.png",
        "selectedIconPath": "../../images/icon/tabbar_square_on.png",
        "text": ""
      },
      {
        "iconPath": "../../images/icon/tabbar_me.png",
        "selectedIconPath": "../../images/icon/tabbar_me_on.png",
        "text": ""
      }
    ]
  },
  attached () {
    const {currentTab} = this.properties
    this.setData({currentTab})
  },
  methods: {
    swichNav (e) {
      let self = this;
      const currentTab = e.target.dataset.current
      if (this.data.currentTab === currentTab) {
        return false;
      } else {
        self.setData({
          currentTab: e.target.dataset.current
        })
        // if (currentTab === 0) {
        //   wx.navigateTo({
        //     url: '/pages/index/index'
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: '/pages/profile/index'
        //   })
        // }
        if (currentTab === 0) {
          wx.setNavigationBarTitle({
            title: '广场',
          })
        } else if (currentTab === 1) {
          wx.setNavigationBarTitle({
            title: '我的',
          })
        } else if (currentTab === 2) {
          wx.setNavigationBarTitle({
            title: '',
          })
        }
        // wx.setNavigationBarTitle({
        //   title: res.data.nav_name,
        // })
        setTimeout(() => {
          self.triggerEvent('swichNav', currentTab)
        }, 0)
      }
    },
    toComplaints () {
      wx.navigateTo({
        url: '/pages/talk/index'
      })
    }
  }
})
