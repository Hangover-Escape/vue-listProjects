import Toast from '@/components/toast/'
import MessageBox from '@/components/message-box/'
import dayjs from 'dayjs'
// import { JSEncrypt } from 'jsencrypt'

/**
 * 获取Url参数中指定name的值
 * @param name 参数名称
 * @returns {string}
 */
export const getURLParam = name => {
  let re = new RegExp('(^|&)' + name + '=([^&#]*)(&|$)')
  let value = ''
  let arrHash = window.location.hash.split('?')
  let arrSearch = window.location.search.substr(1).split('?')
  arrHash.shift()
  let arr = arrSearch.concat(arrHash)

  for (let i = 0; i < arr.length; i++) {
    let r = arr[i].match(re)
    if (r !== null && r[2]) {
      value = r[2]
      break
    }
  }
  return value
}

/**
 * 返回包含当前URL参数的对象
 * @param {string} url
 * @returns {object}
 */
export const getURLParams = (url = window.location.href) =>
  url.match(/([^?=&]+)(=([^&#]*))/g).reduce((a, v) => {
    a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)
    return a
  }, {})

/**
 * 对象拷贝
 * @param {object} target 目标对象
 * @param {object} source 源对象
 * @param {boolean} isDeep
 */
export const clone = (target, source, isDeep = true) => {
  for (let name in source) {
    let copy = source[name]
    if (isDeep && copy instanceof Array) {
      target[name] = clone([], copy, isDeep)
    } else if (isDeep && copy instanceof Object) {
      target[name] = clone({}, copy, isDeep)
    } else {
      target[name] = source[name]
    }
  }
  return target
}

/**
 * rem 换算 px
 * @param rem 设计稿rem值
 * @returns {number} px值
 */
export const rem2px = rem => {
  const rootFontSize = parseFloat(window.document.documentElement.style.fontSize)
  return parseFloat(rem) * rootFontSize
}

/**
 * 保留两位小数、千分位格式化，格式：12,345.67
 * @param {string|number} amount
 * @returns {string}
 */
export const formatAmount = (amount) => {
  return (+amount).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

/**
 * 数组切片
 * @param {array} array
 * @param {number} size
 * @returns {Array}
 * @example
 * sliceArray(['a', 'b', 'c', 'd'], 2)
 * => [['a', 'b'], ['c', 'd']]
 */
export const sliceArray = (array, size = 1) => {
  let result = []
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    result[i] = array.slice(size * i, size * (i + 1))
  }
  return result
}

/**
  * 异步延迟
  * @param {number} time 延迟的时间,单位毫秒
  */
export const sleep = (time = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

/* eslint-disable */
export const getCookie = (name) => {
  let cookie = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
  if (cookie) {
    return cookie
  } else {
    let arr = ''
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2])
    }
  }
}

export const isIphone = () => {
  let ua = navigator.userAgent.toLocaleLowerCase()
  if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1 || ua.indexOf('macintosh') > -1) {
    return true
  } else {
    return false
  }
}


/**
 * 深复制
 * @param {boolean} deep
 * @param {object} target 目标对象
 * @param {object} options 附加参数
 */
export const extend = (deep, target, options) => {
  for (let name in options) {
    let copy = options[name]
    if (deep && copy instanceof Array) {
      target[name] = extend(deep, [], copy)
    } else if (deep && copy instanceof Object) {
      target[name] = extend(deep, {}, copy)
    } else {
      target[name] = options[name]
    }
  }
  return target
}


// 吐司
export const toast = (payload) => {
  if (typeof payload === 'string') {
    Toast({
      message: payload
    })
  } else if (typeof payload === 'object' && payload.hasOwnProperty('message')) {
    Toast(payload)
  }
}


// 弹窗
export const messageBox = (payload) => {
  return new Promise((resolve, reject) => {
    if (typeof payload === 'string') {
      MessageBox({
        message: payload,
        cancel: () => {
          reject(payload)
        },
        ok: () => {
          resolve(payload)
        }
      })
    } else if (typeof payload === 'object' && payload.hasOwnProperty('message')) {
      MessageBox(Object.assign({}, payload, {
        cancel: () => {
          reject(payload)
        },
        ok: () => {
          resolve(payload)
        },
        showCancelBtn: payload.showCancelBtn || false
      }))
    }
  })
}


/**
 * 根据rem高度计算实际高度
 * @param rem 设计稿rem高度值
 * @returns {number} 高度px值
 */
export const getPxHeight = (rem) => {
  let fontSize = document.documentElement.style.fontSize.split('p')[0]
  let wWidth = document.compatMode === 'BackCompat' ? document.body.clientWidth : document.documentElement.clientWidth
  return (wWidth * 2 / 750) * rem * fontSize
}

/**
 * 防抖
 * @param {*} fn 回调函数
 * @param {*} delay 延时时间
 */
export const _debounce = (fn, delay) => {
  delay = delay || 200
  let timer
  return function() {
    let th = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
        timer = null
        fn.apply(th, args)
    },   delay)
  }
}




/**
 * 图片预加载
 * @param {String} imageSrc  预加载图片链接
 */
export const loadImage = (imageSrc) => {
  let image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = function () {
      resolve()
    }
    image.onerror = function () {
      reject()
    }
    image.src = imageSrc
  })
}
// 密码加密
// export const encryptstr = (str) => {
//   // 使用公钥加密
//   let encrypt = new JSEncrypt()
//   // 设置公钥
//   let publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOAvi4p9BUpNeXgXyNLM1uSnK4uIvfREAM72lhb5MwHmfO6FD7SyId1auo3JtCEG8oUS6AKYmxcTGj+yrI728G0CAwEAAQ=='
//   encrypt.setPublicKey(publicKey)
//   // 加密
//   let encrypted = encrypt.encrypt(str)
//   return encrypted
// }

/**
 * 是否是数字
 * @param {any} n
 * @example
 * validateNumber('1') // =>false
 * validateNumber(1) // =>true
 * validateNumber(undefined) // =>false
 * validateNumber(null) //=>false
 * validateNumber('str') //=>false
 * validateNumber('0') // =>false
 * validateNumber(Number('0')) // =>true
 */
export const validateNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && Number(n) === n


/**
 * 格式化时间
 * @param {String} date 时间
 * @param {String} formatStr 格式
 */
export const formatTime = (date, formatStr = 'YYYY-MM-DD HH:mm') => {
  if (!date) return ''
  return dayjs(date).format(formatStr)
}

/**
 * 通过时间获取星期
 * @param {String} value 时间
 * @returns {String}
 */
export const day = (value) => {
  let day
  switch (dayjs(value).day()) {
    case 1:
      day = '一'
      break
    case 2:
      day = '二'
      break
    case 3:
      day = '三'
      break
    case 4:
      day = '四'
      break
    case 5:
      day = '五'
      break
    case 6:
      day = '六'
      break
    case 0:
      day = '日'
      break
  }
  return `星期${day}`
}

/**
 * rem 转为 px
 * @param {rem} rem的值
 */
export const remToPx = (rem) => {
  let fontSize = document.documentElement.style.fontSize.split('px')[0]
  return rem * fontSize
}

// 获取页面可视高度
export const getPageViewHeight = () => {
  let d = document
  let a = d.compatMode === 'BackCompat' ? d.body : d.documentElement
  return a.clientHeight
}
/**
 * 神策自定义埋点事件
 * @param {*} event_name
 * @param {*} properties
 * @example
 * sensorsTrack('ViewProduct', {
  *  ProductId: '123456',
 *   ProductCatalog: "Laptop Computer",
  * })
  */
 // 类型 标号
 // 任务名称
 // 类型 编号
 export const sensorsTrack = ( event_name, properties ) => {
  // 自定义埋点事件。
  sa && sa.track(event_name, properties)
}

