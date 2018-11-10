const config = require('../config.js')
const regeneratorRuntime = require('./runtime')

function noop(){}
noop(regeneratorRuntime)


const {code} = require('./error_code')
//请求的域名
const host = 'https://api.mimishuo.net'



// 微信发送请求
function wxRequest(options) {
  const { url, data, method, dataType } = options
  // 请求url是否在合法的urls中
  if (!Object.values(config.urls).includes(url)) {
    return new Promise((resolve, reject) => {
      return resolve({
        code: code.INVALID_URL,
        content: '非法的url'
      })
    })
  }
  const request_url = `${host}/${url}`
  const request_method = method || 'GET' //未设置，默认get
  const request_dataType = dataType || 'json' //未设置，默认json

  const promise = new Promise((resolve, reject) => {
    wx.request({
      url: request_url,
      data: data,
      method: request_method,
      dataType: request_dataType,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // todo ，统一校验
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail(res) {
        reject(res)
      }
    })
  })
  return promise
}


 async function get(options) {
  options = options || {}
  options.method = 'GET'
   return await wxRequest(options)
}

async function post(options) {
  options = options || {}
  options.method = 'POST'
  return await wxRequest(options)
}

module.exports = {
  get: get,
  post: post
}
