
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      content: '您的每一条吐槽都将受到技术保护\n请放心大胆地说出你的建议，不要怂'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  clickComplaints: function(){
    wx.redirectTo({
      url: '/pages/main/main'
    })
  }
})