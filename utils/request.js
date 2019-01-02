const config = require('../config.js')
const storage = require('./storage.js')
const unit = require('./util.js')

const regeneratorRuntime = require('./runtime')

function noop(){}
noop(regeneratorRuntime)


const {code} = require('./error_code')
//请求的域名
const host = 'http://www.mimishuo.net/api'



// 微信发送请求
async function wxRequest(options) {
  const { url, data, method, dataType, header } = options
  let head = {}
  if(!header){
    let authorization = storage.authStorage.getAuth() ? storage.authStorage.getAuth().accessToken : ''
    if (!authorization) {
      authorization = await userLogin()
    }
    head = {
      'content-type': 'application/json', // 默认值
      'authorization': authorization, // 测试值，// todo 到时候需要通过接口获取到这个值
    }
  }else {
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
  const request_url = `${host}/${url}`
  const request_method = method || 'GET' //未设置，默认get
  const request_dataType = dataType || 'json' //未设置，默认json

  const promise = new Promise((resolve, reject) => {
    wx.request({
      url: request_url,
      data: data,
      method: request_method,
      dataType: request_dataType,
      header: head,
      success(res) {
        // console.log(res)
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

// 微信发送请求
function userLogin(options) {
  const promise = new Promise((resolve, reject) => {
    wx.login({
      success(res){

        if(res.code){
          // 发网络请求，调api获取openid
          let head = {'content-type': 'application/json'}
          wx.request({
            url: `${host}/user/login`,
            header: head,
            data: {
              code: res.code
            },
            success(res) {
              console.info(res)
              storage.authStorage.setAuth({
                "accessToken": "4c2d1153f46311e88a8a0242ac110002",
                "companyId": 0,
                "expireTime": "2018-12-15T06:11:46.330Z",
                "headImageUrl": "//m.360buyimg.com/babel/jfs/t10675/253/1344769770/66891/92d54ca4/59df2e7fN86c99a27.jpg!q70.jpg",
                "nickName": "小程序",
                "sex": 20,
                "userId": 1234567
              });
              if (res.statusCode === 200) {
                if(res.data && res.data.errorCode === '200'){
                  storage.authStorage.setAuth(res.data.data);
                  resolve(res.data.data.accessToken)
                }else{
                  unit.showToast(res.data.errorMsg)
                  reject()
                }
              } else {
                reject()
              }
            },
            fail(res) {
              reject()
            }
          })
        }else{
          console.log('登录失败'+res.errMsg)
        }
      }
    })
  })
  return promise
}

async function wxLogin() {
  wx.login({
    success(res){
      if(res.code){
        wx.request({
          url: `${host}/user/login`,
          data: {
            code: res.code
          },
          success(res) {
            if (res.statusCode === 200) {
              if(res.data.errorCode === 200){
                storage.setAuth(res.data.data);
              }else{
                unit.showToast(res.data.errorMsg)
              }
            } else {

            }
          },
          fail(res) {

          }
        })
        console.log(res.code)
      }else{
        console.log('登录失败'+res.errMsg)
      }
    }
  })
}

async function login(options) {
  return await userLogin(options)
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

async function put(options) {
  options = options || {}
  options.method = 'PUT'
  return await wxRequest(options)
}

module.exports = {
  get: get,
  post: post,
  put: put,
  wxLogin: wxLogin,
  login: login
}
