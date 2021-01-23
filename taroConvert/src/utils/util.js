import Taro from '@tarojs/taro'
function showToast(msg) {
  Taro.showToast({
    title: msg,
    icon: 'none'
  })
}

module.exports = {
  showToast: showToast
}
