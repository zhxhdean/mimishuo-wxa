import {
  Block,
  View,
  Image,
  Text,
  Textarea,
  RichText
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import TabBar from '../../components/tabBar/tabBar'
import TalkPop from '../../components/talkPop/talkPop'
import CuTopLine from '../../components/topLine/topLine'
import './talk.scss'
const { get, post, uploadFile } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')

function noop() {}
noop(regeneratorRuntime)
const app = Taro.getApp()

@withWeapp({
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
  onLoad: async function(options) {
    this.getVirtual()
    this.changeVirtualInfo()

    const headImageUrl = storage.authStorage.getAuth()
      ? storage.authStorage.getAuth().headImageUrl
      : ''
    this.setData({
      headImageUrl
    })
  },
  onShow: function() {},

  onPullDownRefresh: function() {},
  /* 加载更多 */
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  getVirtual() {
    const virtualInfo = {
      ip: '169.132.155.34',
      country: ''
    }
    this.setData({ virtualInfo: virtualInfo })
  },
  chooseImage() {
    const self = this
    Taro.chooseImage({
      count: 5 - this.data.previewImages.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        if (res.errMsg === 'chooseImage:ok') {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          self.setData({
            previewImages: self.data.previewImages.concat(tempFilePaths)
          })
          console.log(tempFilePaths)
        }
      }
    })
  },
  removeImage(e) {
    const index = e.target.dataset.index
    this.data.previewImages.splice(index, 1)
    this.setData({ previewImages: this.data.previewImages })
  },
  async toSubmit() {
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
  async submit() {
    const self = this
    self.upLoadFile()
    self.setData({
      isShowPop: true
    })
  },
  checkboxChange: function(e) {
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

  closePop(clear) {
    const self = this
    self.setData({ isShowPop: false })
    // if (clear) {
    //   self.setData({
    //     content: '',
    //     contentCount: 0
    //   })
    // }
  },
  upLoadFile() {
    const self = this
    const imgList = self.data.previewImages
    Taro.showLoading({
      title: '正在上传...'
    })
    let promiseList = uploadFile(imgList)
    // 使用Primise.all来执行promiseList
    Promise.all(promiseList)
      .then(res => {
        Taro.hideLoading()
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
      })
      .catch(error => {
        Taro.hideLoading()
        util.showToast(error || '图片上传失败')
      })
  },
  async secretNew() {
    const self = this
    try {
      await post({
        url: urls.secretNew,
        data: self.params()
      })
      self.resetData()
    } catch (err) {
      util.showToast(err || '保存失败')
    }
  },
  setConent(e) {
    const data = e.detail.value
    this.setData({
      content: data,
      contentCount: data.length
    })
  },
  // 更换虚拟信息
  async changeVirtualInfo() {
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
        case 'UK':
          nationalFlagUrl = 'images/resources/Nipic_48.jpg'
          break
        case 'JAPAN':
          nationalFlagUrl = 'images/resources/Nipic_121.jpg'
          break
        case 'France':
          nationalFlagUrl = 'images/resources/Nipic_78.jpg'
          break
        case 'US':
          nationalFlagUrl = 'images/resources/Nipic_26.jpg'
          break
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
  params() {
    const {
      burnAfterReading = false,
      content,
      headImageKey,
      headImageUrl,
      imageKeyList = [],
      imageUrls = [],
      reply = '',
      replyTime = '',
      subject
    } = this.data
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
  toBack() {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
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
  },
  bindload(event) {
    console.log(event.detail)
  },
  binderror(event) {
    this.setData({
      isShowOfficial: false
    })
    console.log(event.detail)
  },
  resetData() {
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
})
class _C extends Taro.Component {
  config = {
    navigationBarTitleText: '我的吐槽'
  }

  render() {
    const {
      headImageUrl,
      virtualInfo,
      nationalFlagUrl,
      content,
      contentTotal,
      isShowPop,
      txtRealContent,
      contentCount,
      previewImages
    } = this.data
    return (
      <View className="talk">
        {/* <official-account class="official" bindload='bindload' binderror='binderror'>关注</official-account> */}
        {/* </view> */}
        <View className="talk__top">
          <View className="talk__top-user">
            {headImageUrl && (
              <Image className="talk__top-img" src={headImageUrl}></Image>
            )}
          </View>
          <View className="talk__top-ip">
            <View>虚拟IP</View>
            <View className="talk__top-ip__text">{virtualInfo.ip}</View>
          </View>
          <Text className="talk__top-text">
            您的IP已经被保护 \n 说秘密确保您的个人信息安全
          </Text>
          <View className="talk__country">
            <View className="talk__country__image">
              {nationalFlagUrl && (
                <Image
                  className="talk__country__img"
                  src={'../../' + nationalFlagUrl}
                ></Image>
              )}
            </View>
            <Text
              className="talk__country-change"
              onClick={this.changeVirtualInfo}
            >
              更换IP >
            </Text>
          </View>
        </View>
        <View className="talk__content">
          {!isShowPop ? (
            <Textarea
              fixed="true"
              className="talk__content__area"
              value={content}
              maxlength={contentTotal}
              placeholderClass="talk__content__area--placeholder"
              placeholder="畅所欲言，您的个人信息已被虚拟IP技术和数据加密技术保护～"
              onInput={this.setConent}
            ></Textarea>
          ) : (
            <View
              className={
                'cu-talk__rich-text' +
                (txtRealContent ? '' : ' cu-talk__textarea--placeholder')
              }
            >
              <RichText
                nodes={
                  txtRealContent
                    ? txtRealContent
                    : '畅所欲言，您的个人信息已被虚拟IP技术和数据加密技术保护～'
                }
              ></RichText>
            </View>
          )}
          <Text className="talk__content__num">
            {contentCount + '/' + contentTotal}
          </Text>
        </View>
        <View className="talk__images">
          {previewImages.map((item, index) => {
            return (
              <View className="talk__images__image" key={index}>
                <Image src={item} className="talk__images__img"></Image>
                <I
                  className="talk__images__image-i"
                  onClick={this.removeImage}
                  color="red"
                  type="cancel"
                  size="60"
                  data-index={index}
                >
                  +
                </I>
              </View>
            )
          })}
          {previewImages.length < 5 && (
            <View
              className="talk__images__image talk__images__add"
              onClick={this.chooseImage}
            >
              <Image
                className="talk__images__add-img"
                src={require('../../images/camera.png')}
              ></Image>
              <Text className="talk__images__add-text">添加图片</Text>
            </View>
          )}
        </View>
        <View className="talk__botton">
          <View className="talk__btn" onClick={this.toBack}>
            取消
          </View>
          <View className="talk__btn talk__btn--sub" onClick={this.toSubmit}>
            提交
          </View>
        </View>
        {isShowPop && <TalkPop onClosePop={this.closePop}></TalkPop>}
        <TabBar currentTab="2"></TabBar>
      </View>
    )
  }
}

export default _C
