const { get } = require('../../utils/request')
const {urls} = require('../../config.js')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Page({
  data: {
    text: '我是首页',
    userInfo: {

    }
  },
  onLoad: async function() {
    //Do some when page show.
    
  },
  onReady: function() {
    //Do some when page ready.
  },
  onShow: async function() {
    //Do some when page show.
    const rsp = await get({ url: urls.userAuth })
    console.log(rsp)
    if(rsp.code === 0){
      wx.showToast({title: '数据加载成功'})
      rsp.data.expireTime = formatTimeFromStamp(rsp.data.expireTime, 'Y-M-D h:m:s')
      this.setData({userInfo: rsp.data})
    }else{
      wx.showToast({title: '数据加载失败'})
    }
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
