const {post} = require('../../utils/request')
const {urls} = require('../../config')

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    idx: {
      type: Number,
      value: 0
    }
  },
  data: {
    like: null,
    likeNum: 0,
    hateNum: 0,
    result: {},
    index: 0,
    topicReplyItemList: [],
    secretTopic: false
  },
  attached () {
    const {item, secretTopic} = this.properties
    if (item) {
      this.setData({ result: item, likeNum: item.likeNum, like: item.like, secretTopic })
    }
  },
  methods: {
    likes (e) {
      const { id, status, type = 'REPLY' } = e.currentTarget.dataset
      const { likeNum } = this.data
      if (status === true) {
        this.likesCancel(id, type)
      } else {
        post({
          url: urls.topicLikes,
          data: {
            id,
            topicLikeType: type
          }
        }).then((res) => {
          const { code, content } = res
          if (code === 0) {
            this.setData({
              likeNum: likeNum + 1,
              like: true
            })
          } else {
            wx.showToast({
              title: content,
              icon: 'none'
            })
          }
        })
      }
    },
    likesCancel (id, type = 'REPLY') {
      post({
        url: urls.topicCancel,
        data: {
          id,
          topicLikeType: type
        }
      }).then((res) => {
        const { code, content } = res
        if (code === 0) {
          const { likeNum } = this.data
          this.setData({
            like: false,
            likeNum: likeNum - 1
          })
        } else {
          wx.showToast({
            title: content,
            icon: 'none'
          })
        }
      })
    }
  }
})
