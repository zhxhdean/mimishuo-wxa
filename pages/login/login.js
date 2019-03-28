const {login} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
const regeneratorRuntime = require('../../utils/runtime')

function noop () {}
noop(regeneratorRuntime)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    to: '' // 上一个页面来自哪个页面
  },

  onLoad: function (options) {
    const to = options.to
    this.setData({
      to
    })
  },

  onShow: function () {

  },
  againLogin: async function () {
    try {
      await login(2)
      const to = this.data.to
      if (to) {
        wx.redirectTo({ url: decodeURIComponent(to) })
        return
      }
      wx.navigateBack()
    } catch (err) {
    }
  }

})
