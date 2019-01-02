const {get, post} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Component({
  properties: {
  },
  data: {
    pageSize: 10, // 分页的请求条数
    upDown: true, // true:上滑刷新 false:下拉刷新,
    last: 0, // 最后一条
    noMore: false,
    secretList: [],
    showSelect: false
  },
  async attached () {
    this.refresh()
  },
  methods: {
    loadMoreData () {
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
    },
    selectStage () {
      const showSelect = !this.data.showSelect
      this.setData({showSelect: showSelect})
    },
    /**
     * 刷新,并且初始化页面参数
     */
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
      const rsp = await post({
        url: urls.secretList,
        data: this.params()
      })
      // wx.hideLoading()
      if(rsp.code === 0){
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
  }
})
