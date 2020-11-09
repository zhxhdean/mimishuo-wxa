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
    index: 0
  },
  attached () {
    const {item, idx} = this.properties
    this.setData({result: item, index: idx, likeNum: item.likeNum, like: item.like, hateNum: item.hateNum})
  },
  methods: {
    likes (e) {
      const { id, status } = e.currentTarget.dataset
      console.log('status:', typeof status)
      const { result, likeNum, hateNum } = this.data
      if (status === true) {
        this.likesCancel(id, false, 'like')
      } else {
        post({
          url: urls.secretLikes,
          data: {
            secretId: id,
            isLike: status ? !status : true
          }
        }).then((res) => {
          const { code, content } = res
          if (code === 0) {
            this.setData({
              result: {
                ...result,
                like: true,
                likeNum: result.likeNum + 1
              },
              likeNum: likeNum + 1,
              like: true
            })
            if (status === false) {
              this.setData({
                hateNum: hateNum - 1
              })
            }
          } else {
            wx.showToast({
              title: content,
              icon: 'none'
            })
          }
          console.log('result:', this.data.result)
        })
      }
    },
    noLikes (e) {
      const { id, status } = e.currentTarget.dataset
      console.log('status:', typeof status, status)
      const { result, hateNum, likeNum } = this.data
      if (status === false) {
        this.likesCancel(id, true)
      } else {
        post({
          url: urls.secretLikes,
          data: {
            secretId: id,
            isLike: status ? !status : false
          }
        }).then((res) => {
          const { code, content } = res
          console.log('dddss:', res)
          if (code === 0) {
            this.setData({
              result: {
                ...result,
                like: false,
                hateNum: result.hateNum + 1
              },
              hateNum: hateNum + 1,
              like: false})

            if (status === true) {
              this.setData({
                likeNum: likeNum - 1
              })
            }
          } else {
            wx.showToast({
              title: content,
              icon: 'none'
            })
          }
        })
      }
    },
    likesCancel (id, status, isLike) {
      post({
        url: urls.secretLikesC,
        data: {
          secretId: id,
          isLike: status
        }
      }).then((res) => {
        const { code, content } = res
        if (code === 0) {
          const { result, hateNum, likeNum } = this.data
          if (isLike) {
            this.setData({
              result: {
                ...result,
                like: null,
                likeNum: result.likeNum - 1
              },
              like: null,
              likeNum: likeNum - 1})
          } else {
            this.setData({
              result: {
                ...result,
                like: null,
                hateNum: result.hateNum - 1
              },
              like: null,
              hateNum: hateNum - 1})
          }
        } else {
          wx.showToast({
            title: content,
            icon: 'none'
          })
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
