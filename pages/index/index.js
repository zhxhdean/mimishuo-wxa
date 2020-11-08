const {post} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
const regeneratorRuntime = require('../../utils/runtime')
const util = require('../../utils/util.js')

function noop () {}
noop(regeneratorRuntime)
Page({
  data: {
    pageSize: 10, // 分页的请求条数
    upDown: true, // true:上滑刷新 false:下拉刷新,
    last: 0, // 最后一条
    noMore: false,
    secretList: [],
    showSelect: false,
    isEmpty: false
  },
  onLoad: async function (options) {
    this.refresh()
  },
  onShow: function () {
  },

  onPullDownRefresh: function () {
    this.refresh()
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
    this.setData({
      isEmpty: false,
      noMore: false,
      last: 0,
      secretList: []
    })
    this.loadMore()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  },
  async loadMore () {
    if (this.data.noMore) {
      return
    }
    try {
      const rsp = await post({
        url: urls.secretList,
        data: this.params()
      })
      // wx.hideLoading()
      if (rsp.code === 0) {
        if (!rsp.data.items || rsp.data.items.length === 0) {
          if (this.data.secretList.length === 0) {
            this.setData({isEmpty: true})
          } else {
            this.setData({noMore: true})
          }
          return
        }
        const rst = rsp.data.items.map(item => {
          return Object.assign(item, {
            createTime: formatTimeFromStamp(item.createTime, 'Y/M/D h:m'),
            replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
          })
        })
        this.setData({
          secretList: [...this.data.secretList, ...rst],
          last: rsp.data.last
        })
      } else {
        util.showToast(rsp.content || '接口失败，请刷新重试')
      }
    } catch (err) {
      util.showToast(err || '接口失败，请重试')
    }
  },

  async likes (e) {
    const { id, status } = e.currentTarget.dataset
    console.log('status:', typeof status)
    if (status === true) {
      this.likesCancel(id, false)
    } else {
      await post({
        url: urls.secretLikes,
        data: {
          secretId: id,
          isLike: status ? !status : true
        }
      })
    }
    wx.showToast({
      title: '操作成功',
      icon: 'none'
    })
    setTimeout(() => {
      this.refresh()
    }, 1500)
  },
  async noLikes (e) {
    const { id, status } = e.currentTarget.dataset
    console.log('status:', typeof status, status)
    if (status === false) {
      this.likesCancel(id, true)
    } else {
      await post({
        url: urls.secretLikes,
        data: {
          secretId: id,
          isLike: status ? !status : false
        }
      })
    }
    wx.showToast({
      title: '操作成功',
      icon: 'none'
    })
    setTimeout(() => {
      this.refresh()
    }, 1500)
  },
  async likesCancel (id, status) {
    const rsp = await post({
      url: urls.secretLikesC,
      data: {
        secretId: id,
        isLike: status
      }
    })
    console.log(rsp, id)
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
  },
  goTalk: function () {
    wx.switchTab({
      url: '/pages/talk/talk'
    })
  }
})
