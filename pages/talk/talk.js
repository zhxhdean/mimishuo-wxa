const {get, post, uploadFile} = require('../../utils/request')
const {urls} = require('../../config')
const regeneratorRuntime = require('../../utils/runtime')
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')

function noop () {}
noop(regeneratorRuntime)
const app = getApp()
Page({
  data: {
    text: '我是首页',
    userPortraitCount: app.globalData.userPortrait,
    userPortraitUrl: '',
    nationalFlagCount: app.globalData.nationalFlag,
    nationalFlagUrl: '',
    isShowPop: false,
    userInfo: {},
    virtualInfo: {},
    previewImages: [],
    burnAfterReading: false, // 是否阅后即焚
    content: '', // 内容
    headImageKey: '', // 头像key
    headImageUrl: '', // 头像
    imageKeyList: [], // 图片key列表
    imageUrls: [], // 秘密图片
    reply: '', // 回复内容
    replyTime: '', //  回复时间
    subject: '', //  主题
    txtRealContent: '', // 文字备份
    contentCount: 0,
    contentTotal: 150,
    isShowOfficial: true
  },
  onLoad: async function (options) {
    this.getVirtual()
    this.changeVirtualInfo()

    const headImageUrl = storage.authStorage.getAuth() ? storage.authStorage.getAuth().headImageUrl : ''
    this.setData({
      headImageUrl
    })
  },
  onShow: function () {
  },

  onPullDownRefresh: function () {
  },
  /* 加载更多 */
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },
  getVirtual () {
    const virtualInfo = {
      ip: '169.132.155.34',
      country: ''
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
        if (res.errMsg === 'chooseImage:ok') {
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
    if (!self.data.content) {
      util.showToast('请填写您要吐槽的内容')
      return
    }
    if (!self.data.isShowPop) {
      // 将换行符转换为wxml可识别的换行元素 <br/>
      const txtRealContent = self.data.content.replace(/\n/g, '<br/>')
      self.setData({ txtRealContent })
    }
    self.submit()
    // self.setData({isShowPop: true})
  },
  async submit () {
    const self = this
    self.upLoadFile()
    self.setData({
      isShowPop: true
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

  closePop (clear) {
    const self = this
    self.setData({isShowPop: false})
    if (clear) {
      self.setData({
        content: '',
        contentCount: 0
      })
    }
  },
  upLoadFile () {
    const self = this
    const imgList = self.data.previewImages
    wx.showLoading({
      title: '正在上传...'
    })
    let promiseList = uploadFile(imgList)
    // 使用Primise.all来执行promiseList
    Promise.all(promiseList).then((res) => {
      wx.hideLoading()
      let imageKeyList = []
      let imageUrls = []
      res.map(item => {
        imageUrls.push(item.previewUrl)
        imageKeyList.push(item.fileKey)
      })
      self.setData({
        imageUrls: imageUrls,
        imageKeyList: imageKeyList
      })
      self.secretNew()
    }).catch((error) => {
      wx.hideLoading()
      util.showToast(error || '图片上传失败')
    })
  },
  async secretNew () {
    const self = this
    try {
      await post({
        url: urls.secretNew,
        data: self.params()
      })
      // util.showToast('保存成功')
      self.resetData()
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/secret/index'
        })
      }, 1500)
    } catch (err) {
      util.showToast(err || '保存失败')
    }
  },
  setConent (e) {
    const data = e.detail.value
    this.setData({
      content: data,
      contentCount: data.length
    })
  },
  // 更换虚拟信息
  async changeVirtualInfo () {
    const self = this
    // const u = Math.floor(Math.random() * (self.data.userPortraitCount - 1))

    // const headImageUrl = `images/resources/User-${u}.jpg`
    let nationalFlagUrl
    try {
      const rsp = await get({
        url: urls.changeIp,
        data: self.params()
      })
      switch (rsp.data.country) {
        case 'UK' :nationalFlagUrl = 'images/resources/Nipic_48.jpg'; break
        case 'JAPAN' :nationalFlagUrl = 'images/resources/Nipic_121.jpg'; break
        case 'France' :nationalFlagUrl = 'images/resources/Nipic_78.jpg'; break
        case 'US' :nationalFlagUrl = 'images/resources/Nipic_26.jpg'; break
      }
      const virtualInfo = rsp.data || {}
      this.setData({
        virtualInfo,
        nationalFlagUrl,
        headImageUrl: virtualInfo.headImageUrl
      })
      console.log(rsp.data)
    } catch (err) {
      util.showToast(err.message || '网络错误，请重试')
    }
  },
  /**
   * 封装接口需要的参数
   */
  params () {
    const { burnAfterReading = false, content, headImageKey, headImageUrl, imageKeyList = [], imageUrls = [], reply = '', replyTime = '', subject } = this.data
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
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  textAreaLineChange (e) {
    this.setData({ txtHeight: e.detail.height })
  },
  txtInput (e) {
    this.setData({ txtContent: e.detail.value })
  },
  changeMaskVisible (e) {
    if (!this.data.showMask) {
      // 将换行符转换为wxml可识别的换行元素 <br/>
      const txtRealContent = this.data.txtContent.replace(/\n/g, '<br/>')
      this.setData({ txtRealContent })
    }
    this.setData({ showMask: !this.data.showMask })
  },
  bindload (event) {
    console.log(event.detail)
  },
  binderror (event) {
    this.setData({
      isShowOfficial: false
    })
    console.log(event.detail)
  },
  resetData () {
    this.setData({
      previewImages: [],
      imageUrls: [],
      imageKeyList: [],
      burnAfterReading: false,
      content: '',
      subject: '',
      contentCount: 0
    })
  }
});
