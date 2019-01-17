
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
      images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249406&di=ba9f9bfe9bd7aaf61309aa06ee0ca5fd&imgtype=0&src=http%3A%2F%2Fimg3.myhsw.cn%2F2018-03-22%2Fcp4yy0x9.jpg%3F86i',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249408&di=3b8c09e57a6d0938e807ed4c9057f47e&imgtype=0&src=http%3A%2F%2Fpic.shejiben.com%2Fcase%2F2015%2F06%2F13%2F20150613075420-236250cd.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711248924&di=d447728206a39e7d8ae292ea8b735a37&imgtype=0&src=http%3A%2F%2Fwww.yw2005.com%2Fbaike%2Fuploads%2Fallimg%2F160604%2F1-160604155221243.jpg'],
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    }, {
      id: 2,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543801518281
    }, {
      id: 3,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    }, {
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
    }, {
      id: 2,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543801518281
    }, {
      id: 3,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    }, {
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
