import { isPlainObject, isFunction, bindDataObserver } from './util.js'

/**
 * 附加上下文的Watch
 * @param {*} ctx 上下文
 * @param {*} watchs watch ,只能是plain object
 */
export function bindWatch(ctx, watchs) {
  // 如果已上下文不存在或者以绑定过watch ,返回
  if (!ctx || ctx.$cuWatchReady) {
    return
  }
  // 如果watch 不是 plain object,返回
  if (!watchs || !isPlainObject(watchs)) {
    return
  }
  // data
  const { data } = ctx

  // 需要生成的watch keys
  const keys = Object.keys(watchs)

  // 如果watch 没有成员,返回
  if (!keys.length) {
    return
  }
  // 获得当前上下文的观察列表
  const observers = ctx.$cuObservers || {}
  // 因为无法预测watch 和data成员的关系
  // 所以所有的data成员的变化都会重新计算所有的watch
  keys.forEach(key => {
    function callback(newValue, value) {
      const watchFunc = watchs[key]
      if (!isFunction(watchFunc)) {
        return
      }
      watchFunc.call(ctx, newValue, value)
    }
    if (observers[key]) {
      observers[key].push(callback)
      return
    }
    observers[key] = bindDataObserver(ctx, key, data[key], callback)
  })

  // 设置上下文的观察列表
  ctx.$cuObservers = observers
  // 设置上下文已设置过computed
  ctx.$cuWatchReady = true
}
