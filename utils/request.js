const config = require('../config.js')
const storage = require('./storage.js')
const unit = require('./util.js')
const app = getApp()
const regeneratorRuntime = require('./runtime')

function noop () {}
noop(regeneratorRuntime)

const {code} = require('./error_code')
// 请求的域名
const host = 'https://www.mimishuo.net/api'
const imgHost = 'https://mimishuo.oss-cn-beijing.aliyuncs.com'

// 用户第一次进来注册

function userJoin (companyId) {
  wx.login({
    success: function (loginRes) {
      const wcode = loginRes.code
      wx.getUserInfo({
        withCredentials: true,
        success: function (data) {
          wx.setStorageSync('userInfo', data.userInfo)
          console.log(data)
          const encryptedData = data.encryptedData
          const iv = data.iv
          const userInfo = data.userInfo
          // 取到用户经纬度
          let userLocation = getApp().globalData.userLocation
          if (!userLocation) {
            wx.getLocation({
              type: 'wgs84',
              altitude: true,
              success (res) {
                const latitude = res.latitude
                const longitude = res.longitude
                getApp().globalData.userLocation = {
                  latitude: latitude,
                  longitude: longitude
                }
                userLocation = getApp().globalData.userLocation
              }
            })
          }

          let head = {'content-type': 'application/json'}
          wx.request({
            url: `${host}/user/join`,
            header: head,
            method: 'POST',
            data: {
              code: wcode, // code  测试默认传''
              companyId: companyId,
              nickName: userInfo.nickName,
              sex: userInfo.gender,
              lat: userLocation.latitude,
              lng: userLocation.longitude,
              iv: iv,
              encryptedData: encryptedData
            },
            success (res) {
              if (res.statusCode === 200) {
                if (res.data && (res.data.errorCode === '200' || res.data.result === 'success')) {
                  storage.authStorage.setAuth(res.data.data)
                  if (res.data.data && res.data.data.accessToken) {
                    wx.reLaunch({
                      url: '/pages/talk/talk'
                    })
                  } else {
                    unit.showToast(res.data.errorMsg || '登录失败，请稍后重试')
                  }
                } else {
                  unit.showToast(res.data.errorMsg || '网络连接失败')
                }
              } else {
                unit.showToast('网络连接失败')
              }
            },
            fail (res) {
              unit.showToast(res.errMsg || '网络连接失败')
            }
          })
          // RequestLogin(code, data.encryptedData, data.iv, success, fail)
        }
      })
    },
    fail: function () {
    }
  })
}

// 微信发送请求
function wxRequest (options) {
  const { url, data, method, dataType, header } = options
  let head = {}
  if (!header) {
    let authorization = storage.authStorage.getAuth() ? storage.authStorage.getAuth().accessToken : ''
    if (!authorization) {
      showLoginErr('登录过期，请重新登录')
      // try {
      //   authorization = await userLogin()
      // } catch (err) {
      //   return
      // }
    }
    head = {
      'content-type': 'application/json', // 默认值
      'authorization': authorization // 测试值，// todo 到时候需要通过接口获取到这个值
    }
  } else {
    head = header
  }
  // 请求url是否在合法的urls中
  if (!Object.values(config.urls).includes(url)) {
    return new Promise((resolve, reject) => {
      return resolve({
        code: code.INVALID_URL,
        content: '非法的url'
      })
    })
  }
  const requestUrl = `${host}/${url}`
  const requestMethod = method || 'GET' // 未设置，默认get
  const requestDataType = dataType || 'json' // 未设置，默认json

  const promise = new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      data: data,
      method: requestMethod,
      dataType: requestDataType,
      header: head,
      success (res) {
        // console.log(res)
        // todo ，统一校验
        if (res.statusCode === 200) {
          if (res.data.result === 'success') {
            // 接口成功返回数据
            resolve({code: 0, data: res.data.data})
          } else {
            if (res.data.errorCode == '10002') { // 如果是tonken过期，自动刷新登录接口
              // userLogin()
              showLoginErr('授权过期，请重新登录')
            } else {
              resolve({code: res.data.errorCode, content: res.data.errorMsg})
            }
          }
        } else {
          reject(res)
        }
      },
      fail (res) {
        reject(res)
      }
    })
  })
  return promise
}

function userLogin (options) {
  const promise = new Promise((resolve, reject) => {
    wx.login({
      success (res) {
        if (res.code) {
          // 发网络请求，调api获取openid
          let head = {'content-type': 'application/json'}
          wx.request({
            url: `${host}/user/login`,
            header: head,
            data: {
              code: res.code // res.code  测试默认传''
            },
            success (res) {
              console.info(res)
              if (res.statusCode === 200) {
                if (res.data && (res.data.errorCode === '200' || res.data.result === 'success')) {
                  storage.authStorage.setAuth(res.data.data)
                  if (res.data.data && res.data.data.accessToken) {
                    resolve(res.data.data.accessToken)
                  } else {
                    showLoginErr('首次登录请扫描公司的秘密说二维码！', options)
                  }
                } else {
                  showLoginErr('首次登录请扫描公司的秘密说二维码！', options)
                  reject(new Error(res.data.errorMsg))
                }
              } else {
                showLoginErr(res.errMsg, options)
                reject(new Error(res.errMsg))
              }
            },
            fail (res) {
              showLoginErr('首次登录请扫描公司的秘密说二维码！', options)
              reject(res)
            }
          })
        } else {
          showLoginErr('微信登录授权失败', options)
        }
      }
    })
  })
  return promise
}
function showLoginErr (errMessage, type) {
  unit.showToast(errMessage || '登录失败，请稍后重试')
  if (type !== 2) {
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }, 1500)
  }
}

// 上传图片
function wxUploadFile (imgList) {
  const url = 'file/upload'

  // 请求url是否在合法的urls中
  if (!Object.values(config.urls).includes(url)) {
    unit.showToast('不合法的url')
    return
  }
  const requestUrl = `${host}/${url}`
  let promiseList = imgList.map((item) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl,
        filePath: item,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          'user': 'test'
        },
        success: (res) => {
          var data
          if (res.statusCode == 200) {
            data = JSON.parse(res.data)
          } else {
            unit.showToast('上传图片数据解析失败')
          }
          if (data.errorCode === '200' || data.result === 'success') {
            resolve(data.data)
          }
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  })
  return promiseList
}

function uploadFile (imgList) {
  return wxUploadFile(imgList)
}
function login (options) {
  return userLogin(options)
}
function join (companyId) {
  return userJoin(companyId)
}
function get (options) {
  options = options || {}
  options.method = 'GET'
  return wxRequest(options)
}

function post (options) {
  options = options || {}
  options.method = 'POST'
  return wxRequest(options)
}

function put (options) {
  options = options || {}
  options.method = 'PUT'
  return wxRequest(options)
}

module.exports = {
  get: get,
  post: post,
  put: put,
  login: login,
  uploadFile: uploadFile,
  join: join
}
