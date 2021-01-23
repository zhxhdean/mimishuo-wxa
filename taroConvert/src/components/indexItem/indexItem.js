import { Block, View, Image, Text } from '@tarojs/components'
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
    index: 0
  },
  attached() {
    const { item, idx } = this.properties
    this.setData({
      result: item,
      index: idx,
      likeNum: item.likeNum,
      like: item.like,
      hateNum: item.hateNum
    })
  },
  methods: {
    likes(e) {
      const { id, status } = e.currentTarget.dataset
      console.log('status:', typeof status)
      const { result, likeNum, hateNum } = this.data
      if (status === true) {
        this.likesCancel(id, false, 'like')
      } else {
        post({
          url: urls.secretLikes,
          data: {
            secretId: id,
            isLike: status ? !status : true
          }
        }).then(res => {
          const { code, content } = res
          if (code === 0) {
            this.setData({
              result: {
                ...result,
                like: true,
                likeNum: result.likeNum + 1
              },
              likeNum: likeNum + 1,
              like: true
            })
            if (status === false) {
              this.setData({
                hateNum: hateNum - 1
              })
            }
          } else {
            Taro.showToast({
              title: content,
              icon: 'none'
            })
          }
          console.log('result:', this.data.result)
        })
      }
    },
    noLikes(e) {
      const { id, status } = e.currentTarget.dataset
      console.log('status:', typeof status, status)
      const { result, hateNum, likeNum } = this.data
      if (status === false) {
        this.likesCancel(id, true)
      } else {
        post({
          url: urls.secretLikes,
          data: {
            secretId: id,
            isLike: status ? !status : false
          }
        }).then(res => {
          const { code, content } = res
          console.log('dddss:', res)
          if (code === 0) {
            this.setData({
              result: {
                ...result,
                like: false,
                hateNum: result.hateNum + 1
              },
              hateNum: hateNum + 1,
              like: false
            })

            if (status === true) {
              this.setData({
                likeNum: likeNum - 1
              })
            }
          } else {
            Taro.showToast({
              title: content,
              icon: 'none'
            })
          }
        })
      }
    },
    likesCancel(id, status, isLike) {
      post({
        url: urls.secretLikesC,
        data: {
          secretId: id
          // isLike: status
        }
      }).then(res => {
        const { code, content } = res
        if (code === 0) {
          const { result, hateNum, likeNum } = this.data
          if (isLike) {
            this.setData({
              result: {
                ...result,
                like: null,
                likeNum: result.likeNum - 1
              },
              like: null,
              likeNum: likeNum - 1
            })
          } else {
            this.setData({
              result: {
                ...result,
                like: null,
                hateNum: result.hateNum - 1
              },
              like: null,
              hateNum: hateNum - 1
            })
          }
        } else {
          Taro.showToast({
            title: content,
            icon: 'none'
          })
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
    const { item, like, likeNum, hateNum } = this.data
    return (
      item.content && (
        <View
          key={item.secretId}
          className={
            'cu-profile__body ' + (index == 0 ? 'cu-profile__body--first' : '')
          }
        >
          <View className="cu-profile__user">
            <View className="cu-profile__user-left">
              <View className="cu-profile__user-image">
                {item.headImageUrl && (
                  <Image
                    src={item.headImageUrl}
                    className="cu-profile__user-img"
                  ></Image>
                )}
              </View>
              {item.createTime}
            </View>
            <View className="cu-profile__user-right">
              <View
                className="btn zan"
                onClick={this.likes}
                data-id={item.secretId}
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
              <View
                className="btn cai"
                onClick={this.noLikes}
                data-id={item.secretId}
                data-status={like}
              >
                {like === false && <View className="zan-img"></View>}
                {like === false ? (
                  <Image
                    className="zan-img-c"
                    src={require('../../images/cai_f.png')}
                  ></Image>
                ) : (
                  <Image
                    className="zan-img"
                    src={require('../../images/cai.png')}
                  ></Image>
                )}
                {hateNum ? hateNum : ''}
              </View>
            </View>
          </View>
          {item.content && (
            <View className="cu-profile__content">{item.content}</View>
          )}
          <View className="cu-profile__images">
            {item.imageUrls.map((img, index) => {
              return (
                <View key={img} className="cu-profile__image">
                  <Image
                    src={img}
                    className="cu-profile__img"
                    onClick={this.previewImage}
                    data-images={item.imageUrls}
                    data-index={index}
                  ></Image>
                </View>
              )
            })}
          </View>
          {item.reply && (
            <View className="cu-profile__reply">
              <View className="cu-profile__reply-hr">
                <Strong>HR</Strong>
                <Text className="cu-profile__reply-time">{item.replyTime}</Text>
              </View>
              <View>{item.reply}</View>
            </View>
          )}
        </View>
      )
    )
  }
}

export default _C
