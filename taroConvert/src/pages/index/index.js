import { Block, View, Image, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import TopItem from '../../components/topItem/indexItem'
import TabBar from '../../components/tabBar/tabBar'
import IndexItem from '../../components/indexItem/indexItem'
import CuNoMore from '../../components/nomore/nomore'
import CuTopLine from '../../components/topLine/topLine'
import './index.scss'
const { post } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const { formatTimeFromStamp } = require('../../utils/timeUtil.js')
const regeneratorRuntime = require('../../utils/runtime.js')
const util = require('../../utils/util.js')

function noop() {}

// let isBack = true
noop(regeneratorRuntime)

@withWeapp({
  data: {
    pageSize: 10, // 分页的请求条数
    upDown: true, // true:上滑刷新 false:下拉刷新,
    last: 0, // 最后一条
    noMore: false,
    secretList: [],
    showSelect: false,
    isEmpty: false,
    isOnLoad: false,
    topic: null,
    content: '',
    secretTopic: false,
    showReplyPop: false,
    replyId: ''
  },
  onLoad: async function(options) {
    this.setData({ isOnLoad: true })
    this.refresh()
  },
  onShow: function() {
    if (!this.data.isOnLoad) {
      this.refresh()
    }
    this.setData({ isOnLoad: false })
  },

  onPullDownRefresh: function() {
    this.refresh()
  },
  /* 加载更多 */
  onReachBottom: function() {
    this.loadMore()
  },
  onShareAppMessage: function() {},
  selectStage() {
    const showSelect = !this.data.showSelect
    this.setData({ showSelect: showSelect })
  },
  /**
   * 刷新,并且初始化页面参数
   */
  refresh() {
    this.setData({
      isEmpty: false,
      noMore: false,
      last: 0,
      secretList: [],
      topic: null
    })
    this.loadMore()
    this.feachTopic()
    setTimeout(function() {
      Taro.stopPullDownRefresh()
    }, 1500)
  },
  async feachTopic() {
    const rsp = await post({
      url: urls.topic,
      data: {}
    })
    if (rsp.code === 0) {
      // let data = rsp.data || JSON.parse('{"expireDate":"2021-01-17T07:33:14.092Z","like":false,"likeNum":10,"publishTime":"2021-01-17T07:33:14.092Z","replyNum":10,"secretTopic":true,"subject":"string","topicId":123,"topicReplyItem":{"content":"string","createdAt":"2021-01-17T07:33:14.092Z","like":true,"likeNum":0}}')
      let data = rsp.data || {}
      let topicReplyItem = data.topicReplyItem || {}
      const obj = {
        ...data,
        expireDate: formatTimeFromStamp(data.expireDate, 'Y/M/D h:m'),
        publishTime: formatTimeFromStamp(data.publishTime, 'Y/M/D h:m'),
        topicReplyItem: {
          ...topicReplyItem,
          createdAt: formatTimeFromStamp(
            topicReplyItem.createdAt || '',
            'Y/M/D h:m'
          )
        }
      }
      this.setData({ topic: obj })
    }
  },
  async loadMore() {
    if (this.data.noMore) {
      return
    }
    if (this.data.secretList.length === 0) {
      Taro.showLoading()
    }
    try {
      const rsp = await post({
        url: urls.secretList,
        data: this.params()
      })
      if (this.data.secretList.length === 0) {
        Taro.hideLoading()
      }
      if (rsp.code === 0) {
        if (!rsp.data.items || rsp.data.items.length === 0) {
          if (this.data.secretList.length === 0) {
            this.setData({ isEmpty: true })
          } else {
            this.setData({ noMore: true })
          }
          return
        }
        const rst = rsp.data.items.map(item => {
          return Object.assign(item, {
            createTime: formatTimeFromStamp(item.createTime, 'Y/M/D h:m'),
            replyTime: formatTimeFromStamp(item.replyTime, 'Y/M/D h:m')
          })
        })
        this.setData({
          secretList: [...this.data.secretList, ...rst],
          last: rsp.data.last
        })
      } else {
        util.showToast(rsp.content || '接口失败，请刷新重试')
      }
    } catch (err) {
      util.showToast(err || '接口失败，请重试')
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
  },
  closePop: function() {
    this.setData({ showReplyPop: !this.data.showReplyPop })
  },
  toReply: function(e) {
    console.log('id----:', e)
    const { id = '', secretTopic = false } = e.detail || {}
    this.setData({ showReplyPop: true, replyId: id, secretTopic })
  },
  setReplyConent: function(e) {
    this.setData({ content: e.detail.value })
  },
  catchtouchmove() {},
  async reply() {
    const { replyId, content } = this.data
    const rsp = await post({
      url: urls.topicAdd,
      data: {
        content,
        topicId: replyId
      }
    })
    if (rsp.code === 0) {
      Taro.showToast({
        title: '提交成功',
        icon: 'none'
      })
      this.refresh()
      this.setData({ showReplyPop: false, content: '' })
    } else {
      Taro.showToast({
        title: '提交失败',
        icon: 'none'
      })
    }
  }
})
class _C extends Taro.Component {
  config = {
    navigationBarTitleText: '广场',
    onReachBottomDistance: 100,
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }

  render() {
    const {
      topic,
      secretList,
      content,
      secretTopic,
      showReplyPop,
      isEmpty,
      noMore
    } = this.data
    return (
      <View className="cu-profile">
        <View className="cu-profile__bodys">
          {topic && <TopItem item={topic} onToReply={this.toReply}></TopItem>}
          {secretList.map((item, index) => {
            return (
              <IndexItem
                key={item.secretId}
                item={item}
                idx={index}
              ></IndexItem>
            )
          })}
          {showReplyPop && (
            <View
              className="replyPop"
              onClick={this.closePop}
              onTouchMove={this.catchtouchmove}
            >
              <View className="context" onClick={this.catchtouchmove}>
                <Image
                  className="reply_icon"
                  src={require('../../images/icon/icon_reply1.png')}
                ></Image>
                <Textarea
                  fixed="true"
                  className="reply_content"
                  value={content}
                  maxlength="200"
                  placeholderClass="reply_placeholder"
                  placeholder={secretTopic ? '内容仅hr和自己可见' : '回复hr'}
                  onInput={this.setReplyConent}
                  confirmType="send"
                  fixed={true}
                  onConfirm={this.reply}
                ></Textarea>
                {/*  catchtap="reply" */}
              </View>
            </View>
          )}
          {isEmpty && (
            <View className="empty">
              <Image
                src={require('../../images/icon/square_empty.jpg')}
                className="empty__img"
                onClick={this.previewImage}
              ></Image>
              <View>暂时还没有小伙伴吐槽哦</View>
              <View className="empty__btn" onClick={this.goTalk}>
                匿名吐槽
              </View>
            </View>
          )}
          {noMore && <CuNoMore></CuNoMore>}
        </View>
        <TabBar currentTab="0"></TabBar>
      </View>
    )
  }
}

export default _C
