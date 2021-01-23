const {post, get} = require('../../utils/request')
const {urls} = require('../../config')
const {formatTimeFromStamp} = require('../../utils/timeUtil')

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
    isShowReplyAll: false
  },
  attached () {
    const {item} = this.properties
    if (item) {
      const obj = item.topicReplyItem || {}
      const arr = obj.content ? [obj] : []
      this.setData({ result: item, likeNum: item.likeNum, like: item.like, topicReplyItemList: arr })
    }
  },
  methods: {
    likes (e) {
      const { id, status, type = 'TOPIC' } = e.currentTarget.dataset
      const { likeNum } = this.data
      if (status === true) {
        this.likesCancel(id)
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
    likesCancel (id) {
      post({
        url: urls.topicCancel,
        data: {
          id,
          topicLikeType: 'TOPIC'
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
    },
    reply (e) {
      const { id } = e.currentTarget.dataset
      const { secretTopic = '' } = this.properties.item || {}
      this.triggerEvent('toReply', { id, secretTopic })
    },
    topIcDesc (e) {
      const { id } = e.currentTarget.dataset
      get({
        url: `${urls.topic}/${id}`,
        data: {}
      }).then((rsp = {}) => {
        const { code, data = {} } = rsp || {}
        if (code === 0) {
          const arr = (data && data.topicReplyItemList) || []
          const topicReplyItemList = arr.map((item) => {
            return Object.assign(item, {
              createdAt: formatTimeFromStamp(item.createdAt, 'Y/M/D h:m')
            })
          })
          this.setData({topicReplyItemList, isShowReplyAll: true})
        }
      })
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
  }
})
