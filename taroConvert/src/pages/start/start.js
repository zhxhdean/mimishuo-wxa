import { Block, View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './start.scss'
const { join, login } = require('../../utils/request.js')
const storage = require('../../utils/storage.js')
const regeneratorRuntime = require('../../utils/runtime.js')

function noop() {}
noop(regeneratorRuntime)

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    content: '您的每一条吐槽都将受到技术保护\n请放心大胆地说出你的建议，不要怂',
    companyId: '',
    isShowOfficial: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const scene = options.scene || ''
    if (scene) {
      const regex = /c=([0-9]+)/
      const m = regex.exec(decodeURIComponent(scene))
      if (m && m.length > 1) {
        this.setData({
          companyId: m[1]
        })
      }
      // const arr = decodeURIComponent(scene).split('=')
      // const companyId = arr.length > 1 ? arr[1] : 0
      // this.setData({
      //   companyId
      // })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // todo调接口
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  getUserInfo: function(data) {
    // const userInfo = data.detail.userInfo
    // console.log(data)
    this.clickComplaints()
  },
  clickComplaints: async function() {
    if (this.data.companyId) {
      // 第一次扫描公司二维码进来
      Taro.setStorageSync('initCompanyId', this.data.companyId)
      await join(this.data.companyId)
    } else {
      try {
        let authorization = storage.authStorage.getAuth()
          ? storage.authStorage.getAuth().accessToken
          : ''
        if (!authorization) {
          await login(2)
        }
        Taro.reLaunch({
          url: '/pages/talk/talk'
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  bindload(event) {
    this.setData({
      isShowOfficial: true
    })
    console.log(event.detail)
  },
  binderror(event) {
    console.log(event.detail)
  }
})
class _C extends Taro.Component {
  config = {
    disableScroll: true
  }

  render() {
    const { isShowOfficial, companyId } = this.data
    return (
      <View className="start">
        <View className="start__content">
          <View
            className={
              isShowOfficial
                ? 'start__button start__button--official'
                : 'start__button'
            }
          >
            {companyId && (
              <Button
                className="start__btn"
                openType="getUserInfo"
                onGetuserinfo={this.getUserInfo}
              >
                去吐槽
              </Button>
            )}
            {!companyId && (
              <View className="start__btn" onClick={this.clickComplaints}>
                去吐槽
              </View>
            )}
            {/* <official-account class="official" bindload='bindload' binderror='binderror'></official-account> */}
          </View>
          {/* <view class="start__official"> */}
          {/* <official-account class="official" bindload='bindload' binderror='binderror'></official-account> */}
          {/* </view> */}
        </View>
      </View>
    )
  }
}

export default _C
