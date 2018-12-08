const {get} = require('../../utils/request')
const {urls} = require('../../config')
Component({
  properties: {
  },
  data: {
    userInfo: {}
  },
  async attached () {
    const rsp = await get({ url: urls.userAuth })
    if(rsp.code === 0){
      this.setData({userInfo: rsp.data})
    }
  },
  methods: {
    swichNav (e) {
      console.log(e)
      let self = this;
      const currentTab = e.target.dataset.current
      if (this.data.currentTab === currentTab) {
        return false;
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
