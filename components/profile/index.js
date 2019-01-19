const {get} = require('../../utils/request')
const {urls} = require('../../config')
const util = require('../../utils/util.js')
Component({
  properties: {
  },
  data: {
    userInfo: {}
  },
  async attached () {
    try {
      const rsp = await get({ url: urls.userInfo })
      this.setData({userInfo: rsp.data})
    } catch (err) {
      util.showToast(rsp.message || '获取用户信息失败')
    }
  },
  methods: {
    swichNav (e) {
      console.log(e)
      let self = this
      const currentTab = e.target.dataset.current
      if (this.data.currentTab === currentTab) {
        return false
      } else {
        self.setData({
          currentTab: e.target.dataset.current
        })
        if (currentTab === 0) {
          wx.navigateTo({
            url: '/pages/index/index'
          })
        } else {
          wx.navigateTo({
            url: '/pages/profile/index'
          })
        }
      }
    }
  }
})
