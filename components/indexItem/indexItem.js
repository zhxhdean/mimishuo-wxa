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
    result: {},
    index: 0
  },
  attached () {
    const {item, idx} = this.properties
    this.setData({result: item, index: idx})
  },
  methods: {
    likes (e) {
      const { id, status } = e.currentTarget.dataset
      console.log('status:', typeof status)
      const result = this.data.result
      if (status === true) {
        this.likesCancel(id, false, 'like')
      } else {
        post({
          url: urls.secretLikes,
          data: {
            secretId: id,
            isLike: status ? !status : true
          }
        }).then(() => {
          this.setData({result: {
            ...result,
            like: true,
            likeNum: result.likeNum + 1
          }})
          console.log('result:', this.data.result)
        })
      }
    },
    async noLikes (e) {
      const { id, status } = e.currentTarget.dataset
      console.log('status:', typeof status, status)
      const result = this.data.result
      if (status === false) {
        this.likesCancel(id, true)
      } else {
        post({
          url: urls.secretLikes,
          data: {
            secretId: id,
            isLike: status ? !status : false
          }
        }).then(() => {
          this.setData({result: {
            ...result,
            like: false,
            hateNum: result.hateNum + 1
          }})
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
      }).then(() => {
        const result = this.data.result
        if (isLike) {
          this.setData({result: {
            ...result,
            like: null,
            likeNum: result.likeNum - 1
          }})
        } else {
          this.setData({result: {
            ...result,
            like: null,
            hateNum: result.hateNum - 1
          }})
        }
      })
    },
    kkk () {
      console.log(111)
    }
  }
})
