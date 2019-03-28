import { isPlainObject, isFunction, bindDataObserver } from './util'

/**
 * 计算所有的计算属性,并给上下文setData
 */
function mergeCallbacks (callbacks) {
  return function mergedFunc () {
    const result = {}
    Object.keys(callbacks).forEach((key) => {
      const {func, target} = callbacks[key]
      if (isFunction(func)) {
        result[target] = func.apply(this)
      }
    })
    this.setData(result)
  }
}
/**
 * 附加上下文的计算属性
 * @param {*} ctx 上下文
 * @param {*} computeds 计算属性,只能是plain object
 */
export function bindComputed (ctx, computeds) {
  // 如果已上下文不存在或者以绑定过计算属性,返回
  if (!ctx || ctx.$cuComputedReady) {
    return
  }
  // 如果计算属性不是 plain object,返回
  if (!computeds || !isPlainObject(computeds)) {
    return
  }

  // data
  const { data } = ctx

  // 需要监听的key,当前上下文data的所有成员
  const datakeys = Object.keys(data)
  // 需要生成的计算属性keys
  const keys = Object.keys(computeds)
  // 如果data没有成员,返回
  if (!datakeys.length) {
    return
  }
  // 如果计算属性没有成员,返回
  if (!keys.length) {
    return
  }

  const observerkeys = [...datakeys, ...keys]

  const callbacks = {}

  const reg = /this\.data\.([a-zA-Z1-9_]+)/g
  keys.forEach((key) => {
    if (!isFunction(computeds[key])) {
      return
    }
    if (datakeys.indexOf(key) > -1) {
      return
    }
    const funcStr = computeds[key].toString() /*"function userName() {return 'userName:' + this.data.name;}"*/
    let result = reg.exec(funcStr)    //  this.data.name    name
    while (result !== null) {
      const dependedKey = result[1]
      if (observerkeys.indexOf(dependedKey) === -1) {
        return
      }
      callbacks[dependedKey] = callbacks[dependedKey] || []
      callbacks[dependedKey].push({
        func: computeds[key],
        target: key
      })
      result = reg.exec(funcStr)
    }
  })
  console.log(callbacks)
  // 获得当前上下文的观察列表
  const observers = ctx.$cuObservers || {}
  Object.keys(callbacks).forEach((callbackKey) => {
    if (observerkeys.indexOf(callbackKey) === -1) {
      return
    }
    const callback = mergeCallbacks(callbacks[callbackKey])

    // 初始值计算
    callback.apply(ctx)

    if (observers[callbackKey]) {
      observers[callbackKey].push(callback)
      return
    }
    observers[callbackKey] = bindDataObserver(ctx, callbackKey, data[callbackKey], callback)
  })

  // 因为无法预测计算属性和data成员的关系
  // 所以所有的data成员的变化都会重新计算所有的计算属性
  // observerkeys.forEach((key) => {
  //   if (observers[key]) {
  //     observers[key].push(callback)
  //     return
  //   }
  //   observers[key] = bindDataObserver(ctx, key, data[key], callback)
  // })
  // 首次计算所有计算属性
  // callback()
  // 设置上下文的观察列表
  ctx.$cuObservers = observers
  // 设置上下文已设置过computed
  ctx.$cuComputedReady = true
}
