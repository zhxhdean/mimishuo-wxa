const {get, post} = require('../../utils/request')
const {urls} = require('../../config')
const util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {}
  },
  onLoad: async function (options) {
    try {
      const rsp = await get({ url: urls.userInfo })
      this.setData({userInfo: rsp.data})
    } catch (err) {
      util.showToast(rsp.message || '获取用户信息失败')
    }
  },
  onShow: function () {
  },

  onPullDownRefresh: function () {
  },
  /*加载更多*/
  onReachBottom: function () {
    this.loadMore()
  },
  onShareAppMessage: function () {
  },

})
