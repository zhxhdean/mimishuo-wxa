// pages/talk/index.js
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    secretList: []
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
    const data = [{
      id: 1,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    },{
      id: 2,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543801518281
    },{
      id: 3,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    },{
      id: 4,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543801518281
    }]
    const rst = data.map(item => {
      return Object.assign(item, {
        createTime: formatTimeFromStamp(item.createTime, 'Y/M/D'),
        replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
      })
    })
    this.setData({secretList: rst})
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
    wx.showLoading()
    const data = [{
      id: 1,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    },{
      id: 2,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543801518281
    },{
      id: 3,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    },{
      id: 4,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543801518281
    }]
    const rst = data.map(item => {
      return Object.assign(item, {
        createTime: formatTimeFromStamp(item.createTime, 'Y/M/D'),
        replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
      })
    })
    this.setData({secretList: this.data.secretList.concat(rst)})
    wx.hideLoading()
    console.log('触底加载更多')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})