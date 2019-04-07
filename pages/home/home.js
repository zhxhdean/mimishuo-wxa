const {get} = require('../../utils/request')
const {urls} = require('../../config')
const util = require('../../utils/util.js')
const regeneratorRuntime = require('../../utils/runtime')
const storage = require('../../utils/storage')

function noop () {}
noop(regeneratorRuntime)
Page({
  data: {
    userInfo: {},
    clickCount: 0
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
    this.setData({
      clickCount: 0
    })
  },

  onPullDownRefresh: function () {
  },
  /* 加载更多 */
  onReachBottom: function () {
    this.loadMore()
  },
  onShareAppMessage: function () {
  },
  addCount: function () {
    if (this.data.clickCount === 15) {
      const user = storage.authStorage.getAuth()
      const companyId = user ? user.companyId : 0
      const initCompanyId = wx.getStorageSync('initCompanyId')
      if (initCompanyId) {
        util.showToast('公司id:' + companyId + '        初始注册公司id：' + initCompanyId)
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
