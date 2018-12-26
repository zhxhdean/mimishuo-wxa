const config = require('../config.js')
const storage = require('./storage.js')
const unit = require('./util.js')

const regeneratorRuntime = require('./runtime')

function noop(){}
noop(regeneratorRuntime)


const {code} = require('./error_code')
//请求的域名
const host = 'http://140.143.223.43:8080/api'



// 微信发送请求
async function wxRequest(options) {
  const { url, data, method, dataType, header } = options
  let head = {}
  if(!header){
    let authorization = storage.authStorage.getAuth() ? storage.authStorage.getAuth().accessToken : ''
    if (!authorization) {
      try {
        authorization = await userLogin()
      }catch (err) {
        return
      }

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
              code: '' // res.code  测试默认传''
            },
            success(res) {
              console.info(res)
              if (res.statusCode === 200) {
                if(res.data && res.data.errorCode === '200' || res.data.result === 'success'){
                  storage.authStorage.setAuth(res.data.data);
                  if (res.data.data && res.data.data.accessToken) {
                    resolve(res.data.data.accessToken)
                  } else {
                    unit.showToast(res.data.errorMsg?res.data.errorMsg:'登录失败，请稍后重试')
                  }
                }else{
                  unit.showToast(res.data.errorMsg?res.data.errorMsg:'网络错误，请重试')
                  reject()
                }
              } else {
                reject()
              }
            },
            fail(res) {
              reject(res)
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

// 上传图片
function wxUploadFile(options) {
  const { url = 'file/upload', img} = options

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
  const promise = new Promise((resolve, reject) => {

    wx.uploadFile({
      url: request_url,
      filePath: img,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      formData: {
        "user": "test"
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        //服务器返回格式: {"result": "success","errorMsg": null,"errorCode": null,"data": { "presignedUrl": null,"previewUrl": "https://mimishuo.oss-cn-beijing.aliyuncs.com/82a42370240143d7afb5f049d52d849b.jpg?Expires=1544943830&OSSAccessKeyId=LTAI8OcdlGlLVNgz&Signature=KB1GTXIO7%2BIUqazwe8BAUe7z2Dk%3D","fileKey": "82a42370240143d7afb5f049d52d849b.jpg"}}
        if (data.errorCode === '200' || data.result === 'success') {
          resolve(data.data)
        } else {
          reject(data.errorMsg)
        }

      },
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
        reject(res)
      },
      complete: function () {

      }
    });
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
            code: '' // res.code  测试默认传''
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

async function uploadFile(options) {
  return await wxUploadFile(options)
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
  login: login,
  uploadFile: uploadFile
}
