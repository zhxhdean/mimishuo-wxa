const { get } = require('../../utils/request')

Page({
  data: {
    text: '我是首页'
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    get({ url: 'profile2' })
      .then(rsp => {
        console.log(rsp)
      })
      .catch(err => {
        console.log(err)
      })
  },
  onReady: function() {
    //Do some when page ready.
  },
  onShow: function() {
    //Do some when page show.
  },
  onHide: function() {
    //Do some when page hide.
  },
  onUnload: function() {
    //Do some when page unload.
  },
  onPullDownRefresh: function() {
    //Do some when page pull down.
  }
})
