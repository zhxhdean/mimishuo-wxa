
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Page({
  data: {
    currentTab: 0 //当前tab选择项  默认 0 广场   1 个人中心
  },
  onLoad: function (options) {
    const {currentTab} = options
    if (currentTab === 1) {
      wx.setNavigationBarTitle({
        title: '我的',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '广场',
      })
    }
  },
  onShow: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (this.data.currentTab == 0) {
      this.selectComponent("#cusquare").loadMoreData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  swichNav: function(event){
    const currentTab = event.detail
    this.setData({currentTab})
  }
})