import { isWKOldApp, isWKNewApp } from '../utils'
import { H5URL } from '@/api/properties_wk.js'
import shareFloat from '@/components/share/src'
import jsBridge, {
    toLogin as toNewLogin,
    getStatusBarHeight,
    toTabBar,
    setRightItemAction as setWKRightItemAction,
    getAppUserInfo as getWKNewAppUserInfo,
    getAppVersion as getWKNewAppVersion,
    showLoadingWithStatus,
    hideLoading,
    pushWindow as newWKPushWindow,
    toast,
    setTitle as wkSetTitle,
    loadUrlInBrowser,
    popToRoot,
    setCache,
    getCache,
    setLeftBackItemAction
   } from './jsbridge'
/**
 * 获取用户信息
 *
 **/
export const runInApp = async (Vue, callback) => {
  if (isWKOldApp) {
  document.addEventListener('plusready', function () {
    if (window.plus) {
    let userInfo = {}
      let token = window.plus.storage.getItem('token') || ''
      let plusUser = window.plus.storage.getItem('plususer')
      let userModel = JSON.parse(plusUser)
      userInfo = {
        token: token,
        ...userModel
      }
      callback(userInfo)
    }
    })
} else if (isWKNewApp) {
    Promise.all([getWKNewAppUserInfo(), getStatusBarHeight()])
    .then(([userInfo, statusBarHeight, safePaddingdDta]) => {
      Vue.prototype.$safeAreaTop = Number(statusBarHeight.height)
      Vue.prototype.$appHeaderHeight = statusBarHeight.height
      // Vue.prototype.$safeAreaBottom = safePaddingdDta.bottom
      let appBaseInfo = {
        token: userInfo.token,
        versionCode: userInfo.deviceInfo.appVersionCode,
        versionName: userInfo.deviceInfo.appVersionName,
        ...userInfo.deviceInfo,
        ...userInfo.userInfo
      }
      // eslint-disable-next-line standard/no-callback-literal
      callback(appBaseInfo)
    })
  }
}

/**
 * 获取app版本号
 * @returns {Promise}
 */
export const getAppVersion = () => {
  if (isWKOldApp) {
    return new Promise((resolve, reject) => {
      try {
        let versionName = ''
        if (window.plus.os.name === 'Android') {
          let ConfigUtil = window.plus.android.newObject('com.wukonglicai.app.ConfigUtil')
          if (ConfigUtil) {
            versionName = window.plus.android.invoke(ConfigUtil, 'getVersionName')
            if (typeof versionName === 'string') {
              resolve({
                versionCode: +versionName.replace(/\./g, ''),
                versionName
              })
            }
          }
        } else {
          window.plus.runtime.getProperty(window.plus.runtime.appid, function (inf) {
            versionName = inf.version
            if (typeof versionName === 'string') {
              resolve({
                versionCode: +versionName.replace(/\./g, ''),
                versionName
              })
            }
          })
        }
      } catch (e) {
        reject(e)
      }
    })
  } else if (isWKNewApp) {
    return getWKNewAppVersion
  }
}
/**
 * 登录
 * @returns {Promise<any>}
 */
export const toLogin = (close = true) => {
  if (window.plus) { // 跳转到app 登录页
    window.plus.webview.getLaunchWebview().evalJS('openPage("","login.html")')
    if (close) {
      setTimeout(
        window.plus.webview.currentWebview().parent().close(),
        500
      )
    }
  } else if (isWKNewApp) {
    toNewLogin()
  } else { // 跳转到微信登录页登陆成功后回调回来
    let redirectUrl = encodeURIComponent(window.location.href)
    window.location.href = H5URL.login + redirectUrl
  }
}

/**
 * 实名认证
 * @returns {Promise<any>}
 */
export const realName = (isBackFire = true) => {
  return new Promise((resolve, reject) => {
    try {
    if (window.plus) { // 跳转到app 实名认证
      window.openWebview({
        url: '../certification/index.html',
        id: 'wk.certification',
        isBackFire
      }, {
        callbackOperation: 'authManage'
      })
      resolve()
    } else if (isWKNewApp) {
      newWKPushWindow('jfwklc://realName')
      resolve()
    } else { // 跳转到悟空微信实名命认证页面
      let directUrl = encodeURIComponent(window.location.href)
      window.location.href = H5URL.auth + directUrl
      resolve()
    }
  } catch (e) {
    reject(e)
  }
  })
}

/**
 * 设置title
 * @param {string} title
 */
export const setTitle = title => {
  document.title = title
  if (window.plus) {
    let currentWebview = window.plus.webview.currentWebview()
    let parentWebview = currentWebview.parent()
    if (window.fire) {
      window.fire(parentWebview, 'updateTitle', { title: title })
    } else if (parentWebview.id === 'browser.html') { // 如果是旧版 browser 打开的页面
      parentWebview.evalJS(`setTitle('${title}')`)
      //  如果是支付页面打开的页面
    } else if (parentWebview.id === 'pay.html') {
      currentWebview.setStyle({ top: 0 })
      const titleview = window.plus.webview.getWebviewById('title.html')
      titleview.evalJS(`setTitle('${title}')`)
    } else {
      let body = document.getElementsByTagName('body')[0]
      document.title = title
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.setAttribute('src', 'https://m.wukonglicai.com')
      var d = function () {
        window.setTimeout(function () {
          iframe.removeEventListener('load', d)
          document.body.removeChild(iframe)
        }, 0)
      }
      iframe.addEventListener('load', d)
      body.appendChild(iframe)
    }
  } else if (isWKNewApp) {
    wkSetTitle(title)
  }
}

/**
 * 打开新的窗口
 * @param {string} url
 * @example
 * pushWindow(app.misc.publicNotice)
 */
export const pushWebView = url => {
  if (isWKNewApp) {
    newWKPushWindow(url)
  } else {
    window.location.href = url
  }
}

/**
 * 钱包跳转到 app 首页
 */
export const toHome = () => {
    try {
      if (window.plus) { // 跳转到app 首页面
        window.plus.webview.getLaunchWebview().evalJS(`toIndex()`)
        if (close) {
          let wv = window.plus.webview.currentWebview()
          wv.parent() ? wv.parent().close() : wv.close()
        }
      } else if (isWKNewApp) {
        toTabBar('0')
      } else {
        window.location.href = H5URL.home
      }
    } catch (e) {
      console.log(e.message)
    }
}

/**
 * 跳转到投资页面
 * @param {String} investType=["M"|"Q"|"Y"|"SB"]
 * @param {String} subInvestType=["M"|"Q3"|"Q6"|"Q9"|"Y12"|"Y24"|"Y36"|"Y48"]
 */
export const toInvest = (investType = 'M', subInvestType = 'M') => {
    if (isWKNewApp) {
      toTabBar('1', investType, subInvestType)
    } else if (window.plus) {
      window.plus.webview.getLaunchWebview().evalJS(`toInvest("${investType}")`)
      window.plus.webview.currentWebview().parent().close()
    } else {
      window.location.href = `${H5URL.invest}?productType=${investType}&typeIndex=${subInvestType}`
    }
}

/**
 * 跳转到【悟空】我的页面
 */
export const toMine = () => {
    if (isWKNewApp) {
      toTabBar(3, '', '')
    } else if (window.plus) {
      window.plus.webview.getLaunchWebview().evalJS(`toUc()`)
      window.plus.webview.currentWebview().parent().close()
    } else {
      // 跳转到微信我的页面
    window.location.href = H5URL.userCenter
    }
}

/**
 * 【悟空】去空粉
 */
export const toMemberClub = () => {
  if (isWKNewApp) {
    toTabBar(2, '', '')
  } else if (window.plus) {
    window.openWebview({ url: '_www/views/wkvue/wk-fans/index.html', id: 'monkeyfan_index.html' })
  } else {
    // 跳转到微信我的用户中心页面
  window.location.href = H5URL.memberClub
  }
}

/**
 * 【悟空】去订单列表页
 */
export const toOrders = () => {
  if (isWKNewApp) {
    newWKPushWindow('jfwklc://myOrderList', {})
  } else if (window.plus) {
    var config = {
      id: 'wk.orderList',
      url: '_www/views/order-list/index.html'
    }
    var extras = {}
    window.openWebview(config, extras)
  } else {
    //  微信订单列表页面
    window.location.href = H5URL.orderList
  }
}

/**
 * 悟空跳转到卡券/百宝箱/优惠福利
 */
export const toCoupon = (token) => {
  if (isWKNewApp) {
  newWKPushWindow('jfwklc://native-h5/app-native/index.html#/coupons?type=coupon')
  } else if (window.plus) {
  let appurl = H5URL.appbaibao.replace('TOKEN', token)
  window.openBowserView({ url: appurl, title: '我的百宝箱' })
  } else {
  window.location.href = H5URL.baiBao
  }
}

/**
 * 精选标产品详情
 * @param code  code=Y12-190221144847577
 *
 */
export const toProductDetail = (code) => {
  if (isWKNewApp) {
      let obj = {
      url: 'jfwklc://productDetail',
      productPackageCode: code
    }
    jsBridge.invoke({
      method: 'pushWindow',
      params: obj
    })
  } else if (window.plus) {
      window.openWebview({
        url: '_www/views/wkvue/product-detail/index.html',
        id: 'wk.productDetail',
        statusBarStyle: 'light'
      }, {
        productCode: code
      })
  } else {
    // 微信产品详情页面
    window.location.href = `${H5URL.productDetail}?pCode=${code}`
  }
}
/**
 * 关闭当前webview页面
 * @param {String/Number} zIndex 关闭的层级
 */
export const closeWebView = (zIndex = 1) => {
  if (isWKNewApp) {
    jsBridge.invoke({
      method: 'popWindow',
      params: zIndex
    })
  } else if (window.plus) {
    let currentWebView = window.plus.webview.currentWebview()
    currentWebView.parent() ? currentWebView.parent().close() : currentWebView.close()
  }
}

/**
 * 关闭所有窗口
 */
export const closeToRoot = () => {
  if (isWKNewApp) {
    popToRoot()
  } else if (window.plus) {
    let currentWebView =
    window.plus.webview.currentWebview()
    currentWebView.parent() ? currentWebView.parent().close() : currentWebView.close()
  }
}

/**
 * android 返回按钮和原生头部返回按钮关闭所有
 * @param {*} callback
 */
export const closeAllWindow = (callback) => {
  if (isWKNewApp) {
    setLeftBackItemAction((info) => {
      // 点击左上角返回按钮触发
      closeToRoot()
    })
    document.addEventListener('backbutton', () => {
      // 当Android用户按下返回按钮时执行的方法
      closeToRoot()
    })
  } else if (window.plus) {
    closeToRoot()
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
 * 监听点击 android 实体返回事件
 * @param {function} callback 默认是关闭当前webview操作
 */
export const listenBackButton = (callback) => {
  if (!callback || typeof callback !== 'function') return
  if (isWKNewApp) {
    document.removeEventListener('backbutton', window.goback)
    window.goback = callback
    document.addEventListener('backbutton', window.goback)
  } else if (window.plus) {
    window.plus.key.removeEventListener('backbutton', window.goback)
    window.goback = callback
    window.plus.key.addEventListener('backbutton', window.goback)
  }
}

/**
 * 显示对话框 一个或两个按钮
 * @param {object|string} options
 * @param {string} [options.title] - 标题
 * @param {string} [options.message] - 消息
 * @param {array<object|string>} [options.buttons] - 按钮
 * @returns {Promise<any>}
 * { title = '', message = '', buttons = ['我知道了'] }
 * TODO:
 */
export const showConfirm = (options = {}) => {
  const defaults = {
    title: '',
    message: '',
    buttons: ['我知道了']
  }
  if (typeof options === 'string') {
    options = { message: options }
  }
  const opts = Object.assign({}, defaults, options)
  opts.actions = opts.buttons
  delete opts.buttons
  return new Promise(resolve => {
    // 原生的弹窗按钮序号从1开始
    if (isWKNewApp) {
      jsBridge.invoke({
        method: 'confirm',
        params: opts,
        success: (res) => { // res.action = 点击了第data.action个按钮
            resolve(res.action)
        }
      })
    }
  })
}
/**
 * 钱包设置Loading框显示隐藏
 * @param {boolean} show 是否显示
 * @param {string} message 提示文案
 */
export const setLoading = (show, message = '', delay = '8') => {
  if (isWKNewApp) {
    if (show) {
      showLoadingWithStatus({ message: '', delay })
    } else {
      hideLoading()
    }
  } else {
    if (show) {
      console.log('[WKAPP] Context.showLoadingWithStatus')
    } else {
      console.log('[WKAPP] hideLoading')
    }
  }
}
/**
 * 打开指定 vue-router path 页面
 * @param {string} path 页面路径 vue-router path
 * @param {string|object} query 查询字段
 */
export const pushWindowByRouter = (path, query = {}) => {
  let indexURl = window.location.href.split('#')[0]
  let queryStr = ''
  if (typeof query === 'object') {
    if (query.hasOwnProperty('hideNavBar') && query.hideNavBar) {
      query = Object.assign(query, { forbiddenBounce: true })
    }
    // 默认取消app隐藏loading
    if (!query.hasOwnProperty('autoCancelLoading')) {
      query.autoCancelLoading = false
    }

    const queryArr = []
    for (let key in query) {
      queryArr.push(`${key}=${query[key]}`)
    }

    if (queryArr.length) {
      queryStr = `?${queryArr.join('&')}`
    }
  } else if (typeof query === 'string') {
    queryStr = /^\?/.test(query) ? query : `?${query}`
  }

  pushWebView(`${indexURl}#/${path}${queryStr}`)
}

  /**
   * 在浏览器中打开页面
   * @param {string} path url
   */
  export const openUrlInBrowser = (url) => {
    if (isWKNewApp) {
      loadUrlInBrowser(url)
    } else {
      window.open(url)
    }
  }

  /**
   * 执行上级页面方法
   * @param {string} statement
   * TODO:
   */
  export const callbackExecute = statement => {

  }

/**
 * 显示提示
 * @param {string|object} options
 * @param {string} [options.message] - 消息
 * @param {string} [options.type] - 提示类型：success/fail/info
 */
export const showDelayTip = payload => {
  let type = 0
  if (typeof payload === 'string') {
  switch (payload.type) {
    case 'success':
      type = 1
      break
    case 'fail':
      type = 2
      break
    case 'info':
      type = 3
      break
    default:
      type = 0
      break
  }
}
  toast({
    type: type,
    message: payload.message
  })
}

/**
 * 设置状态栏颜色
 * @param {number|string|boolean} status 为false/0/black: 黑色状态栏 true/1/white: 白色状态栏
 */
export const setStatusBarStyle = (status = 0) => {
  let style = status === 0 ? 'dark' : 'light'
  if (isWKNewApp) {
    jsBridge.invoke({
      method: 'setStatusBarStyleDefaultOrLight',
      params: status
    })
  } else if (window.plus) {
    window.plus.navigator.setStatusBarStyle(style)
    // 兼容老安卓机型、延时设置title
    if (window.plus.os.name === 'Android') {
      setTimeout(() => {
        window.plus.navigator.setStatusBarStyle(style)
      }, 500)
    }
  }
}

  /**
   * H5保存信息
   * @param key
   * @param value
   * @returns {Promise<any>} 成功resolve(0) 失败rejectcode：10001：key为空字符串 10003-key类型错误
   */
  export const setH5Data = (key, value = '') => {
    if (!key) {
      return false
    }
    setCache(key, value)
  }

  /**
   * H5获取已存信息
   * @param key
   * @returns {Promise<any>} 取值成功resolve， 失败reject code：10001-key为空字符串 10002-没有对应的key 10003-key 类型错误
   */
  export const getH5Data = key => {
    if (!key) {
      return false
    }
    return getCache('key')
  }

/**
 * 分享方法
 *   【悟空】：目前只支持分享到微信好友和朋友圈
 * @param {Object} opt
 * @param {String} opt.wxtype  分享类  * 分享类别可选值
 * WXSceneSession 分享给好友
 * WXSceneTimeline 分享到朋友圈
 * @param {string} opt.shareType  'image' 分享图片
 * @param {String} opt.shareText 标题内容
 * @param {String} opt.shareContent  描述内容
 * @param {String} opt.shareUrl   页面链接
 * @param {String} opt.image   图标链接
 */
export const shareWKAPP = (opts) => {
  let plus = window.plus
  if (!plus) {
    return false
  }
  let shareArgs = [
    `'${opts.shareText}'`,
    `'${opts.shareContent}'`,
    `'${opts.shareUrl}'`,
    `'${opts.image}'`,
    `'${opts.wxtype}'`
  ]
  if (opts.type) {
    shareArgs.push(`'${opts.type}'`)
  }
  let shareArgsStr = shareArgs.join(',')
  let shareFnStr = `shareWx(${shareArgsStr})`
  plus.webview.getLaunchWebview().evalJS(shareFnStr)
}

/**
 * 【APP】分享方法
 * @param {Object} options
 * @param {String} options.type  // 分享形式类型， 1：链接 2：图片 3：链接或图片
 * @param {String} options.platform // 平台，1：仅微信和朋友圈
 * @param {String} options.shareText 标题内容
 * @param {String} options.shareContent  描述内容
 * @param {String} options.shareUrl   页面链接
 * @param {String} options.image  分享 图标链接
 * @param {String} options.bigImageUrl 分享形式类型， 1：链接 2：图片 3：链接或图片
 */
export const appShare = (options) => {
  return new Promise((resolve, reject) => {
    if (isWKNewApp) {
      jsBridge.invoke({
        method: 'share',
        params: options,
        success: resolve,
        error: reject
      })
    } else if (window.plus) {
      try {
        let shareType = options.type === '2' ? 'image' : ''
        const shareOptions = {
          shareText: options.shareText,
          shareContent: options.shareContent,
          image: options.image || options.bigImageUrl,
          shareUrl: options.shareUrl,
          type: shareType
        }
        shareFloat(shareOptions)
        resolve()
      } catch (e) {
        reject(e)
      }
    }
  })
}

/**
 * 分享图片
 */
export const shareImg = ({ imageUrl }) => {
  if (!imageUrl) {
    console.log('[IMGURl] is null')
    return false
  }
  let options = {
    shareText: '',
    shareContent: '',
    bigImageUrl: imageUrl,
    shareUrl: '',
    type: '2',
    platform: 1
  }
  return appShare(options)
}

/**
 * 右上角按钮设置
 * @param {*} data
 */
export const setRightBtn = (data) => {
  jsBridge.invoke({
    method: 'setRightItem',
    params: data.rightBtn
  })
  setWKRightItemAction(data.callbackName) // 悟空传递方法 体
}
