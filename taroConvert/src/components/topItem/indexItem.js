import { Block, View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import ReplyItem from '../replyItem/indexItem'
import './indexItem.scss'
const { post, get } = require('../../utils/request.js')
const { urls } = require('../../config.js')
const { formatTimeFromStamp } = require('../../utils/timeUtil.js')

@withWeapp({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    idx: {
      type: Number,
      value: 0
    }
  },
  data: {
    like: null,
    likeNum: 0,
    hateNum: 0,
    result: {},
    index: 0,
    topicReplyItemList: [],
    isShowReplyAll: false
  },
  attached() {
    const { item } = this.properties
    if (item) {
      const obj = item.topicReplyItem || {}
      const arr = obj.content ? [obj] : []
      this.setData({
        result: item,
        likeNum: item.likeNum,
        like: item.like,
        topicReplyItemList: arr
      })
    }
  },
  methods: {
    likes(e) {
      const { id, status, type = 'TOPIC' } = e.currentTarget.dataset
      const { likeNum } = this.data
      if (status === true) {
        this.likesCancel(id)
      } else {
        post({
          url: urls.topicLikes,
          data: {
            id,
            topicLikeType: type
          }
        }).then(res => {
          const { code, content } = res
          if (code === 0) {
            this.setData({
              likeNum: likeNum + 1,
              like: true
            })
          } else {
            Taro.showToast({
              title: content,
              icon: 'none'
            })
          }
        })
      }
    },
    likesCancel(id) {
      post({
        url: urls.topicCancel,
        data: {
          id,
          topicLikeType: 'TOPIC'
        }
      }).then(res => {
        const { code, content } = res
        if (code === 0) {
          const { likeNum } = this.data
          this.setData({
            like: false,
            likeNum: likeNum - 1
          })
        } else {
          Taro.showToast({
            title: content,
            icon: 'none'
          })
        }
      })
    },
    reply(e) {
      const { id } = e.currentTarget.dataset
      const { secretTopic = '' } = this.properties.item || {}
      this.triggerEvent('toReply', { id, secretTopic })
    },
    topIcDesc(e) {
      const { id } = e.currentTarget.dataset
      get({
        url: `${urls.topic}/${id}`,
        data: {}
      }).then((rsp = {}) => {
        const { code, data = {} } = rsp || {}
        if (code === 0) {
          const arr = (data && data.topicReplyItemList) || []
          const topicReplyItemList = arr.map(item => {
            return Object.assign(item, {
              createdAt: formatTimeFromStamp(item.createdAt, 'Y/M/D h:m')
            })
          })
          this.setData({ topicReplyItemList, isShowReplyAll: true })
        }
      })
    },
    previewImage: function(e) {
      const data = e.target.dataset
      const urls = data.images
      const current = urls[data.index]
      Taro.previewImage({
        current: current,
        urls: urls
      })
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { like, likeNum, isShowReplyAll, topicReplyItemList } = this.data
    return (
      item.subject && (
        <View
          key={item.topicId}
          className="cu-profile__body cu-profile__body--first"
        >
          <View className="cu-profile__user">
            <View className="cu-profile__user-left">
              <View className="cu-profile__user-image">
                <Image
                  src={require('../../images/hr_head.png')}
                  className="cu-profile__user-img"
                ></Image>
              </View>
              {item.publishTime}
            </View>
            <View className="cu-profile__user-right">
              <View
                className="btn zan"
                onClick={this.likes}
                data-id={item.topicId}
                data-status={like}
              >
                {like === true && <View className="zan-img"></View>}
                {like === true ? (
                  <Image
                    className="zan-img-f"
                    src={require('../../images/zan_f.png')}
                  ></Image>
                ) : (
                  <Image
                    className="zan-img"
                    src={require('../../images/zan.png')}
                  ></Image>
                )}
                {likeNum ? likeNum : ''}
              </View>
            </View>
          </View>
          {item.subject && (
            <View className="cu-profile__content--hr">
              {item.secretTopic && (
                <Image
                  className="secretImage"
                  src={require('../../images/icon/icon_activity.png')}
                ></Image>
              )}
              {item.secretTopic && (
                <Text className="replyTip">
                  {'已有' + (item.replyNum || 0) + '人参与'}
                </Text>
              )}
              {item.subject}
              <Text
                className="reply"
                onClick={this.reply}
                data-id={item.topicId}
              >
                回复
              </Text>
            </View>
          )}
          {/* 回复列表 */}
          {topicReplyItemList.map((item, index) => {
            return (
              <ReplyItem
                key={item.topicReplyId}
                item={item}
                idx={index}
                secretTopic={item.secretTopic}
              ></ReplyItem>
            )
          })}
          {item.replyNum > 1 && !item.secretTopic && !isShowReplyAll && (
            <View
              className="reply_num"
              onClick={this.topIcDesc}
              data-id={item.topicId}
            >
              {'共' + item.replyNum + '条回复'}
              <Image
                className="zan_arrow"
                src={require('../../images/icon/icon_arrow_gray.png')}
              ></Image>
            </View>
          )}
        </View>
      )
    )
  }
}

export default _C
