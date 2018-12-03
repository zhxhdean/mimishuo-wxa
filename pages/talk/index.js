const { get } = require('../../utils/request')
const {urls} = require('../../config.js')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Page({
  data: {
    text: '我是首页',
    userInfo: {
    },
    virtualInfo:{

    },
    content: '',
    previewImages: []
  },
  onLoad: async function() {
    //Do some when page show.
    
  },
  onReady: function() {
    //Do some when page ready.
  },
  onShow: async function() {
    this.getVirtual()
    //Do some when page show.
    const rsp = await get({ url: urls.userAuth })
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
  },
  // 获取虚拟信息
  getVirtual: function (){
    //todo 调接口
    const virtualInfo = {
      ip: '169.132.155.34',
      country: '巴西',
      avatar: ''
    }
    this.setData({virtualInfo: virtualInfo})
  },
  // 选择图片
  chooseImage: function(){ 
    if(this.data.previewImages.length >= 5){
      wx.showToast({title: '最多上传5张'})
      return
    }
    const self = this
    wx.chooseImage({
      count: 5 - this.data.previewImages.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        if(res.errMsg === 'chooseImage:ok'){
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        self.setData({previewImages: self.data.previewImages.concat(tempFilePaths)})
        console.log(tempFilePaths)
        }

      }
    })
  },
  // 移除图片
  removeImage: function(e){
    const index = e.target.dataset.index
    this.data.previewImages.splice(index, 1)
    this.setData({previewImages: this.data.previewImages})
  },

  submit: function(){
    const self = this

    wx.showModal({
      title: '是否提交？',
      content: '您的吐槽反馈仅HR可见并已加密处理，请放心提交。',
      confirmText: '提交吐槽',
      success(res){
        if(res.confirm){
          // todo
          const tasks = []
          self.data.previewImages.forEach(item => {
            tasks.push(new Promise((resolve, reject) => {
              wx.uploadFile({
                url: 'http://140.143.223.43:8080/api/user/info', // 待定
                filePath: item,
                name:'name',
                // header: {}, // 设置请求的 header
                // formData: {}, // HTTP 请求中其他额外的 form data
                success: function(res){
                  // success
                  resolve(res)
                },
                fail: function() {
                  // fail
                  reject()
                },
                complete: function() {
                  // complete
                }
              })
            }))
          })

          // 批量上传图片
          Promise.all(tasks).then(rsp => {

          })
          
          console.log(self.data)
          console.log('提交')
        }else if(res.cancel){
          //todo
          console.log('取消')
          
        }
      }
    })
  },
  setConent: function(e){
    this.setData({content: e.detail.value})
  },
  // 更换虚拟信息
  changeVirtualInfo: function(){
    // toto

  }
})
