import equal from './equal.js'

/**
 * 判断是否生命周期方法名
 * @param {String} key
 */
export function isLifeCycleEvent(key) {
  const LIFE_CYCLE_EVENT = [
    'onLoad',
    'onReady',
    'onShow',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onLaunch',
    'onError',
    'onShareAppMessage'
  ] // onShareAppMessage 除外
  return LIFE_CYCLE_EVENT.indexOf(key) > -1
}
// /**
//  *
//  * @param {*} key
//  */
// export function isInternalProperty (key) {
//   const INTERNAL_PROPERTY = ['mixins', 'computed', 'watch'];
//   return INTERNAL_PROPERTY.indexOf(key) > -1;
// }
/**
 * 是否funciton
 * @param {*} functionToCheck
 */
export function isFunction(functionToCheck) {
  const getType = {}
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === '[object Function]'
  )
}
/**
 * 是否plain object
 * @param {*} value
 */
export function isPlainObject(value) {
  return Object.getPrototypeOf(value) === null || Object === value.constructor
}

export function bindDataObserver(ctx, propName, initValue, initCallback) {
  if (!ctx || !ctx.data) {
    return {
      push() {}
    }
  }
  const callbacks = [initCallback]
  // Array.isArray(initCallbacks) ? initCallbacks : [];
  const { data } = ctx
  let value = initValue
  Object.defineProperty(data, propName, {
    configurable: true,
    enumerable: true,
    get() {
      return value
    },
    set(newValue) {
      // console.log('>>', propName, Math.random())
      const old = value
      const newV = newValue
      // 使用equal来对新值与旧值作比较
      if (equal(value, newValue)) {
        return
      }
      // if (value === newValue) {
      //   return
      // }
      // // NaN !== NaN.....
      // if (Number.isNaN(newValue) && Number.isNaN(value)) {
      //   return
      // }
      setTimeout(() => {
        callbacks.forEach(callback => {
          if (!isFunction(callback)) {
            return
          }
          callback.call(ctx, newV, old)
        })
      }, 0)
      value = newValue
    }
  })

  return {
    push(callback) {
      if (!isFunction(callback)) {
        return
      }
      callbacks.push(callback)
    },
    key: propName
  }
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
export function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result
  if (wait == null) wait = 100

  function later() {
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }

  var debounced = function() {
    context = this
    args = arguments
    timestamp = Date.now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args)
      context = args = null

      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

export function debouncePromise(fn, wait = 0, options = {}) {
  let lastCallAt
  let deferred
  let timer
  let pendingArgs = []
  return function debounced(...args) {
    const currentWait = getWait(wait)
    const currentTime = new Date().getTime()

    const isCold = !lastCallAt || currentTime - lastCallAt > currentWait

    lastCallAt = currentTime

    if (isCold && options.leading) {
      return options.accumulate
        ? Promise.resolve(fn.call(this, [args])).then(result => result[0])
        : Promise.resolve(fn.call(this, ...args))
    }

    if (deferred) {
      clearTimeout(timer)
    } else {
      deferred = defer()
    }

    pendingArgs.push(args)
    timer = setTimeout(flush.bind(this), currentWait)

    if (options.accumulate) {
      const argsIndex = pendingArgs.length - 1
      return deferred.promise.then(results => results[argsIndex])
    }

    return deferred.promise
  }

  function flush() {
    const thisDeferred = deferred
    clearTimeout(timer)

    Promise.resolve(
      options.accumulate
        ? fn.call(this, pendingArgs)
        : fn.apply(this, pendingArgs[pendingArgs.length - 1])
    ).then(thisDeferred.resolve, thisDeferred.reject)

    pendingArgs = []
    deferred = null
  }
}

function getWait(wait) {
  return typeof wait === 'function' ? wait() : wait
}

function defer() {
  const deferred = {}
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}
