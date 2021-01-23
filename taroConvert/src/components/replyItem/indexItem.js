import { Block, View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './indexItem.scss'
const { post } = require('../../utils/request.js')
const { urls } = require('../../config.js')

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
    secretTopic: false
  },
  attached() {
    const { item, secretTopic } = this.properties
    if (item) {
      this.setData({
        result: item,
        likeNum: item.likeNum,
        like: item.like,
        secretTopic
      })
    }
  },
  methods: {
    likes(e) {
      const { id, status, type = 'REPLY' } = e.currentTarget.dataset
      const { likeNum } = this.data
      if (status === true) {
        this.likesCancel(id, type)
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
    likesCancel(id, type = 'REPLY') {
      post({
        url: urls.topicCancel,
        data: {
          id,
          topicLikeType: type
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
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { item, like, secretTopic } = this.data
    return (
      item && (
        <View className="cu-profile__reply">
          <View className="cu-profile__reply-hr">
            <Text className="cu-profile__reply-time">{item.createdAt}</Text>
            {!secretTopic ? (
              <View className="cu-profile__reply-img" data-type="reply">
                {like === true ? (
                  <Image
                    className="zaned_gray"
                    src={require('../../images/icon/icon_zaned_grey.png')}
                    onClick={this.likes}
                    data-status={like}
                    data-id={item.topicReplyId}
                  ></Image>
                ) : (
                  <Image
                    className="zan_gray"
                    src={require('../../images/icon/icon_zan_grey.png')}
                    onClick={this.likes}
                    data-status={like}
                    data-id={item.topicReplyId}
                  ></Image>
                )}
              </View>
            ) : (
              <View className="secretReply">
                <Image
                  className="secret_suo"
                  src={require('../../images/icon/icon_suo_grey.png')}
                ></Image>
                他人不可见
              </View>
            )}
          </View>
          <View>{item.content}</View>
        </View>
      )
    )
  }
}

export default _C
