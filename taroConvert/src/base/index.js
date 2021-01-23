import mixin from './mixin.js'
import { bindComputed } from './computed.js'

import { bindWatch } from './watch.js'

const globalMixins = []

/**
 * 拆分config中的mixins,computed,watch属性
 * @param {Object} config
 */
function resolveConfig(config) {
  const mixins = config.mixins || []
  const computeds = config.computed
  const watchs = config.watch

  return {
    mixins,
    computeds,
    watchs
  }
}

function getObserverMixin(computeds, watchs) {
  return {
    onLoad() {
      // 先设置计算属性,一遍为之添加watch
      bindComputed(this, computeds)
      // 设置watch
      bindWatch(this, watchs)
    }
  }
}

export function CuPage(config = {}) {
  const mixins = config.mixins || []
  let finalConfig = mixin(
    config,
    // config.mixins
    [...globalMixins, ...mixins]
  )
  // 解析config,获取mixins, computeds, watchs
  const { computeds, watchs } = resolveConfig(finalConfig)
  // console.log(finalConfig, computeds, watchs)
  if (computeds || watchs) {
    // 加入附加computed,watch的mixin
    finalConfig = mixin(finalConfig, getObserverMixin(computeds, watchs))
  }
  // 初始化page
  Page(finalConfig)
}

CuPage.mixin = (mixinObject = {}) => {
  globalMixins.push(mixinObject)
}

export default {
  CuPage
}
