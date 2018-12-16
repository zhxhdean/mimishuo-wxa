const {get, post} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Page({

  data: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    secretList: [],
    noMore: false
  },
  onLoad: function (options) {

  },

  onShow: function () {
    this.refresh()
  },

  onPullDownRefresh: function () {

  },
  refresh () {
    // this.setData({
    //   isEmpty: false,
    //   noMore: false,
    //   pageIndex: 1,
    //   list: []
    // })
    this.loadMore()
  },
  async loadMore () {
    if (this.data.noMore) {
      return
    }
    const rsp = await get({
      url: urls.secretMy,
      data: this.params()
    })
    // wx.hideLoading()
    if(rsp.code === 0){
      const data = rsp.data
      if (!data.items || data.items.length === 0) {
        this.setData({noMore: true})
        return
      }
      const rst = data.items.map(item => {
        return Object.assign(item, {
          createTime: formatTimeFromStamp(item.createTime, 'Y/M/D'),
          replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
        })
      })
      this.setData({
        secretList: [...this.data.secretList, ...rst],
        pageIndex: data.pageIndex,
        totalCount: data.totalCount
      })
    }
  },
  params () {
    const { pageIndex = 1, pageSize = 10} = this.data
    let result = {
      pageIndex,
      pageSize
    }
    return result
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})