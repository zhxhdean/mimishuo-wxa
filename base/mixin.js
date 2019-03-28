/**
 * 用于在小程序中实现简单mixin混合,以至复用
 * import mixin form './mixin';
 *
 * // mixins可以是plain object数组(多个混合), 也可以是plain object(一个混合)
 * const config = mixin(config[, mixins]);
 * Page(config);
 *
 * 混合循序 ...mixins -> config
 *
 * 3种merge方式
 *
 * 1. 生命周期钩子, 方法会被合并按混合顺序执行
 * 2. data或者globalData作为状态使用的, 浅复制覆盖
 * 3. 不以on开头的属性或者方法, 直接按顺序覆盖
 */

import {
  isLifeCycleEvent,
  isFunction,
  isPlainObject
} from './util'

/**
 * 混合(小程序App Page Component配置)
 * @param {object} config
 * @param {*} mixins
 */
function mixin (config, mixins) {
  let mixinList
  // 如果mixins不存在,直接返回config
  if (!mixins) {
    return config
  }

  // 如果mixins不是数组,则构造成数组
  if (!Array.isArray(mixins)) {
    mixinList = [mixins]
  } else {
    mixinList = mixins
  }

  // 如果mixins数组长度为0,直接返回config
  if (mixinList.length === 0) {
    return config
  }

  // 暂存结果对象
  const result = {}

  // 合并策略
  const resolvers = {
    /**
     * 生命周期钩子处理, 产生一个同名方法数组,最后由mergeLifeCycleArray方法合并成一个方法
     * @param {String} key
     * @param {Function} value
     */
    lifeCycle (key, value) {
      if (!isFunction(value)) {
        return
      }
      const current = result[key] || []
      current.push(value)
      result[key] = current
    },
    /**
     * State合并, 浅复制覆盖
     * @param {String} key
     * @param {*} value
     */
    data (key, value) {
      if (!value || !isPlainObject(value)) {
        return
      }
      const current = result[key] || {}
      Object.keys(value).forEach((dataKey) => {  //dataKey: 类似data里面的key
        current[dataKey] = value[dataKey]
      })
      result[key] = current
    },
    /**
     * 其他合并,直接覆盖
     * @param {String} key
     * @param {*} value
     */
    other (key, value) {
      if (!value) {
        return
      }
      result[key] = value
    }
  }

  /**
   * 将function数组合并成一个方法
   * @param {Array} lifeCycleArray
   */
  function mergeLifeCycleArray (lifeCycleArray) {
    if (!lifeCycleArray || !Array.isArray(lifeCycleArray)) {
      return () => { }
    }
    if (lifeCycleArray.length === 1) {
      return lifeCycleArray[0]
    }
    return function lifeCycleEvent (...args) {
      const self = this
      let resultValue
      // 返回值取最后一个方法的返回值
      lifeCycleArray.forEach((func) => {
        resultValue = func.apply(self, args)
      })
      return resultValue
    }
  }

  /**
   * 属性混合方法
   * @param {string} key 属性名
   * @param {*} value 属性值
   */
  function resolve (key, value) {
    if (key === 'data' || key === 'globalData' ||
      key === 'computed' || key === 'watch') {
      resolvers.data(key, value)
      return
    }
    if (isLifeCycleEvent(key)) {
      resolvers.lifeCycle(key, value)
      return
    }
    resolvers.other(key, value)
  }

  // 先混合mixins
  mixinList.forEach((slice) => {
    Object.keys(slice).forEach((key) => {
      resolve(key, slice[key]) // key 方法名    slice[key]   方法体
    })
  })
  // 然后混合config
  Object.keys(config).forEach((key) => {
    resolve(key, config[key])
  })
  // 合并LifeCycle 方法
  Object.keys(result).forEach((key) => {
    if (!isLifeCycleEvent(key)) {
      return
    }
    result[key] = mergeLifeCycleArray(result[key])
  })

  return result
}

export default mixin
