const STORAGE_KEY_AUTH_TOKEN = 'STORAGE_KEY_AUTH_TOKEN'
const TOKE_SET_TIME = 'TOKE_SET_TIME'
const STORAGE_KEY_WX_CODE = 'STORAGE_KEY_WX_CODE'
const TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000
const authStorage = {
  setAuth (auth) {
    try {
      const newTime = Date.parse(new Date())
      wx.setStorageSync(TOKE_SET_TIME, newTime)
      wx.setStorageSync(STORAGE_KEY_AUTH_TOKEN, auth)
    } catch (err) {
      throw new Error(`本地存储 setAuth 本地存储写入异常: ${err.message}`)
    }
  },
  getAuth () {
    try {
      const time = wx.getStorageSync(TOKE_SET_TIME) || 0
      const newTime = Date.parse(new Date())
      if (newTime - time < TOKEN_EXPIRE_TIME) {
        return wx.getStorageSync(STORAGE_KEY_AUTH_TOKEN)
      }
      wx.removeStorageSync('STORAGE_KEY_AUTH_TOKEN')
      wx.removeStorageSync('TOKE_SET_TIME')
      return ''
    } catch (err) {
      throw new Error(`本地存储 getAuth 本地存储读取异常: ${err.message}`)
    }
  },
  setWeChatAuth (auth) {
    try {
      wx.setStorageSync(STORAGE_KEY_WX_CODE, auth)
    } catch (err) {
      throw new Error(`本地存储 setWeChatAuth 本地存储写入异常: ${err.message}`)
    }
  },
  getWeChatAuth () {
    try {
      return wx.getStorageSync(STORAGE_KEY_WX_CODE)
    } catch (err) {
      throw new Error(`本地存储 getWeChatAuth 本地存储读取异常: ${err.message}`)
    }
  }
}

module.exports = {
  authStorage: authStorage
}
