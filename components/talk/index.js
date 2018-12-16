const { get, post, uploadFile } = require('../../utils/request')
const {urls} = require('../../config.js')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
Component({
  properties: {
  },
  data: {
    text: '我是首页',
    userInfo: {
    },
    virtualInfo:{

    },
    content: '',
    previewImages: []
  },
  async attached () {
    this.getVirtual()
    const rsp = await get({ url: urls.userAuth })
    if(rsp.code === 0){
      wx.showToast({title: '数据加载成功'})
      rsp.data.expireTime = formatTimeFromStamp(rsp.data.expireTime, 'Y-M-D h:m:s')
      this.setData({userInfo: rsp.data})
    }else{
      wx.showToast({title: '数据加载失败'})
    }
  },
  methods: {
    getVirtual () {
      const virtualInfo = {
        ip: '169.132.155.34',
        country: '巴西',
        avatar: ''
      }
      this.setData({virtualInfo: virtualInfo})
    },
    chooseImage () {
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
    removeImage (e) {
      const index = e.target.dataset.index
      this.data.previewImages.splice(index, 1)
      this.setData({previewImages: this.data.previewImages})
    },
    async submit () {
      const self = this

      wx.showModal({
        title: '是否提交？',
        content: '您的吐槽反馈仅HR可见并已加密处理，请放心提交。',
        confirmText: '提交吐槽',
        success(res){
          if(res.confirm){
            // todo
            self.upLoadFile()
          }else if(res){
            //todo
            console.log('取消')

          }
        }
      })
    },
    async upLoadFile () {
      const self = this
      const tasks = []
      self.data.previewImages.forEach(item => {
        tasks.push(uploadFile({img: item}))
        // tasks.push(new Promise((resolve, reject) => {
        //   wx.uploadFile({
        //     url: 'http://140.143.223.43:8080/api/file/upload',
        //     filePath: item,
        //     name:'name',
        //     success: function(res){
        //       resolve(res)
        //     },
        //     fail: function() {
        //       reject()
        //     },
        //     complete: function() {
        //
        //     }
        //   })
        // }))
      })


      // 批量上传图片
      // Promise.all(tasks).then(res => {
      //   console.log(res)
      // })
      try {
        await Promise.all(tasks)
        const rsp = await post({
          url: urls.secretNew,
          data: this.params()
        })
        console.log('保存成功' + rsp)
      } catch (err) {
        console.log('保存失败')
      }
    },
    setConent (e){
      this.setData({content: e.detail.value})
    },
    // 更换虚拟信息
    changeVirtualInfo (){
      // toto

    }
  }
})
