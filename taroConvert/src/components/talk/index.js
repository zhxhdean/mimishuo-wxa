import {
  Block,
  View,
  Text,
  Image,
  Textarea,
  RichText
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
const { get, post, uploadFile } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const { formatTimeFromStamp } = require('../../utils/timeUtil.js')
const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const app = Taro.getApp()

@withWeapp({
  properties: {},
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
    txtRealContent: '' // 文字备份
  },
  async attached() {
    this.getVirtual()
    this.changeVirtualInfo()

    const headImageUrl = storage.authStorage.getAuth()
      ? storage.authStorage.getAuth().headImageUrl
      : ''
    this.setData({
      headImageUrl
    })
  },
  methods: {
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
      //self.setData({isShowPop: true})
    },
    async submit() {
      const self = this
      self.upLoadFile()
      self.setData({
        isShowPop: false
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

    closePop() {
      const self = this
      self.setData({ isShowPop: false })
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
        util.showToast('保存成功')
        setTimeout(() => {
          self.triggerEvent('swichNav', 0)
        }, 1500)
      } catch (err) {
        util.showToast(err || '保存失败')
      }
    },
    setConent(e) {
      const data = e.detail.value
      this.setData({ content: data })
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
          nationalFlagUrl
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
      const self = this
      Taro.setNavigationBarTitle({
        title: '广场'
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
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const {
      isShowPop,
      headImageUrl,
      virtualInfo,
      nationalFlagUrl,
      content,
      txtRealContent,
      previewImages
    } = this.data
    return (
      <View className="cu-talk">
        {isShowPop && <View className="my_mask" onClick={this.closePop}></View>}
        {/* <view wx:if="{{isShowPop}}" class="talk-pop"> */}
        {/* <view class="talk-pop__top"> */}
        {/* <view class="talk-pop__content1">是否提交？</view> */}
        {/* <view class="talk-pop__content2">您的吐槽反馈仅HR可见并已加密处理，请放心提交</view> */}
        {/* <view class="talk-pop__check-box"> */}
        {/* <checkbox-group bindchange="checkboxChange" data-index="{{index}}" data-checks="{{burnAfterReading}}"> */}
        {/* <checkbox checked="{{burnAfterReading}}" class="talk-pop__box" value="1"/>阅后即焚 */}
        {/* </checkbox-group> */}
        {/* </view> */}
        {/* </view> */}
        {/* <view class="talk-pop__botton"> */}
        {/* <view class="talk-pop__btn" bindtap="closePop">取消</view> */}
        {/* <view class="talk-pop__btn talk-pop__btn&#45;&#45;sub" bindtap="submit">提交吐槽</view> */}
        {/* </view> */}
        {/* </view> */}
        <View className="cu-talk__action">
          <Text onClick={this.toBack}>取消</Text>
          <Text className="cu-talk__action--submit" onClick={this.toSubmit}>
            提交
          </Text>
        </View>
        <View className="cu-talk__body">
          <View className="cu-talk__virtualinfo">
            <View className="cu-talk__virtualinfo__image cu-placeholder">
              {headImageUrl && (
                <Image
                  className="cu-talk__virtualinfo__img"
                  src={headImageUrl}
                ></Image>
              )}
            </View>
            <Text className="cu-talk__virtualinfo__text">
              {'您的IP已经被保护\n        虚拟IP ' + virtualInfo.ip}
            </Text>
            <View className="cu-talk__virtualinfo__flag-image">
              {nationalFlagUrl && (
                <Image
                  className="cu-talk__virtualinfo__flag"
                  src={'../../' + nationalFlagUrl}
                ></Image>
              )}
            </View>
            <Text
              className="cu-talk__virtualinfo__change"
              onClick={this.changeVirtualInfo}
            >
              更换
            </Text>
          </View>
          <View className="cu-talk__textarea">
            {/* placeholder-class="cu-talk__textarea&#45;&#45;placeholder" */}
            {/* placeholder="此刻你想提的意见或建议..." */}
            {/* maxlength="500" */}
            {/* bindinput="setConent" */}
            {/* value="{{content}}"></textarea> */}
            {!isShowPop ? (
              <Textarea
                className="cu-talk__textarea--area"
                value={content}
                placeholderClass="cu-talk__textarea--placeholder"
                placeholder="此刻你想提的意见或建议..."
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
                      : '此刻你想提的意见或建议...'
                  }
                ></RichText>
              </View>
            )}
          </View>
          <View className="cu-talk__imglist">
            {previewImages.map((item, index) => {
              return (
                <View className="cu-talk__imglist__image" key="*this">
                  <Image src={item} className="cu-talk__imglist__img"></Image>
                  <I
                    className="cu-talk__imglist__i"
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
                onClick={this.chooseImage}
                className="cu-talk__imglist__image"
              >
                <View className="cu-talk__imglist__choose">+</View>
              </View>
            )}
            {/* <view catchtap="chooseImage" wx:if="{{previewImages.length < 9}}" class="cu-talk__imglist__add">+</view> */}
          </View>
        </View>
      </View>
    )
  }
}

export default _C
