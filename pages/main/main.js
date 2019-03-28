
const {formatTimeFromStamp} = require('../../utils/timeUtil')
const regeneratorRuntime = require('../../utils/runtime')

function noop () {}
noop(regeneratorRuntime)
Page({
  data: {
    currentTab: 0 // 当前tab选择项  默认 0 广场   1 个人中心
  },
  onLoad: async function (options) {
    const {currentTab = 0} = options
    if (currentTab === 1) {
      wx.setNavigationBarTitle({
        title: '我的'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '广场'
      })
    }
    this.setData({currentTab})
  },
  onShow: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.currentTab == 0) {
      this.selectComponent('#cusquare').loadMore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  swichNav: function (event) {
    const currentTab = event.detail
    this.setData({currentTab})
  }
})
