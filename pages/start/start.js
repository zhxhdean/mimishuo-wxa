const {join, login} = require('../../utils/request')
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
    content: '您的每一条吐槽都将受到技术保护\n请放心大胆地说出你的建议，不要怂',
    companyId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const companyId = options.companyId || 1
    this.setData({
      companyId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // todo调接口
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (data) {
    // const userInfo = data.detail.userInfo
    // console.log(data)
    this.clickComplaints()
  },
  clickComplaints: async function () {
    if (this.data.companyId) {
      await join(this.data.companyId)
      wx.redirectTo({
        url: '/pages/index/index'
      })
    } else {
      try {
        await login(2)
        wx.redirectTo({
          url: '/pages/index/index'
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
})
