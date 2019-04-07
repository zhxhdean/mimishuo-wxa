const {post} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
const regeneratorRuntime = require('../../utils/runtime')

function noop () {}
noop(regeneratorRuntime)
Page({
  data: {
    pageSize: 10, // 分页的请求条数
    upDown: true, // true:上滑刷新 false:下拉刷新,
    last: 0, // 最后一条
    noMore: false,
    secretList: [],
    showSelect: false
  },
  onLoad: async function (options) {
    this.refresh()
  },
  onShow: function () {
  },

  onPullDownRefresh: function () {
  },
  /* 加载更多 */
  onReachBottom: function () {
    this.loadMore()
  },
  onShareAppMessage: function () {
  },
  selectStage () {
    const showSelect = !this.data.showSelect
    this.setData({showSelect: showSelect})
  },
  /**
   * 刷新,并且初始化页面参数
   */
  refresh () {
    console.log('refresh')
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
    const rsp = await post({
      url: urls.secretList,
      data: this.params()
    })
    // wx.hideLoading()
    if (rsp.code === 0) {
      if (!rsp.data.items || rsp.data.items.length === 0) {
        this.setData({noMore: true})
        return
      }
      const rst = rsp.data.items.map(item => {
        return Object.assign(item, {
          createTime: formatTimeFromStamp(item.createTime, 'Y/M/D'),
          replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
        })
      })
      this.setData({
        secretList: [...this.data.secretList, ...rst],
        last: rsp.data.last
      })
    }
  },
  /**
   * 封装接口需要的参数
   */
  params () {
    const { upDown = true, pageSize = 10, last = 0 } = this.data
    let result = {
      size: pageSize,
      last,
      upDown
    }
    return result
  },
  previewImage: function (e) {
    const data = e.target.dataset
    const urls = data.images
    const current = urls[data.index]
    wx.previewImage({
      current: current,
      urls: urls
    })
  }
})
