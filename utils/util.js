function showToast(msg) {
  wx.showToast({
      title: msg,
      icon: 'none'
    })
}

module.exports = {
  showToast: showToast
}
