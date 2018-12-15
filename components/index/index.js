const {get} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Component({
  properties: {
  },
  data: {
    pageSize: 10, // 分页的请求条数
    upDown: true, // true:上滑刷新 false:下拉刷新,
    last: 0, // 最后一条
    secretList: [],
    showSelect: false
  },
  async attached () {
    const data = [{
      id: 1,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249406&di=ba9f9bfe9bd7aaf61309aa06ee0ca5fd&imgtype=0&src=http%3A%2F%2Fimg3.myhsw.cn%2F2018-03-22%2Fcp4yy0x9.jpg%3F86i',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249408&di=3b8c09e57a6d0938e807ed4c9057f47e&imgtype=0&src=http%3A%2F%2Fpic.shejiben.com%2Fcase%2F2015%2F06%2F13%2F20150613075420-236250cd.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249406&di=ba9f9bfe9bd7aaf61309aa06ee0ca5fd&imgtype=0&src=http%3A%2F%2Fimg3.myhsw.cn%2F2018-03-22%2Fcp4yy0x9.jpg%3F86i',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249408&di=3b8c09e57a6d0938e807ed4c9057f47e&imgtype=0&src=http%3A%2F%2Fpic.shejiben.com%2Fcase%2F2015%2F06%2F13%2F20150613075420-236250cd.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711248924&di=d447728206a39e7d8ae292ea8b735a37&imgtype=0&src=http%3A%2F%2Fwww.yw2005.com%2Fbaike%2Fuploads%2Fallimg%2F160604%2F1-160604155221243.jpg'],
      replyContent: '您的建议很靠谱，我会联系厨房多翻翻花样，各种口味的调料会安排食堂布置，敬请期待。',
      replyTime: 1543819518281
    },{
      id: 2,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      replyContent: '您的建议很靠谱，我会联系厨房多翻翻花样，各种口味的调料会安排食堂布置，敬请期待。',
      replyTime: 1543801518281
    },{
      id: 3,
      avatar: '',
      createTime: 1543809385522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249406&di=ba9f9bfe9bd7aaf61309aa06ee0ca5fd&imgtype=0&src=http%3A%2F%2Fimg3.myhsw.cn%2F2018-03-22%2Fcp4yy0x9.jpg%3F86i',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249408&di=3b8c09e57a6d0938e807ed4c9057f47e&imgtype=0&src=http%3A%2F%2Fpic.shejiben.com%2Fcase%2F2015%2F06%2F13%2F20150613075420-236250cd.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711248924&di=d447728206a39e7d8ae292ea8b735a37&imgtype=0&src=http%3A%2F%2Fwww.yw2005.com%2Fbaike%2Fuploads%2Fallimg%2F160604%2F1-160604155221243.jpg'],
      replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
      replyTime: 1543819518281
    },{
      id: 4,
      avatar: '',
      createTime: 1543500185522,
      power: 12,
      content: '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
      images: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249406&di=ba9f9bfe9bd7aaf61309aa06ee0ca5fd&imgtype=0&src=http%3A%2F%2Fimg3.myhsw.cn%2F2018-03-22%2Fcp4yy0x9.jpg%3F86i',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542711249408&di=3b8c09e57a6d0938e807ed4c9057f47e&imgtype=0&src=http%3A%2F%2Fpic.shejiben.com%2Fcase%2F2015%2F06%2F13%2F20150613075420-236250cd.jpg'],
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
  async onLoad () {
    this.refresh()
  },
  /**
   * 刷新,并且初始化页面参数
   */
  refresh () {
    this.setData({
      isEmpty: false,
      noMore: false,
      pageIndex: 1,
      list: []
    })
    this.loadMore()
  },
  async loadMore () {
    const rsp = await get({
      url: urls.secretList,
      data: this.params()
    })
    // wx.hideLoading()
    if(rsp.code === 0){
      this.setData({userInfo: rsp.data})
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
    }
  }
})
