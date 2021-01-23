import { Block, View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import CuNoMore from '../nomore/nomore'
import './index.scss'
const { get, post } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const { formatTimeFromStamp } = require('../../utils/timeUtil.js')

@withWeapp({
  properties: {},
  data: {
    pageSize: 10, // 分页的请求条数
    upDown: true, // true:上滑刷新 false:下拉刷新,
    last: 0, // 最后一条
    noMore: false,
    secretList: [],
    showSelect: false,
    item: {}
  },
  async attached() {
    this.refresh()
  },
  methods: {
    loadMoreData() {
      Taro.showLoading()
      const data = [
        {
          id: 1,
          avatar: '',
          createTime: 1543809385522,
          power: 12,
          content:
            '食堂的伙食可不可以翻新一下。还有我无辣不欢，是否可以配一瓶老干妈拌饭。',
          replyContent: '您的建议很靠谱，我会联系厨房的。谢谢',
          replyTime: 1543819518281
        }
      ]
      const rst = data.map(item => {
        return Object.assign(item, {
          createTime: formatTimeFromStamp(item.createTime, 'Y/M/D'),
          replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
        })
      })
      this.setData({ secretList: this.data.secretList.concat(rst) })
      Taro.hideLoading()
    },
    selectStage() {
      const showSelect = !this.data.showSelect
      this.setData({ showSelect: showSelect })
    },
    /**
     * 刷新,并且初始化页面参数
     */
    refresh() {
      // this.setData({
      //   isEmpty: false,
      //   noMore: false,
      //   pageIndex: 1,
      //   list: []
      // })
      this.loadMore()
    },
    async loadMore() {
      if (this.data.noMore) {
        return
      }
      const rsp = await post({
        url: urls.secretList,
        data: this.params()
      })
      // wx.hideLoading()
      if (rsp.code === 0) {
        if (!rsp.data.items || rsp.data.items.length === 0) {
          this.setData({ noMore: true })
          return
        }
        const rst = rsp.data.items.map(item => {
          return Object.assign(item, {
            createTime: formatTimeFromStamp(item.createTime, 'Y/M/D'),
            replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
          })
        })
        this.setData({
          secretList: [...this.data.secretList, ...rst],
          last: rsp.data.last
        })
      }
    },
    /**
     * 封装接口需要的参数
     */
    params() {
      const { upDown = true, pageSize = 10, last = 0 } = this.data
      let result = {
        size: pageSize,
        last,
        upDown
      }
      return result
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { secretList, noMore, item } = this.data
    return (
      <View className="cu-profile">
        <View className="cu-profile__bodys">
          {item.content && (
            <Block>
              {secretList.map((it, index) => {
                return (
                  <View
                    key={it.secretId}
                    className={
                      'cu-profile__body ' +
                      (index == 0 ? 'cu-profile__body--first' : '')
                    }
                  >
                    <View className="cu-profile__user">
                      <View className="cu-profile__user-left">
                        <View className="cu-profile__user-image cu-placeholder">
                          {it.headImageUrl && (
                            <Image
                              src={it.headImageUrl}
                              className="cu-profile__user-img"
                            ></Image>
                          )}
                        </View>
                        {it.createTime}
                      </View>
                      <View className="cu-profile__user-right">
                        <Image
                          src={require('../../images/flash.png')}
                          className="cu-profile__power-image"
                        ></Image>
                        {item.power}
                      </View>
                    </View>
                    {it.content && (
                      <View className="cu-profile__content">
                        {it.content}
                      </View>
                    )}
                    <View className="cu-profile__images">
                      {it.imageUrls.map((img, index) => {
                        return (
                          <View key={img} className="cu-profile__image">
                            <Image
                              src={img}
                              className="cu-profile__img"
                            ></Image>
                          </View>
                        )
                      })}
                      {/* <block wx:for="{{item.images}}" wx:key="*this" wx:for-item="i">
                              <image src="{{i}}"/>
                            </block> */}
                    </View>
                    {it.reply && (
                      <View className="cu-profile__reply">
                        <View>{it.reply}</View>
                        <View className="cu-profile__reply-hr">
                          <Strong>HR</Strong>
                          <Text className="cu-profile__reply-time">
                            {it.replyTime}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )
              })}
            </Block>
          )}
          {noMore && <CuNoMore></CuNoMore>}
        </View>
        <CuTabBar></CuTabBar>
      </View>
    )
  }
}

export default _C
