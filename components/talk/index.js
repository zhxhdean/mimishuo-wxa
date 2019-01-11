const { get, post, uploadFile } = require('../../utils/request')
const {urls} = require('../../config.js')
const {formatTimeFromStamp} = require('../../utils/timeUtil')
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const app = getApp()
Component({
  properties: {
  },
  data: {
    text: '我是首页',
    userPortraitCount: app.globalData.userPortrait,
    userPortraitUrl: '',
    nationalFlagCount: app.globalData.nationalFlag,
    nationalFlagUrl: '',
    isShowPop: false,
    userInfo: {
    },
    virtualInfo:{
    },
    previewImages: [],

    burnAfterReading: false, // 是否阅后即焚
    content: '', // 内容
    headImageKey: '', // 头像key
    headImageUrl: '', // 头像
    imageKeyList: [], // 图片key列表
    imageUrls: [],  // 秘密图片
    reply: '',  // 回复内容
    replyTime: '', //  回复时间
    subject: '',  //  主题
    txtRealContent: '' // 文字备份
  },
  async attached () {
    this.getVirtual()
    this.changeVirtualInfo()

    const headImageUrl = storage.authStorage.getAuth() ? storage.authStorage.getAuth().headImageUrl : ''
    this.setData({
      headImageUrl
    })
    // const rsp = await get({ url: urls.userAuth })
    // if(rsp.code === 0){
    //   wx.showToast({title: '数据加载成功'})
    //   rsp.data.expireTime = formatTimeFromStamp(rsp.data.expireTime, 'Y-M-D h:m:s')
    //   this.setData({userInfo: rsp.data})
    // }else{
    //   wx.showToast({title: '数据加载失败'})
    // }
  },
  methods: {
    getVirtual () {
      const virtualInfo = {
        ip: '169.132.155.34',
        country: '巴西'
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
    async toSubmit () {
      const self = this
      // wx.showModal({
      //   title: '是否提交？',
      //   content: '您的吐槽反馈仅HR可见并已加密处理，请放心提交。',
      //   confirmText: '提交吐槽',
      //   success(res){
      //     if(res.confirm){
      //       // todo
      //       self.upLoadFile()
      //     }else if(res){
      //       //todo
      //       console.log('取消')
      //
      //     }
      //   }
      // })
      if (!self.data.isShowPop) {
        // 将换行符转换为wxml可识别的换行元素 <br/>
        const txtRealContent = self.data.content.replace(/\n/g, '<br/>')
        self.setData({ txtRealContent })
      }
      self.setData({isShowPop: true})
    },
    async submit () {
      const self = this
      self.upLoadFile()
      console.log(self.data.burnAfterReading)
      self.setData({
        isShowPop: true,
        isShowPop: false
      })
    },
    checkboxChange: function (e) {
      const self = this
      let status = self.data.burnAfterReading
      if (e.detail.value == '') {
        status = false
      } else {
        status = true
      }
      self.setData({
        burnAfterReading: status
      })
    },

    closePop () {
      const self = this
      self.setData({isShowPop: false})
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

      try {
        wx.showLoading({
          title: '正在上传...',
        })
        const upload_res = await Promise.all(tasks)
        wx.hideLoading()
        let imageKeyList = []
        let imageUrls = []
        upload_res.map(item => {
          imageUrls.push(item.previewUrl)
          imageKeyList.push(item.fileKey)
        })

        self.setData({
          imageUrls: imageUrls,
          imageKeyList: imageKeyList
        })

        console.log(upload_res)
        // 新增秘密

        const rsp = await post({
          url: urls.secretNew,
          data: self.params()
        })
        util.showToast('保存成功')
        setTimeout(() => {
          self.triggerEvent('swichNav', 0)
        },1500)
      } catch (err) {
        wx.hideLoading()
        console.log(err)
        util.showToast(err ? err : '保存失败')
      }
    },
    setConent (e){
      const data = e.detail.value
      this.setData({content: data})
    },
    // 更换虚拟信息
    changeVirtualInfo (){
      const self = this
      const u = Math.floor(Math.random()*self.data.userPortraitCount)
      const n = Math.floor(Math.random()*self.data.nationalFlagCount)
      const userPortraitUrl = `../../images/resources/User-${u}.jpg`
      const nationalFlagUrl = `../../images/resources/Nipic_${n}.jpg`
      self.setData({
        userPortraitUrl,
        nationalFlagUrl
      })
    },
    /**
     * 封装接口需要的参数
     */
    params () {
      const { burnAfterReading  = false, content, headImageKey, headImageUrl, imageKeyList = [], imageUrls = [], reply = '', replyTime = '', subject } = this.data
      let result = {
        burnAfterReading,
        content,
        createTime: new Date().getTime(),
        headImageKey,
        headImageUrl,
        imageKeyList,
        imageUrls,
        reply,
        replyTime,
        subject
      }
      return result
    },
    toBack () {
      const self = this
      wx.setNavigationBarTitle({
        title: '广场',
      })
      setTimeout(() => {
        self.triggerEvent('swichNav', 0)
      }, 0)
    },
    textAreaLineChange(e) {
      this.setData({ txtHeight: e.detail.height })
    },
    txtInput(e) {
      this.setData({ txtContent: e.detail.value })
    },
    changeMaskVisible(e) {
      if (!this.data.showMask) {
        // 将换行符转换为wxml可识别的换行元素 <br/>
        const txtRealContent = this.data.txtContent.replace(/\n/g, '<br/>')
        this.setData({ txtRealContent })
      }
      this.setData({ showMask: !this.data.showMask })
    }
  },

})
