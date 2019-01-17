const STORAGE_KEY_AUTH_TOKEN = 'STORAGE_KEY_AUTH_TOKEN'
const STORAGE_KEY_WX_CODE = 'STORAGE_KEY_WX_CODE'
const authStorage = {
  setAuth (auth) {
    try {
      wx.setStorageSync(STORAGE_KEY_AUTH_TOKEN, auth)
    } catch (err) {
      throw new Error(`本地存储 setAuth 本地存储写入异常: ${err.message}`)
    }
  },
  getAuth () {
    try {
      return wx.getStorageSync(STORAGE_KEY_AUTH_TOKEN)
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
