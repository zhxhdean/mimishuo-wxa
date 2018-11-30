const config = require('../config.js')
const regeneratorRuntime = require('./runtime')

function noop(){}
noop(regeneratorRuntime)


const {code} = require('./error_code')
//请求的域名
const host = 'http://140.143.223.43:8080/api'



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
        'authorization': '4c2d1153f46311e88a8a0242ac110002', // 测试值，// todo 到时候需要通过接口获取到这个值
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        // todo ，统一校验
        if (res.statusCode === 200) {
          if(res.data.result === 'success'){
            //接口成功返回数据
            resolve({code: 0, data: res.data.data})
          }else{
            resolve({code: res.data.errorCode, content: res.data.errorMsg})
          }
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

// 微信登录
function wxLogin(){
  wx.login({
    success(res){
      if(res.code){
        // 发网络请求，调api获取openid
        console.log(res.code)
      }else{
        console.log('登录失败'+res.errMsg)
      }
    }
  })
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
  post: post,
  wxLogin: wxLogin
}
