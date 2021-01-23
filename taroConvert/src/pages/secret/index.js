import { Block, View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import IndexItem from '../../components/indexItem/indexItem'
import CuNoMore from '../../components/nomore/nomore'
import CuTopLine from '../../components/topLine/topLine'
import './index.scss'
const { get, post } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const { formatTimeFromStamp } = require('../../utils/timeUtil.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const util = require('../../utils/util.js')

function noop() {}
noop(regeneratorRuntime)

@withWeapp({
  data: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    secretList: [],
    noMore: false,
    isEmpty: false
  },
  onLoad: function(options) {
    this.refresh()
  },

  onShow: function() {},
  onReachBottom: function() {
    this.loadMore()
  },
  refresh() {
    this.setData({
      isEmpty: false,
      noMore: false,
      pageIndex: 1,
      secretList: []
    })
    this.loadMore()
  },
  async loadMore() {
    if (this.data.noMore) {
      return
    }
    try {
      const rsp = await get({
        url: urls.secretMy,
        data: this.params()
      })
      // wx.hideLoading()
      if (rsp.code === 0) {
        const data = rsp.data
        if (!data.items || data.items.length === 0) {
          if (this.data.secretList.length === 0) {
            this.setData({ isEmpty: true })
          } else {
            this.setData({ noMore: true })
          }
          return
        }
        const rst = data.items.map(item => {
          return Object.assign(item, {
            createTime: formatTimeFromStamp(item.createTime, 'Y/M/D h:m'),
            replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
          })
        })
        this.setData({
          secretList: [...this.data.secretList, ...rst],
          pageIndex: data.pageIndex + 1,
          totalCount: data.totalCount
        })
      } else {
        util.showToast(rsp.content || '接口失败，请返回重试')
      }
    } catch (err) {
      util.showToast(err || '接口失败，请重试')
    }
  },
  params() {
    const { pageIndex = 1, pageSize = 10 } = this.data
    let result = {
      pageIndex,
      pageSize
    }
    return result
  },
  previewImage: function(e) {
    const data = e.target.dataset
    const urls = data.images
    const current = urls[data.index]
    Taro.previewImage({
      current: current,
      urls: urls
    })
  },
  goTalk: function() {
    Taro.reLaunch({
      url: '/pages/talk/talk'
    })
  }
})
class _C extends Taro.Component {
  config = {
    navigationBarTitleText: '我的吐槽'
  }

  render() {
    const { secretList, isEmpty, noMore } = this.data
    return (
      <View className="secret">
        <CuTopLine></CuTopLine>
        {secretList.map((item, index) => {
          return (
            <IndexItem key={item.secretId} item={item} idx={index}></IndexItem>
          )
        })}
        {/* <view wx:for="{{secretList}}" wx:key="{{item.secretId}}" class="secret__item" wx:if="{{item.content}}"> */}
        {/* <view class="c858 secret__user"> */}
        {/* <view class="secret__user-top"> */}
        {/* <image class="secret__avator" src="{{item.headImageUrl?item.headImageUrl:'../../images/avator.jpg'}}"/> */}
        {/* <text class="secret__user-text">{{item.createTime}}</text> */}
        {/* </view> */}
        {/* </view> */}
        {/* <view class="secret__content" wx:if="{{item.content}}"> */}
        {/* {{item.content}} */}
        {/* <view class="secret__content-icon"></view> */}
        {/* </view> */}
        {/* <view wx:if="item.imageUrls&&item.imageUrls.length>0" class="secret__images"> */}
        {/* <view wx:for="{{item.imageUrls}}" */}
        {/* wx:key="{{index}}" */}
        {/* wx:for-index="index" */}
        {/* wx:for-item="img" class="secret__image"> */}
        {/* <image src="{{img}}" class="secret__img" */}
        {/* bindtap="previewImage" */}
        {/* data-images="{{item.imageUrls}}" */}
        {/* data-index="{{index}}"/> */}
        {/* </view> */}
        {/* </view> */}
        {/* <view wx:if="{{item.reply}}" class="secret__reply"> */}
        {/* <view class="secret__reply-hr"><strong>HR</strong> */}
        {/* <text class="text">{{item.replyTime}}</text> */}
        {/* </view> */}
        {/* <view class="secret__reply-content">{{item.reply}}<view class="secret__content-icon-hr"></view> */}
        {/* </view> */}
        {/* </view> */}
        {/* </view> */}
        {isEmpty && (
          <View className="empty">
            <Image
              src={require('../../images/icon/square_empty.jpg')}
              className="empty__img"
              onClick={this.previewImage}
            ></Image>
            <View>您目前还没吐槽哦</View>
            <View className="empty__btn" onClick={this.goTalk}>
              匿名吐槽
            </View>
          </View>
        )}
        {noMore && <CuNoMore></CuNoMore>}
      </View>
    )
  }
}

export default _C
