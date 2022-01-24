import { H5URL } from '@/api'
import { stringify } from 'qs'
export const {
  runInApp,
  getAppUserInfo,
  getAppVersion,
  toLogin,
  realName,
  setTitle,
  setHeaderRightBtn,
  pushWebView,
  toHome,
  toInvest,
  toMine,
  toMemberClub,
  toOrders,
  toCoupon,
  toProductDetail,
  closeWebView,
  closeAllWindow,
  showConfirm,
  setLoading,
  openUrlInBrowser,
  closeToRoot,
  callbackExecute,
  showDelayTip,
  setStatusBarStyle,
  setH5Data,
  getH5Data,
  appShare,
  shareImg,
  setRightBtn
} = require(`./${process.env.CHANNEL}/`)

export const {
  dpr,
  isIOS,
  isAndroid,
  isQBApp,
  isWKOldApp,
  isWKNewApp,
  isWKApp,
  isWeChat, // 是否是微信环境
  isApp, // 是否是app环境
  isQB, // 钱包渠道
  isWK,
  isIPhoneX,
  safeAreaTop,
  safeAreaBottom,
  appHeadHeight, // 标题栏高度
  appHeaderHeight// 标题栏加状态栏高度
} = require('./utils')

/**
 * 打开协议PDF 页面
 * @param {Object} options
 * @param {string} options.file
 * @param {string} options.titlename
 * @example pushAgreement({file:'https://static.9f.cn/pos/%E4%B8%AD%E5%9B%BD%E6%B0%91%E7%94%9F%E9%93%B6%E8%A1%8C%E4%B8%AA%E4%BA%BA%E2%80%9C%E9%9A%8F%E5%BF%83%E5%AD%98%E2%80%9D%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf,titlename:123'})
 */
export const pushAgreement = (options) => {
  let windowUrl = H5URL.pdfViewer
  pushWebView(`${windowUrl}?${stringify(options)}`)
}

/**
 * 唤起app并跳转到某些页面
 * @param {String} url 唤起app后打开的链接及参数
 */
export const launchApp = (url) => {
  let query = encodeURIComponent(url)
  window.location.href = `${H5URL.lunchAppUrl}?open=${query}`
}
  /**
   * 打开指定 vue-router path 页面
   * @param {string} path 页面路径 vue-router path
   * @param {string|object} query 查询字段
   * @param {object} router vue 路由实例
   * @example pushWindowByRouter('recharge',
                           {}, this.$router)

   */
/**
 * 传入路由名称跳转
 * @param name 路由名称
 * @param ext 扩展对象 ext.nativeBar=true 隐藏源生头部并取消反弹效果
 */
export const pushWindowByRouter = (name, ext, router) => {
  let url = window.location.href.replace(window.location.hash, '').replace(window.location.search, '')
  let parmsformat = '?'
  if (typeof ext === 'object') {
    if (ext.hasOwnProperty('nativeBar') && ext.nativeBar) {
      delete ext.nativeBar
      ext.hideNavBar = true
      ext.forbiddenBounce = true
      // parmsformat += 'hideNavBar=true&forbiddenBounce=true'
    }
    // for (let key in ext) {
    //   if (key !== 'nativeBar') {
    //     parmsformat += `&${key}=${ext[key]}`
    //   }
    // }
  }
  if (isQBApp || isWKNewApp) {
    pushWebView(`${url}#${name}${parmsformat}${stringify(ext)}`)
  } else {
    router.push(`${name}${parmsformat}${stringify(ext)}`)
  }
}

/**
 * 删除 adnroid 设备返回按钮事件
 * @param {*} callback
 */
export const removeDeviceBackListener = (callback) => {
  if (isApp && isAndroid) {
    window.$backButtonCallBack = callback
    document.removeEventListener('backbutton', window.$backButtonCallBack)
    if (window.plus) {
      window.plus.key.removeEventListener('backbutton', window.$backButtonCallBack)
    }
  }
}

/***
 * TODO:
 * 打开远端H5界面webview
 * @param config.url h5地址
 * @param config.title h5地址标题
 * @param config.statusBarStyle 系统statusBarStyle颜色
 * @param config.isBackFire 返回上一个webview是否触发的事件
 * @param config.backFireEvent 返回上一个webview触发的事件名称
 * @param parmas H5地址Url后拼接参数
 */
export const openBowserView = (config = {}, parmas = {}) => {
  if (window.plus) {
    window.openBowserView(config, parmas)
  } else {
    let qs = stringify(parmas)
    window.location.href = `${config.url}?${qs}`
  }
}

/**
 * 悟空返回逻辑
 */
export const backspace = () => {
  if (window.plus) {
    const wv = window.plus.webview.currentWebview()
    // 是否可以后退
    wv.canBack(function (e) {
      // 可以后退直接后退
      if (e.canBack) {
        wv.back()
      } else {
        // 不可以后退 直接关闭父页面
        closeWebView()
      }
    })
  }
}

/**
 * 绑定 android 点击设备返回按钮事件
 * @param {*} callback
 */
export const addDeviceBackListener = (callback) => {
  if (isApp && isAndroid) {
    window.$backButtonCallBack = callback
    // document.removeEventListener('backbutton', window.$backButtonCallBack)
    document.addEventListener('backbutton', window.$backButtonCallBack)
    // 旧版悟空App
    if (window.plus) {
      // window.plus.key.removeEventListener('backbutton', window.$backButtonCallBack)
      window.plus.key.addEventListener('backbutton', window.$backButtonCallBack)
    }
  }
}

export const replaceWindowByRouter = (name, router, ext) => {
  let parmsformat = '?'
  if (typeof ext === 'object') {
    if (ext.hasOwnProperty('nativeBar') && ext.nativeBar) {
      parmsformat += 'hideNavBar=true&forbiddenBounce=true'
    }
    for (let key in ext) {
      if (key !== 'nativeBar') {
        parmsformat += `&${key}=${ext[key]}`
      }
    }
  }
  router.replace(`${name}${parmsformat}`)
}
