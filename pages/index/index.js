const { get } = require('../../utils/request')

Page({
  data: {
    text: '我是首页'
  },
  onLoad: async function() {
    //Do some when page show.
    const rsp = await get({ url: 'profile2' })
    console.log(rsp)
  },
  onReady: function() {
    //Do some when page ready.
  },
  onShow: async function() {
    //Do some when page show.
    const rsp = await get({ url: 'profile2' })
    console.log(rsp)
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
